"use client"

import React from "react"
import { motion } from "framer-motion"

interface SparklingTextProps {
  children: React.ReactNode
  className?: string
}

const SparklingText: React.FC<SparklingTextProps> = ({ children, className }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute inset-0 z-0"
        animate={{
          background: [
            "linear-gradient(45deg, #ff00ff, #00ff00, #0000ff, #ff0000, #ffff00)",
            "linear-gradient(45deg, #ffff00, #ff00ff, #00ff00, #0000ff, #ff0000)",
          ],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        style={{
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
        }}
        aria-hidden="true"
      >
        {children}
      </motion.span>
    </div>
  )
}

export default React.memo(SparklingText)

