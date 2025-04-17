"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Search,
  X,
  Clock,
  MapPin,
  Tractor,
  Leaf,
  Droplets,
  FlaskRoundIcon as Flask,
  Wheat,
  Filter,
  Sun,
  Cloud,
  ArrowRight,
  CloudRain,
  Calendar,
  Percent,
  Award,
  Info,
  ChevronDown,
  ChevronUp,
  Share2,
  Star,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"
import CountdownTimer from "@/components/CountdownTimer"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HotTimeDeals from "@/components/HotTimeDeals"
import { useCookieTracking } from "@/hooks/useCookieTracking"
import { swapArrayElementsRandomly, swapVendorsWithinCategory } from "@/utils/swap-utils"
import { isNewThisWeek } from "@/utils/date-utils"
import NewThisWeekBadge from "@/components/NewThisWeekBadge"
import NewProductsForYou from "@/components/NewProductsForYou"
import { transformAgricultureToProducts } from "@/utils/product-transformers"
import TrendingPopularSection from "@/components/TrendingPopularSection"
import { trendingProducts, popularProducts } from "./trending-data"
import Link from "next/link"
import AgricultureRecommendations from "@/components/recommendations/agriculture-recommendations"


interface Price {
  amount: number
  currency: string
}

interface Product {
  id: number
  name: string
  imageUrl: string
  currentPrice: Price
  originalPrice: Price
  isNew?: boolean
  isLimitedStock?: boolean
  type: "Machinery" | "Seedlings" | "Consultancy" | "Pesticides" | "Fertilizers"
  description: string
  dateAdded: string // ISO date string
  rating?: number
  bestSeason?: string
  farmSize?: string
  specifications?: Record<string, string>
  isMostPreferred?: boolean
  isHotDeal?: boolean // Add this field
  hotDealEnds?: string // Add this field - ISO date string
}

interface Vendor {
  id: number
  name: string
  location: string
  logo: string
  description: string
  products: Product[]
  redirectUrl: string
  mapLink: string
  defaultCurrency: string
  verified?:boolean
  established?: string
  specialties?: string[]
  isMostPreferred?: boolean
}

// Mock data for vendors with enhanced information
const mockVendors: Vendor[] = [
  {
    id: 1,
    name: "FarmTech Solutions",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Leading provider of advanced agricultural technology and machinery at competitive prices.",
    mapLink: "https://www.google.com/maps/search/?api=1&query=FarmTech+Solutions+Nairobi+Kenya",
    defaultCurrency: "KSH",
    established: "2005",
    isMostPreferred: true,
    verified:true,
    specialties: ["Precision Agriculture", "Smart Farming", "Irrigation Systems"],
    products: [
      {
        id: 1,
        name: "Compact Tractor Model X200",
        imageUrl: "/placeholder.svg?height=200&width=300",
        currentPrice: { amount: 450000, currency: "KSH" },
        originalPrice: { amount: 580000, currency: "KSH" },
        type: "Machinery",
        description: "Versatile compact tractor perfect for small to medium farms with excellent fuel efficiency.",
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.8,
        bestSeason: "All Year",
        isHotDeal: true, 
        hotDealEnds: "2025-04-15T23:59:59Z",
        farmSize: "2-10 acres",
        specifications: {
          Engine: "25HP Diesel",
          Transmission: "Hydrostatic",
          PTO: "540 RPM",
          "Lift Capacity": "650 kg",
        },
      },
      {
        id: 2,
        name: "Automated Irrigation System",
        imageUrl: "/placeholder.svg?height=200&width=300",
        currentPrice: { amount: 85000, currency: "KSH" },
        originalPrice: { amount: 120000, currency: "KSH" },
        type: "Machinery",
        description: "Smart irrigation system with soil moisture sensors and mobile app control.",
        isNew: true,
        dateAdded: "2025-03-10T10:30:00Z",
        rating: 4.9,
        bestSeason: "Dry Season",
        farmSize: "Any",
        specifications: {
          Coverage: "Up to 2 acres",
          Sensors: "Soil moisture, temperature",
          Control: "Mobile app, automatic",
          "Water Saving": "Up to 40%",
        },
      },
      {
        id: 3,
        name: "Farm Management Consultation",
        imageUrl: "/placeholder.svg?height=200&width=300",
        currentPrice: { amount: 15000, currency: "KSH" },
        originalPrice: { amount: 25000, currency: "KSH" },
        type: "Consultancy",
        description: "Expert consultation on farm layout, crop selection, and operational efficiency.",
        dateAdded: "2025-02-20T10:30:00Z",
        rating: 4.7,
        bestSeason: "Pre-Planting",
        farmSize: "Any",
      },
      {
        id: 4,
        name: "Premium NPK Fertilizer (50kg)",
        imageUrl: "/placeholder.svg?height=200&width=300",
        currentPrice: { amount: 3800, currency: "KSH" },
        originalPrice: { amount: 4500, currency: "KSH" },
        type: "Fertilizers",
        description: "Balanced NPK fertilizer for optimal crop growth and yield enhancement.",
        isLimitedStock: true,
        dateAdded: "2025-01-15T10:30:00Z",
        rating: 4.6,
        bestSeason: "Growing Season",
        specifications: {
          "NPK Ratio": "15-15-15",
          "Application Rate": "250-300 kg/ha",
          "Suitable Crops": "Maize, Wheat, Vegetables",
        },
      },
    ],
    redirectUrl: "https://farmtech-solutions.com",
  },
  {
    id: 2,
    name: "Green Harvest Supplies",
    location: "Nakuru, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Your one-stop shop for organic seeds, seedlings, and eco-friendly agricultural inputs.",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Green+Harvest+Supplies+Nakuru+Kenya",
    defaultCurrency: "KSH",
    established: "2012",
    specialties: ["Organic Farming", "Sustainable Agriculture", "Heirloom Seeds"],
    products: [
      {
        id: 5,
        name: "Organic Tomato Seedlings (Pack of 50)",
        imageUrl: "/placeholder.svg?height=200&width=300",
        currentPrice: { amount: 1200, currency: "KSH" },
        originalPrice: { amount: 1800, currency: "KSH" },
        type: "Seedlings",
        description: "Disease-resistant, high-yield tomato seedlings grown using organic methods.",
        isLimitedStock: true,
        dateAdded: "2025-03-05T10:30:00Z",
        rating: 4.9,
        isHotDeal: true, 
        hotDealEnds: "2025-04-15T23:59:59Z",
        bestSeason: "Early Spring",
        specifications: {
          Variety: "Roma, Cherry, Beefsteak",
          Maturity: "65-80 days",
          "Disease Resistance": "High",
          Yield: "15-20 kg per plant",
        },
      },
      {
        id: 6,
        name: "Hybrid Maize Seeds (10kg)",
        imageUrl: "/placeholder.svg?height=200&width=300",
        currentPrice: { amount: 4500, currency: "KSH" },
        originalPrice: { amount: 5200, currency: "KSH" },
        type: "Seedlings",
        description: "Drought-resistant hybrid maize seeds with high germination rate.",
        dateAdded: "2025-02-10T10:30:00Z",
        rating: 4.7,
        isMostPreferred: true,
        bestSeason: "Rainy Season",
        specifications: {
          Variety: "H614D Hybrid",
          Maturity: "120-140 days",
          "Yield Potential": "35-40 bags/acre",
          "Drought Tolerance": "High",
        },
      },
      {
        id: 7,
        name: "Organic Pest Control Solution (5L)",
        imageUrl: "/placeholder.svg?height=200&width=300",
        currentPrice: { amount: 2800, currency: "KSH" },
        originalPrice: { amount: 3500, currency: "KSH" },
        type: "Pesticides",
        description: "Eco-friendly pest control solution safe for organic farming.",
        isNew: true,
        dateAdded: "2025-03-12T10:30:00Z",
        rating: 4.5,
        bestSeason: "Growing Season",
        specifications: {
          "Active Ingredients": "Neem oil, Pyrethrum",
          "Target Pests": "Aphids, Whiteflies, Thrips",
          "Safety Period": "1 day",
          "Organic Certification": "USDA, EU",
        },
      },
      {
        id: 8,
        name: "Soil Health Assessment Service",
        imageUrl: "/placeholder.svg?height=200&width=300",
        currentPrice: { amount: 5000, currency: "KSH" },
        originalPrice: { amount: 7500, currency: "KSH" },
        type: "Consultancy",
        description: "Comprehensive soil testing and personalized amendment recommendations.",
        dateAdded: "2025-01-25T10:30:00Z",
        isHotDeal: true, // Mark this as a hot deal
        hotDealEnds: "2025-04-15T23:59:59Z",
        rating: 4.8,
        bestSeason: "Pre-Planting",
        farmSize: "Any",
      },
    ],
    redirectUrl: "https://green-harvest.com",
  },
  {
    id: 3,
    name: "AgriGrow Experts",
    location: "Eldoret, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Specialized in advanced fertilizers, pesticides, and agricultural consultancy services.",
    mapLink: "https://www.google.com/maps/search/?api=1&query=AgriGrow+Experts+Eldoret+Kenya",
    defaultCurrency: "KSH",
    established: "2008",
    verified:true,
    specialties: ["Crop Protection", "Soil Fertility", "Precision Farming"],
    products: [
      {
        id: 9,
        name: "Precision Sprayer Drone",
        imageUrl: "/placeholder.svg?height=200&width=300",
        currentPrice: { amount: 180000, currency: "KSH" },
        originalPrice: { amount: 250000, currency: "KSH" },
        type: "Machinery",
        description: "Automated drone for precise application of pesticides and fertilizers.",
        dateAdded: "2025-02-28T10:30:00Z",
        rating: 4.9,
        isMostPreferred: true,
        bestSeason: "Growing Season",
        farmSize: "10+ acres",
        specifications: {
          "Flight Time": "25 minutes",
          "Tank Capacity": "10L",
          Coverage: "15-20 acres/hour",
          "Spray Width": "4-6 meters",
        },
      },
      {
        id: 10,
        name: "Crop Disease Management Program",
        imageUrl: "/placeholder.svg?height=200&width=300",
        currentPrice: { amount: 12000, currency: "KSH" },
        originalPrice: { amount: 18000, currency: "KSH" },
        type: "Consultancy",
        description: "Six-month program for identifying, preventing, and managing crop diseases.",
        dateAdded: "2025-01-20T10:30:00Z",
        isHotDeal: true, 
        hotDealEnds: "2025-04-15T23:59:59Z",
        rating: 4.7,
        bestSeason: "All Year",
        farmSize: "Any",
      },
      {
        id: 11,
        name: "Broad-Spectrum Fungicide (2L)",
        imageUrl: "/placeholder.svg?height=200&width=300",
        currentPrice: { amount: 3200, currency: "KSH" },
        originalPrice: { amount: 4000, currency: "KSH" },
        type: "Pesticides",
        description: "Effective against a wide range of fungal diseases in crops.",
        isLimitedStock: true,
        dateAdded: "2025-03-01T10:30:00Z",
        rating: 4.6,
        bestSeason: "Rainy Season",
        specifications: {
          "Active Ingredient": "Azoxystrobin 25%",
          "Target Diseases": "Powdery mildew, Rust, Leaf spot",
          "Application Rate": "20-40ml per 20L water",
          "Safety Period": "14 days",
        },
      },
      {
        id: 12,
        name: "Micronutrient Fertilizer Blend (25kg)",
        imageUrl: "/placeholder.svg?height=200&width=300",
        currentPrice: { amount: 4800, currency: "KSH" },
        originalPrice: { amount: 6000, currency: "KSH" },
        type: "Fertilizers",
        description: "Specialized blend of essential micronutrients for optimal plant health.",
        isNew: true,
        dateAdded: "2025-03-08T10:30:00Z",
        rating: 4.8,
        bestSeason: "Growing Season",
        specifications: {
          Nutrients: "Zinc, Boron, Manganese, Iron",
          "Application Rate": "5-10 kg/ha",
          "Suitable Crops": "All crops",
          Benefits: "Improved yield, quality, stress tolerance",
        },
      },
    ],
    redirectUrl: "https://agrigrow-experts.com",
  },
]

const productTypes = ["Machinery", "Seedlings", "Consultancy", "Pesticides", "Fertilizers"]

// Seasonal farming tips
const farmingTips = [
  {
    season: "Rainy Season",
    tips: [
      "Prepare drainage systems to prevent waterlogging",
      "Consider raised beds for better drainage",
      "Apply fungicides preventatively to combat increased disease pressure",
      "Plant cover crops to prevent soil erosion",
    ],
    icon: <CloudRain className="h-6 w-6 text-blue-500" />,
  },
  {
    season: "Dry Season",
    tips: [
      "Implement water conservation techniques",
      "Use mulch to retain soil moisture",
      "Consider drought-resistant crop varieties",
      "Install or maintain irrigation systems",
    ],
    icon: <Sun className="h-6 w-6 text-yellow-500" />,
  },
  {
    season: "Planting Season",
    tips: [
      "Test soil before planting to determine nutrient needs",
      "Prepare seedbeds thoroughly for good germination",
      "Follow recommended spacing for optimal yields",
      "Consider companion planting to reduce pest pressure",
    ],
    icon: <Leaf className="h-6 w-6 text-green-500" />,
  },
  {
    season: "Harvest Season",
    tips: [
      "Harvest at optimal maturity for best quality",
      "Ensure proper post-harvest handling to reduce losses",
      "Clean and maintain storage facilities",
      "Plan for crop rotation in the next season",
    ],
    icon: <Wheat className="h-6 w-6 text-amber-500" />,
  },
]

// Crop calendar data
const cropCalendar = [
  { crop: "Maize", plantingMonths: [3, 4, 9, 10], harvestMonths: [7, 8, 1, 2] },
  { crop: "Beans", plantingMonths: [3, 4, 9, 10], harvestMonths: [6, 7, 12, 1] },
  { crop: "Tomatoes", plantingMonths: [2, 3, 8, 9], harvestMonths: [5, 6, 11, 12] },
  { crop: "Potatoes", plantingMonths: [3, 4, 9, 10], harvestMonths: [6, 7, 12, 1] },
  {
    crop: "Kale",
    plantingMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
]

// Current weather data (would be fetched from API in production)
const currentWeather = {
  condition: "Partly Cloudy",
  temperature: 24,
  humidity: 65,
  rainfall: 0,
  windSpeed: 12,
  icon: <Cloud className="h-8 w-8 text-gray-500" />,
}

const formatPrice = (price: Price): string => {
  // For KSH currency with large amounts, use a more compact format
  if (price.currency === "KSH" && price.amount >= 100000) {
    // Format as "KSH X,XXX,XXX" instead of using the default currency formatter
    return `${price.currency} ${price.amount.toLocaleString()}`
  }

  // Use default formatter for other currencies or smaller amounts
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    // Add maximumFractionDigits to prevent long decimal places
    maximumFractionDigits: 0,
  }).format(price.amount)
}

// Function to get product type icon
const getProductTypeIcon = (type: string) => {
  switch (type) {
    case "Machinery":
      return <Tractor className="mr-2 text-green-600" size={20} />
    case "Seedlings":
      return <Leaf className="mr-2 text-green-600" size={20} />
    case "Consultancy":
      return <Wheat className="mr-2 text-green-600" size={20} />
    case "Pesticides":
      return <Flask className="mr-2 text-green-600" size={20} />
    case "Fertilizers":
      return <Droplets className="mr-2 text-green-600" size={20} />
    default:
      return <Leaf className="mr-2 text-green-600" size={20} />
  }
}

// Function to get month name
const getMonthName = (monthIndex: number) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months[monthIndex - 1]
}

// ROI Calculator function
const calculateROI = (investment: number, expectedYield: number, marketPrice: number) => {
  const revenue = expectedYield * marketPrice
  const profit = revenue - investment
  const roi = (profit / investment) * 100
  return {
    revenue: revenue,
    profit: profit,
    roi: roi,
  }
}

export default function AgricultureDeals() {
  useCookieTracking("agriculture-deals")
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors)
  const [newProductAlert, setNewProductAlert] = useState<Product | null>(null)
  const agricultureProducts = transformAgricultureToProducts(vendors)

  //adding hotdeal stuff
  const hotAgricultureDeals = agricultureProducts.filter(product => 
    product.isHotDeal || 
    (product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount > 0.2 // 20% discount
  )
  .map(product => ({
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl,
    currentPrice: product.currentPrice,
    originalPrice: product.originalPrice,
    category: product.category,
    expiresAt: product.hotDealEnds || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: product.description,
    discount: Math.round(((product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount) * 100)
  }))
  .slice(0, 4) // Limit to 4 hot deals

 // Custom color scheme for agriculture
 const agricultureColorScheme = {
  primary: "from-emerald-500 to-green-700",
  secondary: "bg-emerald-100",
  accent: "bg-green-600",
  text: "text-emerald-900",
  background: "bg-emerald-50",
}

  // Simple search states
  const [selectedProductType, setSelectedProductType] = useState("")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 })
  const [sortOrder, setSortOrder] = useState("default")
  const searchInputRef = useRef<HTMLDivElement>(null)

  // State for product types with swapping functionality
  const [displayProductTypes, setDisplayProductTypes] = useState<string[]>(productTypes)
  const [swapTrigger, setSwapTrigger] = useState(0)

  // Infinite scroll states
  const [visibleProductTypes, setVisibleProductTypes] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const typesPerPage = 2 // Show 2 product types at a time

  // ROI Calculator states
  const [investment, setInvestment] = useState(50000)
  const [expectedYield, setExpectedYield] = useState(2000)
  const [marketPrice, setMarketPrice] = useState(50)
  const [calculatedROI, setCalculatedROI] = useState(calculateROI(investment, expectedYield, marketPrice))

  // Current season state (would be determined by date/location in production)
  const [currentSeason, setCurrentSeason] = useState("Rainy Season")
  const [showSeasonalTips, setShowSeasonalTips] = useState(false)

  // Load more product types when user scrolls to bottom
  useEffect(() => {
    const endIndex = page * typesPerPage
    setVisibleProductTypes(displayProductTypes.slice(0, endIndex))
  }, [page, displayProductTypes])

  // Add intersection observer to detect when user reaches bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleProductTypes.length < displayProductTypes.length) {
          setPage((prev) => prev + 1)
        }
      },
      { threshold: 0.1 },
    )

    const loadMoreTrigger = document.getElementById("load-more-trigger")
    if (loadMoreTrigger) {
      observer.observe(loadMoreTrigger)
    }

    return () => observer.disconnect()
  }, [visibleProductTypes.length, displayProductTypes.length])

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#16a34a", "#65a30d", "#84cc16"], // Green colors for agriculture theme
    })

    // Find a new product to show in the alert
    const newProduct = vendors.flatMap((v) => v.products).find((p) => p.isNew)
    if (newProduct) {
      setNewProductAlert(newProduct)
    }
  }, [vendors])

  // Simple search filtering
  useEffect(() => {
    let results = vendors

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      results = results.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          vendor.location.toLowerCase().includes(lowerCaseSearchTerm) ||
          vendor.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          vendor.products.some((product) => {
            const currentPriceStr = product.currentPrice.amount.toString()
            const originalPriceStr = product.originalPrice.amount.toString()
            const currencyMatch = product.currentPrice.currency.toLowerCase().includes(lowerCaseSearchTerm)

            return (
              product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
              product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
              product.type.toLowerCase().includes(lowerCaseSearchTerm) ||
              currentPriceStr.includes(searchTerm) ||
              originalPriceStr.includes(searchTerm) ||
              currencyMatch
            )
          }),
      )
    }

    // Filter by selected product type
    if (selectedProductType) {
      results = results.filter((vendor) => vendor.products.some((product) => product.type === selectedProductType))
    }

    // Filter by price range
    results = results.filter((vendor) =>
      vendor.products.some(
        (product) => product.currentPrice.amount >= priceRange.min && product.currentPrice.amount <= priceRange.max,
      ),
    )

    // Sort results
    if (sortOrder === "price-asc") {
      results.sort((a, b) => {
        const aMinPrice = Math.min(...a.products.map((p) => p.currentPrice.amount))
        const bMinPrice = Math.min(...b.products.map((p) => p.currentPrice.amount))
        return aMinPrice - bMinPrice
      })
    } else if (sortOrder === "price-desc") {
      results.sort((a, b) => {
        const aMinPrice = Math.min(...a.products.map((p) => p.currentPrice.amount))
        const bMinPrice = Math.min(...b.products.map((p) => p.currentPrice.amount))
        return bMinPrice - aMinPrice
      })
    } else if (sortOrder === "discount") {
      results.sort((a, b) => {
        const aMaxDiscount = Math.max(...a.products.map((p) => p.originalPrice.amount - p.currentPrice.amount))
        const bMaxDiscount = Math.max(...b.products.map((p) => p.originalPrice.amount - p.currentPrice.amount))
        return bMaxDiscount - aMaxDiscount
      })
    } else if (sortOrder === "rating") {
      results.sort((a, b) => {
        const aMaxRating = Math.max(...a.products.map((p) => p.rating || 0))
        const bMaxRating = Math.max(...b.products.map((p) => p.rating || 0))
        return bMaxRating - aMaxRating
      })
    }

    setFilteredVendors(results)
  }, [searchTerm, vendors, selectedProductType, priceRange, sortOrder])

  // Handle simple search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
  }

  // Handle product type selection
  const handleProductTypeSelect = (type: string) => {
    setSelectedProductType(type === selectedProductType ? "" : type)
  }

  // Handle price range change
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange({ min: value[0], max: value[1] })
  }

  // Handle ROI calculator input changes
  const handleROICalculation = () => {
    setCalculatedROI(calculateROI(investment, expectedYield, marketPrice))
  }

  // Add swapping effect every 10 minutes
  useEffect(() => {
    // Set up interval for swapping categories
    const swapInterval = setInterval(
      () => {
        // Swap product types
        setDisplayProductTypes((prevTypes) => swapArrayElementsRandomly(prevTypes))

        // Swap vendors within each category
        setVendors((prevVendors) => {
          const newVendors = prevVendors.map((vendor) => ({
            ...vendor,
            products: [...vendor.products], // Create a new array of products
          }))
          return swapVendorsWithinCategory(newVendors)
        })

        // Increment swap trigger to force re-render
        setSwapTrigger((prev) => prev + 1)
      },
      10 * 60 * 1000,
    ) // 10 minutes in milliseconds

    return () => clearInterval(swapInterval)
  }, [])

  // Get current season tips
  const currentSeasonTips = farmingTips.find((tip) => tip.season === currentSeason)

  return (
    <div className="bg-gradient-to-br from-green-500 to-lime-600 min-h-screen">
      {/* Decorative agriculture-themed elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-green-800 to-lime-800 opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-lime-800 to-green-800 opacity-20"></div>

      {/* Animated farm elements */}
      <div className="absolute top-20 left-10 animate-bounce opacity-20">
        <Tractor className="h-16 w-16 text-green-800" />
      </div>
      <div className="absolute top-40 right-10 animate-pulse opacity-20">
        <Wheat className="h-16 w-16 text-yellow-800" />
      </div>
      <div className="absolute bottom-20 left-20 animate-pulse opacity-20">
        <Leaf className="h-16 w-16 text-green-800" />
      </div>

      {/* Main content container */}
      <div className="container mx-auto px-4 py-8 max-w-[1920px] relative z-10">
        {/* Hero section with enhanced styling */}
        <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-r from-green-800 to-lime-800 shadow-2xl">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10 p-8 md:p-12">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-center mb-4 text-white drop-shadow-lg">
              Agriculture Sector Deals
            </h1>
            <p className="text-xl md:text-2xl text-center text-white/90 mb-6 max-w-3xl mx-auto">
              Grow More, Spend Less with Exclusive Farming Deals & Expert Resources
            </p>
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl mb-4 shadow-lg border border-green-200 max-w-2xl mx-auto">
              <CountdownTimer targetDate="2025-05-25T23:59:59" startDate="2025-02-13T00:00:00" />
              <NewProductsForYou 
  allProducts={agricultureProducts}
  colorScheme="green"
  maxProducts={4}
/>

 {/* Trending and Popular Section */}
 <TrendingPopularSection
        trendingProducts={trendingProducts}
        popularProducts={popularProducts}
        colorScheme={agricultureColorScheme}
        title="Best Agriculture Products"
        subtitle="See what's most popular in Agriculture"
      />
      </div>

            {/* Weather widget */}
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-green-200 max-w-md mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {currentWeather.icon}
                  <div className="ml-2">
                    <p className="text-white font-medium">{currentWeather.condition}</p>
                    <p className="text-white/80 text-sm">Ideal for: Field preparation</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-xl">{currentWeather.temperature}°C</p>
                  <p className="text-white/80 text-sm">Humidity: {currentWeather.humidity}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
<HotTimeDeals 
  deals={hotAgricultureDeals}
  colorScheme="green"
  title="Agriculture Special Offers"
  subtitle="Limited-time deals on agricultural products and equipment!"
/>

{/* Add the recommendations component */}
<AgricultureRecommendations allProducts={agricultureProducts} />


        {/* Seasonal farming tips section */}
        <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-green-200 shadow-lg">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowSeasonalTips(!showSeasonalTips)}
          >
            <div className="flex items-center">
              {currentSeasonTips?.icon}
              <h2 className="text-xl font-bold text-white ml-2">Current Season: {currentSeason}</h2>
            </div>
            <Button variant="ghost" className="text-white hover:bg-white/20">
              {showSeasonalTips ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </div>

          {showSeasonalTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <h3 className="text-white font-semibold mb-2">Seasonal Farming Tips:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentSeasonTips?.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-green-600 rounded-full p-1 mr-2 mt-1">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-white/90">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
{/*Agriculture Deals shop*/}
<div className="flex flex-wrap gap-4 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
              <Link href="/agriculture-deals/shop">
                <Button
                  size="lg"
                  className="bg-green text-white-600 hover:bg-gray-100 transition-transform hover:scale-105"
                >
                  Check out more  Agriculture Products from Our shops!
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              </div>
         {/*Agriculture Deals shop Media*/}
    <div className="flex flex-wrap gap-4 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
              <Link href="/agriculture-deals/media">
                <Button
                  size="lg"
                  className="bg-green text-white-600 hover:bg-gray-100 transition-transform hover:scale-105"
                >
                  Check out more  Agriculture Products from Our Media!
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              </div>
        {/* Simple search section */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="relative" ref={searchInputRef}>
            <div className="flex">
              <Input
                type="text"
                placeholder="Search agricultural products, machinery, seedlings..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-4 pr-12 rounded-l-full border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white bg-opacity-90 text-green-800 placeholder-green-400"
              />
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-r-full px-6">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Filter options */}
          <div className="mt-4 bg-white/20 backdrop-blur-sm p-4 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold mb-2 text-white">Product Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {displayProductTypes.map((type) => (
                    <Badge
                      key={type}
                      variant={selectedProductType === type ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedProductType === type ? "bg-green-600" : "hover:bg-green-100 text-white border-green-300"
                      }`}
                      onClick={() => handleProductTypeSelect(type)}
                    >
                      {getProductTypeIcon(type)}
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-white">Price Range (KSH)</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[priceRange.min, priceRange.max]}
                    max={500000}
                    step={1000}
                    onValueChange={handlePriceRangeChange}
                    className="my-4"
                  />
                  <div className="flex justify-between text-white">
                    <span>{priceRange.min.toLocaleString()}</span>
                    <span>{priceRange.max.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-white">Sort By</h3>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full p-2 rounded-md bg-white/80 border border-green-300"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="discount">Biggest Discount</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-white" />
                <span className="text-sm text-white">
                  {filteredVendors.length} vendors found with matching products
                </span>
              </div>

              {(searchTerm || selectedProductType || priceRange.min > 0 || priceRange.max < 500000) && (
                <Button
                  variant="outline"
                  className="bg-red-600/80 text-white border-green-300 hover:bg-red-700"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedProductType("")
                    setPriceRange({ min: 0, max: 500000 })
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs for additional features */}
        <div className="mb-8">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="w-full bg-white/20 backdrop-blur-sm rounded-xl p-1 border border-green-200">
              <TabsTrigger
                value="products"
                className="text-white data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Products
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="text-white data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Crop Calendar
              </TabsTrigger>
              <TabsTrigger
                value="calculator"
                className="text-white data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                ROI Calculator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              {/* Product listings - this is the main content that was already there */}
              <AnimatePresence mode="popLayout">
                {visibleProductTypes.map((type) => (
                  <motion.div
                    key={type}
                    className="mb-12"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center mb-6 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                      {getProductTypeIcon(type)}
                      <h2 className="text-2xl font-bold text-white">{type}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                      <AnimatePresence mode="popLayout">
                        {filteredVendors
                          .filter((vendor) => vendor.products.some((product) => product.type === type))
                          .map((vendor) => (
                            <motion.div
                              key={`${vendor.id}-${type}-${swapTrigger}`}
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.3 }}
                              className="h-full"
                            >
                              <VendorCard vendor={vendor} productType={type} />
                            </motion.div>
                          ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add this at the bottom to trigger loading more content */}
              {visibleProductTypes.length < displayProductTypes.length && (
                <div id="load-more-trigger" className="h-20 flex items-center justify-center">
                  <div className="animate-pulse text-white opacity-80 font-semibold">
                    Scroll for more agricultural products...
                  </div>
                </div>
              )}

              {/* No results message */}
              {filteredVendors.length === 0 && (
                <div className="text-center py-12 bg-white/20 rounded-xl backdrop-blur-sm max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-white mb-2">No agricultural products found</h3>
                  <p className="text-white/80">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="calendar">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-green-200">
                <h2 className="text-2xl font-bold text-white mb-4">Crop Calendar</h2>
                <p className="text-white/90 mb-4">Plan your farming activities with our seasonal crop calendar</p>

                <div className="overflow-x-auto">
                  <table className="w-full bg-white/20 rounded-lg">
                    <thead>
                      <tr className="border-b border-green-200">
                        <th className="p-3 text-left text-white">Crop</th>
                        {Array.from({ length: 12 }, (_, i) => (
                          <th key={i} className="p-3 text-center text-white">
                            {getMonthName(i + 1)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {cropCalendar.map((crop, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white/5" : ""}>
                          <td className="p-3 text-white font-medium">{crop.crop}</td>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = i + 1
                            const isPlanting = crop.plantingMonths.includes(month)
                            const isHarvest = crop.harvestMonths.includes(month)

                            return (
                              <td key={i} className="p-3 text-center">
                                {isPlanting && (
                                  <div
                                    className="w-4 h-4 bg-green-500 rounded-full mx-auto"
                                    title="Planting Season"
                                  ></div>
                                )}
                                {isHarvest && (
                                  <div
                                    className="w-4 h-4 bg-yellow-500 rounded-full mx-auto"
                                    title="Harvest Season"
                                  ></div>
                                )}
                                {!isPlanting && !isHarvest && (
                                  <div className="w-4 h-4 bg-transparent rounded-full mx-auto"></div>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-white">Planting Season</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-white">Harvest Season</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calculator">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-green-200">
                <h2 className="text-2xl font-bold text-white mb-4">Farm Investment ROI Calculator</h2>
                <p className="text-white/90 mb-4">Estimate the return on investment for your farming activities</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="mb-4">
                      <label className="block text-white mb-2">Total Investment (KSH)</label>
                      <Input
                        type="number"
                        value={investment}
                        onChange={(e) => setInvestment(Number(e.target.value))}
                        className="bg-white/80"
                      />
                      <p className="text-white/70 text-sm mt-1">Include seeds, fertilizer, labor, etc.</p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-white mb-2">Expected Yield (kg)</label>
                      <Input
                        type="number"
                        value={expectedYield}
                        onChange={(e) => setExpectedYield(Number(e.target.value))}
                        className="bg-white/80"
                      />
                      <p className="text-white/70 text-sm mt-1">Estimated harvest quantity</p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-white mb-2">Market Price (KSH/kg)</label>
                      <Input
                        type="number"
                        value={marketPrice}
                        onChange={(e) => setMarketPrice(Number(e.target.value))}
                        className="bg-white/80"
                      />
                      <p className="text-white/70 text-sm mt-1">Current or expected selling price</p>
                    </div>

                    <Button className="w-full bg-green-600 hover:bg-green-700 mt-2" onClick={handleROICalculation}>
                      Calculate ROI
                    </Button>
                  </div>

                  <div className="bg-white/20 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Results</h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-white/80">Total Revenue:</p>
                        <p className="text-2xl font-bold text-white">KSH {calculatedROI.revenue.toLocaleString()}</p>
                      </div>

                      <div>
                        <p className="text-white/80">Net Profit:</p>
                        <p className="text-2xl font-bold text-white">KSH {calculatedROI.profit.toLocaleString()}</p>
                      </div>

                      <div>
                        <p className="text-white/80">Return on Investment:</p>
                        <p className="text-2xl font-bold text-white flex items-center">
                          {calculatedROI.roi.toFixed(2)}%
                          <Percent className="ml-1 h-5 w-5" />
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/20">
                        <p className="text-white font-medium">
                          {calculatedROI.roi > 50
                            ? "Excellent investment opportunity!"
                            : calculatedROI.roi > 20
                              ? "Good investment opportunity."
                              : calculatedROI.roi > 0
                                ? "Positive but modest returns."
                                : "Consider revising your plan or inputs."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* New product alert */}
      <AnimatePresence>
        {newProductAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-white bg-opacity-90 rounded-lg shadow-lg p-4 max-w-sm border-2 border-green-500"
          >
            <button
              onClick={() => setNewProductAlert(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-2 text-green-600">New Agricultural Product Alert!</h3>
            <p className="text-gray-600 mb-2">{newProductAlert.name} is now available!</p>
            <p className="text-green-600 font-bold">Only {formatPrice(newProductAlert.currentPrice)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function VendorCard({ vendor, productType }: { vendor: Vendor; productType: string }) {
  const [imageError, setImageError] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white/80 rounded-lg shadow-md overflow-hidden backdrop-filter backdrop-blur-lg flex flex-col h-full border border-green-200 hover:shadow-xl transition-all duration-300">
      <div className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-lime-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <Image
                src={imageError ? "/images/vendor-placeholder.png" : vendor.logo}
                alt={vendor.name}
                width={60}
                height={60}
                className="rounded-full border-2 border-green-300"
                onError={() => setImageError(true)}
              />
          {vendor.verified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <h3 className="text-xl font-semibold text-green-800">{vendor.name}</h3>
                {vendor.established && (
                  <Badge variant="outline" className="ml-2 text-xs bg-green-100 text-green-800 border-green-300">
                    Est. {vendor.established}
                  </Badge>
                )}
              </div>
              <p className="text-green-600 flex items-center">
                <MapPin size={14} className="mr-1" />
                {vendor.location}
              </p>
            </div>
          </div>
          <a
            href={vendor.redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-green-500 to-lime-500 text-white px-4 py-2 rounded-full hover:from-green-600 hover:to-lime-600 transition duration-300 transform hover:scale-105 whitespace-nowrap shadow-md"
          >
            Visit Website
          </a>
        </div>

        {/* Vendor details section */}
        <div className="mb-4">
          <p className="text-gray-700 line-clamp-2 md:line-clamp-none">{vendor.description}</p>

          <Button
            variant="ghost"
            size="sm"
            className="text-green-700 p-0 mt-1 hover:bg-transparent hover:text-green-800"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show less" : "Show more"}
            {isExpanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
          </Button>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2"
            >
              {vendor.specialties && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-green-800">Specialties:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {vendor.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center mt-2">
                <a
                  href={vendor.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300 mr-4"
                >
                  <MapPin size={16} className="mr-1" />
                  View on Map
                </a>

                <button className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors duration-300">
                  <Share2 size={16} className="mr-1" />
                  Share
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-100 to-lime-100 p-4 sm:p-6 flex-grow">
        <h4 className="text-lg font-semibold mb-4 text-green-800 flex items-center">
          <Award className="mr-2 h-5 w-5 text-green-600" />
          Featured Agricultural Products
        </h4>
        <div className="grid grid-cols-1 gap-4 h-full">
          {vendor.products
            .filter((product) => product.type === productType)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
    </div>
  )
}
function MostPreferredBadge() {
  return (
    <motion.div
      className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center"
      animate={{ 
        scale: [1, 1.1, 1],
        boxShadow: [
          "0 4px 6px rgba(0, 0, 0, 0.1)",
          "0 10px 15px rgba(0, 0, 0, 0.2)",
          "0 4px 6px rgba(0, 0, 0, 0.1)"
        ]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      <TrendingUp className="h-3 w-3 mr-1" />
      <span>most Preffered</span>
    </motion.div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const savings: Price = {
    amount: product.originalPrice.amount - product.currentPrice.amount,
    currency: product.currentPrice.currency,
  }

  const discountPercentage = Math.round((savings.amount / product.originalPrice.amount) * 100)
  const isHighDiscount = discountPercentage >= 20

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-green-100 hover:shadow-xl transition-all duration-300">
      <div className="relative w-full pt-[60%] overflow-hidden group">
        <Image
          src={imageError ? "/images/product-placeholder.png" : product.imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={80}
          onError={() => setImageError(true)}
          className="group-hover:scale-110 transition-transform duration-500"
        />
        {product.isNew && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse shadow-md">
            NEW
          </div>
        )}

        {product.isMostPreferred && <MostPreferredBadge />}


        {isHighDiscount && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md flex items-center">
            <Percent className="h-3 w-3 mr-1" />
            {discountPercentage}% OFF
          </div>
        )}

        {product.isLimitedStock && (
          <div className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
            LIMITED STOCK
          </div>
        )}

        {product.dateAdded && isNewThisWeek(product.dateAdded) && (
          <div className="absolute bottom-2 left-2">
            <NewThisWeekBadge />
          </div>
        )}

        {/* Rating badge */}
        {product.rating && (
          <div className="absolute top-2 right-2 bg-white/90 text-yellow-500 px-2 py-1 rounded-full text-xs font-bold shadow-md flex items-center">
            <Star className="h-3 w-3 mr-1 fill-yellow-500" />
            {product.rating}
          </div>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h5 className="font-semibold mb-2 text-green-800 truncate">{product.name}</h5>
        <p className="text-sm text-gray-600 mb-2 line-clamp-3 md:line-clamp-2 xl:line-clamp-none flex-grow">
          {product.description}
        </p>

        {/* Product details section */}
        {(product.specifications || product.bestSeason || product.farmSize) && (
          <div className="mb-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-green-700 p-0 hover:bg-transparent hover:text-green-800 flex items-center"
              onClick={() => setShowDetails(!showDetails)}
            >
              <Info className="mr-1 h-4 w-4" />
              {showDetails ? "Hide Details" : "View Details"}
            </Button>

            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 bg-green-50 p-3 rounded-md text-sm"
              >
                {product.bestSeason && (
                  <div className="flex items-start mb-1">
                    <Calendar className="h-4 w-4 text-green-600 mr-1 mt-0.5" />
                    <div>
                      <span className="font-medium text-green-800">Best Season:</span> {product.bestSeason}
                    </div>
                  </div>
                )}

                {product.farmSize && (
                  <div className="flex items-start mb-1">
                    <MapPin className="h-4 w-4 text-green-600 mr-1 mt-0.5" />
                    <div>
                      <span className="font-medium text-green-800">Farm Size:</span> {product.farmSize}
                    </div>
                  </div>
                )}

                {product.specifications && (
                  <div className="mt-2">
                    <p className="font-medium text-green-800 mb-1">Specifications:</p>
                    <ul className="space-y-1">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <li key={key} className="flex">
                          <span className="font-medium mr-1">{key}:</span> {value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}

        <div className="flex flex-col mb-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-600 break-words">{formatPrice(product.currentPrice)}</span>
            <span className="text-sm text-gray-500 line-through break-words">{formatPrice(product.originalPrice)}</span>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-2">
          <div className="flex items-center">
            <Clock size={16} className="mr-1 text-green-500 flex-shrink-0" />
            <span className="truncate">Limited Time Offer</span>
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <motion.button
            className="w-full bg-gradient-to-r from-green-400 to-lime-500 text-white px-4 py-2 rounded-full min-w-0 text-sm sm:text-base shadow-md"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Save {formatPrice(savings)} ({discountPercentage}% Off)
          </motion.button>
          <motion.button
            className="w-full bg-gradient-to-r from-lime-500 to-green-600 text-white px-4 py-2 rounded-full min-w-0 text-sm sm:text-base shadow-md"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Order Now
          </motion.button>
          <motion.button
            className="w-full bg-gradient-to-r from-amber-400 to-green-500 text-white px-4 py-2 rounded-full min-w-0 font-medium text-sm sm:text-base shadow-md"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Let's Go Farming
          </motion.button>
        </div>
      </div>
    </div>
  )
}

function Check({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  )
}

