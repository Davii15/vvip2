"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function Loading() {
  const [progress, setProgress] = useState(0)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer)
          return 100
        }
        return prevProgress + 5
      })
    }, 150)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-slate-900 flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Top curtain */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ delay: 0.5, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 top-0 h-1/2 bg-blue-800"
      />

      {/* Bottom curtain */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "100%" }}
        transition={{ delay: 0.5, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-blue-800"
      />

      {/* Car animation */}
      <div className="relative z-10 mb-8">
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative"
        >
          <svg
            width="120"
            height="60"
            viewBox="0 0 120 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <motion.path
              d="M10,35 L25,25 L85,25 L100,35 L100,45 L10,45 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <motion.circle
              cx="30"
              cy="45"
              r="10"
              fill="#333"
              stroke="#666"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 0.8, duration: 1 }}
            />
            <motion.circle
              cx="80"
              cy="45"
              r="10"
              fill="#333"
              stroke="#666"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 0.8, duration: 1 }}
            />
            <motion.path
              d="M35,30 L45,30 L50,35 L60,35 L65,30 L75,30"
              stroke="#888"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            />
          </svg>

          {/* Animated headlights */}
          <motion.div
            className="absolute left-[25px] top-[30px] w-4 h-2 bg-yellow-300 rounded-full"
            animate={{
              opacity: [0.4, 1, 0.4],
              boxShadow: [
                "0 0 5px 2px rgba(255, 255, 0, 0.3)",
                "0 0 15px 5px rgba(255, 255, 0, 0.7)",
                "0 0 5px 2px rgba(255, 255, 0, 0.3)",
              ],
            }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          />

          {/* Road animation */}
          <div className="absolute -bottom-8 left-0 right-0">
            <div className="relative h-2 w-full overflow-hidden">
              <motion.div
                className="absolute inset-0 flex items-center"
                animate={{ x: [0, -100] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "linear" }}
              >
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="h-1 w-8 bg-gray-300 mx-4" />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-center z-10"
      >
        <h2 className="text-3xl font-bold text-white mb-2">
          <span className="text-blue-300">Car</span> Deals Shop
        </h2>
        <p className="text-blue-200 mb-4">Discovering your dream ride...</p>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-blue-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-300"
            style={{ width: `${progress}%` }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 text-blue-200 text-sm">{progress}%</div>

        {/* Loading messages */}
        <motion.div
          className="mt-4 text-blue-100 italic"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        >
          {progress < 30 && "Revving engines..."}
          {progress >= 30 && progress < 60 && "Polishing chrome..."}
          {progress >= 60 && progress < 90 && "Checking tire pressure..."}
          {progress >= 90 && "Ready for the road!"}
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-blue-300 opacity-70"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * -100],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2 + Math.random() * 3,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Speed lines */}
        <div className="absolute inset-0">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-[1px] bg-blue-400 opacity-30"
              style={{
                top: `${10 + i * 8}%`,
                left: "0%",
                width: `${20 + Math.random() * 30}%`,
              }}
              animate={{
                x: ["0%", "100%"],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 0.8 + Math.random() * 0.5,
                delay: Math.random() * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

