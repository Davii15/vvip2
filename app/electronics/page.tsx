"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Search,
  Star,
  Refrigerator,
  MicrowaveIcon as Oven,
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
  SmartphoneIcon,
  TvIcon,
  LaptopIcon,
  HeadphonesIcon,
  CameraIcon,
  GamepadIcon,
  WatchIcon,
  PrinterIcon,
  Store,
  Info,
  ExternalLink,
  Check,
  Layers,
  DollarSign,
  Tag,
  RefreshCw,
  SearchX,
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
import ElectronicsRecommendations from "@/components/recommendations/electronics-recommendations"


// Types
interface Price {
  amount: number
  currency: string
}

interface ElectronicProduct {
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
  condition?: "New" | "Refurbished" | "Open Box"
  energyRating?: string
}

interface Vendor {
  id: number | string
  name: string
  location: string
  logo: string
  description: string
  products: ElectronicProduct[]
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
    id: "smartphones",
    name: "Smartphones",
    icon: <SmartphoneIcon className="mr-2" />,
    brands: ["Apple", "Samsung", "Google", "Xiaomi", "Oppo", "Huawei", "OnePlus", "Vivo", "Realme", "Tecno"],
  },
  {
    id: "tvs",
    name: "TVs",
    icon: <TvIcon className="mr-2" />,
    brands: ["Samsung", "LG", "Sony", "TCL", "Hisense", "Philips", "Panasonic", "Skyworth", "Toshiba", "Vizio"],
  },
  {
    id: "laptops",
    name: "Laptops",
    icon: <LaptopIcon className="mr-2" />,
    brands: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "Microsoft", "MSI", "Razer", "Toshiba"],
  },
  {
    id: "refrigerators",
    name: "Refrigerators",
    icon: <Refrigerator className="mr-2" />,
    brands: ["Samsung", "LG", "Whirlpool", "Bosch", "Electrolux", "Haier", "Hisense", "Midea", "Mika", "Hotpoint"],
  },
  {
    id: "ovens",
    name: "Ovens",
    icon: <Oven className="mr-2" />,
    brands: ["Samsung", "LG", "Whirlpool", "Bosch", "Electrolux", "Haier", "Mika", "Von", "Ramtons", "Hotpoint"],
  },
  {
    id: "audio",
    name: "Audio",
    icon: <HeadphonesIcon className="mr-2" />,
    brands: [
      "Sony",
      "Bose",
      "JBL",
      "Sennheiser",
      "Apple",
      "Samsung",
      "Anker",
      "Sonos",
      "Harman Kardon",
      "Bang & Olufsen",
    ],
  },
  {
    id: "cameras",
    name: "Cameras",
    icon: <CameraIcon className="mr-2" />,
    brands: ["Canon", "Nikon", "Sony", "Fujifilm", "Panasonic", "Olympus", "GoPro", "DJI", "Leica", "Pentax"],
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: <GamepadIcon className="mr-2" />,
    brands: [
      "Sony",
      "Microsoft",
      "Nintendo",
      "Razer",
      "Logitech",
      "SteelSeries",
      "Corsair",
      "Asus",
      "MSI",
      "Alienware",
    ],
  },
  {
    id: "wearables",
    name: "Wearables",
    icon: <WatchIcon className="mr-2" />,
    brands: ["Apple", "Samsung", "Fitbit", "Garmin", "Huawei", "Xiaomi", "Fossil", "Amazfit", "Oppo", "OnePlus"],
  },
  {
    id: "printers",
    name: "Printers",
    icon: <PrinterIcon className="mr-2" />,
    brands: ["HP", "Canon", "Epson", "Brother", "Xerox", "Lexmark", "Kyocera", "Ricoh", "Samsung", "Dell"],
  },
]

// Mock data for vendors and products
const mockVendors: Vendor[] = [
  // Smartphones Vendor
  {
    id: 1,
    name: "MobileTech Hub",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Premier destination for the latest smartphones and mobile accessories with exclusive deals and expert service.",
    redirectUrl: "https://mobiletechhub.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 356,
    verified:true,
    establishedYear: 2015,
    contactNumber: "+254 712 345 678",
    email: "info@mobiletechhub.com",
    website: "https://mobiletechhub.com",
    deliveryInfo: "Free delivery within Nairobi. 2-3 days nationwide delivery.",
    returnPolicy: "14-day return policy for unopened items. 7-day return for defective products.",
    warrantyInfo: "All products come with manufacturer warranty. Extended warranty available for purchase.",
    products: [
      {
        id: 101,
        name: "Samsung Galaxy S23 Ultra - 256GB",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 145000, currency: "KSH" },
        originalPrice: { amount: 180000, currency: "KSH" },
        category: "Smartphones",
        subcategory: "Android",
        brand: "Samsung",
        description:
          "Experience the ultimate smartphone with the Galaxy S23 Ultra featuring a 200MP camera, S Pen, and powerful Snapdragon processor.",
        specifications: {
          display: "6.8-inch Dynamic AMOLED 2X, 120Hz",
          processor: "Snapdragon 8 Gen 2",
          ram: "12GB",
          storage: "256GB",
          camera: "200MP main + 12MP ultrawide + 10MP telephoto + 10MP telephoto",
          battery: "5000mAh",
          os: "Android 13",
          dimensions: "163.4 x 78.1 x 8.9 mm",
          weight: "233g",
          waterResistant: true,
        },
        features: [
          "200MP main camera",
          "Built-in S Pen",
          "45W fast charging",
          "IP68 water and dust resistance",
          "Corning Gorilla Glass Victus 2",
          "Ultrasonic fingerprint sensor",
        ],
        isPopular: true,
        dateAdded: "2025-03-10T10:30:00Z",
        rating: 4.9,
        reviewCount: 128,
        stockStatus: "In Stock",
        stockCount: 25,
        tags: ["Premium", "Camera", "S Pen", "5G"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 1,
        warrantyPeriod: "24 months",
        colors: ["Phantom Black", "Cream", "Green", "Lavender"],
        condition: "New",
        discount: 19,
      },
      {
        id: 102,
        name: "iPhone 15 Pro Max - 512GB",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 210000, currency: "KSH" },
        originalPrice: { amount: 240000, currency: "KSH" },
        category: "Smartphones",
        subcategory: "iOS",
        brand: "Apple",
        description:
          "The most advanced iPhone ever with A17 Pro chip, titanium design, and a groundbreaking camera system for exceptional photos and videos.",
        specifications: {
          display: "6.7-inch Super Retina XDR, ProMotion",
          processor: "A17 Pro",
          ram: "8GB",
          storage: "512GB",
          camera: "48MP main + 12MP ultrawide + 12MP telephoto",
          battery: "4422mAh",
          os: "iOS 17",
          dimensions: "159.9 x 76.7 x 8.25 mm",
          weight: "221g",
          waterResistant: true,
        },
        features: [
          "Titanium design",
          "A17 Pro chip",
          "48MP camera with 4x optical zoom",
          "Action button",
          "USB-C connector",
          "IP68 water and dust resistance",
        ],
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.8,
        reviewCount: 76,
        stockStatus: "Low Stock",
        stockCount: 8,
        tags: ["Premium", "Camera", "Performance", "5G"],
        vendorId: 1,
        isTrending: true,
        warrantyPeriod: "12 months",
        colors: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
        condition: "New",
        discount: 12,
      },
      {
        id: 103,
        name: "Google Pixel 8 Pro - 128GB",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 120000, currency: "KSH" },
        originalPrice: { amount: 145000, currency: "KSH" },
        category: "Smartphones",
        subcategory: "Android",
        brand: "Google",
        description:
          "Experience the best of Google with the Pixel 8 Pro featuring advanced AI capabilities, stunning camera, and the powerful Tensor G3 chip.",
        specifications: {
          display: "6.7-inch LTPO OLED, 120Hz",
          processor: "Google Tensor G3",
          ram: "12GB",
          storage: "128GB",
          camera: "50MP main + 48MP ultrawide + 48MP telephoto",
          battery: "5050mAh",
          os: "Android 14",
          dimensions: "162.6 x 76.5 x 8.8 mm",
          weight: "213g",
          waterResistant: true,
        },
        features: [
          "Google Tensor G3 chip",
          "7 years of OS updates",
          "Advanced AI features",
          "Magic Editor",
          "30W fast charging",
          "IP68 water and dust resistance",
        ],
        isPopular: false,
        dateAdded: "2025-02-15T10:30:00Z",
        rating: 4.7,
        reviewCount: 92,
        stockStatus: "In Stock",
        stockCount: 15,
        tags: ["AI", "Camera", "Clean Android", "5G"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        vendorId: 1,
        warrantyPeriod: "24 months",
        colors: ["Obsidian", "Porcelain", "Bay"],
        condition: "New",
        discount: 17,
      },
    ],
  },
  // TVs Vendor
  {
    id: 2,
    name: "ScreenMasters",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Specialized in premium TVs and home theater systems with professional installation and setup services.",
    redirectUrl: "https://screenmasters.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 245,
    verified:true,
    establishedYear: 2012,
    contactNumber: "+254 723 456 789",
    email: "info@screenmasters.co.ke",
    website: "https://screenmasters.co.ke",
    deliveryInfo: "Free delivery and installation within Mombasa. Nationwide delivery available.",
    returnPolicy: "7-day return policy for unopened items. No returns for installed products.",
    warrantyInfo: "All TVs come with manufacturer warranty. Professional installation warranty for 6 months.",
    products: [
      {
        id: 201,
        name: 'Samsung 65" Neo QLED 4K Smart TV',
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 185000, currency: "KSH" },
        originalPrice: { amount: 220000, currency: "KSH" },
        category: "TVs",
        subcategory: "QLED",
        brand: "Samsung",
        description:
          "Experience breathtaking picture quality with Samsung's Neo QLED technology featuring Quantum Mini LEDs for incredible contrast and brightness.",
        specifications: {
          displayType: "Neo QLED",
          resolution: "4K Ultra HD (3840 x 2160)",
          screenSize: "65 inches",
          refreshRate: "120Hz",
          hdr: "HDR10+, HLG",
          smartFeatures: "Tizen OS, Voice Assistant, SmartThings",
          connectivity: "4 HDMI, 2 USB, Wi-Fi, Bluetooth, Ethernet",
          audio: "60W, 2.2.2 channel",
          dimensions: "1447.9 x 830.9 x 25.7 mm",
          weight: "22.8kg",
        },
        features: [
          "Neo Quantum Processor 4K",
          "Quantum HDR 2000",
          "Anti-Reflection Screen",
          "Object Tracking Sound+",
          "Gaming Hub",
          "SmartThings Integration",
        ],
        isPopular: true,
        dateAdded: "2025-02-20T10:30:00Z",
        rating: 4.8,
        reviewCount: 98,
        stockStatus: "In Stock",
        stockCount: 12,
        tags: ["Premium", "Smart TV", "Gaming", "Home Theater"],
        isAlmostSoldOut: false,
        vendorId: 2,
        warrantyPeriod: "24 months",
        condition: "New",
        energyRating: "A+",
        discount: 16,
      },
      {
        id: 202,
        name: 'LG 55" OLED evo G3 4K Smart TV',
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 165000, currency: "KSH" },
        originalPrice: { amount: 195000, currency: "KSH" },
        category: "TVs",
        subcategory: "OLED",
        brand: "LG",
        description:
          "The LG OLED evo G3 delivers perfect blacks and vibrant colors with the revolutionary self-lit pixel technology and brightness booster.",
        specifications: {
          displayType: "OLED evo",
          resolution: "4K Ultra HD (3840 x 2160)",
          screenSize: "55 inches",
          refreshRate: "120Hz",
          hdr: "Dolby Vision, HDR10, HLG",
          smartFeatures: "webOS 23, ThinQ AI, Voice Assistant",
          connectivity: "4 HDMI 2.1, 3 USB, Wi-Fi, Bluetooth, Ethernet",
          audio: "60W, 4.2 channel",
          dimensions: "1225.8 x 706.9 x 24.7 mm",
          weight: "16.8kg",
        },
        features: [
          "α9 Gen6 AI Processor 4K",
          "Brightness Booster Max",
          "Dolby Vision & Dolby Atmos",
          "NVIDIA G-SYNC & AMD FreeSync",
          "Filmmaker Mode",
          "Gallery Design",
        ],
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.9,
        reviewCount: 65,
        stockStatus: "Low Stock",
        stockCount: 5,
        tags: ["Premium", "OLED", "Gaming", "Dolby Vision"],
        hotDealEnds: "2025-04-10T23:59:59Z",
        isHotDeal: true,
        vendorId: 2,
        warrantyPeriod: "24 months",
        condition: "New",
        energyRating: "A++",
        discount: 15,
      },
    ],
  },
  // Laptops Vendor
  {
    id: 3,
    name: "ComputerWorld Kenya",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Your trusted source for laptops, desktops, and computer accessories with expert advice and after-sales support.",
    redirectUrl: "https://computerworld.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.9,
    reviewCount: 412,
    verified:true,
    establishedYear: 2008,
    contactNumber: "+254 734 567 890",
    email: "info@computerworld.co.ke",
    website: "https://computerworld.co.ke",
    deliveryInfo: "Free delivery within Nairobi CBD. Same-day delivery available for orders before 12 PM.",
    returnPolicy: "14-day return policy with original packaging. 30-day warranty for all products.",
    warrantyInfo: "All laptops come with manufacturer warranty. Extended warranty options available.",
    products: [
      {
        id: 301,
        name: 'MacBook Pro 16" M3 Pro - 32GB RAM, 1TB SSD',
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 380000, currency: "KSH" },
        originalPrice: { amount: 420000, currency: "KSH" },
        category: "Laptops",
        subcategory: "MacBook",
        brand: "Apple",
        description:
          "The most powerful MacBook Pro ever with the blazing-fast M3 Pro chip, stunning Liquid Retina XDR display, and exceptional battery life.",
        specifications: {
          processor: "Apple M3 Pro (12-core CPU, 18-core GPU)",
          ram: "32GB unified memory",
          storage: "1TB SSD",
          display: "16.2-inch Liquid Retina XDR, 3456 x 2234, 120Hz",
          graphics: "18-core integrated GPU",
          battery: "Up to 22 hours",
          ports: "3x Thunderbolt 4, HDMI, SDXC, MagSafe 3, 3.5mm headphone",
          keyboard: "Magic Keyboard with Touch ID",
          dimensions: "355.7 x 248.1 x 16.8 mm",
          weight: "2.15kg",
        },
        features: [
          "M3 Pro chip",
          "Liquid Retina XDR display",
          "Up to 22 hours battery life",
          "1080p FaceTime HD camera",
          "Six-speaker sound system",
          "Three-mic array with directional beamforming",
        ],
        isPopular: true,
        dateAdded: "2025-03-05T10:30:00Z",
        rating: 4.9,
        reviewCount: 156,
        stockStatus: "In Stock",
        stockCount: 10,
        tags: ["Premium", "Performance", "Professional", "macOS"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 3,
        isTrending: true,
        warrantyPeriod: "12 months",
        colors: ["Space Black", "Silver"],
        condition: "New",
        discount: 10,
      },
      {
        id: 302,
        name: "Dell XPS 15 - Intel Core i9, 32GB RAM, 1TB SSD",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 280000, currency: "KSH" },
        originalPrice: { amount: 320000, currency: "KSH" },
        category: "Laptops",
        subcategory: "Windows",
        brand: "Dell",
        description:
          "Experience exceptional performance and stunning visuals with the Dell XPS 15 featuring a 4K OLED display and powerful Intel Core i9 processor.",
        specifications: {
          processor: "Intel Core i9-13900H (14 cores, up to 5.4GHz)",
          ram: "32GB DDR5",
          storage: "1TB PCIe NVMe SSD",
          display: "15.6-inch 4K OLED, 3840 x 2400, touch",
          graphics: "NVIDIA GeForce RTX 4070, 8GB GDDR6",
          battery: "Up to 12 hours",
          ports: "2x Thunderbolt 4, USB-C 3.2, SD card reader, 3.5mm headphone",
          keyboard: "Backlit keyboard with fingerprint reader",
          dimensions: "344.4 x 230.1 x 18.0 mm",
          weight: "1.96kg",
        },
        features: [
          "4K OLED touch display",
          "NVIDIA RTX 4070 graphics",
          "CNC machined aluminum chassis",
          "Quad-speaker design",
          "Windows Hello facial recognition",
          "Killer Wi-Fi 6E",
        ],
        isNew: true,
        dateAdded: "2025-03-12T10:30:00Z",
        rating: 4.8,
        reviewCount: 87,
        stockStatus: "Low Stock",
        stockCount: 3,
        tags: ["Premium", "Performance", "OLED", "Windows"],
        vendorId: 3,
        warrantyPeriod: "24 months",
        colors: ["Platinum Silver", "Frost"],
        condition: "New",
        discount: 12,
      },
    ],
  },
  // Refrigerators Vendor
  {
    id: 4,
    name: "HomeAppliance Pro",
    location: "Kisumu, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Specialized in home appliances including refrigerators, washing machines, and kitchen appliances with professional installation.",
    redirectUrl: "https://homeappliancepro.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 328,
    verified:true,
    establishedYear: 2010,
    contactNumber: "+254 745 678 901",
    email: "info@homeappliancepro.co.ke",
    website: "https://homeappliancepro.co.ke",
    deliveryInfo: "Free delivery and installation within Kisumu. Nationwide delivery available for large appliances.",
    returnPolicy: "7-day return policy for unopened items. No returns for installed appliances.",
    warrantyInfo: "All appliances come with manufacturer warranty. Extended warranty options available.",
    products: [
      {
        id: 401,
        name: "Samsung 550L French Door Refrigerator with Water Dispenser",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 185000, currency: "KSH" },
        originalPrice: { amount: 220000, currency: "KSH" },
        category: "Refrigerators",
        subcategory: "French Door",
        brand: "Samsung",
        description:
          "Spacious and energy-efficient French door refrigerator with water dispenser, digital inverter technology, and smart connectivity.",
        specifications: {
          capacity: "550 liters",
          doorStyle: "French Door",
          energyRating: "A++",
          dimensions: "912 x 1780 x 716 mm",
          weight: "120kg",
          compressor: "Digital Inverter",
          cooling: "Twin Cooling Plus",
          defrost: "No Frost",
          waterDispenser: true,
          icemaker: "Automatic",
          smartFeatures: "SmartThings App, Wi-Fi Connectivity",
        },
        features: [
          "Twin Cooling Plus",
          "Digital Inverter Compressor",
          "Water Dispenser",
          "Power Freeze & Power Cool",
          "SmartThings App Control",
          "Metal Cooling",
        ],
        isPopular: true,
        dateAdded: "2025-02-25T10:30:00Z",
        rating: 4.8,
        reviewCount: 142,
        stockStatus: "In Stock",
        stockCount: 8,
        tags: ["Energy Efficient", "Smart Home", "Water Dispenser", "Large Capacity"],
        vendorId: 4,
        warrantyPeriod: "24 months",
        colors: ["Stainless Steel", "Black Stainless"],
        condition: "New",
        energyRating: "A++",
        discount: 16,
      },
      {
        id: 402,
        name: "LG 450L InstaView Door-in-Door Refrigerator",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 165000, currency: "KSH" },
        originalPrice: { amount: 195000, currency: "KSH" },
        category: "Refrigerators",
        subcategory: "Side-by-Side",
        brand: "LG",
        description:
          "Innovative InstaView Door-in-Door refrigerator with knock-twice to see inside, linear compressor, and smart diagnosis.",
        specifications: {
          capacity: "450 liters",
          doorStyle: "Side-by-Side with InstaView Door-in-Door",
          energyRating: "A++",
          dimensions: "912 x 1790 x 738 mm",
          weight: "110kg",
          compressor: "Linear Inverter",
          cooling: "Multi Air Flow",
          defrost: "No Frost",
          waterDispenser: true,
          icemaker: "In-Door",
          smartFeatures: "ThinQ App, Wi-Fi Connectivity, Smart Diagnosis",
        },
        features: [
          "InstaView Door-in-Door",
          "Linear Inverter Compressor",
          "Multi Air Flow Cooling",
          "Door Cooling+",
          "Smart Diagnosis",
          "Fresh Zone+",
        ],
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.7,
        reviewCount: 68,
        stockStatus: "Low Stock",
        stockCount: 3,
        tags: ["InstaView", "Energy Efficient", "Smart Home", "Door-in-Door"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        isAlmostSoldOut: true,
        vendorId: 4,
        warrantyPeriod: "24 months",
        colors: ["Platinum Silver", "Matte Black"],
        condition: "New",
        energyRating: "A++",
        discount: 15,
      },
    ],
  },
  // Ovens Vendor
  {
    id: 5,
    name: "Kitchen Essentials",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Specialized in kitchen appliances including ovens, microwaves, and cookers with professional installation and setup.",
    redirectUrl: "https://kitchenessentials.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.6,
    reviewCount: 276,
    verified:true,
    establishedYear: 2013,
    contactNumber: "+254 756 789 012",
    email: "info@kitchenessentials.co.ke",
    website: "https://kitchenessentials.co.ke",
    deliveryInfo: "Free delivery and installation within Nairobi. Nationwide delivery available.",
    returnPolicy: "7-day return policy for unopened items. No returns for installed appliances.",
    warrantyInfo: "All appliances come with manufacturer warranty. Extended warranty options available.",
    products: [
      {
        id: 501,
        name: "Bosch 60cm Built-in Electric Oven",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 120000, currency: "KSH" },
        originalPrice: { amount: 145000, currency: "KSH" },
        category: "Ovens",
        subcategory: "Built-in",
        brand: "Bosch",
        description:
          "Premium built-in electric oven with 3D hot air technology, pyrolytic self-cleaning, and intuitive touch controls for perfect cooking results.",
        specifications: {
          type: "Built-in Electric Oven",
          capacity: "71 liters",
          energyRating: "A+",
          dimensions: "595 x 595 x 548 mm",
          weight: "38kg",
          powerConsumption: "3600W",
          temperature: "30°C - 275°C",
          cookingFunctions: "12 heating methods",
          cleaningSystem: "Pyrolytic self-cleaning",
          controls: "Touch TFT display",
        },
        features: [
          "3D Hot Air Technology",
          "Pyrolytic Self-Cleaning",
          "TFT Touch Display",
          "SoftClose Door",
          "Meat Probe",
          "Child Lock",
        ],
        isPopular: true,
        dateAdded: "2025-03-08T10:30:00Z",
        rating: 4.8,
        reviewCount: 112,
        stockStatus: "In Stock",
        stockCount: 6,
        tags: ["Premium", "Built-in", "Self-Cleaning", "Smart"],
        hotDealEnds: "2025-04-08T23:59:59Z",
        isHotDeal: true,
        vendorId: 5,
        warrantyPeriod: "24 months",
        colors: ["Stainless Steel", "Black"],
        condition: "New",
        energyRating: "A+",
        discount: 17,
      },
      {
        id: 502,
        name: "Samsung Microwave Oven with Grill - 28L",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 25000, currency: "KSH" },
        originalPrice: { amount: 32000, currency: "KSH" },
        category: "Ovens",
        subcategory: "Microwave",
        brand: "Samsung",
        description:
          "Versatile microwave oven with grill function, ceramic interior, and smart sensor cooking for perfect results every time.",
        specifications: {
          type: "Microwave Oven with Grill",
          capacity: "28 liters",
          powerOutput: "900W (Microwave), 1500W (Grill)",
          dimensions: "517 x 310 x 474.8 mm",
          weight: "17.5kg",
          powerLevels: "6 levels",
          interior: "Ceramic Enamel",
          controls: "Digital with LED display",
          programs: "20 auto cook programs",
          turntable: "318mm diameter",
        },
        features: [
          "Ceramic Enamel Interior",
          "Grill Function",
          "Smart Sensor Cooking",
          "ECO Mode",
          "Child Lock",
          "Deodorization Function",
        ],
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.6,
        reviewCount: 78,
        stockStatus: "In Stock",
        stockCount: 12,
        tags: ["Microwave", "Grill", "Sensor Cooking", "Easy Clean"],
        vendorId: 5,
        warrantyPeriod: "12 months",
        colors: ["Black", "Silver"],
        condition: "New",
        energyRating: "A",
        discount: 22,
      },
    ],
  },
  // Audio Vendor
  {
    id: 6,
    name: "SoundWave Audio",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Premier destination for high-quality audio equipment including headphones, speakers, and home theater systems.",
    redirectUrl: "https://soundwave.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 289,
    verified:true,
    establishedYear: 2015,
    contactNumber: "+254 767 890 123",
    email: "info@soundwave.co.ke",
    website: "https://soundwave.co.ke",
    deliveryInfo: "Free delivery within Nairobi. Nationwide delivery in 2-3 business days.",
    returnPolicy: "14-day return policy for unopened items. 7-day return for defective products.",
    warrantyInfo: "All products come with manufacturer warranty. Extended warranty available for purchase.",
    products: [
      {
        id: 601,
        name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 45000, currency: "KSH" },
        originalPrice: { amount: 55000, currency: "KSH" },
        category: "Audio",
        subcategory: "Headphones",
        brand: "Sony",
        description:
          "Industry-leading noise cancellation with exceptional sound quality, 30-hour battery life, and advanced features for an immersive listening experience.",
        specifications: {
          type: "Over-ear Wireless Headphones",
          driver: "30mm Carbon Fiber Composite Driver",
          noiseCancellation: "Industry-leading ANC with 8 microphones",
          battery: "Up to 30 hours with ANC on",
          charging: "USB-C, 3 hours full charge, 3 min for 3 hours playback",
          connectivity: "Bluetooth 5.2, NFC, 3.5mm wired",
          codecs: "LDAC, AAC, SBC",
          weight: "250g",
          controls: "Touch controls, voice assistant",
          features: "Speak-to-chat, wear detection, multipoint connection",
        },
        features: [
          "Industry-leading noise cancellation",
          "30-hour battery life",
          "LDAC high-resolution audio",
          "Speak-to-chat technology",
          "Multipoint connection",
          "Adaptive Sound Control",
        ],
        isPopular: true,
        dateAdded: "2025-02-28T10:30:00Z",
        rating: 4.9,
        reviewCount: 215,
        stockStatus: "In Stock",
        stockCount: 18,
        tags: ["Premium", "Noise Cancelling", "Wireless", "Hi-Res Audio"],
        vendorId: 6,
        warrantyPeriod: "12 months",
        colors: ["Black", "Silver", "Midnight Blue"],
        condition: "New",
        discount: 18,
      },
      {
        id: 602,
        name: "Sonos Era 300 Wireless Speaker with Spatial Audio",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 65000, currency: "KSH" },
        originalPrice: { amount: 75000, currency: "KSH" },
        category: "Audio",
        subcategory: "Speakers",
        brand: "Sonos",
        description:
          "Revolutionary wireless speaker with spatial audio support, Dolby Atmos, and room-filling sound in a sleek, sustainable design.",
        specifications: {
          type: "Wireless Smart Speaker",
          drivers: "6 Class-D digital amplifiers with 6 drivers and 1 woofer",
          audio: "Spatial Audio with Dolby Atmos",
          connectivity: "Wi-Fi 6, Bluetooth 5.0, USB-C line-in",
          dimensions: "260 x 185 x 160 mm",
          weight: "4.47kg",
          powerConsumption: "27W typical, <2W standby",
          voiceControl: "Amazon Alexa built-in",
          multiroom: "Sonos ecosystem compatible",
          app: "Sonos App, Apple AirPlay 2, Spotify Connect",
        },
        features: [
          "Spatial Audio with Dolby Atmos",
          "Trueplay tuning technology",
          "Voice control with Alexa",
          "AirPlay 2 support",
          "Stereo pairing capability",
          "Sustainable design with recycled materials",
        ],
        isNew: true,
        dateAdded: "2025-03-20T10:30:00Z",
        rating: 4.8,
        reviewCount: 42,
        stockStatus: "Low Stock",
        stockCount: 4,
        tags: ["Premium", "Spatial Audio", "Smart Speaker", "Multi-room"],
        hotDealEnds: "2025-04-20T23:59:59Z",
        isHotDeal: true,
        vendorId: 6,
        warrantyPeriod: "24 months",
        colors: ["Black", "White"],
        condition: "New",
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

export default function ElectronicsPage() {
  useCookieTracking("electronics")

  // State for vendors and products
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors)
  const [newProductAlert, setNewProductAlert] = useState<ElectronicProduct | null>(null)
  const [swapTrigger, setSwapTrigger] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  // State for active category and filters
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000])
  const [sortOrder, setSortOrder] = useState("default")
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

 // Custom color scheme for electronics
 const electronicColorScheme = {
  primary: "from-purple-500 to-indigo-700",
  secondary: "bg-purple-100",
  accent: "bg-indigo-600",
  text: "text-purple-900",
  background: "bg-purple-50",
}


  // State for product detail modal
  const [selectedProduct, setSelectedProduct] = useState<ElectronicProduct | null>(null)

  // States for infinite scroll
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [visibleProducts, setVisibleProducts] = useState<ElectronicProduct[]>([])
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
  }, [allProducts, searchTerm, activeCategory, selectedBrands, priceRange, sortOrder])

  // Launch confetti effect on page load
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6d28d9", "#4c1d95", "#7c3aed"], // Purple colors
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

  const handleProductClick = (product: ElectronicProduct) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-5"></div>
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-purple-500/10 rounded-full blur-3xl"></div>
      {/* Welcome animation */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 -z-10"></div>
          <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-l from-indigo-500/20 to-purple-500/20 -z-10"></div>
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
              <Badge className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1 text-sm font-medium rounded-full backdrop-blur-sm">
                Premium Electronics
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-300 via-cyan-200 to-teal-300 text-transparent bg-clip-text">
              Discover Amazing Tech
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Explore the latest innovations and exclusive deals from top brands worldwide
            </p>

            {/* Search bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-200"></div>
                <div className="relative flex items-center">
                  <Input
                    type="text"
                    placeholder="Search for products, brands, or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-6 rounded-full border-transparent bg-slate-800/90 backdrop-blur-sm text-white placeholder:text-slate-400 focus:ring-blue-500 focus:border-transparent w-full shadow-lg"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400">
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
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-500/10 rounded-full blur-3xl"></div>
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
            colorScheme="purple"
            title="Limited Time Electronics Deals"
            subtitle="Grab these exclusive offers before they're gone!"
          />
        </div>
      )}

      
 {/* Add the recommendations component */}
<ElectronicsRecommendations allProducts={allProducts} />



      {/* New Products For You Section */}
      <div className="container mx-auto px-4 max-w-7xl">
        <NewProductsForYou allProducts={newProducts} colorScheme="purple" maxProducts={4} />
      </div>

{/* Trending and Popular Section */}
<TrendingPopularSection
        trendingProducts={trendingProducts}
        popularProducts={popularProducts}
        colorScheme={electronicColorScheme}
        title="Electronics Highlights"
        subtitle="Discover trending and most popular electronics options"
      />
  {/*the shop logic*/}
  <div className="flex justify-center my-8">
      <Link href="/electronics/shop">
        <Button
          size="lg"
          className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
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
            <LaptopIcon className="mr-2 h-5 w-5" />
            Explore Our Electronics Shop
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
     {/*the shop logic*/}
  <div className="flex justify-center my-8">
      <Link href="/electronics/media">
        <Button
          size="lg"
          className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
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
            <CameraIcon className="mr-2 h-5 w-5" />
            Explore Our Electronics Media Section
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
      <div className="container mx-auto px-4 py-8 max-w-7xl" id="electronics-products">
        {/* Filter and category section */}
        <div className="container mx-auto px-4 py-8 max-w-7xl" id="electronics-products">
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-700/50 mb-10">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left side - Categories */}
              <div className="lg:w-1/4">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Layers className="mr-2 h-5 w-5 text-blue-400" />
                  Categories
                </h2>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange("")}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 transition-all ${
                      activeCategory === ""
                        ? "bg-blue-600 text-white font-medium shadow-md"
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
                          ? "bg-blue-600 text-white font-medium shadow-md"
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
                    <Filter className="mr-2 h-5 w-5 text-blue-400" />
                    Refine Results
                  </h2>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[200px] bg-slate-700/70 border-slate-600 text-slate-200 focus:ring-blue-500">
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
                    <DollarSign className="mr-2 h-5 w-5 text-blue-400" />
                    Price Range
                  </h3>
                  <div className="px-4">
                    <Slider
                      defaultValue={[0, 500000]}
                      max={500000}
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
                      <Store className="mr-2 h-5 w-5 text-blue-400" />
                      Brands
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {getAvailableBrands().map((brand) => (
                        <div
                          key={brand}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                            selectedBrands.includes(brand)
                              ? "bg-blue-600/20 border border-blue-500/50"
                              : "border border-slate-700 hover:border-blue-500/30 hover:bg-slate-700/50"
                          }`}
                          onClick={() => handleBrandToggle(brand)}
                        >
                          <Checkbox
                            id={`brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => handleBrandToggle(brand)}
                            className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
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
                {(selectedBrands.length > 0 || activeCategory || priceRange[0] > 0 || priceRange[1] < 500000) && (
                  <div className="bg-slate-700/40 rounded-xl p-5 border border-slate-700/60">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-white flex items-center">
                        <Tag className="mr-2 h-5 w-5 text-blue-400" />
                        Active Filters
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setActiveCategory("")
                          setSelectedBrands([])
                          setPriceRange([0, 500000])
                        }}
                        className="text-slate-300 hover:text-white hover:bg-slate-700"
                      >
                        Clear All
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeCategory && (
                        <Badge
                          className="bg-blue-600/80 text-white px-3 py-1.5 flex items-center gap-1"
                          onClick={() => setActiveCategory("")}
                        >
                          Category: {categories.find((c) => c.id === activeCategory)?.name || activeCategory}
                          <X className="h-3 w-3 ml-1 cursor-pointer" />
                        </Badge>
                      )}

                      {selectedBrands.map((brand) => (
                        <Badge
                          key={brand}
                          className="bg-blue-600/80 text-white px-3 py-1.5 flex items-center gap-1"
                          onClick={() => handleBrandToggle(brand)}
                        >
                          {brand}
                          <X className="h-3 w-3 ml-1 cursor-pointer" />
                        </Badge>
                      ))}

                      {(priceRange[0] > 0 || priceRange[1] < 500000) && (
                        <Badge className="bg-blue-600/80 text-white px-3 py-1.5">
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
                    <Card className="h-full overflow-hidden border-slate-700/50 bg-slate-800/40 backdrop-blur-sm hover:border-blue-500/70 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group">
                      <div className="cursor-pointer" onClick={() => handleProductClick(product)}>
                        {/* Product image */}
                        <div className="relative h-52 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 group-hover:opacity-70 transition-opacity duration-300"></div>
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
                              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md">
                                New
                              </Badge>
                            )}
                            {product.isTrending && (
                              <Badge className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1">
                                <Flame className="h-3 w-3" />
                                <span>Trending</span>
                              </Badge>
                            )}
                            {product.isPopular && <MostPreferredBadge colorScheme="purple" size="sm" />}
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
                            <Badge variant="outline" className="text-xs border-indigo-500 text-indigo-300">
                              {product.subcategory}
                            </Badge>
                            <span className="text-xs text-indigo-300">{product.brand}</span>
                          </div>

                          <h3 className="font-semibold text-indigo-100 mb-1 line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-indigo-300 mb-3 line-clamp-2">{product.description}</p>

                          {/* Vendor info */}
                          {vendor && (
                            <div className="flex items-center mb-3 bg-slate-700/40 p-3 rounded-lg border border-slate-700/60">
                              <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold text-xs mr-2">
                                {vendor.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-indigo-200 truncate">{vendor.name}
                                {vendor.verified && (
                    <Badge className="ml-1 bg-blue-500 text-white flex items-center gap-0.5 px-1 py-0 text-xs">
                           <Check className="h-2 w-2" />
                             </Badge>
                                 )}</p>
                                <p className="text-xs text-indigo-400 flex items-center">
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
                                      className="h-6 w-6 text-indigo-300 hover:text-indigo-100 hover:bg-indigo-800/50"
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
                                        : "text-indigo-700"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="ml-1 text-xs text-indigo-300">({product.reviewCount})</span>
                            </div>
                          )}

                          {/* Price */}
                          <div className="flex items-end justify-between mb-3">
                            <div>
                              <div className="text-lg font-bold text-indigo-100">
                                {formatPrice(product.currentPrice)}
                              </div>
                              {product.originalPrice.amount !== product.currentPrice.amount && (
                                <div className="text-sm text-indigo-400 line-through">
                                  {formatPrice(product.originalPrice)}
                                </div>
                              )}
                            </div>

                            {product.warrantyPeriod && (
                              <div className="text-xs text-indigo-300">{product.warrantyPeriod} warranty</div>
                            )}
                          </div>
                        </CardContent>
                      </div>

                      {/* Action buttons */}
                      <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-blue-500 flex items-center justify-center gap-1 transition-all"
                          onClick={() => handleProductClick(product)}
                        >
                          <Info className="h-4 w-4" />
                          <span>Details</span>
                        </Button>

                        <Button
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white flex items-center justify-center gap-1 shadow-md transition-all"
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
                  We couldn't find any electronics matching your criteria. Try adjusting your filters or search term.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-blue-500"
                  onClick={() => {
                    setActiveCategory("")
                    setSelectedBrands([])
                    setPriceRange([0, 500000])
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
                <div className="w-10 h-10 border-4 border-indigo-300/20 border-t-indigo-500 rounded-full animate-spin mb-2"></div>
                <p className="text-indigo-300 text-sm">Loading more products...</p>
              </div>
            </div>
          )}

          {/* Loader reference element */}
          <div ref={loaderRef} className="h-20"></div>
        </div>

        {/* Product detail modal */}
        <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && closeProductModal()}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 text-slate-100 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 pointer-events-none"></div>
            {selectedProduct && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product image */}
                <div className="relative h-64 md:h-full rounded-lg overflow-hidden bg-indigo-900/50">
                  <Image
                    src={selectedProduct.imageUrl || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    layout="fill"
                    objectFit="cover"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {selectedProduct.isNew && <Badge className="bg-blue-500 text-white">New</Badge>}
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
                      <Badge variant="outline" className="text-xs border-indigo-500 text-indigo-300">
                        {selectedProduct.category} / {selectedProduct.subcategory}
                      </Badge>
                      <span className="text-sm text-indigo-300">{selectedProduct.brand}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-indigo-100 mb-2">{selectedProduct.name}</h2>

                    {/* Vendor info */}
                    {getVendorForProduct(selectedProduct.id) && (
                      <div className="flex items-center mb-4 bg-indigo-900/30 p-3 rounded-md">
                        <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-white font-bold text-xs mr-3">
                          {getVendorForProduct(selectedProduct.id)?.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-indigo-200">
                            {getVendorForProduct(selectedProduct.id)?.name}
                          </p>
                          <p className="text-sm text-indigo-400 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{getVendorForProduct(selectedProduct.id)?.location}</span>
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-indigo-700 text-indigo-300 hover:bg-indigo-800"
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
                                  : "text-indigo-700"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-indigo-300">
                          {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviewCount} reviews)
                        </span>
                      </div>
                    )}

                    <p className="text-indigo-200 mb-4">{selectedProduct.description}</p>

                    {/* Specifications */}
                    {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-indigo-200 mb-2">Specifications</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-indigo-900/30 p-3 rounded-md">
                          {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-sm text-indigo-300 capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}:
                              </span>
                              <span className="text-sm text-indigo-100 font-medium">{value.toString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    {selectedProduct.features && selectedProduct.features.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-indigo-200 mb-2">Key Features</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedProduct.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span className="text-indigo-200">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Colors */}
                    {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-indigo-200 mb-2">Available Colors</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.colors.map((color) => (
                            <Badge key={color} variant="outline" className="border-indigo-500 text-indigo-200">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stock status */}
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-indigo-200 mb-2">Availability</h3>
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
                          <span className="ml-2 text-sm text-indigo-300">
                            {selectedProduct.stockCount} units available
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and buttons */}
                    <div className="mt-auto">
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <div className="text-2xl font-bold text-indigo-100">
                            {formatPrice(selectedProduct.currentPrice)}
                          </div>
                          {selectedProduct.originalPrice.amount !== selectedProduct.currentPrice.amount && (
                            <div className="text-base text-indigo-400 line-through">
                              {formatPrice(selectedProduct.originalPrice)}
                            </div>
                          )}
                        </div>

                        <div>
                          {selectedProduct.warrantyPeriod && (
                            <div className="text-sm text-indigo-300">{selectedProduct.warrantyPeriod} warranty</div>
                          )}
                          {selectedProduct.condition && (
                            <div className="text-sm text-indigo-300">Condition: {selectedProduct.condition}</div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          variant="outline"
                          className="border-indigo-500 text-indigo-200 hover:bg-indigo-800/50 flex-1 flex items-center justify-center gap-2"
                        >
                          <Heart className="h-4 w-4" />
                          <span>Add to Wishlist</span>
                        </Button>

                        <Button
                          className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1 flex items-center justify-center gap-2"
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
              className="fixed bottom-6 right-6 z-50 max-w-md bg-indigo-950 rounded-lg shadow-xl border-l-4 border-indigo-500 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-900 rounded-full p-2">
                    <Bell className="h-6 w-6 text-indigo-300" />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <h3 className="text-lg font-medium text-indigo-100">New Product Alert!</h3>
                    <p className="mt-1 text-sm text-indigo-300">
                      Check out the new {newProductAlert.name} from {newProductAlert.brand}. Limited stock available!
                    </p>
                    <div className="mt-3 flex gap-3">
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1"
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
                        className="border-indigo-700 text-indigo-300 hover:bg-indigo-800"
                        onClick={closeNewProductAlert}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      className="bg-indigo-950 rounded-md inline-flex text-indigo-400 hover:text-indigo-300 focus:outline-none"
                      onClick={closeNewProductAlert}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="h-1 w-full bg-indigo-900">
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
      </div>
      </div>
    )
  }
