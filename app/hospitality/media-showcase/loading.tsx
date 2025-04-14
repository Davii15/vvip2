import { Loader2, Hotel, Utensils, Wine, UtensilsCrossed, Coffee } from "lucide-react"

export default function HospitalityMediaShowcaseLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-red-800 to-amber-700 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-red-600 animate-pulse flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-white animate-spin" />
        </div>

        {/* Floating icons */}
        <div className="absolute -top-8 -left-8 animate-float-slow">
          <div className="bg-amber-600 p-2 rounded-full shadow-lg">
            <Hotel className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="absolute -top-4 -right-8 animate-float-medium">
          <div className="bg-red-600 p-2 rounded-full shadow-lg">
            <Utensils className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="absolute -bottom-8 -left-4 animate-float-fast">
          <div className="bg-amber-700 p-2 rounded-full shadow-lg">
            <Wine className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="absolute -bottom-4 -right-10 animate-float-medium">
          <div className="bg-red-700 p-2 rounded-full shadow-lg">
            <UtensilsCrossed className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="absolute top-10 right-10 animate-float-slow">
          <div className="bg-amber-800 p-2 rounded-full shadow-lg">
            <Coffee className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      <h2 className="mt-8 text-2xl font-bold text-amber-100">Loading Hospitality Videos</h2>
      <p className="mt-2 text-amber-200">Preparing your immersive video experience...</p>

      {/* Video card skeletons */}
      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-b from-amber-900/60 to-red-900/60 rounded-xl overflow-hidden shadow-xl border border-amber-600/30 backdrop-blur-sm animate-pulse"
            >
              <div className="aspect-[9/16] bg-gradient-to-br from-amber-800/50 to-red-800/50"></div>
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-amber-800/70"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-amber-800/70 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-amber-800/70 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-5 bg-amber-800/70 rounded w-full mb-2"></div>
                <div className="h-4 bg-amber-800/70 rounded w-full mb-2"></div>
                <div className="h-4 bg-amber-800/70 rounded w-5/6"></div>

                <div className="mt-4 pt-3 border-t border-amber-800/50 flex justify-between">
                  <div className="flex gap-2">
                    <div className="h-8 w-16 bg-amber-800/70 rounded"></div>
                    <div className="h-8 w-16 bg-amber-800/70 rounded"></div>
                    <div className="h-8 w-16 bg-amber-800/70 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-amber-800/70 rounded"></div>
                    <div className="h-8 w-8 bg-amber-800/70 rounded"></div>
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

