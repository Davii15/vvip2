"use client"

import type React from "react"

import { useMemo, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  ChevronDown,
  ArrowLeft,
  X,
  Music,
  ClubIcon as Football,
  Bell,
  ArrowUpRight,
  Tag,
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
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CountdownTimer from "@/components/CountdownTimer"
import HotTimeDeals from "@/components/HotTimeDeals"
import { Skeleton } from "@/components/ui/skeleton"

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
        ],
      },
      {
        id: "equipment",
        name: "Equipment",
        productCount: 38,
        subSubcategories: [
          { id: "athletic-eq", name: "Athletic Equipment", productCount: 14 },
          { id: "football-eq", name: "Football Equipment", productCount: 12 },
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
      {
        id: "instruments",
        name: "Music Instruments",
        productCount: 42,
        subSubcategories: [
          { id: "guitars", name: "Guitars", productCount: 12 },
          { id: "pianos", name: "Pianos", productCount: 8 },
        ],
      },
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
    vendorId: "v1",
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
    vendorId: "v1",
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
    vendorId: "v1",
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
    vendorId: "v1",
    tags: ["Piano", "Digital", "Portable", "Instrument", "Music"],
    dateAdded: "2025-02-20T10:30:00Z",
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
  const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(false)
  const [showOnlyRentable, setShowOnlyRentable] = useState(false)
  const [showOnlyBestSellers, setShowOnlyBestSellers] = useState(false)
  const [showOnlyNewArrivals, setShowOnlyNewArrivals] = useState(false)

  // New product alert state
  const [newProductAlert, setNewProductAlert] = useState<EntertainmentProduct | null>(null)

  // Skeleton loading states
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [displayProducts, setDisplayProducts] = useState<EntertainmentProduct[]>([])
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

  // Filter products based on search term, active categories, price range, and selected brands
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const searchTermMatch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      const categoryMatch = activeCategory ? product.category === activeCategory : true
      const subcategoryMatch = activeSubcategory ? product.subcategory === activeSubcategory : true
      const subSubcategoryMatch = activeSubSubcategory ? product.subSubcategory === activeSubSubcategory : true
      const priceMatch = product.currentPrice.amount >= priceRange[0] && product.currentPrice.amount <= priceRange[1]
      const brandMatch = selectedBrands.length > 0 ? selectedBrands.includes(product.brand) : true
      const discountedMatch = showOnlyDiscounted ? product.discount && product.discount > 0 : true
      const rentableMatch = showOnlyRentable ? product.isRentable : true
      const bestSellerMatch = showOnlyBestSellers ? product.isBestSeller : true
      const newArrivalsMatch = showOnlyNewArrivals ? isNewProduct(product.dateAdded) : true

      return (
        searchTermMatch &&
        categoryMatch &&
        subcategoryMatch &&
        subSubcategoryMatch &&
        priceMatch &&
        brandMatch &&
        discountedMatch &&
        rentableMatch &&
        bestSellerMatch &&
        newArrivalsMatch
      )
    })

    // Sort products based on selected sort order
    if (sortOrder === "price-asc") {
      filtered.sort((a, b) => a.currentPrice.amount - b.currentPrice.amount)
    } else if (sortOrder === "price-desc") {
      filtered.sort((a, b) => b.currentPrice.amount - a.currentPrice.amount)
    } else if (sortOrder === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortOrder === "discount") {
      filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0))
    }

    return filtered
  }, [
    products,
    searchTerm,
    activeCategory,
    activeSubcategory,
    activeSubSubcategory,
    priceRange,
    selectedBrands,
    sortOrder,
    showOnlyDiscounted,
    showOnlyRentable,
    showOnlyBestSellers,
    showOnlyNewArrivals,
  ])

  // Paginate products for display
  useEffect(() => {
    setIsLoading(true)

    // Simulate API call delay
    const timer = setTimeout(() => {
      const start = (currentPage - 1) * productsPerPage
      const end = start + productsPerPage
      setDisplayProducts(filteredProducts.slice(0, end))
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [filteredProducts, currentPage, productsPerPage])

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    setActiveSubcategory("")
    setActiveSubSubcategory("")
    setCurrentPage(1)
    router.push(`/?category=${category}`)
  }

  // Handle subcategory click
  const handleSubcategoryClick = (subcategory: string) => {
    setActiveSubcategory(subcategory)
    setActiveSubSubcategory("")
    setCurrentPage(1)
    router.push(`/?category=${activeCategory}&subcategory=${subcategory}`)
  }

  // Handle sub-subcategory click
  const handleSubSubcategoryClick = (subSubcategory: string) => {
    setActiveSubSubcategory(subSubcategory)
    setCurrentPage(1)
    router.push(`/?category=${activeCategory}&subcategory=${activeSubcategory}&subSubcategory=${subSubcategory}`)
  }

  // Handle brand selection
  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prevBrands) => {
      if (prevBrands.includes(brand)) {
        return prevBrands.filter((b) => b !== brand)
      } else {
        return [...prevBrands, brand]
      }
    })
    setCurrentPage(1)
  }

  // Handle product click
  const handleProductClick = (product: EntertainmentProduct) => {
    setSelectedProduct(product)
  }

  // Handle close product details
  const handleCloseProductDetails = () => {
    setSelectedProduct(null)
  }

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  // Handle price range change
  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]])
    setCurrentPage(1)
  }

  // Handle sort order change
  const handleSortOrderChange = (order: string) => {
    setSortOrder(order)
    setCurrentPage(1)
  }

  // Handle toggle discounted products
  const handleToggleDiscounted = () => {
    setShowOnlyDiscounted((prev) => !prev)
    setCurrentPage(1)
  }

  // Handle toggle rentable products
  const handleToggleRentable = () => {
    setShowOnlyRentable((prev) => !prev)
    setCurrentPage(1)
  }

  // Handle toggle best sellers products
  const handleToggleBestSellers = () => {
    setShowOnlyBestSellers((prev) => !prev)
    setCurrentPage(1)
  }

  // Handle toggle new arrivals products
  const handleToggleNewArrivals = () => {
    setShowOnlyNewArrivals((prev) => !prev)
    setCurrentPage(1)
  }

  // Handle page change
  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1)
  }

  // Function to get category icon
  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.id === category)
    return cat ? cat.icon : null
  }

  // Function to get subcategory name
  const getSubcategoryName = (subcategory: string) => {
    const category = categories.find((cat) => cat.id === activeCategory)
    if (!category) return ""

    const sub = category.subcategories.find((sub) => sub.id === subcategory)
    return sub ? sub.name : ""
  }

  // Function to get sub-subcategory name
  const getSubSubcategoryName = (subSubCategory: string) => {
    const category = categories.find((cat) => cat.id === activeCategory)
    if (!category) return ""

    const subcategory = category.subcategories.find((sub) => sub.id === activeSubcategory)
    if (!subcategory || !subcategory.subSubcategories) return ""

    const subSub = subcategory.subSubcategories.find((s) => s.id === subSubCategory)
    return subSub ? subSub.name : ""
  }

  // Function to get vendor details
  const getVendorDetails = (vendorId: string) => {
    return vendors.find((vendor) => vendor.id === vendorId)
  }

  // Function to get category name
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : ""
  }

  // Function to get product icon
  const getProductIcon = (product: EntertainmentProduct) => {
    if (product.category === "sports") {
      return <Football className="mr-2 h-4 w-4" />
    } else if (product.category === "entertainment") {
      return <Music className="mr-2 h-4 w-4" />
    } else if (product.category === "merchandise") {
      return <Tag className="mr-2 h-4 w-4" />
    }
    return null
  }

  // Function to get subcategory icon
  const getSubcategoryIcon = (subcategory: string) => {
    switch (subcategory) {
      case "attires":
        return <Shirt className="mr-2 h-4 w-4" />
      case "equipment":
        return <Headphones className="mr-2 h-4 w-4" />
      case "audio":
        return <Headphones className="mr-2 h-4 w-4" />
      case "mixers":
        return <Disc className="mr-2 h-4 w-4" />
      case "screens":
        return <Tv className="mr-2 h-4 w-4" />
      case "instruments":
        return <Guitar className="mr-2 h-4 w-4" />
      case "clothing":
        return <Shirt className="mr-2 h-4 w-4" />
      case "accessories":
        return <Ticket className="mr-2 h-4 w-4" />
      default:
        return null
    }
  }

  // Function to get sub-subcategory icon
  const getSubSubcategoryIcon = (subSubcategory: string) => {
    switch (subSubcategory) {
      case "athletic":
        return <Shirt className="mr-2 h-4 w-4" />
      case "football":
        return <Football className="mr-2 h-4 w-4" />
      case "athletic-eq":
        return <Headphones className="mr-2 h-4 w-4" />
      case "football-eq":
        return <Football className="mr-2 h-4 w-4" />
      case "guitars":
        return <Guitar className="mr-2 h-4 w-4" />
      case "pianos":
        return <Piano className="mr-2 h-4 w-4" />
      case "speakers":
        return <Speaker className="mr-2 h-4 w-4" />
      case "microphones":
        return <Microphone className="mr-2 h-4 w-4" />
      default:
        return null
    }
  }

  // Function to handle adding a new product alert
  const handleNewProductAlert = (product: EntertainmentProduct) => {
    setNewProductAlert(product)
    setTimeout(() => {
      setNewProductAlert(null)
    }, 5000) // Clear the alert after 5 seconds
  }

  // Show new product alert on initial load
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

  // Product Skeleton component
  const ProductSkeleton = () => (
    <div className="h-full">
      <Card className="h-full overflow-hidden border-indigo-100 hover:shadow-md transition-all duration-300">
        <div className="relative h-64 bg-indigo-50">
          <Skeleton className="h-full w-full" />
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4 mb-3" />

          <div className="flex items-center mb-3 bg-indigo-50 p-2 rounded-md">
            <Skeleton className="w-8 h-8 rounded-full mr-2" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

          <div className="flex items-center mb-3">
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="flex items-end justify-between mb-3">
            <Skeleton className="h-6 w-20" />
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700">
      {/* New Product Alert */}
      <AnimatePresence>
        {newProductAlert && (
          <motion.div
            key="newProductAlert"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 max-w-md bg-white rounded-lg shadow-xl border-l-4 border-indigo-500 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2">
                  <Bell className="h-6 w-6 text-indigo-500" />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <h3 className="text-lg font-medium text-gray-800">New Product Alert!</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Check out the new {newProductAlert.name} from {newProductAlert.brand}. Limited stock available!
                  </p>
                  <div className="mt-3 flex gap-3">
                    <Button
                      size="sm"
                      className="bg-indigo-500 hover:bg-indigo-600 text-white flex items-center gap-1"
                      onClick={() => {
                        handleProductClick(newProductAlert)
                        setNewProductAlert(null)
                      }}
                    >
                      View Product
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                      onClick={() => setNewProductAlert(null)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setNewProductAlert(null)}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-gray-100">
              <motion.div
                className="h-full bg-indigo-500"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 15, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-indigo-900 to-purple-900 py-12 border-b border-indigo-700/30">
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <Link
                href="/entertainment"
                className="flex items-center text-indigo-300 mb-4 hover:text-indigo-200 transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Entertainment</span>
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
                Entertainment Shop
              </h1>
              <p className="text-indigo-200 max-w-2xl">
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
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-indigo-900 to-purple-900 p-5 rounded-lg shadow-xl">
                  <div className="text-white text-center">
                    <Music className="h-8 w-8 mx-auto mb-2 text-purple-300" />
                    <p className="font-medium text-lg">Special Offers</p>
                    <p className="text-sm text-indigo-200">Up to 30% off</p>
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
            colorScheme="indigo"
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
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products, brands, or categories..."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  className="pl-12 pr-4 py-6 rounded-full border-transparent bg-indigo-950/50 backdrop-blur-md text-white placeholder:text-indigo-300 focus:border-indigo-400 focus:ring-indigo-400 w-full shadow-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-300" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:flex-none">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
              <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                <SelectTrigger className="relative w-full md:w-[180px] border-transparent bg-indigo-950/50 backdrop-blur-md text-white rounded-full shadow-lg">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-indigo-950 border-indigo-800 text-white">
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="discount">Biggest Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative group flex-1 md:flex-none">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="relative w-full flex items-center justify-center gap-2 border-transparent bg-indigo-950/50 backdrop-blur-md text-white rounded-full shadow-lg hover:bg-indigo-900/50"
              >
                <Filter className="h-4 w-4 text-indigo-300" />
                <span>Filters</span>
                <ChevronDown
                  className={`h-4 w-4 text-indigo-300 transition-transform ${showFilters ? "rotate-180" : ""}`}
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
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-30"></div>
                <div className="relative bg-indigo-950/50 backdrop-blur-md p-6 rounded-xl border border-indigo-800/50 shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Price range filter */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Tag className="h-5 w-5 mr-2 text-indigo-300" />
                        Price Range
                      </h3>
                      <div className="px-4">
                        <div className="flex justify-between text-sm text-indigo-200 mb-2">
                          <span>{formatPrice({ amount: priceRange[0], currency: "KSH" })}</span>
                          <span>{formatPrice({ amount: priceRange[1], currency: "KSH" })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Brand filter */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Music className="h-5 w-5 mr-2 text-indigo-300" />
                        Brands
                      </h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {allBrands.map((brand) => (
                          <div key={brand} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`brand-${brand}`}
                              checked={selectedBrands.includes(brand)}
                              onChange={() => handleBrandToggle(brand)}
                              className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-indigo-200">
                              {brand}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Product type filters */}
                    <div>
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                        <Filter className="h-5 w-5 mr-2 text-indigo-300" />
                        Product Type
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="discounted"
                            checked={showOnlyDiscounted}
                            onChange={handleToggleDiscounted}
                            className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="discounted" className="ml-2 text-sm text-indigo-200">
                            On Sale
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="rentable"
                            checked={showOnlyRentable}
                            onChange={handleToggleRentable}
                            className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="rentable" className="ml-2 text-sm text-indigo-200">
                            Available for Rent
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="bestsellers"
                            checked={showOnlyBestSellers}
                            onChange={handleToggleBestSellers}
                            className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="bestsellers" className="ml-2 text-sm text-indigo-200">
                            Best Sellers
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="newarrivals"
                            checked={showOnlyNewArrivals}
                            onChange={handleToggleNewArrivals}
                            className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="newarrivals" className="ml-2 text-sm text-indigo-200">
                            New Arrivals
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main content - Categories and Products */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Category tabs */}
        <div className="mb-8">
          <div className="flex overflow-x-auto space-x-2 pb-2 hide-scrollbar">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`flex items-center whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "border-indigo-300 text-indigo-100 hover:bg-indigo-700/20"
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.icon}
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Subcategories */}
        {activeSubcategories.length > 0 && (
          <div className="mb-6 overflow-x-auto hide-scrollbar">
            <div className="flex space-x-2 pb-2">
              <Button
                variant={activeSubcategory === "" ? "default" : "outline"}
                size="sm"
                className={`rounded-full whitespace-nowrap ${
                  activeSubcategory === ""
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "border-purple-300 text-purple-100 hover:bg-purple-700/20"
                }`}
                onClick={() => handleSubcategoryClick("")}
              >
                All {getCategoryName(activeCategory)}
              </Button>
              {activeSubcategories.map((subcategory) => (
                <Button
                  key={subcategory.id}
                  variant={activeSubcategory === subcategory.id ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full whitespace-nowrap ${
                    activeSubcategory === subcategory.id
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "border-purple-300 text-purple-100 hover:bg-purple-700/20"
                  }`}
                  onClick={() => handleSubcategoryClick(subcategory.id)}
                >
                  {getSubcategoryIcon(subcategory.id)}
                  <span>
                    {subcategory.name} ({subcategory.productCount})
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Sub-subcategories */}
        {activeSubcategory && activeSubSubcategories.length > 0 && (
          <div className="mb-6 overflow-x-auto hide-scrollbar">
            <div className="flex space-x-2 pb-2">
              <Button
                variant={activeSubSubcategory === "" ? "default" : "outline"}
                size="sm"
                className={`rounded-full whitespace-nowrap ${
                  activeSubSubcategory === ""
                    ? "bg-pink-600 hover:bg-pink-700 text-white"
                    : "border-pink-300 text-pink-100 hover:bg-pink-700/20"
                }`}
                onClick={() => handleSubSubcategoryClick("")}
              >
                All {getSubcategoryName(activeSubcategory)}
              </Button>
              {activeSubSubcategories.map((subSubcategory) => (
                <Button
                  key={subSubcategory.id}
                  variant={activeSubSubcategory === subSubcategory.id ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full whitespace-nowrap ${
                    activeSubSubcategory === subSubcategory.id
                      ? "bg-pink-600 hover:bg-pink-700 text-white"
                      : "border-pink-300 text-pink-100 hover:bg-pink-700/20"
                  }`}
                  onClick={() => handleSubSubcategoryClick(subSubcategory.id)}
                >
                  {getSubSubcategoryIcon(subSubcategory.id)}
                  <span>
                    {subSubcategory.name} ({subSubcategory.productCount})
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Products grid with skeleton loading */}
        <div className="mt-8">
          {/* Results count and active filters */}
          <div className="flex flex-wrap items-center justify-between mb-6">
            <p className="text-indigo-200 mb-4 md:mb-0">
              Showing {displayProducts.length} of {filteredProducts.length} products
            </p>
            <div className="flex flex-wrap gap-2">
              {activeCategory && (
                <div className="bg-indigo-800/50 text-indigo-200 px-3 py-1 rounded-full text-sm flex items-center">
                  {getCategoryIcon(activeCategory)}
                  <span className="ml-1">{getCategoryName(activeCategory)}</span>
                  <button className="ml-2 text-indigo-300 hover:text-white" onClick={() => handleCategoryClick("")}>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {activeSubcategory && (
                <div className="bg-purple-800/50 text-purple-200 px-3 py-1 rounded-full text-sm flex items-center">
                  {getSubcategoryIcon(activeSubcategory)}
                  <span className="ml-1">{getSubcategoryName(activeSubcategory)}</span>
                  <button className="ml-2 text-purple-300 hover:text-white" onClick={() => handleSubcategoryClick("")}>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {activeSubSubcategory && (
                <div className="bg-pink-800/50 text-pink-200 px-3 py-1 rounded-full text-sm flex items-center">
                  {getSubSubcategoryIcon(activeSubSubcategory)}
                  <span className="ml-1">{getSubSubcategoryName(activeSubSubcategory)}</span>
                  <button className="ml-2 text-pink-300 hover:text-white" onClick={() => handleSubSubcategoryClick("")}>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Products grid */}
          {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Display loaded products */}
                {displayProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <Card
                      className="h-full overflow-hidden border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="relative h-64 bg-indigo-50">
                        <img
                          src={product.imageUrl || "/placeholder.svg"}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {product.isNew && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                          )}
                          {product.isBestSeller && (
                            <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">Best Seller</span>
                          )}
                          {product.isRentable && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">For Rent</span>
                          )}
                        </div>

                        {/* Discount badge */}
                        {product.discount && product.discount > 0 && (
                          <div className="absolute top-2 right-2">
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {product.discount}% OFF
                            </span>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                            {product.subcategory.charAt(0).toUpperCase() +
                              product.subcategory.slice(1).replace(/-/g, " ")}
                          </span>
                          <span className="text-xs text-gray-500">{product.brand}</span>
                        </div>

                        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                        {/* Vendor info */}
                        {getVendorDetails(product.vendorId) && (
                          <div className="flex items-center mb-3 bg-indigo-50 p-2 rounded-md">
                            <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs mr-2">
                              {getVendorDetails(product.vendorId)?.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-800 truncate">
                                {getVendorDetails(product.vendorId)?.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {getVendorDetails(product.vendorId)?.location}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-lg font-bold text-gray-800">{formatPrice(product.currentPrice)}</div>
                            {product.originalPrice.amount !== product.currentPrice.amount && (
                              <div className="text-sm text-gray-500 line-through">
                                {formatPrice(product.originalPrice)}
                              </div>
                            )}
                          </div>
                          {product.isRentable && (
                            <div className="text-xs text-gray-500">
                              Rent: {formatPrice(product.rentalPrice!)} {product.rentalPeriod}
                            </div>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                        >
                          Details
                        </Button>
                        <Button
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                          disabled={product.stockStatus === "Out of Stock"}
                        >
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}

                {/* Skeleton loaders */}
                {isLoading && (
                  <>
                    {Array(4)
                      .fill(0)
                      .map((_, index) => (
                        <ProductSkeleton key={`skeleton-${index}`} />
                      ))}
                  </>
                )}
              </div>

              {/* Load more button */}
              {displayProducts.length < filteredProducts.length && (
                <div className="flex justify-center mt-10">
                  <Button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      "Load More Products"
                    )}
                  </Button>
                </div>
              )}

              {/* End of results message */}
              {displayProducts.length === filteredProducts.length && filteredProducts.length > 0 && (
                <div className="text-center py-8 border-t border-indigo-800/30 mt-8">
                  <p className="text-indigo-300">You've reached the end of the results</p>
                </div>
              )}
            </>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8)
                .fill(0)
                .map((_, index) => (
                  <ProductSkeleton key={`initial-skeleton-${index}`} />
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-20 h-20 mb-4 bg-indigo-900/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Search className="h-10 w-10 text-indigo-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No products found</h3>
              <p className="text-indigo-300 max-w-md mx-auto">
                We couldn't find any products matching your criteria. Try adjusting your filters or search term.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Product detail modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={handleCloseProductDetails}
                className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product image */}
                <div className="relative h-80 md:h-full bg-indigo-50">
                  <img
                    src={selectedProduct.imageUrl || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {selectedProduct.isNew && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                    )}
                    {selectedProduct.isBestSeller && (
                      <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">Best Seller</span>
                    )}
                    {selectedProduct.isRentable && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">For Rent</span>
                    )}
                  </div>

                  {/* Discount badge */}
                  {selectedProduct.discount && selectedProduct.discount > 0 && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {selectedProduct.discount}% OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Product details */}
                <div className="p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                      {selectedProduct.subcategory.charAt(0).toUpperCase() +
                        selectedProduct.subcategory.slice(1).replace(/-/g, " ")}
                      {selectedProduct.subSubcategory &&
                        ` / ${selectedProduct.subSubcategory.charAt(0).toUpperCase() + selectedProduct.subSubcategory.slice(1).replace(/-/g, " ")}`}
                    </span>
                    <span className="text-sm text-gray-500">{selectedProduct.brand}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h2>

                  {/* Vendor info */}
                  {getVendorDetails(selectedProduct.vendorId) && (
                    <div className="flex items-center mb-4 bg-indigo-50 p-3 rounded-md">
                      <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3">
                        {getVendorDetails(selectedProduct.vendorId)?.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{getVendorDetails(selectedProduct.vendorId)?.name}</p>
                        <p className="text-sm text-gray-500">{getVendorDetails(selectedProduct.vendorId)?.location}</p>
                      </div>
                    </div>
                  )}

                  <p className="text-gray-700 mb-4">{selectedProduct.description}</p>

                  {/* Features */}
                  {selectedProduct.features && selectedProduct.features.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Key Features</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedProduct.features.map((feature, index) => (
                          <li key={index} className="text-gray-700">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Specifications */}
                  {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Specifications</h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-1 border-b border-gray-200 last:border-0">
                            <span className="text-gray-600">{key}</span>
                            <span className="text-gray-800 font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price and buttons */}
                  <div className="mt-6">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-800">
                          {formatPrice(selectedProduct.currentPrice)}
                        </div>
                        {selectedProduct.originalPrice.amount !== selectedProduct.currentPrice.amount && (
                          <div className="text-base text-gray-500 line-through">
                            {formatPrice(selectedProduct.originalPrice)}
                          </div>
                        )}
                      </div>
                      {selectedProduct.isRentable && (
                        <div className="text-sm text-gray-600">
                          Rent: {formatPrice(selectedProduct.rentalPrice!)} {selectedProduct.rentalPeriod}
                        </div>
                      )}
                    </div>

                    {/* Stock status */}
                    <div className="mb-4">
                      <div className="flex items-center">
                        <span
                          className={`inline-block w-3 h-3 rounded-full mr-2 ${
                            selectedProduct.stockStatus === "In Stock"
                              ? "bg-green-500"
                              : selectedProduct.stockStatus === "Low Stock"
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                        ></span>
                        <span className="text-gray-700">{selectedProduct.stockStatus}</span>
                        {selectedProduct.stockCount && selectedProduct.stockStatus !== "Out of Stock" && (
                          <span className="ml-2 text-sm text-gray-500">
                            ({selectedProduct.stockCount} units available)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                        onClick={handleCloseProductDetails}
                      >
                        Close
                      </Button>
                      <Button
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                        disabled={selectedProduct.stockStatus === "Out of Stock"}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
