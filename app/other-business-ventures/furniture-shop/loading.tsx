import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function FurnitureShopLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Hero Section Skeleton */}
      <div className="relative mb-12 rounded-xl overflow-hidden">
        <Skeleton className="w-full h-64 md:h-80" />
      </div>

      {/* Hot Deals Section Skeleton */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center mb-2">
              <Skeleton className="h-6 w-6 mr-2 rounded-full" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <Skeleton className="h-6 w-1/2" />
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-10" />
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar Skeleton */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>

            {/* Category Filter Skeleton */}
            <div className="mb-6">
              <Skeleton className="h-5 w-20 mb-2" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-4 w-4 rounded mr-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>

            {/* Subcategory Filter Skeleton */}
            <div className="mb-6">
              <Skeleton className="h-5 w-24 mb-2" />
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-4 w-4 rounded mr-2" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                ))}
              </div>
            </div>

            {/* Vendor Filter Skeleton */}
            <div className="mb-6">
              <Skeleton className="h-5 w-16 mb-2" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-4 w-4 rounded mr-2" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Filter Skeleton */}
            <div className="mb-6">
              <Skeleton className="h-5 w-24 mb-2" />
              <div className="px-2">
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1">
          {/* Search and Sort Bar Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-40" />
          </div>

          {/* Category Tabs Skeleton */}
          <Skeleton className="h-10 w-full mb-6" />

          {/* Subcategory Horizontal Scroll Skeleton */}
          <div className="flex space-x-2 overflow-x-auto pb-2 mb-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 flex-shrink-0" />
            ))}
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-6 w-1/2" />
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

