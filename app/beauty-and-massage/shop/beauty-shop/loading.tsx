"use client"

import { motion } from "framer-motion"
import { Sparkles, Scissors, Palette, SprayCan } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30">
      {/* Header Skeleton */}
      <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                Beauty Shop <span className="text-gray-600 dark:text-gray-400 text-lg">Products</span>
              </h1>
              <div className="md:hidden w-20 h-8">
                <Skeleton className="h-full w-full rounded-md" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <Skeleton className="h-10 w-full md:w-[300px] rounded-md" />
              </div>

              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="hidden md:block h-10 w-28 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Animated Beauty Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
          <Sparkles className="h-8 w-8 text-pink-400" />
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
          <Scissors className="h-10 w-10 text-purple-400" />
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
          <Palette className="h-9 w-9 text-pink-500" />
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
          <SprayCan className="h-12 w-12 text-purple-500" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Time-based Recommendations Skeleton */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30 py-8 rounded-xl mb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="overflow-hidden border-0 shadow-md">
                  <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                    <Skeleton className="h-full w-full" />
                    <div className="absolute top-2 left-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters Skeleton */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />

              <div className="mb-6">
                <Skeleton className="h-5 w-24 mb-3" />
                <div className="space-y-2">
                  {[...Array(6)].map((_, index) => (
                    <Skeleton key={index} className="h-8 w-full" />
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />

              <div className="mb-6">
                <Skeleton className="h-5 w-16 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-8 w-full" />
              </div>

              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Main Products Area Skeleton */}
          <div className="flex-grow">
            {/* Category Tabs Skeleton */}
            <div className="mb-6">
              <div className="bg-white dark:bg-slate-900 p-1 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex overflow-x-auto gap-2">
                  {[...Array(6)].map((_, index) => (
                    <Skeleton key={index} className="h-9 w-24 flex-shrink-0" />
                  ))}
                </div>
              </div>
            </div>

            {/* Products Header Skeleton */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="hidden md:block h-10 w-[180px]" />
            </div>

            {/* Main Loading Animation */}
            <div className="flex flex-col items-center justify-center py-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-white" />
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
                    className="absolute -inset-3 rounded-full border-2 border-dashed border-pink-300 opacity-70"
                  />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text"
              >
                Beauty Shop
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-gray-600 dark:text-gray-300 text-center mb-8 max-w-md"
              >
                Loading our premium beauty products collection...
              </motion.p>

              {/* Loading indicator */}
              <div className="relative">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="h-1 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full w-48"
                />
                <div className="h-1 bg-pink-100 dark:bg-pink-900/30 rounded-full w-48 -z-10 absolute top-0 left-0" />
              </div>

              {/* Loading dots */}
              <div className="flex space-x-2 mt-4">
                {[0, 0.2, 0.4, 0.6].map((delay, index) => (
                  <motion.div
                    key={index}
                    animate={{
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay }}
                    className="w-2 h-2 rounded-full bg-pink-400"
                  />
                ))}
              </div>
            </div>

            {/* Product Card Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-20">
              {[...Array(9)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className="h-80 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-pink-100 dark:border-pink-900/20 overflow-hidden"
                >
                  <div className="h-1/2 bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-800/50 dark:to-purple-800/50" />
                  <div className="p-4">
                    <div className="w-3/4 h-4 bg-pink-100 dark:bg-pink-800/50 rounded mb-3" />
                    <div className="w-full h-3 bg-pink-100 dark:bg-pink-800/50 rounded mb-2" />
                    <div className="w-full h-3 bg-pink-100 dark:bg-pink-800/50 rounded mb-2" />
                    <div className="w-2/3 h-3 bg-pink-100 dark:bg-pink-800/50 rounded mb-4" />
                    <div className="flex justify-between">
                      <div className="w-1/3 h-6 bg-pink-200 dark:bg-pink-700/50 rounded" />
                      <div className="w-1/3 h-6 bg-purple-200 dark:bg-purple-700/50 rounded" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
