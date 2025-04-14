"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Plane,
  Hotel,
  Compass,
  Search,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  ArrowLeft,
  Heart,
  X,
  Sparkles,
  Flame,
  Briefcase,
  Palmtree,
  Calendar,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Types
interface Price {
  amount: number
  currency: string
}

interface TravelVendor {
  id: string
  name: string
  logo: string
  category: "tours" | "accommodations" | "transportation" | "gear"
  description: string
  rating: number
  reviewCount: number
  location: string
  contact: {
    phone: string
    email: string
    website: string
  }
  operatingHours: string
  products: TravelProduct[]
  features: string[]
  images: string[]
}

interface TravelProduct {
  id: string
  name: string
  description: string
  price: Price
  image: string
  isPopular?: boolean
  isNew?: boolean
  category: string
  tags: string[]
  duration?: string
  groupSize?: string
  startingDates?: string[]
}

// Helper function to format price
const formatPrice = (price: Price): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount)
}

// Mock data for travel vendors
const travelVendors: TravelVendor[] = [
  // Tours Vendors
  {
    id: "safari-adventures",
    name: "Safari Adventures",
    logo: "/placeholder.svg?height=80&width=80",
    category: "tours",
    description:
      "Experience the magic of African wildlife with our expertly guided safari tours. From the Maasai Mara to Amboseli, we offer unforgettable adventures.",
    rating: 4.9,
    reviewCount: 324,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 712 345 678",
      email: "info@safariadventures.co.ke",
      website: "www.safariadventures.co.ke",
    },
    operatingHours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: 10:00 AM - 4:00 PM",
    features: ["Expert Guides", "Luxury Vehicles", "Small Groups", "Photography Tips", "All-Inclusive Packages"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "maasai-mara-safari",
        name: "Maasai Mara Deluxe Safari",
        description:
          "5-day luxury safari in the world-famous Maasai Mara. Witness the Big Five and experience the Great Migration in comfort.",
        price: { amount: 250000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Safari Tours",
        tags: ["Wildlife", "Luxury", "Big Five"],
        duration: "5 days / 4 nights",
        groupSize: "2-8 people",
        startingDates: ["Jun 15, 2023", "Jul 10, 2023", "Aug 5, 2023", "Sep 20, 2023"],
      },
      {
        id: "amboseli-safari",
        name: "Amboseli & Kilimanjaro Views",
        description:
          "3-day safari to Amboseli National Park with stunning views of Mt. Kilimanjaro and elephant herds.",
        price: { amount: 150000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Safari Tours",
        tags: ["Elephants", "Mountain Views", "Photography"],
        duration: "3 days / 2 nights",
        groupSize: "2-6 people",
        startingDates: ["Jun 20, 2023", "Jul 15, 2023", "Aug 10, 2023", "Sep 25, 2023"],
      },
      {
        id: "tsavo-safari",
        name: "Tsavo East & West Explorer",
        description: "7-day comprehensive safari exploring both Tsavo East and West National Parks.",
        price: { amount: 320000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Safari Tours",
        tags: ["Red Elephants", "Diverse Landscapes", "Extended"],
        duration: "7 days / 6 nights",
        groupSize: "2-8 people",
        startingDates: ["Jun 25, 2023", "Jul 20, 2023", "Aug 15, 2023", "Sep 30, 2023"],
      },
      {
        id: "lake-nakuru-safari",
        name: "Lake Nakuru Flamingo Safari",
        description: "2-day safari to witness the famous flamingos and rhinos of Lake Nakuru National Park.",
        price: { amount: 95000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Safari Tours",
        tags: ["Flamingos", "Rhinos", "Weekend Getaway"],
        duration: "2 days / 1 night",
        groupSize: "2-6 people",
        startingDates: ["Jun 10, 2023", "Jul 5, 2023", "Aug 1, 2023", "Sep 15, 2023"],
      },
    ],
  },
  {
    id: "coastal-expeditions",
    name: "Coastal Expeditions",
    logo: "/placeholder.svg?height=80&width=80",
    category: "tours",
    description:
      "Discover the beauty of Kenya's coast with our specialized beach and cultural tours. From Diani to Lamu, experience the rich coastal heritage.",
    rating: 4.7,
    reviewCount: 256,
    location: "Mombasa, Kenya",
    contact: {
      phone: "+254 723 456 789",
      email: "bookings@coastalexpeditions.co.ke",
      website: "www.coastalexpeditions.co.ke",
    },
    operatingHours: "Mon-Sun: 8:00 AM - 8:00 PM",
    features: ["Beach Activities", "Cultural Immersion", "Boat Excursions", "Snorkeling & Diving", "Historical Tours"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "diani-beach-escape",
        name: "Diani Beach Escape",
        description: "4-day beach holiday in Diani with water activities, beach relaxation, and optional excursions.",
        price: { amount: 120000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Beach Holidays",
        tags: ["Beach", "Water Sports", "Relaxation"],
        duration: "4 days / 3 nights",
        groupSize: "2-10 people",
        startingDates: ["Jun 5, 2023", "Jul 1, 2023", "Aug 3, 2023", "Sep 7, 2023"],
      },
      {
        id: "lamu-cultural-tour",
        name: "Lamu Cultural Immersion",
        description:
          "5-day tour exploring the UNESCO World Heritage site of Lamu Old Town and its rich Swahili culture.",
        price: { amount: 180000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Cultural Tours",
        tags: ["UNESCO", "History", "Architecture"],
        duration: "5 days / 4 nights",
        groupSize: "2-8 people",
        startingDates: ["Jun 12, 2023", "Jul 8, 2023", "Aug 4, 2023", "Sep 9, 2023"],
      },
      {
        id: "marine-adventure",
        name: "Marine Park Adventure",
        description: "3-day snorkeling and diving adventure in Kenya's marine parks with expert marine guides.",
        price: { amount: 140000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Water Adventures",
        tags: ["Snorkeling", "Diving", "Marine Life"],
        duration: "3 days / 2 nights",
        groupSize: "2-6 people",
        startingDates: ["Jun 18, 2023", "Jul 14, 2023", "Aug 9, 2023", "Sep 13, 2023"],
      },
      {
        id: "swahili-food-tour",
        name: "Swahili Culinary Journey",
        description: "2-day food tour exploring the rich flavors and cooking techniques of coastal Swahili cuisine.",
        price: { amount: 85000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Food Tours",
        tags: ["Cuisine", "Cooking Classes", "Food Tasting"],
        duration: "2 days / 1 night",
        groupSize: "2-8 people",
        startingDates: ["Jun 8, 2023", "Jul 4, 2023", "Aug 6, 2023", "Sep 3, 2023"],
      },
    ],
  },

  // Accommodations Vendors
  {
    id: "serena-hotels",
    name: "Serena Hotels & Resorts",
    logo: "/placeholder.svg?height=80&width=80",
    category: "accommodations",
    description:
      "Luxury hotel chain offering premium accommodations across Kenya's most beautiful destinations, from city centers to national parks.",
    rating: 4.8,
    reviewCount: 412,
    location: "Multiple locations, Kenya",
    contact: {
      phone: "+254 734 567 890",
      email: "reservations@serenahotels.co.ke",
      website: "www.serenahotels.co.ke",
    },
    operatingHours: "24/7 Reservations",
    features: ["Luxury Rooms", "Fine Dining", "Spa Services", "Swimming Pools", "Conference Facilities", "Concierge"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "nairobi-serena",
        name: "Nairobi Serena Hotel",
        description:
          "5-star hotel in the heart of Nairobi offering luxury accommodations, fine dining, and excellent city access.",
        price: { amount: 25000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "City Hotels",
        tags: ["Luxury", "Business", "Central Location"],
      },
      {
        id: "mara-serena",
        name: "Mara Serena Safari Lodge",
        description:
          "Safari lodge in the Maasai Mara offering stunning views and wildlife experiences right from your room.",
        price: { amount: 35000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Safari Lodges",
        tags: ["Wildlife", "Views", "Safari"],
      },
      {
        id: "mountain-lodge",
        name: "Mountain Lodge",
        description:
          "Unique treehouse-style lodge on the slopes of Mt. Kenya with wildlife viewing from elevated walkways.",
        price: { amount: 28000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Mountain Retreats",
        tags: ["Mountain", "Wildlife", "Unique"],
      },
      {
        id: "beach-resort",
        name: "Serena Beach Resort & Spa",
        description: "Luxurious beach resort in Mombasa with Swahili-inspired architecture and direct beach access.",
        price: { amount: 32000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Beach Resorts",
        tags: ["Beach", "Spa", "Relaxation"],
      },
    ],
  },
  {
    id: "eco-lodges",
    name: "Eco Lodges Kenya",
    logo: "/placeholder.svg?height=80&width=80",
    category: "accommodations",
    description:
      "Sustainable and eco-friendly accommodations that blend with nature while providing comfort and authentic experiences.",
    rating: 4.6,
    reviewCount: 287,
    location: "Various natural settings, Kenya",
    contact: {
      phone: "+254 745 678 901",
      email: "stay@ecolodgeskenya.co.ke",
      website: "www.ecolodgeskenya.co.ke",
    },
    operatingHours: "24/7 Reservations",
    features: [
      "Sustainable Practices",
      "Local Materials",
      "Farm-to-Table Dining",
      "Nature Activities",
      "Community Engagement",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "forest-treehouse",
        name: "Forest Canopy Treehouse",
        description:
          "Elevated treehouse accommodation in an indigenous forest with stunning views and wildlife all around.",
        price: { amount: 18000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Unique Stays",
        tags: ["Treehouse", "Forest", "Eco-friendly"],
      },
      {
        id: "lakeside-eco-camp",
        name: "Lakeside Eco Camp",
        description: "Tented camp on the shores of Lake Naivasha with hippo viewing and bird watching opportunities.",
        price: { amount: 15000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Tented Camps",
        tags: ["Lake", "Wildlife", "Glamping"],
      },
      {
        id: "desert-eco-lodge",
        name: "Desert Star Eco Lodge",
        description:
          "Sustainable lodge in northern Kenya's desert landscape with unique architecture and cultural experiences.",
        price: { amount: 22000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Desert Retreats",
        tags: ["Desert", "Cultural", "Stargazing"],
      },
      {
        id: "farm-stay",
        name: "Organic Farm Stay",
        description: "Working organic farm offering comfortable accommodations and farm-to-table experiences.",
        price: { amount: 12000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Farm Stays",
        tags: ["Organic", "Educational", "Family-friendly"],
      },
    ],
  },

  // Transportation Vendors
  {
    id: "safari-jets",
    name: "Safari Jets",
    logo: "/placeholder.svg?height=80&width=80",
    category: "transportation",
    description:
      "Premium air charter service offering flights to Kenya's national parks, remote locations, and neighboring countries.",
    rating: 4.9,
    reviewCount: 178,
    location: "Wilson Airport, Nairobi",
    contact: {
      phone: "+254 756 789 012",
      email: "flights@safarijets.co.ke",
      website: "www.safarijets.co.ke",
    },
    operatingHours: "Mon-Sun: 6:00 AM - 6:00 PM",
    features: ["Modern Aircraft", "Experienced Pilots", "Flexible Scheduling", "VIP Services", "Scenic Flights"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "mara-flight",
        name: "Nairobi to Maasai Mara Flight",
        description:
          "Direct flight from Nairobi to the Maasai Mara, cutting travel time from 6 hours to just 45 minutes.",
        price: { amount: 45000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Safari Flights",
        tags: ["Convenient", "Time-saving", "Scenic"],
      },
      {
        id: "coastal-flight",
        name: "Nairobi to Mombasa/Diani Flight",
        description: "Quick flight to Kenya's coast, avoiding long road journeys and maximizing your beach time.",
        price: { amount: 38000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Coastal Flights",
        tags: ["Beach", "Quick", "Comfortable"],
      },
      {
        id: "scenic-flight",
        name: "Mt. Kenya Scenic Flight",
        description:
          "Breathtaking scenic flight around Mt. Kenya with spectacular views of peaks, valleys, and wildlife.",
        price: { amount: 65000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Scenic Flights",
        tags: ["Mountain", "Photography", "Exclusive"],
      },
      {
        id: "remote-airstrip",
        name: "Remote Airstrip Transfers",
        description: "Customized flights to remote airstrips across Kenya's wilderness areas and conservancies.",
        price: { amount: 55000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Custom Flights",
        tags: ["Remote", "Customized", "Exclusive"],
      },
    ],
  },
  {
    id: "safari-cruisers",
    name: "Safari Cruisers",
    logo: "/placeholder.svg?height=80&width=80",
    category: "transportation",
    description:
      "Specialized safari vehicle rental and chauffeur services with 4x4 vehicles designed for Kenya's diverse terrains.",
    rating: 4.7,
    reviewCount: 245,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 767 890 123",
      email: "bookings@safaricruisers.co.ke",
      website: "www.safaricruisers.co.ke",
    },
    operatingHours: "Mon-Sun: 7:00 AM - 7:00 PM",
    features: ["4x4 Vehicles", "Pop-up Roof", "Experienced Drivers", "Comfortable Seating", "Charging Ports"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "land-cruiser-rental",
        name: "Land Cruiser Safari Vehicle",
        description:
          "Fully equipped Toyota Land Cruiser with pop-up roof, perfect for wildlife viewing in national parks.",
        price: { amount: 15000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Vehicle Rentals",
        tags: ["4x4", "Comfortable", "Spacious"],
      },
      {
        id: "van-rental",
        name: "Safari Van with Driver",
        description: "7-seater safari van with experienced driver/guide for both city and wildlife park visits.",
        price: { amount: 12000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Vehicle Rentals",
        tags: ["Guided", "Family", "Versatile"],
      },
      {
        id: "luxury-4x4",
        name: "Luxury 4x4 with Amenities",
        description: "Premium safari vehicle with enhanced comfort features, refreshments, and Wi-Fi.",
        price: { amount: 25000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Luxury Transport",
        tags: ["Luxury", "Amenities", "Premium"],
      },
      {
        id: "airport-transfers",
        name: "Airport & Hotel Transfers",
        description: "Reliable transfer service between airports, hotels, and other locations in comfortable vehicles.",
        price: { amount: 8000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Transfer Services",
        tags: ["Reliable", "Convenient", "Professional"],
      },
    ],
  },

  // Travel Gear Vendors
  {
    id: "safari-outfitters",
    name: "Safari Outfitters",
    logo: "/placeholder.svg?height=80&width=80",
    category: "gear",
    description:
      "Specialized store offering high-quality safari clothing, gear, and accessories for the perfect African adventure.",
    rating: 4.8,
    reviewCount: 312,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 778 901 234",
      email: "shop@safarioutfitters.co.ke",
      website: "www.safarioutfitters.co.ke",
    },
    operatingHours: "Mon-Sat: 9:00 AM - 6:00 PM, Sun: 10:00 AM - 4:00 PM",
    features: ["Quality Brands", "Expert Advice", "Safari Packages", "Custom Orders", "Rental Options"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "safari-clothing",
        name: "Complete Safari Clothing Set",
        description:
          "Essential safari clothing package including moisture-wicking shirts, convertible pants, and wide-brimmed hat.",
        price: { amount: 18500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Clothing",
        tags: ["Practical", "Comfortable", "UV Protection"],
      },
      {
        id: "binoculars",
        name: "Professional Safari Binoculars",
        description: "High-quality binoculars with 10x42 magnification, perfect for wildlife viewing at a distance.",
        price: { amount: 25000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Optics",
        tags: ["Wildlife Viewing", "High Definition", "Durable"],
      },
      {
        id: "camera-gear",
        name: "Safari Photography Kit",
        description: "Specialized photography package including camera bag, lens covers, and dust protection gear.",
        price: { amount: 15000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Photography",
        tags: ["Camera Protection", "Dust-proof", "Specialized"],
      },
      {
        id: "safari-backpack",
        name: "All-Terrain Safari Backpack",
        description: "Durable, weather-resistant backpack designed for safari conditions with multiple compartments.",
        price: { amount: 12000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Bags",
        tags: ["Durable", "Practical", "Weather-resistant"],
      },
    ],
  },
  {
    id: "travel-tech",
    name: "Travel Tech Solutions",
    logo: "/placeholder.svg?height=80&width=80",
    category: "gear",
    description:
      "Innovative travel technology and gadgets to enhance your journey, from power solutions to navigation and safety devices.",
    rating: 4.6,
    reviewCount: 267,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 789 012 345",
      email: "info@traveltechsolutions.co.ke",
      website: "www.traveltechsolutions.co.ke",
    },
    operatingHours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 5:00 PM",
    features: ["Cutting-edge Products", "Travel Adapters", "Power Banks", "GPS Devices", "Communication Tools"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "solar-charger",
        name: "Safari Solar Charging Kit",
        description:
          "Portable solar charging system for keeping devices powered during remote safaris and camping trips.",
        price: { amount: 14500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Power Solutions",
        tags: ["Solar", "Sustainable", "Off-grid"],
      },
      {
        id: "satellite-communicator",
        name: "Satellite Communicator",
        description: "Two-way satellite messaging device for staying connected in areas without cellular coverage.",
        price: { amount: 35000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Communication",
        tags: ["Safety", "Remote", "Emergency"],
      },
      {
        id: "travel-router",
        name: "Global Travel Wi-Fi Router",
        description: "Portable router providing secure Wi-Fi in over 100 countries with flexible data plans.",
        price: { amount: 18000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Connectivity",
        tags: ["Wi-Fi", "Global", "Secure"],
      },
      {
        id: "action-camera",
        name: "Adventure-Proof Action Camera",
        description: "Rugged, waterproof action camera with stabilization for capturing your travel adventures.",
        price: { amount: 28000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Photography",
        tags: ["Waterproof", "Durable", "High-quality"],
      },
    ],
  },
]

export default function TravelShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVendor, setSelectedVendor] = useState<TravelVendor | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<TravelProduct | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter vendors based on active category and search query
  const filteredVendors = travelVendors.filter((vendor) => {
    // Filter by category
    if (activeCategory !== "all" && vendor.category !== activeCategory) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        vendor.name.toLowerCase().includes(query) ||
        vendor.description.toLowerCase().includes(query) ||
        vendor.products.some(
          (product) => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
        )
      )
    }

    return true
  })

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setIsLoading(true)
    setActiveCategory(category)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  // Handle vendor click
  const handleVendorClick = (vendor: TravelVendor) => {
    setSelectedVendor(vendor)
  }

  // Handle product click
  const handleProductClick = (product: TravelProduct) => {
    setSelectedProduct(product)
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tours":
        return <Compass className="h-6 w-6" />
      case "accommodations":
        return <Hotel className="h-6 w-6" />
      case "transportation":
        return <Plane className="h-6 w-6" />
      case "gear":
        return <Briefcase className="h-6 w-6" />
      default:
        return <Sparkles className="h-6 w-6" />
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tours":
        return "from-blue-500 to-teal-500"
      case "accommodations":
        return "from-purple-500 to-indigo-500"
      case "transportation":
        return "from-sky-500 to-blue-600"
      case "gear":
        return "from-amber-500 to-orange-500"
      default:
        return "from-blue-500 to-teal-500"
    }
  }

  // Get category background color
  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case "tours":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "accommodations":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "transportation":
        return "bg-sky-100 text-sky-800 border-sky-200"
      case "gear":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Star rating component
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
          />
        ))}
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{rating.toFixed(1)}</span>
      </div>
    )
  }

  // Render category tabs
  const renderCategoryTabs = () => {
    return (
      <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
        {[
          { id: "all", name: "All Services", icon: <Sparkles className="h-5 w-5" /> },
          { id: "tours", name: "Tours", icon: <Compass className="h-5 w-5" /> },
          { id: "accommodations", name: "Accommodations", icon: <Hotel className="h-5 w-5" /> },
          { id: "transportation", name: "Transportation", icon: <Plane className="h-5 w-5" /> },
          { id: "gear", name: "Travel Gear", icon: <Briefcase className="h-5 w-5" /> },
        ].map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              activeCategory === category.id
                ? `bg-gradient-to-r ${
                    category.id === "all"
                      ? "from-blue-500 to-teal-500"
                      : category.id === "tours"
                        ? "from-blue-500 to-teal-500"
                        : category.id === "accommodations"
                          ? "from-purple-500 to-indigo-500"
                          : category.id === "transportation"
                            ? "from-sky-500 to-blue-600"
                            : "from-amber-500 to-orange-500"
                  } text-white`
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-500 to-teal-500 py-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-300 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-300 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/travelling" className="flex items-center text-white mb-4 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Travelling
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Travel Shop</h1>
              <p className="text-blue-100 max-w-2xl">
                Discover premium travel experiences, accommodations, transportation options, and gear for your next
                adventure in Kenya and beyond.
              </p>
            </div>
            <div className="hidden md:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/20 backdrop-blur-md p-4 rounded-lg shadow-lg"
              >
                <div className="text-white text-center">
                  <Palmtree className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Adventure Awaits</p>
                  <p className="text-sm">Explore Kenya's Wonders</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="relative max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-200"></div>
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search for tours, accommodations, transportation, or travel gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 rounded-full border-transparent bg-white dark:bg-slate-800 text-gray-800 dark:text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-transparent w-full shadow-lg"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                <Search className="h-5 w-5" />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="container mx-auto px-4 py-6 relative z-10">{renderCategoryTabs()}</div>

      {/* Category Content */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVendors.map((vendor) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Card
                  className="overflow-hidden border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer"
                  onClick={() => handleVendorClick(vendor)}
                >
                  <div className={`p-4 bg-gradient-to-r ${getCategoryColor(vendor.category)} text-white`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-white/20 p-2 rounded-full">{getCategoryIcon(vendor.category)}</div>
                      <h3 className="text-xl font-semibold">{vendor.name}</h3>
                    </div>
                    <Badge className="bg-white/30 text-white border-0">
                      {vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)}
                    </Badge>
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <StarRating rating={vendor.rating} />
                      <Badge variant="outline" className={getCategoryBgColor(vendor.category)}>
                        {vendor.reviewCount} reviews
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{vendor.description}</p>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {vendor.location}
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {vendor.operatingHours}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      className={`w-full bg-gradient-to-r ${getCategoryColor(vendor.category)} hover:opacity-90 text-white`}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredVendors.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-8 rounded-lg inline-block mb-4">
              <Search className="h-12 w-12 text-blue-500 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any travel services matching your criteria. Try adjusting your search or browse a
              different category.
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white"
              onClick={() => {
                setSearchQuery("")
                setActiveCategory("all")
              }}
            >
              View All Services
            </Button>
          </div>
        )}
      </div>

      {/* Vendor Detail Modal */}
      <Dialog open={!!selectedVendor} onOpenChange={(open) => !open && setSelectedVendor(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedVendor && (
            <>
              <DialogHeader>
                <div
                  className={`p-4 -mt-6 -mx-6 mb-4 bg-gradient-to-r ${getCategoryColor(selectedVendor.category)} text-white`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/20 p-2 rounded-full">{getCategoryIcon(selectedVendor.category)}</div>
                    <DialogTitle className="text-2xl font-bold">{selectedVendor.name}</DialogTitle>
                  </div>
                  <DialogDescription className="text-white/90 mt-1">{selectedVendor.description}</DialogDescription>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Phone className="h-4 w-4 mr-2 text-blue-500" />
                        {selectedVendor.contact.phone}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Mail className="h-4 w-4 mr-2 text-blue-500" />
                        {selectedVendor.contact.email}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Globe className="h-4 w-4 mr-2 text-blue-500" />
                        <a
                          href={`https://${selectedVendor.contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {selectedVendor.contact.website}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Location & Hours</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        {selectedVendor.location}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        {selectedVendor.operatingHours}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVendor.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-xl">Products & Services</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedVendor.products.map((product) => (
                      <Card
                        key={product.id}
                        className="overflow-hidden border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => handleProductClick(product)}
                      >
                        <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            layout="fill"
                            objectFit="cover"
                          />
                          <div className="absolute top-2 right-2 flex flex-col gap-1">
                            {product.isNew && <Badge className="bg-blue-500 text-white">New</Badge>}
                            {product.isPopular && (
                              <Badge className="bg-amber-500 text-white flex items-center gap-1">
                                <Flame className="h-3 w-3" />
                                <span>Popular</span>
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{product.name}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                            >
                              {product.category}
                            </Badge>
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {selectedProduct.name}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative h-60 md:h-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <Image
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {selectedProduct.isNew && <Badge className="bg-blue-500 text-white">New</Badge>}
                    {selectedProduct.isPopular && (
                      <Badge className="bg-amber-500 text-white flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        <span>Popular</span>
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">{selectedProduct.description}</p>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    >
                      {selectedProduct.category}
                    </Badge>
                    <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                      {formatPrice(selectedProduct.price)}
                    </span>
                  </div>

                  {selectedProduct.duration && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Duration: {selectedProduct.duration}</span>
                    </div>
                  )}

                  {selectedProduct.groupSize && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Users className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Group Size: {selectedProduct.groupSize}</span>
                    </div>
                  )}

                  {selectedProduct.startingDates && selectedProduct.startingDates.length > 0 && (
                    <div className="pt-2">
                      <div className="flex items-center text-gray-700 dark:text-gray-200 mb-2">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="font-medium">Available Dates:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.startingDates.map((date, index) => (
                          <Badge
                            key={index}
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {date}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:opacity-90 text-white">
                      Book Now
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span>Save</span>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

