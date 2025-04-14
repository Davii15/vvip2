"use client"

import { motion } from "framer-motion"
import { Store } from "lucide-react"

export default function RetailSupermarketLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 dark:from-slate-950 dark:to-slate-900">
      {/* Market Selector Banner Skeleton */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Store className="h-5 w-5 mr-2" />
            <span className="font-medium">Currently shopping at:</span>
            <div className="ml-2 h-6 w-32 bg-white/20 rounded animate-pulse"></div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="h-4 w-48 bg-white/20 rounded animate-pulse"></div>
            <div className="h-4 w-40 bg-white/20 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Header Skeleton */}
      <header className="bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="md:hidden h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <div className="h-10 w-full md:w-[300px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="hidden md:block h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Market Description Skeleton */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>

            <div className="flex-grow">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hot Deals Section Skeleton */}
      <div className="bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/30 dark:to-amber-950/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-sm">
                <div className="h-40 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters Skeleton */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>

              <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 my-4"></div>

              <div className="mb-6">
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>

              <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 my-4"></div>

              <div className="mb-6">
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 my-4"></div>

              <div className="mb-6">
                <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>

              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Main Products Area Skeleton */}
          <div className="flex-grow">
            {/* Category Tabs Skeleton */}
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6"></div>

            {/* Products Header Skeleton */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>

              <div className="hidden md:block">
                <div className="h-10 w-[180px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800"
                >
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>

                    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>

                    <div className="flex items-center justify-between">
                      <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex gap-2">
                      <div className="h-10 flex-grow bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="fixed bottom-6 right-6 h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>

      {/* Loading animation */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="w-16 h-16 rounded-full border-4 border-green-500 border-t-transparent"
        />
        <motion.p
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="mt-4 text-green-600 dark:text-green-400 font-medium"
        >
          Loading products...
        </motion.p>
      </div>
    </div>
  )
}

