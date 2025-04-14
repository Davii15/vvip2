"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Sun, Moon, UtensilsCrossed } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

// Define the time periods
export type TimePeriod = "morning" | "afternoon" | "evening" | "night"

// Generic product interface that can be extended
export interface BaseProduct {
  id: string | number
  name: string
  description: string
  image?: string
  imageUrl?: string
  price?: number | { amount: number; currency: string }
  currentPrice?: { amount: number; currency: string }
  originalPrice?: { amount: number; currency: string }
  recommendedTimes?: TimePeriod[]
  category?: string
  tags?: string[]
  url?: string
}

interface TimeBasedRecommendationsProps<T extends BaseProduct> {
  products: T[]
  title?: string
  subtitle?: string
  colorScheme?: string
  maxProducts?: number
  showTimeIndicator?: boolean
  timeOverride?: TimePeriod // For testing different time periods
  onProductClick?: (product: T) => void
}

export function TimeBasedRecommendations<T extends BaseProduct>({
  products,
  title = "Recommended For You Right Now",
  subtitle = "Based on the current time of day",
  colorScheme = "blue",
  maxProducts = 4,
  showTimeIndicator = true,
  timeOverride,
  onProductClick,
}: TimeBasedRecommendationsProps<T>) {
  const [currentTimePeriod, setCurrentTimePeriod] = useState<TimePeriod>("morning")
  const [filteredProducts, setFilteredProducts] = useState<T[]>([])

  // Determine color classes based on colorScheme
  const getColorClasses = () => {
    switch (colorScheme) {
      case "pink": // For beauty products
        return {
          gradient: "from-pink-500 to-purple-600",
          badge: "bg-pink-100 text-pink-800",
          button: "bg-pink-500 hover:bg-pink-600",
          icon: "text-pink-500",
          border: "border-pink-200",
        }
      case "green": // For hospitality
        return {
          gradient: "from-emerald-500 to-teal-600",
          badge: "bg-emerald-100 text-emerald-800",
          button: "bg-emerald-500 hover:bg-emerald-600",
          icon: "text-emerald-500",
          border: "border-emerald-200",
        }
      case "amber": // For tourism
        return {
          gradient: "from-amber-500 to-orange-600",
          badge: "bg-amber-100 text-amber-800",
          button: "bg-amber-500 hover:bg-amber-600",
          icon: "text-amber-500",
          border: "border-amber-200",
        }
      case "blue": // For drinks
        return {
          gradient: "from-blue-500 to-indigo-600",
          badge: "bg-blue-100 text-blue-800",
          button: "bg-blue-500 hover:bg-blue-600",
          icon: "text-blue-500",
          border: "border-blue-200",
        }
      default: // Default blue
        return {
          gradient: "from-blue-500 to-indigo-600",
          badge: "bg-blue-100 text-blue-800",
          button: "bg-blue-500 hover:bg-blue-600",
          icon: "text-blue-500",
          border: "border-blue-200",
        }
    }
  }

  const colors = getColorClasses()

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
        return <UtensilsCrossed className={`h-5 w-5 ${colors.icon}`} />
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

  // Alternative version that preserves currency in objects but defaults to KSH for numbers:

  // Format price for display
  const formatPrice = (price: number | { amount: number; currency: string } | undefined): string => {
    if (!price) return ""

    if (typeof price === "number") {
      return `KSH ${price.toFixed(2)}` // Always use KSH for number values
    } else {
      // Use the currency from the object, or default to KSH if not present
      const currency = price.currency || "KSH"
      return `${currency} ${price.amount.toFixed(2)}`
    }
  }

  // Update time period and filter products
  useEffect(() => {
    // Use override if provided, otherwise get current time
    const period = timeOverride || getTimePeriod(new Date().getHours())
    setCurrentTimePeriod(period)

    // Filter products based on time period
    const filtered = products.filter((product) => {
      // If product has no recommendedTimes, include it in all periods
      if (!product.recommendedTimes || product.recommendedTimes.length === 0) {
        return true
      }
      return product.recommendedTimes.includes(period)
    })

    // Limit to maxProducts
    setFilteredProducts(filtered.slice(0, maxProducts))
  }, [products, maxProducts, timeOverride])

  // If no products match the current time period, don't render the component
  if (filteredProducts.length === 0) {
    return null
  }

  return (
    <div className="my-8">
      <div className={`bg-gradient-to-r ${colors.gradient} text-white p-6 rounded-lg shadow-lg mb-6`}>
        <h2 className="text-2xl font-bold mb-1">{title}</h2>
        <p className="text-white/80">{subtitle}</p>

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
              onClick={() => onProductClick && onProductClick(product)}
            >
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={product.image || product.imageUrl || "/placeholder.svg?height=300&width=300"}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                />
                {product.category && (
                  <Badge className={`absolute top-2 right-2 ${colors.badge}`}>{product.category}</Badge>
                )}
              </div>
              <CardContent className="p-4 flex-grow flex flex-col">
                <h3 className="font-bold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>

                <div className="flex justify-between items-center mt-auto">
                  <span className="font-bold text-lg">{formatPrice(product.price || product.currentPrice)}</span>
                  {product.url ? (
                    <Link href={product.url}>
                      <Button className={colors.button} size="sm">
                        View Details
                      </Button>
                    </Link>
                  ) : (
                    <Button className={colors.button} size="sm">
                      View Details
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
