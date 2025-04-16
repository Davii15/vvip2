"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, ExternalLink, ShoppingCart, Heart, Star, Award, Crown } from "lucide-react"

// Mock advertisement data with KSh currency
const advertisements = [
  {
    id: 1,
    title: "Premium Wireless Headphones",
    vendor: "SoundWave",
    description:
      "Experience crystal clear audio with our noise-cancelling wireless headphones. Limited time offer with 30% off!",
    price: 14999,
    originalPrice: 19999,
    discount: "30%",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 245,
    badge: "TRENDING",
    color: "bg-amber-600",
  },
  {
    id: 2,
    title: "Smart Fitness Watch",
    vendor: "TechFit",
    description:
      "Track your health metrics, workouts, and sleep patterns with our advanced fitness watch. Now with 25% discount!",
    price: 8999,
    originalPrice: 11999,
    discount: "25%",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviews: 189,
    badge: "BESTSELLER",
    color: "bg-amber-500",
  },
  {
    id: 3,
    title: "Organic Skincare Bundle",
    vendor: "NaturalGlow",
    description:
      "Revitalize your skin with our all-natural, cruelty-free skincare products. Buy the bundle and save 40%!",
    price: 7999,
    originalPrice: 12999,
    discount: "40%",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    reviews: 312,
    badge: "ORGANIC",
    color: "bg-yellow-600",
  },
  {
    id: 4,
    title: "Ultra HD Smart TV",
    vendor: "VisionTech",
    description:
      "Transform your home entertainment with our 55-inch Ultra HD Smart TV. Special offer with free soundbar!",
    price: 49999,
    originalPrice: 69999,
    discount: "28%",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 178,
    badge: "HOT DEAL",
    color: "bg-amber-700",
  },
  {
    id: 5,
    title: "Gourmet Coffee Subscription",
    vendor: "BeanMasters",
    description: "Enjoy premium coffee beans delivered to your doorstep monthly. First month 50% off!",
    price: 1999,
    originalPrice: 3999,
    discount: "50%",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    reviews: 423,
    badge: "POPULAR",
    color: "bg-yellow-700",
  },
]

// Helper function to format KSh currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-KE", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function TopAdvertisementSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAd, setSelectedAd] = useState<(typeof advertisements)[0] | null>(null)
  const [autoplay, setAutoplay] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Auto-rotate advertisements
  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % advertisements.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  // Pause autoplay when user interacts with the carousel
  const handleInteraction = () => {
    setAutoplay(false)
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setAutoplay(true), 10000)
  }

  const nextAd = () => {
    handleInteraction()
    setCurrentIndex((prevIndex) => (prevIndex + 1) % advertisements.length)
  }

  const prevAd = () => {
    handleInteraction()
    setCurrentIndex((prevIndex) => (prevIndex - 1 + advertisements.length) % advertisements.length)
  }

  const openAdDetails = (ad: (typeof advertisements)[0]) => {
    handleInteraction()
    setSelectedAd(ad)
  }

  const closeAdDetails = () => {
    setSelectedAd(null)
  }

  // Scroll to the selected ad in the scroll container
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current
      const itemWidth = scrollContainer.scrollWidth / advertisements.length
      scrollContainer.scrollTo({
        left: currentIndex * itemWidth,
        behavior: "smooth",
      })
    }
  }, [currentIndex])

  return (
    <div className="relative w-full bg-gradient-to-r from-amber-50 to-yellow-100 rounded-xl shadow-lg overflow-hidden mb-8 border border-amber-200">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-300 rounded-tl-xl"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-300 rounded-tr-xl"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-300 rounded-bl-xl"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-300 rounded-br-xl"></div>

      {/* Golden header */}
      <div className="absolute top-0 left-0 w-full py-2 px-4 bg-gradient-to-r from-amber-600 to-yellow-500 text-white z-10 flex items-center justify-center">
        <Crown className="w-5 h-5 mr-2" />
        <h2 className="text-lg font-bold text-center">Premium Deals & Exclusive Offers</h2>
        <Crown className="w-5 h-5 ml-2" />
      </div>

      {/* Featured Advertisement */}
      <div className="pt-12 pb-6 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center gap-6 p-4 bg-white rounded-lg shadow-md border border-amber-200"
          >
            <div className="relative w-full md:w-1/3 aspect-square">
              <div
                className={`absolute top-2 left-2 ${advertisements[currentIndex].color} text-white text-xs font-bold py-1 px-2 rounded-full z-10 flex items-center`}
              >
                <Award className="w-3 h-3 mr-1" />
                {advertisements[currentIndex].badge}
              </div>
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full z-10">
                SAVE {advertisements[currentIndex].discount}
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg"></div>
              <Image
                src={advertisements[currentIndex].image || "/placeholder.svg"}
                alt={advertisements[currentIndex].title}
                fill
                className="object-contain p-4"
              />
            </div>
            <div className="w-full md:w-2/3 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{advertisements[currentIndex].title}</h3>
                  <p className="text-sm text-gray-600">By {advertisements[currentIndex].vendor}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(advertisements[currentIndex].rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600">({advertisements[currentIndex].reviews})</span>
                </div>
              </div>
              <p className="text-gray-700">{advertisements[currentIndex].description}</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-amber-600">
                  KSh {formatCurrency(advertisements[currentIndex].price)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  KSh {formatCurrency(advertisements[currentIndex].originalPrice)}
                </span>
                <span className="text-sm bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Save KSh{" "}
                  {formatCurrency(advertisements[currentIndex].originalPrice - advertisements[currentIndex].price)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => openAdDetails(advertisements[currentIndex])}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-md transition-colors duration-200 flex items-center gap-2 shadow-md"
                >
                  <ExternalLink className="w-4 h-4" /> View Details
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2 shadow-md">
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
                <button className="p-2 border border-amber-300 hover:bg-amber-50 rounded-md transition-colors duration-200">
                  <Heart className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={prevAd}
            className="p-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 transition-colors duration-200 shadow-md"
            aria-label="Previous advertisement"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextAd}
            className="p-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 transition-colors duration-200 shadow-md"
            aria-label="Next advertisement"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Thumbnails with Golden Styling */}
      <div className="px-4 pb-6">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-amber-500 scrollbar-track-amber-100"
        >
          {advertisements.map((ad, index) => (
            <div
              key={ad.id}
              onClick={() => {
                setCurrentIndex(index)
                handleInteraction()
              }}
              className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${
                index === currentIndex
                  ? "border-2 border-amber-500 scale-105 shadow-md"
                  : "border border-amber-200 opacity-70 hover:opacity-100"
              }`}
              style={{ width: "150px" }}
            >
              <div className="relative h-24 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-t-md overflow-hidden">
                <div
                  className={`absolute top-1 left-1 ${ad.color} text-white text-[10px] py-0.5 px-1 rounded-full z-10`}
                >
                  {ad.discount}
                </div>
                <Image src={ad.image || "/placeholder.svg"} alt={ad.title} fill className="object-contain p-2" />
              </div>
              <div className="p-2 bg-white rounded-b-md">
                <h4 className="text-xs font-medium text-gray-800 truncate">{ad.title}</h4>
                <p className="text-xs text-amber-600 font-bold">KSh {formatCurrency(ad.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Detail Modal with Golden Styling */}
      <AnimatePresence>
        {selectedAd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={closeAdDetails}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-amber-300 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative corners for modal */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-amber-300 rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-amber-300 rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-amber-300 rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-amber-300 rounded-br-xl"></div>

              <div className="relative">
                <button
                  onClick={closeAdDetails}
                  className="absolute top-4 right-4 p-2 bg-amber-100 hover:bg-amber-200 rounded-full transition-colors duration-200 z-10"
                >
                  <X className="w-5 h-5 text-amber-800" />
                </button>

                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-1/2 aspect-square bg-gradient-to-br from-amber-50 to-yellow-50">
                    <div
                      className={`absolute top-4 left-4 ${selectedAd.color} text-white text-sm font-bold py-1 px-3 rounded-full z-10 flex items-center`}
                    >
                      <Award className="w-4 h-4 mr-1" />
                      {selectedAd.badge}
                    </div>
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold py-1 px-3 rounded-full z-10">
                      SAVE {selectedAd.discount}
                    </div>
                    <Image
                      src={selectedAd.image || "/placeholder.svg"}
                      alt={selectedAd.title}
                      fill
                      className="object-contain p-8"
                    />
                  </div>

                  <div className="w-full md:w-1/2 p-6 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedAd.title}</h2>
                      <p className="text-gray-600">By {selectedAd.vendor}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(selectedAd.rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        {selectedAd.rating} ({selectedAd.reviews} reviews)
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-amber-600">KSh {formatCurrency(selectedAd.price)}</span>
                      <span className="text-xl text-gray-500 line-through">
                        KSh {formatCurrency(selectedAd.originalPrice)}
                      </span>
                      <span className="text-sm bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        You save: KSh {formatCurrency(selectedAd.originalPrice - selectedAd.price)}
                      </span>
                    </div>

                    <p className="text-gray-700 leading-relaxed">{selectedAd.description}</p>

                    <div className="border-t border-amber-200 pt-4">
                      <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                        <Crown className="w-4 h-4 text-amber-500 mr-1" /> Key Features:
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        <li>Premium quality guaranteed</li>
                        <li>Fast shipping available</li>
                        <li>30-day money-back guarantee</li>
                        <li>24/7 customer support</li>
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4">
                      <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-md transition-colors duration-200 flex items-center gap-2 flex-1 shadow-md">
                        <ShoppingCart className="w-5 h-5" /> Add to Cart
                      </button>
                      <button className="px-6 py-3 border border-amber-500 text-amber-600 hover:bg-amber-50 rounded-md transition-colors duration-200 flex items-center gap-2 flex-1">
                        <Heart className="w-5 h-5" /> Add to Wishlist
                      </button>
                    </div>

                    <div className="text-sm text-gray-500 pt-2">
                      <p className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                        Limited time offer. While supplies last.
                      </p>
                      <p className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                        Free shipping on orders over KSh 5,000.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
