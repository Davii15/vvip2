"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Leaf, Calendar, TrendingUp, Droplets, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRecommendations } from "@/hooks/use-recommendations"
import { cn } from "@/lib/utils"
import { useCookieTracking } from "@/hooks/useCookieTracking"

interface AgricultureRecommendationsProps {
  allProducts: any[]
}

export default function AgricultureRecommendations({ allProducts }: AgricultureRecommendationsProps) {
  const { recommendations, isLoading } = useRecommendations({
    products: allProducts,
    category: "agriculture",
    count: 4,
    strategies: ["seasonal", "farmSize", "cropType", "weather"],
  })

  // Add trackView function to track when a product is clicked
  const { trackView } = useCookieTracking("agriculture-deals")

  const [currentSeason, setCurrentSeason] = useState("Rainy Season")
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)

  // Set current season based on month
  useEffect(() => {
    const month = new Date().getMonth() + 1
    setCurrentMonth(month)

    // Simple season determination based on month
    if ([3, 4, 5].includes(month)) {
      setCurrentSeason("Planting Season")
    } else if ([6, 7, 8].includes(month)) {
      setCurrentSeason("Growing Season")
    } else if ([9, 10, 11].includes(month)) {
      setCurrentSeason("Harvest Season")
    } else {
      setCurrentSeason("Dry Season")
    }
  }, [])

  if (isLoading || recommendations.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Leaf className="h-6 w-6 text-green-400 mr-2" />
            <h2 className="text-xl font-bold text-white">Seasonal Recommendations</h2>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/20">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <p className="text-white/80 mt-1">
          Perfect for {currentSeason} (Month: {currentMonth})
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.slice(0, 4).map((product) => (
          <div key={product.id} className="h-full" onClick={() => trackView(product.id)}>
            <Card className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-green-100 hover:shadow-xl transition-all duration-300">
              <div className="relative w-full pt-[60%] overflow-hidden group">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute bottom-2 left-2">
                  <Badge
                    className={cn(
                      "text-xs",
                      product.recommendationReason === "seasonal"
                        ? "bg-green-500 text-white"
                        : product.recommendationReason === "farmSize"
                          ? "bg-blue-500 text-white"
                          : product.recommendationReason === "cropType"
                            ? "bg-amber-500 text-white"
                            : "bg-purple-500 text-white",
                    )}
                  >
                    {product.recommendationReason === "seasonal" && <Calendar className="h-3 w-3 mr-1" />}
                    {product.recommendationReason === "farmSize" && <Droplets className="h-3 w-3 mr-1" />}
                    {product.recommendationReason === "cropType" && <Leaf className="h-3 w-3 mr-1" />}
                    {product.recommendationReason === "weather" && <TrendingUp className="h-3 w-3 mr-1" />}
                    {product.recommendationReason === "seasonal"
                      ? `Perfect for ${currentSeason}`
                      : product.recommendationReason === "farmSize"
                        ? "Matches Your Farm"
                        : product.recommendationReason === "cropType"
                          ? "Ideal for Your Crops"
                          : "Weather Optimized"}
                  </Badge>
                </div>
              </div>

              <div className="p-4 flex-grow flex flex-col">
                <h5 className="font-semibold mb-2 text-green-800 truncate">{product.name}</h5>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2 flex-grow">{product.description}</p>

                <div className="flex flex-col mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">
                      {typeof product.currentPrice === "object"
                        ? `${product.currentPrice.currency} ${product.currentPrice.amount.toLocaleString()}`
                        : product.currentPrice}
                    </span>
                    {product.originalPrice && product.originalPrice !== product.currentPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {typeof product.originalPrice === "object"
                          ? `${product.originalPrice.currency} ${product.originalPrice.amount.toLocaleString()}`
                          : product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-auto">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-lime-500 text-white">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
