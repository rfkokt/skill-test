"use client"

import { Button } from "@/components/ui/button"
import { Clock, Play, X } from "lucide-react"

interface ResumeTestModalProps {
  isOpen: boolean
  problemTitle: string
  timeLeft: number
  onConfirmResume: () => void
  onCancelResume: () => void
}

export default function ResumeTestModal({
  isOpen,
  problemTitle,
  timeLeft,
  onConfirmResume,
  onCancelResume,
}: ResumeTestModalProps) {
  if (!isOpen) return null

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neobrutal-card rounded-lg shadow-[8px_8px_0px_0px_#333333] border-2 border-neobrutal-border max-w-md w-full mx-4 text-neobrutal-text">
        <div className="p-6">
          <div className="absolute top-4 right-4">
            <button
              onClick={onCancelResume}
              className="text-neobrutal-text/60 hover:text-neobrutal-text transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-neobrutal-softBlue rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-neobrutal-border shadow-[2px_2px_0px_0px_#333333]">
              <Play className="w-8 h-8 text-neobrutal-softBlueText" />
            </div>
            <h2 className="text-2xl font-bold text-neobrutal-text mb-2">Lanjutkan Tes?</h2>
            <p className="text-neobrutal-text/90">
              Anda memiliki tes yang belum selesai untuk soal: <span className="font-semibold">{problemTitle}</span>
            </p>
          </div>

          <div className="bg-neobrutal-bg rounded-lg p-4 border-2 border-neobrutal-border shadow-[2px_2px_0px_0px_#333333] mb-6">
            <div className="flex items-center justify-center space-x-2 text-neobrutal-text">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Waktu Tersisa: {formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={onCancelResume} className="px-8 py-3 bg-transparent">
              Mulai Baru
            </Button>
            <Button
              onClick={onConfirmResume}
              className="px-8 py-3 bg-neobrutal-softGreen hover:bg-neobrutal-softGreen/90 text-neobrutal-softGreenText"
            >
              Lanjutkan Tes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
