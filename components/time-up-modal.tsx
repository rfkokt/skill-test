"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock } from "lucide-react";

interface TimeUpModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  problemTitle?: string;
}

export default function TimeUpModal({
  isOpen,
  onConfirm,
  problemTitle,
}: TimeUpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neobrutal-card rounded-lg shadow-[8px_8px_0px_0px_#333333] border-2 border-neobrutal-border max-w-md w-full mx-4 text-neobrutal-text">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-neobrutal-softRed rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-neobrutal-border shadow-[2px_2px_0px_0px_#333333]">
              <Clock className="w-8 h-8 text-neobrutal-softRedText" />
            </div>
            <h2 className="text-2xl font-bold text-neobrutal-text mb-2">
              Waktu Habis!
            </h2>
            <p className="text-neobrutal-text/90">
              Waktu untuk menyelesaikan soal telah berakhir.
            </p>
            {problemTitle && (
              <p className="text-sm text-neobrutal-text/70 mt-2">
                Soal: <span className="font-semibold">{problemTitle}</span>
              </p>
            )}
          </div>

          <div className="bg-neobrutal-softRed border-2 border-neobrutal-softRedText rounded-lg p-4 shadow-[2px_2px_0px_0px_#333333] mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-neobrutal-softRedText mt-0.5" />
              <div>
                <h3 className="font-semibold text-neobrutal-softRedText mb-2">
                  Tes Dihentikan
                </h3>
                <p className="text-sm text-neobrutal-softRedText">
                  Tes akan dianggap selesai dan Anda akan dikembalikan ke
                  halaman pemilihan soal.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={onConfirm}
              className="px-8 py-3 bg-neobrutal-softRed hover:bg-neobrutal-softRed/90 text-neobrutal-softRedText"
            >
              Kembali ke Daftar Soal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
