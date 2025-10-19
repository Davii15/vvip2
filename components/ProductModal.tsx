"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Heart,
  Share2,
  Star,
  Clock,
  MapPin,
  Tag,
  MessageCircle,
  ShoppingCart,
  Zap,
  Award,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  category?: string
  type?: string
  description: string
  dateAdded: string
  isTrending?: boolean
  isHotDeal?: boolean
  hotDealEnds?: string
  duration?: string
  isMostPreferred?: boolean
}

interface Vendor {
  id: number
  name: string
  location: string
  logo: string
  description: string
  redirectUrl: string
  mapLink: string
  verified?: boolean
  established?: string
  specialties?: string[]
  whatsappNumber?: string
  businessHours?: string
  rating?: number
  totalReviews?: number
}

interface ProductModalProps {
  product: Product | null
  vendor: Vendor | null
  isOpen: boolean
  onClose: () => void
  colorScheme: "purple" | "blue" | "green"
}

const formatPrice = (price: Price) => {
  return `${price.currency} ${price.amount.toLocaleString()}`
}

const getWhatsAppLink = (phoneNumber: string, productName: string, vendorName: string) => {
  const message = encodeURIComponent(
    `Hi ${vendorName}! I'm interested in "${productName}". Could you please provide more details about pricing and availability? Thank you!`,
  )
  // Remove any non-numeric characters and ensure proper format
  const cleanNumber = phoneNumber.replace(/\D/g, "")
  return `https://wa.me/${cleanNumber}?text=${message}`
}

const colorSchemes = {
  purple: {
    gradient: "from-pink-500 to-purple-600",
    gradientHover: "from-pink-600 to-purple-700",
    background: "bg-gradient-to-br from-pink-50 to-purple-50",
    accent: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-200",
    button: "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700",
    whatsapp: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
  },
  blue: {
    gradient: "from-blue-600 to-purple-700",
    gradientHover: "from-blue-700 to-purple-800",
    background: "bg-gradient-to-br from-blue-50 to-indigo-50",
    accent: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
    button: "bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800",
    whatsapp: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
  },
  green: {
    gradient: "from-green-500 to-lime-600",
    gradientHover: "from-green-600 to-lime-700",
    background: "bg-gradient-to-br from-green-50 to-lime-50",
    accent: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
    button: "bg-gradient-to-r from-green-500 to-lime-600 hover:from-green-600 hover:to-lime-700",
    whatsapp: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
  },
}

export default function ProductModal({ product, vendor, isOpen, onClose, colorScheme }: ProductModalProps) {
  const [imageError, setImageError] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [quantity, setQuantity] = useState(1)

  const colors = colorSchemes[colorScheme]

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!product || !vendor) return null

  const savings = {
    amount: product.originalPrice.amount - product.currentPrice.amount,
    currency: product.currentPrice.currency,
  }

  const discountPercentage = Math.round((savings.amount / product.originalPrice.amount) * 100)

  const handleWhatsAppContact = () => {
    const whatsappNumber = vendor.whatsappNumber || "+254700000000" // Default fallback
    const whatsappLink = getWhatsAppLink(whatsappNumber, product.name, vendor.name)
    window.open(whatsappLink, "_blank")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this amazing deal: ${product.name} for only ${formatPrice(product.currentPrice)}!`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`${colors.background} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${colors.gradient} p-6 text-white relative`}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Image
                    src={imageError ? "/images/vendor-placeholder.png" : vendor.logo}
                    alt={vendor.name}
                    width={60}
                    height={60}
                    className="rounded-full border-2 border-white"
                    onError={() => setImageError(true)}
                  />
                  {vendor.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                      <Award className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{vendor.name}</h2>
                  <p className="text-white/90 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {vendor.location}
                  </p>
                  {vendor.rating && (
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(vendor.rating!) ? "text-yellow-400 fill-current" : "text-white/50"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-white/90">
                        {vendor.rating} ({vendor.totalReviews || 0} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row max-h-[calc(90vh-120px)] overflow-hidden">
              {/* Product Image */}
              <div className="lg:w-1/2 p-6">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={imageError ? "/images/product-placeholder.png" : product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && <Badge className="bg-red-500 text-white animate-pulse">NEW</Badge>}
                    {product.isTrending && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        TRENDING
                      </Badge>
                    )}
                    {product.isHotDeal && (
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white animate-bounce">
                        <Zap className="h-3 w-3 mr-1" />
                        HOT DEAL
                      </Badge>
                    )}
                    {discountPercentage > 0 && (
                      <Badge className="bg-green-500 text-white font-bold">{discountPercentage}% OFF</Badge>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-2 rounded-full bg-white shadow-lg transition-all duration-200 ${
                        isLiked ? "text-red-500" : "text-gray-600"
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full bg-white shadow-lg text-gray-600 hover:text-gray-800 transition-all duration-200"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="lg:w-1/2 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Product Title and Price */}
                  <div>
                    <h1 className={`text-3xl font-bold ${colors.text} mb-2`}>{product.name}</h1>
                    <div className="flex items-center gap-2 mb-4">
                      {product.category && (
                        <Badge variant="outline" className={`${colors.border} ${colors.text}`}>
                          <Tag className="h-3 w-3 mr-1" />
                          {product.category}
                        </Badge>
                      )}
                      {product.duration && (
                        <Badge variant="outline" className={`${colors.border} ${colors.text}`}>
                          <Clock className="h-3 w-3 mr-1" />
                          {product.duration}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <span className={`text-3xl font-bold ${colors.text}`}>{formatPrice(product.currentPrice)}</span>
                      {savings.amount > 0 && (
                        <div className="flex flex-col">
                          <span className="text-lg text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                          <span className="text-green-600 font-semibold">Save {formatPrice(savings)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tabs */}
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="vendor">Vendor</TabsTrigger>
                      <TabsTrigger value="contact">Contact</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                      <div>
                        <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>Description</h3>
                        <p className="text-gray-700 leading-relaxed">{product.description}</p>
                      </div>

                      {product.hotDealEnds && (
                        <div className={`${colors.accent} p-4 rounded-lg`}>
                          <h4 className={`font-semibold ${colors.text} mb-1`}>Limited Time Offer!</h4>
                          <p className="text-sm text-gray-600">
                            This deal expires on {new Date(product.hotDealEnds).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="vendor" className="space-y-4">
                      <div>
                        <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>About {vendor.name}</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">{vendor.description}</p>

                        {vendor.established && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Established:</strong> {vendor.established}
                          </p>
                        )}

                        {vendor.specialties && (
                          <div>
                            <h4 className={`font-semibold ${colors.text} mb-2`}>Specialties:</h4>
                            <div className="flex flex-wrap gap-2">
                              {vendor.specialties.map((specialty, index) => (
                                <Badge key={index} variant="outline" className={`${colors.border} ${colors.text}`}>
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {vendor.businessHours && (
                          <div className="mt-4">
                            <h4 className={`font-semibold ${colors.text} mb-1`}>Business Hours:</h4>
                            <p className="text-gray-600">{vendor.businessHours}</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-4">
                      <div>
                        <h3 className={`text-lg font-semibold ${colors.text} mb-4`}>Get in Touch</h3>

                        <div className="space-y-3">
                          <Button
                            onClick={handleWhatsAppContact}
                            className={`w-full ${colors.whatsapp} text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105`}
                          >
                            <MessageCircle className="h-5 w-5 mr-2" />
                            Chat on WhatsApp
                          </Button>

                          <Button
                            onClick={() => window.open(vendor.redirectUrl, "_blank")}
                            variant="outline"
                            className={`w-full ${colors.border} ${colors.text} py-3 rounded-lg font-semibold`}
                          >
                            Visit Website
                          </Button>

                          <Button
                            onClick={() => window.open(vendor.mapLink, "_blank")}
                            variant="outline"
                            className={`w-full ${colors.border} ${colors.text} py-3 rounded-lg font-semibold`}
                          >
                            <MapPin className="h-5 w-5 mr-2" />
                            View on Map
                          </Button>
                        </div>

                        <div className={`${colors.accent} p-4 rounded-lg mt-4`}>
                          <h4 className={`font-semibold ${colors.text} mb-2`}>Quick Contact Tips:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Mention the product name when contacting</li>
                            <li>• Ask about current availability and pricing</li>
                            <li>• Inquire about bulk discounts if applicable</li>
                            <li>• Check delivery options and timeframes</li>
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={handleWhatsAppContact}
                      className={`flex-1 ${colors.whatsapp} text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105`}
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Contact Now
                    </Button>
                    <Button
                      className={`flex-1 ${colors.button} text-white py-3 rounded-lg font-semibold transition-all duration-200`}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Book/Order
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
