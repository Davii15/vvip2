"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, Clock, Percent, ArrowRight } from "lucide-react"

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

interface CalendarBasedRecommendationsProps {
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

export default function CalendarBasedRecommendations({
  allProducts,
  title,
  subtitle,
}: CalendarBasedRecommendationsProps) {
  const [recommendedProducts, setRecommendedProducts] = useState<FinancialProduct[]>([])
  const [currentSeason, setCurrentSeason] = useState<string>("")
  const [currentEvent, setCurrentEvent] = useState<string>("")

  // Calendar-based recommendation algorithm
  useEffect(() => {
    // Step 1: Determine current season and events
    const now = new Date()
    const month = now.getMonth()
    const day = now.getDate()

    // Determine season
    let season = ""
    if (month >= 2 && month <= 4)
      season = "Spring" // March-May
    else if (month >= 5 && month <= 7)
      season = "Summer" // June-August
    else if (month >= 8 && month <= 10)
      season = "Fall" // September-November
    else season = "Winter" // December-February

    // Determine financial events/periods
    let event = ""
    // Tax season in Kenya (typically around June)
    if (month === 5) event = "Tax Season"
    // End of financial year
    else if (month === 5 && day >= 20) event = "End of Financial Year"
    // Holiday spending season
    else if (month === 11 || month === 0) event = "Holiday Season"
    // Back to school period
    else if (month === 0 || month === 7) event = "Back to School"
    // Harvest season (relevant for agricultural loans)
    else if (month === 9 || month === 10) event = "Harvest Season"

    setCurrentSeason(season)
    setCurrentEvent(event)

    // Step 2: Score products based on seasonal relevance
    const scoredProducts = allProducts.map((product) => {
      let score = 0

      // Season-based scoring
      if (season === "Spring") {
        // Spring: Good time for new investments and growth
        if (product.category === "Investment Opportunities") score += 20
        if (product.subcategory === "ESG Investments") score += 15 // Environmental focus in spring
      } else if (season === "Summer") {
        // Summer: Travel and leisure spending
        if (product.category === "Personal Loans" && product.subcategory === "Short Term") score += 20
        if (product.category === "Savings Accounts" && product.subcategory === "Goal-Based") score += 15
      } else if (season === "Fall") {
        // Fall: Harvest time, agricultural focus
        if (product.category === "Investment Opportunities" && product.subcategory === "Real Estate") score += 20
        if (product.minAmount <= 100000) score += 10 // More accessible products for harvest income
      } else if (season === "Winter") {
        // Winter: Holiday spending and year-end planning
        if (product.category === "Personal Loans") score += 15
        if (product.isLimitedTime) score += 20 // End of year special offers
      }

      // Event-based scoring
      if (event === "Tax Season") {
        if (product.category === "Investment Opportunities") score += 25 // Tax-advantaged investments
        if (product.category === "Savings Accounts") score += 15
      } else if (event === "End of Financial Year") {
        if (product.category === "Investment Opportunities") score += 30
        if (product.isLimitedTime) score += 20
      } else if (event === "Holiday Season") {
        if (product.category === "Personal Loans" && product.subcategory === "Short Term") score += 30
        if (product.discount && product.discount > 10) score += 15
      } else if (event === "Back to School") {
        if (product.category === "Personal Loans") score += 25
        if (product.term.includes("6 months") || product.term.includes("1 year")) score += 15
      } else if (event === "Harvest Season") {
        if (product.category === "Savings Accounts") score += 20
        if (product.category === "Investment Opportunities") score += 15
      }

      // Additional scoring factors
      if (product.isNew) score += 10
      if (product.isTrending) score += 15
      if (product.discount && product.discount > 15) score += product.discount

      return { product, score }
    })

    // Step 3: Sort by score and take top products
    const sortedProducts = scoredProducts
      .sort((a, b) => b.score - a.score)
      .map((item) => item.product)
      .slice(0, 3)

    setRecommendedProducts(sortedProducts)
  }, [allProducts])

  // Get seasonal badge color
  const getSeasonalColor = () => {
    switch (currentSeason) {
      case "Spring":
        return "bg-green-100 text-green-800"
      case "Summer":
        return "bg-yellow-100 text-yellow-800"
      case "Fall":
        return "bg-orange-100 text-orange-800"
      case "Winter":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-purple-100 text-purple-800"
    }
  }

  // Get event badge color
  const getEventColor = () => {
    switch (currentEvent) {
      case "Tax Season":
        return "bg-red-100 text-red-800"
      case "End of Financial Year":
        return "bg-indigo-100 text-indigo-800"
      case "Holiday Season":
        return "bg-pink-100 text-pink-800"
      case "Back to School":
        return "bg-cyan-100 text-cyan-800"
      case "Harvest Season":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 py-8 px-4 rounded-xl border border-purple-200 mb-8">
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold text-purple-800">{title}</h2>
          {currentSeason && <Badge className={getSeasonalColor()}>{currentSeason}</Badge>}
          {currentEvent && <Badge className={getEventColor()}>{currentEvent}</Badge>}
        </div>
        <p className="text-purple-700">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedProducts.map((product) => (
          <motion.div key={product.id} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <Card className="overflow-hidden h-full border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300 bg-white">
              {/* Product image */}
              <div className="relative h-40 bg-gradient-to-br from-purple-50 to-indigo-50">
                <Image
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />

                {/* Seasonal badge */}
                <div className="absolute top-2 left-2">
                  <Badge className={getSeasonalColor() + " flex items-center gap-1 text-xs"}>
                    <Calendar className="h-3 w-3" />
                    <span>{currentSeason} Pick</span>
                  </Badge>
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
                  <div className="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
                    {product.institution.substring(0, 2).toUpperCase()}
                  </div>
                </div>
              </div>

              <CardContent className="p-3">
                <div className="mb-1">
                  <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                    {product.category}
                  </Badge>
                </div>

                <h3 className="font-semibold text-purple-900 text-sm mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>

                <div className="flex items-end justify-between mt-2">
                  <div>
                    <div className="text-base font-bold text-purple-700">{product.currentRate}% p.a.</div>
                    {product.originalRate !== product.currentRate && (
                      <div className="text-xs text-gray-500 line-through">{product.originalRate}% p.a.</div>
                    )}
                  </div>

                  {product.discount && product.discount > 0 ? (
                    <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1 text-xs">
                      <Percent className="h-3 w-3" />
                      <span>Save {product.discount}%</span>
                    </Badge>
                  ) : (
                    currentEvent && (
                      <Badge className={getEventColor() + " flex items-center gap-1 text-xs"}>
                        <Calendar className="h-3 w-3" />
                        <span>{currentEvent}</span>
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
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          View All Seasonal Offers <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
