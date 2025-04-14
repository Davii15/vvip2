"use client"

import { motion } from "framer-motion"
import { Loader2, SmartphoneIcon, TvIcon, LaptopIcon, HeadphonesIcon, Zap } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function ElectronicsMediaLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-900 to-indigo-800 border-b border-purple-700 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <Skeleton className="h-8 w-64 bg-purple-800/50 mb-2" />
              <Skeleton className="h-4 w-80 bg-purple-800/50" />
            </div>

            {/* Category filters skeleton */}
            <div className="flex flex-wrap justify-center md:justify-end gap-2">
              <Skeleton className="h-8 w-16 rounded-full bg-purple-800/50" />
              <Skeleton className="h-8 w-28 rounded-full bg-purple-800/50" />
              <Skeleton className="h-8 w-24 rounded-full bg-purple-800/50" />
              <Skeleton className="h-8 w-20 rounded-full bg-purple-800/50" />
              <Skeleton className="h-8 w-32 rounded-full bg-purple-800/50" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Generate 6 video card skeletons */}
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-b from-purple-900/90 to-indigo-800/90 rounded-xl overflow-hidden shadow-xl border border-purple-600/30 backdrop-blur-sm"
            >
              {/* Video container skeleton */}
              <div className="relative aspect-[9/16] bg-purple-800/30 overflow-hidden">
                <Skeleton className="w-full h-full bg-purple-800/20" />

                {/* Animated tech icons floating around */}
                <motion.div
                  className="absolute top-1/4 left-1/4 text-purple-500/30"
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <SmartphoneIcon className="h-12 w-12" />
                </motion.div>

                <motion.div
                  className="absolute top-1/2 right-1/4 text-indigo-500/30"
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <TvIcon className="h-16 w-16" />
                </motion.div>

                <motion.div
                  className="absolute bottom-1/3 left-1/3 text-purple-400/30"
                  animate={{
                    y: [0, -12, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <LaptopIcon className="h-14 w-14" />
                </motion.div>

                <motion.div
                  className="absolute bottom-1/4 right-1/3 text-indigo-400/30"
                  animate={{
                    y: [0, -18, 0],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1.5,
                  }}
                >
                  <HeadphonesIcon className="h-10 w-10" />
                </motion.div>

                {/* Pulsing play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="bg-purple-500/30 rounded-full p-6"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.7, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <Zap className="h-8 w-8 text-purple-200/50" />
                  </motion.div>
                </div>

                {/* Badge skeletons */}
                <div className="absolute top-3 left-3">
                  <Skeleton className="h-5 w-20 rounded-full bg-purple-700/40" />
                </div>
                <div className="absolute top-3 right-3">
                  <Skeleton className="h-5 w-24 rounded-full bg-purple-700/40" />
                </div>
              </div>

              {/* Video info skeleton */}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Skeleton className="h-10 w-10 rounded-full bg-purple-800/50" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 bg-purple-800/50 mb-2" />
                    <Skeleton className="h-3 w-24 bg-purple-800/50" />
                  </div>
                </div>

                <Skeleton className="h-5 w-full bg-purple-800/50 mb-2" />
                <Skeleton className="h-5 w-3/4 bg-purple-800/50 mb-4" />
                <Skeleton className="h-4 w-full bg-purple-800/50 mb-2" />
                <Skeleton className="h-4 w-5/6 bg-purple-800/50 mb-6" />

                {/* Video stats skeleton */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-800">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-16 rounded-md bg-purple-800/50" />
                    <Skeleton className="h-8 w-16 rounded-md bg-purple-800/50" />
                    <Skeleton className="h-8 w-16 rounded-md bg-purple-800/50" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-md bg-purple-800/50" />
                    <Skeleton className="h-8 w-8 rounded-md bg-purple-800/50" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        <div className="flex justify-center items-center py-12">
          <div className="bg-purple-900/80 p-4 rounded-full backdrop-blur-sm flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-purple-300" />
            <span className="text-purple-200 font-medium">Loading electronics videos...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
