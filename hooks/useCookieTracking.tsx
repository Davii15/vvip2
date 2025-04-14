"use client"

import { useState, useEffect } from "react"

const COOKIE_NAME = "user_activity"
const LOCAL_STORAGE_KEY = "last_visited_page"

export function useCookieTracking(category = "general") {
  const [viewedItems, setViewedItems] = useState<string[]>([])

  useEffect(() => {
    // Track last visited page in local storage
    localStorage.setItem(LOCAL_STORAGE_KEY, category)

    // Check for existing user activity data
    const storedData = localStorage.getItem(COOKIE_NAME)
    const userActivity = storedData ? JSON.parse(storedData) : {}

    if (!userActivity[category]) {
      userActivity[category] = { lastVisit: Date.now(), seenItems: [] }
    } else {
      // Update last visit time
      userActivity[category].lastVisit = Date.now()
    }

    // Get current items for this category
    const currentItems = getCurrentItems(category)

    // Set viewed items from stored data
    setViewedItems(userActivity[category].seenItems || [])

    // Store updated activity data
    localStorage.setItem(COOKIE_NAME, JSON.stringify(userActivity))
    document.cookie = `${COOKIE_NAME}=${JSON.stringify(userActivity)}; path=/; max-age=31536000` // Store for 1 year
  }, [category])

  // Track a new item view
  const trackView = (itemId: string | number) => {
    const itemIdStr = String(itemId)

    // Get current user activity
    const storedData = localStorage.getItem(COOKIE_NAME)
    const userActivity = storedData ? JSON.parse(storedData) : {}

    if (!userActivity[category]) {
      userActivity[category] = { lastVisit: Date.now(), seenItems: [] }
    }

    // Update seen items list - remove if exists and add to front
    let seenItems: string[] = userActivity[category].seenItems || []
    seenItems = seenItems.filter((id: string) => id !== itemIdStr)
    seenItems.unshift(itemIdStr) // Add to beginning
    seenItems = seenItems.slice(0, 20) // Keep only last 20 items

    userActivity[category].seenItems = seenItems

    // Update state
    setViewedItems(seenItems)

    // Store updated data
    localStorage.setItem(COOKIE_NAME, JSON.stringify(userActivity))
    document.cookie = `${COOKIE_NAME}=${JSON.stringify(userActivity)}; path=/; max-age=31536000`
  }

  // Get cookie data for recommendations
  const getCookieData = () => {
    // Get current user activity
    const storedData = localStorage.getItem(COOKIE_NAME)
    const userActivity = storedData ? JSON.parse(storedData) : {}

    const categoryData = userActivity[category] || { lastVisit: Date.now(), seenItems: [] }

    // Return an object with user data that can be used for recommendations
    return {
      viewedItems: categoryData.seenItems || [],
      viewedProducts: (categoryData.seenItems || []).map((id: string) => ({ id })),
      category: category,
      lastVisit: new Date(categoryData.lastVisit).toISOString(),
      // Default values for agriculture-specific fields
      farmSize: "Any",
      cropTypes: [],
      // Add subcategories based on the category
      subcategories: getCurrentItems(category),
    }
  }

  return { trackView, viewedItems, getCookieData }
}

// Simulate fetching new items
function checkForNewItems(category: string, seenItems: string[]): string[] {
  const allItems = getCurrentItems(category)
  return allItems.filter((item: string) => !seenItems.includes(item))
}

// Simulate fetching current items from the system
function getCurrentItems(category: string): string[] {
  const mockItems: { [key: string]: string[] } = {
    Entertainment: ["Music Show", "Life Perfomance", "Album Launch", "Talk Show", "Book Lauch", "Other"],
    Travelling: ["International Airlines", "Local Airlines", "Matatus(SACCOS)", "Digital Cabs", "Trains"],
    "retail-and-supermarket": ["Eateries", "Clothing", "Electronics", "Furniture", "Other"],
    "car-deals": ["SEDAN", "SUV", "ELECTRIC", "SPORTS CAR", "TRUCK", "MOTORBIKES"],
    "health-services": ["General Checkup", "Dental Care", "Eye Care", "Specialised Treatment", "Mental Health"],
    finance: ["Savings Account", "Investment", "Loan", "Credit Card", "Other"],
    hospitality: ["Hotels", "Restaurants", "Bar and Lounges", "OpenCaterings"],
    insurance: ["Auto", "Home", "Life", "Health", "Travel"],
    "beauty-and-massage": ["Massage", "Facial", "Hair", "Nails", "Makeup", "Other"],
    "other-business-ventures": ["Eco-friendly Tech", "SmartHome", "Eco-Friendly Accessories", "Garden Accessories"],
    "real-estate": ["Apartment", "Land", "Ranch"],
    "tourism-and-adventures": ["Gamepark", "Orphanage", "Game Reserve", "Sanctuary", "Hiking ", "Other"],
    electronics: ["Smartphones", "Laptops", "TVs", "Audio", "Cameras", "Gaming", "Wearables"],
    agriculture: ["Seeds", "Fertilizers", "Tools", "Machinery", "Irrigation", "Pesticides"],
    general: ["Popular", "New", "Trending", "Recommended"],
  }
  return mockItems[category] || []
}

// Helper to get the last visited page
export function getLastVisitedPage(): string | null {
  return localStorage.getItem(LOCAL_STORAGE_KEY)
}
