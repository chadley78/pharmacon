import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-full border border-text-dark bg-transparent px-3 py-2 text-sm text-text-dark ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-dark/70 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input } 