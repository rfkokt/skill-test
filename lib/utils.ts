import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// lib/utils.ts

export const convertTimeToSeconds = (timeString: string): number => {
  const match = timeString.match(/(\d+)\s*min/);
  if (match && match[1]) {
    return Number.parseInt(match[1], 10) * 60;
  }
  return 3600; // Default to 60 minutes if parsing fails
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractComponentName = (code: string): string | null => {
  const fnDeclMatch = code.match(/function\s+([A-Z]\w*)\s*\(/); // function ComponentName(...)
  if (fnDeclMatch) return fnDeclMatch[1];

  const constFnMatch = code.match(/const\s+([A-Z]\w*)\s*=\s*\(/); // const ComponentName = (props) =>
  if (constFnMatch) return constFnMatch[1];

  return null;
};
