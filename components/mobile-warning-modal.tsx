"use client"

import { Laptop, Smartphone } from "lucide-react"

export default function MobileWarningModal() {
  return (
    <div className="fixed inset-0 bg-neobrutal-bg flex flex-col items-center justify-center z-[9999] p-4 text-neobrutal-text">
      <div className="bg-neobrutal-card rounded-lg shadow-[8px_8px_0px_0px_#333333] border-2 border-neobrutal-border max-w-md w-full mx-4 p-8 text-center">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Laptop className="w-16 h-16 text-neobrutal-softBlue" />
          <Smartphone className="w-12 h-12 text-neobrutal-text/50" />
        </div>
        <h2 className="text-2xl font-bold text-neobrutal-text mb-4">Please Use a Larger Screen</h2>
        <p className="text-neobrutal-text/90 mb-6">
          This coding test platform is optimized for larger screens like laptops or desktops. Please switch to a device
          with a wider display to continue.
        </p>
        <p className="text-sm text-neobrutal-text/70">Thank you for your understanding.</p>
      </div>
    </div>
  )
}
