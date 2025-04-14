import type React from "react"
import { Check } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Define variants for the verification badge
const badgeVariants = cva("inline-flex items-center justify-center rounded-full", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    },
    variant: {
      blue: "bg-blue-500 hover:bg-blue-600",
      green: "bg-green-500 hover:bg-green-600",
      purple: "bg-purple-500 hover:bg-purple-600",
      red: "bg-red-500 hover:bg-red-600",
      yellow: "bg-yellow-500 hover:bg-yellow-600",
      teal: "bg-teal-500 hover:bg-teal-600",
      pink: "bg-pink-500 hover:bg-pink-600",
      orange: "bg-orange-500 hover:bg-orange-600",
      gray: "bg-gray-500 hover:bg-gray-600",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "blue",
  },
})

export interface VerificationBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  tooltip?: string
}

export function VerificationBadge({
  className,
  variant,
  size,
  tooltip = "Verified",
  ...props
}: VerificationBadgeProps) {
  return (
    <span className={cn("relative group", className)} title={tooltip} {...props}>
      <span className={cn(badgeVariants({ variant, size }))}>
        <Check className="text-white" size={size === "lg" ? 14 : size === "md" ? 12 : 10} />
      </span>

      {/* Tooltip */}
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs font-medium text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
        {tooltip}
      </span>
    </span>
  )
}
