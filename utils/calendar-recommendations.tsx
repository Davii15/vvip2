"use client"

import { useState, useEffect } from "react"

// Types for our recommendation system
export interface CalendarEvent {
  id: string
  name: string
  date: Date | string // Can be a specific date or month-day string like "04-15" for April 15th
  description: string
  tags: string[] // Categories this event relates to
  importance: 1 | 2 | 3 // 1 = major holiday, 2 = medium event, 3 = minor event
}

export interface MonthlyTrend {
  month: number // 1-12 for January-December
  categories: {
    category: string
    relevanceScore: number // 0-100 score of how relevant this category is this month
    reason: string
  }[]
}

export interface RecommendationResult {
  topCategories: string[]
  upcomingEvents: CalendarEvent[]
  seasonalProducts: {
    category: string
    reason: string
  }[]
  currentMonth: number
  currentMonthName: string
}

// Kenyan calendar events
const kenyaCalendarEvents: CalendarEvent[] = [
  // Public Holidays
  {
    id: "new-year",
    name: "New Year's Day",
    date: "01-01",
    description: "Beginning of the year celebrations",
    tags: ["celebration", "family", "hospitality", "tourism"],
    importance: 1,
  },
  {
    id: "good-friday",
    name: "Good Friday",
    date: "2025-04-18", // This changes yearly
    description: "Christian holiday commemorating the crucifixion of Jesus",
    tags: ["religious", "family", "hospitality"],
    importance: 1,
  },
  {
    id: "easter-monday",
    name: "Easter Monday",
    date: "2025-04-21", // This changes yearly
    description: "Christian holiday following Easter Sunday",
    tags: ["religious", "family", "hospitality", "tourism"],
    importance: 1,
  },
  {
    id: "labour-day",
    name: "Labour Day",
    date: "05-01",
    description: "Celebration of workers and the labor movement",
    tags: ["celebration", "community"],
    importance: 1,
  },
  {
    id: "madaraka-day",
    name: "Madaraka Day",
    date: "06-01",
    description: "Commemoration of Kenya's attainment of internal self-rule",
    tags: ["national", "celebration", "tourism"],
    importance: 1,
  },
  {
    id: "huduma-day",
    name: "Huduma Day",
    date: "10-10",
    description: "Formerly Moi Day, celebrates service to the nation",
    tags: ["national", "celebration"],
    importance: 1,
  },
  {
    id: "mashujaa-day",
    name: "Mashujaa Day",
    date: "10-20",
    description: "Heroes' Day celebrating those who fought for independence",
    tags: ["national", "celebration", "tourism"],
    importance: 1,
  },
  {
    id: "jamhuri-day",
    name: "Jamhuri Day",
    date: "12-12",
    description: "Independence Day celebrating Kenya's independence from Britain",
    tags: ["national", "celebration", "tourism"],
    importance: 1,
  },
  {
    id: "christmas",
    name: "Christmas Day",
    date: "12-25",
    description: "Christian holiday celebrating the birth of Jesus",
    tags: ["religious", "family", "hospitality", "shopping", "gifts"],
    importance: 1,
  },
  {
    id: "boxing-day",
    name: "Boxing Day",
    date: "12-26",
    description: "Day after Christmas, traditionally for giving gifts to the less fortunate",
    tags: ["religious", "family", "hospitality", "shopping", "gifts"],
    importance: 1,
  },

  // Seasonal Events
  {
    id: "long-rains",
    name: "Long Rains Season",
    date: "03-15", // Approximate start
    description: "Main rainy season in Kenya, typically from March to May",
    tags: ["agriculture", "construction", "home improvement"],
    importance: 2,
  },
  {
    id: "short-rains",
    name: "Short Rains Season",
    date: "10-15", // Approximate start
    description: "Second rainy season in Kenya, typically from October to December",
    tags: ["agriculture", "construction", "home improvement"],
    importance: 2,
  },
  {
    id: "dry-season-1",
    name: "First Dry Season",
    date: "01-15", // Approximate start
    description: "Dry season typically from January to March",
    tags: ["tourism", "hospitality", "outdoor activities"],
    importance: 2,
  },
  {
    id: "dry-season-2",
    name: "Second Dry Season",
    date: "06-15", // Approximate start
    description: "Dry season typically from June to October",
    tags: ["tourism", "hospitality", "outdoor activities"],
    importance: 2,
  },

  // Cultural and Regional Events
  {
    id: "nairobi-international-trade-fair",
    name: "Nairobi International Trade Fair",
    date: "09-26", // Approximate
    description: "Annual agricultural and commercial exhibition",
    tags: ["agriculture", "business", "technology", "automotive"],
    importance: 2,
  },
  {
    id: "lamu-cultural-festival",
    name: "Lamu Cultural Festival",
    date: "11-20", // Approximate
    description: "Celebration of Swahili culture on Lamu Island",
    tags: ["tourism", "culture", "hospitality"],
    importance: 2,
  },
  {
    id: "maralal-camel-derby",
    name: "Maralal International Camel Derby",
    date: "08-15", // Approximate
    description: "Annual camel racing event in Samburu County",
    tags: ["tourism", "sports", "hospitality"],
    importance: 2,
  },
  {
    id: "mombasa-carnival",
    name: "Mombasa Carnival",
    date: "11-10", // Approximate
    description: "Street festival celebrating coastal culture",
    tags: ["tourism", "culture", "hospitality"],
    importance: 2,
  },

  // Business and Economic Events
  {
    id: "tax-filing-deadline",
    name: "Tax Filing Deadline",
    date: "06-30",
    description: "Deadline for filing annual tax returns in Kenya",
    tags: ["finance", "business", "insurance"],
    importance: 2,
  },
  {
    id: "budget-reading",
    name: "National Budget Reading",
    date: "06-15", // Approximate
    description: "Annual reading of the national budget",
    tags: ["finance", "business", "insurance"],
    importance: 2,
  },

  // Educational Events
  {
    id: "school-opening-term1",
    name: "School Opening - Term 1",
    date: "01-05", // Approximate
    description: "Beginning of first school term",
    tags: ["education", "shopping", "transportation"],
    importance: 2,
  },
  {
    id: "school-closing-term1",
    name: "School Closing - Term 1",
    date: "04-05", // Approximate
    description: "End of first school term",
    tags: ["education", "tourism", "hospitality"],
    importance: 2,
  },
  {
    id: "school-opening-term2",
    name: "School Opening - Term 2",
    date: "05-05", // Approximate
    description: "Beginning of second school term",
    tags: ["education", "shopping", "transportation"],
    importance: 2,
  },
  {
    id: "school-closing-term2",
    name: "School Closing - Term 2",
    date: "08-05", // Approximate
    description: "End of second school term",
    tags: ["education", "tourism", "hospitality"],
    importance: 2,
  },
  {
    id: "school-opening-term3",
    name: "School Opening - Term 3",
    date: "09-05", // Approximate
    description: "Beginning of third school term",
    tags: ["education", "shopping", "transportation"],
    importance: 2,
  },
  {
    id: "school-closing-term3",
    name: "School Closing - Term 3",
    date: "11-05", // Approximate
    description: "End of third school term",
    tags: ["education", "tourism", "hospitality", "shopping"],
    importance: 2,
  },

  // Agricultural Events
  {
    id: "planting-season-1",
    name: "Main Planting Season",
    date: "03-15", // Approximate
    description: "Main planting season coinciding with long rains",
    tags: ["agriculture", "farming", "tools"],
    importance: 2,
  },
  {
    id: "planting-season-2",
    name: "Second Planting Season",
    date: "10-15", // Approximate
    description: "Second planting season coinciding with short rains",
    tags: ["agriculture", "farming", "tools"],
    importance: 2,
  },
  {
    id: "harvest-season-1",
    name: "Main Harvest Season",
    date: "07-15", // Approximate
    description: "Main harvest season following long rains",
    tags: ["agriculture", "farming", "tools", "food"],
    importance: 2,
  },
  {
    id: "harvest-season-2",
    name: "Second Harvest Season",
    date: "01-15", // Approximate
    description: "Second harvest season following short rains",
    tags: ["agriculture", "farming", "tools", "food"],
    importance: 2,
  },
]

// Monthly trends and seasonal relevance for different product categories
const monthlyTrends: MonthlyTrend[] = [
  {
    month: 1, // January
    categories: [
      {
        category: "agriculture",
        relevanceScore: 80,
        reason: "Second harvest season and preparation for dry season farming",
      },
      {
        category: "education",
        relevanceScore: 90,
        reason: "Back to school shopping as first term begins",
      },
      {
        category: "tourism",
        relevanceScore: 75,
        reason: "Dry season makes it ideal for wildlife viewing and outdoor activities",
      },
      {
        category: "construction",
        relevanceScore: 60,
        reason: "Dry weather is favorable for construction projects",
      },
      {
        category: "drinks",
        relevanceScore: 85,
        reason: "Hot weather increases demand for refreshing beverages",
      },
    ],
  },
  {
    month: 2, // February
    categories: [
      {
        category: "beauty",
        relevanceScore: 85,
        reason: "Valentine's season increases demand for beauty products and services",
      },
      {
        category: "hospitality",
        relevanceScore: 80,
        reason: "Valentine's Day celebrations boost restaurant and hotel bookings",
      },
      {
        category: "agriculture",
        relevanceScore: 70,
        reason: "Preparation for long rains planting season",
      },
      {
        category: "construction",
        relevanceScore: 65,
        reason: "Last chance for major construction before long rains",
      },
      {
        category: "automotive",
        relevanceScore: 60,
        reason: "Good time for vehicle maintenance before rainy season",
      },
    ],
  },
  {
    month: 3, // March
    categories: [
      {
        category: "agriculture",
        relevanceScore: 95,
        reason: "Main planting season begins with long rains",
      },
      {
        category: "construction",
        relevanceScore: 50,
        reason: "Construction slows as rainy season begins",
      },
      {
        category: "home improvement",
        relevanceScore: 85,
        reason: "Waterproofing and rain preparation for homes",
      },
      {
        category: "automotive",
        relevanceScore: 75,
        reason: "Increased demand for vehicle maintenance for rainy conditions",
      },
      {
        category: "drinks",
        relevanceScore: 65,
        reason: "Cooler weather shifts preference to warm beverages",
      },
    ],
  },
  {
    month: 4, // April
    categories: [
      {
        category: "hospitality",
        relevanceScore: 85,
        reason: "Easter holidays and school breaks increase travel and dining out",
      },
      {
        category: "tourism",
        relevanceScore: 80,
        reason: "Easter holiday period despite rainy season",
      },
      {
        category: "agriculture",
        relevanceScore: 90,
        reason: "Peak of planting season during long rains",
      },
      {
        category: "insurance",
        relevanceScore: 75,
        reason: "Increased awareness of need for coverage during rainy season",
      },
      {
        category: "automotive",
        relevanceScore: 70,
        reason: "Demand for all-weather vehicles and maintenance",
      },
    ],
  },
  {
    month: 5, // May
    categories: [
      {
        category: "agriculture",
        relevanceScore: 85,
        reason: "Continued farming activities during long rains",
      },
      {
        category: "education",
        relevanceScore: 80,
        reason: "Second term school preparations",
      },
      {
        category: "home improvement",
        relevanceScore: 75,
        reason: "Home repairs following heavy rains",
      },
      {
        category: "construction",
        relevanceScore: 55,
        reason: "Limited construction due to continuing rains",
      },
      {
        category: "beauty",
        relevanceScore: 70,
        reason: "Increased demand for anti-humidity beauty products",
      },
    ],
  },
  {
    month: 6, // June
    categories: [
      {
        category: "finance",
        relevanceScore: 90,
        reason: "Tax filing deadline and budget reading",
      },
      {
        category: "tourism",
        relevanceScore: 85,
        reason: "Beginning of dry season and wildlife migration",
      },
      {
        category: "construction",
        relevanceScore: 80,
        reason: "Construction activities resume as dry season begins",
      },
      {
        category: "agriculture",
        relevanceScore: 75,
        reason: "Preparation for harvest season",
      },
      {
        category: "automotive",
        relevanceScore: 70,
        reason: "Increased travel during dry season",
      },
    ],
  },
  {
    month: 7, // July
    categories: [
      {
        category: "tourism",
        relevanceScore: 95,
        reason: "Peak tourism season with wildebeest migration and school holidays",
      },
      {
        category: "hospitality",
        relevanceScore: 90,
        reason: "High demand for accommodation and dining during peak tourism",
      },
      {
        category: "agriculture",
        relevanceScore: 85,
        reason: "Main harvest season begins",
      },
      {
        category: "construction",
        relevanceScore: 80,
        reason: "Ideal dry conditions for construction projects",
      },
      {
        category: "automotive",
        relevanceScore: 75,
        reason: "Increased travel during school holidays",
      },
    ],
  },
  {
    month: 8, // August
    categories: [
      {
        category: "tourism",
        relevanceScore: 90,
        reason: "Continued peak tourism season",
      },
      {
        category: "education",
        relevanceScore: 85,
        reason: "End of second term and preparation for third term",
      },
      {
        category: "agriculture",
        relevanceScore: 80,
        reason: "Continued harvest activities",
      },
      {
        category: "construction",
        relevanceScore: 85,
        reason: "Prime construction weather",
      },
      {
        category: "drinks",
        relevanceScore: 75,
        reason: "High demand for refreshing beverages during dry season",
      },
    ],
  },
  {
    month: 9, // September
    categories: [
      {
        category: "education",
        relevanceScore: 90,
        reason: "Back to school for third term",
      },
      {
        category: "agriculture",
        relevanceScore: 75,
        reason: "Agricultural exhibitions and trade fairs",
      },
      {
        category: "construction",
        relevanceScore: 80,
        reason: "Continued favorable construction conditions",
      },
      {
        category: "automotive",
        relevanceScore: 70,
        reason: "Vehicle maintenance before short rains",
      },
      {
        category: "beauty",
        relevanceScore: 75,
        reason: "Preparation for end-year events and festivities",
      },
    ],
  },
  {
    month: 10, // October
    categories: [
      {
        category: "agriculture",
        relevanceScore: 85,
        reason: "Second planting season with short rains",
      },
      {
        category: "construction",
        relevanceScore: 70,
        reason: "Construction begins to slow as short rains approach",
      },
      {
        category: "home improvement",
        relevanceScore: 75,
        reason: "Home preparation for rainy season",
      },
      {
        category: "tourism",
        relevanceScore: 65,
        reason: "Shoulder season for tourism",
      },
      {
        category: "automotive",
        relevanceScore: 70,
        reason: "Vehicle preparation for rainy conditions",
      },
    ],
  },
  {
    month: 11, // November
    categories: [
      {
        category: "agriculture",
        relevanceScore: 80,
        reason: "Continued planting during short rains",
      },
      {
        category: "education",
        relevanceScore: 85,
        reason: "End of school year and preparation for holidays",
      },
      {
        category: "tourism",
        relevanceScore: 70,
        reason: "Cultural festivals and events",
      },
      {
        category: "beauty",
        relevanceScore: 80,
        reason: "Preparation for holiday season and events",
      },
      {
        category: "hospitality",
        relevanceScore: 75,
        reason: "End of year corporate events and parties",
      },
    ],
  },
  {
    month: 12, // December
    categories: [
      {
        category: "hospitality",
        relevanceScore: 95,
        reason: "Holiday season peaks with Christmas and New Year celebrations",
      },
      {
        category: "tourism",
        relevanceScore: 90,
        reason: "Domestic and international tourism during festive season",
      },
      {
        category: "beauty",
        relevanceScore: 85,
        reason: "High demand for beauty services for holiday events",
      },
      {
        category: "automotive",
        relevanceScore: 80,
        reason: "Increased travel during holiday season",
      },
      {
        category: "drinks",
        relevanceScore: 90,
        reason: "Festive celebrations increase demand for beverages",
      },
    ],
  },
]

// Map category names to their respective page URLs
const categoryToUrlMap: Record<string, string> = {
  agriculture: "/agriculture-deals",
  beauty: "/beauty-and-massage",
  hospitality: "/hospitality",
  tourism: "/tourism-and-adventures",
  construction: "/construction-materials",
  automotive: "/car-deals",
  drinks: "/drinks",
  Gadjets:"/electronics",
  finance: "/finance",
  insurance: "/insurance",
  "home improvement": "/construction-materials",
}

/**
 * Get upcoming events for the next 30 days
 * @param currentDate Optional date to calculate from, defaults to today
 * @returns Array of upcoming events
 */
export const getUpcomingEvents = (currentDate: Date = new Date()): CalendarEvent[] => {
  const today = currentDate
  const thirtyDaysLater = new Date(today)
  thirtyDaysLater.setDate(today.getDate() + 30)

  const currentMonth = today.getMonth() + 1 // 1-12
  const currentDay = today.getDate()

  return kenyaCalendarEvents
    .filter((event) => {
      // Handle specific date events
      if (typeof event.date === "string") {
        if (event.date.includes("-")) {
          // Handle month-day format (MM-DD)
          if (event.date.length === 5) {
            const [eventMonth, eventDay] = event.date.split("-").map(Number)

            // Check if the event is within the next 30 days
            if (eventMonth === currentMonth && eventDay >= currentDay) {
              return true
            } else if (
              eventMonth === currentMonth + 1 &&
              currentDay + 30 > new Date(today.getFullYear(), currentMonth, 0).getDate() &&
              eventDay <= (currentDay + 30) % new Date(today.getFullYear(), currentMonth, 0).getDate()
            ) {
              return true
            }
          }
          // Handle full date format (YYYY-MM-DD)
          else {
            const eventDate = new Date(event.date)
            return eventDate >= today && eventDate <= thirtyDaysLater
          }
        }
      }
      return false
    })
    .sort((a, b) => {
      // Sort by date
      const getDateValue = (event: CalendarEvent) => {
        if (typeof event.date === "string") {
          if (event.date.length === 5) {
            const [month, day] = event.date.split("-").map(Number)
            // Handle month rollover
            if (month < currentMonth) {
              return new Date(today.getFullYear() + 1, month - 1, day).getTime()
            }
            return new Date(today.getFullYear(), month - 1, day).getTime()
          } else {
            return new Date(event.date).getTime()
          }
        }
        return 0
      }

      return getDateValue(a) - getDateValue(b)
    })
}

/**
 * Get top recommended categories for the current month
 * @param currentDate Optional date to calculate from, defaults to today
 * @param limit Number of top categories to return
 * @returns Array of category names
 */
export const getTopCategoriesForMonth = (currentDate: Date = new Date(), limit = 5): string[] => {
  const currentMonth = currentDate.getMonth() + 1 // 1-12

  const monthData = monthlyTrends.find((m) => m.month === currentMonth)
  if (!monthData) return []

  return monthData.categories
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit)
    .map((c) => c.category)
}

/**
 * Get seasonal product recommendations based on current month
 * @param currentDate Optional date to calculate from, defaults to today
 * @param limit Number of recommendations to return
 * @returns Array of category recommendations with reasons
 */
export const getSeasonalRecommendations = (currentDate: Date = new Date(), limit = 5) => {
  const currentMonth = currentDate.getMonth() + 1 // 1-12

  const monthData = monthlyTrends.find((m) => m.month === currentMonth)
  if (!monthData) return []

  return monthData.categories.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, limit)
}

/**
 * Get month name from month number
 * @param month Month number (1-12)
 * @returns Month name
 */
export const getMonthName = (month: number): string => {
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
  return monthNames[month - 1] || ""
}

/**
 * Main function to get all recommendations based on current date
 * @param currentDate Optional date to calculate from, defaults to today
 * @returns Comprehensive recommendation results
 */
export const getRecommendations = (currentDate: Date = new Date()): RecommendationResult => {
  const currentMonth = currentDate.getMonth() + 1 // 1-12

  return {
    topCategories: getTopCategoriesForMonth(currentDate),
    upcomingEvents: getUpcomingEvents(currentDate),
    seasonalProducts: getSeasonalRecommendations(currentDate),
    currentMonth: currentMonth,
    currentMonthName: getMonthName(currentMonth),
  }
}

/**
 * React hook to use calendar-based recommendations
 * @param initialDate Optional initial date to calculate from, defaults to today
 * @returns Recommendation results and a function to update the date
 */
export const useCalendarRecommendations = (initialDate: Date = new Date()) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate)
  const [recommendations, setRecommendations] = useState<RecommendationResult>(getRecommendations(currentDate))

  useEffect(() => {
    setRecommendations(getRecommendations(currentDate))
  }, [currentDate])

  return {
    recommendations,
    setCurrentDate,
    categoryToUrlMap,
  }
}
