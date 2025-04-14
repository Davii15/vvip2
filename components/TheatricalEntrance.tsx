"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

export default function TheatricalEntrance({ onComplete }: { onComplete?: () => void }) {
  const [animationComplete, setAnimationComplete] = useState(false)
  const [skipAnimation, setSkipAnimation] = useState(false)

  useEffect(() => {
    // Store in localStorage if user has seen the animation
    const hasSeenAnimation = localStorage.getItem("hasSeenTheatricalEntrance")

    if (hasSeenAnimation) {
      // Skip animation if user has seen it before
      setSkipAnimation(true)
      if (onComplete) onComplete()
    } else {
      // Set a timeout to automatically complete the animation after 6 seconds
      const timer = setTimeout(() => {
        completeAnimation()
      }, 6000)

      return () => clearTimeout(timer)
    }
  }, [onComplete])

  const completeAnimation = () => {
    setAnimationComplete(true)
    localStorage.setItem("hasSeenTheatricalEntrance", "true")
    if (onComplete) onComplete()
  }

  if (skipAnimation) return null

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${animationComplete ? "pointer-events-none" : ""}`}>
      {/* Skip button */}
      <button
        onClick={completeAnimation}
        className="absolute top-4 right-4 z-[60] bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
        aria-label="Skip animation"
      >
        <X size={20} />
      </button>

      {/* Chandelier */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 pointer-events-none z-[55]"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        style={{ filter: "drop-shadow(0 0 15px gold)" }}
      >
        <div className="w-full h-full relative">
          {/* Chandelier base */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-20 bg-gradient-to-b from-amber-300 to-amber-500"></div>

          {/* Chandelier body */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full border-4 border-amber-400"></div>

          {/* Chandelier lights */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full bg-yellow-300"
              style={{
                top: 40 + Math.sin(i * (Math.PI / 6)) * 60,
                left: 32 + Math.cos(i * (Math.PI / 6)) * 60,
                boxShadow: "0 0 10px 5px rgba(255, 215, 0, 0.7)",
              }}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Left curtain */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 bg-red-800 z-[51]"
        initial={{ x: 0 }}
        animate={{ x: animationComplete ? "-100%" : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 2 }}
      >
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-700 to-red-900">
          <div className="h-full w-full flex flex-col justify-center">
            <div className="w-full h-1/2 border-b-4 border-amber-500 flex flex-col justify-end">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-[10%] border-t border-red-600"
                  style={{
                    boxShadow: "inset 0 10px 20px rgba(0,0,0,0.2)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right curtain */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 bg-red-800 z-[51]"
        initial={{ x: 0 }}
        animate={{ x: animationComplete ? "100%" : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 2 }}
      >
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-700 to-red-900">
          <div className="h-full w-full flex flex-col justify-center">
            <div className="w-full h-1/2 border-b-4 border-amber-500 flex flex-col justify-end">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-[10%] border-t border-red-600"
                  style={{
                    boxShadow: "inset 0 10px 20px rgba(0,0,0,0.2)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Spotlight effects */}
      <motion.div
        className="absolute inset-0 z-[52] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: animationComplete ? 0 : 1 }}
        transition={{ duration: 1 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-40 h-[500px] bg-gradient-to-b from-yellow-100/30 to-transparent"
            style={{
              left: `${25 + i * 25}%`,
              top: -100,
              transform: "translateX(-50%) rotate(15deg)",
              transformOrigin: "top center",
            }}
            animate={{
              rotate: [15, 5, 15],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.7,
            }}
          />
        ))}
      </motion.div>

      {/* Fade out overlay */}
      <motion.div
        className="absolute inset-0 bg-black z-[59] pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: animationComplete ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 3.5 }}
      />
    </div>
  )
}

