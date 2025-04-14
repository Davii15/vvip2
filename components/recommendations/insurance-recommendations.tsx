"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Calendar, ChevronRight, Shield, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getRecommendations, extractUserPreferences, type RecommendableProduct } from "./recommendation-engine"
import { isNewThisWeek } from "@/utils/date-utils"

interface InsuranceRecommendationsProps {
  allProducts: any[] // This should be the insurance products from of the page
  title?: string
  subtitle?: string
  maxRecommendations?: number
}

export default function InsuranceRecommendations({
  allProducts,
  title = "Recommended for You",
  subtitle = "Insurance plans tailored to your needs",
  maxRecommendations = 4,
}: InsuranceRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendableProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Transform insurance products to the common RecommendableProduct format
    const transformedProducts: RecommendableProduct[] = allProducts.map((product) => {
      return {
        id: product.id,
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        description: product.description,
        imageUrl: product.imageUrl,
        insurer: product.insurer,
        isNew: product.isNew || isNewThisWeek(product.dateAdded),
        isTrending: product.isTrending,
        isMostPreferred: product.isPopular,
        isLimitedTime: product.isLimitedTime || product.isHotDeal,
        dateAdded: product.dateAdded,
        expiresAt: product.hotDealEnds || product.expiresAt,
        currentPrice: product.currentPrice,
        originalPrice: product.originalPrice,
        features: product.features,
        tags: product.tags,
        discount:
          product.discount ||
          Math.round(
            ((product.originalPrice?.amount - product.currentPrice?.amount) / product.originalPrice?.amount) * 100,
          ),
      }
    })

    // Get user preferences
    const userPreferences = extractUserPreferences()

    // Get recommendations
    const recommendedProducts = getRecommendations(transformedProducts, userPreferences, maxRecommendations)

    setRecommendations(recommendedProducts)
    setLoading(false)
  }, [allProducts, maxRecommendations])

  // Format price for display
  const formatPrice = (price: any): string => {
    if (!price) return ""

    if (price.currency === "KSH" && price.amount >= 1000) {
      return `${price.currency} ${price.amount.toLocaleString()}`
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currency,
      maximumFractionDigits: 0,
    }).format(price.amount)
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="py-8 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-2">
            <Calendar className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-blue-800">{title}</h2>
          </div>
          <p className="text-blue-600">{subtitle}</p>
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
              <Card className="overflow-hidden h-full flex flex-col border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300">
                {/* Product image */}
                <div className="relative h-48 bg-blue-100">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {product.isNew && <Badge className="bg-blue-500 hover:bg-blue-600 text-white">New</Badge>}
                    {product.isTrending && (
                      <Badge className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>Trending</span>
                      </Badge>
                    )}
                  </div>

                  {/* Limited time offer */}
                  {product.isLimitedTime && product.expiresAt && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Limited Time</span>
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4 flex-grow flex flex-col">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                      {product.subcategory}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-blue-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">{product.description}</p>

                  {/* Institution/Insurer */}
                  <div className="text-xs text-gray-500 mb-3 flex items-center">
                    <Shield className="h-3 w-3 mr-1 text-blue-500" />
                    <span>{product.insurer}</span>
                  </div>

                  {/* Price */}
                  <div className="mt-auto">
                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <div className="text-lg font-bold text-blue-700">{formatPrice(product.currentPrice)}</div>
                        {product.originalPrice &&
                          product.currentPrice &&
                          product.originalPrice.amount !== product.currentPrice.amount && (
                            <div className="text-sm text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </div>
                          )}
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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
