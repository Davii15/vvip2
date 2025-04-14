"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Sparkles, TrendingUp, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRecommendations } from "@/hooks/use-recommendations"
import { cn } from "@/lib/utils"
import { useCookieTracking } from "@/hooks/useCookieTracking"

interface ElectronicsRecommendationsProps {
  allProducts: any[]
}

export default function ElectronicsRecommendations({ allProducts }: ElectronicsRecommendationsProps) {
  const { recommendations, isLoading } = useRecommendations({
    products: allProducts,
    category: "electronics",
    count: 4,
    strategies: ["viewed", "trending", "seasonal", "similar"],
  })

  // Add trackView function to track when a product is clicked
  const { trackView } = useCookieTracking("electronics")

  const [currentIndex, setCurrentIndex] = useState(0)

  // Rotate recommendations every 10 seconds
  useEffect(() => {
    if (recommendations.length <= 4) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (recommendations.length - 3))
    }, 10000)

    return () => clearInterval(interval)
  }, [recommendations.length])

  if (isLoading || recommendations.length === 0) {
    return null
  }

  const visibleRecommendations = recommendations.slice(currentIndex, currentIndex + 4)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-purple-400 mr-2" />
            <h2 className="text-2xl font-bold text-white">Recommended for You</h2>
          </div>
          <Button variant="ghost" className="text-purple-300 hover:text-purple-100 hover:bg-purple-900/50">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <p className="text-purple-300 mt-1">Based on Seasonal trends In Kenya this Month!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleRecommendations.map((product) => (
          <div key={product.id} className="h-full" onClick={() => trackView(product.id)}>
            <Card className="h-full overflow-hidden border-slate-700/50 bg-slate-800/40 backdrop-blur-sm hover:border-blue-500/70 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group">
              <div className="relative h-48 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 group-hover:opacity-70 transition-opacity duration-300"></div>
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                />

                {product.recommendationReason && (
                  <div className="absolute bottom-2 left-2">
                    <Badge
                      className={cn(
                        "text-xs",
                        product.recommendationReason === "trending"
                          ? "bg-orange-500 text-white"
                          : product.recommendationReason === "seasonal"
                            ? "bg-green-500 text-white"
                            : product.recommendationReason === "viewed"
                              ? "bg-blue-500 text-white"
                              : "bg-purple-500 text-white",
                      )}
                    >
                      {product.recommendationReason === "trending" && <TrendingUp className="h-3 w-3 mr-1" />}
                      {product.recommendationReason === "trending"
                        ? "Trending"
                        : product.recommendationReason === "seasonal"
                          ? "Seasonal Pick"
                          : product.recommendationReason === "viewed"
                            ? "Most Viewed"
                            : "You Might Like"}
                    </Badge>
                  </div>
                )}

                {product.rating && (
                  <div className="absolute top-2 right-2 bg-white/90 text-yellow-500 px-2 py-1 rounded-full text-xs font-bold shadow-md flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                    {product.rating}
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-indigo-100 mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-indigo-300 mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-lg font-bold text-indigo-100">
                      {typeof product.currentPrice === "object"
                        ? `${product.currentPrice.currency} ${product.currentPrice.amount.toLocaleString()}`
                        : product.currentPrice}
                    </div>
                    {product.originalPrice && product.originalPrice !== product.currentPrice && (
                      <div className="text-sm text-indigo-400 line-through">
                        {typeof product.originalPrice === "object"
                          ? `${product.originalPrice.currency} ${product.originalPrice.amount.toLocaleString()}`
                          : product.originalPrice}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
