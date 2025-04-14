"use client"

import { motion } from "framer-motion"
import { Home, Building, Ruler, MapPin, Star } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-300 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-300 rounded-full filter blur-3xl opacity-20"></div>

        {/* Floating real estate icons */}
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
          <Home className="h-8 w-8 text-blue-400" />
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
          <Building className="h-10 w-10 text-indigo-400" />
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
          <MapPin className="h-9 w-9 text-blue-400" />
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
          <Ruler className="h-12 w-12 text-indigo-400" />
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
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <Home className="h-10 w-10 text-white" />
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
              className="absolute -inset-3 rounded-full border-2 border-dashed border-blue-300 opacity-70"
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
          className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-transparent bg-clip-text"
        >
          Real Estate Shop
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-gray-600 dark:text-gray-300 text-center mb-8 max-w-md"
        >
          Loading premium properties tailored to your needs...
        </motion.p>

        {/* Loading indicator */}
        <div className="relative">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-48"
          />
          <div className="h-1 bg-blue-100 dark:bg-blue-900/30 rounded-full w-48 -z-10 absolute top-0 left-0" />
        </div>

        {/* Loading dots */}
        <div className="flex space-x-2 mt-4">
          <motion.div
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="w-2 h-2 rounded-full bg-blue-400"
          />
          <motion.div
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-blue-500"
          />
          <motion.div
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.4 }}
            className="w-2 h-2 rounded-full bg-indigo-400"
          />
          <motion.div
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.6 }}
            className="w-2 h-2 rounded-full bg-indigo-500"
          />
        </div>
      </div>

      {/* Property card placeholders */}
      <div className="container mx-auto px-4 mt-16 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-20">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="h-80 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-blue-100 dark:border-slate-700 overflow-hidden"
            >
              <div className="h-1/2 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-800/50 dark:to-indigo-800/50" />
              <div className="p-4">
                <div className="w-3/4 h-4 bg-blue-100 dark:bg-blue-800/50 rounded mb-3" />
                <div className="flex items-center mb-3">
                  <div className="w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-700/50 mr-2" />
                  <div className="w-1/2 h-3 bg-blue-100 dark:bg-blue-800/50 rounded" />
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-700/50 mr-1" />
                    <div className="w-full h-3 bg-blue-100 dark:bg-blue-800/50 rounded" />
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-700/50 mr-1" />
                    <div className="w-full h-3 bg-blue-100 dark:bg-blue-800/50 rounded" />
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-700/50 mr-1" />
                    <div className="w-full h-3 bg-blue-100 dark:bg-blue-800/50 rounded" />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="w-1/3 h-4 bg-blue-200 dark:bg-blue-700/50 rounded" />
                  <div className="w-1/4 h-6 bg-blue-300 dark:bg-blue-600/50 rounded-full" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured section placeholder */}
      <div className="container mx-auto px-4 mt-16 max-w-6xl">
        <div className="w-1/3 h-8 bg-blue-100 dark:bg-blue-800/50 rounded mb-6 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-10">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + 0.1 * i, duration: 0.5 }}
              className="h-96 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-blue-100 dark:border-slate-700 overflow-hidden"
            >
              <div className="h-1/2 bg-gradient-to-r from-blue-300 to-indigo-300 dark:from-blue-700/50 dark:to-indigo-700/50" />
              <div className="p-4">
                <div className="w-3/4 h-5 bg-blue-100 dark:bg-blue-800/50 rounded mb-4" />
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-700/50 mr-2" />
                  <div className="w-2/3 h-3 bg-blue-100 dark:bg-blue-800/50 rounded" />
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-700/50 mr-1" />
                    <div className="w-full h-3 bg-blue-100 dark:bg-blue-800/50 rounded" />
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-700/50 mr-1" />
                    <div className="w-full h-3 bg-blue-100 dark:bg-blue-800/50 rounded" />
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-700/50 mr-1" />
                    <div className="w-full h-3 bg-blue-100 dark:bg-blue-800/50 rounded" />
                  </div>
                </div>
                <div className="w-full h-10 bg-blue-200 dark:bg-blue-700/50 rounded-md mt-6" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3D rotating house animation */}
      <div className="mt-16 relative">
        <motion.div
          animate={{
            rotateY: 360,
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          className="w-16 h-16 mx-auto opacity-30"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Home className="h-16 w-16 text-blue-500" />
          </div>
        </motion.div>
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Preparing your real estate experience...
        </div>
      </div>
    </div>
  )
}

