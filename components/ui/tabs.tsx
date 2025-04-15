"use client"

import React, { useState } from "react"

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
  children: React.ReactNode
}

export function Tabs({ value, onValueChange, className = "", children }: TabsProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null
        // Cast child to any to bypass TypeScript error
        return React.cloneElement(child as any, { value, onValueChange })
      })}
    </div>
  )
}

interface TabsListProps {
  className?: string
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
}

export function TabsList({ className = "", children }: TabsListProps) {
  return <div className={`flex space-x-2 ${className}`}>{children}</div>
}

interface TabsTriggerProps {
  value: string
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export function TabsTrigger({ value, className = "", children, onClick }: TabsTriggerProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      data-value={value}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  className?: string
  children: React.ReactNode
  valueProp?: string
}

export function TabsContent({ value, className = "", children, valueProp }: TabsContentProps) {
  if (value !== valueProp) return null
  return <div className={className}>{children}</div>
}
