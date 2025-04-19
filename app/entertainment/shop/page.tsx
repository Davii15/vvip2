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
  Store,
  Info,
  ExternalLink,
  Check,
  Layers,
  DollarSign,
  Tag,
  RefreshCw,
  SearchX,
  ShirtIcon,
  Footprints,
  Dumbbell,
  Bike,
  Music,
  Piano,
  Drumstick,
  Guitar,
  PianoIcon as Violin,
  Users,
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
import CountdownTimer from "@/components/CountdownTimer"
import HotTimeDeals from "@/components/HotTimeDeals"
import NewProductsForYou from "@/components/NewProductsForYou"
import { useCookieTracking } from "@/hooks/useCookieTracking"
import { swapArrayElementsRandomly } from "@/utils/swap-utils"
import { isNewThisWeek } from "@/utils/date-utils"
import MostPreferredBadge from "@/components/most-preferred-badge"
import TrendingPopularSection from "@/components/TrendingPopularSection"
import { trendingProducts, popularProducts } from "./trending-data"
import Link from "next/link"
import SportsRecommendations from "@/components/recommendations/sports-recommendations"

// Types
interface Price {
  amount: number
  currency: string
}

interface SportsProduct {
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
  sizes?: string[]
  gender?: "Men" | "Women" | "Unisex"
  material?: string
  sport?: string
  instrumentType?: string
  skillLevel?: "Beginner" | "Intermediate" | "Professional" | "All Levels"
}

interface Vendor {
  id: number | string
  name: string
  location: string
  logo: string
  description: string
  products: SportsProduct[]
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
    id: "mens-apparel",
    name: "Men's Apparel",
    icon: <ShirtIcon className="mr-2" />,
    brands: ["Nike", "Adidas", "Puma", "Under Armour", "New Balance", "Reebok", "Asics", "Fila", "Lululemon", "Umbro"],
  },
  {
    id: "womens-apparel",
    name: "Women's Apparel",
    icon: <ShirtIcon className="mr-2" />,
    brands: [
      "Nike",
      "Adidas",
      "Puma",
      "Under Armour",
      "New Balance",
      "Lululemon",
      "Reebok",
      "Asics",
      "Fila",
      "Athleta",
    ],
  },
  {
    id: "footwear",
    name: "Footwear",
    icon: <Footprints className="mr-2" />,
    brands: [
      "Nike",
      "Adidas",
      "Puma",
      "Under Armour",
      "New Balance",
      "Asics",
      "Reebok",
      "Skechers",
      "Converse",
      "Vans",
    ],
  },
  {
    id: "fitness",
    name: "Fitness Equipment",
    icon: <Dumbbell className="mr-2" />,
    brands: [
      "Technogym",
      "Life Fitness",
      "Bowflex",
      "NordicTrack",
      "Precor",
      "Concept2",
      "Rogue Fitness",
      "ProForm",
      "Marcy",
      "Weider",
    ],
  },
  {
    id: "cycling",
    name: "Cycling",
    icon: <Bike className="mr-2" />,
    brands: ["Trek", "Specialized", "Giant", "Cannondale", "Scott", "BMC", "Cervélo", "Bianchi", "Merida", "Pinarello"],
  },
  {
    id: "team-sports",
    name: "Team Sports",
    icon: <Users className="mr-2" />,
    brands: ["Nike", "Adidas", "Puma", "Under Armour", "Wilson", "Spalding", "Mikasa", "Molten", "Umbro", "Select"],
  },
  {
    id: "guitars",
    name: "Guitars",
    icon: <Guitar className="mr-2" />,
    brands: ["Fender", "Gibson", "Ibanez", "Yamaha", "Epiphone", "PRS", "Taylor", "Martin", "Jackson", "ESP"],
  },
  {
    id: "keyboards",
    name: "Keyboards & Pianos",
    icon: <Piano className="mr-2" />,
    brands: ["Yamaha", "Roland", "Casio", "Korg", "Nord", "Kawai", "Steinway", "Kurzweil", "Alesis", "Novation"],
  },
  {
    id: "drums",
    name: "Drums & Percussion",
    icon: <Drumstick className="mr-2" />,
    brands: ["Pearl", "Tama", "DW", "Yamaha", "Ludwig", "Gretsch", "Mapex", "Sonor", "Zildjian", "Sabian"],
  },
  {
    id: "string-instruments",
    name: "String Instruments",
    icon: <Violin className="mr-2" />,
    brands: [
      "Yamaha",
      "Stentor",
      "Eastman",
      "Knilling",
      "Cecilio",
      "Cremona",
      "D'Addario",
      "Thomastik",
      "Pirastro",
      "Dominant",
    ],
  },
]

// Mock data for vendors and products
const mockVendors: Vendor[] = [
  // Sports Apparel Vendor
  {
    id: 1,
    name: "SportStyle Kenya",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Premier destination for authentic sports apparel and footwear from top global brands with exclusive deals.",
    redirectUrl: "https://sportstyle.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 356,
    verified: true,
    establishedYear: 2015,
    contactNumber: "+254 712 345 678",
    email: "info@sportstyle.co.ke",
    website: "https://sportstyle.co.ke",
    deliveryInfo: "Free delivery within Nairobi. 2-3 days nationwide delivery.",
    returnPolicy: "14-day return policy for unworn items with original tags.",
    warrantyInfo: "All products come with manufacturer warranty against defects.",
    products: [
      {
        id: 101,
        name: "Nike Dri-FIT Men's Running T-Shirt",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 2500, currency: "KSH" },
        originalPrice: { amount: 3500, currency: "KSH" },
        category: "Men's Apparel",
        subcategory: "T-Shirts",
        brand: "Nike",
        description:
          "Stay cool and dry during your runs with this lightweight Nike Dri-FIT t-shirt that wicks away sweat for comfortable performance.",
        specifications: {
          material: "100% Polyester",
          fit: "Regular",
          sleeve: "Short sleeve",
          neckline: "Crew neck",
          care: "Machine washable",
          origin: "Imported",
        },
        features: [
          "Dri-FIT technology wicks sweat away",
          "Lightweight fabric",
          "Reflective elements for visibility",
          "Flatlock seams to prevent chafing",
          "Mesh panels for ventilation",
        ],
        isPopular: true,
        dateAdded: "2025-03-10T10:30:00Z",
        rating: 4.7,
        reviewCount: 128,
        stockStatus: "In Stock",
        stockCount: 45,
        tags: ["Running", "Training", "Dri-FIT", "Summer"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 1,
        warrantyPeriod: "30 days",
        colors: ["Black", "Blue", "Red", "Grey"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        gender: "Men",
        material: "Polyester",
        sport: "Running",
        discount: 29,
      },
      {
        id: 102,
        name: "Adidas Ultraboost 22 Women's Running Shoes",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 12000, currency: "KSH" },
        originalPrice: { amount: 18000, currency: "KSH" },
        category: "Footwear",
        subcategory: "Running Shoes",
        brand: "Adidas",
        description:
          "Experience incredible energy return and comfort with these Adidas Ultraboost 22 running shoes, designed specifically for women's feet.",
        specifications: {
          material: "Primeknit textile upper, Boost midsole",
          closure: "Lace-up",
          cushioning: "Boost technology",
          outsole: "Continental™ Rubber",
          weight: "283g (size UK 5.5)",
          drop: "10mm (heel 32mm / forefoot 22mm)",
        },
        features: [
          "Responsive Boost midsole",
          "Supportive Primeknit upper",
          "Linear Energy Push system",
          "Continental™ Rubber outsole for traction",
          "Women-specific fit",
          "Made with recycled materials",
        ],
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.9,
        reviewCount: 76,
        stockStatus: "Low Stock",
        stockCount: 8,
        tags: ["Running", "Boost", "Women", "Performance"],
        vendorId: 1,
        isTrending: true,
        warrantyPeriod: "60 days",
        colors: ["Cloud White", "Core Black", "Pink", "Grey"],
        sizes: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7"],
        gender: "Women",
        material: "Primeknit/Rubber",
        sport: "Running",
        discount: 33,
      },
      {
        id: 103,
        name: "Under Armour Men's HeatGear Compression Leggings",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 3200, currency: "KSH" },
        originalPrice: { amount: 4500, currency: "KSH" },
        category: "Men's Apparel",
        subcategory: "Compression Wear",
        brand: "Under Armour",
        description:
          "Train harder and recover faster with these Under Armour compression leggings featuring HeatGear technology for cool, dry comfort.",
        specifications: {
          material: "84% Polyester, 16% Elastane",
          fit: "Compression",
          length: "Full length",
          waistband: "Elastic waistband",
          care: "Machine washable",
          origin: "Imported",
        },
        features: [
          "HeatGear fabric keeps you cool and dry",
          "4-way stretch construction",
          "Strategic ventilation",
          "Moisture-wicking technology",
          "Anti-odor technology",
          "Ergonomic flatlock seams",
        ],
        isPopular: false,
        dateAdded: "2025-02-15T10:30:00Z",
        rating: 4.6,
        reviewCount: 92,
        stockStatus: "In Stock",
        stockCount: 25,
        tags: ["Training", "Compression", "Recovery", "Base Layer"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        vendorId: 1,
        warrantyPeriod: "30 days",
        colors: ["Black", "Navy", "Grey"],
        sizes: ["S", "M", "L", "XL"],
        gender: "Men",
        material: "Polyester/Elastane",
        sport: "Training",
        discount: 29,
      },
    ],
  },
  // Women's Sportswear Vendor
  {
    id: 2,
    name: "FitFashion",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Specialized in premium women's sportswear and activewear with a focus on style, comfort, and performance.",
    redirectUrl: "https://fitfashion.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 245,
    verified: true,
    establishedYear: 2017,
    contactNumber: "+254 723 456 789",
    email: "info@fitfashion.co.ke",
    website: "https://fitfashion.co.ke",
    deliveryInfo: "Free delivery within Mombasa. Nationwide delivery available.",
    returnPolicy: "21-day return policy for unworn items with original tags.",
    warrantyInfo: "Quality guarantee on all products.",
    products: [
      {
        id: 201,
        name: "Lululemon Align High-Rise Yoga Pants",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 8500, currency: "KSH" },
        originalPrice: { amount: 12000, currency: "KSH" },
        category: "Women's Apparel",
        subcategory: "Leggings",
        brand: "Lululemon",
        description:
          "Experience buttery-soft comfort with these Lululemon Align high-rise yoga pants designed to give you the freedom to move.",
        specifications: {
          material: "Nulu™ fabric (81% Nylon, 19% Lycra® elastane)",
          rise: "High-rise",
          length: "Full length",
          waistband: "Wide, flat waistband",
          pockets: "Hidden waistband pocket",
          care: "Machine wash cold, lay flat to dry",
        },
        features: [
          "Buttery-soft Nulu™ fabric",
          "Four-way stretch",
          "Sweat-wicking",
          "Breathable",
          "Lightweight",
          "Minimal seams for comfort",
        ],
        isPopular: true,
        dateAdded: "2025-02-20T10:30:00Z",
        rating: 4.9,
        reviewCount: 178,
        stockStatus: "In Stock",
        stockCount: 22,
        tags: ["Yoga", "Training", "Lifestyle", "Premium"],
        isAlmostSoldOut: false,
        vendorId: 2,
        warrantyPeriod: "30 days",
        colors: ["Black", "Navy", "Burgundy", "Olive"],
        sizes: ["XS", "S", "M", "L", "XL"],
        gender: "Women",
        material: "Nylon/Lycra",
        sport: "Yoga",
        discount: 29,
      },
      {
        id: 202,
        name: "Nike Pro Women's Dri-FIT Sports Bra",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 2200, currency: "KSH" },
        originalPrice: { amount: 3500, currency: "KSH" },
        category: "Women's Apparel",
        subcategory: "Sports Bras",
        brand: "Nike",
        description:
          "Get the support you need during workouts with this Nike Pro sports bra featuring Dri-FIT technology and a racerback design.",
        specifications: {
          material: "Dri-FIT 88% Recycled Polyester, 12% Spandex",
          support: "Medium support",
          padding: "Removable pads",
          closure: "Pull-on design",
          straps: "Racerback",
          care: "Machine washable",
        },
        features: [
          "Dri-FIT technology wicks sweat",
          "Racerback design for mobility",
          "Compression fit for support",
          "Removable pads for customizable coverage",
          "Elastic chest band for secure fit",
          "Made with at least 50% recycled polyester fibers",
        ],
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.7,
        reviewCount: 95,
        stockStatus: "Low Stock",
        stockCount: 10,
        tags: ["Training", "Running", "Medium Support", "Sustainable"],
        hotDealEnds: "2025-04-10T23:59:59Z",
        isHotDeal: true,
        vendorId: 2,
        warrantyPeriod: "30 days",
        colors: ["Black", "White", "Pink", "Blue"],
        sizes: ["XS", "S", "M", "L", "XL"],
        gender: "Women",
        material: "Recycled Polyester/Spandex",
        sport: "Training",
        discount: 37,
      },
    ],
  },
  // Fitness Equipment Vendor
  {
    id: 3,
    name: "FitKit Kenya",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Your trusted source for quality fitness equipment, from home gym essentials to professional training gear.",
    redirectUrl: "https://fitkit.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 312,
    verified: true,
    establishedYear: 2016,
    contactNumber: "+254 734 567 890",
    email: "info@fitkit.co.ke",
    website: "https://fitkit.co.ke",
    deliveryInfo: "Free delivery within Nairobi for orders over KSH 10,000. Assembly service available.",
    returnPolicy: "14-day return policy for unused equipment in original packaging.",
    warrantyInfo: "All equipment comes with manufacturer warranty. Extended warranty options available.",
    products: [
      {
        id: 301,
        name: "Adjustable Dumbbell Set (5-25kg)",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 18500, currency: "KSH" },
        originalPrice: { amount: 25000, currency: "KSH" },
        category: "Fitness Equipment",
        subcategory: "Weights",
        brand: "Bowflex",
        description:
          "Save space and maximize your workout with this adjustable dumbbell set that replaces 15 sets of weights in one compact solution.",
        specifications: {
          weightRange: "5-25kg per dumbbell",
          adjustmentMechanism: "Dial system",
          increments: "2.5kg",
          material: "Steel with rubber grip",
          dimensions: "40cm x 20cm x 23cm (per dumbbell)",
          weight: "25kg (per dumbbell at maximum setting)",
        },
        features: [
          "Space-saving design",
          "Quick weight adjustment with dial system",
          "Replaces 15 sets of dumbbells",
          "Durable construction",
          "Comfortable rubber grip",
          "Storage tray included",
        ],
        isPopular: true,
        dateAdded: "2025-03-05T10:30:00Z",
        rating: 4.8,
        reviewCount: 86,
        stockStatus: "In Stock",
        stockCount: 12,
        tags: ["Strength Training", "Home Gym", "Space-Saving", "Adjustable"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 3,
        isTrending: true,
        warrantyPeriod: "2 years",
        gender: "Unisex",
        sport: "Strength Training",
        discount: 26,
      },
      {
        id: 302,
        name: "Premium Yoga Mat with Alignment Lines",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 3500, currency: "KSH" },
        originalPrice: { amount: 5000, currency: "KSH" },
        category: "Fitness Equipment",
        subcategory: "Yoga",
        brand: "Lululemon",
        description:
          "Enhance your yoga practice with this premium non-slip mat featuring alignment lines to help perfect your poses.",
        specifications: {
          material: "Natural rubber base with polyurethane top layer",
          thickness: "5mm",
          dimensions: "180cm x 66cm",
          weight: "2.5kg",
          features: "Alignment lines, non-slip surface",
          care: "Wipe clean with damp cloth and mild soap",
        },
        features: [
          "Alignment lines for proper positioning",
          "Non-slip surface even when wet",
          "Optimal 5mm cushioning",
          "Antimicrobial additive prevents mold and mildew",
          "Closed-cell construction prevents sweat absorption",
          "Includes carrying strap",
        ],
        isNew: true,
        dateAdded: "2025-03-12T10:30:00Z",
        rating: 4.7,
        reviewCount: 64,
        stockStatus: "Low Stock",
        stockCount: 8,
        tags: ["Yoga", "Pilates", "Premium", "Non-Slip"],
        vendorId: 3,
        warrantyPeriod: "1 year",
        colors: ["Purple", "Blue", "Black", "Green"],
        gender: "Unisex",
        sport: "Yoga",
        discount: 30,
      },
    ],
  },
  // Team Sports Vendor
  {
    id: 4,
    name: "TeamSports Kenya",
    location: "Kisumu, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Specialized in team sports equipment and apparel for football, basketball, volleyball, and more.",
    redirectUrl: "https://teamsports.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.6,
    reviewCount: 228,
    verified: true,
    establishedYear: 2014,
    contactNumber: "+254 745 678 901",
    email: "info@teamsports.co.ke",
    website: "https://teamsports.co.ke",
    deliveryInfo: "Free delivery within Kisumu. Team orders with custom printing available.",
    returnPolicy: "7-day return policy for unused items in original packaging.",
    warrantyInfo: "Manufacturer warranty on all equipment.",
    products: [
      {
        id: 401,
        name: "Adidas Predator Edge Football Boots",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 12000, currency: "KSH" },
        originalPrice: { amount: 18000, currency: "KSH" },
        category: "Footwear",
        subcategory: "Football Boots",
        brand: "Adidas",
        description:
          "Dominate the pitch with these Adidas Predator Edge boots featuring innovative Zone Skin technology for superior ball control.",
        specifications: {
          material: "Synthetic upper with rubber elements",
          closure: "Lace-up",
          outsole: "Firm ground (FG) studs",
          weight: "230g (size UK 8.5)",
          collar: "Low-cut",
          insole: "Removable",
        },
        features: [
          "Zone Skin technology for ball control",
          "Faceted frame for stability",
          "Lightweight design",
          "Control frame outsole",
          "Engineered for precision passing and shooting",
          "Recycled materials used in construction",
        ],
        isPopular: true,
        dateAdded: "2025-02-25T10:30:00Z",
        rating: 4.8,
        reviewCount: 72,
        stockStatus: "In Stock",
        stockCount: 15,
        tags: ["Football", "Soccer", "Boots", "Firm Ground"],
        vendorId: 4,
        warrantyPeriod: "6 months",
        colors: ["Core Black/Red", "White/Blue", "Solar Green"],
        sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
        gender: "Unisex",
        sport: "Football",
        discount: 33,
      },
      {
        id: 402,
        name: "Wilson NCAA Official Basketball",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 5500, currency: "KSH" },
        originalPrice: { amount: 8000, currency: "KSH" },
        category: "Team Sports",
        subcategory: "Basketball",
        brand: "Wilson",
        description:
          "Experience professional-level play with this Wilson NCAA official basketball featuring composite leather construction for excellent grip and durability.",
        specifications: {
          material: "Composite leather",
          size: 'Size 7 (29.5")',
          construction: "Cushion core technology",
          inflation: "8-10 PSI",
          surface: "Indoor/Outdoor",
          official: "NCAA approved",
        },
        features: [
          "Official NCAA game ball",
          "Composite leather cover",
          "Cushion Core Technology",
          "Deep channel design for superior grip",
          "Suitable for indoor and outdoor play",
          "Inflation retention technology",
        ],
        isNew: false,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.7,
        reviewCount: 58,
        stockStatus: "In Stock",
        stockCount: 20,
        tags: ["Basketball", "NCAA", "Official", "Indoor/Outdoor"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        vendorId: 4,
        warrantyPeriod: "1 year",
        gender: "Unisex",
        sport: "Basketball",
        discount: 31,
      },
    ],
  },
  // Musical Instruments Vendor
  {
    id: 5,
    name: "MusicHub Kenya",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Premier destination for quality musical instruments, from beginner to professional grade, with expert advice and after-sales support.",
    redirectUrl: "https://musichub.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.9,
    reviewCount: 276,
    verified: true,
    establishedYear: 2013,
    contactNumber: "+254 756 789 012",
    email: "info@musichub.co.ke",
    website: "https://musichub.co.ke",
    deliveryInfo: "Free delivery within Nairobi for orders over KSH 15,000. Nationwide delivery available.",
    returnPolicy: "14-day return policy for unused instruments in original packaging.",
    warrantyInfo: "All instruments come with manufacturer warranty. Extended warranty options available.",
    products: [
      {
        id: 501,
        name: "Yamaha F310 Acoustic Guitar",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 15000, currency: "KSH" },
        originalPrice: { amount: 22000, currency: "KSH" },
        category: "Guitars",
        subcategory: "Acoustic",
        brand: "Yamaha",
        description:
          "Start your musical journey with this Yamaha F310 acoustic guitar, offering great sound quality and playability at an affordable price.",
        specifications: {
          type: "Dreadnought acoustic guitar",
          topWood: "Spruce",
          backAndSides: "Meranti",
          neck: "Nato",
          fingerboard: "Rosewood",
          bridge: "Rosewood",
          strings: "6 steel strings",
        },
        features: [
          "Full-size dreadnought body",
          "Spruce top for bright, clear tone",
          "Rosewood fingerboard for smooth playability",
          "Chrome die-cast tuners for tuning stability",
          "Includes gig bag",
          "Perfect for beginners and intermediate players",
        ],
        isPopular: true,
        dateAdded: "2025-03-08T10:30:00Z",
        rating: 4.7,
        reviewCount: 112,
        stockStatus: "In Stock",
        stockCount: 10,
        tags: ["Guitar", "Acoustic", "Beginner", "Yamaha"],
        hotDealEnds: "2025-04-08T23:59:59Z",
        isHotDeal: true,
        vendorId: 5,
        warrantyPeriod: "2 years",
        colors: ["Natural"],
        instrumentType: "Guitar",
        skillLevel: "Beginner",
        discount: 32,
      },
      {
        id: 502,
        name: "Roland FP-30X Digital Piano",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 85000, currency: "KSH" },
        originalPrice: { amount: 110000, currency: "KSH" },
        category: "Keyboards & Pianos",
        subcategory: "Digital Pianos",
        brand: "Roland",
        description:
          "Experience authentic piano sound and feel with the Roland FP-30X digital piano, featuring SuperNATURAL Piano technology in a portable design.",
        specifications: {
          keyboard: "88 keys with PHA-4 Standard action",
          soundEngine: "SuperNATURAL Piano",
          maxPolyphony: "128 voices",
          speakers: "Dual 11W speakers",
          connections: "USB, Bluetooth, Headphone output, Sustain pedal input",
          dimensions: "1300 x 284 x 151 mm",
          weight: "14.8 kg",
        },
        features: [
          "SuperNATURAL Piano sound engine",
          "PHA-4 Standard keyboard with escapement",
          "Bluetooth audio and MIDI connectivity",
          "Built-in speakers",
          "56 preset sounds",
          "Headphone output for silent practice",
        ],
        isNew: false,
        dateAdded: "2025-02-15T10:30:00Z",
        rating: 4.9,
        reviewCount: 48,
        stockStatus: "Low Stock",
        stockCount: 3,
        tags: ["Piano", "Digital", "Roland", "Bluetooth"],
        hotDealEnds: "2025-04-20T23:59:59Z",
        isHotDeal: true,
        vendorId: 5,
        warrantyPeriod: "3 years",
        colors: ["Black", "White"],
        instrumentType: "Piano",
        skillLevel: "All Levels",
        discount: 23,
      },
      {
        id: 503,
        name: "Fender Player Stratocaster Electric Guitar",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 75000, currency: "KSH" },
        originalPrice: { amount: 95000, currency: "KSH" },
        category: "Guitars",
        subcategory: "Electric",
        brand: "Fender",
        description:
          "Achieve that classic Fender sound with this Player Stratocaster electric guitar, featuring three Player Series pickups and a modern C-shaped neck.",
        specifications: {
          body: "Alder",
          neck: "Maple, Modern C shape",
          fingerboard: "Maple or Pau Ferro",
          pickups: "3 Player Series Alnico 5 Strat single-coil pickups",
          controls: "Master Volume, Tone 1 (Neck/Middle), Tone 2 (Bridge)",
          bridge: "2-Point Synchronized Tremolo with Bent Steel Saddles",
          hardware: "Chrome",
        },
        features: [
          "Classic Stratocaster design",
          "Three Player Series Alnico 5 single-coil pickups",
          "5-way pickup switching",
          "2-point tremolo bridge with bent-steel saddles",
          "Modern C-shaped neck profile",
          '9.5" fingerboard radius for comfortable playing',
        ],
        isPopular: true,
        dateAdded: "2025-03-01T10:30:00Z",
        rating: 4.8,
        reviewCount: 36,
        stockStatus: "In Stock",
        stockCount: 5,
        tags: ["Guitar", "Electric", "Fender", "Stratocaster"],
        vendorId: 5,
        warrantyPeriod: "2 years",
        colors: ["Sunburst", "Black", "Tidepool", "Buttercream"],
        instrumentType: "Guitar",
        skillLevel: "Intermediate",
        discount: 21,
      },
    ],
  },
  // Percussion Instruments Vendor
  {
    id: 6,
    name: "Rhythm Nation",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Specialized in drums and percussion instruments for all skill levels, from beginner drum kits to professional percussion.",
    redirectUrl: "https://rhythmnation.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 189,
    verified: true,
    establishedYear: 2015,
    contactNumber: "+254 767 890 123",
    email: "info@rhythmnation.co.ke",
    website: "https://rhythmnation.co.ke",
    deliveryInfo: "Free delivery within Nairobi. Nationwide delivery available for large instruments.",
    returnPolicy: "14-day return policy for unused instruments in original packaging.",
    warrantyInfo: "All instruments come with manufacturer warranty. Extended warranty options available.",
    products: [
      {
        id: 601,
        name: "Pearl Export EXX 5-Piece Drum Kit with Hardware",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 85000, currency: "KSH" },
        originalPrice: { amount: 120000, currency: "KSH" },
        category: "Drums & Percussion",
        subcategory: "Drum Kits",
        brand: "Pearl",
        description:
          "Start your drumming journey with this Pearl Export EXX drum kit, featuring durable poplar/Asian mahogany shells and professional-grade hardware.",
        specifications: {
          configuration: '22" bass drum, 10" & 12" rack toms, 16" floor tom, 14" snare',
          shells: "Poplar/Asian mahogany blend with SST construction",
          hoops: "1.6mm steel",
          lugs: "Pearl's low-mass mini lugs",
          hardware: "830 series hardware pack included",
          cymbals: "Not included",
        },
        features: [
          "Superior Shell Technology (SST)",
          "Opti-Loc mounting system",
          "Includes 830 series hardware pack",
          "Durable wrapped finish",
          "Professional-quality sound at entry-level price",
          "Ready to play out of the box (cymbals sold separately)",
        ],
        isPopular: true,
        dateAdded: "2025-02-28T10:30:00Z",
        rating: 4.7,
        reviewCount: 28,
        stockStatus: "In Stock",
        stockCount: 3,
        tags: ["Drums", "Acoustic", "Beginner", "Complete Kit"],
        hotDealEnds: "2025-04-28T23:59:59Z",
        isHotDeal: true,
        vendorId: 6,
        warrantyPeriod: "2 years",
        colors: ["Jet Black", "Smokey Chrome", "Red Wine"],
        instrumentType: "Drums",
        skillLevel: "Beginner",
        discount: 29,
      },
      {
        id: 602,
        name: "Zildjian K Custom Dark Cymbal Pack",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 65000, currency: "KSH" },
        originalPrice: { amount: 85000, currency: "KSH" },
        category: "Drums & Percussion",
        subcategory: "Cymbals",
        brand: "Zildjian",
        description:
          "Elevate your drumming with this Zildjian K Custom Dark cymbal pack, featuring rich, dark tones with complex overtones for versatile musical expression.",
        specifications: {
          contents: '14" hi-hats, 16" crash, 18" crash, 20" ride',
          material: "B20 bronze alloy",
          finish: "Traditional finish with dark patina",
          weight: "Medium-thin to medium weight",
          sound: "Dark, warm, complex with controlled projection",
          case: "Includes cymbal bag",
        },
        features: [
          "Dark, complex sound character",
          "Hand-hammered in USA",
          "Versatile across musical genres",
          "Responsive with excellent stick definition",
          "Premium B20 bronze alloy",
          "Includes durable cymbal bag",
        ],
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.9,
        reviewCount: 18,
        stockStatus: "Low Stock",
        stockCount: 2,
        tags: ["Cymbals", "Professional", "Zildjian", "Dark"],
        vendorId: 6,
        warrantyPeriod: "2 years",
        instrumentType: "Percussion",
        skillLevel: "Professional",
        discount: 24,
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

export default function SportsAttirePage() {
  useCookieTracking("sports")

  // State for vendors and products
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors)
  const [newProductAlert, setNewProductAlert] = useState<SportsProduct | null>(null)
  const [swapTrigger, setSwapTrigger] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  // State for active category and filters
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000])
  const [sortOrder, setSortOrder] = useState("default")
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [genderFilter, setGenderFilter] = useState<string>("")

  // Custom color scheme for sports
  const sportsColorScheme = {
    primary: "from-green-500 to-teal-700",
    secondary: "bg-green-100",
    accent: "bg-teal-600",
    text: "text-green-900",
    background: "bg-green-50",
  }

  // State for product detail modal
  const [selectedProduct, setSelectedProduct] = useState<SportsProduct | null>(null)

  // States for infinite scroll
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [visibleProducts, setVisibleProducts] = useState<SportsProduct[]>([])
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

    // Filter by gender
    if (genderFilter) {
      results = results.filter((product) => product.gender === genderFilter)
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      results = results.filter((product) => product.brand && selectedBrands.includes(product.brand))

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
  }, [allProducts, searchTerm, activeCategory, selectedBrands, priceRange, sortOrder, genderFilter])

  // Launch confetti effect on page load
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10b981", "#047857", "#34d399"], // Green colors
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

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value as [number, number])
  }

  const handleProductClick = (product: SportsProduct) => {
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
    return vendors.find((vendor) => vendor.products.some((product) => product.id === productId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-5"></div>
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-teal-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-emerald-500/10 rounded-full blur-3xl"></div>
      {/* Welcome animation */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-green-500/20 to-teal-500/20 -z-10"></div>
          <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-l from-green-500/20 to-teal-500/20 -z-10"></div>
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
              <Badge className="bg-green-600/80 hover:bg-green-600 text-white px-3 py-1 text-sm font-medium rounded-full backdrop-blur-sm">
                Hot Deals
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-300 via-teal-200 to-emerald-300 text-transparent bg-clip-text">
              Sports & Music Marketplace
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Discover amazing discounts on sports attire and musical instruments from top brands
            </p>

            {/* Search bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-teal-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-200"></div>
                <div className="relative flex items-center">
                  <Input
                    type="text"
                    placeholder="Search for products, brands, or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-6 rounded-full border-transparent bg-slate-800/90 backdrop-blur-sm text-white placeholder:text-slate-400 focus:ring-green-500 focus:border-transparent w-full shadow-lg"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400">
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
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-teal-500/10 rounded-full blur-3xl"></div>
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
            colorScheme="green"
            title="Limited Time Sports & Music Deals"
            subtitle="Grab these exclusive offers before they're gone!"
          />
        </div>
      )}

      {/* Add the recommendations component */}
      <SportsRecommendations allProducts={allProducts} />

      {/* New Products For You Section */}
      <div className="container mx-auto px-4 max-w-7xl">
        <NewProductsForYou allProducts={newProducts} colorScheme="green" maxProducts={4} />
      </div>

      {/* Trending and Popular Section */}
      <TrendingPopularSection
        trendingProducts={trendingProducts}
        popularProducts={popularProducts}
        colorScheme={sportsColorScheme}
        title="Sports & Music Highlights"
        subtitle="Discover trending and most popular sports and music options"
      />

      {/*the shop logic*/}
      <div className="flex justify-center my-8">
        <Link href="/sports/shop">
          <Button
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
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
              <ShirtIcon className="mr-2 h-5 w-5" />
              Explore Our Sports Shop
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

      {/*the music shop logic*/}
      <div className="flex justify-center my-8">
        <Link href="/music/shop">
          <Button
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
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
              <Music className="mr-2 h-5 w-5" />
              Explore Our Music Instruments
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
      <div className="container mx-auto px-4 py-8 max-w-7xl" id="sports-products">
        {/* Filter and category section */}
        <div className="container mx-auto px-4 py-8 max-w-7xl" id="sports-products">
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-700/50 mb-10">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left side - Categories */}
              <div className="lg:w-1/4">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Layers className="mr-2 h-5 w-5 text-green-400" />
                  Categories
                </h2>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange("")}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 transition-all ${
                      activeCategory === ""
                        ? "bg-green-600 text-white font-medium shadow-md"
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
                          ? "bg-green-600 text-white font-medium shadow-md"
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
                    <Filter className="mr-2 h-5 w-5 text-green-400" />
                    Refine Results
                  </h2>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[200px] bg-slate-700/70 border-slate-600 text-slate-200 focus:ring-green-500">
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

                {/* Gender Filter */}
                <div className="bg-slate-700/40 rounded-xl p-5 border border-slate-700/60">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-green-400" />
                    Gender
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setGenderFilter("")}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        genderFilter === ""
                          ? "bg-green-600 text-white font-medium shadow-md"
                          : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setGenderFilter("Men")}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        genderFilter === "Men"
                          ? "bg-green-600 text-white font-medium shadow-md"
                          : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      Men
                    </button>
                    <button
                      onClick={() => setGenderFilter("Women")}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        genderFilter === "Women"
                          ? "bg-green-600 text-white font-medium shadow-md"
                          : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      Women
                    </button>
                    <button
                      onClick={() => setGenderFilter("Unisex")}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        genderFilter === "Unisex"
                          ? "bg-green-600 text-white font-medium shadow-md"
                          : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      Unisex
                    </button>
                  </div>
                </div>

                {/* Price Range */}
                <div className="bg-slate-700/40 rounded-xl p-5 border border-slate-700/60">
                  <h3 className="text-lg font-medium text-white mb-6 flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-green-400" />
                    Price Range
                  </h3>
                  <div className="px-4">
                    <Slider
                      defaultValue={[0, 150000]}
                      max={150000}
                      step={5000}
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

                {/* Brand filter */}
                {activeCategory && getAvailableBrands().length > 0 && (
                  <div className="bg-slate-700/40 rounded-xl p-5 border border-slate-700/60">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <Store className="mr-2 h-5 w-5 text-green-400" />
                      Brands
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {getAvailableBrands().map((brand) => (
                        <div
                          key={brand}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                            selectedBrands.includes(brand)
                              ? "bg-green-600/20 border border-green-500/50"
                              : "border border-slate-700 hover:border-green-500/30 hover:bg-slate-700/50"
                          }`}
                          onClick={() => handleBrandToggle(brand)}
                        >
                          <Checkbox
                            id={`brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => handleBrandToggle(brand)}
                            className="border-slate-500 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
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
                {(selectedBrands.length > 0 ||
                  activeCategory ||
                  genderFilter ||
                  priceRange[0] > 0 ||
                  priceRange[1] < 150000) && (
                  <div className="bg-slate-700/40 rounded-xl p-5 border border-slate-700/60">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-white flex items-center">
                        <Tag className="mr-2 h-5 w-5 text-green-400" />
                        Active Filters
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setActiveCategory("")
                          setSelectedBrands([])
                          setPriceRange([0, 150000])
                          setGenderFilter("")
                        }}
                        className="text-slate-300 hover:text-white hover:bg-slate-700"
                      >
                        Clear All
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeCategory && (
                        <Badge
                          className="bg-green-600/80 text-white px-3 py-1.5 flex items-center gap-1"
                          onClick={() => setActiveCategory("")}
                        >
                          Category: {categories.find((c) => c.id === activeCategory)?.name || activeCategory}
                          <X className="h-3 w-3 ml-1 cursor-pointer" />
                        </Badge>
                      )}

                      {genderFilter && (
                        <Badge
                          className="bg-green-600/80 text-white px-3 py-1.5 flex items-center gap-1"
                          onClick={() => setGenderFilter("")}
                        >
                          Gender: {genderFilter}
                          <X className="h-3 w-3 ml-1 cursor-pointer" />
                        </Badge>
                      )}

                      {selectedBrands.map((brand) => (
                        <Badge
                          key={brand}
                          className="bg-green-600/80 text-white px-3 py-1.5 flex items-center gap-1"
                          onClick={() => handleBrandToggle(brand)}
                        >
                          {brand}
                          <X className="h-3 w-3 ml-1 cursor-pointer" />
                        </Badge>
                      ))}

                      {(priceRange[0] > 0 || priceRange[1] < 150000) && (
                        <Badge className="bg-green-600/80 text-white px-3 py-1.5">
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
                    <Card className="h-full overflow-hidden border-slate-700/50 bg-slate-800/40 backdrop-blur-sm hover:border-green-500/70 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group">
                      <div className="cursor-pointer" onClick={() => handleProductClick(product)}>
                        {/* Product image */}
                        <div className="relative h-52 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 group-hover:opacity-70 transition-opacity duration-300"></div>
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
                              <Badge className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-md">
                                New
                              </Badge>
                            )}
                            {product.isTrending && (
                              <Badge className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1">
                                <Flame className="h-3 w-3" />
                                <span>Trending</span>
                              </Badge>
                            )}
                            {product.isPopular && <MostPreferredBadge colorScheme="green" size="sm" />}
                          </div>

                          {/* Discount badge */}
                          {product.discount && product.discount > 0 && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-red-500 hover:bg-red-600 text-white">{product.discount}% OFF</Badge>
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
                            <Badge variant="outline" className="text-xs border-green-500 text-green-300">
                              {product.subcategory}
                            </Badge>
                            <span className="text-xs text-green-300">{product.brand}</span>
                          </div>

                          <h3 className="font-semibold text-green-100 mb-1 line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-green-300 mb-3 line-clamp-2">{product.description}</p>

                          {/* Vendor info */}
                          {vendor && (
                            <div className="flex items-center mb-3 bg-slate-700/40 p-3 rounded-lg border border-slate-700/60">
                              <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-xs mr-2">
                                {vendor.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-green-200 truncate">
                                  {vendor.name}
                                  {vendor.verified && (
                                    <Badge className="ml-1 bg-green-500 text-white flex items-center gap-0.5 px-1 py-0 text-xs">
                                      <Check className="h-2 w-2" />
                                    </Badge>
                                  )}
                                </p>
                                <p className="text-xs text-green-400 flex items-center">
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
                                      className="h-6 w-6 text-green-300 hover:text-green-100 hover:bg-green-800/50"
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
                                        : "text-green-700"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="ml-1 text-xs text-green-300">({product.reviewCount})</span>
                            </div>
                          )}

                          {/* Price */}
                          <div className="flex items-end justify-between mb-3">
                            <div>
                              <div className="text-lg font-bold text-green-100">
                                {formatPrice(product.currentPrice)}
                              </div>
                              {product.originalPrice.amount !== product.currentPrice.amount && (
                                <div className="text-sm text-green-400 line-through">
                                  {formatPrice(product.originalPrice)}
                                </div>
                              )}
                            </div>

                            {product.warrantyPeriod && (
                              <div className="text-xs text-green-300">{product.warrantyPeriod} warranty</div>
                            )}
                          </div>
                        </CardContent>
                      </div>

                      {/* Action buttons */}
                      <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-green-500 flex items-center justify-center gap-1 transition-all"
                          onClick={() => handleProductClick(product)}
                        >
                          <Info className="h-4 w-4" />
                          <span>Details</span>
                        </Button>

                        <Button
                          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white flex items-center justify-center gap-1 shadow-md transition-all"
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
                  We couldn't find any products matching your criteria. Try adjusting your filters or search term.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-green-500"
                  onClick={() => {
                    setActiveCategory("")
                    setSelectedBrands([])
                    setPriceRange([0, 150000])
                    setSearchTerm("")
                    setGenderFilter("")
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
                <div className="w-10 h-10 border-4 border-green-300/20 border-t-green-500 rounded-full animate-spin mb-2"></div>
                <p className="text-green-300 text-sm">Loading more products...</p>
              </div>
            </div>
          )}

          {/* Loader reference element */}
          <div ref={loaderRef} className="h-20"></div>
        </div>

        {/* Product detail modal */}
        <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && closeProductModal()}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 text-slate-100 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 pointer-events-none"></div>
            {selectedProduct && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product image */}
                <div className="relative h-64 md:h-full rounded-lg overflow-hidden bg-green-900/50">
                  <Image
                    src={selectedProduct.imageUrl || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    layout="fill"
                    objectFit="cover"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {selectedProduct.isNew && <Badge className="bg-green-500 text-white">New</Badge>}
                    {selectedProduct.isTrending && (
                      <Badge className="bg-orange-500 text-white flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        <span>Trending</span>
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
                      <Badge variant="outline" className="text-xs border-green-500 text-green-300">
                        {selectedProduct.category} / {selectedProduct.subcategory}
                      </Badge>
                      <span className="text-sm text-green-300">{selectedProduct.brand}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-green-100 mb-2">{selectedProduct.name}</h2>

                    {/* Vendor info */}
                    {getVendorForProduct(selectedProduct.id) && (
                      <div className="flex items-center mb-4 bg-green-900/30 p-3 rounded-md">
                        <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-xs mr-3">
                          {getVendorForProduct(selectedProduct.id)?.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-green-200">{getVendorForProduct(selectedProduct.id)?.name}</p>
                          <p className="text-sm text-green-400 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{getVendorForProduct(selectedProduct.id)?.location}</span>
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-700 text-green-300 hover:bg-green-800"
                          onClick={() => window.open(getVendorForProduct(selectedProduct.id)?.redirectUrl, "_blank")}
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
                                  : "text-green-700"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-green-300">
                          {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviewCount} reviews)
                        </span>
                      </div>
                    )}

                    <p className="text-green-200 mb-4">{selectedProduct.description}</p>

                    {/* Specifications */}
                    {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-green-200 mb-2">Specifications</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-green-900/30 p-3 rounded-md">
                          {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-sm text-green-300 capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}:
                              </span>
                              <span className="text-sm text-green-100 font-medium">{value.toString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    {selectedProduct.features && selectedProduct.features.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-green-200 mb-2">Key Features</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedProduct.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span className="text-green-200">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Colors */}
                    {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-green-200 mb-2">Available Colors</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.colors.map((color) => (
                            <Badge key={color} variant="outline" className="border-green-500 text-green-200">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sizes */}
                    {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-green-200 mb-2">Available Sizes</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.sizes.map((size) => (
                            <Badge key={size} variant="outline" className="border-green-500 text-green-200">
                              {size}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stock status */}
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-green-200 mb-2">Availability</h3>
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
                          <span className="ml-2 text-sm text-green-300">
                            {selectedProduct.stockCount} units available
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and buttons */}
                    <div className="mt-auto">
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <div className="text-2xl font-bold text-green-100">
                            {formatPrice(selectedProduct.currentPrice)}
                          </div>
                          {selectedProduct.originalPrice.amount !== selectedProduct.currentPrice.amount && (
                            <div className="text-base text-green-400 line-through">
                              {formatPrice(selectedProduct.originalPrice)}
                            </div>
                          )}
                        </div>

                        <div>
                          {selectedProduct.warrantyPeriod && (
                            <div className="text-sm text-green-300">{selectedProduct.warrantyPeriod} warranty</div>
                          )}
                          {selectedProduct.gender && (
                            <div className="text-sm text-green-300">For: {selectedProduct.gender}</div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          variant="outline"
                          className="border-green-500 text-green-200 hover:bg-green-800/50 flex-1 flex items-center justify-center gap-2"
                        >
                          <Heart className="h-4 w-4" />
                          <span>Add to Wishlist</span>
                        </Button>

                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white flex-1 flex items-center justify-center gap-2"
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
              className="fixed bottom-6 right-6 z-50 max-w-md bg-green-950 rounded-lg shadow-xl border-l-4 border-green-500 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-900 rounded-full p-2">
                    <Bell className="h-6 w-6 text-green-300" />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <h3 className="text-lg font-medium text-green-100">New Product Alert!</h3>
                    <p className="mt-1 text-sm text-green-300">
                      Check out the new {newProductAlert.name} from {newProductAlert.brand}. Limited stock available!
                    </p>
                    <div className="mt-3 flex gap-3">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
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
                        className="border-green-700 text-green-300 hover:bg-green-800"
                        onClick={closeNewProductAlert}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      className="bg-green-950 rounded-md inline-flex text-green-400 hover:text-green-300 focus:outline-none"
                      onClick={closeNewProductAlert}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="h-1 w-full bg-green-900">
                <motion.div
                  className="h-full bg-green-500"
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

