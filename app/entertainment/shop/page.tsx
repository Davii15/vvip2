"use client"

import type React from "react"

import { useMemo, useRef, useCallback } from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  ChevronDown,
  Star,
  Heart,
  ArrowLeft,
  X,
  Music,
  ClubIcon as Football,
  ShoppingCart,
  Bell,
  ArrowUpRight,
  Tag,
  Clock,
  Flame,
  Sparkles,
  MapPin,
  Store,
  Check,
  Headphones,
  Tv,
  MicIcon as Microphone,
  Guitar,
  Piano,
  Speaker,
  Disc,
  Shirt,
  Ticket,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import CountdownTimer from "@/components/CountdownTimer"
import HotTimeDeals from "@/components/HotTimeDeals"

// Types
interface Price {
  amount: number
  currency: string
}

interface EntertainmentProduct {
  id: string
  name: string
  imageUrl: string
  images?: string[]
  currentPrice: Price
  originalPrice: Price
  category: string
  subcategory: string
  subSubcategory?: string
  brand: string
  description: string
  rating?: number
  reviewCount?: number
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock"
  stockCount?: number
  discount?: number
  isNew?: boolean
  isBestSeller?: boolean
  isRentable?: boolean
  rentalPrice?: Price
  rentalPeriod?: string
  specifications?: Record<string, string>
  features?: string[]
  vendorId: string
  tags?: string[]
  dateAdded?: string
}

interface Vendor {
  id: string
  name: string
  logo: string
  location: string
  rating?: number
  reviewCount?: number
  website?: string
}

interface Category {
  id: string
  name: string
  icon: React.ReactNode
  subcategories: Subcategory[]
}

interface Subcategory {
  id: string
  name: string
  subSubcategories?: SubSubcategory[]
  productCount: number
}

interface SubSubcategory {
  id: string
  name: string
  productCount: number
}

// Helper function to format price
const formatPrice = (price: Price): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount)
}

// Helper function to transform data for hot deals
const transformForHotDeals = (products: EntertainmentProduct[]) => {
  return products
    .filter((product) => product.discount && product.discount >= 15)
    .map((product) => ({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      currentPrice: product.currentPrice,
      originalPrice: product.originalPrice,
      category: product.subcategory,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: product.description,
      discount: product.discount,
    }))
}

// Helper function to check if a product is new (added in the last 7 days)
const isNewProduct = (dateAdded?: string): boolean => {
  if (!dateAdded) return false
  const productDate = new Date(dateAdded)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - productDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 7
}

// Mock data for categories
const categories: Category[] = [
  {
    id: "sports",
    name: "Sports",
    icon: <Football className="mr-2" />,
    subcategories: [
      {
        id: "attires",
        name: "Attires",
        productCount: 45,
        subSubcategories: [
          { id: "athletic", name: "Athletic Attire", productCount: 18 },
          { id: "football", name: "Football Attire", productCount: 15 },
          { id: "formula1", name: "Formula 1 Hats & Shirts", productCount: 12 },
        ],
      },
      {
        id: "equipment",
        name: "Equipment",
        productCount: 38,
        subSubcategories: [
          { id: "athletic-eq", name: "Athletic Equipment", productCount: 14 },
          { id: "football-eq", name: "Football Equipment", productCount: 12 },
          { id: "formula1-eq", name: "Formula 1 Equipment", productCount: 12 },
        ],
      },
    ],
  },
  {
    id: "entertainment",
    name: "Entertainment Equipment",
    icon: <Music className="mr-2" />,
    subcategories: [
      { id: "audio", name: "Stereo & Audio Systems", productCount: 32 },
      { id: "mixers", name: "Mixers", productCount: 18 },
      { id: "screens", name: "Projecting Screens", productCount: 15 },
      {
        id: "instruments",
        name: "Music Instruments",
        productCount: 42,
        subSubcategories: [
          { id: "guitars", name: "Guitars", productCount: 12 },
          { id: "pianos", name: "Pianos", productCount: 8 },
          { id: "speakers", name: "Speakers", productCount: 14 },
          { id: "microphones", name: "Microphone Stands", productCount: 8 },
        ],
      },
    ],
  },
  {
    id: "merchandise",
    name: "Branded Merchandise",
    icon: <Tag className="mr-2" />,
    subcategories: [
      { id: "clothing", name: "Clothing", productCount: 56 },
      { id: "accessories", name: "Accessories", productCount: 38 },
    ],
  },
]

// Mock data for vendors
const vendors: Vendor[] = [
  {
    id: "v1",
    name: "SoundMaster Pro",
    logo: "/placeholder.svg?height=60&width=60",
    location: "Nairobi, Kenya",
    rating: 4.8,
    reviewCount: 342,
    website: "https://soundmasterpro.co.ke",
  },
  {
    id: "v2",
    name: "Sports Elite",
    logo: "/placeholder.svg?height=60&width=60",
    location: "Mombasa, Kenya",
    rating: 4.7,
    reviewCount: 256,
    website: "https://sportselite.co.ke",
  },
  {
    id: "v3",
    name: "Entertainment Hub",
    logo: "/placeholder.svg?height=60&width=60",
    location: "Kisumu, Kenya",
    rating: 4.9,
    reviewCount: 189,
    website: "https://entertainmenthub.co.ke",
  },
  {
    id: "v4",
    name: "Formula Fanatics",
    logo: "/placeholder.svg?height=60&width=60",
    location: "Nakuru, Kenya",
    rating: 4.6,
    reviewCount: 127,
    website: "https://formulafanatics.co.ke",
  },
  {
    id: "v5",
    name: "Music World",
    logo: "/placeholder.svg?height=60&width=60",
    location: "Eldoret, Kenya",
    rating: 4.5,
    reviewCount: 156,
    website: "https://musicworld.co.ke",
  },
]

// Mock data for products
const products: EntertainmentProduct[] = [
  // Sports - Attires - Athletic
  {
    id: "sa1",
    name: "Premium Running Shorts - Moisture Wicking",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 2500, currency: "KSH" },
    originalPrice: { amount: 3200, currency: "KSH" },
    category: "sports",
    subcategory: "attires",
    subSubcategory: "athletic",
    brand: "SportFit",
    description:
      "High-performance running shorts with moisture-wicking technology for maximum comfort during intense workouts.",
    rating: 4.7,
    reviewCount: 128,
    stockStatus: "In Stock",
    stockCount: 45,
    discount: 22,
    isNew: true,
    features: [
      "Moisture-wicking fabric",
      "Breathable mesh panels",
      "Hidden pocket for keys",
      "Reflective details for visibility",
      "Elastic waistband with drawcord",
    ],
    specifications: {
      Material: "88% Polyester, 12% Elastane",
      Care: "Machine wash cold",
      Fit: "Regular fit",
      Length: "7 inch inseam",
    },
    vendorId: "v2",
    tags: ["Running", "Athletic", "Shorts", "Workout"],
    dateAdded: "2025-03-25T10:30:00Z",
  },
  {
    id: "sa2",
    name: "Professional Basketball Jersey - Team Edition",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 3800, currency: "KSH" },
    originalPrice: { amount: 4500, currency: "KSH" },
    category: "sports",
    subcategory: "attires",
    subSubcategory: "athletic",
    brand: "ProHoops",
    description:
      "Official team edition basketball jersey made with breathable fabric for optimal performance on the court.",
    rating: 4.8,
    reviewCount: 95,
    stockStatus: "In Stock",
    stockCount: 32,
    discount: 16,
    isBestSeller: true,
    features: [
      "Authentic team design",
      "Breathable mesh construction",
      "Moisture-wicking technology",
      "Durable stitched numbers",
      "Official team logo",
    ],
    specifications: {
      Material: "100% Polyester",
      Care: "Machine wash cold",
      Fit: "Athletic fit",
      Type: "Sleeveless",
    },
    vendorId: "v2",
    tags: ["Basketball", "Jersey", "Team", "Athletic"],
    dateAdded: "2025-02-15T10:30:00Z",
  },

  // Sports - Attires - Football
  {
    id: "sf1",
    name: "Professional Soccer Cleats - Firm Ground",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 8500, currency: "KSH" },
    originalPrice: { amount: 12000, currency: "KSH" },
    category: "sports",
    subcategory: "attires",
    subSubcategory: "football",
    brand: "StrikeForce",
    description:
      "Professional-grade soccer cleats designed for firm ground play with superior traction and ball control.",
    rating: 4.9,
    reviewCount: 156,
    stockStatus: "In Stock",
    stockCount: 18,
    discount: 29,
    isBestSeller: true,
    features: [
      "Lightweight synthetic upper",
      "Firm ground studs for natural grass",
      "Enhanced ball control texture",
      "Anatomical fit for comfort",
      "Reinforced heel counter",
    ],
    specifications: {
      Material: "Synthetic leather and mesh",
      Sole: "Molded TPU with conical studs",
      Weight: "225g (Size 9)",
      Closure: "Lace-up",
    },
    vendorId: "v2",
    tags: ["Soccer", "Football", "Cleats", "Boots"],
    dateAdded: "2025-02-10T10:30:00Z",
  },
  {
    id: "sf2",
    name: "Official Team Football Jersey - Home Kit",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 4500, currency: "KSH" },
    originalPrice: { amount: 5500, currency: "KSH" },
    category: "sports",
    subcategory: "attires",
    subSubcategory: "football",
    brand: "GoalMaster",
    description:
      "Authentic home kit jersey with team colors and emblem, made with breathable fabric for maximum comfort.",
    rating: 4.7,
    reviewCount: 112,
    stockStatus: "In Stock",
    stockCount: 25,
    discount: 18,
    features: [
      "Official team design",
      "Breathable Dri-FIT technology",
      "Embroidered team crest",
      "Ventilated side panels",
      "Taped seams for comfort",
    ],
    specifications: {
      Material: "100% Recycled Polyester",
      Care: "Machine wash cold",
      Fit: "Standard fit",
      Season: "2024/2025",
    },
    vendorId: "v2",
    tags: ["Football", "Soccer", "Jersey", "Team Kit"],
    dateAdded: "2025-01-20T10:30:00Z",
  },

  // Sports - Attires - Formula 1
  {
    id: "sf1h",
    name: "Official F1 Team Cap - Limited Edition",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 3200, currency: "KSH" },
    originalPrice: { amount: 4000, currency: "KSH" },
    category: "sports",
    subcategory: "attires",
    subSubcategory: "formula1",
    brand: "SpeedRacer",
    description: "Limited edition official Formula 1 team cap with embroidered logos and adjustable fit.",
    rating: 4.8,
    reviewCount: 87,
    stockStatus: "Low Stock",
    stockCount: 8,
    discount: 20,
    isNew: true,
    features: [
      "Official team design",
      "Embroidered team logo",
      "Moisture-wicking sweatband",
      "Adjustable snapback",
      "UV protection",
    ],
    specifications: {
      Material: "100% Cotton",
      Closure: "Snapback",
      Size: "One size fits most",
      Season: "2025",
    },
    vendorId: "v4",
    tags: ["Formula 1", "F1", "Cap", "Hat", "Racing"],
    dateAdded: "2025-03-28T10:30:00Z",
  },
  {
    id: "sf2s",
    name: "Premium F1 Racing Team Polo Shirt",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 5800, currency: "KSH" },
    originalPrice: { amount: 7500, currency: "KSH" },
    category: "sports",
    subcategory: "attires",
    subSubcategory: "formula1",
    brand: "RaceLine",
    description: "Official Formula 1 team polo shirt with sponsor logos and premium fabric for comfort and style.",
    rating: 4.6,
    reviewCount: 64,
    stockStatus: "In Stock",
    stockCount: 22,
    discount: 23,
    features: [
      "Official team design with sponsor logos",
      "Quick-dry fabric",
      "Ribbed collar and cuffs",
      "Side vents for mobility",
      "Embroidered team patch",
    ],
    specifications: {
      Material: "95% Polyester, 5% Elastane",
      Care: "Machine wash cold",
      Fit: "Regular fit",
      Closure: "3-button placket",
    },
    vendorId: "v4",
    tags: ["Formula 1", "F1", "Polo", "Shirt", "Racing"],
    dateAdded: "2025-02-05T10:30:00Z",
  },

  // Sports - Equipment - Athletic
  {
    id: "sea1",
    name: "Professional Resistance Bands Set",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 3500, currency: "KSH" },
    originalPrice: { amount: 4200, currency: "KSH" },
    category: "sports",
    subcategory: "equipment",
    subSubcategory: "athletic-eq",
    brand: "FitPro",
    description:
      "Complete set of professional resistance bands for strength training, rehabilitation, and fitness workouts.",
    rating: 4.7,
    reviewCount: 142,
    stockStatus: "In Stock",
    stockCount: 35,
    discount: 17,
    isBestSeller: true,
    features: [
      "5 resistance levels (10-50 lbs)",
      "Durable natural latex construction",
      "Comfortable foam handles",
      "Door anchor and ankle straps included",
      "Carrying case for easy storage",
    ],
    specifications: {
      Material: "Natural Latex",
      "Resistance Levels": "5 bands (10, 20, 30, 40, 50 lbs)",
      Accessories: "Door anchor, ankle straps, handles",
      Storage: "Mesh carrying bag",
    },
    vendorId: "v2",
    tags: ["Fitness", "Resistance Bands", "Workout", "Training"],
    dateAdded: "2025-02-18T10:30:00Z",
  },
  {
    id: "sea2",
    name: "Premium Yoga Mat with Alignment Lines",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 2800, currency: "KSH" },
    originalPrice: { amount: 3500, currency: "KSH" },
    category: "sports",
    subcategory: "equipment",
    subSubcategory: "athletic-eq",
    brand: "ZenFlex",
    description:
      "Professional yoga mat with alignment lines for proper positioning, made with eco-friendly materials and superior grip.",
    rating: 4.9,
    reviewCount: 178,
    stockStatus: "In Stock",
    stockCount: 42,
    discount: 20,
    isNew: true,
    features: [
      "Alignment lines for proper positioning",
      "Non-slip surface for secure grip",
      "Eco-friendly TPE material",
      "Extra thick 6mm cushioning",
      "Carrying strap included",
    ],
    specifications: {
      Material: "TPE (Thermoplastic Elastomer)",
      Thickness: "6mm",
      Dimensions: "183cm x 61cm",
      Weight: "1.2kg",
    },
    vendorId: "v2",
    tags: ["Yoga", "Mat", "Fitness", "Exercise"],
    dateAdded: "2025-03-26T10:30:00Z",
  },

  // Sports - Equipment - Football
  {
    id: "sef1",
    name: "Professional Match Football - FIFA Approved",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 7500, currency: "KSH" },
    originalPrice: { amount: 9000, currency: "KSH" },
    category: "sports",
    subcategory: "equipment",
    subSubcategory: "football-eq",
    brand: "StrikeForce",
    description:
      "FIFA approved match football with premium construction for professional play, featuring enhanced visibility and durability.",
    rating: 4.8,
    reviewCount: 124,
    stockStatus: "In Stock",
    stockCount: 28,
    discount: 17,
    isBestSeller: true,
    features: [
      "FIFA Quality Pro certified",
      "Seamless surface for consistent play",
      "Water-resistant outer shell",
      "Enhanced visibility design",
      "Balanced flight technology",
    ],
    specifications: {
      Material: "Synthetic leather with latex bladder",
      Size: "5 (official match size)",
      Weight: "420-445g",
      Certification: "FIFA Quality Pro",
    },
    vendorId: "v2",
    tags: ["Football", "Soccer", "Ball", "FIFA", "Match"],
    dateAdded: "2025-01-30T10:30:00Z",
  },
  {
    id: "sef2",
    name: "Portable Football Training Goal Set",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 12000, currency: "KSH" },
    originalPrice: { amount: 15000, currency: "KSH" },
    category: "sports",
    subcategory: "equipment",
    subSubcategory: "football-eq",
    brand: "GoalMaster",
    description:
      "Portable football training goal set that's easy to assemble and transport, perfect for practice sessions and youth training.",
    rating: 4.6,
    reviewCount: 87,
    stockStatus: "In Stock",
    stockCount: 15,
    discount: 20,
    features: [
      "Quick assembly with no tools required",
      "Durable fiberglass and steel construction",
      "Weather-resistant materials",
      "Includes ground stakes for stability",
      "Carrying bag for easy transport",
    ],
    specifications: {
      Material: "Fiberglass poles with steel connectors",
      Size: "2.4m x 1.2m (8' x 4')",
      Weight: "5.5kg",
      "Assembly Time": "Under 2 minutes",
    },
    vendorId: "v2",
    tags: ["Football", "Soccer", "Training", "Goal", "Portable"],
    dateAdded: "2025-02-22T10:30:00Z",
  },

  // Sports - Equipment - Formula 1
  {
    id: "sef1e",
    name: "F1 Racing Simulator Steering Wheel",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 35000, currency: "KSH" },
    originalPrice: { amount: 45000, currency: "KSH" },
    category: "sports",
    subcategory: "equipment",
    subSubcategory: "formula1-eq",
    brand: "RaceTech",
    description:
      "Professional-grade Formula 1 simulator steering wheel with realistic controls and force feedback for immersive racing experience.",
    rating: 4.9,
    reviewCount: 56,
    stockStatus: "Low Stock",
    stockCount: 5,
    discount: 22,
    isNew: true,
    features: [
      "Authentic F1-style design",
      "Multiple programmable buttons and switches",
      "LED shift indicator lights",
      "Force feedback technology",
      "Compatible with major racing simulators",
    ],
    specifications: {
      Material: "Carbon fiber and aluminum",
      Diameter: "280mm",
      Buttons: "20 programmable buttons",
      Compatibility: "PC, PlayStation, Xbox",
    },
    vendorId: "v4",
    tags: ["Formula 1", "F1", "Racing", "Simulator", "Gaming"],
    dateAdded: "2025-03-29T10:30:00Z",
  },
  {
    id: "sef2e",
    name: "F1 Team Garage Scale Model Kit",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 18000, currency: "KSH" },
    originalPrice: { amount: 22000, currency: "KSH" },
    category: "sports",
    subcategory: "equipment",
    subSubcategory: "formula1-eq",
    brand: "MiniRacer",
    description:
      "Detailed 1:43 scale model kit of a Formula 1 team garage with pit wall, tools, and crew figures for collectors and enthusiasts.",
    rating: 4.7,
    reviewCount: 42,
    stockStatus: "In Stock",
    stockCount: 12,
    discount: 18,
    features: [
      "Highly detailed 1:43 scale model",
      "Includes pit wall and garage setup",
      "Miniature crew figures and equipment",
      "Compatible with standard 1:43 F1 car models",
      "Display case included",
    ],
    specifications: {
      Scale: "1:43",
      Material: "Die-cast metal and plastic",
      Dimensions: "45cm x 25cm x 15cm",
      Pieces: "Over 200 parts",
    },
    vendorId: "v4",
    tags: ["Formula 1", "F1", "Model Kit", "Collectible", "Garage"],
    dateAdded: "2025-02-12T10:30:00Z",
  },

  // Entertainment Equipment - Audio Systems
  {
    id: "ea1",
    name: "Professional DJ Controller with Built-in Mixer",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 85000, currency: "KSH" },
    originalPrice: { amount: 110000, currency: "KSH" },
    category: "entertainment",
    subcategory: "audio",
    brand: "BeatMaster",
    description:
      "Professional DJ controller with built-in mixer, performance pads, and software integration for club and event performances.",
    rating: 4.9,
    reviewCount: 87,
    stockStatus: "In Stock",
    stockCount: 10,
    discount: 23,
    isBestSeller: true,
    isRentable: true,
    rentalPrice: { amount: 8500, currency: "KSH" },
    rentalPeriod: "per day",
    features: [
      "4-channel mixer with effects",
      "16 performance pads with multiple modes",
      "Large jog wheels with tension adjustment",
      "Built-in sound card with high-resolution audio",
      "Professional software included",
    ],
    specifications: {
      Channels: "4",
      Inputs: "2 phono/line, 2 mic, 1 AUX",
      Outputs: 'XLR, RCA, 1/4" booth, 2x headphone',
      Connectivity: "USB-C, MIDI",
    },
    vendorId: "v1",
    tags: ["DJ", "Controller", "Mixer", "Audio", "Professional"],
    dateAdded: "2025-02-15T10:30:00Z",
  },
  {
    id: "ea2",
    name: "Premium Bluetooth Party Speaker System",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 45000, currency: "KSH" },
    originalPrice: { amount: 55000, currency: "KSH" },
    category: "entertainment",
    subcategory: "audio",
    brand: "SoundMaster",
    description:
      "Powerful Bluetooth party speaker system with LED light show, karaoke functionality, and deep bass for indoor and outdoor events.",
    rating: 4.8,
    reviewCount: 124,
    stockStatus: "In Stock",
    stockCount: 15,
    discount: 18,
    isNew: true,
    isRentable: true,
    rentalPrice: { amount: 5000, currency: "KSH" },
    rentalPeriod: "per day",
    features: [
      "1000W peak power output",
      "Customizable LED light show",
      "Bluetooth 5.0 with extended range",
      "Dual microphone inputs for karaoke",
      "Rechargeable battery with 12-hour playtime",
    ],
    specifications: {
      Power: "1000W peak",
      Speakers: '12" woofer, 3" tweeter',
      Battery: "12 hours playtime",
      Connectivity: "Bluetooth 5.0, USB, AUX, FM Radio",
    },
    vendorId: "v1",
    tags: ["Speaker", "Bluetooth", "Party", "Audio", "Karaoke"],
    dateAdded: "2025-03-20T10:30:00Z",
  },

  // Entertainment Equipment - Mixers
  {
    id: "em1",
    name: "Professional 16-Channel Audio Mixer",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 75000, currency: "KSH" },
    originalPrice: { amount: 95000, currency: "KSH" },
    category: "entertainment",
    subcategory: "mixers",
    brand: "SoundCraft",
    description:
      "Professional 16-channel audio mixer with premium preamps, built-in effects, and USB interface for live sound and studio recording.",
    rating: 4.9,
    reviewCount: 76,
    stockStatus: "In Stock",
    stockCount: 8,
    discount: 21,
    isBestSeller: true,
    isRentable: true,
    rentalPrice: { amount: 7500, currency: "KSH" },
    rentalPeriod: "per day",
    features: [
      "16 premium microphone preamps",
      "4-band EQ on each channel",
      "Built-in effects processor",
      "USB audio interface for recording",
      "Aux sends for monitors and effects",
    ],
    specifications: {
      Channels: "16",
      Preamps: "16 premium mic preamps",
      EQ: "4-band with sweepable mids",
      Effects: "24-bit digital effects processor",
    },
    vendorId: "v1",
    tags: ["Mixer", "Audio", "Recording", "Live Sound", "Professional"],
    dateAdded: "2025-01-18T10:30:00Z",
  },
  {
    id: "em2",
    name: "Compact 8-Channel Digital Mixer with Wi-Fi",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 48000, currency: "KSH" },
    originalPrice: { amount: 60000, currency: "KSH" },
    category: "entertainment",
    subcategory: "mixers",
    brand: "DigiMix",
    description:
      "Compact digital mixer with 8 channels, Wi-Fi control, and comprehensive digital processing for small venues and mobile setups.",
    rating: 4.7,
    reviewCount: 58,
    stockStatus: "In Stock",
    stockCount: 12,
    discount: 20,
    isNew: true,
    isRentable: true,
    rentalPrice: { amount: 5000, currency: "KSH" },
    rentalPeriod: "per day",
    features: [
      "8 high-quality mic preamps",
      "Wi-Fi control via tablet app",
      "Built-in compressors and gates",
      "4 aux sends for monitors",
      "USB recording and playback",
    ],
    specifications: {
      Channels: "8",
      Preamps: "8 mic/line inputs",
      Processing: "Compressor, gate, and EQ on all channels",
      Control: "Wi-Fi, tablet app (iOS/Android)",
    },
    vendorId: "v1",
    tags: ["Mixer", "Digital", "Wi-Fi", "Compact", "Recording"],
    dateAdded: "2025-03-15T10:30:00Z",
  },

  // Entertainment Equipment - Projecting Screens
  {
    id: "ep1",
    name: "Motorized Projection Screen - 120 inch",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 35000, currency: "KSH" },
    originalPrice: { amount: 45000, currency: "KSH" },
    category: "entertainment",
    subcategory: "screens",
    brand: "ViewMaster",
    description:
      "Premium 120-inch motorized projection screen with remote control, suitable for home theaters and professional presentations.",
    rating: 4.8,
    reviewCount: 92,
    stockStatus: "In Stock",
    stockCount: 10,
    discount: 22,
    isBestSeller: true,
    isRentable: true,
    rentalPrice: { amount: 4000, currency: "KSH" },
    rentalPeriod: "per day",
    features: [
      "Motorized operation with remote control",
      "120-inch diagonal (16:9 aspect ratio)",
      "High-gain matte white surface",
      "Black borders for enhanced contrast",
      "Wall or ceiling mountable",
    ],
    specifications: {
      Size: "120 inch diagonal",
      "Aspect Ratio": "16:9",
      Gain: "1.1",
      "Viewing Angle": "160 degrees",
    },
    vendorId: "v3",
    tags: ["Projection", "Screen", "Motorized", "Home Theater", "Presentation"],
    dateAdded: "2025-02-08T10:30:00Z",
  },
  {
    id: "ep2",
    name: "Portable Tripod Projection Screen - 100 inch",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 18000, currency: "KSH" },
    originalPrice: { amount: 22000, currency: "KSH" },
    category: "entertainment",
    subcategory: "screens",
    brand: "PortaView",
    description:
      "Portable 100-inch tripod projection screen that sets up in minutes, perfect for presentations, events, and outdoor movie nights.",
    rating: 4.6,
    reviewCount: 78,
    stockStatus: "In Stock",
    stockCount: 15,
    discount: 18,
    isRentable: true,
    rentalPrice: { amount: 2000, currency: "KSH" },
    rentalPeriod: "per day",
    features: [
      "Quick setup tripod design",
      "100-inch diagonal (4:3 aspect ratio)",
      "Matte white surface",
      "Height adjustable",
      "Carrying case included",
    ],
    specifications: {
      Size: "100 inch diagonal",
      "Aspect Ratio": "4:3",
      Gain: "1.0",
      "Setup Time": "Under 2 minutes",
    },
    vendorId: "v3",
    tags: ["Projection", "Screen", "Portable", "Tripod", "Presentation"],
    dateAdded: "2025-01-25T10:30:00Z",
  },

  // Entertainment Equipment - Music Instruments - Guitars
  {
    id: "emg1",
    name: "Professional Electric Guitar - Sunburst Finish",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 45000, currency: "KSH" },
    originalPrice: { amount: 55000, currency: "KSH" },
    category: "entertainment",
    subcategory: "instruments",
    subSubcategory: "guitars",
    brand: "SonicWave",
    description:
      "Professional electric guitar with premium tonewoods, high-output pickups, and classic sunburst finish for versatile playing styles.",
    rating: 4.9,
    reviewCount: 124,
    stockStatus: "In Stock",
    stockCount: 8,
    discount: 18,
    isBestSeller: true,
    isRentable: true,
    rentalPrice: { amount: 3500, currency: "KSH" },
    rentalPeriod: "per week",
    features: [
      "Solid alder body with maple neck",
      "Rosewood fingerboard with 22 frets",
      "Premium humbucker pickups",
      "5-way pickup selector",
      "Locking tuners for stability",
    ],
    specifications: {
      Body: "Solid alder",
      Neck: "Maple with rosewood fingerboard",
      Pickups: "Dual humbuckers",
      "Scale Length": "25.5 inches",
    },
    vendorId: "v5",
    tags: ["Guitar", "Electric", "Instrument", "Music", "Professional"],
    dateAdded: "2025-02-10T10:30:00Z",
  },
  {
    id: "emg2",
    name: "Acoustic-Electric Guitar with Cutaway",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 28000, currency: "KSH" },
    originalPrice: { amount: 35000, currency: "KSH" },
    category: "entertainment",
    subcategory: "instruments",
    subSubcategory: "guitars",
    brand: "HarmonyWood",
    description:
      "Versatile acoustic-electric guitar with cutaway design, built-in preamp, and rich tone for both acoustic and amplified playing.",
    rating: 4.7,
    reviewCount: 98,
    stockStatus: "In Stock",
    stockCount: 12,
    discount: 20,
    isNew: true,
    isRentable: true,
    rentalPrice: { amount: 2500, currency: "KSH" },
    rentalPeriod: "per week",
    features: [
      "Solid spruce top with mahogany back and sides",
      "Cutaway design for upper fret access",
      "Built-in preamp with tuner",
      "Fishman pickup system",
      "Die-cast tuners for precise tuning",
    ],
    specifications: {
      Top: "Solid spruce",
      "Back & Sides": "Mahogany",
      Electronics: "Fishman preamp with tuner",
      Shape: "Dreadnought with cutaway",
    },
    vendorId: "v5",
    tags: ["Guitar", "Acoustic-Electric", "Instrument", "Music", "Cutaway"],
    dateAdded: "2025-03-22T10:30:00Z",
  },

  // Entertainment Equipment - Music Instruments - Pianos
  {
    id: "emp1",
    name: "Digital Grand Piano with Bench",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 180000, currency: "KSH" },
    originalPrice: { amount: 220000, currency: "KSH" },
    category: "entertainment",
    subcategory: "instruments",
    subSubcategory: "pianos",
    brand: "GrandTone",
    description:
      "Premium digital grand piano with authentic hammer action, multiple voice options, and elegant design for professional performances.",
    rating: 4.9,
    reviewCount: 56,
    stockStatus: "In Stock",
    stockCount: 3,
    discount: 18,
    isBestSeller: true,
    isRentable: true,
    rentalPrice: { amount: 15000, currency: "KSH" },
    rentalPeriod: "per week",
    features: [
      "88 weighted keys with hammer action",
      "256-note polyphony",
      "30 instrument voices",
      "Built-in recording function",
      "USB and MIDI connectivity",
    ],
    specifications: {
      Keys: "88 weighted keys",
      Polyphony: "256 notes",
      Voices: "30 instrument voices",
      Connections: "USB, MIDI, Headphone, Line out",
    },
    vendorId: "v5",
    tags: ["Piano", "Digital", "Grand", "Instrument", "Music"],
    dateAdded: "2025-01-15T10:30:00Z",
  },
  {
    id: "emp2",
    name: "Portable 88-Key Digital Piano",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 65000, currency: "KSH" },
    originalPrice: { amount: 80000, currency: "KSH" },
    category: "entertainment",
    subcategory: "instruments",
    subSubcategory: "pianos",
    brand: "KeyMaster",
    description:
      "Portable 88-key digital piano with weighted keys, premium sound engine, and compact design for performers on the go.",
    rating: 4.7,
    reviewCount: 87,
    stockStatus: "In Stock",
    stockCount: 7,
    discount: 19,
    isRentable: true,
    rentalPrice: { amount: 6000, currency: "KSH" },
    rentalPeriod: "per week",
    features: [
      "88 fully weighted keys",
      "192-note polyphony",
      "20 high-quality instrument voices",
      "Built-in speakers and headphone output",
      "Lightweight design with carrying case",
    ],
    specifications: {
      Keys: "88 weighted keys",
      Polyphony: "192 notes",
      Voices: "20 instrument voices",
      Weight: "11.8kg",
    },
    vendorId: "v5",
    tags: ["Piano", "Digital", "Portable", "Instrument", "Music"],
    dateAdded: "2025-02-20T10:30:00Z",
  },

  // Entertainment Equipment - Music Instruments - Speakers
  {
    id: "ems1",
    name: "Professional Powered PA Speaker - 15 inch",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 55000, currency: "KSH" },
    originalPrice: { amount: 68000, currency: "KSH" },
    category: "entertainment",
    subcategory: "instruments",
    subSubcategory: "speakers",
    brand: "SoundForce",
    description:
      "Professional 15-inch powered PA speaker with 1500W peak power, DSP processing, and versatile mounting options for live sound applications.",
    rating: 4.8,
    reviewCount: 112,
    stockStatus: "In Stock",
    stockCount: 10,
    discount: 19,
    isBestSeller: true,
    isRentable: true,
    rentalPrice: { amount: 5000, currency: "KSH" },
    rentalPeriod: "per day",
    features: [
      "1500W peak power (500W RMS)",
      "15-inch woofer with 1.75-inch compression driver",
      "DSP with multiple presets",
      '2-channel mixer with XLR and 1/4" inputs',
      "Pole mount and fly points for installation",
    ],
    specifications: {
      Power: "1500W peak, 500W RMS",
      Drivers: '15" woofer, 1.75" compression driver',
      "Frequency Response": "45Hz-20kHz",
      "Max SPL": "132dB",
    },
    vendorId: "v1",
    tags: ["Speaker", "PA", "Powered", "Live Sound", "Professional"],
    dateAdded: "2025-01-30T10:30:00Z",
  },
  {
    id: "ems2",
    name: "Compact 10-inch Active Subwoofer",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 42000, currency: "KSH" },
    originalPrice: { amount: 52000, currency: "KSH" },
    category: "entertainment",
    subcategory: "instruments",
    subSubcategory: "speakers",
    brand: "BassMaster",
    description:
      "Compact 10-inch active subwoofer with 800W peak power, adjustable crossover, and durable construction for enhanced low-frequency performance.",
    rating: 4.7,
    reviewCount: 78,
    stockStatus: "In Stock",
    stockCount: 12,
    discount: 19,
    isNew: true,
    isRentable: true,
    rentalPrice: { amount: 4000, currency: "KSH" },
    rentalPeriod: "per day",
    features: [
      "800W peak power (300W RMS)",
      "10-inch high-excursion woofer",
      "Adjustable crossover (80Hz-200Hz)",
      "Phase switch for optimal alignment",
      "XLR and RCA inputs for versatile connectivity",
    ],
    specifications: {
      Power: "800W peak, 300W RMS",
      Driver: '10" high-excursion woofer',
      "Frequency Response": "35Hz-200Hz",
      Cabinet: "Bass-reflex design",
    },
    vendorId: "v1",
    tags: ["Subwoofer", "Bass", "Active", "Speaker", "Compact"],
    dateAdded: "2025-03-18T10:30:00Z",
  },

  // Entertainment Equipment - Music Instruments - Microphones
  {
    id: "emm1",
    name: "Professional Wireless Microphone System",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 38000, currency: "KSH" },
    originalPrice: { amount: 48000, currency: "KSH" },
    category: "entertainment",
    subcategory: "instruments",
    subSubcategory: "microphones",
    brand: "VocalPro",
    description:
      "Professional dual-channel wireless microphone system with handheld transmitters, digital receiver, and extended range for live performances.",
    rating: 4.8,
    reviewCount: 96,
    stockStatus: "In Stock",
    stockCount: 15,
    discount: 21,
    isBestSeller: true,
    isRentable: true,
    rentalPrice: { amount: 3500, currency: "KSH" },
    rentalPeriod: "per day",
    features: [
      "Dual-channel digital receiver",
      "2 handheld dynamic microphone transmitters",
      "100m operating range",
      "LCD display with channel information",
      'Balanced XLR and unbalanced 1/4" outputs',
    ],
    specifications: {
      Channels: "2",
      "Frequency Range": "UHF 520-590MHz",
      "Battery Life": "8 hours per transmitter",
      Range: "100 meters line of sight",
    },
    vendorId: "v1",
    tags: ["Microphone", "Wireless", "Vocal", "Live Sound", "Professional"],
    dateAdded: "2025-02-05T10:30:00Z",
  },
  {
    id: "emm2",
    name: "Adjustable Microphone Stand with Boom Arm",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 5500, currency: "KSH" },
    originalPrice: { amount: 7000, currency: "KSH" },
    category: "entertainment",
    subcategory: "instruments",
    subSubcategory: "microphones",
    brand: "StageGear",
    description:
      "Heavy-duty adjustable microphone stand with telescoping height, boom arm, and stable tripod base for stage and studio applications.",
    rating: 4.6,
    reviewCount: 124,
    stockStatus: "In Stock",
    stockCount: 25,
    discount: 21,
    isRentable: true,
    rentalPrice: { amount: 500, currency: "KSH" },
    rentalPeriod: "per day",
    features: [
      "Telescoping height adjustment (90-160cm)",
      "Adjustable boom arm (75cm)",
      "Heavy-duty tripod base for stability",
      'Standard 5/8" thread for microphone clips',
      "Cable management clips included",
    ],
    specifications: {
      Height: "90-160cm adjustable",
      "Boom Length": "75cm",
      Base: "Tripod design",
      Material: "Steel construction",
    },
    vendorId: "v1",
    tags: ["Microphone", "Stand", "Boom", "Stage", "Studio"],
    dateAdded: "2025-01-20T10:30:00Z",
  },

  // Branded Merchandise - Clothing
  {
    id: "bmc1",
    name: "Limited Edition Band Tour Hoodie",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 3500, currency: "KSH" },
    originalPrice: { amount: 4500, currency: "KSH" },
    category: "merchandise",
    subcategory: "clothing",
    brand: "BandMerch",
    description:
      "Limited edition hoodie from the world tour of a popular band, featuring premium fabric and exclusive artwork.",
    rating: 4.8,
    reviewCount: 156,
    stockStatus: "Low Stock",
    stockCount: 8,
    discount: 22,
    isBestSeller: true,
    features: [
      "Limited edition design",
      "Premium heavyweight cotton blend",
      "Front and back tour artwork",
      "Drawstring hood and kangaroo pocket",
      "Ribbed cuffs and hem",
    ],
    specifications: {
      Material: "80% cotton, 20% polyester",
      Weight: "350gsm",
      Sizes: "S, M, L, XL, XXL",
      Care: "Machine wash cold, tumble dry low",
    },
    vendorId: "v3",
    tags: ["Hoodie", "Band", "Tour", "Merchandise", "Limited Edition"],
    dateAdded: "2025-02-15T10:30:00Z",
  },
  {
    id: "bmc2",
    name: "Official Sports Team Jersey - Home Kit",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 4800, currency: "KSH" },
    originalPrice: { amount: 6000, currency: "KSH" },
    category: "merchandise",
    subcategory: "clothing",
    brand: "TeamGear",
    description:
      "Official replica jersey of a popular sports team's home kit, featuring team colors, crest, and sponsor logos.",
    rating: 4.7,
    reviewCount: 142,
    stockStatus: "In Stock",
    stockCount: 22,
    discount: 20,
    isNew: true,
    features: [
      "Official licensed merchandise",
      "Authentic team design and colors",
      "Breathable performance fabric",
      "Embroidered team crest",
      "Sponsor logos",
    ],
    specifications: {
      Material: "100% polyester",
      Fit: "Regular fit",
      Sizes: "S, M, L, XL, XXL",
      Season: "2024/2025",
    },
    vendorId: "v2",
    tags: ["Jersey", "Sports", "Team", "Official", "Replica"],
    dateAdded: "2025-03-20T10:30:00Z",
  },

  // Branded Merchandise - Accessories
  {
    id: "bma1",
    name: "Premium Festival Branded Backpack",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 3200, currency: "KSH" },
    originalPrice: { amount: 4000, currency: "KSH" },
    category: "merchandise",
    subcategory: "accessories",
    brand: "FestGear",
    description:
      "Premium backpack featuring exclusive festival branding, multiple compartments, and durable water-resistant construction.",
    rating: 4.8,
    reviewCount: 87,
    stockStatus: "In Stock",
    stockCount: 18,
    discount: 20,
    isBestSeller: true,
    features: [
      "Exclusive festival branding",
      "Water-resistant material",
      'Laptop compartment (fits up to 15")',
      "Multiple storage pockets",
      "Padded shoulder straps and back panel",
    ],
    specifications: {
      Material: "600D polyester with water-resistant coating",
      Capacity: "25L",
      Dimensions: "45cm x 30cm x 15cm",
      Weight: "0.8kg",
    },
    vendorId: "v3",
    tags: ["Backpack", "Festival", "Branded", "Merchandise", "Accessory"],
    dateAdded: "2025-02-10T10:30:00Z",
  },
  {
    id: "bma2",
    name: "Limited Edition Artist Collaboration Water Bottle",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 1800, currency: "KSH" },
    originalPrice: { amount: 2500, currency: "KSH" },
    category: "merchandise",
    subcategory: "accessories",
    brand: "ArtistMerch",
    description:
      "Limited edition stainless steel water bottle featuring exclusive artwork from a renowned artist collaboration.",
    rating: 4.7,
    reviewCount: 124,
    stockStatus: "Low Stock",
    stockCount: 10,
    discount: 28,
    isNew: true,
    features: [
      "Limited edition artist collaboration",
      "Double-wall vacuum insulation",
      "Keeps drinks cold for 24 hours, hot for 12 hours",
      "BPA-free and eco-friendly",
      "Leak-proof lid design",
    ],
    specifications: {
      Material: "18/8 stainless steel",
      Capacity: "750ml",
      Dimensions: "27cm x 7.5cm",
      Weight: "0.35kg",
    },
    vendorId: "v3",
    tags: ["Water Bottle", "Artist", "Limited Edition", "Merchandise", "Eco-Friendly"],
    dateAdded: "2025-03-25T10:30:00Z",
  },
]

export default function EntertainmentShopPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<string>("sports")
  const [activeSubcategory, setActiveSubcategory] = useState<string>("")
  const [activeSubSubcategory, setActiveSubSubcategory] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortOrder, setSortOrder] = useState("default")
  const [selectedProduct, setSelectedProduct] = useState<EntertainmentProduct | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(false)
  const [showOnlyRentable, setShowOnlyRentable] = useState(false)
  const [showOnlyBestSellers, setShowOnlyBestSellers] = useState(false)
  const [showOnlyNewArrivals, setShowOnlyNewArrivals] = useState(false)

  // New product alert state
  const [newProductAlert, setNewProductAlert] = useState<EntertainmentProduct | null>(null)

  // Infinite scroll states
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [visibleProducts, setVisibleProducts] = useState<EntertainmentProduct[]>([])
  const loaderRef = useRef<HTMLDivElement>(null)
  const productsPerPage = 8

  // Get all available brands
  const allBrands = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.brand)))
  }, [])

  // Get subcategories for active category
  const activeSubcategories = useMemo(() => {
    const category = categories.find((cat) => cat.id === activeCategory)
    return category ? category.subcategories : []
  }, [activeCategory])

  // Get sub-subcategories for active subcategory
  const activeSubSubcategories = useMemo(() => {
    const category = categories.find((cat) => cat.id === activeCategory)
    if (!category) return []

    const subcategory = category.subcategories.find((subcat) => subcat.id === activeSubcategory)
    return subcategory?.subSubcategories || []
  }, [activeCategory, activeSubcategory])

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    let results = products

    // Filter by category
    if (activeCategory) {
      results = results.filter((product) => product.category === activeCategory)
    }

    // Filter by subcategory
    if (activeSubcategory) {
      results = results.filter((product) => product.subcategory === activeSubcategory)
    }

    // Filter by sub-subcategory
    if (activeSubSubcategory) {
      results = results.filter((product) => product.subSubcategory === activeSubSubcategory)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.brand.toLowerCase().includes(term) ||
          (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(term))),
      )
    }

    // Filter by price range
    results = results.filter(
      (product) => product.currentPrice.amount >= priceRange[0] && product.currentPrice.amount <= priceRange[1],
    )

    // Filter by brands
    if (selectedBrands.length > 0) {
      results = results.filter((product) => selectedBrands.includes(product.brand))
    }

    // Filter by discount
    if (showOnlyDiscounted) {
      results = results.filter((product) => product.discount && product.discount > 0)
    }

    // Filter by rentable
    if (showOnlyRentable) {
      results = results.filter((product) => product.isRentable)
    }

    // Filter by best sellers
    if (showOnlyBestSellers) {
      results = results.filter((product) => product.isBestSeller)
    }

    // Filter by new arrivals
    if (showOnlyNewArrivals) {
      results = results.filter((product) => product.isNew)
    }

    // Sort results
    if (sortOrder === "price-asc") {
      results.sort((a, b) => a.currentPrice.amount - b.currentPrice.amount)
    } else if (sortOrder === "price-desc") {
      results.sort((a, b) => b.currentPrice.amount - a.currentPrice.amount)
    } else if (sortOrder === "rating") {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortOrder === "discount") {
      results.sort((a, b) => (b.discount || 0) - (a.discount || 0))
    }

    return results
  }, [
    products,
    activeCategory,
    activeSubcategory,
    activeSubSubcategory,
    searchTerm,
    priceRange,
    selectedBrands,
    sortOrder,
    showOnlyDiscounted,
    showOnlyRentable,
    showOnlyBestSellers,
    showOnlyNewArrivals,
  ])

  // Get vendor for a product
  const getVendorForProduct = (vendorId: string) => {
    return vendors.find((vendor) => vendor.id === vendorId)
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setActiveSubcategory("")
    setActiveSubSubcategory("")
    resetPagination()
  }

  const handleSubcategoryChange = (subcategory: string) => {
    setActiveSubcategory(subcategory)
    setActiveSubSubcategory("")
    resetPagination()
  }

  const handleSubSubcategoryChange = (subSubcategory: string) => {
    setActiveSubSubcategory(subSubcategory)
    resetPagination()
  }

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value as [number, number])
    resetPagination()
  }

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) => {
      const newBrands = prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
      return newBrands
    })
    resetPagination()
  }

  const handleProductClick = (product: EntertainmentProduct) => {
    setSelectedProduct(product)
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
  }

  const closeNewProductAlert = () => {
    setNewProductAlert(null)
  }

  const resetPagination = () => {
    setPage(1)
    setVisibleProducts([])
    setHasMore(true)
  }

  // Load more products for infinite scroll
  const loadMoreProducts = useCallback(() => {
    if (!hasMore || isLoading) return

    setIsLoading(true)

    // Simulate API call with setTimeout
    setTimeout(() => {
      const startIndex = (page - 1) * productsPerPage
      const endIndex = startIndex + productsPerPage
      const newProducts = filteredProducts.slice(startIndex, endIndex)

      if (newProducts.length > 0) {
        setVisibleProducts((prev) => [...prev, ...newProducts])
        setPage((prev) => prev + 1)
        setHasMore(endIndex < filteredProducts.length)
      } else {
        setHasMore(false)
      }

      setIsLoading(false)
    }, 800)
  }, [filteredProducts, hasMore, isLoading, page, productsPerPage])

  
//added new feature to controll loading of pages
useEffect(() => {
  loadMoreProducts()
}, [])


    
  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreProducts()
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
  }, [hasMore, isLoading, loadMoreProducts])

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination()
    loadMoreProducts()
  }, [filteredProducts]) // eslint-disable-line react-hooks/exhaustive-deps

  // Show new product alert
  useEffect(() => {
    // Find the newest product (added in the last 3 days)
    const newestProducts = products.filter((product) => {
      if (!product.dateAdded) return false
      const productDate = new Date(product.dateAdded)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - productDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 3
    })

    if (newestProducts.length > 0) {
      // Sort by date to get the newest one
      const newestProduct = newestProducts.sort(
        (a, b) => new Date(b.dateAdded || "").getTime() - new Date(a.dateAdded || "").getTime(),
      )[0]

      // Set as new product alert
      setNewProductAlert(newestProduct)

      // Auto-dismiss after 15 seconds
      const timer = setTimeout(() => {
        setNewProductAlert(null)
      }, 15000)

      return () => clearTimeout(timer)
    }
  }, [])

  // Get hot deals
  const hotDeals = useMemo(() => {
    return transformForHotDeals(products)
  }, [])

  // Get category icon
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "sports":
        return <Football className="h-5 w-5" />
      case "entertainment":
        return <Music className="h-5 w-5" />
      case "merchandise":
        return <Tag className="h-5 w-5" />
      default:
        return null
    }
  }

  // Get subcategory icon
  const getSubcategoryIcon = (categoryId: string, subcategoryId: string) => {
    if (categoryId === "sports") {
      switch (subcategoryId) {
        case "attires":
          return <Shirt className="h-4 w-4" />
        case "equipment":
          return <Football className="h-4 w-4" />
        default:
          return null
      }
    } else if (categoryId === "entertainment") {
      switch (subcategoryId) {
        case "audio":
          return <Headphones className="h-4 w-4" />
        case "mixers":
          return <Disc className="h-4 w-4" />
        case "screens":
          return <Tv className="h-4 w-4" />
        case "instruments":
          return <Music className="h-4 w-4" />
        default:
          return null
      }
    } else if (categoryId === "merchandise") {
      switch (subcategoryId) {
        case "clothing":
          return <Shirt className="h-4 w-4" />
        case "accessories":
          return <Ticket className="h-4 w-4" />
        default:
          return null
      }
    }
    return null
  }

  // Get sub-subcategory icon
  const getSubSubcategoryIcon = (categoryId: string, subcategoryId: string, subSubcategoryId: string) => {
    if (categoryId === "entertainment" && subcategoryId === "instruments") {
      switch (subSubcategoryId) {
        case "guitars":
          return <Guitar className="h-4 w-4" />
        case "pianos":
          return <Piano className="h-4 w-4" />
        case "speakers":
          return <Speaker className="h-4 w-4" />
        case "microphones":
          return <Microphone className="h-4 w-4" />
        default:
          return null
      }
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500 filter blur-[100px] animate-pulse"></div>
          <div
            className="absolute top-3/4 left-2/3 w-96 h-96 rounded-full bg-blue-500 filter blur-[100px] animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-pink-500 filter blur-[100px] animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-5"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-blue-900/80 via-indigo-900/80 to-purple-900/80 backdrop-blur-md py-12 border-b border-indigo-500/30">
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <Link
                href="/entertainment"
                className="flex items-center text-blue-300 mb-4 hover:text-blue-200 transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Entertainment</span>
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300">
                Entertainment Shop
              </h1>
              <p className="text-blue-200 max-w-2xl">
                Discover premium entertainment equipment, sports gear, and branded merchandise for all your
                entertainment needs.
              </p>
            </div>
            <div className="hidden md:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-900 to-purple-900 p-5 rounded-lg shadow-xl">
                  <div className="text-white text-center">
                    <Music className="h-8 w-8 mx-auto mb-2 text-purple-300" />
                    <p className="font-medium text-lg">Special Offers</p>
                    <p className="text-sm text-blue-200">Up to 30% off</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <CountdownTimer targetDate="2025-05-31T23:59:59" startDate="2025-03-01T00:00:00" />
      </div>

      {/* Hot Time Deals Section */}
      {hotDeals.length > 0 && (
        <div className="container mx-auto px-4 relative z-10">
          <HotTimeDeals
            deals={hotDeals}
            colorScheme="blue"
            title="Limited Time Entertainment Deals"
            subtitle="Grab these exclusive entertainment offers before they're gone!"
          />
        </div>
      )}

      {/* Search and filters */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products, brands, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-6 rounded-full border-transparent bg-blue-950/50 backdrop-blur-md text-white placeholder:text-blue-300 focus:border-blue-400 focus:ring-blue-400 w-full shadow-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:flex-none">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="relative w-full md:w-[180px] border-transparent bg-blue-950/50 backdrop-blur-md text-white rounded-full shadow-lg">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-blue-950 border-blue-800 text-white">
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="discount">Biggest Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative group flex-1 md:flex-none">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="relative w-full flex items-center justify-center gap-2 border-transparent bg-blue-950/50 backdrop-blur-md text-white rounded-full shadow-lg hover:bg-blue-900/50"
              >
                <Filter className="h-4 w-4 text-blue-300" />
                <span>Filters</span>
                <ChevronDown
                  className={`h-4 w-4 text-blue-300 transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-6"
            >
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30"></div>
                <div className="relative bg-blue-950/50 backdrop-blur-md p-6 rounded-xl border border-blue-800/50 shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Price range filter */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Tag className="h-5 w-5 mr-2 text-blue-300" />
                        Price Range
                      </h3>
                      <div className="px-4">
                        <Slider
                          defaultValue={[0, 200000]}
                          max={200000}
                          step={5000}
                          value={priceRange}
                          onValueChange={handlePriceRangeChange}
                          className="mb-6"
                        />
                        <div className="flex justify-between text-sm text-blue-200">
                          <span>{formatPrice({ amount: priceRange[0], currency: "KSH" })}</span>
                          <span>{formatPrice({ amount: priceRange[1], currency: "KSH" })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Brand filter */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Store className="h-5 w-5 mr-2 text-blue-300" />
                        Brands
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-950">
                        {allBrands.map((brand) => (
                          <div key={brand} className="flex items-center space-x-2">
                            <Checkbox
                              id={`brand-${brand}`}
                              checked={selectedBrands.includes(brand)}
                              onCheckedChange={() => handleBrandToggle(brand)}
                              className="border-blue-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                            />
                            <Label
                              htmlFor={`brand-${brand}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-100"
                            >
                              {brand}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Product type filters */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Filter className="h-5 w-5 mr-2 text-blue-300" />
                        Product Type
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="discounted"
                            checked={showOnlyDiscounted}
                            onCheckedChange={() => setShowOnlyDiscounted(!showOnlyDiscounted)}
                            className="border-blue-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                          />
                          <Label
                            htmlFor="discounted"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-100"
                          >
                            On Sale
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="rentable"
                            checked={showOnlyRentable}
                            onCheckedChange={() => setShowOnlyRentable(!showOnlyRentable)}
                            className="border-blue-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                          />
                          <Label
                            htmlFor="rentable"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-100"
                          >
                            Available for Rent
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="bestsellers"
                            checked={showOnlyBestSellers}
                            onCheckedChange={() => setShowOnlyBestSellers(!showOnlyBestSellers)}
                            className="border-blue-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                          />
                          <Label
                            htmlFor="bestsellers"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-100"
                          >
                            Best Sellers
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="newarrivals"
                            checked={showOnlyNewArrivals}
                            onCheckedChange={() => setShowOnlyNewArrivals(!showOnlyNewArrivals)}
                            className="border-blue-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                          />
                          <Label
                            htmlFor="newarrivals"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-100"
                          >
                            New Arrivals
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Quick filters */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-blue-300" />
                        Quick Filters
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "rounded-full border-blue-700 hover:bg-blue-800/50 text-blue-200 hover:border-purple-500 transition-all duration-300",
                            showOnlyDiscounted &&
                              "bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white",
                          )}
                          onClick={() => setShowOnlyDiscounted(!showOnlyDiscounted)}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          On Sale
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "rounded-full border-blue-700 hover:bg-blue-800/50 text-blue-200 hover:border-purple-500 transition-all duration-300",
                            showOnlyBestSellers &&
                              "bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white",
                          )}
                          onClick={() => setShowOnlyBestSellers(!showOnlyBestSellers)}
                        >
                          <Flame className="h-3 w-3 mr-1" />
                          Best Sellers
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "rounded-full border-blue-700 hover:bg-blue-800/50 text-blue-200 hover:border-purple-500 transition-all duration-300",
                            showOnlyNewArrivals &&
                              "bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white",
                          )}
                          onClick={() => setShowOnlyNewArrivals(!showOnlyNewArrivals)}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          New Arrivals
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "rounded-full border-blue-700 hover:bg-blue-800/50 text-blue-200 hover:border-purple-500 transition-all duration-300",
                            showOnlyRentable &&
                              "bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white",
                          )}
                          onClick={() => setShowOnlyRentable(!showOnlyRentable)}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          For Rent
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Categories and products */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <Tabs defaultValue="sports" value={activeCategory} onValueChange={handleCategoryChange} className="w-full">
          <TabsList className="bg-blue-950/50 backdrop-blur-md p-1 rounded-xl mb-6 flex flex-nowrap overflow-x-auto hide-scrollbar border border-blue-800/50 shadow-lg">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={`flex items-center gap-1.5 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-blue-200 hover:bg-blue-800/50"
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              {/* Subcategories */}
              <div className="mb-8 overflow-x-auto hide-scrollbar">
                <div className="flex space-x-2 pb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-full whitespace-nowrap ${
                      activeSubcategory === ""
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white shadow-md"
                        : "border-blue-700 text-blue-200 hover:bg-blue-800/50 hover:border-purple-500"
                    }`}
                    onClick={() => handleSubcategoryChange("")}
                  >
                    {getCategoryIcon(category.id)}
                    <span className="ml-1">All {category.name}</span>
                  </Button>
                  {category.subcategories.map((subcategory) => (
                    <Button
                      key={subcategory.id}
                      variant="outline"
                      size="sm"
                      className={`rounded-full whitespace-nowrap ${
                        activeSubcategory === subcategory.id
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white shadow-md"
                          : "border-blue-700 text-blue-200 hover:bg-blue-800/50 hover:border-purple-500"
                      }`}
                      onClick={() => handleSubcategoryChange(subcategory.id)}
                    >
                      {getSubcategoryIcon(category.id, subcategory.id)}
                      <span className="ml-1">
                        {subcategory.name} ({subcategory.productCount})
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sub-subcategories (if available) */}
              {activeSubcategory && activeSubSubcategories.length > 0 && (
                <div className="mb-8 overflow-x-auto hide-scrollbar">
                  <div className="flex space-x-2 pb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`rounded-full whitespace-nowrap ${
                        activeSubSubcategory === ""
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 border-transparent text-white shadow-md"
                          : "border-indigo-700 text-indigo-200 hover:bg-indigo-800/50 hover:border-purple-500"
                      }`}
                      onClick={() => handleSubSubcategoryChange("")}
                    >
                      {getSubcategoryIcon(activeCategory, activeSubcategory)}
                      <span className="ml-1">
                        All {activeSubcategories.find((s) => s.id === activeSubcategory)?.name}
                      </span>
                    </Button>
                    {activeSubSubcategories.map((subSubcategory) => (
                      <Button
                        key={subSubcategory.id}
                        variant="outline"
                        size="sm"
                        className={`rounded-full whitespace-nowrap ${
                          activeSubSubcategory === subSubcategory.id
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 border-transparent text-white shadow-md"
                            : "border-indigo-700 text-indigo-200 hover:bg-indigo-800/50 hover:border-purple-500"
                        }`}
                        onClick={() => handleSubSubcategoryChange(subSubcategory.id)}
                      >
                        {getSubSubcategoryIcon(activeCategory, activeSubcategory, subSubcategory.id)}
                        <span className="ml-1">
                          {subSubcategory.name} ({subSubcategory.productCount})
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Products grid with infinite scroll */}
              {visibleProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {visibleProducts.map((product) => {
                    const vendor = getVendorForProduct(product.vendorId)
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className="h-full"
                      >
                        <div className="relative group h-full">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
                          <Card className="relative h-full overflow-hidden border-transparent bg-blue-950/50 backdrop-blur-md hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
                            <div className="cursor-pointer" onClick={() => handleProductClick(product)}>
                              {/* Product image */}
                              <div className="relative h-64 bg-gradient-to-br from-blue-900 to-purple-900 overflow-hidden">
                                <Image
                                  src={product.imageUrl || "/placeholder.svg"}
                                  alt={product.name}
                                  layout="fill"
                                  objectFit="cover"
                                  className="transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 to-transparent"></div>

                                {/* Badges */}
                                <div className="absolute top-2 left-2 flex flex-col gap-2">
                                  {product.isNew && (
                                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg">
                                      New
                                    </Badge>
                                  )}
                                  {product.isBestSeller && (
                                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg flex items-center gap-1">
                                      <Flame className="h-3 w-3" />
                                      <span>Best Seller</span>
                                    </Badge>
                                  )}
                                  {product.isRentable && (
                                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      <span>For Rent</span>
                                    </Badge>
                                  )}
                                </div>

                                {/* Discount badge */}
                                {product.discount && product.discount > 0 && (
                                  <div className="absolute top-2 right-2">
                                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-lg">
                                      {product.discount}% OFF
                                    </Badge>
                                  </div>
                                )}

                                {/* Stock status */}
                                {product.stockStatus === "Low Stock" && (
                                  <div className="absolute bottom-2 left-2">
                                    <Badge className="bg-amber-500 text-white border-0 shadow-lg">Low Stock</Badge>
                                  </div>
                                )}
                                {product.stockStatus === "Out of Stock" && (
                                  <div className="absolute bottom-2 left-2">
                                    <Badge className="bg-red-500 text-white border-0 shadow-lg">Out of Stock</Badge>
                                  </div>
                                )}

                                {/* Wishlist button */}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-blue-900/80 hover:bg-blue-800 text-blue-200 hover:text-blue-100 backdrop-blur-sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Add to wishlist functionality
                                  }}
                                >
                                  <Heart className="h-4 w-4" />
                                </Button>
                              </div>

                              <CardContent className="p-4">
                                <div className="mb-2 flex items-center justify-between">
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-blue-700 text-blue-300 bg-blue-900/30"
                                  >
                                    {product.subcategory
                                      .split("-")
                                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                      .join(" ")}
                                  </Badge>
                                  <span className="text-xs text-blue-300">{product.brand}</span>
                                </div>

                                <h3 className="font-semibold text-white mb-1 line-clamp-1">{product.name}</h3>
                                <p className="text-sm text-blue-200 mb-3 line-clamp-2">{product.description}</p>

                                {/* Vendor info */}
                                {vendor && (
                                  <div className="flex items-center mb-3 bg-blue-900/30 p-2 rounded-md backdrop-blur-sm">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs mr-2">
                                      {vendor.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-blue-100 truncate">{vendor.name}</p>
                                      <p className="text-xs text-blue-300 flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        <span className="truncate">{vendor.location}</span>
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Rating */}
                                {product.rating && (
                                  <div className="flex items-center mb-3">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-4 w-4 ${
                                            i < Math.floor(product.rating || 0)
                                              ? "text-yellow-400 fill-yellow-400"
                                              : "text-blue-700"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="ml-1 text-xs text-blue-300">({product.reviewCount})</span>
                                  </div>
                                )}

                                {/* Price */}
                                <div className="flex items-end justify-between mb-3">
                                  <div>
                                    <div className="text-lg font-bold text-white">
                                      {formatPrice(product.currentPrice)}
                                    </div>
                                    {product.originalPrice.amount !== product.currentPrice.amount && (
                                      <div className="text-sm text-blue-400 line-through">
                                        {formatPrice(product.originalPrice)}
                                      </div>
                                    )}
                                  </div>
                                  {product.isRentable && (
                                    <div className="text-xs text-blue-300">
                                      Rent: {formatPrice(product.rentalPrice!)} {product.rentalPeriod}
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </div>

                            {/* Action buttons */}
                            <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                              <Button
                                variant="outline"
                                className="border-blue-700 text-blue-300 hover:bg-blue-800/50 hover:border-purple-500 flex items-center justify-center gap-1 transition-colors"
                                onClick={() => handleProductClick(product)}
                              >
                                <Sparkles className="h-4 w-4" />
                                <span>Details</span>
                              </Button>

                              <Button
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 flex items-center justify-center gap-1"
                                disabled={product.stockStatus === "Out of Stock"}
                              >
                                <ShoppingCart className="h-4 w-4" />
                                <span>Add to Cart</span>
                              </Button>
                            </CardFooter>
                          </Card>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : isLoading && page === 1 ? (
                <div className="flex justify-center items-center py-12">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 relative">
                      <div className="absolute inset-0 rounded-full border-4 border-blue-300/20 border-t-blue-500 animate-spin"></div>
                      <div
                        className="absolute inset-2 rounded-full border-4 border-purple-300/20 border-t-purple-500 animate-spin"
                        style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
                      ></div>
                    </div>
                    <p className="mt-4 text-blue-300 font-medium">Loading amazing products...</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 mb-4 bg-blue-900/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Search className="h-10 w-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">No products found</h3>
                  <p className="text-blue-300 max-w-md mx-auto">
                    We couldn't find any products matching your criteria. Try adjusting your filters or search term.
                  </p>
                </div>
              )}

              {/* Infinite scroll loader */}
              {hasMore && (
                <div ref={loaderRef} className="flex justify-center items-center py-8">
                  {isLoading && (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 relative">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-300/20 border-t-blue-500 animate-spin"></div>
                      </div>
                      <p className="mt-2 text-blue-300 text-sm">Loading more products...</p>
                    </div>
                  )}
                </div>
              )}

              {/* End of results message */}
              {!hasMore && visibleProducts.length > 0 && (
                <div className="text-center py-8 border-t border-blue-800/30 mt-8">
                  <p className="text-blue-300">You've reached the end of the results</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Product detail modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && closeProductModal()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-950 to-purple-950 border-blue-700/50 text-white backdrop-blur-md">
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product image */}
              <div className="relative h-80 md:h-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
                <Image
                  src={selectedProduct.imageUrl || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 to-transparent"></div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  {selectedProduct.isNew && (
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg">
                      New
                    </Badge>
                  )}
                  {selectedProduct.isBestSeller && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      <span>Best Seller</span>
                    </Badge>
                  )}
                  {selectedProduct.isRentable && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>For Rent</span>
                    </Badge>
                  )}
                </div>

                {/* Discount badge */}
                {selectedProduct.discount && selectedProduct.discount > 0 && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg">
                      {selectedProduct.discount}% OFF
                    </Badge>
                  </div>
                )}
              </div>

              {/* Product details */}
              <div className="flex flex-col">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs border-blue-700 text-blue-300 bg-blue-900/30">
                      {selectedProduct.subcategory
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                      {selectedProduct.subSubcategory &&
                        ` / ${selectedProduct.subSubcategory
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}`}
                    </Badge>
                    <span className="text-sm text-blue-300">{selectedProduct.brand}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">{selectedProduct.name}</h2>

                  {/* Vendor info */}
                  {getVendorForProduct(selectedProduct.vendorId) && (
                    <div className="flex items-center mb-4 bg-blue-900/30 p-3 rounded-md backdrop-blur-sm">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs mr-3">
                        {getVendorForProduct(selectedProduct.vendorId)?.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{getVendorForProduct(selectedProduct.vendorId)?.name}</p>
                        <p className="text-sm text-blue-300 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{getVendorForProduct(selectedProduct.vendorId)?.location}</span>
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-700 text-blue-300 hover:bg-blue-800/50 hover:border-purple-500"
                        onClick={() => window.open(getVendorForProduct(selectedProduct.vendorId)?.website, "_blank")}
                      >
                        <Store className="h-4 w-4 mr-1" />
                        Visit Store
                      </Button>
                    </div>
                  )}

                  {/* Rating */}
                  {selectedProduct.rating && (
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(selectedProduct.rating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-blue-700"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-sm text-blue-300">
                        {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviewCount} reviews)
                      </span>
                    </div>
                  )}

                  <p className="text-blue-100 mb-4">{selectedProduct.description}</p>

                  {/* Features */}
                  {selectedProduct.features && selectedProduct.features.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-white mb-2">Key Features</h3>
                      <ul className="grid grid-cols-1 gap-2">
                        {selectedProduct.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                            <span className="text-blue-100">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Specifications */}
                  {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-white mb-2">Specifications</h3>
                      <div className="bg-blue-900/30 p-3 rounded-md backdrop-blur-sm">
                        {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-1 border-b border-blue-700/50 last:border-0"
                          >
                            <span className="text-blue-300">{key}</span>
                            <span className="text-white font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rental info */}
                  {selectedProduct.isRentable && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-white mb-2">Rental Information</h3>
                      <div className="bg-blue-900/30 p-3 rounded-md backdrop-blur-sm">
                        <div className="flex justify-between py-1">
                          <span className="text-blue-300">Rental Price</span>
                          <span className="text-white font-medium">
                            {formatPrice(selectedProduct.rentalPrice!)} {selectedProduct.rentalPeriod}
                          </span>
                        </div>
                        <p className="text-sm text-blue-200 mt-2">
                          This item is available for rent. Contact the vendor for rental terms and conditions.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Stock status */}
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-white mb-2">Availability</h3>
                    <div className="flex items-center">
                      <Badge
                        className={`${
                          selectedProduct.stockStatus === "In Stock"
                            ? "bg-green-500 text-white"
                            : selectedProduct.stockStatus === "Low Stock"
                              ? "bg-amber-500 text-white"
                              : "bg-red-500 text-white"
                        } border-0 shadow-lg`}
                      >
                        {selectedProduct.stockStatus}
                      </Badge>
                      {selectedProduct.stockCount && selectedProduct.stockStatus !== "Out of Stock" && (
                        <span className="ml-2 text-sm text-blue-300">{selectedProduct.stockCount} units available</span>
                      )}
                    </div>
                  </div>

                  {/* Price and buttons */}
                  <div className="mt-auto">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-white">{formatPrice(selectedProduct.currentPrice)}</div>
                        {selectedProduct.originalPrice.amount !== selectedProduct.currentPrice.amount && (
                          <div className="text-base text-blue-400 line-through">
                            {formatPrice(selectedProduct.originalPrice)}
                          </div>
                        )}
                      </div>
                      {selectedProduct.isRentable && (
                        <div className="text-sm text-blue-300">
                          Rent: {formatPrice(selectedProduct.rentalPrice!)} {selectedProduct.rentalPeriod}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        className="border-blue-700 text-blue-300 hover:bg-blue-800/50 hover:border-purple-500 flex-1 flex items-center justify-center gap-2"
                      >
                        <Heart className="h-4 w-4" />
                        <span>Add to Wishlist</span>
                      </Button>

                      <Button
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 flex-1 flex items-center justify-center gap-2"
                        disabled={selectedProduct.stockStatus === "Out of Stock"}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Product Alert */}
      <AnimatePresence>
        {newProductAlert && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 max-w-md"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-75"></div>
              <div className="relative bg-blue-950 rounded-lg shadow-xl border-blue-800/50 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-2">
                      <Bell className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                      <h3 className="text-lg font-medium text-white">New Product Alert!</h3>
                      <p className="mt-1 text-sm text-blue-200">
                        Check out the new {newProductAlert.name} from {newProductAlert.brand}. Limited stock available!
                      </p>
                      <div className="mt-3 flex gap-3">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 flex items-center gap-1"
                          onClick={() => {
                            handleProductClick(newProductAlert)
                            closeNewProductAlert()
                          }}
                        >
                          View Product
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-700 text-blue-300 hover:bg-blue-800/50 hover:border-purple-500"
                          onClick={closeNewProductAlert}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                      <button
                        className="bg-transparent rounded-md inline-flex text-blue-400 hover:text-blue-300 focus:outline-none"
                        onClick={closeNewProductAlert}
                      >
                        <span className="sr-only">Close</span>
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="h-1 w-full bg-blue-900">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 15, ease: "linear" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

