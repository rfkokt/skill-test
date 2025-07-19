"use client";

import { Button } from "@/components/ui/button";
import { useAlertStore } from "@/store/alertStore";
import { X } from "lucide-react";

export default function GlobalAlert() {
  const { isOpen, data, closeAlert } = useAlertStore();

  if (!isOpen || !data) return null;

  const variantStyles = {
    default: "bg-blue-500",
    warning: "bg-yellow-500",
    error: "bg-rose-500",
    success: "bg-green-500",
  };

  const variant = data.variant || "default";
  const Icon = data.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-[8px_8px_0px_0px_#333333] border-2 border-neobrutal-border max-w-md w-full mx-4 text-neobrutal-text">
        <div
          className={`flex items-center justify-between p-6 border-b-2 border-neobrutal-border ${variantStyles[variant]}`}
        >
          <div className="flex items-center space-x-3">
            {Icon && <Icon className="w-6 h-6 text-white" />}
            <h2 className="text-lg font-semibold text-white">{data.title}</h2>
          </div>
          <button
            onClick={closeAlert}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-neobrutal-text">{data.description}</p>
        </div>

        <div className="flex justify-end p-6 border-t-2 border-neobrutal-border bg-background">
          <Button
            onClick={closeAlert}
            className={`${variantStyles[variant]} hover:opacity-90 text-white`}
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
