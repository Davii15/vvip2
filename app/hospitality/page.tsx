"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Search,
  Star,
  Utensils,
  Hotel,
  Wine,
  Calendar,
  Filter,
  ArrowUpDown,
  Loader2,
  MapPin,
  Clock,
  Coffee,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  X,
  Phone,
  Globe,
  Percent,
  CalendarClock,
  Flame,
  Wifi,
  ParkingMeterIcon as Parking,
  UtensilsCrossed,
  PocketIcon as Pool,
  Dumbbell,
  Tv,
  Check,
  Waves,
  Bed,
  ShoppingBag,
  Minus,
  Plus,
  SpadeIcon as Spa,
  Sparkles,
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
import Link from "next/link"
import TrendingPopularSection from "@/components/TrendingPopularSection"
import { trendingProducts, popularProducts } from "./trending-data"
import { TimeBasedRecommendations } from "@/components/TimeBasedRecommendations"

// Types
interface Price {
  amount: number
  currency: string
}

interface HospitalityData {
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
  checkInTime?: string
  checkOutTime?: string
  address?: string
}

interface Vendor {
  id: number | string
  name: string
  location: string
  logo: string
  description: string
  offerings: HospitalityData[]
  redirectUrl: string
  mapLink: string
  defaultCurrency: string
  rating?: number
  reviewCount?: number
  establishedYear?: number
  contactNumber?: string
  email?: string
  website?: string
  verified?:boolean
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
    case "hotels":
      return <Hotel size={size} />
    case "restaurants":
      return <Utensils size={size} />
    case "bars & lounges":
      return <Wine size={size} />
    case "open caterings":
      return <UtensilsCrossed size={size} />
    default:
      return <Coffee size={size} />
  }
}

// Define categories
const categories: Category[] = [
  {
    id: "hotels",
    name: "Hotels",
    icon: <Hotel className="mr-2" />,
    subcategories: ["Luxury", "Budget", "Boutique", "Resort"],
  },
  {
    id: "restaurants",
    name: "Restaurants",
    icon: <Utensils className="mr-2" />,
    subcategories: ["Fine Dining", "Casual", "Fast Food", "Buffet"],
  },
  {
    id: "bars-lounges",
    name: "Bars & Lounges",
    icon: <Wine className="mr-2" />,
    subcategories: ["Cocktail Bar", "Sports Bar", "Lounge", "Pub"],
  },
  {
    id: "open-caterings",
    name: "Open Caterings",
    icon: <UtensilsCrossed className="mr-2" />,
    subcategories: ["Weddings", "Corporate Events", "Anniversaries", "Parties"],
  },
]

// Mock data for vendors and offerings
const mockVendors: Vendor[] = [
  // Hotels
  {
    id: 1,
    name: "Serene Skyline Hotel",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Experience luxury and comfort with breathtaking city views and world-class amenities.",
    redirectUrl: "https://serene-skyline.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 356,
    verified:true,
    establishedYear: 2015,
    contactNumber: "+254 712 345 678",
    email: "info@serene-skyline.com",
    website: "https://serene-skyline.com",
    offerings: [
      {
        id: 101,
        name: "Deluxe King Room with City View",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 12000, currency: "KSH" },
        originalPrice: { amount: 15000, currency: "KSH" },
        category: "Hotels",
        subcategory: "Luxury",
        description:
          "Spacious deluxe room with king-sized bed, panoramic city views, and modern amenities. Includes complimentary breakfast and access to the rooftop pool.",
        location: "Nairobi CBD",
        isPopular: true,
        dateAdded: "2025-03-10T10:30:00Z",
        rating: 4.9,
        reviewCount: 128,
        features: ["King Bed", "City View", "40 sq m", "Free Breakfast", "Free WiFi"],
        amenities: ["Air Conditioning", "Flat-screen TV", "Mini Bar", "Safe", "Room Service"],
        capacity: 2,
        availableSlots: 3,
        totalSlots: 10,
        tags: ["Luxury", "City View", "Romantic", "Business"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 1,
        contactNumber: "+254 712 345 678",
        website: "https://serene-skyline.com",
        checkInTime: "14:00",
        checkOutTime: "12:00",
        address: "123 Skyline Avenue, Nairobi CBD",
      },
      {
        id: 102,
        name: "Executive Suite with Lounge Access",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 18000, currency: "KSH" },
        originalPrice: { amount: 22000, currency: "KSH" },
        category: "Hotels",
        subcategory: "Luxury",
        description:
          "Luxurious suite with separate living area, executive lounge access, and premium amenities. Perfect for business travelers or those seeking extra space and comfort.",
        location: "Nairobi CBD",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.8,
        reviewCount: 76,
        features: ["King Bed", "Separate Living Area", "60 sq m", "Lounge Access", "Free Breakfast"],
        amenities: ["Air Conditioning", "55-inch TV", "Nespresso Machine", "Premium Toiletries", "Bathrobe & Slippers"],
        capacity: 2,
        availableSlots: 2,
        totalSlots: 5,
        tags: ["Luxury", "Business", "Suite", "Executive"],
        vendorId: 1,
        isTrending: true,
        contactNumber: "+254 712 345 678",
        website: "https://serene-skyline.com",
        checkInTime: "14:00",
        checkOutTime: "12:00",
        address: "123 Skyline Avenue, Nairobi CBD",
      },
    ],
  },
  {
    id: 2,
    name: "Cozy Haven Boutique Hotel",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "A charming boutique hotel offering personalized service and unique rooms in a tranquil setting.",
    redirectUrl: "https://cozyhaven.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 245,
    verified:true,
    establishedYear: 2018,
    contactNumber: "+254 723 456 789",
    email: "stay@cozyhaven.com",
    website: "https://cozyhaven.com",
    offerings: [
      {
        id: 201,
        name: "Ocean View Room with Balcony",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 9500, currency: "KSH" },
        originalPrice: { amount: 12000, currency: "KSH" },
        category: "Hotels",
        subcategory: "Boutique",
        description:
          "Charming room with a private balcony overlooking the Indian Ocean. Uniquely decorated with local artwork and handcrafted furniture.",
        location: "Nyali, Mombasa",
        isPopular: true,
        dateAdded: "2025-02-20T10:30:00Z",
        rating: 4.7,
        reviewCount: 98,
        features: ["Queen Bed", "Ocean View", "30 sq m", "Private Balcony", "Breakfast Included"],
        amenities: ["Air Conditioning", "Free WiFi", "Smart TV", "Mini Fridge", "Tea/Coffee Maker"],
        capacity: 2,
        availableSlots: 1,
        totalSlots: 8,
        tags: ["Boutique", "Ocean View", "Romantic", "Peaceful"],
        isAlmostFullyBooked: true,
        vendorId: 2,
        contactNumber: "+254 723 456 789",
        website: "https://cozyhaven.com",
        checkInTime: "15:00",
        checkOutTime: "11:00",
        address: "45 Beach Road, Nyali, Mombasa",
      },
      {
        id: 202,
        name: "Garden Suite with Private Patio",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 8000, currency: "KSH" },
        originalPrice: { amount: 9500, currency: "KSH" },
        category: "Hotels",
        subcategory: "Boutique",
        description:
          "Peaceful suite surrounded by lush tropical gardens with a private patio. Perfect for relaxation and unwinding in a natural setting.",
        location: "Nyali, Mombasa",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.6,
        reviewCount: 65,
        features: ["King Bed", "Garden View", "35 sq m", "Private Patio", "Breakfast Included"],
        amenities: ["Air Conditioning", "Free WiFi", "Outdoor Shower", "Mini Bar", "Hammock"],
        capacity: 2,
        availableSlots: 4,
        totalSlots: 6,
        tags: ["Boutique", "Garden", "Peaceful", "Nature"],
        hotDealEnds: "2025-04-10T23:59:59Z",
        isHotDeal: true,
        vendorId: 2,
        contactNumber: "+254 723 456 789",
        website: "https://cozyhaven.com",
        checkInTime: "15:00",
        checkOutTime: "11:00",
        address: "45 Beach Road, Nyali, Mombasa",
      },
    ],
  },

  // Restaurants
  {
    id: 3,
    name: "Savory Heights Restaurant",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Fine dining restaurant offering exquisite local and international cuisine with panoramic city views.",
    redirectUrl: "https://savoryheights.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.9,
    reviewCount: 412,
    verified:true,
    establishedYear: 2017,
    contactNumber: "+254 734 567 890",
    email: "reservations@savoryheights.com",
    website: "https://savoryheights.com",
    offerings: [
      {
        id: 301,
        name: "Exclusive 5-Course Dinner Experience",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 6500, currency: "KSH" },
        originalPrice: { amount: 8000, currency: "KSH" },
        category: "Restaurants",
        subcategory: "Fine Dining",
        description:
          "Indulge in a meticulously crafted 5-course dinner featuring seasonal ingredients and innovative cooking techniques. Includes wine pairing by our sommelier.",
        location: "Westlands, Nairobi",
        isPopular: true,
        dateAdded: "2025-03-05T10:30:00Z",
        rating: 4.9,
        reviewCount: 156,
        features: ["5 Courses", "Wine Pairing", "Vegetarian Options", "Private Seating", "City View"],
        capacity: 30,
        availableSlots: 8,
        totalSlots: 30,
        tags: ["Fine Dining", "Romantic", "Special Occasion", "Gourmet"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 3,
        isTrending: true,
        contactNumber: "+254 734 567 890",
        website: "https://savoryheights.com",
        address: "78 Westlands Road, 15th Floor, Nairobi",
      },
      {
        id: 302,
        name: "Weekend Brunch Buffet",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 3500, currency: "KSH" },
        originalPrice: { amount: 4200, currency: "KSH" },
        category: "Restaurants",
        subcategory: "Buffet",
        description:
          "Enjoy our lavish weekend brunch buffet featuring over 50 international and local dishes, live cooking stations, and free-flowing non-alcoholic beverages.",
        location: "Westlands, Nairobi",
        isNew: true,
        dateAdded: "2025-03-12T10:30:00Z",
        rating: 4.8,
        reviewCount: 87,
        features: ["50+ Dishes", "Live Cooking", "Free Beverages", "Dessert Station", "Kids Menu"],
        capacity: 80,
        availableSlots: 25,
        totalSlots: 80,
        tags: ["Buffet", "Brunch", "Family", "Weekend"],
        vendorId: 3,
        contactNumber: "+254 734 567 890",
        website: "https://savoryheights.com",
        address: "78 Westlands Road, 15th Floor, Nairobi",
      },
    ],
  },
  {
    id: 4,
    name: "Coastal Flavors Restaurant",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Authentic coastal cuisine featuring fresh seafood and traditional dishes in a relaxed beachfront setting.",
    redirectUrl: "https://coastalflavors.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 328,
    establishedYear: 2016,
    contactNumber: "+254 745 678 901",
    email: "info@coastalflavors.com",
    website: "https://coastalflavors.com",
    offerings: [
      {
        id: 401,
        name: "Seafood Platter for Two",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 4800, currency: "KSH" },
        originalPrice: { amount: 5500, currency: "KSH" },
        category: "Restaurants",
        subcategory: "Casual",
        description:
          "Generous platter of fresh local seafood including grilled fish, prawns, calamari, and lobster. Served with coconut rice, kachumbari, and tamarind sauce.",
        location: "Diani Beach, Mombasa",
        isPopular: true,
        dateAdded: "2025-02-25T10:30:00Z",
        rating: 4.8,
        reviewCount: 142,
        features: ["Fresh Seafood", "For Two", "Beachfront View", "Local Spices", "Signature Sauces"],
        capacity: 60,
        availableSlots: 12,
        totalSlots: 60,
        tags: ["Seafood", "Local Cuisine", "Beachfront", "Romantic"],
        vendorId: 4,
        contactNumber: "+254 745 678 901",
        website: "https://coastalflavors.com",
        address: "Diani Beach Road, Mombasa",
      },
      {
        id: 402,
        name: "Sunset Dinner Experience",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 3800, currency: "KSH" },
        originalPrice: { amount: 4500, currency: "KSH" },
        category: "Restaurants",
        subcategory: "Casual",
        description:
          "Special dinner experience timed with the sunset, featuring a 3-course meal of coastal favorites and a complimentary welcome cocktail.",
        location: "Diani Beach, Mombasa",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.7,
        reviewCount: 68,
        features: ["3 Courses", "Sunset View", "Welcome Cocktail", "Live Music", "Beachfront Seating"],
        capacity: 40,
        availableSlots: 5,
        totalSlots: 40,
        tags: ["Sunset", "Romantic", "Special Occasion", "Coastal Cuisine"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        isAlmostFullyBooked: true,
        vendorId: 4,
        contactNumber: "+254 745 678 901",
        website: "https://coastalflavors.com",
        address: "Diani Beach Road, Mombasa",
      },
    ],
  },

  // Bars & Lounges
  {
    id: 5,
    name: "Skyline Lounge & Bar",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Sophisticated rooftop lounge offering craft cocktails, premium spirits, and breathtaking city views.",
    redirectUrl: "https://skylinelounge.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 376,
    verified:true,
    establishedYear: 2019,
    contactNumber: "+254 756 789 012",
    email: "info@skylinelounge.com",
    website: "https://skylinelounge.com",
    offerings: [
      {
        id: 501,
        name: "VIP Lounge Experience",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 15000, currency: "KSH" },
        originalPrice: { amount: 20000, currency: "KSH" },
        category: "Bars & Lounges",
        subcategory: "Lounge",
        description:
          "Exclusive VIP lounge experience for up to 6 people, including a bottle of premium spirit, mixers, and a dedicated server. Enjoy the best views from our private section.",
        location: "Upper Hill, Nairobi",
        isPopular: true,
        dateAdded: "2025-03-08T10:30:00Z",
        rating: 4.9,
        reviewCount: 112,
        features: ["Private Section", "Bottle Service", "Dedicated Server", "Premium View", "For 6 People"],
        capacity: 6,
        availableSlots: 2,
        totalSlots: 5,
        tags: ["VIP", "Exclusive", "Premium", "Nightlife"],
        hotDealEnds: "2025-04-08T23:59:59Z",
        isHotDeal: true,
        isTrending: true,
        vendorId: 5,
        contactNumber: "+254 756 789 012",
        website: "https://skylinelounge.com",
        address: "Rooftop, Skyline Tower, Upper Hill, Nairobi",
      },
      {
        id: 502,
        name: "Craft Cocktail Tasting Flight",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 2800, currency: "KSH" },
        originalPrice: { amount: 3500, currency: "KSH" },
        category: "Bars & Lounges",
        subcategory: "Cocktail Bar",
        description:
          "Sample our signature craft cocktails with this tasting flight of 5 different drinks. Includes detailed explanation from our mixologist and light appetizers.",
        location: "Upper Hill, Nairobi",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.7,
        reviewCount: 78,
        features: ["5 Cocktails", "Mixologist Guide", "Appetizers", "City View", "2-Hour Experience"],
        capacity: 20,
        availableSlots: 8,
        totalSlots: 20,
        tags: ["Cocktails", "Tasting", "Craft", "Experience"],
        vendorId: 5,
        contactNumber: "+254 756 789 012",
        website: "https://skylinelounge.com",
        address: "Rooftop, Skyline Tower, Upper Hill, Nairobi",
      },
    ],
  },
  {
    id: 6,
    name: "Beachside Sports Bar",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Casual sports bar on the beach offering cold drinks, pub food, and all major sporting events on big screens.",
    redirectUrl: "https://beachsidesportsbar.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.6,
    reviewCount: 289,
    verified:true,
    establishedYear: 2018,
    contactNumber: "+254 767 890 123",
    email: "info@beachsidesportsbar.com",
    website: "https://beachsidesportsbar.com",
    offerings: [
      {
        id: 601,
        name: "Game Day Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 3500, currency: "KSH" },
        originalPrice: { amount: 4200, currency: "KSH" },
        category: "Bars & Lounges",
        subcategory: "Sports Bar",
        description:
          "Perfect for sports fans! Package includes reserved seating for 4, a bucket of 6 beers, a platter of bar snacks, and guaranteed view of the big screen.",
        location: "Bamburi Beach, Mombasa",
        isPopular: true,
        dateAdded: "2025-02-28T10:30:00Z",
        rating: 4.6,
        reviewCount: 95,
        features: ["Reserved Seating", "Beer Bucket", "Snack Platter", "Big Screen View", "For 4 People"],
        capacity: 4,
        availableSlots: 6,
        totalSlots: 10,
        tags: ["Sports", "Beer", "Friends", "Game Day"],
        vendorId: 6,
        contactNumber: "+254 767 890 123",
        website: "https://beachsidesportsbar.com",
        address: "Bamburi Beach Road, Mombasa",
      },
      {
        id: 602,
        name: "Beach BBQ & Drinks",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 2500, currency: "KSH" },
        originalPrice: { amount: 3000, currency: "KSH" },
        category: "Bars & Lounges",
        subcategory: "Sports Bar",
        description:
          "Enjoy our weekend beach BBQ with a selection of grilled meats and seafood, plus two drinks of your choice. Relax on the beach with good food and vibes.",
        location: "Bamburi Beach, Mombasa",
        isNew: true,
        dateAdded: "2025-03-20T10:30:00Z",
        rating: 4.5,
        reviewCount: 42,
        features: ["BBQ Selection", "2 Drinks", "Beach Seating", "Weekend Only", "Live Music"],
        capacity: 50,
        availableSlots: 15,
        totalSlots: 50,
        tags: ["BBQ", "Beach", "Weekend", "Casual"],
        hotDealEnds: "2025-04-20T23:59:59Z",
        isHotDeal: true,
        vendorId: 6,
        contactNumber: "+254 767 890 123",
        website: "https://beachsidesportsbar.com",
        address: "Bamburi Beach Road, Mombasa",
      },
    ],
  },

  // Open Caterings
  {
    id: 7,
    name: "Elegant Events Catering",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Premium catering service for weddings, corporate events, and special occasions with customizable menus.",
    redirectUrl: "https://elegantevents.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.9,
    reviewCount: 215,
    verified:true,
    establishedYear: 2016,
    contactNumber: "+254 778 901 234",
    email: "events@elegantevents.com",
    website: "https://elegantevents.com",
    offerings: [
      {
        id: 701,
        name: "Premium Wedding Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 250000, currency: "KSH" },
        originalPrice: { amount: 300000, currency: "KSH" },
        category: "Open Caterings",
        subcategory: "Weddings",
        description:
          "Comprehensive wedding catering package for up to 200 guests. Includes 5-course plated dinner, welcome drinks, canapés, wedding cake, and full service staff.",
        location: "Nairobi & Surrounding Areas",
        isPopular: true,
        dateAdded: "2025-03-01T10:30:00Z",
        rating: 5.0,
        reviewCount: 48,
        features: [
          "200 Guests",
          "5-Course Dinner",
          "Welcome Drinks",
          "Wedding Cake",
          "Full Service Staff",
          "Customizable Menu",
        ],
        capacity: 200,
        availableSlots: 3,
        totalSlots: 5,
        tags: ["Wedding", "Premium", "Full Service", "Customizable"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        isTrending: true,
        vendorId: 7,
        contactNumber: "+254 778 901 234",
        website: "https://elegantevents.com",
        address: "Karen, Nairobi",
      },
      {
        id: 702,
        name: "Corporate Lunch Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 85000, currency: "KSH" },
        originalPrice: { amount: 95000, currency: "KSH" },
        category: "Open Caterings",
        subcategory: "Corporate Events",
        description:
          "Professional catering for corporate events of up to 50 people. Package includes buffet lunch, refreshments, setup, and service staff.",
        location: "Nairobi CBD & Business Districts",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.8,
        reviewCount: 36,
        features: ["50 People", "Buffet Lunch", "Refreshments", "Setup & Cleanup", "Service Staff"],
        capacity: 50,
        availableSlots: 8,
        totalSlots: 10,
        tags: ["Corporate", "Business", "Professional", "Lunch"],
        vendorId: 7,
        contactNumber: "+254 778 901 234",
        website: "https://elegantevents.com",
        address: "Karen, Nairobi",
      },
    ],
  },
  {
    id: 8,
    name: "Celebration Catering Services",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Versatile catering service specializing in anniversaries, birthday parties, and beach events with local flavors.",
    redirectUrl: "https://celebrationcatering.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 183,
    establishedYear: 2017,
    contactNumber: "+254 789 012 345",
    email: "info@celebrationcatering.com",
    website: "https://celebrationcatering.com",
    offerings: [
      {
        id: 801,
        name: "Anniversary Dinner Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 45000, currency: "KSH" },
        originalPrice: { amount: 55000, currency: "KSH" },
        category: "Open Caterings",
        subcategory: "Anniversaries",
        description:
          "Special anniversary dinner package for up to 20 guests. Includes 3-course meal, champagne toast, decorations, and dedicated service staff.",
        location: "Mombasa & Coastal Region",
        isPopular: true,
        dateAdded: "2025-02-25T10:30:00Z",
        rating: 4.8,
        reviewCount: 42,
        features: ["20 Guests", "3-Course Meal", "Champagne Toast", "Decorations", "Service Staff"],
        capacity: 20,
        availableSlots: 4,
        totalSlots: 8,
        tags: ["Anniversary", "Intimate", "Special Occasion", "Romantic"],
        vendorId: 8,
        contactNumber: "+254 789 012 345",
        website: "https://celebrationcatering.com",
        address: "Nyali, Mombasa",
      },
      {
        id: 802,
        name: "Beach Party BBQ Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 65000, currency: "KSH" },
        originalPrice: { amount: 75000, currency: "KSH" },
        category: "Open Caterings",
        subcategory: "Parties",
        description:
          "Fun beach party package with BBQ station, drinks, beach setup, and entertainment for up to 30 guests. Perfect for birthdays or casual celebrations.",
        location: "Diani Beach, Mombasa",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.7,
        reviewCount: 28,
        features: ["30 Guests", "BBQ Station", "Drinks Package", "Beach Setup", "Entertainment"],
        capacity: 30,
        availableSlots: 2,
        totalSlots: 6,
        tags: ["Beach", "Party", "BBQ", "Casual", "Fun"],
        hotDealEnds: "2025-04-18T23:59:59Z",
        isHotDeal: true,
        isAlmostFullyBooked: true,
        vendorId: 8,
        contactNumber: "+254 789 012 345",
        website: "https://celebrationcatering.com",
        address: "Nyali, Mombasa",
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

export default function HospitalityPage() {
  useCookieTracking("hospitality")

  // State for vendors and offerings
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors)
  const [newOfferingAlert, setNewOfferingAlert] = useState<HospitalityData | null>(null)
  const [swapTrigger, setSwapTrigger] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

 // Custom color scheme for entertainment
 const hospitalityColorScheme = {
  primary: "from-red-500 to-amber-700",
  secondary: "bg-amber-100",
  accent: "bg-green-600",
  text: "text-red-900",
  background: "bg-amber-50",
}

  // State for active category and subcategory
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [activeSubcategory, setActiveSubcategory] = useState<string>("")

  // State for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000])
  const [sortOrder, setSortOrder] = useState("default")
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([])

  // State for offering detail modal
  const [selectedOffering, setSelectedOffering] = useState<HospitalityData | null>(null)

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
      colors: ["#f59e0b", "#d97706", "#b45309"], // Amber colors
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
    <div className="bg-gradient-to-br from-red-500 via-amber-400 to-green-500 min-h-screen">
      {/* Decorative hotel-themed elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-red-800 to-green-800 opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-green-800 to-red-800 opacity-20"></div>

      {/* IMPROVEMENT: Added max-width to container to prevent excessive stretching on ultra-wide screens */}
      <div className="container mx-auto px-4 py-12 max-w-[1920px] relative z-10">
        {/* Luxury header with gold accents */}
        <div className="text-center mb-10 bg-gradient-to-r from-red-900/80 via-amber-800/80 to-green-900/80 p-8 rounded-2xl shadow-2xl border border-amber-300/30 backdrop-blur-sm">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-amber-100">Hospitality & Experiences</h1>

          {/* Five golden stars */}
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-8 w-8 text-amber-300 fill-amber-300 mx-1" />
            ))}
          </div>

          <p className="text-xl text-amber-200 max-w-3xl mx-auto">
            Discover exceptional stays, dining experiences, and event venues for your perfect occasion
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
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-amber-200">
                <div className="bg-gradient-to-r from-amber-500 to-red-500 px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 text-white mr-2" />
                    <h3 className="text-white font-bold">New Hospitality Offer!</h3>
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
                    <h4 className="font-semibold text-amber-700">{newOfferingAlert.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{newOfferingAlert.location}</p>
                    <div className="flex items-center">
                      <span className="text-amber-600 font-bold mr-2">
                        {formatPrice(newOfferingAlert.currentPrice)}
                      </span>
                      <Badge className="bg-amber-100 text-amber-800">New Arrival</Badge>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <Button
                    className="w-full bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white"
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
            colorScheme="amber"
            title="Limited Time Hospitality Offers"
            subtitle="Exclusive deals on premium experiences - book before they're gone!"
          />
        )}
  {/*recommendation algorithim for hospitality*/}
<div className="container mx-auto px-4">
  <TimeBasedRecommendations
    products={vendors.flatMap((vendor) =>
      vendor.offerings.map((offering) => ({
        id: offering.id,
        name: offering.name,
        imageUrl: offering.imageUrl,
        description: offering.description,
        currentPrice: offering.currentPrice,
        originalPrice: offering.originalPrice,
        category: offering.category,
        recommendedTimes: 
          offering.subcategory?.toLowerCase().includes("breakfast")
            ? ["morning"]
            : offering.subcategory?.toLowerCase().includes("lunch")
              ? ["afternoon"]
              : offering.subcategory?.toLowerCase().includes("dinner")
                ? ["evening"]
                : offering.name.toLowerCase().includes("night") || offering.name.toLowerCase().includes("late")
                  ? ["night"]
                  : undefined,
      })),
    )}
    title="Dining Recommendations For Now"
    subtitle="Special offers perfect for this time of day"
    colorScheme="green"
    maxProducts={4}
  />
</div>
        {/* New Products For You Section */}
        <NewProductsForYou allProducts={newProducts} colorScheme="amber" maxProducts={4} />

  {/* Trending and Popular Section */}
  <TrendingPopularSection
        trendingProducts={trendingProducts}
        popularProducts={popularProducts}
        colorScheme={hospitalityColorScheme}
        title="Hospitality Highlights"
        subtitle="Discover trending and most popular hospitality options"
      />

        {/* Enhanced search section */}
        <div className="mb-10 bg-gradient-to-r from-amber-900/70 via-red-800/70 to-amber-900/70 p-6 rounded-xl shadow-lg border border-amber-300/30 backdrop-blur-sm">
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Search for hotels, restaurants, venues, or experiences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-full border-amber-400 bg-amber-50/90 backdrop-blur-sm text-amber-900 placeholder:text-amber-500/70 focus:ring-amber-500 focus:border-amber-500 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-500" />
          </div>

          {/* Category tabs */}
          <Tabs defaultValue={activeCategory} value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
            <TabsList className="bg-amber-800/50 p-1 rounded-xl mb-4 flex flex-nowrap overflow-x-auto hide-scrollbar">
              <TabsTrigger
                value=""
                onClick={() => setActiveCategory("")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === "" ? "bg-amber-500 text-white shadow-sm" : "text-amber-100 hover:bg-amber-700/50"
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                <span>All Categories</span>
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
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-amber-100 hover:bg-amber-700/50"
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
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-transparent border-amber-300 text-amber-100 hover:bg-amber-700/50"
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
                            ? "bg-amber-500 hover:bg-amber-600 text-white"
                            : "bg-transparent border-amber-300 text-amber-100 hover:bg-amber-700/50"
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
                <Filter className="h-5 w-5 text-amber-300" />
                <span className="text-sm text-amber-200">
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
                  offerings found
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-amber-200">Sort by:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="p-2 border rounded-md text-sm bg-amber-800 border-amber-600 text-amber-100"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest First</option>
                </select>
                <ArrowUpDown className="h-4 w-4 text-amber-300" />
              </div>
            </div>
          </Tabs>
        </div>

   {/*button for hospitality*/}
<div className="flex justify-center my-8">
      <Link href="/hospitality/shop">
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
            <Utensils className="mr-2 h-5 w-5" />
            Explore Hospitality Shop
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
            <Coffee className="h-5 w-5 text-yellow-300" />
          </motion.div>
        </Button>
      </Link>
    </div>
{/*button for hospitality*/}
<div className="flex justify-center my-8">
      <Link href="/hospitality/media-showcase">
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
            <Utensils className="mr-2 h-5 w-5" />
            Explore Hospitality Media place
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
            <Coffee className="h-5 w-5 text-yellow-300" />
          </motion.div>
        </Button>
      </Link>
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
            <div className="bg-gradient-to-r from-amber-900/70 via-red-800/70 to-amber-900/70 p-8 text-center rounded-lg shadow-md border border-amber-300/30 backdrop-blur-sm">
              <p className="text-amber-100 text-lg">No vendors found matching your criteria.</p>
              <p className="text-amber-200 mt-2">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
       
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center bg-amber-900/80 p-6 rounded-full backdrop-blur-sm">
              <Loader2 className="h-10 w-10 animate-spin text-amber-300" />
              <p className="mt-2 text-amber-200 font-medium">Loading more experiences...</p>
            </div>
          </div>
        )}

        {/* Loader reference element */}
        <div ref={loaderRef} className="h-20"></div>
      </div>

      {/* Offering Detail Modal */}
      <Dialog open={!!selectedOffering} onOpenChange={() => setSelectedOffering(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-r from-amber-900/90 via-red-800/90 to-amber-900/90 border border-amber-300/30 text-white backdrop-blur-sm">
          {selectedOffering && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Offering image */}
                <div className="relative h-64 md:h-full rounded-lg overflow-hidden bg-amber-800/50">
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
                    {selectedOffering.isPopular && <MostPreferredBadge colorScheme="amber" size="sm" />}
                  </div>
                </div>

                {/* Offering details */}
                <div className="flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-amber-100 mb-2">{selectedOffering.name}</h3>
                    <div className="flex items-center text-amber-200 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{selectedOffering.location}</span>
                    </div>
                    <p className="text-amber-100">{selectedOffering.description}</p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-amber-100 mb-2">Key Features</h3>
                    <ul className="list-disc list-inside text-amber-200 space-y-1">
                      {selectedOffering.features?.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Amenities */}
                  {selectedOffering.amenities && selectedOffering.amenities.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-amber-100 mb-2">Amenities</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedOffering.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center text-amber-200">
                            {amenity.toLowerCase().includes("wifi") ? (
                              <Wifi className="h-4 w-4 mr-2 text-amber-300" />
                            ) : amenity.toLowerCase().includes("parking") ? (
                              <Parking className="h-4 w-4 mr-2 text-amber-300" />
                            ) : amenity.toLowerCase().includes("pool") ? (
                              <Pool className="h-4 w-4 mr-2 text-amber-300" />
                            ) : amenity.toLowerCase().includes("gym") ? (
                              <Dumbbell className="h-4 w-4 mr-2 text-amber-300" />
                            ) : amenity.toLowerCase().includes("tv") ? (
                              <Tv className="h-4 w-4 mr-2 text-amber-300" />
                            ) : amenity.toLowerCase().includes("air") ? (
                              <Waves className="h-4 w-4 mr-2 text-amber-300" />
                            ) : amenity.toLowerCase().includes("bed") ? (
                              <Bed className="h-4 w-4 mr-2 text-amber-300" />
                            ) : (
                              <Spa className="h-4 w-4 mr-2 text-amber-300" />
                            )}
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Availability */}
                  {selectedOffering.availableSlots !== undefined && selectedOffering.totalSlots !== undefined && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-amber-100 mb-2">Availability</h3>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-amber-200">Available slots:</span>
                        <span
                          className={`font-medium ${
                            selectedOffering.availableSlots < selectedOffering.totalSlots * 0.2
                              ? "text-red-400"
                              : selectedOffering.availableSlots < selectedOffering.totalSlots * 0.5
                                ? "text-amber-300"
                                : "text-green-400"
                          }`}
                        >
                          {selectedOffering.availableSlots} of {selectedOffering.totalSlots}
                        </span>
                      </div>
                      <div className="w-full bg-amber-800 rounded-full h-2 mb-4">
                        <div
                          className={`h-2 rounded-full ${
                            selectedOffering.availableSlots < selectedOffering.totalSlots * 0.2
                              ? "bg-red-500"
                              : selectedOffering.availableSlots < selectedOffering.totalSlots * 0.5
                                ? "bg-amber-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${(selectedOffering.availableSlots / selectedOffering.totalSlots) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Quantity selector */}
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-amber-100 mb-2">Number of Guests</h3>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-l-md border-amber-500 text-amber-200"
                        onClick={() => {}}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="px-4 py-1 bg-amber-800 border-t border-b border-amber-500 text-center min-w-[40px] text-amber-100">
                        1
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-r-md border-amber-500 text-amber-200"
                        onClick={() => {}}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      <div className="ml-4 text-sm text-amber-200">
                        {selectedOffering.capacity && <span>Max capacity: {selectedOffering.capacity}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-amber-100">
                          {formatPrice(selectedOffering.currentPrice)}
                        </div>
                        {selectedOffering.originalPrice.amount !== selectedOffering.currentPrice.amount && (
                          <div className="text-base text-amber-300 line-through">
                            {formatPrice(selectedOffering.originalPrice)}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-sm text-amber-200 mb-1">Date:</div>
                        <div className="font-medium text-amber-100">
                          {selectedOffering.checkInTime && selectedOffering.checkOutTime
                            ? `Check-in: ${selectedOffering.checkInTime} | Check-out: ${selectedOffering.checkOutTime}`
                            : "Select a date"}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {selectedOffering.originalPrice.amount !== selectedOffering.currentPrice.amount && (
                        <Button
                          variant="outline"
                          className="border-amber-500 text-amber-200 hover:bg-amber-800/50 flex-1 flex items-center justify-center gap-2"
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

                      <Button className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white flex-1 flex items-center justify-center gap-2">
                        <CalendarClock className="h-4 w-4" />
                        <span>Get a Date</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact information */}
              <div className="mt-6 pt-4 border-t border-amber-700">
                <div className="flex flex-col gap-2 text-sm text-amber-200">
                  {selectedOffering.contactNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-amber-300" />
                      <span>{selectedOffering.contactNumber}</span>
                    </div>
                  )}
                  {selectedOffering.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-amber-300" />
                      <a
                        href={selectedOffering.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-300 hover:underline"
                      >
                        {selectedOffering.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                  {selectedOffering.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-amber-300" />
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
  onOfferingClick: (offering: HospitalityData) => void
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
    <div className="bg-gradient-to-r from-amber-900/70 via-red-800/70 to-amber-900/70 rounded-xl shadow-lg overflow-hidden border border-amber-300/30 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <Image
                src={imageError ? "/placeholder.svg?height=60&width=60" : vendor.logo}
                alt={vendor.name}
                width={60}
                height={60}
                className="rounded-full border-2 border-amber-300 shadow-md"
                onError={() => setImageError(true)}
              />
               {vendor.verified && (
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-amber-100">{vendor.name}</h3>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-amber-300 mr-1" />
                <p className="text-amber-200 text-sm mr-2">{vendor.location}</p>
                {vendor.rating && (
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(vendor.rating || 0) ? "text-amber-300 fill-amber-300" : "text-amber-800"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-amber-200">
                      {vendor.rating.toFixed(1)} ({vendor.reviewCount})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-amber-200 hidden md:block">
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
              className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap"
            >
              Visit Website
            </a>
          </div>
        </div>
        <p className="text-amber-100 mb-4 line-clamp-2">{vendor.description}</p>

        {/* Accordion control */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full mt-2 text-sm font-medium text-amber-200 hover:text-amber-100"
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
function OfferingCard({ offering, onClick }: { offering: HospitalityData; onClick: () => void }) {
  const [imageError, setImageError] = useState(false)

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((offering.originalPrice.amount - offering.currentPrice.amount) / offering.originalPrice.amount) * 100,
  )

  return (
    <motion.div
      className="bg-gradient-to-r from-amber-800/80 to-red-900/80 rounded-lg shadow-sm overflow-hidden flex flex-col h-full border border-amber-500/30 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 backdrop-blur-sm"
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
          {discountPercentage >= 15 && (
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
            <MostPreferredBadge colorScheme="amber" size="sm" />
          </div>
        )}

        {/* Almost fully booked badge */}
        {offering.isAlmostFullyBooked && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-red-500 text-white flex items-center gap-1 px-2 py-1 text-xs font-medium">
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
          <Badge variant="outline" className="text-xs border-amber-500 text-amber-200">
            {offering.subcategory}
          </Badge>
        </div>

        <h4 className="font-semibold text-amber-100 mb-1 line-clamp-1">{offering.name}</h4>

        <div className="flex items-center text-xs text-amber-200 mb-1">
          <MapPin className="h-3 w-3 mr-1 text-amber-300" />
          {offering.location}
        </div>

        <p className="text-xs text-amber-200 mb-2 line-clamp-2 flex-grow">{offering.description}</p>

        {/* Rating */}
        {offering.rating && (
          <div className="flex items-center mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(offering.rating || 0) ? "text-amber-300 fill-amber-300" : "text-amber-800"
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-amber-200">
              {offering.rating.toFixed(1)} ({offering.reviewCount})
            </span>
          </div>
        )}

        {/* Features */}
        {offering.features && offering.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {offering.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-[10px] border-amber-700 text-amber-300">
                {feature}
              </Badge>
            ))}
            {offering.features.length > 3 && (
              <Badge variant="outline" className="text-[10px] border-amber-700 text-amber-300">
                +{offering.features.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Availability */}
        {offering.availableSlots !== undefined && offering.totalSlots !== undefined && (
          <div className="mb-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-amber-200">Availability:</span>
              <span
                className={`font-medium ${
                  offering.availableSlots < offering.totalSlots * 0.2
                    ? "text-red-400"
                    : offering.availableSlots < offering.totalSlots * 0.5
                      ? "text-amber-300"
                      : "text-green-400"
                }`}
              >
                {offering.availableSlots} of {offering.totalSlots} available
              </span>
            </div>
            <div className="w-full bg-amber-800 rounded-full h-1.5 mt-1">
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
            <div className="text-base font-bold text-amber-100">{formatPrice(offering.currentPrice)}</div>
            <div className="text-xs text-amber-300 line-through">{formatPrice(offering.originalPrice)}</div>
          </div>

          <div className="flex gap-1">
            <motion.button
              className="bg-amber-800 text-amber-200 px-2 py-1.5 rounded-md text-xs font-medium flex items-center border border-amber-600"
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
              className="bg-gradient-to-r from-amber-500 to-red-500 text-white px-2 py-1.5 rounded-md text-xs font-medium flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                // Book date functionality would go here
              }}
            >
              <CalendarClock className="h-3 w-3 mr-1" />
              <span>Get a Date</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

