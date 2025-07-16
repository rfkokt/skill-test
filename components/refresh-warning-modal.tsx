"use client"

import { useEffect } from "react"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RefreshWarningModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function RefreshWarningModal({ isOpen, onClose, onConfirm }: RefreshWarningModalProps) {
  // Prevent browser dialog when our modal is open
  useEffect(() => {
    if (isOpen) {
      const preventBrowserDialog = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        e.returnValue = ""
        return ""
      }

      window.addEventListener("beforeunload", preventBrowserDialog)

      return () => {
        window.removeEventListener("beforeunload", preventBrowserDialog)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neobrutal-card rounded-lg shadow-[8px_8px_0px_0px_#333333] border-2 border-neobrutal-border max-w-md w-full mx-4 text-neobrutal-text">
        <div className="flex items-center justify-between p-6 border-b-2 border-neobrutal-border">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-neobrutal-softYellowText" />
            <h2 className="text-lg font-semibold text-neobrutal-text">Peringatan</h2>
          </div>
          <button onClick={onClose} className="text-neobrutal-text/60 hover:text-neobrutal-text transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-neobrutal-text mb-4">
            Apakah Anda yakin ingin meninggalkan halaman ini? Progres dan kode Anda akan hilang.
          </p>
          <p className="text-sm text-neobrutal-text/80">
            Pastikan untuk menyimpan pekerjaan Anda sebelum meninggalkan lingkungan tes.
          </p>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t-2 border-neobrutal-border bg-neobrutal-bg">
          <Button variant="outline" onClick={onClose}>
            Tetap di Halaman
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Tinggalkan Halaman
          </Button>
        </div>
      </div>
    </div>
  )
}
