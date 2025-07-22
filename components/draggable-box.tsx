"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface DraggableBoxProps {
  children: ReactNode;
  storageKey?: string;
  initialX?: number;
  initialY?: number;
}

export default function DraggableBox({
  children,
  storageKey = "webcamPosition",
  initialX = 16,
  initialY = 16,
}: DraggableBoxProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const size = useRef({ width: 128, height: 96 }); // default size

  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(val, max));

  const applyClampedPosition = (x: number, y: number) => {
    const clampedX = clamp(x, 0, window.innerWidth - size.current.width);
    const clampedY = clamp(y, 0, window.innerHeight - size.current.height);
    setPosition({ x: clampedX, y: clampedY });
    localStorage.setItem(
      storageKey,
      JSON.stringify({ x: clampedX, y: clampedY })
    );
  };

  // Load position from localStorage and clamp on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    const box = boxRef.current?.getBoundingClientRect();
    if (box) {
      size.current = { width: box.width, height: box.height };
    }

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          applyClampedPosition(parsed.x, parsed.y);
        }
      } catch (err) {
        console.warn("Failed to parse saved position", err);
      }
    }
  }, [storageKey]);

  // Auto adjust on resize
  useEffect(() => {
    const handleResize = () => {
      applyClampedPosition(position.x, position.y);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [position.x, position.y]);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    dragging.current = true;

    const rect = boxRef.current?.getBoundingClientRect();
    if (rect) {
      offset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      size.current = {
        width: rect.width,
        height: rect.height,
      };
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;

    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;

    applyClampedPosition(newX, newY);
  };

  const onMouseUp = () => {
    dragging.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      onMouseDown={onMouseDown}
      className="fixed z-50 cursor-move"
      style={{ left: position.x, top: position.y }}
    >
      {children}
    </div>
  );
}
