"use client"

import { useState, useEffect, useRef } from "react"
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

// Helper function to format KSh currency
const formatCurrency = (price: any): string => {
  if (typeof price === "object") {
    // If it's an object with currency and amount
    const amount = price.amount.toLocaleString()
    // Ensure we're using KSh regardless of what's in the data
    return `KSh ${amount}`
  } else if (typeof price === "number") {
    // If it's just a number
    return `KSh ${price.toLocaleString()}`
  }
  // If it's already a string or something else
  return String(price)
}

export default function AgricultureRecommendations({ allProducts }: AgricultureRecommendationsProps) {
  const { recommendations, isLoading } = useRecommendations({
    products: allProducts,
    category: "agriculture",
    count: 8, // Get more products for rotation
    strategies: ["seasonal", "farmSize", "cropType", "weather"],
  })

  // Add trackView function to track when a product is clicked
  const { trackView } = useCookieTracking("agriculture-deals")

  const [currentSeason, setCurrentSeason] = useState("Rainy Season")
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([])
  const [currentSet, setCurrentSet] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

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

  // Set up product rotation
  useEffect(() => {
    if (!isLoading && recommendations.length > 0) {
      // Initialize with first set of products
      updateDisplayedProducts(0)

      // Set up interval to rotate products every 5 minutes (300000ms)
      intervalRef.current = setInterval(() => {
        setCurrentSet((prevSet) => {
          const nextSet = (prevSet + 1) % Math.ceil(recommendations.length / 4)
          updateDisplayedProducts(nextSet)
          return nextSet
        })
      }, 300000) // 5 minutes
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isLoading, recommendations])

  // Update displayed products based on current set
  const updateDisplayedProducts = (setIndex: number) => {
    const startIdx = setIndex * 4
    const endIdx = Math.min(startIdx + 4, recommendations.length)
    setDisplayedProducts(recommendations.slice(startIdx, endIdx))
  }

  // Manual rotation function
  const rotateProducts = () => {
    const nextSet = (currentSet + 1) % Math.ceil(recommendations.length / 4)
    setCurrentSet(nextSet)
    updateDisplayedProducts(nextSet)

    // Reset the interval timer when manually rotated
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      setCurrentSet((prevSet) => {
        const nextSet = (prevSet + 1) % Math.ceil(recommendations.length / 4)
        updateDisplayedProducts(nextSet)
        return nextSet
      })
    }, 300000) // 5 minutes
  }

  if (isLoading || displayedProducts.length === 0) {
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
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-white hover:bg-white/20" onClick={rotateProducts}>
              Rotate Products <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-white/80 mt-1">
          Perfect for {currentSeason} (Month: {currentMonth}) • Set {currentSet + 1} of{" "}
          {Math.ceil(recommendations.length / 4)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <div key={product.id} className="h-full" onClick={() => trackView(product.id)}>
            <Card className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-green-100 hover:shadow-xl transition-all duration-300">
              <div className="relative w-full pt-[60%] overflow-hidden">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
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
                    <span className="text-lg font-bold text-green-600">{formatCurrency(product.currentPrice)}</span>
                    {product.originalPrice && product.originalPrice !== product.currentPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatCurrency(product.originalPrice)}
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
