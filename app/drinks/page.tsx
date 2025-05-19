"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Search,
  Droplets,
  Wine,
  Coffee,
  Beer,
  Martini,
  Check,
  Loader2,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Star,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import CountdownTimer from "@/components/CountdownTimer"
import HotTimeDeals from "@/components/HotTimeDeals"
import NewProductsForYou from "@/components/NewProductsForYou"
import { useCookieTracking } from "@/hooks/useCookieTracking"
import { swapArrayElementsRandomly } from "@/utils/swap-utils"
import { isNewThisWeek } from "@/utils/date-utils"
import NewThisWeekBadge from "@/components/NewThisWeekBadge"
import TrendingPopularSection from "@/components/TrendingPopularSection"
import { trendingProducts, popularProducts } from "./trending-data"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TimeBasedRecommendations } from "@/components/TimeBasedRecommendations"

// Add these utility functions at the top of the file, after the imports and before the types
/**
 * Check if a date is within the current week
 * @param dateString ISO date string
 * @returns boolean
 */

/**
 * Format a date string to a readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

// Note: We already have a getDaysRemaining function in the file, so we don't need to add it again

// Types
interface Price {
  amount: number
  currency: string
}

interface Drink {
  id: number
  name: string
  imageUrl: string
  currentPrice: Price
  originalPrice: Price
  type: string
  category: "Soft Drink" | "Alcoholic"
  description: string
  volume: string
  alcoholContent?: string
  isNew?: boolean
  isMostPreferred?: boolean
  dateAdded: string
  origin?: string
  brand: string
  tags?: string[]
  rating?: number
  reviewCount?: number
  ingredients?: string[]
  nutritionalInfo?: {
    calories?: number
    sugar?: number
    caffeine?: number
  }
  servingSuggestion?: string
  hotDealEnds?: string
  isHotDeal?: boolean // Add this field
}

interface Vendor {
  id: number
  name: string
  location: string
  logo: string
  description: string
  drinks: Drink[]
  redirectUrl: string
  mapLink: string
  verified?: boolean
  defaultCurrency: string
}

// Mock data for vendors
const mockVendors: Vendor[] = [
  {
    id: 1,
    name: "Refreshment Haven",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Your one-stop shop for premium soft drinks and refreshing beverages.",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    verified: true,
    drinks: [
      {
        id: 101,
        name: "Tropical Paradise Juice",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 120, currency: "KSH" },
        originalPrice: { amount: 180, currency: "KSH" },
        type: "Juice",
        category: "Soft Drink",
        description: "A refreshing blend of tropical fruits including mango, pineapple, and passion fruit.",
        volume: "500ml",
        isNew: true,
        isMostPreferred: true,
        dateAdded: "2025-03-10T10:30:00Z",
        brand: "Nature's Best",
        tags: ["Tropical", "No Preservatives", "Vitamin C"],
        rating: 4.8,
        reviewCount: 124,
        ingredients: ["Mango", "Pineapple", "Passion Fruit", "Water", "Natural Sweetener"],
        nutritionalInfo: {
          calories: 120,
          sugar: 24,
        },
        servingSuggestion: "Best served chilled with ice cubes",
        hotDealEnds: "2025-04-01T23:59:59Z",
        isHotDeal: true,
      },
      {
        id: 102,
        name: "Sparkling Berry Fusion",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 150, currency: "KSH" },
        originalPrice: { amount: 200, currency: "KSH" },
        type: "Carbonated",
        category: "Soft Drink",
        description: "A fizzy blend of mixed berries with a hint of citrus. Zero sugar and all-natural flavors.",
        volume: "330ml",
        dateAdded: "2025-02-15T10:30:00Z",
        brand: "Fizz Pop",
        tags: ["Sugar-Free", "Natural Flavors", "Sparkling"],
        rating: 4.5,
        reviewCount: 89,
        ingredients: ["Carbonated Water", "Natural Berry Flavors", "Citric Acid", "Stevia Extract"],
        nutritionalInfo: {
          calories: 5,
          sugar: 0,
        },
      },
      {
        id: 103,
        name: "Classic Cola Zero",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 80, currency: "KSH" },
        originalPrice: { amount: 100, currency: "KSH" },
        type: "Cola",
        category: "Soft Drink",
        description: "The classic cola taste without the sugar. Perfect for those watching their calorie intake.",
        volume: "500ml",
        dateAdded: "2025-01-20T10:30:00Z",
        brand: "Fizz Pop",
        isMostPreferred: true,
        tags: ["Sugar-Free", "Zero Calories", "Classic"],
        rating: 4.7,
        reviewCount: 215,
        ingredients: ["Carbonated Water", "Caramel Color", "Phosphoric Acid", "Aspartame", "Natural Flavors"],
        nutritionalInfo: {
          calories: 0,
          sugar: 0,
          caffeine: 35,
        },
      },
    ],
    redirectUrl: "https://refreshmenthaven.com",
  },
  {
    id: 2,
    name: "Exotic Elixirs",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Specializing in unique and exotic non-alcoholic beverages from around the world.",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    verified: true,
    drinks: [
      {
        id: 201,
        name: "Dragon Fruit Lemonade",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 220, currency: "KSH" },
        originalPrice: { amount: 280, currency: "KSH" },
        type: "Specialty",
        category: "Soft Drink",
        description: "A vibrant pink lemonade infused with dragon fruit and a hint of mint. Refreshingly different!",
        volume: "400ml",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        origin: "Thailand",
        brand: "Exotic Elixirs",
        tags: ["Exotic", "Limited Edition", "Handcrafted"],
        rating: 4.9,
        reviewCount: 67,
        ingredients: ["Filtered Water", "Dragon Fruit", "Lemon Juice", "Mint Leaves", "Organic Cane Sugar"],
        nutritionalInfo: {
          calories: 110,
          sugar: 22,
        },
        servingSuggestion: "Pour over crushed ice and garnish with a mint leaf",
        hotDealEnds: "2025-03-30T23:59:59Z",
        isHotDeal: true,
      },
      {
        id: 202,
        name: "Hibiscus & Rose Iced Tea",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 180, currency: "KSH" },
        originalPrice: { amount: 240, currency: "KSH" },
        type: "Tea",
        category: "Soft Drink",
        description: "A floral and aromatic iced tea blend with notes of hibiscus, rose, and a touch of honey.",
        volume: "500ml",
        dateAdded: "2025-02-28T10:30:00Z",
        origin: "Morocco",
        brand: "Exotic Elixirs",
        isMostPreferred: true,
        tags: ["Floral", "Antioxidant-Rich", "Caffeine-Free"],
        rating: 4.6,
        reviewCount: 93,
        ingredients: ["Filtered Water", "Hibiscus Flowers", "Rose Petals", "Honey", "Lemon Zest"],
        nutritionalInfo: {
          calories: 90,
          sugar: 18,
        },
      },
    ],
    redirectUrl: "https://exoticelixirs.com",
  },
  {
    id: 3,
    name: "Premium Spirits",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Curating the finest collection of premium spirits and craft alcoholic beverages.",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    verified: true,
    drinks: [
      {
        id: 301,
        name: "Highland Single Malt Whisky",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 4500, currency: "KSH" },
        originalPrice: { amount: 5800, currency: "KSH" },
        type: "Whisky",
        category: "Alcoholic",
        description: "A 12-year aged single malt with notes of honey, vanilla, and a subtle smoky finish.",
        volume: "700ml",
        alcoholContent: "43%",
        dateAdded: "2025-03-05T10:30:00Z",
        origin: "Scotland",
        brand: "Highland Reserve",
        isMostPreferred: true,
        tags: ["Single Malt", "Aged 12 Years", "Premium"],
        rating: 4.9,
        reviewCount: 156,
        servingSuggestion: "Best enjoyed neat or with a drop of water to release the aromas",
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
      },
      {
        id: 302,
        name: "Artisanal Craft Gin",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 3200, currency: "KSH" },
        originalPrice: { amount: 3800, currency: "KSH" },
        type: "Gin",
        category: "Alcoholic",
        description:
          "A small-batch craft gin infused with 14 botanicals including juniper, coriander, and citrus peels.",
        volume: "500ml",
        alcoholContent: "45%",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        origin: "Kenya",
        brand: "Savanna Spirits",
        tags: ["Craft", "Small Batch", "Local"],
        rating: 4.7,
        reviewCount: 89,
        ingredients: [
          "Grain Neutral Spirit",
          "Juniper Berries",
          "Coriander Seeds",
          "Angelica Root",
          "Citrus Peels",
          "Local Botanicals",
        ],
        servingSuggestion: "Perfect for a G&T with premium tonic water and a slice of grapefruit",
      },
      {
        id: 303,
        name: "Aged Rum Reserve",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 2800, currency: "KSH" },
        originalPrice: { amount: 3500, currency: "KSH" },
        type: "Rum",
        category: "Alcoholic",
        description:
          "A smooth, dark rum aged for 8 years in oak barrels with rich notes of caramel, vanilla, and spice.",
        volume: "700ml",
        alcoholContent: "40%",
        dateAdded: "2025-02-10T10:30:00Z",
        origin: "Caribbean",
        brand: "Island Gold",
        tags: ["Aged", "Dark Rum", "Premium"],
        rating: 4.6,
        reviewCount: 112,
        servingSuggestion: "Enjoy neat, on the rocks, or in premium cocktails",
      },
    ],
    redirectUrl: "https://premiumspirits.com",
  },
  {
    id: 4,
    name: "Craft Brewery Co.",
    location: "Nakuru, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Local craft brewery specializing in unique and flavorful beer varieties.",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    verified: true,
    drinks: [
      {
        id: 401,
        name: "Citrus Haze IPA",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 320, currency: "KSH" },
        originalPrice: { amount: 380, currency: "KSH" },
        type: "Beer",
        category: "Alcoholic",
        description:
          "A hazy IPA bursting with citrus flavors and tropical hop aromas. Balanced bitterness with a smooth finish.",
        volume: "330ml",
        alcoholContent: "6.2%",
        isNew: true,
        dateAdded: "2025-03-20T10:30:00Z",
        origin: "Kenya",
        brand: "Craft Brewery Co.",
        tags: ["IPA", "Craft Beer", "Hazy"],
        rating: 4.8,
        reviewCount: 78,
        ingredients: ["Water", "Malted Barley", "Wheat", "Hops", "Yeast"],
        servingSuggestion: "Serve cold in a tulip glass to enhance the aromatic experience",
        hotDealEnds: "2025-04-10T23:59:59Z",
        isHotDeal: true,
      },
      {
        id: 402,
        name: "Coffee Stout",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 350, currency: "KSH" },
        originalPrice: { amount: 420, currency: "KSH" },
        type: "Beer",
        category: "Alcoholic",
        description:
          "A rich, dark stout infused with locally roasted coffee beans. Notes of chocolate, coffee, and a hint of caramel.",
        volume: "330ml",
        alcoholContent: "5.8%",
        dateAdded: "2025-02-25T10:30:00Z",
        origin: "Kenya",
        brand: "Craft Brewery Co.",
        isMostPreferred: true,
        tags: ["Stout", "Coffee", "Dark Beer"],
        rating: 4.7,
        reviewCount: 92,
        ingredients: ["Water", "Malted Barley", "Roasted Barley", "Coffee Beans", "Hops", "Yeast"],
        servingSuggestion: "Best enjoyed slightly below room temperature in a snifter glass",
      },
    ],
    redirectUrl: "https://craftbreweryco.com",
  },
]

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

// Get icon for drink type
const getDrinkTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "juice":
      return <Droplets className="mr-2 text-orange-500" size={20} />
    case "carbonated":
    case "cola":
      return <Droplets className="mr-2 text-blue-500" size={20} />
    case "tea":
      return <Coffee className="mr-2 text-amber-700" size={20} />
    case "specialty":
      return <Droplets className="mr-2 text-pink-500" size={20} />
    case "whisky":
      return <Wine className="mr-2 text-amber-600" size={20} />
    case "gin":
      return <Martini className="mr-2 text-blue-400" size={20} />
    case "rum":
      return <Wine className="mr-2 text-amber-800" size={20} />
    case "beer":
      return <Beer className="mr-2 text-yellow-600" size={20} />
    default:
      return <Droplets className="mr-2 text-blue-500" size={20} />
  }
}

// Get color scheme based on drink category
const getCategoryColors = (category: "Soft Drink" | "Alcoholic") => {
  if (category === "Soft Drink") {
    return {
      gradient: "from-cyan-500 to-blue-500",
      lightGradient: "from-cyan-100 to-blue-100",
      text: "text-blue-600",
      border: "border-blue-200",
      button: "bg-blue-500 hover:bg-blue-600",
      badge: "bg-blue-100 text-blue-800",
      highlight: "text-blue-500",
    }
  } else {
    return {
      gradient: "from-purple-500 to-indigo-500",
      lightGradient: "from-purple-100 to-indigo-100",
      text: "text-indigo-600",
      border: "border-indigo-200",
      button: "bg-indigo-500 hover:bg-indigo-600",
      badge: "bg-indigo-100 text-indigo-800",
      highlight: "text-indigo-500",
    }
  }
}

export default function DrinksPage() {
  useCookieTracking("drinks")
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors)
  const [selectedCategory, setSelectedCategory] = useState<"Soft Drink" | "Alcoholic" | "">("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000])
  const [sortOrder, setSortOrder] = useState("default")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchInputRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null)

  // Get all drink types
  const softDrinkTypes = Array.from(
    new Set(
      vendors
        .flatMap((vendor) => vendor.drinks)
        .filter((drink) => drink.category === "Soft Drink")
        .map((drink) => drink.type),
    ),
  ).sort()

  const alcoholicTypes = Array.from(
    new Set(
      vendors
        .flatMap((vendor) => vendor.drinks)
        .filter((drink) => drink.category === "Alcoholic")
        .map((drink) => drink.type),
    ),
  ).sort()

  // States for infinite scroll
  const [visibleCategories, setVisibleCategories] = useState<("Soft Drink" | "Alcoholic")[]>([
    "Soft Drink",
    "Alcoholic",
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)

  // Custom color scheme for drinks
  const drinkColorScheme = {
    primary: "from-blue-500 to-green-700",
    secondary: "bg-blue-100",
    accent: "bg-green-600",
    text: "text-emerald-900",
    background: "bg-emerald-50",
  }

  // Transform drinks for HotTimeDeals and NewProductsForYou components
  const allDrinks = vendors.flatMap((vendor) =>
    vendor.drinks.map((drink) => ({
      id: drink.id,
      name: drink.name,
      imageUrl: drink.imageUrl,
      currentPrice: drink.currentPrice,
      originalPrice: drink.originalPrice,
      category: drink.category,
      dateAdded: drink.dateAdded,
      isNew: drink.isNew,
      isHotDeal: !!drink.hotDealEnds,
      hotDealEnds: drink.hotDealEnds,
      description: drink.description,
    })),
  )

  // Get hot deals
  const hotDeals = allDrinks
    .filter((drink) => drink.hotDealEnds)
    .map((drink) => ({
      id: drink.id,
      name: drink.name,
      imageUrl: drink.imageUrl,
      currentPrice: drink.currentPrice,
      originalPrice: drink.originalPrice,
      category: drink.category,
      expiresAt: drink.hotDealEnds || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: drink.description,
      discount: Math.round(
        ((drink.originalPrice.amount - drink.currentPrice.amount) / drink.originalPrice.amount) * 100,
      ),
    }))

  // Launch confetti effect on page load
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#0ea5e9", "#6366f1", "#8b5cf6"], // Blue, indigo, and purple colors
    })
  }, [])

  // Filter vendors based on search and filters
  useEffect(() => {
    let results = vendors

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      results = results.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          vendor.location.toLowerCase().includes(lowerCaseSearchTerm) ||
          vendor.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          vendor.drinks.some((drink) => {
            return (
              drink.name.toLowerCase().includes(lowerCaseSearchTerm) ||
              drink.description.toLowerCase().includes(lowerCaseSearchTerm) ||
              drink.type.toLowerCase().includes(lowerCaseSearchTerm) ||
              drink.brand.toLowerCase().includes(lowerCaseSearchTerm) ||
              (drink.origin && drink.origin.toLowerCase().includes(lowerCaseSearchTerm)) ||
              (drink.tags && drink.tags.some((tag) => tag.toLowerCase().includes(lowerCaseSearchTerm)))
            )
          }),
      )
    }

    // Filter by category
    if (selectedCategory) {
      results = results.filter((vendor) => vendor.drinks.some((drink) => drink.category === selectedCategory))
    }

    // Filter by type
    if (selectedType) {
      results = results.filter((vendor) => vendor.drinks.some((drink) => drink.type === selectedType))
    }

    // Filter by price range
    results = results.filter((vendor) =>
      vendor.drinks.some(
        (drink) => drink.currentPrice.amount >= priceRange[0] && drink.currentPrice.amount <= priceRange[1],
      ),
    )

    // Sort results
    if (sortOrder === "price-asc") {
      results.sort((a, b) => {
        const aMinPrice = Math.min(...a.drinks.map((drink) => drink.currentPrice.amount))
        const bMinPrice = Math.min(...b.drinks.map((drink) => drink.currentPrice.amount))
        return aMinPrice - bMinPrice
      })
    } else if (sortOrder === "price-desc") {
      results.sort((a, b) => {
        const aMaxPrice = Math.max(...a.drinks.map((drink) => drink.currentPrice.amount))
        const bMaxPrice = Math.max(...b.drinks.map((drink) => drink.currentPrice.amount))
        return bMaxPrice - aMaxPrice
      })
    } else if (sortOrder === "rating") {
      results.sort((a, b) => {
        const aAvgRating = a.drinks.reduce((sum, drink) => sum + (drink.rating || 0), 0) / a.drinks.length
        const bAvgRating = b.drinks.reduce((sum, drink) => sum + (drink.rating || 0), 0) / b.drinks.length
        return bAvgRating - aAvgRating
      })
    }

    setFilteredVendors(results)
  }, [searchTerm, selectedCategory, selectedType, priceRange, sortOrder, vendors])

  // Infinite scrolling
  const loadMoreItems = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false)
      setHasMore(false) // Since we only have two categories, we can set hasMore to false after loading
    }, 800)
  }, [isLoading, hasMore])

  // Set up intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreItems()
        }
      },
      { threshold: 0.1 },
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [loadMoreItems, hasMore])

  // Handle click outside search suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Add swapping effect every 10 minutes
  useEffect(() => {
    const swapInterval = setInterval(
      () => {
        // Swap vendors
        setVendors((prevVendors) => {
          const newVendors = [...prevVendors]
          return swapArrayElementsRandomly(newVendors)
        })
      },
      10 * 60 * 1000, // 10 minutes
    )

    return () => clearInterval(swapInterval)
  }, [])

  // Function to view drink details
  const viewDrinkDetails = (drink: Drink) => {
    setSelectedDrink(drink)
  }

  // Function to close drink details
  const closeDrinkDetails = () => {
    setSelectedDrink(null)
  }

  // Function to add to cart
  const addToCart = (drink: Drink) => {
    alert(`Added ${drink.name} to cart!`)
    closeDrinkDetails()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-l from-indigo-500/10 to-blue-500/10 -z-10"></div>

      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              animation: "float-drink infinite ease-in-out",
            }}
          />
        ))}
      </div>

      {/* Drink Detail Modal */}
      {selectedDrink && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold truncate">{selectedDrink.name}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeDrinkDetails}
                className="rounded-full hover:bg-blue-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Drink Image */}
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <img
                      src={selectedDrink.imageUrl || "/placeholder.svg"}
                      alt={selectedDrink.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                </div>

                {/* Drink Info */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <Badge
                        className={`bg-${selectedDrink.category === "Soft Drink" ? "blue" : "purple"}-100 text-${selectedDrink.category === "Soft Drink" ? "blue" : "purple"}-800 mr-2`}
                      >
                        {selectedDrink.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`border-${selectedDrink.category === "Soft Drink" ? "blue" : "purple"}-300 text-${selectedDrink.category === "Soft Drink" ? "blue" : "purple"}-700`}
                      >
                        {selectedDrink.type}
                      </Badge>
                      {selectedDrink.isNew && (
                        <div className="ml-2">
                          <NewThisWeekBadge />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center mb-4">
                      <div className="flex items-center bg-blue-50 px-2 py-1 rounded-md">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(selectedDrink.rating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-blue-700 font-medium">
                          ({selectedDrink.reviewCount} reviews)
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{selectedDrink.description}</p>

                    <div className="space-y-3 mb-6 bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700 font-medium">Brand</span>
                        <span className="font-medium">{selectedDrink.brand}</span>
                      </div>

                      {selectedDrink.origin && (
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-700 font-medium">Origin</span>
                          <span className="font-medium">{selectedDrink.origin}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700 font-medium">Volume</span>
                        <span className="font-medium">{selectedDrink.volume}</span>
                      </div>

                      {selectedDrink.alcoholContent && (
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-700 font-medium">Alcohol Content</span>
                          <span className="font-medium">{selectedDrink.alcoholContent}</span>
                        </div>
                      )}

                      {selectedDrink.nutritionalInfo && (
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-700 font-medium">Calories</span>
                          <span className="font-medium">{selectedDrink.nutritionalInfo.calories || "N/A"} kcal</span>
                        </div>
                      )}

                      {selectedDrink.nutritionalInfo && selectedDrink.nutritionalInfo.sugar !== undefined && (
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-700 font-medium">Sugar</span>
                          <span className="font-medium">{selectedDrink.nutritionalInfo.sugar}g</span>
                        </div>
                      )}
                    </div>

                    {selectedDrink.ingredients && selectedDrink.ingredients.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2 text-blue-700">Ingredients</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                          {selectedDrink.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedDrink.servingSuggestion && (
                      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-blue-700">Serving Suggestion</h3>
                        <p className="text-gray-700">{selectedDrink.servingSuggestion}</p>
                      </div>
                    )}

                    <div className="flex items-baseline mb-6 bg-white p-4 rounded-lg shadow-sm">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                        {formatPrice(selectedDrink.currentPrice)}
                      </span>

                      {selectedDrink.originalPrice &&
                        selectedDrink.originalPrice.amount > selectedDrink.currentPrice.amount && (
                          <>
                            <span className="ml-2 text-lg text-gray-500 line-through">
                              {formatPrice(selectedDrink.originalPrice)}
                            </span>
                            <Badge className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              {Math.round(
                                ((selectedDrink.originalPrice.amount - selectedDrink.currentPrice.amount) /
                                  selectedDrink.originalPrice.amount) *
                                  100,
                              )}
                              % OFF
                            </Badge>
                          </>
                        )}
                    </div>

                    <div className="flex gap-4">
                      <Button
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md transition-all duration-300"
                        onClick={() => addToCart(selectedDrink)}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-300"
                        onClick={() => {
                          alert(`Added ${selectedDrink.name} to wishlist!`)
                          closeDrinkDetails()
                        }}
                      >
                        Add to Wishlist
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-[1920px] relative z-10">
        {/* Header with animated gradient text */}
        <div className="text-center mb-10">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Refreshing Drinks & Premium Spirits
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover exclusive deals on soft drinks and alcoholic beverages from top brands around the world
          </motion.p>
        </div>

        {/* Countdown Timer */}
        <div className="mb-8">
          <CountdownTimer targetDate="2025-05-31T23:59:59" startDate="2025-03-01T00:00:00" />
        </div>

        {/* Hot Time Deals Section */}
        {hotDeals.length > 0 && (
          <HotTimeDeals
            deals={hotDeals}
            colorScheme="blue"
            title="Limited Time Drink Offers"
            subtitle="Grab these refreshing deals before they're gone!"
          />
        )}

        {/* New Products For You Section */}
        <NewProductsForYou allProducts={allDrinks} colorScheme="purple" maxProducts={4} />

        <div className="container mx-auto px-4">
          <TimeBasedRecommendations
            products={vendors.flatMap((vendor) =>
              vendor.drinks.map((drink) => ({
                id: drink.id,
                name: drink.name,
                imageUrl: drink.imageUrl,
                description: drink.description,
                currentPrice: drink.currentPrice,
                originalPrice: drink.originalPrice,
                category: drink.type,
                recommendedTimes:
                  drink.type.toLowerCase().includes("juice") || drink.type.toLowerCase().includes("smoothie")
                    ? ["morning"]
                    : drink.type.toLowerCase().includes("tea") && !drink.name.toLowerCase().includes("night")
                      ? ["afternoon"]
                      : drink.category === "Alcoholic"
                        ? ["evening"]
                        : drink.name.toLowerCase().includes("night") || drink.name.toLowerCase().includes("chamomile")
                          ? ["night"]
                          : undefined,
              })),
            )}
            title="Drinks Perfect For This Time"
            subtitle="Refreshments ideal for your current moment"
            colorScheme="blue"
            maxProducts={4}
          />
        </div>

        {/* Trending and Popular Section */}
        <TrendingPopularSection
          trendingProducts={trendingProducts}
          popularProducts={popularProducts}
          colorScheme={drinkColorScheme}
          title="Favorite Drinks"
          subtitle="See what's trending and most popular"
        />

        {/*the shop logic*/}
        <div className="flex justify-center my-8">
          <Link href="/drinks/shop">
            <Button
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
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
                <Wine className="mr-2 h-5 w-5" />
                Explore Our Drinks Shop Today!
                <motion.div animate={{ x: isHovered ? 5 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronRight className="ml-2 h-5 w-5" />
                </motion.div>
              </span>
              <motion.div
                className="absolute -top-1 -right-1"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Sparkles className="h-5 w-5 text-yellow-300" />
              </motion.div>
            </Button>
          </Link>
        </div>

        {/* Enhanced search section */}
        <div className="mb-10 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-100">
          <div className="relative mb-6" ref={searchInputRef}>
            <Input
              type="text"
              placeholder="Search for drinks, brands, or flavors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pr-12 rounded-lg border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-400 text-lg"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500" size={24} />
          </div>

          {/* Filter options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category filter */}
            <div>
              <h3 className="font-semibold mb-2 text-gray-700">Category</h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === "" ? "default" : "outline"}
                  className={`cursor-pointer ${selectedCategory === "" ? "bg-blue-500" : "hover:bg-blue-100"}`}
                  onClick={() => setSelectedCategory("")}
                >
                  All Categories
                </Badge>
                <Badge
                  variant={selectedCategory === "Soft Drink" ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedCategory === "Soft Drink" ? "bg-blue-500" : "hover:bg-blue-100"
                  }`}
                  onClick={() => setSelectedCategory("Soft Drink")}
                >
                  <Droplets className="h-3 w-3 mr-1" />
                  Soft Drinks
                </Badge>
                <Badge
                  variant={selectedCategory === "Alcoholic" ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedCategory === "Alcoholic" ? "bg-indigo-500" : "hover:bg-indigo-100"
                  }`}
                  onClick={() => setSelectedCategory("Alcoholic")}
                >
                  <Wine className="h-3 w-3 mr-1" />
                  Alcoholic
                </Badge>
              </div>
            </div>

            {/* Type filter */}
            <div>
              <h3 className="font-semibold mb-2 text-gray-700">Type</h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedType === "" ? "default" : "outline"}
                  className={`cursor-pointer ${selectedType === "" ? "bg-purple-500" : "hover:bg-purple-100"}`}
                  onClick={() => setSelectedType("")}
                >
                  All Types
                </Badge>
                {selectedCategory === "Soft Drink" || selectedCategory === ""
                  ? softDrinkTypes.map((type) => (
                      <Badge
                        key={type}
                        variant={selectedType === type ? "default" : "outline"}
                        className={`cursor-pointer ${selectedType === type ? "bg-blue-500" : "hover:bg-blue-100"}`}
                        onClick={() => setSelectedType(type)}
                      >
                        {getDrinkTypeIcon(type)}
                        {type}
                      </Badge>
                    ))
                  : null}
                {selectedCategory === "Alcoholic" || selectedCategory === ""
                  ? alcoholicTypes.map((type) => (
                      <Badge
                        key={type}
                        variant={selectedType === type ? "default" : "outline"}
                        className={`cursor-pointer ${selectedType === type ? "bg-indigo-500" : "hover:bg-indigo-100"}`}
                        onClick={() => setSelectedType(type)}
                      >
                        {getDrinkTypeIcon(type)}
                        {type}
                      </Badge>
                    ))
                  : null}
              </div>
            </div>

            {/* Price range filter */}
            <div>
              <h3 className="font-semibold mb-2 text-gray-700">
                Price Range: {formatPrice({ amount: priceRange[0], currency: "KSH" })} -{" "}
                {formatPrice({ amount: priceRange[1], currency: "KSH" })}
              </h3>
              <div className="px-2 py-4">
                <Slider
                  defaultValue={[0, 6000]}
                  max={6000}
                  step={100}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Sort options and results count */}
          <div className="flex flex-wrap justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredVendors.reduce(
                  (count, vendor) =>
                    count +
                    vendor.drinks.filter(
                      (drink) =>
                        (!selectedCategory || drink.category === selectedCategory) &&
                        (!selectedType || drink.type === selectedType),
                    ).length,
                  0,
                )}{" "}
                drinks found
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="p-2 border rounded-md text-sm bg-white"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
              <ArrowUpDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Main content with infinite scroll */}
        <AnimatePresence mode="popLayout">
          {visibleCategories.map((category) => (
            <motion.div
              key={category}
              className="mb-16"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-6">
                {category === "Soft Drink" ? (
                  <Droplets className="h-8 w-8 text-blue-500 mr-3" />
                ) : (
                  <Wine className="h-8 w-8 text-indigo-500 mr-3" />
                )}
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {category === "Soft Drink" ? "Refreshing Soft Drinks" : "Premium Alcoholic Beverages"}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {filteredVendors
                  .filter((vendor) => vendor.drinks.some((drink) => drink.category === category))
                  .map((vendor) => (
                    <VendorCard
                      key={`${vendor.id}-${category}`}
                      vendor={vendor}
                      category={category}
                      selectedType={selectedType}
                      onViewDrinkDetails={viewDrinkDetails}
                    />
                  ))}
              </div>

              {filteredVendors.filter((vendor) => vendor.drinks.some((drink) => drink.category === category)).length ===
                0 && (
                <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-8 text-center shadow-md">
                  <p className="text-gray-600 text-lg">
                    No {category.toLowerCase()} vendors found matching your criteria.
                  </p>
                  <p className="text-gray-500 mt-2">Try adjusting your filters or search term.</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center bg-white/80 p-6 rounded-full backdrop-blur-sm">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              <p className="mt-2 text-blue-600 font-medium">Loading more refreshing options...</p>
            </div>
          </div>
        )}

        {/* Loader reference element */}
        <div ref={loaderRef} className="h-20"></div>
      </div>

      {/* Add keyframes for floating animation */}
      <style jsx global>{`
        @keyframes float-drink {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slide-in {
          animation: slide-in 0.8s ease-out forwards;
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

// Vendor Card Component
function VendorCard({
  vendor,
  category,
  selectedType,
  onViewDrinkDetails,
}: {
  vendor: Vendor
  category: "Soft Drink" | "Alcoholic"
  selectedType: string
  onViewDrinkDetails: (drink: Drink) => void
}) {
  const [imageError, setImageError] = useState(false)
  const colors = getCategoryColors(category)

  // Filter drinks by category and selected type
  const filteredDrinks = vendor.drinks.filter(
    (drink) => drink.category === category && (!selectedType || drink.type === selectedType),
  )

  if (filteredDrinks.length === 0) return null

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col border border-gray-100"
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <div className={`p-6 bg-gradient-to-r ${colors.lightGradient}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <Image
                src={imageError ? "/placeholder.svg?height=60&width=60" : vendor.logo}
                alt={vendor.name}
                width={60}
                height={60}
                className="rounded-full border-2 border-white shadow-md"
                onError={() => setImageError(true)}
              />
              {vendor.verified && (
                <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <h3 className={`text-xl font-bold ${colors.text}`}>{vendor.name}</h3>
              <p className="text-gray-600 text-sm">{vendor.location}</p>
            </div>
          </div>
          <a
            href={vendor.redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${colors.button} text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap`}
          >
            Visit Store
          </a>
        </div>
        <p className="text-gray-700 mb-4 line-clamp-2">{vendor.description}</p>
      </div>

      <div className="p-4 flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredDrinks.map((drink) => (
          <DrinkCard key={drink.id} drink={drink} onViewDetails={onViewDrinkDetails} />
        ))}
      </div>
    </motion.div>
  )
}

function MostPreferredBadge() {
  return (
    <motion.div
      className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center"
      animate={{
        scale: [1, 1.1, 1],
        boxShadow: ["0 4px 6px rgba(0, 0, 0, 0.1)", "0 10px 15px rgba(0, 0, 0, 0.2)", "0 4px 6px rgba(0, 0, 0, 0.1)"],
      }}
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    >
      <TrendingUp className="h-3 w-3 mr-1" />
      <span>most-preferred</span>
    </motion.div>
  )
}

// Drink Card Component
function DrinkCard({ drink, onViewDetails }: { drink: Drink; onViewDetails: (drink: Drink) => void }) {
  const [imageError, setImageError] = useState(false)
  const colors = getCategoryColors(drink.category)

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((drink.originalPrice.amount - drink.currentPrice.amount) / drink.originalPrice.amount) * 100,
  )

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full border border-gray-100"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onViewDetails(drink)}
    >
      <div className="relative">
        <div className="relative pt-[75%]">
          <Image
            src={imageError ? "/placeholder.svg?height=300&width=400" : drink.imageUrl}
            alt={drink.name}
            layout="fill"
            objectFit="cover"
            className="transition-all duration-500 hover:scale-110"
            onError={() => setImageError(true)}
          />
        </div>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {discountPercentage >= 20 && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md">
              {discountPercentage}% OFF
            </div>
          )}

          {drink.isNew && (
            <div className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              NEW
            </div>
          )}
        </div>

        {/* Most preferred badge */}
        {drink.isMostPreferred && (
          <div className="absolute top-2 left-2">
            <MostPreferredBadge />
          </div>
        )}

        {/* New this week badge */}
        {isNewThisWeek(drink.dateAdded) && !drink.isNew && (
          <div className="absolute bottom-2 left-2">
            <NewThisWeekBadge />
          </div>
        )}
      </div>

      <div className="p-3 flex-grow flex flex-col">
        <div className="mb-1 flex items-center">
          <Badge variant="outline" className={`text-xs ${colors.badge}`}>
            {drink.type}
          </Badge>
          {drink.alcoholContent && <span className="ml-2 text-xs text-gray-500">{drink.alcoholContent} ABV</span>}
        </div>

        <h4 className={`font-semibold ${colors.text} mb-1 line-clamp-1`}>{drink.name}</h4>

        <p className="text-xs text-gray-500 mb-1">{drink.brand}</p>

        <p className="text-xs text-gray-600 mb-2 line-clamp-2 flex-grow">{drink.description}</p>

        {/* Rating */}
        {drink.rating && (
          <div className="flex items-center mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(drink.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-600">
              {drink.rating.toFixed(1)} ({drink.reviewCount})
            </span>
          </div>
        )}

        {/* Volume */}
        <div className="flex items-center mb-2">
          <span className="text-xs text-gray-600">{drink.volume}</span>
          {drink.origin && (
            <>
              <span className="mx-1 text-gray-300">•</span>
              <span className="text-xs text-gray-600">{drink.origin}</span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <div className={`text-base font-bold ${colors.highlight}`}>{formatPrice(drink.currentPrice)}</div>
            <div className="text-xs text-gray-500 line-through">{formatPrice(drink.originalPrice)}</div>
          </div>

          <motion.button
            className={`${colors.button} text-white px-3 py-1.5 rounded-md text-xs font-medium`}
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
