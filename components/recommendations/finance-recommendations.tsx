"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Calendar, TrendingUp, Clock, Percent } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getRecommendations, extractUserPreferences, type RecommendableProduct } from "./recommendation-engine"

interface FinanceRecommendationsProps {
  allProducts: any[] // This should be the financial products from your page
  title?: string
  subtitle?: string
  maxRecommendations?: number
}

export default function FinanceRecommendations({
  allProducts,
  title = "Recommended Financial Products",
  subtitle = "Personalized recommendations based on your financial needs",
  maxRecommendations = 4,
}: FinanceRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendableProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Transform financial products to the common RecommendableProduct format
    const transformedProducts: RecommendableProduct[] = allProducts.map((product) => {
      return {
        id: product.id,
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        description: product.description,
        imageUrl: product.imageUrl,
        institution: product.institution,
        isNew: product.isNew,
        isTrending: product.isTrending,
        isMostPreferred: product.isMostPreferred,
        isLimitedTime: product.isLimitedTime,
        dateAdded: product.dateAdded || new Date().toISOString(),
        expiresAt: product.expiresAt,
        currentRate: product.currentRate,
        originalRate: product.originalRate,
        minAmount: product.minAmount,
        maxAmount: product.maxAmount,
        features: product.features,
        discount: product.discount,
      }
    })

    // Get user preferences
    const userPreferences = extractUserPreferences()

    // Get recommendations
    const recommendedProducts = getRecommendations(transformedProducts, userPreferences, maxRecommendations)

    setRecommendations(recommendedProducts)
    setLoading(false)
  }, [allProducts, maxRecommendations])

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="py-8 bg-gradient-to-r from-green-50 to-green-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-2">
            <Calendar className="h-5 w-5 text-green-600 mr-2" />
            <h2 className="text-2xl font-bold text-green-800">{title}</h2>
          </div>
          <p className="text-green-600">{subtitle}</p>
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
              <Card className="overflow-hidden h-full flex flex-col border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-300">
                {/* Product image */}
                <div className="relative h-48 bg-green-100">
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
                    <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                      {product.subcategory}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-green-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">{product.description}</p>

                  {/* Institution */}
                  <div className="text-xs text-gray-500 mb-3">
                    Offered by <span className="font-medium text-green-700">{product.institution}</span>
                  </div>

                  {/* Rate and amount */}
                  <div className="mt-auto">
                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <div className="text-lg font-bold text-green-700">{product.currentRate}% p.a.</div>
                        {product.originalRate !== product.currentRate && (
                          <div className="text-sm text-gray-500 line-through">{product.originalRate}% p.a.</div>
                        )}
                      </div>

                      {product.minAmount && product.maxAmount && (
                        <div className="text-xs text-gray-600">
                          {formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      {product.discount && product.discount > 0 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-700 hover:bg-green-50 flex items-center justify-center gap-1"
                        >
                          <Percent className="h-3 w-3" />
                          <span>Save {product.discount}%</span>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-700 hover:bg-green-50"
                        >
                          Details
                        </Button>
                      )}

                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        Apply Now
                      </Button>
                    </div>
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
