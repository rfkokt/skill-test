"use client"

import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TabWarningModalProps {
  isOpen: boolean
  onClose: () => void
  violationCount: number
}

export default function TabWarningModal({ isOpen, onClose, violationCount }: TabWarningModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neobrutal-card rounded-lg shadow-[8px_8px_0px_0px_#333333] border-2 border-neobrutal-border max-w-md w-full mx-4 text-neobrutal-text">
        <div className="flex items-center justify-between p-6 border-b-2 border-neobrutal-border bg-neobrutal-softRed">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-neobrutal-softRedText" />
            <h2 className="text-lg font-semibold text-neobrutal-softRedText">Pelanggaran Tes Terdeteksi</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neobrutal-softRedText/80 hover:text-neobrutal-softRedText transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-neobrutal-text mb-2">
              <strong>Peringatan:</strong> Perpindahan tab atau minimisasi jendela tidak diizinkan selama tes.
            </p>
            <p className="text-sm text-neobrutal-text/80">
              Jumlah pelanggaran: <span className="font-semibold text-neobrutal-softRedText">{violationCount}</span>
            </p>
          </div>

          {violationCount >= 3 && (
            <div className="bg-neobrutal-softRed border-2 border-neobrutal-softRedText rounded-lg p-3 mb-4 shadow-[2px_2px_0px_0px_#333333]">
              <p className="text-sm text-neobrutal-softRedText font-medium">
                ⚠️ Peringatan Terakhir: Satu pelanggaran lagi akan menghentikan tes Anda secara otomatis.
              </p>
            </div>
          )}

          <div className="text-sm text-neobrutal-text/80">
            <p className="mb-2">
              <strong>Pengingat:</strong>
            </p>
            <ul className="space-y-1 ml-4">
              <li>• Jaga tab ini tetap aktif dan fokus</li>
              <li>• Jangan beralih ke aplikasi lain</li>
              <li>• Jangan meminimalkan jendela browser</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t-2 border-neobrutal-border bg-neobrutal-bg">
          <Button
            onClick={onClose}
            className="bg-neobrutal-softRed hover:bg-neobrutal-softRed/90 text-neobrutal-softRedText"
          >
            Saya Mengerti - Lanjutkan Tes
          </Button>
        </div>
      </div>
    </div>
  )
}
