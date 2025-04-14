"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CalendarIcon, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getRecommendations, extractUserPreferences, type RecommendableProduct } from "./recommendation-engine"

interface CalendarBasedRecommendationsProps {
  allProducts: any[] // This should be all products (insurance and financial)
  title?: string
  subtitle?: string
  maxRecommendations?: number
}

export default function CalendarBasedRecommendations({
  allProducts,
  title = "Seasonal Recommendations",
  subtitle = "Products that match your current needs based on the calendar",
  maxRecommendations = 4,
}: CalendarBasedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendableProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1) // 1-12 for January-December

  // Month names for display
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Helper function to check if a date is within the last week
  const isNewThisWeek = (dateString: string): boolean => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24))
    return diffDays <= 7
  }

  useEffect(() => {
    // Transform all products to the common RecommendableProduct format
    const transformedProducts: RecommendableProduct[] = allProducts.map((product) => {
      // Check if it's an insurance product (has insurer) or financial product (has institution)
      const isInsurance = "insurer" in product

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        description: product.description,
        imageUrl: product.imageUrl,
        institution: isInsurance ? product.insurer : product.institution,
        isNew: product.isNew || (product.dateAdded && isNewThisWeek(product.dateAdded)),
        isTrending: product.isTrending,
        isMostPreferred: product.isMostPreferred || product.isPopular,
        isLimitedTime: product.isLimitedTime || product.isHotDeal,
        dateAdded: product.dateAdded || new Date().toISOString(),
        expiresAt: product.expiresAt || product.hotDealEnds,
        // Handle both insurance and financial product specific fields
        currentPrice: isInsurance ? product.currentPrice : undefined,
        originalPrice: isInsurance ? product.originalPrice : undefined,
        currentRate: !isInsurance ? product.currentRate : undefined,
        originalRate: !isInsurance ? product.originalRate : undefined,
        minAmount: product.minAmount,
        maxAmount: product.maxAmount,
        features: product.features,
        tags: product.tags,
      }
    })

    // Get user preferences with the current month
    const userPreferences = {
      ...extractUserPreferences(),
      currentMonth,
    }

    // Get recommendations specifically focused on seasonal relevance
    const recommendedProducts = getRecommendations(transformedProducts, userPreferences, maxRecommendations)

    setRecommendations(recommendedProducts)
    setLoading(false)
  }, [allProducts, maxRecommendations, currentMonth])

  // Format price/rate for display
  const formatValue = (product: RecommendableProduct): string => {
    if (product.currentPrice) {
      // Insurance product
      const price = product.currentPrice
      if (price.currency === "KSH" && price.amount >= 1000) {
        return `${price.currency} ${price.amount.toLocaleString()}`
      }
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: price.currency,
        maximumFractionDigits: 0,
      }).format(price.amount)
    } else if (product.currentRate !== undefined) {
      // Financial product
      return `${product.currentRate}% p.a.`
    }
    return ""
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="py-8 bg-gradient-to-r from-purple-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-2">
            <CalendarIcon className="h-5 w-5 text-purple-600 mr-2" />
            <h2 className="text-2xl font-bold text-purple-800">{title}</h2>
          </div>
          <p className="text-purple-600">{subtitle}</p>

          <div className="mt-4 flex justify-center items-center">
            <Badge variant="outline" className="px-3 py-1 border-purple-300 text-purple-700 bg-purple-50">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Recommendations for {monthNames[currentMonth - 1]}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="overflow-hidden h-full flex flex-col border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300">
                {/* Product image */}
                <div className="relative h-48 bg-purple-100">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {product.isNew && <Badge className="bg-blue-500 hover:bg-blue-600 text-white">New</Badge>}
                    {product.isTrending && (
                      <Badge className="bg-orange-500 hover:bg-orange-600 text-white">Trending</Badge>
                    )}
                  </div>

                  {/* Seasonal badge */}
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span>Seasonal Pick</span>
                    </Badge>
                  </div>
                </div>

                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                      {product.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                      {product.subcategory}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold text-purple-900 mt-2">{product.name}</CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-2 flex-grow flex flex-col">
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">{product.description}</p>

                  {/* Institution/Insurer */}
                  <div className="text-xs text-gray-500 mb-3">
                    By <span className="font-medium text-purple-700">{product.institution}</span>
                  </div>

                  {/* Price/Rate */}
                  <div className="mt-auto">
                    <div className="flex items-end justify-between mb-3">
                      <div className="text-lg font-bold text-purple-700">{formatValue(product)}</div>
                    </div>

                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
