"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Sun, Moon, Leaf, Apple } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { formatPrice } from "../utils/helpers"
import type { Product } from "../types"
import type { TimePeriod } from "@/components/TimeBasedRecommendations"

interface RetailTimeRecommendationsProps {
  products: Product[]
  title?: string
  subtitle?: string
  maxProducts?: number
  showTimeIndicator?: boolean
  timeOverride?: TimePeriod // For testing different time periods
}

export default function RetailTimeRecommendations({
  products,
  title = "Recommended For You Right Now",
  subtitle = "Based on the current time of day",
  maxProducts = 4,
  showTimeIndicator = true,
  timeOverride,
}: RetailTimeRecommendationsProps) {
  const [currentTimePeriod, setCurrentTimePeriod] = useState<TimePeriod>("morning")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  // Get color classes for the retail shop
  const colors = {
    gradient: "from-green-500 to-emerald-600",
    badge: "bg-green-100 text-green-800",
    button: "bg-green-500 hover:bg-green-600",
    icon: "text-green-500",
    border: "border-green-200",
  }

  // Get time period based on hour
  const getTimePeriod = (hour: number): TimePeriod => {
    if (hour >= 5 && hour < 12) return "morning"
    if (hour >= 12 && hour < 17) return "afternoon"
    if (hour >= 17 && hour < 21) return "evening"
    return "night"
  }

  // Get time period icon
  const getTimeIcon = () => {
    switch (currentTimePeriod) {
      case "morning":
        return <Sun className={`h-5 w-5 ${colors.icon}`} />
      case "afternoon":
        return <Sun className={`h-5 w-5 ${colors.icon}`} />
      case "evening":
        return <Leaf className={`h-5 w-5 ${colors.icon}`} />
      case "night":
        return <Moon className={`h-5 w-5 ${colors.icon}`} />
      default:
        return <Clock className={`h-5 w-5 ${colors.icon}`} />
    }
  }

  // Get time period display name
  const getTimePeriodName = () => {
    switch (currentTimePeriod) {
      case "morning":
        return "Morning"
      case "afternoon":
        return "Afternoon"
      case "evening":
        return "Evening"
      case "night":
        return "Night"
      default:
        return "Current Time"
    }
  }

  // Get category based on time period
  const getCategoryForTimePeriod = (period: TimePeriod): string => {
    // Morning and afternoon: recommend fruits
    if (period === "morning" || period === "afternoon") {
      return "fruits"
    }
    // Evening and night: recommend vegetables
    return "vegetables"
  }

  // Update time period and filter products
  useEffect(() => {
    // Use override if provided, otherwise get current time
    const period = timeOverride || getTimePeriod(new Date().getHours())
    setCurrentTimePeriod(period)

    // Get the category to recommend based on time period
    const recommendedCategory = getCategoryForTimePeriod(period)

    // Filter products based on category
    const filtered = products.filter((product) => {
      return product.category === recommendedCategory
    })

    // Sort by rating to show the best products first
    const sorted = [...filtered].sort((a, b) => b.rating - a.rating)

    // Limit to maxProducts
    setFilteredProducts(sorted.slice(0, maxProducts))
  }, [products, maxProducts, timeOverride])

  // If no products match the current time period, don't render the component
  if (filteredProducts.length === 0) {
    return null
  }

  // Get recommendation message based on time period
  const getRecommendationMessage = () => {
    switch (currentTimePeriod) {
      case "morning":
        return "Start your day with these fresh fruits"
      case "afternoon":
        return "Perfect fruits for your midday energy boost"
      case "evening":
        return "Nutritious vegetables for your evening meal"
      case "night":
        return "Healthy vegetables for a light night meal"
      default:
        return subtitle
    }
  }

  // Get icon based on category
  const getCategoryIcon = (category: string) => {
    return category === "fruits" ? <Apple className="h-4 w-4 mr-1" /> : <Leaf className="h-4 w-4 mr-1" />
  }

  return (
    <div className="my-8">
      <div className={`bg-gradient-to-r ${colors.gradient} text-white p-6 rounded-lg shadow-lg mb-6`}>
        <h2 className="text-2xl font-bold mb-1">{title}</h2>
        <p className="text-white/80">{getRecommendationMessage()}</p>

        {showTimeIndicator && (
          <div className="flex items-center mt-3 bg-white/20 p-2 rounded-full inline-block">
            {getTimeIcon()}
            <span className="ml-2 font-medium">{getTimePeriodName()} Recommendations</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card
              className={`overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col border ${colors.border}`}
            >
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={product.image || "/placeholder.svg?height=300&width=300"}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                />
                {product.category && (
                  <Badge className={`absolute top-2 right-2 ${colors.badge}`}>
                    <div className="flex items-center">
                      {getCategoryIcon(product.category)}
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </div>
                  </Badge>
                )}
                {product.isOrganic && (
                  <Badge className="absolute top-2 left-2 bg-green-100 text-green-800">
                    <Leaf className="h-3 w-3 mr-1" />
                    Organic
                  </Badge>
                )}
              </div>
              <CardContent className="p-4 flex-grow flex flex-col">
                <h3 className="font-bold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>

                <div className="flex justify-between items-center mt-auto">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">{formatPrice(product.currentPrice)}</span>
                    {product.originalPrice.amount > product.currentPrice.amount && (
                      <span className="text-sm line-through text-gray-400">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  <Button className={colors.button} size="sm">
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
