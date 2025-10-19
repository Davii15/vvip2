"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  TrendingUp,
  Star,
  MapPin,
  Clock,
  Users,
  MessageCircle,
  CalendarIcon,
  Shield,
  Award,
  TelescopeIcon as Binoculars,
  CameraOffIcon,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import CountdownTimer from "@/components/CountdownTimer"
import HotTimeDeals from "@/components/HotTimeDeals"
import { transformTourismToProducts } from "@/utils/product-transformers"

interface Vendor {
  id: number
  name: string
  location: string
  logo: string
  description: string
  verified: boolean
  rating: number
  totalReviews: number
  whatsappNumber: string
  businessHours: string
  specialties: string[]
  adventures: Adventure[]
}

interface Adventure {
  id: number
  name: string
  description: string
  currentPrice: { amount: number; currency: string }
  originalPrice: { amount: number; currency: string }
  duration: string
  groupSize: string
  imageUrl: string
  category: string
  difficulty: string
  highlights: string[]
  isHotDeal?: boolean
  hotDealEnds?: string
}

interface AdventureModalData extends Adventure {
  vendor: Vendor
  gallery: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: { day: number; title: string; description: string }[]
  reviews: { id: number; name: string; rating: number; comment: string; date: string }[]
}

const mockVendors: Vendor[] = [
  {
    id: 1,
    name: "Safari Adventures Kenya",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=80&width=80",
    description: "Premier safari experiences across Kenya's most spectacular national parks and reserves.",
    verified: true,
    rating: 4.8,
    totalReviews: 324,
    whatsappNumber: "+254712345678",
    businessHours: "8:00 AM - 6:00 PM",
    specialties: ["Big Five Safari", "Cultural Tours", "Photography Tours"],
    adventures: [
      {
        id: 1,
        name: "Maasai Mara Big Five Safari",
        description:
          "Experience the ultimate African safari adventure in the world-famous Maasai Mara National Reserve.",
        currentPrice: { amount: 85000, currency: "KSH" },
        originalPrice: { amount: 120000, currency: "KSH" },
        duration: "3 Days, 2 Nights",
        groupSize: "2-8 people",
        imageUrl: "/placeholder.svg?height=300&width=400",
        category: "Wildlife Safari",
        difficulty: "Easy",
        highlights: ["Big Five sightings", "Maasai cultural visit", "Hot air balloon ride", "Professional guide"],
        isHotDeal: true,
        hotDealEnds: "2024-12-31T23:59:59Z",
      },
      {
        id: 2,
        name: "Amboseli Elephant Safari",
        description: "Get up close with majestic elephants against the backdrop of Mount Kilimanjaro.",
        currentPrice: { amount: 65000, currency: "KSH" },
        originalPrice: { amount: 85000, currency: "KSH" },
        duration: "2 Days, 1 Night",
        groupSize: "2-6 people",
        imageUrl: "/placeholder.svg?height=300&width=400",
        category: "Wildlife Safari",
        difficulty: "Easy",
        highlights: ["Elephant herds", "Mount Kilimanjaro views", "Bird watching", "Maasai culture"],
        isHotDeal: true,
        hotDealEnds: "2024-12-25T23:59:59Z",
      },
    ],
  },
  {
    id: 2,
    name: "Mountain Peak Adventures",
    location: "Nanyuki, Kenya",
    logo: "/placeholder.svg?height=80&width=80",
    description: "Expert-guided mountain climbing and hiking expeditions across East Africa's highest peaks.",
    verified: true,
    rating: 4.9,
    totalReviews: 187,
    whatsappNumber: "+254723456789",
    businessHours: "6:00 AM - 8:00 PM",
    specialties: ["Mount Kenya", "Kilimanjaro", "Technical Climbing"],
    adventures: [
      {
        id: 3,
        name: "Mount Kenya Summit Expedition",
        description: "Conquer Africa's second-highest peak with our experienced mountain guides.",
        currentPrice: { amount: 95000, currency: "KSH" },
        originalPrice: { amount: 130000, currency: "KSH" },
        duration: "5 Days, 4 Nights",
        groupSize: "2-6 people",
        imageUrl: "/placeholder.svg?height=300&width=400",
        category: "Mountain Climbing",
        difficulty: "Challenging",
        highlights: ["Point Lenana summit", "Alpine scenery", "Rock climbing", "Mountain huts"],
        isHotDeal: true,
        hotDealEnds: "2024-12-20T23:59:59Z",
      },
      {
        id: 4,
        name: "Aberdare Ranges Hiking",
        description: "Explore the mystical Aberdare mountain ranges with waterfalls and wildlife.",
        currentPrice: { amount: 35000, currency: "KSH" },
        originalPrice: { amount: 45000, currency: "KSH" },
        duration: "2 Days, 1 Night",
        groupSize: "4-10 people",
        imageUrl: "/placeholder.svg?height=300&width=400",
        category: "Hiking",
        difficulty: "Moderate",
        highlights: ["Karuru Falls", "Wildlife spotting", "Forest trails", "Mountain views"],
      },
    ],
  },
  {
    id: 3,
    name: "Coastal Paradise Resorts",
    location: "Diani Beach, Kenya",
    logo: "/placeholder.svg?height=80&width=80",
    description: "Luxury beach experiences along Kenya's pristine Indian Ocean coastline.",
    verified: true,
    rating: 4.7,
    totalReviews: 412,
    whatsappNumber: "+254734567890",
    businessHours: "24/7",
    specialties: ["Beach Holidays", "Water Sports", "Cultural Tours"],
    adventures: [
      {
        id: 5,
        name: "Diani Beach Paradise Getaway",
        description: "Relax on pristine white sand beaches with crystal clear waters and luxury amenities.",
        currentPrice: { amount: 55000, currency: "KSH" },
        originalPrice: { amount: 75000, currency: "KSH" },
        duration: "3 Days, 2 Nights",
        groupSize: "2-4 people",
        imageUrl: "/placeholder.svg?height=300&width=400",
        category: "Beach Holiday",
        difficulty: "Easy",
        highlights: ["White sand beaches", "Snorkeling", "Sunset dhow cruise", "Spa treatments"],
        isHotDeal: true,
        hotDealEnds: "2024-12-28T23:59:59Z",
      },
      {
        id: 6,
        name: "Watamu Marine Safari",
        description: "Discover the underwater wonders of Watamu Marine National Park.",
        currentPrice: { amount: 42000, currency: "KSH" },
        originalPrice: { amount: 55000, currency: "KSH" },
        duration: "2 Days, 1 Night",
        groupSize: "2-8 people",
        imageUrl: "/placeholder.svg?height=300&width=400",
        category: "Marine Safari",
        difficulty: "Easy",
        highlights: ["Coral reef diving", "Dolphin watching", "Glass-bottom boat", "Marine life"],
      },
    ],
  },
]

const TourismAndAdventuresPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [displayedVendors, setDisplayedVendors] = useState<Vendor[]>([])
  const [visibleCount, setVisibleCount] = useState(2)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<HTMLDivElement>(null)

  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors)
  const [selectedAdventure, setSelectedAdventure] = useState<AdventureModalData | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<{ [key: string]: string[] }>({})
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [likedAdventures, setLikedAdventures] = useState<Set<number>>(new Set())
  const [isHovered, setIsHovered] = useState(false)
  const tourismProducts = transformTourismToProducts(mockVendors)

  const performSearch = useCallback((term: string) => {
    if (!term.trim()) {
      setFilteredVendors(mockVendors)
      return
    }

    const searchLower = term.toLowerCase()
    const filtered = mockVendors.filter((vendor) => {
      // Search vendor details
      const vendorMatch =
        vendor.name.toLowerCase().includes(searchLower) ||
        vendor.location.toLowerCase().includes(searchLower) ||
        vendor.description.toLowerCase().includes(searchLower) ||
        vendor.specialties.some((specialty) => specialty.toLowerCase().includes(searchLower))

      // Search adventures
      const adventureMatch = vendor.adventures.some(
        (adventure) =>
          adventure.name.toLowerCase().includes(searchLower) ||
          adventure.description.toLowerCase().includes(searchLower) ||
          adventure.category.toLowerCase().includes(searchLower) ||
          adventure.difficulty.toLowerCase().includes(searchLower) ||
          adventure.currentPrice.amount.toString().includes(searchLower) ||
          adventure.originalPrice.amount.toString().includes(searchLower) ||
          adventure.duration.toLowerCase().includes(searchLower) ||
          adventure.groupSize.toLowerCase().includes(searchLower) ||
          adventure.highlights.some((highlight) => highlight.toLowerCase().includes(searchLower)),
      )

      return vendorMatch || adventureMatch
    })

    setFilteredVendors(filtered)
  }, [])

  const loadMoreVendors = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      const nextCount = Math.min(visibleCount + 2, filteredVendors.length)
      setDisplayedVendors(filteredVendors.slice(0, nextCount))
      setVisibleCount(nextCount)
      setHasMore(nextCount < filteredVendors.length)
      setIsLoading(false)
    }, 800)
  }, [filteredVendors, visibleCount, isLoading, hasMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreVendors()
        }
      },
      { threshold: 0.1 },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [loadMoreVendors, hasMore, isLoading])

  useEffect(() => {
    const initialCount = Math.min(2, filteredVendors.length)
    setDisplayedVendors(filteredVendors.slice(0, initialCount))
    setVisibleCount(initialCount)
    setHasMore(filteredVendors.length > initialCount)
  }, [filteredVendors])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchTerm)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, performSearch])

  const handleAdventureClick = (adventure: Adventure, vendor: Vendor) => {
    const modalData: AdventureModalData = {
      ...adventure,
      vendor,
      gallery: [adventure.imageUrl, "/safari-gallery-1.png", "/safari-gallery-2.png", "/safari-gallery-3.png"],
      inclusions: [
        "Professional safari guide",
        "Transportation in 4WD vehicle",
        "Park entrance fees",
        "Lunch and refreshments",
        "Binoculars and field guides",
        "First aid kit",
      ],
      exclusions: [
        "Personal expenses",
        "Tips for guide",
        "Travel insurance",
        "Accommodation (unless specified)",
        "International flights",
      ],
      itinerary: [
        {
          day: 1,
          title: "Early Morning Departure",
          description: "Pick up from hotel and drive to the park. Game drive begins immediately upon arrival.",
        },
        {
          day: 2,
          title: "Full Day Game Drive",
          description: "Explore different sections of the park. Picnic lunch in the wilderness.",
        },
        {
          day: 3,
          title: "Cultural Experience & Return",
          description: "Visit local communities, learn about traditions, and return to Nairobi.",
        },
      ],
      reviews: [
        {
          id: 1,
          name: "Sarah Johnson",
          rating: 5,
          comment: "Amazing experience! Saw the Big Five and the guide was incredibly knowledgeable!",
          date: "2024-01-15",
        },
        {
          id: 2,
          name: "Mike Chen",
          rating: 4,
          comment: "Great guide and beautiful scenery. Would definitely recommend!",
          date: "2024-01-10",
        },
        {
          id: 3,
          name: "Emma Wilson",
          rating: 5,
          comment: "Unforgettable adventure, highly recommended! The wildlife was spectacular.",
          date: "2024-01-05",
        },
      ],
    }
    setSelectedAdventure(modalData)
  }

  const openWhatsApp = (phoneNumber: string, adventureName: string, vendorName: string) => {
    const message = `Hi! I'm interested in booking the "${adventureName}" adventure with ${vendorName}. Could you please provide more details?`
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const addEvent = (date: Date, eventText: string) => {
    const dateKey = date.toISOString().split("T")[0]
    setEvents((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), eventText],
    }))
  }

  const getEventsForDate = (date: Date) => {
    const dateKey = date.toISOString().split("T")[0]
    return events[dateKey] || []
  }

  const toggleLike = (adventureId: number) => {
    setLikedAdventures((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(adventureId)) {
        newSet.delete(adventureId)
      } else {
        newSet.add(adventureId)
      }
      return newSet
    })
  }

  const TrendingBadge = () => (
    <div className="absolute top-2 left-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center z-10">
      <TrendingUp className="h-3 w-3 mr-1" />
      TRENDING
    </div>
  )

  const MostPreferredBadge = () => (
    <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center z-10">
      <Star className="h-3 w-3 mr-1" />
      PREFERRED
    </div>
  )

  const hotTourismDeals = tourismProducts
    .filter((product) => {
      const discountPercentage =
        product.originalPrice.amount > 0
          ? ((product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount) * 100
          : 0

      return product.isHotDeal || discountPercentage > 25
    })
    .map((product) => {
      const discountPercentage =
        product.originalPrice.amount > 0
          ? Math.round(
              ((product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount) * 100,
            )
          : 0

      return {
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        currentPrice: product.currentPrice,
        originalPrice: product.originalPrice,
        category: product.category,
        expiresAt: product.hotDealEnds || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: product.description,
        discount: discountPercentage,
      }
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-teal-200/30 to-emerald-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-xl"></div>
      </div>

      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 text-white py-16 relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Tourism & Adventures
          </motion.h1>
          <motion.p
            className="text-xl mb-8 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover the World's breathtaking landscapes and wildlife
          </motion.p>

          <motion.div
            className="max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search adventures, locations, vendors, or activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg focus:ring-2 focus:ring-white/50 text-gray-800 placeholder:text-gray-500"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </Button>
              )}
            </div>
            {searchTerm && (
              <motion.p className="text-sm mt-2 opacity-80" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {filteredVendors.length} result{filteredVendors.length !== 1 ? "s" : ""} found for "{searchTerm}"
              </motion.p>
            )}
          </motion.div>

          <CountdownTimer targetDate="2025-12-31T23:59:59" startDate="2025-02-13T00:00:00" />
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setShowCalendar(true)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Plan Your Adventure
            </Button>
          </div>
        </div>
      </div>

      <HotTimeDeals
        deals={hotTourismDeals}
        colorScheme="green"
        title="Adventure Flash Deals"
        subtitle="Limited-time offers on exciting adventures!"
      />

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

      <div className="container mx-auto px-4 py-8">
        {searchTerm && (
          <motion.div
            className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-emerald-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-emerald-800">
                  Showing {displayedVendors.length} of {filteredVendors.length} results
                </span>
              </div>
              {filteredVendors.length === 0 && <span className="text-gray-600">Try adjusting your search terms</span>}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedVendors.map((vendor, vendorIndex) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: vendorIndex * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  {/* ... existing card content ... */}
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={vendor.logo || "/placeholder.svg"}
                          alt={vendor.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <CardTitle className="text-lg text-emerald-800">{vendor.name}</CardTitle>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-3 w-3 mr-1" />
                            {vendor.location}
                          </div>
                        </div>
                      </div>
                      {vendor.verified && (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-500 fill-current" />
                        <span className="ml-1 text-sm font-medium">{vendor.rating}</span>
                        <span className="ml-1 text-sm text-gray-500">({vendor.totalReviews} reviews)</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openWhatsApp(vendor.whatsappNumber, "General Inquiry", vendor.name)}
                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">{vendor.description}</p>

                    <div className="flex flex-wrap gap-1">
                      {vendor.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {vendor.adventures.map((adventure, adventureIndex) => (
                        <div key={adventure.id} className="relative group">
                          {vendorIndex === 0 && adventureIndex === 0 && <TrendingBadge />}
                          {vendorIndex === 1 && adventureIndex === 0 && <MostPreferredBadge />}

                          <div className="relative overflow-hidden rounded-lg">
                            <img
                              src={adventure.imageUrl || "/placeholder.svg"}
                              alt={adventure.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            <div className="absolute top-2 right-2 flex gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 text-white"
                                onClick={() => toggleLike(adventure.id)}
                              >
                                <Heart
                                  className={`h-3 w-3 ${likedAdventures.has(adventure.id) ? "fill-red-500 text-red-500" : ""}`}
                                />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 text-white"
                              >
                                <Share2 className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <h3 className="font-bold text-lg mb-1">{adventure.name}</h3>
                              <p className="text-sm opacity-90 mb-2">{adventure.description}</p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-xs">
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {adventure.duration}
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    {adventure.groupSize}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold">
                                    {adventure.currentPrice.amount} {adventure.currentPrice.currency}
                                  </div>
                                  <div className="text-xs opacity-75">per person</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <Button
                              onClick={() => handleAdventureClick(adventure, vendor)}
                              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                            >
                              View Details
                            </Button>
                            <Button
                              onClick={() => openWhatsApp(vendor.whatsappNumber, adventure.name, vendor.name)}
                              variant="outline"
                              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Book Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {hasMore && (
          <div ref={observerRef} className="flex justify-center py-8">
            {isLoading ? (
              <div className="flex items-center gap-2 text-emerald-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading more adventures...</span>
              </div>
            ) : (
              <Button
                onClick={loadMoreVendors}
                variant="outline"
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent"
              >
                Load More Adventures
              </Button>
            )}
          </div>
        )}

        {!hasMore && displayedVendors.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">You've seen all available adventures!</p>
          </div>
        )}

        {filteredVendors.length === 0 && searchTerm && (
          <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No adventures found</h3>
              <p className="text-gray-500 mb-4">
                We couldn't find any adventures matching "{searchTerm}". Try different keywords or browse all
                adventures.
              </p>
              <Button onClick={() => setSearchTerm("")} className="bg-emerald-600 hover:bg-emerald-700">
                Clear Search
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {selectedAdventure && (
        <Dialog open={!!selectedAdventure} onOpenChange={() => setSelectedAdventure(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl text-emerald-800">{selectedAdventure.name}</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="vendor">Vendor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={selectedAdventure.imageUrl || "/placeholder.svg"}
                      alt={selectedAdventure.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Adventure Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <p className="font-medium">{selectedAdventure.duration}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Group Size:</span>
                          <p className="font-medium">{selectedAdventure.groupSize}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Difficulty:</span>
                          <p className="font-medium">{selectedAdventure.difficulty}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <p className="font-bold text-emerald-600 text-lg">
                            {selectedAdventure.currentPrice.amount} {selectedAdventure.currentPrice.currency}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Highlights</h4>
                      <ul className="space-y-1">
                        {selectedAdventure.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <Star className="h-3 w-3 text-amber-500 mr-2 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-emerald-800">What's Included</h4>
                    <ul className="space-y-2">
                      {selectedAdventure.inclusions.map((item, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-orange-800">What's Not Included</h4>
                    <ul className="space-y-2">
                      {selectedAdventure.exclusions.map((item, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-emerald-800">Itinerary</h4>
                  <div className="space-y-3">
                    {selectedAdventure.itinerary.map((day, index) => (
                      <div key={index} className="border-l-2 border-emerald-200 pl-4">
                        <h5 className="font-medium">
                          Day {day.day}: {day.title}
                        </h5>
                        <p className="text-sm text-gray-600">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() =>
                      openWhatsApp(
                        selectedAdventure.vendor.whatsappNumber,
                        selectedAdventure.name,
                        selectedAdventure.vendor.name,
                      )
                    }
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Book via WhatsApp
                  </Button>
                  <Button
                    onClick={() => {
                      if (selectedDate) {
                        addEvent(selectedDate, `${selectedAdventure.name} - ${selectedAdventure.vendor.name}`)
                        setShowCalendar(true)
                      }
                    }}
                    variant="outline"
                    className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="gallery">
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={selectedAdventure.gallery[currentImageIndex] || "/placeholder.svg"}
                      alt={`Gallery ${currentImageIndex + 1}`}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={() =>
                        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : selectedAdventure.gallery.length - 1))
                      }
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={() =>
                        setCurrentImageIndex((prev) => (prev < selectedAdventure.gallery.length - 1 ? prev + 1 : 0))
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedAdventure.gallery.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className={`h-20 object-cover rounded cursor-pointer ${
                          currentImageIndex === index ? "ring-2 ring-emerald-500" : ""
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vendor" className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedAdventure.vendor.logo || "/placeholder.svg"}
                    alt={selectedAdventure.vendor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-emerald-800">{selectedAdventure.vendor.name}</h3>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedAdventure.vendor.location}
                    </div>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-amber-500 fill-current" />
                      <span className="ml-1 font-medium">{selectedAdventure.vendor.rating}</span>
                      <span className="ml-1 text-gray-500">({selectedAdventure.vendor.totalReviews} reviews)</span>
                      {selectedAdventure.vendor.verified && (
                        <Badge className="ml-2 bg-emerald-100 text-emerald-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600">{selectedAdventure.vendor.description}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Business Hours</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {selectedAdventure.vendor.businessHours}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Contact</h4>
                    <Button
                      onClick={() =>
                        openWhatsApp(
                          selectedAdventure.vendor.whatsappNumber,
                          selectedAdventure.name,
                          selectedAdventure.vendor.name,
                        )
                      }
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat on WhatsApp
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAdventure.vendor.specialties.map((specialty, index) => (
                      <Badge key={index} className="bg-amber-100 text-amber-800">
                        <Award className="h-3 w-3 mr-1" />
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-amber-500 fill-current" />
                    <span className="ml-1 font-bold">{selectedAdventure.vendor.rating}</span>
                    <span className="ml-1 text-gray-500">({selectedAdventure.reviews.length} reviews)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedAdventure.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-emerald-800">{review.name.charAt(0)}</span>
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{review.name}</p>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating ? "text-amber-500 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {showCalendar && (
        <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-emerald-800">Adventure Calendar</DialogTitle>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Selected Date Events</h3>
                  {selectedDate && (
                    <div className="space-y-2">
                      {getEventsForDate(selectedDate).length > 0 ? (
                        getEventsForDate(selectedDate).map((event, index) => (
                          <div key={index} className="p-2 bg-emerald-50 rounded text-sm">
                            {event}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No events scheduled</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        if (selectedDate) {
                          const eventText = prompt("Enter event description:")
                          if (eventText) {
                            addEvent(selectedDate, eventText)
                          }
                        }
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={!selectedDate}
                    >
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Add Custom Event
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default TourismAndAdventuresPage
