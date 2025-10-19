"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, X, Clock, Check, MapPin, TrendingUp, ShoppingBag, Sparkles, ChevronRight, Star } from "lucide-react"
import Image from "next/image"
import CountdownTimer from "@/components/CountdownTimer"
import { useCookieTracking } from "@/hooks/useCookieTracking"
import { swapArrayElementsRandomly, swapVendorsWithinCategory } from "@/utils/swap-utils"
import { isNewThisWeek } from "@/utils/date-utils"
import NewThisWeekBadge from "@/components/NewThisWeekBadge"
import NewProductsForYou from "@/components/NewProductsForYou"
import { transformBeautyServicesToProducts } from "@/utils/product-transformers"
import HotTimeDeals from "@/components/HotTimeDeals"
import ProductModal from "@/components/ProductModal"

interface Price {
  amount: number
  currency: string
}

interface BeautyService {
  id: number
  name: string
  imageUrl: string
  currentPrice: Price
  originalPrice: Price
  isNew?: boolean
  type: "Massage" | "Facial" | "Hair" | "Nails" | "Makeup" | "Other"
  duration: string
  description: string
  dateAdded: string // ISO date string
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
  services: BeautyService[]
  redirectUrl: string
  mapLink: string
  verified?: boolean
  defaultCurrency: string
  whatsappNumber?: string
  businessHours?: string
  rating?: number
  totalReviews?: number
  specialties?: string[]
}

// Mock data for vendors
const mockVendors: Vendor[] = [
  {
    id: 1,
    name: "Serenity Spa & Beauty",
    location: "Nairobi, Kenya",
    logo: "https://your-supabase-project.supabase.co/storage/v1/object/public/vendor-logos/serenity-spa-logo.png",
    description: "Experience ultimate relaxation and beauty treatments in our tranquil oasis.",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Serenity+Spa+%26+Beauty+Nairobi+Kenya",
    defaultCurrency: "KSH",
    verified: true,
    services: [
      {
        id: 1,
        name: "Luxe Aromatherapy Massage",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/service-images/aromatherapy-massage.jpg",
        currentPrice: { amount: 2500.0, currency: "KSH" },
        originalPrice: { amount: 3500.0, currency: "KSH" },
        type: "Massage",
        duration: "60 minutes",
        description: "Indulge in a soothing massage with essential oils to relax your body and mind.",
        dateAdded: "2025-03-15T10:30:00Z",
        isHotDeal: true, // Mark this as a hot deal
        hotDealEnds: "2025-04-15T23:59:59Z",
      },
      {
        id: 2,
        name: "Radiant Glow Facial",
        imageUrl: "https://your-supabase-project.supabase.co/storage/v1/object/public/service-images/glow-facial.jpg",
        currentPrice: { amount: 500.0, currency: "KSH" },
        originalPrice: { amount: 1500.0, currency: "KSH" },
        type: "Facial",
        duration: "75 minutes",
        description: "Revitalize your skin with our signature facial for a youthful, radiant complexion.",
        dateAdded: "2025-03-15T10:30:00Z",
        isTrending: true,
      },
      {
        id: 3,
        name: "Deluxe Mani-Pedi Combo",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/service-images/mani-pedi-combo.jpg",
        currentPrice: { amount: 2000.0, currency: "KSH" },
        originalPrice: { amount: 3500.0, currency: "KSH" },
        type: "Nails",
        duration: "90 minutes",
        description: "Treat your hands and feet to a luxurious manicure and pedicure experience.",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
      },
    ],
    redirectUrl: "https://serenity-spa-beauty.com",
    whatsappNumber: "+254700123456",
    businessHours: "Mon-Sat: 8AM-8PM, Sun: 10AM-6PM",
    rating: 4.8,
    totalReviews: 156,
    specialties: ["Massage Therapy", "Facial Treatments", "Hair Styling"],
  },
  {
    id: 2,
    name: "Glamour Haven",
    location: "Mombasa, Kenya",
    logo: "https://your-supabase-project.supabase.co/storage/v1/object/public/vendor-logos/glamour-haven-logo.png",
    description: "Your one-stop destination for all things beauty and glamour.",
    defaultCurrency: "KSH",
    verified: true,
    mapLink: "https://www.google.com/maps/search/?api=1&query=Serenity+Spa+%26+Beauty+Nairobi+Kenya",
    services: [
      {
        id: 4,
        name: "Celebrity Makeover",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/service-images/celebrity-makeover.jpg",
        currentPrice: { amount: 1800.0, currency: "KSH" },
        originalPrice: { amount: 2000.0, currency: "KSH" },
        type: "Makeup",
        duration: "120 minutes",
        description: "Get the red carpet treatment with our professional makeup artists.",
        dateAdded: "2025-03-15T10:30:00Z",
        isHotDeal: true, // Mark this as a hot deal
        hotDealEnds: "2025-04-15T23:59:59Z",
      },
      {
        id: 5,
        name: "Silky Smooth Hair Treatment",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/service-images/hair-treatment.jpg",
        currentPrice: { amount: 550.0, currency: "KSH" },
        originalPrice: { amount: 800.0, currency: "KSH" },
        type: "Hair",
        duration: "60 minutes",
        description: "Transform your hair with our nourishing and smoothing hair treatment.",
        dateAdded: "2025-03-15T10:30:00Z",
      },
    ],
    redirectUrl: "https://glamour-haven.com",
    whatsappNumber: "+254700123456",
    businessHours: "Mon-Sat: 8AM-8PM, Sun: 10AM-6PM",
    rating: 4.8,
    totalReviews: 156,
    specialties: ["Massage Therapy", "Facial Treatments", "Hair Styling"],
  },
  {
    id: 3,
    name: "Zen Wellness Center",
    location: "Kisumu, Kenya",
    logo: "https://your-supabase-project.supabase.co/storage/v1/object/public/vendor-logos/zen-wellness-logo.png",
    description: "Holistic beauty and wellness treatments for your body, mind, and soul.",
    defaultCurrency: "KSH",
    verified: true,
    mapLink: "https://www.google.com/maps/search/?api=1&query=Serenity+Spa+%26+Beauty+Nairobi+Kenya",
    services: [
      {
        id: 6,
        name: "Hot Stone Massage Therapy",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/service-images/hot-stone-massage.jpg",
        currentPrice: { amount: 500.0, currency: "KSH" },
        originalPrice: { amount: 850.0, currency: "KSH" },
        dateAdded: "2025-03-15T10:30:00Z",
        type: "Massage",
        duration: "90 minutes",
        description: "Experience deep relaxation with our hot stone massage therapy.",
      },
      {
        id: 7,
        name: "Rejuvenating Oxygen Facial",
        imageUrl: "https://your-supabase-project.supabase.co/storage/v1/object/public/service-images/oxygen-facial.jpg",
        currentPrice: { amount: 1500.0, currency: "KSH" },
        originalPrice: { amount: 2500.0, currency: "KSH" },
        type: "Facial",
        duration: "60 minutes",
        description: "Breathe new life into your skin with our oxygen-infused facial treatment.",
        dateAdded: "2025-03-15T10:30:00Z",
        isHotDeal: true, // Mark this as a hot deal
        hotDealEnds: "2025-04-15T23:59:59Z",
      },
    ],
    redirectUrl: "https://zen-wellness-center.com",
    whatsappNumber: "+254700123456",
    businessHours: "Mon-Sat: 8AM-8PM, Sun: 10AM-6PM",
    rating: 4.8,
    totalReviews: 156,
    specialties: ["Massage Therapy", "Facial Treatments", "Hair Styling"],
  },
]

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

interface UserSession {
  viewedServices: number[]
  clickedServices: number[]
  searchHistory: string[]
  sessionStart: number
  location?: { lat: number; lng: number }
}

interface RecommendationScore {
  serviceId: number
  score: number
  reasons: string[]
}

interface ServiceInteraction {
  serviceId: number
  timestamp: number
  type: "view" | "click" | "search"
}

// Contact data for each vendor
const vendorContacts = {
  "Serenity Spa & Beauty": {
    whatsapp: "+254700123456",
    phone: "+254700123456",
    email: "contact@serenityspa.co.ke",
    website: "https://serenity-spa-beauty.com",
  },
  "Glamour Haven": {
    whatsapp: "+254701234567",
    phone: "+254701234567",
    email: "info@glamourhaven.co.ke",
    website: "https://glamour-haven.com",
  },
  "Zen Wellness Center": {
    whatsapp: "+254702345678",
    phone: "+254702345678",
    email: "hello@zenwellness.co.ke",
    website: "https://zen-wellness-center.com",
  },
}

export default function BeautyAndMassage() {
  useCookieTracking("beauty-and-massage")
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors)
  const [newServiceAlert, setNewServiceAlert] = useState<BeautyService | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const [userSession, setUserSession] = useState<UserSession>({
    viewedServices: [],
    clickedServices: [],
    searchHistory: [],
    sessionStart: Date.now(),
  })
  const [recommendations, setRecommendations] = useState<BeautyService[]>([])
  const [popularServices, setPopularServices] = useState<BeautyService[]>([])
  const [nearbyServices, setNearbyServices] = useState<BeautyService[]>([])
  const [timeBasedServices, setTimeBasedServices] = useState<BeautyService[]>([])
  const [serviceInteractions, setServiceInteractions] = useState<ServiceInteraction[]>([])

  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)

  const beautyProducts = transformBeautyServicesToProducts(vendors)
  const hotBeautyDeals = beautyProducts
    .filter(
      (product) =>
        product.isHotDeal ||
        (product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount > 0.3, // 30% discount
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

  // State for service swapping functionality
  const [serviceTypes, setServiceTypes] = useState<string[]>(["Massage", "Facial", "Hair", "Nails", "Makeup", "Other"])
  const [swapTrigger, setSwapTrigger] = useState(0)

  // Add these states for infinite scroll
  const [visibleServiceTypes, setVisibleServiceTypes] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const typesPerPage = 2 // Show 2 service types at a time

  // Load more service types when user scrolls to bottom
  useEffect(() => {
    const endIndex = page * typesPerPage
    setVisibleServiceTypes(serviceTypes.slice(0, endIndex))
  }, [page, serviceTypes])

  // Add intersection observer to detect when user reaches bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleServiceTypes.length < serviceTypes.length) {
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
  }, [visibleServiceTypes.length, serviceTypes.length])

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    // Find a new service to show in the alert
    const newService = vendors.flatMap((v) => v.services).find((s) => s.isNew)
    if (newService) {
      setNewServiceAlert(newService)
    }
  }, [vendors])

  useEffect(() => {
    const filtered = vendors.filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.services.some((service) => {
          const currentPriceStr = service.currentPrice.amount.toString()
          const originalPriceStr = service.originalPrice.amount.toString()
          const currencyMatch = service.currentPrice.currency.toLowerCase().includes(searchTerm.toLowerCase())

          return (
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.duration.toLowerCase().includes(searchTerm.toLowerCase()) ||
            currentPriceStr.includes(searchTerm) ||
            originalPriceStr.includes(searchTerm) ||
            currencyMatch
          )
        }),
    )
    setFilteredVendors(filtered)
  }, [searchTerm, vendors])

  // Add swapping effect every 10 minutes
  useEffect(() => {
    // Set up interval for swapping categories
    const swapInterval = setInterval(
      () => {
        // Swap service types
        setServiceTypes((prevTypes) => swapArrayElementsRandomly(prevTypes))

        // Swap vendors within each category
        setVendors((prevVendors) => {
          const newVendors = prevVendors.map((vendor) => ({
            ...vendor,
            services: [...vendor.services], // Create a new array of services
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

  // 1. Session-Based Collaborative Filtering (35% weight)
  const getSessionBasedRecommendations = (services: BeautyService[]): RecommendationScore[] => {
    const scores: RecommendationScore[] = []

    services.forEach((service) => {
      let score = 0
      const reasons: string[] = []

      // Users who viewed similar services
      const viewedTypes = userSession.viewedServices
        .map((id) => services.find((s) => s.id === id)?.type)
        .filter(Boolean)

      if (viewedTypes.includes(service.type)) {
        score += 35
        reasons.push("Similar to services you viewed")
      }

      // Price range similarity
      const viewedPrices = userSession.viewedServices
        .map((id) => services.find((s) => s.id === id)?.currentPrice.amount)
        .filter(Boolean)

      if (viewedPrices.length > 0) {
        const avgViewedPrice = viewedPrices.reduce((a, b) => a + b, 0) / viewedPrices.length
        const priceDiff = Math.abs(service.currentPrice.amount - avgViewedPrice)
        if (priceDiff < avgViewedPrice * 0.3) {
          // Within 30% of average viewed price
          score += 20
          reasons.push("In your preferred price range")
        }
      }

      // Search history relevance
      const searchRelevance = userSession.searchHistory.some(
        (term) =>
          service.name.toLowerCase().includes(term.toLowerCase()) ||
          service.description.toLowerCase().includes(term.toLowerCase()) ||
          service.type.toLowerCase().includes(term.toLowerCase()),
      )

      if (searchRelevance) {
        score += 15
        reasons.push("Matches your search interests")
      }

      scores.push({ serviceId: service.id, score, reasons })
    })

    return scores.sort((a, b) => b.score - a.score)
  }

  // 2. Popular/Trending Algorithm (30% weight)
  const getPopularRecommendations = (services: BeautyService[]): RecommendationScore[] => {
    const scores: RecommendationScore[] = []

    services.forEach((service) => {
      let score = 0
      const reasons: string[] = []

      // Trending services
      if (service.isTrending) {
        score += 30
        reasons.push("Trending now")
      }

      // Hot deals
      if (service.isHotDeal) {
        score += 25
        reasons.push("Hot deal")
      }

      // High discount percentage
      const discountPercent =
        ((service.originalPrice.amount - service.currentPrice.amount) / service.originalPrice.amount) * 100
      if (discountPercent > 40) {
        score += 20
        reasons.push(`${Math.round(discountPercent)}% off`)
      }

      // New services
      if (service.isNew || (service.dateAdded && isNewThisWeek(service.dateAdded))) {
        score += 15
        reasons.push("New service")
      }

      // Simulate popularity based on service type frequency
      const typeCount = services.filter((s) => s.type === service.type).length
      if (typeCount > 2) {
        score += 10
        reasons.push("Popular category")
      }

      scores.push({ serviceId: service.id, score, reasons })
    })

    return scores.sort((a, b) => b.score - a.score)
  }

  // 3. Content-Based Similarity (20% weight)
  const getContentBasedRecommendations = (
    services: BeautyService[],
    currentService?: BeautyService,
  ): RecommendationScore[] => {
    const scores: RecommendationScore[] = []

    if (!currentService && userSession.viewedServices.length === 0) {
      return scores
    }

    const referenceService =
      currentService || services.find((s) => s.id === userSession.viewedServices[userSession.viewedServices.length - 1])
    if (!referenceService) return scores

    services.forEach((service) => {
      if (service.id === referenceService.id) return

      let score = 0
      const reasons: string[] = []

      // Same service type
      if (service.type === referenceService.type) {
        score += 20
        reasons.push(`Similar to ${referenceService.name}`)
      }

      // Similar price range (within 25%)
      const priceDiff = Math.abs(service.currentPrice.amount - referenceService.currentPrice.amount)
      const priceThreshold = referenceService.currentPrice.amount * 0.25
      if (priceDiff <= priceThreshold) {
        score += 15
        reasons.push("Similar price range")
      }

      // Similar duration
      if (service.duration === referenceService.duration) {
        score += 10
        reasons.push("Same duration")
      }

      // Description similarity (simple keyword matching)
      const referenceWords = referenceService.description.toLowerCase().split(" ")
      const serviceWords = service.description.toLowerCase().split(" ")
      const commonWords = referenceWords.filter((word) => serviceWords.includes(word) && word.length > 3)
      if (commonWords.length > 2) {
        score += 8
        reasons.push("Similar treatment")
      }

      scores.push({ serviceId: service.id, score, reasons })
    })

    return scores.sort((a, b) => b.score - a.score)
  }

  // 4. Geographic Proximity (10% weight)
  const getLocationBasedRecommendations = (services: BeautyService[]): RecommendationScore[] => {
    const scores: RecommendationScore[] = []

    services.forEach((service) => {
      let score = 0
      const reasons: string[] = []

      // Find vendor for this service
      const vendor = vendors.find((v) => v.services.some((s) => s.id === service.id))
      if (!vendor) return

      // Simulate location scoring based on city priority
      const locationPriority: { [key: string]: number } = {
        Nairobi: 10,
        Mombasa: 8,
        Kisumu: 6,
        Nakuru: 4,
      }

      const city = vendor.location.split(",")[0].trim()
      const locationScore = locationPriority[city] || 2
      score += locationScore

      if (locationScore >= 8) {
        reasons.push("Near major city")
      } else if (locationScore >= 4) {
        reasons.push("Accessible location")
      }

      // Verified vendors get bonus
      if (vendor.verified) {
        score += 3
        reasons.push("Verified vendor")
      }

      scores.push({ serviceId: service.id, score, reasons })
    })

    return scores.sort((a, b) => b.score - a.score)
  }

  // 5. Time-Contextual Recommendations (5% weight)
  const getTimeBasedRecommendations = (services: BeautyService[]): RecommendationScore[] => {
    const scores: RecommendationScore[] = []
    const currentHour = new Date().getHours()
    const currentDay = new Date().getDay() // 0 = Sunday, 6 = Saturday

    services.forEach((service) => {
      let score = 0
      const reasons: string[] = []

      // Morning recommendations (6 AM - 12 PM)
      if (currentHour >= 6 && currentHour < 12) {
        if (service.type === "Facial" || service.type === "Hair") {
          score += 5
          reasons.push("Perfect for morning")
        }
      }

      // Afternoon recommendations (12 PM - 6 PM)
      else if (currentHour >= 12 && currentHour < 18) {
        if (service.type === "Makeup" || service.type === "Nails") {
          score += 5
          reasons.push("Great for afternoon")
        }
      }

      // Evening recommendations (6 PM - 10 PM)
      else if (currentHour >= 18 && currentHour < 22) {
        if (service.type === "Massage") {
          score += 5
          reasons.push("Relaxing for evening")
        }
      }

      // Weekend bonus
      if (currentDay === 0 || currentDay === 6) {
        if (service.duration.includes("90") || service.duration.includes("120")) {
          score += 3
          reasons.push("Perfect for weekend")
        }
      }

      scores.push({ serviceId: service.id, score, reasons })
    })

    return scores.sort((a, b) => b.score - a.score)
  }

  const generateHybridRecommendations = (): BeautyService[] => {
    const allServices = vendors.flatMap((v) => v.services)

    // Get scores from all algorithms
    const sessionScores = getSessionBasedRecommendations(allServices)
    const popularScores = getPopularRecommendations(allServices)
    const contentScores = getContentBasedRecommendations(allServices)
    const locationScores = getLocationBasedRecommendations(allServices)
    const timeScores = getTimeBasedRecommendations(allServices)

    // Combine scores with weights
    const combinedScores: { [serviceId: number]: { score: number; reasons: Set<string> } } = {}

    allServices.forEach((service) => {
      const sessionScore = sessionScores.find((s) => s.serviceId === service.id)?.score || 0
      const popularScore = popularScores.find((s) => s.serviceId === service.id)?.score || 0
      const contentScore = contentScores.find((s) => s.serviceId === service.id)?.score || 0
      const locationScore = locationScores.find((s) => s.serviceId === service.id)?.score || 0
      const timeScore = timeScores.find((s) => s.serviceId === service.id)?.score || 0

      const totalScore =
        sessionScore * 0.35 + popularScore * 0.3 + contentScore * 0.2 + locationScore * 0.1 + timeScore * 0.05

      const allReasons = new Set<string>()
      sessionScores.find((s) => s.serviceId === service.id)?.reasons.forEach((r) => allReasons.add(r))
      popularScores.find((s) => s.serviceId === service.id)?.reasons.forEach((r) => allReasons.add(r))
      contentScores.find((s) => s.serviceId === service.id)?.reasons.forEach((r) => allReasons.add(r))
      locationScores.find((s) => s.serviceId === service.id)?.reasons.forEach((r) => allReasons.add(r))
      timeScores.find((s) => s.serviceId === service.id)?.reasons.forEach((r) => allReasons.add(r))

      combinedScores[service.id] = { score: totalScore, reasons: allReasons }
    })

    // Sort by combined score and return top recommendations
    const sortedServices = allServices
      .filter((service) => !userSession.viewedServices.includes(service.id)) // Exclude already viewed
      .sort((a, b) => (combinedScores[b.id]?.score || 0) - (combinedScores[a.id]?.score || 0))
      .slice(0, 8)

    return sortedServices
  }

  const trackServiceInteraction = (serviceId: number, type: "view" | "click" | "search") => {
    const interaction: ServiceInteraction = {
      serviceId,
      timestamp: Date.now(),
      type,
    }

    setServiceInteractions((prev) => [...prev, interaction])

    if (type === "view" && !userSession.viewedServices.includes(serviceId)) {
      setUserSession((prev) => ({
        ...prev,
        viewedServices: [...prev.viewedServices, serviceId],
      }))
    } else if (type === "click" && !userSession.clickedServices.includes(serviceId)) {
      setUserSession((prev) => ({
        ...prev,
        clickedServices: [...prev.clickedServices, serviceId],
      }))
    }

    // Update recommendations after interaction
    setTimeout(() => {
      const newRecommendations = generateHybridRecommendations()
      setRecommendations(newRecommendations)
    }, 100)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)

    if (value.length > 2 && !userSession.searchHistory.includes(value.toLowerCase())) {
      setUserSession((prev) => ({
        ...prev,
        searchHistory: [...prev.searchHistory, value.toLowerCase()].slice(-10), // Keep last 10 searches
      }))
    }
  }

  useEffect(() => {
    // Generate initial recommendations
    const initialRecommendations = generateHybridRecommendations()
    setRecommendations(initialRecommendations)

    // Set popular services
    const allServices = vendors.flatMap((v) => v.services)
    const popularScores = getPopularRecommendations(allServices)
    const topPopular = popularScores
      .slice(0, 6)
      .map((score) => allServices.find((s) => s.id === score.serviceId)!)
      .filter(Boolean)
    setPopularServices(topPopular)

    // Set location-based services
    const locationScores = getLocationBasedRecommendations(allServices)
    const topNearby = locationScores
      .slice(0, 4)
      .map((score) => allServices.find((s) => s.id === score.serviceId)!)
      .filter(Boolean)
    setNearbyServices(topNearby)

    // Set time-based services
    const timeScores = getTimeBasedRecommendations(allServices)
    const topTimeBased = timeScores
      .slice(0, 4)
      .map((score) => allServices.find((s) => s.id === score.serviceId)!)
      .filter(Boolean)
    setTimeBasedServices(topTimeBased)

    // Request location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserSession((prev) => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }))
        },
        (error) => {
          console.log("[v0] Location permission denied or unavailable")
        },
      )
    }
  }, [])

  return (
    <div className="bg-gradient-to-br from-pink-400 to-purple-600 min-h-screen">
      {/* IMPROVEMENT: Added a max-width container with responsive padding */}
      <div className="container mx-auto px-4 py-8 max-w-[1920px]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 text-white italic animate-pulse">
          Luxury for Less – Pamper Yourself with Exclusive Beauty & Spa Discounts!
        </h1>
        <CountdownTimer targetDate="2025-05-25T23:59:59" startDate="2025-02-13T00:00:00" />
        <NewProductsForYou allProducts={beautyProducts} colorScheme="purple" maxProducts={4} />
        <HotTimeDeals
          deals={hotBeautyDeals}
          colorScheme="purple"
          title="Limited-Time Beauty Offers"
          subtitle="Exclusive spa and beauty treatments at special prices!"
        />

        <div className="mb-8 max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search beauty services, spas, or treatments..."
              className="w-full p-4 pr-12 rounded-full border border-pink-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white bg-opacity-80 text-purple-800 placeholder-purple-400"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400" />
          </div>
        </div>

        {recommendations.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <Sparkles className="h-6 w-6 text-yellow-300 mr-2" />
              <h2 className="text-2xl font-bold text-white">Recommended For You</h2>
              <Sparkles className="h-6 w-6 text-yellow-300 ml-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {recommendations.slice(0, 4).map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  onViewportEnter={() => trackServiceInteraction(service.id, "view")}
                >
                  <RecommendedServiceCard
                    service={service}
                    onInteraction={(type) => trackServiceInteraction(service.id, type)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {popularServices.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-orange-300 mr-2" />
              <h2 className="text-2xl font-bold text-white">Trending Now</h2>
              <TrendingUp className="h-6 w-6 text-orange-300 ml-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {popularServices.slice(0, 6).map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  onViewportEnter={() => trackServiceInteraction(service.id, "view")}
                >
                  <TrendingServiceCard
                    service={service}
                    onInteraction={(type) => trackServiceInteraction(service.id, type)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {nearbyServices.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center mb-6">
              <MapPin className="h-6 w-6 text-green-300 mr-2" />
              <h2 className="text-2xl font-bold text-white">Near You</h2>
              <MapPin className="h-6 w-6 text-green-300 ml-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {nearbyServices.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  onViewportEnter={() => trackServiceInteraction(service.id, "view")}
                >
                  <NearbyServiceCard
                    service={service}
                    onInteraction={(type) => trackServiceInteraction(service.id, type)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {timeBasedServices.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <Clock className="h-6 w-6 text-blue-300 mr-2" />
              <h2 className="text-2xl font-bold text-white">Perfect for Right Now</h2>
              <Clock className="h-6 w-6 text-blue-300 ml-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {timeBasedServices.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  onViewportEnter={() => trackServiceInteraction(service.id, "view")}
                >
                  <TimeBasedServiceCard
                    service={service}
                    onInteraction={(type) => trackServiceInteraction(service.id, type)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="flex justify-center my-8">
          <Link href="/beauty-and-massage/shop">
            <Button
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
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
                <ShoppingBag className="mr-2 h-5 w-5" />
                Open our Beauty Shop Products
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

        <AnimatePresence mode="popLayout">
          {visibleServiceTypes.map((type) => (
            <motion.div
              key={type}
              className="mb-12"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">{type}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredVendors
                    .filter((vendor) => vendor.services.some((service) => service.type === type))
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
                        <VendorCard
                          vendor={vendor}
                          serviceType={type}
                          onServiceInteraction={trackServiceInteraction}
                          setSelectedVendor={setSelectedVendor}
                          setShowContactModal={setShowContactModal}
                        />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add this at the bottom to trigger loading more content */}
        {visibleServiceTypes.length < serviceTypes.length && (
          <div id="load-more-trigger" className="h-20 flex items-center justify-center">
            <div className="animate-pulse text-white opacity-80 font-semibold">Scroll for more beauty services...</div>
          </div>
        )}

        {/* Keep the original mapping for backward compatibility */}
        {serviceTypes.map((type) => (
          <div key={type} className="mb-12 hidden">
            <h2 className="text-2xl font-bold text-white mb-6 animate-bounce">{type}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredVendors
                .filter((vendor) => vendor.services.some((service) => service.type === type))
                .map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    serviceType={type}
                    setSelectedVendor={setSelectedVendor}
                    setShowContactModal={setShowContactModal}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {newServiceAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-white bg-opacity-90 rounded-lg shadow-lg p-4 max-w-sm"
          >
            <button
              onClick={() => setNewServiceAlert(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-2 text-purple-600">New Beauty Service Alert!</h3>
            <p className="text-gray-600 mb-2">{newServiceAlert.name} is now available!</p>
            <p className="text-pink-600 font-bold">Only {formatPrice(newServiceAlert.currentPrice)}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Added contact modal component */}
      <ContactModal vendor={selectedVendor} isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
    </div>
  )
}

const ContactModal = ({ vendor, isOpen, onClose }: { vendor: Vendor | null; isOpen: boolean; onClose: () => void }) => {
  if (!vendor || !isOpen) return null

  const contacts = vendorContacts[vendor.name as keyof typeof vendorContacts] || vendorContacts["Serenity Spa & Beauty"]

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in booking a service at ${vendor.name}. Could you please provide more information?`,
    )
    window.open(`https://wa.me/${contacts.whatsapp.replace("+", "")}?text=${message}`, "_blank")
  }

  const handlePhone = () => {
    window.open(`tel:${contacts.phone}`, "_self")
  }

  const handleEmail = () => {
    const subject = encodeURIComponent(`Service Inquiry - ${vendor.name}`)
    const body = encodeURIComponent(
      `Hello,\n\nI'm interested in booking a service at ${vendor.name}. Please provide more details about availability and pricing.\n\nThank you!`,
    )
    window.open(`mailto:${contacts.email}?subject=${subject}&body=${body}`, "_self")
  }

  const handleWebsite = () => {
    window.open(contacts.website, "_blank")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-purple-800">Contact {vendor.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            <span className="font-semibold">WhatsApp</span>
          </button>

          <button
            onClick={handlePhone}
            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="font-semibold">Call Now</span>
          </button>

          <button
            onClick={handleWebsite}
            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"
              />
            </svg>
            <span className="font-semibold">Visit Website</span>
          </button>

          <button
            onClick={handleEmail}
            className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="font-semibold">Send Email</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function VendorCard({
  vendor,
  serviceType,
  onServiceInteraction,
  setSelectedVendor,
  setShowContactModal,
}: {
  vendor: Vendor
  serviceType: string
  onServiceInteraction: (serviceId: number, type: "view" | "click" | "search") => void
  setSelectedVendor: (vendor: Vendor | null) => void
  setShowContactModal: (show: boolean) => void
}) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="bg-white bg-opacity-80 rounded-lg shadow-md overflow-hidden backdrop-filter backdrop-blur-lg flex flex-col h-full">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center">
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
                <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-purple-800">{vendor.name}</h3>
              <p className="text-pink-600">{vendor.location}</p>
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <a
              href={vendor.redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-pink-600 hover:to-purple-600 transition duration-300 transform hover:scale-105 whitespace-nowrap"
            >
              Visit Website
            </a>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition duration-300 transform hover:scale-105 whitespace-nowrap"
              onClick={() => {
                setSelectedVendor(vendor)
                setShowContactModal(true)
              }}
            >
              Contact Vendor
            </Button>
          </div>
        </div>
        <p className="text-gray-700 mb-4 line-clamp-2 md:line-clamp-none">{vendor.description}</p>
        <a
          href={vendor.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
        >
          <MapPin size={16} className="mr-1" />
          Find on Maps
        </a>
      </div>
      <div className="bg-purple-100 bg-opacity-60 p-4 sm:p-6 flex-grow">
        <h4 className="text-lg font-semibold mb-4 text-purple-800">Featured Beauty Services</h4>
        <div className="grid grid-cols-1 gap-4 h-full">
          {vendor.services
            .filter((service) => service.type === serviceType)
            .map((service) => (
              <BeautyServiceCard key={service.id} service={service} onInteraction={onServiceInteraction} />
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

function BeautyServiceCard({
  service,
  onInteraction,
}: {
  service: BeautyService
  onInteraction?: (serviceId: number, type: "view" | "click" | "search") => void
}) {
  const [imageError, setImageError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const savings: Price = {
    amount: service.originalPrice.amount - service.currentPrice.amount,
    currency: service.currentPrice.currency,
  }

  const mockVendor = {
    id: 1,
    name: "Luxury Spa & Beauty Center",
    location: "Nairobi, Kenya",
    logo: "/images/spa-logo.png",
    description: "Premium beauty and wellness services with experienced professionals",
    redirectUrl: "https://example.com",
    mapLink: "https://maps.google.com",
    verified: true,
    whatsappNumber: "+254700123456",
    businessHours: "Mon-Sat: 8AM-8PM, Sun: 10AM-6PM",
    rating: 4.8,
    totalReviews: 156,
    specialties: ["Massage Therapy", "Facial Treatments", "Hair Styling"],
  }

  const handleClick = (type: "view" | "click") => {
    if (onInteraction) {
      onInteraction(service.id, type)
    }
  }

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full"
        onMouseEnter={() => handleClick("view")}
      >
        <div className="relative w-full pt-[60%]">
          <Image
            src={imageError ? "/images/service-placeholder.png" : service.imageUrl}
            alt={service.name}
            layout="fill"
            objectFit="cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={80}
            onError={() => setImageError(true)}
          />
          {service.isNew && (
            <div className="absolute top-2 right-2 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
              NEW
            </div>
          )}
          {service.isTrending && <TrendingBadge />}

          {service.dateAdded && isNewThisWeek(service.dateAdded) && (
            <div className="absolute bottom-2 left-2">
              <NewThisWeekBadge />
            </div>
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h5 className="font-semibold mb-2 text-purple-800 truncate">{service.name}</h5>
          <p className="text-sm text-gray-600 mb-2 line-clamp-3 md:line-clamp-2 xl:line-clamp-none flex-grow">
            {service.description}
          </p>

          <div className="flex flex-col mb-2">
            <span className="text-lg font-bold text-pink-600 break-words">{formatPrice(service.currentPrice)}</span>
            <span className="text-sm text-gray-500 line-through break-words">{formatPrice(service.originalPrice)}</span>
          </div>

          <div className="text-sm text-gray-600 mb-2">
            <div className="flex items-center">
              <Clock size={16} className="mr-1 text-purple-500 flex-shrink-0" />
              <span className="truncate">{service.duration}</span>
            </div>
          </div>

          <div className="mt-auto space-y-2">
            <motion.button
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-2 rounded-full min-w-0"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              animate={{ rotateZ: [0, 5, 0, -5, 0] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              onClick={() => handleClick("click")}
            >
              Save {formatPrice(savings)}
            </motion.button>
            <motion.button
              className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-full min-w-0"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsModalOpen(true)
                handleClick("click")
              }}
            >
              Book Now
            </motion.button>
          </div>
        </div>
      </div>

      <ProductModal
        product={service}
        vendor={mockVendor}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        colorScheme="purple"
      />
    </>
  )
}

function RecommendedServiceCard({
  service,
  onInteraction,
}: {
  service: BeautyService
  onInteraction: (type: "view" | "click") => void
}) {
  const [imageError, setImageError] = useState(false)

  const savings: Price = {
    amount: service.originalPrice.amount - service.currentPrice.amount,
    currency: service.currentPrice.currency,
  }

  return (
    <div
      className="bg-gradient-to-br from-yellow-100 to-pink-100 rounded-lg shadow-lg overflow-hidden border-2 border-yellow-300"
      onMouseEnter={() => onInteraction("view")}
    >
      <div className="relative">
        <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
          <Sparkles className="h-3 w-3 mr-1" />
          FOR YOU
        </div>
        <div className="relative w-full pt-[60%]">
          <Image
            src={imageError ? "/images/service-placeholder.png" : service.imageUrl}
            alt={service.name}
            layout="fill"
            objectFit="cover"
            onError={() => setImageError(true)}
          />
        </div>
      </div>
      <div className="p-4">
        <h5 className="font-bold mb-2 text-purple-800">{service.name}</h5>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold text-pink-600">{formatPrice(service.currentPrice)}</span>
          <span className="text-sm text-gray-500 line-through">{formatPrice(service.originalPrice)}</span>
        </div>
        <button
          onClick={() => onInteraction("click")}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 font-semibold"
        >
          Save {formatPrice(savings)}
        </button>
      </div>
    </div>
  )
}

function TrendingServiceCard({
  service,
  onInteraction,
}: {
  service: BeautyService
  onInteraction: (type: "view" | "click") => void
}) {
  const [imageError, setImageError] = useState(false)

  return (
    <div
      className="bg-gradient-to-br from-orange-100 to-red-100 rounded-lg shadow-lg overflow-hidden border-2 border-orange-300"
      onMouseEnter={() => onInteraction("view")}
    >
      <div className="relative">
        <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center animate-pulse">
          <TrendingUp className="h-3 w-3 mr-1" />
          TRENDING
        </div>
        <div className="relative w-full pt-[60%]">
          <Image
            src={imageError ? "/images/service-placeholder.png" : service.imageUrl}
            alt={service.name}
            layout="fill"
            objectFit="cover"
            onError={() => setImageError(true)}
          />
        </div>
      </div>
      <div className="p-4">
        <h5 className="font-bold mb-2 text-purple-800">{service.name}</h5>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold text-pink-600">{formatPrice(service.currentPrice)}</span>
          <div className="flex items-center text-orange-600">
            <Star className="h-4 w-4 fill-current mr-1" />
            <span className="text-sm font-semibold">Popular</span>
          </div>
        </div>
        <button
          onClick={() => onInteraction("click")}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold"
        >
          Book Trending Service
        </button>
      </div>
    </div>
  )
}

function NearbyServiceCard({
  service,
  onInteraction,
}: {
  service: BeautyService
  onInteraction: (type: "view" | "click") => void
}) {
  const [imageError, setImageError] = useState(false)

  return (
    <div
      className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg shadow-lg overflow-hidden border-2 border-green-300"
      onMouseEnter={() => onInteraction("view")}
    >
      <div className="relative">
        <div className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          NEARBY
        </div>
        <div className="relative w-full pt-[60%]">
          <Image
            src={imageError ? "/images/service-placeholder.png" : service.imageUrl}
            alt={service.name}
            layout="fill"
            objectFit="cover"
            onError={() => setImageError(true)}
          />
        </div>
      </div>
      <div className="p-4">
        <h5 className="font-bold mb-2 text-purple-800">{service.name}</h5>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold text-pink-600">{formatPrice(service.currentPrice)}</span>
          <div className="flex items-center text-green-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm font-semibold">Close</span>
          </div>
        </div>
        <button
          onClick={() => onInteraction("click")}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full hover:from-green-600 hover:to-blue-600 transition-all duration-300 font-semibold"
        >
          Visit Nearby
        </button>
      </div>
    </div>
  )
}

function TimeBasedServiceCard({
  service,
  onInteraction,
}: {
  service: BeautyService
  onInteraction: (type: "view" | "click") => void
}) {
  const [imageError, setImageError] = useState(false)
  const currentHour = new Date().getHours()

  const getTimeMessage = () => {
    if (currentHour >= 6 && currentHour < 12) return "Perfect Morning Choice"
    if (currentHour >= 12 && currentHour < 18) return "Great for Afternoon"
    if (currentHour >= 18 && currentHour < 22) return "Evening Relaxation"
    return "Perfect Timing"
  }

  return (
    <div
      className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg shadow-lg overflow-hidden border-2 border-blue-300"
      onMouseEnter={() => onInteraction("view")}
    >
      <div className="relative">
        <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          RIGHT NOW
        </div>
        <div className="relative w-full pt-[60%]">
          <Image
            src={imageError ? "/images/service-placeholder.png" : service.imageUrl}
            alt={service.name}
            layout="fill"
            objectFit="cover"
            onError={() => setImageError(true)}
          />
        </div>
      </div>
      <div className="p-4">
        <h5 className="font-bold mb-2 text-purple-800">{service.name}</h5>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold text-pink-600">{formatPrice(service.currentPrice)}</span>
          <div className="flex items-center text-blue-600">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-xs font-semibold">{getTimeMessage()}</span>
          </div>
        </div>
        <button
          onClick={() => onInteraction("click")}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-semibold"
        >
          Book Now
        </button>
      </div>
    </div>
  )
}
