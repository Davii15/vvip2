"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Sun, Sunset, Moon, Sparkles, ChevronRight, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Price {
  amount: number
  currency: string
}

interface BeautyProduct {
  id: string
  name: string
  imageUrl: string
  currentPrice: Price
  originalPrice: Price
  category: string
  subcategory: string
  brand: string
  description: string
  rating?: number
  isNew?: boolean
}

interface Vendor {
  id: string
  name: string
  products: BeautyProduct[]
}

interface TimeBasedRecommendation {
  timeOfDay: string
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
  textColor: string
  products: BeautyProduct[]
}

interface TimeBasedBeautyRecommendationsProps {
  vendors: Vendor[]
  onProductClick: (product: BeautyProduct) => void
}

const formatPrice = (price: { amount: number; currency: string }): string => {
  if (price.currency === "KSH" && price.amount >= 1000) {
    return `${price.currency} ${price.amount.toLocaleString()}`
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount)
}

export function TimeBasedBeautyRecommendations({ vendors, onProductClick }: TimeBasedBeautyRecommendationsProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  const allProducts = useMemo(() => {
    return vendors.flatMap((vendor) => vendor.products)
  }, [vendors])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const getTimeBasedRecommendations = useMemo((): TimeBasedRecommendation => {
    const hour = currentTime.getHours()

    if (hour >= 6 && hour < 12) {
      // Morning (6 AM - 12 PM): Energizing and protective products
      const morningProducts = allProducts
        .filter(
          (product) =>
            (product.category === "skincare" &&
              ((product.subcategory === "serums" && product.name.toLowerCase().includes("vitamin c")) ||
                product.name.toLowerCase().includes("spf") ||
                (product.name.toLowerCase().includes("moisturizer") && product.name.toLowerCase().includes("day")))) ||
            (product.category === "makeup" &&
              ((product.subcategory === "face" && product.name.toLowerCase().includes("primer")) ||
                product.name.toLowerCase().includes("foundation"))) ||
            (product.category === "fragrance" && product.name.toLowerCase().includes("citrus")),
        )
        .slice(0, 4)

      return {
        timeOfDay: "morning",
        icon: <Sun className="h-5 w-5" />,
        title: "Morning Glow Essentials",
        description: "Start your day with energizing skincare and fresh makeup",
        gradient: "from-amber-400 to-orange-500",
        textColor: "text-amber-100",
        products: morningProducts,
      }
    } else if (hour >= 12 && hour < 18) {
      // Afternoon (12 PM - 6 PM): Touch-up and refreshing products
      const afternoonProducts = allProducts
        .filter(
          (product) =>
            (product.category === "makeup" &&
              ((product.subcategory === "lips" && product.name.toLowerCase().includes("balm")) ||
                product.name.toLowerCase().includes("mascara") ||
                product.name.toLowerCase().includes("eyeliner"))) ||
            (product.category === "skincare" && product.name.toLowerCase().includes("hydrating")) ||
            (product.category === "bodycare" && product.name.toLowerCase().includes("mist")) ||
            (product.category === "fragrance" && product.name.toLowerCase().includes("fresh")),
        )
        .slice(0, 4)

      return {
        timeOfDay: "afternoon",
        icon: <Sparkles className="h-5 w-5" />,
        title: "Midday Refresh",
        description: "Perfect touch-ups and refreshing products for your busy day",
        gradient: "from-sky-400 to-blue-500",
        textColor: "text-sky-100",
        products: afternoonProducts,
      }
    } else if (hour >= 18 && hour < 22) {
      // Evening (6 PM - 10 PM): Relaxing and cleansing products
      const eveningProducts = allProducts
        .filter(
          (product) =>
            (product.category === "skincare" &&
              (product.subcategory === "cleansers" || product.name.toLowerCase().includes("balm"))) ||
            (product.category === "makeup" &&
              product.subcategory === "lips" &&
              product.name.toLowerCase().includes("matte")) ||
            (product.category === "bodycare" && product.name.toLowerCase().includes("lavender")) ||
            (product.category === "fragrance" && product.name.toLowerCase().includes("floral")),
        )
        .slice(0, 4)

      return {
        timeOfDay: "evening",
        icon: <Sunset className="h-5 w-5" />,
        title: "Evening Wind Down",
        description: "Cleanse away the day and prepare for relaxation",
        gradient: "from-purple-500 to-pink-600",
        textColor: "text-purple-100",
        products: eveningProducts,
      }
    } else {
      // Night (10 PM - 6 AM): Overnight treatments and repair
      const nightProducts = allProducts
        .filter(
          (product) =>
            (product.category === "skincare" &&
              (product.name.toLowerCase().includes("night") ||
                (product.subcategory === "serums" &&
                  (product.name.toLowerCase().includes("retinol") ||
                    product.name.toLowerCase().includes("bakuchiol") ||
                    product.name.toLowerCase().includes("repair"))) ||
                product.name.toLowerCase().includes("peptides"))) ||
            (product.category === "haircare" && product.name.toLowerCase().includes("treatment")) ||
            (product.category === "bodycare" && product.name.toLowerCase().includes("nourishing")),
        )
        .slice(0, 4)

      return {
        timeOfDay: "night",
        icon: <Moon className="h-5 w-5" />,
        title: "Overnight Recovery",
        description: "Intensive treatments that work while you sleep",
        gradient: "from-indigo-600 to-purple-700",
        textColor: "text-indigo-100",
        products: nightProducts,
      }
    }
  }, [currentTime, allProducts])

  const recommendation = getTimeBasedRecommendations

  if (recommendation.products.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl"
      >
        <div className={`bg-gradient-to-r ${recommendation.gradient} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">{recommendation.icon}</div>
              <div>
                <h3 className={`text-xl font-bold ${recommendation.textColor}`}>{recommendation.title}</h3>
                <p className={`text-sm ${recommendation.textColor}/80`}>{recommendation.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="wait">
              {recommendation.products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-4" onClick={() => onProductClick(product)}>
                      <div className="aspect-square bg-white/20 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={product.imageUrl || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <h4 className={`font-semibold text-sm ${recommendation.textColor} line-clamp-2`}>
                          {product.name}
                        </h4>

                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                            {product.brand}
                          </Badge>
                          {product.isNew && <Badge className="bg-green-500 text-white text-xs">New</Badge>}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className={`${recommendation.textColor}`}>
                            <div className="font-bold text-sm">{formatPrice(product.currentPrice)}</div>
                            {product.originalPrice.amount !== product.currentPrice.amount && (
                              <div className={`text-xs line-through ${recommendation.textColor}/60`}>
                                {formatPrice(product.originalPrice)}
                              </div>
                            )}
                          </div>

                          {product.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className={`text-xs ${recommendation.textColor}/80`}>{product.rating}</span>
                            </div>
                          )}
                        </div>

                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            onProductClick(product)
                          }}
                        >
                          View Details
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
