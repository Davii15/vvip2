"use client"

import { motion } from "framer-motion"
import { Wheat, Cookie, Utensils, Sparkles, Star } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 dark:from-amber-900 dark:to-yellow-900 flex flex-col items-center justify-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-300 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-yellow-300 rounded-full filter blur-3xl opacity-20"></div>

        {/* Floating flour icons */}
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{
            y: [0, -15, 0],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Wheat className="h-8 w-8 text-amber-400" />
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-1/4"
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <Cookie className="h-10 w-10 text-amber-500" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 left-1/3"
          animate={{
            y: [0, -12, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Utensils className="h-9 w-9 text-amber-600" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 right-1/3"
          animate={{
            y: [0, -18, 0],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 4.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <Sparkles className="h-12 w-12 text-yellow-400" />
        </motion.div>
      </div>

      {/* Main loading animation */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center">
              <Wheat className="h-10 w-10 text-white" />
            </div>
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              }}
              className="absolute -inset-3 rounded-full border-2 border-dashed border-amber-300 opacity-70"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -top-2 -right-2"
            >
              <Star className="h-6 w-6 text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-transparent bg-clip-text"
        >
          Kenyan Flour Shop
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-gray-600 dark:text-gray-300 text-center mb-8 max-w-md"
        >
          Finding the finest flour for your Kenyan cooking needs...
        </motion.p>

        {/* Loading indicator */}
        <div className="relative">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full w-48"
          />
          <div className="h-1 bg-amber-100 dark:bg-amber-900/30 rounded-full w-48 -z-10 absolute top-0 left-0" />
        </div>

        {/* Loading dots */}
        <div className="flex space-x-2 mt-4">
          <motion.div
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="w-2 h-2 rounded-full bg-amber-400"
          />
          <motion.div
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-amber-500"
          />
          <motion.div
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.4 }}
            className="w-2 h-2 rounded-full bg-yellow-400"
          />
          <motion.div
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.6 }}
            className="w-2 h-2 rounded-full bg-yellow-500"
          />
        </div>
      </div>

      {/* Provider card placeholders */}
      <div className="container mx-auto px-4 mt-16 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 opacity-20">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="h-80 rounded-lg bg-white dark:bg-amber-800 shadow-sm border border-amber-100 dark:border-amber-700 overflow-hidden"
            >
              <div className="h-1/2 bg-gradient-to-r from-amber-200 to-yellow-200 dark:from-amber-800/50 dark:to-yellow-800/50" />
              <div className="p-4">
                <div className="w-3/4 h-4 bg-amber-100 dark:bg-amber-800/50 rounded mb-3" />
                <div className="w-full h-3 bg-amber-100 dark:bg-amber-800/50 rounded mb-2" />
                <div className="w-full h-3 bg-amber-100 dark:bg-amber-800/50 rounded mb-2" />
                <div className="w-2/3 h-3 bg-amber-100 dark:bg-amber-800/50 rounded mb-4" />
                <div className="flex justify-between">
                  <div className="w-1/3 h-6 bg-amber-200 dark:bg-amber-700/50 rounded" />
                  <div className="w-1/3 h-6 bg-yellow-200 dark:bg-yellow-700/50 rounded" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
