"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { X } from "lucide-react"
import { getPersonalizationData } from "@/lib/cookies"

export default function WelcomeBackAlert() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user is returning after component mounts
    const personalizationData = getPersonalizationData()

    if (personalizationData.isReturningUser) {
      // Show the alert for returning users
      setIsVisible(true)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
        >
          <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg shadow-2xl p-6 mx-4">
            <div className="absolute top-3 right-3">
              <button onClick={handleClose} className="text-white hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">OneShopDiscount Welcome Message</h3>

              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                <p className="text-white text-lg leading-relaxed">
                  Welcome back🤝🏿, we missed you! We have added some new products since you left, you can check them
                  out on your favourite categories, cheers🎊
                </p>
              </div>

              <Link href="/categories">
                <button className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-full shadow-md transition-colors duration-300 transform hover:scale-105">
                  Browse Categories
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

