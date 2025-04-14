import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BeautyTutorialsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-300 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-300 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/beauty-and-massage/shop" className="flex items-center text-white mb-4 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Beauty Shop
          </Link>
          <Skeleton className="h-12 w-3/4 bg-white/20 mb-4" />
          <Skeleton className="h-6 w-1/2 bg-white/20" />
        </div>
      </div>

      {/* Search and filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Skeleton className="h-10 w-full md:w-3/4 rounded-full" />
          <Skeleton className="h-10 w-full md:w-1/4 rounded-md" />
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-12 w-full rounded-xl mb-6" />

        {/* Featured tutorials skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-pink-100">
                <Skeleton className="h-64 w-full" />
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <Skeleton className="h-8 w-8 rounded-full mr-2" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <div className="flex justify-between">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

