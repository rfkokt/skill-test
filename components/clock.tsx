import type React from "react"
import { LucideClock } from "lucide-react"

export default function Clock(props: React.ComponentProps<typeof LucideClock>) {
  return <LucideClock {...props} />
}
