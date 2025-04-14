"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Calendar, ChevronRight, TrendingUp, Clock, Info, CalendarDays, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useCalendarRecommendations } from "@/utils/calendar-recommendations"

interface MonthlyRecommendationsProps {
  colorScheme?: string
  maxItems?: number
  showUpcomingEvents?: boolean
}

export default function MonthlyRecommendations({
  colorScheme = "blue",
  maxItems = 5,
  showUpcomingEvents = true,
}: MonthlyRecommendationsProps) {
  const { recommendations, categoryToUrlMap } = useCalendarRecommendations()
  const [activeTab, setActiveTab] = useState<"trending" | "seasonal" | "events">("trending")
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  // Toggle category expansion
  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

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

  // Format date for display
  const formatDate = (dateString: string) => {
    if (dateString.length === 5) {
      // MM-DD format
      const [month, day] = dateString.split("-").map(Number)
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]
      return `${monthNames[month - 1]} ${day}`
    } else {
      // Full date format
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { month: "long", day: "numeric" })
    }
  }

  // Calculate days until event
  const getDaysUntil = (dateString: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let eventDate: Date

    if (dateString.length === 5) {
      // MM-DD format
      const [month, day] = dateString.split("-").map(Number)
      eventDate = new Date(today.getFullYear(), month - 1, day)

      // If the event has already passed this year, use next year's date
      if (eventDate < today) {
        eventDate = new Date(today.getFullYear() + 1, month - 1, day)
      }
    } else {
      // Full date format
      eventDate = new Date(dateString)
    }

    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  return (
    <Card className={`border ${colors.border} shadow-md overflow-hidden`}>
      <CardHeader className={`bg-gradient-to-r ${colors.gradient} text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl md:text-2xl flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              {recommendations.currentMonthName} Recommendations
            </CardTitle>
            <CardDescription className="text-white/80 mt-1">
              Trending categories and upcoming events in Kenya
            </CardDescription>
          </div>
          <Badge className="bg-white/20 text-white border-0">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </Badge>
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="trending" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Trending</span>
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">Seasonal</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <CardContent className={`p-4 ${colors.light}`}>
        <AnimatePresence mode="wait">
          {activeTab === "trending" && (
            <motion.div
              key="trending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className={`text-lg font-medium mb-3 ${colors.text}`}>Top Categories This Month</h3>
              <div className="grid gap-3">
                {recommendations.topCategories.slice(0, maxItems).map((category, index) => (
                  <Link
                    href={categoryToUrlMap[category] || "#"}
                    key={category}
                    className={`flex items-center justify-between p-3 rounded-lg border ${colors.border} hover:bg-white transition-colors no-underline text-gray-800`}
                  >
                    <div className="flex items-center">
                      <Badge className={`mr-3 ${colors.badge}`}>{index + 1}</Badge>
                      <span className="font-medium capitalize">{category}</span>
                    </div>
                    <ChevronRight className={`h-5 w-5 ${colors.muted}`} />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "seasonal" && (
            <motion.div
              key="seasonal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className={`text-lg font-medium mb-3 ${colors.text}`}>Seasonal Recommendations</h3>
              <div className="grid gap-3">
                {recommendations.seasonalProducts.slice(0, maxItems).map((product) => (
                  <Collapsible key={product.category}>
                    <div className={`p-3 rounded-lg border ${colors.border} hover:bg-white transition-colors`}>
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <Link
                            href={categoryToUrlMap[product.category] || "#"}
                            className="font-medium capitalize no-underline text-gray-800"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {product.category}
                          </Link>
                          <div className="flex items-center">
                         {/*   <Badge className={colors.badge}>{product.relevanceScore}% Relevant</Badge> */}
                            <ChevronDown
                              className={`h-4 w-4 ml-2 ${colors.muted} transition-transform duration-200 ${
                                expandedCategories.includes(product.category) ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <p className="text-sm text-gray-600 mt-2 p-2 bg-white/80 rounded-md">{product.reason}</p>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "events" && showUpcomingEvents && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className={`text-lg font-medium mb-3 ${colors.text}`}>Upcoming Events</h3>
              {recommendations.upcomingEvents.length > 0 ? (
                <div className="grid gap-3">
                  {recommendations.upcomingEvents.slice(0, maxItems).map((event) => {
                    const daysUntil = getDaysUntil(event.date as string)
                    return (
                      <Collapsible key={event.id}>
                        <div className={`p-3 rounded-lg border ${colors.border} hover:bg-white transition-colors`}>
                          <CollapsibleTrigger className="w-full text-left">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{event.name}</span>
                              <div className="flex items-center">
                                <Badge className={daysUntil <= 7 ? "bg-red-100 text-red-800" : colors.badge}>
                                  {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                                </Badge>
                                <ChevronDown
                                  className={`h-4 w-4 ml-2 ${colors.muted} transition-transform duration-200 ${
                                    expandedCategories.includes(event.id) ? "rotate-180" : ""
                                  }`}
                                />
                              </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(event.date as string)}
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <p className="text-sm text-gray-600 mt-2 p-2 bg-white/80 rounded-md">{event.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {event.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Info className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No upcoming events in the next 30 days</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      <CardFooter className={`bg-white border-t ${colors.border} p-4`}>
        <Link href="/categories" className="w-full no-underline">
          <Button className={`w-full ${colors.button}`}>
            View All {activeTab === "trending" ? "Categories" : activeTab === "seasonal" ? "Recommendations" : "Events"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
