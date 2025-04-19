"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface Price {
  amount: number
  currency: string
}

interface SportsProduct {
  id: number | string
  name: string
  imageUrl: string
  currentPrice: Price
  originalPrice: Price
  category: string
  subcategory?: string
  brand: string
  description: string
  rating?: number
  reviewCount?: number
  discount?: number
  gender?: "Men" | "Women" | "Unisex"
  sport?: string
  instrumentType?: string
}

interface SportsRecommendationsProps {
  allProducts: SportsProduct[]
}

// Helper function to format price
const formatPrice = (price: Price): string => {
  if (price.currency === "KSH" && price.amount >= 1000) {
    return `${price.currency} ${price.amount.toLocaleString()}`
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount)
}

export default function SportsRecommendations({ allProducts }: SportsRecommendationsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Filter products to get recommendations
  // For this example, we'll just use products with a discount of 20% or more
  const recommendedProducts = allProducts.filter((product) => (product.discount || 0) >= 20).slice(0, 8) // Limit to 8 products

  const productsPerView = 4 // Number of products to show at once
  const maxIndex = Math.max(0, recommendedProducts.length - productsPerView)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0))
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-700/50 mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Recommended For You</h2>
            <p className="text-slate-300">Top picks based on your interests</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-green-500/50 text-green-400 hover:bg-green-900/30 hover:text-green-300"
              onClick={prevSlide}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-green-500/50 text-green-400 hover:bg-green-900/30 hover:text-green-300"
              onClick={nextSlide}
              disabled={currentIndex === maxIndex}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-4"
            initial={{ x: 0 }}
            animate={{ x: -currentIndex * (100 / productsPerView) + "%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: `${(recommendedProducts.length / productsPerView) * 100}%` }}
          >
            {recommendedProducts.map((product, index) => (
              <div
                key={product.id}
                className="w-full md:w-1/2 lg:w-1/4 px-2"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Card className="h-full overflow-hidden border-slate-700/50 bg-slate-800/40 backdrop-blur-sm hover:border-green-500/70 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
                  <div className="relative h-48 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-50"></div>
                    <Image
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />

                    {/* Discount badge */}
                    {product.discount && product.discount > 0 && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-red-500 hover:bg-red-600 text-white">{product.discount}% OFF</Badge>
                      </div>
                    )}

                    {/* Category badge */}
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-green-600/80 hover:bg-green-600 text-white">{product.category}</Badge>
                    </div>

                    {/* Hover actions */}
                    <motion.div
                      className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button size="icon" className="rounded-full bg-white text-slate-900 hover:bg-green-300 h-10 w-10">
                        <ShoppingCart className="h-5 w-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full border-white text-white hover:bg-white/20 h-10 w-10"
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs text-green-300">{product.brand}</span>
                      {product.gender && (
                        <Badge variant="outline" className="text-xs border-green-500 text-green-300">
                          {product.gender}
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-semibold text-green-100 mb-1 line-clamp-1">{product.name}</h3>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating || 0)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-green-700"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-1 text-xs text-green-300">({product.reviewCount})</span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-lg font-bold text-green-100">{formatPrice(product.currentPrice)}</div>
                        {product.originalPrice.amount !== product.currentPrice.amount && (
                          <div className="text-sm text-green-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
