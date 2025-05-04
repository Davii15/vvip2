"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Star,
  StarHalf,
  Download,
  Heart,
  ChevronLeft,
  ChevronRight,
  Search,
  Tag,
  Gamepad2,
  Laptop,
  LineChart,
  Brush,
  Shield,
  Code,
  Layers,
} from "lucide-react"

// Types for our software products
type SoftwareCategory =
  | "all"
  | "games"
  | "productivity"
  | "business"
  | "design"
  | "security"
  | "development"
  | "utilities"

interface SoftwareProduct {
  id: string
  name: string
  description: string
  category: SoftwareCategory
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  imageUrl: string
  downloadUrl: string
  developer: string
  releaseDate: string
  featured?: boolean
  discount?: number
  tags: string[]
  platforms: ("windows" | "mac" | "linux" | "android" | "ios")[]
}

// Sample data - in a real app, this would come from an API or database
const sampleSoftwareProducts: SoftwareProduct[] = [
  {
    id: "sw-001",
    name: "Cosmic Explorer: Beyond the Stars",
    description:
      "An immersive space exploration game with stunning visuals and an epic storyline. Discover new planets, encounter alien species, and build your own galactic empire.",
    category: "games",
    price: 49.99,
    originalPrice: 59.99,
    rating: 4.8,
    reviewCount: 1245,
    imageUrl: "/placeholder.svg?height=600&width=800",
    downloadUrl: "https://example.com/download/cosmic-explorer",
    developer: "Stellar Games Studio",
    releaseDate: "2025-01-15",
    featured: true,
    discount: 20,
    tags: ["Space", "Adventure", "RPG", "Open World"],
    platforms: ["windows", "mac"],
  },
  {
    id: "sw-002",
    name: "ProDesign Studio 2025",
    description:
      "Professional graphic design software with advanced tools for illustration, photo editing, and layout design. Perfect for professionals and hobbyists alike.",
    category: "design",
    price: 29.99,
    originalPrice: 49.99,
    rating: 4.5,
    reviewCount: 876,
    imageUrl: "/placeholder.svg?height=600&width=800",
    downloadUrl: "https://example.com/download/prodesign-studio",
    developer: "Creative Solutions Inc.",
    releaseDate: "2024-11-30",
    discount: 40,
    tags: ["Design", "Photo Editing", "Illustration", "Professional"],
    platforms: ["windows", "mac"],
  },
  {
    id: "sw-003",
    name: "BusinessPro Analytics Suite",
    description:
      "Comprehensive business analytics platform with real-time dashboards, reporting tools, and AI-powered insights to drive your business decisions.",
    category: "business",
    price: 79.99,
    rating: 4.7,
    reviewCount: 532,
    imageUrl: "/placeholder.svg?height=600&width=800",
    downloadUrl: "https://example.com/download/businesspro-analytics",
    developer: "Enterprise Solutions Ltd.",
    releaseDate: "2024-10-05",
    featured: true,
    tags: ["Analytics", "Business Intelligence", "Reporting", "AI"],
    platforms: ["windows", "mac", "linux"],
  },
  {
    id: "sw-004",
    name: "CyberShield Pro",
    description:
      "Advanced cybersecurity solution that protects your devices from malware, ransomware, and other online threats with real-time monitoring.",
    category: "security",
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.9,
    reviewCount: 1023,
    imageUrl: "/placeholder.svg?height=600&width=800",
    downloadUrl: "https://example.com/download/cybershield-pro",
    developer: "SecureTech Systems",
    releaseDate: "2024-09-20",
    discount: 33,
    tags: ["Security", "Antivirus", "Privacy", "Protection"],
    platforms: ["windows", "mac", "android", "ios"],
  },
  {
    id: "sw-005",
    name: "CodeMaster IDE 2025",
    description:
      "Powerful integrated development environment with support for multiple programming languages, AI code completion, and advanced debugging tools.",
    category: "development",
    price: 0,
    rating: 4.6,
    reviewCount: 2145,
    imageUrl: "/placeholder.svg?height=600&width=800",
    downloadUrl: "https://example.com/download/codemaster-ide",
    developer: "DevTools Corporation",
    releaseDate: "2025-02-10",
    tags: ["Development", "Programming", "IDE", "Coding"],
    platforms: ["windows", "mac", "linux"],
  },
  {
    id: "sw-006",
    name: "ProductivityPro Office Suite",
    description:
      "Complete office productivity suite with word processing, spreadsheets, presentations, and more. Seamlessly sync across all your devices.",
    category: "productivity",
    price: 19.99,
    originalPrice: 29.99,
    rating: 4.4,
    reviewCount: 1567,
    imageUrl: "/placeholder.svg?height=600&width=800",
    downloadUrl: "https://example.com/download/productivitypro",
    developer: "WorkSmart Software",
    releaseDate: "2024-08-15",
    discount: 33,
    tags: ["Office", "Productivity", "Documents", "Collaboration"],
    platforms: ["windows", "mac", "android", "ios"],
  },
  {
    id: "sw-007",
    name: "SystemOptimizer Pro",
    description:
      "Comprehensive system utility that cleans, speeds up, and optimizes your computer's performance. Includes disk cleaner, registry repair, and startup manager.",
    category: "utilities",
    price: 24.99,
    rating: 4.3,
    reviewCount: 892,
    imageUrl: "/placeholder.svg?height=600&width=800",
    downloadUrl: "https://example.com/download/systemoptimizer",
    developer: "OptimumTech Solutions",
    releaseDate: "2024-07-22",
    tags: ["Utilities", "System Optimization", "Cleanup", "Performance"],
    platforms: ["windows"],
  },
  {
    id: "sw-008",
    name: "Fantasy Kingdom: Legends",
    description:
      "Epic fantasy RPG with stunning graphics, immersive storyline, and hundreds of quests. Explore a vast open world filled with magic and adventure.",
    category: "games",
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.7,
    reviewCount: 3245,
    imageUrl: "/placeholder.svg?height=600&width=800",
    downloadUrl: "https://example.com/download/fantasy-kingdom",
    developer: "Epic Games Studio",
    releaseDate: "2024-12-05",
    featured: true,
    discount: 33,
    tags: ["RPG", "Fantasy", "Adventure", "Open World"],
    platforms: ["windows", "mac"],
  },
]

// Categories with their display names and icons
const categories: { id: SoftwareCategory; name: string; icon: React.ReactNode }[] = [
  { id: "all", name: "All Software", icon: <Layers size={18} /> },
  { id: "games", name: "Games", icon: <Gamepad2 size={18} /> },
  { id: "productivity", name: "Productivity", icon: <Laptop size={18} /> },
  { id: "business", name: "Business", icon: <LineChart size={18} /> },
  { id: "design", name: "Design", icon: <Brush size={18} /> },
  { id: "security", name: "Security", icon: <Shield size={18} /> },
  { id: "development", name: "Development", icon: <Code size={18} /> },
  { id: "utilities", name: "Utilities", icon: <Tag size={18} /> },
]

// Platform icons mapping
const platformIcons: Record<string, string> = {
  windows: "fab fa-windows",
  mac: "fab fa-apple",
  linux: "fab fa-linux",
  android: "fab fa-android",
  ios: "fab fa-app-store-ios",
}

export default function SellingSoftwareSection() {
  const [selectedCategory, setSelectedCategory] = useState<SoftwareCategory>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<SoftwareProduct[]>(sampleSoftwareProducts)
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])
  const [activeProduct, setActiveProduct] = useState<string | null>(null)
  const [visibleProducts, setVisibleProducts] = useState(8)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Filter products based on category and search query
  useEffect(() => {
    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      let filtered = sampleSoftwareProducts

      // Filter by category
      if (selectedCategory !== "all") {
        filtered = filtered.filter((product) => product.category === selectedCategory)
      }

      // Filter by search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.developer.toLowerCase().includes(query) ||
            product.tags.some((tag) => tag.toLowerCase().includes(query)),
        )
      }

      setFilteredProducts(filtered)
      setIsLoading(false)
    }, 300)
  }, [selectedCategory, searchQuery])

  // Load FontAwesome for platform icons
  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // Scroll carousel
  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  // Load more products
  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 4, filteredProducts.length))
  }

  // Render star rating
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    )
  }

  return (
    <motion.div
      className="w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-white/20 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Header with animated underline */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 inline-block">
            Software Marketplace
          </h2>
          <motion.div
            className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2 mx-auto"
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ delay: 0.2, duration: 0.8 }}
          />
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Discover premium software, games, and applications at unbeatable prices. Download instantly and upgrade your
            digital experience.
          </p>
        </div>

        {/* Search and filter controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search software, games, applications..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="mb-8 overflow-x-auto pb-2 hide-scrollbar">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.icon}
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Featured products carousel (horizontal scrolling) */}
        {filteredProducts.some((p) => p.featured) && (
          <div className="mb-12 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="bg-purple-100 text-purple-600 p-1 rounded-full mr-2">
                  <Star className="w-4 h-4 fill-purple-600" />
                </span>
                Featured Software
              </h3>
              <div className="flex gap-2">
                <button
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  onClick={() => scrollCarousel("left")}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  onClick={() => scrollCarousel("right")}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div ref={carouselRef} className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
              {filteredProducts
                .filter((product) => product.featured)
                .map((product) => (
                  <motion.div
                    key={product.id}
                    className="min-w-[300px] md:min-w-[350px] bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 flex flex-col snap-start"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    layout
                  >
                    {/* Product image with discount badge */}
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {product.discount && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {product.discount}% OFF
                        </div>
                      )}
                      <button
                        className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-gray-700 hover:text-red-500 transition-colors"
                        onClick={() => toggleFavorite(product.id)}
                      >
                        {favorites.includes(product.id) ? (
                          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                        ) : (
                          <Heart className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Product details */}
                    <div className="p-4 flex-grow">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-lg line-clamp-2">{product.name}</h4>
                        <div className="flex flex-shrink-0 gap-1">
                          {product.platforms.map((platform) => (
                            <span key={platform} className="text-gray-500" title={platform}>
                              <i className={platformIcons[platform]}></i>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-sm text-gray-500 mb-2">{product.developer}</div>

                      {renderRating(product.rating)}

                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {product.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {product.tags.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            +{product.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and download button */}
                    <div className="p-4 pt-0 mt-auto">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          {product.price === 0 ? (
                            <span className="text-lg font-bold text-green-600">Free</span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${product.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{product.reviewCount.toLocaleString()} reviews</span>
                      </div>

                      <Link
                        href={product.downloadUrl}
                        target="_blank"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <Download size={18} />
                        {product.price === 0 ? "Download Now" : "Buy & Download"}
                      </Link>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* Main product grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="loader"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div className="text-center py-16 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No software found</h3>
            <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredProducts.slice(0, visibleProducts).map((product) => (
                  <motion.div
                    key={product.id}
                    className={`bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 flex flex-col transition-all duration-300 ${
                      activeProduct === product.id ? "ring-2 ring-purple-500 ring-offset-2" : ""
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    onMouseEnter={() => setActiveProduct(product.id)}
                    onMouseLeave={() => setActiveProduct(null)}
                    layout
                  >
                    {/* Product image with discount badge */}
                    <div className="relative h-40 bg-gray-100">
                      <Image
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {product.discount && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {product.discount}% OFF
                        </div>
                      )}
                      <button
                        className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-gray-700 hover:text-red-500 transition-colors"
                        onClick={() => toggleFavorite(product.id)}
                      >
                        {favorites.includes(product.id) ? (
                          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        ) : (
                          <Heart className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Product details */}
                    <div className="p-4 flex-grow">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-base line-clamp-1">{product.name}</h4>
                        <div className="flex flex-shrink-0 gap-1">
                          {product.platforms.map((platform) => (
                            <span key={platform} className="text-gray-500 text-xs" title={platform}>
                              <i className={platformIcons[platform]}></i>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mb-1">{product.developer}</div>

                      {renderRating(product.rating)}

                      <p className="mt-2 text-xs text-gray-600 line-clamp-2">{product.description}</p>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {product.tags.length > 2 && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                            +{product.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and download button */}
                    <div className="p-4 pt-0 mt-auto">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          {product.price === 0 ? (
                            <span className="text-base font-bold text-green-600">Free</span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="text-base font-bold">${product.price.toFixed(2)}</span>
                              {product.originalPrice && (
                                <span className="text-xs text-gray-500 line-through">
                                  ${product.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{product.reviewCount.toLocaleString()} reviews</span>
                      </div>

                      <Link
                        href={product.downloadUrl}
                        target="_blank"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-sm"
                      >
                        <Download size={16} />
                        {product.price === 0 ? "Download Now" : "Buy & Download"}
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Load more button */}
            {visibleProducts < filteredProducts.length && (
              <div className="mt-8 text-center">
                <motion.button
                  className="bg-white border border-purple-500 text-purple-600 hover:bg-purple-50 font-medium py-2 px-6 rounded-lg inline-flex items-center gap-2"
                  onClick={loadMore}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Load More Software
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>

      {/* CSS for loader and scrollbar hiding */}
      <style jsx>{`
        .loader {
          border: 3px solid rgba(124, 58, 237, 0.1);
          border-radius: 50%;
          border-top: 3px solid rgba(124, 58, 237, 1);
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  )
}
