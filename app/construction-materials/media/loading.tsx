import { Loader2, BrickWallIcon as Brick, Hammer, Ruler, HardHat } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-800 via-amber-700 to-yellow-600">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-yellow-800 to-amber-800 border-b border-yellow-600 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <div className="h-8 w-64 bg-yellow-700/50 rounded-md animate-pulse"></div>
              <div className="h-4 w-48 bg-yellow-700/50 rounded-md mt-2 animate-pulse"></div>
            </div>

            {/* Category filters skeleton */}
            <div className="flex flex-wrap justify-center md:justify-end gap-2">
              <div className="h-8 w-16 bg-yellow-700/50 rounded-full animate-pulse"></div>
              <div className="h-8 w-32 bg-yellow-700/50 rounded-full animate-pulse"></div>
              <div className="h-8 w-40 bg-yellow-700/50 rounded-full animate-pulse"></div>
              <div className="h-8 w-36 bg-yellow-700/50 rounded-full animate-pulse"></div>
              <div className="h-8 w-28 bg-yellow-700/50 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center mb-8">
          <div className="bg-yellow-900/80 p-6 rounded-full backdrop-blur-sm flex flex-col items-center">
            <div className="flex items-center justify-center mb-4">
              <Brick className="h-6 w-6 text-yellow-300 animate-bounce mr-2" />
              <Loader2 className="h-8 w-8 animate-spin text-yellow-300" />
              <Hammer className="h-6 w-6 text-yellow-300 animate-bounce ml-2" />
            </div>
            <div className="flex items-center">
              <HardHat className="h-6 w-6 text-yellow-300 animate-pulse mr-2" />
              <span className="text-yellow-200 font-medium text-lg">Loading construction videos...</span>
              <Ruler className="h-6 w-6 text-yellow-300 animate-pulse ml-2" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Generate 6 skeleton cards */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-b from-yellow-800/90 to-amber-800/90 rounded-xl overflow-hidden shadow-xl border border-yellow-600/30 backdrop-blur-sm"
            >
              {/* Video container skeleton */}
              <div className="relative aspect-[9/16] bg-yellow-900/50 animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-12 w-12 text-yellow-500/50 animate-spin" />
                </div>

                {/* Badge skeletons */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <div className="h-5 w-20 bg-yellow-700/50 rounded-md animate-pulse"></div>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="h-5 w-24 bg-yellow-700/50 rounded-md animate-pulse"></div>
                </div>
              </div>

              {/* Video info skeleton */}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-yellow-700/50 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-yellow-700/50 rounded-md animate-pulse mb-2"></div>
                    <div className="h-3 w-24 bg-yellow-700/50 rounded-md animate-pulse"></div>
                  </div>
                </div>

                <div className="h-5 w-full bg-yellow-700/50 rounded-md animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-yellow-700/50 rounded-md animate-pulse mb-2"></div>
                <div className="h-4 w-3/4 bg-yellow-700/50 rounded-md animate-pulse mb-3"></div>

                {/* Video stats and actions skeleton */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-yellow-800">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-16 bg-yellow-700/50 rounded-md animate-pulse"></div>
                    <div className="h-8 w-16 bg-yellow-700/50 rounded-md animate-pulse"></div>
                    <div className="h-8 w-16 bg-yellow-700/50 rounded-md animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-yellow-700/50 rounded-md animate-pulse"></div>
                    <div className="h-8 w-8 bg-yellow-700/50 rounded-md animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
