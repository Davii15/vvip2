"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Shield,
  Car,
  Home,
  HeartPulse,
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
  Flame,
  Umbrella,
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

interface InsuranceProvider {
  id: string
  name: string
  logo: string
  category: "health" | "auto" | "home" | "life"
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
  products: InsuranceProduct[]
  amenities: string[]
  images: string[]
}

interface InsuranceProduct {
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

// Mock data for insurance providers
const insuranceProviders: InsuranceProvider[] = [
  // Health Insurance Providers
  {
    id: "health-shield",
    name: "Health Shield",
    logo: "/placeholder.svg?height=80&width=80",
    category: "health",
    description:
      "Comprehensive health insurance solutions for individuals and families with extensive coverage and a wide network of hospitals.",
    rating: 4.8,
    reviewCount: 324,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 712 345 678",
      email: "info@healthshield.co.ke",
      website: "www.healthshield.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM",
    amenities: ["Online Claims", "24/7 Support", "Mobile App", "Hospital Network", "Wellness Programs"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "family-health",
        name: "Family Health Cover",
        description:
          "Comprehensive health insurance for families with coverage for inpatient, outpatient, dental, and optical services.",
        price: { amount: 75000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Family Plans",
        tags: ["Family", "Comprehensive", "Dental"],
      },
      {
        id: "individual-health",
        name: "Individual Health Plan",
        description: "Tailored health insurance for individuals with flexible coverage options and wellness benefits.",
        price: { amount: 35000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Individual Plans",
        tags: ["Individual", "Flexible", "Wellness"],
      },
      {
        id: "senior-care",
        name: "Senior Care Plus",
        description:
          "Specialized health insurance for seniors with enhanced coverage for chronic conditions and checkups.",
        price: { amount: 60000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Senior Plans",
        tags: ["Seniors", "Chronic Care", "Checkups"],
      },
      {
        id: "maternity-cover",
        name: "Maternity Coverage",
        description: "Comprehensive maternity coverage including prenatal care, delivery, and postnatal services.",
        price: { amount: 45000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Specialized Coverage",
        tags: ["Maternity", "Prenatal", "Postnatal"],
      },
    ],
  },
  {
    id: "wellness-assurance",
    name: "Wellness Assurance",
    logo: "/placeholder.svg?height=80&width=80",
    category: "health",
    description:
      "Health insurance provider focusing on preventive care and wellness programs with innovative digital health solutions.",
    rating: 4.7,
    reviewCount: 256,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 723 456 789",
      email: "care@wellnessassurance.com",
      website: "www.wellnessassurance.com",
    },
    openingHours: "Mon-Fri: 8:30 AM - 5:30 PM, Sat: 9:00 AM - 12:00 PM",
    amenities: [
      "Telemedicine",
      "Fitness Programs",
      "Nutrition Counseling",
      "Mental Health Support",
      "Health Tracking App",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "wellness-complete",
        name: "Wellness Complete",
        description: "Holistic health plan with preventive care, fitness benefits, and comprehensive medical coverage.",
        price: { amount: 55000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Wellness Plans",
        tags: ["Preventive", "Fitness", "Holistic"],
      },
      {
        id: "digital-health",
        name: "Digital Health Plan",
        description:
          "Modern health insurance with telemedicine services, digital health tracking, and traditional coverage.",
        price: { amount: 42000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Digital Plans",
        tags: ["Telemedicine", "Digital", "Modern"],
      },
      {
        id: "mental-wellness",
        name: "Mental Wellness Cover",
        description: "Specialized plan with enhanced mental health benefits, therapy sessions, and wellness coaching.",
        price: { amount: 38000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Specialized Coverage",
        tags: ["Mental Health", "Therapy", "Wellness"],
      },
      {
        id: "corporate-wellness",
        name: "Corporate Wellness Program",
        description: "Comprehensive health plan for businesses with employee wellness programs and group benefits.",
        price: { amount: 250000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Corporate Plans",
        tags: ["Corporate", "Employee", "Group"],
      },
    ],
  },

  // Auto Insurance Providers
  {
    id: "drive-secure",
    name: "Drive Secure",
    logo: "/placeholder.svg?height=80&width=80",
    category: "auto",
    description:
      "Comprehensive auto insurance with quick claims processing, roadside assistance, and competitive rates.",
    rating: 4.9,
    reviewCount: 189,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 734 567 890",
      email: "info@drivesecure.co.ke",
      website: "www.drivesecure.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM",
    amenities: ["Roadside Assistance", "Quick Claims", "Mobile App", "Garage Network", "No-Claims Bonus"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "comprehensive-auto",
        name: "Comprehensive Auto Cover",
        description:
          "Full coverage auto insurance protecting against accidents, theft, fire, and third-party liability.",
        price: { amount: 45000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Comprehensive Plans",
        tags: ["Full Coverage", "Theft", "Accidents"],
      },
      {
        id: "third-party",
        name: "Third-Party Insurance",
        description: "Basic legal requirement coverage for third-party damages and injuries.",
        price: { amount: 15000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Basic Plans",
        tags: ["Third-Party", "Basic", "Legal"],
      },
      {
        id: "premium-auto",
        name: "Premium Auto Shield",
        description: "Elite auto insurance with enhanced benefits, zero depreciation, and premium roadside services.",
        price: { amount: 65000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Premium Plans",
        tags: ["Premium", "Zero Depreciation", "Enhanced"],
      },
      {
        id: "commercial-auto",
        name: "Commercial Vehicle Insurance",
        description: "Specialized coverage for commercial vehicles including trucks, taxis, and delivery vehicles.",
        price: { amount: 75000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Commercial Plans",
        tags: ["Commercial", "Business", "Fleet"],
      },
    ],
  },
  {
    id: "auto-protect",
    name: "Auto Protect Plus",
    logo: "/placeholder.svg?height=80&width=80",
    category: "auto",
    description:
      "Innovative auto insurance with usage-based options, digital claims processing, and personalized coverage.",
    rating: 4.6,
    reviewCount: 215,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 745 678 901",
      email: "support@autoprotectplus.co.ke",
      website: "www.autoprotectplus.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 5:30 PM, Sat: 9:00 AM - 1:00 PM",
    amenities: ["Usage-Based Insurance", "Digital Claims", "Car Tracking", "Accident Forgiveness", "Courtesy Car"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "pay-per-mile",
        name: "Pay-Per-Mile Insurance",
        description: "Usage-based insurance with premiums calculated based on actual miles driven.",
        price: { amount: 25000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Usage-Based Plans",
        tags: ["Pay-Per-Mile", "Flexible", "Economical"],
      },
      {
        id: "digital-auto",
        name: "Digital Auto Cover",
        description: "Modern auto insurance with digital claims, mobile app management, and instant assistance.",
        price: { amount: 35000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Digital Plans",
        tags: ["Digital", "Mobile", "Instant"],
      },
      {
        id: "young-driver",
        name: "Young Driver Shield",
        description: "Specialized coverage for new and young drivers with educational benefits and gradual discounts.",
        price: { amount: 40000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Specialized Plans",
        tags: ["Young Drivers", "New Drivers", "Educational"],
      },
      {
        id: "luxury-auto",
        name: "Luxury Vehicle Coverage",
        description:
          "Premium insurance for luxury and high-value vehicles with specialized repair and replacement options.",
        price: { amount: 120000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Premium Plans",
        tags: ["Luxury", "High-Value", "Specialized"],
      },
    ],
  },

  // Home Insurance Providers
  {
    id: "home-shield",
    name: "Home Shield",
    logo: "/placeholder.svg?height=80&width=80",
    category: "home",
    description:
      "Comprehensive home insurance protecting your property, belongings, and liability with customizable coverage options.",
    rating: 4.8,
    reviewCount: 178,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 756 789 012",
      email: "info@homeshield.co.ke",
      website: "www.homeshield.co.ke",
    },
    openingHours: "Mon-Fri: 8:30 AM - 5:00 PM, Sat: 9:00 AM - 12:00 PM",
    amenities: ["24/7 Claims", "Home Inspection", "Emergency Repairs", "Content Valuation", "Liability Coverage"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "complete-home",
        name: "Complete Home Protection",
        description:
          "All-inclusive home insurance covering structure, contents, liability, and additional living expenses.",
        price: { amount: 35000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Comprehensive Plans",
        tags: ["All-inclusive", "Structure", "Contents"],
      },
      {
        id: "building-only",
        name: "Building Insurance",
        description:
          "Coverage for the physical structure of your home against fire, natural disasters, and other perils.",
        price: { amount: 20000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Basic Plans",
        tags: ["Structure", "Building", "Basic"],
      },
      {
        id: "contents-cover",
        name: "Contents Insurance",
        description:
          "Protection for your personal belongings, furniture, and valuables against theft, damage, and loss.",
        price: { amount: 15000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Contents Plans",
        tags: ["Contents", "Belongings", "Valuables"],
      },
      {
        id: "landlord-insurance",
        name: "Landlord Property Insurance",
        description:
          "Specialized coverage for rental properties including structure, liability, and rental income protection.",
        price: { amount: 45000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Specialized Plans",
        tags: ["Landlord", "Rental", "Income Protection"],
      },
    ],
  },
  {
    id: "secure-dwelling",
    name: "Secure Dwelling",
    logo: "/placeholder.svg?height=80&width=80",
    category: "home",
    description:
      "Innovative home insurance with smart home integration, preventive benefits, and flexible coverage options.",
    rating: 4.7,
    reviewCount: 145,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 767 890 123",
      email: "support@securedwelling.co.ke",
      website: "www.securedwelling.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 5:30 PM, Sat: 9:00 AM - 1:00 PM",
    amenities: [
      "Smart Home Discounts",
      "Preventive Measures",
      "Digital Inventory",
      "Flood Sensors",
      "Security Integration",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "smart-home-cover",
        name: "Smart Home Insurance",
        description:
          "Modern home insurance with discounts for smart home devices and preventive technology integration.",
        price: { amount: 30000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Smart Home Plans",
        tags: ["Smart Home", "Technology", "Preventive"],
      },
      {
        id: "premium-home",
        name: "Premium Home Shield",
        description: "High-end home insurance with enhanced coverage limits, premium service, and exclusive benefits.",
        price: { amount: 55000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Premium Plans",
        tags: ["Premium", "High-end", "Enhanced"],
      },
      {
        id: "disaster-protection",
        name: "Natural Disaster Coverage",
        description:
          "Specialized insurance focusing on protection against floods, earthquakes, and other natural disasters.",
        price: { amount: 25000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Specialized Plans",
        tags: ["Disasters", "Floods", "Earthquakes"],
      },
      {
        id: "home-business",
        name: "Home Business Insurance",
        description:
          "Combined coverage for homes with business operations, protecting both residential and business assets.",
        price: { amount: 40000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Business Plans",
        tags: ["Home Business", "Combined", "Business Assets"],
      },
    ],
  },

  // Life Insurance Providers
  {
    id: "life-secure",
    name: "Life Secure",
    logo: "/placeholder.svg?height=80&width=80",
    category: "life",
    description:
      "Comprehensive life insurance solutions providing financial security for your loved ones and retirement planning options.",
    rating: 4.9,
    reviewCount: 312,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 778 901 234",
      email: "info@lifesecure.co.ke",
      website: "www.lifesecure.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 12:00 PM",
    amenities: ["Financial Planning", "Estate Planning", "Policy Reviews", "Beneficiary Services", "Online Management"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "term-life",
        name: "Term Life Insurance",
        description: "Affordable life insurance providing coverage for a specific term with flexible renewal options.",
        price: { amount: 25000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Term Plans",
        tags: ["Term", "Affordable", "Flexible"],
      },
      {
        id: "whole-life",
        name: "Whole Life Coverage",
        description:
          "Permanent life insurance with coverage for your entire life and cash value accumulation benefits.",
        price: { amount: 75000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Permanent Plans",
        tags: ["Permanent", "Cash Value", "Lifetime"],
      },
      {
        id: "education-plan",
        name: "Education Insurance Plan",
        description: "Life insurance with education funding benefits for children's future educational expenses.",
        price: { amount: 45000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Education Plans",
        tags: ["Education", "Children", "Future"],
      },
      {
        id: "retirement-plan",
        name: "Retirement Security Plan",
        description:
          "Combined life insurance and retirement planning solution for financial security in your golden years.",
        price: { amount: 60000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Retirement Plans",
        tags: ["Retirement", "Security", "Planning"],
      },
    ],
  },
  {
    id: "future-protect",
    name: "Future Protect",
    logo: "/placeholder.svg?height=80&width=80",
    category: "life",
    description:
      "Innovative life insurance provider offering flexible policies, investment options, and digital management tools.",
    rating: 4.8,
    reviewCount: 267,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 789 012 345",
      email: "care@futureprotect.co.ke",
      website: "www.futureprotect.co.ke",
    },
    openingHours: "Mon-Fri: 8:30 AM - 5:30 PM, Sat: 9:00 AM - 1:00 PM",
    amenities: [
      "Investment Options",
      "Digital Policy Management",
      "Financial Advisors",
      "Health Rewards",
      "Family Benefits",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "investment-life",
        name: "Investment-Linked Life Insurance",
        description:
          "Life insurance with investment components allowing for potential growth while providing protection.",
        price: { amount: 85000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Investment Plans",
        tags: ["Investment", "Growth", "Protection"],
      },
      {
        id: "family-income",
        name: "Family Income Benefit",
        description: "Life insurance providing regular income to your family in case of your untimely demise.",
        price: { amount: 55000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Family Plans",
        tags: ["Family", "Income", "Regular Payments"],
      },
      {
        id: "critical-illness",
        name: "Critical Illness Cover",
        description:
          "Combined life and critical illness insurance providing lump-sum payment upon diagnosis of serious illnesses.",
        price: { amount: 65000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Health Plans",
        tags: ["Critical Illness", "Diagnosis", "Lump-sum"],
      },
      {
        id: "business-continuity",
        name: "Business Continuity Insurance",
        description: "Life insurance for business owners ensuring business continuity and succession planning.",
        price: { amount: 120000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Business Plans",
        tags: ["Business", "Continuity", "Succession"],
      },
    ],
  },
]

export default function InsuranceShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<InsuranceProvider | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<InsuranceProduct | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter providers based on active category and search query
  const filteredProviders = insuranceProviders.filter((provider) => {
    // Filter by category
    if (activeCategory !== "all" && provider.category !== activeCategory) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        provider.name.toLowerCase().includes(query) ||
        provider.description.toLowerCase().includes(query) ||
        provider.products.some(
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

  // Handle provider click
  const handleProviderClick = (provider: InsuranceProvider) => {
    setSelectedProvider(provider)
  }

  // Handle product click
  const handleProductClick = (product: InsuranceProduct) => {
    setSelectedProduct(product)
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "health":
        return <HeartPulse className="h-6 w-6" />
      case "auto":
        return <Car className="h-6 w-6" />
      case "home":
        return <Home className="h-6 w-6" />
      case "life":
        return <Umbrella className="h-6 w-6" />
      default:
        return <Shield className="h-6 w-6" />
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "health":
        return "from-blue-500 to-cyan-500"
      case "auto":
        return "from-red-500 to-orange-500"
      case "home":
        return "from-green-500 to-emerald-500"
      case "life":
        return "from-purple-500 to-indigo-500"
      default:
        return "from-blue-500 to-cyan-500"
    }
  }

  // Get category background color
  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case "health":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "auto":
        return "bg-red-100 text-red-800 border-red-200"
      case "home":
        return "bg-green-100 text-green-800 border-green-200"
      case "life":
        return "bg-purple-100 text-purple-800 border-purple-200"
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
          { id: "all", name: "All Insurance", icon: <Shield className="h-5 w-5" /> },
          { id: "health", name: "Health", icon: <HeartPulse className="h-5 w-5" /> },
          { id: "auto", name: "Auto", icon: <Car className="h-5 w-5" /> },
          { id: "home", name: "Home", icon: <Home className="h-5 w-5" /> },
          { id: "life", name: "Life", icon: <Umbrella className="h-5 w-5" /> },
        ].map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              activeCategory === category.id
                ? `bg-gradient-to-r ${
                    category.id === "all"
                      ? "from-blue-500 to-cyan-500"
                      : category.id === "health"
                        ? "from-blue-500 to-cyan-500"
                        : category.id === "auto"
                          ? "from-red-500 to-orange-500"
                          : category.id === "home"
                            ? "from-green-500 to-emerald-500"
                            : "from-purple-500 to-indigo-500"
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-500 to-cyan-600 py-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-300 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-cyan-300 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/insurance" className="flex items-center text-white mb-4 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Insurance
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Insurance Shop</h1>
              <p className="text-blue-100 max-w-2xl">
                Discover comprehensive insurance solutions for health, auto, home, and life to protect what matters most
                to you.
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
                  <Shield className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Protection Plans</p>
                  <p className="text-sm">Peace of Mind</p>
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
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-200"></div>
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search for insurance providers, plans, or coverage..."
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
            {filteredProviders.map((provider) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Card
                  className="overflow-hidden border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer"
                  onClick={() => handleProviderClick(provider)}
                >
                  <div className={`p-4 bg-gradient-to-r ${getCategoryColor(provider.category)} text-white`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-white/20 p-2 rounded-full">{getCategoryIcon(provider.category)}</div>
                      <h3 className="text-xl font-semibold">{provider.name}</h3>
                    </div>
                    <Badge className="bg-white/30 text-white border-0">
                      {provider.category.charAt(0).toUpperCase() + provider.category.slice(1)}
                    </Badge>
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <StarRating rating={provider.rating} />
                      <Badge variant="outline" className={getCategoryBgColor(provider.category)}>
                        {provider.reviewCount} reviews
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{provider.description}</p>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {provider.location}
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {provider.openingHours}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      className={`w-full bg-gradient-to-r ${getCategoryColor(provider.category)} hover:opacity-90 text-white`}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredProviders.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-8 rounded-lg inline-block mb-4">
              <Search className="h-12 w-12 text-blue-500 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any insurance providers matching your criteria. Try adjusting your search or browse a
              different category.
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
              onClick={() => {
                setSearchQuery("")
                setActiveCategory("all")
              }}
            >
              View All Providers
            </Button>
          </div>
        )}
      </div>

      {/* Provider Detail Modal */}
      <Dialog open={!!selectedProvider} onOpenChange={(open) => !open && setSelectedProvider(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProvider && (
            <>
              <DialogHeader>
                <div
                  className={`p-4 -mt-6 -mx-6 mb-4 bg-gradient-to-r ${getCategoryColor(selectedProvider.category)} text-white`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/20 p-2 rounded-full">{getCategoryIcon(selectedProvider.category)}</div>
                    <DialogTitle className="text-2xl font-bold">{selectedProvider.name}</DialogTitle>
                  </div>
                  <DialogDescription className="text-white/90 mt-1">{selectedProvider.description}</DialogDescription>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Phone className="h-4 w-4 mr-2 text-blue-500" />
                        {selectedProvider.contact.phone}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Mail className="h-4 w-4 mr-2 text-blue-500" />
                        {selectedProvider.contact.email}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Globe className="h-4 w-4 mr-2 text-blue-500" />
                        <a
                          href={`https://${selectedProvider.contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {selectedProvider.contact.website}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Location & Hours</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        {selectedProvider.location}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        {selectedProvider.openingHours}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProvider.amenities.map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-xl">Insurance Plans</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedProvider.products.map((product) => (
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

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Coverage</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:opacity-90 text-white">
                      Get Quote
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

