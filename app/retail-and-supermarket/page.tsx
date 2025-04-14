"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Search,
  ShoppingBag,
  Shirt,
  Tv,
  Sofa,
  Cake,
  PenTool,
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowUpDown,
  Star,
  ArrowRight,
  Truck,
  Leaf,
  Sparkles,
  Check,
  Loader2,
  Smartphone,
  Laptop,
  Home,
  Briefcase,
  Baby,
  TypeIcon as Man,
  BabyIcon as Woman,
  Footprints,
  BookOpen,
  Coffee,
  ShoppingCart,
  Plus,
  Minus,
  Percent,
  Clock,
  Tag,
  TrendingUp,
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
import { transformRetailToProducts } from "@/utils/product-transformers"
import TrendingPopularSection from "@/components/TrendingPopularSection"
import { trendingProducts, popularProducts } from "./trending-data"
import Link from "next/link"

// Types
interface Price {
  amount: number
  currency: string
}

interface ProductData {
  id: number | string
  name: string
  imageUrl: string
  currentPrice: Price
  originalPrice: Price
  category: string
  subcategory: string
  subtype?: string
  description: string
  brand: string
  isNew?: boolean
  isPopular?: boolean
  dateAdded: string
  rating?: number
  reviewCount?: number
  colors?: string[]
  sizes?: string[]
  features?: string[]
  material?: string
  inStock: boolean
  stockCount?: number
  tags?: string[]
  hotDealEnds?: string
  discount?: number
  vendorId: number | string
  isHotDeal?: boolean
  images?: string[]
}

interface Vendor {
  id: number | string
  name: string
  location: string
  logo: string
  description: string
  products: ProductData[]
  redirectUrl: string
  mapLink: string
  defaultCurrency: string
  rating?: number
  reviewCount?: number
  deliveryTime?: string
  verified?:boolean
  deliveryFee?: Price
  minimumOrder?: Price
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
  icon?: React.ReactNode
  subtypes?: Subtype[]
}

interface Subtype {
  id: string
  name: string
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

// Get color scheme based on category
const getCategoryColors = (category: string) => {
  switch (category.toLowerCase()) {
    case "clothing":
      return {
        gradient: "from-pink-500 to-purple-500",
        lightGradient: "from-pink-100 to-purple-100",
        text: "text-purple-600",
        border: "border-purple-200",
        button: "bg-purple-500 hover:bg-purple-600",
        badge: "bg-purple-100 text-purple-800",
        highlight: "text-purple-500",
        bgLight: "bg-purple-50",
      }
    case "shoes":
      return {
        gradient: "from-amber-500 to-orange-500",
        lightGradient: "from-amber-100 to-orange-100",
        text: "text-orange-600",
        border: "border-orange-200",
        button: "bg-orange-500 hover:bg-orange-600",
        badge: "bg-orange-100 text-orange-800",
        highlight: "text-orange-500",
        bgLight: "bg-orange-50",
      }
    case "electronics":
      return {
        gradient: "from-blue-500 to-indigo-500",
        lightGradient: "from-blue-100 to-indigo-100",
        text: "text-blue-600",
        border: "border-blue-200",
        button: "bg-blue-500 hover:bg-blue-600",
        badge: "bg-blue-100 text-blue-800",
        highlight: "text-blue-500",
        bgLight: "bg-blue-50",
      }
    case "furniture":
      return {
        gradient: "from-emerald-500 to-teal-500",
        lightGradient: "from-emerald-100 to-teal-100",
        text: "text-teal-600",
        border: "border-teal-200",
        button: "bg-teal-500 hover:bg-teal-600",
        badge: "bg-teal-100 text-teal-800",
        highlight: "text-teal-500",
        bgLight: "bg-teal-50",
      }
    case "snacks":
      return {
        gradient: "from-rose-500 to-red-500",
        lightGradient: "from-rose-100 to-red-100",
        text: "text-rose-600",
        border: "border-rose-200",
        button: "bg-rose-500 hover:bg-rose-600",
        badge: "bg-rose-100 text-rose-800",
        highlight: "text-rose-500",
        bgLight: "bg-rose-50",
      }
    case "stationery":
      return {
        gradient: "from-cyan-500 to-sky-500",
        lightGradient: "from-cyan-100 to-sky-100",
        text: "text-sky-600",
        border: "border-sky-200",
        button: "bg-sky-500 hover:bg-sky-600",
        badge: "bg-sky-100 text-sky-800",
        highlight: "text-sky-500",
        bgLight: "bg-sky-50",
      }
    default:
      return {
        gradient: "from-gray-500 to-slate-500",
        lightGradient: "from-gray-100 to-slate-100",
        text: "text-gray-600",
        border: "border-gray-200",
        button: "bg-gray-500 hover:bg-gray-600",
        badge: "bg-gray-100 text-gray-800",
        highlight: "text-gray-500",
        bgLight: "bg-gray-50",
      }
  }
}

// Get icon for category
const getCategoryIcon = (category: string, size = 20) => {
  switch (category.toLowerCase()) {
    case "clothing":
      return <Shirt size={size} />
    case "shoes":
      return <Footprints size={size} />
    case "electronics":
      return <Tv size={size} />
    case "furniture":
      return <Sofa size={size} />
    case "snacks":
      return <Cake size={size} />
    case "stationery":
      return <PenTool size={size} />
    default:
      return <ShoppingBag size={size} />
  }
}

// Get icon for subcategory
const getSubcategoryIcon = (category: string, subcategory: string, size = 18) => {
  if (category.toLowerCase() === "clothing") {
    switch (subcategory.toLowerCase()) {
      case "men":
        return <Man size={size} />
      case "women":
        return <Woman size={size} />
      case "children":
        return <Baby size={size} />
      default:
        return <Shirt size={size} />
    }
  } else if (category.toLowerCase() === "electronics") {
    switch (subcategory.toLowerCase()) {
      case "phones":
        return <Smartphone size={size} />
      case "computers & laptops":
        return <Laptop size={size} />
      case "tvs":
        return <Tv size={size} />
      default:
        return <Tv size={size} />
    }
  } else if (category.toLowerCase() === "furniture") {
    switch (subcategory.toLowerCase()) {
      case "home furniture":
        return <Home size={size} />
      case "office furniture":
        return <Briefcase size={size} />
      default:
        return <Sofa size={size} />
    }
  } else if (category.toLowerCase() === "stationery") {
    switch (subcategory.toLowerCase()) {
      case "office stationery":
        return <Briefcase size={size} />
      case "school stationery":
        return <BookOpen size={size} />
      default:
        return <PenTool size={size} />
    }
  } else if (category.toLowerCase() === "snacks") {
    return <Coffee size={size} />
  } else if (category.toLowerCase() === "shoes") {
    return <Footprints size={size} />
  }

  return <ShoppingBag size={size} />
}

// Define categories and subcategories
const categories: Category[] = [
  {
    id: "clothing",
    name: "Clothing",
    icon: <Shirt className="mr-2" />,
    subcategories: [
      {
        id: "men",
        name: "Men",
        icon: <Man className="mr-2" />,
        subtypes: [
          { id: "outdoor", name: "Outdoor" },
          { id: "office", name: "Office Wear" },
          { id: "sleeping", name: "Sleeping" },
          { id: "casual", name: "Casual" },
        ],
      },
      {
        id: "women",
        name: "Women",
        icon: <Woman className="mr-2" />,
        subtypes: [
          { id: "outdoor", name: "Outdoor" },
          { id: "office", name: "Office Wear" },
          { id: "sleeping", name: "Sleeping" },
          { id: "casual", name: "Casual" },
        ],
      },
      {
        id: "children",
        name: "Children",
        icon: <Baby className="mr-2" />,
        subtypes: [
          { id: "outdoor", name: "Outdoor" },
          { id: "sleeping", name: "Sleeping" },
          { id: "playing", name: "Playing" },
          { id: "casual", name: "Casual" },
        ],
      },
    ],
  },
  {
    id: "shoes",
    name: "Shoes",
    icon: <Footprints className="mr-2" />,
    subcategories: [
      {
        id: "men",
        name: "Men",
        subtypes: [
          { id: "formal", name: "Formal" },
          { id: "casual", name: "Casual" },
          { id: "sports", name: "Sports" },
        ],
      },
      {
        id: "women",
        name: "Women",
        subtypes: [
          { id: "formal", name: "Formal" },
          { id: "casual", name: "Casual" },
          { id: "sports", name: "Sports" },
          { id: "heels", name: "Heels" },
        ],
      },
      {
        id: "children",
        name: "Children",
        subtypes: [
          { id: "casual", name: "Casual" },
          { id: "sports", name: "Sports" },
          { id: "school", name: "School" },
        ],
      },
    ],
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: <Tv className="mr-2" />,
    subcategories: [
      {
        id: "tvs",
        name: "TVs",
        icon: <Tv className="mr-2" />,
      },
      {
        id: "phones",
        name: "Phones",
        icon: <Smartphone className="mr-2" />,
      },
      {
        id: "computers & laptops",
        name: "Computers & Laptops",
        icon: <Laptop className="mr-2" />,
      },
      {
        id: "fridges",
        name: "Fridges",
      },
      {
        id: "microwaves",
        name: "Microwaves",
      },
      {
        id: "ovens",
        name: "Ovens",
      },
    ],
  },
  {
    id: "furniture",
    name: "Furniture",
    icon: <Sofa className="mr-2" />,
    subcategories: [
      {
        id: "home furniture",
        name: "Home Furniture",
        icon: <Home className="mr-2" />,
        subtypes: [
          { id: "living room", name: "Living Room" },
          { id: "bedroom", name: "Bedroom" },
          { id: "dining", name: "Dining" },
          { id: "kitchen", name: "Kitchen" },
        ],
      },
      {
        id: "office furniture",
        name: "Office Furniture",
        icon: <Briefcase className="mr-2" />,
        subtypes: [
          { id: "desks", name: "Desks" },
          { id: "chairs", name: "Chairs" },
          { id: "storage", name: "Storage" },
          { id: "conference", name: "Conference" },
        ],
      },
    ],
  },
  {
    id: "snacks",
    name: "Snacks & Cakes",
    icon: <Cake className="mr-2" />,
    subcategories: [
      {
        id: "birthday cakes",
        name: "Birthday Cakes",
      },
      {
        id: "wedding cakes",
        name: "Wedding Cakes",
      },
      {
        id: "anniversary cakes",
        name: "Anniversary Cakes",
      },
      {
        id: "pastries",
        name: "Pastries",
      },
      {
        id: "cookies",
        name: "Cookies",
      },
    ],
  },
  {
    id: "stationery",
    name: "Stationery",
    icon: <PenTool className="mr-2" />,
    subcategories: [
      {
        id: "office stationery",
        name: "Office Stationery",
        icon: <Briefcase className="mr-2" />,
      },
      {
        id: "school stationery",
        name: "School Stationery",
        icon: <BookOpen className="mr-2" />,
      },
    ],
  },
]

// Mock data for vendors and products
const mockVendors: Vendor[] = [
  // Clothing Vendors
  {
    id: 1,
    name: "Fashion Hub",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Your one-stop shop for trendy and affordable clothing for the whole family.",
    redirectUrl: "https://fashionhub.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 324,
    verified:true,
    deliveryTime: "1-3 days",
    deliveryFee: { amount: 250, currency: "KSH" },
    minimumOrder: { amount: 1000, currency: "KSH" },
    products: [
      {
        id: 101,
        name: "Men's Formal Shirt - White",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 1200, currency: "KSH" },
        originalPrice: { amount: 1800, currency: "KSH" },
        category: "Clothing",
        subcategory: "Men",
        subtype: "Office",
        description:
          "A classic white formal shirt perfect for office wear. Made from high-quality cotton for comfort and durability.",
        brand: "Executive",
        isPopular: true,
        dateAdded: "2025-03-10T10:30:00Z",
        rating: 4.8,
        reviewCount: 156,
        colors: ["White", "Light Blue", "Black"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        material: "100% Cotton",
        inStock: true,
        stockCount: 45,
        tags: ["Formal", "Office", "Men", "Shirt"],
        vendorId: 1,
      },
      {
        id: 102,
        name: "Women's Business Suit - Navy Blue",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 4500, currency: "KSH" },
        originalPrice: { amount: 6000, currency: "KSH" },
        category: "Clothing",
        subcategory: "Women",
        subtype: "Office",
        description:
          "Professional women's business suit in navy blue. Includes blazer and matching pants. Perfect for the modern professional woman.",
        brand: "Corporate Chic",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.9,
        reviewCount: 87,
        colors: ["Navy Blue", "Black", "Gray"],
        sizes: ["S", "M", "L", "XL"],
        material: "Polyester Blend",
        inStock: true,
        stockCount: 23,
        tags: ["Formal", "Office", "Women", "Suit", "Professional"],
        hotDealEnds: "2025-04-01T23:59:59Z",
        isHotDeal: true,
        vendorId: 1,
      },
      {
        id: 103,
        name: "Children's Pajama Set - Dinosaur Print",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 850, currency: "KSH" },
        originalPrice: { amount: 1200, currency: "KSH" },
        category: "Clothing",
        subcategory: "Children",
        subtype: "Sleeping",
        description:
          "Comfortable and fun dinosaur print pajama set for children. Made from soft cotton for a good night's sleep.",
        brand: "KidDreams",
        dateAdded: "2025-02-25T10:30:00Z",
        rating: 4.7,
        reviewCount: 112,
        colors: ["Blue", "Green", "Red"],
        sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
        material: "100% Cotton",
        inStock: true,
        stockCount: 67,
        tags: ["Children", "Pajama", "Sleeping", "Comfortable"],
        vendorId: 1,
      },
    ],
  },
  {
    id: 2,
    name: "Urban Threads",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Contemporary fashion for the urban lifestyle. Quality clothing for men and women.",
    redirectUrl: "https://urbanthreads.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.5,
    reviewCount: 218,
    verified:true,
    deliveryTime: "2-4 days",
    deliveryFee: { amount: 300, currency: "KSH" },
    minimumOrder: { amount: 1500, currency: "KSH" },
    products: [
      {
        id: 201,
        name: "Men's Casual T-Shirt - Graphic Print",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 750, currency: "KSH" },
        originalPrice: { amount: 1000, currency: "KSH" },
        category: "Clothing",
        subcategory: "Men",
        subtype: "Casual",
        description: "Stylish graphic print t-shirt for casual wear. Made from soft cotton for all-day comfort.",
        brand: "Urban Vibes",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.6,
        reviewCount: 93,
        colors: ["Black", "White", "Gray"],
        sizes: ["S", "M", "L", "XL"],
        material: "100% Cotton",
        inStock: true,
        stockCount: 120,
        tags: ["Casual", "T-Shirt", "Men", "Graphic"],
        vendorId: 2,
      },
      {
        id: 202,
        name: "Women's Summer Dress - Floral",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 1800, currency: "KSH" },
        originalPrice: { amount: 2500, currency: "KSH" },
        category: "Clothing",
        subcategory: "Women",
        subtype: "Casual",
        description: "Beautiful floral summer dress perfect for casual outings. Light and comfortable for hot weather.",
        brand: "Summer Chic",
        isPopular: true,
        dateAdded: "2025-02-20T10:30:00Z",
        rating: 4.8,
        reviewCount: 145,
        colors: ["Blue Floral", "Pink Floral", "Yellow Floral"],
        sizes: ["XS", "S", "M", "L", "XL"],
        material: "Rayon",
        inStock: true,
        stockCount: 35,
        tags: ["Casual", "Dress", "Women", "Summer", "Floral"],
        hotDealEnds: "2025-03-30T23:59:59Z",
        isHotDeal: true,
        vendorId: 2,
      },
      {
        id: 203,
        name: "Children's Outdoor Play Set",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 1200, currency: "KSH" },
        originalPrice: { amount: 1500, currency: "KSH" },
        category: "Clothing",
        subcategory: "Children",
        subtype: "Outdoor",
        description:
          "Durable outdoor play set for children. Includes t-shirt and shorts with reinforced knees for active play.",
        brand: "KidActive",
        isNew: true,
        dateAdded: "2025-03-12T10:30:00Z",
        rating: 4.5,
        reviewCount: 78,
        colors: ["Blue/Green", "Red/Navy", "Yellow/Gray"],
        sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
        material: "Cotton Blend",
        inStock: true,
        stockCount: 42,
        tags: ["Children", "Outdoor", "Play", "Durable"],
        vendorId: 2,
      },
    ],
  },

  // Shoes Vendors
  {
    id: 3,
    name: "Footwear Express",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Quality footwear for all occasions. From formal to casual, we've got your feet covered.",
    redirectUrl: "https://footwearexpress.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.6,
    verified:true,
    reviewCount: 276,
    deliveryTime: "1-3 days",
    deliveryFee: { amount: 200, currency: "KSH" },
    minimumOrder: { amount: 1000, currency: "KSH" },
    products: [
      {
        id: 301,
        name: "Men's Leather Oxford Shoes - Brown",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 3500, currency: "KSH" },
        originalPrice: { amount: 4800, currency: "KSH" },
        category: "Shoes",
        subcategory: "Men",
        subtype: "Formal",
        description:
          "Classic brown leather Oxford shoes for formal occasions. Genuine leather with comfortable insoles.",
        brand: "Executive Step",
        isPopular: true,
        dateAdded: "2025-03-05T10:30:00Z",
        rating: 4.9,
        reviewCount: 128,
        colors: ["Brown", "Black"],
        sizes: ["40", "41", "42", "43", "44", "45"],
        material: "Genuine Leather",
        inStock: true,
        stockCount: 32,
        tags: ["Formal", "Men", "Leather", "Oxford"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 3,
      },
      {
        id: 302,
        name: "Women's High Heel Pumps - Red",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 2800, currency: "KSH" },
        originalPrice: { amount: 3500, currency: "KSH" },
        category: "Shoes",
        subcategory: "Women",
        subtype: "Heels",
        description:
          "Elegant red high heel pumps for formal events and special occasions. 3-inch heel with comfortable padding.",
        brand: "Glamour Steps",
        dateAdded: "2025-02-15T10:30:00Z",
        rating: 4.7,
        reviewCount: 95,
        colors: ["Red", "Black", "Nude"],
        sizes: ["36", "37", "38", "39", "40", "41"],
        material: "Synthetic Leather",
        inStock: true,
        stockCount: 28,
        tags: ["Formal", "Women", "Heels", "Elegant"],
        vendorId: 3,
      },
    ],
  },
  {
    id: 4,
    name: "Sports Footwear",
    location: "Kisumu, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Specialized in sports and athletic footwear for all ages. Performance and comfort guaranteed.",
    redirectUrl: "https://sportsfootwear.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 312,
    verified:true,
    deliveryTime: "2-4 days",
    deliveryFee: { amount: 350, currency: "KSH" },
    minimumOrder: { amount: 2000, currency: "KSH" },
    products: [
      {
        id: 401,
        name: "Men's Running Shoes - Blue",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 4200, currency: "KSH" },
        originalPrice: { amount: 5500, currency: "KSH" },
        category: "Shoes",
        subcategory: "Men",
        subtype: "Sports",
        description:
          "High-performance running shoes with cushioned soles and breathable mesh upper. Perfect for daily runs and training.",
        brand: "SpeedRunner",
        isNew: true,
        dateAdded: "2025-03-20T10:30:00Z",
        rating: 4.8,
        reviewCount: 156,
        colors: ["Blue/White", "Black/Red", "Gray/Green"],
        sizes: ["40", "41", "42", "43", "44", "45", "46"],
        material: "Synthetic Mesh",
        inStock: true,
        stockCount: 45,
        tags: ["Sports", "Men", "Running", "Athletic"],
        hotDealEnds: "2025-04-10T23:59:59Z",
        isHotDeal: true,
        vendorId: 4,
      },
      {
        id: 402,
        name: "Women's Fitness Trainers - Pink",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 3800, currency: "KSH" },
        originalPrice: { amount: 4500, currency: "KSH" },
        category: "Shoes",
        subcategory: "Women",
        subtype: "Sports",
        description:
          "Lightweight fitness trainers designed for gym workouts and cross-training. Flexible sole with good grip.",
        brand: "FitStep",
        isPopular: true,
        dateAdded: "2025-02-28T10:30:00Z",
        rating: 4.7,
        reviewCount: 118,
        colors: ["Pink/Gray", "Black/Teal", "White/Purple"],
        sizes: ["36", "37", "38", "39", "40", "41"],
        material: "Synthetic Mesh",
        inStock: true,
        stockCount: 38,
        tags: ["Sports", "Women", "Fitness", "Gym"],
        vendorId: 4,
      },
      {
        id: 403,
        name: "Children's School Shoes - Black",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 1500, currency: "KSH" },
        originalPrice: { amount: 1800, currency: "KSH" },
        category: "Shoes",
        subcategory: "Children",
        subtype: "School",
        description: "Durable black school shoes for children. Comfortable for all-day wear with reinforced toe cap.",
        brand: "SchoolStep",
        dateAdded: "2025-03-01T10:30:00Z",
        rating: 4.6,
        reviewCount: 87,
        colors: ["Black"],
        sizes: ["28", "29", "30", "31", "32", "33", "34", "35"],
        material: "Synthetic Leather",
        inStock: true,
        stockCount: 65,
        tags: ["School", "Children", "Formal", "Durable"],
        vendorId: 4,
      },
    ],
  },

  // Electronics Vendors
  {
    id: 5,
    name: "Tech Galaxy",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Your destination for the latest electronics and gadgets. From smartphones to TVs, we have it all.",
    redirectUrl: "https://techgalaxy.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 456,
    deliveryTime: "1-3 days",
    deliveryFee: { amount: 500, currency: "KSH" },
    minimumOrder: { amount: 5000, currency: "KSH" },
    products: [
      {
        id: 501,
        name: "55-inch 4K Smart TV",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 45000, currency: "KSH" },
        originalPrice: { amount: 55000, currency: "KSH" },
        category: "Electronics",
        subcategory: "TVs",
        description:
          "55-inch 4K Ultra HD Smart TV with HDR. Connect to your favorite streaming services and enjoy crystal clear picture quality.",
        brand: "VisionTech",
        isPopular: true,
        dateAdded: "2025-03-10T10:30:00Z",
        rating: 4.8,
        reviewCount: 124,
        features: ["4K Ultra HD", "Smart TV", "HDR", "Wi-Fi", "3 HDMI Ports", "2 USB Ports"],
        inStock: true,
        stockCount: 15,
        tags: ["TV", "Smart TV", "4K", "Entertainment"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 5,
      },
      {
        id: 502,
        name: "Smartphone X Pro - 256GB",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 85000, currency: "KSH" },
        originalPrice: { amount: 95000, currency: "KSH" },
        category: "Electronics",
        subcategory: "Phones",
        description:
          "Latest flagship smartphone with 6.7-inch OLED display, 256GB storage, and advanced camera system.",
        brand: "TechMobile",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.9,
        reviewCount: 87,
        colors: ["Midnight Black", "Silver", "Gold"],
        features: ["6.7-inch OLED", "256GB Storage", "Triple Camera", "5G", "Water Resistant"],
        inStock: true,
        stockCount: 23,
        tags: ["Smartphone", "Mobile", "5G", "Camera"],
        vendorId: 5,
      },
    ],
  },
  {
    id: 6,
    name: "Computer World",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Specialized in computers, laptops, and accessories. We offer the best tech solutions for work and play.",
    redirectUrl: "https://computerworld.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.6,
    reviewCount: 312,
    deliveryTime: "2-4 days",
    deliveryFee: { amount: 600, currency: "KSH" },
    minimumOrder: { amount: 10000, currency: "KSH" },
    products: [
      {
        id: 601,
        name: "15.6-inch Gaming Laptop",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 120000, currency: "KSH" },
        originalPrice: { amount: 135000, currency: "KSH" },
        category: "Electronics",
        subcategory: "Computers & Laptops",
        description:
          "Powerful gaming laptop with 15.6-inch display, dedicated graphics, and RGB keyboard. Perfect for gaming and content creation.",
        brand: "GamePro",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.8,
        reviewCount: 76,
        features: ["15.6-inch FHD", "16GB RAM", "512GB SSD", "Dedicated Graphics", "RGB Keyboard", "Wi-Fi 6"],
        inStock: true,
        stockCount: 12,
        tags: ["Laptop", "Gaming", "High Performance"],
        hotDealEnds: "2025-04-10T23:59:59Z",
        isHotDeal: true,
        vendorId: 6,
      },
      {
        id: 602,
        name: "All-in-One Desktop Computer",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 75000, currency: "KSH" },
        originalPrice: { amount: 85000, currency: "KSH" },
        category: "Electronics",
        subcategory: "Computers & Laptops",
        description: "Sleek all-in-one desktop computer with 27-inch display. Perfect for home office and family use.",
        brand: "TechDesk",
        isPopular: true,
        dateAdded: "2025-02-25T10:30:00Z",
        rating: 4.7,
        reviewCount: 92,
        features: ["27-inch FHD", "8GB RAM", "1TB HDD", "Wireless Keyboard and Mouse", "Built-in Webcam"],
        inStock: true,
        stockCount: 18,
        tags: ["Desktop", "All-in-One", "Home Office"],
        vendorId: 6,
      },
    ],
  },

  // Furniture Vendors
  {
    id: 7,
    name: "Home Comfort",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Quality furniture for your home. Create a comfortable and stylish living space with our collection.",
    redirectUrl: "https://homecomfort.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.5,
    reviewCount: 278,
    deliveryTime: "3-7 days",
    deliveryFee: { amount: 1500, currency: "KSH" },
    minimumOrder: { amount: 10000, currency: "KSH" },
    products: [
      {
        id: 701,
        name: "3-Seater Sofa - Gray",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 35000, currency: "KSH" },
        originalPrice: { amount: 45000, currency: "KSH" },
        category: "Furniture",
        subcategory: "Home Furniture",
        subtype: "Living Room",
        description: "Comfortable 3-seater sofa in elegant gray fabric. Perfect centerpiece for your living room.",
        brand: "ComfortLiving",
        isPopular: true,
        dateAdded: "2025-03-05T10:30:00Z",
        rating: 4.7,
        reviewCount: 86,
        colors: ["Gray", "Blue", "Beige"],
        material: "Fabric",
        features: ["Stain Resistant", "Removable Cushions", "Solid Wood Frame"],
        inStock: true,
        stockCount: 8,
        tags: ["Sofa", "Living Room", "Comfortable", "Modern"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 7,
      },
      {
        id: 702,
        name: "Queen Size Bed Frame - Wooden",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 28000, currency: "KSH" },
        originalPrice: { amount: 32000, currency: "KSH" },
        category: "Furniture",
        subcategory: "Home Furniture",
        subtype: "Bedroom",
        description:
          "Elegant queen size bed frame made from solid wood. Sturdy construction with beautiful natural finish.",
        brand: "SleepWell",
        dateAdded: "2025-02-20T10:30:00Z",
        rating: 4.6,
        reviewCount: 72,
        colors: ["Natural Wood", "Dark Brown", "White"],
        material: "Solid Wood",
        features: ["Queen Size", "Headboard", "Slat Support", "No Box Spring Needed"],
        inStock: true,
        stockCount: 12,
        tags: ["Bed", "Bedroom", "Wooden", "Queen Size"],
        vendorId: 7,
      },
    ],
  },
  {
    id: 8,
    name: "Office Solutions",
    location: "Kisumu, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Professional office furniture for businesses of all sizes. Enhance productivity with ergonomic designs.",
    redirectUrl: "https://officesolutions.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 196,
    deliveryTime: "5-10 days",
    deliveryFee: { amount: 2000, currency: "KSH" },
    minimumOrder: { amount: 20000, currency: "KSH" },
    products: [
      {
        id: 801,
        name: "Ergonomic Office Chair - Black",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 18000, currency: "KSH" },
        originalPrice: { amount: 22000, currency: "KSH" },
        category: "Furniture",
        subcategory: "Office Furniture",
        subtype: "Chairs",
        description:
          "Ergonomic office chair with adjustable height, lumbar support, and breathable mesh back. Perfect for long working hours.",
        brand: "ErgoWork",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.9,
        reviewCount: 68,
        colors: ["Black", "Gray"],
        material: "Mesh and Metal",
        features: ["Adjustable Height", "Lumbar Support", "Swivel", "Armrests", "Breathable Mesh"],
        inStock: true,
        stockCount: 25,
        tags: ["Office", "Chair", "Ergonomic", "Comfortable"],
        hotDealEnds: "2025-04-10T23:59:59Z",
        isHotDeal: true,
        vendorId: 8,
      },
      {
        id: 802,
        name: "Executive Desk - Walnut",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 45000, currency: "KSH" },
        originalPrice: { amount: 55000, currency: "KSH" },
        category: "Furniture",
        subcategory: "Office Furniture",
        subtype: "Desks",
        description:
          "Premium executive desk in walnut finish. Spacious work surface with built-in drawers and cable management.",
        brand: "ExecutivePro",
        isPopular: true,
        dateAdded: "2025-02-28T10:30:00Z",
        rating: 4.8,
        reviewCount: 42,
        colors: ["Walnut", "Mahogany", "Black"],
        material: "Engineered Wood with Veneer",
        features: ["Spacious Surface", "Built-in Drawers", "Cable Management", "Sturdy Construction"],
        inStock: true,
        stockCount: 10,
        tags: ["Office", "Desk", "Executive", "Professional"],
        vendorId: 8,
      },
    ],
  },

  // Snacks & Cakes Vendors
  {
    id: 9,
    name: "Sweet Delights Bakery",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Specializing in custom cakes for all occasions. We make your celebrations sweeter!",
    redirectUrl: "https://sweetdelights.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.9,
    reviewCount: 342,
    verified:true,
    deliveryTime: "1-2 days",
    deliveryFee: { amount: 300, currency: "KSH" },
    minimumOrder: { amount: 1000, currency: "KSH" },
    products: [
      {
        id: 901,
        name: "Chocolate Birthday Cake - 1kg",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 2500, currency: "KSH" },
        originalPrice: { amount: 3000, currency: "KSH" },
        category: "Snacks",
        subcategory: "Birthday Cakes",
        description:
          "Rich chocolate cake with chocolate ganache and customizable birthday message. Perfect for celebrations!",
        brand: "Sweet Delights",
        isPopular: true,
        dateAdded: "2025-03-10T10:30:00Z",
        rating: 4.9,
        reviewCount: 128,
        features: ["1kg Size", "Serves 8-10 People", "Customizable Message", "Premium Ingredients"],
        inStock: true,
        tags: ["Cake", "Birthday", "Chocolate", "Celebration"],
        vendorId: 9,
      },
      {
        id: 902,
        name: "Wedding Cake - 3 Tier",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 15000, currency: "KSH" },
        originalPrice: { amount: 18000, currency: "KSH" },
        category: "Snacks",
        subcategory: "Wedding Cakes",
        description:
          "Elegant 3-tier wedding cake with white fondant and floral decorations. Customizable flavors for each tier.",
        brand: "Sweet Delights",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 5.0,
        reviewCount: 45,
        features: ["3 Tiers", "Serves 50-60 People", "Customizable Flavors", "Premium Decorations"],
        inStock: true,
        tags: ["Cake", "Wedding", "Elegant", "Celebration"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        vendorId: 9,
      },
    ],
  },
  {
    id: 10,
    name: "Pastry Paradise",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Delicious pastries, cookies, and specialty cakes made with the finest ingredients.",
    redirectUrl: "https://pastryparadise.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 267,
    verified:true,
    deliveryTime: "1-3 days",
    deliveryFee: { amount: 250, currency: "KSH" },
    minimumOrder: { amount: 800, currency: "KSH" },
    products: [
      {
        id: 1001,
        name: "Anniversary Celebration Cake",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 3500, currency: "KSH" },
        originalPrice: { amount: 4200, currency: "KSH" },
        category: "Snacks",
        subcategory: "Anniversary Cakes",
        description:
          "Beautiful anniversary cake with customizable message and decorations. Perfect for celebrating special milestones.",
        brand: "Pastry Paradise",
        isNew: true,
        dateAdded: "2025-03-12T10:30:00Z",
        rating: 4.8,
        reviewCount: 56,
        features: ["1.5kg Size", "Serves 12-15 People", "Customizable Message", "Premium Ingredients"],
        inStock: true,
        tags: ["Cake", "Anniversary", "Celebration", "Custom"],
        hotDealEnds: "2025-04-12T23:59:59Z",
        isHotDeal: true,
        vendorId: 10,
      },
      {
        id: 1002,
        name: "Assorted Cookies Box - 24 Pieces",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 1200, currency: "KSH" },
        originalPrice: { amount: 1500, currency: "KSH" },
        category: "Snacks",
        subcategory: "Cookies",
        description:
          "Delicious assortment of 24 freshly baked cookies in various flavors including chocolate chip, oatmeal, and peanut butter.",
        brand: "Pastry Paradise",
        isPopular: true,
        dateAdded: "2025-02-20T10:30:00Z",
        rating: 4.7,
        reviewCount: 98,
        features: ["24 Pieces", "Assorted Flavors", "Freshly Baked", "Gift Box Packaging"],
        inStock: true,
        tags: ["Cookies", "Assorted", "Gift", "Dessert"],
        vendorId: 10,
      },
    ],
  },

  // Stationery Vendors
  {
    id: 11,
    name: "Office Supplies Co.",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Complete range of office stationery and supplies for businesses and professionals.",
    redirectUrl: "https://officesupplies.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.6,
    reviewCount: 215,
    verified:true,
    deliveryTime: "1-3 days",
    deliveryFee: { amount: 250, currency: "KSH" },
    minimumOrder: { amount: 1000, currency: "KSH" },
    products: [
      {
        id: 1101,
        name: "Premium Notebook Set - 3 Pack",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 1200, currency: "KSH" },
        originalPrice: { amount: 1500, currency: "KSH" },
        category: "Stationery",
        subcategory: "Office Stationery",
        description:
          "Set of 3 premium hardcover notebooks with 100 pages each. Ideal for meetings, notes, and planning.",
        brand: "NotePro",
        isPopular: true,
        dateAdded: "2025-03-05T10:30:00Z",
        rating: 4.7,
        reviewCount: 86,
        colors: ["Black", "Blue", "Gray"],
        features: ["A5 Size", "Hardcover", "100 Pages", "Elastic Closure", "Bookmark Ribbon"],
        inStock: true,
        stockCount: 45,
        tags: ["Notebook", "Office", "Writing", "Professional"],
        vendorId: 11,
      },
      {
        id: 1102,
        name: "Executive Pen Set - Black",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 2500, currency: "KSH" },
        originalPrice: { amount: 3000, currency: "KSH" },
        category: "Stationery",
        subcategory: "Office Stationery",
        description: "Elegant executive pen set including ballpoint pen and fountain pen in a premium gift box.",
        brand: "WritePro",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.8,
        reviewCount: 42,
        colors: ["Black/Gold", "Silver/Black"],
        features: ["Ballpoint Pen", "Fountain Pen", "Gift Box", "Refillable"],
        inStock: true,
        stockCount: 28,
        tags: ["Pen", "Executive", "Gift", "Professional"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        vendorId: 11,
      },
    ],
  },
  {
    id: 12,
    name: "School Supplies Store",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Everything students need for school. Quality supplies at affordable prices.",
    redirectUrl: "https://schoolsupplies.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.5,
    reviewCount: 178,
    verified:true,
    deliveryTime: "2-4 days",
    deliveryFee: { amount: 200, currency: "KSH" },
    minimumOrder: { amount: 500, currency: "KSH" },
    products: [
      {
        id: 1201,
        name: "Student Backpack - Blue",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 1800, currency: "KSH" },
        originalPrice: { amount: 2200, currency: "KSH" },
        category: "Stationery",
        subcategory: "School Stationery",
        description:
          "Durable student backpack with multiple compartments. Perfect for carrying books, laptops, and school supplies.",
        brand: "SchoolPro",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.6,
        reviewCount: 92,
        colors: ["Blue", "Black", "Red"],
        features: ["Multiple Compartments", "Padded Laptop Sleeve", "Water Resistant", "Comfortable Straps"],
        inStock: true,
        stockCount: 35,
        tags: ["Backpack", "School", "Student", "Durable"],
        hotDealEnds: "2025-04-10T23:59:59Z",
        isHotDeal: true,
        vendorId: 12,
      },
      {
        id: 1202,
        name: "Complete Art Set for Students",
        imageUrl: "/placeholder.svg?height=300&width=400",
        currentPrice: { amount: 2500, currency: "KSH" },
        originalPrice: { amount: 3000, currency: "KSH" },
        category: "Stationery",
        subcategory: "School Stationery",
        description:
          "Comprehensive art set for students including colored pencils, watercolors, markers, and sketchbook.",
        brand: "ArtMaster",
        isPopular: true,
        dateAdded: "2025-02-28T10:30:00Z",
        rating: 4.8,
        reviewCount: 76,
        features: ["50+ Pieces", "Portable Case", "Quality Materials", "Suitable for All Ages"],
        inStock: true,
        tags: ["Art", "School", "Creative", "Drawing"],
        vendorId: 12,
      },
    ],
  },
]

export default function RetailAndSupermarketPage() {
  useCookieTracking("retail-and-supermarket")

  // State for vendors and products
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors)
  const [newProductAlert, setNewProductAlert] = useState<ProductData | null>(null)

  const retailProducts = transformRetailToProducts(mockVendors)

  // State for active category and subcategory
  const [activeCategory, setActiveCategory] = useState<string>("clothing")
  const [activeSubcategory, setActiveSubcategory] = useState<string>("")
  const [activeSubtype, setActiveSubtype] = useState<string>("")

  // State for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000])
  const [sortOrder, setSortOrder] = useState("default")
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([])

  // State for product detail modal
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null)

  // States for infinite scroll
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)

  const hotDeals = retailProducts.filter(product => 
    product.isHotDeal || 
    (product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount > 0.25 // 25% discount
  )
  .map(product => ({
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl,
    currentPrice: product.currentPrice,
    originalPrice: product.originalPrice,
    category: product.category,
    expiresAt: product.hotDealEnds || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: product.description,
    discount: Math.round(((product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount) * 100)
  }))
  .slice(0, 4)

  // Launch confetti effect on page load
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ec4899", "#8b5cf6", "#06b6d4"], // Pink, purple, and cyan colors
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
          vendor.products.some((product) => {
            return (
              product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
              product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
              product.brand.toLowerCase().includes(lowerCaseSearchTerm) ||
              (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(lowerCaseSearchTerm)))
            )
          }),
      )
    }

    // Filter by category
    if (activeCategory) {
      results = results.filter((vendor) =>
        vendor.products.some((product) => product.category.toLowerCase() === activeCategory.toLowerCase()),
      )
    }

    // Filter by subcategory
    if (activeSubcategory) {
      results = results.filter((vendor) =>
        vendor.products.some((product) => product.subcategory.toLowerCase() === activeSubcategory.toLowerCase()),
      )
    }

    // Filter by subtype
    if (activeSubtype) {
      results = results.filter((vendor) =>
        vendor.products.some(
          (product) => product.subtype && product.subtype.toLowerCase() === activeSubtype.toLowerCase(),
        ),
      )
    }

    // Filter by price range
    results = results.filter((vendor) =>
      vendor.products.some(
        (product) => product.currentPrice.amount >= priceRange[0] && product.currentPrice.amount <= priceRange[1],
      ),
    )

    // Sort results
    if (sortOrder === "price-asc") {
      results.sort((a, b) => {
        const aMinPrice = Math.min(...a.products.map((product) => product.currentPrice.amount))
        const bMinPrice = Math.min(...b.products.map((product) => product.currentPrice.amount))
        return aMinPrice - bMinPrice
      })
    } else if (sortOrder === "price-desc") {
      results.sort((a, b) => {
        const aMaxPrice = Math.max(...a.products.map((product) => product.currentPrice.amount))
        const bMaxPrice = Math.max(...b.products.map((product) => product.currentPrice.amount))
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
        const aNewest = Math.max(...a.products.map((product) => new Date(product.dateAdded).getTime()))
        const bNewest = Math.max(...b.products.map((product) => new Date(product.dateAdded).getTime()))
        return bNewest - aNewest
      })
    }

    setFilteredVendors(results)
  }, [searchTerm, activeCategory, activeSubcategory, activeSubtype, priceRange, sortOrder, vendors])

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

 // Custom color scheme for retail and supermarket
 const retailColorScheme = {
  primary: "from-blue-500 to-green-700",
  secondary: "bg-blue-100",
  accent: "bg-green-600",
  text: "text-emerald-900",
  background: "bg-emerald-50",
}

  // Get the active category object
  const activeCategoryObj = categories.find((cat) => cat.id === activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-pink-500/10 to-purple-500/10 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-l from-indigo-500/10 to-pink-500/10 -z-10"></div>

      <div className="container mx-auto px-4 py-8 max-w-[1920px] relative z-10">
        {/* Header with animated gradient text */}
        <div className="text-center mb-10">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Retail & Supermarket
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover amazing deals on clothing, electronics, furniture, and more from top retailers
          </motion.p>
        </div>

        {/* Countdown Timer */}
        <div className="mb-8">
          <CountdownTimer targetDate="2025-05-31T23:59:59" startDate="2025-03-01T00:00:00" />
        </div>

        {/* Hot Time Deals Section */}
        {hotDeals.length > 0 && (
          <HotTimeDeals
            deals={hotDeals}
            colorScheme="purple"
            title="Limited Time Retail Offers"
            subtitle="Grab these exclusive deals before they expire!"
          />
        )}

        {/* New Products For You Section */}
        <NewProductsForYou 
        allProducts={retailProducts}
        colorScheme="green"
        maxProducts={4}
      />

      {/* Trending and Popular Section */}
      <TrendingPopularSection
        trendingProducts={trendingProducts}
        popularProducts={popularProducts}
        colorScheme={retailColorScheme}
        title="Market Favorites"
        subtitle="See what's trending and most popular"
      />

{/*retail-and-supermarket shop*/}
    <div className="flex flex-wrap gap-4 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
              <Link href="/retail-and-supermarket/shop">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 transition-transform hover:scale-105"
                >
                  Shop Now in our Village Markets!
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              </div>
    {/*retail-and-supermarket shop*/}
    <div className="flex flex-wrap gap-4 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
              <Link href="/retail-and-supermarket/flour">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 transition-transform hover:scale-105"
                >
                  Shop Now in our Flour Markets!
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              </div>
              
              
        {/* Enhanced search section */}
        <div className="mb-10 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100">
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Search for products, brands, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pr-12 rounded-lg border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 bg-white text-gray-800 placeholder-gray-400 text-lg"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-500" size={24} />
          </div>

          {/* Category tabs */}
          <Tabs defaultValue={activeCategory} value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center justify-center gap-2">
                  {category.icon}
                  <span>{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Subcategory selection */}
          {activeCategoryObj && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-gray-700">Subcategories</h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={activeSubcategory === "" ? "default" : "outline"}
                  className={`cursor-pointer ${activeSubcategory === "" ? "bg-purple-500" : "hover:bg-purple-100"}`}
                  onClick={() => {
                    setActiveSubcategory("")
                    setActiveSubtype("")
                  }}
                >
                  All {activeCategoryObj.name}
                </Badge>
                {activeCategoryObj.subcategories.map((subcategory) => (
                  <Badge
                    key={subcategory.id}
                    variant={activeSubcategory === subcategory.id ? "default" : "outline"}
                    className={`cursor-pointer ${
                      activeSubcategory === subcategory.id ? "bg-purple-500" : "hover:bg-purple-100"
                    }`}
                    onClick={() => {
                      setActiveSubcategory(subcategory.id)
                      setActiveSubtype("")
                    }}
                  >
                    {subcategory.icon || getSubcategoryIcon(activeCategoryObj.id, subcategory.id, 14)}
                    <span className="ml-1">{subcategory.name}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Subtype selection (if applicable) */}
          {activeSubcategory && activeCategoryObj && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-gray-700">Types</h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={activeSubtype === "" ? "default" : "outline"}
                  className={`cursor-pointer ${activeSubtype === "" ? "bg-indigo-500" : "hover:bg-indigo-100"}`}
                  onClick={() => setActiveSubtype("")}
                >
                  All Types
                </Badge>
                {activeCategoryObj.subcategories
                  .find((sub) => sub.id === activeSubcategory)
                  ?.subtypes?.map((subtype) => (
                    <Badge
                      key={subtype.id}
                      variant={activeSubtype === subtype.id ? "default" : "outline"}
                      className={`cursor-pointer ${
                        activeSubtype === subtype.id ? "bg-indigo-500" : "hover:bg-indigo-100"
                      }`}
                      onClick={() => setActiveSubtype(subtype.id)}
                    >
                      {subtype.name}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Price range filter */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-gray-700">
              Price Range: {formatPrice({ amount: priceRange[0], currency: "KSH" })} -{" "}
              {formatPrice({ amount: priceRange[1], currency: "KSH" })}
            </h3>
            <div className="px-2 py-4">
              <Slider
                defaultValue={[0, 150000]}
                max={150000}
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
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredVendors.reduce(
                  (count, vendor) =>
                    count +
                    vendor.products.filter(
                      (product) =>
                        (!activeCategory || product.category.toLowerCase() === activeCategory.toLowerCase()) &&
                        (!activeSubcategory || product.subcategory.toLowerCase() === activeSubcategory.toLowerCase()) &&
                        (!activeSubtype ||
                          (product.subtype && product.subtype.toLowerCase() === activeSubtype.toLowerCase())),
                    ).length,
                  0,
                )}{" "}
                products found
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="p-2 border rounded-md text-sm bg-white"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest First</option>
              </select>
              <ArrowUpDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
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
                activeSubtype={activeSubtype}
                onProductClick={setSelectedProduct}
                isExpanded={expandedAccordions.includes(vendor.id.toString())}
                onToggle={() => toggleAccordion(vendor.id.toString())}
              />
            ))
          ) : (
            <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-8 text-center shadow-md">
              <p className="text-gray-600 text-lg">No vendors found matching your criteria.</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center bg-white/80 p-6 rounded-full backdrop-blur-sm">
              <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
              <p className="mt-2 text-purple-600 font-medium">Loading more products...</p>
            </div>
          </div>
        )}

        {/* Loader reference element */}
        <div ref={loaderRef} className="h-20"></div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <ProductDetailView product={selectedProduct} onClose={() => setSelectedProduct(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Vendor Section Component
function VendorSection({
  vendor,
  activeCategory,
  activeSubcategory,
  activeSubtype,
  onProductClick,
  isExpanded,
  onToggle,
}: {
  vendor: Vendor
  activeCategory: string
  activeSubcategory: string
  activeSubtype: string
  onProductClick: (product: ProductData) => void
  isExpanded: boolean
  onToggle: () => void
}) {
  const [imageError, setImageError] = useState(false)

  // Filter products based on active filters
  const filteredProducts = vendor.products.filter(
    (product) =>
      (!activeCategory || product.category.toLowerCase() === activeCategory.toLowerCase()) &&
      (!activeSubcategory || product.subcategory.toLowerCase() === activeSubcategory.toLowerCase()) &&
      (!activeSubtype || (product.subtype && product.subtype.toLowerCase() === activeSubtype.toLowerCase())),
  )

  if (filteredProducts.length === 0) return null

  // Get color scheme based on active category
  const colors = getCategoryColors(activeCategory || filteredProducts[0].category)

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className={`p-6 bg-gradient-to-r ${colors.lightGradient}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <Image
                src={imageError ? "/placeholder.svg?height=60&width=60" : vendor.logo}
                alt={vendor.name}
                width={60}
                height={60}
                className="rounded-full border-2 border-white shadow-md"
                onError={() => setImageError(true)}
              />
               {vendor.verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <h3 className={`text-xl font-bold ${colors.text}`}>{vendor.name}</h3>
              <div className="flex items-center">
                <p className="text-gray-600 text-sm mr-2">{vendor.location}</p>
                {vendor.rating && (
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(vendor.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-gray-600">
                      {vendor.rating.toFixed(1)} ({vendor.reviewCount})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 hidden md:block">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3" />
                <span>Delivery: {vendor.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span>Min. Order: {formatPrice(vendor.minimumOrder || { amount: 0, currency: "KSH" })}</span>
              </div>
            </div>
            <a
              href={vendor.redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${colors.button} text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap`}
            >
              Visit Store
            </a>
          </div>
        </div>
        <p className="text-gray-700 mb-4 line-clamp-2">{vendor.description}</p>

        {/* Accordion control */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full mt-2 text-sm font-medium text-gray-600 hover:text-gray-900"
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

      {/* Products grid */}
      <div
        className={`p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-all duration-300 ${
          isExpanded ? "max-h-[2000px]" : "max-h-[400px] overflow-hidden"
        }`}
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
        ))}
      </div>
    </div>
  )
}
function MostPreferredBadge() {
  return (
    <motion.div
      className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center"
      animate={{ 
        scale: [1, 1.1, 1],
        boxShadow: [
          "0 4px 6px rgba(0, 0, 0, 0.1)",
          "0 10px 15px rgba(0, 0, 0, 0.2)",
          "0 4px 6px rgba(0, 0, 0, 0.1)"
        ]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      <TrendingUp className="h-3 w-3 mr-1" />
      <span>most-preferred</span>
    </motion.div>
  );
}

// Product Card Component
function ProductCard({ product, onClick }: { product: ProductData; onClick: () => void }) {
  const [imageError, setImageError] = useState(false)
  const colors = getCategoryColors(product.category)

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount) * 100,
  )

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full border border-gray-100"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="relative">
        <div className="relative pt-[75%]">
          <Image
            src={imageError ? "/placeholder.svg?height=300&width=400" : product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-all duration-500 hover:scale-110"
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

          {product.isNew && (
            <div className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              NEW
            </div>
          )}
        </div>

        {/* Most preferred badge */}
        {product.isPopular && (
          <div className="absolute top-2 left-2">
            <MostPreferredBadge  />
          </div>
        )}

        {/* New this week badge */}
        {isNewThisWeek(product.dateAdded) && !product.isNew && (
          <div className="absolute bottom-2 left-2">
            <NewThisWeekBadge />
          </div>
        )}
      </div>

      


      <div className="p-3 flex-grow flex flex-col">
        <div className="mb-1 flex items-center">
          <Badge variant="outline" className={`text-xs ${colors.badge}`}>
            {product.subcategory}
          </Badge>
          {product.subtype && <span className="ml-2 text-xs text-gray-500">{product.subtype}</span>}
        </div>

        <h4 className={`font-semibold ${colors.text} mb-1 line-clamp-1`}>{product.name}</h4>

        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>

        <p className="text-xs text-gray-600 mb-2 line-clamp-2 flex-grow">{product.description}</p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-600">
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <div className={`text-base font-bold ${colors.highlight}`}>{formatPrice(product.currentPrice)}</div>
            <div className="text-xs text-gray-500 line-through">{formatPrice(product.originalPrice)}</div>
          </div>

          <motion.button
            className={`${colors.button} text-white px-3 py-1.5 rounded-md text-xs font-medium`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              // Add to cart functionality would go here
            }}
          >
            <ShoppingCart className="h-3 w-3 mr-1 inline" />
            View
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// Product Detail View Component
function ProductDetailView({ product, onClose }: { product: ProductData; onClose: () => void }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "")
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "")
  const [activeImage, setActiveImage] = useState(0)

  const colors = getCategoryColors(product.category)

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount) * 100,
  )

  // Get all images (main image + additional images)
  const allImages = [product.imageUrl, ...(product.images || [])]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Image gallery */}
      <div>
        <div className="relative rounded-lg overflow-hidden mb-4 aspect-square">
          <Image
            src={allImages[activeImage] || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />

          {discountPercentage >= 15 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold shadow-md">
              {discountPercentage}% OFF
            </div>
          )}
        </div>

        {/* Thumbnail gallery */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.map((img, index) => (
              <div
                key={index}
                className={`relative w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
                  activeImage === index ? `${colors.border}` : "border-transparent"
                }`}
                onClick={() => setActiveImage(index)}
              >
                <Image
                  src={img || "/placeholder.svg?height=80&width=80"}
                  alt={`${product.name} - view ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product details */}
      <div className="flex flex-col">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className={colors.badge}>
              {product.category}
            </Badge>
            <Badge variant="outline" className={colors.badge}>
              {product.subcategory}
            </Badge>
            {product.subtype && (
              <Badge variant="outline" className={colors.badge}>
                {product.subtype}
              </Badge>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>

          <div className="flex items-center gap-4 mb-2">
            <p className="text-gray-600">
              Brand: <span className="font-medium">{product.brand}</span>
            </p>

            {product.rating && (
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-600">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-end gap-3 mb-4">
            <div className={`text-3xl font-bold ${colors.highlight}`}>{formatPrice(product.currentPrice)}</div>
            <div className="text-lg text-gray-500 line-through">{formatPrice(product.originalPrice)}</div>
            {discountPercentage > 0 && <div className="text-red-500 font-medium">Save {discountPercentage}%</div>}
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>
        </div>

        {/* Color selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Color</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedColor === color
                      ? `${colors.button} text-white`
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedSize === size
                      ? `${colors.button} text-white`
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Features</h3>
            <ul className="list-disc list-inside text-gray-600 text-sm">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Material */}
        {product.material && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Material</h3>
            <p className="text-gray-600 text-sm">{product.material}</p>
          </div>
        )}

        {/* Quantity selector */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Quantity</h3>
          <div className="flex items-center">
            <button
              className="p-2 rounded-l-md bg-gray-100 hover:bg-gray-200"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="px-4 py-2 bg-gray-50 border-t border-b border-gray-200 text-center min-w-[40px]">
              {quantity}
            </div>
            <button
              className="p-2 rounded-r-md bg-gray-100 hover:bg-gray-200"
              onClick={() => setQuantity((prev) => Math.min(product.stockCount || 10, prev + 1))}
            >
              <Plus className="h-4 w-4" />
            </button>

            <div className="ml-4 text-sm text-gray-600">
              {product.inStock ? (
                <span className="text-green-600">In Stock ({product.stockCount || "Available"})</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mt-auto">
          <Button className={`${colors.button} flex-1`} disabled={!product.inStock}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            View Product
          </Button>

          <Button variant="outline" className={`flex-1 ${colors.highlight}`}>
            <Percent className="h-4 w-4 mr-2" />
            Save {discountPercentage}% (
            {formatPrice({
              amount: product.originalPrice.amount - product.currentPrice.amount,
              currency: product.currentPrice.currency,
            })}
            )
          </Button>
        </div>

        {/* Product availability */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Tag className="h-4 w-4 text-gray-500" />
            <span>
              {product.inStock ? (
                <span className="text-green-600">In Stock ({product.stockCount || "Available"})</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

