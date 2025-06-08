"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SplashScreen from "./SplashScreen"

interface SplashWrapperProps {
  children: React.ReactNode
}

export default function SplashWrapper({ children }: SplashWrapperProps): JSX.Element {
  const [showSplash, setShowSplash] = useState<boolean>(true)
  const [isClient, setIsClient] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    setIsClient(true)

    // Check if user has seen splash in this session
    if (typeof window !== "undefined") {
      const hasSeenSplash = sessionStorage.getItem("oneShopSplashSeen")
      const splashTimestamp = sessionStorage.getItem("oneShopSplashTimestamp")

      // Check if splash was seen in the last 24 hours
      if (hasSeenSplash === "true" && splashTimestamp) {
        const lastSeen = Number.parseInt(splashTimestamp, 10)
        const now = Date.now()
        const twentyFourHours = 24 * 60 * 60 * 1000

        if (now - lastSeen < twentyFourHours) {
          console.log("User has seen splash recently, skipping...")
          setShowSplash(false)
        } else {
          console.log("Splash expired, showing again...")
          sessionStorage.removeItem("oneShopSplashSeen")
          sessionStorage.removeItem("oneShopSplashTimestamp")
        }
      } else {
        console.log("First visit or expired session, showing splash screen...")
      }
    }

    setIsLoading(false)
  }, [])

  const handleSplashComplete = (): void => {
    console.log("Splash screen completed! Transitioning to OneShopDiscount main application...")

    if (typeof window !== "undefined") {
      sessionStorage.setItem("oneShopSplashSeen", "true")
      sessionStorage.setItem("oneShopSplashTimestamp", Date.now().toString())

      // Track splash completion for analytics
      if (typeof (window as any).gtag !== "undefined") {
        ;(window as any).gtag("event", "splash_completed", {
          event_category: "engagement",
          event_label: "african_splash_screen",
          value: 1,
        })
      }
    }

    // Smooth transition delay
    setTimeout(() => {
      setShowSplash(false)
    }, 500)
  }

  // Show loading state during SSR with African theme
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-yellow-600 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl font-bold animate-pulse mb-4">Loading OneShopDiscount...</div>
          <div className="text-white/80 text-sm italic">Where experience meets convenience</div>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <SplashScreen onComplete={handleSplashComplete} />
        </motion.div>
      ) : (
        <motion.div
          key="main-content"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
