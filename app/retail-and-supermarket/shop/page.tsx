"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  Filter,
  ShoppingCart,
  Heart,
  ChevronDown,
  ChevronRight,
  Leaf,
  Star,
  Store,
  MapPin,
  ArrowUpCircle,
  X,
  SlidersHorizontal,
  Truck,
  Clock,
  Percent,
  Loader2,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"

// Import types, data, and utilities
import type { Product, Market } from "./types"
import { products } from "./data/products"
import { markets } from "./data/markets"
import { categories } from "./data/categories"
import {
  formatPrice,
  formatDate,
  calculateDiscount,
  getHotDeals,
  getProductsByMarket,
  filterAndSortProducts,
} from "./utils/helpers"

// Import components
import ProductCard from "./components/ProductCard"
import HotDealBadge from "./components/HotDealBadge"
import RetailTimeRecommendations from "./components/RetailTimeRecommendations"



export default function RetailSupermarketShop() {
  const { toast } = useToast()
  //const {useisMobile} = useMobile()

  // State for market selection
  const [activeMarket, setActiveMarket] = useState<Market | null>(markets[0])
  const [showMarketSelector, setShowMarketSelector] = useState(false)

  // State for product filtering and display
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState("featured")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [showFilters, setShowFilters] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  // Refs for infinite scrolling
  const observer = useRef<IntersectionObserver | null>(null)
  const ITEMS_PER_PAGE = 9

  // Get filtered products based on active market and filters
  const marketProducts = activeMarket ? getProductsByMarket(products, activeMarket.id) : products

  const filteredProducts = filterAndSortProducts(marketProducts, {
    searchQuery,
    category: activeCategory,
    subCategory: activeSubCategory,
    priceRange,
    sortOption,
  })

  // Get hot deals for the active market
  const hotDeals = getHotDeals(marketProducts, 4)

  // Get featured products for the active market
  const featuredProducts = marketProducts.filter((product) => product.isFeatured).slice(0, 4)

  // Handle infinite scrolling
  const loadMoreProducts = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      const nextPage = page + 1
      const totalItems = filteredProducts.length
      const maxItems = nextPage * ITEMS_PER_PAGE

      setHasMore(maxItems < totalItems)
      setPage(nextPage)
      setIsLoading(false)
    }, 800)
  }, [isLoading, hasMore, page, filteredProducts.length])

  // Set up intersection observer for infinite scrolling
  const lastProductElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProducts()
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoading, hasMore, loadMoreProducts],
  )

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Handle product details view
  const viewProductDetails = (product: Product) => {
    setSelectedProduct(product)
  }

  // Handle market change
  const changeMarket = (market: Market) => {
    setActiveMarket(market)
    setShowMarketSelector(false)
    setPage(1)
    setActiveCategory("all")
    setActiveSubCategory(null)
    setSearchQuery("")

    toast({
      title: "Market Changed",
      description: `You are now shopping at ${market.name}`,
      duration: 3000,
    })
  }

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setActiveCategory("all")
    setActiveSubCategory(null)
    setSortOption("featured")
    setPriceRange({ min: 0, max: 1000 })
  }

  // Get displayed products based on pagination
  const displayedProducts = filteredProducts.slice(0, page * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 dark:from-slate-950 dark:to-slate-900">
      {/* Market Selector Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 relative">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Store className="h-5 w-5 mr-2" />
            <span className="font-medium">Currently shopping at:</span>
            <button
              className="ml-2 flex items-center font-bold hover:underline"
              onClick={() => setShowMarketSelector(true)}
            >
              {activeMarket?.name}
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center">
              <Truck className="h-4 w-4 mr-1" />
              <span className="text-sm">Free delivery on orders over KSH 2,000</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">Same-day delivery available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-green-700 dark:text-green-500">
                {activeMarket?.name} <span className="text-gray-600 dark:text-gray-400 text-lg">Shop</span>
              </h1>
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-[300px]"
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Heart className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          0
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Wishlist</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          0
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Shopping Cart</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button className="hidden md:flex bg-green-600 hover:bg-green-700">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Filters (Collapsible) */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium flex items-center">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters & Sorting
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Category</label>
                  <Select value={activeCategory} onValueChange={setActiveCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Sort By</label>
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort products" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="discount">Biggest Discount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Price Range</label>
                <div className="px-2">
                  <Slider
                    defaultValue={[priceRange.max]}
                    max={1000}
                    step={50}
                    onValueChange={(values) => setPriceRange((prev) => ({ ...prev, max: values[0] }))}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span>KSH {priceRange.min}</span>
                  <span>KSH {priceRange.max}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={resetFilters} className="mr-2">
                  Reset
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Market Description */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
              <Image
                src={activeMarket?.logo || "/placeholder.svg"}
                alt={activeMarket?.name || "Market"}
                width={64}
                height={64}
                className="object-cover"
              />
            </div>

            <div className="flex-grow">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{activeMarket?.name}</h2>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{activeMarket?.location}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{activeMarket?.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              {activeMarket?.specialties.map((specialty, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

{/* Time-Based Recommendations Section */}
<div className="container mx-auto px-4 py-4">
        <RetailTimeRecommendations products={marketProducts} />
      </div>

      {/* Hot Deals Section */}
      {hotDeals.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/30 dark:to-amber-950/30 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                <Percent className="h-5 w-5 mr-2 text-red-500" />
                Hot Deals
              </h2>
              <Link
                href="#"
                className="text-red-600 dark:text-red-400 hover:underline text-sm font-medium flex items-center"
              >
                View All Deals
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {hotDeals.map((deal, index) => (
                <Card
                  key={deal.id}
                  className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                    <Image src={deal.imageUrl || "/placeholder.svg"} alt={deal.name} fill className="object-cover" />
                    <div className="absolute top-0 right-0">
                      <HotDealBadge />
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-red-500 text-white">{deal.discount}% OFF</Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">{deal.name}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-red-600 dark:text-red-400">
                          {formatPrice(deal.currentPrice)}
                        </span>
                        <span className="text-sm line-through text-gray-400">{formatPrice(deal.originalPrice)}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Ends in {new Date(deal.expiresAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 h-8 px-2"
                >
                  Reset
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Categories</h4>
                <div className="space-y-2">
                  <div
                    className={`flex items-center px-2 py-1.5 rounded-md cursor-pointer ${
                      activeCategory === "all"
                        ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      setActiveCategory("all")
                      setActiveSubCategory(null)
                    }}
                  >
                    <span className="flex-grow">All Categories</span>
                  </div>

                  {categories.map((category) => (
                    <div key={category.id}>
                      <div
                        className={`flex items-center px-2 py-1.5 rounded-md cursor-pointer ${
                          activeCategory === category.id
                            ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => {
                          setActiveCategory(category.id)
                          setActiveSubCategory(null)
                        }}
                      >
                        <span className="flex-grow">{category.name}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${activeCategory === category.id ? "transform rotate-180" : ""}`}
                        />
                      </div>

                      {activeCategory === category.id && (
                        <div className="ml-4 mt-1 space-y-1">
                          {category.subCategories.map((subCategory) => (
                            <div
                              key={subCategory.id}
                              className={`flex items-center px-2 py-1 text-sm rounded-md cursor-pointer ${
                                activeSubCategory === subCategory.id
                                  ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
                              }`}
                              onClick={() => setActiveSubCategory(subCategory.id)}
                            >
                              <span>{subCategory.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Price Range</h4>
                <div className="px-2">
                  <Slider
                    defaultValue={[priceRange.max]}
                    max={1000}
                    step={50}
                    onValueChange={(values) => setPriceRange((prev) => ({ ...prev, max: values[0] }))}
                  />
                </div>
                <div className="flex justify-between mt-4 text-sm">
                  <span>KSH {priceRange.min}</span>
                  <span>KSH {priceRange.max}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Sort By</h4>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort products" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="discount">Biggest Discount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">Apply Filters</Button>
            </div>
          </div>

          {/* Main Products Area */}
          <div className="flex-grow">
            {/* Category Tabs (Mobile & Desktop) */}
            <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
              <TabsList className="bg-white dark:bg-slate-900 p-1 overflow-x-auto flex w-full h-auto border border-gray-200 dark:border-gray-800 rounded-lg">
                <TabsTrigger value="all" className="flex-shrink-0 h-9">
                  All
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="flex-shrink-0 h-9">
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Sub-category selection (if a category is active) */}
              {activeCategory !== "all" && (
                <div className="flex overflow-x-auto gap-2 mt-4 pb-2 no-scrollbar">
                  <Badge
                    variant={activeSubCategory === null ? "default" : "outline"}
                    className={`cursor-pointer ${
                      activeSubCategory === null
                        ? "bg-green-600 hover:bg-green-700"
                        : "hover:bg-green-50 dark:hover:bg-green-900/30"
                    }`}
                    onClick={() => setActiveSubCategory(null)}
                  >
                    All {categories.find((c) => c.id === activeCategory)?.name}
                  </Badge>

                  {categories
                    .find((c) => c.id === activeCategory)
                    ?.subCategories.map((subCategory) => (
                      <Badge
                        key={subCategory.id}
                        variant={activeSubCategory === subCategory.id ? "default" : "outline"}
                        className={`cursor-pointer ${
                          activeSubCategory === subCategory.id
                            ? "bg-green-600 hover:bg-green-700"
                            : "hover:bg-green-50 dark:hover:bg-green-900/30"
                        }`}
                        onClick={() => setActiveSubCategory(subCategory.id)}
                      >
                        {subCategory.name}
                      </Badge>
                    ))}
                </div>
              )}
            </Tabs>

            {/* Products Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {activeCategory === "all" ? "All Products" : categories.find((c) => c.id === activeCategory)?.name}
                  {activeSubCategory && (
                    <span className="text-gray-500 dark:text-gray-400 font-normal ml-2">
                      &gt;{" "}
                      {
                        categories
                          .find((c) => c.id === activeCategory)
                          ?.subCategories.find((sc) => sc.id === activeSubCategory)?.name
                      }
                    </span>
                  )}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {displayedProducts.length} of {filteredProducts.length} products
                </p>
              </div>

              <div className="hidden md:block">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="discount">Biggest Discount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {displayedProducts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No products found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <Button onClick={resetFilters} className="bg-green-600 hover:bg-green-700">
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    isLastElement={index === displayedProducts.length - 1}
                    onViewDetails={viewProductDetails}
                    // Fix: Use the ref only on the last element
                    ref={index === displayedProducts.length - 1 ? lastProductElementRef : undefined}
                  />
                ))}
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-center my-8">
                <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow">
                  <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                  <span>Loading more products...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Market Selector Dialog */}
      <Dialog open={showMarketSelector} onOpenChange={setShowMarketSelector}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose a Market</DialogTitle>
            <DialogDescription>Select a market to browse their products and special offers.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-4">
            {markets.map((market) => (
              <div
                key={market.id}
                className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors ${
                  activeMarket?.id === market.id
                    ? "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800"
                    : "bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => changeMarket(market)}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 mr-4 flex-shrink-0">
                  <Image
                    src={market.logo || "/placeholder.svg"}
                    alt={market.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>

                <div className="flex-grow">
                  <div className="flex items-center">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{market.name}</h3>
                    {market.featured && (
                      <Badge className="ml-2 bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{market.location}</span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{market.description}</p>
                </div>

                {activeMarket?.id === market.id && (
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative h-80 md:h-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />

                {selectedProduct.isNew && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-blue-500 text-white">New</Badge>
                  </div>
                )}

                {selectedProduct.isHotDeal && (
                  <div className="absolute top-0 right-0">
                    <HotDealBadge />
                  </div>
                )}

                {calculateDiscount(selectedProduct.originalPrice, selectedProduct.currentPrice) > 0 && (
                  <div className="absolute bottom-2 right-2">
                    <Badge className="bg-red-500 text-white">
                      {calculateDiscount(selectedProduct.originalPrice, selectedProduct.currentPrice)}% OFF
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedProduct.category.charAt(0).toUpperCase() + selectedProduct.category.slice(1)}
                  </Badge>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span>{selectedProduct.rating}</span>
                    <span className="text-gray-400 ml-1">({selectedProduct.reviewCount} reviews)</span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{selectedProduct.name}</h2>

                <div className="flex items-center gap-2 mb-4">
                  {selectedProduct.isOrganic && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 flex items-center gap-1">
                      <Leaf className="h-3 w-3" />
                      Organic
                    </Badge>
                  )}

                  {selectedProduct.badges?.map((badge, index) => (
                    <Badge key={index} variant="outline" className="capitalize">
                      {badge}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatPrice(selectedProduct.currentPrice)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{selectedProduct.unit}</span>
                  </div>

                  {selectedProduct.originalPrice.amount > selectedProduct.currentPrice.amount && (
                    <span className="text-lg line-through text-gray-400">
                      {formatPrice(selectedProduct.originalPrice)}
                    </span>
                  )}
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedProduct.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Origin</h4>
                    <p className="text-gray-900 dark:text-gray-100">{selectedProduct.origin}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Vendor</h4>
                    <p className="text-gray-900 dark:text-gray-100">{selectedProduct.vendor}</p>
                  </div>

                  {selectedProduct.harvestDate && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Harvest Date</h4>
                      <p className="text-gray-900 dark:text-gray-100">{formatDate(selectedProduct.harvestDate)}</p>
                    </div>
                  )}

                  {selectedProduct.expiryDate && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Best Before</h4>
                      <p className="text-gray-900 dark:text-gray-100">{formatDate(selectedProduct.expiryDate)}</p>
                    </div>
                  )}
                </div>

                {selectedProduct.nutritionalInfo && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Nutritional Information
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{selectedProduct.nutritionalInfo}</p>
                  </div>
                )}

                {selectedProduct.storageInfo && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Storage Information</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{selectedProduct.storageInfo}</p>
                  </div>
                )}

                <div className="flex items-center gap-3 mt-6">
                  <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md">
                    <button className="px-3 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      -
                    </button>
                    <span className="px-3 py-2 text-gray-900 dark:text-gray-100">1</span>
                    <button className="px-3 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      +
                    </button>
                  </div>

                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>

                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Scroll to top button */}
      {showScrollToTop && (
        <button
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110"
          onClick={scrollToTop}
        >
          <ArrowUpCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}

