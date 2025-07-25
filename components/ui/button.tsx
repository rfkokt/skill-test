import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-neobrutal-softBlue text-neobrutal-softBlueText hover:bg-neobrutal-softBlue/90 border-2 border-neobrutal-border shadow-[4px_4px_0px_0px_#333333] active:shadow-[2px_2px_0px_0px_#333333] active:translate-x-[2px] active:translate-y-[2px]",
        destructive:
          "bg-neobrutal-softRed text-neobrutal-softRedText hover:bg-neobrutal-softRed/90 border-2 border-neobrutal-border shadow-[4px_4px_0px_0px_#333333] active:shadow-[2px_2px_0px_0px_#333333] active:translate-x-[2px] active:translate-y-[2px]",
        outline:
          "border-2 border-neobrutal-border bg-neobrutal-card hover:bg-neobrutal-bg shadow-[4px_4px_0px_0px_#333333] active:shadow-[2px_2px_0px_0px_#333333] active:translate-x-[2px] active:translate-y-[2px]",
        secondary:
          "bg-neobrutal-bg text-neobrutal-text hover:bg-neobrutal-bg/80 border-2 border-neobrutal-border shadow-[4px_4px_0px_0px_#333333] active:shadow-[2px_2px_0px_0px_#333333] active:translate-x-[2px] active:translate-y-[2px]",
        ghost: "hover:bg-neobrutal-bg hover:text-neobrutal-text",
        link: "text-neobrutal-softBlueText underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
