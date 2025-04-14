"use client"
import { useState, useEffect } from "react"
import { useCookieTracking } from "@/hooks/useCookieTracking"

type RecommendationStrategy =
  // Electronics strategies
  | "viewed"
  | "trending"
  | "seasonal"
  | "similar"
  // Agriculture strategies
  | "farmSize"
  | "cropType"
  | "weather"

interface UseRecommendationsProps {
  products: any[]
  category: "electronics" | "agriculture" | "finance" | "insurance"
  count?: number
  strategies?: RecommendationStrategy[]
}

export function useRecommendations({
  products,
  category,
  count = 8,
  strategies = ["viewed", "trending", "seasonal"],
}: UseRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { getCookieData } = useCookieTracking(category)

  useEffect(() => {
    if (!products || products.length === 0) {
      setIsLoading(false)
      return
    }

    const generateRecommendations = async () => {
      try {
        setIsLoading(true)

        // Get user data from cookies
        const userData = getCookieData()

        // Get current date info for seasonal recommendations
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth() + 1
        const currentSeason = getSeason(currentMonth)

        // Apply recommendation strategies
        let recommendedProducts: any[] = []

        // Apply each strategy and assign a reason
        for (const strategy of strategies) {
          let strategyProducts: any[] = []

          switch (strategy) {
            case "viewed":
              strategyProducts = getViewedRecommendations(products, userData)
              break
            case "trending":
              strategyProducts = getTrendingRecommendations(products)
              break
            case "seasonal":
              strategyProducts = getSeasonalRecommendations(products, currentSeason, currentMonth)
              break
            case "similar":
              strategyProducts = getSimilarRecommendations(products, userData)
              break
            case "farmSize":
              strategyProducts = getFarmSizeRecommendations(products, userData)
              break
            case "cropType":
              strategyProducts = getCropTypeRecommendations(products, userData)
              break
            case "weather":
              strategyProducts = getWeatherRecommendations(products, currentSeason)
              break
          }

          // Add recommendation reason to products
          strategyProducts = strategyProducts.map((product) => ({
            ...product,
            recommendationReason: strategy,
          }))

          recommendedProducts = [...recommendedProducts, ...strategyProducts]
        }

        // Remove duplicates
        const uniqueRecommendations = removeDuplicates(recommendedProducts)

        // Limit to requested count
        const limitedRecommendations = uniqueRecommendations.slice(0, count)

        setRecommendations(limitedRecommendations)
      } catch (error) {
        console.error("Error generating recommendations:", error)
        // Fallback to random products
        const randomProducts = getRandomProducts(products, count)
        setRecommendations(randomProducts)
      } finally {
        setIsLoading(false)
      }
    }

    generateRecommendations()
  }, [products, category, count, strategies, getCookieData])

  return { recommendations, isLoading }
}

// Helper functions
function getSeason(month: number): string {
  if ([3, 4, 5].includes(month)) return "Spring"
  if ([6, 7, 8].includes(month)) return "Summer"
  if ([9, 10, 11].includes(month)) return "Fall"
  return "Winter"
}

function getViewedRecommendations(products: any[], userData: any): any[] {
  // In a real implementation, this would use the user's viewing history
  // For now, just return some products marked as popular
  return products.filter((product) => product.isPopular || product.isMostPreferred).slice(0, 3)
}

function getTrendingRecommendations(products: any[]): any[] {
  // Return products marked as trending
  const trending = products.filter((product) => product.isTrending || product.isHotDeal)
  return trending.length > 0 ? trending.slice(0, 3) : getRandomProducts(products, 3)
}

function getSeasonalRecommendations(products: any[], season: string, month: number): any[] {
  // For electronics, recommend seasonal products (e.g., fans in summer)
  // For agriculture, recommend products based on planting/harvesting seasons
  const seasonalProducts = products.filter((product) => {
    if (product.bestSeason) {
      return product.bestSeason.toLowerCase().includes(season.toLowerCase())
    }
    return false
  })

  return seasonalProducts.length > 0 ? seasonalProducts : getRandomProducts(products, 3)
}

function getSimilarRecommendations(products: any[], userData: any): any[] {
  // In a real implementation, this would use product similarity
  // For now, just return products in the same category as viewed products
  const categories = new Set(userData.viewedProducts?.map((p: any) => p.category).filter(Boolean) || [])
  if (categories.size === 0) return getRandomProducts(products, 3)

  return products.filter((product) => categories.has(product.category)).slice(0, 3)
}

function getFarmSizeRecommendations(products: any[], userData: any): any[] {
  // Recommend products based on farm size
  const farmSize = userData.farmSize || "Any"
  const farmSizeProducts = products.filter(
    (product) => !product.farmSize || product.farmSize === "Any" || product.farmSize === farmSize,
  )
  return farmSizeProducts.length > 0 ? farmSizeProducts.slice(0, 3) : getRandomProducts(products, 3)
}

function getCropTypeRecommendations(products: any[], userData: any): any[] {
  // Recommend products based on crop types
  return getRandomProducts(products, 3) // Simplified for this example
}

function getWeatherRecommendations(products: any[], season: string): any[] {
  // Recommend products based on current weather conditions
  return getRandomProducts(products, 3) // Simplified for this example
}

function getRandomProducts(products: any[], count: number): any[] {
  const shuffled = [...products].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

function removeDuplicates(products: any[]): any[] {
  const seen = new Set()
  return products.filter((product) => {
    if (seen.has(product.id)) return false
    seen.add(product.id)
    return true
  })
}
