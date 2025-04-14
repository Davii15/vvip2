"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Search,
  ShoppingBag,
  Wheat,
  Utensils,
  Cookie,
  Leaf,
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowUpDown,
  Star,
  ArrowRight,
  Sparkles,
  Loader2,
  Home,
  ShoppingCart,
  Plus,
  Minus,
  Clock,
  Tag,
  TrendingUp,
  WheatIcon,
  UtensilsIcon,
  CookieIcon,
  SparklesIcon,
  Award,
  Check,
  Info,
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
import { isNewThisWeek } from "@/utils/date-utils"
import NewThisWeekBadge from "@/components/NewThisWeekBadge"
import TrendingPopularSection from "@/components/TrendingPopularSection"
import Link from "next/link"

import {
  mockFlourVendors,
  flourCategories,
  getCategoryColors,
  formatPrice,
  transformFlourToProducts,
  trendingFlourProducts,
  popularFlourProducts,
  type FlourProduct,
  type FlourVendor,
} from "./mock-data"

// Get icon for category
const getCategoryIcon = (category: string, size = 20) => {
  switch (category.toLowerCase()) {
    case "ugali flour":
      return <WheatIcon size={size} />
    case "mandazi flour":
      return <CookieIcon size={size} />
    case "chapati flour":
      return <UtensilsIcon size={size} />
    case "specialty flour":
      return <SparklesIcon size={size} />
    default:
      return <ShoppingBag size={size} />
  }
}

// Get icon for subcategory
const getSubcategoryIcon = (category: string, subcategory: string, size = 18) => {
  if (category.toLowerCase() === "ugali flour") {
    switch (subcategory.toLowerCase()) {
      case "maize flour":
        return <WheatIcon size={size} />
      case "millet flour":
        return <Wheat size={size} />
      case "sorghum flour":
        return <Wheat size={size} />
      case "cassava flour":
        return <Leaf size={size} />
      default:
        return <WheatIcon size={size} />
    }
  } else if (category.toLowerCase() === "mandazi flour") {
    switch (subcategory.toLowerCase()) {
      case "wheat flour":
        return <Wheat size={size} />
      case "mixed flour":
        return <Cookie size={size} />
      case "ready mix":
        return <Cookie size={size} />
      default:
        return <Cookie size={size} />
    }
  } else if (category.toLowerCase() === "chapati flour") {
    switch (subcategory.toLowerCase()) {
      case "atta flour":
        return <Wheat size={size} />
      case "whole wheat":
        return <Wheat size={size} />
      case "ready mix":
        return <Utensils size={size} />
      default:
        return <Utensils size={size} />
    }
  } else if (category.toLowerCase() === "specialty flour") {
    switch (subcategory.toLowerCase()) {
      case "gluten-free":
        return <Leaf size={size} />
      case "multigrain":
        return <Wheat size={size} />
      case "fortified":
        return <Award size={size} />
      default:
        return <Sparkles size={size} />
    }
  }

  return <ShoppingBag size={size} />
}

export default function FlourShopPage() {
  useCookieTracking("flour-shop")

  // State for vendors and products
  const [vendors, setVendors] = useState<FlourVendor[]>(mockFlourVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVendors, setFilteredVendors] = useState<FlourVendor[]>(mockFlourVendors)
  const [newProductAlert, setNewProductAlert] = useState<FlourProduct | null>(null)

  const flourProducts = transformFlourToProducts(mockFlourVendors)

  // State for active category and subcategory
  const [activeCategory, setActiveCategory] = useState<string>("ugali-flour")
  const [activeSubcategory, setActiveSubcategory] = useState<string>("")
  const [activeSubtype, setActiveSubtype] = useState<string>("")

  // State for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [sortOrder, setSortOrder] = useState("default")
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([])

  // State for product detail modal
  const [selectedProduct, setSelectedProduct] = useState<FlourProduct | null>(null)

  // States for infinite scroll
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)

  const hotDeals = flourProducts
    .filter(
      (product) =>
        product.isHotDeal ||
        (product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount > 0.15, // 15% discount
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

  // Launch confetti effect on page load
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#d97706", "#92400e"], // Amber and brown colors for flour theme
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
      const categoryName = flourCategories.find((cat) => cat.id === activeCategory)?.name || ""
      results = results.filter((vendor) =>
        vendor.products.some((product) => product.category.toLowerCase() === categoryName.toLowerCase()),
      )
    }

    // Filter by subcategory
    if (activeSubcategory) {
      const categoryObj = flourCategories.find((cat) => cat.id === activeCategory)
      const subcategoryName = categoryObj?.subcategories.find((sub) => sub.id === activeSubcategory)?.name || ""

      results = results.filter((vendor) =>
        vendor.products.some((product) => product.subcategory.toLowerCase() === subcategoryName.toLowerCase()),
      )
    }

    // Filter by subtype
    if (activeSubtype) {
      const categoryObj = flourCategories.find((cat) => cat.id === activeCategory)
      const subcategoryObj = categoryObj?.subcategories.find((sub) => sub.id === activeSubcategory)
      const subtypeName = subcategoryObj?.subtypes?.find((st) => st.id === activeSubtype)?.name || ""

      results = results.filter((vendor) =>
        vendor.products.some(
          (product) => product.subtype && product.subtype.toLowerCase() === subtypeName.toLowerCase(),
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

  
  // Get the active category object
  const activeCategoryObj = flourCategories.find((cat) => cat.id === activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-l from-orange-500/10 to-amber-500/10 -z-10"></div>

      <div className="container mx-auto px-4 py-8 max-w-[1920px] relative z-10">
        {/* Header with animated gradient text */}
        <div className="text-center mb-10">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 text-transparent bg-clip-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Kenyan Flour Shop
          </motion.h1>
          <motion.p
            className="text-xl text-gray-700 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover premium flour for ugali, mandazi, chapati and more from trusted Kenyan vendors
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
            colorScheme="amber"
            title="Limited Time Flour Offers"
            subtitle="Grab these exclusive deals before they expire!"
          />
        )}

        {/* New Products For You Section */}
        <NewProductsForYou allProducts={flourProducts} colorScheme="amber" maxProducts={4} />


        {/* Enhanced search section */}
        <div className="mb-10 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-amber-100">
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Search for flour types, brands, or recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pr-12 rounded-lg border-2 border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400 bg-white text-gray-800 placeholder-gray-400 text-lg"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-500" size={24} />
          </div>

          {/* Category tabs */}
          <Tabs defaultValue={activeCategory} value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {flourCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center justify-center gap-2">
                  <span className="text-lg">{category.icon}</span>
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
                  className={`cursor-pointer ${activeSubcategory === "" ? "bg-amber-500" : "hover:bg-amber-100"}`}
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
                      activeSubcategory === subcategory.id ? "bg-amber-500" : "hover:bg-amber-100"
                    }`}
                    onClick={() => {
                      setActiveSubcategory(subcategory.id)
                      setActiveSubtype("")
                    }}
                  >
                    <span className="mr-1">{subcategory.icon || "🌾"}</span>
                    <span>{subcategory.name}</span>
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
                  className={`cursor-pointer ${activeSubtype === "" ? "bg-orange-500" : "hover:bg-orange-100"}`}
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
                        activeSubtype === subtype.id ? "bg-orange-500" : "hover:bg-orange-100"
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
                defaultValue={[0, 1000]}
                max={1000}
                step={50}
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
                    vendor.products.filter((product) => {
                      const categoryName = flourCategories.find((cat) => cat.id === activeCategory)?.name || ""
                      const categoryObj = flourCategories.find((cat) => cat.id === activeCategory)
                      const subcategoryName =
                        categoryObj?.subcategories.find((sub) => sub.id === activeSubcategory)?.name || ""
                      const subcategoryObj = categoryObj?.subcategories.find((sub) => sub.id === activeSubcategory)
                      const subtypeName = subcategoryObj?.subtypes?.find((st) => st.id === activeSubtype)?.name || ""

                      return (
                        (!activeCategory || product.category.toLowerCase() === categoryName.toLowerCase()) &&
                        (!activeSubcategory || product.subcategory.toLowerCase() === subcategoryName.toLowerCase()) &&
                        (!activeSubtype ||
                          (product.subtype && product.subtype.toLowerCase() === subtypeName.toLowerCase()))
                      )
                    }).length,
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
              <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
              <p className="mt-2 text-amber-600 font-medium">Loading more products...</p>
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
  vendor: FlourVendor
  activeCategory: string
  activeSubcategory: string
  activeSubtype: string
  onProductClick: (product: FlourProduct) => void
  isExpanded: boolean
  onToggle: () => void
}) {
  const [imageError, setImageError] = useState(false)

  // Filter products based on active filters
  const filteredProducts = vendor.products.filter((product) => {
    const categoryName = flourCategories.find((cat) => cat.id === activeCategory)?.name || ""
    const categoryObj = flourCategories.find((cat) => cat.id === activeCategory)
    const subcategoryName = categoryObj?.subcategories.find((sub) => sub.id === activeSubcategory)?.name || ""
    const subcategoryObj = categoryObj?.subcategories.find((sub) => sub.id === activeSubcategory)
    const subtypeName = subcategoryObj?.subtypes?.find((st) => st.id === activeSubtype)?.name || ""

    return (
      (!activeCategory || product.category.toLowerCase() === categoryName.toLowerCase()) &&
      (!activeSubcategory || product.subcategory.toLowerCase() === subcategoryName.toLowerCase()) &&
      (!activeSubtype || (product.subtype && product.subtype.toLowerCase() === subtypeName.toLowerCase()))
    )
  })

  if (filteredProducts.length === 0) return null

  // Get color scheme based on active category
  const colors = getCategoryColors(filteredProducts[0].category)

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-100">
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
        boxShadow: ["0 4px 6px rgba(0, 0, 0, 0.1)", "0 10px 15px rgba(0, 0, 0, 0.2)", "0 4px 6px rgba(0, 0, 0, 0.1)"],
      }}
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    >
      <TrendingUp className="h-3 w-3 mr-1" />
      <span>most-preferred</span>
    </motion.div>
  )
}

// Product Card Component
function ProductCard({ product, onClick }: { product: FlourProduct; onClick: () => void }) {
  const [imageError, setImageError] = useState(false)
  const colors = getCategoryColors(product.category)

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount) * 100,
  )

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full border border-amber-100"
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
          {discountPercentage >= 10 && (
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

          {product.organicCertified && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md flex items-center">
              <Leaf className="h-3 w-3 mr-1" />
              ORGANIC
            </div>
          )}
        </div>

        {/* Most preferred badge */}
        {product.isPopular && (
          <div className="absolute top-2 left-2">
            <MostPreferredBadge />
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
function ProductDetailView({ product, onClose }: { product: FlourProduct; onClose: () => void }) {
  const [quantity, setQuantity] = useState(1)
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

          {discountPercentage >= 10 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold shadow-md">
              {discountPercentage}% OFF
            </div>
          )}
          
          {product.organicCertified && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-md text-sm font-bold shadow-md flex items-center">
              <Leaf className="h-4 w-4 mr-1" />
              ORGANIC CERTIFIED
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

  )
  <div className="flex items-end gap-3 mb-4">
            <div className={`text-3xl font-bold ${colors.highlight}`}>{formatPrice(product.currentPrice)}</div>
            <div className="text-lg text-gray-500 line-through">{formatPrice(product.originalPrice)}</div>
            {discountPercentage > 0 && <div className="text-red-500 font-medium">Save {discountPercentage}%</div>}
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>
        </div>

   {/* Nutritional Information */}
   {product.nutritionalInfo && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Nutritional Information (per {product.servingSize || "100g"})
            </h3>
            <div className="bg-amber-50 p-3 rounded-md grid grid-cols-2 gap-2 text-sm">
              {product.nutritionalInfo.calories !== undefined && (
                <div className="flex justify-between">
                  <span className="font-medium">Calories:</span>
                  <span>{product.nutritionalInfo.calories} kcal</span>
                </div>
              )}

              {product.nutritionalInfo.protein !== undefined && (
                <div className="flex justify-between">
                  <span className="font-medium">Protein:</span>
                  <span>{product.nutritionalInfo.protein}g</span>
                </div>
              )}

              {product.nutritionalInfo.carbs !== undefined && (
                <div className="flex justify-between">
                  <span className="font-medium">Carbohydrates:</span>
                  <span>{product.nutritionalInfo.carbs}g</span>
                </div>
              )}

              {product.nutritionalInfo.fiber !== undefined && (
                <div className="flex justify-between">
                  <span className="font-medium">Fiber:</span>
                  <span>{product.nutritionalInfo.fiber}g</span>
                </div>
              )}

              {product.nutritionalInfo.fat !== undefined && (
                <div className="flex justify-between">
                  <span className="font-medium">Fat:</span>
                  <span>{product.nutritionalInfo.fat}g</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cooking Time */}
        {product.cookingTime && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Cooking Information</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-amber-600" />
              <span>Cooking Time: {product.cookingTime}</span>
            </div>
          </div>
        )}

        {/* Origin */}
        {product.origin && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Origin</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Home className="h-4 w-4 text-amber-600" />
              <span>{product.origin}</span>
            </div>
          </div>
        )}

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Features</h3>
            <div className="grid grid-cols-2 gap-2">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <Check size={14} className="text-amber-600" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recipes */}
        {product.recipes && product.recipes.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Suggested Recipes</h3>
            <div className="flex flex-wrap gap-2">
              {product.recipes.map((recipe, index) => (
                <Badge key={index} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <UtensilsIcon className="h-3 w-3 mr-1" />
                  {recipe}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`px-3 py-1 rounded-md text-sm bg-amber-100 text-amber-800 hover:bg-amber-200`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Quantity</h3>
          <div className="flex items-center">
            <button
              className="p-2 rounded-l-md bg-amber-100 hover:bg-amber-200 text-amber-800"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="px-4 py-2 bg-amber-50 border-t border-b border-amber-200 text-center min-w-[40px]">
              {quantity}
            </div>
            <button
              className="p-2 rounded-r-md bg-amber-100 hover:bg-amber-200 text-amber-800"
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
            Add to Cart
          </Button>

          <Button variant="outline" className={`flex-1 border-amber-600 text-amber-600 hover:bg-amber-50`}>
            <Info className="h-4 w-4 mr-2" />
            Cooking Tips
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
