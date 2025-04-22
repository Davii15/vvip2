"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Search,
  Star,
  PlaneTakeoff,
  Train,
  Bus,
  Car,
  Filter,
  ArrowUpDown,
  ArrowRight,
  Loader2,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Heart,
  Share2,
  Phone,
  Globe,
  Percent,
  Flame,
  Award,
  BadgePercent,
  Wifi,
  Luggage,
  Compass,
  Landmark,
  Sparkles,
  Plus,
  Minus,
  Calendar,
  ShieldCheck,
  Briefcase,
  Wallet,
  Utensils,
  Waves,
  Tv,
  Coffee,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
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

// Types
interface Price {
  amount: number
  currency: string
}

interface TravelData {
  id: number | string
  name: string
  imageUrl: string
  images?: string[]
  currentPrice: Price
  originalPrice: Price
  category: string
  subcategory: string
  description: string
  location: string
  destination?: string
  departureTime?: string
  arrivalTime?: string
  duration?: string
  isNew?: boolean
  isPopular?: boolean
  dateAdded: string
  rating?: number
  reviewCount?: number
  features?: string[]
  amenities?: string[]
  capacity?: number
  availableSlots?: number
  totalSlots?: number
  tags?: string[]
  hotDealEnds?: string
  discount?: number
  vendorId: number | string
  isHotDeal?: boolean
  isTrending?: boolean
  isAlmostFullyBooked?: boolean
  contactNumber?: string
  website?: string
  departureDate?: string
  returnDate?: string
  address?: string
  travelClass?: string
  stops?: number
  isRefundable?: boolean
  baggageAllowance?: string
}

interface Vendor {
  id: number | string
  name: string
  location: string
  logo: string
  description: string
  offerings: TravelData[]
  redirectUrl: string
  mapLink: string
  defaultCurrency: string
  rating?: number
  reviewCount?: number
  verified?:boolean
  establishedYear?: number
  contactNumber?: string
  email?: string
  website?: string
  fleetSize?: number
  safetyRating?: number
}

interface Category {
  id: string
  name: string
  icon: React.ReactNode
  subcategories?: string[]
}

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

// Get icon for category
const getCategoryIcon = (category: string, size = 20) => {
  switch (category.toLowerCase()) {
    case "international destinations":
      return <PlaneTakeoff size={size} />
    case "local destinations":
      return <Landmark size={size} />
    case "matatu saccos":
      return <Bus size={size} />
    case "digital cabs":
      return <Car size={size} />
    case "trains":
      return <Train size={size} />
    default:
      return <Compass size={size} />
  }
}

// Define categories
const categories: Category[] = [
  {
    id: "international-destinations",
    name: "International Destinations",
    icon: <PlaneTakeoff className="mr-2" />,
    subcategories: ["Africa", "Europe", "Asia", "Americas", "Middle East"],
  },
  {
    id: "local-destinations",
    name: "Local Destinations",
    icon: <Landmark className="mr-2" />,
    subcategories: ["Coast", "Rift Valley", "Central", "Western", "Eastern"],
  },
  {
    id: "matatu-saccos",
    name: "Matatu Saccos",
    icon: <Bus className="mr-2" />,
    subcategories: ["Intercity", "City Routes", "Rural Routes", "Express"],
  },
  {
    id: "digital-cabs",
    name: "Digital Cabs",
    icon: <Car className="mr-2" />,
    subcategories: ["Economy", "Comfort", "Premium", "Family"],
  },
  {
    id: "trains",
    name: "Trains",
    icon: <Train className="mr-2" />,
    subcategories: ["Express", "Standard", "First Class", "Economy"],
  },
]

// Mock data for vendors and offerings
const mockVendors: Vendor[] = [
  // International Destinations
  {
    id: 1,
    name: "Global Adventures Travel",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Explore the world with our curated international travel packages. From exotic beaches to cultural landmarks, we've got you covered.",
    redirectUrl: "https://globaladventures.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 356,
    verified:true,
    establishedYear: 2010,
    contactNumber: "+254 712 345 678",
    email: "info@globaladventures.com",
    website: "https://globaladventures.com",
    offerings: [
      {
        id: 101,
        name: "Dubai Luxury Weekend Getaway",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 85000, currency: "KSH" },
        originalPrice: { amount: 120000, currency: "KSH" },
        category: "International Destinations",
        subcategory: "Middle East",
        description:
          "Experience the glamour of Dubai with this 4-day luxury package. Includes 5-star accommodation, desert safari, Burj Khalifa visit, and shopping tour.",
        location: "Nairobi",
        destination: "Dubai, UAE",
        departureTime: "10:30",
        arrivalTime: "16:45",
        duration: "5 hours 15 minutes",
        isPopular: true,
        dateAdded: "2025-03-10T10:30:00Z",
        rating: 4.9,
        reviewCount: 128,
        features: ["Return Flights", "5-Star Hotel", "Desert Safari", "City Tour", "Airport Transfers"],
        amenities: ["In-flight Meals", "Wi-Fi", "Luggage Allowance", "Travel Insurance", "24/7 Support"],
        capacity: 30,
        availableSlots: 8,
        totalSlots: 30,
        tags: ["Luxury", "Weekend", "Shopping", "Adventure"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 1,
        contactNumber: "+254 712 345 678",
        website: "https://globaladventures.com",
        departureDate: "2025-05-15",
        returnDate: "2025-05-19",
        address: "Jomo Kenyatta International Airport, Nairobi",
        travelClass: "Economy",
        stops: 0,
        isRefundable: true,
        baggageAllowance: "30kg",
      },
      {
        id: 102,
        name: "Paris Romance Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 175000, currency: "KSH" },
        originalPrice: { amount: 210000, currency: "KSH" },
        category: "International Destinations",
        subcategory: "Europe",
        description:
          "Fall in love with the City of Lights on this 7-day romantic getaway. Includes boutique hotel stay, Seine dinner cruise, Eiffel Tower visit, and Louvre Museum tour.",
        location: "Nairobi",
        destination: "Paris, France",
        departureTime: "21:45",
        arrivalTime: "06:30",
        duration: "8 hours 45 minutes",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.8,
        reviewCount: 76,
        features: ["Return Flights", "Boutique Hotel", "Seine Dinner Cruise", "Museum Passes", "Airport Transfers"],
        amenities: ["In-flight Meals", "Wi-Fi", "Luggage Allowance", "Travel Insurance", "24/7 Support"],
        capacity: 20,
        availableSlots: 5,
        totalSlots: 20,
        tags: ["Romantic", "Cultural", "Luxury", "City Break"],
        vendorId: 1,
        isTrending: true,
        contactNumber: "+254 712 345 678",
        website: "https://globaladventures.com",
        departureDate: "2025-06-10",
        returnDate: "2025-06-17",
        address: "Jomo Kenyatta International Airport, Nairobi",
        travelClass: "Economy",
        stops: 1,
        isRefundable: true,
        baggageAllowance: "30kg",
      },
    ],
  },
  {
    id: 2,
    name: "African Horizons Travel",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Specialized in African travel experiences, offering unique packages to explore the continent's diverse cultures, wildlife, and landscapes.",
    redirectUrl: "https://africanhorizons.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 245,
    verified:true,
    establishedYear: 2012,
    contactNumber: "+254 723 456 789",
    email: "info@africanhorizons.com",
    website: "https://africanhorizons.com",
    offerings: [
      {
        id: 201,
        name: "Cape Town Adventure",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 95000, currency: "KSH" },
        originalPrice: { amount: 120000, currency: "KSH" },
        category: "International Destinations",
        subcategory: "Africa",
        description:
          "Discover the beauty of Cape Town with this 6-day package. Includes Table Mountain cable car, Cape Peninsula tour, wine tasting, and V&A Waterfront exploration.",
        location: "Nairobi",
        destination: "Cape Town, South Africa",
        departureTime: "09:15",
        arrivalTime: "13:30",
        duration: "4 hours 15 minutes",
        isPopular: true,
        dateAdded: "2025-02-20T10:30:00Z",
        rating: 4.7,
        reviewCount: 98,
        features: ["Return Flights", "4-Star Hotel", "Daily Breakfast", "Guided Tours", "Airport Transfers"],
        amenities: ["In-flight Meals", "Wi-Fi", "Luggage Allowance", "Travel Insurance", "24/7 Support"],
        capacity: 25,
        availableSlots: 3,
        totalSlots: 25,
        tags: ["Adventure", "Scenic", "Wine", "Cultural"],
        isAlmostFullyBooked: true,
        vendorId: 2,
        contactNumber: "+254 723 456 789",
        website: "https://africanhorizons.com",
        departureDate: "2025-05-20",
        returnDate: "2025-05-26",
        address: "Jomo Kenyatta International Airport, Nairobi",
        travelClass: "Economy",
        stops: 0,
        isRefundable: true,
        baggageAllowance: "23kg",
      },
      {
        id: 202,
        name: "Cairo Historical Tour",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 110000, currency: "KSH" },
        originalPrice: { amount: 135000, currency: "KSH" },
        category: "International Destinations",
        subcategory: "Africa",
        description:
          "Journey through time with this 5-day Cairo exploration. Visit the Pyramids of Giza, Egyptian Museum, Khan el-Khalili bazaar, and take a Nile dinner cruise.",
        location: "Nairobi",
        destination: "Cairo, Egypt",
        departureTime: "14:30",
        arrivalTime: "18:45",
        duration: "4 hours 15 minutes",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.6,
        reviewCount: 65,
        features: ["Return Flights", "4-Star Hotel", "Guided Tours", "Nile Cruise", "Airport Transfers"],
        amenities: ["In-flight Meals", "Wi-Fi", "Luggage Allowance", "Travel Insurance", "24/7 Support"],
        capacity: 20,
        availableSlots: 12,
        totalSlots: 20,
        tags: ["Historical", "Cultural", "Pyramids", "Museum"],
        hotDealEnds: "2025-04-10T23:59:59Z",
        isHotDeal: true,
        vendorId: 2,
        contactNumber: "+254 723 456 789",
        website: "https://africanhorizons.com",
        departureDate: "2025-06-05",
        returnDate: "2025-06-10",
        address: "Jomo Kenyatta International Airport, Nairobi",
        travelClass: "Economy",
        stops: 1,
        isRefundable: true,
        baggageAllowance: "23kg",
      },
    ],
  },

  // Local Destinations
  {
    id: 3,
    name: "Kenya Explorer Tours",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Discover the beauty of Kenya with our expertly crafted local tours. From coastal beaches to wildlife safaris, experience the best of Kenya.",
    redirectUrl: "https://kenyaexplorer.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.9,
    reviewCount: 412,
    verified:true,
    establishedYear: 2008,
    contactNumber: "+254 734 567 890",
    email: "info@kenyaexplorer.com",
    website: "https://kenyaexplorer.com",
    offerings: [
      {
        id: 301,
        name: "Diani Beach Getaway",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 35000, currency: "KSH" },
        originalPrice: { amount: 45000, currency: "KSH" },
        category: "Local Destinations",
        subcategory: "Coast",
        description:
          "Relax on the pristine white sands of Diani Beach with this 4-day package. Includes beachfront accommodation, water sports, and sunset dhow cruise.",
        location: "Nairobi",
        destination: "Diani Beach, Mombasa",
        departureTime: "07:30",
        arrivalTime: "08:45",
        duration: "1 hour 15 minutes",
        isPopular: true,
        dateAdded: "2025-03-05T10:30:00Z",
        rating: 4.9,
        reviewCount: 156,
        features: ["Return Flights", "Beach Resort", "Water Sports", "Dhow Cruise", "Airport Transfers"],
        amenities: ["All Meals", "Wi-Fi", "Beach Access", "Swimming Pool", "Spa Access"],
        capacity: 40,
        availableSlots: 15,
        totalSlots: 40,
        tags: ["Beach", "Relaxation", "Water Sports", "Coastal"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 3,
        isTrending: true,
        contactNumber: "+254 734 567 890",
        website: "https://kenyaexplorer.com",
        departureDate: "2025-04-20",
        returnDate: "2025-04-24",
        address: "Wilson Airport, Nairobi",
        travelClass: "Economy",
        stops: 0,
        isRefundable: true,
        baggageAllowance: "20kg",
      },
      {
        id: 302,
        name: "Maasai Mara Safari Adventure",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 55000, currency: "KSH" },
        originalPrice: { amount: 65000, currency: "KSH" },
        category: "Local Destinations",
        subcategory: "Rift Valley",
        description:
          "Experience the thrill of a 3-day safari in the world-famous Maasai Mara. Witness the Big Five, visit a Maasai village, and enjoy luxury tented accommodation.",
        location: "Nairobi",
        destination: "Maasai Mara National Reserve",
        departureTime: "06:00",
        arrivalTime: "10:30",
        duration: "4 hours 30 minutes (by road)",
        isNew: true,
        dateAdded: "2025-03-12T10:30:00Z",
        rating: 4.8,
        reviewCount: 87,
        features: ["Luxury Tented Camp", "Game Drives", "Maasai Village Visit", "Bush Meals", "Professional Guide"],
        amenities: ["All Meals", "Wi-Fi at Camp", "Hot Showers", "Charging Facilities", "Sundowner Drinks"],
        capacity: 24,
        availableSlots: 6,
        totalSlots: 24,
        tags: ["Safari", "Wildlife", "Adventure", "Photography"],
        vendorId: 3,
        contactNumber: "+254 734 567 890",
        website: "https://kenyaexplorer.com",
        departureDate: "2025-05-10",
        returnDate: "2025-05-13",
        address: "Karen, Nairobi",
        travelClass: "N/A",
        stops: 0,
        isRefundable: false,
        baggageAllowance: "15kg (soft bags only)",
      },
    ],
  },
  {
    id: 4,
    name: "Upcountry Escapes",
    location: "Nakuru, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Specialized in upcountry destinations across Kenya, offering authentic experiences in the highlands, lakes, and mountains.",
    redirectUrl: "https://upcountryescapes.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 328,
    verified:true,
    establishedYear: 2014,
    contactNumber: "+254 745 678 901",
    email: "info@upcountryescapes.com",
    website: "https://upcountryescapes.com",
    offerings: [
      {
        id: 401,
        name: "Mount Kenya Hiking Expedition",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 45000, currency: "KSH" },
        originalPrice: { amount: 55000, currency: "KSH" },
        category: "Local Destinations",
        subcategory: "Central",
        description:
          "Conquer Africa's second-highest peak with this 5-day guided hiking expedition. Includes professional guides, porters, accommodation, and all meals on the mountain.",
        location: "Nairobi",
        destination: "Mount Kenya",
        departureTime: "07:00",
        arrivalTime: "11:30",
        duration: "4 hours 30 minutes (by road)",
        isPopular: true,
        dateAdded: "2025-02-25T10:30:00Z",
        rating: 4.8,
        reviewCount: 142,
        features: ["Professional Guides", "Mountain Huts", "All Meals", "Porters", "Safety Equipment"],
        amenities: ["First Aid Kit", "Hiking Poles", "Water Purification", "Camping Gear", "Park Fees"],
        capacity: 12,
        availableSlots: 4,
        totalSlots: 12,
        tags: ["Hiking", "Adventure", "Mountain", "Nature"],
        vendorId: 4,
        contactNumber: "+254 745 678 901",
        website: "https://upcountryescapes.com",
        departureDate: "2025-06-15",
        returnDate: "2025-06-20",
        address: "Nanyuki Town",
        travelClass: "N/A",
        stops: 0,
        isRefundable: false,
        baggageAllowance: "15kg (hiking backpack)",
      },
      {
        id: 402,
        name: "Lake Nakuru Flamingo Tour",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 18000, currency: "KSH" },
        originalPrice: { amount: 22000, currency: "KSH" },
        category: "Local Destinations",
        subcategory: "Rift Valley",
        description:
          "Witness the spectacular pink flamingos and diverse wildlife at Lake Nakuru National Park with this 2-day tour. Includes accommodation, game drives, and meals.",
        location: "Nairobi",
        destination: "Lake Nakuru",
        departureTime: "07:30",
        arrivalTime: "10:30",
        duration: "3 hours (by road)",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.7,
        reviewCount: 68,
        features: ["Lodge Accommodation", "Game Drives", "Bird Watching", "All Meals", "Professional Guide"],
        amenities: ["Swimming Pool", "Wi-Fi", "Restaurant", "Bar", "Viewing Deck"],
        capacity: 16,
        availableSlots: 3,
        totalSlots: 16,
        tags: ["Wildlife", "Flamingos", "National Park", "Photography"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        isAlmostFullyBooked: true,
        vendorId: 4,
        contactNumber: "+254 745 678 901",
        website: "https://upcountryescapes.com",
        departureDate: "2025-04-25",
        returnDate: "2025-04-27",
        address: "Nakuru Town",
        travelClass: "N/A",
        stops: 0,
        isRefundable: true,
        baggageAllowance: "10kg",
      },
    ],
  },

  // Matatu Saccos
  {
    id: 5,
    name: "Super Metro Sacco",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Leading matatu sacco offering reliable and safe transportation across major routes in Nairobi and beyond.",
    redirectUrl: "https://supermetro.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.5,
    reviewCount: 876,
    verified:true,
    establishedYear: 2010,
    contactNumber: "+254 756 789 012",
    email: "info@supermetro.co.ke",
    website: "https://supermetro.co.ke",
    fleetSize: 120,
    safetyRating: 4.7,
    offerings: [
      {
        id: 501,
        name: "Nairobi to Nakuru Express Service",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 800, currency: "KSH" },
        originalPrice: { amount: 1000, currency: "KSH" },
        category: "Matatu Saccos",
        subcategory: "Intercity",
        description:
          "Direct express service from Nairobi to Nakuru with comfortable 33-seater buses. Features include onboard Wi-Fi, USB charging ports, and refreshments.",
        location: "Nairobi CBD",
        destination: "Nakuru Town",
        departureTime: "07:00, 09:00, 11:00, 14:00, 16:00",
        duration: "2 hours 30 minutes",
        isPopular: true,
        dateAdded: "2025-03-08T10:30:00Z",
        rating: 4.6,
        reviewCount: 312,
        features: ["Express Service", "33-Seater Bus", "Multiple Departures", "Reserved Seating", "Luggage Allowance"],
        amenities: ["Wi-Fi", "USB Charging", "Refreshments", "Air Conditioning", "Entertainment"],
        capacity: 33,
        availableSlots: 12,
        totalSlots: 33,
        tags: ["Express", "Intercity", "Comfortable", "Direct"],
        hotDealEnds: "2025-04-08T23:59:59Z",
        isHotDeal: true,
        isTrending: true,
        vendorId: 5,
        contactNumber: "+254 756 789 012",
        website: "https://supermetro.co.ke",
        address: "River Road Terminal, Nairobi",
        travelClass: "Standard",
        stops: 0,
        isRefundable: true,
        baggageAllowance: "1 suitcase + 1 handbag",
      },
      {
        id: 502,
        name: "Nairobi City Routes Pass",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 1500, currency: "KSH" },
        originalPrice: { amount: 2000, currency: "KSH" },
        category: "Matatu Saccos",
        subcategory: "City Routes",
        description:
          "Weekly pass for unlimited travel on all Super Metro city routes within Nairobi. Convenient and cost-effective for daily commuters.",
        location: "Nairobi",
        destination: "Various Nairobi Routes",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.4,
        reviewCount: 178,
        features: [
          "Unlimited Weekly Travel",
          "All City Routes",
          "Peak Hours Access",
          "Digital Pass",
          "Route Flexibility",
        ],
        amenities: ["Mobile App", "Real-time Tracking", "Customer Support", "Lost & Found Service"],
        capacity: 100,
        availableSlots: 45,
        totalSlots: 100,
        tags: ["Commuter", "City Travel", "Economical", "Flexible"],
        vendorId: 5,
        contactNumber: "+254 756 789 012",
        website: "https://supermetro.co.ke",
        address: "Various Terminals in Nairobi",
        travelClass: "Standard",
        stops: 2,
        isRefundable: false,
        baggageAllowance: "1 handbag",
      },
    ],
  },
  {
    id: 6,
    name: "North Rift Shuttle Services",
    location: "Eldoret, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Reliable shuttle services connecting Western Kenya to Nairobi and other major towns with comfortable and safe transportation.",
    redirectUrl: "https://northriftshuttle.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.6,
    reviewCount: 489,
    establishedYear: 2008,
    contactNumber: "+254 767 890 123",
    email: "info@northriftshuttle.co.ke",
    website: "https://northriftshuttle.co.ke",
    fleetSize: 85,
    safetyRating: 4.8,
    offerings: [
      {
        id: 601,
        name: "Nairobi to Eldoret VIP Shuttle",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 1500, currency: "KSH" },
        originalPrice: { amount: 1800, currency: "KSH" },
        category: "Matatu Saccos",
        subcategory: "Express",
        description:
          "Premium shuttle service from Nairobi to Eldoret with 7-seater vans. Enjoy comfortable seats, Wi-Fi, and refreshments during your journey.",
        location: "Nairobi CBD",
        destination: "Eldoret Town",
        departureTime: "06:30, 08:30, 10:30, 14:00",
        duration: "5 hours",
        isPopular: true,
        dateAdded: "2025-02-28T10:30:00Z",
        rating: 4.7,
        reviewCount: 215,
        features: ["7-Seater Van", "Multiple Departures", "Reserved Seating", "Door-to-Door Option", "Express Service"],
        amenities: ["Wi-Fi", "Refreshments", "Comfortable Seats", "Reading Light", "Air Conditioning"],
        capacity: 7,
        availableSlots: 3,
        totalSlots: 7,
        tags: ["VIP", "Express", "Comfortable", "Western Kenya"],
        vendorId: 6,
        contactNumber: "+254 767 890 123",
        website: "https://northriftshuttle.co.ke",
        address: "Afya Centre, Nairobi",
        travelClass: "VIP",
        stops: 1,
        isRefundable: true,
        baggageAllowance: "1 suitcase + 1 handbag",
      },
      {
        id: 602,
        name: "Western Kenya Explorer Pass",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 4500, currency: "KSH" },
        originalPrice: { amount: 6000, currency: "KSH" },
        category: "Matatu Saccos",
        subcategory: "Rural Routes",
        description:
          "Flexible 3-day pass for unlimited travel between major towns in Western Kenya. Perfect for exploring multiple destinations in the region.",
        location: "Eldoret",
        destination: "Various Western Kenya Towns",
        isNew: true,
        dateAdded: "2025-03-20T10:30:00Z",
        rating: 4.5,
        reviewCount: 62,
        features: ["3-Day Unlimited Travel", "Multiple Routes", "Flexible Schedule", "Digital Pass", "Route Map"],
        amenities: ["Customer Support", "Route Guidance", "Mobile App", "Lost & Found Service"],
        capacity: 50,
        availableSlots: 22,
        totalSlots: 50,
        tags: ["Explorer", "Western Kenya", "Flexible", "Multiple Destinations"],
        hotDealEnds: "2025-04-20T23:59:59Z",
        isHotDeal: true,
        vendorId: 6,
        contactNumber: "+254 767 890 123",
        website: "https://northriftshuttle.co.ke",
        address: "Various Terminals in Western Kenya",
        travelClass: "Standard",
        stops: 4,
        isRefundable: false,
        baggageAllowance: "1 handbag",
      },
    ],
  },

  // Digital Cabs
  {
    id: 7,
    name: "SafariRide",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Premium digital cab service offering safe, reliable, and comfortable transportation across major Kenyan cities.",
    redirectUrl: "https://safariride.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 1215,
    verified:true,
    establishedYear: 2016,
    contactNumber: "+254 778 901 234",
    email: "support@safariride.co.ke",
    website: "https://safariride.co.ke",
    fleetSize: 500,
    safetyRating: 4.9,
    offerings: [
      {
        id: 701,
        name: "Airport Transfer Premium",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 2500, currency: "KSH" },
        originalPrice: { amount: 3000, currency: "KSH" },
        category: "Digital Cabs",
        subcategory: "Premium",
        description:
          "Luxury airport transfer service with premium vehicles and professional drivers. Includes flight tracking, meet & greet, and luggage assistance.",
        location: "Jomo Kenyatta International Airport",
        destination: "Any Nairobi Location",
        isPopular: true,
        dateAdded: "2025-03-01T10:30:00Z",
        rating: 4.9,
        reviewCount: 348,
        features: ["Premium Vehicles", "Professional Drivers", "Flight Tracking", "Meet & Greet", "24/7 Availability"],
        amenities: ["Bottled Water", "Wi-Fi", "Phone Charging", "Air Conditioning", "Child Seat Option"],
        capacity: 4,
        availableSlots: 15,
        totalSlots: 30,
        tags: ["Airport", "Premium", "Reliable", "Comfortable"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        isTrending: true,
        vendorId: 7,
        contactNumber: "+254 778 901 234",
        website: "https://safariride.co.ke",
        address: "JKIA, Nairobi",
        travelClass: "Premium",
        stops: 0,
        isRefundable: true,
        baggageAllowance: "4 suitcases",
      },
      {
        id: 702,
        name: "City Explorer Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 8000, currency: "KSH" },
        originalPrice: { amount: 10000, currency: "KSH" },
        category: "Digital Cabs",
        subcategory: "Comfort",
        description:
          "4-hour city tour package with a dedicated driver to explore Nairobi's attractions. Perfect for tourists or showing visitors around the city.",
        location: "Nairobi",
        destination: "Nairobi Attractions",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.8,
        reviewCount: 86,
        features: ["4-Hour Package", "Dedicated Driver", "Customizable Route", "Local Insights", "Comfortable Vehicle"],
        amenities: ["Bottled Water", "Wi-Fi", "Phone Charging", "Air Conditioning", "Tour Guide Option"],
        capacity: 4,
        availableSlots: 8,
        totalSlots: 10,
        tags: ["City Tour", "Sightseeing", "Tourism", "Flexible"],
        vendorId: 7,
        contactNumber: "+254 778 901 234",
        website: "https://safariride.co.ke",
        address: "Various pickup points in Nairobi",
        travelClass: "Comfort",
        stops: 5,
        isRefundable: true,
        baggageAllowance: "N/A",
      },
    ],
  },
  {
    id: 8,
    name: "FamilyMove",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Family-focused digital cab service specializing in safe and comfortable transportation for families with children.",
    redirectUrl: "https://familymove.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 783,
    establishedYear: 2018,
    contactNumber: "+254 789 012 345",
    email: "info@familymove.co.ke",
    website: "https://familymove.co.ke",
    fleetSize: 150,
    safetyRating: 4.9,
    offerings: [
      {
        id: 801,
        name: "Family SUV Service",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 1800, currency: "KSH" },
        originalPrice: { amount: 2200, currency: "KSH" },
        category: "Digital Cabs",
        subcategory: "Family",
        description:
          "Spacious SUV service with child seats and family-friendly amenities. Perfect for family outings, airport transfers, or shopping trips.",
        location: "Mombasa",
        destination: "Any Mombasa Location",
        isPopular: true,
        dateAdded: "2025-02-25T10:30:00Z",
        rating: 4.8,
        reviewCount: 142,
        features: ["Spacious SUV", "Child Seats", "Family-Friendly Drivers", "Extra Luggage Space", "Safety Features"],
        amenities: ["Bottled Water", "Wi-Fi", "Entertainment Tablets", "Air Conditioning", "First Aid Kit"],
        capacity: 6,
        availableSlots: 4,
        totalSlots: 8,
        tags: ["Family", "Spacious", "Child-Friendly", "Safe"],
        vendorId: 8,
        contactNumber: "+254 789 012 345",
        website: "https://familymove.co.ke",
        address: "Various pickup points in Mombasa",
        travelClass: "Family",
        stops: 0,
        isRefundable: true,
        baggageAllowance: "Large luggage capacity",
      },
      {
        id: 802,
        name: "School Run Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 12000, currency: "KSH" },
        originalPrice: { amount: 15000, currency: "KSH" },
        category: "Digital Cabs",
        subcategory: "Family",
        description:
          "Monthly school transportation package with dedicated driver, child seats, and real-time tracking for parents. Safe and reliable school runs.",
        location: "Mombasa",
        destination: "Schools in Mombasa",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.9,
        reviewCount: 68,
        features: ["Monthly Package", "Dedicated Driver", "Child Seats", "Real-time Tracking", "Punctual Service"],
        amenities: [
          "Parent App",
          "Driver Background Check",
          "Vehicle Safety Inspection",
          "Emergency Contact",
          "Climate Control",
        ],
        capacity: 4,
        availableSlots: 2,
        totalSlots: 6,
        tags: ["School", "Children", "Safe", "Reliable"],
        hotDealEnds: "2025-04-18T23:59:59Z",
        isHotDeal: true,
        isAlmostFullyBooked: true,
        vendorId: 8,
        contactNumber: "+254 789 012 345",
        website: "https://familymove.co.ke",
        address: "Various pickup points in Mombasa",
        travelClass: "Family",
        stops: 5,
        isRefundable: false,
        baggageAllowance: "School bags only",
      },
    ],
  },

  // Trains
  {
    id: 9,
    name: "Madaraka Express",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Modern railway service connecting Nairobi and Mombasa with comfortable, fast, and reliable train transportation.",
    redirectUrl: "https://madarakaexpress.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.6,
    reviewCount: 1542,
    verified:true,
    establishedYear: 2017,
    contactNumber: "+254 790 123 456",
    email: "info@madarakaexpress.co.ke",
    website: "https://madarakaexpress.co.ke",
    offerings: [
      {
        id: 901,
        name: "Nairobi to Mombasa First Class",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 3000, currency: "KSH" },
        originalPrice: { amount: 3500, currency: "KSH" },
        category: "Trains",
        subcategory: "First Class",
        description:
          "First class train journey from Nairobi to Mombasa with spacious seating, meal service, and panoramic views of wildlife and landscapes.",
        location: "Nairobi Terminus",
        destination: "Mombasa Terminus",
        departureTime: "08:00",
        arrivalTime: "13:00",
        duration: "5 hours",
        isPopular: true,
        dateAdded: "2025-03-05T10:30:00Z",
        rating: 4.7,
        reviewCount: 486,
        features: ["First Class Cabin", "Spacious Seating", "Meal Service", "Panoramic Windows", "Power Outlets"],
        amenities: ["Wi-Fi", "Air Conditioning", "Onboard Entertainment", "Refreshments", "Clean Restrooms"],
        capacity: 72,
        availableSlots: 15,
        totalSlots: 72,
        tags: ["Train", "First Class", "Scenic", "Comfortable"],
        vendorId: 9,
        contactNumber: "+254 790 123 456",
        website: "https://madarakaexpress.co.ke",
        address: "Nairobi Terminus, Syokimau",
        travelClass: "First Class",
        stops: 7,
        isRefundable: true,
        baggageAllowance: "2 suitcases + 1 handbag",
      },
      {
        id: 902,
        name: "Nairobi to Mombasa Economy Return",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 2000, currency: "KSH" },
        originalPrice: { amount: 2400, currency: "KSH" },
        category: "Trains",
        subcategory: "Economy",
        description:
          "Affordable return journey between Nairobi and Mombasa in economy class. Comfortable seating, scenic views, and convenient scheduling.",
        location: "Nairobi Terminus",
        destination: "Mombasa Terminus",
        departureTime: "08:00 (outbound), 15:00 (return)",
        arrivalTime: "13:00 (outbound), 20:00 (return)",
        duration: "5 hours each way",
        isNew: true,
        dateAdded: "2025-03-12T10:30:00Z",
        rating: 4.5,
        reviewCount: 328,
        features: ["Return Ticket", "Economy Class", "Flexible Return Date", "Comfortable Seating", "Scenic Route"],
        amenities: ["Air Conditioning", "Restrooms", "Snack Cart", "Reading Lights", "Luggage Space"],
        capacity: 960,
        availableSlots: 240,
        totalSlots: 960,
        tags: ["Train", "Economy", "Return Trip", "Affordable"],
        hotDealEnds: "2025-04-12T23:59:59Z",
        isHotDeal: true,
        vendorId: 9,
        contactNumber: "+254 790 123 456",
        website: "https://madarakaexpress.co.ke",
        address: "Nairobi Terminus, Syokimau",
        travelClass: "Economy",
        stops: 7,
        isRefundable: false,
        baggageAllowance: "1 suitcase + 1 handbag",
      },
    ],
  },
  {
    id: 10,
    name: "City Rail Services",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Urban commuter rail service connecting Nairobi CBD with surrounding suburbs and satellite towns.",
    redirectUrl: "https://cityrail.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.3,
    reviewCount: 967,
    verified:true,
    establishedYear: 2020,
    contactNumber: "+254 701 234 567",
    email: "info@cityrail.co.ke",
    website: "https://cityrail.co.ke",
    offerings: [
      {
        id: 1001,
        name: "Commuter Monthly Pass",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 4500, currency: "KSH" },
        originalPrice: { amount: 6000, currency: "KSH" },
        category: "Trains",
        subcategory: "Standard",
        description:
          "Unlimited monthly travel on all commuter rail routes in Nairobi. Convenient and cost-effective for daily commuters.",
        location: "Nairobi",
        destination: "All Nairobi Commuter Stations",
        isPopular: true,
        dateAdded: "2025-02-20T10:30:00Z",
        rating: 4.4,
        reviewCount: 312,
        features: ["Unlimited Monthly Travel", "All Routes", "Peak Hours Access", "Digital Pass", "Express Boarding"],
        amenities: ["Mobile App", "Customer Support", "Lost & Found Service", "Route Maps", "Schedule Updates"],
        capacity: 500,
        availableSlots: 120,
        totalSlots: 500,
        tags: ["Commuter", "Monthly", "Unlimited", "Urban"],
        hotDealEnds: "2025-04-20T23:59:59Z",
        isHotDeal: true,
        vendorId: 10,
        contactNumber: "+254 701 234 567",
        website: "https://cityrail.co.ke",
        address: "Nairobi Central Station",
        travelClass: "Standard",
        stops: 7,
        isRefundable: false,
        baggageAllowance: "Hand luggage only",
      },
      {
        id: 1002,
        name: "Express Commuter Service",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 200, currency: "KSH" },
        originalPrice: { amount: 250, currency: "KSH" },
        category: "Trains",
        subcategory: "Express",
        description:
          "Premium express commuter service with limited stops between major stations. Faster journey times and guaranteed seating.",
        location: "Nairobi CBD",
        destination: "Satellite Towns",
        departureTime: "06:30, 07:30, 17:30, 18:30",
        duration: "30-45 minutes",
        isNew: true,
        dateAdded: "2025-03-10T10:30:00Z",
        rating: 4.6,
        reviewCount: 156,
        features: ["Express Service", "Limited Stops", "Guaranteed Seating", "Multiple Departures", "Faster Journey"],
        amenities: ["Wi-Fi", "Comfortable Seating", "Reading Lights", "Clean Environment", "Security Personnel"],
        capacity: 120,
        availableSlots: 35,
        totalSlots: 120,
        tags: ["Express", "Commuter", "Premium", "Fast"],
        isTrending: true,
        vendorId: 10,
        contactNumber: "+254 701 234 567",
        website: "https://cityrail.co.ke",
        address: "Nairobi Central Station",
        travelClass: "Express",
        stops: 1,
        isRefundable: true,
        baggageAllowance: "Hand luggage only",
      },
    ],
  },
]

// Helper function to transform data for hot deals
const transformForHotDeals = (vendors: Vendor[]) => {
  return vendors.flatMap((vendor) =>
    vendor.offerings
      .filter((offering) => offering.isHotDeal)
      .map((offering) => ({
        id: offering.id,
        name: offering.name,
        imageUrl: offering.imageUrl,
        currentPrice: offering.currentPrice,
        originalPrice: offering.originalPrice,
        category: offering.category,
        expiresAt: offering.hotDealEnds || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: offering.description,
        discount: Math.round(
          ((offering.originalPrice.amount - offering.currentPrice.amount) / offering.originalPrice.amount) * 100,
        ),
      })),
  )
}

// Helper function to transform data for new products
const transformForNewProducts = (vendors: Vendor[]) => {
  return vendors.flatMap((vendor) =>
    vendor.offerings
      .filter((offering) => offering.isNew || isNewThisWeek(offering.dateAdded))
      .map((offering) => ({
        id: offering.id,
        name: offering.name,
        imageUrl: offering.imageUrl,
        currentPrice: offering.currentPrice,
        originalPrice: offering.originalPrice,
        category: offering.category,
        dateAdded: offering.dateAdded,
        isNew: true,
        description: offering.description,
      })),
  )
}
// Loading fallback components
function CountdownTimerFallback() {
  return <div className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>
}

function HotDealsFallback() {
  return <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
}

function NewProductsFallback() {
  return <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
}

function TrendingSectionFallback() {
  return <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
}


export default function TravellingPage() {
  useCookieTracking("travelling")

  // State for vendors and offerings
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors)
  const [newOfferingAlert, setNewOfferingAlert] = useState<TravelData | null>(null)
  const [swapTrigger, setSwapTrigger] = useState(0)

// Custom color scheme for travelling
const travellingColorScheme = {
  primary: "from-purple-500 to-indigo-700",
  secondary: "bg-purple-100",
  accent: "bg-indigo-600",
  text: "text-purple-900",
  background: "bg-purple-50",
}

  // State for active category and subcategory
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [activeSubcategory, setActiveSubcategory] = useState<string>("")

  // State for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000])
  const [sortOrder, setSortOrder] = useState("default")
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([])

  // State for offering detail modal
  const [selectedOffering, setSelectedOffering] = useState<TravelData | null>(null)

  // States for infinite scroll
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)

  // Get hot deals
  const hotDeals = useMemo(() => {
    return transformForHotDeals(vendors)
  }, [vendors, swapTrigger])

  // Get new products
  const newProducts = useMemo(() => {
    return transformForNewProducts(vendors)
  }, [vendors, swapTrigger])

  // Launch confetti effect on page load
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#60a5fa", "#93c5fd"], // Blue colors
    })
  }, [])

  // Filter vendors based on search, category, subcategory, and price range
  useEffect(() => {
    let results = vendors

    // Filter by search term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      results = results.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          vendor.location.toLowerCase().includes(lowerCaseSearchTerm) ||
          vendor.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          vendor.offerings.some((offering) => {
            return (
              offering.name.toLowerCase().includes(lowerCaseSearchTerm) ||
              offering.description.toLowerCase().includes(lowerCaseSearchTerm) ||
              offering.location.toLowerCase().includes(lowerCaseSearchTerm) ||
              (offering.destination && offering.destination.toLowerCase().includes(lowerCaseSearchTerm)) ||
              (offering.tags && offering.tags.some((tag) => tag.toLowerCase().includes(lowerCaseSearchTerm)))
            )
          }),
      )
    }

    // Filter by category
    if (activeCategory) {
      results = results.filter((vendor) =>
        vendor.offerings.some((offering) => offering.category.toLowerCase() === activeCategory.toLowerCase()),
      )
    }

    // Filter by subcategory
    if (activeSubcategory) {
      results = results.filter((vendor) =>
        vendor.offerings.some((offering) => offering.subcategory.toLowerCase() === activeSubcategory.toLowerCase()),
      )
    }

    // Filter by price range
    results = results.filter((vendor) =>
      vendor.offerings.some(
        (offering) => offering.currentPrice.amount >= priceRange[0] && offering.currentPrice.amount <= priceRange[1],
      ),
    )

    // Sort results
    if (sortOrder === "price-asc") {
      results.sort((a, b) => {
        const aMinPrice = Math.min(...a.offerings.map((offering) => offering.currentPrice.amount))
        const bMinPrice = Math.min(...b.offerings.map((offering) => offering.currentPrice.amount))
        return aMinPrice - bMinPrice
      })
    } else if (sortOrder === "price-desc") {
      results.sort((a, b) => {
        const aMaxPrice = Math.max(...a.offerings.map((offering) => offering.currentPrice.amount))
        const bMaxPrice = Math.max(...b.offerings.map((offering) => offering.currentPrice.amount))
        return bMaxPrice - aMaxPrice
      })
    } else if (sortOrder === "rating") {
      results.sort((a, b) => {
        const aRating = a.rating || 0
        const bRating = b.rating || 0
        return bRating - aRating
      })
    } else if (sortOrder === "newest") {
      results.sort((a, b) => {
        const aNewest = Math.max(...a.offerings.map((offering) => new Date(offering.dateAdded).getTime()))
        const bNewest = Math.max(...b.offerings.map((offering) => new Date(offering.dateAdded).getTime()))
        return bNewest - aNewest
      })
    }

    setFilteredVendors(results)
  }, [searchTerm, activeCategory, activeSubcategory, priceRange, sortOrder, vendors])

  // Add effect to detect and show new offering alerts
  useEffect(() => {
    // Find the newest offering across all vendors
    const allOfferings = vendors.flatMap((vendor) => vendor.offerings)
    const newOfferings = allOfferings.filter((offering) => offering.isNew || isNewThisWeek(offering.dateAdded))

    if (newOfferings.length > 0) {
      // Sort by date to get the newest one
      const newestOffering = newOfferings.sort(
        (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
      )[0]

      // Set as new offering alert
      setNewOfferingAlert(newestOffering)

      // Auto-dismiss after 10 seconds
      const timer = setTimeout(() => {
        setNewOfferingAlert(null)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [vendors])

  // Infinite scrolling
  const loadMoreItems = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false)
      setHasMore(false) // In a real app, you would check if there are more items to load
    }, 800)
  }, [isLoading, hasMore])

  // Set up intersection observer for infinite scroll
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

  // Handle accordion toggle
  const toggleAccordion = (value: string) => {
    setExpandedAccordions((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  // Add swapping effect every 10 minutes
  useEffect(() => {
    const swapInterval = setInterval(
      () => {
        // Swap vendors
        setVendors((prevVendors) => {
          const newVendors = [...prevVendors]
          return swapArrayElementsRandomly(newVendors)
        })
        // Increment swap trigger to force re-renders
        setSwapTrigger((prev) => prev + 1)
      },
      10 * 60 * 1000, // 10 minutes
    )

    return () => clearInterval(swapInterval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100">
      {/* New Offering Alert */}
      {newOfferingAlert && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 max-w-md"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
        >
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-blue-200">
            <div className="bg-gradient-to-r from-blue-500 to-sky-500 px-4 py-2 flex justify-between items-center">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-white mr-2" />
                <h3 className="text-white font-bold">New Travel Offer!</h3>
              </div>
              <button onClick={() => setNewOfferingAlert(null)} className="text-white hover:text-gray-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 flex">
              <div className="w-20 h-20 relative flex-shrink-0 mr-4">
                <Image
                  src={newOfferingAlert.imageUrl || "/placeholder.svg?height=80&width=80"}
                  alt={newOfferingAlert.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <div>
                <h4 className="font-semibold text-blue-700">{newOfferingAlert.name}</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {newOfferingAlert.destination
                    ? `${newOfferingAlert.location} to ${newOfferingAlert.destination}`
                    : newOfferingAlert.location}
                </p>
                <div className="flex items-center">
                  <span className="text-blue-600 font-bold mr-2">{formatPrice(newOfferingAlert.currentPrice)}</span>
                  <Badge className="bg-blue-100 text-blue-800">New Arrival</Badge>
                </div>
              </div>
            </div>
            <div className="px-4 pb-4">
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600"
                onClick={() => {
                  // Find the vendor that has this offering
                  const vendor = vendors.find((v) => v.offerings.some((p) => p.id === newOfferingAlert.id))
                  if (vendor) {
                    // Expand that vendor's accordion
                    if (!expandedAccordions.includes(vendor.id.toString())) {
                      toggleAccordion(vendor.id.toString())
                    }
                    // Set the offering for detail view
                    setSelectedOffering(newOfferingAlert)
                  }
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-blue-500/10 to-sky-500/10 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-l from-blue-500/10 to-sky-500/10 -z-10"></div>

      <div className="container mx-auto px-4 py-8 max-w-[1920px] relative z-10">
        {/* Header with animated gradient text */}
        <div className="text-center mb-6">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-sky-600 to-blue-600 text-transparent bg-clip-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Travel & Transportation
          </motion.h1>

          {/* Five blue stars */}
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-8 w-8 text-blue-400 fill-blue-400 mx-1" />
            ))}
          </div>

          <motion.p
            className="text-xl text-blue-800 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover amazing travel deals, transportation options, and unforgettable journeys
          </motion.p>
        </div>

    {/* Countdown Timer - Wrapped in Suspense */}
        <div className="mb-8">
          <Suspense fallback={<CountdownTimerFallback />}>
            <CountdownTimer targetDate="2025-05-31T23:59:59" startDate="2025-03-01T00:00:00" />
          </Suspense>
        </div>

        {/* Hot Time Deals Section - Wrapped in Suspense */}
        {hotDeals.length > 0 && (
          <Suspense fallback={<HotDealsFallback />}>
            <HotTimeDeals
              deals={hotDeals}
              colorScheme="blue"
              title="Limited Time Travel Offers"
              subtitle="Exclusive deals on amazing journeys - book before they're gone!"
            />
          </Suspense>
        )}

        {/* New Products For You Section - Wrapped in Suspense */}
        <Suspense fallback={<NewProductsFallback />}>
          <NewProductsForYou allProducts={newProducts} colorScheme="blue" maxProducts={4} />
        </Suspense>

  {/* Trending and Popular Section - Wrapped in Suspense */}
        <Suspense fallback={<TrendingSectionFallback />}>
          <TrendingPopularSection
            trendingProducts={trendingProducts}
            popularProducts={popularProducts}
            colorScheme={travellingColorScheme}
            title="Best Travelling Deals Today"
            subtitle="Discover most popular travelling options"
          />
        </Suspense>
        
    <div className="flex flex-wrap gap-4 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
              <Link href="/travelling/shop">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 transition-transform hover:scale-105"
                >
                  Check out our Travel shop
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              </div>
              
    <div className="flex flex-wrap gap-4 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
              <Link href="/travelling/media">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 transition-transform hover:scale-105"
                >
                  Check out our Travel Media
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              </div>

        {/* Enhanced search section */}
        <div className="mb-10 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-100">
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Search for destinations, routes, or transportation options..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pr-12 rounded-lg border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-400 text-lg"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500" size={24} />
          </div>

          {/* Category tabs */}
          <Tabs defaultValue={activeCategory} value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              <TabsTrigger value="" className="flex items-center justify-center gap-2">
                <Compass className="h-4 w-4" />
                <span>All Categories</span>
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center justify-center gap-2">
                  {category.icon}
                  <span>{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Subcategory selection */}
          {activeCategory && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-gray-700">Subcategories</h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={activeSubcategory === "" ? "default" : "outline"}
                  className={`cursor-pointer ${activeSubcategory === "" ? "bg-blue-500" : "hover:bg-blue-100"}`}
                  onClick={() => setActiveSubcategory("")}
                >
                  All {categories.find((c) => c.id === activeCategory)?.name || ""}
                </Badge>
                {categories
                  .find((c) => c.id === activeCategory)
                  ?.subcategories?.map((subcategory) => (
                    <Badge
                      key={subcategory}
                      variant={activeSubcategory === subcategory ? "default" : "outline"}
                      className={`cursor-pointer ${
                        activeSubcategory === subcategory ? "bg-blue-500" : "hover:bg-blue-100"
                      }`}
                      onClick={() => setActiveSubcategory(subcategory)}
                    >
                      {subcategory}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Price range filter */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-gray-700">
              Price Range: {formatPrice({ amount: priceRange[0], currency: "KSH" })} -{" "}
              {formatPrice({ amount: priceRange[1], currency: "KSH" })}
            </h3>
            <div className="px-2 py-4">
              <Slider
                defaultValue={[0, 300000]}
                max={300000}
                step={5000}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="w-full"
              />
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
                    vendor.offerings.filter(
                      (offering) =>
                        (!activeCategory || offering.category.toLowerCase() === activeCategory.toLowerCase()) &&
                        (!activeSubcategory || offering.subcategory.toLowerCase() === activeSubcategory.toLowerCase()),
                    ).length,
                  0,
                )}{" "}
                travel options found
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
                <option value="newest">Newest First</option>
              </select>
              <ArrowUpDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-12">
          {filteredVendors.length > 0 ? (
            filteredVendors.map((vendor) => (
              <VendorSection
                key={vendor.id}
                vendor={vendor}
                activeCategory={activeCategory}
                activeSubcategory={activeSubcategory}
                onOfferingClick={setSelectedOffering}
                isExpanded={expandedAccordions.includes(vendor.id.toString())}
                onToggle={() => toggleAccordion(vendor.id.toString())}
              />
            ))
          ) : (
            <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-8 text-center shadow-md">
              <p className="text-gray-600 text-lg">No travel options found matching your criteria.</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center bg-white/80 p-6 rounded-full backdrop-blur-sm">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              <p className="mt-2 text-blue-600 font-medium">Loading more travel options...</p>
            </div>
          </div>
        )}

        {/* Loader reference element */}
        <div ref={loaderRef} className="h-20"></div>
      </div>

      {/* Offering Detail Modal */}
      {selectedOffering && (
        <Dialog open={!!selectedOffering} onOpenChange={() => setSelectedOffering(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <OfferingDetailView offering={selectedOffering} onClose={() => setSelectedOffering(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Vendor Section Component
function VendorSection({
  vendor,
  activeCategory,
  activeSubcategory,
  onOfferingClick,
  isExpanded,
  onToggle,
}: {
  vendor: Vendor
  activeCategory: string
  activeSubcategory: string
  onOfferingClick: (offering: TravelData) => void
  isExpanded: boolean
  onToggle: () => void
}) {
  const [imageError, setImageError] = useState(false)

  // Filter offerings based on active filters
  const filteredOfferings = vendor.offerings.filter(
    (offering) =>
      (!activeCategory || offering.category.toLowerCase() === activeCategory.toLowerCase()) &&
      (!activeSubcategory || offering.subcategory.toLowerCase() === activeSubcategory.toLowerCase()),
  )

  if (filteredOfferings.length === 0) return null

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
      <div className="p-6 bg-gradient-to-r from-blue-100 to-sky-100">
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
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-blue-800">{vendor.name}</h3>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-blue-500 mr-1" />
                <p className="text-gray-600 text-sm mr-2">{vendor.location}</p>
                {vendor.rating && (
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(vendor.rating || 0) ? "text-blue-400 fill-blue-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-gray-600">
                      {vendor.rating.toFixed(1)} ({vendor.reviewCount})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 hidden md:block">
              {vendor.establishedYear && (
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="h-3 w-3" />
                  <span>Est. {vendor.establishedYear}</span>
                </div>
              )}
              {vendor.contactNumber && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{vendor.contactNumber}</span>
                </div>
              )}
            </div>
            <a
              href={vendor.redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap"
            >
              Visit Website
            </a>
          </div>
        </div>
        <p className="text-gray-700 mb-4 line-clamp-2">{vendor.description}</p>

        {/* Accordion control */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full mt-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              <span>Show Less</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              <span>Show More</span>
            </>
          )}
        </button>
      </div>

      {/* Offerings grid */}
      <div
        className={`p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-all duration-300 ${
          isExpanded ? "max-h-[2000px]" : "max-h-[400px] overflow-hidden"
        }`}
      >
        {filteredOfferings.map((offering) => (
          <OfferingCard key={offering.id} offering={offering} onClick={() => onOfferingClick(offering)} />
        ))}
      </div>
    </div>
  )
}

// Offering Card Component
function OfferingCard({ offering, onClick }: { offering: TravelData; onClick: () => void }) {
  const [imageError, setImageError] = useState(false)

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((offering.originalPrice.amount - offering.currentPrice.amount) / offering.originalPrice.amount) * 100,
  )
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

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full border border-blue-100"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="relative">
        <div className="relative pt-[75%]">
          <Image
            src={imageError ? "/placeholder.svg?height=300&width=400" : offering.imageUrl}
            alt={offering.name}
            layout="fill"
            objectFit="cover"
            className="transition-all duration-500 hover:scale-110"
            onError={() => setImageError(true)}
          />
        </div>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {discountPercentage >= 15 && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md">
              {discountPercentage}% OFF
            </div>
          )}

          {offering.isNew && (
            <div className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              NEW
            </div>
          )}

          {offering.isTrending && (
            <div className="bg-purple-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md flex items-center">
              <Flame className="h-3 w-3 mr-1" />
              TRENDING
            </div>
          )}
        </div>

        {/* Most preferred badge */}
        {offering.isPopular && (
          <div className="absolute top-2 left-2">
            <MostPreferredBadge  />
          </div>
        )}

        {/* Almost fully booked badge */}
        {offering.isAlmostFullyBooked && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-red-100 text-red-800 flex items-center gap-1 px-2 py-1 text-xs font-medium">
              <Clock className="h-3 w-3" />
              Almost Fully Booked
            </Badge>
          </div>
        )}

        {/* New this week badge */}
        {isNewThisWeek(offering.dateAdded) && !offering.isNew && (
          <div className="absolute bottom-2 left-2">
            <NewThisWeekBadge />
          </div>
        )}
      </div>

      <div className="p-3 flex-grow flex flex-col">
        <div className="mb-1 flex items-center">
          <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
            {offering.category}
          </Badge>
          <span className="ml-2 text-xs text-gray-500">{offering.subcategory}</span>
        </div>

        <h4 className="font-semibold text-blue-800 mb-1 line-clamp-1">{offering.name}</h4>

        <div className="flex items-center text-xs text-gray-500 mb-1">
          <MapPin className="h-3 w-3 mr-1 text-blue-500" />
          {offering.destination ? `${offering.location} to ${offering.destination}` : offering.location}
        </div>

        {offering.departureTime && (
          <div className="flex items-center text-xs text-gray-500 mb-1">
            <Clock className="h-3 w-3 mr-1 text-blue-500" />
            {offering.duration ? `${offering.departureTime} • ${offering.duration}` : offering.departureTime}
          </div>
        )}

        <p className="text-xs text-gray-600 mb-2 line-clamp-2 flex-grow">{offering.description}</p>

        {/* Rating */}
        {offering.rating && (
          <div className="flex items-center mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(offering.rating || 0) ? "text-blue-400 fill-blue-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-600">
              {offering.rating.toFixed(1)} ({offering.reviewCount})
            </span>
          </div>
        )}

        {/* Features */}
        {offering.features && offering.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {offering.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-[10px] bg-gray-50 text-gray-600">
                {feature}
              </Badge>
            ))}
            {offering.features.length > 3 && (
              <Badge variant="outline" className="text-[10px] bg-gray-50 text-gray-600">
                +{offering.features.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Availability */}
        {offering.availableSlots !== undefined && offering.totalSlots !== undefined && (
          <div className="mb-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Availability:</span>
              <span
                className={`font-medium ${
                  offering.availableSlots < offering.totalSlots * 0.2
                    ? "text-red-600"
                    : offering.availableSlots < offering.totalSlots * 0.5
                      ? "text-amber-600"
                      : "text-green-600"
                }`}
              >
                {offering.availableSlots} of {offering.totalSlots} available
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div
                className={`h-1.5 rounded-full ${
                  offering.availableSlots < offering.totalSlots * 0.2
                    ? "bg-red-500"
                    : offering.availableSlots < offering.totalSlots * 0.5
                      ? "bg-amber-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${(offering.availableSlots / offering.totalSlots) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <div className="text-base font-bold text-blue-600">{formatPrice(offering.currentPrice)}</div>
            <div className="text-xs text-gray-500 line-through">{formatPrice(offering.originalPrice)}</div>
          </div>

          <div className="flex gap-1">
            <motion.button
              className="bg-blue-100 text-blue-800 px-2 py-1.5 rounded-md text-xs font-medium flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                // Save functionality would go here
              }}
            >
              <Percent className="h-3 w-3 mr-1" />
              Save {discountPercentage}%
            </motion.button>

            <motion.button
              className="bg-gradient-to-r from-blue-500 to-sky-500 text-white px-2 py-1.5 rounded-md text-xs font-medium flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                // Book date functionality would go here
              }}
            >
              <ShieldCheck className="h-3 w-3 mr-1" />
              Have Safe Travel
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Offering Detail View Component
function OfferingDetailView({ offering, onClose }: { offering: TravelData; onClose: () => void }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedDate, setSelectedDate] = useState<string>(offering.departureDate || "")
  const [activeImage, setActiveImage] = useState(0)

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((offering.originalPrice.amount - offering.currentPrice.amount) / offering.originalPrice.amount) * 100,
  )

  // Get all images (main image + additional images)
  const allImages = offering.images ? [offering.imageUrl, ...offering.images] : [offering.imageUrl]

  // Get amenity icon
  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes("wifi")) return <Wifi className="h-4 w-4 mr-2 text-blue-500" />
    if (amenityLower.includes("luggage")) return <Luggage className="h-4 w-4 mr-2 text-blue-500" />
    if (amenityLower.includes("meal")) return <Utensils className="h-4 w-4 mr-2 text-blue-500" />
    if (amenityLower.includes("air")) return <Waves className="h-4 w-4 mr-2 text-blue-500" />
    if (amenityLower.includes("charging")) return <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
    if (amenityLower.includes("entertainment")) return <Tv className="h-4 w-4 mr-2 text-blue-500" />
    if (amenityLower.includes("refreshment")) return <Coffee className="h-4 w-4 mr-2 text-blue-500" />
    if (amenityLower.includes("insurance")) return <ShieldCheck className="h-4 w-4 mr-2 text-blue-500" />
    return <Award className="h-4 w-4 mr-2 text-blue-500" />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Image gallery */}
      <div>
        <div className="relative rounded-lg overflow-hidden mb-4 aspect-square">
          <Image
            src={allImages[activeImage] || "/placeholder.svg?height=600&width=600"}
            alt={offering.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />

          {discountPercentage >= 15 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold shadow-md">
              {discountPercentage}% OFF
            </div>
          )}

          {offering.isNew && (
            <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-bold shadow-md flex items-center">
              <Sparkles className="h-4 w-4 mr-1" />
              NEW
            </div>
          )}
        </div>

        {/* Thumbnail gallery */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.map((img, index) => (
              <div
                key={index}
                className={`relative w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
                  activeImage === index ? "border-blue-500" : "border-transparent"
                }`}
                onClick={() => setActiveImage(index)}
              >
                <Image
                  src={img || "/placeholder.svg?height=80&width=80"}
                  alt={`${offering.name} - view ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1 text-blue-700 border-blue-200">
            <Heart className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" className="flex-1 text-blue-700 border-blue-200">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" className="flex-1 text-blue-700 border-blue-200">
            <Phone className="h-4 w-4 mr-2" />
            Contact
          </Button>
        </div>
      </div>

      {/* Offering details */}
      <div className="flex flex-col">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
              {offering.category}
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
              {offering.subcategory}
            </Badge>
          </div>

          <h2 className="text-2xl font-bold text-blue-800 mb-2">{offering.name}</h2>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 text-blue-500 mr-1" />
              <span>
                {offering.destination ? `${offering.location} to ${offering.destination}` : offering.location}
              </span>
            </div>

            {offering.rating && (
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(offering.rating || 0) ? "text-blue-400 fill-blue-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-600">
                  {offering.rating.toFixed(1)} ({offering.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          {offering.departureTime && (
            <div className="flex items-center text-gray-600 mb-2">
              <Clock className="h-4 w-4 text-blue-500 mr-2" />
              <span>
                {offering.departureTime}
                {offering.arrivalTime && ` - ${offering.arrivalTime}`}
                {offering.duration && ` (${offering.duration})`}
              </span>
            </div>
          )}

          <div className="flex items-end gap-3 mb-4">
            <div className="text-3xl font-bold text-blue-600">{formatPrice(offering.currentPrice)}</div>
            <div className="text-lg text-gray-500 line-through">{formatPrice(offering.originalPrice)}</div>
            {discountPercentage > 0 && <div className="text-red-500 font-medium">Save {discountPercentage}%</div>}
          </div>

          <p className="text-gray-700 mb-6">{offering.description}</p>
        </div>

        {/* Features */}
        {offering.features && offering.features.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Features</h3>
            <div className="flex flex-wrap gap-2">
              {offering.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Amenities */}
        {offering.amenities && offering.amenities.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {offering.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center text-gray-700">
                  {getAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Availability */}
        {offering.availableSlots !== undefined && offering.totalSlots !== undefined && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Availability</h3>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-600">Available slots:</span>
              <span
                className={`font-medium ${offering.availableSlots < offering.totalSlots * 0.2 ? "text-red-600" : offering.availableSlots < offering.totalSlots * 0.5 ? "text-amber-600" : "text-green-600"}`}
              >
                {offering.availableSlots} of {offering.totalSlots}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className={`h-2 rounded-full ${offering.availableSlots < offering.totalSlots * 0.2 ? "bg-red-500" : offering.availableSlots < offering.totalSlots * 0.5 ? "bg-amber-500" : "bg-green-500"}`}
                style={{ width: `${(offering.availableSlots / offering.totalSlots) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Quantity selector */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Number of Travelers/Quantity</h3>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-md"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="px-4 py-1 bg-gray-50 border-t border-b border-gray-200 text-center min-w-[40px]">
              {quantity}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-r-md"
              onClick={() => setQuantity((prev) => Math.min(offering.capacity || 10, prev + 1))}
            >
              <Plus className="h-4 w-4" />
            </Button>

            <div className="ml-4 text-sm text-gray-600">
              {offering.capacity && <span>Max capacity: {offering.capacity}</span>}
            </div>
          </div>
        </div>

        {/* Date selector */}
        {(offering.category === "International Destinations" || offering.category === "Local Destinations") && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Select Travel Date</h3>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mt-auto">
          <Button className="flex-1 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600">
            <BadgePercent className="h-4 w-4 mr-2" />
            Save {discountPercentage}% (
            {formatPrice({
              amount: offering.originalPrice.amount - offering.currentPrice.amount,
              currency: offering.currentPrice.currency,
            })}
            )
          </Button>

          <Button className="flex-1 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Have Safe Travel
          </Button>
        </div>

        {/* Additional information */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            {offering.contactNumber && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                <span>{offering.contactNumber}</span>
              </div>
            )}
            {offering.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                <a
                  href={offering.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {offering.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
            {offering.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>{offering.address}</span>
              </div>
            )}
            {offering.baggageAllowance && (
              <div className="flex items-center gap-2">
                <Luggage className="h-4 w-4 text-blue-500" />
                <span>Baggage: {offering.baggageAllowance}</span>
              </div>
            )}
            {offering.isRefundable !== undefined && (
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-blue-500" />
                <span>{offering.isRefundable ? "Refundable" : "Non-refundable"}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

