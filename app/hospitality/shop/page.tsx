"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Utensils,
  Coffee,
  Users,
  Palmtree,
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

interface HospitalityVendor {
  id: string
  name: string
  logo: string
  category: "food" | "drinks" | "conferences" | "gateways"
  description: string
  rating: number
  reviewCount: number
  location: string
  contact: {
    phone: string
    email: string
    website: string
  }
  openingHours: string
  products: HospitalityProduct[]
  amenities: string[]
  images: string[]
}

interface HospitalityProduct {
  id: string
  name: string
  description: string
  price: Price
  image: string
  isPopular?: boolean
  isNew?: boolean
  category: string
  tags: string[]
}

// Helper function to format price
const formatPrice = (price: Price): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount)
}

// Mock data for hospitality vendors
const hospitalityVendors: HospitalityVendor[] = [
  // Food Vendors
  {
    id: "savanna-grill",
    name: "Savanna Grill",
    logo: "/placeholder.svg?height=80&width=80",
    category: "food",
    description:
      "Experience authentic African cuisine with a modern twist. Our chefs use locally sourced ingredients to create memorable dining experiences.",
    rating: 4.8,
    reviewCount: 324,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 712 345 678",
      email: "info@savannagrill.co.ke",
      website: "www.savannagrill.co.ke",
    },
    openingHours: "Mon-Sun: 7:00 AM - 10:00 PM",
    amenities: ["Free Wi-Fi", "Outdoor Seating", "Private Dining", "Wheelchair Accessible", "Valet Parking"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "nyama-choma",
        name: "Nyama Choma Platter",
        description:
          "Grilled assortment of premium meats including beef, goat, and chicken, served with ugali and kachumbari.",
        price: { amount: 2500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Main Course",
        tags: ["Meat", "Grilled", "Traditional"],
      },
      {
        id: "fish-tilapia",
        name: "Whole Tilapia Fish",
        description: "Fresh tilapia fish grilled to perfection, served with traditional sides and tangy sauce.",
        price: { amount: 1800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Seafood",
        tags: ["Fish", "Grilled", "Healthy"],
      },
      {
        id: "african-buffet",
        name: "African Heritage Buffet",
        description: "All-you-can-eat selection of authentic African dishes from across the continent.",
        price: { amount: 3200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Buffet",
        tags: ["Variety", "Traditional", "Value"],
      },
      {
        id: "swahili-coconut-curry",
        name: "Swahili Coconut Curry",
        description: "Aromatic curry with your choice of protein, cooked in rich coconut sauce with coastal spices.",
        price: { amount: 1600, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Main Course",
        tags: ["Spicy", "Coastal", "Curry"],
      },
    ],
  },
  {
    id: "nairobi-harvest",
    name: "Nairobi Harvest",
    logo: "/placeholder.svg?height=80&width=80",
    category: "food",
    description:
      "Farm-to-table restaurant specializing in organic, locally-sourced ingredients and innovative Kenyan fusion cuisine.",
    rating: 4.7,
    reviewCount: 256,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 723 456 789",
      email: "reservations@nairobiharvest.com",
      website: "www.nairobiharvest.com",
    },
    openingHours: "Tue-Sun: 11:00 AM - 11:00 PM, Closed on Mondays",
    amenities: ["Organic Menu", "Garden Seating", "Private Events", "Vegetarian Options", "Wine Pairing"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "farm-salad",
        name: "Harvest Farm Salad",
        description:
          "Fresh seasonal vegetables from our farm with house-made vinaigrette and toasted indigenous seeds.",
        price: { amount: 950, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Starters",
        tags: ["Vegetarian", "Organic", "Healthy"],
      },
      {
        id: "slow-roast-lamb",
        name: "Slow-Roasted Lamb Shank",
        description:
          "24-hour marinated lamb shank, slow-roasted with indigenous herbs and served with root vegetables.",
        price: { amount: 2800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Main Course",
        tags: ["Lamb", "Slow-cooked", "Signature"],
      },
      {
        id: "vegetable-platter",
        name: "Indigenous Vegetable Platter",
        description: "Selection of traditional Kenyan vegetables prepared with modern cooking techniques.",
        price: { amount: 1400, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Vegetarian",
        tags: ["Vegetarian", "Traditional", "Healthy"],
      },
      {
        id: "kenyan-dessert",
        name: "Kenyan Dessert Trio",
        description: "Three signature desserts featuring local fruits and flavors, with a modern presentation.",
        price: { amount: 1100, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Desserts",
        tags: ["Sweet", "Fruits", "Signature"],
      },
    ],
  },

  // Drinks Vendors
  {
    id: "savanna-spirits",
    name: "Savanna Spirits",
    logo: "/placeholder.svg?height=80&width=80",
    category: "drinks",
    description: "Craft cocktail bar specializing in African-inspired drinks using local spirits, fruits, and herbs.",
    rating: 4.9,
    reviewCount: 189,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 734 567 890",
      email: "info@savannaspirits.co.ke",
      website: "www.savannaspirits.co.ke",
    },
    openingHours: "Mon-Thu: 4:00 PM - 12:00 AM, Fri-Sat: 4:00 PM - 2:00 AM, Sun: 2:00 PM - 10:00 PM",
    amenities: ["Craft Cocktails", "Rooftop Seating", "Live Music", "Happy Hour", "Private Events"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "baobab-martini",
        name: "Baobab Martini",
        description: "Premium vodka infused with baobab fruit, shaken with fresh lime and a hint of honey.",
        price: { amount: 1200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Signature Cocktails",
        tags: ["Vodka", "Fruity", "Signature"],
      },
      {
        id: "sunset-sangria",
        name: "African Sunset Sangria",
        description: "Red wine blend with local fruits, spices, and a splash of Amarula cream liqueur.",
        price: { amount: 950, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Wine Cocktails",
        tags: ["Wine", "Fruity", "Refreshing"],
      },
      {
        id: "kenyan-coffee-martini",
        name: "Kenyan Coffee Martini",
        description: "Espresso made from Kenyan AA coffee beans, vodka, and coffee liqueur with a chocolate rim.",
        price: { amount: 1100, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Signature Cocktails",
        tags: ["Coffee", "Vodka", "Dessert"],
      },
      {
        id: "craft-beer-flight",
        name: "Kenyan Craft Beer Flight",
        description: "Tasting selection of four local craft beers with tasting notes.",
        price: { amount: 1300, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Beer",
        tags: ["Beer", "Local", "Tasting"],
      },
    ],
  },
  {
    id: "chai-masters",
    name: "Chai Masters",
    logo: "/placeholder.svg?height=80&width=80",
    category: "drinks",
    description:
      "Specialty tea and coffee house featuring premium Kenyan teas, coffees, and innovative non-alcoholic beverages.",
    rating: 4.6,
    reviewCount: 215,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 745 678 901",
      email: "hello@chaimasters.co.ke",
      website: "www.chaimasters.co.ke",
    },
    openingHours: "Mon-Sun: 6:30 AM - 9:00 PM",
    amenities: ["Free Wi-Fi", "Workspace Tables", "Pastries", "Book Corner", "Outdoor Seating"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "masai-chai",
        name: "Masai Chai Latte",
        description: "Traditional Kenyan chai with a blend of spices, steamed milk, and a touch of honey.",
        price: { amount: 450, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Hot Drinks",
        tags: ["Tea", "Spicy", "Signature"],
      },
      {
        id: "kenyan-pour-over",
        name: "Kenyan AA Pour Over",
        description: "Single-origin Kenyan AA coffee beans prepared using the pour-over method for maximum flavor.",
        price: { amount: 500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Coffee",
        tags: ["Coffee", "Artisanal", "Local"],
      },
      {
        id: "hibiscus-iced-tea",
        name: "Hibiscus & Baobab Iced Tea",
        description: "Refreshing blend of hibiscus flowers and baobab fruit, lightly sweetened and served over ice.",
        price: { amount: 400, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Cold Drinks",
        tags: ["Tea", "Refreshing", "Healthy"],
      },
      {
        id: "fruit-smoothie",
        name: "Tropical Fruit Smoothie",
        description: "Blend of mango, passion fruit, banana, and pineapple with a hint of ginger.",
        price: { amount: 550, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Smoothies",
        tags: ["Fruit", "Refreshing", "Healthy"],
      },
    ],
  },

  // Conference Vendors
  {
    id: "serena-conference",
    name: "Serena Conference Center",
    logo: "/placeholder.svg?height=80&width=80",
    category: "conferences",
    description:
      "Premium conference and event venue with state-of-the-art facilities, professional staff, and customizable spaces.",
    rating: 4.8,
    reviewCount: 178,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 756 789 012",
      email: "events@serenaconference.co.ke",
      website: "www.serenaconference.co.ke",
    },
    openingHours: "Mon-Sun: 7:00 AM - 10:00 PM",
    amenities: ["AV Equipment", "High-speed Wi-Fi", "Catering Services", "Breakout Rooms", "Technical Support"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "grand-ballroom",
        name: "Grand Ballroom",
        description: "Elegant 500-person capacity ballroom with state-of-the-art AV equipment and customizable layout.",
        price: { amount: 150000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Large Venues",
        tags: ["Large", "Elegant", "Customizable"],
      },
      {
        id: "executive-boardroom",
        name: "Executive Boardroom",
        description: "Intimate boardroom for up to 20 people with premium furnishings and integrated technology.",
        price: { amount: 45000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Small Venues",
        tags: ["Intimate", "Business", "Premium"],
      },
      {
        id: "garden-pavilion",
        name: "Garden Pavilion",
        description: "Outdoor covered venue for up to 200 people with beautiful garden views and natural lighting.",
        price: { amount: 85000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Outdoor Venues",
        tags: ["Outdoor", "Scenic", "Natural"],
      },
      {
        id: "conference-package",
        name: "Full-Day Conference Package",
        description:
          "Comprehensive package including venue, AV equipment, catering, and support staff for a full-day event.",
        price: { amount: 250000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Packages",
        tags: ["All-inclusive", "Professional", "Convenient"],
      },
    ],
  },
  {
    id: "safari-park-events",
    name: "Safari Park Events",
    logo: "/placeholder.svg?height=80&width=80",
    category: "conferences",
    description:
      "Versatile event spaces with a safari theme, offering both indoor and outdoor venues for conferences, meetings, and corporate events.",
    rating: 4.7,
    reviewCount: 145,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 767 890 123",
      email: "bookings@safariparkevents.co.ke",
      website: "www.safariparkevents.co.ke",
    },
    openingHours: "Mon-Sun: 8:00 AM - 8:00 PM",
    amenities: ["Safari-themed Decor", "Team Building Activities", "Outdoor Spaces", "Catering", "Accommodation"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "savanna-hall",
        name: "Savanna Conference Hall",
        description: "Spacious hall for up to 300 people with safari-themed decor and modern conference facilities.",
        price: { amount: 120000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Large Venues",
        tags: ["Themed", "Spacious", "Modern"],
      },
      {
        id: "acacia-room",
        name: "Acacia Meeting Room",
        description: "Medium-sized meeting room for up to 50 people with natural lighting and garden views.",
        price: { amount: 55000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Medium Venues",
        tags: ["Natural", "Professional", "Bright"],
      },
      {
        id: "team-building",
        name: "Corporate Team Building Package",
        description:
          "Full-day package including venue, facilitators, activities, and meals for corporate team building.",
        price: { amount: 180000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Packages",
        tags: ["Team Building", "Activities", "All-inclusive"],
      },
      {
        id: "bush-breakfast",
        name: "Bush Breakfast Meeting",
        description: "Unique outdoor breakfast meeting setup for up to 30 people in a scenic garden setting.",
        price: { amount: 65000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Specialty Venues",
        tags: ["Outdoor", "Unique", "Breakfast"],
      },
    ],
  },

  // Gateway Vendors
  {
    id: "serene-waters",
    name: "Serene Waters Resort",
    logo: "/placeholder.svg?height=80&width=80",
    category: "gateways",
    description:
      "Luxury resort with swimming pools, spa facilities, and relaxation areas set in beautiful natural surroundings.",
    rating: 4.9,
    reviewCount: 312,
    location: "Naivasha, Kenya",
    contact: {
      phone: "+254 778 901 234",
      email: "reservations@serenewaters.co.ke",
      website: "www.serenewaters.co.ke",
    },
    openingHours: "Open 24/7",
    amenities: ["Swimming Pools", "Spa", "Fitness Center", "Restaurant", "Bar", "Private Cabanas"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "day-pass",
        name: "Luxury Day Pass",
        description:
          "Full-day access to all resort facilities including pools, spa, fitness center, and a complimentary lunch.",
        price: { amount: 8500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Day Passes",
        tags: ["All-access", "Luxury", "Full-day"],
      },
      {
        id: "spa-package",
        name: "Rejuvenation Spa Package",
        description: "3-hour spa experience including massage, facial, and body treatment using local ingredients.",
        price: { amount: 12000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Spa",
        tags: ["Relaxation", "Wellness", "Premium"],
      },
      {
        id: "private-cabana",
        name: "Private Pool Cabana",
        description: "Exclusive cabana by the infinity pool with dedicated service, refreshments, and amenities.",
        price: { amount: 15000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Premium Experiences",
        tags: ["Exclusive", "Private", "Luxury"],
      },
      {
        id: "sunset-cruise",
        name: "Lake Sunset Cruise",
        description: "Evening boat cruise on the lake with drinks, snacks, and breathtaking sunset views.",
        price: { amount: 6500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Activities",
        tags: ["Scenic", "Romantic", "Relaxing"],
      },
    ],
  },
  {
    id: "safari-trails",
    name: "Safari Trails Adventures",
    logo: "/placeholder.svg?height=80&width=80",
    category: "gateways",
    description:
      "Adventure company offering guided nature walks, hiking trails, and outdoor experiences in Kenya's beautiful landscapes.",
    rating: 4.8,
    reviewCount: 267,
    location: "Multiple locations, Kenya",
    contact: {
      phone: "+254 789 012 345",
      email: "adventures@safaritrails.co.ke",
      website: "www.safaritrails.co.ke",
    },
    openingHours: "Mon-Sun: 6:00 AM - 6:00 PM",
    amenities: ["Guided Tours", "Equipment Rental", "Transport", "Refreshments", "Photography Services"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "nature-walk",
        name: "Guided Nature Walk",
        description: "3-hour guided walk through scenic natural areas with an experienced naturalist guide.",
        price: { amount: 3500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Walking Tours",
        tags: ["Nature", "Educational", "Easy"],
      },
      {
        id: "hiking-adventure",
        name: "Full-Day Hiking Adventure",
        description: "Challenging full-day hike to scenic viewpoints with guide, equipment, and packed lunch.",
        price: { amount: 7500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Hiking",
        tags: ["Active", "Challenging", "Scenic"],
      },
      {
        id: "photography-safari",
        name: "Photography Safari Walk",
        description:
          "Specialized walking tour designed for photography enthusiasts with expert guidance on capturing wildlife and landscapes.",
        price: { amount: 9000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Specialty Tours",
        tags: ["Photography", "Wildlife", "Scenic"],
      },
      {
        id: "sunset-yoga",
        name: "Sunset Yoga & Meditation Retreat",
        description: "Evening outdoor yoga and meditation session in a scenic natural setting with refreshments.",
        price: { amount: 4500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Wellness",
        tags: ["Yoga", "Meditation", "Relaxation"],
      },
    ],
  },
]

export default function HospitalityShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVendor, setSelectedVendor] = useState<HospitalityVendor | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<HospitalityProduct | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter vendors based on active category and search query
  const filteredVendors = hospitalityVendors.filter((vendor) => {
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
  const handleVendorClick = (vendor: HospitalityVendor) => {
    setSelectedVendor(vendor)
  }

  // Handle product click
  const handleProductClick = (product: HospitalityProduct) => {
    setSelectedProduct(product)
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "food":
        return <Utensils className="h-6 w-6" />
      case "drinks":
        return <Coffee className="h-6 w-6" />
      case "conferences":
        return <Users className="h-6 w-6" />
      case "gateways":
        return <Palmtree className="h-6 w-6" />
      default:
        return <Sparkles className="h-6 w-6" />
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "food":
        return "from-amber-500 to-orange-600"
      case "drinks":
        return "from-blue-500 to-cyan-500"
      case "conferences":
        return "from-purple-500 to-indigo-500"
      case "gateways":
        return "from-green-500 to-emerald-500"
      default:
        return "from-amber-500 to-orange-600"
    }
  }

  // Get category background color
  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case "food":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "drinks":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "conferences":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "gateways":
        return "bg-green-100 text-green-800 border-green-200"
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
          { id: "food", name: "Foods", icon: <Utensils className="h-5 w-5" /> },
          { id: "drinks", name: "Drinks", icon: <Coffee className="h-5 w-5" /> },
          { id: "conferences", name: "Conferences", icon: <Users className="h-5 w-5" /> },
          { id: "gateways", name: "Gateways", icon: <Palmtree className="h-5 w-5" /> },
          { id: "gateways", name: "Gateways", icon: <Palmtree className="h-5 w-5" /> },
        ].map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              activeCategory === category.id
                ? `bg-gradient-to-r ${
                    category.id === "all"
                      ? "from-amber-500 to-orange-600"
                      : category.id === "food"
                      ? "from-amber-500 to-orange-600"
                      : category.id === "drinks"
                      ? "from-blue-500 to-cyan-500"
                      : category.id === "conferences"
                      ? "from-purple-500 to-indigo-500"
                      : "from-green-500 to-emerald-500"
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 py-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-300 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-orange-300 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/hospitality" className="flex items-center text-white mb-4 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Hospitality
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Hospitality Shop</h1>
              <p className="text-amber-100 max-w-2xl">
                Discover premium hospitality services including fine dining, beverages, conference facilities, and
                relaxation gateways.
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
                  <Utensils className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Premium Services</p>
                  <p className="text-sm">Exceptional Experiences</p>
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
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-200"></div>
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search for hospitality services, vendors, or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 rounded-full border-transparent bg-white dark:bg-slate-800 text-gray-800 dark:text-white placeholder:text-gray-400 focus:ring-amber-500 focus:border-transparent w-full shadow-lg"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500">
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
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
                      {vendor.openingHours}
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
            <div className="bg-amber-100 dark:bg-amber-900/30 p-8 rounded-lg inline-block mb-4">
              <Search className="h-12 w-12 text-amber-500 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any hospitality services matching your criteria. Try adjusting your search or browse a
              different category.
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white"
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
                        <Phone className="h-4 w-4 mr-2 text-amber-500" />
                        {selectedVendor.contact.phone}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Mail className="h-4 w-4 mr-2 text-amber-500" />
                        {selectedVendor.contact.email}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Globe className="h-4 w-4 mr-2 text-amber-500" />
                        <a
                          href={`https://${selectedVendor.contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-500 hover:underline"
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
                        <MapPin className="h-4 w-4 mr-2 text-amber-500" />
                        {selectedVendor.location}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-amber-500" />
                        {selectedVendor.openingHours}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVendor.amenities.map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                        >
                          {amenity}
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
                            <span className="font-bold text-amber-600 dark:text-amber-400">
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
                    <span className="font-bold text-2xl text-amber-600 dark:text-amber-400">
                      {formatPrice(selectedProduct.price)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 text-white">
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

