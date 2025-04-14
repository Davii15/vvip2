"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Search,
  X,
  MapPin,
  Calendar,
  Users,
  Loader2,
  ChevronRight,
  Compass,
  Mountain,
  Camera,
  TelescopeIcon as Binoculars,
  Heart,
  Globe,
  Check,
  TrendingUp,
  CameraOffIcon,
} from "lucide-react"
import Image from "next/image"
import CountdownTimer from "@/components/CountdownTimer"
import HotTimeDeals from "@/components/HotTimeDeals"
import { useCookieTracking } from "@/hooks/useCookieTracking"
import { swapArrayElementsRandomly, swapVendorsWithinCategory } from "@/utils/swap-utils"
import { isNewThisWeek } from "@/utils/date-utils"
import NewThisWeekBadge from "@/components/NewThisWeekBadge"
import NewProductsForYou from "@/components/NewProductsForYou"
import { transformTourismToProducts } from "@/utils/product-transformers"
import TrendingPopularSection from "@/components/TrendingPopularSection"
import { trendingProducts, popularProducts } from "./trending-data"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import TourismRecommendations from "@/components/recommendations/tourism-recommendations"

interface Price {
  amount: number
  currency: string
}

interface Adventure {
  id: number
  name: string
  imageUrl: string
  currentPrice: Price
  originalPrice: Price
  isNew?: boolean
  type: "Game Park" | "Orphanage" | "Game Reserve" | "Sanctuary" | "Hiking" | "Other"
  duration: string
  groupSize: string
  location: string
  dateAdded: string
  isTrending?: boolean
  isMostPreferred?:boolean
  isHotDeal?: boolean // Add this field
  hotDealEnds?: string // Add this field - ISO date string

}

interface Vendor {
  id: number
  name: string
  location: string
  logo: string
  description: string
  adventures: Adventure[]
  redirectUrl: string
  mapLink: string
  defaultCurrency: string
  isMostPreferred?:boolean
  verified?:boolean
}

// Mock data for vendors
const mockVendors: Vendor[] = [
  {
    id: 1,
    name: "Safari Explorers",
    location: "Nairobi, Kenya",
    logo: "https://your-supabase-project.supabase.co/storage/v1/object/public/vendor-logos/safari-explorers-logo.png",
    description: "Embark on unforgettable wildlife adventures across East Africa's most stunning national parks!",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Safari+Explorers+Nairobi+Kenya",
    defaultCurrency: "KSH,TZSH, UGSH",
    isMostPreferred:true,
    verified:true,
    adventures: [
      {
        id: 1,
        name: "Masai Mara Wildlife Safari",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/adventure-images/masai-mara-safari.jpg",
        currentPrice: { amount: 14990, currency: "KSH" },
        originalPrice: { amount: 17990, currency: "KSH" },
        type: "Game Reserve",
        duration: "5 days",
        groupSize: "6-12 people",
        location: "Masai Mara, Kenya",
        dateAdded: "2025-03-15T10:30:00Z",
        
      },
      {
        id: 2,
        name: "Serengeti Migration Tour",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/adventure-images/serengeti-migration.jpg",
        currentPrice: { amount: 17990.0, currency: "USD" },
        originalPrice: { amount: 24990.0, currency: "USD" },
        type: "Game Park",
        duration: "7 days",
        groupSize: "8-15 people",
        location: "Serengeti, Tanzania",
        dateAdded: "2025-03-15T10:30:00Z",
        isTrending: true,
      },
      {
        id: 3,
        name: "Gorilla Trekking Experience",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/adventure-images/gorilla-trekking.jpg",
        currentPrice: { amount: 30000.0, currency: "USD" },
        originalPrice: { amount: 40000.0, currency: "USD" },
        type: "Sanctuary",
        duration: "4 days",
        groupSize: "4-8 people",
        location: "Bwindi Impenetrable Forest, Uganda",
        dateAdded: "2025-03-15T10:30:00Z",
        isHotDeal: true, // Mark this as a hot deal
       hotDealEnds: "2025-04-15T23:59:59Z",
      },
    ],
    redirectUrl: "https://safariexplorers.com",
  },
  {
    id: 2,
    name: "EcoAdventures",
    location: "Cape Town, South Africa",
    logo: "https://your-supabase-project.supabase.co/storage/v1/object/public/vendor-logos/ecoadventures-logo.png",
    description: "Discover the beauty of nature while supporting conservation efforts and local communities.",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Safari+Explorers+Nairobi+Kenya",
    defaultCurrency: "USD",
    isMostPreferred:true,
    verified:true,
    adventures: [
      {
        id: 4,
        name: "Table Mountain Hiking Tour",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/adventure-images/table-mountain-hiking.jpg",
        currentPrice: { amount: 1500.0, currency: "USD" },
        originalPrice: { amount: 2000.0, currency: "USD" },
        type: "Hiking",
        duration: "1 day",
        groupSize: "5-10 people",
        location: "Cape Town, South Africa",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
      },
      {
        id: 5,
        name: "Elephant Sanctuary Volunteer Program",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/adventure-images/elephant-sanctuary.jpg",
        currentPrice: { amount: 15000.0, currency: "USD" },
        originalPrice: { amount: 30000.0, currency: "USD" },
        type: "Sanctuary",
        duration: "7 days",
        groupSize: "4-8 people",
        location: "Plettenberg Bay, South Africa",
        dateAdded: "2025-03-15T10:30:00Z",
        isHotDeal: true, // Mark this as a hot deal
        hotDealEnds: "2025-04-15T23:59:59Z",
      },
    ],
    redirectUrl: "https://ecoadventures.com",
  },
  {
    id: 3,
    name: "Cultural Odyssey",
    location: "Arusha, Tanzania",
    logo: "https://your-supabase-project.supabase.co/storage/v1/object/public/vendor-logos/cultural-odyssey-logo.png",
    description: "Immerse yourself in the rich cultures and traditions of East Africa's diverse communities.",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Safari+Explorers+Nairobi+Kenya",
    defaultCurrency: "USD",
    verified:true,
    adventures: [
      {
        id: 6,
        name: "Maasai Village Experience",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/adventure-images/maasai-village.jpg",
        currentPrice: { amount: 20000.0, currency: "USD" },
        originalPrice: { amount: 40000.0, currency: "USD" },
        type: "Sanctuary",
        duration: "2 days",
        groupSize: "4-10 people",
        location: "Ngorongoro Conservation Area, Tanzania",
        dateAdded: "2025-03-15T10:30:00Z",
        isTrending: true,
        isHotDeal: true, // Mark this as a hot deal
        hotDealEnds: "2025-04-15T23:59:59Z",
      },
      {
        id: 7,
        name: "Orphanage Support & Cultural Exchange",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/adventure-images/orphanage-support.jpg",
        currentPrice: { amount: 8000.0, currency: "USD" },
        originalPrice: { amount: 10000.0, currency: "USD" },
        type: "Orphanage",
        duration: "5 days",
        groupSize: "6-12 people",
        location: "Arusha, Tanzania",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        isHotDeal: true, // Mark this as a hot deal
        hotDealEnds: "2025-04-15T23:59:59Z",
      },
    ],
    redirectUrl: "https://culturalodyssey.com",
  },
]

const formatPrice = (price: Price): string => {
  // IMPROVEMENT: Format price to prevent overflow on large screens
  return `${price.currency} ${price.amount.toLocaleString()}`
}

// Function to get adventure type icon
const getAdventureTypeIcon = (type: string) => {
  switch (type) {
    case "Game Park":
      return <Binoculars className="mr-2 text-amber-600" size={24} />
    case "Game Reserve":
      return <Globe className="mr-2 text-green-600" size={24} />
    case "Sanctuary":
      return <Heart className="mr-2 text-red-600" size={24} />
    case "Hiking":
      return <Mountain className="mr-2 text-blue-600" size={24} />
    case "Orphanage":
      return <Heart className="mr-2 text-pink-600" size={24} />
    default:
      return <Compass className="mr-2 text-purple-600" size={24} />
  }
}

export default function TourismAndAdventures() {
  useCookieTracking("tourism-and-adventures")
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors)
  const [newAdventureAlert, setNewAdventureAlert] = useState<Adventure | null>(null)
  const tourismProducts = transformTourismToProducts(mockVendors)
  // For swapping element
  const [adventureTypes, setAdventureTypes] = useState<string[]>([
    "Game Park",
    "Orphanage",
    "Game Reserve",
    "Sanctuary",
    "Hiking",
    "Other",
  ])
  const [swapTrigger, setSwapTrigger] = useState(0)
  const [isHovered, setIsHovered] = useState(false)



//adding the hot deals logic
const hotTourismDeals = tourismProducts.filter(product => 
  product.isHotDeal || 
  (product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount > 0.25 // 25% discount
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
.slice(0, 4)

  // Infinite scroll states
  const [visibleAdventureTypes, setVisibleAdventureTypes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)
  const ITEMS_PER_PAGE = 2

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#047857", "#ca8a04", "#b91c1c"], // Green, amber, and red for safari theme
    })

    // Find a new adventure to show in the alert
    const newAdventure = vendors.flatMap((v) => v.adventures).find((a) => a.isNew)
    if (newAdventure) {
      setNewAdventureAlert(newAdventure)
    }
  }, [vendors])

 // Custom color scheme for tourism
 const tourismColorScheme = {
  primary: "from-emerald-500 to-amber-700",
  secondary: "bg-orange-100",
  accent: "bg-amber-600",
  text: "text-purple-900",
  background: "bg-orange-50",
}

  // IMPROVED SEARCH FUNCTIONALITY
  useEffect(() => {
    const filtered = vendors.filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.adventures.some((adventure) => {
          // ADDED EXPLICIT PRICE STRING CONVERSION
          const currentPriceStr = adventure.currentPrice.amount.toString()
          const originalPriceStr = adventure.originalPrice.amount.toString()
          // ADDED CURRENCY MATCHING
          const currencyMatch = adventure.currentPrice.currency.toLowerCase().includes(searchTerm.toLowerCase())

          return (
            adventure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            adventure.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            // ADDED LOCATION, DURATION, AND GROUP SIZE
            adventure.location
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            adventure.duration.toLowerCase().includes(searchTerm.toLowerCase()) ||
            adventure.groupSize.toLowerCase().includes(searchTerm.toLowerCase()) ||
            // ADDED PRICE STRING AND CURRENCY MATCHING
            currentPriceStr.includes(searchTerm) ||
            originalPriceStr.includes(searchTerm) ||
            currencyMatch
          )
        }),
    )
    setFilteredVendors(filtered)
  }, [searchTerm, vendors])

  // Adding swapping element
  useEffect(() => {
    // Set up interval for swapping categories
    const swapInterval = setInterval(
      () => {
        // Swap adventure types
        setAdventureTypes((prevTypes) => swapArrayElementsRandomly(prevTypes))

        // Swap vendors within each category
        setVendors((prevVendors) => {
          const newVendors = prevVendors.map((vendor) => ({
            ...vendor,
            adventures: [...vendor.adventures], // Create a new array of adventures
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

  // Initialize visible adventure types
  useEffect(() => {
    setVisibleAdventureTypes(adventureTypes.slice(0, ITEMS_PER_PAGE))
  }, [adventureTypes])

  // Intersection Observer for infinite scrolling
  const loadMoreItems = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      const currentLength = visibleAdventureTypes.length
      const nextItems = adventureTypes.slice(currentLength, currentLength + ITEMS_PER_PAGE)

      if (nextItems.length > 0) {
        setVisibleAdventureTypes((prev) => [...prev, ...nextItems])
      } else {
        setHasMore(false)
      }

      setIsLoading(false)
    }, 800)
  }, [isLoading, hasMore, visibleAdventureTypes, adventureTypes])

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

  // Reset visible items and hasMore when search term changes
  useEffect(() => {
    setVisibleAdventureTypes(adventureTypes.slice(0, ITEMS_PER_PAGE))
    setHasMore(true)
  }, [searchTerm, adventureTypes])

  return (
    <div className="bg-gradient-to-br from-emerald-700 via-amber-500 to-orange-600 min-h-screen">
      {/* Safari-themed decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-[url('/images/safari-pattern.png')] opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('/images/safari-pattern.png')] opacity-10 transform rotate-180"></div>

      {/* IMPROVEMENT: Added max-width to container to prevent excessive stretching on ultra-wide screens */}
      <div className="container mx-auto px-4 py-12 max-w-[1920px] relative z-10">
        {/* Safari-themed header */}
        <div className="text-center mb-10 bg-gradient-to-r from-amber-900/80 via-emerald-800/80 to-amber-900/80 p-8 rounded-2xl shadow-2xl border border-amber-300/30 backdrop-blur-sm">
          <div className="flex justify-center items-center mb-4">
            <Camera className="text-amber-300 mr-3" size={36} />
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">
              Wild <span className="text-amber-300">Adventures</span> Await
            </h1>
          </div>
          <h2 className="text-2xl font-semibold mb-6 text-white italic">
            Explore Africa's Breathtaking Landscapes & Wildlife at Unbeatable Prices
          </h2>
          <CountdownTimer targetDate="2025-12-31T23:59:59" startDate="2025-02-13T00:00:00" />
          <NewProductsForYou 
  allProducts={tourismProducts}
  colorScheme="green"
  maxProducts={4}
/>
<HotTimeDeals 
  deals={hotTourismDeals}
  colorScheme="green"
  title="Adventure Flash Deals"
  subtitle="Limited-time offers on exciting adventures!"
/>

  {/* Add the recommendations component */}
  <TourismRecommendations
        allAdventures={tourismProducts}
        currentMonth={new Date().getMonth() + 1} // Current month (1-12)
      />

 {/* Trending and Popular Section */}
 <TrendingPopularSection
        trendingProducts={trendingProducts}
        popularProducts={popularProducts}
        colorScheme={tourismColorScheme}
        title="Safari Highlights"
        subtitle="Discover trending and most popular adventure options"
      />
        </div>

        {/* Safari-themed search bar */}
        <div className="mb-10">
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Search safaris, hiking trails, sanctuaries, or cultural experiences..."
              className="w-full p-5 pr-12 rounded-full border-2 border-amber-600 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white/90 text-gray-800 placeholder-gray-500 shadow-lg text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 text-amber-600" size={24} />
          </div>
        </div>
 {/*button for tourism and adventure shop*/}
 <div className="flex justify-center my-8">
      <Link href="/tourism-and-adventures/shop">
        <Button
          size="lg"
          className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
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
            <Binoculars className="mr-2 h-5 w-5" />
            Explore Our Tourism-and-adventure Shop
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
            <CameraOffIcon className="h-5 w-5 text-yellow-300" />
          </motion.div>
        </Button>
      </Link>
    </div>
{/*button for tourism and adventure media shop*/}
<div className="flex justify-center my-8">
      <Link href="/tourism-and-adventures/media">
        <Button
          size="lg"
          className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
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
            <Binoculars className="mr-2 h-5 w-5" />
            Explore Our Tourism-and-adventure Media
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
            <CameraOffIcon className="h-5 w-5 text-yellow-300" />
          </motion.div>
        </Button>
      </Link>
    </div>

        {/* Infinite scroll implementation with safari styling */}
        <AnimatePresence mode="popLayout">
          {visibleAdventureTypes.map((type) => (
            <motion.div
              key={type}
              className="mb-16"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-6 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                {getAdventureTypeIcon(type)}
                <h2 className="text-3xl font-bold text-white drop-shadow-md">{type} Adventures</h2>
              </div>
              {/* IMPROVEMENT: Adjusted grid to better handle large screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredVendors
                    .filter((vendor) => vendor.adventures.some((adventure) => adventure.type === type))
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
                        <VendorCard key={vendor.id} vendor={vendor} adventureType={type} />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Safari-themed loading indicator */}
        {hasMore && (
          <div ref={loaderRef} className="flex justify-center items-center py-8">
            {isLoading ? (
              <div className="flex flex-col items-center bg-white/20 p-6 rounded-full backdrop-blur-sm">
                <Loader2 className="h-10 w-10 animate-spin text-amber-300" />
                <p className="mt-2 text-white font-medium text-lg">Discovering more adventures...</p>
              </div>
            ) : (
              <div className="h-16" />
            )}
          </div>
        )}

        {/* No more items indicator with safari styling */}
        {!hasMore && visibleAdventureTypes.length > 0 && (
          <div className="text-center py-8 bg-white/10 rounded-xl backdrop-blur-sm max-w-md mx-auto">
            <p className="text-white font-medium text-lg">You've explored all our adventure categories!</p>
          </div>
        )}

        {/* Keep the original content for backward compatibility (hidden) */}
        <div className="hidden">
          {adventureTypes.map((type) => (
            <div key={type} className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">{type} Adventures</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {filteredVendors
                  .filter((vendor) => vendor.adventures.some((adventure) => adventure.type === type))
                  .map((vendor) => (
                    <VendorCard key={vendor.id} vendor={vendor} adventureType={type} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safari-themed alert */}
      <AnimatePresence>
        {newAdventureAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-amber-800 to-emerald-800 text-white rounded-lg shadow-2xl p-6 max-w-sm border border-amber-300"
          >
            <button
              onClick={() => setNewAdventureAlert(null)}
              className="absolute top-2 right-2 text-amber-300 hover:text-white"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-2 text-amber-300">New Adventure Alert!</h3>
            <p className="text-white mb-3">{newAdventureAlert.name} is now available!</p>
            <div className="flex items-center">
              <MapPin size={18} className="text-amber-300 mr-2" />
              <p className="text-amber-300 font-bold">{newAdventureAlert.location}</p>
            </div>
            <p className="text-white mt-2 font-bold">Only {formatPrice(newAdventureAlert.currentPrice)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function VendorCard({ vendor, adventureType }: { vendor: Vendor; adventureType: string }) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden flex flex-col h-full border-2 border-amber-200"
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="p-6 bg-gradient-to-r from-amber-700/10 to-emerald-700/10">
        {/* IMPROVEMENT: Made the header more responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center">
            {/* IMPROVEMENT: Added flex-shrink-0 to prevent logo from being compressed */}
            <div className="relative flex-shrink-0">
              <Image
                src={imageError ? "/images/vendor-placeholder.png" : vendor.logo}
                alt={vendor.name}
                width={70}
                height={70}
                className="rounded-full border-2 border-amber-500 p-1"
                onError={() => setImageError(true)}
              />
 {vendor.verified && (
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}

              {isHovered && (
                <motion.div
                  className="absolute -inset-1 rounded-full bg-amber-500 -z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                />
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-amber-800">{vendor.name}</h3>
              <p className="text-emerald-800 flex items-center">
                <MapPin size={14} className="mr-1 flex-shrink-0" />
                <span className="truncate">{vendor.location}</span>
              </p>
            </div>
          </div>
          <motion.a
            href={vendor.redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition duration-300 whitespace-nowrap"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Visit Website
          </motion.a>
        </div>
        <p className="text-gray-700 mb-4 italic line-clamp-2 md:line-clamp-none">{vendor.description}</p>
        <a
          href={vendor.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-emerald-700 hover:text-emerald-900 transition-colors duration-300 font-medium"
        >
          <MapPin size={16} className="mr-1" />
          View on Map
        </a>
      </div>
      <div className="bg-gradient-to-br from-amber-50 to-emerald-50 p-6 flex-grow">
        <h4 className="text-lg font-bold mb-4 text-amber-800 border-b border-amber-200 pb-2">Featured Adventures</h4>
        {/* IMPROVEMENT: Simplified grid for better responsiveness */}
        <div className="grid grid-cols-1 gap-4">
          {vendor.adventures
            .filter((adventure) => adventure.type === adventureType)
            .map((adventure) => (
              <AdventureCard key={adventure.id} adventure={adventure} />
            ))}
        </div>
      </div>
    </motion.div>
  )
}
function TrendingBadge() {
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
      <span>Trending</span>
    </motion.div>
  );
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
      <span>most preferred</span>
    </motion.div>
  );
}

function AdventureCard({ adventure }: { adventure: Adventure }) {
  const [imageError, setImageError] = useState(false)
  const savings: Price = {
    amount: adventure.originalPrice.amount - adventure.currentPrice.amount,
    currency: adventure.currentPrice.currency,
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-amber-100"
      whileHover={{ scale: 1.03 }}
    >
      <div className="relative w-full pt-[60%]">
        <Image
          src={imageError ? "/images/adventure-placeholder.png" : adventure.imageUrl}
          alt={adventure.name}
          layout="fill"
          objectFit="cover"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={80}
          className="transition-transform duration-700 hover:scale-110"
          onError={() => setImageError(true)}
        />
        {adventure.isNew && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            NEW
          </div>
        )}
    {/* Add the trending badge */}
    {adventure.isTrending && <TrendingBadge />}
{/*add the most preferred badge*/}
{adventure.isMostPreferred && <MostPreferredBadge/>}
        {/* New This Week badge - positioned differently to avoid overlap */}
        {adventure.dateAdded && isNewThisWeek(adventure.dateAdded) && (
          <div className="absolute bottom-2 left-2">
            <NewThisWeekBadge />
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col bg-gradient-to-br from-white to-amber-50">
        <h5 className="font-bold mb-2 text-amber-800 truncate">{adventure.name}</h5>
        {/* IMPROVEMENT: Better price display to prevent overflow */}
        <div className="flex flex-col mb-3">
          <div className="flex items-center">
            <span className="text-lg font-bold text-emerald-700 break-words">
              {formatPrice(adventure.currentPrice)}
            </span>
            
          </div>
          <span className="text-sm text-gray-500 line-through break-words">{formatPrice(adventure.originalPrice)}</span>
        </div>
        <div className="text-sm text-gray-600 mb-3">
          <div className="flex items-center mb-1">
            <MapPin size={16} className="mr-1 text-amber-600 flex-shrink-0" />
            <span className="text-amber-800 truncate">{adventure.location}</span>
          </div>
          <div className="flex items-center mb-1">
            <Calendar size={16} className="mr-1 text-emerald-600 flex-shrink-0" />
            <span className="text-emerald-800 truncate">{adventure.duration}</span>
          </div>
          <div className="flex items-center">
            <Users size={16} className="mr-1 text-amber-600 flex-shrink-0" />
            <span className="text-amber-800 truncate">{adventure.groupSize}</span>
          </div>
        </div>
        {/* IMPROVEMENT: Added min-width-0 to buttons to prevent overflow */}
        <div className="mt-auto space-y-2">
          <motion.button
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-full shadow-md min-w-0"
            whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            Save {formatPrice(savings)}
          </motion.button>
          <motion.button
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 rounded-full shadow-md min-w-0"
            whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            Book Now
          </motion.button>
          <button className="w-full bg-gradient-to-r from-amber-500 to-emerald-500 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 min-w-0">
            Contact Guide
          </button>
        </div>
      </div>
    </motion.div>
  )
}

