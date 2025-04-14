"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Search,
  Star,
  Home,
  Building2,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  X,
  Check,
  Phone,
  Percent,
  CalendarClock,
  Flame,
  Wifi,
  ParkingMeterIcon as Parking,
  Bath,
  Sofa,
  Loader2,
  Filter,
  ArrowUpDown,
  Building,
  LandPlot,
  Key,
  Sparkles,
  Minus,
  Plus,
  Maximize2,
  BedDouble,
  DoorOpen,
  Waves,
  Dumbbell,
  Car,
  ShieldCheck,
  Leaf,
  User,
  Mail,
  Calendar,
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
import MostPreferredBadge from "@/components/most-preferred-badge"
import TrendingPopularSection from "@/components/TrendingPopularSection"
import { trendingProducts, popularProducts } from "./trending-data"
import Link from "next/link"


// Types
interface Price {
  amount: number
  currency: string
}

interface RealEstateData {
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
  isNew?: boolean
  isPopular?: boolean
  dateAdded: string
  rating?: number
  reviewCount?: number
  features?: string[]
  amenities?: string[]
  size?: {
    value: number
    unit: string
  }
  bedrooms?: number
  bathrooms?: number
  yearBuilt?: number
  availableUnits?: number
  totalUnits?: number
  tags?: string[]
  hotDealEnds?: string
  discount?: number
  vendorId: number | string
  isHotDeal?: boolean
  isTrending?: boolean
  isAlmostSoldOut?: boolean
  contactNumber?: string
  website?: string
  address?: string
  agent?: string
  agentPhone?: string
  agentEmail?: string
  propertyType?: string
  furnished?: boolean
  parkingSpaces?: number
  landSize?: {
    value: number
    unit: string
  }
}

interface Vendor {
  id: number | string
  name: string
  location: string
  logo: string
  description: string
  offerings: RealEstateData[]
  redirectUrl: string
  mapLink: string
  defaultCurrency: string
  rating?: number
  reviewCount?: number
  establishedYear?: number
  contactNumber?: string
  email?: string
  verified?:boolean
  website?: string
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
    case "residential":
      return <Home size={size} />
    case "commercial":
      return <Building2 size={size} />
    case "land":
      return <LandPlot size={size} />
    case "rental":
      return <Key size={size} />
    default:
      return <Building size={size} />
  }
}

// Define categories
const categories: Category[] = [
  {
    id: "residential",
    name: "Residential",
    icon: <Home className="mr-2" />,
    subcategories: ["Houses", "Apartments", "Condos", "Villas"],
  },
  {
    id: "commercial",
    name: "Commercial",
    icon: <Building2 className="mr-2" />,
    subcategories: ["Offices", "Retail", "Industrial", "Warehouses"],
  },
  {
    id: "land",
    name: "Land",
    icon: <LandPlot className="mr-2" />,
    subcategories: ["Plots", "Farms", "Development", "Beachfront"],
  },
  {
    id: "rental",
    name: "Rental",
    icon: <Key className="mr-2" />,
    subcategories: ["Short-term", "Long-term", "Vacation", "Corporate"],
  },
]

// Mock data for vendors and offerings
const mockVendors: Vendor[] = [
  // Residential
  {
    id: 1,
    name: "Skyline Properties",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Premier real estate agency specializing in luxury residential properties across Kenya.",
    redirectUrl: "https://skyline-properties.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 356,
    verified:true,
    establishedYear: 2010,
    contactNumber: "+254 712 345 678",
    email: "info@skyline-properties.com",
    website: "https://skyline-properties.com",
    offerings: [
      {
        id: 101,
        name: "Luxury 4-Bedroom Villa with Pool",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 45000000, currency: "KSH" },
        originalPrice: { amount: 50000000, currency: "KSH" },
        category: "Residential",
        subcategory: "Villas",
        description:
          "Stunning 4-bedroom villa in a secure gated community. Features include a private swimming pool, landscaped garden, modern kitchen, and spacious living areas. Perfect for family living with proximity to international schools.",
        location: "Karen, Nairobi",
        isPopular: true,
        dateAdded: "2025-03-10T10:30:00Z",
        rating: 4.9,
        reviewCount: 28,
        features: ["Gated Community", "Swimming Pool", "Garden", "Modern Kitchen", "Security"],
        amenities: ["Air Conditioning", "Backup Generator", "Staff Quarters", "CCTV", "Electric Fence"],
        size: { value: 350, unit: "sq m" },
        bedrooms: 4,
        bathrooms: 4.5,
        yearBuilt: 2022,
        availableUnits: 1,
        totalUnits: 1,
        tags: ["Luxury", "Family Home", "Swimming Pool", "Garden"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 1,
        contactNumber: "+254 712 345 678",
        website: "https://skyline-properties.com",
        address: "Karen Road, Karen, Nairobi",
        agent: "Sarah Kimani",
        agentPhone: "+254 712 345 679",
        agentEmail: "sarah@skyline-properties.com",
        propertyType: "Villa",
        furnished: true,
        parkingSpaces: 3,
        landSize: { value: 0.5, unit: "acre" },
      },
      {
        id: 102,
        name: "Modern 3-Bedroom Apartment with City View",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 28000000, currency: "KSH" },
        originalPrice: { amount: 32000000, currency: "KSH" },
        category: "Residential",
        subcategory: "Apartments",
        description:
          "Contemporary 3-bedroom apartment in a high-rise building with panoramic city views. Features include an open-plan kitchen, spacious balcony, and access to shared amenities like a gym and rooftop pool.",
        location: "Westlands, Nairobi",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.8,
        reviewCount: 16,
        features: ["City View", "Balcony", "Open-Plan Kitchen", "High Floor", "Elevator"],
        amenities: ["Gym", "Swimming Pool", "24/7 Security", "Parking", "Visitor Lounge"],
        size: { value: 180, unit: "sq m" },
        bedrooms: 3,
        bathrooms: 2,
        yearBuilt: 2023,
        availableUnits: 2,
        totalUnits: 5,
        tags: ["Modern", "City View", "High-Rise", "Investment"],
        vendorId: 1,
        isTrending: true,
        contactNumber: "+254 712 345 678",
        website: "https://skyline-properties.com",
        address: "Westlands Road, Westlands, Nairobi",
        agent: "David Ochieng",
        agentPhone: "+254 712 345 680",
        agentEmail: "david@skyline-properties.com",
        propertyType: "Apartment",
        furnished: false,
        parkingSpaces: 2,
      },
    ],
  },
  {
    id: 2,
    name: "Coastal Homes Realty",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Specialized in beachfront and coastal properties along Kenya's beautiful coastline.",
    redirectUrl: "https://coastalhomes.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 245,
    verified:true,
    establishedYear: 2015,
    contactNumber: "+254 723 456 789",
    email: "info@coastalhomes.co.ke",
    website: "https://coastalhomes.co.ke",
    offerings: [
      {
        id: 201,
        name: "Beachfront 3-Bedroom Villa",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 65000000, currency: "KSH" },
        originalPrice: { amount: 75000000, currency: "KSH" },
        category: "Residential",
        subcategory: "Villas",
        description:
          "Stunning beachfront villa with direct access to the white sands of Diani Beach. Features include a private infinity pool, tropical garden, and panoramic ocean views from all bedrooms.",
        location: "Diani Beach, Mombasa",
        isPopular: true,
        dateAdded: "2025-02-20T10:30:00Z",
        rating: 4.9,
        reviewCount: 32,
        features: ["Beachfront", "Infinity Pool", "Ocean View", "Private Garden", "Outdoor Dining"],
        amenities: ["Air Conditioning", "Solar Power", "Staff Quarters", "Outdoor Shower", "Beach Access"],
        size: { value: 280, unit: "sq m" },
        bedrooms: 3,
        bathrooms: 3,
        yearBuilt: 2020,
        availableUnits: 1,
        totalUnits: 1,
        tags: ["Beachfront", "Luxury", "Vacation Home", "Investment"],
        isAlmostSoldOut: true,
        vendorId: 2,
        contactNumber: "+254 723 456 789",
        website: "https://coastalhomes.co.ke",
        address: "Diani Beach Road, Diani, Mombasa",
        agent: "Omar Hassan",
        agentPhone: "+254 723 456 790",
        agentEmail: "omar@coastalhomes.co.ke",
        propertyType: "Villa",
        furnished: true,
        parkingSpaces: 2,
        landSize: { value: 0.25, unit: "acre" },
      },
      {
        id: 202,
        name: "2-Bedroom Apartment with Sea View",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 18000000, currency: "KSH" },
        originalPrice: { amount: 22000000, currency: "KSH" },
        category: "Residential",
        subcategory: "Apartments",
        description:
          "Modern 2-bedroom apartment with stunning sea views, located just 5 minutes from the beach. Features include a spacious balcony, open-plan living, and access to communal pool and gym.",
        location: "Nyali, Mombasa",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.6,
        reviewCount: 18,
        features: ["Sea View", "Balcony", "Beach Proximity", "Modern Design", "Elevator"],
        amenities: ["Swimming Pool", "Gym", "24/7 Security", "Parking", "Backup Generator"],
        size: { value: 120, unit: "sq m" },
        bedrooms: 2,
        bathrooms: 2,
        yearBuilt: 2023,
        availableUnits: 3,
        totalUnits: 10,
        tags: ["Sea View", "Investment", "Holiday Home", "Rental Potential"],
        hotDealEnds: "2025-04-10T23:59:59Z",
        isHotDeal: true,
        vendorId: 2,
        contactNumber: "+254 723 456 789",
        website: "https://coastalhomes.co.ke",
        address: "Nyali Road, Nyali, Mombasa",
        agent: "Fatima Ali",
        agentPhone: "+254 723 456 791",
        agentEmail: "fatima@coastalhomes.co.ke",
        propertyType: "Apartment",
        furnished: false,
        parkingSpaces: 1,
      },
    ],
  },

  // Commercial
  {
    id: 3,
    name: "Business Space Solutions",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Specialized in commercial real estate for businesses of all sizes, from startups to corporations.",
    redirectUrl: "https://businessspace.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.9,
    reviewCount: 178,
    verified:true,
    establishedYear: 2012,
    contactNumber: "+254 734 567 890",
    email: "info@businessspace.co.ke",
    website: "https://businessspace.co.ke",
    offerings: [
      {
        id: 301,
        name: "Prime Office Space in Business District",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 85000000, currency: "KSH" },
        originalPrice: { amount: 95000000, currency: "KSH" },
        category: "Commercial",
        subcategory: "Offices",
        description:
          "Premium office space in Nairobi's central business district. The building features modern architecture, flexible floor plans, and state-of-the-art facilities. Perfect for corporate headquarters or regional offices.",
        location: "Upper Hill, Nairobi",
        isPopular: true,
        dateAdded: "2025-03-05T10:30:00Z",
        rating: 4.9,
        reviewCount: 24,
        features: ["Prime Location", "Flexible Floor Plan", "Modern Architecture", "High Ceilings", "Fiber Internet"],
        amenities: ["24/7 Access", "Conference Rooms", "Parking", "Security", "Backup Power"],
        size: { value: 500, unit: "sq m" },
        yearBuilt: 2021,
        availableUnits: 2,
        totalUnits: 10,
        tags: ["Office Space", "Business District", "Corporate", "Investment"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 3,
        isTrending: true,
        contactNumber: "+254 734 567 890",
        website: "https://businessspace.co.ke",
        address: "Upper Hill Road, Upper Hill, Nairobi",
        agent: "James Mwangi",
        agentPhone: "+254 734 567 891",
        agentEmail: "james@businessspace.co.ke",
        propertyType: "Office",
        parkingSpaces: 10,
      },
      {
        id: 302,
        name: "Retail Space in Shopping Mall",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 35000000, currency: "KSH" },
        originalPrice: { amount: 40000000, currency: "KSH" },
        category: "Commercial",
        subcategory: "Retail",
        description:
          "Prime retail space in a popular shopping mall with high foot traffic. The unit is located on the ground floor with excellent visibility and frontage. Ideal for retail businesses looking for exposure.",
        location: "Westlands, Nairobi",
        isNew: true,
        dateAdded: "2025-03-12T10:30:00Z",
        rating: 4.7,
        reviewCount: 15,
        features: ["High Foot Traffic", "Ground Floor", "Corner Unit", "Large Display Windows", "Mall Amenities"],
        amenities: ["Central AC", "Security", "Shared Restrooms", "Loading Area", "Customer Parking"],
        size: { value: 150, unit: "sq m" },
        yearBuilt: 2019,
        availableUnits: 3,
        totalUnits: 50,
        tags: ["Retail", "Shopping Mall", "Business", "Investment"],
        vendorId: 3,
        contactNumber: "+254 734 567 890",
        website: "https://businessspace.co.ke",
        address: "Westlands Mall, Westlands, Nairobi",
        agent: "Lucy Njeri",
        agentPhone: "+254 734 567 892",
        agentEmail: "lucy@businessspace.co.ke",
        propertyType: "Retail",
        parkingSpaces: 2,
      },
    ],
  },
  {
    id: 4,
    name: "Industrial Property Experts",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Specialists in industrial properties, warehouses, and manufacturing facilities across Kenya.",
    redirectUrl: "https://industrialproperty.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 132,
    verified:true,
    establishedYear: 2014,
    contactNumber: "+254 745 678 901",
    email: "info@industrialproperty.co.ke",
    website: "https://industrialproperty.co.ke",
    offerings: [
      {
        id: 401,
        name: "Modern Warehouse with Office Space",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 120000000, currency: "KSH" },
        originalPrice: { amount: 135000000, currency: "KSH" },
        category: "Commercial",
        subcategory: "Warehouses",
        description:
          "Spacious warehouse with attached office space in Nairobi's industrial area. Features include high ceilings, loading bays, ample parking, and modern office facilities. Ideal for logistics, manufacturing, or distribution businesses.",
        location: "Industrial Area, Nairobi",
        isPopular: true,
        dateAdded: "2025-02-25T10:30:00Z",
        rating: 4.8,
        reviewCount: 19,
        features: ["Loading Bays", "High Ceilings", "Office Space", "Security Fence", "Wide Access Roads"],
        amenities: ["CCTV", "Security Guards", "Staff Facilities", "Parking", "Fiber Internet"],
        size: { value: 2000, unit: "sq m" },
        yearBuilt: 2020,
        availableUnits: 1,
        totalUnits: 1,
        tags: ["Warehouse", "Industrial", "Logistics", "Manufacturing"],
        vendorId: 4,
        contactNumber: "+254 745 678 901",
        website: "https://industrialproperty.co.ke",
        address: "Enterprise Road, Industrial Area, Nairobi",
        agent: "Robert Maina",
        agentPhone: "+254 745 678 902",
        agentEmail: "robert@industrialproperty.co.ke",
        propertyType: "Warehouse",
        parkingSpaces: 20,
        landSize: { value: 0.75, unit: "acre" },
      },
      {
        id: 402,
        name: "Manufacturing Facility with Infrastructure",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 180000000, currency: "KSH" },
        originalPrice: { amount: 200000000, currency: "KSH" },
        category: "Commercial",
        subcategory: "Industrial",
        description:
          "Fully equipped manufacturing facility with existing infrastructure including power substations, water treatment, and specialized equipment areas. Includes office space, staff facilities, and ample parking.",
        location: "Athi River, Machakos",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.7,
        reviewCount: 11,
        features: ["Power Substation", "Water Treatment", "Loading Docks", "Staff Facilities", "Security"],
        amenities: ["CCTV", "Canteen", "Parking", "Backup Generator", "Waste Management"],
        size: { value: 5000, unit: "sq m" },
        yearBuilt: 2018,
        availableUnits: 1,
        totalUnits: 1,
        tags: ["Manufacturing", "Industrial", "Factory", "Production"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        isAlmostSoldOut: true,
        vendorId: 4,
        contactNumber: "+254 745 678 901",
        website: "https://industrialproperty.co.ke",
        address: "EPZ Road, Athi River, Machakos",
        agent: "Jane Kamau",
        agentPhone: "+254 745 678 903",
        agentEmail: "jane@industrialproperty.co.ke",
        propertyType: "Manufacturing",
        parkingSpaces: 50,
        landSize: { value: 2, unit: "acres" },
      },
    ],
  },

  // Land
  {
    id: 5,
    name: "Prime Land Investments",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Specialists in land acquisition and development opportunities across Kenya.",
    redirectUrl: "https://primeland.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 203,
    verified:true,
    establishedYear: 2011,
    contactNumber: "+254 756 789 012",
    email: "info@primeland.co.ke",
    website: "https://primeland.co.ke",
    offerings: [
      {
        id: 501,
        name: "Prime Development Land in Karen",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 150000000, currency: "KSH" },
        originalPrice: { amount: 180000000, currency: "KSH" },
        category: "Land",
        subcategory: "Development",
        description:
          "Rare opportunity to acquire prime development land in Karen. The plot is flat, ready for development, and has all necessary approvals. Ideal for luxury residential development, institution, or commercial project.",
        location: "Karen, Nairobi",
        isPopular: true,
        dateAdded: "2025-03-08T10:30:00Z",
        rating: 4.9,
        reviewCount: 15,
        features: ["Prime Location", "Ready for Development", "All Approvals", "Flat Terrain", "Corner Plot"],
        amenities: ["Road Access", "Electricity", "Water", "Sewer Connection", "Boundary Wall"],
        landSize: { value: 2, unit: "acres" },
        availableUnits: 1,
        totalUnits: 1,
        tags: ["Development", "Investment", "Prime Location", "Residential Potential"],
        hotDealEnds: "2025-04-08T23:59:59Z",
        isHotDeal: true,
        isTrending: true,
        vendorId: 5,
        contactNumber: "+254 756 789 012",
        website: "https://primeland.co.ke",
        address: "Karen Road, Karen, Nairobi",
        agent: "Peter Njoroge",
        agentPhone: "+254 756 789 013",
        agentEmail: "peter@primeland.co.ke",
        propertyType: "Land",
      },
      {
        id: 502,
        name: "Agricultural Land with Water Rights",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 45000000, currency: "KSH" },
        originalPrice: { amount: 50000000, currency: "KSH" },
        category: "Land",
        subcategory: "Farms",
        description:
          "Productive agricultural land with water rights from a perennial river. The property includes some basic infrastructure such as a farm house, storage facilities, and irrigation systems. Perfect for commercial farming.",
        location: "Nanyuki, Laikipia",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.7,
        reviewCount: 9,
        features: ["Water Rights", "Fertile Soil", "Existing Infrastructure", "Road Access", "Fenced"],
        amenities: ["Farm House", "Storage Facilities", "Irrigation System", "Electricity", "Borehole"],
        landSize: { value: 50, unit: "acres" },
        availableUnits: 1,
        totalUnits: 1,
        tags: ["Agricultural", "Farming", "Investment", "Water Rights"],
        vendorId: 5,
        contactNumber: "+254 756 789 012",
        website: "https://primeland.co.ke",
        address: "Nanyuki-Rumuruti Road, Nanyuki, Laikipia",
        agent: "Mary Wanjiku",
        agentPhone: "+254 756 789 014",
        agentEmail: "mary@primeland.co.ke",
        propertyType: "Agricultural Land",
      },
    ],
  },
  {
    id: 6,
    name: "Coastal Land Holdings",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Specialists in coastal and beachfront land parcels along Kenya's beautiful coastline.",
    redirectUrl: "https://coastalland.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.6,
    reviewCount: 167,
    establishedYear: 2016,
    contactNumber: "+254 767 890 123",
    email: "info@coastalland.co.ke",
    website: "https://coastalland.co.ke",
    offerings: [
      {
        id: 601,
        name: "Beachfront Land Parcel",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 85000000, currency: "KSH" },
        originalPrice: { amount: 95000000, currency: "KSH" },
        category: "Land",
        subcategory: "Beachfront",
        description:
          "Rare opportunity to acquire beachfront land with direct access to the pristine white sands of Diani Beach. The plot has all necessary approvals for development and is ideal for a luxury beach home or boutique resort.",
        location: "Diani Beach, Kwale",
        isPopular: true,
        dateAdded: "2025-02-28T10:30:00Z",
        rating: 4.8,
        reviewCount: 12,
        features: ["Beachfront", "Direct Beach Access", "White Sand", "Development Approvals", "Flat Terrain"],
        amenities: ["Road Access", "Electricity", "Water Connection", "Security", "Nearby Amenities"],
        landSize: { value: 1, unit: "acre" },
        availableUnits: 1,
        totalUnits: 1,
        tags: ["Beachfront", "Investment", "Development", "Tourism Potential"],
        vendorId: 6,
        contactNumber: "+254 767 890 123",
        website: "https://coastalland.co.ke",
        address: "Diani Beach Road, Diani, Kwale",
        agent: "Hassan Omar",
        agentPhone: "+254 767 890 124",
        agentEmail: "hassan@coastalland.co.ke",
        propertyType: "Land",
      },
      {
        id: 602,
        name: "Development Land with Ocean View",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 35000000, currency: "KSH" },
        originalPrice: { amount: 40000000, currency: "KSH" },
        category: "Land",
        subcategory: "Development",
        description:
          "Elevated land parcel with stunning ocean views, located just 5 minutes from the beach. Perfect for developing a residential complex, holiday villas, or a boutique hotel with excellent rental potential.",
        location: "Nyali, Mombasa",
        isNew: true,
        dateAdded: "2025-03-20T10:30:00Z",
        rating: 4.6,
        reviewCount: 8,
        features: ["Ocean View", "Elevated Position", "Near Beach", "Development Potential", "Good Access"],
        amenities: ["Road Access", "Electricity", "Water Connection", "Boundary Markers", "Security"],
        landSize: { value: 1.5, unit: "acres" },
        availableUnits: 1,
        totalUnits: 1,
        tags: ["Ocean View", "Development", "Investment", "Tourism"],
        hotDealEnds: "2025-04-20T23:59:59Z",
        isHotDeal: true,
        vendorId: 6,
        contactNumber: "+254 767 890 123",
        website: "https://coastalland.co.ke",
        address: "Nyali Hills, Nyali, Mombasa",
        agent: "Amina Said",
        agentPhone: "+254 767 890 125",
        agentEmail: "amina@coastalland.co.ke",
        propertyType: "Land",
      },
    ],
  },

  // Rental
  {
    id: 7,
    name: "Executive Rentals Kenya",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Specializing in high-end rental properties for executives, expatriates, and discerning tenants.",
    redirectUrl: "https://executiverentals.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.9,
    reviewCount: 215,
    verified:true,
    establishedYear: 2013,
    contactNumber: "+254 778 901 234",
    email: "info@executiverentals.co.ke",
    website: "https://executiverentals.co.ke",
    offerings: [
      {
        id: 701,
        name: "Luxury 4-Bedroom Townhouse for Rent",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 350000, currency: "KSH" },
        originalPrice: { amount: 400000, currency: "KSH" },
        category: "Rental",
        subcategory: "Long-term",
        description:
          "Elegant 4-bedroom townhouse in a secure gated community. Fully furnished with high-end finishes, modern kitchen, spacious living areas, and a private garden. Includes housekeeping services and 24/7 security.",
        location: "Lavington, Nairobi",
        isPopular: true,
        dateAdded: "2025-03-01T10:30:00Z",
        rating: 5.0,
        reviewCount: 18,
        features: ["Fully Furnished", "Private Garden", "Modern Kitchen", "Housekeeping", "Secure Community"],
        amenities: ["Swimming Pool", "Gym", "Backup Generator", "High-Speed Internet", "Parking"],
        size: { value: 250, unit: "sq m" },
        bedrooms: 4,
        bathrooms: 3.5,
        yearBuilt: 2020,
        availableUnits: 1,
        totalUnits: 1,
        tags: ["Luxury", "Executive", "Long-term", "Furnished"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        isTrending: true,
        vendorId: 7,
        contactNumber: "+254 778 901 234",
        website: "https://executiverentals.co.ke",
        address: "Lavington Green, Lavington, Nairobi",
        agent: "Elizabeth Wangari",
        agentPhone: "+254 778 901 235",
        agentEmail: "elizabeth@executiverentals.co.ke",
        propertyType: "Townhouse",
        furnished: true,
        parkingSpaces: 2,
      },
      {
        id: 702,
        name: "Corporate Apartment in Business District",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 180000, currency: "KSH" },
        originalPrice: { amount: 200000, currency: "KSH" },
        category: "Rental",
        subcategory: "Corporate",
        description:
          "Modern 2-bedroom apartment specifically designed for corporate clients. Fully furnished with business amenities including high-speed internet, workspace, and meeting facilities in the building. Flexible lease terms available.",
        location: "Upper Hill, Nairobi",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.8,
        reviewCount: 12,
        features: ["Business Amenities", "Workspace", "High-Speed Internet", "Flexible Lease", "Modern Design"],
        amenities: ["Meeting Rooms", "Business Center", "Gym", "Secure Parking", "Concierge"],
        size: { value: 120, unit: "sq m" },
        bedrooms: 2,
        bathrooms: 2,
        yearBuilt: 2022,
        availableUnits: 3,
        totalUnits: 10,
        tags: ["Corporate", "Business", "Furnished", "Flexible"],
        vendorId: 7,
        contactNumber: "+254 778 901 234",
        website: "https://executiverentals.co.ke",
        address: "Upper Hill Towers, Upper Hill, Nairobi",
        agent: "John Kamau",
        agentPhone: "+254 778 901 236",
        agentEmail: "john@executiverentals.co.ke",
        propertyType: "Apartment",
        furnished: true,
        parkingSpaces: 1,
      },
    ],
  },
  {
    id: 8,
    name: "Holiday Homes Kenya",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Offering premium vacation rentals and holiday homes along Kenya's coast and in safari destinations.",
    redirectUrl: "https://holidayhomes.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 183,
    verified:true,
    establishedYear: 2017,
    contactNumber: "+254 789 012 345",
    email: "info@holidayhomes.co.ke",
    website: "https://holidayhomes.co.ke",
    offerings: [
      {
        id: 801,
        name: "Luxury Beach Villa for Vacation Rental",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 35000, currency: "KSH" },
        originalPrice: { amount: 45000, currency: "KSH" },
        category: "Rental",
        subcategory: "Vacation",
        description:
          "Stunning beach villa for short-term vacation rental. Features include 4 bedrooms, private pool, direct beach access, and panoramic ocean views. Comes with full staff including chef, housekeeping, and security.",
        location: "Watamu, Kilifi",
        isPopular: true,
        dateAdded: "2025-02-25T10:30:00Z",
        rating: 4.9,
        reviewCount: 42,
        features: ["Beachfront", "Private Pool", "Full Staff", "Ocean Views", "Luxury Finishes"],
        amenities: ["Chef", "Housekeeping", "Security", "Beach Equipment", "Outdoor Dining"],
        size: { value: 300, unit: "sq m" },
        bedrooms: 4,
        bathrooms: 4,
        yearBuilt: 2019,
        availableUnits: 1,
        totalUnits: 1,
        tags: ["Vacation", "Luxury", "Beachfront", "Family"],
        vendorId: 8,
        contactNumber: "+254 789 012 345",
        website: "https://holidayhomes.co.ke",
        address: "Watamu Beach Road, Watamu, Kilifi",
        agent: "Grace Mwende",
        agentPhone: "+254 789 012 346",
        agentEmail: "grace@holidayhomes.co.ke",
        propertyType: "Villa",
        furnished: true,
        parkingSpaces: 3,
      },
      {
        id: 802,
        name: "Safari Lodge Rental in Maasai Mara",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 25000, currency: "KSH" },
        originalPrice: { amount: 30000, currency: "KSH" },
        category: "Rental",
        subcategory: "Vacation",
        description:
          "Exclusive safari lodge available for short-term rental in the Maasai Mara. Includes 3 luxury tents with en-suite bathrooms, common dining area, and viewing deck. Package includes meals, game drives, and local guides.",
        location: "Maasai Mara, Narok",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.8,
        reviewCount: 28,
        features: ["Wildlife Views", "Luxury Tents", "All-Inclusive", "Game Drives", "Local Guides"],
        amenities: ["Meals Included", "Viewing Deck", "Solar Power", "Hot Water", "Wifi"],
        bedrooms: 3,
        bathrooms: 3,
        yearBuilt: 2021,
        availableUnits: 1,
        totalUnits: 1,
        tags: ["Safari", "Vacation", "Wildlife", "Adventure"],
        hotDealEnds: "2025-04-18T23:59:59Z",
        isHotDeal: true,
        isAlmostSoldOut: true,
        vendorId: 8,
        contactNumber: "+254 789 012 345",
        website: "https://holidayhomes.co.ke",
        address: "Maasai Mara Game Reserve, Narok",
        agent: "Daniel Lekishon",
        agentPhone: "+254 789 012 347",
        agentEmail: "daniel@holidayhomes.co.ke",
        propertyType: "Safari Lodge",
        furnished: true,
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

export default function RealEstatePage() {
  useCookieTracking("real-estate")

  // State for vendors and offerings
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors)
  const [newOfferingAlert, setNewOfferingAlert] = useState<RealEstateData | null>(null)
  const [swapTrigger, setSwapTrigger] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  // State for active category and subcategory
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [activeSubcategory, setActiveSubcategory] = useState<string>("")

  // State for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000000])
  const [sortOrder, setSortOrder] = useState("default")
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([])

  // State for offering detail modal
  const [selectedOffering, setSelectedOffering] = useState<RealEstateData | null>(null)

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
      colors: ["#0ea5e9", "#0284c7", "#0c4a6e"], // Blue colors for real estate
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

// Custom color scheme for travelling
const realestateColorScheme = {
  primary: "from-purple-500 to-indigo-700",
  secondary: "bg-purple-100",
  accent: "bg-indigo-600",
  text: "text-purple-900",
  background: "bg-purple-50",
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
    <div className="bg-gradient-to-br from-sky-500 via-blue-400 to-emerald-500 min-h-screen">
      {/* Decorative real estate-themed elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-800 to-emerald-800 opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-800 to-blue-800 opacity-20"></div>

      {/* IMPROVEMENT: Added max-width to container to prevent excessive stretching on ultra-wide screens */}
      <div className="container mx-auto px-4 py-12 max-w-[1920px] relative z-10">
        {/* Luxury header with blue accents */}
        <div className="text-center mb-10 bg-gradient-to-r from-blue-900/80 via-sky-800/80 to-emerald-900/80 p-8 rounded-2xl shadow-2xl border border-blue-300/30 backdrop-blur-sm">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-blue-100">Premium Real Estate Deals</h1>

          {/* Five golden stars */}
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-8 w-8 text-blue-300 fill-blue-300 mx-1" />
            ))}
          </div>

          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Discover exceptional properties and investment opportunities across Kenya
          </p>
        </div>

        {/* New Offering Alert */}
        <AnimatePresence>
          {newOfferingAlert && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed bottom-6 right-6 z-50 max-w-md"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-blue-200">
                <div className="bg-gradient-to-r from-blue-500 to-sky-500 px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 text-white mr-2" />
                    <h3 className="text-white font-bold">New Property Listed!</h3>
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
                    <p className="text-sm text-gray-600 mb-2">{newOfferingAlert.location}</p>
                    <div className="flex items-center">
                      <span className="text-blue-600 font-bold mr-2">{formatPrice(newOfferingAlert.currentPrice)}</span>
                      <Badge className="bg-blue-100 text-blue-800">New Listing</Badge>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white"
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
        </AnimatePresence>

        {/* Countdown Timer */}
        <div className="mb-8">
          <CountdownTimer targetDate="2025-05-31T23:59:59" startDate="2025-03-01T00:00:00" />
        </div>

        {/* Hot Time Deals Section */}
        {hotDeals.length > 0 && (
          <HotTimeDeals
            deals={hotDeals}
            colorScheme="blue"
            title="Limited Time Property Offers"
            subtitle="Exclusive deals on premium properties - act fast before they're gone!"
          />
        )}

        {/* New Products For You Section */}
        <NewProductsForYou allProducts={newProducts} colorScheme="blue" maxProducts={4} />
 {/* Trending and Popular Section */}
<TrendingPopularSection
        trendingProducts={trendingProducts}
        popularProducts={popularProducts}
        colorScheme={realestateColorScheme}
        title="Best RealEstate Companies Today!"
        subtitle="Discover  most popular Real Estate Agents or Companies"
      />
 {/*the shop logic*/}
 <div className="flex justify-center my-8">
      <Link href="/real-estate/shop">
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
            <DoorOpen className="mr-2 h-5 w-5" />
            Explore Real Estate Shop
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
 {/*the shop logic*/}
 <div className="flex justify-center my-8">
      <Link href="/real-estate/media">
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
            <DoorOpen className="mr-2 h-5 w-5" />
            Explore Real Estate Media
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
        <div className="mb-10 bg-gradient-to-r from-blue-900/70 via-sky-800/70 to-blue-900/70 p-6 rounded-xl shadow-lg border border-blue-300/30 backdrop-blur-sm">
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Search for properties, locations, features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-full border-blue-400 bg-blue-50/90 backdrop-blur-sm text-blue-900 placeholder:text-blue-500/70 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
          </div>

          {/* Category tabs */}
          <Tabs defaultValue={activeCategory} value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
            <TabsList className="bg-blue-800/50 p-1 rounded-xl mb-4 flex flex-nowrap overflow-x-auto hide-scrollbar">
              <TabsTrigger
                value=""
                onClick={() => setActiveCategory("")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === "" ? "bg-blue-500 text-white shadow-sm" : "text-blue-100 hover:bg-blue-700/50"
                }`}
              >
                <Building className="h-4 w-4" />
                <span>All Properties</span>
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  onClick={() => {
                    setActiveCategory(category.id)
                    setActiveSubcategory("")
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-blue-100 hover:bg-blue-700/50"
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Subcategory tabs */}
            {activeCategory && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-white">Subcategories</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={activeSubcategory === "" ? "default" : "outline"}
                    className={`cursor-pointer ${
                      activeSubcategory === ""
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-transparent border-blue-300 text-blue-100 hover:bg-blue-700/50"
                    }`}
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
                          activeSubcategory === subcategory
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-transparent border-blue-300 text-blue-100 hover:bg-blue-700/50"
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
              <h3 className="font-semibold mb-2 text-white">
                Price Range: {formatPrice({ amount: priceRange[0], currency: "KSH" })} -{" "}
                {formatPrice({ amount: priceRange[1], currency: "KSH" })}
              </h3>
              <div className="px-2 py-4">
                <Slider
                  defaultValue={[0, 200000000]}
                  max={200000000}
                  step={1000000}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="w-full"
                />
              </div>
            </div>

            {/* Sort options and results count */}
            <div className="flex flex-wrap justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-300" />
                <span className="text-sm text-blue-200">
                  {filteredVendors.reduce(
                    (count, vendor) =>
                      count +
                      vendor.offerings.filter(
                        (offering) =>
                          (!activeCategory || offering.category.toLowerCase() === activeCategory.toLowerCase()) &&
                          (!activeSubcategory ||
                            offering.subcategory.toLowerCase() === activeSubcategory.toLowerCase()),
                      ).length,
                    0,
                  )}{" "}
                  properties found
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-200">Sort by:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="p-2 border rounded-md text-sm bg-blue-800 border-blue-600 text-blue-100"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest First</option>
                </select>
                <ArrowUpDown className="h-4 w-4 text-blue-300" />
              </div>
            </div>
          </Tabs>
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
            <div className="bg-gradient-to-r from-blue-900/70 via-sky-800/70 to-blue-900/70 p-8 text-center rounded-lg shadow-md border border-blue-300/30 backdrop-blur-sm">
              <p className="text-blue-100 text-lg">No properties found matching your criteria.</p>
              <p className="text-blue-200 mt-2">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center bg-blue-900/80 p-6 rounded-full backdrop-blur-sm">
              <Loader2 className="h-10 w-10 animate-spin text-blue-300" />
              <p className="mt-2 text-blue-200 font-medium">Loading more properties...</p>
            </div>
          </div>
        )}

        {/* Loader reference element */}
        <div ref={loaderRef} className="h-20"></div>
      </div>

      {/* Offering Detail Modal */}
      <Dialog open={!!selectedOffering} onOpenChange={() => setSelectedOffering(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-r from-blue-900/90 via-sky-800/90 to-blue-900/90 border border-blue-300/30 text-white backdrop-blur-sm">
          {selectedOffering && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Offering image */}
                <div className="relative h-64 md:h-full rounded-lg overflow-hidden bg-blue-800/50">
                  <Image
                    src={selectedOffering.imageUrl || "/placeholder.svg"}
                    alt={selectedOffering.name}
                    layout="fill"
                    objectFit="cover"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {selectedOffering.isTrending && (
                      <Badge className="bg-orange-500 text-white flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        <span>Trending</span>
                      </Badge>
                    )}
                    {selectedOffering.isPopular && <MostPreferredBadge colorScheme="blue" size="sm" />}
                  </div>
                </div>

                {/* Offering details */}
                <div className="flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-blue-100 mb-2">{selectedOffering.name}</h3>
                    <div className="flex items-center text-blue-200 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{selectedOffering.location}</span>
                    </div>
                    <p className="text-blue-100">{selectedOffering.description}</p>
                  </div>

                  {/* Property details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {selectedOffering.size && (
                      <div className="flex items-center text-blue-200">
                        <Maximize2 className="h-4 w-4 mr-2 text-blue-300" />
                        <span>
                          {selectedOffering.size.value} {selectedOffering.size.unit}
                        </span>
                      </div>
                    )}
                    {selectedOffering.bedrooms && (
                      <div className="flex items-center text-blue-200">
                        <BedDouble className="h-4 w-4 mr-2 text-blue-300" />
                        <span>{selectedOffering.bedrooms} Bedrooms</span>
                      </div>
                    )}
                    {selectedOffering.bathrooms && (
                      <div className="flex items-center text-blue-200">
                        <Bath className="h-4 w-4 mr-2 text-blue-300" />
                        <span>{selectedOffering.bathrooms} Bathrooms</span>
                      </div>
                    )}
                    {selectedOffering.yearBuilt && (
                      <div className="flex items-center text-blue-200">
                        <Building className="h-4 w-4 mr-2 text-blue-300" />
                        <span>Built in {selectedOffering.yearBuilt}</span>
                      </div>
                    )}
                    {selectedOffering.parkingSpaces && (
                      <div className="flex items-center text-blue-200">
                        <Car className="h-4 w-4 mr-2 text-blue-300" />
                        <span>{selectedOffering.parkingSpaces} Parking Spaces</span>
                      </div>
                    )}
                    {selectedOffering.landSize && (
                      <div className="flex items-center text-blue-200">
                        <LandPlot className="h-4 w-4 mr-2 text-blue-300" />
                        <span>
                          {selectedOffering.landSize.value} {selectedOffering.landSize.unit}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-blue-100 mb-2">Key Features</h3>
                    <ul className="list-disc list-inside text-blue-200 space-y-1">
                      {selectedOffering.features?.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Amenities */}
                  {selectedOffering.amenities && selectedOffering.amenities.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-blue-100 mb-2">Amenities</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedOffering.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center text-blue-200">
                            {amenity.toLowerCase().includes("wifi") ? (
                              <Wifi className="h-4 w-4 mr-2 text-blue-300" />
                            ) : amenity.toLowerCase().includes("parking") ? (
                              <Parking className="h-4 w-4 mr-2 text-blue-300" />
                            ) : amenity.toLowerCase().includes("pool") ? (
                              <Waves className="h-4 w-4 mr-2 text-blue-300" />
                            ) : amenity.toLowerCase().includes("gym") ? (
                              <Dumbbell className="h-4 w-4 mr-2 text-blue-300" />
                            ) : amenity.toLowerCase().includes("security") ? (
                              <ShieldCheck className="h-4 w-4 mr-2 text-blue-300" />
                            ) : amenity.toLowerCase().includes("generator") ? (
                              <Leaf className="h-4 w-4 mr-2 text-blue-300" />
                            ) : amenity.toLowerCase().includes("air") ? (
                              <Waves className="h-4 w-4 mr-2 text-blue-300" />
                            ) : amenity.toLowerCase().includes("furniture") ? (
                              <Sofa className="h-4 w-4 mr-2 text-blue-300" />
                            ) : (
                              <DoorOpen className="h-4 w-4 mr-2 text-blue-300" />
                            )}
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Availability */}
                  {selectedOffering.availableUnits !== undefined && selectedOffering.totalUnits !== undefined && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-blue-100 mb-2">Availability</h3>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-blue-200">Available units:</span>
                        <span
                          className={`font-medium ${
                            selectedOffering.availableUnits < selectedOffering.totalUnits * 0.2
                              ? "text-red-400"
                              : selectedOffering.availableUnits < selectedOffering.totalUnits * 0.5
                                ? "text-blue-300"
                                : "text-green-400"
                          }`}
                        >
                          {selectedOffering.availableUnits} of {selectedOffering.totalUnits}
                        </span>
                      </div>
                      <div className="w-full bg-blue-800 rounded-full h-2 mb-4">
                        <div
                          className={`h-2 rounded-full ${
                            selectedOffering.availableUnits < selectedOffering.totalUnits * 0.2
                              ? "bg-red-500"
                              : selectedOffering.availableUnits < selectedOffering.totalUnits * 0.5
                                ? "bg-blue-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${(selectedOffering.availableUnits / selectedOffering.totalUnits) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Quantity selector for rental properties */}
                  {selectedOffering.category === "Rental" && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-blue-100 mb-2">Rental Period</h3>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-l-md border-blue-500 text-blue-200"
                          onClick={() => {}}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="px-4 py-1 bg-blue-800 border-t border-b border-blue-500 text-center min-w-[40px] text-blue-100">
                          1
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-r-md border-blue-500 text-blue-200"
                          onClick={() => {}}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>

                        <div className="ml-4 text-sm text-blue-200">
                          <span>Month(s)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-auto">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-100">
                          {formatPrice(selectedOffering.currentPrice)}
                        </div>
                        {selectedOffering.originalPrice.amount !== selectedOffering.currentPrice.amount && (
                          <div className="text-base text-blue-300 line-through">
                            {formatPrice(selectedOffering.originalPrice)}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-sm text-blue-200 mb-1">Property Type:</div>
                        <div className="font-medium text-blue-100">
                          {selectedOffering.propertyType || selectedOffering.subcategory}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {selectedOffering.originalPrice.amount !== selectedOffering.currentPrice.amount && (
                        <Button
                          variant="outline"
                          className="border-blue-500 text-blue-200 hover:bg-blue-800/50 flex-1 flex items-center justify-center gap-2"
                        >
                          <Percent className="h-4 w-4" />
                          <span>
                            Save{" "}
                            {Math.round(
                              ((selectedOffering.originalPrice.amount - selectedOffering.currentPrice.amount) /
                                selectedOffering.originalPrice.amount) *
                                100,
                            )}
                            %
                          </span>
                        </Button>
                      )}

                      <Button className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white flex-1 flex items-center justify-center gap-2">
                        <CalendarClock className="h-4 w-4" />
                        <span>Schedule Viewing</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent information */}
              <div className="mt-6 pt-4 border-t border-blue-700">
                <h3 className="text-lg font-medium text-blue-100 mb-2">Contact Information</h3>
                <div className="flex flex-col gap-2 text-sm text-blue-200">
                  {selectedOffering.agent && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-300" />
                      <span>Agent: {selectedOffering.agent}</span>
                    </div>
                  )}
                  {selectedOffering.agentPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-300" />
                      <span>{selectedOffering.agentPhone}</span>
                    </div>
                  )}
                  {selectedOffering.agentEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-300" />
                      <span>{selectedOffering.agentEmail}</span>
                    </div>
                  )}
                  {selectedOffering.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-300" />
                      <span>{selectedOffering.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
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
  onOfferingClick: (offering: RealEstateData) => void
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
    <div className="bg-gradient-to-r from-blue-900/70 via-sky-800/70 to-blue-900/70 rounded-xl shadow-lg overflow-hidden border border-blue-300/30 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <Image
                src={imageError ? "/placeholder.svg?height=60&width=60" : vendor.logo}
                alt={vendor.name}
                width={60}
                height={60}
                className="rounded-full border-2 border-blue-300 shadow-md"
                onError={() => setImageError(true)}
              />

         {vendor.verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-blue-100">{vendor.name}</h3>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-blue-300 mr-1" />
                <p className="text-blue-200 text-sm mr-2">{vendor.location}</p>
                {vendor.rating && (
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(vendor.rating || 0) ? "text-blue-300 fill-blue-300" : "text-blue-800"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-blue-200">
                      {vendor.rating.toFixed(1)} ({vendor.reviewCount})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-blue-200 hidden md:block">
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
        <p className="text-blue-100 mb-4 line-clamp-2">{vendor.description}</p>

        {/* Accordion control */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full mt-2 text-sm font-medium text-blue-200 hover:text-blue-100"
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
function OfferingCard({ offering, onClick }: { offering: RealEstateData; onClick: () => void }) {
  const [imageError, setImageError] = useState(false)

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((offering.originalPrice.amount - offering.currentPrice.amount) / offering.originalPrice.amount) * 100,
  )

  return (
    <motion.div
      className="bg-gradient-to-r from-blue-800/80 to-sky-900/80 rounded-lg shadow-sm overflow-hidden flex flex-col h-full border border-blue-500/30 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 backdrop-blur-sm"
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
            className="transition-transform duration-500 hover:scale-110"
            onError={() => setImageError(true)}
          />
        </div>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {discountPercentage >= 10 && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md">
              {discountPercentage}% OFF
            </div>
          )}

          {offering.isNew && (
            <div className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              <span>NEW</span>
            </div>
          )}

          {offering.isTrending && (
            <div className="bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md flex items-center">
              <Flame className="h-3 w-3 mr-1" />
              <span>TRENDING</span>
            </div>
          )}
        </div>

        {/* Most preferred badge */}
        {offering.isPopular && (
          <div className="absolute top-2 left-2">
            <MostPreferredBadge colorScheme="blue" size="sm" />
          </div>
        )}

        {/* Almost sold out badge */}
        {offering.isAlmostSoldOut && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-red-500 text-white flex items-center gap-1 px-2 py-1 text-xs font-medium">
              <Clock className="h-3 w-3" />
              Almost Sold Out
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
          <Badge variant="outline" className="text-xs border-blue-500 text-blue-200">
            {offering.subcategory}
          </Badge>
        </div>

        <h4 className="font-semibold text-blue-100 mb-1 line-clamp-1">{offering.name}</h4>

        <div className="flex items-center text-xs text-blue-200 mb-1">
          <MapPin className="h-3 w-3 mr-1 text-blue-300" />
          {offering.location}
        </div>

        <p className="text-xs text-blue-200 mb-2 line-clamp-2 flex-grow">{offering.description}</p>

        {/* Property details */}
        <div className="flex flex-wrap gap-2 mb-2">
          {offering.bedrooms && (
            <div className="flex items-center text-xs text-blue-200">
              <BedDouble className="h-3 w-3 mr-1 text-blue-300" />
              <span>{offering.bedrooms}</span>
            </div>
          )}
          {offering.bathrooms && (
            <div className="flex items-center text-xs text-blue-200">
              <Bath className="h-3 w-3 mr-1 text-blue-300" />
              <span>{offering.bathrooms}</span>
            </div>
          )}
          {offering.size && (
            <div className="flex items-center text-xs text-blue-200">
              <Maximize2 className="h-3 w-3 mr-1 text-blue-300" />
              <span>
                {offering.size.value} {offering.size.unit}
              </span>
            </div>
          )}
        </div>

        {/* Rating */}
        {offering.rating && (
          <div className="flex items-center mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(offering.rating || 0) ? "text-blue-300 fill-blue-300" : "text-blue-800"
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-blue-200">
              {offering.rating.toFixed(1)} ({offering.reviewCount})
            </span>
          </div>
        )}

        {/* Features */}
        {offering.features && offering.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {offering.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-[10px] border-blue-700 text-blue-300">
                {feature}
              </Badge>
            ))}
            {offering.features.length > 3 && (
              <Badge variant="outline" className="text-[10px] border-blue-700 text-blue-300">
                +{offering.features.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Availability */}
        {offering.availableUnits !== undefined && offering.totalUnits !== undefined && (
          <div className="mb-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Availability:</span>
              <span
                className={`font-medium ${
                  offering.availableUnits < offering.totalUnits * 0.2
                    ? "text-red-400"
                    : offering.availableUnits < offering.totalUnits * 0.5
                      ? "text-blue-300"
                      : "text-green-400"
                }`}
              >
                {offering.availableUnits} of {offering.totalUnits} available
              </span>
            </div>
            <div className="w-full bg-blue-800 rounded-full h-1.5 mt-1">
              <div
                className={`h-1.5 rounded-full ${
                  offering.availableUnits < offering.totalUnits * 0.2
                    ? "bg-red-500"
                    : offering.availableUnits < offering.totalUnits * 0.5
                      ? "bg-blue-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${(offering.availableUnits / offering.totalUnits) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <div className="text-base font-bold text-blue-100">{formatPrice(offering.currentPrice)}</div>
            <div className="text-xs text-blue-300 line-through">{formatPrice(offering.originalPrice)}</div>
          </div>

          <div className="flex gap-1">
            <motion.button
              className="bg-blue-800 text-blue-200 px-2 py-1.5 rounded-md text-xs font-medium flex items-center border border-blue-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                // Save functionality would go here
              }}
            >
              <Percent className="h-3 w-3 mr-1" />
              <span>Save {discountPercentage}%</span>
            </motion.button>

            <motion.button
              className="bg-gradient-to-r from-blue-500 to-sky-500 text-white px-2 py-1.5 rounded-md text-xs font-medium flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                // Schedule viewing functionality would go here
              }}
            >
              <CalendarClock className="h-3 w-3 mr-1" />
              <span>View</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

