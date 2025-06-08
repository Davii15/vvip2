"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Wheat,
  Sparkles,
  Building2,
  Shield,
  Heart,
  Music,
  Armchair,
  Car,
  Apple,
  Dumbbell,
  ShoppingBasket,
  Loader2,
  Star,
  Zap,
} from "lucide-react"
import Image from "next/image"

const productIcons = [
  { icon: Wheat, color: "#D4A574", name: "Agriculture Products", delay: 0 },
  { icon: Sparkles, color: "#E91E63", name: "Beauty Products", delay: 0.3 },
  { icon: Building2, color: "#FF9800", name: "Hospitality Products", delay: 0.6 },
  { icon: Shield, color: "#2196F3", name: "Insurance Products", delay: 0.9 },
  { icon: Heart, color: "#4CAF50", name: "Health Products", delay: 1.2 },
  { icon: Music, color: "#9C27B0", name: "Entertainment", delay: 1.5 },
  { icon: Armchair, color: "#795548", name: "Furniture Products", delay: 1.8 },
  { icon: Car, color: "#607D8B", name: "Car Related Products", delay: 2.1 },
  { icon: Wheat, color: "#FFC107", name: "Flour (Maize, Wheat)", delay: 2.4 },
  { icon: Apple, color: "#8BC34A", name: "Vegetables and Fruits", delay: 2.7 },
  { icon: Dumbbell, color: "#FF5722", name: "Sports & Music Instruments", delay: 3.0 },
]

export default function LoadingPage() {
  const [progress, setProgress] = useState(0)
  const [showBasket, setShowBasket] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Show basket after 2 seconds
    const basketTimer = setTimeout(() => setShowBasket(true), 2000)

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 0.42 // Roughly 4 minutes (240 seconds / 100 = 2.4, so 100/240 = 0.42 per second)
      })
    }, 1000)

    // Redirect after 4 minutes
    const redirectTimer = setTimeout(() => {
      router.push("/")
    }, 240000) // 4 minutes

    return () => {
      clearTimeout(basketTimer)
      clearTimeout(redirectTimer)
      clearInterval(progressInterval)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-yellow-600 relative overflow-hidden">
      {/* African Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3Ccircle cx='0' cy='30' r='4'/%3E%3Ccircle cx='60' cy='30' r='4'/%3E%3Ccircle cx='30' cy='0' r='4'/%3E%3Ccircle cx='30' cy='60' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Header with Logo */}
      <motion.header
        className="flex justify-center pt-8 pb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/30">
          <Image
            src="/placeholder.svg?height=80&width=200"
            alt="OneShopDiscount Logo"
            width={200}
            height={80}
            className="h-20 w-auto"
          />
        </div>
      </motion.header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="relative w-full max-w-4xl aspect-square">
          <AnimatePresence>
            {showBasket && (
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <ShoppingBasket className="w-24 h-24 text-amber-800 drop-shadow-2xl" />
                  </motion.div>

                  {/* Overflow Effect */}
                  <motion.div
                    className="absolute -top-4 -left-2 w-8 h-8"
                    animate={{
                      y: [0, -10, 0],
                      x: [0, 5, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles className="w-6 h-6 text-pink-400" />
                  </motion.div>

                  <motion.div
                    className="absolute -top-6 right-0 w-6 h-6"
                    animate={{
                      y: [0, -15, 0],
                      x: [0, -8, 0],
                      rotate: [0, -180, -360],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  >
                    <Apple className="w-5 h-5 text-green-400" />
                  </motion.div>

                  <motion.div
                    className="absolute -top-2 -right-4 w-4 h-4"
                    animate={{
                      y: [0, -12, 0],
                      x: [0, 3, 0],
                      rotate: [0, 90, 180],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  >
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Orbiting Icons */}
          {productIcons.map((item, index) => {
            const Icon = item.icon
            const angle = (index * 360) / productIcons.length
            const radius = 180

            return (
              <motion.div
                key={index}
                className="absolute top-1/2 left-1/2"
                style={{
                  transformOrigin: "0 0",
                }}
                initial={{
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 360,
                }}
                transition={{
                  opacity: { delay: item.delay, duration: 0.5 },
                  scale: { delay: item.delay, duration: 0.5, type: "spring" },
                  rotate: {
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                    delay: item.delay,
                  },
                }}
              >
                <motion.div
                  className="flex items-center justify-center"
                  style={{
                    transform: `translate(${Math.cos((angle * Math.PI) / 180) * radius}px, ${Math.sin((angle * Math.PI) / 180) * radius}px)`,
                  }}
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                    delay: item.delay,
                  }}
                >
                  <motion.div
                    className="p-4 rounded-full shadow-2xl backdrop-blur-sm border-2 border-white/30 hover:scale-110 transition-transform duration-300 cursor-pointer"
                    style={{ backgroundColor: `${item.color}20` }}
                    whileHover={{ scale: 1.2 }}
                    title={item.name}
                  >
                    <Icon className="w-8 h-8 md:w-10 md:h-10" style={{ color: item.color }} />
                  </motion.div>
                </motion.div>
              </motion.div>
            )
          })}

          {/* Spilling Animation Particles */}
          {showBasket && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: productIcons[i % productIcons.length]?.color || "#FFA500",
                  }}
                  initial={{
                    x: Math.cos((i * 30 * Math.PI) / 180) * 120,
                    y: Math.sin((i * 30 * Math.PI) / 180) * 120,
                    scale: 0,
                  }}
                  animate={{
                    x: 0,
                    y: 0,
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        className="text-center pb-8 px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <motion.p
          className="text-2xl md:text-3xl font-bold text-white italic mb-6 drop-shadow-lg"
          animate={{
            textShadow: [
              "0 0 10px rgba(255,255,255,0.5)",
              "0 0 20px rgba(255,255,255,0.8)",
              "0 0 10px rgba(255,255,255,0.5)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          {"It's where experience meets convenience"}
        </motion.p>

        {/* Spinning Wheel */}
        <motion.div className="flex justify-center mb-4">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-2xl flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <motion.div
              className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Loader2 className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="bg-white/20 rounded-full h-3 backdrop-blur-sm mb-3">
            <motion.div
              className="bg-gradient-to-r from-green-400 via-yellow-400 to-orange-500 h-3 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex justify-between items-center mb-2">
            <p className="text-white/90 text-sm font-semibold">{Math.round(progress)}% Complete</p>
            <p className="text-white/90 text-sm font-mono bg-black/20 px-2 py-1 rounded">{formatTime(timeRemaining)}</p>
          </div>

          <motion.p
            className="text-white/80 text-sm mb-2"
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {loadingMessages[currentMessage]}
          </motion.p>

          {progress >= 95 && (
            <motion.p
              className="text-green-300 text-sm font-semibold flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Zap className="w-4 h-4" />
              Almost ready! Launching OneShopDiscount...
              <Zap className="w-4 h-4" />
            </motion.p>
          )}
        </div>
      </motion.footer>

      {/* Floating Elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`float-${i}`}
          className="absolute w-4 h-4 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
