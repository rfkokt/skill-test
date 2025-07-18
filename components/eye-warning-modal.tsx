"use client";

import { Button } from "@/components/ui/button";
import { EyeOff, X } from "lucide-react";

interface EyeAwayWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  eyeAwayCount: number;
}

export default function EyeAwayWarningModal({
  isOpen,
  onClose,
  eyeAwayCount,
}: EyeAwayWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-[8px_8px_0px_0px_#333333] border-2 border-neobrutal-border max-w-md w-full mx-4 text-neobrutal-text">
        <div className="flex items-center justify-between p-6 border-b-2 border-neobrutal-border bg-yellow-400">
          <div className="flex items-center space-x-3">
            <EyeOff className="w-6 h-6 text-black" />
            <h2 className="text-lg font-semibold text-black">
              Perhatian: Fokus Teralihkan
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-black/80 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-neobrutal-text mb-2">
              <strong>Peringatan:</strong> Sistem mendeteksi bahwa Anda tidak
              sedang melihat ke arah layar.
            </p>
          </div>

          {eyeAwayCount >= 5 && (
            <div className="bg-rose-100 border-2 border-rose-500 rounded-lg p-3 mb-4 shadow-[2px_2px_0px_0px_#333333]">
              <p className="text-sm text-rose-700 font-medium">
                ⚠️ Anda telah beberapa kali tidak melihat ke layar. Satu
                pelanggaran lagi dapat menyebabkan tes dihentikan secara
                otomatis.
              </p>
            </div>
          )}

          <div className="text-sm text-neobrutal-text/80">
            <p className="mb-2">
              <strong>Pengingat:</strong>
            </p>
            <ul className="space-y-1 ml-4">
              <li>
                • Pastikan Anda tetap fokus pada layar selama tes berlangsung.
              </li>
              <li>• Hindari melihat ke arah lain atau meninggalkan kamera.</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t-2 border-neobrutal-border bg-background">
          <Button
            onClick={onClose}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            Saya Mengerti - Lanjutkan Tes
          </Button>
        </div>
      </div>
    </div>
  );
}
