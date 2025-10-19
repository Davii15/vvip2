"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, ChevronRight, TrendingUp, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCalendarRecommendations } from "@/utils/calendar-recommendations"

interface SeasonalRecommendationBannerProps {
  colorScheme?: string
  maxItems?: number
}

// Update the component to include proper links without underlining
export default function SeasonalRecommendationBanner({
  colorScheme = "blue",
  maxItems = 3,
}: SeasonalRecommendationBannerProps) {
  const { recommendations, categoryToUrlMap } = useCalendarRecommendations()
  const [isHovered, setIsHovered] = useState(false)

  // Get color classes based on colorScheme
  const getColorClasses = () => {
    switch (colorScheme) {
      case "green":
        return {
          gradient: "from-emerald-500 to-green-700",
          light: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-700",
          badge: "bg-emerald-100 text-emerald-800",
          button: "bg-emerald-600 hover:bg-emerald-700",
          muted: "text-emerald-600",
        }
      case "amber":
        return {
          gradient: "from-amber-500 to-yellow-700",
          light: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-700",
          badge: "bg-amber-100 text-amber-800",
          button: "bg-amber-600 hover:bg-amber-700",
          muted: "text-amber-600",
        }
      case "purple":
        return {
          gradient: "from-purple-500 to-indigo-700",
          light: "bg-purple-50",
          border: "border-purple-200",
          text: "text-purple-700",
          badge: "bg-purple-100 text-purple-800",
          button: "bg-purple-600 hover:bg-purple-700",
          muted: "text-purple-600",
        }
      case "pink":
        return {
          gradient: "from-pink-500 to-rose-700",
          light: "bg-pink-50",
          border: "border-pink-200",
          text: "text-pink-700",
          badge: "bg-pink-100 text-pink-800",
          button: "bg-pink-600 hover:bg-pink-700",
          muted: "text-pink-600",
        }
      default:
        return {
          gradient: "from-blue-500 to-indigo-700",
          light: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          badge: "bg-blue-100 text-blue-800",
          button: "bg-blue-600 hover:bg-blue-700",
          muted: "text-blue-600",
        }
    }
  }

  const colors = getColorClasses()

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg border ${colors.border} mb-8`}>
      <div className={`bg-gradient-to-r ${colors.gradient} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-bold">{recommendations.currentMonthName} Recommendations</h2>
          </div>
          <TrendingUp className="h-5 w-5" />
        </div>
      </div>

      <div className={`p-4 ${colors.light}`}>
        <div className="grid gap-4 md:grid-cols-3">
          {recommendations.seasonalProducts.slice(0, maxItems).map((product) => (
            <Link
              href={categoryToUrlMap[product.category] || "#"}
              key={product.category}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow no-underline text-gray-800"
            >
              <h3 className={`font-medium text-lg mb-2 capitalize ${colors.text}`}>{product.category}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.reason}</p>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${colors.muted}`}>{product.relevanceScore}% Relevant</span>
                <ChevronRight className={`h-4 w-4 ${colors.muted}`} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 border-t border-gray-100">
        <Link href="/categories" className="no-underline">
          <Button
            size="lg"
            className={`w-full group relative overflow-hidden bg-gradient-to-r ${colors.gradient} text-white px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-10"
              initial={{ x: "-100%" }}
              animate={{ x: isHovered ? "100%" : "-100%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            <span className="flex items-center text-lg font-medium">
              View All Seasonal Recommendations
              <motion.div animate={{ x: isHovered ? 5 : 0 }} transition={{ duration: 0.2 }}>
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.div>
            </span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
