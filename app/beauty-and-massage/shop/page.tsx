"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Search,
  Star,
  Filter,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  X,
  Heart,
  Flame,
  Zap,
  ShoppingCart,
  Bell,
  ArrowUpRight,
  Scissors,
  Brush,
  Droplet,
  Sparkle,
  Palette,
  Leaf,
  ShoppingBag,
  Smile,
  Gem,
  SprayCanIcon as Spray,
  Store,
  Info,
  ExternalLink,
  Check,
  Layers,
  DollarSign,
  Tag,
  RefreshCw,
  SearchX,
  RotateCw,
  Lightbulb,
} from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CountdownTimer from "@/components/CountdownTimer"
import HotTimeDeals from "@/components/HotTimeDeals"
import NewProductsForYou from "@/components/NewProductsForYou"
import { useCookieTracking } from "@/hooks/useCookieTracking"
import { swapArrayElementsRandomly } from "@/utils/swap-utils"
import { isNewThisWeek } from "@/utils/date-utils"
import MostPreferredBadge from "@/components/most-preferred-badge"
//import TrendingPopularSection from "@/components/TrendingPopularSection"
import Link from "next/link"
import { TimeBasedRecommendations } from "@/components/TimeBasedRecommendations"
//import BeautyRecommendations from "@/components/recommendations/beauty-recommendations"
//import { trendingProducts, popularProducts } from "./beauty-trending-data"

// Types
interface Price {
  amount: number
  currency: string
}

interface BeautyProduct {
  id: number | string
  name: string
  imageUrl: string
  images?: string[]
  currentPrice: Price
  originalPrice: Price
  category: string
  subcategory: string
  brand: string
  description: string
  specifications?: Record<string, string | number | boolean>
  features?: string[]
  isNew?: boolean
  isPopular?: boolean
  dateAdded: string
  rating?: number
  reviewCount?: number
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock"
  stockCount?: number
  tags?: string[]
  hotDealEnds?: string
  discount?: number
  vendorId: number | string
  isHotDeal?: boolean
  isTrending?: boolean
  isAlmostSoldOut?: boolean
  warrantyPeriod?: string
  colors?: string[]
  gender: "Male" | "Female" | "Unisex"
  ingredients?: string[]
  skinType?: string[]
  hairType?: string[]
  suitableFor?: string[]
  volume?: string
  weight?: string
  expiryDate?: string
  organicCertified?: boolean
  crueltyfree?: boolean
  vegan?: boolean
}

interface Vendor {
  id: number | string
  name: string
  location: string
  logo: string
  description: string
  products: BeautyProduct[]
  redirectUrl: string
  mapLink: string
  defaultCurrency: string
  rating?: number
  reviewCount?: number
  verified?: boolean
  establishedYear?: number
  contactNumber?: string
  email?: string
  website?: string
  deliveryInfo?: string
  returnPolicy?: string
  warrantyInfo?: string
}

interface Category {
  id: string
  name: string
  icon: React.ReactNode
  brands?: string[]
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

// Define categories
const categories: Category[] = [
  {
    id: "skincare",
    name: "Skincare",
    icon: <Droplet className="mr-2" />,
    brands: [
      "Nivea",
      "Neutrogena",
      "Cetaphil",
      "The Ordinary",
      "CeraVe",
      "La Roche-Posay",
      "Bioderma",
      "Clinique",
      "Sukin",
      "Garnier",
    ],
  },
  {
    id: "makeup",
    name: "Makeup",
    icon: <Brush className="mr-2" />,
    brands: [
      "Maybelline",
      "L'Oreal",
      "MAC",
      "Fenty Beauty",
      "NYX",
      "Revlon",
      "Estée Lauder",
      "Huda Beauty",
      "Rimmel",
      "Covergirl",
    ],
  },
  {
    id: "haircare",
    name: "Haircare",
    icon: <Scissors className="mr-2" />,
    brands: [
      "Pantene",
      "Head & Shoulders",
      "TRESemmé",
      "Dove",
      "Garnier",
      "L'Oreal",
      "Schwarzkopf",
      "Shea Moisture",
      "OGX",
      "Cantu",
    ],
  },
  {
    id: "fragrances",
    name: "Fragrances",
    icon: <Spray className="mr-2" />,
    brands: [
      "Chanel",
      "Dior",
      "Versace",
      "Calvin Klein",
      "Hugo Boss",
      "Gucci",
      "Yves Saint Laurent",
      "Tom Ford",
      "Burberry",
      "Dolce & Gabbana",
    ],
  },
  {
    id: "bodycare",
    name: "Body Care",
    icon: <Sparkle className="mr-2" />,
    brands: [
      "Dove",
      "Nivea",
      "Vaseline",
      "Jergens",
      "Aveeno",
      "Olay",
      "Palmers",
      "The Body Shop",
      "Neutrogena",
      "Cetaphil",
    ],
  },
  {
    id: "nailcare",
    name: "Nail Care",
    icon: <Gem className="mr-2" />,
    brands: [
      "OPI",
      "Essie",
      "Sally Hansen",
      "Maybelline",
      "Revlon",
      "China Glaze",
      "Orly",
      "Zoya",
      "Deborah Lippmann",
      "Nails Inc",
    ],
  },
  {
    id: "mengrooming",
    name: "Men's Grooming",
    icon: <Smile className="mr-2" />,
    brands: [
      "Gillette",
      "Nivea Men",
      "Old Spice",
      "Axe",
      "L'Oreal Men",
      "Dove Men",
      "Bulldog",
      "Jack Black",
      "Harry's",
      "Kiehl's",
    ],
  },
  {
    id: "organic",
    name: "Organic & Natural",
    icon: <Leaf className="mr-2" />,
    brands: [
      "Sukin",
      "The Body Shop",
      "Burt's Bees",
      "Weleda",
      "Dr. Bronner's",
      "Lush",
      "Avalon Organics",
      "Yes To",
      "Shea Moisture",
      "Pacifica",
    ],
  },
  {
    id: "tools",
    name: "Beauty Tools",
    icon: <Scissors className="mr-2" />,
    brands: [
      "Real Techniques",
      "Eco Tools",
      "Beauty Blender",
      "Revlon",
      "Conair",
      "Tweezerman",
      "Foreo",
      "Dyson",
      "ghd",
      "BaByliss",
    ],
  },
  {
    id: "sets",
    name: "Gift Sets",
    icon: <Palette className="mr-2" />,
    brands: [
      "The Body Shop",
      "Lush",
      "Bath & Body Works",
      "Victoria's Secret",
      "Clinique",
      "Estée Lauder",
      "Lancôme",
      "Sephora",
      "Fenty Beauty",
      "MAC",
    ],
  },
]

// Beauty tips data
const beautyTips = [
  {
    id: 1,
    title: "Hydration is Key",
    content:
      "Drink at least 8 glasses of water daily to keep your skin hydrated from within. This helps maintain elasticity and gives your skin a natural glow.",
    icon: <Droplet className="h-6 w-6" />,
    category: "Skincare",
  },
  {
    id: 2,
    title: "Sunscreen Always",
    content:
      "Apply SPF 30+ sunscreen daily, even on cloudy days. UV rays can penetrate clouds and cause premature aging and skin damage.",
    icon: <Sparkle className="h-6 w-6" />,
    category: "Skincare",
  },
  {
    id: 3,
    title: "Double Cleansing",
    content:
      "For a thorough cleanse, especially if you wear makeup, use an oil-based cleanser first to remove makeup and sunscreen, followed by a water-based cleanser.",
    icon: <Droplet className="h-6 w-6" />,
    category: "Skincare",
  },
  {
    id: 4,
    title: "Patch Test New Products",
    content:
      "Always test new skincare products on a small area first to check for allergic reactions, especially if you have sensitive skin.",
    icon: <Sparkle className="h-6 w-6" />,
    category: "Skincare",
  },
  {
    id: 5,
    title: "Primer Before Foundation",
    content:
      "Use a primer before applying foundation to create a smooth base and help your makeup last longer throughout the day.",
    icon: <Brush className="h-6 w-6" />,
    category: "Makeup",
  },
  {
    id: 6,
    title: "Curl Lashes Before Mascara",
    content:
      "Always curl your lashes before applying mascara, not after, to prevent lash breakage and achieve a more dramatic eye look.",
    icon: <Brush className="h-6 w-6" />,
    category: "Makeup",
  },
  {
    id: 7,
    title: "Weekly Hair Mask",
    content:
      "Apply a deep conditioning hair mask once a week to nourish and repair damaged hair, especially if you use heat styling tools regularly.",
    icon: <Scissors className="h-6 w-6" />,
    category: "Haircare",
  },
  {
    id: 8,
    title: "Cold Water Rinse",
    content:
      "Finish your hair wash with a cold water rinse to seal the hair cuticles, reduce frizz, and add shine to your locks.",
    icon: <Scissors className="h-6 w-6" />,
    category: "Haircare",
  },
  {
    id: 9,
    title: "Fragrance Application Points",
    content:
      "Apply perfume to pulse points like wrists, neck, and behind ears where the skin is warmer and helps diffuse the scent better.",
    icon: <Spray className="h-6 w-6" />,
    category: "Fragrances",
  },
  {
    id: 10,
    title: "Exfoliate Regularly",
    content:
      "Gently exfoliate your skin 1-2 times a week to remove dead skin cells and allow better absorption of skincare products.",
    icon: <Sparkle className="h-6 w-6" />,
    category: "Bodycare",
  },
]

// Mock data for vendors and products
const mockVendors: Vendor[] = [
  // Skincare Vendor
  {
    id: 1,
    name: "Glow & Radiance",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Premier destination for luxury skincare products with personalized consultations and exclusive formulations.",
    redirectUrl: "https://glowandradiance.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 356,
    verified: true,
    establishedYear: 2015,
    contactNumber: "+254 712 345 678",
    email: "info@glowandradiance.co.ke",
    website: "https://glowandradiance.co.ke",
    deliveryInfo: "Free delivery within Nairobi. 2-3 days nationwide delivery.",
    returnPolicy: "14-day return policy for unopened items. 7-day return for defective products.",
    warrantyInfo: "All products guaranteed authentic with batch codes verification.",
    products: [
      {
        id: 101,
        name: "Vitamin C Brightening Serum",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 4500, currency: "KSH" },
        originalPrice: { amount: 5800, currency: "KSH" },
        category: "Skincare",
        subcategory: "Serums",
        brand: "The Ordinary",
        description:
          "Powerful vitamin C serum that brightens skin tone, reduces hyperpigmentation, and boosts collagen production for a radiant complexion.",
        specifications: {
          volume: "30ml",
          skinType: "All skin types",
          mainIngredients: "15% Vitamin C (Ascorbic Acid), Hyaluronic Acid, Vitamin E",
          pHLevel: "3.5",
          texture: "Lightweight",
          fragrance: "Fragrance-free",
          packaging: "Dark glass bottle with dropper",
        },
        features: [
          "15% Vitamin C concentration",
          "Reduces dark spots and hyperpigmentation",
          "Boosts collagen production",
          "Antioxidant protection",
          "Oil-free formula",
          "Dermatologist tested",
        ],
        isPopular: true,
        dateAdded: "2025-03-10T10:30:00Z",
        rating: 4.9,
        reviewCount: 128,
        stockStatus: "In Stock",
        stockCount: 25,
        tags: ["Brightening", "Anti-aging", "Hyperpigmentation", "Antioxidant"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 1,
        warrantyPeriod: "24 months",
        colors: [],
        gender: "Unisex",
        ingredients: ["Ascorbic Acid", "Hyaluronic Acid", "Vitamin E", "Glycerin", "Propanediol"],
        skinType: ["Normal", "Dry", "Combination", "Oily"],
        suitableFor: ["Hyperpigmentation", "Dullness", "Fine lines", "Uneven texture"],
        volume: "30ml",
        expiryDate: "2027-03-10",
        organicCertified: false,
        crueltyfree: true,
        vegan: true,
        discount: 22,
      },
      {
        id: 102,
        name: "Hyaluronic Acid Hydrating Moisturizer",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 3800, currency: "KSH" },
        originalPrice: { amount: 4200, currency: "KSH" },
        category: "Skincare",
        subcategory: "Moisturizers",
        brand: "CeraVe",
        description:
          "Deeply hydrating moisturizer with hyaluronic acid and ceramides that locks in moisture for 24 hours and strengthens the skin barrier.",
        specifications: {
          volume: "50ml",
          skinType: "All skin types, especially dry",
          mainIngredients: "Hyaluronic Acid, Ceramides, Niacinamide",
          texture: "Rich cream",
          fragrance: "Fragrance-free",
          packaging: "Jar with airless pump",
        },
        features: [
          "24-hour hydration",
          "Strengthens skin barrier",
          "Non-comedogenic",
          "Fragrance-free",
          "Suitable for sensitive skin",
          "Dermatologist developed",
        ],
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.8,
        reviewCount: 76,
        stockStatus: "Low Stock",
        stockCount: 8,
        tags: ["Hydrating", "Dry Skin", "Sensitive Skin", "Barrier Repair"],
        vendorId: 1,
        isTrending: true,
        warrantyPeriod: "24 months",
        colors: [],
        gender: "Unisex",
        ingredients: ["Hyaluronic Acid", "Ceramides", "Niacinamide", "Glycerin", "Shea Butter"],
        skinType: ["Dry", "Normal", "Sensitive", "Dehydrated"],
        suitableFor: ["Dryness", "Dehydration", "Sensitive skin", "Compromised barrier"],
        volume: "50ml",
        expiryDate: "2027-03-18",
        organicCertified: false,
        crueltyfree: true,
        vegan: true,
        discount: 10,
      },
      {
        id: 103,
        name: "Gentle Exfoliating Facial Scrub",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 2800, currency: "KSH" },
        originalPrice: { amount: 3500, currency: "KSH" },
        category: "Skincare",
        subcategory: "Exfoliators",
        brand: "Neutrogena",
        description:
          "Gentle facial scrub with biodegradable jojoba beads that removes dead skin cells and unclogs pores without irritating the skin.",
        specifications: {
          volume: "100ml",
          skinType: "All skin types",
          mainIngredients: "Jojoba Beads, Salicylic Acid, Aloe Vera",
          texture: "Creamy scrub",
          fragrance: "Light citrus",
          packaging: "Tube",
        },
        features: [
          "Biodegradable jojoba beads",
          "Unclogs pores",
          "Removes dead skin cells",
          "Improves skin texture",
          "Gentle enough for twice weekly use",
          "Dermatologist tested",
        ],
        isPopular: false,
        dateAdded: "2025-02-15T10:30:00Z",
        rating: 4.7,
        reviewCount: 92,
        stockStatus: "In Stock",
        stockCount: 15,
        tags: ["Exfoliation", "Pore-cleansing", "Gentle", "Texture improvement"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        vendorId: 1,
        warrantyPeriod: "24 months",
        colors: [],
        gender: "Unisex",
        ingredients: ["Jojoba Beads", "Salicylic Acid", "Aloe Vera", "Glycerin", "Chamomile Extract"],
        skinType: ["Normal", "Combination", "Oily", "Acne-prone"],
        suitableFor: ["Dullness", "Uneven texture", "Clogged pores", "Blackheads"],
        volume: "100ml",
        expiryDate: "2027-02-15",
        organicCertified: false,
        crueltyfree: true,
        vegan: true,
        discount: 20,
      },
    ],
  },
  // Makeup Vendor
  {
    id: 2,
    name: "Glamour Palette",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Specialized in premium makeup brands with professional makeup artists offering consultations and tutorials.",
    redirectUrl: "https://glamourpalette.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 245,
    verified: true,
    establishedYear: 2012,
    contactNumber: "+254 723 456 789",
    email: "info@glamourpalette.co.ke",
    website: "https://glamourpalette.co.ke",
    deliveryInfo: "Free delivery within Mombasa. Nationwide delivery available.",
    returnPolicy: "7-day return policy for unopened items. No returns for used cosmetics.",
    warrantyInfo: "All products guaranteed authentic with batch codes verification.",
    products: [
      {
        id: 201,
        name: "Long-Lasting Matte Foundation",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 4200, currency: "KSH" },
        originalPrice: { amount: 5000, currency: "KSH" },
        category: "Makeup",
        subcategory: "Foundation",
        brand: "Fenty Beauty",
        description:
          "Lightweight, long-wearing foundation with buildable medium to full coverage and a natural matte finish that stays put for up to 24 hours.",
        specifications: {
          volume: "30ml",
          skinType: "All skin types, especially oily",
          shades: "50 inclusive shades",
          finish: "Natural matte",
          coverage: "Medium to full, buildable",
          packaging: "Frosted glass bottle with pump",
        },
        features: [
          "24-hour wear",
          "Sweat and humidity resistant",
          "Oil-controlling formula",
          "Non-comedogenic",
          "Transfer-resistant",
          "Inclusive shade range",
        ],
        isPopular: true,
        dateAdded: "2025-02-20T10:30:00Z",
        rating: 4.8,
        reviewCount: 98,
        stockStatus: "In Stock",
        stockCount: 12,
        tags: ["Long-wearing", "Matte finish", "Full coverage", "Oil-control"],
        isAlmostSoldOut: false,
        vendorId: 2,
        warrantyPeriod: "24 months",
        colors: ["Various shades"],
        gender: "Unisex",
        ingredients: ["Water", "Dimethicone", "Talc", "Perlite", "Silica"],
        skinType: ["Normal", "Combination", "Oily"],
        suitableFor: ["Full coverage", "Long-wearing", "Oil control"],
        volume: "30ml",
        expiryDate: "2027-02-20",
        organicCertified: false,
        crueltyfree: true,
        vegan: true,
        discount: 16,
      },
      {
        id: 202,
        name: "24-Hour Waterproof Liquid Eyeliner",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 2500, currency: "KSH" },
        originalPrice: { amount: 3200, currency: "KSH" },
        category: "Makeup",
        subcategory: "Eye Makeup",
        brand: "Maybelline",
        description:
          "Ultra-precise felt tip liquid eyeliner that delivers intense color payoff with a smudge-proof, waterproof formula that lasts all day.",
        specifications: {
          volume: "1.1ml",
          finish: "Satin",
          applicator: "Ultra-fine felt tip",
          waterproof: true,
          packaging: "Pen-style with secure cap",
        },
        features: [
          "24-hour wear",
          "Waterproof formula",
          "Smudge-proof",
          "Ultra-fine precision tip",
          "Intense color payoff",
          "Quick-drying",
        ],
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.9,
        reviewCount: 65,
        stockStatus: "Low Stock",
        stockCount: 5,
        tags: ["Waterproof", "Long-lasting", "Precise application", "Intense black"],
        hotDealEnds: "2025-04-10T23:59:59Z",
        isHotDeal: true,
        vendorId: 2,
        warrantyPeriod: "24 months",
        colors: ["Intense Black", "Brown", "Navy"],
        gender: "Unisex",
        ingredients: ["Water", "Acrylates Copolymer", "Carbon Black", "Butylene Glycol"],
        skinType: ["All"],
        suitableFor: ["Precise lines", "Waterproof wear", "All-day makeup"],
        volume: "1.1ml",
        expiryDate: "2027-03-15",
        organicCertified: false,
        crueltyfree: false,
        vegan: false,
        discount: 22,
      },
    ],
  },
  // Haircare Vendor
  {
    id: 3,
    name: "Tresses & Locks",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Your trusted source for premium haircare products with expert advice and personalized hair consultations.",
    redirectUrl: "https://tressesandlocks.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.9,
    reviewCount: 412,
    verified: true,
    establishedYear: 2008,
    contactNumber: "+254 734 567 890",
    email: "info@tressesandlocks.co.ke",
    website: "https://tressesandlocks.co.ke",
    deliveryInfo: "Free delivery within Nairobi CBD. Same-day delivery available for orders before 12 PM.",
    returnPolicy: "14-day return policy with original packaging. 30-day warranty for all products.",
    warrantyInfo: "All products guaranteed authentic with batch codes verification.",
    products: [
      {
        id: 301,
        name: "Intensive Repair Hair Mask",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 3800, currency: "KSH" },
        originalPrice: { amount: 4500, currency: "KSH" },
        category: "Haircare",
        subcategory: "Treatments",
        brand: "Shea Moisture",
        description:
          "Deep conditioning hair mask that repairs damaged hair, restores moisture, and strengthens hair fibers for healthier, shinier locks.",
        specifications: {
          volume: "250ml",
          hairType: "Dry, damaged, color-treated",
          mainIngredients: "Shea Butter, Argan Oil, Keratin, Biotin",
          texture: "Rich cream",
          fragrance: "Coconut and vanilla",
          packaging: "Jar",
        },
        features: [
          "Intensive repair for damaged hair",
          "Restores moisture and shine",
          "Strengthens hair fibers",
          "Reduces breakage and split ends",
          "Heat protection",
          "Color-safe formula",
        ],
        isPopular: true,
        dateAdded: "2025-03-05T10:30:00Z",
        rating: 4.9,
        reviewCount: 156,
        stockStatus: "In Stock",
        stockCount: 10,
        tags: ["Repair", "Hydration", "Strengthening", "Anti-breakage"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 3,
        isTrending: true,
        warrantyPeriod: "24 months",
        colors: [],
        gender: "Unisex",
        ingredients: ["Shea Butter", "Argan Oil", "Keratin", "Biotin", "Coconut Oil"],
        hairType: ["Dry", "Damaged", "Color-treated", "Chemically processed"],
        suitableFor: ["Damage repair", "Moisture restoration", "Strengthening", "Split end prevention"],
        volume: "250ml",
        expiryDate: "2027-03-05",
        organicCertified: true,
        crueltyfree: true,
        vegan: true,
        discount: 16,
      },
      {
        id: 302,
        name: "Volumizing Dry Shampoo",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 2200, currency: "KSH" },
        originalPrice: { amount: 2800, currency: "KSH" },
        category: "Haircare",
        subcategory: "Shampoo",
        brand: "Batiste",
        description:
          "Instant refresh dry shampoo that absorbs excess oil, adds volume, and extends the life of your blowout without water or residue.",
        specifications: {
          volume: "200ml",
          hairType: "All hair types",
          mainIngredients: "Rice Starch, Panthenol",
          texture: "Fine mist",
          fragrance: "Fresh and clean",
          packaging: "Aerosol spray can",
        },
        features: [
          "Absorbs excess oil",
          "Adds instant volume",
          "No water needed",
          "No white residue",
          "Refreshes hair between washes",
          "Travel-friendly",
        ],
        isNew: true,
        dateAdded: "2025-03-12T10:30:00Z",
        rating: 4.8,
        reviewCount: 87,
        stockStatus: "Low Stock",
        stockCount: 3,
        tags: ["Dry shampoo", "Oil control", "Volume", "Quick refresh"],
        vendorId: 3,
        warrantyPeriod: "24 months",
        colors: [],
        gender: "Unisex",
        ingredients: ["Rice Starch", "Panthenol", "Castor Oil", "Fragrance"],
        hairType: ["All hair types", "Oily", "Fine", "Flat"],
        suitableFor: ["Oil absorption", "Volume boost", "Second-day hair", "Quick styling"],
        volume: "200ml",
        expiryDate: "2027-03-12",
        organicCertified: false,
        crueltyfree: true,
        vegan: true,
        discount: 21,
      },
    ],
  },
  // Fragrances Vendor
  {
    id: 4,
    name: "Scent Symphony",
    location: "Kisumu, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Specialized in luxury fragrances and perfumes with personalized scent profiling and exclusive collections.",
    redirectUrl: "https://scentsymphony.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 328,
    verified: true,
    establishedYear: 2010,
    contactNumber: "+254 745 678 901",
    email: "info@scentsymphony.co.ke",
    website: "https://scentsymphony.co.ke",
    deliveryInfo: "Free delivery within Kisumu. Nationwide delivery available.",
    returnPolicy: "7-day return policy for unopened items. No returns for opened fragrances.",
    warrantyInfo: "All products guaranteed authentic with batch codes verification.",
    products: [
      {
        id: 401,
        name: "Midnight Orchid Eau de Parfum",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 8500, currency: "KSH" },
        originalPrice: { amount: 10000, currency: "KSH" },
        category: "Fragrances",
        subcategory: "Women's Perfume",
        brand: "Chanel",
        description:
          "Luxurious floral oriental fragrance with notes of black orchid, vanilla, and amber that creates a captivating and long-lasting scent.",
        specifications: {
          volume: "50ml",
          concentration: "Eau de Parfum",
          scentFamily: "Floral Oriental",
          topNotes: "Bergamot, Black Currant, Ylang-Ylang",
          heartNotes: "Black Orchid, Jasmine, Rose",
          baseNotes: "Vanilla, Amber, Patchouli, Sandalwood",
          packaging: "Glass bottle with gold accents",
        },
        features: [
          "Long-lasting fragrance",
          "Elegant glass bottle",
          "Sophisticated scent profile",
          "Evening and special occasion wear",
          "Signature scent potential",
          "Gift-worthy presentation",
        ],
        isPopular: true,
        dateAdded: "2025-02-25T10:30:00Z",
        rating: 4.8,
        reviewCount: 142,
        stockStatus: "In Stock",
        stockCount: 8,
        tags: ["Luxury", "Floral", "Oriental", "Evening", "Long-lasting"],
        vendorId: 4,
        warrantyPeriod: "36 months",
        colors: [],
        gender: "Female",
        ingredients: ["Alcohol", "Fragrance", "Water", "Limonene", "Linalool"],
        skinType: ["All"],
        suitableFor: ["Evening wear", "Special occasions", "Signature scent"],
        volume: "50ml",
        expiryDate: "2028-02-25",
        organicCertified: false,
        crueltyfree: false,
        vegan: false,
        discount: 15,
      },
      {
        id: 402,
        name: "Aqua Vitae Cologne for Men",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 7200, currency: "KSH" },
        originalPrice: { amount: 8500, currency: "KSH" },
        category: "Fragrances",
        subcategory: "Men's Cologne",
        brand: "Hugo Boss",
        description:
          "Fresh and invigorating cologne with citrus and woody notes that embodies confidence and modern masculinity for everyday wear.",
        specifications: {
          volume: "100ml",
          concentration: "Eau de Toilette",
          scentFamily: "Aromatic Fougère",
          topNotes: "Bergamot, Lemon, Grapefruit",
          heartNotes: "Lavender, Mint, Marine Accord",
          baseNotes: "Cedar, Vetiver, Ambergris",
          packaging: "Sleek glass bottle with magnetic cap",
        },
        features: [
          "Refreshing everyday scent",
          "Modern masculine profile",
          "Medium longevity",
          "Versatile for office and casual wear",
          "Signature bottle design",
          "Travel-friendly packaging",
        ],
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.7,
        reviewCount: 68,
        stockStatus: "Low Stock",
        stockCount: 3,
        tags: ["Fresh", "Woody", "Everyday", "Office", "Signature"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        isAlmostSoldOut: true,
        vendorId: 4,
        warrantyPeriod: "36 months",
        colors: [],
        gender: "Male",
        ingredients: ["Alcohol", "Fragrance", "Water", "Limonene", "Linalool"],
        skinType: ["All"],
        suitableFor: ["Everyday wear", "Office", "Casual occasions"],
        volume: "100ml",
        expiryDate: "2028-03-18",
        organicCertified: false,
        crueltyfree: false,
        vegan: false,
        discount: 15,
      },
    ],
  },
  // Body Care Vendor
  {
    id: 5,
    name: "Natural Essence",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Specialized in organic and natural body care products with sustainable practices and eco-friendly packaging.",
    redirectUrl: "https://naturalessence.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.6,
    reviewCount: 276,
    verified: true,
    establishedYear: 2013,
    contactNumber: "+254 756 789 012",
    email: "info@naturalessence.co.ke",
    website: "https://naturalessence.co.ke",
    deliveryInfo: "Free delivery within Nairobi. Nationwide delivery available.",
    returnPolicy: "14-day return policy for unopened items. No returns for used products.",
    warrantyInfo: "All products guaranteed authentic with batch codes verification.",
    products: [
      {
        id: 501,
        name: "Shea & Cocoa Butter Body Lotion",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 1800, currency: "KSH" },
        originalPrice: { amount: 2200, currency: "KSH" },
        category: "Bodycare",
        subcategory: "Moisturizers",
        brand: "Shea Moisture",
        description:
          "Rich and nourishing body lotion with organic shea and cocoa butter that deeply moisturizes dry skin and improves elasticity.",
        specifications: {
          volume: "400ml",
          skinType: "Dry, very dry, mature",
          mainIngredients: "Organic Shea Butter, Cocoa Butter, Vitamin E",
          texture: "Rich cream",
          fragrance: "Natural cocoa and vanilla",
          packaging: "Recyclable pump bottle",
        },
        features: [
          "24-hour hydration",
          "Improves skin elasticity",
          "Reduces appearance of stretch marks",
          "Non-greasy formula",
          "Made with fair trade ingredients",
          "No parabens, sulfates or phthalates",
        ],
        isPopular: true,
        dateAdded: "2025-03-08T10:30:00Z",
        rating: 4.8,
        reviewCount: 112,
        stockStatus: "In Stock",
        stockCount: 20,
        tags: ["Organic", "Moisturizing", "Dry skin", "Natural"],
        hotDealEnds: "2025-04-08T23:59:59Z",
        isHotDeal: true,
        vendorId: 5,
        warrantyPeriod: "24 months",
        colors: [],
        gender: "Unisex",
        ingredients: ["Shea Butter", "Cocoa Butter", "Vitamin E", "Aloe Vera", "Coconut Oil"],
        skinType: ["Dry", "Very dry", "Mature", "Normal"],
        suitableFor: ["Intense hydration", "Elasticity improvement", "Stretch mark reduction"],
        volume: "400ml",
        expiryDate: "2027-03-08",
        organicCertified: true,
        crueltyfree: true,
        vegan: true,
        discount: 18,
      },
      {
        id: 502,
        name: "Lavender & Chamomile Bath Bombs Set",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 2500, currency: "KSH" },
        originalPrice: { amount: 3000, currency: "KSH" },
        category: "Bodycare",
        subcategory: "Bath & Shower",
        brand: "Lush",
        description:
          "Set of 6 handcrafted bath bombs with essential oils of lavender and chamomile that create a relaxing and skin-softening bath experience.",
        specifications: {
          quantity: "6 bath bombs",
          weight: "Each 120g",
          mainIngredients: "Sodium Bicarbonate, Citric Acid, Lavender Oil, Chamomile Oil",
          colors: "Natural plant-based colorants",
          fragrance: "Lavender and chamomile essential oils",
          packaging: "Recyclable gift box",
        },
        features: [
          "Relaxing aromatherapy experience",
          "Softens and moisturizes skin",
          "Handmade with natural ingredients",
          "No synthetic fragrances",
          "Cruelty-free and vegan",
          "Gift-worthy presentation",
        ],
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.6,
        reviewCount: 78,
        stockStatus: "In Stock",
        stockCount: 12,
        tags: ["Bath", "Relaxation", "Aromatherapy", "Gift set"],
        vendorId: 5,
        warrantyPeriod: "12 months",
        colors: ["Purple", "Blue", "White"],
        gender: "Unisex",
        ingredients: ["Sodium Bicarbonate", "Citric Acid", "Lavender Oil", "Chamomile Oil", "Epsom Salt"],
        skinType: ["All"],
        suitableFor: ["Relaxation", "Stress relief", "Skin softening", "Self-care"],
        weight: "720g total",
        expiryDate: "2026-03-15",
        organicCertified: true,
        crueltyfree: true,
        vegan: true,
        discount: 17,
      },
    ],
  },
  // Men's Grooming Vendor
  {
    id: 6,
    name: "Gentleman's Grooming",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Premier destination for men's grooming products with expert advice and personalized grooming consultations.",
    redirectUrl: "https://gentlemansgrooming.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 289,
    verified: true,
    establishedYear: 2015,
    contactNumber: "+254 767 890 123",
    email: "info@gentlemansgrooming.co.ke",
    website: "https://gentlemansgrooming.co.ke",
    deliveryInfo: "Free delivery within Nairobi. Nationwide delivery in 2-3 business days.",
    returnPolicy: "14-day return policy for unopened items. 7-day return for defective products.",
    warrantyInfo: "All products guaranteed authentic with batch codes verification.",
    products: [
      {
        id: 601,
        name: "Premium Beard Oil",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 2800, currency: "KSH" },
        originalPrice: { amount: 3500, currency: "KSH" },
        category: "Men's Grooming",
        subcategory: "Beard Care",
        brand: "Bulldog",
        description:
          "Nourishing beard oil with natural oils that conditions facial hair, prevents itchiness, and promotes healthy beard growth.",
        specifications: {
          volume: "30ml",
          beardType: "All beard types",
          mainIngredients: "Argan Oil, Jojoba Oil, Vitamin E",
          texture: "Lightweight oil",
          fragrance: "Cedarwood and bergamot",
          packaging: "Glass bottle with dropper",
        },
        features: [
          "Conditions and softens beard",
          "Prevents beard itch and dandruff",
          "Promotes healthy growth",
          "Adds natural shine",
          "Non-greasy formula",
          "Made with natural oils",
        ],
        isPopular: true,
        dateAdded: "2025-02-28T10:30:00Z",
        rating: 4.9,
        reviewCount: 215,
        stockStatus: "In Stock",
        stockCount: 18,
        tags: ["Beard care", "Conditioning", "Natural", "Men's grooming"],
        vendorId: 6,
        warrantyPeriod: "24 months",
        colors: [],
        gender: "Male",
        ingredients: ["Argan Oil", "Jojoba Oil", "Vitamin E", "Grapeseed Oil", "Essential Oils"],
        skinType: ["All"],
        suitableFor: ["Beard conditioning", "Itch prevention", "Growth support"],
        volume: "30ml",
        expiryDate: "2027-02-28",
        organicCertified: false,
        crueltyfree: true,
        vegan: true,
        discount: 20,
      },
      {
        id: 602,
        name: "5-Blade Precision Razor Set",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 4500, currency: "KSH" },
        originalPrice: { amount: 5200, currency: "KSH" },
        category: "Men's Grooming",
        subcategory: "Shaving",
        brand: "Gillette",
        description:
          "Premium 5-blade razor set with precision trimmer, ergonomic handle, and lubricating strip for a close, comfortable shave.",
        specifications: {
          contents: "1 razor handle, 4 cartridges, stand",
          blades: "5 anti-friction blades",
          handle: "Ergonomic metal handle with rubber grip",
          features: "Precision trimmer, lubricating strip with aloe",
          packaging: "Gift box",
        },
        features: [
          "5-blade technology for close shave",
          "Precision trimmer for detailed areas",
          "Lubricating strip with aloe",
          "Ergonomic metal handle",
          "FlexBall technology adapts to contours",
          "Premium gift presentation",
        ],
        isNew: true,
        dateAdded: "2025-03-20T10:30:00Z",
        rating: 4.8,
        reviewCount: 42,
        stockStatus: "Low Stock",
        stockCount: 4,
        tags: ["Shaving", "Razor", "Premium", "Gift set"],
        hotDealEnds: "2025-04-20T23:59:59Z",
        isHotDeal: true,
        vendorId: 6,
        warrantyPeriod: "Lifetime for handle",
        colors: ["Chrome", "Black"],
        gender: "Male",
        ingredients: [],
        skinType: ["All"],
        suitableFor: ["Close shaving", "Precision trimming", "Sensitive skin"],
        weight: "150g",
        expiryDate: "",
        organicCertified: false,
        crueltyfree: false,
        vegan: false,
        discount: 13,
      },
    ],
  },
]

// Helper function to transform data for hot deals
const transformForHotDeals = (vendors: Vendor[]) => {
  return vendors.flatMap((vendor) =>
    vendor.products
      .filter((product) => product.isHotDeal)
      .map((product) => ({
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        currentPrice: product.currentPrice,
        originalPrice: product.originalPrice,
        category: product.category,
        expiresAt: product.hotDealEnds || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: product.description,
        discount: product.discount,
      })),
  )
}

// Helper function to transform data for new products
const transformForNewProducts = (vendors: Vendor[]) => {
  return vendors.flatMap((vendor) =>
    vendor.products
      .filter((product) => product.isNew || isNewThisWeek(product.dateAdded))
      .map((product) => ({
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        currentPrice: product.currentPrice,
        originalPrice: product.originalPrice,
        category: product.category,
        dateAdded: product.dateAdded,
        isNew: true,
        description: product.description,
      })),
  )
}

export default function BeautyShopProducts() {
  useCookieTracking("beauty")

  // State for vendors and products
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors)
  const [newProductAlert, setNewProductAlert] = useState<BeautyProduct | null>(null)
  const [swapTrigger, setSwapTrigger] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // State for active category and filters
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedGender, setSelectedGender] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [sortOrder, setSortOrder] = useState("default")
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [activeBeautyTipCategory, setActiveBeautyTipCategory] = useState("All")

 
  // State for product detail modal
  const [selectedProduct, setSelectedProduct] = useState<BeautyProduct | null>(null)
  const [productRotation, setProductRotation] = useState(0)
  const rotationInterval = useRef<NodeJS.Timeout | null>(null)

  // States for infinite scroll
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [visibleProducts, setVisibleProducts] = useState<BeautyProduct[]>([])
  const loaderRef = useRef<HTMLDivElement>(null)

  const productsPerPage = 6

  // Get hot deals
  const hotDeals = useMemo(() => {
    return transformForHotDeals(vendors)
  }, [vendors, swapTrigger])

  // Get new products
  const newProducts = useMemo(() => {
    return transformForNewProducts(vendors)
  }, [vendors, swapTrigger])

  // Get all products
  const allProducts = useMemo(() => {
    return vendors.flatMap((vendor) => vendor.products)
  }, [vendors])

  // Get filtered products
  const filteredProducts = useMemo(() => {
    let results = allProducts

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.brand.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term) ||
          product.subcategory.toLowerCase().includes(term),
      )
    }

    // Filter by category
    if (activeCategory) {
      results = results.filter((product) => product.category.toLowerCase() === activeCategory.toLowerCase())
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      results = results.filter((product) => selectedBrands.includes(product.brand))
    }

    // Filter by gender
    if (selectedGender.length > 0) {
      results = results.filter((product) => selectedGender.includes(product.gender))
    }

    // Filter by price range
    results = results.filter(
      (product) => product.currentPrice.amount >= priceRange[0] && product.currentPrice.amount <= priceRange[1],
    )

    // Sort results
    if (sortOrder === "price-asc") {
      results.sort((a, b) => a.currentPrice.amount - b.currentPrice.amount)
    } else if (sortOrder === "price-desc") {
      results.sort((a, b) => b.currentPrice.amount - a.currentPrice.amount)
    } else if (sortOrder === "rating") {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortOrder === "newest") {
      results.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    } else if (sortOrder === "discount") {
      results.sort((a, b) => (b.discount || 0) - (a.discount || 0))
    }

    return results
  }, [allProducts, searchTerm, activeCategory, selectedBrands, selectedGender, priceRange, sortOrder])

  // Get filtered beauty tips
  const filteredBeautyTips = useMemo(() => {
    if (activeBeautyTipCategory === "All") {
      return beautyTips
    }
    return beautyTips.filter((tip) => tip.category === activeBeautyTipCategory)
  }, [activeBeautyTipCategory])

  // Launch confetti effect on page load
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ec4899", "#8b5cf6", "#d946ef"], // Pink and purple colors
    })
  }, [])

  // Set up new product alert
  useEffect(() => {
    // Find the newest product
    const newProducts = allProducts.filter((product) => product.isNew)
    if (newProducts.length > 0) {
      // Sort by date to get the newest one
      const newestProduct = newProducts.sort(
        (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
      )[0]

      // Set as new product alert
      setNewProductAlert(newestProduct)

      // Auto-dismiss after 15 seconds
      const timer = setTimeout(() => {
        setNewProductAlert(null)
      }, 15000)

      return () => clearTimeout(timer)
    }
  }, [allProducts])

  // Load more products when scrolling
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
  }, [loaderRef, hasMore, isLoading, filteredProducts])

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1)
    setVisibleProducts([])
    loadMoreProducts(true)
  }, [filteredProducts])

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

  // Handle product rotation in detail view
  useEffect(() => {
    if (selectedProduct) {
      // Start rotation animation
      rotationInterval.current = setInterval(() => {
        setProductRotation((prev) => (prev + 1) % 360)
      }, 50)
    } else {
      // Reset rotation when modal is closed
      setProductRotation(0)
      if (rotationInterval.current) {
        clearInterval(rotationInterval.current)
        rotationInterval.current = null
      }
    }

    return () => {
      if (rotationInterval.current) {
        clearInterval(rotationInterval.current)
        rotationInterval.current = null
      }
    }
  }, [selectedProduct])

  const loadMoreProducts = (reset = false) => {
    setIsLoading(true)

    // Simulate API call with setTimeout
    setTimeout(() => {
      const currentPage = reset ? 1 : page
      const startIndex = (currentPage - 1) * productsPerPage
      const endIndex = startIndex + productsPerPage
      const newProducts = filteredProducts.slice(startIndex, endIndex)

      setVisibleProducts((prev) => (reset ? newProducts : [...prev, ...newProducts]))
      setPage((prev) => (reset ? 2 : prev + 1))
      setHasMore(endIndex < filteredProducts.length)
      setIsLoading(false)
    }, 800)
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    // Reset brand selection when category changes
    setSelectedBrands([])
  }

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const handleGenderToggle = (gender: string) => {
    setSelectedGender((prev) => (prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]))
  }

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value as [number, number])
  }

  const handleProductClick = (product: BeautyProduct) => {
    setSelectedProduct(product)
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
  }

  const toggleAccordion = (value: string) => {
    setExpandedAccordions((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const closeNewProductAlert = () => {
    setNewProductAlert(null)
  }

  // Get available brands for the current category
  const getAvailableBrands = () => {
    if (!activeCategory) return []

    const category = categories.find((cat) => cat.id === activeCategory.toLowerCase())
    return category?.brands || []
  }

  // Get vendor for a product
  const getVendorForProduct = (productId: number | string) => {
    return vendors.find((vendor) => vendor.products.some((product) => product.id === productId))}
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-pink-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-5"></div>
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-rose-500/10 rounded-full blur-3xl"></div>
      {/* Welcome animation */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-pink-500/20 to-purple-500/20 -z-10"></div>
          <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-l from-pink-500/20 to-purple-500/20 -z-10"></div>
        </motion.div>
      </AnimatePresence>

      {/* Page header */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-block mb-4">
              <Badge className="bg-pink-600/80 hover:bg-pink-600 text-white px-3 py-1 text-sm font-medium rounded-full backdrop-blur-sm">
                Premium Beauty Products
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-300 via-purple-200 to-rose-300 text-transparent bg-clip-text">
              Discover Your Beauty Essentials
            </h1>
            <p className="text-lg md:text-xl text-pink-100 max-w-3xl mx-auto mb-8">
              Explore the latest beauty innovations and exclusive deals from top brands worldwide
            </p>

            {/* Search bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-200"></div>
                <div className="relative flex items-center">
                  <Input
                    type="text"
                    placeholder="Search for products, brands, or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-6 rounded-full border-transparent bg-slate-800/90 backdrop-blur-sm text-white placeholder:text-slate-400 focus:ring-pink-500 focus:border-transparent w-full shadow-lg"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400">
                    <Search className="h-5 w-5" />
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-pink-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="container mx-auto px-4 mb-8 max-w-7xl">
        <CountdownTimer targetDate="2025-05-31T23:59:59" startDate="2025-03-01T00:00:00" />
      </div>

      {/* Hot Time Deals Section */}
      {hotDeals.length > 0 && (
        <div className="container mx-auto px-4 max-w-7xl">
          <HotTimeDeals
            deals={hotDeals}
            colorScheme="amber"
            title="Limited Time Beauty Deals"
            subtitle="Grab these exclusive offers before they're gone!"
          />
        </div>
      )}

      {/* Time-Based Recommendations */}
      <div className="container mx-auto px-4 mb-8">
        <TimeBasedRecommendations
          products={beautyProducts.map((product) => {
            const vendor = getVendorForProduct(product.vendorId)
            return {
              id: product.id,
              name: product.name,
              imageUrl: product.imageUrl,
              description: product.description,
              currentPrice: product.currentPrice,
              originalPrice: product.originalPrice,
              category: product.subcategory,
              vendorName: vendor?.name,
              vendorLocation: vendor?.location,
              recommendedTimes:
                product.subcategory?.toLowerCase().includes("cleanser") && !product.name.toLowerCase().includes("night")
                  ? ["morning"]
                  : product.name.toLowerCase().includes("night") ||
                      product.subcategory?.toLowerCase().includes("repair")
                    ? ["night"]
                    : product.subcategory?.toLowerCase().includes("spf") || product.name.toLowerCase().includes("day")
                      ? ["morning"]
                      : undefined,
            }
          })}
          title="Skincare Recommendations For Now"
          subtitle="Products ideal for your current skincare routine"
          colorScheme="violet"
          maxProducts={4}
        />
      </div>

      {/* New Products For You Section */}
      <div className="container mx-auto px-4 max-w-7xl">
        <NewProductsForYou allProducts={newProducts} colorScheme="pink" maxProducts={4} />
      </div>

      {/* Beauty Tips Section */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 text-transparent bg-clip-text mb-3">
            Beauty Tips & Advice
          </h2>
          <p className="text-pink-100 max-w-2xl mx-auto">
            Expert beauty tips to enhance your routine and get the most out of your products
          </p>
        </div>

        <div className="mb-6">
          <Tabs defaultValue="All" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-slate-800/50 p-1 rounded-xl">
              <TabsTrigger 
                value="All" 
                onClick={() => setActiveBeautyTipCategory("All")}
                className="data-[state=active]:bg-pink-600 data-[state=active]:text-white"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="Skincare" 
                onClick={() => setActiveBeautyTipCategory("Skincare")}
                className="data-[state=active]:bg-pink-600 data-[state=active]:text-white"
              >
                Skincare
              </TabsTrigger>
              <TabsTrigger 
                value="Makeup" 
                onClick={() => setActiveBeautyTipCategory("Makeup")}
                className="data-[state=active]:bg-pink-600 data-[state=active]:text-white"
              >
                Makeup
              </TabsTrigger>
              <TabsTrigger 
                value="Haircare" 
                onClick={() => setActiveBeautyTipCategory("Haircare")}
                className="data-[state=active]:bg-pink-600 data-[state=active]:text-white"
              >
                Haircare
              </TabsTrigger>
              <TabsTrigger 
                value="Fragrances" 
                onClick={() => setActiveBeautyTipCategory("Fragrances")}
                className="data-[state=active]:bg-pink-600 data-[state=active]:text-white"
              >
                Fragrances
              </TabsTrigger>
              <TabsTrigger 
                value="Bodycare" 
                onClick={() => setActiveBeautyTipCategory("Bodycare")}
                className="data-[state=active]:bg-pink-600 data-[state=active]:text-white"
              >
                Body Care
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBeautyTips.map((tip) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20 shadow-xl hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start mb-4">
                <div className="bg-pink-600/20 p-3 rounded-lg mr-4">
                  {tip.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-pink-100 mb-1">{tip.title}</h3>
                  <Badge className="bg-pink-600/80 text-white">{tip.category}</Badge>
                </div>
              </div>
              <p className="text-pink-200/80 leading-relaxed">{tip.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
 {/* Shop navigation buttons */}
      <div className="flex justify-center my-8">
        <Link href="/beauty-and-massage/shop/beauty-shop">
          <Button
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
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
              <ShoppingBag className="mr-2 h-5 w-5" />
              Explore Our Beauty Shop
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

      {/* Shop navigation buttons */}
      <div className="flex justify-center my-8">
        <Link href="/beauty-and-massage/shop/best-beauty-usage">
          <Button
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
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
              <Brush className="mr-2 h-5 w-5" />
              Explore Our Beauty Best Usage
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

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl" id="beauty-products">
        {/* Filter and category section */}
        <div className="container mx-auto px-4 py-8 max-w-7xl" id="beauty-products">
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-700/50 mb-10">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left side - Categories */}
              <div className="lg:w-1/4">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Layers className="mr-2 h-5 w-5 text-pink-400" />
                  Categories
                </h2>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange("")}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 transition-all ${
                      activeCategory === ""
                        ? "bg-pink-600 text-white font-medium shadow-md"
                        : "text-slate-300 hover:bg-slate-700/70"
                    }`}
                  >
                    <Zap className="h-4 w-4" />
                    <span>All Categories</span>
                    {activeCategory === "" && <Check className="h-4 w-4 ml-auto" />}
                  </button>

                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 transition-all ${
                        activeCategory === category.id
                          ? "bg-pink-600 text-white font-medium shadow-md"
                          : "text-slate-300 hover:bg-slate-700/70"
                      }`}
                    >
                      {category.icon}
                      <span>{category.name}</span>
                      {activeCategory === category.id && <Check className="h-4 w-4 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right side - Filters */}
              <div className="lg:w-3/4 space-y-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <Filter className="mr-2 h-5 w-5 text-pink-400" />
                    Refine Results
                  </h2>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[200px] bg-slate-700/70 border-slate-600 text-slate-200 focus:ring-pink-500">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="discount">Biggest Discount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="bg-slate-700/40 rounded-xl p-5 border border-slate-700/60">
                  <h3 className="text-lg font-medium text-white mb-6 flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-pink-400" />
                    Price Range
                  </h3>
                  <div className="px-4">
                    <Slider
                      defaultValue={[0, 10000]}
                      max={10000}
                      step={500}
                      value={priceRange}
                      onValueChange={handlePriceRangeChange}
                      className="mb-6"
                    />
                    <div className="flex justify-between text-sm text-slate-300">
                      <div className="bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700">
                        {formatPrice({ amount: priceRange[0], currency: "KSH" })}
                      </div>
                      <div className="bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700">
                        {formatPrice({ amount: priceRange[1], currency: "KSH" })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gender filter */}
                <div className="bg-slate-700/40 rounded-xl p-5 border border-slate-700/60">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Smile className="mr-2 h-5 w-5 text-pink-400" />
                    Gender
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                        selectedGender.includes("Female")
                          ? "bg-pink-600/20 border border-pink-500/50"
                          : "border border-slate-700 hover:border-pink-500/30 hover:bg-slate-700/50"
                      }`}
                      onClick={() => handleGenderToggle("Female")}
                    >
                      <Checkbox
                        id="gender-female"
                        checked={selectedGender.includes("Female")}
                        onCheckedChange={() => handleGenderToggle("Female")}
                        className="border-slate-500 data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                      />
                      <Label
                        htmlFor="gender-female"
                        className="text-sm font-medium leading-none cursor-pointer text-slate-200"
                      >
                        Female
                      </Label>
                    </div>
                    <div
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                        selectedGender.includes("Male")
                          ? "bg-pink-600/20 border border-pink-500/50"
                          : "border border-slate-700 hover:border-pink-500/30 hover:bg-slate-700/50"
                      }`}
                      onClick={() => handleGenderToggle("Male")}
                    >
                      <Checkbox
                        id="gender-male"
                        checked={selectedGender.includes("Male")}
                        onCheckedChange={() => handleGenderToggle("Male")}
                        className="border-slate-500 data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                      />
                      <Label
                        htmlFor="gender-male"
                        className="text-sm font-medium leading-none cursor-pointer text-slate-200"
                      >
                        Male
                      </Label>
                    </div>
                    <div
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                        selectedGender.includes("Unisex")
                          ? "bg-pink-600/20 border border-pink-500/50"
                          : "border border-slate-700 hover:border-pink-500/30 hover:bg-slate-700/50"
                      }`}
                      onClick={() => handleGenderToggle("Unisex")}
                    >
                      <Checkbox
                        id="gender-unisex"
                        checked={selectedGender.includes("Unisex")}
                        onCheckedChange={() => handleGenderToggle("Unisex")}
                        className="border-slate-500 data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                      />
                      <Label
                        htmlFor="gender-unisex"
                        className="text-sm font-medium leading-none cursor-pointer text-slate-200"
                      >
                        Unisex
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Brand filter */}
                {activeCategory && getAvailableBrands().length > 0 && (
                  <div className="bg-slate-700/40 rounded-xl p-5 border border-slate-700/60">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <Store className="mr-2 h-5 w-5 text-pink-400" />
                      Brands
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {getAvailableBrands().map((brand) => (
                        <div
                          key={brand}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                            selectedBrands.includes(brand)
                              ? "bg-pink-600/20 border border-pink-500/50"
                              : "border border-slate-700 hover:border-pink-500/30 hover:bg-slate-700/50"
                          }`}
                          onClick={() => handleBrandToggle(brand)}
                        >
                          <Checkbox
                            id={`brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => handleBrandToggle(brand)}
                            className="border-slate-500 data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                          />
                          <Label
                            htmlFor={`brand-${brand}`}
                            className="text-sm font-medium leading-none cursor-pointer text-slate-200"
                          >
                            {brand}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active filters */}
                {(selectedBrands.length > 0 || selectedGender.length > 0 || activeCategory || priceRange[0] > 0 || priceRange[1] < 10000) && (
                  <div className="bg-slate-700/40 rounded-xl p-5 border border-slate-700/60">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-white flex items-center">
                        <Tag className="mr-2 h-5 w-5 text-pink-400" />
                        Active Filters
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setActiveCategory("")
                          setSelectedBrands([])
                          setSelectedGender([])
                          setPriceRange([0, 10000])
                        }}
                        className="text-slate-300 hover:text-white hover:bg-slate-700"
                      >
                        Clear All
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeCategory && (
                        <Badge
                          className="bg-pink-600/80 text-white px-3 py-1.5 flex items-center gap-1"
                          onClick={() => setActiveCategory("")}
                        >
                          Category: {categories.find((c) => c.id === activeCategory)?.name || activeCategory}
                          <X className="h-3 w-3 ml-1 cursor-pointer" />
                        </Badge>
                      )}

                      {selectedGender.map((gender) => (
                        <Badge
                          key={gender}
                          className="bg-pink-600/80 text-white px-3 py-1.5 flex items-center gap-1"
                          onClick={() => handleGenderToggle(gender)}
                        >
                          Gender: {gender}
                          <X className="h-3 w-3 ml-1 cursor-pointer" />
                        </Badge>
                      ))}

                      {selectedBrands.map((brand) => (
                        <Badge
                          key={brand}
                          className="bg-pink-600/80 text-white px-3 py-1.5 flex items-center gap-1"
                          onClick={() => handleBrandToggle(brand)}
                        >
                          {brand}
                          <X className="h-3 w-3 ml-1 cursor-pointer" />
                        </Badge>
                      ))}

                      {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                        <Badge className="bg-pink-600/80 text-white px-3 py-1.5">
                          Price: {formatPrice({ amount: priceRange[0], currency: "KSH" })} -{" "}
                          {formatPrice({ amount: priceRange[1], currency: "KSH" })}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProducts.length > 0 ? (
              visibleProducts.map((product) => {
                const vendor = getVendorForProduct(product.id)
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="h-full"
                  >
                    <Card className="h-full overflow-hidden border-slate-700/50 bg-slate-800/40 backdrop-blur-sm hover:border-pink-500/70 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 group">
                      <div className="cursor-pointer" onClick={() => handleProductClick(product)}>
                        {/* Product image */}
                        <div className="relative h-52 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 group-hover:opacity-70 transition-opacity duration-300"></div>
                          <Image
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 hover:scale-105"
                          />

                          {/* Badges */}
                          <div className="absolute top-2 left-2 flex flex-col gap-2">
                            {product.isNew && (
                              <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-md">
                                New
                              </Badge>
                            )}
                            {product.isTrending && (
                              <Badge className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1">
                                <Flame className="h-3 w-3" />
                                <span>Trending</span>
                              </Badge>
                            )}
                            {product.isPopular && <MostPreferredBadge colorScheme="pink" size="sm" />}
                            {product.gender && (
                              <Badge className={`${
                                product.gender === "Female" 
                                  ? "bg-pink-500" 
                                  : product.gender === "Male" 
                                    ? "bg-blue-500" 
                                    : "bg-purple-500"
                              } text-white`}>
                                {product.gender}
                              </Badge>
                            )}
                          </div>

                          {/* Discount badge */}
                          {product.discount && product.discount > 0 && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-red-500 hover:bg-red-600 text-white">
                                {product.discount}% OFF
                              </Badge>
                            </div>
                          )}

                          {/* Stock status */}
                          {product.stockStatus === "Low Stock" && (
                            <div className="absolute bottom-2 left-2">
                              <Badge className="bg-amber-500 text-white flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Low Stock</span>
                              </Badge>
                            </div>
                          )}
                          {product.stockStatus === "Out of Stock" && (
                            <div className="absolute bottom-2 left-2">
                              <Badge className="bg-red-500 text-white">Out of Stock</Badge>
                            </div>
                          )}
                        </div>

                        {/* Product details */}
                        <CardContent className="p-5">
                          <div className="mb-2 flex items-center justify-between">
                            <Badge variant="outline" className="text-xs border-pink-500 text-pink-300">
                              {product.subcategory}
                            </Badge>
                            <span className="text-xs text-pink-300">{product.brand}</span>
                          </div>

                          <h3 className="font-semibold text-pink-100 mb-1 line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-pink-300 mb-3 line-clamp-2">{product.description}</p>

                          {/* Vendor info */}
                          {vendor && (
                            <div className="flex items-center mb-3 bg-slate-700/40 p-3 rounded-lg border border-slate-700/60">
                              <div className="w-8 h-8 rounded-full bg-pink-700 flex items-center justify-center text-white font-bold text-xs mr-2">
                                {vendor.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-pink-200 truncate">{vendor.name}
                                {vendor.verified && (
                    <Badge className="ml-1 bg-pink-500 text-white flex items-center gap-0.5 px-1 py-0 text-xs">
                           <Check className="h-2 w-2" />
                             </Badge>
                                 )}</p>
                                <p className="text-xs text-pink-400 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span className="truncate">{vendor.location}</span>
                                </p>
                              </div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6 text-pink-300 hover:text-pink-100 hover:bg-pink-800/50"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        window.open(vendor.redirectUrl, "_blank")
                                      }}
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Visit vendor website</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
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
                                        : "text-pink-700"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="ml-1 text-xs text-pink-300">({product.reviewCount})</span>
                            </div>
                          )}

                          {/* Special features */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {product.organicCertified && (
                              <Badge variant="outline" className="text-xs border-green-500 text-green-300">
                                Organic
                              </Badge>
                            )}
                            {product.crueltyfree && (
                              <Badge variant="outline" className="text-xs border-purple-500 text-purple-300">
                                Cruelty-Free
                              </Badge>
                            )}
                            {product.vegan && (
                              <Badge variant="outline" className="text-xs border-green-500 text-green-300">
                                Vegan
                              </Badge>
                            )}
                          </div>

                          {/* Price */}
                          <div className="flex items-end justify-between mb-3">
                            <div>
                              <div className="text-lg font-bold text-pink-100">
                                {formatPrice(product.currentPrice)}
                              </div>
                              {product.originalPrice.amount !== product.currentPrice.amount && (
                                <div className="text-sm text-pink-400 line-through">
                                  {formatPrice(product.originalPrice)}
                                </div>
                              )}
                            </div>

                            {product.volume && (
                              <div className="text-xs text-pink-300">{product.volume}</div>
                            )}
                          </div>
                        </CardContent>
                      </div>

                      {/* Action buttons */}
                      <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-pink-500 flex items-center justify-center gap-1 transition-all"
                          onClick={() => handleProductClick(product)}
                        >
                          <Info className="h-4 w-4" />
                          <span>Details</span>
                        </Button>

                        <Button
                          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white flex items-center justify-center gap-1 shadow-md transition-all"
                          disabled={product.stockStatus === "Out of Stock"}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )
              })
            ) : (
              <div className="col-span-full py-16 text-center">
                <div className="mx-auto w-24 h-24 mb-6 bg-slate-800/80 rounded-full flex items-center justify-center border border-slate-700/60 shadow-inner">
                  <SearchX className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-3">No products found</h3>
                <p className="text-slate-300 max-w-md mx-auto">
                  We couldn't find any beauty products matching your criteria. Try adjusting your filters or search term.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-pink-500"
                  onClick={() => {
                    setActiveCategory("")
                    setSelectedBrands([])
                    setSelectedGender([])
                    setPriceRange([0, 10000])
                    setSearchTerm("")
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center mt-8">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-pink-300/20 border-t-pink-500 rounded-full animate-spin mb-2"></div>
                <p className="text-pink-300 text-sm">Loading more products...</p>
              </div>
            </div>
          )}

          {/* Loader reference element */}
          <div ref={loaderRef} className="h-20"></div>
        </div>

        {/* Product detail modal */}
        <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && closeProductModal()}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 text-slate-100 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 pointer-events-none"></div>
            {selectedProduct && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product image with spinning animation */}
                <div className="relative h-64 md:h-full rounded-lg overflow-hidden bg-pink-900/50">
                  <motion.div
                    animate={{ rotate: productRotation }}
                    transition={{ duration: 0.1 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <Image
                      src={selectedProduct.imageUrl || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      width={300}
                      height={300}
                      className="object-contain"
                    />
                  </motion.div>
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-slate-800/70 border-slate-600 text-white hover:bg-slate-700 hover:text-white rounded-full h-8 w-8 p-0"
                      onClick={() => {
                        if (rotationInterval.current) {
                          clearInterval(rotationInterval.current)
                          rotationInterval.current = null
                        } else {
                          rotationInterval.current = setInterval(() => {
                            setProductRotation((prev) => (prev + 1) % 360)
                          }, 50)
                        }
                      }}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-white/70 bg-slate-800/70 px-2 py-1 rounded-md">
                      {rotationInterval.current ? "Spinning" : "Click to spin"}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {selectedProduct.isNew && <Badge className="bg-pink-500 text-white">New</Badge>}
                    {selectedProduct.isTrending && (
                      <Badge className="bg-orange-500 text-white flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        <span>Trending</span>
                      </Badge>
                    )}
                    {selectedProduct.gender && (
                      <Badge className={`${
                        selectedProduct.gender === "Female" 
                          ? "bg-pink-500" 
                          : selectedProduct.gender === "Male" 
                            ? "bg-blue-500" 
                            : "bg-purple-500"
                      } text-white`}>
                        {selectedProduct.gender}
                      </Badge>
                    )}
                  </div>

                  {/* Discount badge */}
                  {selectedProduct.discount && selectedProduct.discount > 0 && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-red-500 text-white">{selectedProduct.discount}% OFF</Badge>
                    </div>
                  )}
                </div>

                {/* Product details */}
                <div className="flex flex-col">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs border-pink-500 text-pink-300">
                        {selectedProduct.category} / {selectedProduct.subcategory}
                      </Badge>
                      <span className="text-sm text-pink-300">{selectedProduct.brand}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-pink-100 mb-2">{selectedProduct.name}</h2>

                    {/* Vendor info */}
                    {getVendorForProduct(selectedProduct.id) && (
                      <div className="flex items-center mb-4 bg-pink-900/30 p-3 rounded-md">
                        <div className="w-10 h-10 rounded-full bg-pink-700 flex items-center justify-center text-white font-bold text-xs mr-3">
                          {getVendorForProduct(selectedProduct.id)?.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-pink-200">
                            {getVendorForProduct(selectedProduct.id)?.name}
                          </p>
                          <p className="text-sm text-pink-400 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{getVendorForProduct(selectedProduct.id)?.location}</span>
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-pink-700 text-pink-300 hover:bg-pink-800"
                          onClick={() =>
                            window.open(getVendorForProduct(selectedProduct.id)?.redirectUrl, "_blank")
                          }
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
                                  : "text-pink-700"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-pink-300">
                          {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviewCount} reviews)
                        </span>
                      </div>
                    )}

                    <p className="text-pink-200 mb-4">{selectedProduct.description}</p>

                    {/* Special features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedProduct.organicCertified && (
                        <Badge className="bg-green-600 text-white">Organic Certified</Badge>
                      )}
                      {selectedProduct.crueltyfree && (
                        <Badge className="bg-purple-600 text-white">Cruelty-Free</Badge>
                      )}
                      {selectedProduct.vegan && (
                        <Badge className="bg-green-600 text-white">Vegan</Badge>
                      )}
                    </div>

                    {/* Specifications */}
                    {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-pink-200 mb-2">Specifications</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-pink-900/30 p-3 rounded-md">
                          {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-sm text-pink-300 capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}:
                              </span>
                              <span className="text-sm text-pink-100 font-medium">{value.toString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ingredients */}
                    {selectedProduct.ingredients && selectedProduct.ingredients.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-pink-200 mb-2">Key Ingredients</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.ingredients.map((ingredient, index) => (
                            <Badge key={index} variant="outline" className="border-pink-500 text-pink-200">
                              {ingredient}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suitable for */}
                    {selectedProduct.suitableFor && selectedProduct.suitableFor.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-pink-200 mb-2">Suitable For</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedProduct.suitableFor.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span className="text-pink-200">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Features */}
                    {selectedProduct.features && selectedProduct.features.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-pink-200 mb-2">Key Features</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedProduct.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span className="text-pink-200">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Beauty tip */}
                    <div className="mb-4 bg-gradient-to-r from-pink-900/40 to-purple-900/40 p-4 rounded-lg border border-pink-500/20">
                      <div className="flex items-center mb-2">
                        <Lightbulb className="h-5 w-5 text-yellow-400 mr-2" />
                        <h3 className="text-lg font-medium text-pink-200">Beauty Tip</h3>
                      </div>
                      <p className="text-pink-200 text-sm italic">
                        {selectedProduct.category === "Skincare" 
                          ? "Apply skincare products in order of thinnest to thickest consistency for maximum absorption."
                          : selectedProduct.category === "Makeup"
                          ? "For longer-lasting makeup, apply setting spray in an 'X' and 'T' formation across your face."
                          : selectedProduct.category === "Haircare"
                          ? "Apply hair products to damp, not wet hair, for better absorption and distribution."
                          : selectedProduct.category === "Fragrances"
                          ? "Apply fragrance to pulse points where the skin is warmer to help diffuse the scent better."
                          : "Store beauty products away from direct sunlight and heat to preserve their efficacy and extend shelf life."
                        }
                      </p>
                    </div>

                    {/* Stock status */}
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-pink-200 mb-2">Availability</h3>
                      <div className="flex items-center">
                        <Badge
                          className={`${
                            selectedProduct.stockStatus === "In Stock"
                              ? "bg-green-500 text-white"
                              : selectedProduct.stockStatus === "Low Stock"
                                ? "bg-amber-500 text-white"
                                : "bg-red-500 text-white"
                          }`}
                        >
                          {selectedProduct.stockStatus}
                        </Badge>
                        {selectedProduct.stockCount && selectedProduct.stockStatus !== "Out of Stock" && (
                          <span className="ml-2 text-sm text-pink-300">
                            {selectedProduct.stockCount} units available
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and buttons */}
                    <div className="mt-auto">
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <div className="text-2xl font-bold text-pink-100">
                            {formatPrice(selectedProduct.currentPrice)}
                          </div>
                          {selectedProduct.originalPrice.amount !== selectedProduct.currentPrice.amount && (
                            <div className="text-base text-pink-400 line-through">
                              {formatPrice(selectedProduct.originalPrice)}
                            </div>
                          )}
                        </div>

                        <div>
                          {selectedProduct.volume && (
                            <div className="text-sm text-pink-300">Volume: {selectedProduct.volume}</div>
                          )}
                          {selectedProduct.expiryDate && (
                            <div className="text-sm text-pink-300">Expires: {new Date(selectedProduct.expiryDate).toLocaleDateString()}</div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          variant="outline"
                          className="border-pink-500 text-pink-200 hover:bg-pink-800/50 flex-1 flex items-center justify-center gap-2"
                        >
                          <Heart className="h-4 w-4" />
                          <span>Add to Wishlist</span>
                        </Button>

                        <Button
                          className="bg-pink-600 hover:bg-pink-700 text-white flex-1 flex items-center justify-center gap-2"
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

        {/* New Product Alert Box */}
        <AnimatePresence>
          {newProductAlert && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-6 right-6 z-50 max-w-md bg-pink-950 rounded-lg shadow-xl border-l-4 border-pink-500 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-pink-900 rounded-full p-2">
                    <Bell className="h-6 w-6 text-pink-300" />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <h3 className="text-lg font-medium text-pink-100">New Product Alert!</h3>
                    <p className="mt-1 text-sm text-pink-300">
                      Check out the new {newProductAlert.name} from {newProductAlert.brand}. Limited stock available!
                    </p>
                    <div className="mt-3 flex gap-3">
                      <Button
                        size="sm"
                        className="bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-1"
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
                        className="border-pink-700 text-pink-300 hover:bg-pink-800"
                        onClick={closeNewProductAlert}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      className="bg-pink-950 rounded-md inline-flex text-pink-400 hover:text-pink-300 focus:outline-none"
                      onClick={closeNewProductAlert}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="h-1 w-full bg-pink-900">
                <motion.div
                  className="h-full bg-pink-500"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 15, ease: "linear" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    
    
  )
}

