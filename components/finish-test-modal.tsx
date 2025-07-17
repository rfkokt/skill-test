"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatTime as defaultFormatTime } from "@/lib/utils" // Import default formatTime

interface FinishTestModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  problemTitle: string
  timeLeft: number
  formatTime?: (seconds: number) => string // Make optional
}

export default function FinishTestModal({
  isOpen,
  onConfirm,
  onCancel,
  problemTitle,
  timeLeft,
  formatTime = defaultFormatTime, // Use default if not provided
}: FinishTestModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={isOpen ? onCancel : undefined}>
      <AlertDialogContent className="bg-neobrutal-card border-2 border-neobrutal-border shadow-[4px_4px_0px_0px_#333333]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-neobrutal-text">Finish Test: {problemTitle}</AlertDialogTitle>
          <AlertDialogDescription className="text-neobrutal-text/80">
            Are you sure you want to finish the test? You have{" "}
            <span className="font-bold text-neobrutal-softBlueText">{formatTime(timeLeft)}</span> remaining. Once
            finished, you cannot resume.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-neobrutal-gray hover:bg-neobrutal-gray/90 text-neobrutal-text border-2 border-neobrutal-border shadow-[2px_2px_0px_0px_#333333] active:shadow-[1px_1px_0px_0px_#333333] active:translate-x-[1px] active:translate-y-[1px]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-neobrutal-softRed hover:bg-neobrutal-softRed/90 text-neobrutal-softRedText shadow-[2px_2px_0px_0px_#333333] active:shadow-[1px_1px_0px_0px_#333333] active:translate-x-[1px] active:translate-y-[1px]"
            onClick={onConfirm}
          >
            Finish Test
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
