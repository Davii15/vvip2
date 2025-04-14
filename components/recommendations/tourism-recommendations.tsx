"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, Users, Sun, Snowflake, Leaf, ArrowRight, Globe, TrendingUp } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Adventure {
  id: number
  name: string
  imageUrl: string
  currentPrice: {
    amount: number
    currency: string
  }
  originalPrice: {
    amount: number
    currency: string
  }
  type: string
  duration: string
  groupSize: string
  location: string
  dateAdded: string
  isTrending?: boolean
}

interface TourismRecommendationsProps {
  allAdventures: Adventure[]
  currentMonth?: number // 1-12 for January-December
}

export default function TourismRecommendations({
  allAdventures,
  currentMonth = new Date().getMonth() + 1,
}: TourismRecommendationsProps) {
  const [activeTab, setActiveTab] = useState("current")
  const [recommendations, setRecommendations] = useState<{
    current: Adventure[]
    next: Adventure[]
    popular: Adventure[]
  }>({
    current: [],
    next: [],
    popular: [],
  })

  // Seasonal tourism data by month
  const tourismSeasons = {
    // Northern hemisphere seasons
    1: { season: "Winter", bestDestinations: ["Game Park", "Game Reserve"], weather: "Dry" },
    2: { season: "Winter", bestDestinations: ["Game Park", "Game Reserve"], weather: "Dry" },
    3: { season: "Spring", bestDestinations: ["Hiking", "Sanctuary"], weather: "Mild" },
    4: { season: "Spring", bestDestinations: ["Hiking", "Sanctuary"], weather: "Mild" },
    5: { season: "Spring", bestDestinations: ["Hiking", "Sanctuary"], weather: "Mild" },
    6: { season: "Summer", bestDestinations: ["Game Park", "Game Reserve"], weather: "Dry" },
    7: { season: "Summer", bestDestinations: ["Game Park", "Game Reserve"], weather: "Dry" },
    8: { season: "Summer", bestDestinations: ["Game Park", "Game Reserve"], weather: "Dry" },
    9: { season: "Fall", bestDestinations: ["Sanctuary", "Orphanage"], weather: "Mild" },
    10: { season: "Fall", bestDestinations: ["Sanctuary", "Orphanage"], weather: "Mild" },
    11: { season: "Fall", bestDestinations: ["Sanctuary", "Orphanage"], weather: "Wet" },
    12: { season: "Winter", bestDestinations: ["Game Park", "Game Reserve"], weather: "Dry" },
  }

  // Generate recommendations based on month
  useEffect(() => {
    if (!allAdventures || allAdventures.length === 0) return

    // Get current month's data
    const currentMonthData = tourismSeasons[currentMonth as keyof typeof tourismSeasons]

    // Get next month's data
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1
    const nextMonthData = tourismSeasons[nextMonth as keyof typeof tourismSeasons]

    // Filter adventures for current month
    const currentMonthAdventures = allAdventures
      .filter((adventure) => currentMonthData.bestDestinations.includes(adventure.type))
      .sort((a, b) => {
        // Sort by trending first, then by discount percentage
        if (a.isTrending && !b.isTrending) return -1
        if (!a.isTrending && b.isTrending) return 1

        const aDiscount = (a.originalPrice.amount - a.currentPrice.amount) / a.originalPrice.amount
        const bDiscount = (b.originalPrice.amount - b.currentPrice.amount) / b.originalPrice.amount

        return bDiscount - aDiscount
      })
      .slice(0, 4)

    // Filter adventures for next month
    const nextMonthAdventures = allAdventures
      .filter((adventure) => nextMonthData.bestDestinations.includes(adventure.type))
      .sort((a, b) => {
        // Sort by trending first, then by discount percentage
        if (a.isTrending && !b.isTrending) return -1
        if (!a.isTrending && b.isTrending) return 1

        const aDiscount = (a.originalPrice.amount - a.currentPrice.amount) / a.originalPrice.amount
        const bDiscount = (b.originalPrice.amount - b.currentPrice.amount) / b.originalPrice.amount

        return bDiscount - aDiscount
      })
      .slice(0, 4)

    // Get popular adventures (trending or highest rated)
    const popularAdventures = [...allAdventures]
      .sort((a, b) => {
        if (a.isTrending && !b.isTrending) return -1
        if (!a.isTrending && b.isTrending) return 1
        return 0
      })
      .slice(0, 4)

    setRecommendations({
      current: currentMonthAdventures,
      next: nextMonthAdventures,
      popular: popularAdventures,
    })
  }, [allAdventures, currentMonth])

  // Format price helper
  const formatPrice = (price: { amount: number; currency: string }): string => {
    return `${price.currency} ${price.amount.toLocaleString()}`
  }

  // Get season icon
  const getSeasonIcon = (season: string) => {
    switch (season) {
      case "Winter":
        return <Snowflake className="h-5 w-5 text-blue-500" />
      case "Spring":
        return <Leaf className="h-5 w-5 text-green-500" />
      case "Summer":
        return <Sun className="h-5 w-5 text-yellow-500" />
      case "Fall":
        return <Leaf className="h-5 w-5 text-orange-500" />
      default:
        return <Sun className="h-5 w-5" />
    }
  }

  // Get month name
  const getMonthName = (month: number): string => {
    return new Date(2000, month - 1, 1).toLocaleString("default", { month: "long" })
  }

  // Get next month
  const getNextMonth = (month: number): number => {
    return month === 12 ? 1 : month + 1
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-lg border border-amber-200 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-amber-800 flex items-center">
          <Globe className="mr-2 h-6 w-6 text-amber-600" />
          Top Adventures by Season
        </h2>
        <div className="flex items-center bg-amber-100 px-3 py-1 rounded-full">
          {getSeasonIcon(tourismSeasons[currentMonth as keyof typeof tourismSeasons].season)}
          <span className="ml-1 text-amber-800 font-medium">
            {tourismSeasons[currentMonth as keyof typeof tourismSeasons].season} Season
          </span>
        </div>
      </div>

      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="current" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{getMonthName(currentMonth)}</span>
          </TabsTrigger>
          <TabsTrigger value="next" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{getMonthName(getNextMonth(currentMonth))}</span>
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Most Popular</span>
          </TabsTrigger>
        </TabsList>

        {["current", "next", "popular"].map((period) => (
          <TabsContent key={period} value={period} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendations[period as keyof typeof recommendations].map((adventure) => (
                <motion.div
                  key={adventure.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-100"
                >
                  <div className="relative h-40">
                    <Image
                      src={adventure.imageUrl || "/placeholder.svg"}
                      alt={adventure.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                    <Badge className="absolute top-2 right-2 bg-amber-600 text-white">{adventure.type}</Badge>
                    {adventure.isTrending && (
                      <Badge className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>Trending</span>
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-amber-800 mb-1 truncate">{adventure.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 text-amber-600 mr-1 flex-shrink-0" />
                      <span className="truncate">{adventure.location}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-amber-600 mr-1" />
                        <span>{adventure.duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 text-amber-600 mr-1" />
                        <span>{adventure.groupSize}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <div>
                        <div className="text-lg font-bold text-amber-700">{formatPrice(adventure.currentPrice)}</div>
                        {adventure.originalPrice.amount !== adventure.currentPrice.amount && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(adventure.originalPrice)}
                          </div>
                        )}
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {period === "current" ? "Best Now" : period === "next" ? "Coming Soon" : "Top Rated"}
                      </Badge>
                    </div>
                  </CardContent>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                View All{" "}
                {period === "current"
                  ? `${getMonthName(currentMonth)}`
                  : period === "next"
                    ? `${getMonthName(getNextMonth(currentMonth))}`
                    : "Popular"}{" "}
                Adventures
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
