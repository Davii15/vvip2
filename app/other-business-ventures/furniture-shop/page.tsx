"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import {
  Search,
  Filter,
  X,
  Star,
  ArrowUpDown,
  Sofa,
  Check,
  Briefcase,
  BellRing,
  Building2,
  Coffee,
  Bed,
  Armchair,
  UtensilsCrossed,
  BookOpen,
  Home,
  DoorOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import HotTimeDeals from "@/components/HotTimeDeals"
import CountdownTimer from "@/components/CountdownTimer"
import NewThisWeekBadge from "@/components/NewThisWeekBadge"
import { furnitureProducts, vendors, subcategories } from "./mock-data"
import TrendingPopularSection from "@/components/TrendingPopularSection"
import { trendingProducts, popularProducts } from "./trending-data"


// Types
interface Price {
  amount: number
  currency: string
}

interface Product {
  id: string
  name: string
  description: string
  image: string
  images?: string[]
  currentPrice: Price
  originalPrice?: Price
  category: string
  subcategory: string
  vendor: string
  rating: number
  reviewCount: number
  verified?:boolean
  isNew?: boolean
  isHotDeal?: boolean
  discountPercentage?: number
  material?: string
  color?: string
  dimensions?: string
  inStock: boolean
  stockCount?: number
  tags?: string[]
  hotDealEnds?: string
}

interface HotDeal {
  id: string
  name: string
  description: string
  image: string
  currentPrice: Price
  originalPrice: Price
  discountPercentage: number
  isNew?: boolean
  category?: string
  rating?: number
}

// Helper functions
const hotDeals = furnitureProducts
  .filter(
    (product) =>
      product.isHotDeal ||
      (product.originalPrice &&
        (product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount > 0.15), // 15% discount
  )
  .map((product) => ({
    id: product.id,
    name: product.name,
    imageUrl: product.image || "/placeholder.svg", // Use image property as imageUrl
    currentPrice: product.currentPrice,
    originalPrice: product.originalPrice || product.currentPrice, // Fallback if originalPrice is missing
    category: product.subcategory || product.category,
    expiresAt: product.hotDealEnds || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: product.description,
    discount:
      product.discountPercentage ||
      (product.originalPrice
        ? Math.round(
            ((product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount) * 100,
          )
        : 0),
  }))
  .sort((a, b) => b.discount - a.discount)
  .slice(0, 8)

export default function FurnitureShopPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState<string>(searchParams.get("category") || "all")
  const [activeSubcategories, setActiveSubcategories] = useState<string[]>([])
  const [activeVendors, setActiveVendors] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000])
  const [sortOption, setSortOption] = useState<string>("featured")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(furnitureProducts)
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showNewProductAlert, setShowNewProductAlert] = useState<boolean>(false)
  const [newProduct, setNewProduct] = useState<Product | null>(null)

  const observer = useRef<IntersectionObserver | null>(null)
  const PRODUCTS_PER_PAGE = 12

  // Get subcategories for the active category
  const getSubcategories = () => {
    if (activeCategory === "all") return subcategories
    return subcategories.filter((sub) => sub.category === activeCategory)
  }

  // Filter products based on all criteria
  const filterProducts = useCallback(() => {
    let filtered = [...furnitureProducts]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.vendor.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.subcategory.toLowerCase().includes(query),
      )
    }

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter((product) => product.category === activeCategory)
    }

    // Filter by subcategories
    if (activeSubcategories.length > 0) {
      filtered = filtered.filter((product) => activeSubcategories.includes(product.subcategory))
    }

    // Filter by vendors
    if (activeVendors.length > 0) {
      filtered = filtered.filter((product) => activeVendors.includes(product.vendor))
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) => product.currentPrice.amount >= priceRange[0] && product.currentPrice.amount <= priceRange[1],
    )

    // Sort products
    switch (sortOption) {
      case "price-low":
        filtered.sort((a, b) => a.currentPrice.amount - b.currentPrice.amount)
        break
      case "price-high":
        filtered.sort((a, b) => b.currentPrice.amount - a.currentPrice.amount)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1))
        break
      case "discount":
        filtered.sort((a, b) => {
          const discountA = a.discountPercentage || 0
          const discountB = b.discountPercentage || 0
          return discountB - discountA
        })
        break
      default: // featured
        // Keep original order which is assumed to be featured
        break
    }

    setFilteredProducts(filtered)
    setPage(1)
    setHasMore(filtered.length > PRODUCTS_PER_PAGE)
    setDisplayedProducts(filtered.slice(0, PRODUCTS_PER_PAGE))
  }, [activeCategory, activeSubcategories, activeVendors, priceRange, sortOption, searchQuery])

  // Load more products when scrolling
  const loadMoreProducts = useCallback(() => {
    if (isLoading) return

    setIsLoading(true)

    // Simulate API call with setTimeout
    setTimeout(() => {
      const nextPage = page + 1
      const startIndex = (nextPage - 1) * PRODUCTS_PER_PAGE
      const endIndex = startIndex + PRODUCTS_PER_PAGE

      if (startIndex < filteredProducts.length) {
        const newProducts = filteredProducts.slice(startIndex, endIndex)
        setDisplayedProducts((prev) => [...prev, ...newProducts])
        setPage(nextPage)
        setHasMore(endIndex < filteredProducts.length)
      } else {
        setHasMore(false)
      }

      setIsLoading(false)
    }, 800)
  }, [filteredProducts, page, isLoading])

  // Set up intersection observer for infinite scrolling
  const lastProductRef = useCallback(
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

  // Toggle subcategory filter
  const toggleSubcategory = (subcategory: string) => {
    setActiveSubcategories((prev) =>
      prev.includes(subcategory) ? prev.filter((sub) => sub !== subcategory) : [...prev, subcategory],
    )
  }

  // Toggle vendor filter
  const toggleVendor = (vendor: string) => {
    setActiveVendors((prev) => (prev.includes(vendor) ? prev.filter((v) => v !== vendor) : [...prev, vendor]))
  }

  // Reset all filters
  const resetFilters = () => {
    setActiveCategory("all")
    setActiveSubcategories([])
    setActiveVendors([])
    setPriceRange([0, 500000])
    setSortOption("featured")
    setSearchQuery("")
  }

  // View product details
  const viewProductDetails = (product: Product) => {
    setSelectedProduct(product)

    // Scroll to top when viewing product details
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Close product details
  const closeProductDetails = () => {
    setSelectedProduct(null)
  }

  // Add to cart
  const addToCart = (product: Product) => {
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    })
  }

  // Add to wishlist
  const addToWishlist = (product: Product) => {
    toast({
      title: "Added to Wishlist",
      description: `${product.name} has been added to your wishlist.`,
      duration: 3000,
    })
  }

  // Show new product alert
  useEffect(() => {
    // Simulate new product being added after 5 seconds
    const timer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * furnitureProducts.length)
      setNewProduct(furnitureProducts[randomIndex])
      setShowNewProductAlert(true)

      // Hide alert after 5 seconds
      setTimeout(() => {
        setShowNewProductAlert(false)
      }, 5000)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])
// Custom color scheme for furniture
const furnitureColorScheme = {
  primary: "from-purple-500 to-indigo-700",
  secondary: "bg-purple-100",
  accent: "bg-indigo-600",
  text: "text-purple-900",
  background: "bg-purple-50",
}

  // Apply filters when criteria change
  useEffect(() => {
    filterProducts()
  }, [activeCategory, activeSubcategories, activeVendors, priceRange, sortOption, searchQuery, filterProducts])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* New Product Alert */}
      {showNewProductAlert && newProduct && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in-right">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-amber-200 dark:border-amber-800 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 rounded-full p-2">
                <BellRing className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="ml-3 w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">New Product Added!</h3>
                  <button
                    type="button"
                    className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-500"
                    onClick={() => setShowNewProductAlert(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                    <img
                      src={newProduct.image || "/placeholder.svg"}
                      alt={newProduct.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{newProduct.name}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {newProduct.currentPrice.currency} {newProduct.currentPrice.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button
                    size="sm"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => {
                      viewProductDetails(newProduct)
                      setShowNewProductAlert(false)
                    }}
                  >
                    View Product
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail View */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold truncate">{selectedProduct.name}</h2>
              <Button variant="ghost" size="icon" onClick={closeProductDetails}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                    <img
                      src={selectedProduct.image || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {selectedProduct.images && selectedProduct.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.images.map((img, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-md overflow-hidden border border-gray-200 dark:border-gray-800"
                        >
                          <img
                            src={img || "/placeholder.svg"}
                            alt={`${selectedProduct.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                        {selectedProduct.category}
                      </Badge>
                      <span className="mx-2 text-gray-300">•</span>
                      <Badge variant="outline">{selectedProduct.subcategory}</Badge>
                      {selectedProduct.isNew && (
                        <>
                          <span className="mx-2 text-gray-300">•</span>
                          <NewThisWeekBadge  />
                        </>
                      )}
                    </div>

                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < Math.floor(selectedProduct.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300",
                            )}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">({selectedProduct.reviewCount} reviews)</span>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedProduct.description}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Vendor</span>
                        <span className="font-medium">{selectedProduct.vendor}</span>
                      </div>

                      {selectedProduct.material && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Material</span>
                          <span className="font-medium">{selectedProduct.material}</span>
                        </div>
                      )}

                      {selectedProduct.color && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Color</span>
                          <span className="font-medium">{selectedProduct.color}</span>
                        </div>
                      )}

                      {selectedProduct.dimensions && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Dimensions</span>
                          <span className="font-medium">{selectedProduct.dimensions}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Availability</span>
                        <span
                          className={cn("font-medium", selectedProduct.inStock ? "text-green-600" : "text-red-600")}
                        >
                          {selectedProduct.inStock
                            ? selectedProduct.stockCount
                              ? `In Stock (${selectedProduct.stockCount} available)`
                              : "In Stock"
                            : "Out of Stock"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-baseline mb-6">
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-500">
                        {selectedProduct.currentPrice.currency} {selectedProduct.currentPrice.amount.toLocaleString()}
                      </span>

                      {selectedProduct.originalPrice && (
                        <>
                          <span className="ml-2 text-lg text-gray-500 line-through">
                            {selectedProduct.originalPrice.currency}{" "}
                            {selectedProduct.originalPrice.amount.toLocaleString()}
                          </span>
                          <Badge className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            {selectedProduct.discountPercentage ||
                              Math.round(
                                ((selectedProduct.originalPrice.amount - selectedProduct.currentPrice.amount) /
                                  selectedProduct.originalPrice.amount) *
                                  100,
                              )}
                            % OFF
                          </Badge>
                        </>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <Button
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                        disabled={!selectedProduct.inStock}
                        onClick={() => {
                          addToCart(selectedProduct)
                          closeProductDetails()
                        }}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-amber-600 text-amber-600 hover:bg-amber-50"
                        onClick={() => {
                          addToWishlist(selectedProduct)
                          closeProductDetails()
                        }}
                      >
                        Add to Wishlist
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative mb-12 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-800/90 to-amber-600/80 z-10"></div>
        <img
          src="/placeholder.svg?height=500&width=1200"
          alt="Luxury Furniture"
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in">
            Premium Furniture Collection
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-6 animate-slide-in">
            Discover exquisite furniture pieces for your home and office, crafted with precision and style.
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in-up">
            <Button
              size="lg"
              className="bg-white text-amber-800 hover:bg-amber-50"
              onClick={() => {
                setActiveCategory("home")
                window.scrollTo({ top: 500, behavior: "smooth" })
              }}
            >
              <Home className="mr-2 h-5 w-5" />
              Home Furniture
            </Button>
            <Button
              size="lg"
              className="bg-amber-900 text-white hover:bg-amber-950"
              onClick={() => {
                setActiveCategory("office")
                window.scrollTo({ top: 500, behavior: "smooth" })
              }}
            >
              <Briefcase className="mr-2 h-5 w-5" />
              Office Furniture
            </Button>
          </div>
        </div>
      </div>

      {/* Hot Deals Section */}
      {hotDeals.length > 0 && (
        <div className="mb-12">
          <HotTimeDeals
            deals={hotDeals}
            colorScheme="amber"
            title="Limited Time Furniture Deals"
            subtitle="Exclusive discounts on premium furniture pieces"
          />
          <div className="mt-6">
            <CountdownTimer targetDate="2025-06-30T23:59:59" startDate="2025-04-01T00:00:00"/>
          </div>
        </div>
      )}
 {/* Trending and Popular Section */}
 <TrendingPopularSection
        trendingProducts={trendingProducts}
        popularProducts={popularProducts}
        colorScheme={furnitureColorScheme}
        title="Best Furniture Decor Trending Today!"
        subtitle="Discover  most popular and trending Furniture Decor"
      />
      
      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Category</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="category-all"
                    checked={activeCategory === "all"}
                    onCheckedChange={() => setActiveCategory("all")}
                  />
                  <label htmlFor="category-all" className="ml-2 text-sm cursor-pointer">
                    All Furniture
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="category-office"
                    checked={activeCategory === "office"}
                    onCheckedChange={() => setActiveCategory("office")}
                  />
                  <label htmlFor="category-office" className="ml-2 text-sm cursor-pointer flex items-center">
                    <Briefcase className="h-3.5 w-3.5 mr-1 text-amber-600" />
                    Office Furniture
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="category-home"
                    checked={activeCategory === "home"}
                    onCheckedChange={() => setActiveCategory("home")}
                  />
                  <label htmlFor="category-home" className="ml-2 text-sm cursor-pointer flex items-center">
                    <Home className="h-3.5 w-3.5 mr-1 text-amber-600" />
                    Home Furniture
                  </label>
                </div>
              </div>
            </div>

            {/* Subcategory Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Subcategory</h3>
              <ScrollArea className="h-40">
                <div className="space-y-2 pr-4">
                  {getSubcategories().map((sub) => (
                    <div key={sub.id} className="flex items-center">
                      <Checkbox
                        id={`subcategory-${sub.id}`}
                        checked={activeSubcategories.includes(sub.id)}
                        onCheckedChange={() => toggleSubcategory(sub.id)}
                      />
                      <label
                        htmlFor={`subcategory-${sub.id}`}
                        className="ml-2 text-sm cursor-pointer flex items-center"
                      >
                        {sub.icon && (
                          <span className="mr-1 text-amber-600">
                            {sub.id === "reception" && <Building2 className="h-3.5 w-3.5" />}
                            {sub.id === "boardroom" && <Coffee className="h-3.5 w-3.5" />}
                            {sub.id === "main-office" && <Briefcase className="h-3.5 w-3.5" />}
                            {sub.id === "beds" && <Bed className="h-3.5 w-3.5" />}
                            {sub.id === "sofaset" && <Sofa className="h-3.5 w-3.5" />}
                            {sub.id === "dinner-tables" && <UtensilsCrossed className="h-3.5 w-3.5" />}
                            {sub.id === "chairs" && <Armchair className="h-3.5 w-3.5" />}
                            {sub.id === "cupboards" && <BookOpen className="h-3.5 w-3.5" />}
                            {sub.id === "wardrobes" && <DoorOpen className="h-3.5 w-3.5" />}
                            {sub.id === "sitting-room-tables" && <Coffee className="h-3.5 w-3.5" />}
                            {sub.id === "other-home" && <Home className="h-3.5 w-3.5" />}
                          </span>
                        )}
                        {sub.name}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Vendor Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Vendor</h3>
              <ScrollArea className="h-40">
                <div className="space-y-2 pr-4">
                  {vendors.map((vendor) => (
                    <div key={vendor.id} className="flex items-center">
                      <Checkbox
                        id={`vendor-${vendor.id}`}
                        checked={activeVendors.includes(vendor.id)}
                        onCheckedChange={() => toggleVendor(vendor.id)}
                      />
                      <label htmlFor={`vendor-${vendor.id}`} className="ml-2 text-sm cursor-pointer">
                        {vendor.name}
                        
            {vendor.verified && (
          <Badge className="ml-1 bg-blue-500 text-white flex items-center gap-0.5 px-1 py-0 text-xs">
          <Check className="h-2 w-2" />
         </Badge>
           )}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Price Range</h3>
              <div className="px-2">
                <Slider
                  defaultValue={[0, 500000]}
                  min={0}
                  max={500000}
                  step={5000}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="mb-4"
                />
                <div className="flex items-center justify-between text-sm">
                  <span>KSh {priceRange[0].toLocaleString()}</span>
                  <span>KSh {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    {sortOption === "featured" && "Featured"}
                    {sortOption === "price-low" && "Price: Low to High"}
                    {sortOption === "price-high" && "Price: High to Low"}
                    {sortOption === "rating" && "Highest Rated"}
                    {sortOption === "newest" && "Newest"}
                    {sortOption === "discount" && "Biggest Discount"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortOption("featured")}>Featured</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("price-low")}>Price: Low to High</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("price-high")}>Price: High to Low</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("rating")}>Highest Rated</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("newest")}>Newest</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("discount")}>Biggest Discount</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" className="md:hidden" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden mb-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Reset
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="category" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="category">Category</TabsTrigger>
                  <TabsTrigger value="subcategory">Subcategory</TabsTrigger>
                  <TabsTrigger value="vendor">Vendor</TabsTrigger>
                </TabsList>

                <TabsContent value="category" className="mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox
                        id="mobile-category-all"
                        checked={activeCategory === "all"}
                        onCheckedChange={() => setActiveCategory("all")}
                      />
                      <label htmlFor="mobile-category-all" className="ml-2 text-sm cursor-pointer">
                        All Furniture
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="mobile-category-office"
                        checked={activeCategory === "office"}
                        onCheckedChange={() => setActiveCategory("office")}
                      />
                      <label htmlFor="mobile-category-office" className="ml-2 text-sm cursor-pointer flex items-center">
                        <Briefcase className="h-3.5 w-3.5 mr-1 text-amber-600" />
                        Office Furniture
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="mobile-category-home"
                        checked={activeCategory === "home"}
                        onCheckedChange={() => setActiveCategory("home")}
                      />
                      <label htmlFor="mobile-category-home" className="ml-2 text-sm cursor-pointer flex items-center">
                        <Home className="h-3.5 w-3.5 mr-1 text-amber-600" />
                        Home Furniture
                      </label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="subcategory" className="mt-4">
                  <div className="space-y-2">
                    {getSubcategories().map((sub) => (
                      <div key={`mobile-${sub.id}`} className="flex items-center">
                        <Checkbox
                          id={`mobile-subcategory-${sub.id}`}
                          checked={activeSubcategories.includes(sub.id)}
                          onCheckedChange={() => toggleSubcategory(sub.id)}
                        />
                        <label
                          htmlFor={`mobile-subcategory-${sub.id}`}
                          className="ml-2 text-sm cursor-pointer flex items-center"
                        >
                          {sub.icon && (
                            <span className="mr-1 text-amber-600">
                              {sub.id === "reception" && <Building2 className="h-3.5 w-3.5" />}
                              {sub.id === "boardroom" && <Coffee className="h-3.5 w-3.5" />}
                              {sub.id === "main-office" && <Briefcase className="h-3.5 w-3.5" />}
                              {sub.id === "beds" && <Bed className="h-3.5 w-3.5" />}
                              {sub.id === "sofaset" && <Sofa className="h-3.5 w-3.5" />}
                              {sub.id === "dinner-tables" && <UtensilsCrossed className="h-3.5 w-3.5" />}
                              {sub.id === "chairs" && <Armchair className="h-3.5 w-3.5" />}
                              {sub.id === "cupboards" && <BookOpen className="h-3.5 w-3.5" />}
                              {sub.id === "wardrobes" && <DoorOpen className="h-3.5 w-3.5" />}
                              {sub.id === "sitting-room-tables" && <Coffee className="h-3.5 w-3.5" />}
                              {sub.id === "other-home" && <Home className="h-3.5 w-3.5" />}
                            </span>
                          )}
                          {sub.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="vendor" className="mt-4">
                  <div className="space-y-2">
                    {vendors.map((vendor) => (
                      <div key={`mobile-${vendor.id}`} className="flex items-center">
                        <Checkbox
                          id={`mobile-vendor-${vendor.id}`}
                          checked={activeVendors.includes(vendor.id)}
                          onCheckedChange={() => toggleVendor(vendor.id)}
                        />
                        <label htmlFor={`mobile-vendor-${vendor.id}`} className="ml-2 text-sm cursor-pointer">
                          {vendor.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Price Range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 500000]}
                    min={0}
                    max={500000}
                    step={5000}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span>KSh {priceRange[0].toLocaleString()}</span>
                    <span>KSh {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category Tabs */}
          <Tabs
            defaultValue={activeCategory === "all" ? "all" : activeCategory}
            value={activeCategory === "all" ? "all" : activeCategory}
            onValueChange={(value) => setActiveCategory(value)}
            className="mb-6"
          >
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="all">All Furniture</TabsTrigger>
              <TabsTrigger value="office" className="flex items-center">
                <Briefcase className="mr-2 h-4 w-4" />
                Office
              </TabsTrigger>
              <TabsTrigger value="home" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Home
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Subcategory Horizontal Scroll */}
          <ScrollArea className="w-full whitespace-nowrap mb-6">
            <div className="flex space-x-2 pb-2">
              {getSubcategories().map((sub) => (
                <Badge
                  key={sub.id}
                  variant={activeSubcategories.includes(sub.id) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer py-1.5 px-3",
                    activeSubcategories.includes(sub.id)
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "hover:bg-amber-50 dark:hover:bg-amber-900/20",
                  )}
                  onClick={() => toggleSubcategory(sub.id)}
                >
                  {sub.icon && (
                    <span className="mr-1">
                      {sub.id === "reception" && <Building2 className="h-3.5 w-3.5 inline" />}
                      {sub.id === "boardroom" && <Coffee className="h-3.5 w-3.5 inline" />}
                      {sub.id === "main-office" && <Briefcase className="h-3.5 w-3.5 inline" />}
                      {sub.id === "beds" && <Bed className="h-3.5 w-3.5 inline" />}
                      {sub.id === "sofaset" && <Sofa className="h-3.5 w-3.5 inline" />}
                      {sub.id === "dinner-tables" && <UtensilsCrossed className="h-3.5 w-3.5 inline" />}
                      {sub.id === "chairs" && <Armchair className="h-3.5 w-3.5 inline" />}
                      {sub.id === "cupboards" && <BookOpen className="h-3.5 w-3.5 inline" />}
                      {sub.id === "wardrobes" && <DoorOpen className="h-3.5 w-3.5 inline" />}
                      {sub.id === "sitting-room-tables" && <Coffee className="h-3.5 w-3.5 inline" />}
                      {sub.id === "other-home" && <Home className="h-3.5 w-3.5 inline" />}
                    </span>
                  )}
                  {sub.name}
                </Badge>
              ))}
            </div>
          </ScrollArea>

          {/* Products Grid */}
          {displayedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full p-4 mb-4">
                <Search className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                We couldn't find any products matching your criteria. Try adjusting your filters or search query.
              </p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="overflow-hidden transition-all duration-300 hover:shadow-lg group"
                  ref={index === displayedProducts.length - 1 ? lastProductRef : undefined}
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={product.image || "/placeholder.svg?height=300&width=300"}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />

                    {product.isNew && (
                      <div className="absolute top-2 left-2">
                        <NewThisWeekBadge/>
                      </div>
                    )}

                    {product.discountPercentage && product.discountPercentage > 0 && (
                      <div className="absolute bottom-2 right-2">
                        <Badge className="bg-red-500 text-white">{product.discountPercentage}% OFF</Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {product.subcategory}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                      >
                        {product.vendor}
                        {vendors.find(v => v.id === product.vendor)?.verified && (
                  <Check className="h-3 w-3 ml-0.5 text-blue-500" />
                      )}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
                              )}
                            />
                          ))}
                        </div>
                        <span className="ml-1 text-xs text-gray-500">({product.reviewCount})</span>
                      </div>

                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          product.inStock ? "border-green-500 text-green-600" : "border-red-500 text-red-600",
                        )}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-amber-600 dark:text-amber-500">
                        {product.currentPrice.currency} {product.currentPrice.amount.toLocaleString()}
                      </span>

                      {product.originalPrice && (
                        <span className="text-sm line-through text-gray-400">
                          {product.originalPrice.currency} {product.originalPrice.amount.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                      disabled={!product.inStock}
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="hover:text-amber-600 hover:border-amber-600"
                      onClick={() => viewProductDetails(product)}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

