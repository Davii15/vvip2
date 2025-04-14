"use client"

import { motion } from "framer-motion"
import { Smartphone, Laptop, Headphones, Tv, GamepadIcon as GameController, Zap } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function ElectronicsShopLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      {/* Header Skeleton */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-400 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center text-white mb-4">
                <Skeleton className="h-4 w-4 mr-1 bg-white/20" />
                <Skeleton className="h-4 w-32 bg-white/20" />
              </div>
              <Skeleton className="h-12 w-64 mb-2 bg-white/20" />
              <Skeleton className="h-4 w-full max-w-2xl bg-white/20" />
            </div>
            <div className="hidden md:block">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                className="bg-white/20 backdrop-blur-md p-4 rounded-lg shadow-lg"
              >
                <div className="text-white text-center">
                  <Zap className="h-8 w-8 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto mb-1 bg-white/20" />
                  <Skeleton className="h-3 w-20 mx-auto bg-white/20" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="relative max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-70 blur"></div>
            <Skeleton className="h-14 w-full rounded-full bg-white dark:bg-slate-800" />
          </div>
        </div>
      </div>

      {/* Category Tabs Skeleton */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
          {[
            { icon: <Smartphone className="h-5 w-5" /> },
            { icon: <Laptop className="h-5 w-5" /> },
            { icon: <Headphones className="h-5 w-5" /> },
            { icon: <Tv className="h-5 w-5" /> },
            { icon: <GameController className="h-5 w-5" /> },
          ].map((item, index) => (
            <Skeleton
              key={index}
              className={`flex items-center px-4 py-2 rounded-full ${
                index === 0 ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "bg-white dark:bg-slate-800"
              } w-32 h-10`}
            />
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar Skeleton */}
          <div className="w-full lg:w-1/4 space-y-6">
            <Skeleton className="h-80 w-full rounded-xl bg-white dark:bg-slate-800" />
            <Skeleton className="h-40 w-full rounded-xl bg-white dark:bg-slate-800" />
          </div>

          {/* Products Grid Skeleton */}
          <div className="w-full lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-96 rounded-xl bg-white dark:bg-slate-800" />
              ))}
            </div>

            {/* Loading indicator */}
            <div className="flex justify-center items-center py-8 mt-6">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent"
                />
                <Skeleton className="h-4 w-40 mt-2 bg-gray-200 dark:bg-slate-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Circuit board animation in background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
        <div className="absolute inset-0 bg-circuit-pattern"></div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
          className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-blue-500"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, delay: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
          className="absolute top-1/3 right-1/3 w-2 h-2 rounded-full bg-indigo-500"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, delay: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
          className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-blue-500"
        />
      </div>
    </div>
  )
}

