import { Loader2, DollarSign, LineChart, PiggyBank, TrendingUp, Briefcase } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-700 p-4 md:p-8">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-indigo-900 to-blue-900 border-b border-indigo-700 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <div className="h-8 w-64 bg-indigo-800/50 rounded-md animate-pulse mb-2"></div>
              <div className="h-4 w-80 bg-indigo-800/50 rounded-md animate-pulse"></div>
            </div>

            {/* Category filter skeletons */}
            <div className="flex flex-wrap justify-center md:justify-end gap-2">
              <div className="h-9 w-16 bg-indigo-800/50 rounded-full animate-pulse"></div>
              <div className="h-9 w-40 bg-indigo-800/50 rounded-full animate-pulse"></div>
              <div className="h-9 w-36 bg-indigo-800/50 rounded-full animate-pulse"></div>
              <div className="h-9 w-32 bg-indigo-800/50 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Generate 6 video card skeletons */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-b from-indigo-900/90 to-blue-900/90 rounded-xl overflow-hidden shadow-xl border border-indigo-600/30 backdrop-blur-sm"
            >
              {/* Video container skeleton */}
              <div className="relative aspect-[9/16] bg-indigo-800/30 animate-pulse flex items-center justify-center">
                {/* Randomly select a finance icon for each skeleton */}
                {
                  [
                    <DollarSign key="dollar" className="h-16 w-16 text-indigo-700/30" />,
                    <LineChart key="line" className="h-16 w-16 text-indigo-700/30" />,
                    <PiggyBank key="piggy" className="h-16 w-16 text-indigo-700/30" />,
                    <TrendingUp key="trend" className="h-16 w-16 text-indigo-700/30" />,
                    <Briefcase key="brief" className="h-16 w-16 text-indigo-700/30" />,
                  ][index % 5]
                }
              </div>

              {/* Video info skeleton */}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  {/* Avatar skeleton */}
                  <div className="h-10 w-10 rounded-full bg-indigo-800/50 animate-pulse"></div>

                  <div className="flex-1 min-w-0">
                    {/* Title skeleton */}
                    <div className="h-5 w-3/4 bg-indigo-800/50 rounded-md animate-pulse mb-1"></div>
                    {/* Location skeleton */}
                    <div className="h-3 w-1/2 bg-indigo-800/50 rounded-md animate-pulse"></div>
                  </div>

                  {/* Info button skeleton */}
                  <div className="h-8 w-8 rounded-full bg-indigo-800/50 animate-pulse"></div>
                </div>

                {/* Video title skeleton */}
                <div className="h-6 w-full bg-indigo-800/50 rounded-md animate-pulse mb-2"></div>

                {/* Description skeleton */}
                <div className="h-4 w-full bg-indigo-800/50 rounded-md animate-pulse mb-1"></div>
                <div className="h-4 w-5/6 bg-indigo-800/50 rounded-md animate-pulse mb-3"></div>

                {/* Action buttons skeleton */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-indigo-800">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-16 bg-indigo-800/50 rounded-md animate-pulse"></div>
                    <div className="h-8 w-16 bg-indigo-800/50 rounded-md animate-pulse"></div>
                    <div className="h-8 w-16 bg-indigo-800/50 rounded-md animate-pulse"></div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-indigo-800/50 animate-pulse"></div>
                    <div className="h-8 w-8 rounded-full bg-indigo-800/50 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        <div className="flex justify-center items-center py-12">
          <div className="bg-indigo-900/80 p-6 rounded-full backdrop-blur-sm flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-300" />
            <span className="text-indigo-200 font-medium">Loading finance videos...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
