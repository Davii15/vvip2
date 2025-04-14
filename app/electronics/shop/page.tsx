"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Smartphone,
  Laptop,
  Headphones,
  Tv,
  GamepadIcon as GameController,
  Search,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  ArrowLeft,
  Heart,
  X,
  Sparkles,
  Flame,
  Filter,
  SearchX,
  Bell,
  ShoppingCart,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

import { electronicsVendors, formatPrice, type ElectronicsVendor, type ElectronicsProduct } from "./mock-data"

export default function ElectronicsShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVendor, setSelectedVendor] = useState<ElectronicsVendor | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<ElectronicsProduct | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortOrder, setSortOrder] = useState<string>("featured")

  // Infinite scrolling
  const [visibleVendors, setVisibleVendors] = useState<ElectronicsVendor[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)
  const vendorsPerPage = 8

  // New product notification
  const [newProductAlert, setNewProductAlert] = useState<ElectronicsProduct | null>(null)

  // Filter vendors based on active category and search query
  const filteredVendors = electronicsVendors.filter((vendor) => {
    // Filter by category
    if (activeCategory !== "all" && vendor.category !== activeCategory) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        vendor.name.toLowerCase().includes(query) ||
        vendor.description.toLowerCase().includes(query) ||
        vendor.products.some(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(query))),
        )
      )
    }

    return true
  })

  // Filter products by price range and brands
  const getFilteredProducts = (vendor: ElectronicsVendor) => {
    return vendor.products.filter((product) => {
      // Filter by price
      if (product.price.amount < priceRange[0] || product.price.amount > priceRange[1]) {
        return false
      }

      // Filter by brands
      if (selectedBrands.length > 0 && !product.tags?.some((tag) => selectedBrands.includes(tag))) {
        return false
      }

      return true
    })
  }

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setIsLoading(true)
    setActiveCategory(category)
    setPage(1)
    setVisibleVendors([])

    // Reset filters when changing category
    setSelectedBrands([])

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  // Handle vendor click
  const handleVendorClick = (vendor: ElectronicsVendor) => {
    setSelectedVendor(vendor)
  }

  // Handle product click
  const handleProductClick = (product: ElectronicsProduct) => {
    setSelectedProduct(product)
  }

  // Handle brand toggle
  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  // Get all available brands for filtering
  const getAllBrands = () => {
    const brands = new Set<string>()

    filteredVendors.forEach((vendor) => {
      vendor.products.forEach((product) => {
        product.tags?.forEach((tag) => {
          brands.add(tag)
        })
      })
    })

    return Array.from(brands).sort()
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "smartphones":
        return <Smartphone className="h-6 w-6" />
      case "computers":
        return <Laptop className="h-6 w-6" />
      case "audio":
        return <Headphones className="h-6 w-6" />
      case "appliances":
        return <Tv className="h-6 w-6" />
      case "gaming":
        return <GameController className="h-6 w-6" />
      default:
        return <Sparkles className="h-6 w-6" />
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "smartphones":
        return "from-blue-500 to-indigo-600"
      case "computers":
        return "from-purple-500 to-indigo-500"
      case "audio":
        return "from-pink-500 to-rose-500"
      case "appliances":
        return "from-teal-500 to-emerald-500"
      case "gaming":
        return "from-red-500 to-orange-500"
      default:
        return "from-blue-500 to-indigo-600"
    }
  }

  // Get category background color
  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case "smartphones":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
      case "computers":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
      case "audio":
        return "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800"
      case "appliances":
        return "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800"
      case "gaming":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  // Star rating component
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
          />
        ))}
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{rating.toFixed(1)}</span>
      </div>
    )
  }

  // Load more vendors for infinite scrolling
  const loadMoreVendors = () => {
    if (isLoading) return

    setIsLoading(true)

    // Simulate API call with setTimeout
    setTimeout(() => {
      const startIndex = (page - 1) * vendorsPerPage
      const endIndex = startIndex + vendorsPerPage
      const newVendors = filteredVendors.slice(startIndex, endIndex)

      setVisibleVendors((prev) => [...prev, ...newVendors])
      setPage((prev) => prev + 1)
      setHasMore(endIndex < filteredVendors.length)
      setIsLoading(false)
    }, 800)
  }

  // Initialize visible vendors
  useEffect(() => {
    loadMoreVendors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, searchQuery, selectedBrands, priceRange])

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreVendors()
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
  }, [loaderRef, hasMore, isLoading])

  // Set up new product alert
  useEffect(() => {
    // Find a random new product to showcase
    const newProducts = electronicsVendors.flatMap((vendor) => vendor.products.filter((product) => product.isNew))

    if (newProducts.length > 0) {
      const randomIndex = Math.floor(Math.random() * newProducts.length)
      setNewProductAlert(newProducts[randomIndex])

      // Auto-dismiss after 15 seconds
      const timer = setTimeout(() => {
        setNewProductAlert(null)
      }, 15000)

      return () => clearTimeout(timer)
    }
  }, [])

  // Render category tabs
  const renderCategoryTabs = () => {
    return (
      <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
        {[
          { id: "all", name: "All Products", icon: <Sparkles className="h-5 w-5" /> },
          { id: "smartphones", name: "Smartphones", icon: <Smartphone className="h-5 w-5" /> },
          { id: "computers", name: "Computers", icon: <Laptop className="h-5 w-5" /> },
          { id: "audio", name: "Audio", icon: <Headphones className="h-5 w-5" /> },
          { id: "appliances", name: "Appliances", icon: <Tv className="h-5 w-5" /> },
          { id: "gaming", name: "Gaming", icon: <GameController className="h-5 w-5" /> },
        ].map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              activeCategory === category.id
                ? `bg-gradient-to-r ${
                    category.id === "all"
                      ? "from-blue-500 to-indigo-600"
                      : category.id === "smartphones"
                        ? "from-blue-500 to-indigo-600"
                        : category.id === "computers"
                          ? "from-purple-500 to-indigo-500"
                          : category.id === "audio"
                            ? "from-pink-500 to-rose-500"
                            : category.id === "appliances"
                              ? "from-teal-500 to-emerald-500"
                              : "from-red-500 to-orange-500"
                  } text-white`
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-400 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/electronics" className="flex items-center text-white mb-4 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Electronics
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Electronics Shop</h1>
              <p className="text-blue-100 max-w-2xl">
                Discover the latest technology products from smartphones and computers to audio equipment and smart home
                devices.
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
                  <Zap className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Latest Tech</p>
                  <p className="text-sm">Premium Quality</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="relative max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-200"></div>
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search for electronics, brands, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 rounded-full border-transparent bg-white dark:bg-slate-800 text-gray-800 dark:text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-transparent w-full shadow-lg"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                <Search className="h-5 w-5" />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="container mx-auto px-4 py-6 relative z-10">{renderCategoryTabs()}</div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                  <Filter className="mr-2 h-5 w-5 text-blue-500" />
                  Filters
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPriceRange([0, 500000])
                    setSelectedBrands([])
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Reset All
                </Button>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Price Range</h4>
                <Slider
                  defaultValue={[0, 500000]}
                  max={500000}
                  step={5000}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>KSH {priceRange[0].toLocaleString()}</span>
                  <span>KSH {priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Brands</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {getAllBrands().map((brand) => (
                    <div key={brand} className="flex items-center">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => handleBrandToggle(brand)}
                        className="mr-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label
                        htmlFor={`brand-${brand}`}
                        className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 500000) && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-5">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Active Filters</h3>
                <div className="flex flex-wrap gap-2">
                  {priceRange[0] > 0 || priceRange[1] < 500000 ? (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1">
                      Price: KSH {priceRange[0].toLocaleString()} - KSH {priceRange[1].toLocaleString()}
                    </Badge>
                  ) : null}

                  {selectedBrands.map((brand) => (
                    <Badge
                      key={brand}
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 flex items-center gap-1"
                      onClick={() => handleBrandToggle(brand)}
                    >
                      {brand}
                      <X className="h-3 w-3 ml-1 cursor-pointer" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="w-full lg:w-3/4">
            {isLoading && visibleVendors.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {visibleVendors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {visibleVendors.map((vendor) => (
                      <motion.div
                        key={vendor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className="h-full"
                      >
                        <Card
                          className="overflow-hidden border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer"
                          onClick={() => handleVendorClick(vendor)}
                        >
                          <div className={`p-4 bg-gradient-to-r ${getCategoryColor(vendor.category)} text-white`}>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="bg-white/20 p-2 rounded-full">{getCategoryIcon(vendor.category)}</div>
                              <h3 className="text-xl font-semibold">{vendor.name}</h3>
                            </div>
                            <Badge className="bg-white/30 text-white border-0">
                              {vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)}
                            </Badge>
                          </div>
                          <CardContent className="p-4 flex-grow">
                            <div className="flex justify-between items-center mb-3">
                              <StarRating rating={vendor.rating} />
                              <Badge variant="outline" className={getCategoryBgColor(vendor.category)}>
                                {vendor.reviewCount} reviews
                              </Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                              {vendor.description}
                            </p>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              {vendor.location}
                            </div>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                              <Clock className="h-4 w-4 mr-1" />
                              {vendor.openingHours}
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                            <Button
                              className={`w-full bg-gradient-to-r ${getCategoryColor(vendor.category)} hover:opacity-90 text-white`}
                            >
                              View Products
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-8 rounded-lg inline-block mb-4">
                      <SearchX className="h-12 w-12 text-blue-500 mx-auto" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No results found</h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      We couldn't find any electronics matching your criteria. Try adjusting your search or browse a
                      different category.
                    </p>
                    <Button
                      className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                      onClick={() => {
                        setSearchQuery("")
                        setActiveCategory("all")
                        setPriceRange([0, 500000])
                        setSelectedBrands([])
                      }}
                    >
                      View All Products
                    </Button>
                  </div>
                )}

                {/* Loading indicator for infinite scroll */}
                {hasMore && (
                  <div ref={loaderRef} className="flex justify-center items-center py-8">
                    {isLoading && (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Loading more products...</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Vendor Detail Modal */}
      <Dialog open={!!selectedVendor} onOpenChange={(open) => !open && setSelectedVendor(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedVendor && (
            <>
              <DialogHeader>
                <div
                  className={`p-4 -mt-6 -mx-6 mb-4 bg-gradient-to-r ${getCategoryColor(selectedVendor.category)} text-white`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/20 p-2 rounded-full">{getCategoryIcon(selectedVendor.category)}</div>
                    <DialogTitle className="text-2xl font-bold">{selectedVendor.name}</DialogTitle>
                  </div>
                  <DialogDescription className="text-white/90 mt-1">{selectedVendor.description}</DialogDescription>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Phone className="h-4 w-4 mr-2 text-blue-500" />
                        {selectedVendor.contact.phone}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Mail className="h-4 w-4 mr-2 text-blue-500" />
                        {selectedVendor.contact.email}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Globe className="h-4 w-4 mr-2 text-blue-500" />
                        <a
                          href={`https://${selectedVendor.contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {selectedVendor.contact.website}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Location & Hours</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        {selectedVendor.location}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        {selectedVendor.openingHours}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVendor.amenities.map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-xl">Products</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getFilteredProducts(selectedVendor).map((product) => (
                      <Card
                        key={product.id}
                        className="overflow-hidden border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => handleProductClick(product)}
                      >
                        <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            layout="fill"
                            objectFit="cover"
                          />
                          <div className="absolute top-2 right-2 flex flex-col gap-1">
                            {product.isNew && <Badge className="bg-blue-500 text-white">New</Badge>}
                            {product.isPopular && (
                              <Badge className="bg-amber-500 text-white flex items-center gap-1">
                                <Flame className="h-3 w-3" />
                                <span>Popular</span>
                              </Badge>
                            )}
                            {product.isDiscount && (
                              <Badge className="bg-green-500 text-white">{product.discountPercentage}% Off</Badge>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{product.name}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                            >
                              {product.category}
                            </Badge>
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {selectedProduct.name}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative h-60 md:h-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <Image
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {selectedProduct.isNew && <Badge className="bg-blue-500 text-white">New</Badge>}
                    {selectedProduct.isPopular && (
                      <Badge className="bg-amber-500 text-white flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        <span>Popular</span>
                      </Badge>
                    )}
                    {selectedProduct.isDiscount && (
                      <Badge className="bg-green-500 text-white">{selectedProduct.discountPercentage}% Off</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">{selectedProduct.description}</p>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    >
                      {selectedProduct.category}
                    </Badge>
                    <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                      {formatPrice(selectedProduct.price)}
                    </span>
                  </div>

                  {selectedProduct.specifications && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Specifications</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key}</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{value.toString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">Availability</h4>
                      <Badge
                        className={
                          selectedProduct.stock && selectedProduct.stock > 0
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }
                      >
                        {selectedProduct.stock && selectedProduct.stock > 0
                          ? `In Stock (${selectedProduct.stock})`
                          : "Out of Stock"}
                      </Badge>
                    </div>
                    {selectedProduct.warranty && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Warranty:</span> {selectedProduct.warranty}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span>Save</span>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* New Product Alert */}
      <AnimatePresence>
        {newProductAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50 max-w-sm bg-white dark:bg-slate-800 rounded-lg shadow-xl border-l-4 border-blue-500 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-full p-2">
                  <Bell className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">New Product Alert!</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Check out the new {newProductAlert.name}. Available now!
                  </p>
                  <div className="mt-3 flex gap-3">
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => {
                        handleProductClick(newProductAlert)
                        setNewProductAlert(null)
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
                      onClick={() => setNewProductAlert(null)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-white dark:bg-slate-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                    onClick={() => setNewProductAlert(null)}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-gray-100 dark:bg-gray-700">
              <motion.div
                className="h-full bg-blue-500"
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

