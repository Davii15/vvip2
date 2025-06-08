"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Search, X, Calendar, Check, Users, MapPin, Loader2, TrendingUp , Sparkles , ChevronRight , Music } from "lucide-react"
import Image from "next/image"
import CountdownTimer from "@/components/CountdownTimer"
import HotTimeDeals from "@/components/HotTimeDeals"
import { useCookieTracking } from "@/hooks/useCookieTracking"
import { swapArrayElementsRandomly, swapVendorsWithinCategory } from "@/utils/swap-utils"
import { isNewThisWeek } from "@/utils/date-utils"
import NewThisWeekBadge from "@/components/NewThisWeekBadge"
import NewProductsForYou from "@/components/NewProductsForYou"
import { transformEntertainmentToProducts } from "@/utils/product-transformers"
import TheatricalEntrance from "@/components/TheatricalEntrance"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import TrendingPopularSection from "@/components/TrendingPopularSection"
import { trendingProducts, popularProducts } from "./trending-data"
//import { VerificationBadge } from "@/components/VerificationBadge"


interface Price {
  amount: number
  currency: string
}

interface EntertainmentEvent {
  id: number
  name: string
  imageUrl: string
  currentPrice: Price
  originalPrice: Price
  isNew?: boolean
  type: "Music Show" | "Live Performance" | "Album Launch" | "Talk Show" | "Book Launch" | "Other"
  date: string
  venue: string
  capacity: string
  isAlmostSoldOut?: boolean
  dateAdded: string //ISO date type
  isTrending?: boolean
  isHotDeal?: boolean // Add this field
  hotDealEnds?: string // Add this field - ISO date string
  
}

interface Vendor {
  id: number
  name: string
  location: string
  logo: string
  description: string
  events: EntertainmentEvent[]
  redirectUrl: string
  verified?:boolean
 // isVerified?:boolean
 // verificationColor?:string
  mapLink: string
  defaultCurrency: string
}

// Mock data for vendors
const mockVendors: Vendor[] = [
  {
    id: 1,
    name: "Groove Masters Entertainment",
    location: "Nairobi, Kenya",
    logo: "https://your-supabase-project.supabase.co/storage/v1/object/public/vendor-logos/groove-masters-logo.png",
    description: "Bringing you the hottest music shows and live performances!",
    defaultCurrency: "KSH",
    //isVerified: true,
    //verificationColor: "purple" ,
    verified:true,
    mapLink: "https://www.google.com/maps/search/?api=1&query=Groove+Masters+Entertainment+Nairobi+Kenya",
    events: [
      {
        id: 1,
        name: "Summer Beats Festival",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/event-images/summer-beats-festival.jpg",
        currentPrice: { amount: 1800.0, currency: "KSH" },
        originalPrice: { amount: 2000.99, currency: "KSH" },
        type: "Music Show",
        date: "2023-08-15",
        venue: "Uhuru Gardens",
        capacity: "10,000 people",
        dateAdded: "2025-05-15T10:30:00Z",
        isTrending: true,
        isHotDeal: true, // Mark this as a hot deal
        hotDealEnds: "2025-04-15T23:59:59Z",
      },
      {
        id: 2,
        name: "Jazz Night Extravaganza",
        imageUrl: "https://your-supabase-project.supabase.co/storage/v1/object/public/event-images/jazz-night.jpg",
        currentPrice: { amount: 1500.0, currency: "KSH" },
        originalPrice: { amount: 2000.99, currency: "KSH" },
        type: "Live Performance",
        date: "2023-07-22",
        venue: "Nairobi National Theatre",
        capacity: "500 people",
        isAlmostSoldOut: true,
        dateAdded: "2025-05-15T10:30:00Z",
      },
      {
        id: 3,
        name: "Afrobeats Sensation Album Launch",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/event-images/afrobeats-album-launch.jpg",
        currentPrice: { amount: 1000.0, currency: "KSH" },
        originalPrice: { amount: 5000.0, currency: "KSH" },
        type: "Album Launch",
        date: "2023-09-01",
        venue: "KICC",
        capacity: "2,000 people",
        isNew: true,
        dateAdded: "2025-05-15T10:30:00Z",
        isHotDeal: true, // Mark this as a hot deal
       hotDealEnds: "2025-04-15T23:59:59Z",
        
      },
    ],
    redirectUrl: "https://groove-masters.com",
  },
  {
    id: 2,
    name: "Bookworm's Paradise",
    location: "Mombasa, Kenya",
    logo: "https://your-supabase-project.supabase.co/storage/v1/object/public/vendor-logos/bookworms-paradise-logo.png",
    description: "Celebrating literature with exciting book launches and author talks!",
    defaultCurrency: "KSH",
    //isVerified: true,
    verified:true,
    //verificationColor: "purple",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Groove+Masters+Entertainment+Nairobi+Kenya",
    events: [
      {
        id: 4,
        name: "Mystery Thriller Book Launch",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/event-images/mystery-book-launch.jpg",
        currentPrice: { amount: 500.0, currency: "KSH" },
        originalPrice: { amount: 800.0, currency: "KSH" },
        type: "Book Launch",
        date: "2023-08-05",
        venue: "Mombasa Public Library",
        capacity: "200 people",
        dateAdded: "2025-05-15T10:30:00Z",
        isTrending: true,
      },
      {
        id: 5,
        name: "Poetry Slam Night",
        imageUrl: "https://your-supabase-project.supabase.co/storage/v1/object/public/event-images/poetry-slam.jpg",
        currentPrice: { amount: 150.0, currency: "KSH" },
        originalPrice: { amount: 200.0, currency: "KSH" },
        type: "Live Performance",
        date: "2023-07-29",
        venue: "Swahili Cultural Center",
        capacity: "150 people",
        dateAdded: "2025-05-15T10:30:00Z",
      },
    ],
    redirectUrl: "https://bookworms-paradise.com",
  },
  {
    id: 3,
    name: "Laugh Factory Kenya",
    location: "Kisumu, Kenya",
    logo: "https://your-supabase-project.supabase.co/storage/v1/object/public/vendor-logos/laugh-factory-logo.png",
    description: "Your one-stop shop for hilarious comedy shows and entertaining talk shows!",
    defaultCurrency: "KSH",
    //isVerified: true,
    verified:true,
    //verificationColor: "purple",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Groove+Masters+Entertainment+Nairobi+Kenya",
    events: [
      {
        id: 6,
        name: "Stand-up Comedy Night",
        imageUrl: "https://your-supabase-project.supabase.co/storage/v1/object/public/event-images/comedy-night.jpg",
        currentPrice: { amount: 1800.0, currency: "KSH" },
        originalPrice: { amount: 2000.0, currency: "KSH" },
        type: "Live Performance",
        date: "2023-08-12",
        venue: "Kisumu Improv Theater",
        capacity: "300 people",
        isAlmostSoldOut: true,
        dateAdded: "2025-05-15T10:30:00Z",
        isHotDeal: true, // Mark this as a hot deal
        hotDealEnds: "2025-04-15T23:59:59Z",
      },
      {
        id: 7,
        name: "Celebrity Talk Show Live",
        imageUrl: "https://your-supabase-project.supabase.co/storage/v1/object/public/event-images/talk-show-live.jpg",
        currentPrice: { amount: 2000.0, currency: "KSH" },
        originalPrice: { amount: 4500.0, currency: "KSH" },
        type: "Talk Show",
        date: "2023-09-08",
        venue: "Acacia Hotel Ballroom",
        capacity: "400 people",
        isAlmostSoldOut: true,
        dateAdded: "2025-05-15T10:30:00Z",
        isTrending: true,
        isHotDeal: true, // Mark this as a hot deal
        hotDealEnds: "2025-04-15T23:59:59Z",
      },
    ],
    redirectUrl: "https://laugh-factory-kenya.com",
  },
]

const formatPrice = (price: Price): string => {
  // IMPROVEMENT: Format price to prevent overflow on large screens
  // For KSH currency with large amounts, use a more compact format
  if (price.currency === "KSH" && price.amount >= 100000) {
    // Format as "KSH X,XXX,XXX" instead of using the default currency formatter
    return `${price.currency} ${price.amount.toLocaleString()}`
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    // Add maximumFractionDigits to prevent long decimal places
    maximumFractionDigits: 0,
  }).format(price.amount)
}

export default function Entertainment() {
  useCookieTracking("entertainment")
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors)
  const [newEventAlert, setNewEventAlert] = useState<EntertainmentEvent | null>(null)
  const entertainmentProducts = transformEntertainmentToProducts(vendors)
  const [isHovered, setIsHovered] = useState(false)


 // State to control content visibility
 const [showContent, setShowContent] = useState(false)

 // Handle animation completion
 const handleAnimationComplete = () => {
   setShowContent(true)
 }

 // If user has already seen the animation, show content immediately
 useEffect(() => {
   const hasSeenAnimation = localStorage.getItem("hasSeenTheatricalEntrance")
   if (hasSeenAnimation) {
     setShowContent(true)
   }
 }, [])





  //adding the hot deals section
  const hotEntertainmentDeals = entertainmentProducts
    .filter(product => 
      product.isHotDeal || 
      (product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount > 0.2
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
    .slice(0, 4) //limit to 4 Deals


  //state for event swapping functionality
  const [eventTypes, setEventTypes] = useState<string[]>([
    "Music Show",
    "Live Performance",
    "Album Launch",
    "Talk Show",
    "Book Launch",
    "Other",
  ])
  const [swapTrigger, setSwapTrigger] = useState(0)

  // Infinite scroll states
  const [visibleEventTypes, setVisibleEventTypes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)
  const ITEMS_PER_PAGE = 2

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    // Find a new event to show in the alert
    const newEvent = vendors.flatMap((v) => v.events).find((e) => e.isNew)
    if (newEvent) {
      setNewEventAlert(newEvent)
    }
  }, [vendors])

  // IMPROVED SEARCH FUNCTIONALITY FOR ENTERTAINMENT PAGE
  useEffect(() => {
    const filtered = vendors.filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.events.some(
          (event) =>
            event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.capacity.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.currentPrice.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.originalPrice.currency.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    )
    setFilteredVendors(filtered)
  }, [searchTerm, vendors])

 // Custom color scheme for entertainment
 const entertainmentColorScheme = {
  primary: "from-purple-500 to-indigo-700",
  secondary: "bg-purple-100",
  accent: "bg-indigo-600",
  text: "text-purple-900",
  background: "bg-purple-50",
}

  // Add swapping effect every 10 minutes
  useEffect(() => {
    // Set up interval for swapping categories
    const swapInterval = setInterval(
      () => {
        // Swap event types
        setEventTypes((prevTypes) => swapArrayElementsRandomly(prevTypes))

        // Swap vendors within each category
        setVendors((prevVendors) => {
          const newVendors = prevVendors.map((vendor) => ({
            ...vendor,
            events: [...vendor.events], // Create a new array of events
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

  // Initialize visible event types
  useEffect(() => {
    setVisibleEventTypes(eventTypes.slice(0, ITEMS_PER_PAGE))
  }, [eventTypes])

  // Intersection Observer for infinite scrolling
  const loadMoreItems = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      const currentLength = visibleEventTypes.length
      const nextItems = eventTypes.slice(currentLength, currentLength + ITEMS_PER_PAGE)

      if (nextItems.length > 0) {
        setVisibleEventTypes((prev) => [...prev, ...nextItems])
      } else {
        setHasMore(false)
      }

      setIsLoading(false)
    }, 800)
  }, [isLoading, hasMore, visibleEventTypes, eventTypes])

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
    setVisibleEventTypes(eventTypes.slice(0, ITEMS_PER_PAGE))
    setHasMore(true)
  }, [searchTerm, eventTypes])

  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-800 min-h-screen">
  <TheatricalEntrance onComplete={handleAnimationComplete} />

{/* Main content - will be shown after animation completes */}
<div className={`transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0"}`}>


      {/* IMPROVEMENT: Added max-width to container to prevent excessive stretching on ultra-wide screens */}
      <div className="container mx-auto px-4 py-8 max-w-[1920px]">
        <h1 className="text-4xl font-bold text-center mb-8 text-white italic animate-pulse">
          Unforgettable Moments, Unbeatable Prices – Entertainment at Its Best!
        </h1>
        <CountdownTimer targetDate="2025-12-31T23:59:59" startDate="2025-02-13T00:00:00" />
        <NewProductsForYou 
  allProducts={entertainmentProducts}
  colorScheme="purple"
  maxProducts={4}
/>
<HotTimeDeals 
        deals={hotEntertainmentDeals}
        colorScheme="purple"
        title="Hurry for Hot Entertainment Shows!"
        subtitle="Limited-time Entertainment Tickets!"
      />
{/* Trending and Popular Section */}
<TrendingPopularSection
        trendingProducts={trendingProducts}
        popularProducts={popularProducts}
        colorScheme={entertainmentColorScheme}
        title="Entertainment Highlights"
        subtitle="Discover trending and most popular entertainment options"
      />

        {/* IMPROVEMENT: Added max-width to search container for better appearance on large screens */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events, artists, or venues..."
              className="w-full p-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-black bg-opacity-50 text-white placeholder-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300" />
          </div>
        </div>
        </div>
        {/*the shop logic*/}
        <div className="flex justify-center my-8">
      <Link href="/entertainment/shop">
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
            <Music className="mr-2 h-5 w-5" />
            Explore Entertainment Shop
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
{/*THE LIVE STREAM LOGIC*/}
<div className="flex justify-center my-8">
      <Link href="/entertainment/live-streaming">
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
            <Music className="mr-2 h-5 w-5" />
            Explore our Entertainment Live streams
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
{/*THE LIVE STREAM LOGIC*/}
<div className="flex justify-center my-8">
      <Link href="https://www.bit.ly/2cheki">
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
            <Music className="mr-2 h-5 w-5" />
            Explore our Movie Trailers Site
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

        {/* Infinite scroll implementation */}
        <AnimatePresence mode="popLayout">
          {visibleEventTypes.map((type) => (
            <motion.div
              key={type}
              className="mb-12"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 animate-bounce">{type}</h2>
              {/* IMPROVEMENT: Adjusted grid to better handle large screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredVendors
                    .filter((vendor) => vendor.events.some((event) => event.type === type))
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
                        <VendorCard vendor={vendor} eventType={type} />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {hasMore && (
          <div ref={loaderRef} className="flex justify-center items-center py-8">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <p className="mt-2 text-white font-medium">Loading more events...</p>
              </div>
            ) : (
              <div className="h-16" />
            )}
          </div>
        )}

        {/* No more items indicator */}
        {!hasMore && visibleEventTypes.length > 0 && (
          <div className="text-center py-8">
            <p className="text-white font-medium">You've seen all available event types!</p>
          </div>
        )}

        {/* Keep the original content for backward compatibility (hidden) */}
        <div className="hidden">
          {eventTypes.map((type) => (
            <div key={type} className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 animate-bounce">{type}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {filteredVendors
                  .filter((vendor) => vendor.events.some((event) => event.type === type))
                  .map((vendor) => (
                    <VendorCard key={vendor.id} vendor={vendor} eventType={type} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {newEventAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-black bg-opacity-80 rounded-lg shadow-lg p-4 max-w-sm text-white"
          >
            <button
              onClick={() => setNewEventAlert(null)}
              className="absolute top-2 right-2 text-gray-300 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-2">New Event Alert!</h3>
            <p className="text-gray-300 mb-2">{newEventAlert.name} is now available!</p>
            <p className="text-purple-400 font-bold">Only {formatPrice(newEventAlert.currentPrice)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function VendorCard({ vendor, eventType }: { vendor: Vendor; eventType: string }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="bg-black bg-opacity-50 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col h-full">
      <div className="p-6">
        {/* IMPROVEMENT: Made the header more responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center">
            {/* IMPROVEMENT: Added flex-shrink-0 to prevent logo from being compressed */}
            <div className="relative flex-shrink-0">
              <Image
                src={imageError ? "/images/vendor-placeholder.png" : vendor.logo}
                alt={vendor.name}
                width={60}
                height={60}
                className="rounded-full"
                onError={() => setImageError(true)}
              />
        {vendor.verified && (
                <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
           {/*logic forbadge*/}
           {/*
            <div className="flex items-center">
  <h3>{vendor.name}</h3>
  {vendor.isVerified && (
    <VerificationBadge 
      variant={vendor.verificationColor || "blue"} 
      size="md" 
      className="ml-2"
    />
  )}
</div> */}
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-white">{vendor.name}</h3>
              <p className="text-gray-300">{vendor.location}</p>
            </div>
          </div>
          <a
            href={vendor.redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition duration-300 animate-pulse whitespace-nowrap"
          >
            Visit Website
          </a>
        </div>
        <p className="text-gray-300 mb-4 line-clamp-2 md:line-clamp-none">{vendor.description}</p>
        <a
          href={vendor.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
        >
          <MapPin size={16} className="mr-1" />
          Find on Maps
        </a>
      </div>
      <div className="bg-gray-900 p-6 flex-grow">
        <h4 className="text-lg font-semibold mb-4 text-white">Featured Events</h4>
        {/* IMPROVEMENT: Simplified grid for better responsiveness */}
        <div className="grid grid-cols-1 gap-4 h-full">
          {vendor.events
            .filter((event) => event.type === eventType)
            .map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
        </div>
      </div>
    </div>
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

function EventCard({ event }: { event: EntertainmentEvent }) {
  const [imageError, setImageError] = useState(false)
  const savings: Price = {
    amount: event.originalPrice.amount - event.currentPrice.amount,
    currency: event.currentPrice.currency,
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
      <div className="relative w-full pt-[75%]">
        <Image
          src={imageError ? "/images/event-placeholder.png" : event.imageUrl}
          alt={event.name}
          layout="fill"
          objectFit="cover"
          loading="lazy" // Add lazy loading
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize loading sizes
          quality={80} // Slightly reduce quality for better performance
          onError={() => setImageError(true)}
        />
        {event.isNew && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-bounce">
            NEW
          </div>
        )}
{/* Add the trending badge */}
{event.isTrending && <TrendingBadge />}

        {/* Almost Sold Out sticker with animation */}
        {event.isAlmostSoldOut && (
          <motion.div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-amber-500 text-white px-4 py-2 rounded-lg font-bold text-lg transform rotate-[-30deg] shadow-lg"
              animate={{
                scale: [0.9, 1.1, 0.9],
                boxShadow: [
                  "0 4px 6px rgba(0, 0, 0, 0.1)",
                  "0 10px 15px rgba(0, 0, 0, 0.2)",
                  "0 4px 6px rgba(0, 0, 0, 0.1)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              ALMOST SOLD OUT
            </motion.div>
          </motion.div>
        )}
        {/* New This Week badge - positioned differently to avoid overlap */}
        {event.dateAdded && isNewThisWeek(event.dateAdded) && (
          <div className="absolute bottom-2 left-2">
            <NewThisWeekBadge />
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h5 className="font-semibold mb-2 text-white truncate">{event.name}</h5>
        {/* IMPROVEMENT: Better price display to prevent overflow */}
        <div className="flex flex-col mb-2">
          <span className="text-lg font-bold text-purple-400 break-words">{formatPrice(event.currentPrice)}</span>
          <span className="text-sm text-gray-400 line-through break-words">{formatPrice(event.originalPrice)}</span>
        </div>
        <div className="text-sm text-gray-300 mb-2">
          <div className="flex items-center">
            <Calendar size={16} className="mr-1 flex-shrink-0" />
            <span className="truncate">{event.date}</span>
          </div>
          <div className="flex items-center">
            <MapPin size={16} className="mr-1 flex-shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center">
            <Users size={16} className="mr-1 flex-shrink-0" />
            <span className="truncate">{event.capacity}</span>
          </div>
        </div>
        {/* IMPROVEMENT: Added min-width-0 to buttons to prevent overflow */}
        <div className="mt-auto space-y-2">
          <motion.button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-full min-w-0"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            animate={{ rotateZ: [0, 5, 0, -5, 0] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            Save {formatPrice(savings)}
          </motion.button>
          <motion.button
            className="w-full bg-green-500 text-white px-4 py-2 rounded-full min-w-0"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Book Now
          </motion.button>
          <button className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-4 py-2 rounded-full animate-pulse hover:from-pink-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 min-w-0">
            Grab them
          </button>
        </div>
      </div>
    </div>
  )
}

