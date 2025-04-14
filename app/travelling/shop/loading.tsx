"use client"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header Skeleton */}
      <div className="relative bg-gradient-to-r from-blue-500 to-teal-500 py-12">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-24 bg-white/20 mb-4" />
              <Skeleton className="h-12 w-64 bg-white/20 mb-2" />
              <Skeleton className="h-4 w-full max-w-2xl bg-white/20" />
            </div>
            <div className="hidden md:block">
              <Skeleton className="h-32 w-32 bg-white/20 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="relative max-w-2xl mx-auto">
          <Skeleton className="h-14 w-full rounded-full bg-white/50 dark:bg-slate-800/50" />
        </div>
      </div>

      {/* Category Tabs Skeleton */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <Skeleton className="h-12 w-full rounded-xl bg-white/50 dark:bg-slate-800/50" />
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-full">
              <Skeleton className="h-64 w-full rounded-lg bg-white/50 dark:bg-slate-800/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

