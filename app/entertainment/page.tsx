"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Search,
  X,
  Calendar,
  Check,
  Users,
  MapPin,
  Loader2,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Music,
  Star,
  Clock,
  Ticket,
  Heart,
  Share2,
  Info,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import CountdownTimer from "@/components/CountdownTimer"
import HotTimeDeals from "@/components/HotTimeDeals"
import { useCookieTracking } from "@/hooks/useCookieTracking"
import { swapArrayElementsRandomly, swapVendorsWithinCategory } from "@/utils/swap-utils"
import { isNewThisWeek } from "@/utils/date-utils"
import NewThisWeekBadge from "@/components/NewThisWeekBadge"
import NewProductsForYou from "@/components/NewProductsForYou"
import { transformEntertainmentToProducts } from "@/utils/product-transformers"
import TheatricalEntrance from "@/components/TheatricalEntrance"
import TrendingPopularSection from "@/components/TrendingPopularSection"
//import { trendingProducts, popularProducts } from "../trending-data"

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
  dateAdded: string
  isTrending?: boolean
  isHotDeal?: boolean
  hotDealEnds?: string
}

interface Vendor {
  id: number
  name: string
  location: string
  logo: string
  description: string
  events: EntertainmentEvent[]
  redirectUrl: string
  verified?: boolean
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
    verified: true,
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
        isHotDeal: true,
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
        isHotDeal: true,
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
    verified: true,
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
    verified: true,
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
        isHotDeal: true,
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
        isHotDeal: true,
        hotDealEnds: "2025-04-15T23:59:59Z",
      },
    ],
    redirectUrl: "https://laugh-factory-kenya.com",
  },
]

const formatPrice = (price: Price): string => {
  if (price.currency === "KSH" && price.amount >= 100000) {
    return `${price.currency} ${price.amount.toLocaleString()}`
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
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
  const [showContent, setShowContent] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const headerControls = useAnimation()

  // Handle animation completion
  const handleAnimationComplete = () => {
    setShowContent(true)
    localStorage.setItem("hasSeenTheatricalEntrance", "true")
  }

  // If user has already seen the animation, show content immediately
  useEffect(() => {
    const hasSeenAnimation = localStorage.getItem("hasSeenTheatricalEntrance")
    if (hasSeenAnimation) {
      setShowContent(true)
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Parallax effect for header based on scroll position
  useEffect(() => {
    headerControls.start({
      opacity: scrollY > 100 ? 0.9 : 1,
      y: scrollY > 100 ? -10 : 0,
      scale: scrollY > 100 ? 0.98 : 1,
    })
  }, [scrollY, headerControls])

  // Adding the hot deals section
  const hotEntertainmentDeals = entertainmentProducts
    .filter(
      (product) =>
        product.isHotDeal ||
        (product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount > 0.2,
    )
    .map((product) => ({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      currentPrice: product.currentPrice,
      originalPrice: product.originalPrice,
      category: product.category,
      expiresAt: product.hotDealEnds || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: product.description,
      discount: Math.round(
        ((product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount) * 100,
      ),
    }))
    .slice(0, 4)

  // State for event swapping functionality
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
    if (showContent) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#9333ea", "#6366f1", "#ec4899", "#f59e0b"],
      })
    }

    // Find a new event to show in the alert
    const newEvent = vendors.flatMap((v) => v.events).find((e) => e.isNew)
    if (newEvent) {
      setNewEventAlert(newEvent)
    }
  }, [vendors, showContent])

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
  {/* const entertainmentColorScheme = {
    primary: "from-purple-500 to-indigo-700",
    secondary: "bg-purple-100",
    accent: "bg-indigo-600",
    text: "text-purple-900",
    background: "bg-purple-50",
  }
*/}
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
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-violet-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-purple-500 opacity-10"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: Math.random() * 0.5 + 0.5,
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
              }}
            />
          ))}
        </div>
      </div>

      <TheatricalEntrance onComplete={handleAnimationComplete} />

      {/* Main content - will be shown after animation completes */}
      <div className={`transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0"}`}>
        {/* Sticky header with glass effect */}
        <motion.header
          className="sticky top-0 z-50 backdrop-blur-lg bg-black/30 border-b border-white/10 shadow-lg"
          animate={headerControls}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Music className="h-8 w-8 text-purple-400 mr-3" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Entertainment Hub
              </h1>
            </div>

            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-purple-300" />
              </div>
              <input
                type="text"
                placeholder="Search events, artists, or venues..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-black/40 text-white placeholder-purple-300 backdrop-blur-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              {eventTypes.slice(0, 3).map((type) => (
                <Badge
                  key={type}
                  variant={activeCategory === type ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    activeCategory === type
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "hover:bg-purple-500/20"
                  }`}
                  onClick={() => setActiveCategory(activeCategory === type ? null : type)}
                >
                  {type}
                </Badge>
              ))}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="cursor-pointer hover:bg-purple-500/20">
                      +{eventTypes.length - 3}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="p-2">
                      {eventTypes.slice(3).map((type) => (
                        <div key={type} className="py-1">
                          {type}
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </motion.header>

        {/* Hero section with 3D effect */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 max-w-4xl mx-auto text-center"
            >
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400">
                  Unforgettable Moments
                </span>
                <br />
                <span className="inline-block text-white">Unbeatable Prices</span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-purple-200 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Discover and book the hottest entertainment events across Kenya
              </motion.p>

              <motion.div
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link href="/entertainment/shop">
                  <Button
                    size="lg"
                    className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white opacity-10"
                      initial={{ x: "-100%" }}
                      animate={{ x: isHovered ? "100%" : "-100%" }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                    <span className="flex items-center text-lg font-medium">
                      <Ticket className="mr-2 h-5 w-5" />
                      Browse Events
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </span>
                  </Button>
                </Link>

                <Link href="/entertainment/live-streaming">
                  <Button
                    size="lg"
                    variant="outline"
                    className="group relative overflow-hidden border-purple-400 text-purple-100 hover:text-white px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                  >
                    <span className="flex items-center text-lg font-medium">
                      <Music className="mr-2 h-5 w-5" />
                      Live Streams
                    </span>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Floating 3D elements */}
          <div className="absolute inset-0 pointer-events-none">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  rotate: Math.random() * 360,
                  scale: 0.5,
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  rotate: Math.random() * 360,
                  scale: 0.5,
                }}
                transition={{
                  duration: 15 + Math.random() * 10,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Countdown timer with enhanced styling */}
        <div className="container mx-auto px-4 py-8 max-w-[1920px]">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-md border border-purple-500/20 shadow-xl p-6 mb-12">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=1000')] opacity-10 bg-cover bg-center" />
            </div>
            <div className="relative z-10">
              <CountdownTimer targetDate="2025-12-31T23:59:59" startDate="2025-02-13T00:00:00" />
            </div>
          </div>

          {/* New Products Section with Glass Morphism */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <NewProductsForYou allProducts={entertainmentProducts} colorScheme="purple" maxProducts={4} />
          </motion.div>

          {/* Hot Deals Section with Enhanced Animation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <HotTimeDeals
              deals={hotEntertainmentDeals}
              colorScheme="purple"
              title="Hurry for Hot Entertainment Shows!"
              subtitle="Limited-time Entertainment Tickets!"
            />
          </motion.div>
      
          {/* Trending and Popular Section with 3D Cards */}{/*
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <TrendingPopularSection
              trendingProducts={trendingProducts}
              popularProducts={popularProducts}
              colorScheme={entertainmentColorScheme}
              title="Entertainment Highlights"
              subtitle="Discover trending and most popular entertainment options"
            />
          </motion.div>
*/}
          {/* Quick Access Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <QuickAccessButton
              href="/entertainment/shop"
              icon={<Ticket />}
              title="Entertainment Shop"
              description="Browse and purchase tickets for upcoming events"
              gradient="from-purple-600 to-indigo-600"
            />

            <QuickAccessButton
              href="/entertainment/live-streaming"
              icon={<Music />}
              title="Live Streams"
              description="Watch live performances from the comfort of your home"
              gradient="from-pink-600 to-purple-600"
            />

            <QuickAccessButton
              href="https://www.bit.ly/2cheki"
              icon={<Sparkles />}
              title="Movie Trailers"
              description="Explore our collection of the latest movie trailers"
              gradient="from-amber-600 to-pink-600"
            />
          </div>

          {/* Event Categories Section */}
          <AnimatePresence mode="popLayout">
            {visibleEventTypes.map((type) => (
              <motion.div
                key={type}
                className="mb-16"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                      {type}
                    </span>
                  </h2>
                  <Link href={`/entertainment/category/${type.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Button variant="ghost" className="text-purple-300 hover:text-white hover:bg-purple-500/20">
                      View All <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

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
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                  <p className="mt-2 text-purple-300 font-medium">Loading more events...</p>
                </div>
              ) : (
                <div className="h-16" />
              )}
            </div>
          )}

          {/* No more items indicator */}
          {!hasMore && visibleEventTypes.length > 0 && (
            <div className="text-center py-8">
              <p className="text-purple-300 font-medium">You've seen all available event types!</p>
            </div>
          )}
        </div>

        {/* Footer with glass effect */}
        <footer className="mt-16 border-t border-purple-500/20 backdrop-blur-md bg-black/30">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Entertainment Hub</h3>
                <p className="text-purple-300 mb-4">
                  Your one-stop destination for all entertainment events across Kenya.
                </p>
                <div className="flex space-x-4">
                  <SocialIcon icon={<Heart className="h-5 w-5" />} />
                  <SocialIcon icon={<Share2 className="h-5 w-5" />} />
                  <SocialIcon icon={<Info className="h-5 w-5" />} />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/entertainment/shop" className="text-purple-300 hover:text-white transition-colors">
                      Entertainment Shop
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/entertainment/live-streaming"
                      className="text-purple-300 hover:text-white transition-colors"
                    >
                      Live Streams
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://www.bit.ly/2cheki"
                      className="text-purple-300 hover:text-white transition-colors"
                    >
                      Movie Trailers
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
                <p className="text-purple-300">Have questions or need assistance? Reach out to our support team.</p>
                <Button variant="outline" className="mt-4 border-purple-400 text-purple-300 hover:text-white">
                  Contact Support
                </Button>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-purple-500/20 text-center text-purple-400">
              <p>© {new Date().getFullYear()} Entertainment Hub. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* New Event Alert with enhanced animation */}
      <AnimatePresence>
        {newEventAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 right-4 backdrop-blur-lg bg-black/70 border border-purple-500/30 rounded-lg shadow-2xl p-4 max-w-sm text-white z-50"
          >
            <button
              onClick={() => setNewEventAlert(null)}
              className="absolute top-2 right-2 text-gray-300 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-3 flex-shrink-0">
                <Star className="h-5 w-5 text-white" />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-1">New Event Alert!</h3>
                <p className="text-gray-300 mb-2">{newEventAlert.name} is now available!</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                    {formatPrice(newEventAlert.currentPrice)}
                  </p>
                  <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function VendorCard({ vendor, eventType }: { vendor: Vendor; eventType: string }) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  return (
    <motion.div
      className="h-full"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        x.set(0)
        y.set(0)
      }}
    >
      <motion.div
        className="bg-black/40 backdrop-blur-md border border-purple-500/20 rounded-xl shadow-xl overflow-hidden h-full flex flex-col transform-gpu"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transition: "transform 0.3s ease",
        }}
      >
        <div className="p-6 border-b border-purple-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center">
              <div className="relative flex-shrink-0">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-0.5">
                  <Image
                    src={imageError ? "/placeholder.svg?height=60&width=60" : vendor.logo}
                    alt={vendor.name}
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                    onError={() => setImageError(true)}
                  />
                </div>
                {vendor.verified && (
                  <motion.div
                    className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-1"
                    animate={{
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(147, 51, 234, 0.7)",
                        "0 0 0 10px rgba(147, 51, 234, 0)",
                        "0 0 0 0 rgba(147, 51, 234, 0)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Check className="h-3 w-3" />
                  </motion.div>
                )}
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-white">{vendor.name}</h3>
                <div className="flex items-center text-purple-300">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{vendor.location}</span>
                </div>
              </div>
            </div>
            <a
              href={vendor.redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition duration-300 whitespace-nowrap text-sm font-medium"
            >
              Visit Website
            </a>
          </div>
          <p className="text-purple-200 mb-4 line-clamp-2">{vendor.description}</p>
          <a
            href={vendor.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300"
          >
            <MapPin size={16} className="mr-1" />
            Find on Maps
          </a>
        </div>
        <div className="bg-black/60 p-6 flex-grow">
          <h4 className="text-lg font-semibold mb-4 text-white flex items-center">
            <Star className="h-4 w-4 mr-2 text-purple-400" />
            Featured Events
          </h4>
          <div className="grid grid-cols-1 gap-4 h-full">
            {vendor.events
              .filter((event) => event.type === eventType)
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function TrendingBadge() {
  return (
    <motion.div
      className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center z-10"
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
      <span>Trending</span>
    </motion.div>
  )
}

function EventCard({ event }: { event: EntertainmentEvent }) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const savings: Price = {
    amount: event.originalPrice.amount - event.currentPrice.amount,
    currency: event.currentPrice.currency,
  }

  return (
    <motion.div
      className="bg-black/60 rounded-lg overflow-hidden flex flex-col h-full border border-purple-500/20 transform-gpu"
      whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(147, 51, 234, 0.5)" }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative w-full pt-[75%] overflow-hidden">
        <Image
          src={imageError ? "/placeholder.svg?height=300&width=400" : event.imageUrl}
          alt={event.name}
          layout="fill"
          objectFit="cover"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={80}
          onError={() => setImageError(true)}
          className="transition-transform duration-700 ease-in-out"
          style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-70" />

        {event.isNew && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
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
              className="bg-gradient-to-r from-amber-500 to-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg transform rotate-[-30deg] shadow-lg"
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
          <div className="absolute bottom-2 left-2 z-10">
            <NewThisWeekBadge />
          </div>
        )}

        {/* Hot deal countdown */}
        {event.isHotDeal && event.hotDealEnds && (
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium text-white flex items-center z-10">
            <Clock className="h-3 w-3 mr-1 text-red-400" />
            <HotDealCountdown endDate={event.hotDealEnds} />
          </div>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h5 className="font-semibold mb-2 text-white truncate">{event.name}</h5>

        {/* Price display with discount badge */}
        <div className="flex items-end justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              {formatPrice(event.currentPrice)}
            </span>
            <span className="text-sm text-gray-400 line-through">{formatPrice(event.originalPrice)}</span>
          </div>

          {savings.amount > 0 && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
              {Math.round((savings.amount / event.originalPrice.amount) * 100)}% OFF
            </Badge>
          )}
        </div>

        <div className="text-sm text-purple-200 mb-4 space-y-1.5">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1.5 flex-shrink-0 text-purple-400" />
            <span className="truncate">{event.date}</span>
          </div>
          <div className="flex items-center">
            <MapPin size={14} className="mr-1.5 flex-shrink-0 text-purple-400" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center">
            <Users size={14} className="mr-1.5 flex-shrink-0 text-purple-400" />
            <span className="truncate">{event.capacity}</span>
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <Button
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-0"
            size="sm"
          >
            Book Now
          </Button>

          <Button
            variant="outline"
            className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:text-white"
            size="sm"
          >
            Save {formatPrice(savings)}
          </Button>
        </div>
      </div>
    </div>
  )
}

