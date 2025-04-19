"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, X, Clock, Check, MapPin, TrendingUp , ShoppingBag , Sparkles , ChevronRight } from "lucide-react"
import Image from "next/image"
import CountdownTimer from "@/components/CountdownTimer"
import { useCookieTracking } from "@/hooks/useCookieTracking"
import { swapArrayElementsRandomly, swapVendorsWithinCategory } from "@/utils/swap-utils"
import { isNewThisWeek } from "@/utils/date-utils"
import NewThisWeekBadge from "@/components/NewThisWeekBadge"
import NewProductsForYou from "@/components/NewProductsForYou"
import { transformBeautyServicesToProducts } from "@/utils/product-transformers"
import HotTimeDeals from "@/components/HotTimeDeals"

interface Price {
  amount: number
  currency: string
}

interface BeautyService {
  id: number
  name: string
  imageUrl: string
  currentPrice: Price
  originalPrice: Price
  isNew?: boolean
  type: "Massage" | "Facial" | "Hair" | "Nails" | "Makeup" | "Other"
  duration: string
  description: string
  dateAdded: string // ISO date string
  isTrending?: boolean
  isHotDeal?: boolean // Add this field
  hotDealEnds?: string // Add this field - ISO date string

}

interface Vendor {
  id: number
  name: string
  location: string
  logo: string
  description: string
  services: BeautyService[]
  redirectUrl: string
  mapLink: string
  verified?:boolean
  defaultCurrency: string
}

// Mock data for vendors
const mockVendors: Vendor[] = [
  {
    id: 1,
    name: "Serenity Spa & Beauty",
    location: "Nairobi, Kenya",
    logo: "https://your-supabase-project.supabase.co/storage/v1/object/public/vendor-logos/serenity-spa-logo.png",
    description: "Experience ultimate relaxation and beauty treatments in our tranquil oasis.",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Serenity+Spa+%26+Beauty+Nairobi+Kenya",
    defaultCurrency: "KSH",
    verified:true,
    services: [
      {
        id: 1,
        name: "Luxe Aromatherapy Massage",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/service-images/aromatherapy-massage.jpg",
        currentPrice: { amount: 2500.0, currency: "KSH" },
        originalPrice: { amount: 3500.0, currency: "KSH" },
        type: "Massage",
        duration: "60 minutes",
        description: "Indulge in a soothing massage with essential oils to relax your body and mind.",
        dateAdded: "2025-03-15T10:30:00Z",
        isHotDeal: true, // Mark this as a hot deal
       hotDealEnds: "2025-04-15T23:59:59Z",
        
      },
      {
        id: 2,
        name: "Radiant Glow Facial",
        imageUrl: "https://your-supabase-project.supabase.co/storage/v1/object/public/service-images/glow-facial.jpg",
        currentPrice: { amount: 500.0, currency: "KSH" },
        originalPrice: { amount: 1500.0, currency: "KSH" },
        type: "Facial",
        duration: "75 minutes",
        description: "Revitalize your skin with our signature facial for a youthful, radiant complexion.",
        dateAdded: "2025-03-15T10:30:00Z",
        isTrending:true,


      },
      {
        id: 3,
        name: "Deluxe Mani-Pedi Combo",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/service-images/mani-pedi-combo.jpg",
        currentPrice: { amount: 2000.0, currency: "KSH" },
        originalPrice: { amount: 3500.0, currency: "KSH" },
        type: "Nails",
        duration: "90 minutes",
        description: "Treat your hands and feet to a luxurious manicure and pedicure experience.",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
      },
    ],
    redirectUrl: "https://serenity-spa-beauty.com",
  },
  {
    id: 2,
    name: "Glamour Haven",
    location: "Mombasa, Kenya",
    logo: "https://your-supabase-project.supabase.co/storage/v1/object/public/vendor-logos/glamour-haven-logo.png",
    description: "Your one-stop destination for all things beauty and glamour.",
    defaultCurrency: "KSH",
    verified:true,
    mapLink: "https://www.google.com/maps/search/?api=1&query=Serenity+Spa+%26+Beauty+Nairobi+Kenya",
    services: [
      {
        id: 4,
        name: "Celebrity Makeover",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/service-images/celebrity-makeover.jpg",
        currentPrice: { amount: 1800.0, currency: "KSH" },
        originalPrice: { amount: 2000.0, currency: "KSH" },
        type: "Makeup",
        duration: "120 minutes",
        description: "Get the red carpet treatment with our professional makeup artists.",
        dateAdded: "2025-03-15T10:30:00Z",
        isHotDeal: true, // Mark this as a hot deal
       hotDealEnds: "2025-04-15T23:59:59Z",
      },
      {
        id: 5,
        name: "Silky Smooth Hair Treatment",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/service-images/hair-treatment.jpg",
        currentPrice: { amount: 550.0, currency: "KSH" },
        originalPrice: { amount: 800.0, currency: "KSH" },
        type: "Hair",
        duration: "60 minutes",
        description: "Transform your hair with our nourishing and smoothing hair treatment.",
        dateAdded: "2025-03-15T10:30:00Z",
      },
    ],
    redirectUrl: "https://glamour-haven.com",
  },
  {
    id: 3,
    name: "Zen Wellness Center",
    location: "Kisumu, Kenya",
    logo: "https://your-supabase-project.supabase.co/storage/v1/object/public/vendor-logos/zen-wellness-logo.png",
    description: "Holistic beauty and wellness treatments for your body, mind, and soul.",
    defaultCurrency: "KSH",
    verified:true,
    mapLink: "https://www.google.com/maps/search/?api=1&query=Serenity+Spa+%26+Beauty+Nairobi+Kenya",
    services: [
      {
        id: 6,
        name: "Hot Stone Massage Therapy",
        imageUrl:
          "https://your-supabase-project.supabase.co/storage/v1/object/public/service-images/hot-stone-massage.jpg",
        currentPrice: { amount: 500.0, currency: "KSH" },
        originalPrice: { amount: 850.0, currency: "KSH" },
        dateAdded: "2025-03-15T10:30:00Z",
        type: "Massage",
        duration: "90 minutes",
        description: "Experience deep relaxation with our hot stone massage therapy.",
      },
      {
        id: 7,
        name: "Rejuvenating Oxygen Facial",
        imageUrl: "https://your-supabase-project.supabase.co/storage/v1/object/public/service-images/oxygen-facial.jpg",
        currentPrice: { amount: 1500.0, currency: "KSH" },
        originalPrice: { amount: 2500.0, currency: "KSH" },
        type: "Facial",
        duration: "60 minutes",
        description: "Breathe new life into your skin with our oxygen-infused facial treatment.",
        dateAdded: "2025-03-15T10:30:00Z",
        isHotDeal: true, // Mark this as a hot deal
        hotDealEnds: "2025-04-15T23:59:59Z",
      },
    ],
    redirectUrl: "https://zen-wellness-center.com",
  },
]

const formatPrice = (price: Price): string => {
  // For KSH currency with large amounts, use a more compact format
  if (price.currency === "KSH" && price.amount >= 100000) {
    // Format as "KSH X,XXX,XXX" instead of using the default currency formatter
    return `${price.currency} ${price.amount.toLocaleString()}`
  }

  // Use default formatter for other currencies or smaller amounts
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    // Add maximumFractionDigits to prevent long decimal places
    maximumFractionDigits: 0,
  }).format(price.amount)
}

export default function BeautyAndMassage() {
  useCookieTracking("beauty-and-massage")
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors)
  const [newServiceAlert, setNewServiceAlert] = useState<BeautyService | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const beautyProducts = transformBeautyServicesToProducts(vendors)
  const hotBeautyDeals = beautyProducts.filter(product => 
    product.isHotDeal || 
    (product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount > 0.3 // 30% discount
  )
  .map(product => ({
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl,
    currentPrice: product.currentPrice,
    originalPrice: product.originalPrice,
    category: product.category,
    expiresAt: product.hotDealEnds || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: product.description,
    discount: Math.round(((product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount) * 100)
  }))
  
  .slice(0, 4)


  // State for service swapping functionality
  const [serviceTypes, setServiceTypes] = useState<string[]>(["Massage", "Facial", "Hair", "Nails", "Makeup", "Other"])
  const [swapTrigger, setSwapTrigger] = useState(0)

  // Add these states for infinite scroll
  const [visibleServiceTypes, setVisibleServiceTypes] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const typesPerPage = 2 // Show 2 service types at a time

  // Load more service types when user scrolls to bottom
  useEffect(() => {
    const endIndex = page * typesPerPage
    setVisibleServiceTypes(serviceTypes.slice(0, endIndex))
  }, [page, serviceTypes])

  // Add intersection observer to detect when user reaches bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleServiceTypes.length < serviceTypes.length) {
          setPage((prev) => prev + 1)
        }
      },
      { threshold: 0.1 },
    )

    const loadMoreTrigger = document.getElementById("load-more-trigger")
    if (loadMoreTrigger) {
      observer.observe(loadMoreTrigger)
    }

    return () => observer.disconnect()
  }, [visibleServiceTypes.length, serviceTypes.length])

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    // Find a new service to show in the alert
    const newService = vendors.flatMap((v) => v.services).find((s) => s.isNew)
    if (newService) {
      setNewServiceAlert(newService)
    }
  }, [vendors])

  useEffect(() => {
    const filtered = vendors.filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.services.some((service) => {
          const currentPriceStr = service.currentPrice.amount.toString()
          const originalPriceStr = service.originalPrice.amount.toString()
          const currencyMatch = service.currentPrice.currency.toLowerCase().includes(searchTerm.toLowerCase())

          return (
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.duration.toLowerCase().includes(searchTerm.toLowerCase()) ||
            currentPriceStr.includes(searchTerm) ||
            originalPriceStr.includes(searchTerm) ||
            currencyMatch
          )
        }),
    )
    setFilteredVendors(filtered)
  }, [searchTerm, vendors])

  // Add swapping effect every 10 minutes
  useEffect(() => {
    // Set up interval for swapping categories
    const swapInterval = setInterval(
      () => {
        // Swap service types
        setServiceTypes((prevTypes) => swapArrayElementsRandomly(prevTypes))

        // Swap vendors within each category
        setVendors((prevVendors) => {
          const newVendors = prevVendors.map((vendor) => ({
            ...vendor,
            services: [...vendor.services], // Create a new array of services
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

  return (
    <div className="bg-gradient-to-br from-pink-400 to-purple-600 min-h-screen">
      {/* IMPROVEMENT: Added a max-width container with responsive padding */}
      <div className="container mx-auto px-4 py-8 max-w-[1920px]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 text-white italic animate-pulse">
          Luxury for Less – Pamper Yourself with Exclusive Beauty & Spa Discounts!
        </h1>
        <CountdownTimer targetDate="2025-05-25T23:59:59" startDate="2025-02-13T00:00:00" />
        <NewProductsForYou 
  allProducts={beautyProducts}
  colorScheme="purple"
  maxProducts={4}
/>
<HotTimeDeals 
  deals={hotBeautyDeals}
  colorScheme="purple"
  title="Limited-Time Beauty Offers"
  subtitle="Exclusive spa and beauty treatments at special prices!"
/>

        <div className="mb-8 max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search beauty services, spas, or treatments..."
              className="w-full p-4 pr-12 rounded-full border border-pink-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white bg-opacity-80 text-purple-800 placeholder-purple-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400" />
          </div>
       </div>
 {/*some beauty shop logic*/}
 <div className="flex justify-center my-8">
      <Link href="/beauty-and-massage/shop">
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
            Open our Beauty Shop Products
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
         {/*some beauty shop logic*/}
 <div className="flex justify-center my-8">
      <Link href="/beauty-and-massage/shop/beauty-shop">
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
            Open our Beauty Shops
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






        
        {/* Use AnimatePresence with infinite scroll */}
        <AnimatePresence mode="popLayout">
          {visibleServiceTypes.map((type) => (
            <motion.div
              key={type}
              className="mb-12"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">{type}</h2>
              {/* IMPROVEMENT: Adjusted grid to better handle large screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredVendors
                    .filter((vendor) => vendor.services.some((service) => service.type === type))
                    .map((vendor) => (
                      <motion.div
                        key={`${vendor.id}-${type}-${swapTrigger}`}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <VendorCard vendor={vendor} serviceType={type} />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add this at the bottom to trigger loading more content */}
        {visibleServiceTypes.length < serviceTypes.length && (
          <div id="load-more-trigger" className="h-20 flex items-center justify-center">
            <div className="animate-pulse text-white opacity-80 font-semibold">Scroll for more beauty services...</div>
          </div>
        )}

        {/* Keep the original mapping for backward compatibility */}
        {serviceTypes.map((type) => (
          <div key={type} className="mb-12 hidden">
            <h2 className="text-2xl font-bold text-white mb-6 animate-bounce">{type}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredVendors
                .filter((vendor) => vendor.services.some((service) => service.type === type))
                .map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} serviceType={type} />
                ))}
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {newServiceAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-white bg-opacity-90 rounded-lg shadow-lg p-4 max-w-sm"
          >
            <button
              onClick={() => setNewServiceAlert(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-2 text-purple-600">New Beauty Service Alert!</h3>
            <p className="text-gray-600 mb-2">{newServiceAlert.name} is now available!</p>
            <p className="text-pink-600 font-bold">Only {formatPrice(newServiceAlert.currentPrice)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


function VendorCard({ vendor, serviceType }: { vendor: Vendor; serviceType: string }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="bg-white bg-opacity-80 rounded-lg shadow-md overflow-hidden backdrop-filter backdrop-blur-lg flex flex-col h-full">
      <div className="p-4 sm:p-6">
        {/* IMPROVEMENT: Made the header more responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <Image
                src={imageError ? "/images/vendor-placeholder.png" : vendor.logo}
                alt={vendor.name}
                width={60}
                height={60}
                className="rounded-full"
                onError={() => setImageError(true)}
              />
             {vendor.verified && (
                <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
                </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-purple-800">{vendor.name}</h3>
              <p className="text-pink-600">{vendor.location}</p>
            </div>
          </div>
          <a
            href={vendor.redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-pink-600 hover:to-purple-600 transition duration-300 transform hover:scale-105 whitespace-nowrap"
          >
            Visit Website
          </a>
        </div>
        <p className="text-gray-700 mb-4 line-clamp-2 md:line-clamp-none">{vendor.description}</p>
        <a
          href={vendor.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
        >
          <MapPin size={16} className="mr-1" />
          Find on  Maps
        </a>
      </div>
      <div className="bg-purple-100 bg-opacity-60 p-4 sm:p-6 flex-grow">
        <h4 className="text-lg font-semibold mb-4 text-purple-800">Featured Beauty Services</h4>
        {/* IMPROVEMENT: Simplified grid for better responsiveness */}
        <div className="grid grid-cols-1 gap-4 h-full">
          {vendor.services
            .filter((service) => service.type === serviceType)
            .map((service) => (
              <BeautyServiceCard key={service.id} service={service} />
            ))}
        </div>
      </div>
    </div>
  )
}
function TrendingBadge() {
  return (
    <motion.div
      className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center"
      animate={{ 
        scale: [1, 1.1, 1],
        boxShadow: [
          "0 4px 6px rgba(0, 0, 0, 0.1)",
          "0 10px 15px rgba(0, 0, 0, 0.2)",
          "0 4px 6px rgba(0, 0, 0, 0.1)"
        ]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      <TrendingUp className="h-3 w-3 mr-1" />
      <span>Trending</span>
    </motion.div>
  );
}

function BeautyServiceCard({ service }: { service: BeautyService }) {
  const [imageError, setImageError] = useState(false)
  const savings: Price = {
    amount: service.originalPrice.amount - service.currentPrice.amount,
    currency: service.currentPrice.currency,
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
      <div className="relative w-full pt-[60%]">
        <Image
          src={imageError ? "/images/service-placeholder.png" : service.imageUrl}
          alt={service.name}
          layout="fill"
          objectFit="cover"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={80}
          onError={() => setImageError(true)}
        />
        {service.isNew && (
          <div className="absolute top-2 right-2 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
            NEW
          </div>
        )}
       {service.isTrending && <TrendingBadge />}

        {service.dateAdded && isNewThisWeek(service.dateAdded) && (
          <div className="absolute bottom-2 left-2">
            <NewThisWeekBadge />
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h5 className="font-semibold mb-2 text-purple-800 truncate">{service.name}</h5>
        <p className="text-sm text-gray-600 mb-2 line-clamp-3 md:line-clamp-2 xl:line-clamp-none flex-grow">
          {service.description}
        </p>

        {/* IMPROVEMENT: Better price display to prevent overflow */}
        <div className="flex flex-col mb-2">
          <span className="text-lg font-bold text-pink-600 break-words">{formatPrice(service.currentPrice)}</span>
          <span className="text-sm text-gray-500 line-through break-words">{formatPrice(service.originalPrice)}</span>
        </div>

        <div className="text-sm text-gray-600 mb-2">
          <div className="flex items-center">
            <Clock size={16} className="mr-1 text-purple-500 flex-shrink-0" />
            <span className="truncate">{service.duration}</span>
          </div>
        </div>

        {/* IMPROVEMENT: Added min-width-0 to buttons to prevent overflow */}
        <div className="mt-auto space-y-2">
          <motion.button
            className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-2 rounded-full min-w-0"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            animate={{ rotateZ: [0, 5, 0, -5, 0] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            Save {formatPrice(savings)}
          </motion.button>
          <motion.button
            className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-full min-w-0"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Book Now
          </motion.button>
          <button className="w-full bg-gradient-to-r from-yellow-400 to-pink-500 text-white px-4 py-2 rounded-full hover:from-yellow-500 hover:to-pink-600 transition-all duration-300 shadow-lg min-w-0">
            Grab them
          </button>
        </div>
      </div>
    </div>
  )
}

