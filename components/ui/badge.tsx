import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-2 border-neobrutal-border bg-neobrutal-softBlue text-neobrutal-softBlueText shadow-[2px_2px_0px_0px_#333333]",
        secondary:
          "border-2 border-neobrutal-border bg-neobrutal-bg text-neobrutal-text shadow-[2px_2px_0px_0px_#333333]",
        destructive:
          "border-2 border-neobrutal-border bg-neobrutal-softRed text-neobrutal-softRedText shadow-[2px_2px_0px_0px_#333333]",
        outline: "border-2 border-neobrutal-border text-neobrutal-text shadow-[2px_2px_0px_0px_#333333]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
