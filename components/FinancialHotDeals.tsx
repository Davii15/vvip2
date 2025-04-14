"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, FlameIcon, ArrowRight } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Specialized types for financial products
interface Rate {
  amount: number
  currency: string
}

export interface FinancialDeal {
  id: number | string
  name: string
  imageUrl: string
  currentRate: Rate
  originalRate: Rate
  category?: string
  expiresAt: string // ISO date string
  description?: string
  discount?: number // Percentage discount
  institution?: string
}

interface FinancialHotDealsProps {
  deals: FinancialDeal[]
  colorScheme: "blue" | "green" | "purple" | "amber" | "red" // Match with page theme
  title?: string
  subtitle?: string
}

// Helper function to calculate days remaining
const getDaysRemaining = (expiresAt: string): number => {
  const end = new Date(expiresAt).getTime()
  const now = new Date().getTime()
  const diff = end - now
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

// Helper function to calculate hours remaining when less than a day
const getHoursRemaining = (expiresAt: string): number => {
  const end = new Date(expiresAt).getTime()
  const now = new Date().getTime()
  const diff = end - now
  return Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
}

// Helper function to format interest rate
const formatRate = (rate: Rate): string => {
  return `${rate.amount.toFixed(2)}% p.a.`
}

export default function FinancialHotDeals({
  deals,
  colorScheme,
  title = "Hot Time-Limited Financial Offers",
  subtitle = "Lock in these special rates before they expire!",
}: FinancialHotDealsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleDeals, setVisibleDeals] = useState<FinancialDeal[]>([])

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

  // Auto-rotate deals every 5 seconds
  useEffect(() => {
    // Sort deals by expiration date (soonest first)
    const sortedDeals = [...deals].sort((a, b) => {
      return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
    })

    setVisibleDeals(sortedDeals)

    // Set up auto-rotation if there are multiple deals
    if (sortedDeals.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sortedDeals.length)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [deals])

  // If no deals, don't render anything
  if (!visibleDeals.length) return null

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
            <FlameIcon className="h-6 w-6 text-red-500 mr-2" />
            <h2 className={`text-2xl font-bold ${colors.text}`}>{title}</h2>
            <FlameIcon className="h-6 w-6 text-red-500 ml-2" />
          </div>
          <p className={`text-sm ${colors.highlight}`}>{subtitle}</p>
        </div>

        {/* Deals carousel for mobile */}
        <div className="block md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <FinancialDealCard deal={visibleDeals[currentIndex]} colors={colors} />
            </motion.div>
          </AnimatePresence>

          {/* Pagination dots */}
          {visibleDeals.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {visibleDeals.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentIndex ? `bg-gradient-to-r ${colors.accent} w-4` : `bg-gray-300`
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to deal ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Grid layout for tablet and desktop */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleDeals.slice(0, 4).map((deal) => (
            <FinancialDealCard key={deal.id} deal={deal} colors={colors} />
          ))}
        </div>

        {/* View all button */}
        {visibleDeals.length > 4 && (
          <div className="mt-6 text-center">
            <Button
              className={`bg-gradient-to-r ${colors.accent} text-white px-6 py-2 rounded-full inline-flex items-center gap-2 hover:shadow-lg transition-all duration-300`}
            >
              <span>View All Financial Offers</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function FinancialDealCard({ deal, colors }: { deal: FinancialDeal; colors: any }) {
  const [imageError, setImageError] = useState(false)
  const daysRemaining = getDaysRemaining(deal.expiresAt)
  const hoursRemaining = getHoursRemaining(deal.expiresAt)

  // Calculate urgency level for visual cues
  const getUrgencyLevel = () => {
    if (daysRemaining === 0) return "critical" // Less than a day
    if (daysRemaining <= 1) return "high" // 1 day
    if (daysRemaining <= 3) return "medium" // 2-3 days
    return "normal" // More than 3 days
  }

  const urgency = getUrgencyLevel()

  // Get animation speed based on urgency
  const getAnimationSpeed = () => {
    switch (urgency) {
      case "critical":
        return 0.8
      case "high":
        return 1.2
      case "medium":
        return 1.6
      default:
        return 2
    }
  }

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col relative border ${colors.border}`}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      {/* Hot deal badge */}
      <div className="absolute top-3 right-3 z-10">
        <motion.div
          className={`bg-gradient-to-r ${colors.accent} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center`}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: getAnimationSpeed() }}
        >
          <FlameIcon className="h-3 w-3 mr-1" />
          <span>Limited Offer</span>
        </motion.div>
      </div>

      {/* Time remaining badge */}
      <div className="absolute top-3 left-3 z-10">
        <div
          className={`
            backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold shadow flex items-center
            ${
              urgency === "critical"
                ? "bg-red-100 text-red-600 animate-pulse"
                : urgency === "high"
                  ? "bg-amber-100 text-amber-600"
                  : "bg-white/80 text-gray-600"
            }
          `}
        >
          <Clock className="h-3 w-3 mr-1" />
          <span>
            {daysRemaining > 0
              ? `${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} left`
              : `${hoursRemaining} ${hoursRemaining === 1 ? "hour" : "hours"} left`}
          </span>
        </div>
      </div>

      {/* Discount tag if available */}
      {deal.discount && (
        <div className="absolute bottom-3 right-3 z-10">
          <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md flex items-center">
            <span>{deal.discount}% OFF</span>
          </div>
        </div>
      )}

      {/* Image */}
      <div className="relative pt-[75%] bg-gray-50">
        <Image
          src={imageError ? "/placeholder.svg?height=300&width=400" : deal.imageUrl}
          alt={deal.name}
          layout="fill"
          objectFit="cover"
          className="transition-all duration-300 hover:scale-105"
          onError={() => setImageError(true)}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Category */}
        {deal.category && (
          <div className="mb-2">
            <Badge variant="outline" className={`text-xs ${colors.border} ${colors.highlight}`}>
              {deal.category}
            </Badge>
          </div>
        )}

        {/* Institution if available */}
        {deal.institution && (
          <div className="text-xs text-gray-500 mb-1">
            Offered by <span className="font-medium">{deal.institution}</span>
          </div>
        )}

        {/* Product name */}
        <h3 className={`font-semibold ${colors.text} mb-1 line-clamp-2`}>{deal.name}</h3>

        {/* Description */}
        {deal.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">{deal.description}</p>}

        {/* Rate and CTA */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <div className={`text-lg font-bold ${colors.highlight}`}>{formatRate(deal.currentRate)}</div>
            <div className="text-sm text-gray-500 line-through">{formatRate(deal.originalRate)}</div>
          </div>

          <motion.button
            className={`bg-gradient-to-r ${colors.accent} text-white px-3 py-1.5 rounded-full text-sm font-medium`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Apply Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

