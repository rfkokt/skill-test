"use client"

import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExitConfirmationModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ExitConfirmationModal({ isOpen, onConfirm, onCancel }: ExitConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neobrutal-card rounded-lg shadow-[8px_8px_0px_0px_#333333] border-2 border-neobrutal-border max-w-md w-full mx-4 text-neobrutal-text">
        <div className="flex items-center justify-between p-6 border-b-2 border-neobrutal-border">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-neobrutal-softRedText" />
            <h2 className="text-lg font-semibold text-neobrutal-text">Konfirmasi Keluar Tes</h2>
          </div>
          <button onClick={onCancel} className="text-neobrutal-text/60 hover:text-neobrutal-text transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-neobrutal-text mb-4">
            Anda akan meninggalkan soal ini. Jika Anda belum menyelesaikan soal, ini akan dihitung sebagai upaya keluar
            dan dapat menyebabkan tes dianggap gagal.
          </p>
          <p className="text-sm text-neobrutal-text/80">Apakah Anda yakin ingin keluar?</p>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t-2 border-neobrutal-border bg-neobrutal-bg">
          <Button variant="outline" onClick={onCancel}>
            Tidak, Lanjutkan Tes
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Ya, Keluar & Gagal
          </Button>
        </div>
      </div>
    </div>
  )
}
