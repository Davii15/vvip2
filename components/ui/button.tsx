"use client"

import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  className?: string
  children: React.ReactNode
}

export function Button({ variant = "default", className = "", children, ...props }: ButtonProps) {
  const baseClass = "inline-flex items-center rounded px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variantClass = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "bg-transparent text-blue-600 hover:bg-blue-100",
  }[variant]

  return (
    <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  )
}
