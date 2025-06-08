"use client"

import type React from "react"

import { useState, useEffect } from "react"
import SplashScreen from "./SplashScreen"

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [showSplash, setShowSplash] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    if (typeof window !== "undefined") {
      const hasSeenSplash = sessionStorage.getItem("hasSeenSplash")
      if (hasSeenSplash) {
        setShowSplash(false)
      }
    }
  }, [])

  const handleSplashComplete = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("hasSeenSplash", "true")
    }
    setShowSplash(false)
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <div className={showSplash ? "hidden" : "block"}>{children}</div>
    </>
  )
}
