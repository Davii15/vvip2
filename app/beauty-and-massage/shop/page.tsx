"use client"

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
  ChevronRight,
  Star,
  Heart,
  ShoppingBag,
  ArrowLeft,
  X,
  Sparkles,
  Percent,
  Check,
  Store,
  MapPin,
  Flame,
  ArrowUpRight,
  Clock,
  TrendingUp,
  Scissors,
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
import TrendingPopularSection from "@/components/TrendingPopularSection"
import { trendingProducts, popularProducts } from "./trending-data"
import { TimeBasedRecommendations } from "@/components/TimeBasedRecommendations"

// Types
interface Price {
  amount: number
  currency: string
}

interface BeautyProduct {
  id: string
  name: string
  imageUrl: string
  images?: string[]
  currentPrice: Price
  originalPrice: Price
  category: string
  subcategory: string
  brand: string
  description: string
  rating?: number
  reviewCount?: number
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock"
  stockCount?: number
  discount?: number
  isNew?: boolean
  isBestSeller?: boolean
  isOrganic?: boolean
  ingredients?: string[]
  suitableFor?: string[]
  howToUse?: string
  benefits?: string[]
  vendorId: string
  tags?: string[]
  dateAdded?: string
  discountEnds?: string
}

interface Vendor {
  id: string
  name: string
  logo: string
  location: string
  rating?: number
  reviewCount?: number
  verified?: boolean
  website?: string
}

interface Category {
  id: string
  name: string
  subcategories: Subcategory[]
}

interface Subcategory {
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
const transformForHotDeals = (products: BeautyProduct[]) => {
  return products
    .filter((product) => product.discount && product.discount >= 20)
    .map((product) => ({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      currentPrice: product.currentPrice,
      originalPrice: product.originalPrice,
      category: product.subcategory,
      expiresAt: product.discountEnds || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
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

// Helper function to calculate time remaining for discount
const getTimeRemaining = (discountEnds?: string): string => {
  if (!discountEnds) return "Limited time"

  const endDate = new Date(discountEnds)
  const now = new Date()

  if (now > endDate) return "Expired"

  const diffTime = Math.abs(endDate.getTime() - now.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h left`
  } else {
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
    return `${diffHours}h ${diffMinutes}m left`
  }
}

// Mock data for categories
const categories: Category[] = [
  {
    id: "men",
    name: "Men Products",
    subcategories: [
      { id: "men-facial", name: "Facial Products", productCount: 18 },
      { id: "men-oils", name: "Oils and Jellies", productCount: 14 },
      { id: "men-perfumes", name: "Perfumes", productCount: 22 },
    ],
  },
  {
    id: "women",
    name: "Women Products",
    subcategories: [
      { id: "women-facial", name: "Facial Products", productCount: 32 },
      { id: "women-hair", name: "Hair Products", productCount: 28 },
      { id: "women-weaves", name: "Weaves & Wigs", productCount: 19 },
      { id: "women-nails", name: "Nail Products", productCount: 15 },
      { id: "women-oils", name: "Oils and Jellies", productCount: 17 },
      { id: "women-perfumes", name: "Perfumes", productCount: 35 },
      { id: "women-makeup", name: "Makeups", productCount: 42 },
      { id: "women-foundations", name: "Foundations", productCount: 24 },
    ],
  },
]

// Mock data for vendors
const vendors: Vendor[] = [
  {
    id: "v1",
    name: "Glow & Shine",
    logo: "/placeholder.svg?height=60&width=60",
    location: "Nairobi, Kenya",
    rating: 4.8,
    reviewCount: 342,
    verified: true,
    website: "https://glowandshine.co.ke",
  },
  {
    id: "v2",
    name: "Natural Beauty",
    logo: "/placeholder.svg?height=60&width=60",
    location: "Mombasa, Kenya",
    rating: 4.7,
    reviewCount: 256,
    verified: true,
    website: "https://naturalbeauty.co.ke",
  },
  {
    id: "v3",
    name: "Elegance Cosmetics",
    logo: "/placeholder.svg?height=60&width=60",
    location: "Kisumu, Kenya",
    rating: 4.9,
    reviewCount: 189,
    verified: true,
    website: "https://elegancecosmetics.co.ke",
  },
  {
    id: "v4",
    name: "Pure Essence",
    logo: "/placeholder.svg?height=60&width=60",
    location: "Nakuru, Kenya",
    rating: 4.6,
    reviewCount: 127,
    verified: true,
    website: "https://puressence.co.ke",
  },
  {
    id: "v5",
    name: "Luxury Beauty",
    logo: "/placeholder.svg?height=60&width=60",
    location: "Eldoret, Kenya",
    rating: 4.5,
    reviewCount: 98,
    verified: true,
    website: "https://luxurybeauty.co.ke",
  },
]

// Mock data for products - all with discounts
const products: BeautyProduct[] = [
  // Men's Facial Products
  {
    id: "mp1",
    name: "Gentleman's Face Wash with Activated Charcoal",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 1200, currency: "KSH" },
    originalPrice: { amount: 1500, currency: "KSH" },
    category: "men",
    subcategory: "men-facial",
    brand: "ManCare",
    description:
      "Deep cleansing face wash with activated charcoal that removes impurities and excess oil without drying the skin.",
    rating: 4.7,
    reviewCount: 86,
    stockStatus: "In Stock",
    stockCount: 45,
    discount: 20,
    isNew: true,
    ingredients: ["Activated Charcoal", "Glycerin", "Aloe Vera", "Tea Tree Oil"],
    suitableFor: ["All Skin Types", "Oily Skin"],
    howToUse: "Apply to wet face, massage gently in circular motions, and rinse thoroughly with water.",
    benefits: ["Removes impurities", "Controls oil", "Prevents acne", "Refreshes skin"],
    vendorId: "v1",
    tags: ["Charcoal", "Deep Cleansing", "Oil Control"],
    dateAdded: "2025-03-25T10:30:00Z",
    discountEnds: "2025-05-25T23:59:59Z",
  },
  {
    id: "mp2",
    name: "Men's Anti-Aging Moisturizer with SPF 30",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 2200, currency: "KSH" },
    originalPrice: { amount: 2800, currency: "KSH" },
    category: "men",
    subcategory: "men-facial",
    brand: "Derma Force",
    description:
      "Anti-aging moisturizer specially formulated for men's skin with SPF 30 protection against harmful UV rays.",
    rating: 4.8,
    reviewCount: 124,
    stockStatus: "In Stock",
    stockCount: 32,
    discount: 21,
    isBestSeller: true,
    ingredients: ["Retinol", "Hyaluronic Acid", "Vitamin E", "Zinc Oxide"],
    suitableFor: ["All Skin Types", "Aging Skin"],
    howToUse: "Apply to clean face and neck every morning before sun exposure.",
    benefits: ["Reduces fine lines", "Hydrates skin", "Protects from UV damage", "Improves skin texture"],
    vendorId: "v3",
    tags: ["Anti-Aging", "SPF", "Moisturizer"],
    dateAdded: "2025-02-15T10:30:00Z",
    discountEnds: "2025-05-15T23:59:59Z",
  },

  // Men's Oils and Jellies
  {
    id: "mo1",
    name: "Beard Growth Oil with Argan & Jojoba",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 1800, currency: "KSH" },
    originalPrice: { amount: 2200, currency: "KSH" },
    category: "men",
    subcategory: "men-oils",
    brand: "BeardKing",
    description:
      "Premium beard oil that promotes healthy beard growth while conditioning and eliminating beard itch and dandruff.",
    rating: 4.9,
    reviewCount: 178,
    stockStatus: "In Stock",
    stockCount: 28,
    discount: 18,
    isBestSeller: true,
    isOrganic: true,
    ingredients: ["Argan Oil", "Jojoba Oil", "Vitamin E", "Essential Oils"],
    suitableFor: ["All Beard Types", "Sensitive Skin"],
    howToUse: "Apply 3-5 drops to palm, rub hands together, and massage into beard and skin underneath.",
    benefits: ["Promotes growth", "Conditions beard", "Eliminates itch", "Adds shine"],
    vendorId: "v2",
    tags: ["Beard Care", "Organic", "Growth"],
    dateAdded: "2025-01-20T10:30:00Z",
    discountEnds: "2025-04-20T23:59:59Z",
  },
  {
    id: "mo2",
    name: "Men's Hair Styling Pomade",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 950, currency: "KSH" },
    originalPrice: { amount: 1200, currency: "KSH" },
    category: "men",
    subcategory: "men-oils",
    brand: "StylePro",
    description:
      "Medium hold pomade that gives a natural shine and allows for restyling throughout the day without flaking.",
    rating: 4.6,
    reviewCount: 92,
    stockStatus: "In Stock",
    stockCount: 50,
    discount: 21,
    ingredients: ["Beeswax", "Castor Oil", "Coconut Oil", "Shea Butter"],
    suitableFor: ["All Hair Types"],
    howToUse: "Apply to damp or dry hair and style as desired.",
    benefits: ["Medium hold", "Natural shine", "Reworkable", "No flaking"],
    vendorId: "v1",
    tags: ["Hair Styling", "Pomade", "Medium Hold"],
    dateAdded: "2025-02-05T10:30:00Z",
    discountEnds: "2025-05-05T23:59:59Z",
  },

  // Men's Perfumes
  {
    id: "mf1",
    name: "Midnight Essence Eau de Parfum for Men",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 4500, currency: "KSH" },
    originalPrice: { amount: 5800, currency: "KSH" },
    category: "men",
    subcategory: "men-perfumes",
    brand: "Royal Scents",
    description: "A sophisticated fragrance with notes of bergamot, cedar, and amber for the confident modern man.",
    rating: 4.9,
    reviewCount: 215,
    stockStatus: "In Stock",
    stockCount: 18,
    discount: 22,
    isBestSeller: true,
    ingredients: ["Alcohol", "Fragrance Oil", "Water"],
    suitableFor: ["Evening Wear", "Special Occasions"],
    howToUse: "Spray on pulse points: wrists, neck, and behind ears.",
    benefits: ["Long-lasting", "Sophisticated scent", "Compliment magnet"],
    vendorId: "v3",
    tags: ["Luxury", "Evening", "Woody"],
    dateAdded: "2025-01-15T10:30:00Z",
    discountEnds: "2025-04-15T23:59:59Z",
  },
  {
    id: "mf2",
    name: "Ocean Breeze Cologne for Men",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 3200, currency: "KSH" },
    originalPrice: { amount: 3800, currency: "KSH" },
    category: "men",
    subcategory: "men-perfumes",
    brand: "AquaMen",
    description: "Fresh and invigorating cologne with notes of citrus, sea salt, and musk perfect for daily wear.",
    rating: 4.7,
    reviewCount: 143,
    stockStatus: "Low Stock",
    stockCount: 7,
    discount: 16,
    isNew: true,
    ingredients: ["Alcohol", "Fragrance Oil", "Water"],
    suitableFor: ["Daily Wear", "Office", "Casual"],
    howToUse: "Spray on pulse points: wrists, neck, and behind ears.",
    benefits: ["Fresh scent", "Moderate longevity", "Versatile"],
    vendorId: "v4",
    tags: ["Fresh", "Daytime", "Citrus"],
    dateAdded: "2025-03-28T10:30:00Z",
    discountEnds: "2025-05-28T23:59:59Z",
  },

  // Women's Facial Products
  {
    id: "wf1",
    name: "Vitamin C Brightening Serum",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 2800, currency: "KSH" },
    originalPrice: { amount: 3500, currency: "KSH" },
    category: "women",
    subcategory: "women-facial",
    brand: "Glow Essentials",
    description:
      "Powerful vitamin C serum that brightens skin, reduces dark spots, and boosts collagen production for a radiant complexion.",
    rating: 4.9,
    reviewCount: 267,
    stockStatus: "In Stock",
    stockCount: 42,
    discount: 20,
    isBestSeller: true,
    isOrganic: true,
    ingredients: ["Vitamin C (L-Ascorbic Acid)", "Hyaluronic Acid", "Vitamin E", "Ferulic Acid"],
    suitableFor: ["All Skin Types", "Dull Skin", "Hyperpigmentation"],
    howToUse: "Apply 3-4 drops to clean face and neck in the morning before moisturizer and sunscreen.",
    benefits: ["Brightens skin", "Reduces dark spots", "Boosts collagen", "Antioxidant protection"],
    vendorId: "v1",
    tags: ["Vitamin C", "Brightening", "Anti-aging"],
    dateAdded: "2025-02-10T10:30:00Z",
    discountEnds: "2025-05-10T23:59:59Z",
  },
  {
    id: "wf2",
    name: "Hydrating Rose Water Facial Toner",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 1200, currency: "KSH" },
    originalPrice: { amount: 1500, currency: "KSH" },
    category: "women",
    subcategory: "women-facial",
    brand: "Natural Beauty",
    description:
      "Alcohol-free rose water toner that hydrates, balances pH, and soothes skin while preparing it for better absorption of serums and moisturizers.",
    rating: 4.8,
    reviewCount: 189,
    stockStatus: "In Stock",
    stockCount: 65,
    discount: 20,
    isOrganic: true,
    ingredients: ["Rose Water", "Glycerin", "Aloe Vera", "Witch Hazel"],
    suitableFor: ["All Skin Types", "Sensitive Skin", "Dry Skin"],
    howToUse: "Apply to clean face with a cotton pad or spray directly onto face morning and night.",
    benefits: ["Hydrates", "Balances pH", "Soothes", "Preps skin"],
    vendorId: "v2",
    tags: ["Rose", "Hydrating", "Alcohol-free"],
    dateAdded: "2025-01-25T10:30:00Z",
    discountEnds: "2025-04-25T23:59:59Z",
  },

  // Women's Hair Products
  {
    id: "wh1",
    name: "Argan Oil Hair Mask Treatment",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 1800, currency: "KSH" },
    originalPrice: { amount: 2200, currency: "KSH" },
    category: "women",
    subcategory: "women-hair",
    brand: "HairLuxe",
    description:
      "Intensive hair mask with argan oil that repairs damaged hair, reduces frizz, and adds shine and softness.",
    rating: 4.9,
    reviewCount: 231,
    stockStatus: "In Stock",
    stockCount: 38,
    discount: 18,
    isBestSeller: true,
    isOrganic: true,
    ingredients: ["Argan Oil", "Shea Butter", "Keratin", "Vitamin E"],
    suitableFor: ["All Hair Types", "Damaged Hair", "Dry Hair"],
    howToUse: "Apply to damp hair from mid-lengths to ends, leave for 10-15 minutes, then rinse thoroughly.",
    benefits: ["Repairs damage", "Reduces frizz", "Adds shine", "Softens hair"],
    vendorId: "v3",
    tags: ["Hair Mask", "Argan Oil", "Repair"],
    dateAdded: "2025-02-18T10:30:00Z",
    discountEnds: "2025-05-18T23:59:59Z",
  },
  {
    id: "wh2",
    name: "Curl Defining Cream with Coconut Oil",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 1500, currency: "KSH" },
    originalPrice: { amount: 1800, currency: "KSH" },
    category: "women",
    subcategory: "women-hair",
    brand: "CurlPerfect",
    description:
      "Curl defining cream that enhances natural curl pattern, eliminates frizz, and provides moisture and hold without crunchiness.",
    rating: 4.7,
    reviewCount: 178,
    stockStatus: "In Stock",
    stockCount: 42,
    discount: 17,
    isNew: true,
    ingredients: ["Coconut Oil", "Shea Butter", "Aloe Vera", "Flaxseed Extract"],
    suitableFor: ["Curly Hair", "Wavy Hair", "Coily Hair"],
    howToUse: "Apply to damp hair, scrunch, and air dry or diffuse for best results.",
    benefits: ["Defines curls", "Eliminates frizz", "Moisturizes", "Soft hold"],
    vendorId: "v2",
    tags: ["Curly Hair", "Defining", "Moisturizing"],
    dateAdded: "2025-03-26T10:30:00Z",
    discountEnds: "2025-05-26T23:59:59Z",
  },

  // Women's Weaves & Wigs
  {
    id: "ww1",
    name: "Brazilian Body Wave Human Hair Wig",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 12000, currency: "KSH" },
    originalPrice: { amount: 15000, currency: "KSH" },
    category: "women",
    subcategory: "women-weaves",
    brand: "Royal Hair",
    description:
      "100% Brazilian human hair lace front wig with body wave texture, pre-plucked hairline, and baby hairs for a natural look.",
    rating: 4.9,
    reviewCount: 156,
    stockStatus: "In Stock",
    stockCount: 12,
    discount: 20,
    isBestSeller: true,
    suitableFor: ["All Hair Types"],
    howToUse: "Place on head, adjust to fit, secure with wig glue or tape if desired, and style as preferred.",
    benefits: ["Natural look", "Versatile styling", "Durable", "Pre-plucked hairline"],
    vendorId: "v1",
    tags: ["Human Hair", "Lace Front", "Body Wave"],
    dateAdded: "2025-02-05T10:30:00Z",
    discountEnds: "2025-05-05T23:59:59Z",
  },
  {
    id: "ww2",
    name: "Kinky Curly Clip-In Hair Extensions",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 8500, currency: "KSH" },
    originalPrice: { amount: 10000, currency: "KSH" },
    category: "women",
    subcategory: "women-weaves",
    brand: "AfroLuxe",
    description:
      "Premium quality kinky curly clip-in hair extensions that blend seamlessly with natural hair for added volume and length.",
    rating: 4.7,
    reviewCount: 98,
    stockStatus: "Low Stock",
    stockCount: 5,
    discount: 15,
    isNew: true,
    suitableFor: ["Type 3 and 4 Hair"],
    howToUse: "Section hair, clip in wefts from bottom to top, and blend with natural hair.",
    benefits: ["Adds volume", "Adds length", "Blends naturally", "Easy application"],
    vendorId: "v4",
    tags: ["Clip-In", "Kinky Curly", "Extensions"],
    dateAdded: "2025-03-29T10:30:00Z",
    discountEnds: "2025-05-29T23:59:59Z",
  },

  // Women's Nail Products
  {
    id: "wn1",
    name: "Gel Polish Starter Kit with LED Lamp",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 4500, currency: "KSH" },
    originalPrice: { amount: 5800, currency: "KSH" },
    category: "women",
    subcategory: "women-nails",
    brand: "NailPro",
    description:
      "Complete gel polish starter kit with LED lamp, base and top coat, 6 popular colors, and nail prep essentials.",
    rating: 4.8,
    reviewCount: 124,
    stockStatus: "In Stock",
    stockCount: 18,
    discount: 22,
    isBestSeller: true,
    ingredients: ["Gel Polish", "LED Lamp", "Base Coat", "Top Coat"],
    suitableFor: ["All Nail Types"],
    howToUse: "Prep nails, apply base coat and cure, apply color and cure, finish with top coat and cure.",
    benefits: ["Long-lasting", "Salon-quality", "Easy application", "No chipping"],
    vendorId: "v3",
    tags: ["Gel Polish", "Kit", "LED Lamp"],
    dateAdded: "2025-01-30T10:30:00Z",
    discountEnds: "2025-04-30T23:59:59Z",
  },
  {
    id: "wn2",
    name: "Press-On Nails Set - Nude Collection",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 1200, currency: "KSH" },
    originalPrice: { amount: 1500, currency: "KSH" },
    category: "women",
    subcategory: "women-nails",
    brand: "GlamNails",
    description:
      "Reusable press-on nails in elegant nude shades with various designs, includes nail glue and prep kit.",
    rating: 4.6,
    reviewCount: 87,
    stockStatus: "In Stock",
    stockCount: 32,
    discount: 20,
    isNew: true,
    suitableFor: ["All Nail Types"],
    howToUse: "Prep natural nails, apply glue to press-on nail, press onto natural nail and hold for 30 seconds.",
    benefits: ["Quick application", "Reusable", "No drying time", "Salon look"],
    vendorId: "v2",
    tags: ["Press-On", "Nude", "Reusable"],
    dateAdded: "2025-03-27T10:30:00Z",
    discountEnds: "2025-05-27T23:59:59Z",
  },

  // Women's Oils and Jellies
  {
    id: "wo1",
    name: "Shea Butter & Cocoa Body Butter",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 1800, currency: "KSH" },
    originalPrice: { amount: 2200, currency: "KSH" },
    category: "women",
    subcategory: "women-oils",
    brand: "Natural Beauty",
    description:
      "Rich and creamy body butter with shea and cocoa butter that deeply moisturizes and nourishes dry skin.",
    rating: 4.9,
    reviewCount: 213,
    stockStatus: "In Stock",
    stockCount: 45,
    discount: 18,
    isBestSeller: true,
    isOrganic: true,
    ingredients: ["Shea Butter", "Cocoa Butter", "Vitamin E", "Essential Oils"],
    suitableFor: ["All Skin Types", "Dry Skin", "Sensitive Skin"],
    howToUse: "Apply to clean, dry skin and massage until absorbed. Use daily for best results.",
    benefits: ["Deep moisturization", "Repairs dry skin", "Non-greasy", "Long-lasting hydration"],
    vendorId: "v2",
    tags: ["Body Butter", "Moisturizer", "Organic"],
    dateAdded: "2025-02-12T10:30:00Z",
    discountEnds: "2025-05-12T23:59:59Z",
  },
  {
    id: "wo2",
    name: "Lavender & Rosemary Massage Oil",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 1500, currency: "KSH" },
    originalPrice: { amount: 1800, currency: "KSH" },
    category: "women",
    subcategory: "women-oils",
    brand: "Pure Essence",
    description:
      "Relaxing massage oil with lavender and rosemary essential oils in a base of sweet almond and jojoba oils.",
    rating: 4.7,
    reviewCount: 156,
    stockStatus: "In Stock",
    stockCount: 38,
    discount: 17,
    isOrganic: true,
    ingredients: ["Sweet Almond Oil", "Jojoba Oil", "Lavender Essential Oil", "Rosemary Essential Oil"],
    suitableFor: ["All Skin Types"],
    howToUse: "Warm a small amount in hands and massage into skin using gentle, circular motions.",
    benefits: ["Relaxes muscles", "Calms mind", "Moisturizes skin", "Improves circulation"],
    vendorId: "v4",
    tags: ["Massage Oil", "Relaxation", "Aromatherapy"],
    dateAdded: "2025-02-22T10:30:00Z",
    discountEnds: "2025-05-22T23:59:59Z",
  },

  // Women's Perfumes
  {
    id: "wp1",
    name: "Floral Elegance Eau de Parfum",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 5500, currency: "KSH" },
    originalPrice: { amount: 6800, currency: "KSH" },
    category: "women",
    subcategory: "women-perfumes",
    brand: "Elegance Cosmetics",
    description:
      "Luxurious floral fragrance with notes of rose, jasmine, and vanilla for a feminine and sophisticated scent.",
    rating: 4.9,
    reviewCount: 187,
    stockStatus: "In Stock",
    stockCount: 22,
    discount: 19,
    isBestSeller: true,
    ingredients: ["Alcohol", "Fragrance Oil", "Water"],
    suitableFor: ["Evening Wear", "Special Occasions"],
    howToUse: "Spray on pulse points: wrists, neck, and behind ears.",
    benefits: ["Long-lasting", "Elegant scent", "Compliment magnet"],
    vendorId: "v3",
    tags: ["Floral", "Luxury", "Evening"],
    dateAdded: "2025-01-18T10:30:00Z",
    discountEnds: "2025-04-18T23:59:59Z",
  },
  {
    id: "wp2",
    name: "Citrus Breeze Eau de Toilette",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 3200, currency: "KSH" },
    originalPrice: { amount: 3800, currency: "KSH" },
    category: "women",
    subcategory: "women-perfumes",
    brand: "Fresh Scents",
    description: "Refreshing citrus fragrance with notes of bergamot, lemon, and green tea perfect for everyday wear.",
    rating: 4.7,
    reviewCount: 142,
    stockStatus: "In Stock",
    stockCount: 35,
    discount: 16,
    isNew: true,
    ingredients: ["Alcohol", "Fragrance Oil", "Water"],
    suitableFor: ["Daily Wear", "Office", "Casual"],
    howToUse: "Spray on pulse points: wrists, neck, and behind ears.",
    benefits: ["Fresh scent", "Uplifting", "Versatile"],
    vendorId: "v1",
    tags: ["Citrus", "Fresh", "Daytime"],
    dateAdded: "2025-03-30T10:30:00Z",
    discountEnds: "2025-05-30T23:59:59Z",
  },

  // Women's Makeup
  {
    id: "wm1",
    name: "24-Hour Wear Matte Liquid Lipstick",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 1500, currency: "KSH" },
    originalPrice: { amount: 1800, currency: "KSH" },
    category: "women",
    subcategory: "women-makeup",
    brand: "Elegance Cosmetics",
    description: "Long-lasting matte liquid lipstick that stays put for up to 24 hours without drying lips.",
    rating: 4.8,
    reviewCount: 234,
    stockStatus: "In Stock",
    stockCount: 48,
    discount: 17,
    isBestSeller: true,
    ingredients: ["Isododecane", "Dimethicone", "Vitamin E", "Shea Butter"],
    suitableFor: ["All Skin Types"],
    howToUse: "Apply to clean, dry lips. Allow to dry completely before eating or drinking.",
    benefits: ["24-hour wear", "Transfer-proof", "Non-drying", "Intense color"],
    vendorId: "v3",
    tags: ["Lipstick", "Matte", "Long-lasting"],
    dateAdded: "2025-02-08T10:30:00Z",
    discountEnds: "2025-05-08T23:59:59Z",
  },
  {
    id: "wm2",
    name: "Waterproof Volumizing Mascara",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 1200, currency: "KSH" },
    originalPrice: { amount: 1500, currency: "KSH" },
    category: "women",
    subcategory: "women-makeup",
    brand: "Glow & Shine",
    description: "Waterproof mascara that adds volume and length to lashes without clumping or smudging.",
    rating: 4.7,
    reviewCount: 178,
    stockStatus: "In Stock",
    stockCount: 52,
    discount: 20,
    isNew: true,
    ingredients: ["Beeswax", "Carnauba Wax", "Vitamin E", "Panthenol"],
    suitableFor: ["All Eye Types", "Sensitive Eyes"],
    howToUse: "Apply from root to tip with zigzag motion. Build layers for more volume.",
    benefits: ["Waterproof", "Volumizing", "Lengthening", "No clumping"],
    vendorId: "v1",
    tags: ["Mascara", "Waterproof", "Volumizing"],
    dateAdded: "2025-03-24T10:30:00Z",
    discountEnds: "2025-05-24T23:59:59Z",
  },

  // Women's Foundations
  {
    id: "wfd1",
    name: "24-Hour Full Coverage Foundation with SPF 30",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 2800, currency: "KSH" },
    originalPrice: { amount: 3500, currency: "KSH" },
    category: "women",
    subcategory: "women-foundations",
    brand: "Elegance Cosmetics",
    description: "Long-wearing foundation with full coverage that lasts up to 24 hours with added SPF 30 protection.",
    rating: 4.9,
    reviewCount: 256,
    stockStatus: "In Stock",
    stockCount: 32,
    discount: 20,
    isBestSeller: true,
    ingredients: ["Water", "Dimethicone", "Titanium Dioxide", "Vitamin E"],
    suitableFor: ["All Skin Types"],
    howToUse: "Apply with brush, sponge, or fingertips. Build coverage as needed.",
    benefits: ["Full coverage", "24-hour wear", "SPF protection", "Natural finish"],
    vendorId: "v3",
    tags: ["Foundation", "Full Coverage", "SPF"],
    dateAdded: "2025-02-15T10:30:00Z",
    discountEnds: "2025-05-15T23:59:59Z",
  },
  {
    id: "wfd2",
    name: "Hydrating BB Cream with Hyaluronic Acid",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 1800, currency: "KSH" },
    originalPrice: { amount: 2200, currency: "KSH" },
    category: "women",
    subcategory: "women-foundations",
    brand: "Natural Beauty",
    description: "Lightweight BB cream that provides sheer coverage while hydrating skin with hyaluronic acid.",
    rating: 4.7,
    reviewCount: 187,
    stockStatus: "In Stock",
    stockCount: 45,
    discount: 18,
    isNew: true,
    ingredients: ["Water", "Hyaluronic Acid", "Titanium Dioxide", "Glycerin"],
    suitableFor: ["All Skin Types", "Dry Skin"],
    howToUse: "Apply with fingertips or sponge for a natural finish.",
    benefits: ["Hydrating", "Sheer coverage", "Natural finish", "Skin-improving"],
    vendorId: "v2",
    tags: ["BB Cream", "Hydrating", "Light Coverage"],
    dateAdded: "2025-03-22T10:30:00Z",
    discountEnds: "2025-05-22T23:59:59Z",
  },

  // Flash Sale Products
  {
    id: "fs1",
    name: "Limited Edition Luxury Skincare Set",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 5900, currency: "KSH" },
    originalPrice: { amount: 9800, currency: "KSH" },
    category: "women",
    subcategory: "women-facial",
    brand: "Luxury Beauty",
    description:
      "Complete luxury skincare set with cleanser, toner, serum, moisturizer, and eye cream in gift packaging.",
    rating: 4.9,
    reviewCount: 78,
    stockStatus: "Low Stock",
    stockCount: 8,
    discount: 40,
    isBestSeller: true,
    isOrganic: true,
    ingredients: ["Hyaluronic Acid", "Retinol", "Vitamin C", "Peptides"],
    suitableFor: ["All Skin Types", "Anti-Aging"],
    howToUse: "Follow included regimen guide for morning and evening routines.",
    benefits: ["Complete skincare", "Anti-aging", "Hydration", "Brightening"],
    vendorId: "v5",
    tags: ["Gift Set", "Luxury", "Complete Regimen"],
    dateAdded: "2025-03-15T10:30:00Z",
    discountEnds: "2025-04-15T23:59:59Z",
  },
  {
    id: "fs2",
    name: "Premium Men's Grooming Kit",
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    currentPrice: { amount: 3500, currency: "KSH" },
    originalPrice: { amount: 7000, currency: "KSH" },
    category: "men",
    subcategory: "men-facial",
    brand: "ManCare",
    description: "Complete men's grooming kit with facial cleanser, moisturizer, beard oil, and styling products.",
    rating: 4.8,
    reviewCount: 65,
    stockStatus: "In Stock",
    stockCount: 15,
    discount: 50,
    isBestSeller: true,
    ingredients: ["Natural Oils", "Vitamin E", "Aloe Vera", "Shea Butter"],
    suitableFor: ["All Skin Types", "Bearded Men"],
    howToUse: "Follow included guide for complete grooming routine.",
    benefits: ["Complete grooming", "Skin health", "Beard maintenance", "Hair styling"],
    vendorId: "v1",
    tags: ["Gift Set", "Grooming", "Men's Care"],
    dateAdded: "2025-03-10T10:30:00Z",
    discountEnds: "2025-04-10T23:59:59Z",
  },
]

export default function BeautyDiscountShop() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<string>("women")
  const [activeSubcategory, setActiveSubcategory] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortOrder, setSortOrder] = useState("discount")
  const [selectedProduct, setSelectedProduct] = useState<BeautyProduct | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showOnlyHighDiscount, setShowOnlyHighDiscount] = useState(false)
  const [showOnlyOrganic, setShowOnlyOrganic] = useState(false)
  const [showOnlyBestSellers, setShowOnlyBestSellers] = useState(false)
  const [showOnlyNewArrivals, setShowOnlyNewArrivals] = useState(false)
  const [showOnlyFlashSales, setShowOnlyFlashSales] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  // New product alert state
  const [discountAlert, setDiscountAlert] = useState<BeautyProduct | null>(null)

  // Custom color scheme for beauty discount shop
  const beautyColorScheme = {
    primary: "from-rose-500 to-fuchsia-700",
    secondary: "bg-rose-100",
    accent: "bg-fuchsia-600",
    text: "text-fuchsia-900",
    background: "bg-rose-50",
  }

  // Infinite scroll states
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [visibleProducts, setVisibleProducts] = useState<BeautyProduct[]>([])
  const loaderRef = useRef<HTMLDivElement>(null)
  const productsPerPage = 8

  // Get all available brands
  const allBrands = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.brand)))
  }, [])

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

    // Filter by high discount (25% or more)
    if (showOnlyHighDiscount) {
      results = results.filter((product) => product.discount && product.discount >= 25)
    }

    // Filter by organic
    if (showOnlyOrganic) {
      results = results.filter((product) => product.isOrganic)
    }

    // Filter by best sellers
    if (showOnlyBestSellers) {
      results = results.filter((product) => product.isBestSeller)
    }

    // Filter by new arrivals
    if (showOnlyNewArrivals) {
      results = results.filter((product) => product.isNew)
    }

    // Filter by flash sales (40% or more discount)
    if (showOnlyFlashSales) {
      results = results.filter((product) => product.discount && product.discount >= 40)
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
    } else if (sortOrder === "ending-soon") {
      results.sort((a, b) => {
        if (!a.discountEnds) return 1
        if (!b.discountEnds) return -1
        return new Date(a.discountEnds).getTime() - new Date(b.discountEnds).getTime()
      })
    }

    return results
  }, [
    products,
    activeCategory,
    activeSubcategory,
    searchTerm,
    priceRange,
    selectedBrands,
    sortOrder,
    showOnlyHighDiscount,
    showOnlyOrganic,
    showOnlyBestSellers,
    showOnlyNewArrivals,
    showOnlyFlashSales,
  ])

  // Get vendor for a product
  const getVendorForProduct = (vendorId: string) => {
    return vendors.find((vendor) => vendor.id === vendorId)
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setActiveSubcategory("")
    resetPagination()
  }

  const handleSubcategoryChange = (subcategory: string) => {
    setActiveSubcategory(subcategory)
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

  const handleProductClick = (product: BeautyProduct) => {
    setSelectedProduct(product)
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
  }

  const closeDiscountAlert = () => {
    setDiscountAlert(null)
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

  // Show discount alert for flash sales
  useEffect(() => {
    // Find products with highest discounts
    const flashSaleProducts = products.filter((product) => product.discount && product.discount >= 40)

    if (flashSaleProducts.length > 0) {
      // Sort by discount to get the highest one
      const highestDiscountProduct = flashSaleProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0))[0]

      // Set as discount alert
      setDiscountAlert(highestDiscountProduct)

      // Auto-dismiss after 15 seconds
      const timer = setTimeout(() => {
        setDiscountAlert(null)
      }, 15000)

      return () => clearTimeout(timer)
    }
  }, [])

  // Get hot deals
  const hotDeals = useMemo(() => {
    return transformForHotDeals(products)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-fuchsia-50">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-rose-500 to-fuchsia-600 py-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-300 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-fuchsia-300 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/beauty-and-massage" className="flex items-center text-white mb-4 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Beauty & Massage
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Beauty Discount Shop</h1>
              <p className="text-rose-100 max-w-2xl">
                Discover amazing deals on premium beauty products. Save big on your favorite brands with discounts up to
                50% off!
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
                  <Percent className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Exclusive Discounts</p>
                  <p className="text-sm">Up to 50% off</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="container mx-auto px-4 mb-8">
        <CountdownTimer targetDate="2025-05-31T23:59:59" startDate="2025-03-01T00:00:00" />
      </div>

      {/* Flash Sale Banner */}
      <div className="container mx-auto px-4 mb-8">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-600 to-fuchsia-600 p-6 shadow-lg">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-yellow-300 opacity-50 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-rose-300 opacity-50 blur-2xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <Badge className="mb-2 bg-yellow-500 text-white px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                Limited Time Offer
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Flash Sale: Up to 50% Off</h2>
              <p className="text-rose-100 max-w-md">
                Hurry! These incredible deals on premium beauty products won't last long. Shop now before they're gone!
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="bg-white/90 rounded-lg p-3 text-center">
                  <span className="text-2xl font-bold text-rose-600">24</span>
                  <span className="text-xs text-gray-600 block">Hours</span>
                </div>
                <div className="bg-white/90 rounded-lg p-3 text-center">
                  <span className="text-2xl font-bold text-rose-600">12</span>
                  <span className="text-xs text-gray-600 block">Minutes</span>
                </div>
                <div className="bg-white/90 rounded-lg p-3 text-center">
                  <span className="text-2xl font-bold text-rose-600">36</span>
                  <span className="text-xs text-gray-600 block">Seconds</span>
                </div>
                <div className="bg-white/90 rounded-lg p-3 text-center">
                  <span className="text-2xl font-bold text-rose-600">99</span>
                  <span className="text-xs text-gray-600 block">Items</span>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 py-3 rounded-full shadow-lg animate-pulse"
                onClick={() => setShowOnlyFlashSales(!showOnlyFlashSales)}
              >
                Shop Flash Sale Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Time-Based Recommendations */}
      <div className="container mx-auto px-4">
        <TimeBasedRecommendations
          products={products.map((product) => {
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
              discount: product.discount,
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
          title="Discounted Products For Your Routine"
          subtitle="Save on products perfect for your current skincare needs"
          colorScheme="rose"
          maxProducts={4}
        />
      </div>

      {/* Hot Time Deals Section */}
      {hotDeals.length > 0 && (
        <div className="container mx-auto px-4">
          <HotTimeDeals
            deals={hotDeals}
            colorScheme="rose"
            title="Limited Time Beauty Deals"
            subtitle="Grab these exclusive beauty offers before they're gone!"
          />
        </div>
      )}

      {/* Trending and Popular Section */}
      <TrendingPopularSection
        trendingProducts={trendingProducts}
        popularProducts={popularProducts}
        colorScheme={beautyColorScheme}
        title="Trending Discounted Products"
        subtitle="Discover trending and most popular discounted beauty products"
      />

      {/* Beauty Shop Navigation */}
      <div className="flex justify-center my-8">
        <Link href="/beauty-and-massage">
          <Button
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 text-white px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
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
              <Scissors className="mr-2 h-5 w-5" />
              Visit Beauty & Massage Services
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

      {/* Search and filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search discounted products, brands, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full border-rose-200 focus:border-rose-500 focus:ring-rose-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-rose-400" />
          </div>
          <div className="flex items-center gap-3">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px] border-rose-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discount">Biggest Discount</SelectItem>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2 border-rose-200 hover:bg-rose-50"
            >
              <Filter className="h-4 w-4 text-rose-500" />
              <span>Filters</span>
              <ChevronDown
                className={`h-4 w-4 text-rose-500 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Filters section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4"
            >
              <div className="bg-white p-6 rounded-xl border border-rose-100 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Price range filter */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Price Range</h3>
                    <div className="px-4">
                      <Slider
                        defaultValue={[0, 10000]}
                        max={10000}
                        step={500}
                        value={priceRange}
                        onValueChange={handlePriceRangeChange}
                        className="mb-6"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{formatPrice({ amount: priceRange[0], currency: "KSH" })}</span>
                        <span>{formatPrice({ amount: priceRange[1], currency: "KSH" })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Brand filter */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Brands</h3>
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2">
                      {allBrands.map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox
                            id={`brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => handleBrandToggle(brand)}
                            className="border-rose-300 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                          />
                          <Label
                            htmlFor={`brand-${brand}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                          >
                            {brand}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product type filters */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Product Type</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="highDiscount"
                          checked={showOnlyHighDiscount}
                          onCheckedChange={() => setShowOnlyHighDiscount(!showOnlyHighDiscount)}
                          className="border-rose-300 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                        />
                        <Label
                          htmlFor="highDiscount"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                        >
                          High Discount (25%+)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="flashSales"
                          checked={showOnlyFlashSales}
                          onCheckedChange={() => setShowOnlyFlashSales(!showOnlyFlashSales)}
                          className="border-rose-300 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                        />
                        <Label
                          htmlFor="flashSales"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                        >
                          Flash Sales (40%+)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="organic"
                          checked={showOnlyOrganic}
                          onCheckedChange={() => setShowOnlyOrganic(!showOnlyOrganic)}
                          className="border-rose-300 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                        />
                        <Label
                          htmlFor="organic"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                        >
                          Organic Products
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="bestsellers"
                          checked={showOnlyBestSellers}
                          onCheckedChange={() => setShowOnlyBestSellers(!showOnlyBestSellers)}
                          className="border-rose-300 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                        />
                        <Label
                          htmlFor="bestsellers"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                        >
                          Best Sellers
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="newarrivals"
                          checked={showOnlyNewArrivals}
                          onCheckedChange={() => setShowOnlyNewArrivals(!showOnlyNewArrivals)}
                          className="border-rose-300 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                        />
                        <Label
                          htmlFor="newarrivals"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                        >
                          New Arrivals
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Quick filters */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Filters</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "rounded-full border-rose-200 hover:bg-rose-50",
                          showOnlyHighDiscount && "bg-rose-100 border-rose-300",
                        )}
                        onClick={() => setShowOnlyHighDiscount(!showOnlyHighDiscount)}
                      >
                        <Percent className="h-3 w-3 mr-1 text-rose-500" />
                        25%+ Off
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "rounded-full border-rose-200 hover:bg-rose-50",
                          showOnlyFlashSales && "bg-rose-100 border-rose-300",
                        )}
                        onClick={() => setShowOnlyFlashSales(!showOnlyFlashSales)}
                      >
                        <Flame className="h-3 w-3 mr-1 text-rose-500" />
                        Flash Sales
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "rounded-full border-rose-200 hover:bg-rose-50",
                          showOnlyBestSellers && "bg-rose-100 border-rose-300",
                        )}
                        onClick={() => setShowOnlyBestSellers(!showOnlyBestSellers)}
                      >
                        <TrendingUp className="h-3 w-3 mr-1 text-rose-500" />
                        Best Sellers
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "rounded-full border-rose-200 hover:bg-rose-50",
                          showOnlyNewArrivals && "bg-rose-100 border-rose-300",
                        )}
                        onClick={() => setShowOnlyNewArrivals(!showOnlyNewArrivals)}
                      >
                        <Sparkles className="h-3 w-3 mr-1 text-rose-500" />
                        New Arrivals
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Categories and products */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="women" value={activeCategory} onValueChange={handleCategoryChange} className="w-full">
          <TabsList className="bg-white p-1 rounded-xl mb-6 flex flex-nowrap overflow-x-auto hide-scrollbar border border-rose-100 shadow-sm">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={`flex items-center gap-1.5 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === category.id ? "bg-rose-500 text-white shadow-sm" : "text-gray-700 hover:bg-rose-50"
                }`}
              >
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
                        ? "bg-rose-100 border-rose-300 text-rose-700"
                        : "border-rose-200 text-gray-700 hover:bg-rose-50"
                    }`}
                    onClick={() => handleSubcategoryChange("")}
                  >
                    All {category.name}
                  </Button>
                  {category.subcategories.map((subcategory) => (
                    <Button
                      key={subcategory.id}
                      variant="outline"
                      size="sm"
                      className={`rounded-full whitespace-nowrap ${
                        activeSubcategory === subcategory.id
                          ? "bg-rose-100 border-rose-300 text-rose-700"
                          : "border-rose-200 text-gray-700 hover:bg-rose-50"
                      }`}
                      onClick={() => handleSubcategoryChange(subcategory.id)}
                    >
                      {subcategory.name} ({subcategory.productCount})
                    </Button>
                  ))}
                </div>
              </div>

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
                        <Card className="h-full overflow-hidden border-rose-100 hover:border-rose-300 hover:shadow-md transition-all duration-300">
                          <div className="cursor-pointer" onClick={() => handleProductClick(product)}>
                            {/* Product image */}
                            <div className="relative h-64 bg-rose-50">
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
                                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white">New</Badge>
                                )}
                                {product.isBestSeller && (
                                  <Badge className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1">
                                    <Flame className="h-3 w-3" />
                                    <span>Best Seller</span>
                                  </Badge>
                                )}
                                {product.isOrganic && (
                                  <Badge className="bg-green-500 hover:bg-green-600 text-white">Organic</Badge>
                                )}
                              </div>

                              {/* Discount badge */}
                              {product.discount && product.discount > 0 && (
                                <div className="absolute top-2 right-2">
                                  <Badge
                                    className={`${
                                      product.discount >= 40
                                        ? "bg-yellow-500 hover:bg-yellow-600 animate-pulse"
                                        : "bg-rose-500 hover:bg-rose-600"
                                    } text-white font-bold`}
                                  >
                                    {product.discount}% OFF
                                  </Badge>
                                </div>
                              )}

                              {/* Time remaining */}
                              {product.discountEnds && (
                                <div className="absolute bottom-2 left-2">
                                  <Badge className="bg-fuchsia-500 text-white flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {getTimeRemaining(product.discountEnds)}
                                  </Badge>
                                </div>
                              )}

                              {/* Wishlist button */}
                              <Button
                                size="icon"
                                variant="ghost"
                                className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white text-rose-500 hover:text-rose-600"
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
                                <Badge variant="outline" className="text-xs border-rose-200 text-rose-700">
                                  {
                                    categories
                                      .find((c) => c.id === product.category)
                                      ?.subcategories.find((s) => s.id === product.subcategory)?.name
                                  }
                                </Badge>
                                <span className="text-xs text-gray-600">{product.brand}</span>
                              </div>

                              <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                              {/* Vendor info */}
                              {vendor && (
                                <div className="flex items-center mb-3 bg-rose-50 p-2 rounded-md">
                                  <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-rose-700 font-bold text-xs mr-2">
                                    {vendor.name.substring(0, 2).toUpperCase()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-700 truncate flex items-center">
                                      {vendor.name}
                                      {vendor.verified && <Check className="h-3 w-3 ml-1 text-rose-500" />}
                                    </p>
                                    <p className="text-xs text-gray-500 flex items-center">
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
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="ml-1 text-xs text-gray-600">({product.reviewCount})</span>
                                </div>
                              )}

                              {/* Price */}
                              <div className="flex items-end justify-between mb-3">
                                <div>
                                  <div className="text-lg font-bold text-gray-800">
                                    {formatPrice(product.currentPrice)}
                                  </div>
                                  {product.originalPrice.amount !== product.currentPrice.amount && (
                                    <div className="text-sm text-gray-500 line-through">
                                      {formatPrice(product.originalPrice)}
                                    </div>
                                  )}
                                </div>
                                {product.discount && product.discount >= 30 && (
                                  <Badge className="bg-yellow-500 text-white">Great Deal!</Badge>
                                )}
                              </div>
                            </CardContent>
                          </div>

                          {/* Action buttons */}
                          <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              className="border-rose-200 text-rose-600 hover:bg-rose-50 flex items-center justify-center gap-1"
                              onClick={() => handleProductClick(product)}
                            >
                              <Sparkles className="h-4 w-4" />
                              <span>Details</span>
                            </Button>

                            <Button
                              className="bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center gap-1"
                              disabled={product.stockStatus === "Out of Stock"}
                            >
                              <ShoppingBag className="h-4 w-4" />
                              <span>Add to Bag</span>
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              ) : isLoading && page === 1 ? (
                <div className="flex justify-center items-center py-12">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin mb-3"></div>
                    <p className="text-rose-500 font-medium">Loading products...</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 mb-4 bg-rose-100 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">No products found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    We couldn't find any discounted products matching your criteria. Try adjusting your filters or
                    search term.
                  </p>
                </div>
              )}

              {/* Infinite scroll loader */}
              {hasMore && (
                <div ref={loaderRef} className="flex justify-center items-center py-8">
                  {isLoading && (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-rose-300 border-t-rose-500 rounded-full animate-spin mb-2"></div>
                      <p className="text-rose-500 text-sm">Loading more products...</p>
                    </div>
                  )}
                </div>
              )}

              {/* End of results message */}
              {!hasMore && visibleProducts.length > 0 && (
                <div className="text-center py-8 border-t border-rose-100 mt-8">
                  <p className="text-gray-600">You've reached the end of the results</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Product detail modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && closeProductModal()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product image */}
              <div className="relative h-80 md:h-full rounded-lg overflow-hidden bg-rose-50">
                <Image
                  src={selectedProduct.imageUrl || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  layout="fill"
                  objectFit="cover"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  {selectedProduct.isNew && <Badge className="bg-blue-500 text-white">New</Badge>}
                  {selectedProduct.isBestSeller && (
                    <Badge className="bg-amber-500 text-white flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      <span>Best Seller</span>
                    </Badge>
                  )}
                  {selectedProduct.isOrganic && <Badge className="bg-green-500 text-white">Organic</Badge>}
                </div>

                {/* Discount badge */}
                {selectedProduct.discount && selectedProduct.discount > 0 && (
                  <div className="absolute top-2 right-2">
                    <Badge
                      className={`${
                        selectedProduct.discount >= 40
                          ? "bg-yellow-500 hover:bg-yellow-600 animate-pulse"
                          : "bg-rose-500 hover:bg-rose-600"
                      } text-white font-bold`}
                    >
                      {selectedProduct.discount}% OFF
                    </Badge>
                  </div>
                )}

                {/* Time remaining */}
                {selectedProduct.discountEnds && (
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-fuchsia-500 text-white flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeRemaining(selectedProduct.discountEnds)}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Product details */}
              <div className="flex flex-col">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs border-rose-200 text-rose-700">
                      {
                        categories
                          .find((c) => c.id === selectedProduct.category)
                          ?.subcategories.find((s) => s.id === selectedProduct.subcategory)?.name
                      }
                    </Badge>
                    <span className="text-sm text-gray-600">{selectedProduct.brand}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h2>

                  {/* Vendor info */}
                  {getVendorForProduct(selectedProduct.vendorId) && (
                    <div className="flex items-center mb-4 bg-rose-50 p-3 rounded-md">
                      <div className="w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center text-rose-700 font-bold text-xs mr-3">
                        {getVendorForProduct(selectedProduct.vendorId)?.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 flex items-center">
                          {getVendorForProduct(selectedProduct.vendorId)?.name}
                          {getVendorForProduct(selectedProduct.vendorId)?.verified && (
                            <Check className="h-4 w-4 ml-1 text-rose-500" />
                          )}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{getVendorForProduct(selectedProduct.vendorId)?.location}</span>
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-rose-200 text-rose-600 hover:bg-rose-50"
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
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-sm text-gray-600">
                        {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviewCount} reviews)
                      </span>
                    </div>
                  )}

                  <p className="text-gray-700 mb-4">{selectedProduct.description}</p>

                  {/* Discount info */}
                  {selectedProduct.discount && selectedProduct.discount > 0 && (
                    <div className="mb-4 p-3 bg-rose-50 rounded-md border border-rose-200">
                      <h3 className="text-lg font-medium text-rose-700 mb-2 flex items-center">
                        <Percent className="h-5 w-5 mr-2" />
                        Special Discount Offer
                      </h3>
                      <p className="text-gray-700">
                        Save <span className="font-bold text-rose-600">{selectedProduct.discount}%</span> on this
                        product!
                        {selectedProduct.discountEnds && (
                          <span className="block mt-1">
                            Offer ends in:{" "}
                            <span className="font-semibold">{getTimeRemaining(selectedProduct.discountEnds)}</span>
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Ingredients */}
                  {selectedProduct.ingredients && selectedProduct.ingredients.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Ingredients</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.ingredients.map((ingredient, index) => (
                          <Badge key={index} variant="outline" className="border-rose-200 text-gray-700">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benefits */}
                  {selectedProduct.benefits && selectedProduct.benefits.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Benefits</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedProduct.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* How to use */}
                  {selectedProduct.howToUse && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">How to Use</h3>
                      <p className="text-gray-700">{selectedProduct.howToUse}</p>
                    </div>
                  )}

                  {/* Suitable for */}
                  {selectedProduct.suitableFor && selectedProduct.suitableFor.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Suitable For</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.suitableFor.map((suitable, index) => (
                          <Badge key={index} variant="outline" className="border-rose-200 text-gray-700">
                            {suitable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stock status */}
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Availability</h3>
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
                        <span className="ml-2 text-sm text-gray-600">{selectedProduct.stockCount} units available</span>
                      )}
                    </div>
                  </div>

                  {/* Price and buttons */}
                  <div className="mt-auto">
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
                      {selectedProduct.discount && selectedProduct.discount >= 30 && (
                        <Badge className="bg-yellow-500 text-white">Great Deal!</Badge>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        className="border-rose-200 text-rose-600 hover:bg-rose-50 flex-1 flex items-center justify-center gap-2"
                      >
                        <Heart className="h-4 w-4" />
                        <span>Add to Wishlist</span>
                      </Button>

                      <Button
                        className="bg-rose-500 hover:bg-rose-600 text-white flex-1 flex items-center justify-center gap-2"
                        disabled={selectedProduct.stockStatus === "Out of Stock"}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Add to Bag</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Discount Alert */}
      <AnimatePresence>
        {discountAlert && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 max-w-md bg-white rounded-lg shadow-xl border-l-4 border-yellow-500 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2">
                  <Percent className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <h3 className="text-lg font-medium text-gray-800">Flash Sale Alert!</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-bold text-rose-600">{discountAlert.discount}% OFF</span> on{" "}
                    {discountAlert.name}. This is our biggest discount ever!
                  </p>
                  <div className="mt-3 flex gap-3">
                    <Button
                      size="sm"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-1"
                      onClick={() => {
                        handleProductClick(discountAlert)
                        closeDiscountAlert()
                      }}
                    >
                      View Deal
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-rose-200 text-rose-600 hover:bg-rose-50"
                      onClick={closeDiscountAlert}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={closeDiscountAlert}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-gray-100">
              <motion.div
                className="h-full bg-yellow-500"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 15, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
