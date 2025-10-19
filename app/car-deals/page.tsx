"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useInView } from "react-intersection-observer"
import {
  Search,
  Filter,
  X,
  Star,
  ChevronDown,
  ChevronRight,
  Car,
  TrendingUp,
  Percent,
  Shield,
  Clock,
  MapPin,
  Wallet,
  Truck,
  Settings,
  Sparkles,
  Fuel,
  ArrowUpDown,
  ShoppingCart,
  Heart,
  Share2,
  Phone,
  CheckCircle,
  AlertCircle,
  Milestone,
  CarFront,
  Cog,
  Palette,
  Users,
  MessageCircle,
  Mail,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import HotTimeDeals from "@/components/HotTimeDeals"
import NewProductsForYou from "@/components/NewProductsForYou"
import CountdownTimer from "@/components/CountdownTimer"
import { useCookieTracking } from "@/hooks/useCookieTracking"
import { swapArrayElementsRandomly } from "@/utils/swap-utils"
import { isNewThisWeek } from "@/utils/date-utils"
import NewThisWeekBadge from "@/components/NewThisWeekBadge"
import TrendingPopularSection from "@/components/TrendingPopularSection"
import { trendingProducts, popularProducts } from "./trending-data"
import Link from "next/link"
import CarRecommendations from "@/components/recommendations/car-recommendations"
import confetti from "canvas-confetti"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
interface CarProduct {
  id: string
  name: string
  make: string
  model: string
  year: number
  imageUrl: string
  images?: string[]
  category: string
  subcategory: string
  currentPrice: number
  originalPrice: number
  description: string
  features: string[]
  specifications: {
    engine?: string
    transmission?: string
    mileage?: string
    fuelType?: string
    bodyType?: string
    color?: string
    seats?: number
    driveType?: string
  }
  condition: "New" | "Used" | "Certified Pre-Owned"
  location: string
  dealerName: string
  dealerLogo?: string
  rating?: number
  reviewCount?: number
  isNew: boolean
  isTrending: boolean
  isMostPreferred: boolean
  isLimitedTime: boolean
  expiresAt?: string
  discount?: number
  dateAdded: string
  availability: number
  financingAvailable: boolean
  warrantyIncluded: boolean
  tags: string[]
}

// Mock data for car products
const mockCarProducts: CarProduct[] = [
  // New Cars
  {
    id: "new-001",
    name: "2025 Luxury Sedan Premium Edition",
    make: "Lexus",
    model: "ES 350",
    year: 2025,
    imageUrl: "/placeholder.svg?height=300&width=400",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    category: "Cars",
    subcategory: "New Cars",
    currentPrice: 4500000,
    originalPrice: 4800000,
    description:
      "Experience luxury and performance with the all-new 2025 Lexus ES 350 Premium Edition. Featuring cutting-edge technology, premium leather interior, and advanced safety features.",
    features: [
      "10-inch touchscreen infotainment system",
      "Premium leather seats",
      "Panoramic sunroof",
      "Adaptive cruise control",
      "360° camera system",
      "Wireless charging",
      "Premium sound system",
    ],
    specifications: {
      engine: "3.5L V6",
      transmission: "8-speed automatic",
      mileage: "0 km",
      fuelType: "Petrol",
      bodyType: "Sedan",
      color: "Platinum Silver",
      seats: 5,
      driveType: "FWD",
    },
    condition: "New",
    location: "Nairobi, Kenya",
    dealerName: "Premium Auto Gallery",
    dealerLogo: "/placeholder.svg?height=60&width=60",
    rating: 4.9,
    reviewCount: 28,
    isNew: true,
    isTrending: true,
    isMostPreferred: false,
    isLimitedTime: true,
    expiresAt: "2025-04-15T23:59:59",
    discount: 6,
    dateAdded: "2025-03-15T10:30:00Z",
    availability: 3,
    financingAvailable: true,
    warrantyIncluded: true,
    tags: ["Luxury", "Sedan", "Premium", "New Arrival"],
  },
  {
    id: "new-002",
    name: "2025 Electric SUV Eco Plus",
    make: "Tesla",
    model: "Model Y",
    year: 2025,
    imageUrl: "/placeholder.svg?height=300&width=400",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    category: "Cars",
    subcategory: "New Cars",
    currentPrice: 5200000,
    originalPrice: 5500000,
    description:
      "The future of driving is here with the 2025 Tesla Model Y. This all-electric SUV offers exceptional range, cutting-edge technology, and zero emissions driving experience.",
    features: [
      "15-inch central touchscreen",
      "Autopilot capabilities",
      "Glass roof",
      "Dual motor AWD",
      "Premium audio system",
      "Over-the-air updates",
      "Supercharger network access",
    ],
    specifications: {
      engine: "Dual Electric Motor",
      transmission: "Single-speed",
      mileage: "0 km",
      fuelType: "Electric",
      bodyType: "SUV",
      color: "Deep Blue Metallic",
      seats: 5,
      driveType: "AWD",
    },
    condition: "New",
    location: "Nairobi, Kenya",
    dealerName: "EV Motors Kenya",
    dealerLogo: "/placeholder.svg?height=60&width=60",
    rating: 4.8,
    reviewCount: 15,
    isNew: true,
    isTrending: false,
    isMostPreferred: true,
    isLimitedTime: false,
    discount: 5,
    dateAdded: "2025-03-10T10:30:00Z",
    availability: 2,
    financingAvailable: true,
    warrantyIncluded: true,
    tags: ["Electric", "SUV", "Eco-Friendly", "Premium"],
  },

  // Used Cars
  {
    id: "used-001",
    name: "2022 Executive Sedan - Low Mileage",
    make: "BMW",
    model: "5 Series",
    year: 2022,
    imageUrl: "/placeholder.svg?height=300&width=400",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    category: "Cars",
    subcategory: "Used Cars",
    currentPrice: 3800000,
    originalPrice: 4200000,
    description:
      "Immaculate 2022 BMW 5 Series with low mileage and full service history. This executive sedan combines luxury, performance, and technology in a stunning package.",
    features: [
      "12.3-inch digital instrument cluster",
      "10.25-inch infotainment display",
      "Leather upholstery",
      "Harman Kardon sound system",
      "Parking assistant",
      "Ambient lighting",
      "Heated front seats",
    ],
    specifications: {
      engine: "2.0L Turbo",
      transmission: "8-speed automatic",
      mileage: "25,000 km",
      fuelType: "Petrol",
      bodyType: "Sedan",
      color: "Mineral White",
      seats: 5,
      driveType: "RWD",
    },
    condition: "Used",
    location: "Nairobi, Kenya",
    dealerName: "Executive Auto Imports",
    dealerLogo: "/placeholder.svg?height=60&width=60",
    rating: 4.7,
    reviewCount: 42,
    isNew: false,
    isTrending: true,
    isMostPreferred: false,
    isLimitedTime: true,
    expiresAt: "2025-04-30T23:59:59",
    discount: 10,
    dateAdded: "2025-02-20T10:30:00Z",
    availability: 1,
    financingAvailable: true,
    warrantyIncluded: true,
    tags: ["Luxury", "Low Mileage", "Executive", "Premium"],
  },
  {
    id: "used-002",
    name: "2021 Family SUV - 7 Seater",
    make: "Toyota",
    model: "Highlander",
    year: 2021,
    imageUrl: "/placeholder.svg?height=300&width=400",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    category: "Cars",
    subcategory: "Used Cars",
    currentPrice: 3200000,
    originalPrice: 3500000,
    description:
      "Perfect family SUV with 7 seats and ample cargo space. This 2021 Toyota Highlander is in excellent condition with comprehensive service history and low mileage.",
    features: [
      "8-inch touchscreen infotainment",
      "Apple CarPlay & Android Auto",
      "Three-zone climate control",
      "Power tailgate",
      "Keyless entry",
      "Rear parking sensors",
      "Roof rails",
    ],
    specifications: {
      engine: "3.5L V6",
      transmission: "8-speed automatic",
      mileage: "35,000 km",
      fuelType: "Petrol",
      bodyType: "SUV",
      color: "Midnight Black",
      seats: 7,
      driveType: "AWD",
    },
    condition: "Used",
    location: "Mombasa, Kenya",
    dealerName: "Family Auto Center",
    dealerLogo: "/placeholder.svg?height=60&width=60",
    rating: 4.6,
    reviewCount: 38,
    isNew: false,
    isTrending: false,
    isMostPreferred: true,
    isLimitedTime: false,
    discount: 9,
    dateAdded: "2025-01-15T10:30:00Z",
    availability: 1,
    financingAvailable: true,
    warrantyIncluded: true,
    tags: ["Family", "7 Seater", "SUV", "Spacious"],
  },

  // Car Parts & Accessories
  {
    id: "parts-001",
    name: "Premium Alloy Wheels Set - 18 inch",
    make: "Universal",
    model: "SportLine X3",
    year: 2025,
    imageUrl: "/placeholder.svg?height=300&width=400",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    category: "Car Parts",
    subcategory: "Car Parts & Accessories",
    currentPrice: 120000,
    originalPrice: 150000,
    description:
      "Upgrade your vehicle's appearance with this set of 4 premium 18-inch alloy wheels. Designed for both style and performance with excellent durability and weight distribution.",
    features: [
      "18-inch diameter",
      "High-quality aluminum alloy",
      "Lightweight design",
      "Improved handling",
      "Enhanced brake cooling",
      "Includes mounting hardware",
      "Compatible with most vehicles",
    ],
    specifications: {
      color: "Gunmetal Gray",
    },
    condition: "New",
    location: "Nairobi, Kenya",
    dealerName: "AutoStyle Kenya",
    dealerLogo: "/placeholder.svg?height=60&width=60",
    rating: 4.8,
    reviewCount: 65,
    isNew: true,
    isTrending: true,
    isMostPreferred: false,
    isLimitedTime: true,
    expiresAt: "2025-04-20T23:59:59",
    discount: 20,
    dateAdded: "2025-03-05T10:30:00Z",
    availability: 10,
    financingAvailable: false,
    warrantyIncluded: true,
    tags: ["Wheels", "Accessories", "Performance", "Styling"],
  },
  {
    id: "parts-002",
    name: "Advanced Car Audio System",
    make: "Pioneer",
    model: "AVH-X8800BT",
    year: 2025,
    imageUrl: "/placeholder.svg?height=300&width=400",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    category: "Car Parts",
    subcategory: "Car Parts & Accessories",
    currentPrice: 45000,
    originalPrice: 55000,
    description:
      "Transform your driving experience with this advanced car audio system featuring touchscreen display, Bluetooth connectivity, and premium sound quality.",
    features: [
      "7-inch touchscreen display",
      "Bluetooth connectivity",
      "Apple CarPlay & Android Auto",
      "USB and AUX inputs",
      "4 x 50W amplifier",
      "Customizable EQ",
      "Backup camera input",
    ],
    specifications: {
      color: "Black",
    },
    condition: "New",
    location: "Nairobi, Kenya",
    dealerName: "Car Audio Experts",
    dealerLogo: "/placeholder.svg?height=60&width=60",
    rating: 4.7,
    reviewCount: 52,
    isNew: false,
    isTrending: false,
    isMostPreferred: true,
    isLimitedTime: false,
    discount: 18,
    dateAdded: "2025-02-10T10:30:00Z",
    availability: 15,
    financingAvailable: false,
    warrantyIncluded: true,
    tags: ["Audio", "Entertainment", "Accessories", "Technology"],
  },
]

// Hot deals data
const hotDeals = mockCarProducts
  .filter((product) => product.isLimitedTime && product.expiresAt)
  .map((product) => ({
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl,
    currentPrice: {
      amount: product.currentPrice,
      currency: "KSH",
    },
    originalPrice: {
      amount: product.originalPrice,
      currency: "KSH",
    },
    category: product.category,
    expiresAt: product.expiresAt || "2025-04-30T23:59:59",
    description: product.description,
    discount: product.discount,
  }))

// New products data for the NewProductsForYou component
const newProducts = mockCarProducts
  .filter((product) => product.isNew || isNewThisWeek(product.dateAdded))
  .map((product) => ({
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl,
    currentPrice: {
      amount: product.currentPrice,
      currency: "KSH",
    },
    originalPrice: {
      amount: product.originalPrice,
      currency: "KSH",
    },
    category: product.category,
    dateAdded: product.dateAdded,
    isNew: true,
    description: product.description,
  }))

export default function CarDealsPage() {
  useCookieTracking("car-deals")

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSubcategory, setSelectedSubcategory] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 6000000])
  const [filteredProducts, setFilteredProducts] = useState<CarProduct[]>(mockCarProducts)
  const [visibleProducts, setVisibleProducts] = useState<CarProduct[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<CarProduct | null>(null)
  const [showNewProductAlert, setShowNewProductAlert] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [sortOrder, setSortOrder] = useState("default")
  const [isHovered, setIsHovered] = useState(false)

  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null)

  // Mock contact data for car dealers
  const dealerContacts = {
    "Premium Auto Gallery": {
      whatsapp: "+254711234567",
      phone: "+254711234567",
      email: "sales@premiumautogallery.co.ke",
      website: "https://www.premiumautogallery.co.ke",
    },
    "Elite Motors": {
      whatsapp: "+254712345678",
      phone: "+254712345678",
      email: "contact@elitemotors.co.ke",
      website: "https://www.elitemotors.co.ke",
    },
    "AutoMax Dealership": {
      whatsapp: "+254713456789",
      phone: "+254713456789",
      email: "info@automax.co.ke",
      website: "https://www.automax.co.ke",
    },
    "CarWorld Kenya": {
      whatsapp: "+254714567890",
      phone: "+254714567890",
      email: "sales@carworldkenya.co.ke",
      website: "https://www.carworldkenya.co.ke",
    },
    "Luxury Auto Hub": {
      whatsapp: "+254715678901",
      phone: "+254715678901",
      email: "contact@luxuryautohub.co.ke",
      website: "https://www.luxuryautohub.co.ke",
    },
  }

  // Custom color scheme for car trending part
  const carColorScheme = {
    primary: "from-blue-500 to-purple-700",
    secondary: "bg-emerald-100",
    accent: "bg-green-600",
    text: "text-emerald-900",
    background: "bg-purple-50",
  }

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  })

  const productsPerPage = 6

  // Categories and subcategories
  const categories = [
    {
      name: "All",
      icon: <Car className="h-4 w-4" />,
      subcategories: ["All"],
    },
    {
      name: "New Cars",
      icon: <CarFront className="h-4 w-4" />,
      subcategories: ["All", "Sedan", "SUV", "Hatchback", "Luxury", "Electric"],
    },
    {
      name: "Used Cars",
      icon: <Milestone className="h-4 w-4" />,
      subcategories: ["All", "Sedan", "SUV", "Hatchback", "Luxury", "Budget"],
    },
    {
      name: "Car Parts & Accessories",
      icon: <Cog className="h-4 w-4" />,
      subcategories: ["All", "Wheels & Tires", "Audio & Electronics", "Interior", "Exterior", "Performance"],
    },
  ]

  // Get subcategories for selected category
  const getSubcategories = () => {
    const category = categories.find((cat) => cat.name === selectedCategory)
    return category ? category.subcategories : ["All"]
  }

  // Filter products based on search, category, subcategory, and price range
  useEffect(() => {
    let results = mockCarProducts

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.make.toLowerCase().includes(term) ||
          product.model.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term) ||
          product.subcategory.toLowerCase().includes(term) ||
          product.tags.some((tag) => tag.toLowerCase().includes(term)),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      results = results.filter((product) => product.subcategory === selectedCategory)
    }

    // Filter by subcategory
    if (selectedSubcategory !== "All") {
      // For simplicity, we'll filter by tags that match the subcategory
      results = results.filter((product) =>
        product.tags.some((tag) => tag.toLowerCase().includes(selectedSubcategory.toLowerCase())),
      )
    }

    // Filter by price range
    results = results.filter(
      (product) => product.currentPrice >= priceRange[0] && product.currentPrice <= priceRange[1],
    )

    // Sort results
    if (sortOrder === "price-asc") {
      results.sort((a, b) => a.currentPrice - b.currentPrice)
    } else if (sortOrder === "price-desc") {
      results.sort((a, b) => b.currentPrice - a.currentPrice)
    } else if (sortOrder === "newest") {
      results.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    } else if (sortOrder === "rating") {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    setFilteredProducts(results)
    setPage(1)
    setVisibleProducts([])
    setHasMore(results.length > 0)
  }, [searchTerm, selectedCategory, selectedSubcategory, priceRange, sortOrder])

  // Load more products when scrolling
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreProducts()
    }
  }, [inView, filteredProducts])

  // Auto-hide new product alert after 10 seconds
  useEffect(() => {
    if (showNewProductAlert) {
      const timer = setTimeout(() => {
        setShowNewProductAlert(false)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [showNewProductAlert])

  // Load initial products
  useEffect(() => {
    loadMoreProducts()
  }, [])

  // Launch confetti effect on page load
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#4338ca", "#6d28d9", "#7c3aed"], // Indigo and purple colors
    })
  }, [])

  // Add product swapping effect every 10 minutes
  useEffect(() => {
    const swapInterval = setInterval(
      () => {
        // Swap products
        setVisibleProducts((prevProducts) => {
          if (prevProducts.length < 2) return prevProducts
          const newProducts = [...prevProducts]
          return swapArrayElementsRandomly(newProducts)
        })
      },
      10 * 60 * 1000, // 10 minutes
    )

    return () => clearInterval(swapInterval)
  }, [])

  const loadMoreProducts = () => {
    setLoading(true)

    // Simulate API call with setTimeout
    setTimeout(() => {
      const startIndex = (page - 1) * productsPerPage
      const endIndex = startIndex + productsPerPage
      const newProducts = filteredProducts.slice(startIndex, endIndex)

      setVisibleProducts((prev) => [...prev, ...newProducts])
      setPage((prev) => prev + 1)
      setHasMore(endIndex < filteredProducts.length)
      setLoading(false)
    }, 800)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory("All")
  }

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory)
  }

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value)
  }

  const handleProductClick = (product: CarProduct) => {
    setSelectedProduct(product)
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(amount)
  }
  function MostPreferredBadge() {
    return (
      <motion.div
        className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center"
        animate={{
          scale: [1, 1.1, 1],
          boxShadow: ["0 4px 6px rgba(0, 0, 0, 0.1)", "0 10px 15px rgba(0, 0, 0, 0.2)", "0 4px 6px rgba(0, 0, 0, 0.1)"],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <TrendingUp className="h-3 w-3 mr-1" />
        <span>most preferred</span>
      </motion.div>
    )
  }

  const ContactModal = ({
    dealerName,
    selectedProduct,
    isOpen,
    onClose,
  }: {
    dealerName: string | null
    selectedProduct: any
    isOpen: boolean
    onClose: () => void
  }) => {
    if (!dealerName || !isOpen || !selectedProduct) return null

    const contacts = dealerContacts[dealerName as keyof typeof dealerContacts] || dealerContacts["Premium Auto Gallery"]

    const handleWhatsApp = () => {
      const message = encodeURIComponent(
        `Hi! I'm interested in the ${selectedProduct.name} (${selectedProduct.make} ${selectedProduct.model} ${selectedProduct.year}). Could you provide more details and arrange a viewing?`,
      )
      window.open(`https://wa.me/${contacts.whatsapp.replace("+", "")}?text=${message}`, "_blank")
    }

    const handlePhone = () => {
      window.open(`tel:${contacts.phone}`, "_self")
    }

    const handleEmail = () => {
      const subject = encodeURIComponent(`Inquiry - ${selectedProduct.name}`)
      const body = encodeURIComponent(
        `Dear ${dealerName},\n\nI am interested in the following vehicle:\n\n- Vehicle: ${selectedProduct.name}\n- Make/Model: ${selectedProduct.make} ${selectedProduct.model}\n- Year: ${selectedProduct.year}\n- Price: ${formatCurrency(selectedProduct.currentPrice)}\n- Location: ${selectedProduct.location}\n\nCould you please provide more information and arrange a viewing/test drive?\n\nThank you!`,
      )
      window.open(`mailto:${contacts.email}?subject=${subject}&body=${body}`, "_self")
    }

    const handleWebsite = () => {
      window.open(contacts.website, "_blank")
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-indigo-800">Contact {dealerName}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="font-semibold">WhatsApp</span>
            </button>

            <button
              onClick={handlePhone}
              className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
            >
              <Phone className="w-6 h-6" />
              <span className="font-semibold">Call Now</span>
            </button>

            <button
              onClick={handleWebsite}
              className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
            >
              <Globe className="w-6 h-6" />
              <span className="font-semibold">Visit Website</span>
            </button>

            <button
              onClick={handleEmail}
              className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg"
            >
              <Mail className="w-6 h-6" />
              <span className="font-semibold">Send Email</span>
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-purple-900 text-white">
      {/* Page header */}
      <div className="bg-gradient-to-r from-indigo-800 to-purple-800 py-8 px-4 md:px-8 shadow-lg">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-blue-100">
            Premium Automotive Product Deals
          </h1>
          <p className="text-indigo-200 mb-4">Discover exceptional vehicles and automotive products</p>

          <div className="flex justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Car key={star} className="h-5 w-5 text-purple-300 mx-1" />
            ))}
          </div>

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto mt-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for cars, parts, brands, or models..."
                className="pl-10 pr-4 py-3 rounded-full border-indigo-500 bg-indigo-950/50 backdrop-blur-sm text-white placeholder:text-indigo-300/70 focus:ring-purple-500 focus:border-purple-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="container mx-auto max-w-7xl px-4 md:px-8 mt-8">
        <CountdownTimer targetDate="2025-05-31T23:59:59" startDate="2025-03-01T00:00:00" />
        <NewProductsForYou allProducts={newProducts} colorScheme="blue" maxProducts={4} />
        <HotTimeDeals
          deals={hotDeals}
          colorScheme="purple"
          title="Limited Time Automotive Offers"
          subtitle="Exclusive deals on premium vehicles and accessories - act fast before they're gone!"
        />

        {/* Add the recommendations component after the countdown timer */}
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <CarRecommendations products={mockCarProducts} colorScheme="indigo" />
        </div>

        {/* Trending and Popular Section */}
        <TrendingPopularSection
          trendingProducts={trendingProducts}
          popularProducts={popularProducts}
          colorScheme={carColorScheme}
          title=" Best Cars and Dealers Today"
          subtitle="See what's trending and most popular in the Auto market"
        />
        {/*the shop logic*/}
        <div className="flex justify-center my-8">
          <Link href="/car-deals/shop">
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
                <Car className="mr-2 h-5 w-5" />
                Explore Car deals Shop
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
        {/*the  Car shop Media logic*/}
        <div className="flex justify-center my-8">
          <Link href="/car-deals/media">
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
                <Car className="mr-2 h-5 w-5" />
                Explore Car deals Media Shop
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
      </div>

      {/* New product alert */}
      <AnimatePresence>
        {showNewProductAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-l-4 border-purple-500 text-white p-4 mx-4 md:mx-auto max-w-7xl mt-4 rounded-md shadow-md relative backdrop-blur-sm"
          >
            <button
              onClick={() => setShowNewProductAlert(false)}
              className="absolute right-2 top-2 text-purple-300 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center">
              <Sparkles className="h-6 w-6 mr-2 text-purple-300" />
              <div>
                <p className="font-medium">New vehicles and accessories just arrived!</p>
                <p className="text-sm text-indigo-200">
                  Check out our latest luxury sedans, electric vehicles, and premium car accessories with special
                  introductory offers.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="container mx-auto max-w-7xl px-4 md:px-8 pb-16">
        {/* Category tabs and filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-white">Automotive Products</h2>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <span className="text-sm text-indigo-200 mr-2">Sort by:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="p-2 rounded-md text-sm bg-indigo-950 border border-indigo-700 text-white"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Rating</option>
                </select>
                <ArrowUpDown className="h-4 w-4 text-indigo-300 ml-1" />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="flex items-center gap-2 border-indigo-500 text-indigo-200 hover:bg-indigo-800/50"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Category tabs */}
          <Tabs defaultValue="All" className="w-full">
            <TabsList className="bg-indigo-900/50 p-1 rounded-xl mb-4 flex flex-nowrap overflow-x-auto hide-scrollbar">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.name}
                  value={category.name}
                  onClick={() => handleCategoryChange(category.name)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    selectedCategory === category.name
                      ? "bg-purple-700 text-white shadow-sm"
                      : "text-indigo-200 hover:bg-indigo-800/50",
                  )}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Subcategory tabs */}
            {selectedCategory !== "All" && (
              <div className="flex flex-wrap gap-2 mb-6">
                {getSubcategories().map((subcategory) => (
                  <Badge
                    key={subcategory}
                    variant={selectedSubcategory === subcategory ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer px-3 py-1 text-sm",
                      selectedSubcategory === subcategory
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-transparent border-indigo-500 text-indigo-200 hover:bg-indigo-800/50",
                    )}
                    onClick={() => handleSubcategoryChange(subcategory)}
                  >
                    {subcategory}
                  </Badge>
                ))}
              </div>
            )}

            {/* Advanced filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-indigo-900/50 p-4 rounded-lg mb-6 backdrop-blur-sm">
                    <h3 className="text-lg font-medium text-white mb-4">Price Range</h3>
                    <div className="px-4">
                      <Slider
                        defaultValue={[0, 6000000]}
                        max={6000000}
                        step={100000}
                        value={priceRange}
                        onValueChange={handlePriceRangeChange}
                        className="mb-6"
                      />
                      <div className="flex justify-between text-sm text-indigo-200">
                        <span>{formatCurrency(priceRange[0])}</span>
                        <span>{formatCurrency(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProducts.length > 0 ? (
                visibleProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="h-full"
                  >
                    <Card
                      className="overflow-hidden h-full flex flex-col border-indigo-700 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 bg-indigo-950/80 backdrop-blur-sm"
                      onClick={() => handleProductClick(product)}
                    >
                      {/* Product image */}
                      <div className="relative h-48 bg-indigo-900">
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
                            <Badge className="bg-blue-500 hover:bg-blue-600 text-white">New Arrival</Badge>
                          )}
                          {!product.isNew && isNewThisWeek(product.dateAdded) && <NewThisWeekBadge />}
                          {product.isTrending && (
                            <Badge className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              <span>Trending</span>
                            </Badge>
                          )}
                          {product.isMostPreferred && <MostPreferredBadge />}
                        </div>

                        {/* Limited time offer */}
                        {product.isLimitedTime && product.expiresAt && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Limited Time</span>
                            </Badge>
                          </div>
                        )}

                        {/* Dealer logo */}
                        <div className="absolute bottom-2 right-2 bg-indigo-950/90 backdrop-blur-sm rounded-full p-1 shadow-md">
                          <div className="h-8 w-8 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold text-xs">
                            {product.dealerName.substring(0, 2).toUpperCase()}
                          </div>
                        </div>
                      </div>

                      {/* Product details */}
                      <div className="p-4 flex-grow flex flex-col">
                        <div className="mb-2 flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs border-indigo-500 text-indigo-300">
                            {product.subcategory}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-indigo-500 text-indigo-300">
                            {product.condition}
                          </Badge>
                        </div>

                        <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                        <p className="text-sm text-indigo-300 mb-1">
                          {product.make} {product.model} {product.year}
                        </p>
                        <p className="text-sm text-indigo-200 mb-3 line-clamp-2 flex-grow">{product.description}</p>

                        {/* Location */}
                        <div className="flex items-center text-xs text-indigo-300 mb-3">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{product.location}</span>
                        </div>

                        {/* Rating */}
                        {product.rating && (
                          <div className="flex items-center mb-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(product.rating ?? 0)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-1 text-xs text-indigo-300">
                              {product.rating.toFixed(1)} ({product.reviewCount})
                            </span>
                          </div>
                        )}

                        {/* Price and buttons */}
                        <div className="mt-auto">
                          <div className="flex items-end justify-between mb-3">
                            <div>
                              <div className="text-lg font-bold text-white">{formatCurrency(product.currentPrice)}</div>
                              {product.originalPrice !== product.currentPrice && (
                                <div className="text-sm text-indigo-400 line-through">
                                  {formatCurrency(product.originalPrice)}
                                </div>
                              )}
                            </div>

                            {product.availability > 0 ? (
                              <div className="text-xs text-green-400 flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                <span>
                                  {product.availability} {product.availability === 1 ? "unit" : "units"} available
                                </span>
                              </div>
                            ) : (
                              <div className="text-xs text-red-400 flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                <span>Out of stock</span>
                              </div>
                            )}
                          </div>

                          {/* Action buttons */}
                          <div className="grid grid-cols-2 gap-2">
                            {product.discount && product.discount > 0 ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-indigo-600 text-indigo-300 hover:bg-indigo-800/50 flex items-center justify-center gap-1 bg-transparent"
                              >
                                <Percent className="h-3 w-3" />
                                <span>Save {product.discount}%</span>
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-indigo-600 text-indigo-300 hover:bg-indigo-800/50 flex items-center justify-center gap-1 bg-transparent"
                              >
                                <Shield className="h-3 w-3" />
                                <span>Best Value</span>
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              className="border-indigo-600 text-indigo-300 hover:bg-indigo-800/50 bg-transparent"
                              onClick={() => {
                                setSelectedDealer(product.dealerName)
                                setShowContactModal(true)
                              }}
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              <span>Contact Dealer</span>
                            </Button>

                            <Button
                              size="sm"
                              className="bg-purple-700 hover:bg-purple-800 text-white flex items-center justify-center gap-1"
                            >
                              {product.subcategory === "Car Parts & Accessories" ? (
                                <>
                                  <ShoppingCart className="h-3 w-3" />
                                  <span>Add to Cart</span>
                                </>
                              ) : (
                                <>
                                  <Car className="h-3 w-3" />
                                  <span>Test Drive</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <div className="mx-auto w-24 h-24 mb-4 bg-indigo-900/50 rounded-full flex items-center justify-center">
                    <Car className="h-12 w-12 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">No products found</h3>
                  <p className="text-indigo-300 max-w-md mx-auto">
                    We couldn't find any automotive products matching your criteria. Try adjusting your filters or
                    search term.
                  </p>
                </div>
              )}
            </div>

            {/* Loading indicator */}
            {hasMore && (
              <div ref={ref} className="flex justify-center mt-8">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-indigo-300/30 border-t-purple-500 rounded-full animate-spin mb-2"></div>
                    <p className="text-indigo-300 text-sm">Loading more automotive products...</p>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="border-indigo-600 text-indigo-300 hover:bg-indigo-800/50 bg-transparent"
                    onClick={loadMoreProducts}
                  >
                    Load More
                  </Button>
                )}
              </div>
            )}
          </Tabs>
        </div>
      </div>

      <ContactModal
        dealerName={selectedDealer}
        selectedProduct={selectedProduct}
        isOpen={showContactModal}
        onClose={() => {
          setShowContactModal(false)
          setSelectedDealer(null)
        }}
      />

      {/* Product detail modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && closeProductModal()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-indigo-950 border border-indigo-700 text-white">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                  {selectedProduct.name}
                  {selectedProduct.isNew && <Badge className="bg-blue-500 ml-2">New</Badge>}
                </DialogTitle>
                <DialogDescription className="text-base text-indigo-300">
                  {selectedProduct.make} {selectedProduct.model} {selectedProduct.year} • {selectedProduct.condition}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Product image */}
                <div className="relative h-64 md:h-full rounded-lg overflow-hidden bg-indigo-900">
                  <Image
                    src={selectedProduct.imageUrl || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    layout="fill"
                    objectFit="cover"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {selectedProduct.isTrending && (
                      <Badge className="bg-orange-500 text-white flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>Trending</span>
                      </Badge>
                    )}
                    {selectedProduct.isMostPreferred && (
                      <Badge className="bg-purple-500 text-white flex items-center gap-1">
                        <Star className="h-3 w-3 fill-white" />
                        <span>Most Preferred</span>
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Product details */}
                <div className="flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-white mb-2">Description</h3>
                    <p className="text-indigo-200">{selectedProduct.description}</p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-white mb-2">Key Features</h3>
                    <ul className="list-disc list-inside text-indigo-200 space-y-1">
                      {selectedProduct.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Specifications */}
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-white mb-2">Specifications</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {selectedProduct.specifications.engine && (
                        <div className="flex items-center text-indigo-200">
                          <Settings className="h-4 w-4 mr-2 text-indigo-400" />
                          <span>Engine: {selectedProduct.specifications.engine}</span>
                        </div>
                      )}
                      {selectedProduct.specifications.transmission && (
                        <div className="flex items-center text-indigo-200">
                          <Cog className="h-4 w-4 mr-2 text-indigo-400" />
                          <span>Transmission: {selectedProduct.specifications.transmission}</span>
                        </div>
                      )}
                      {selectedProduct.specifications.mileage && (
                        <div className="flex items-center text-indigo-200">
                          <Milestone className="h-4 w-4 mr-2 text-indigo-400" />
                          <span>Mileage: {selectedProduct.specifications.mileage}</span>
                        </div>
                      )}
                      {selectedProduct.specifications.fuelType && (
                        <div className="flex items-center text-indigo-200">
                          <Fuel className="h-4 w-4 mr-2 text-indigo-400" />
                          <span>Fuel: {selectedProduct.specifications.fuelType}</span>
                        </div>
                      )}
                      {selectedProduct.specifications.color && (
                        <div className="flex items-center text-indigo-200">
                          <Palette className="h-4 w-4 mr-2 text-indigo-400" />
                          <span>Color: {selectedProduct.specifications.color}</span>
                        </div>
                      )}
                      {selectedProduct.specifications.seats && (
                        <div className="flex items-center text-indigo-200">
                          <Users className="h-4 w-4 mr-2 text-indigo-400" />
                          <span>Seats: {selectedProduct.specifications.seats}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-white">
                          {formatCurrency(selectedProduct.currentPrice)}
                        </div>
                        {selectedProduct.originalPrice !== selectedProduct.currentPrice && (
                          <div className="text-base text-indigo-400 line-through">
                            {formatCurrency(selectedProduct.originalPrice)}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-sm text-indigo-300 mb-1">Availability:</div>
                        {selectedProduct.availability > 0 ? (
                          <div className="font-medium text-green-400 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span>
                              {selectedProduct.availability} {selectedProduct.availability === 1 ? "unit" : "units"}{" "}
                              available
                            </span>
                          </div>
                        ) : (
                          <div className="font-medium text-red-400 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span>Out of stock</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {selectedProduct.discount && selectedProduct.discount > 0 ? (
                        <Button
                          variant="outline"
                          className="border-indigo-600 text-indigo-300 hover:bg-indigo-800/50 flex-1 flex items-center justify-center gap-2 bg-transparent"
                        >
                          <Percent className="h-4 w-4" />
                          <span>
                            Save {selectedProduct.discount}% (
                            {formatCurrency(selectedProduct.originalPrice - selectedProduct.currentPrice)})
                          </span>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="border-indigo-600 text-indigo-300 hover:bg-indigo-800/50 flex-1 flex items-center justify-center gap-2 bg-transparent"
                        >
                          <Shield className="h-4 w-4" />
                          <span>Premium Quality Guaranteed</span>
                        </Button>
                      )}

                      <Button className="bg-purple-700 hover:bg-purple-800 text-white flex-1 flex items-center justify-center gap-2">
                        {selectedProduct.subcategory === "Car Parts & Accessories" ? (
                          <>
                            <ShoppingCart className="h-4 w-4" />
                            <span>Add to Cart</span>
                          </>
                        ) : (
                          <>
                            <Car className="h-4 w-4" />
                            <span>Schedule Test Drive</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional information */}
              <div className="mt-6 pt-4 border-t border-indigo-800">
                <div className="flex flex-col gap-2 text-sm text-indigo-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-400" />
                    <span>Location: {selectedProduct.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-indigo-400" />
                    <span>Dealer: {selectedProduct.dealerName}</span>
                  </div>
                  {selectedProduct.financingAvailable && (
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-indigo-400" />
                      <span>Financing Available</span>
                    </div>
                  )}
                  {selectedProduct.warrantyIncluded && (
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-indigo-400" />
                      <span>Warranty Included</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact buttons */}
              <div className="flex flex-wrap gap-3 mt-4">
                <Button
                  variant="outline"
                  className="border-indigo-600 text-indigo-300 hover:bg-indigo-800/50 bg-transparent"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  <span>Contact Dealer</span>
                </Button>
                <Button
                  variant="outline"
                  className="border-indigo-600 text-indigo-300 hover:bg-indigo-800/50 bg-transparent"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  <span>Save to Favorites</span>
                </Button>
                <Button
                  variant="outline"
                  className="border-indigo-600 text-indigo-300 hover:bg-indigo-800/50 bg-transparent"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  <span>Share</span>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
