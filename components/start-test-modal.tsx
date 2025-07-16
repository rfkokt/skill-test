"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, Eye, Shield, X } from "lucide-react" // Import X icon

interface StartTestModalProps {
  isOpen: boolean
  onStartTest: () => void
  onClose: () => void // Add onClose prop
  problemTitle: string
  estimatedTime: string
  requiresWebcam: boolean // Added webcam flag
}

export default function StartTestModal({
  isOpen,
  onStartTest,
  onClose,
  problemTitle,
  estimatedTime,
  requiresWebcam, // Destructure webcam flag
}: StartTestModalProps) {
  const [agreed, setAgreed] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neobrutal-card rounded-lg shadow-[8px_8px_0px_0px_#333333] border-2 border-neobrutal-border max-w-2xl w-full mx-4 text-neobrutal-text">
        <div className="p-8">
          <div className="absolute top-4 right-4">
            <button onClick={onClose} className="text-neobrutal-text/60 hover:text-neobrutal-text transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-neobrutal-softBlue rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-neobrutal-border shadow-[2px_2px_0px_0px_#333333]">
              <Shield className="w-8 h-8 text-neobrutal-softBlueText" />
            </div>
            <h2 className="text-2xl font-bold text-neobrutal-text mb-2">Start Coding Test</h2>
            <p className="text-neobrutal-text/90">
              Problem: <span className="font-semibold">{problemTitle}</span>
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-neobrutal-softYellow border-2 border-neobrutal-softYellowText rounded-lg p-4 shadow-[2px_2px_0px_0px_#333333]">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-neobrutal-softYellowText mt-0.5" />
                <div>
                  <h3 className="font-semibold text-neobrutal-softYellowText mb-2">Important Test Rules</h3>
                  <ul className="text-sm text-neobrutal-softYellowText space-y-1">
                    <li>• Jangan me-refresh atau menutup browser selama tes.</li>
                    <li>• Jangan beralih tab atau meminimalkan jendela.</li>
                    <li>• Setiap pelanggaran akan dicatat dan dapat mengakibatkan penghentian tes.</li>
                    <li>• Anda memiliki {estimatedTime} untuk menyelesaikan soal.</li>
                    <li>• Jika Anda tidak aktif di tab ini selama 30 detik, tes akan otomatis gagal.</li>{" "}
                    {/* Added inactivity rule */}
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-neobrutal-bg rounded-lg border-2 border-neobrutal-border shadow-[2px_2px_0px_0px_#333333]">
                <Clock className="w-8 h-8 text-neobrutal-text/80 mx-auto mb-2" />
                <h4 className="font-semibold text-neobrutal-text">Time Limit</h4>
                <p className="text-sm text-neobrutal-text/70">{estimatedTime}</p>
              </div>
              {requiresWebcam && ( // Conditionally render Monitoring section
                <div className="text-center p-4 bg-neobrutal-bg rounded-lg border-2 border-neobrutal-border shadow-[2px_2px_0px_0px_#333333]">
                  <Eye className="w-8 h-8 text-neobrutal-text/80 mx-auto mb-2" />
                  <h4 className="font-semibold text-neobrutal-text">Monitoring</h4>
                  <p className="text-sm text-neobrutal-text/70">Webcam monitoring active</p>
                </div>
              )}
              <div className="text-center p-4 bg-neobrutal-bg rounded-lg border-2 border-neobrutal-border shadow-[2px_2px_0px_0px_#333333]">
                <Shield className="w-8 h-8 text-neobrutal-text/80 mx-auto mb-2" />
                <h4 className="font-semibold text-neobrutal-text">Security</h4>
                <p className="text-sm text-neobrutal-text/70">Secure environment</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-start space-x-3">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1" />
              <span className="text-sm text-neobrutal-text/90">
                I understand and agree to follow all test rules. I acknowledge that any violation may result in test
                termination.
              </span>
            </label>
          </div>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={onClose} className="px-8 py-3 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={onStartTest}
              disabled={!agreed}
              className="px-8 py-3 bg-neobrutal-softGreen hover:bg-neobrutal-softGreen/90 text-neobrutal-softGreenText"
            >
              Start Test Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
