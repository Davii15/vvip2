"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useProductRecommendations } from "@/hooks/useProductRecommendations"

// Types
interface Price {
  amount: number
  currency: string
}

interface Product {
  id: number | string
  name: string
  imageUrl: string
  currentPrice: Price
  originalPrice: Price
  category?: string
  dateAdded: string
  isNew?: boolean
  isHotDeal?: boolean
  hotDealEnds?: string
  description?: string
  originalRate?:number
  currentRate?:number
  // Other product properties...
}

interface NewProductsForYouProps {
  allProducts: Product[]
  currentProductId?: number | string
  colorScheme: "blue" | "green" | "purple" | "amber" | "red"
  maxProducts?: number
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

// Helper function to format date
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export default function NewProductsForYou({
  allProducts,
  currentProductId,
  colorScheme,
  maxProducts = 4,
}: NewProductsForYouProps) {
  const { newProducts, relatedProducts, lastVisitDate, hasViewedBefore } = useProductRecommendations(
    allProducts,
    currentProductId,
  )

  const [displayProducts, setDisplayProducts] = useState<Product[]>([])
  const [showType, setShowType] = useState<"new" | "related">("new")

  useEffect(() => {
    // Prioritize new products, fall back to related if no new products
    if (newProducts.length > 0) {
      setDisplayProducts(newProducts.slice(0, maxProducts))
      setShowType("new")
    } else if (relatedProducts.length > 0) {
      setDisplayProducts(relatedProducts.slice(0, maxProducts))
      setShowType("related")
    } else {
      setDisplayProducts([])
    }
  }, [newProducts, relatedProducts, maxProducts])

  // If no products to display or user hasn't visited before, don't render anything
  if (displayProducts.length === 0) return null

  // Get color scheme based on the page
  const getColors = () => {
    switch (colorScheme) {
      case "green":
        return {
          gradient: "from-emerald-500/20 to-teal-500/20",
          accent: "from-emerald-500 to-teal-600",
          text: "text-emerald-800",
          badge: "bg-emerald-100 text-emerald-800",
          button: "bg-emerald-600 hover:bg-emerald-700",
          highlight: "text-emerald-600",
          border: "border-emerald-200",
          glow: "from-emerald-400/30 via-transparent to-transparent",
        }
      case "purple":
        return {
          gradient: "from-purple-500/20 to-indigo-500/20",
          accent: "from-purple-500 to-indigo-600",
          text: "text-purple-800",
          badge: "bg-purple-100 text-purple-800",
          button: "bg-purple-600 hover:bg-purple-700",
          highlight: "text-purple-600",
          border: "border-purple-200",
          glow: "from-purple-400/30 via-transparent to-transparent",
        }
      case "amber":
        return {
          gradient: "from-amber-500/20 to-yellow-500/20",
          accent: "from-amber-500 to-yellow-600",
          text: "text-amber-800",
          badge: "bg-amber-100 text-amber-800",
          button: "bg-amber-600 hover:bg-amber-700",
          highlight: "text-amber-600",
          border: "border-amber-200",
          glow: "from-amber-400/30 via-transparent to-transparent",
        }
      case "red":
        return {
          gradient: "from-red-500/20 to-rose-500/20",
          accent: "from-red-500 to-rose-600",
          text: "text-red-800",
          badge: "bg-red-100 text-red-800",
          button: "bg-red-600 hover:bg-red-700",
          highlight: "text-red-600",
          border: "border-red-200",
          glow: "from-red-400/30 via-transparent to-transparent",
        }
      case "blue":
      default:
        return {
          gradient: "from-blue-500/20 to-indigo-500/20",
          accent: "from-blue-500 to-indigo-600",
          text: "text-blue-800",
          badge: "bg-blue-100 text-blue-800",
          button: "bg-blue-600 hover:bg-blue-700",
          highlight: "text-blue-600",
          border: "border-blue-200",
          glow: "from-blue-400/30 via-transparent to-transparent",
        }
    }
  }

  const colors = getColors()

  return (
    <div className={`w-full mb-10 mt-4 overflow-hidden rounded-xl bg-gradient-to-r ${colors.gradient} p-1`}>
      <div className="relative overflow-hidden rounded-lg bg-white p-4 sm:p-6">
        {/* Decorative background elements */}
        <div
          className={`absolute top-0 right-0 h-40 w-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] ${colors.glow}`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 h-40 w-40 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] ${colors.glow}`}
        ></div>

        {/* Header */}
        <div className="relative mb-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Sparkles className={`h-6 w-6 ${colors.highlight} mr-2`} />
            <h2 className={`text-2xl font-bold ${colors.text}`}>
              {showType === "new" ? "New Products Since Your Last Visit" : "Recommended For You"}
            </h2>
            <Sparkles className={`h-6 w-6 ${colors.highlight} ml-2`} />
          </div>
          {hasViewedBefore && lastVisitDate && (
            <p className={`text-sm ${colors.highlight}`}>
              {showType === "new" ? `Added since ${formatDate(lastVisitDate)}` : `Based on your browsing history`}
            </p>
          )}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {displayProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} colors={colors} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Toggle between new and related products if both are available */}
        {newProducts.length > 0 && relatedProducts.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              onClick={() => {
                setShowType(showType === "new" ? "related" : "new")
                setDisplayProducts(
                  showType === "new" ? relatedProducts.slice(0, maxProducts) : newProducts.slice(0, maxProducts),
                )
              }}
              className={`bg-gradient-to-r ${colors.accent} text-white px-6 py-2 rounded-full inline-flex items-center gap-2 hover:shadow-lg transition-all duration-300`}
            >
              <span>{showType === "new" ? "Show Recommended Products" : "Show New Products"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Product Card Component
function ProductCard({ product, colors }: { product: Product; colors: any }) {
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col relative border ${colors.border}`}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      {/* Hot deal badge - UPDATED STYLE */}
      {product.isHotDeal && (
        <div className="absolute top-3 right-3 z-10">
          <motion.div
            className={`bg-gradient-to-r ${colors.accent} text-white px-3 py-1 rounded-md text-xs font-bold shadow-lg flex items-center border border-white`}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          >
            <Clock className="h-3 w-3 mr-1" />
            <span>Recommended Deal</span>
          </motion.div>
        </div>
      )}

      {/* New badge - UPDATED STYLE */}
      {product.isNew && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md border border-white flex items-center">
            <Sparkles className="h-3 w-3 mr-1" />
            <span>New For You</span>
          </div>
        </div>
      )}

      {/* Image */}
      <div className="relative pt-[75%] bg-gray-50">
        <Image
          src={imageError ? "/placeholder.svg?height=300&width=400" : product.imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="transition-all duration-300 hover:scale-105"
          onError={() => setImageError(true)}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Category */}
        {product.category && (
          <div className="mb-2">
            <Badge variant="outline" className={`text-xs ${colors.border} ${colors.highlight} rounded-md`}>
              {product.category}
            </Badge>
          </div>
        )}

        {/* Product name */}
        <h3 className={`font-semibold ${colors.text} mb-2 line-clamp-2`}>{product.name}</h3>

        {/* Description if available */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">{product.description}</p>
        )}

        {/* Price and CTA */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <div className={`text-lg font-bold ${colors.highlight}`}>{formatPrice(product.currentPrice)}</div>
            {product.originalPrice.amount > product.currentPrice.amount && (
              <div className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</div>
            )}
          </div>

          <motion.button
            className={`bg-gradient-to-r ${colors.accent} text-white px-3 py-1.5 rounded-md text-sm font-medium border border-white/20`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

