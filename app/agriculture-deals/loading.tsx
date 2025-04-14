import { Skeleton } from "@/components/ui/skeleton"
import { Tractor, Leaf, Wheat, Search, Cloud } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-100">
      {/* Hero section skeleton */}
      <div className="relative bg-gradient-to-r from-green-700 to-lime-600 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 opacity-10">
            <Tractor className="h-40 w-40" />
          </div>
          <div className="absolute bottom-10 right-20 opacity-10">
            <Wheat className="h-32 w-32" />
          </div>
          <div className="absolute top-40 right-40 opacity-10">
            <Leaf className="h-24 w-24" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Skeleton className="h-16 w-3/4 mx-auto bg-white/20 mb-4" />
            <Skeleton className="h-8 w-2/3 mx-auto bg-white/20 mb-8" />

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Skeleton className="h-14 w-40 bg-white/20" />
              <Skeleton className="h-14 w-40 bg-white/20" />
            </div>
          </div>

          {/* Weather widget skeleton */}
          <div className="max-w-md mx-auto">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Cloud className="h-8 w-8 text-white/70" />
                  <div className="ml-2">
                    <Skeleton className="h-5 w-24 bg-white/20" />
                    <Skeleton className="h-4 w-32 bg-white/20 mt-1" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-6 w-16 bg-white/20" />
                  <Skeleton className="h-4 w-24 bg-white/20 mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hot deals section skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-48 bg-green-200/50" />
          <Skeleton className="h-10 w-24 bg-green-200/50" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-green-100">
              <Skeleton className="h-48 w-full bg-green-200/50" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 bg-green-200/50 mb-2" />
                <Skeleton className="h-5 w-1/2 bg-green-200/50 mb-2" />
                <Skeleton className="h-4 w-2/3 bg-green-200/50" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal tips section skeleton */}
      <div className="bg-green-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-64 bg-green-200/50" />
            <Skeleton className="h-10 w-24 bg-green-200/50" />
          </div>
        </div>
      </div>

      {/* Main content section skeleton */}
      <div className="container mx-auto px-4 py-12">
        {/* Search and filter bar skeleton */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Skeleton className="h-10 w-full bg-green-200/50" />
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-10 w-[180px] bg-green-200/50" />
              <Skeleton className="h-10 w-[100px] bg-green-200/50" />
            </div>
          </div>
        </div>

        {/* Tabs section skeleton */}
        <div className="mb-8">
          <div className="bg-green-100/50 p-1 rounded-lg flex">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-10 flex-1 mx-1 bg-green-200/50" />
            ))}
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-green-100">
                  <Skeleton className="h-48 w-full bg-green-200/50" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 bg-green-200/50 mb-2" />
                    <Skeleton className="h-4 w-full bg-green-200/50 mb-2" />
                    <Skeleton className="h-4 w-full bg-green-200/50 mb-2" />
                    <Skeleton className="h-5 w-1/2 bg-green-200/50 mb-2" />
                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-10 w-full bg-green-200/50" />
                      <Skeleton className="h-10 w-full bg-green-200/50" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load more skeleton */}
            <div className="flex justify-center items-center py-8">
              <div className="h-8 w-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

