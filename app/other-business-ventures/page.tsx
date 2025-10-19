"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Search, X, Tag, MapPin, Hammer, Loader2, TrendingUp, ChevronRight, Sofa, Sparkles } from "lucide-react"
import Image from "next/image"
import CountdownTimer from "@/components/CountdownTimer"
import HotTimeDeals from "@/components/HotTimeDeals"
import { useCookieTracking } from "@/hooks/useCookieTracking"
import { swapArrayElementsRandomly, swapVendorsWithinCategory } from "@/utils/swap-utils"
import { isNewThisWeek } from "@/utils/date-utils"
import NewThisWeekBadge from "@/components/NewThisWeekBadge"
import NewProductsForYou from "@/components/NewProductsForYou"
import { transformBusinessVenturesToProducts } from "@/utils/product-transformers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductModal from "@/components/ProductModal"

interface Price {
  amount: number
  currency: string
}

interface Product {
  id: number
  name: string
  imageUrl: string
  currentPrice: Price
  originalPrice: Price
  isNew?: boolean
  category: string
  description: string
  dateAdded: string
  isMostPreferred?: boolean
  isHotDeal?: boolean // Add this field
  hotDealEnds?: string // Add this field - ISO date string
}

interface Vendor {
  id: number
  name: string
  location: string
  logo: string
  description: string
  products: Product[]
  redirectUrl: string
  mapLink: string
  defaultCurrency: string
  verified?: boolean
  whatsappNumber?: string
  businessHours?: string
  rating?: number
  totalReviews?: number
  specialties?: string[]
}

// Mock data for vendors
const mockVendors: Vendor[] = [
  {
    id: 1,
    name: "EcoTech Innovations",
    location: "Nairobi, Kenya",
    logo: "https://your-supabase-project.supabase.co/storage/v1/object/public/vendor-logos/ecotech-logo.png",
    description: "Cutting-edge eco-friendly technology solutions for modern living.",
    mapLink: "https://www.google.com/maps/search/?api=1&query=EcoTech+Innovations+Nairobi+Kenya",
    defaultCurrency: "KSH",
    products: [
      {
        id: 1,
        name: "Solar-Powered Backpack",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/product-images/solar-backpack.jpg",
        currentPrice: { amount: 1449.99, currency: "KSH" },
        originalPrice: { amount: 1999.99, currency: "KSH" },
        category: "Eco-Friendly Tech",
        description: "Charge your devices on the go with this stylish and sustainable solar-powered backpack.",
        dateAdded: "2025-03-15T10:30:00Z",
        isMostPreferred: true,
      },
      {
        id: 2,
        name: "Smart Home Energy Monitor",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/product-images/energy-monitor.jpg",
        currentPrice: { amount: 850.99, currency: "KSH" },
        originalPrice: { amount: 999.99, currency: "KSH" },
        category: "Smart Home",
        description: "Track and optimize your home's energy usage with our easy-to-use smart monitor.",
        dateAdded: "2025-03-15T10:30:00Z",
        isHotDeal: true, // Mark this as a hot deal
        hotDealEnds: "2025-04-15T23:59:59Z",
      },
      {
        id: 3,
        name: "Biodegradable Phone Case",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/product-images/bio-phone-case.jpg",
        currentPrice: { amount: 340.99, currency: "KSH" },
        originalPrice: { amount: 450.0, currency: "KSH" },
        category: "Eco-Friendly Accessories",
        description: "Protect your phone and the environment with our stylish biodegradable phone case.",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
      },
    ],
    redirectUrl: "https://ecotech-innovations.com",
  },
  {
    id: 2,
    name: "Artisan Crafts Collective",
    location: "Mombasa, Kenya",
    logo: "https://your-supabase-project.supabase.co/storage/v1/object/public/vendor-logos/artisan-crafts-logo.png",
    description: "Unique, handcrafted items from talented local artisans.",
    mapLink: "https://www.google.com/maps/search/?api=1&query=EcoTech+Innovations+Nairobi+Kenya",
    defaultCurrency: "KSH , USD",
    products: [
      {
        id: 4,
        name: "Hand-Woven Basket Set",
        imageUrl: "https://your-supabase-project.supabase.co/storage/v1/object/public/product-images/woven-baskets.jpg",
        currentPrice: { amount: 10.99, currency: "USD" },
        originalPrice: { amount: 20.99, currency: "USD" },
        category: "Home Decor",
        description: "Beautiful, durable hand-woven baskets perfect for storage and decoration.",
        dateAdded: "2025-03-15T10:30:00Z",
        isHotDeal: true, // Mark this as a hot deal
        hotDealEnds: "2025-04-15T23:59:59Z",
      },
      {
        id: 5,
        name: "Ceramic Wind Chimes",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/product-images/ceramic-chimes.jpg",
        currentPrice: { amount: 1200.99, currency: "KSH" },
        originalPrice: { amount: 1500.99, currency: "KSH" },
        category: "Garden Accessories",
        description: "Handcrafted ceramic wind chimes to add a soothing ambiance to your outdoor space.",
        dateAdded: "2025-03-15T10:30:00Z",
      },
    ],
    redirectUrl: "https://artisan-crafts-collective.com",
  },
  {
    id: 3,
    name: "FitLife Gear",
    location: "Kisumu, Kenya",
    logo: "https://your-supabase-project.supabase.co/storage/v1/object/public/vendor-logos/fitlife-logo.png",
    description: "Innovative fitness and wellness products for a healthier lifestyle.",
    mapLink: "https://www.google.com/maps/search/?api=1&query=EcoTech+Innovations+Nairobi+Kenya",
    defaultCurrency: "KSH",
    products: [
      {
        id: 6,
        name: "Smart Water Bottle",
        imageUrl: "https://your-supabase-project.supabase.co/storage/v1/object/public/product-images/smart-bottle.jpg",
        currentPrice: { amount: 1500.0, currency: "KSH" },
        originalPrice: { amount: 2000.0, currency: "KSH" },
        category: "Fitness Tech",
        description:
          "Stay hydrated with our smart water bottle that tracks your water intake and glows to remind you to drink.",
        dateAdded: "2025-03-15T10:30:00Z",
        isMostPreferred: true,
      },
      {
        id: 7,
        name: "Eco-Friendly Yoga Mat",
        imageUrl: "https://your-supabase-project.supabase.co/storage/v1/object/public/product-images/eco-yoga-mat.jpg",
        currentPrice: { amount: 1200.0, currency: "KSH" },
        originalPrice: { amount: 1500.0, currency: "KSH" },
        category: "Fitness Accessories",
        description: "Premium, eco-friendly yoga mat made from sustainable materials for a guilt-free practice.",
        dateAdded: "2025-03-15T10:30:00Z",
        isHotDeal: true, // Mark this as a hot deal
        hotDealEnds: "2025-04-15T23:59:59Z",
      },
    ],
    redirectUrl: "https://fitlife-gear.com",
  },
]

const formatPrice = (price: Price): string => {
  // IMPROVEMENT: Format price to prevent overflow on large screens
  // For KSH currency with large amounts, use a more compact format
  if (price.currency === "KSH" && price.amount >= 100000) {
    // Format as "KSH X,XXX,XXX" instead of using the default currency formatter
    return `${price.currency} ${price.amount.toLocaleString()}`
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    // IMPROVEMENT: Add maximumFractionDigits to prevent long decimal places
    maximumFractionDigits: 0,
  }).format(price.amount)
}

export default function OtherBusinessVentures() {
  useCookieTracking("other-business-ventures")
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors)
  const [newProductAlert, setNewProductAlert] = useState<Product | null>(null)
  const businessProducts = transformBusinessVenturesToProducts(mockVendors)
  const [isHovered, setIsHovered] = useState(false)

  // hot deals logic
  const hotBusinessDeals = businessProducts
    .filter(
      (product) =>
        product.isHotDeal ||
        (product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount > 0.2,
    )
    .map((product) => ({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      currentPrice: product.currentPrice,
      originalPrice: product.originalPrice,
      category: product.category,
      expiresAt: product.hotDealEnds || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: product.description,
      discount: Math.round(
        ((product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount) * 100,
      ),
    }))
    .slice(0, 4)

  // For swapping element
  const [productCategories, setProductCategories] = useState<string[]>(
    Array.from(new Set(mockVendors.flatMap((v) => v.products.map((p) => p.category)))),
  )
  const [swapTrigger, setSwapTrigger] = useState(0)

  // Infinite scroll states
  const [visibleProductCategories, setVisibleProductCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)
  const ITEMS_PER_PAGE = 2

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    // Find a new product to show in the alert
    const newProduct = vendors.flatMap((v) => v.products).find((p) => p.isNew)
    if (newProduct) {
      setNewProductAlert(newProduct)
    }
  }, [vendors])

  // IMPROVED SEARCH FUNCTIONALITY
  useEffect(() => {
    const filtered = vendors.filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.products.some((product) => {
          // ADDED EXPLICIT PRICE STRING CONVERSION
          const currentPriceStr = product.currentPrice.amount.toString()
          const originalPriceStr = product.originalPrice.amount.toString()
          // ADDED CURRENCY MATCHING
          const currencyMatch = product.currentPrice.currency.toLowerCase().includes(searchTerm.toLowerCase())

          return (
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            // ADDED PRODUCT DESCRIPTION
            product.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            // ADDED CATEGORY FIELD
            product.category
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            // ADDED PRICE STRING AND CURRENCY MATCHING
            currentPriceStr.includes(searchTerm) ||
            originalPriceStr.includes(searchTerm) ||
            currencyMatch
          )
        }),
    )
    setFilteredVendors(filtered)
  }, [searchTerm, vendors])

  // For swapping element
  useEffect(() => {
    // Set up interval for swapping categories
    const swapInterval = setInterval(
      () => {
        // Swap product categories
        setProductCategories((prevCategories) => swapArrayElementsRandomly(prevCategories))

        // Swap vendors within each category
        setVendors((prevVendors) => {
          const newVendors = prevVendors.map((vendor) => ({
            ...vendor,
            products: [...vendor.products], // Create a new array of products
          }))
          return swapVendorsWithinCategory(newVendors)
        })

        // Increment swap trigger to force re-render
        setSwapTrigger((prev) => prev + 1)
      },
      10 * 60 * 1000,
    ) // 10 minutes in milliseconds

    return () => clearInterval(swapInterval)
  }, [])

  // Initialize visible product categories
  useEffect(() => {
    setVisibleProductCategories(productCategories.slice(0, ITEMS_PER_PAGE))
  }, [productCategories])

  // Intersection Observer for infinite scrolling
  const loadMoreItems = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      const currentLength = visibleProductCategories.length
      const nextItems = productCategories.slice(currentLength, currentLength + ITEMS_PER_PAGE)

      if (nextItems.length > 0) {
        setVisibleProductCategories((prev) => [...prev, ...nextItems])
      } else {
        setHasMore(false)
      }

      setIsLoading(false)
    }, 800)
  }, [isLoading, hasMore, visibleProductCategories, productCategories])

  // Set up intersection observer
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

  // Reset visible items and hasMore when search term changes
  useEffect(() => {
    setVisibleProductCategories(productCategories.slice(0, ITEMS_PER_PAGE))
    setHasMore(true)
  }, [searchTerm, productCategories])

  const categories = Array.from(new Set(vendors.flatMap((v) => v.products.map((p) => p.category))))

  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-800 min-h-screen">
      {/* IMPROVEMENT: Added max-width to container to prevent excessive stretching on ultra-wide screens */}
      <div className="container mx-auto px-4 py-8 max-w-[1920px]">
        <h1 className="text-4xl font-bold text-center mb-8 text-white italic animate-pulse">
          Good Deals brings unforgettable moments!
        </h1>
        <CountdownTimer targetDate="2025-12-31T23:59:59" startDate="2025-02-14T00:00:00" />
        <NewProductsForYou allProducts={businessProducts} colorScheme="blue" maxProducts={4} />
        <HotTimeDeals
          deals={hotBusinessDeals}
          colorScheme="blue"
          title="Hot Business Opportunities"
          subtitle="Limited-time investment and business venture offers!"
        />

        {/* IMPROVEMENT: Added max-width to search container for better appearance on large screens */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products, vendors, or categories..."
              className="w-full p-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-black bg-opacity-50 text-white placeholder-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300" />
          </div>
        </div>
        {/*THE Furniture Logic shop*/}
        <div className="flex justify-center my-8">
          <Link href="/other-business-ventures/furniture-shop">
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
                <Sofa className="mr-2 h-5 w-5" />
                Explore our Exclusive Furniture shop
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

        {/*THE Furniture Logic shop*/}
        <div className="flex justify-center my-8">
          <Link href="/other-business-ventures/furniture-shop/media">
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
                <Sofa className="mr-2 h-5 w-5" />
                Explore our Exclusive Furniture Media shop
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

        {/*THE 2AUCTION Logic shop*/}
        <div className="flex justify-center my-8">
          <Link href="https://www.bit.ly/weauction">
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
                <Hammer className="mr-2 h-5 w-5" />
                Explore our Exclusive Auction shop
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

        {/* Infinite scroll implementation */}
        <AnimatePresence mode="popLayout">
          {visibleProductCategories.map((category) => (
            <motion.div
              key={category}
              className="mb-12"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 animate-bounce">{category}</h2>
              {/* IMPROVEMENT: Adjusted grid to better handle large screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredVendors
                    .filter((vendor) => vendor.products.some((product) => product.category === category))
                    .map((vendor) => (
                      <motion.div
                        key={`${vendor.id}-${category}-${swapTrigger}`}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <VendorCard vendor={vendor} category={category} />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {hasMore && (
          <div ref={loaderRef} className="flex justify-center items-center py-8">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <p className="mt-2 text-white font-medium">Loading more product categories...</p>
              </div>
            ) : (
              <div className="h-16" />
            )}
          </div>
        )}

        {/* No more items indicator */}
        {!hasMore && visibleProductCategories.length > 0 && (
          <div className="text-center py-8">
            <p className="text-white font-medium">You've seen all available product categories!</p>
          </div>
        )}

        {/* Keep the original content for backward compatibility (hidden) */}
        <div className="hidden">
          {categories.map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 animate-bounce">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {filteredVendors
                  .filter((vendor) => vendor.products.some((product) => product.category === category))
                  .map((vendor) => (
                    <VendorCard key={vendor.id} vendor={vendor} category={category} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {newProductAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-black bg-opacity-80 rounded-lg shadow-lg p-4 max-w-sm text-white"
          >
            <button
              onClick={() => setNewProductAlert(null)}
              className="absolute top-2 right-2 text-gray-300 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-2">New Product Alert!</h3>
            <p className="text-gray-300 mb-2">{newProductAlert.name} is now available!</p>
            <p className="text-purple-400 font-bold">Only {formatPrice(newProductAlert.currentPrice)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function VendorCard({ vendor, category }: { vendor: Vendor; category: string }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="bg-black bg-opacity-50 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col h-full">
      <div className="p-6">
        {/* IMPROVEMENT: Made the header more responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center">
            {/* IMPROVEMENT: Added flex-shrink-0 to prevent logo from being compressed */}
            <div className="relative flex-shrink-0">
              <Image
                src={imageError ? "/images/vendor-placeholder.png" : vendor.logo}
                alt={vendor.name}
                width={60}
                height={60}
                className="rounded-full"
                onError={() => setImageError(true)}
              />
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-white">{vendor.name}</h3>
              <p className="text-gray-300">{vendor.location}</p>
            </div>
          </div>
          <a
            href={vendor.redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition duration-300 animate-pulse whitespace-nowrap"
          >
            Visit Website
          </a>
        </div>
        <p className="text-gray-300 mb-4 line-clamp-2 md:line-clamp-none">{vendor.description}</p>
        <a
          href={vendor.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
        >
          <MapPin size={16} className="mr-1" />
          Find on Maps
        </a>
      </div>
      <div className="bg-gray-900 p-6 flex-grow">
        <h4 className="text-lg font-semibold mb-4 text-white">Featured Products</h4>
        {/* IMPROVEMENT: Simplified grid for better responsiveness */}
        <div className="grid grid-cols-1 gap-4">
          {vendor.products
            .filter((product) => product.category === category)
            .map((product) => (
              <ProductCard key={product.id} product={product} vendor={vendor} />
            ))}
        </div>
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

function ProductCard({ product, vendor }: { product: Product; vendor: Vendor }) {
  const [imageError, setImageError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const savings: Price = {
    amount: product.originalPrice.amount - product.currentPrice.amount,
    currency: product.currentPrice.currency,
  }

  const mockVendor = {
    id: 1,
    name: "Premium Business Solutions",
    location: "Nairobi, Kenya",
    logo: "/images/business-logo.png",
    description: "Leading provider of business solutions and investment opportunities",
    redirectUrl: "https://example.com",
    mapLink: "https://maps.google.com",
    verified: true,
    whatsappNumber: "+254700654321",
    businessHours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM",
    rating: 4.6,
    totalReviews: 89,
    specialties: ["Business Consulting", "Investment Planning", "Market Analysis"],
  }

  return (
    <>
      <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
        <div className="relative w-full pt-[60%]">
          <Image
            src={imageError ? "/images/product-placeholder.png" : product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={80}
            onError={() => setImageError(true)}
          />
          {product.isNew && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-bounce">
              NEW
            </div>
          )}
          {product.isMostPreferred && <MostPreferredBadge />}
          {product.dateAdded && isNewThisWeek(product.dateAdded) && (
            <div className="absolute bottom-2 left-2">
              <NewThisWeekBadge />
            </div>
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h5 className="font-semibold mb-2 text-white truncate">{product.name}</h5>
          <p className="text-sm text-gray-300 mb-2 line-clamp-3 md:line-clamp-2 xl:line-clamp-none">
            {product.description}
          </p>
          <div className="flex flex-col mb-2">
            <span className="text-lg font-bold text-purple-400 break-words">{formatPrice(product.currentPrice)}</span>
            <span className="text-sm text-gray-400 line-through break-words">{formatPrice(product.originalPrice)}</span>
          </div>
          <div className="text-sm text-gray-300 mb-2">
            <div className="flex items-center">
              <Tag size={16} className="mr-1 flex-shrink-0" />
              <span className="truncate">{product.category}</span>
            </div>
          </div>
          <div className="mt-auto space-y-2">
            <motion.button
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-full mt-2 min-w-0"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              animate={{ rotateZ: [0, 5, 0, -5, 0] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              Save {formatPrice(savings)}
            </motion.button>
            <motion.button
              className="w-full bg-green-500 text-white px-4 py-2 rounded-full mt-2 min-w-0"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Buy Now
            </motion.button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full mt-2 hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg animate-pulse min-w-0"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      <ProductModal
        product={product}
        vendor={vendor}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        colorScheme="blue"
      />
    </>
  )
}
