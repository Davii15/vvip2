"use client"

import { motion } from "framer-motion"
import { Compass, PlaneTakeoff, Landmark, Bus, Car, Train, Search, Filter, Star } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-amber-500/10 to-orange-500/10 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-l from-amber-500/10 to-orange-500/10 -z-10"></div>

      <div className="container mx-auto px-4 py-8 max-w-[1920px] relative z-10">
        {/* Header skeleton */}
        <div className="text-center mb-8">
          <motion.div
            className="h-12 w-3/4 md:w-1/2 bg-amber-200/50 rounded-lg mx-auto mb-4"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />

          <motion.div
            className="h-6 w-2/3 md:w-1/3 bg-amber-200/50 rounded-lg mx-auto"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.2 }}
          />
        </div>

        {/* Search bar skeleton */}
        <div className="mb-8 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-amber-100">
          <div className="flex flex-col md:flex-row gap-4">
            <motion.div
              className="h-14 bg-amber-100/70 rounded-lg flex-grow"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <div className="flex items-center h-full px-3">
                <Search className="h-5 w-5 text-amber-300" />
                <div className="h-5 w-1/3 bg-amber-200/50 rounded-md ml-3" />
              </div>
            </motion.div>

            <div className="flex gap-2">
              <motion.div
                className="h-14 w-24 bg-amber-100/70 rounded-lg flex items-center justify-center"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.1 }}
              >
                <Filter className="h-5 w-5 text-amber-300" />
              </motion.div>

              <motion.div
                className="h-14 w-32 bg-amber-100/70 rounded-lg"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.2 }}
              />
            </div>
          </div>
        </div>

        {/* Category tabs skeleton */}
        <div className="mb-8 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 pb-2">
            {[
              { icon: <Compass className="h-4 w-4 text-amber-300" />, width: "w-28" },
              { icon: <PlaneTakeoff className="h-4 w-4 text-amber-300" />, width: "w-40" },
              { icon: <Landmark className="h-4 w-4 text-amber-300" />, width: "w-36" },
              { icon: <Star className="h-4 w-4 text-amber-300" />, width: "w-32" },
              { icon: <Bus className="h-4 w-4 text-amber-300" />, width: "w-34" },
              { icon: <Car className="h-4 w-4 text-amber-300" />, width: "w-30" },
              { icon: <Train className="h-4 w-4 text-amber-300" />, width: "w-28" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`h-10 ${item.width} bg-amber-100/70 rounded-lg flex items-center justify-center gap-2`}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: index * 0.1 }}
              >
                {item.icon}
                <div className="h-4 w-16 bg-amber-200/50 rounded-md" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Video grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full border border-amber-100"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: (index * 0.1) % 0.4,
              }}
            >
              {/* Video thumbnail skeleton */}
              <div className="relative aspect-video bg-amber-100/70">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-amber-200/50 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-amber-300 border-b-8 border-b-transparent ml-1" />
                  </div>
                </div>

                {/* Duration badge skeleton */}
                <div className="absolute bottom-2 right-2 h-5 w-12 bg-amber-200/50 rounded" />

                {/* Category badge skeleton */}
                <div className="absolute top-2 left-2 h-5 w-24 bg-amber-200/50 rounded-full" />
              </div>

              {/* Content skeleton */}
              <div className="p-4 flex-grow">
                {/* Title skeleton */}
                <div className="h-5 bg-amber-100/70 rounded mb-3 w-full" />
                <div className="h-5 bg-amber-100/70 rounded mb-4 w-3/4" />

                {/* Author info skeleton */}
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-100/70 mr-2" />
                  <div>
                    <div className="h-4 w-24 bg-amber-100/70 rounded mb-1" />
                    <div className="h-3 w-32 bg-amber-100/70 rounded" />
                  </div>
                </div>

                {/* Location skeleton */}
                <div className="flex items-center mb-3">
                  <div className="h-4 w-40 bg-amber-100/70 rounded" />
                </div>

                {/* Description skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-amber-100/70 rounded w-full" />
                  <div className="h-3 bg-amber-100/70 rounded w-full" />
                  <div className="h-3 bg-amber-100/70 rounded w-2/3" />
                </div>

                {/* Engagement stats skeleton */}
                <div className="flex justify-between items-center pt-2 border-t border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-16 bg-amber-100/70 rounded" />
                    <div className="h-4 w-16 bg-amber-100/70 rounded" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-amber-100/70 rounded-full" />
                    <div className="h-4 w-4 bg-amber-100/70 rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loading indicator */}
        <div className="flex justify-center items-center py-8 mt-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
            <div className="mt-4 h-5 w-40 bg-amber-100/70 rounded mx-auto" />
          </div>
        </div>

        {/* Custom scrollbar styles */}
        <style jsx global>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          
          .animate-pulse-slow {
            animation: pulse 2s ease-in-out infinite;
          }
          
          .border-l-12 {
            border-left-width: 12px;
          }
        `}</style>
      </div>
    </div>
  )
}
