"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Search,
  Star,
  Hammer,
  Truck,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
  Phone,
  Globe,
  Percent,
  Flame,
  Award,
  BadgePercent,
  Loader2,
  Filter,
  ArrowUpDown,
  HardHat,
  Ruler,
  Check,
  ChevronRight,
  Sparkles,
  Minus,
  Plus,
  Maximize2,
  Package,
  BrickWallIcon as Brick,
  Construction,
  Palette,
  Landmark,
  ShieldCheck,
  Calendar,
  Scale,
  Layers,
  Zap,
  WrenchIcon as Screwdriver,
  PaintbrushIcon as Paint,
  PipetteIcon as Pipe,
  DogIcon as Coyote,
  DogIcon as Wolf,
  BeakerIcon as Bear,
  CloverIcon as Cougar,
  CatIcon as Lynx,
  CatIcon as Bobcat,
  PawPrintIcon as Panther,
  TurtleIcon as Tiger,
  LassoIcon as Lion,
  LeafIcon as Leopard,
  CatIcon as Cheetah,
  CatIcon as Jaguar,
  DogIcon as Hyena,
  DogIcon as Jackal,
  DogIcon as Dingo,
  Paintbrush,
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

interface ConstructionMaterialData {
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
  specifications?: Record<string, string>
  quantity?: {
    value: number
    unit: string
  }
  availableStock?: number
  totalStock?: number
  tags?: string[]
  hotDealEnds?: string
  discount?: number
  vendorId: number | string
  isHotDeal?: boolean
  isTrending?: boolean
  isLowStock?: boolean
  contactNumber?: string
  website?: string
  address?: string
  brand?: string
  warranty?: string
  deliveryAvailable?: boolean
  deliveryFee?: Price
  minOrderQuantity?: number
  bulkDiscountAvailable?: boolean
  bulkDiscountThreshold?: number
  bulkDiscountPercentage?: number
  weight?: {
    value: number
    unit: string
  }
  dimensions?: {
    length: number
    width: number
    height: number
    unit: string
  }
  color?: string
  material?: string
  certifications?: string[]
  madeIn?: string
  applicationArea?: string[]
}

interface Vendor {
  id: number | string
  name: string
  location: string
  logo: string
  description: string
  offerings: ConstructionMaterialData[]
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
  certifications?: string[]
  deliveryOptions?: string[]
  paymentOptions?: string[]
  returnPolicy?: string
  warrantyPolicy?: string
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
    case "building materials":
      return <Brick size={size} />
    case "tools & equipment":
      return <Hammer size={size} />
    case "electrical & plumbing":
      return <Zap size={size} />
    case "finishing materials":
      return <Paintbrush size={size} />
    case "hardware & fasteners":
      return <Screwdriver size={size} />
    default:
      return <Construction size={size} />
  }
}

// Define categories
const categories: Category[] = [
  {
    id: "building-materials",
    name: "Building Materials",
    icon: <Brick className="mr-2" />,
    subcategories: ["Cement", "Bricks", "Timber", "Steel", "Aggregates", "Roofing"],
  },
  {
    id: "tools-equipment",
    name: "Tools & Equipment",
    icon: <Hammer className="mr-2" />,
    subcategories: ["Power Tools", "Hand Tools", "Safety Equipment", "Measuring Tools", "Heavy Machinery"],
  },
  {
    id: "electrical-plumbing",
    name: "Electrical & Plumbing",
    icon: <Zap className="mr-2" />,
    subcategories: ["Wiring", "Switches & Outlets", "Pipes & Fittings", "Fixtures", "Water Systems"],
  },
  {
    id: "finishing-materials",
    name: "Finishing Materials",
    icon: <Paintbrush className="mr-2" />,
    subcategories: ["Paint", "Tiles", "Flooring", "Wallpaper", "Ceiling Materials", "Doors & Windows"],
  },
  {
    id: "hardware-fasteners",
    name: "Hardware & Fasteners",
    icon: <Screwdriver className="mr-2" />,
    subcategories: ["Nails", "Screws", "Bolts", "Brackets", "Hinges", "Locks & Handles"],
  },
]

// Mock data for vendors and offerings
const mockVendors: Vendor[] = [
  // Building Materials
  {
    id: 1,
    name: "Premier Construction Supplies",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Leading supplier of high-quality construction materials for residential and commercial projects.",
    redirectUrl: "https://premierconstructionsupplies.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 356,
    verified:true,
    establishedYear: 2005,
    contactNumber: "+254 712 345 678",
    email: "info@premierconstructionsupplies.co.ke",
    website: "https://premierconstructionsupplies.co.ke",
    certifications: ["ISO 9001:2015", "Kenya Bureau of Standards Certified"],
    deliveryOptions: ["Same Day Delivery", "Scheduled Delivery", "Pickup Available"],
    paymentOptions: ["M-Pesa", "Bank Transfer", "Credit Card", "Cash on Delivery"],
    returnPolicy: "30-day returns on unused materials in original packaging",
    warrantyPolicy: "Manufacturer warranty on all products",
    offerings: [
      {
        id: 101,
        name: "Premium Portland Cement (50kg)",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 750, currency: "KSH" },
        originalPrice: { amount: 850, currency: "KSH" },
        category: "Building Materials",
        subcategory: "Cement",
        description:
          "High-quality Portland cement suitable for all general construction purposes including concrete, mortar, and plastering. Provides excellent strength and durability for your construction projects.",
        location: "Industrial Area, Nairobi",
        isPopular: true,
        dateAdded: "2025-03-10T10:30:00Z",
        rating: 4.9,
        reviewCount: 128,
        features: ["High Strength", "Quick Setting", "Water Resistant", "Versatile Application", "Consistent Quality"],
        specifications: {
          Type: "Portland Cement",
          "Strength Class": "42.5N",
          "Setting Time": "Initial: 60 min, Final: 600 min",
          Fineness: "≤ 10% retained on 90μm sieve",
          Packaging: "50kg bag",
        },
        quantity: { value: 50, unit: "kg" },
        availableStock: 500,
        totalStock: 1000,
        tags: ["Cement", "Construction", "Building", "Foundation"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 1,
        contactNumber: "+254 712 345 678",
        website: "https://premierconstructionsupplies.co.ke",
        address: "Industrial Area, Enterprise Road, Nairobi",
        brand: "SimbaMax",
        warranty: "Guaranteed quality for 6 months when stored properly",
        deliveryAvailable: true,
        deliveryFee: { amount: 1500, currency: "KSH" },
        minOrderQuantity: 10,
        bulkDiscountAvailable: true,
        bulkDiscountThreshold: 100,
        bulkDiscountPercentage: 5,
        weight: { value: 50, unit: "kg" },
        certifications: ["KEBS Certified", "ISO Certified"],
        madeIn: "Kenya",
        applicationArea: ["Foundations", "Structural Concrete", "Masonry", "Plastering", "Flooring"],
      },
      {
        id: 102,
        name: "Reinforced Steel Bars (12mm x 12m)",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 1200, currency: "KSH" },
        originalPrice: { amount: 1350, currency: "KSH" },
        category: "Building Materials",
        subcategory: "Steel",
        description:
          "High-tensile reinforcement steel bars for concrete structures. Provides excellent strength and durability for foundations, columns, beams, and slabs. Ribbed surface ensures better bonding with concrete.",
        location: "Industrial Area, Nairobi",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.8,
        reviewCount: 76,
        features: ["High Tensile Strength", "Corrosion Resistant", "Ribbed Surface", "Uniform Quality", "Easy to Bend"],
        specifications: {
          Diameter: "12mm",
          Length: "12m",
          Grade: "D500",
          "Yield Strength": "≥ 500 N/mm²",
          Surface: "Ribbed",
        },
        quantity: { value: 1, unit: "piece" },
        availableStock: 350,
        totalStock: 500,
        tags: ["Steel", "Reinforcement", "Construction", "Structural"],
        vendorId: 1,
        isTrending: true,
        contactNumber: "+254 712 345 678",
        website: "https://premierconstructionsupplies.co.ke",
        address: "Industrial Area, Enterprise Road, Nairobi",
        brand: "SteelMasters",
        warranty: "Guaranteed quality",
        deliveryAvailable: true,
        deliveryFee: { amount: 2000, currency: "KSH" },
        minOrderQuantity: 5,
        bulkDiscountAvailable: true,
        bulkDiscountThreshold: 50,
        bulkDiscountPercentage: 7,
        weight: { value: 10.6, unit: "kg" },
        dimensions: { length: 12, width: 0.012, height: 0.012, unit: "m" },
        certifications: ["KEBS Certified", "ISO Certified"],
        madeIn: "Kenya",
        applicationArea: ["Foundations", "Columns", "Beams", "Slabs", "Reinforced Concrete Structures"],
      },
    ],
  },
  {
    id: 2,
    name: "Mabati Masters",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Specialized supplier of quality roofing materials and accessories for all construction needs.",
    redirectUrl: "https://mabatimasters.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 245,
    verified:true,
    establishedYear: 2010,
    contactNumber: "+254 723 456 789",
    email: "info@mabatimasters.co.ke",
    website: "https://mabatimasters.co.ke",
    certifications: ["Kenya Bureau of Standards Certified", "ISO 9001:2015"],
    deliveryOptions: ["Free Delivery within Nairobi", "Countrywide Delivery", "Express Delivery"],
    paymentOptions: ["M-Pesa", "Bank Transfer", "Credit Card", "Cash on Delivery"],
    returnPolicy: "14-day returns on unused materials in original condition",
    warrantyPolicy: "Up to 25-year warranty on select products",
    offerings: [
      {
        id: 201,
        name: "Galvanized Corrugated Roofing Sheets (28 Gauge)",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 850, currency: "KSH" },
        originalPrice: { amount: 950, currency: "KSH" },
        category: "Building Materials",
        subcategory: "Roofing",
        description:
          "Durable galvanized corrugated roofing sheets with excellent corrosion resistance. Ideal for residential, commercial, and agricultural buildings. Easy to install and provides long-lasting protection against the elements.",
        location: "Industrial Area, Nairobi",
        isPopular: true,
        dateAdded: "2025-02-20T10:30:00Z",
        rating: 4.7,
        reviewCount: 98,
        features: ["Corrosion Resistant", "Lightweight", "Easy Installation", "Durable", "Weather Resistant"],
        specifications: {
          Material: "Galvanized Steel",
          Gauge: "28",
          Length: "3m",
          Width: "0.9m",
          Coating: "Zinc",
          Profile: "Corrugated",
        },
        quantity: { value: 1, unit: "sheet" },
        availableStock: 200,
        totalStock: 500,
        tags: ["Roofing", "Mabati", "Galvanized", "Construction"],
        isLowStock: false,
        vendorId: 2,
        contactNumber: "+254 723 456 789",
        website: "https://mabatimasters.co.ke",
        address: "Industrial Area, Nairobi",
        brand: "RoofTech",
        warranty: "10-year warranty against perforation",
        deliveryAvailable: true,
        deliveryFee: { amount: 2000, currency: "KSH" },
        minOrderQuantity: 5,
        bulkDiscountAvailable: true,
        bulkDiscountThreshold: 50,
        bulkDiscountPercentage: 10,
        weight: { value: 5.2, unit: "kg" },
        dimensions: { length: 3, width: 0.9, height: 0.017, unit: "m" },
        certifications: ["KEBS Certified"],
        madeIn: "Kenya",
        applicationArea: ["Residential Roofing", "Commercial Buildings", "Agricultural Structures", "Warehouses"],
      },
      {
        id: 202,
        name: "Stone Coated Roofing Tiles (Classic Profile)",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 3500, currency: "KSH" },
        originalPrice: { amount: 4200, currency: "KSH" },
        category: "Building Materials",
        subcategory: "Roofing",
        description:
          "Premium stone-coated steel roofing tiles with classic profile. Combines the strength of steel with the aesthetic appeal of traditional tiles. Excellent durability, weather resistance, and sound insulation properties.",
        location: "Industrial Area, Nairobi",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.9,
        reviewCount: 65,
        features: [
          "Elegant Appearance",
          "Lightweight",
          "Weather Resistant",
          "Sound Insulation",
          "Fire Resistant",
          "Long Lifespan",
        ],
        specifications: {
          Material: "Stone-coated Steel",
          Profile: "Classic Tile",
          Size: "1.35m x 0.42m",
          Coverage: "0.5 m² per tile",
          Weight: "2.8 kg per tile",
          Thickness: "0.4mm base steel",
        },
        quantity: { value: 1, unit: "tile" },
        availableStock: 150,
        totalStock: 300,
        tags: ["Roofing", "Stone Coated", "Tiles", "Premium"],
        hotDealEnds: "2025-04-10T23:59:59Z",
        isHotDeal: true,
        vendorId: 2,
        contactNumber: "+254 723 456 789",
        website: "https://mabatimasters.co.ke",
        address: "Industrial Area, Nairobi",
        brand: "DuraRoof",
        warranty: "25-year warranty",
        deliveryAvailable: true,
        deliveryFee: { amount: 3000, currency: "KSH" },
        minOrderQuantity: 50,
        bulkDiscountAvailable: true,
        bulkDiscountThreshold: 200,
        bulkDiscountPercentage: 15,
        weight: { value: 2.8, unit: "kg" },
        dimensions: { length: 1.35, width: 0.42, height: 0.02, unit: "m" },
        color: "Terracotta Red",
        material: "Stone-coated Steel",
        certifications: ["KEBS Certified", "ISO Certified"],
        madeIn: "Kenya",
        applicationArea: ["Luxury Homes", "Hotels", "Residential Buildings", "Commercial Properties"],
      },
    ],
  },

  // Tools & Equipment
  {
    id: 3,
    name: "ToolMart Kenya",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "One-stop shop for professional-grade tools and construction equipment for contractors and DIY enthusiasts.",
    redirectUrl: "https://toolmart.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.9,
    reviewCount: 412,
    verified:true,
    establishedYear: 2012,
    contactNumber: "+254 734 567 890",
    email: "info@toolmart.co.ke",
    website: "https://toolmart.co.ke",
    certifications: ["Authorized Dealer for Major Brands", "ISO 9001:2015"],
    deliveryOptions: ["Same Day Delivery", "Nationwide Shipping", "Store Pickup"],
    paymentOptions: ["M-Pesa", "Bank Transfer", "Credit Card", "Installment Plans"],
    returnPolicy: "30-day money-back guarantee",
    warrantyPolicy: "Manufacturer warranty plus extended warranty options",
    offerings: [
      {
        id: 301,
        name: "Professional Cordless Drill Set (18V)",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 12500, currency: "KSH" },
        originalPrice: { amount: 15000, currency: "KSH" },
        category: "Tools & Equipment",
        subcategory: "Power Tools",
        description:
          "Professional-grade 18V cordless drill set with brushless motor for maximum efficiency and runtime. Includes two lithium-ion batteries, charger, and carrying case. Perfect for drilling and fastening in wood, metal, and plastic.",
        location: "Westlands, Nairobi",
        isPopular: true,
        dateAdded: "2025-03-05T10:30:00Z",
        rating: 4.9,
        reviewCount: 156,
        features: [
          "Brushless Motor",
          "18V Power",
          "2-Speed Gearbox",
          "LED Work Light",
          "Ergonomic Design",
          "Battery Indicator",
        ],
        specifications: {
          Voltage: "18V",
          "Chuck Size": "13mm",
          "Max Torque": "65Nm",
          Speed: "0-500/0-1800 RPM",
          Battery: "2x 4.0Ah Li-Ion",
          "Charging Time": "60 minutes",
        },
        quantity: { value: 1, unit: "set" },
        availableStock: 25,
        totalStock: 50,
        tags: ["Power Tools", "Drill", "Cordless", "Professional", "DIY"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 3,
        isTrending: true,
        contactNumber: "+254 734 567 890",
        website: "https://toolmart.co.ke",
        address: "Westlands Shopping Center, Nairobi",
        brand: "PowerPro",
        warranty: "3-year manufacturer warranty",
        deliveryAvailable: true,
        deliveryFee: { amount: 500, currency: "KSH" },
        weight: { value: 3.2, unit: "kg" },
        dimensions: { length: 0.35, width: 0.25, height: 0.1, unit: "m" },
        color: "Blue/Black",
        certifications: ["CE Certified", "RoHS Compliant"],
        madeIn: "Germany",
        applicationArea: ["Construction", "Woodworking", "Metal Fabrication", "DIY Projects"],
      },
      {
        id: 302,
        name: "Heavy-Duty Concrete Mixer (350L)",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 85000, currency: "KSH" },
        originalPrice: { amount: 95000, currency: "KSH" },
        category: "Tools & Equipment",
        subcategory: "Heavy Machinery",
        description:
          "Heavy-duty 350L diesel-powered concrete mixer for construction sites. Features durable steel drum, powerful engine, and easy maneuverability. Ideal for medium to large construction projects requiring consistent concrete mixing.",
        location: "Westlands, Nairobi",
        isNew: true,
        dateAdded: "2025-03-12T10:30:00Z",
        rating: 4.8,
        reviewCount: 87,
        features: [
          "350L Capacity",
          "Diesel Engine",
          "Durable Steel Drum",
          "Easy Maintenance",
          "Pneumatic Wheels",
          "Tow Bar",
        ],
        specifications: {
          "Drum Capacity": "350L",
          Engine: "7HP Diesel",
          "Drum Speed": "26 RPM",
          "Fuel Tank": "5L",
          "Mixing Capacity": "210L concrete output",
          Wheels: "4.00-8 pneumatic",
        },
        quantity: { value: 1, unit: "unit" },
        availableStock: 8,
        totalStock: 15,
        tags: ["Heavy Machinery", "Concrete Mixer", "Construction Equipment", "Diesel Powered"],
        vendorId: 3,
        contactNumber: "+254 734 567 890",
        website: "https://toolmart.co.ke",
        address: "Westlands Shopping Center, Nairobi",
        brand: "ConstructMax",
        warranty: "2-year warranty on engine, 1-year on parts",
        deliveryAvailable: true,
        deliveryFee: { amount: 5000, currency: "KSH" },
        weight: { value: 320, unit: "kg" },
        dimensions: { length: 1.8, width: 0.9, height: 1.4, unit: "m" },
        color: "Yellow/Black",
        certifications: ["CE Certified", "ISO Certified"],
        madeIn: "China",
        applicationArea: ["Construction Sites", "Road Works", "Building Projects", "Concrete Production"],
      },
    ],
  },
  {
    id: 4,
    name: "SafetyFirst Equipment",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Specialized provider of high-quality safety equipment and gear for construction professionals.",
    redirectUrl: "https://safetyfirst.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 328,
    verified:true,
    establishedYear: 2015,
    contactNumber: "+254 745 678 901",
    email: "info@safetyfirst.co.ke",
    website: "https://safetyfirst.co.ke",
    certifications: ["ISO 9001:2015", "OSHA Compliant Products"],
    deliveryOptions: ["Next Day Delivery", "Nationwide Shipping", "Bulk Order Delivery"],
    paymentOptions: ["M-Pesa", "Bank Transfer", "Credit Card", "Purchase Orders"],
    returnPolicy: "30-day returns on unused items",
    warrantyPolicy: "Manufacturer warranty on all products",
    offerings: [
      {
        id: 401,
        name: "Construction Safety Helmet Set (10 Pack)",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 8500, currency: "KSH" },
        originalPrice: { amount: 10000, currency: "KSH" },
        category: "Tools & Equipment",
        subcategory: "Safety Equipment",
        description:
          "Set of 10 high-quality construction safety helmets with adjustable harness and ventilation. Provides excellent impact protection and comfort for all-day wear. Complies with international safety standards.",
        location: "Industrial Area, Nairobi",
        isPopular: true,
        dateAdded: "2025-02-25T10:30:00Z",
        rating: 4.8,
        reviewCount: 142,
        features: [
          "Impact Resistant",
          "Adjustable Harness",
          "Ventilation System",
          "UV Protection",
          "Lightweight Design",
        ],
        specifications: {
          Material: "High-Density Polyethylene",
          Standard: "EN 397",
          Weight: "380g per helmet",
          Size: "Adjustable (54-62cm)",
          Colors: "Assorted (Yellow, White, Blue, Red, Green)",
        },
        quantity: { value: 10, unit: "helmets" },
        availableStock: 30,
        totalStock: 50,
        tags: ["Safety Equipment", "Helmets", "Construction Safety", "PPE"],
        vendorId: 4,
        contactNumber: "+254 745 678 901",
        website: "https://safetyfirst.co.ke",
        address: "Industrial Area, Nairobi",
        brand: "SafeGuard",
        warranty: "1-year warranty",
        deliveryAvailable: true,
        deliveryFee: { amount: 500, currency: "KSH" },
        minOrderQuantity: 1,
        bulkDiscountAvailable: true,
        bulkDiscountThreshold: 5,
        bulkDiscountPercentage: 10,
        weight: { value: 3.8, unit: "kg" },
        certifications: ["CE Certified", "ANSI Certified"],
        madeIn: "Taiwan",
        applicationArea: ["Construction Sites", "Industrial Work", "Mining", "Electrical Work"],
      },
      {
        id: 402,
        name: "Full Body Safety Harness with Lanyard",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 4500, currency: "KSH" },
        originalPrice: { amount: 5500, currency: "KSH" },
        category: "Tools & Equipment",
        subcategory: "Safety Equipment",
        description:
          "Professional full-body safety harness with shock-absorbing lanyard for fall protection. Features adjustable straps, quick-connect buckles, and comfortable padding. Essential for working at heights on construction sites.",
        location: "Industrial Area, Nairobi",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.7,
        reviewCount: 68,
        features: [
          "Full Body Protection",
          "Shock-Absorbing Lanyard",
          "Adjustable Straps",
          "Quick-Connect Buckles",
          "Comfortable Padding",
        ],
        specifications: {
          Material: "Polyester Webbing",
          Standard: "EN 361, EN 355",
          "Weight Capacity": "140kg",
          "Lanyard Length": "1.8m",
          "D-Rings": "Dorsal and Chest",
          Buckles: "Quick-Connect Steel",
        },
        quantity: { value: 1, unit: "set" },
        availableStock: 25,
        totalStock: 40,
        tags: ["Safety Equipment", "Fall Protection", "Harness", "Height Work"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        isLowStock: false,
        vendorId: 4,
        contactNumber: "+254 745 678 901",
        website: "https://safetyfirst.co.ke",
        address: "Industrial Area, Nairobi",
        brand: "HeightSafe",
        warranty: "1-year warranty",
        deliveryAvailable: true,
        deliveryFee: { amount: 500, currency: "KSH" },
        weight: { value: 1.8, unit: "kg" },
        color: "Orange/Black",
        certifications: ["CE Certified", "ANSI Certified", "OSHA Compliant"],
        madeIn: "UK",
        applicationArea: ["Construction", "Telecommunications", "Window Cleaning", "Maintenance Work"],
      },
    ],
  },

  // Electrical & Plumbing
  {
    id: 5,
    name: "ElectroPlumb Solutions",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Complete range of electrical and plumbing supplies for residential and commercial construction projects.",
    redirectUrl: "https://electroplumb.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 376,
    verified:true,
    establishedYear: 2013,
    contactNumber: "+254 756 789 012",
    email: "info@electroplumb.co.ke",
    website: "https://electroplumb.co.ke",
    certifications: ["Kenya Bureau of Standards Certified", "ISO 9001:2015"],
    deliveryOptions: ["Same Day Delivery", "Scheduled Delivery", "Express Delivery"],
    paymentOptions: ["M-Pesa", "Bank Transfer", "Credit Card", "Cash on Delivery"],
    returnPolicy: "14-day returns on unused items in original packaging",
    warrantyPolicy: "Manufacturer warranty on all products",
    offerings: [
      {
        id: 501,
        name: "Electrical Wiring Bundle (2.5mm² - 100m)",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 7500, currency: "KSH" },
        originalPrice: { amount: 9000, currency: "KSH" },
        category: "Electrical & Plumbing",
        subcategory: "Wiring",
        description:
          "High-quality 2.5mm² electrical wiring bundle (100m) for residential and commercial installations. Flame-retardant PVC insulation ensures safety and durability. Suitable for general purpose electrical installations.",
        location: "Westlands, Nairobi",
        isPopular: true,
        dateAdded: "2025-03-08T10:30:00Z",
        rating: 4.9,
        reviewCount: 112,
        features: [
          "Flame Retardant",
          "Flexible Copper Core",
          "Durable PVC Insulation",
          "Color-Coded",
          "High Conductivity",
        ],
        specifications: {
          "Wire Size": "2.5mm²",
          Length: "100m",
          Material: "Copper",
          Insulation: "PVC",
          "Voltage Rating": "450/750V",
          "Temperature Range": "-15°C to +70°C",
        },
        quantity: { value: 100, unit: "m" },
        availableStock: 50,
        totalStock: 100,
        tags: ["Electrical", "Wiring", "Copper", "Construction"],
        hotDealEnds: "2025-04-08T23:59:59Z",
        isHotDeal: true,
        isTrending: true,
        vendorId: 5,
        contactNumber: "+254 756 789 012",
        website: "https://electroplumb.co.ke",
        address: "Westlands Business Park, Nairobi",
        brand: "ElectroPro",
        warranty: "10-year warranty",
        deliveryAvailable: true,
        deliveryFee: { amount: 500, currency: "KSH" },
        minOrderQuantity: 1,
        bulkDiscountAvailable: true,
        bulkDiscountThreshold: 5,
        bulkDiscountPercentage: 10,
        weight: { value: 9.5, unit: "kg" },
        color: "Red",
        certifications: ["KEBS Certified", "ISO Certified", "CE Marked"],
        madeIn: "Kenya",
        applicationArea: ["Residential Wiring", "Commercial Buildings", "General Electrical Installations"],
      },
      {
        id: 502,
        name: "PVC Pressure Pipes Bundle (1 inch - 6m x 5pcs)",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 3500, currency: "KSH" },
        originalPrice: { amount: 4200, currency: "KSH" },
        category: "Electrical & Plumbing",
        subcategory: "Pipes & Fittings",
        description:
          "Bundle of 5 high-quality PVC pressure pipes (1 inch diameter, 6m length) for water supply systems. Durable, corrosion-resistant, and easy to install. Suitable for both residential and commercial plumbing applications.",
        location: "Westlands, Nairobi",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.7,
        reviewCount: 78,
        features: [
          "Corrosion Resistant",
          "UV Stabilized",
          "High Pressure Rating",
          "Smooth Interior",
          "Easy Installation",
        ],
        specifications: {
          Diameter: "1 inch (25mm)",
          Length: "6m per pipe",
          Quantity: "5 pipes",
          Material: "uPVC",
          "Pressure Rating": "PN16 (16 bar)",
          Color: "Blue",
        },
        quantity: { value: 5, unit: "pipes" },
        availableStock: 30,
        totalStock: 50,
        tags: ["Plumbing", "PVC Pipes", "Water Supply", "Construction"],
        vendorId: 5,
        contactNumber: "+254 756 789 012",
        website: "https://electroplumb.co.ke",
        address: "Westlands Business Park, Nairobi",
        brand: "FlowMaster",
        warranty: "15-year warranty",
        deliveryAvailable: true,
        deliveryFee: { amount: 1000, currency: "KSH" },
        minOrderQuantity: 1,
        bulkDiscountAvailable: true,
        bulkDiscountThreshold: 5,
        bulkDiscountPercentage: 12,
        weight: { value: 15, unit: "kg" },
        dimensions: { length: 6, width: 0.025, height: 0.025, unit: "m" },
        color: "Blue",
        certifications: ["KEBS Certified", "ISO Certified"],
        madeIn: "Kenya",
        applicationArea: ["Water Supply", "Irrigation", "Swimming Pools", "General Plumbing"],
      },
    ],
  },
  {
    id: 6,
    name: "PowerFlow Systems",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Specialized supplier of electrical and water systems for residential and commercial construction.",
    redirectUrl: "https://powerflow.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.6,
    reviewCount: 289,
    verified:true,
    establishedYear: 2014,
    contactNumber: "+254 767 890 123",
    email: "info@powerflow.co.ke",
    website: "https://powerflow.co.ke",
    certifications: ["Kenya Bureau of Standards Certified", "ISO 9001:2015"],
    deliveryOptions: ["Nationwide Delivery", "Express Shipping", "Store Pickup"],
    paymentOptions: ["M-Pesa", "Bank Transfer", "Credit Card", "Cash on Delivery"],
    returnPolicy: "30-day returns on unused items",
    warrantyPolicy: "1-5 year warranty depending on product",
    offerings: [
      {
        id: 601,
        name: "Solar Water Heating System (200L)",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 85000, currency: "KSH" },
        originalPrice: { amount: 95000, currency: "KSH" },
        category: "Electrical & Plumbing",
        subcategory: "Water Systems",
        description:
          "Complete 200L solar water heating system for residential use. Includes solar collector panels, insulated tank, mounting hardware, and all necessary fittings. Provides hot water using renewable solar energy, reducing electricity costs.",
        location: "Nyali, Mombasa",
        isPopular: true,
        dateAdded: "2025-02-28T10:30:00Z",
        rating: 4.6,
        reviewCount: 95,
        features: [
          "Energy Efficient",
          "200L Capacity",
          "Pressurized System",
          "Evacuated Tube Collector",
          "Insulated Tank",
          "Complete Kit",
        ],
        specifications: {
          "Tank Capacity": "200L",
          "Collector Type": "Evacuated Tube (20 tubes)",
          "Working Pressure": "6 bar",
          Insulation: "50mm Polyurethane Foam",
          "Backup Heating": "Electric Element (1.5kW)",
          "Frame Material": "Aluminum Alloy",
        },
        quantity: { value: 1, unit: "system" },
        availableStock: 10,
        totalStock: 20,
        tags: ["Solar", "Water Heating", "Renewable Energy", "Plumbing"],
        vendorId: 6,
        contactNumber: "+254 767 890 123",
        website: "https://powerflow.co.ke",
        address: "Nyali Road, Mombasa",
        brand: "SolarTech",
        warranty: "5-year system warranty, 10-year collector warranty",
        deliveryAvailable: true,
        deliveryFee: { amount: 5000, currency: "KSH" },
        weight: { value: 120, unit: "kg" },
        dimensions: { length: 2, width: 1, height: 2, unit: "m" },
        certifications: ["KEBS Certified", "Solar Keymark"],
        madeIn: "China",
        applicationArea: ["Residential Buildings", "Small Hotels", "Apartments", "Family Homes"],
      },
      {
        id: 602,
        name: "Complete House Electrical Kit",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 45000, currency: "KSH" },
        originalPrice: { amount: 55000, currency: "KSH" },
        category: "Electrical & Plumbing",
        subcategory: "Electrical",
        description:
          "Comprehensive electrical kit for a 3-bedroom house. Includes distribution board, circuit breakers, wiring, switches, sockets, light fixtures, and all necessary accessories. Perfect for new construction or complete renovation.",
        location: "Nyali, Mombasa",
        isNew: true,
        dateAdded: "2025-03-20T10:30:00Z",
        rating: 4.5,
        reviewCount: 42,
        features: [
          "Complete Solution",
          "Quality Components",
          "Pre-measured Wiring",
          "Modern Design",
          "Safety Certified",
        ],
        specifications: {
          "Distribution Board": "12-way with RCD protection",
          Wiring: "1.5mm² and 2.5mm² (200m total)",
          Switches: "20 pcs (1-way and 2-way)",
          Sockets: "15 pcs (double)",
          "Light Fixtures": "10 pcs (LED)",
          "Circuit Breakers": "Various ratings included",
        },
        quantity: { value: 1, unit: "kit" },
        availableStock: 5,
        totalStock: 10,
        tags: ["Electrical", "House Wiring", "Complete Kit", "Construction"],
        hotDealEnds: "2025-04-20T23:59:59Z",
        isHotDeal: true,
        isLowStock: true,
        vendorId: 6,
        contactNumber: "+254 767 890 123",
        website: "https://powerflow.co.ke",
        address: "Nyali Road, Mombasa",
        brand: "ElectroPro",
        warranty: "2-year warranty",
        deliveryAvailable: true,
        deliveryFee: { amount: 2000, currency: "KSH" },
        weight: { value: 45, unit: "kg" },
        certifications: ["KEBS Certified", "CE Marked"],
        madeIn: "Various",
        applicationArea: ["Residential Buildings", "3-Bedroom Houses", "Apartments", "Small Offices"],
      },
    ],
  },

  // Finishing Materials
  {
    id: 7,
    name: "Interior Finishes Ltd",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Premium supplier of interior and exterior finishing materials for construction and renovation projects.",
    redirectUrl: "https://interiorfinishes.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.9,
    reviewCount: 215,
    verified:true,
    establishedYear: 2011,
    contactNumber: "+254 778 901 234",
    email: "info@interiorfinishes.co.ke",
    website: "https://interiorfinishes.co.ke",
    certifications: ["Kenya Bureau of Standards Certified", "ISO 9001:2015", "Green Building Council Member"],
    deliveryOptions: ["Free Delivery within Nairobi", "Nationwide Shipping", "Express Delivery"],
    paymentOptions: ["M-Pesa", "Bank Transfer", "Credit Card", "Installment Plans"],
    returnPolicy: "30-day returns on unopened products",
    warrantyPolicy: "Manufacturer warranty on all products",
    offerings: [
      {
        id: 701,
        name: "Premium Interior Wall Paint (20L)",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 7500, currency: "KSH" },
        originalPrice: { amount: 9000, currency: "KSH" },
        category: "Finishing Materials",
        subcategory: "Paint",
        description:
          "Premium quality interior wall paint with excellent coverage and durability. Low VOC formula ensures minimal odor and environmental impact. Provides a smooth, washable finish that resists stains and fading.",
        location: "Karen, Nairobi",
        isPopular: true,
        dateAdded: "2025-03-01T10:30:00Z",
        rating: 5.0,
        reviewCount: 48,
        features: ["Excellent Coverage", "Low VOC", "Washable", "Stain Resistant", "Fade Resistant", "Smooth Finish"],
        specifications: {
          Volume: "20L",
          Coverage: "10-12 m²/L",
          Finish: "Matt",
          "Drying Time": "Touch dry: 1 hour, Recoat: 4 hours",
          Application: "Brush, Roller, or Spray",
          Thinning: "Water (up to 10%)",
        },
        quantity: { value: 20, unit: "L" },
        availableStock: 50,
        totalStock: 100,
        tags: ["Paint", "Interior", "Wall Finish", "Decoration"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        isTrending: true,
        vendorId: 7,
        contactNumber: "+254 778 901 234",
        website: "https://interiorfinishes.co.ke",
        address: "Karen Shopping Center, Nairobi",
        brand: "ColorMaster",
        warranty: "5-year color warranty",
        deliveryAvailable: true,
        deliveryFee: { amount: 500, currency: "KSH" },
        minOrderQuantity: 1,
        bulkDiscountAvailable: true,
        bulkDiscountThreshold: 5,
        bulkDiscountPercentage: 10,
        weight: { value: 22, unit: "kg" },
        color: "Various (can be tinted)",
        certifications: ["Low VOC Certified", "KEBS Certified"],
        madeIn: "Kenya",
        applicationArea: ["Living Rooms", "Bedrooms", "Offices", "Interior Walls"],
      },
      {
        id: 702,
        name: "Ceramic Floor Tiles (60x60cm - 10 m²)",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 12000, currency: "KSH" },
        originalPrice: { amount: 15000, currency: "KSH" },
        category: "Finishing Materials",
        subcategory: "Tiles",
        description:
          "High-quality ceramic floor tiles (60x60cm) covering 10 m². Features a modern marble-effect design with a glossy finish. Durable, easy to clean, and suitable for high-traffic areas in residential and commercial spaces.",
        location: "Karen, Nairobi",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.8,
        reviewCount: 36,
        features: [
          "Marble Effect",
          "Glossy Finish",
          "Stain Resistant",
          "Scratch Resistant",
          "Easy to Clean",
          "Frost Resistant",
        ],
        specifications: {
          Size: "60x60cm",
          Coverage: "10 m² (28 tiles)",
          Thickness: "9mm",
          Material: "Ceramic",
          Finish: "Glossy",
          "PEI Rating": "Class 4 (High Traffic)",
        },
        quantity: { value: 10, unit: "m²" },
        availableStock: 25,
        totalStock: 50,
        tags: ["Tiles", "Flooring", "Ceramic", "Interior"],
        vendorId: 7,
        contactNumber: "+254 778 901 234",
        website: "https://interiorfinishes.co.ke",
        address: "Karen Shopping Center, Nairobi",
        brand: "TileMaster",
        warranty: "10-year warranty",
        deliveryAvailable: true,
        deliveryFee: { amount: 2000, currency: "KSH" },
        minOrderQuantity: 10,
        bulkDiscountAvailable: true,
        bulkDiscountThreshold: 50,
        bulkDiscountPercentage: 15,
        weight: { value: 220, unit: "kg" },
        color: "Carrara White",
        material: "Ceramic",
        certifications: ["KEBS Certified", "ISO Certified"],
        madeIn: "Italy",
        applicationArea: ["Living Rooms", "Kitchens", "Bathrooms", "Commercial Spaces"],
      },
    ],
  },
  {
    id: 8,
    name: "Modern Doors & Windows",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Specialized manufacturer and supplier of high-quality doors, windows, and related finishing products.",
    redirectUrl: "https://moderndoors.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 183,
    verified:true,
    establishedYear: 2009,
    contactNumber: "+254 789 012 345",
    email: "info@moderndoors.co.ke",
    website: "https://moderndoors.co.ke",
    certifications: ["Kenya Bureau of Standards Certified", "ISO 9001:2015"],
    deliveryOptions: ["Nationwide Delivery", "Installation Service", "Custom Delivery Scheduling"],
    paymentOptions: ["M-Pesa", "Bank Transfer", "Credit Card", "Installment Plans"],
    returnPolicy: "Custom products are non-returnable, manufacturing defects covered under warranty",
    warrantyPolicy: "5-10 year warranty depending on product",
    offerings: [
      {
        id: 801,
        name: "Solid Mahogany Wooden Door (Complete Set)",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 35000, currency: "KSH" },
        originalPrice: { amount: 42000, currency: "KSH" },
        category: "Finishing Materials",
        subcategory: "Doors & Windows",
        description:
          "Premium solid mahogany wooden door complete with frame, architraves, hinges, and high-quality lock set. Features elegant carved design and natural wood finish. Perfect for main entrances in luxury homes and offices.",
        location: "Industrial Area, Nairobi",
        isPopular: true,
        dateAdded: "2025-02-25T10:30:00Z",
        rating: 4.8,
        reviewCount: 42,
        features: [
          "Solid Mahogany",
          "Carved Design",
          "Complete Set",
          "Premium Hardware",
          "Natural Finish",
          "Weather Resistant",
        ],
        specifications: {
          "Door Size": "900 x 2100mm",
          Thickness: "45mm",
          Material: "Solid Mahogany",
          Frame: "Included (Hardwood)",
          Hardware: "Stainless Steel Hinges and Lock Set",
          Finish: "Natural Wood Sealer",
        },
        quantity: { value: 1, unit: "set" },
        availableStock: 15,
        totalStock: 30,
        tags: ["Doors", "Wooden", "Mahogany", "Entrance", "Luxury"],
        vendorId: 8,
        contactNumber: "+254 789 012 345",
        website: "https://moderndoors.co.ke",
        address: "Industrial Area, Nairobi",
        brand: "WoodMaster",
        warranty: "10-year warranty",
        deliveryAvailable: true,
        deliveryFee: { amount: 3000, currency: "KSH" },
        weight: { value: 80, unit: "kg" },
        dimensions: { length: 2.1, width: 0.9, height: 0.045, unit: "m" },
        color: "Natural Mahogany",
        material: "Solid Mahogany",
        certifications: ["KEBS Certified", "FSC Certified Wood"],
        madeIn: "Kenya",
        applicationArea: ["Main Entrances", "Luxury Homes", "Offices", "Hotels"],
      },
      {
        id: 802,
        name: "Aluminum Sliding Window (1.5m x 1.2m)",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 18000, currency: "KSH" },
        originalPrice: { amount: 22000, currency: "KSH" },
        category: "Finishing Materials",
        subcategory: "Doors & Windows",
        description:
          "Modern aluminum sliding window with tinted glass and smooth sliding mechanism. Features durable powder-coated aluminum frame, security locks, and weather sealing. Ideal for residential and commercial buildings.",
        location: "Industrial Area, Nairobi  Ideal for residential and commercial buildings.",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.7,
        reviewCount: 28,
        features: ["Powder-Coated Aluminum", "Tinted Glass", "Smooth Sliding", "Security Locks", "Weather Sealing"],
        specifications: {
          Size: "1.5m x 1.2m",
          Frame: "Aluminum (2mm thickness)",
          Glass: "6mm Tinted Tempered Glass",
          Tracks: "Double Track System",
          Finish: "Powder Coated",
          Color: "Silver",
        },
        quantity: { value: 1, unit: "unit" },
        availableStock: 20,
        totalStock: 40,
        tags: ["Windows", "Aluminum", "Sliding", "Modern", "Tinted"],
        hotDealEnds: "2025-04-18T23:59:59Z",
        isHotDeal: true,
        isLowStock: false,
        vendorId: 8,
        contactNumber: "+254 789 012 345",
        website: "https://moderndoors.co.ke",
        address: "Industrial Area, Nairobi",
        brand: "GlassMax",
        warranty: "5-year warranty",
        deliveryAvailable: true,
        deliveryFee: { amount: 2000, currency: "KSH" },
        weight: { value: 25, unit: "kg" },
        dimensions: { length: 1.5, width: 1.2, height: 0.1, unit: "m" },
        color: "Silver",
        material: "Aluminum and Glass",
        certifications: ["KEBS Certified"],
        madeIn: "Kenya",
        applicationArea: ["Residential Buildings", "Offices", "Apartments", "Commercial Spaces"],
      },
    ],
  },

  // Hardware & Fasteners
  {
    id: 9,
    name: "Hardware Hub",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Comprehensive supplier of hardware, fasteners, and accessories for construction and DIY projects.",
    redirectUrl: "https://hardwarehub.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.6,
    reviewCount: 156,
    verified:true,
    establishedYear: 2016,
    contactNumber: "+254 790 123 456",
    email: "info@hardwarehub.co.ke",
    website: "https://hardwarehub.co.ke",
    certifications: ["Kenya Bureau of Standards Certified"],
    deliveryOptions: ["Same Day Delivery", "Nationwide Shipping", "Store Pickup"],
    paymentOptions: ["M-Pesa", "Bank Transfer", "Credit Card", "Cash on Delivery"],
    returnPolicy: "30-day returns on unused items",
    warrantyPolicy: "Manufacturer warranty on all products",
    offerings: [
      {
        id: 901,
        name: "Construction Nail Assortment (10kg)",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 2500, currency: "KSH" },
        originalPrice: { amount: 3000, currency: "KSH" },
        category: "Hardware & Fasteners",
        subcategory: "Nails",
        description:
          "Comprehensive 10kg assortment of construction nails in various sizes and types. Includes common nails, finishing nails, roofing nails, and masonry nails. Perfect for construction projects and general carpentry work.",
        location: "Industrial Area, Nairobi",
        isPopular: true,
        dateAdded: "2025-03-02T10:30:00Z",
        rating: 4.7,
        reviewCount: 38,
        features: ["Various Sizes", "Multiple Types", "Galvanized Finish", "Rust Resistant", "High Strength"],
        specifications: {
          Weight: "10kg total",
          Material: "Hardened Steel",
          Finish: "Galvanized",
          Sizes: "1-6 inches",
          Types: "Common, Finishing, Roofing, Masonry",
          Packaging: "Sturdy Plastic Container",
        },
        quantity: { value: 10, unit: "kg" },
        availableStock: 50,
        totalStock: 100,
        tags: ["Nails", "Fasteners", "Construction", "Carpentry"],
        vendorId: 9,
        contactNumber: "+254 790 123 456",
        website: "https://hardwarehub.co.ke",
        address: "Industrial Area, Nairobi",
        brand: "ConstructPro",
        warranty: "Quality guaranteed",
        deliveryAvailable: true,
        deliveryFee: { amount: 500, currency: "KSH" },
        minOrderQuantity: 1,
        bulkDiscountAvailable: true,
        bulkDiscountThreshold: 5,
        bulkDiscountPercentage: 10,
        weight: { value: 10, unit: "kg" },
        certifications: ["KEBS Certified"],
        madeIn: "Kenya",
        applicationArea: ["Construction", "Carpentry", "Roofing", "General Repairs"],
      },
      {
        id: 902,
        name: "Heavy-Duty Door & Window Hardware Set",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 8500, currency: "KSH" },
        originalPrice: { amount: 10000, currency: "KSH" },
        category: "Hardware & Fasteners",
        subcategory: "Hinges",
        description:
          "Complete hardware set for doors and windows including hinges, handles, locks, and all necessary fasteners. Made from high-quality stainless steel for durability and corrosion resistance. Suitable for residential and commercial applications.",
        location: "Industrial Area, Nairobi",
        isNew: true,
        dateAdded: "2025-03-20T10:30:00Z",
        rating: 4.5,
        reviewCount: 22,
        features: ["Stainless Steel", "Corrosion Resistant", "Complete Set", "Easy Installation", "Modern Design"],
        specifications: {
          Contents: "10 Hinges, 5 Handles, 5 Locks, Fasteners",
          Material: "304 Stainless Steel",
          Finish: "Brushed Nickel",
          "Hinge Size": "4 inch",
          "Lock Type": "Mortise with Cylinder",
          "Handle Style": "Lever",
        },
        quantity: { value: 1, unit: "set" },
        availableStock: 15,
        totalStock: 30,
        tags: ["Hardware", "Doors", "Windows", "Stainless Steel"],
        hotDealEnds: "2025-04-20T23:59:59Z",
        isHotDeal: true,
        vendorId: 9,
        contactNumber: "+254 790 123 456",
        website: "https://hardwarehub.co.ke",
        address: "Industrial Area, Nairobi",
        brand: "DuraHardware",
        warranty: "5-year warranty",
        deliveryAvailable: true,
        deliveryFee: { amount: 500, currency: "KSH" },
        weight: { value: 8, unit: "kg" },
        color: "Brushed Nickel",
        material: "Stainless Steel",
        certifications: ["KEBS Certified"],
        madeIn: "Taiwan",
        applicationArea: ["Residential Doors", "Commercial Doors", "Windows", "Cabinets"],
      },
    ],
  },
  {
    id: 10,
    name: "Precision Fasteners Ltd",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Specialized supplier of high-quality fasteners and fixings for construction and industrial applications.",
    redirectUrl: "https://precisionfasteners.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.5,
    reviewCount: 142,
    verified:true,
    establishedYear: 2014,
    contactNumber: "+254 701 234 567",
    email: "info@precisionfasteners.co.ke",
    website: "https://precisionfasteners.co.ke",
    certifications: ["ISO 9001:2015", "Kenya Bureau of Standards Certified"],
    deliveryOptions: ["Same Day Delivery", "Nationwide Shipping", "Express Delivery"],
    paymentOptions: ["M-Pesa", "Bank Transfer", "Credit Card", "Cash on Delivery"],
    returnPolicy: "14-day returns on unused items",
    warrantyPolicy: "Quality guaranteed on all products",
    offerings: [
      {
        id: 1001,
        name: "Heavy-Duty Concrete Anchor Bolts (M12 x 100mm - 50pcs)",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 4500, currency: "KSH" },
        originalPrice: { amount: 5500, currency: "KSH" },
        category: "Hardware & Fasteners",
        subcategory: "Bolts",
        description:
          "Pack of 50 heavy-duty M12 concrete anchor bolts (100mm length) for securing heavy fixtures to concrete. Features expansion mechanism for strong hold and corrosion-resistant zinc plating. Ideal for structural applications and heavy machinery mounting.",
        location: "Industrial Area, Nairobi",
        isPopular: true,
        dateAdded: "2025-02-28T10:30:00Z",
        rating: 4.6,
        reviewCount: 34,
        features: [
          "High Tensile Strength",
          "Expansion Mechanism",
          "Zinc Plated",
          "Corrosion Resistant",
          "Pre-assembled",
        ],
        specifications: {
          Size: "M12 x 100mm",
          Quantity: "50 pieces",
          Material: "Carbon Steel",
          Finish: "Zinc Plated",
          "Head Type": "Hex",
          "Pull-Out Strength": ">15kN",
        },
        quantity: { value: 50, unit: "pieces" },
        availableStock: 30,
        totalStock: 50,
        tags: ["Anchor Bolts", "Concrete Fasteners", "Heavy-Duty", "Construction"],
        vendorId: 10,
        contactNumber: "+254 701 234 567",
        website: "https://precisionfasteners.co.ke",
        address: "Industrial Area, Nairobi",
        brand: "AnchorTech",
        warranty: "Quality guaranteed",
        deliveryAvailable: true,
        deliveryFee: { amount: 500, currency: "KSH" },
        minOrderQuantity: 1,
        bulkDiscountAvailable: true,
        bulkDiscountThreshold: 5,
        bulkDiscountPercentage: 10,
        weight: { value: 12, unit: "kg" },
        certifications: ["ISO Certified", "KEBS Certified"],
        madeIn: "Germany",
        applicationArea: [
          "Structural Connections",
          "Heavy Machinery Mounting",
          "Concrete Structures",
          "Industrial Applications",
        ],
      },
      {
        id: 1002,
        name: "Stainless Steel Screw Assortment Kit (1000pcs)",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 6500, currency: "KSH" },
        originalPrice: { amount: 8000, currency: "KSH" },
        category: "Hardware & Fasteners",
        subcategory: "Screws",
        description:
          "Comprehensive kit of 1000 stainless steel screws in various sizes and types. Includes wood screws, self-tapping screws, machine screws, and sheet metal screws. Perfect for construction, woodworking, and general repairs.",
        location: "Industrial Area, Nairobi",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.4,
        reviewCount: 26,
        features: ["Stainless Steel", "Various Sizes", "Multiple Types", "Corrosion Resistant", "Organized Case"],
        specifications: {
          Quantity: "1000 pieces total",
          Material: "304 Stainless Steel",
          Types: "Wood, Self-tapping, Machine, Sheet Metal",
          Sizes: "Various (3mm to 8mm)",
          "Head Types": "Flat, Pan, Countersunk",
          "Drive Types": "Phillips, Slotted, Hex",
        },
        quantity: { value: 1000, unit: "pieces" },
        availableStock: 20,
        totalStock: 40,
        tags: ["Screws", "Stainless Steel", "Fasteners", "Assortment"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        isLowStock: false,
        vendorId: 10,
        contactNumber: "+254 701 234 567",
        website: "https://precisionfasteners.co.ke",
        address: "Industrial Area, Nairobi",
        brand: "ScrewMaster",
        warranty: "Quality guaranteed",
        deliveryAvailable: true,
        deliveryFee: { amount: 500, currency: "KSH" },
        weight: { value: 5, unit: "kg" },
        certifications: ["ISO Certified", "KEBS Certified"],
        madeIn: "Taiwan",
        applicationArea: ["Construction", "Woodworking", "Furniture Assembly", "General Repairs"],
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

export default function ConstructionMaterialsPage() {
  useCookieTracking("construction-materials")

  // State for vendors and offerings
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors)
  const [newOfferingAlert, setNewOfferingAlert] = useState<ConstructionMaterialData | null>(null)
  const [swapTrigger, setSwapTrigger] = useState(0)
  const [isHovered, setIsHovered] = useState(false)


    // Custom color scheme for construction
  const constructionColorScheme = {
    primary: "from-amber-500 to-yellow-700",
    secondary: "bg-amber-100",
    accent: "bg-yellow-600",
    text: "text-amber-900",
    background: "bg-yellow-50",
  }

  // State for active category and subcategory
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [activeSubcategory, setActiveSubcategory] = useState<string>("")

  // State for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [sortOrder, setSortOrder] = useState("default")
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([])

  // State for offering detail modal
  const [selectedOffering, setSelectedOffering] = useState<ConstructionMaterialData | null>(null)

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
      colors: ["#f59e0b", "#d97706", "#78350f"], // Construction colors - amber, yellow, brown
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
    <div className="bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-600 min-h-screen">
      {/* Decorative construction-themed elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-amber-800 to-yellow-800 opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-yellow-800 to-amber-800 opacity-20"></div>

      {/* Construction pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMCAwIEw2MCA2MCBNNjAgMCBMMCAzMCBNMzAgMCBMMCAzMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+')] opacity-10"></div>

      {/* IMPROVEMENT: Added max-width to container to prevent excessive stretching on ultra-wide screens */}
      <div className="container mx-auto px-4 py-12 max-w-[1920px] relative z-10">
        {/* Construction materials header with industrial accents */}
        <div className="text-center mb-10 bg-gradient-to-r from-amber-900/80 via-yellow-800/80 to-orange-900/80 p-8 rounded-2xl shadow-2xl border border-yellow-500/30 backdrop-blur-sm">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-yellow-100">Construction & Materials</h1>

          {/* Construction icons */}
          <div className="flex justify-center mb-4 gap-4">
            <HardHat className="h-8 w-8 text-yellow-300" />
            <Brick className="h-8 w-8 text-amber-300" />
            <Hammer className="h-8 w-8 text-yellow-300" />
            <Ruler className="h-8 w-8 text-amber-300" />
            <Truck className="h-8 w-8 text-yellow-300" />
          </div>

          <p className="text-xl text-yellow-200 max-w-3xl mx-auto">
            Premium building materials and construction supplies at unbeatable prices
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
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-amber-300">
                <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 text-white mr-2" />
                    <h3 className="text-white font-bold">New Construction Material!</h3>
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
                      <Badge className="bg-amber-100 text-amber-800">New Material</Badge>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <Button
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
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
            title="Limited Time Construction Deals"
            subtitle="Exclusive discounts on premium construction materials - build better for less!"
          />
        )}
 {/* Trending and Popular Section */}
 <TrendingPopularSection
        trendingProducts={trendingProducts}
        popularProducts={popularProducts}
        colorScheme={constructionColorScheme}
        title="Market Favorites"
        subtitle="See what's trending and most popular in the construction sector"
      />
        {/* New Products For You Section */}
        <NewProductsForYou allProducts={newProducts} colorScheme="amber" maxProducts={4} />

 {/*button for hospitality*/}
 <div className="flex justify-center my-8">
      <Link href="/construction-materials/shop">
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
            <Brick className="mr-2 h-5 w-5" />
            Explore Construction-Materials Shop
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
            <Hammer className="h-5 w-5 text-yellow-300" />
          </motion.div>
        </Button>
      </Link>
    </div>
    {/*button for hospitality*/}
 <div className="flex justify-center my-8">
      <Link href="/construction-materials/media">
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
            <Brick className="mr-2 h-5 w-5" />
            Explore Construction-Materials  Media Shop
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
            <Hammer className="h-5 w-5 text-yellow-300" />
          </motion.div>
        </Button>
      </Link>
    </div>

        {/* Enhanced search section */}
        <div className="mb-10 bg-gradient-to-r from-amber-900/70 via-yellow-800/70 to-amber-900/70 p-6 rounded-xl shadow-lg border border-yellow-500/30 backdrop-blur-sm">
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Search for construction materials, tools, brands..."
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
                <Construction className="h-4 w-4" />
                <span>All Materials</span>
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
                  defaultValue={[0, 100000]}
                  max={100000}
                  step={1000}
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
                  materials found
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
            <div className="bg-gradient-to-r from-amber-900/70 via-yellow-800/70 to-amber-900/70 p-8 text-center rounded-lg shadow-md border border-yellow-500/30 backdrop-blur-sm">
              <p className="text-amber-100 text-lg">No construction materials found matching your criteria.</p>
              <p className="text-amber-200 mt-2">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center bg-amber-900/80 p-6 rounded-full backdrop-blur-sm">
              <Loader2 className="h-10 w-10 animate-spin text-amber-300" />
              <p className="mt-2 text-amber-200 font-medium">Loading more materials...</p>
            </div>
          </div>
        )}

        {/* Loader reference element */}
        <div ref={loaderRef} className="h-20"></div>
      </div>

      {/* Offering Detail Modal */}
      <Dialog open={!!selectedOffering} onOpenChange={() => setSelectedOffering(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-r from-amber-900/90 via-yellow-800/90 to-amber-900/90 border border-yellow-500/30 text-white backdrop-blur-sm">
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

                  {/* Material details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {selectedOffering.brand && (
                      <div className="flex items-center text-amber-200">
                        <Award className="h-4 w-4 mr-2 text-amber-300" />
                        <span>Brand: {selectedOffering.brand}</span>
                      </div>
                    )}
                    {selectedOffering.quantity && (
                      <div className="flex items-center text-amber-200">
                        <Package className="h-4 w-4 mr-2 text-amber-300" />
                        <span>
                          Quantity: {selectedOffering.quantity.value} {selectedOffering.quantity.unit}
                        </span>
                      </div>
                    )}
                    {selectedOffering.weight && (
                      <div className="flex items-center text-amber-200">
                        <Scale className="h-4 w-4 mr-2 text-amber-300" />
                        <span>
                          Weight: {selectedOffering.weight.value} {selectedOffering.weight.unit}
                        </span>
                      </div>
                    )}
                    {selectedOffering.dimensions && (
                      <div className="flex items-center text-amber-200">
                        <Maximize2 className="h-4 w-4 mr-2 text-amber-300" />
                        <span>
                          Dimensions: {selectedOffering.dimensions.length} x {selectedOffering.dimensions.width} x{" "}
                          {selectedOffering.dimensions.height} {selectedOffering.dimensions.unit}
                        </span>
                      </div>
                    )}
                    {selectedOffering.material && (
                      <div className="flex items-center text-amber-200">
                        <Layers className="h-4 w-4 mr-2 text-amber-300" />
                        <span>Material: {selectedOffering.material}</span>
                      </div>
                    )}
                    {selectedOffering.color && (
                      <div className="flex items-center text-amber-200">
                        <Palette className="h-4 w-4 mr-2 text-amber-300" />
                        <span>Color: {selectedOffering.color}</span>
                      </div>
                    )}
                    {selectedOffering.madeIn && (
                      <div className="flex items-center text-amber-200">
                        <Landmark className="h-4 w-4 mr-2 text-amber-300" />
                        <span>Made in: {selectedOffering.madeIn}</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-amber-100 mb-2">Key Features</h3>
                    <ul className="list-disc list-inside text-amber-200 space-y-1">
                      {selectedOffering.features?.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Specifications */}
                  {selectedOffering.specifications && Object.keys(selectedOffering.specifications).length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-amber-100 mb-2">Specifications</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(selectedOffering.specifications).map(([key, value], index) => (
                          <div
                            key={index}
                            className="flex justify-between text-amber-200 border-b border-amber-800 pb-1"
                          >
                            <span className="font-medium">{key}:</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {selectedOffering.certifications && selectedOffering.certifications.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-amber-100 mb-2">Certifications</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedOffering.certifications.map((certification, index) => (
                          <Badge key={index} variant="outline" className="border-amber-500 text-amber-200">
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            {certification}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stock availability */}
                  {selectedOffering.availableStock !== undefined && selectedOffering.totalStock !== undefined && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-amber-100 mb-2">Availability</h3>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-amber-200">In stock:</span>
                        <span
                          className={`font-medium ${
                            selectedOffering.availableStock < selectedOffering.totalStock * 0.2
                              ? "text-red-400"
                              : selectedOffering.availableStock < selectedOffering.totalStock * 0.5
                                ? "text-amber-300"
                                : "text-green-400"
                          }`}
                        >
                          {selectedOffering.availableStock} of {selectedOffering.totalStock} units
                        </span>
                      </div>
                      <div className="w-full bg-amber-800 rounded-full h-2 mb-4">
                        <div
                          className={`h-2 rounded-full ${
                            selectedOffering.availableStock < selectedOffering.totalStock * 0.2
                              ? "bg-red-500"
                              : selectedOffering.availableStock < selectedOffering.totalStock * 0.5
                                ? "bg-amber-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${(selectedOffering.availableStock / selectedOffering.totalStock) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Quantity selector */}
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-amber-100 mb-2">Order Quantity</h3>
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
                        {selectedOffering.minOrderQuantity && (
                          <span>
                            Min. order: {selectedOffering.minOrderQuantity} {selectedOffering.quantity?.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bulk discount */}
                  {selectedOffering.bulkDiscountAvailable && (
                    <div className="mb-4 p-3 bg-amber-800/50 rounded-lg border border-amber-600/30">
                      <div className="flex items-center text-amber-100 mb-1">
                        <BadgePercent className="h-4 w-4 mr-2 text-amber-300" />
                        <span className="font-medium">Bulk Discount Available</span>
                      </div>
                      <p className="text-sm text-amber-200">
                        Order {selectedOffering.bulkDiscountThreshold}+ units and get{" "}
                        {selectedOffering.bulkDiscountPercentage}% off!
                      </p>
                    </div>
                  )}

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
                        <div className="text-sm text-amber-200 mb-1">Delivery:</div>
                        <div className="font-medium text-amber-100">
                          {selectedOffering.deliveryAvailable ? (
                            <span className="flex items-center">
                              <Truck className="h-4 w-4 mr-1 text-green-400" />
                              Available{" "}
                              {selectedOffering.deliveryFee && `(${formatPrice(selectedOffering.deliveryFee)})`}
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <X className="h-4 w-4 mr-1 text-red-400" />
                              Not Available
                            </span>
                          )}
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

                      <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white flex-1 flex items-center justify-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application areas */}
              {selectedOffering.applicationArea && selectedOffering.applicationArea.length > 0 && (
                <div className="mt-6 pt-4 border-t border-amber-700">
                  <h3 className="text-lg font-medium text-amber-100 mb-2">Suitable For</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOffering.applicationArea.map((area, index) => (
                      <Badge key={index} className="bg-amber-700 text-amber-100">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact information */}
              <div className="mt-6 pt-4 border-t border-amber-700">
                <h3 className="text-lg font-medium text-amber-100 mb-2">Supplier Information</h3>
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
                  {selectedOffering.warranty && (
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-amber-300" />
                      <span>Warranty: {selectedOffering.warranty}</span>
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
  onOfferingClick: (offering: ConstructionMaterialData) => void
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
    <div className="bg-gradient-to-r from-amber-900/70 via-yellow-800/70 to-amber-900/70 rounded-xl shadow-lg overflow-hidden border border-yellow-500/30 backdrop-blur-sm">
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
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
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
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap"
            >
              Visit Website
            </a>
          </div>
        </div>
        <p className="text-amber-100 mb-4 line-clamp-2">{vendor.description}</p>

        {/* Certifications */}
        {vendor.certifications && vendor.certifications.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {vendor.certifications.map((certification, index) => (
                <Badge key={index} variant="outline" className="text-xs border-amber-500 text-amber-200">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  {certification}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Delivery options */}
        {vendor.deliveryOptions && vendor.deliveryOptions.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {vendor.deliveryOptions.map((option, index) => (
                <Badge key={index} className="bg-amber-700 text-amber-100">
                  <Truck className="h-3 w-3 mr-1" />
                  {option}
                </Badge>
              ))}
            </div>
          </div>
        )}

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
function OfferingCard({ offering, onClick }: { offering: ConstructionMaterialData; onClick: () => void }) {
  const [imageError, setImageError] = useState(false)

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((offering.originalPrice.amount - offering.currentPrice.amount) / offering.originalPrice.amount) * 100,
  )

  return (
    <motion.div
      className="bg-gradient-to-r from-amber-800/80 to-yellow-900/80 rounded-lg shadow-sm overflow-hidden flex flex-col h-full border border-amber-500/30 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 backdrop-blur-sm"
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
            <MostPreferredBadge colorScheme="amber" size="sm" />
          </div>
        )}

        {/* Low stock badge */}
        {offering.isLowStock && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-red-500 text-white flex items-center gap-1 px-2 py-1 text-xs font-medium">
              <Clock className="h-3 w-3" />
              Low Stock
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

        {/* Material details */}
        <div className="flex flex-wrap gap-2 mb-2">
          {offering.brand && (
            <div className="flex items-center text-xs text-amber-200">
              <Award className="h-3 w-3 mr-1 text-amber-300" />
              <span>{offering.brand}</span>
            </div>
          )}
          {offering.quantity && (
            <div className="flex items-center text-xs text-amber-200">
              <Package className="h-3 w-3 mr-1 text-amber-300" />
              <span>
                {offering.quantity.value} {offering.quantity.unit}
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

        {/* Stock availability */}
        {offering.availableStock !== undefined && offering.totalStock !== undefined && (
          <div className="mb-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-amber-200">In stock:</span>
              <span
                className={`font-medium ${
                  offering.availableStock < offering.totalStock * 0.2
                    ? "text-red-400"
                    : offering.availableStock < offering.totalStock * 0.5
                      ? "text-amber-300"
                      : "text-green-400"
                }`}
              >
                {offering.availableStock} of {offering.totalStock}
              </span>
            </div>
            <div className="w-full bg-amber-800 rounded-full h-1.5 mt-1">
              <div
                className={`h-1.5 rounded-full ${
                  offering.availableStock < offering.totalStock * 0.2
                    ? "bg-red-500"
                    : offering.availableStock < offering.totalStock * 0.5
                      ? "bg-amber-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${(offering.availableStock / offering.totalStock) * 100}%` }}
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
              className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2 py-1.5 rounded-md text-xs font-medium flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                // Add to cart functionality would go here
              }}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              <span>Add</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Missing ShoppingCart icon import
function ShoppingCart(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

