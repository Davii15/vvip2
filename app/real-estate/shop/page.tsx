"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  Search,
  Filter,
  Heart,
  ChevronDown,
  Home,
  Building,
  MapPin,
  Bed,
  Bath,
  Square,
  Tag,
  Calendar,
  Star,
  BadgePercent,
  Flame,
  Clock,
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Share2,
  Phone,
  Mail,
  ExternalLink,
  Maximize2,
  ParkingSquare,
  Trees,
  Wifi,
  Droplets,
  Sofa,
  Landmark,
  Warehouse,
  Briefcase,
  Sparkles,
  Zap,
  Palmtree,
  Mountain,
  Waves,
  Utensils,
  ShoppingBag,
  GraduationCap,
  Bus,
  Leaf,
  Ruler,
  Compass,
  Lightbulb,
  Thermometer,
  Lock,
  Tv,
  Armchair,
  Truck,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Custom KSh icon component
const KshIcon = ({ className }: { className?: string }) => (
  <div className={className}>
    <span className="font-semibold">KSh</span>
  </div>
)

// Types
interface Price {
  amount: number
  currency: string
}

interface Location {
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  coordinates: {
    latitude: number
    longitude: number
  }
  neighborhood: string
}

interface Agent {
  id: string
  name: string
  phone: string
  email: string
  photo: string
  company: string
  rating: number
  reviewCount: number
  listings: number
}

interface Feature {
  icon: React.ReactNode
  label: string
}

interface Amenity {
  icon: React.ReactNode
  label: string
  category: "interior" | "exterior" | "community" | "security" | "other"
}

interface NearbyPlace {
  type: "school" | "restaurant" | "shopping" | "park" | "transport" | "hospital" | "gym" | "other"
  name: string
  distance: string
  rating?: number
}

interface PropertyImage {
  url: string
  type: "exterior" | "interior" | "floorplan" | "other"
  caption?: string
}

interface Property {
  id: string
  title: string
  description: string
  type: "house" | "apartment" | "condo" | "townhouse" | "land" | "commercial" | "industrial" | "other"
  category: "residential" | "commercial" | "industrial" | "land"
  status: "for-sale" | "for-rent" | "sold" | "rented" | "pending"
  price: Price
  priceHistory?: {
    date: string
    price: Price
    event: "listed" | "reduced" | "increased" | "sold"
  }[]
  location: Location
  bedrooms: number
  bathrooms: number
  area: {
    interior: number
    exterior?: number
    unit: "sqft" | "sqm"
  }
  yearBuilt: number
  features: Feature[]
  amenities: Amenity[]
  nearbyPlaces?: NearbyPlace[]
  images: PropertyImage[]
  agent: Agent
  createdAt: string
  updatedAt: string
  viewCount: number
  favoriteCount: number
  isVerified: boolean
  isFeatured?: boolean
  isHotDeal?: boolean
  isNewListing?: boolean
  isPremium?: boolean
  tags?: string[]
  virtualTourUrl?: string
  videoUrl?: string
  parkingSpaces?: number
  lotSize?: {
    amount: number
    unit: "sqft" | "sqm" | "acre" | "hectare"
  }
  propertyTax?: Price
  hoaFees?: Price
  energyRating?: string
  constructionStatus?: "ready" | "under-construction" | "pre-construction"
  availableFrom?: string
  leaseTerm?: string
  petPolicy?: string
  furnished?: boolean
  appliances?: string[]
  heatingType?: string
  coolingType?: string
  internetAvailability?: string
  views?: string[]
  floorLevel?: number
  totalFloors?: number
  accessibility?: string[]
  basement?: boolean
  attic?: boolean
  garage?: boolean
  pool?: boolean
  garden?: boolean
  waterfront?: boolean
  mountainView?: boolean
  cityView?: boolean
  hotDealEnds?: string
}

// Helper function to format price
const formatPrice = (price: Price): string => {
  return `KSh ${price.amount.toLocaleString("en-KE")}`
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Helper function to format area
const formatArea = (area: number, unit: string): string => {
  return `${area.toLocaleString()} ${unit}`
}

// New Listing Badge Component
const NewListingBadge = () => {
  return (
    <div className="relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md blur opacity-30 animate-pulse"></div>
      <Badge className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-2 py-1 flex items-center gap-1">
        <Sparkles className="h-3 w-3" />
        <span>NEW</span>
      </Badge>
    </div>
  )
}

// Hot Deal Badge Component
const HotDealBadge = () => {
  return (
    <div className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-bl-lg font-semibold text-xs flex items-center">
      <Flame className="h-3 w-3 mr-1" />
      HOT DEAL
    </div>
  )
}

// Premium Badge Component
const PremiumBadge = () => {
  return (
    <div className="absolute top-0 left-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-3 py-1 rounded-br-lg font-semibold text-xs flex items-center">
      <Star className="h-3 w-3 mr-1 fill-white" />
      PREMIUM
    </div>
  )
}

// Countdown Timer Component
const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      <Clock className="h-3 w-3 text-red-500" />
      <div className="flex gap-1">
        <span className="font-bold">{timeLeft.days}d</span>:<span className="font-bold">{timeLeft.hours}h</span>:
        <span className="font-bold">{timeLeft.minutes}m</span>:<span className="font-bold">{timeLeft.seconds}s</span>
      </div>
    </div>
  )
}

// Featured Property Card Component
const FeaturedPropertyCard = ({ property }: { property: Property }) => {
  const { toast } = useToast()

  const addToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation()
    toast({
      title: "Added to Favorites",
      description: `${property.title} has been added to your favorites.`,
      duration: 3000,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={property.images[0].url || "/placeholder.svg"}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {property.isPremium && <PremiumBadge />}

          {property.isHotDeal && <HotDealBadge />}

          {property.isNewListing && (
            <div className="absolute bottom-3 left-3">
              <NewListingBadge />
            </div>
          )}

          <div className="absolute top-3 right-3">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
              onClick={addToFavorites}
            >
              <Heart className="h-4 w-4 text-rose-500" />
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex justify-between items-end">
              <div>
                <Badge className="bg-blue-600 text-white border-0 mb-2">
                  {property.status === "for-sale" ? "For Sale" : "For Rent"}
                </Badge>
                <h3 className="text-white font-bold text-xl line-clamp-1">{property.title}</h3>
              </div>
              <div className="text-white font-bold text-xl">
                {formatPrice(property.price)}
                {property.status === "for-rent" && <span className="text-sm font-normal">/mo</span>}
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-4 flex-grow">
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1 text-blue-500" />
            <span className="line-clamp-1">
              {property.location.address}, {property.location.city}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1 text-blue-500" />
              <span className="text-sm">{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1 text-blue-500" />
              <span className="text-sm">{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1 text-blue-500" />
              <span className="text-sm">{formatArea(property.area.interior, property.area.unit)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                <Image
                  src={property.agent.photo || "/placeholder.svg"}
                  alt={property.agent.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium">{property.agent.name}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(property.createdAt)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 border-t">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">View Details</Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// Property Card Component
const PropertyCard = ({
  property,
  index,
  isLastElement,
  onViewDetails,
}: {
  property: Property
  index: number
  isLastElement: boolean
  onViewDetails: (property: Property) => void
}) => {
  const { toast } = useToast()
  const cardRef = useRef<HTMLDivElement>(null)

  const addToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation()
    toast({
      title: "Added to Favorites",
      description: `${property.title} has been added to your favorites.`,
      duration: 3000,
    })
  }

  const shareProperty = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this ${property.bedrooms} bedroom ${property.type} in ${property.location.city}`,
        url: `https://example.com/property/${property.id}`,
      })
    } else {
      toast({
        title: "Link Copied",
        description: "Property link has been copied to clipboard.",
        duration: 3000,
      })
    }
  }

  return (
    <div
      ref={isLastElement ? cardRef : null}
      className="group animate-fadeIn"
      style={{ animationDelay: `${(index % 9) * 0.1}s` }}
      onClick={() => onViewDetails(property)}
    >
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-900/20 h-full flex flex-col cursor-pointer">
        <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={property.images[0].url || "/placeholder.svg"}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {property.isPremium && <PremiumBadge />}

          {property.isHotDeal && <HotDealBadge />}

          {property.isNewListing && (
            <div className="absolute bottom-3 left-3">
              <NewListingBadge />
            </div>
          )}

          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
              onClick={addToFavorites}
            >
              <Heart className="h-4 w-4 text-rose-500" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
              onClick={shareProperty}
            >
              <Share2 className="h-4 w-4 text-blue-500" />
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="flex justify-between items-end">
              <Badge
                className={`${property.status === "for-sale" ? "bg-blue-600" : "bg-emerald-600"} text-white border-0`}
              >
                {property.status === "for-sale" ? "For Sale" : "For Rent"}
              </Badge>
              <div className="text-white font-bold text-lg">
                {formatPrice(property.price)}
                {property.status === "for-rent" && <span className="text-xs font-normal">/mo</span>}
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-4 flex-grow">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1 text-blue-500" />
            <span className="line-clamp-1">
              {property.location.address}, {property.location.city}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1 text-blue-500" />
              <span className="text-sm">{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1 text-blue-500" />
              <span className="text-sm">{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1 text-blue-500" />
              <span className="text-sm">{formatArea(property.area.interior, property.area.unit)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {property.tags &&
              property.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
          </div>

          {property.isHotDeal && property.hotDealEnds && (
            <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 p-2 rounded-md mb-3">
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">Hot Deal Ends In:</span>
              <CountdownTimer targetDate={property.hotDealEnds} />
            </div>
          )}

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                <Image
                  src={property.agent.photo || "/placeholder.svg"}
                  alt={property.agent.name}
                  width={24}
                  height={24}
                  className="object-cover"
                />
              </div>
              <span className="text-xs">{property.agent.name}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{new Date(property.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Property Detail Modal Component
const PropertyDetailModal = ({
  property,
  isOpen,
  onClose,
}: {
  property: Property | null
  isOpen: boolean
  onClose: () => void
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  if (!property) return null

  const addToFavorites = () => {
    toast({
      title: "Added to Favorites",
      description: `${property.title} has been added to your favorites.`,
      duration: 3000,
    })
  }

  const shareProperty = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this ${property.bedrooms} bedroom ${property.type} in ${property.location.city}`,
        url: `https://example.com/property/${property.id}`,
      })
    } else {
      toast({
        title: "Link Copied",
        description: "Property link has been copied to clipboard.",
        duration: 3000,
      })
    }
  }

  const contactAgent = () => {
    toast({
      title: "Contact Request Sent",
      description: `Your request to contact ${property.agent.name} has been sent.`,
      duration: 3000,
    })
  }

  const scheduleViewing = () => {
    toast({
      title: "Viewing Scheduled",
      description: "Your viewing request has been scheduled. The agent will contact you shortly.",
      duration: 3000,
    })
  }

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  const amenitiesByCategory = {
    interior: property.amenities.filter((a) => a.category === "interior"),
    exterior: property.amenities.filter((a) => a.category === "exterior"),
    community: property.amenities.filter((a) => a.category === "community"),
    security: property.amenities.filter((a) => a.category === "security"),
    other: property.amenities.filter((a) => a.category === "other"),
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 p-4 border-b dark:border-gray-800 flex items-center justify-between">
          <DialogTitle className="text-xl font-bold">{property.title}</DialogTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={shareProperty}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm" variant="outline" onClick={addToFavorites}>
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
            <DialogClose className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="h-5 w-5" />
            </DialogClose>
          </div>
        </div>

        <div className="relative h-[400px] bg-gray-100 dark:bg-gray-800">
          <Image
            src={property.images[activeImageIndex].url || "/placeholder.svg"}
            alt={property.images[activeImageIndex].caption || property.title}
            fill
            className="object-cover"
          />

          <Button
            size="icon"
            variant="secondary"
            className="absolute top-1/2 left-4 transform -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
            onClick={prevImage}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="absolute top-1/2 right-4 transform -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
            onClick={nextImage}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
            {property.images.map((_, i) => (
              <button
                key={i}
                className={`w-2 h-2 rounded-full ${i === activeImageIndex ? "bg-white" : "bg-white/50"}`}
                onClick={() => setActiveImageIndex(i)}
              />
            ))}
          </div>

          <div className="absolute top-4 left-4 flex gap-2">
            <Badge
              className={`${property.status === "for-sale" ? "bg-blue-600" : "bg-emerald-600"} text-white border-0`}
            >
              {property.status === "for-sale" ? "For Sale" : "For Rent"}
            </Badge>
            {property.isVerified && (
              <Badge className="bg-green-600 text-white border-0 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                {formatPrice(property.price)}
                {property.status === "for-rent" && <span className="text-sm font-normal">/month</span>}
              </h2>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {property.location.address}, {property.location.city}, {property.location.state}
                </span>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-4">
                <p className="text-gray-700 dark:text-gray-300 mb-4">{property.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Property Type</span>
                    <span className="font-medium capitalize">{property.type.replace("-", " ")}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Year Built</span>
                    <span className="font-medium">{property.yearBuilt}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Bedrooms</span>
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Bathrooms</span>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Interior Area</span>
                    <span className="font-medium">{formatArea(property.area.interior, property.area.unit)}</span>
                  </div>
                  {property.area.exterior && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Exterior Area</span>
                      <span className="font-medium">{formatArea(property.area.exterior, property.area.unit)}</span>
                    </div>
                  )}
                  {property.parkingSpaces !== undefined && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Parking Spaces</span>
                      <span className="font-medium">{property.parkingSpaces}</span>
                    </div>
                  )}
                  {property.lotSize && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Lot Size</span>
                      <span className="font-medium">
                        {property.lotSize.amount} {property.lotSize.unit}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-lg mb-3">Key Features</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {property.features.slice(0, 6).map((feature, i) => (
                    <div key={i} className="flex items-center">
                      {feature.icon}
                      <span className="ml-2 text-sm">{feature.label}</span>
                    </div>
                  ))}
                </div>

                {property.virtualTourUrl && (
                  <div className="mb-6">
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Virtual Tour
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="features" className="pt-4">
                <h3 className="font-semibold text-lg mb-3">Interior Amenities</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {amenitiesByCategory.interior.map((amenity, i) => (
                    <div key={i} className="flex items-center">
                      {amenity.icon}
                      <span className="ml-2 text-sm">{amenity.label}</span>
                    </div>
                  ))}
                </div>

                <h3 className="font-semibold text-lg mb-3">Exterior Amenities</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {amenitiesByCategory.exterior.map((amenity, i) => (
                    <div key={i} className="flex items-center">
                      {amenity.icon}
                      <span className="ml-2 text-sm">{amenity.label}</span>
                    </div>
                  ))}
                </div>

                <h3 className="font-semibold text-lg mb-3">Community Amenities</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {amenitiesByCategory.community.map((amenity, i) => (
                    <div key={i} className="flex items-center">
                      {amenity.icon}
                      <span className="ml-2 text-sm">{amenity.label}</span>
                    </div>
                  ))}
                </div>

                {amenitiesByCategory.security.length > 0 && (
                  <>
                    <h3 className="font-semibold text-lg mb-3">Security Features</h3>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {amenitiesByCategory.security.map((amenity, i) => (
                        <div key={i} className="flex items-center">
                          {amenity.icon}
                          <span className="ml-2 text-sm">{amenity.label}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="location" className="pt-4">
                <div className="bg-gray-100 dark:bg-gray-800 h-64 rounded-lg mb-6 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-blue-500 mr-2" />
                  <span>Interactive Map Would Appear Here</span>
                </div>

                <h3 className="font-semibold text-lg mb-3">Neighborhood</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Located in {property.location.neighborhood}, this property offers convenient access to local amenities
                  and services.
                </p>

                {property.nearbyPlaces && property.nearbyPlaces.length > 0 && (
                  <>
                    <h3 className="font-semibold text-lg mb-3">Nearby Places</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      {property.nearbyPlaces.map((place, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                        >
                          <div className="flex items-center">
                            {place.type === "school" && <GraduationCap className="h-4 w-4 text-blue-500 mr-2" />}
                            {place.type === "restaurant" && <Utensils className="h-4 w-4 text-blue-500 mr-2" />}
                            {place.type === "shopping" && <ShoppingBag className="h-4 w-4 text-blue-500 mr-2" />}
                            {place.type === "park" && <Palmtree className="h-4 w-4 text-blue-500 mr-2" />}
                            {place.type === "transport" && <Bus className="h-4 w-4 text-blue-500 mr-2" />}
                            <span className="text-sm">{place.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{place.distance}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="history" className="pt-4">
                <h3 className="font-semibold text-lg mb-3">Property History</h3>

                {property.priceHistory ? (
                  <div className="space-y-3 mb-6">
                    {property.priceHistory.map((event, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                      >
                        <div className="flex items-center">
                          {event.event === "listed" && <Tag className="h-4 w-4 text-blue-500 mr-2" />}
                          {event.event === "reduced" && <ArrowLeft className="h-4 w-4 text-green-500 mr-2" />}
                          {event.event === "increased" && <ArrowRight className="h-4 w-4 text-red-500 mr-2" />}
                          {event.event === "sold" && <Check className="h-4 w-4 text-purple-500 mr-2" />}
                          <span className="text-sm capitalize">{event.event}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{formatPrice(event.price)}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(event.date)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 mb-6">No price history available for this property.</p>
                )}

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Listed on</span>
                    <span className="text-sm">{formatDate(property.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Last updated</span>
                    <span className="text-sm">{formatDate(property.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Property views</span>
                    <span className="text-sm">{property.viewCount.toLocaleString()}</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="md:col-span-1">
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={property.agent.photo || "/placeholder.svg"}
                      alt={property.agent.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{property.agent.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                      <span>
                        {property.agent.rating} ({property.agent.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-blue-500 mr-2" />
                    <span>{property.agent.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 text-blue-500 mr-2" />
                    <span>{property.agent.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Building className="h-4 w-4 text-blue-500 mr-2" />
                    <span>{property.agent.company}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={contactAgent}>
                    Contact Agent
                  </Button>
                  <Button variant="outline" className="w-full" onClick={scheduleViewing}>
                    Schedule Viewing
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Mortgage Calculator</h3>

                <div className="space-y-4 mb-4">
                  <div>
                    <Label htmlFor="price">Property Price</Label>
                    <div className="relative mt-1">
                      <KshIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="price"
                        type="text"
                        value={property.price.amount.toLocaleString()}
                        className="pl-14"
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="downpayment">Down Payment (20%)</Label>
                    <div className="relative mt-1">
                      <KshIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="downpayment"
                        type="text"
                        value={(property.price.amount * 0.2).toLocaleString()}
                        className="pl-14"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="term">Loan Term</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 years</SelectItem>
                        <SelectItem value="20">20 years</SelectItem>
                        <SelectItem value="30">30 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="interest">Interest Rate (%)</Label>
                    <Input id="interest" type="text" value="4.5" />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Monthly Payment</span>
                    <span className="font-semibold">
                      {formatPrice({ amount: 2034, currency: property.price.currency })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Loan Amount</span>
                    <span>
                      {formatPrice({ amount: property.price.amount * 0.8, currency: property.price.currency })}
                    </span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Get Pre-Approved
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function RealEstateShopPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [showNewAlert, setShowNewAlert] = useState(true)
  const [sortOption, setSortOption] = useState("featured")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000000 })
  const [bedroomsFilter, setBedroomsFilter] = useState<number | null>(null)
  const [bathroomsFilter, setBathroomsFilter] = useState<number | null>(null)
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)
  const { toast } = useToast()
  const ITEMS_PER_PAGE = 9

  // Mock data for properties
  const mockProperties: Property[] = [
    // Residential Properties - Houses
    {
      id: "res-house-1",
      title: "Luxury Family Home with Pool",
      description:
        "Stunning 5-bedroom family home with modern finishes, spacious living areas, and a beautiful backyard featuring a swimming pool and outdoor entertainment area. Located in a prestigious neighborhood with excellent schools nearby.",
      type: "house",
      category: "residential",
      status: "for-sale",
      price: { amount: 1250000, currency: "KES" },
      priceHistory: [
        { date: "2024-12-01", price: { amount: 1300000, currency: "KES" }, event: "listed" },
        { date: "2025-01-15", price: { amount: 1250000, currency: "KES" }, event: "reduced" },
      ],
      location: {
        address: "123 Maple Avenue",
        city: "Westfield",
        state: "NJ",
        zipCode: "07090",
        country: "USA",
        coordinates: { latitude: 40.6517, longitude: -74.3473 },
        neighborhood: "Franklin Heights",
      },
      bedrooms: 5,
      bathrooms: 4,
      area: {
        interior: 3200,
        exterior: 8500,
        unit: "sqft",
      },
      yearBuilt: 2018,
      features: [
        { icon: <Home className="h-4 w-4 text-blue-500" />, label: "Single Family Home" },
        { icon: <ParkingSquare className="h-4 w-4 text-blue-500" />, label: "2-Car Garage" },
        { icon: <Droplets className="h-4 w-4 text-blue-500" />, label: "Swimming Pool" },
        { icon: <Sofa className="h-4 w-4 text-blue-500" />, label: "Open Floor Plan" },
        { icon: <Thermometer className="h-4 w-4 text-blue-500" />, label: "Central Heating & AC" },
        { icon: <Utensils className="h-4 w-4 text-blue-500" />, label: "Gourmet Kitchen" },
      ],
      amenities: [
        { icon: <Sofa className="h-4 w-4 text-blue-500" />, label: "Hardwood Floors", category: "interior" },
        { icon: <Utensils className="h-4 w-4 text-blue-500" />, label: "Granite Countertops", category: "interior" },
        { icon: <Armchair className="h-4 w-4 text-blue-500" />, label: "Walk-in Closets", category: "interior" },
        { icon: <Lightbulb className="h-4 w-4 text-blue-500" />, label: "Recessed Lighting", category: "interior" },
        { icon: <Droplets className="h-4 w-4 text-blue-500" />, label: "Swimming Pool", category: "exterior" },
        { icon: <Palmtree className="h-4 w-4 text-blue-500" />, label: "Landscaped Garden", category: "exterior" },
        { icon: <Utensils className="h-4 w-4 text-blue-500" />, label: "Outdoor Kitchen", category: "exterior" },
        {
          icon: <GraduationCap className="h-4 w-4 text-blue-500" />,
          label: "Top-rated Schools",
          category: "community",
        },
        { icon: <ShoppingBag className="h-4 w-4 text-blue-500" />, label: "Shopping Centers", category: "community" },
        { icon: <Lock className="h-4 w-4 text-blue-500" />, label: "Security System", category: "security" },
      ],
      nearbyPlaces: [
        { type: "school", name: "Franklin Elementary School", distance: "0.5 miles", rating: 9.2 },
        { type: "park", name: "Westfield Memorial Park", distance: "0.8 miles" },
        { type: "shopping", name: "Downtown Shopping District", distance: "1.2 miles" },
        { type: "restaurant", name: "Maple Street Bistro", distance: "1.0 miles", rating: 4.7 },
      ],
      images: [
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Front View" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Living Room" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Kitchen" },
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Backyard with Pool" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Master Bedroom" },
      ],
      agent: {
        id: "agent-1",
        name: "Sarah Johnson",
        phone: "(908) 555-1234",
        email: "sarah.johnson@realestate.com",
        photo: "/placeholder.svg?height=200&width=200",
        company: "Prestige Real Estate",
        rating: 4.9,
        reviewCount: 124,
        listings: 42,
      },
      createdAt: "2024-12-01T10:30:00Z",
      updatedAt: "2025-01-15T14:45:00Z",
      viewCount: 1245,
      favoriteCount: 87,
      isVerified: true,
      isFeatured: true,
      isNewListing: false,
      isPremium: true,
      tags: ["luxury", "pool", "family-friendly", "modern"],
      virtualTourUrl: "https://example.com/virtual-tour/res-house-1",
      parkingSpaces: 2,
      lotSize: {
        amount: 0.25,
        unit: "acre",
      },
      propertyTax: { amount: 12000, currency: "KES" },
      hoaFees: { amount: 0, currency: "KES" },
      energyRating: "A",
      constructionStatus: "ready",
      basement: true,
      garage: true,
      pool: true,
      garden: true,
    },
    {
      id: "res-house-2",
      title: "Charming Colonial with Modern Updates",
      description:
        "Beautiful colonial home with modern updates throughout. Features include a renovated kitchen with stainless steel appliances, updated bathrooms, hardwood floors, and a finished basement. Enjoy the private backyard with a deck perfect for entertaining.",
      type: "house",
      category: "residential",
      status: "for-sale",
      price: { amount: 875000, currency: "KES" },
      location: {
        address: "45 Oak Street",
        city: "Montclair",
        state: "NJ",
        zipCode: "07042",
        country: "USA",
        coordinates: { latitude: 40.8259, longitude: -74.209 },
        neighborhood: "Upper Montclair",
      },
      bedrooms: 4,
      bathrooms: 2.5,
      area: {
        interior: 2400,
        exterior: 6000,
        unit: "sqft",
      },
      yearBuilt: 1925,
      features: [
        { icon: <Home className="h-4 w-4 text-blue-500" />, label: "Colonial Style" },
        { icon: <ParkingSquare className="h-4 w-4 text-blue-500" />, label: "Attached Garage" },
        { icon: <Sofa className="h-4 w-4 text-blue-500" />, label: "Finished Basement" },
        { icon: <Utensils className="h-4 w-4 text-blue-500" />, label: "Updated Kitchen" },
        { icon: <Thermometer className="h-4 w-4 text-blue-500" />, label: "Central Heating" },
        { icon: <Palmtree className="h-4 w-4 text-blue-500" />, label: "Deck & Patio" },
      ],
      amenities: [
        { icon: <Sofa className="h-4 w-4 text-blue-500" />, label: "Hardwood Floors", category: "interior" },
        {
          icon: <Utensils className="h-4 w-4 text-blue-500" />,
          label: "Stainless Steel Appliances",
          category: "interior",
        },
        { icon: <Lightbulb className="h-4 w-4 text-blue-500" />, label: "Recessed Lighting", category: "interior" },
        { icon: <Palmtree className="h-4 w-4 text-blue-500" />, label: "Deck", category: "exterior" },
        { icon: <Trees className="h-4 w-4 text-blue-500" />, label: "Mature Trees", category: "exterior" },
        {
          icon: <GraduationCap className="h-4 w-4 text-blue-500" />,
          label: "Excellent Schools",
          category: "community",
        },
        { icon: <Bus className="h-4 w-4 text-blue-500" />, label: "Public Transportation", category: "community" },
      ],
      images: [
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Front View" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Living Room" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Kitchen" },
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Backyard" },
      ],
      agent: {
        id: "agent-2",
        name: "Michael Chen",
        phone: "(973) 555-6789",
        email: "michael.chen@realestate.com",
        photo: "/placeholder.svg?height=200&width=200",
        company: "Montclair Realty",
        rating: 4.8,
        reviewCount: 98,
        listings: 31,
      },
      createdAt: "2025-01-10T09:15:00Z",
      updatedAt: "2025-01-10T09:15:00Z",
      viewCount: 876,
      favoriteCount: 45,
      isVerified: true,
      isNewListing: true,
      tags: ["colonial", "updated", "character", "finished-basement"],
      parkingSpaces: 1,
      lotSize: {
        amount: 0.15,
        unit: "acre",
      },
      propertyTax: { amount: 15000, currency: "KES" },
      basement: true,
      garage: true,
      garden: true,
    },
    {
      id: "res-house-3",
      title: "Modern Farmhouse with Mountain Views",
      description:
        "Stunning modern farmhouse with breathtaking mountain views. This custom-built home features an open concept living area, chef's kitchen, primary suite with spa-like bathroom, and a wraparound porch perfect for enjoying the scenery.",
      type: "house",
      category: "residential",
      status: "for-sale",
      price: { amount: 1450000, currency: "KES" },
      location: {
        address: "78 Mountain View Road",
        city: "Boulder",
        state: "CO",
        zipCode: "80302",
        country: "USA",
        coordinates: { latitude: 40.015, longitude: -105.2705 },
        neighborhood: "North Boulder",
      },
      bedrooms: 4,
      bathrooms: 3.5,
      area: {
        interior: 3600,
        exterior: 15000,
        unit: "sqft",
      },
      yearBuilt: 2021,
      features: [
        { icon: <Home className="h-4 w-4 text-blue-500" />, label: "Modern Farmhouse" },
        { icon: <Mountain className="h-4 w-4 text-blue-500" />, label: "Mountain Views" },
        { icon: <ParkingSquare className="h-4 w-4 text-blue-500" />, label: "3-Car Garage" },
        { icon: <Utensils className="h-4 w-4 text-blue-500" />, label: "Chef's Kitchen" },
        { icon: <Sofa className="h-4 w-4 text-blue-500" />, label: "Open Concept" },
        { icon: <Palmtree className="h-4 w-4 text-blue-500" />, label: "Wraparound Porch" },
      ],
      amenities: [
        { icon: <Sofa className="h-4 w-4 text-blue-500" />, label: "Vaulted Ceilings", category: "interior" },
        { icon: <Utensils className="h-4 w-4 text-blue-500" />, label: "Quartz Countertops", category: "interior" },
        { icon: <Armchair className="h-4 w-4 text-blue-500" />, label: "Walk-in Closets", category: "interior" },
        { icon: <Bath className="h-4 w-4 text-blue-500" />, label: "Spa-like Bathroom", category: "interior" },
        { icon: <Mountain className="h-4 w-4 text-blue-500" />, label: "Mountain Views", category: "exterior" },
        { icon: <Trees className="h-4 w-4 text-blue-500" />, label: "Landscaped Yard", category: "exterior" },
        { icon: <Palmtree className="h-4 w-4 text-blue-500" />, label: "Outdoor Living Space", category: "exterior" },
        { icon: <Leaf className="h-4 w-4 text-blue-500" />, label: "Hiking Trails Nearby", category: "community" },
        { icon: <ShoppingBag className="h-4 w-4 text-blue-500" />, label: "Shopping & Dining", category: "community" },
      ],
      nearbyPlaces: [
        { type: "park", name: "Boulder Mountain Park", distance: "0.3 miles" },
        { type: "restaurant", name: "Mountain View Bistro", distance: "1.5 miles", rating: 4.6 },
        { type: "shopping", name: "Pearl Street Mall", distance: "2.8 miles" },
      ],
      images: [
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Front View" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Great Room" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Kitchen" },
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Mountain Views" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Primary Suite" },
      ],
      agent: {
        id: "agent-3",
        name: "Emma Rodriguez",
        phone: "(303) 555-4321",
        email: "emma.rodriguez@realestate.com",
        photo: "/placeholder.svg?height=200&width=200",
        company: "Boulder Mountain Realty",
        rating: 4.9,
        reviewCount: 156,
        listings: 28,
      },
      createdAt: "2025-02-05T11:20:00Z",
      updatedAt: "2025-02-05T11:20:00Z",
      viewCount: 1567,
      favoriteCount: 112,
      isVerified: true,
      isPremium: true,
      tags: ["luxury", "mountain-views", "modern-farmhouse", "new-construction"],
      virtualTourUrl: "https://example.com/virtual-tour/res-house-3",
      parkingSpaces: 3,
      lotSize: {
        amount: 0.75,
        unit: "acre",
      },
      propertyTax: { amount: 9500, currency: "KES" },
      energyRating: "A+",
      constructionStatus: "ready",
      mountainView: true,
      garage: true,
    },

    // Residential Properties - Apartments/Condos
    {
      id: "res-apt-1",
      title: "Luxury Waterfront Condo with Panoramic Views",
      description:
        "Stunning waterfront condo with floor-to-ceiling windows offering panoramic views of the bay. This luxury unit features high-end finishes, an open floor plan, gourmet kitchen, and a private balcony. Building amenities include a fitness center, pool, and 24-hour concierge.",
      type: "condo",
      category: "residential",
      status: "for-sale",
      price: { amount: 1850000, currency: "KES" },
      priceHistory: [
        { date: "2024-11-15", price: { amount: 1950000, currency: "KES" }, event: "listed" },
        { date: "2025-01-10", price: { amount: 1850000, currency: "KES" }, event: "reduced" },
      ],
      location: {
        address: "200 Harbor Drive, Unit 3201",
        city: "San Diego",
        state: "CA",
        zipCode: "92101",
        country: "USA",
        coordinates: { latitude: 32.7157, longitude: -117.1611 },
        neighborhood: "Marina District",
      },
      bedrooms: 3,
      bathrooms: 3,
      area: {
        interior: 2100,
        unit: "sqft",
      },
      yearBuilt: 2019,
      features: [
        { icon: <Building className="h-4 w-4 text-blue-500" />, label: "Luxury Condo" },
        { icon: <Waves className="h-4 w-4 text-blue-500" />, label: "Waterfront" },
        { icon: <Maximize2 className="h-4 w-4 text-blue-500" />, label: "Floor-to-Ceiling Windows" },
        { icon: <Utensils className="h-4 w-4 text-blue-500" />, label: "Gourmet Kitchen" },
        { icon: <Armchair className="h-4 w-4 text-blue-500" />, label: "Private Balcony" },
        { icon: <Droplets className="h-4 w-4 text-blue-500" />, label: "Pool Access" },
      ],
      amenities: [
        { icon: <Sofa className="h-4 w-4 text-blue-500" />, label: "Hardwood Floors", category: "interior" },
        { icon: <Utensils className="h-4 w-4 text-blue-500" />, label: "Marble Countertops", category: "interior" },
        { icon: <Armchair className="h-4 w-4 text-blue-500" />, label: "Walk-in Closets", category: "interior" },
        { icon: <Waves className="h-4 w-4 text-blue-500" />, label: "Water Views", category: "interior" },
        { icon: <Droplets className="h-4 w-4 text-blue-500" />, label: "Swimming Pool", category: "community" },
        { icon: <Zap className="h-4 w-4 text-blue-500" />, label: "Fitness Center", category: "community" },
        { icon: <Sofa className="h-4 w-4 text-blue-500" />, label: "Resident Lounge", category: "community" },
        { icon: <Lock className="h-4 w-4 text-blue-500" />, label: "24-hour Concierge", category: "security" },
        { icon: <Lock className="h-4 w-4 text-blue-500" />, label: "Secure Access", category: "security" },
      ],
      nearbyPlaces: [
        { type: "restaurant", name: "Harbor Seafood Grill", distance: "0.1 miles", rating: 4.8 },
        { type: "shopping", name: "Seaport Village", distance: "0.3 miles" },
        { type: "park", name: "Waterfront Park", distance: "0.5 miles" },
      ],
      images: [
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Living Room with View" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Gourmet Kitchen" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Master Bedroom" },
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Building Exterior" },
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Pool Deck" },
      ],
      agent: {
        id: "agent-4",
        name: "David Kim",
        phone: "(619) 555-8765",
        email: "david.kim@realestate.com",
        photo: "/placeholder.svg?height=200&width=200",
        company: "Coastal Luxury Properties",
        rating: 4.9,
        reviewCount: 187,
        listings: 45,
      },
      createdAt: "2024-11-15T08:30:00Z",
      updatedAt: "2025-01-10T15:45:00Z",
      viewCount: 2345,
      favoriteCount: 178,
      isVerified: true,
      isFeatured: true,
      isPremium: true,
      isHotDeal: true,
      hotDealEnds: "2025-03-15T23:59:59Z",
      tags: ["luxury", "waterfront", "views", "concierge"],
      virtualTourUrl: "https://example.com/virtual-tour/res-apt-1",
      floorLevel: 32,
      totalFloors: 40,
      hoaFees: { amount: 950, currency: "KES" },
      energyRating: "A",
      constructionStatus: "ready",
      waterfront: true,
      cityView: true,
    },
    {
      id: "res-apt-2",
      title: "Modern Downtown Loft with City Views",
      description:
        "Stylish downtown loft in a converted historic building featuring exposed brick walls, high ceilings, and large windows with city views. This open concept space includes a modern kitchen, updated bathroom, and in-unit laundry. Building offers secure entry and rooftop deck.",
      type: "condo",
      category: "residential",
      status: "for-rent",
      price: { amount: 2800, currency: "KES" },
      location: {
        address: "315 Main Street, Unit 507",
        city: "Portland",
        state: "OR",
        zipCode: "97204",
        country: "USA",
        coordinates: { latitude: 45.5191, longitude: -122.6765 },
        neighborhood: "Pearl District",
      },
      bedrooms: 1,
      bathrooms: 1,
      area: {
        interior: 950,
        unit: "sqft",
      },
      yearBuilt: 1920,
      features: [
        { icon: <Building className="h-4 w-4 text-blue-500" />, label: "Historic Loft" },
        { icon: <Maximize2 className="h-4 w-4 text-blue-500" />, label: "High Ceilings" },
        { icon: <Sofa className="h-4 w-4 text-blue-500" />, label: "Exposed Brick" },
        { icon: <Utensils className="h-4 w-4 text-blue-500" />, label: "Modern Kitchen" },
        { icon: <Tv className="h-4 w-4 text-blue-500" />, label: "In-unit Laundry" },
        { icon: <Palmtree className="h-4 w-4 text-blue-500" />, label: "Rooftop Deck Access" },
      ],
      amenities: [
        { icon: <Sofa className="h-4 w-4 text-blue-500" />, label: "Concrete Floors", category: "interior" },
        { icon: <Utensils className="h-4 w-4 text-blue-500" />, label: "Stainless Appliances", category: "interior" },
        { icon: <Tv className="h-4 w-4 text-blue-500" />, label: "In-unit Laundry", category: "interior" },
        { icon: <Palmtree className="h-4 w-4 text-blue-500" />, label: "Rooftop Deck", category: "community" },
        { icon: <Wifi className="h-4 w-4 text-blue-500" />, label: "High-speed Internet", category: "community" },
        { icon: <Lock className="h-4 w-4 text-blue-500" />, label: "Secure Entry", category: "security" },
      ],
      nearbyPlaces: [
        { type: "restaurant", name: "Pearl Bistro", distance: "0.1 miles", rating: 4.7 },
        { type: "shopping", name: "Powell's Books", distance: "0.3 miles" },
        { type: "transport", name: "Streetcar Stop", distance: "0.2 miles" },
      ],
      images: [
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Living Area" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Kitchen" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Bedroom" },
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Building Exterior" },
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Rooftop Deck" },
      ],
      agent: {
        id: "agent-5",
        name: "Jessica Taylor",
        phone: "(503) 555-2468",
        email: "jessica.taylor@realestate.com",
        photo: "/placeholder.svg?height=200&width=200",
        company: "Urban Living Realty",
        rating: 4.7,
        reviewCount: 92,
        listings: 24,
      },
      createdAt: "2025-02-01T14:30:00Z",
      updatedAt: "2025-02-01T14:30:00Z",
      viewCount: 876,
      favoriteCount: 54,
      isVerified: true,
      isNewListing: true,
      tags: ["loft", "historic", "downtown", "open-concept"],
      floorLevel: 5,
      totalFloors: 8,
      availableFrom: "2025-03-01",
      leaseTerm: "12 months",
      petPolicy: "Cats allowed, no dogs",
      furnished: false,
      cityView: true,
    },

    // Commercial Properties
    {
      id: "com-office-1",
      title: "Premium Office Space in Downtown Business District",
      description:
        "Class A office space in a prime downtown location. This recently renovated space features modern finishes, open floor plan with private offices, conference room, kitchen area, and abundant natural light. Building amenities include secure access, elevator, and parking garage.",
      type: "commercial",
      category: "commercial",
      status: "for-rent",
      price: { amount: 35, currency: "KES" }, // per sqft/month
      location: {
        address: "555 Business Avenue, Suite 400",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "USA",
        coordinates: { latitude: 41.8781, longitude: -87.6298 },
        neighborhood: "The Loop",
      },
      bedrooms: 0,
      bathrooms: 2,
      area: {
        interior: 3500,
        unit: "sqft",
      },
      yearBuilt: 2005,
      features: [
        { icon: <Building className="h-4 w-4 text-blue-500" />, label: "Class A Office" },
        { icon: <Landmark className="h-4 w-4 text-blue-500" />, label: "Downtown Location" },
        { icon: <Maximize2 className="h-4 w-4 text-blue-500" />, label: "Open Floor Plan" },
        { icon: <Sofa className="h-4 w-4 text-blue-500" />, label: "Conference Room" },
        { icon: <ParkingSquare className="h-4 w-4 text-blue-500" />, label: "Parking Garage" },
        { icon: <Wifi className="h-4 w-4 text-blue-500" />, label: "High-speed Internet" },
      ],
      amenities: [
        { icon: <Sofa className="h-4 w-4 text-blue-500" />, label: "Modern Finishes", category: "interior" },
        { icon: <Utensils className="h-4 w-4 text-blue-500" />, label: "Kitchen Area", category: "interior" },
        { icon: <Wifi className="h-4 w-4 text-blue-500" />, label: "High-speed Internet", category: "interior" },
        { icon: <ParkingSquare className="h-4 w-4 text-blue-500" />, label: "Parking Garage", category: "community" },
        { icon: <Sofa className="h-4 w-4 text-blue-500" />, label: "Lobby Attendant", category: "community" },
        { icon: <Lock className="h-4 w-4 text-blue-500" />, label: "Secure Access", category: "security" },
        { icon: <Tv className="h-4 w-4 text-blue-500" />, label: "Security Cameras", category: "security" },
      ],
      nearbyPlaces: [
        { type: "restaurant", name: "Business Lunch Café", distance: "Ground Floor" },
        { type: "transport", name: "State Street Station", distance: "0.2 miles" },
        { type: "other", name: "Chicago River", distance: "0.3 miles" },
      ],
      images: [
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Main Office Area" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Conference Room" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Private Offices" },
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Building Exterior" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Reception Area" },
      ],
      agent: {
        id: "agent-6",
        name: "Robert Wilson",
        phone: "(312) 555-9876",
        email: "robert.wilson@realestate.com",
        photo: "/placeholder.svg?height=200&width=200",
        company: "Chicago Commercial Properties",
        rating: 4.8,
        reviewCount: 76,
        listings: 38,
      },
      createdAt: "2025-01-05T10:15:00Z",
      updatedAt: "2025-01-05T10:15:00Z",
      viewCount: 542,
      favoriteCount: 28,
      isVerified: true,
      isFeatured: true,
      tags: ["office", "downtown", "class-a", "renovated"],
      floorLevel: 4,
      totalFloors: 20,
      availableFrom: "2025-03-01",
      leaseTerm: "3-5 years",
      internetAvailability: "Fiber optic available",
    },
    {
      id: "com-retail-1",
      title: "Prime Retail Space in High-Traffic Shopping Center",
      description:
        "Excellent retail opportunity in a busy shopping center with high foot traffic. This corner unit features large display windows, open floor plan, storage room, and employee restroom. Center includes ample parking and is anchored by national retailers.",
      type: "commercial",
      category: "commercial",
      status: "for-rent",
      price: { amount: 28, currency: "KES" }, // per sqft/month
      location: {
        address: "789 Retail Plaza, Unit 12",
        city: "Austin",
        state: "TX",
        zipCode: "78704",
        country: "USA",
        coordinates: { latitude: 30.25, longitude: -97.75 },
        neighborhood: "South Lamar",
      },
      bedrooms: 0,
      bathrooms: 1,
      area: {
        interior: 2200,
        unit: "sqft",
      },
      yearBuilt: 2010,
      features: [
        { icon: <Building className="h-4 w-4 text-blue-500" />, label: "Retail Space" },
        { icon: <ShoppingBag className="h-4 w-4 text-blue-500" />, label: "Shopping Center" },
        { icon: <Maximize2 className="h-4 w-4 text-blue-500" />, label: "Corner Unit" },
        { icon: <Sofa className="h-4 w-4 text-blue-500" />, label: "Display Windows" },
        { icon: <ParkingSquare className="h-4 w-4 text-blue-500" />, label: "Ample Parking" },
        { icon: <Warehouse className="h-4 w-4 text-blue-500" />, label: "Storage Room" },
      ],
      amenities: [
        { icon: <Maximize2 className="h-4 w-4 text-blue-500" />, label: "High Ceilings", category: "interior" },
        { icon: <Warehouse className="h-4 w-4 text-blue-500" />, label: "Storage Room", category: "interior" },
        { icon: <ParkingSquare className="h-4 w-4 text-blue-500" />, label: "Customer Parking", category: "community" },
        { icon: <ShoppingBag className="h-4 w-4 text-blue-500" />, label: "National Anchors", category: "community" },
        { icon: <Tv className="h-4 w-4 text-blue-500" />, label: "Security Cameras", category: "security" },
      ],
      nearbyPlaces: [
        { type: "restaurant", name: "Food Court", distance: "In complex" },
        { type: "shopping", name: "National Department Store", distance: "Anchor tenant" },
        { type: "transport", name: "Bus Stop", distance: "0.1 miles" },
      ],
      images: [
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Storefront" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Retail Floor" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Storage Area" },
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Shopping Center" },
      ],
      agent: {
        id: "agent-7",
        name: "Amanda Lopez",
        phone: "(512) 555-3456",
        email: "amanda.lopez@realestate.com",
        photo: "/placeholder.svg?height=200&width=200",
        company: "Austin Commercial",
        rating: 4.6,
        reviewCount: 58,
        listings: 22,
      },
      createdAt: "2025-01-20T09:45:00Z",
      updatedAt: "2025-01-20T09:45:00Z",
      viewCount: 387,
      favoriteCount: 19,
      isVerified: true,
      isHotDeal: true,
      hotDealEnds: "2025-03-20T23:59:59Z",
      tags: ["retail", "shopping-center", "high-traffic", "corner-unit"],
      availableFrom: "2025-04-01",
      leaseTerm: "3-5 years",
    },

    // Land Properties
    {
      id: "land-res-1",
      title: "Residential Development Land with Ocean Views",
      description:
        "Prime residential development opportunity with stunning ocean views. This 5-acre parcel is zoned for residential development and has been preliminarily approved for 12 single-family homes. Utilities available at the street. Perfect for developers or investors.",
      type: "land",
      category: "land",
      status: "for-sale",
      price: { amount: 2500000, currency: "KES" },
      location: {
        address: "Ocean View Road",
        city: "Santa Barbara",
        state: "CA",
        zipCode: "93109",
        country: "USA",
        coordinates: { latitude: 34.4208, longitude: -119.6982 },
        neighborhood: "Mesa",
      },
      bedrooms: 0,
      bathrooms: 0,
      area: {
        interior: 0,
        exterior: 217800, // 5 acres in sqft
        unit: "sqft",
      },
      yearBuilt: 0,
      features: [
        { icon: <Mountain className="h-4 w-4 text-blue-500" />, label: "Ocean Views" },
        { icon: <Ruler className="h-4 w-4 text-blue-500" />, label: "5 Acres" },
        { icon: <Home className="h-4 w-4 text-blue-500" />, label: "Residential Zoning" },
        { icon: <Compass className="h-4 w-4 text-blue-500" />, label: "Preliminary Approval" },
        { icon: <Lightbulb className="h-4 w-4 text-blue-500" />, label: "Utilities Available" },
      ],
      amenities: [
        { icon: <Mountain className="h-4 w-4 text-blue-500" />, label: "Ocean Views", category: "exterior" },
        { icon: <Lightbulb className="h-4 w-4 text-blue-500" />, label: "Electricity Available", category: "exterior" },
        { icon: <Droplets className="h-4 w-4 text-blue-500" />, label: "Water Available", category: "exterior" },
      ],
      nearbyPlaces: [
        { type: "park", name: "Mesa Park", distance: "0.5 miles" },
        { type: "school", name: "Mesa Elementary", distance: "1.2 miles" },
        { type: "shopping", name: "Mesa Shopping Center", distance: "1.5 miles" },
      ],
      images: [
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Property View" },
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Ocean View" },
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Street Access" },
        { url: "/placeholder.svg?height=600&width=800", type: "other", caption: "Preliminary Site Plan" },
      ],
      agent: {
        id: "agent-8",
        name: "Thomas Greene",
        phone: "(805) 555-7890",
        email: "thomas.greene@realestate.com",
        photo: "/placeholder.svg?height=200&width=200",
        company: "Coastal Land Specialists",
        rating: 4.9,
        reviewCount: 42,
        listings: 15,
      },
      createdAt: "2025-01-15T13:30:00Z",
      updatedAt: "2025-01-15T13:30:00Z",
      viewCount: 678,
      favoriteCount: 45,
      isVerified: true,
      isPremium: true,
      tags: ["development", "ocean-view", "residential-zoning", "investment"],
      lotSize: {
        amount: 5,
        unit: "acre",
      },
      waterfront: true,
    },
    {
      id: "land-com-1",
      title: "Commercial Development Opportunity in Growing Area",
      description:
        "Excellent commercial development opportunity in rapidly growing area. This 2.5-acre parcel is zoned for mixed-use commercial development. Located at a busy intersection with high visibility and traffic counts. All utilities available.",
      type: "land",
      category: "land",
      status: "for-sale",
      price: { amount: 1800000, currency: "KES" },
      location: {
        address: "1200 Commerce Boulevard",
        city: "Nashville",
        state: "TN",
        zipCode: "37211",
        country: "USA",
        coordinates: { latitude: 36.1627, longitude: -86.7816 },
        neighborhood: "Brentwood",
      },
      bedrooms: 0,
      bathrooms: 0,
      area: {
        interior: 0,
        exterior: 108900, // 2.5 acres in sqft
        unit: "sqft",
      },
      yearBuilt: 0,
      features: [
        { icon: <Briefcase className="h-4 w-4 text-blue-500" />, label: "Commercial Zoning" },
        { icon: <Ruler className="h-4 w-4 text-blue-500" />, label: "2.5 Acres" },
        { icon: <Compass className="h-4 w-4 text-blue-500" />, label: "Corner Lot" },
        { icon: <Lightbulb className="h-4 w-4 text-blue-500" />, label: "Utilities Available" },
        { icon: <Landmark className="h-4 w-4 text-blue-500" />, label: "High Visibility" },
      ],
      amenities: [
        { icon: <Lightbulb className="h-4 w-4 text-blue-500" />, label: "All Utilities", category: "exterior" },
        { icon: <Bus className="h-4 w-4 text-blue-500" />, label: "Public Transportation", category: "community" },
      ],
      nearbyPlaces: [
        { type: "shopping", name: "Brentwood Mall", distance: "0.8 miles" },
        { type: "restaurant", name: "Restaurant Row", distance: "1.0 miles" },
        { type: "transport", name: "Interstate Access", distance: "0.3 miles" },
      ],
      images: [
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Property View" },
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Street View" },
        { url: "/placeholder.svg?height=600&width=800", type: "other", caption: "Zoning Map" },
        { url: "/placeholder.svg?height=600&width=800", type: "other", caption: "Aerial View" },
      ],
      agent: {
        id: "agent-9",
        name: "Brian Mitchell",
        phone: "(615) 555-2345",
        email: "brian.mitchell@realestate.com",
        photo: "/placeholder.svg?height=200&width=200",
        company: "Nashville Commercial Real Estate",
        rating: 4.7,
        reviewCount: 38,
        listings: 24,
      },
      createdAt: "2025-02-10T11:00:00Z",
      updatedAt: "2025-02-10T11:00:00Z",
      viewCount: 456,
      favoriteCount: 32,
      isVerified: true,
      isNewListing: true,
      tags: ["commercial", "development", "corner-lot", "high-traffic"],
      lotSize: {
        amount: 2.5,
        unit: "acre",
      },
    },

    // Industrial Properties
    {
      id: "ind-warehouse-1",
      title: "Modern Distribution Warehouse with Loading Docks",
      description:
        "State-of-the-art distribution warehouse with multiple loading docks, high ceilings, and office space. This facility features a clear span design, LED lighting, ESFR sprinkler system, and ample truck parking. Excellent location near major highways for easy distribution access.",
      type: "industrial",
      category: "industrial",
      status: "for-rent",
      price: { amount: 8.5, currency: "KES" }, // per sqft/month
      location: {
        address: "1500 Industrial Parkway",
        city: "Atlanta",
        state: "GA",
        zipCode: "30318",
        country: "USA",
        coordinates: { latitude: 33.749, longitude: -84.388 },
        neighborhood: "Industrial District",
      },
      bedrooms: 0,
      bathrooms: 4,
      area: {
        interior: 50000,
        exterior: 120000,
        unit: "sqft",
      },
      yearBuilt: 2020,
      features: [
        { icon: <Warehouse className="h-4 w-4 text-blue-500" />, label: "Distribution Warehouse" },
        { icon: <Truck className="h-4 w-4 text-blue-500" />, label: "Loading Docks" },
        { icon: <Maximize2 className="h-4 w-4 text-blue-500" />, label: "32' Clear Height" },
        { icon: <Sofa className="h-4 w-4 text-blue-500" />, label: "Office Space" },
        { icon: <ParkingSquare className="h-4 w-4 text-blue-500" />, label: "Truck Parking" },
        { icon: <Lightbulb className="h-4 w-4 text-blue-500" />, label: "LED Lighting" },
      ],
      amenities: [
        { icon: <Maximize2 className="h-4 w-4 text-blue-500" />, label: "High Ceilings", category: "interior" },
        { icon: <Sofa className="h-4 w-4 text-blue-500" />, label: "Office Space", category: "interior" },
        { icon: <Truck className="h-4 w-4 text-blue-500" />, label: "Loading Docks", category: "exterior" },
        { icon: <ParkingSquare className="h-4 w-4 text-blue-500" />, label: "Truck Court", category: "exterior" },
        { icon: <Lock className="h-4 w-4 text-blue-500" />, label: "Secure Fencing", category: "security" },
      ],
      nearbyPlaces: [
        { type: "transport", name: "Interstate 85", distance: "0.5 miles" },
        { type: "transport", name: "Interstate 20", distance: "1.2 miles" },
      ],
      images: [
        { url: "/placeholder.svg?height=600&width=800", type: "exterior", caption: "Warehouse Exterior" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Warehouse Interior" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Loading Area" },
        { url: "/placeholder.svg?height=600&width=800", type: "interior", caption: "Office Space" },
      ],
      agent: {
        id: "agent-10",
        name: "Patricia Johnson",
        phone: "(404) 555-6789",
        email: "patricia.johnson@realestate.com",
        photo: "/placeholder.svg?height=200&width=200",
        company: "Atlanta Industrial Properties",
        rating: 4.8,
        reviewCount: 52,
        listings: 31,
      },
      createdAt: "2025-01-25T09:00:00Z",
      updatedAt: "2025-01-25T09:00:00Z",
      viewCount: 345,
      favoriteCount: 18,
      isVerified: true,
      isFeatured: true,
      tags: ["warehouse", "distribution", "loading-docks", "modern"],
      availableFrom: "2025-04-01",
      leaseTerm: "3-10 years",
      lotSize: {
        amount: 2.75,
        unit: "acre",
      },
    },
  ]

  // Initialize properties
  useEffect(() => {
    setProperties(mockProperties)
    setFilteredProperties(mockProperties.slice(0, ITEMS_PER_PAGE))
    setIsLoading(false)
  }, [])

  // Filter properties based on search, category, and other filters
  useEffect(() => {
    let result = [...properties]

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (property) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter((property) => property.category === activeCategory)
    }

    // Filter by property type
    if (propertyTypeFilter) {
      result = result.filter((property) => property.type === propertyTypeFilter)
    }

    // Filter by bedrooms
    if (bedroomsFilter !== null) {
      result = result.filter((property) => property.bedrooms >= bedroomsFilter)
    }

    // Filter by bathrooms
    if (bathroomsFilter !== null) {
      result = result.filter((property) => property.bathrooms >= bathroomsFilter)
    }

    // Filter by price range
    result = result.filter((property) => {
      return property.price.amount >= priceRange.min && property.price.amount <= priceRange.max
    })

    // Sort properties
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price.amount - b.price.amount)
        break
      case "price-high":
        result.sort((a, b) => b.price.amount - a.price.amount)
        break
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "bedrooms":
        result.sort((a, b) => b.bedrooms - a.bedrooms)
        break
      case "size":
        result.sort((a, b) => b.area.interior - a.area.interior)
        break
      default: // featured
        result.sort((a, b) => {
          if (a.isPremium && !b.isPremium) return -1
          if (!a.isPremium && b.isPremium) return 1
          if (a.isFeatured && !b.isFeatured) return -1
          if (!a.isFeatured && b.isFeatured) return 1
          if (a.isHotDeal && !b.isHotDeal) return -1
          if (!a.isHotDeal && b.isHotDeal) return 1
          return 0
        })
    }

    // Reset page when filters change
    setPage(1)
    setFilteredProperties(result.slice(0, ITEMS_PER_PAGE))
    setHasMore(result.length > ITEMS_PER_PAGE)
  }, [
    properties,
    searchQuery,
    activeCategory,
    sortOption,
    priceRange,
    bedroomsFilter,
    bathroomsFilter,
    propertyTypeFilter,
  ])

  // Load more properties for infinite scrolling
  const loadMoreProperties = useCallback(() => {
    if (!isLoading && hasMore) {
      setIsLoading(true)

      // Simulate API call delay
      setTimeout(() => {
        let result = [...properties]

        // Apply all filters
        if (searchQuery) {
          result = result.filter(
            (property) =>
              property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              property.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
              property.location.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
              property.type.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        }

        if (activeCategory !== "all") {
          result = result.filter((property) => property.category === activeCategory)
        }

        if (propertyTypeFilter) {
          result = result.filter((property) => property.type === propertyTypeFilter)
        }

        if (bedroomsFilter !== null) {
          result = result.filter((property) => property.bedrooms >= bedroomsFilter)
        }

        if (bathroomsFilter !== null) {
          result = result.filter((property) => property.bathrooms >= bathroomsFilter)
        }

        result = result.filter((property) => {
          return property.price.amount >= priceRange.min && property.price.amount <= priceRange.max
        })

        // Apply sorting
        switch (sortOption) {
          case "price-low":
            result.sort((a, b) => a.price.amount - b.price.amount)
            break
          case "price-high":
            result.sort((a, b) => b.price.amount - a.price.amount)
            break
          case "newest":
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            break
          case "oldest":
            result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            break
          case "bedrooms":
            result.sort((a, b) => b.bedrooms - a.bedrooms)
            break
          case "size":
            result.sort((a, b) => b.area.interior - a.area.interior)
            break
          default: // featured
            result.sort((a, b) => {
              if (a.isPremium && !b.isPremium) return -1
              if (!a.isPremium && b.isPremium) return 1
              if (a.isFeatured && !b.isFeatured) return -1
              if (!a.isFeatured && b.isFeatured) return 1
              if (a.isHotDeal && !b.isHotDeal) return -1
              if (!a.isHotDeal && b.isHotDeal) return 1
              return 0
            })
        }

        const nextPage = page + 1
        const startIndex = (nextPage - 1) * ITEMS_PER_PAGE
        const endIndex = startIndex + ITEMS_PER_PAGE
        const newItems = result.slice(startIndex, endIndex)

        setFilteredProperties((prev) => [...prev, ...newItems])
        setHasMore(endIndex < result.length)
        setPage(nextPage)
        setIsLoading(false)
      }, 800) // Simulate loading delay
    }
  }, [
    isLoading,
    hasMore,
    properties,
    searchQuery,
    activeCategory,
    propertyTypeFilter,
    bedroomsFilter,
    bathroomsFilter,
    priceRange,
    sortOption,
    page,
  ])

  // Infinite scrolling
  const lastPropertyElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProperties()
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoading, hasMore, loadMoreProperties],
  )

  // Handle category change
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    setPropertyTypeFilter(null)
    setPage(1)
  }

  // View property details
  const viewPropertyDetails = (property: Property) => {
    setSelectedProperty(property)
  }

  // Get featured properties
  const featuredProperties = useMemo(() => {
    return properties.filter((property) => property.isFeatured).slice(0, 3)
  }, [properties])

  // Get hot deals
  const hotDeals = useMemo(() => {
    return properties.filter((property) => property.isHotDeal).slice(0, 4)
  }, [properties])

  // Get new listings
  const newListings = useMemo(() => {
    return properties.filter((property) => property.isNewListing).slice(0, 4)
  }, [properties])

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setActiveCategory("all")
    setPriceRange({ min: 0, max: 5000000 })
    setBedroomsFilter(null)
    setBathroomsFilter(null)
    setPropertyTypeFilter(null)
    setSortOption("featured")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-16 md:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-400 rounded-full filter blur-3xl opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Find Your Perfect Property
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-blue-100 mb-8"
            >
              Discover residential, commercial, and investment properties tailored to your needs
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search by location, property type, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 py-6 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800"
                  />
                </div>

                <Select value={activeCategory} onValueChange={handleCategoryClick}>
                  <SelectTrigger className="w-full md:w-48 py-6 rounded-lg">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="py-6 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* New Listing Alert */}
      {showNewAlert && (
        <div className="container mx-auto px-4 mt-8">
          <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800 animate-fadeIn">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
              <AlertTitle className="text-blue-700 dark:text-blue-400">New Premium Listings Available!</AlertTitle>
            </div>
            <AlertDescription className="text-blue-600 dark:text-blue-300">
              We've just added several new premium properties to our listings. Check them out before they're gone!
            </AlertDescription>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30"
              onClick={() => setShowNewAlert(false)}
            >
              Dismiss
            </Button>
          </Alert>
        </div>
      )}

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Featured Properties</h2>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <FeaturedPropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      )}

      {/* Hot Deals */}
      {hotDeals.length > 0 && (
        <div className="container mx-auto px-4 py-12 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 rounded-3xl my-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Flame className="h-6 w-6 text-red-500 mr-2" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Hot Deals</h2>
            </div>
            <Button
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              View All Deals
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotDeals.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                onClick={() => viewPropertyDetails(property)}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={property.images[0].url || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <HotDealBadge />

                  {property.hotDealEnds && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 flex items-center justify-between">
                      <span className="text-white text-xs">Deal Ends:</span>
                      <CountdownTimer targetDate={property.hotDealEnds} />
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>

                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1 text-red-500" />
                    <span className="line-clamp-1">
                      {property.location.city}, {property.location.state}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-red-600 dark:text-red-400">
                      {formatPrice(property.price)}
                      {property.status === "for-rent" && <span className="text-xs font-normal">/mo</span>}
                    </span>
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                      {property.status === "for-sale" ? "For Sale" : "For Rent"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* New Listings */}
      {newListings.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Sparkles className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">New Listings</h2>
            </div>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              View All New Listings
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newListings.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                onClick={() => viewPropertyDetails(property)}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={property.images[0].url || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <NewListingBadge />
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>

                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                    <span className="line-clamp-1">
                      {property.location.city}, {property.location.state}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                      {formatPrice(property.price)}
                      {property.status === "for-rent" && <span className="text-xs font-normal">/mo</span>}
                    </span>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {property.status === "for-sale" ? "For Sale" : "For Rent"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4">
            <div className="sticky top-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Reset All
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="mb-6">
                <h4 className="font-medium mb-3">Property Type</h4>
                <RadioGroup value={activeCategory} onValueChange={handleCategoryClick} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All Properties</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="residential" id="residential" />
                    <Label htmlFor="residential">Residential</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="commercial" id="commercial" />
                    <Label htmlFor="commercial">Commercial</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="industrial" id="industrial" />
                    <Label htmlFor="industrial">Industrial</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="land" id="land" />
                    <Label htmlFor="land">Land</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator className="my-4" />

              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">KSh {priceRange.min.toLocaleString()}</span>
                  <span className="text-sm">KSh {priceRange.max.toLocaleString()}</span>
                </div>
                <Slider
                  defaultValue={[priceRange.max]}
                  max={5000000}
                  step={50000}
                  onValueChange={(values) => setPriceRange((prev) => ({ ...prev, max: values[0] }))}
                  className="mb-6"
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={priceRange.max}
                    value={priceRange.min}
                    onChange={(e) => setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) }))}
                    className="w-full"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    min={priceRange.min}
                    max={5000000}
                    value={priceRange.max}
                    onChange={(e) => setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="mb-6">
                <h4 className="font-medium mb-3">Bedrooms</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={bedroomsFilter === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBedroomsFilter(null)}
                    className={bedroomsFilter === null ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    Any
                  </Button>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Button
                      key={num}
                      variant={bedroomsFilter === num ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBedroomsFilter(num)}
                      className={bedroomsFilter === num ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      {num}+
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="mb-6">
                <h4 className="font-medium mb-3">Bathrooms</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={bathroomsFilter === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBathroomsFilter(null)}
                    className={bathroomsFilter === null ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    Any
                  </Button>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Button
                      key={num}
                      variant={bathroomsFilter === num ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBathroomsFilter(num)}
                      className={bathroomsFilter === num ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      {num}+
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="mb-6">
                <h4 className="font-medium mb-3">Property Features</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pool" />
                    <Label htmlFor="pool">Swimming Pool</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="garage" />
                    <Label htmlFor="garage">Garage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="garden" />
                    <Label htmlFor="garden">Garden</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="waterfront" />
                    <Label htmlFor="waterfront">Waterfront</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="view" />
                    <Label htmlFor="view">Mountain/City View</Label>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="mb-6">
                <h4 className="font-medium mb-3">Sort By</h4>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort properties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="bedrooms">Most Bedrooms</SelectItem>
                    <SelectItem value="size">Largest Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Apply Filters</Button>
            </div>
          </div>

          {/* Main Properties Area */}
          <div className="w-full lg:w-3/4">
            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by location, property type, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2 lg:hidden"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showMobileFilters ? "rotate-180" : ""}`} />
              </Button>
            </div>

            {/* Mobile Filters */}
            {showMobileFilters && (
              <div className="lg:hidden mb-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Property Type</h4>
                    <Select value={activeCategory} onValueChange={handleCategoryClick}>
                      <SelectTrigger>
                        <SelectValue placeholder="Property Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Properties</SelectItem>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Sort By</h4>
                    <Select value={sortOption} onValueChange={setSortOption}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort properties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="newest">Newest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Price Range</h4>
                  <Slider
                    defaultValue={[priceRange.max]}
                    max={5000000}
                    step={50000}
                    onValueChange={(values) => setPriceRange((prev) => ({ ...prev, max: values[0] }))}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm">KSh {priceRange.min.toLocaleString()}</span>
                    <span className="text-sm">KSh {priceRange.max.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Bedrooms</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={bedroomsFilter === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBedroomsFilter(null)}
                      className={bedroomsFilter === null ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      Any
                    </Button>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Button
                        key={num}
                        variant={bedroomsFilter === num ? "default" : "outline"}
                        size="sm"
                        onClick={() => setBedroomsFilter(num)}
                        className={bedroomsFilter === num ? "bg-blue-600 hover:bg-blue-700" : ""}
                      >
                        {num}+
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetFilters}
                    className="text-blue-600 dark:text-blue-400"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Category Tabs */}
            <Tabs defaultValue="all" value={activeCategory} onValueChange={handleCategoryClick} className="mb-8">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">All</span>
                </TabsTrigger>
                <TabsTrigger value="residential" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Residential</span>
                </TabsTrigger>
                <TabsTrigger value="commercial" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span className="hidden sm:inline">Commercial</span>
                </TabsTrigger>
                <TabsTrigger value="industrial" className="flex items-center gap-2">
                  <Warehouse className="h-4 w-4" />
                  <span className="hidden sm:inline">Industrial</span>
                </TabsTrigger>
                <TabsTrigger value="land" className="flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  <span className="hidden sm:inline">Land</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">All Properties</h2>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <span>{filteredProperties.length} properties found</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property, index) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      index={index}
                      isLastElement={index === filteredProperties.length - 1}
                      onViewDetails={viewPropertyDetails}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="residential" className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Residential Properties</h2>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    <span>{filteredProperties.length} properties found</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property, index) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      index={index}
                      isLastElement={index === filteredProperties.length - 1}
                      onViewDetails={viewPropertyDetails}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="commercial" className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Commercial Properties</h2>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    <span>{filteredProperties.length} properties found</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property, index) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      index={index}
                      isLastElement={index === filteredProperties.length - 1}
                      onViewDetails={viewPropertyDetails}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="industrial" className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Industrial Properties</h2>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Warehouse className="h-4 w-4" />
                    <span>{filteredProperties.length} properties found</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property, index) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      index={index}
                      isLastElement={index === filteredProperties.length - 1}
                      onViewDetails={viewPropertyDetails}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="land" className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Land Properties</h2>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Ruler className="h-4 w-4" />
                    <span>{filteredProperties.length} properties found</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property, index) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      index={index}
                      isLastElement={index === filteredProperties.length - 1}
                      onViewDetails={viewPropertyDetails}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center my-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* No Results */}
            {filteredProperties.length === 0 && !isLoading && (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
                <Button onClick={resetFilters} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 py-16 my-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Choose Our Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Advanced Search</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Find exactly what you're looking for with our powerful search and filtering options
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <BadgePercent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Exclusive Deals</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Access special offers and hot deals you won't find anywhere else
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Verified Listings</h3>
              <p className="text-gray-500 dark:text-gray-400">
                All our properties are verified to ensure accuracy and quality
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Connect with experienced agents who can guide you through the process
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="container mx-auto px-4 py-12 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated on New Properties</h2>
            <p className="mb-6 text-blue-100">
              Subscribe to our newsletter to receive the latest property listings and market insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Button className="bg-white text-blue-600 hover:bg-white/90 transition-transform hover:scale-105">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out forwards;
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

