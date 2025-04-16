"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import { Star, TrendingUp, Clock, Percent, ArrowRight } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface FinancialProduct {
  id: string
  name: string
  institution: string
  imageUrl: string
  category: string
  subcategory: string
  currentRate: number
  originalRate: number
  description: string
  features: string[]
  requirements: string[]
  minAmount: number
  maxAmount: number
  term: string
  isNew: boolean
  isTrending: boolean
  isMostPreferred: boolean
  isLimitedTime: boolean
  expiresAt?: string
  discount?: number
}

interface FinanceRecommendationsProps {
  allProducts: FinancialProduct[]
  title: string
  subtitle: string
}

// Helper function to format KSh currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-KE", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function FinanceRecommendations({ allProducts, title, subtitle }: FinanceRecommendationsProps) {
  const [recommendedProducts, setRecommendedProducts] = useState<FinancialProduct[]>([])
  const [viewedProducts, setViewedProducts] = useLocalStorage<string[]>("viewedFinanceProducts", [])
  const [userPreferences, setUserPreferences] = useLocalStorage<{
    categories: Record<string, number>
    priceRanges: Record<string, number>
    institutions: Record<string, number>
  }>("financePreferences", {
    categories: {},
    priceRanges: {},
    institutions: {},
  })

  // Recommendation algorithm
  useEffect(() => {
    // Step 1: Score each product based on multiple factors
    const scoredProducts = allProducts.map((product) => {
      let score = 0

      // Factor 1: User's category preferences (weighted heavily)
      const categoryScore = userPreferences.categories[product.category] || 0
      score += categoryScore * 3

      // Factor 2: User's price range preferences
      const priceRangeKey = getPriceRangeKey(product.minAmount)
      const priceRangeScore = userPreferences.priceRanges[priceRangeKey] || 0
      score += priceRangeScore * 2

      // Factor 3: User's institution preferences
      const institutionScore = userPreferences.institutions[product.institution] || 0
      score += institutionScore * 1.5

      // Factor 4: Product attributes (boost certain products)
      if (product.isNew) score += 10
      if (product.isTrending) score += 15
      if (product.isMostPreferred) score += 20
      if (product.isLimitedTime) score += 25
      if (product.discount && product.discount > 15) score += product.discount

      // Factor 5: Novelty - prioritize products user hasn't viewed
      if (!viewedProducts.includes(product.id)) {
        score += 30
      }

      // Factor 6: Seasonal relevance (example: tax season, holiday spending)
      const month = new Date().getMonth()
      if (
        (month === 11 || month === 0) && // December or January
        (product.category === "Personal Loans" || product.subcategory === "Short Term")
      ) {
        score += 15 // Holiday spending needs
      }

      if (month >= 2 && month <= 3) {
        // March-April
        if (product.category === "Investment Opportunities") {
          score += 20 // Tax season investment opportunities
        }
      }

      return { product, score }
    })

    // Step 2: Sort by score and take top 3-4 products
    const sortedProducts = scoredProducts
      .sort((a, b) => b.score - a.score)
      .map((item) => item.product)
      .slice(0, 4)

    // Step 3: Ensure diversity in recommendations (at least one from each major category if possible)
    const categories = ["Personal Loans", "Investment Opportunities", "Savings Accounts"]
    const diverseRecommendations: FinancialProduct[] = []

    // First, try to include one from each major category
    for (const category of categories) {
      const productFromCategory = sortedProducts.find((p) => p.category === category)
      if (productFromCategory && !diverseRecommendations.includes(productFromCategory)) {
        diverseRecommendations.push(productFromCategory)
        if (diverseRecommendations.length >= 3) break
      }
    }

    // Fill remaining slots with highest scored products not already included
    for (const product of sortedProducts) {
      if (!diverseRecommendations.includes(product) && diverseRecommendations.length < 4) {
        diverseRecommendations.push(product)
      }
    }

    setRecommendedProducts(diverseRecommendations)
  }, [allProducts, userPreferences, viewedProducts])

  // Helper function to categorize price ranges
  const getPriceRangeKey = (amount: number): string => {
    if (amount < 50000) return "low"
    if (amount < 500000) return "medium"
    return "high"
  }

  // Simulate user interaction to update preferences
  const handleProductClick = (product: FinancialProduct) => {
    // Update viewed products
    if (!viewedProducts.includes(product.id)) {
      setViewedProducts([...viewedProducts, product.id])
    }

    // Update category preferences
    const updatedCategories = { ...userPreferences.categories }
    updatedCategories[product.category] = (updatedCategories[product.category] || 0) + 1

    // Update price range preferences
    const priceRangeKey = getPriceRangeKey(product.minAmount)
    const updatedPriceRanges = { ...userPreferences.priceRanges }
    updatedPriceRanges[priceRangeKey] = (updatedPriceRanges[priceRangeKey] || 0) + 1

    // Update institution preferences
    const updatedInstitutions = { ...userPreferences.institutions }
    updatedInstitutions[product.institution] = (updatedInstitutions[product.institution] || 0) + 1

    // Save updated preferences
    setUserPreferences({
      categories: updatedCategories,
      priceRanges: updatedPriceRanges,
      institutions: updatedInstitutions,
    })
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-100 py-8 px-4 rounded-xl border border-amber-200 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-amber-800">{title}</h2>
        <p className="text-amber-700">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendedProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            onClick={() => handleProductClick(product)}
          >
            <Card className="overflow-hidden h-full border-amber-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 bg-white">
              {/* Product image */}
              <div className="relative h-40 bg-gradient-to-br from-amber-50 to-yellow-50">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isNew && <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs">New</Badge>}
                  {product.isTrending && (
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1 text-xs">
                      <TrendingUp className="h-3 w-3" />
                      <span>Trending</span>
                    </Badge>
                  )}
                </div>

                {/* Limited time offer */}
                {product.isLimitedTime && product.expiresAt && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>Limited Time</span>
                    </Badge>
                  </div>
                )}

                {/* Institution logo */}
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-md">
                  <div className="h-6 w-6 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-xs">
                    {product.institution.substring(0, 2).toUpperCase()}
                  </div>
                </div>
              </div>

              <CardContent className="p-3">
                <div className="mb-1">
                  <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                    {product.category}
                  </Badge>
                </div>

                <h3 className="font-semibold text-amber-900 text-sm mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>

                <div className="flex items-end justify-between mt-2">
                  <div>
                    <div className="text-base font-bold text-amber-700">{product.currentRate}% p.a.</div>
                    {product.originalRate !== product.currentRate && (
                      <div className="text-xs text-gray-500 line-through">{product.originalRate}% p.a.</div>
                    )}
                  </div>

                  {product.discount && product.discount > 0 ? (
                    <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1 text-xs">
                      <Percent className="h-3 w-3" />
                      <span>Save {product.discount}%</span>
                    </Badge>
                  ) : (
                    product.isMostPreferred && (
                      <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3" />
                        <span>Top Pick</span>
                      </Badge>
                    )
                  )}
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  KSh {formatCurrency(product.minAmount)} - KSh {formatCurrency(product.maxAmount)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          View All Recommendations <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
