"use client"

import type React from "react"

import { useMemo, useRef, useCallback } from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  Search,
  Filter,
  ChevronDown,
  Star,
  Heart,
  ShoppingBag,
  X,
  Sparkles,
  Percent,
  Check,
  Store,
  MapPin,
  ChevronRight,
  Bell,
  ArrowUpRight,
  Leaf,
  Tag,
  RefreshCw,
  Clock,
  ShieldCheck,
  Zap,
  Gift,
  Crown,
  SearhX,
  
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
//import TrendingPopularSection from "@/components/TrendingPopularSection"
import { TimeBasedRecommendations } from "@/components/TimeBasedRecommendations"
//import { beautyTrendingProducts, beautyPopularProducts } from "./trending-data"
import { beautyProducts, beautyVendors, beautyCategories } from "./beauty-mock-data"
import Link from "next/link"
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
  skinType?: string[]
  concerns?: string[]
  freeGift?: boolean
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
  description?: string
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
  productCount: number
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

// Helper function to transform data for hot deals
const transformForHotDeals = (products: BeautyProduct[]) => {
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

{/*// Custom color scheme for beauty products
const beautyColorScheme = {
  primary: "from-violet-500 to-fuchsia-600",
  secondary: "bg-violet-100",
  accent: "bg-fuchsia-600",
  text: "text-violet-900",
  background: "bg-violet-50",
}
*/}
export default function BeautyProductsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("skincare")
  const [activeSubcategory, setActiveSubcategory] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([])
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortOrder, setSortOrder] = useState("discount")
  const [selectedProduct, setSelectedProduct] = useState<BeautyProduct | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(true) // Default to showing discounted products
  const [showOnlyOrganic, setShowOnlyOrganic] = useState(false)
  const [showOnlyBestSellers, setShowOnlyBestSellers] = useState(false)
  const [showOnlyNewArrivals, setShowOnlyNewArrivals] = useState(false)
  const [showOnlyFreeGifts, setShowOnlyFreeGifts] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // New product alert state
  const [newProductAlert, setNewProductAlert] = useState<BeautyProduct | null>(null)

  // Infinite scroll states
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [visibleProducts, setVisibleProducts] = useState<BeautyProduct[]>([])
  const loaderRef = useRef<HTMLDivElement>(null)
  const productsPerPage = 8

  // Get all available brands
  const allBrands = useMemo(() => {
    return Array.from(new Set(beautyProducts.map((product) => product.brand)))
  }, [])

  // Get all available skin types
  const allSkinTypes = useMemo(() => {
    const skinTypes = new Set<string>()
    beautyProducts.forEach((product) => {
      product.skinType?.forEach((type) => skinTypes.add(type))
    })
    return Array.from(skinTypes)
  }, [])

  // Get all available concerns
  const allConcerns = useMemo(() => {
    const concerns = new Set<string>()
    beautyProducts.forEach((product) => {
      product.concerns?.forEach((concern) => concerns.add(concern))
    })
    return Array.from(concerns)
  }, [])

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    let results = beautyProducts

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

    // Filter by skin types
    if (selectedSkinTypes.length > 0) {
      results = results.filter(
        (product) => product.skinType && product.skinType.some((type) => selectedSkinTypes.includes(type)),
      )
    }

    // Filter by concerns
    if (selectedConcerns.length > 0) {
      results = results.filter(
        (product) => product.concerns && product.concerns.some((concern) => selectedConcerns.includes(concern)),
      )
    }

    // Filter by discount
    if (showOnlyDiscounted) {
      results = results.filter((product) => product.discount && product.discount > 0)
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
      results = results.filter((product) => product.isNew || isNewProduct(product.dateAdded))
    }

    // Filter by free gifts
    if (showOnlyFreeGifts) {
      results = results.filter((product) => product.freeGift)
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
    } else if (sortOrder === "newest") {
      results.sort((a, b) => {
        const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0
        const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0
        return dateB - dateA
      })
    }

    return results
  }, [
    activeCategory,
    activeSubcategory,
    searchTerm,
    priceRange,
    selectedBrands,
    selectedSkinTypes,
    selectedConcerns,
    sortOrder,
    showOnlyDiscounted,
    showOnlyOrganic,
    showOnlyBestSellers,
    showOnlyNewArrivals,
    showOnlyFreeGifts,
  ])

  // Get vendor for a product
  const getVendorForProduct = (vendorId: string) => {
    return beautyVendors.find((vendor) => vendor.id === vendorId)
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

  const handleSkinTypeToggle = (skinType: string) => {
    setSelectedSkinTypes((prev) => {
      const newTypes = prev.includes(skinType) ? prev.filter((t) => t !== skinType) : [...prev, skinType]
      return newTypes
    })
    resetPagination()
  }

  const handleConcernToggle = (concern: string) => {
    setSelectedConcerns((prev) => {
      const newConcerns = prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
      return newConcerns
    })
    resetPagination()
  }

  const handleProductClick = (product: BeautyProduct) => {
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

  const resetAllFilters = () => {
    setActiveSubcategory("")
    setPriceRange([0, 10000])
    setSelectedBrands([])
    setSelectedSkinTypes([])
    setSelectedConcerns([])
    setShowOnlyOrganic(false)
    setShowOnlyBestSellers(false)
    setShowOnlyNewArrivals(false)
    setShowOnlyFreeGifts(false)
    setSearchTerm("")
    setSortOrder("discount")
    resetPagination()
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

  // Show new product alert
  useEffect(() => {
    // Find the newest product (added in the last 3 days)
    const newestProducts = beautyProducts.filter((product) => {
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
    return transformForHotDeals(beautyProducts)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-fuchsia-50 to-purple-50">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-violet-500 to-fuchsia-600 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-300 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-fuchsia-300 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Beauty Products</h1>
              <p className="text-violet-100 text-lg md:text-xl max-w-2xl">
                Discover premium beauty products at amazing discounts. Pamper yourself without breaking the bank!
              </p>
            </div>
            <div className="hidden md:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/20 backdrop-blur-md p-6 rounded-lg shadow-lg"
              >
                <div className="text-white text-center">
                  <Percent className="h-10 w-10 mx-auto mb-3" />
                  <p className="font-medium text-xl">Special Offers</p>
                  <p className="text-lg">Up to 50% off</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full opacity-70 blur"></div>
              <div className="relative flex items-center">
                <Input
                  type="text"
                  placeholder="Search for products, brands, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-6 rounded-full border-transparent bg-white/90 backdrop-blur-sm text-violet-900 placeholder:text-violet-400 focus:ring-violet-500 focus:border-transparent w-full shadow-lg"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-violet-500">
                  <Search className="h-6 w-6" />
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-violet-400 hover:text-violet-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="container mx-auto px-4 mb-8 mt-8">
        <CountdownTimer targetDate="2025-05-31T23:59:59" startDate="2025-03-01T00:00:00" />
      </div>

      {/* Hot Time Deals Section */}
      {hotDeals.length > 0 && (
        <div className="container mx-auto px-4 mb-8">
          <HotTimeDeals
            deals={hotDeals}
            colorScheme="violet"
            title="Limited Time Beauty Deals"
            subtitle="Grab these exclusive beauty offers before they're gone!"
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
  
      {/* Trending and Popular Section */}{/*
      <div className="container mx-auto px-4 mb-12">
        <TrendingPopularSection
          trendingProducts={beautyTrendingProducts}
          popularProducts={beautyPopularProducts}
          colorScheme={beautyColorScheme}
          title="Beauty Favorites"
          subtitle="Discover trending and most popular beauty products"
        />
      </div>
      */}
   {/* Trending and Popular Section */}{/*
      <TrendingPopularSection
        trendingProducts={trendingProducts}
        popularProducts={popularProducts}
        colorScheme={beautyColorScheme}
        title="Beauty Favorites"
        subtitle="Discover trending and most popular beauty products"
      />*/}
      {/*some beauty shop logic*/}
      <div className="flex justify-center my-8">
        <Link href="/beauty-and-massage/shop/best-beauty-usage">
          <Button
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
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
              Open our Beauty Products Usage
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
      {/* Categories and filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg border border-violet-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-violet-900">All Beauty Products</h2>
            <div className="flex flex-wrap gap-3">
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px] border-violet-200">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">Biggest Discount</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="flex items-center gap-2 border-violet-200 hover:bg-violet-50"
              >
                <Filter className="h-4 w-4 text-violet-500" />
                <span>Filters</span>
                <ChevronDown
                  className={`h-4 w-4 text-violet-500 transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </Button>
            </div>
          </div>

          {/* Category tabs */}
          <Tabs defaultValue="skincare" value={activeCategory} onValueChange={handleCategoryChange} className="w-full">
            <TabsList className="bg-violet-50 p-1 rounded-xl mb-6 flex flex-nowrap overflow-x-auto hide-scrollbar">
              {beautyCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className={`flex items-center gap-1.5 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-violet-700 hover:bg-violet-100"
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Filters section */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-6"
                >
                  <div className="bg-violet-50 p-6 rounded-xl border border-violet-100">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-violet-900">Refine Your Search</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetAllFilters}
                        className="text-violet-600 hover:text-violet-800 hover:bg-violet-100"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Reset All
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Price range filter */}
                      <div>
                        <h4 className="text-sm font-medium text-violet-900 mb-4 flex items-center">
                          <Tag className="h-4 w-4 mr-1.5 text-violet-600" />
                          Price Range
                        </h4>
                        <div className="px-4">
                          <Slider
                            defaultValue={[0, 10000]}
                            max={10000}
                            step={500}
                            value={priceRange}
                            onValueChange={handlePriceRangeChange}
                            className="mb-6"
                          />
                          <div className="flex justify-between text-sm text-violet-700">
                            <span>{formatPrice({ amount: priceRange[0], currency: "KSH" })}</span>
                            <span>{formatPrice({ amount: priceRange[1], currency: "KSH" })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Brand filter */}
                      <div>
                        <h4 className="text-sm font-medium text-violet-900 mb-4 flex items-center">
                          <Store className="h-4 w-4 mr-1.5 text-violet-600" />
                          Brands
                        </h4>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-violet-300 scrollbar-track-violet-100">
                          {allBrands.map((brand) => (
                            <div key={brand} className="flex items-center space-x-2">
                              <Checkbox
                                id={`brand-${brand}`}
                                checked={selectedBrands.includes(brand)}
                                onCheckedChange={() => handleBrandToggle(brand)}
                                className="border-violet-300 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                              />
                              <Label
                                htmlFor={`brand-${brand}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-violet-800"
                              >
                                {brand}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Skin Type filter */}
                      <div>
                        <h4 className="text-sm font-medium text-violet-900 mb-4 flex items-center">
                          <ShieldCheck className="h-4 w-4 mr-1.5 text-violet-600" />
                          Skin Type
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {allSkinTypes.map((skinType) => (
                            <div key={skinType} className="flex items-center space-x-2">
                              <Checkbox
                                id={`skin-${skinType}`}
                                checked={selectedSkinTypes.includes(skinType)}
                                onCheckedChange={() => handleSkinTypeToggle(skinType)}
                                className="border-violet-300 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                              />
                              <Label
                                htmlFor={`skin-${skinType}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-violet-800"
                              >
                                {skinType}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Concerns filter */}
                      <div>
                        <h4 className="text-sm font-medium text-violet-900 mb-4 flex items-center">
                          <Zap className="h-4 w-4 mr-1.5 text-violet-600" />
                          Concerns
                        </h4>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-violet-300 scrollbar-track-violet-100">
                          {allConcerns.map((concern) => (
                            <div key={concern} className="flex items-center space-x-2">
                              <Checkbox
                                id={`concern-${concern}`}
                                checked={selectedConcerns.includes(concern)}
                                onCheckedChange={() => handleConcernToggle(concern)}
                                className="border-violet-300 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                              />
                              <Label
                                htmlFor={`concern-${concern}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-violet-800"
                              >
                                {concern}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick filters */}
                    <div className="mt-6 border-t border-violet-200 pt-6">
                      <h4 className="text-sm font-medium text-violet-900 mb-4">Quick Filters</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "rounded-full border-violet-200 hover:bg-violet-100",
                            showOnlyDiscounted && "bg-violet-100 border-violet-300 text-violet-800",
                          )}
                          onClick={() => setShowOnlyDiscounted(!showOnlyDiscounted)}
                        >
                          <Percent className="h-3.5 w-3.5 mr-1.5 text-violet-600" />
                          On Sale
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "rounded-full border-violet-200 hover:bg-violet-100",
                            showOnlyBestSellers && "bg-violet-100 border-violet-300 text-violet-800",
                          )}
                          onClick={() => setShowOnlyBestSellers(!showOnlyBestSellers)}
                        >
                          <Crown className="h-3.5 w-3.5 mr-1.5 text-violet-600" />
                          Best Sellers
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "rounded-full border-violet-200 hover:bg-violet-100",
                            showOnlyNewArrivals && "bg-violet-100 border-violet-300 text-violet-800",
                          )}
                          onClick={() => setShowOnlyNewArrivals(!showOnlyNewArrivals)}
                        >
                          <Sparkles className="h-3.5 w-3.5 mr-1.5 text-violet-600" />
                          New Arrivals
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "rounded-full border-violet-200 hover:bg-violet-100",
                            showOnlyOrganic && "bg-violet-100 border-violet-300 text-violet-800",
                          )}
                          onClick={() => setShowOnlyOrganic(!showOnlyOrganic)}
                        >
                          <Leaf className="h-3.5 w-3.5 mr-1.5 text-violet-600" />
                          Organic
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "rounded-full border-violet-200 hover:bg-violet-100",
                            showOnlyFreeGifts && "bg-violet-100 border-violet-300 text-violet-800",
                          )}
                          onClick={() => setShowOnlyFreeGifts(!showOnlyFreeGifts)}
                        >
                          <Gift className="h-3.5 w-3.5 mr-1.5 text-violet-600" />
                          Free Gifts
                        </Button>
                      </div>
                    </div>

                    {/* Active filters */}
                    {(selectedBrands.length > 0 ||
                      selectedSkinTypes.length > 0 ||
                      selectedConcerns.length > 0 ||
                      priceRange[0] > 0 ||
                      priceRange[1] < 10000 ||
                      showOnlyOrganic ||
                      showOnlyBestSellers ||
                      showOnlyNewArrivals ||
                      showOnlyFreeGifts) && (
                      <div className="mt-6 border-t border-violet-200 pt-6">
                        <h4 className="text-sm font-medium text-violet-900 mb-4">Active Filters</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedBrands.map((brand) => (
                            <Badge
                              key={`selected-${brand}`}
                              className="bg-violet-100 text-violet-800 hover:bg-violet-200 px-3 py-1.5 flex items-center gap-1"
                              onClick={() => handleBrandToggle(brand)}
                            >
                              {brand}
                              <X className="h-3 w-3 ml-1 cursor-pointer" />
                            </Badge>
                          ))}
                          {selectedSkinTypes.map((skinType) => (
                            <Badge
                              key={`selected-skin-${skinType}`}
                              className="bg-violet-100 text-violet-800 hover:bg-violet-200 px-3 py-1.5 flex items-center gap-1"
                              onClick={() => handleSkinTypeToggle(skinType)}
                            >
                              {skinType}
                              <X className="h-3 w-3 ml-1 cursor-pointer" />
                            </Badge>
                          ))}
                          {selectedConcerns.map((concern) => (
                            <Badge
                              key={`selected-concern-${concern}`}
                              className="bg-violet-100 text-violet-800 hover:bg-violet-200 px-3 py-1.5 flex items-center gap-1"
                              onClick={() => handleConcernToggle(concern)}
                            >
                              {concern}
                              <X className="h-3 w-3 ml-1 cursor-pointer" />
                            </Badge>
                          ))}
                          {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                            <Badge className="bg-violet-100 text-violet-800 hover:bg-violet-200 px-3 py-1.5">
                              Price: {formatPrice({ amount: priceRange[0], currency: "KSH" })} -{" "}
                              {formatPrice({ amount: priceRange[1], currency: "KSH" })}
                            </Badge>
                          )}
                          {showOnlyOrganic && (
                            <Badge
                              className="bg-violet-100 text-violet-800 hover:bg-violet-200 px-3 py-1.5 flex items-center gap-1"
                              onClick={() => setShowOnlyOrganic(false)}
                            >
                              Organic
                              <X className="h-3 w-3 ml-1 cursor-pointer" />
                            </Badge>
                          )}
                          {showOnlyBestSellers && (
                            <Badge
                              className="bg-violet-100 text-violet-800 hover:bg-violet-200 px-3 py-1.5 flex items-center gap-1"
                              onClick={() => setShowOnlyBestSellers(false)}
                            >
                              Best Sellers
                              <X className="h-3 w-3 ml-1 cursor-pointer" />
                            </Badge>
                          )}
                          {showOnlyNewArrivals && (
                            <Badge
                              className="bg-violet-100 text-violet-800 hover:bg-violet-200 px-3 py-1.5 flex items-center gap-1"
                              onClick={() => setShowOnlyNewArrivals(false)}
                            >
                              New Arrivals
                              <X className="h-3 w-3 ml-1 cursor-pointer" />
                            </Badge>
                          )}
                          {showOnlyFreeGifts && (
                            <Badge
                              className="bg-violet-100 text-violet-800 hover:bg-violet-200 px-3 py-1.5 flex items-center gap-1"
                              onClick={() => setShowOnlyFreeGifts(false)}
                            >
                              Free Gifts
                              <X className="h-3 w-3 ml-1 cursor-pointer" />
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subcategories */}
            {beautyCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="mb-8 overflow-x-auto hide-scrollbar">
                  <div className="flex space-x-2 pb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`rounded-full whitespace-nowrap ${
                        activeSubcategory === ""
                          ? "bg-violet-100 border-violet-300 text-violet-800"
                          : "border-violet-200 text-violet-700 hover:bg-violet-50"
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
                            ? "bg-violet-100 border-violet-300 text-violet-800"
                            : "border-violet-200 text-violet-700 hover:bg-violet-50"
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
                          <Card className="h-full overflow-hidden border-violet-100 hover:border-violet-300 hover:shadow-lg transition-all duration-300">
                            <div className="cursor-pointer" onClick={() => handleProductClick(product)}>
                              {/* Product image */}
                              <div className="relative h-64 bg-violet-50">
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
                                      <Crown className="h-3 w-3" />
                                      <span>Best Seller</span>
                                    </Badge>
                                  )}
                                  {product.isOrganic && (
                                    <Badge className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1">
                                      <Leaf className="h-3 w-3" />
                                      <span>Organic</span>
                                    </Badge>
                                  )}
                                  {product.freeGift && (
                                    <Badge className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white flex items-center gap-1">
                                      <Gift className="h-3 w-3" />
                                      <span>Free Gift</span>
                                    </Badge>
                                  )}
                                </div>

                                {/* Discount badge */}
                                {product.discount && product.discount > 0 && (
                                  <div className="absolute top-2 right-2">
                                    <Badge className="bg-violet-600 hover:bg-violet-700 text-white font-bold">
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

                                {/* Wishlist button */}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white text-violet-500 hover:text-violet-600"
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
                                  <Badge variant="outline" className="text-xs border-violet-200 text-violet-700">
                                    {
                                      beautyCategories
                                        .find((c) => c.id === product.category)
                                        ?.subcategories.find((s) => s.id === product.subcategory)?.name
                                    }
                                  </Badge>
                                  <span className="text-xs text-violet-600 font-medium">{product.brand}</span>
                                </div>

                                <h3 className="font-semibold text-violet-900 mb-1 line-clamp-1">{product.name}</h3>
                                <p className="text-sm text-violet-600 mb-3 line-clamp-2">{product.description}</p>

                                {/* Vendor info */}
                                {vendor && (
                                  <div className="flex items-center mb-3 bg-violet-50 p-2 rounded-md">
                                    <div className="w-8 h-8 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 font-bold text-xs mr-2">
                                      {vendor.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-violet-800 truncate">
                                        {vendor.name}
                                        {vendor.verified && (
                                          <Badge className="ml-1 bg-violet-500 text-white flex items-center gap-0.5 px-1 py-0 text-xs">
                                            <Check className="h-2 w-2" />
                                          </Badge>
                                        )}
                                      </p>
                                      <p className="text-xs text-violet-600 flex items-center">
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
                                              : "text-violet-200"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="ml-1 text-xs text-violet-600">({product.reviewCount})</span>
                                  </div>
                                )}

                                {/* Price */}
                                <div className="flex items-end justify-between mb-3">
                                  <div>
                                    <div className="text-lg font-bold text-violet-900">
                                      {formatPrice(product.currentPrice)}
                                    </div>
                                    {product.originalPrice.amount !== product.currentPrice.amount && (
                                      <div className="text-sm text-violet-500 line-through">
                                        {formatPrice(product.originalPrice)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </div>

                            {/* Action buttons */}
                            <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                              <Button
                                variant="outline"
                                className="border-violet-200 text-violet-600 hover:bg-violet-50 flex items-center justify-center gap-1"
                                onClick={() => handleProductClick(product)}
                              >
                                <Sparkles className="h-4 w-4" />
                                <span>Details</span>
                              </Button>

                              <Button
                                className="bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center gap-1"
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
                      <div className="w-12 h-12 border-4 border-violet-300 border-t-violet-600 rounded-full animate-spin mb-3"></div>
                      <p className="text-violet-600 font-medium">Loading products...</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-violet-100">
                    <div className="mx-auto w-16 h-16 mb-4 bg-violet-100 rounded-full flex items-center justify-center">
                      <SearchX className="h-8 w-8 text-violet-500" />
                    </div>
                    <h3 className="text-xl font-medium text-violet-900 mb-2">No products found</h3>
                    <p className="text-violet-600 max-w-md mx-auto">
                      We couldn't find any products matching your criteria. Try adjusting your filters or search term.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 border-violet-200 text-violet-600 hover:bg-violet-50"
                      onClick={resetAllFilters}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset All Filters
                    </Button>
                  </div>
                )}

                {/* Infinite scroll loader */}
                {hasMore && (
                  <div ref={loaderRef} className="flex justify-center items-center py-8">
                    {isLoading && (
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 border-4 border-violet-300 border-t-violet-600 rounded-full animate-spin mb-2"></div>
                        <p className="text-violet-600 text-sm">Loading more products...</p>
                      </div>
                    )}
                  </div>
                )}

                {/* End of results message */}
                {!hasMore && visibleProducts.length > 0 && (
                  <div className="text-center py-8 border-t border-violet-100 mt-8">
                    <p className="text-violet-600">You've reached the end of the results</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Product detail modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && closeProductModal()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product image */}
              <div className="relative h-80 md:h-full rounded-lg overflow-hidden bg-violet-50">
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
                      <Crown className="h-3 w-3" />
                      <span>Best Seller</span>
                    </Badge>
                  )}
                  {selectedProduct.isOrganic && (
                    <Badge className="bg-green-500 text-white flex items-center gap-1">
                      <Leaf className="h-3 w-3" />
                      <span>Organic</span>
                    </Badge>
                  )}
                  {selectedProduct.freeGift && (
                    <Badge className="bg-fuchsia-500 text-white flex items-center gap-1">
                      <Gift className="h-3 w-3" />
                      <span>Free Gift</span>
                    </Badge>
                  )}
                </div>

                {/* Discount badge */}
                {selectedProduct.discount && selectedProduct.discount > 0 && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-violet-600 text-white font-bold">{selectedProduct.discount}% OFF</Badge>
                  </div>
                )}
              </div>

              {/* Product details */}
              <div className="flex flex-col">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs border-violet-200 text-violet-700">
                      {
                        beautyCategories
                          .find((c) => c.id === selectedProduct.category)
                          ?.subcategories.find((s) => s.id === selectedProduct.subcategory)?.name
                      }
                    </Badge>
                    <span className="text-sm text-violet-600 font-medium">{selectedProduct.brand}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-violet-900 mb-2">{selectedProduct.name}</h2>

                  {/* Vendor info */}
                  {getVendorForProduct(selectedProduct.vendorId) && (
                    <div className="flex items-center mb-4 bg-violet-50 p-3 rounded-md">
                      <div className="w-10 h-10 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 font-bold text-xs mr-3">
                        {getVendorForProduct(selectedProduct.vendorId)?.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-violet-800">
                          {getVendorForProduct(selectedProduct.vendorId)?.name}
                          {getVendorForProduct(selectedProduct.vendorId)?.verified && (
                            <Badge className="ml-1 bg-violet-500 text-white flex items-center gap-0.5 px-1 py-0 text-xs">
                              <Check className="h-2 w-2" />
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-violet-600 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{getVendorForProduct(selectedProduct.vendorId)?.location}</span>
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-violet-200 text-violet-600 hover:bg-violet-50"
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
                                : "text-violet-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-sm text-violet-600">
                        {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviewCount} reviews)
                      </span>
                    </div>
                  )}

                  <p className="text-violet-700 mb-4">{selectedProduct.description}</p>

                  {/* Skin Type */}
                  {selectedProduct.skinType && selectedProduct.skinType.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-violet-900 mb-2">Suitable For</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.skinType.map((type, index) => (
                          <Badge key={index} variant="outline" className="border-violet-200 text-violet-700">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Concerns */}
                  {selectedProduct.concerns && selectedProduct.concerns.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-violet-900 mb-2">Addresses</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.concerns.map((concern, index) => (
                          <Badge key={index} variant="outline" className="border-violet-200 text-violet-700">
                            {concern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ingredients */}
                  {selectedProduct.ingredients && selectedProduct.ingredients.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-violet-900 mb-2">Ingredients</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.ingredients.map((ingredient, index) => (
                          <Badge key={index} variant="outline" className="border-violet-200 text-violet-700">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benefits */}
                  {selectedProduct.benefits && selectedProduct.benefits.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-violet-900 mb-2">Benefits</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedProduct.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                            <span className="text-violet-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* How to use */}
                  {selectedProduct.howToUse && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-violet-900 mb-2">How to Use</h3>
                      <p className="text-violet-700">{selectedProduct.howToUse}</p>
                    </div>
                  )}

                  {/* Stock status */}
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-violet-900 mb-2">Availability</h3>
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
                        <span className="ml-2 text-sm text-violet-600">
                          {selectedProduct.stockCount} units available
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price and buttons */}
                  <div className="mt-auto">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-violet-900">
                          {formatPrice(selectedProduct.currentPrice)}
                        </div>
                        {selectedProduct.originalPrice.amount !== selectedProduct.currentPrice.amount && (
                          <div className="text-base text-violet-500 line-through">
                            {formatPrice(selectedProduct.originalPrice)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        className="border-violet-200 text-violet-600 hover:bg-violet-50 flex-1 flex items-center justify-center gap-2"
                      >
                        <Heart className="h-4 w-4" />
                        <span>Add to Wishlist</span>
                      </Button>

                      <Button
                        className="bg-violet-600 hover:bg-violet-700 text-white flex-1 flex items-center justify-center gap-2"
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

      {/* New Product Alert */}
      <AnimatePresence>
        {newProductAlert && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 max-w-md bg-white rounded-lg shadow-xl border-l-4 border-violet-500 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-violet-100 rounded-full p-2">
                  <Bell className="h-6 w-6 text-violet-500" />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <h3 className="text-lg font-medium text-violet-900">New Product Alert!</h3>
                  <p className="mt-1 text-sm text-violet-600">
                    Check out the new {newProductAlert.name} from {newProductAlert.brand}. Limited stock available!
                  </p>
                  <div className="mt-3 flex gap-3">
                    <Button
                      size="sm"
                      className="bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-1"
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
                      className="border-violet-200 text-violet-600 hover:bg-violet-50"
                      onClick={closeNewProductAlert}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-white rounded-md inline-flex text-violet-400 hover:text-violet-500 focus:outline-none"
                    onClick={closeNewProductAlert}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-violet-100">
              <motion.div
                className="h-full bg-violet-500"
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
