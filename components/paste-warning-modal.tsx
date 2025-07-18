"use client";

import { Button } from "@/components/ui/button";
import { ClipboardX, X } from "lucide-react";

interface PasteWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  violationCount: number;
}

export default function PasteWarningModal({
  isOpen,
  onClose,
  violationCount,
}: PasteWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-[8px_8px_0px_0px_#333333] border-2 border-neobrutal-border max-w-md w-full mx-4 text-neobrutal-text">
        <div className="flex items-center justify-between p-6 border-b-2 border-neobrutal-border bg-rose-500">
          <div className="flex items-center space-x-3">
            <ClipboardX className="w-6 h-6 text-white" />
            <h2 className="text-lg font-semibold text-white">
              Pelanggaran Tes Terdeteksi
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-neobrutal-text mb-2">
              <strong>Peringatan:</strong> Tindakan tempel (paste) tidak
              diizinkan selama tes.
            </p>
            <p className="text-sm text-neobrutal-text/80">
              Jumlah pelanggaran:{" "}
              <span className="font-semibold text-rose-500">
                {violationCount}
              </span>
            </p>
          </div>

          {violationCount >= 3 && (
            <div className="bg-rose-100 border-2 border-rose-500 rounded-lg p-3 mb-4 shadow-[2px_2px_0px_0px_#333333]">
              <p className="text-sm text-rose-700 font-medium">
                ⚠️ Peringatan Terakhir: Satu pelanggaran lagi akan menghentikan
                tes Anda secara otomatis.
              </p>
            </div>
          )}

          <div className="text-sm text-neobrutal-text/80">
            <p className="mb-2">
              <strong>Pengingat:</strong>
            </p>
            <ul className="space-y-1 ml-4">
              <li>• Tulis kode Anda secara manual.</li>
              <li>
                • Jangan menyalin dan menempelkan kode dari sumber eksternal.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t-2 border-neobrutal-border bg-background">
          <Button
            onClick={onClose}
            className="bg-rose-500 hover:bg-rose-600 text-white"
          >
            Saya Mengerti - Lanjutkan Tes
          </Button>
        </div>
      </div>
    </div>
  );
}
