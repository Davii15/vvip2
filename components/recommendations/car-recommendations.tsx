"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Car,
  Calendar,
  TrendingUp,
  ArrowRight,
  BadgePercent,
  Users,
  Truck,
  Settings,
  Fuel,
  Milestone,
  Cog,
  Sparkles,
  Wrench,
  Gauge,
  MapPin,
  Tag,
  User,
  Briefcase,
  Heart,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
interface CarProduct {
  id: string
  name: string
  make: string
  model: string
  year: number
  imageUrl: string
  category: string
  subcategory: string
  currentPrice: number
  originalPrice: number
  description: string
  features: string[]
  specifications: {
    engine?: string
    transmission?: string
    mileage?: string
    fuelType?: string
    bodyType?: string
    color?: string
    seats?: number
    driveType?: string
  }
  condition: "New" | "Used" | "Certified Pre-Owned"
  location: string
  dealerName: string
  rating?: number
  reviewCount?: number
  isNew: boolean
  isTrending: boolean
  isMostPreferred: boolean
  isLimitedTime: boolean
  expiresAt?: string
  discount?: number
  dateAdded: string
  availability: number
  financingAvailable: boolean
  warrantyIncluded: boolean
  tags: string[]
}

interface CarRecommendationsProps {
  products: CarProduct[]
  colorScheme?: string
}

// Helper function to format price
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount)
}

// Get current month and season
const getCurrentMonth = () => {
  const date = new Date()
  return date.getMonth() // 0-11
}

const getCurrentSeason = () => {
  const month = getCurrentMonth()
  // Seasons in Kenya
  if (month >= 2 && month <= 5) return "Long Rains" // Mar-Jun
  if (month >= 6 && month <= 9) return "Cool Dry" // Jul-Oct
  if (month >= 10 || month <= 1) return "Short Rains" // Nov-Feb
  return "Transition"
}

// Car recommendations by month/season
const getMonthlyRecommendations = (month: number) => {
  const recommendations = {
    // Long Rains (March-June)
    2: { focus: "Rainy Season Vehicles", categories: ["SUV", "4x4", "All-Wheel Drive"], icon: <Truck /> },
    3: { focus: "Rainy Season Vehicles", categories: ["SUV", "4x4", "All-Wheel Drive"], icon: <Truck /> },
    4: { focus: "Rainy Season Vehicles", categories: ["SUV", "4x4", "All-Wheel Drive"], icon: <Truck /> },
    5: { focus: "Rainy Season Vehicles", categories: ["SUV", "4x4", "All-Wheel Drive"], icon: <Truck /> },

    // Cool Dry (July-October)
    6: { focus: "Fuel Efficient Vehicles", categories: ["Sedan", "Hatchback", "Hybrid"], icon: <Fuel /> },
    7: { focus: "Fuel Efficient Vehicles", categories: ["Sedan", "Hatchback", "Hybrid"], icon: <Fuel /> },
    8: { focus: "Fuel Efficient Vehicles", categories: ["Sedan", "Hatchback", "Hybrid"], icon: <Fuel /> },
    9: { focus: "Fuel Efficient Vehicles", categories: ["Sedan", "Hatchback", "Hybrid"], icon: <Fuel /> },

    // Short Rains (November-February)
    10: { focus: "End-Year Deals", categories: ["Luxury", "New Cars", "SUV"], icon: <Sparkles /> },
    11: { focus: "End-Year Deals", categories: ["Luxury", "New Cars", "SUV"], icon: <Sparkles /> },
    0: { focus: "New Year Models", categories: ["New Cars", "Electric", "Hybrid"], icon: <Car /> },
    1: { focus: "New Year Models", categories: ["New Cars", "Electric", "Hybrid"], icon: <Car /> },
  }

  return recommendations[month as keyof typeof recommendations]
}

// Most searched car parts by month
const getPopularCarParts = (month: number) => {
  const popularParts = {
    // Long Rains (March-June)
    2: ["Windshield Wipers", "Brake Pads", "Tires", "Floor Mats"],
    3: ["Windshield Wipers", "Brake Pads", "Tires", "Floor Mats"],
    4: ["Windshield Wipers", "Brake Pads", "Tires", "Floor Mats"],
    5: ["Windshield Wipers", "Brake Pads", "Tires", "Floor Mats"],

    // Cool Dry (July-October)
    6: ["Air Filters", "Oil Filters", "Car Audio Systems", "Performance Parts"],
    7: ["Air Filters", "Oil Filters", "Car Audio Systems", "Performance Parts"],
    8: ["Air Filters", "Oil Filters", "Car Audio Systems", "Performance Parts"],
    9: ["Air Filters", "Oil Filters", "Car Audio Systems", "Performance Parts"],

    // Short Rains (November-February)
    10: ["Car Covers", "Seat Covers", "Lighting", "Security Systems"],
    11: ["Car Covers", "Seat Covers", "Lighting", "Security Systems"],
    0: ["Car Detailing Products", "Battery Chargers", "Dash Cams", "Phone Mounts"],
    1: ["Car Detailing Products", "Battery Chargers", "Dash Cams", "Phone Mounts"],
  }

  return popularParts[month as keyof typeof popularParts]
}

// User profiles for car recommendations
const userProfiles = {
  families: {
    title: "For Families",
    icon: <Users className="h-5 w-5" />,
    description: "Spacious and safe vehicles for your loved ones",
    categories: ["SUV", "Minivan", "Station Wagon"],
    minSeats: 5,
    features: ["Safety", "Space", "Comfort"],
  },
  professionals: {
    title: "For Professionals",
    icon: <Briefcase className="h-5 w-5" />,
    description: "Elegant and reliable vehicles for your career journey",
    categories: ["Sedan", "Luxury", "Executive"],
    features: ["Comfort", "Technology", "Status"],
  },
  adventurers: {
    title: "For Adventurers",
    icon: <Truck className="h-5 w-5" />,
    description: "Rugged and capable vehicles for your explorations",
    categories: ["SUV", "4x4", "Pickup"],
    features: ["Off-Road", "Durability", "Adventure"],
  },
  firstTimers: {
    title: "For First-Time Buyers",
    icon: <User className="h-5 w-5" />,
    description: "Affordable and easy-to-maintain vehicles to start your journey",
    categories: ["Hatchback", "Compact", "Economy"],
    priceMax: 1500000,
    features: ["Economy", "Reliability", "Low Maintenance"],
  },
}

export default function CarRecommendations({ products, colorScheme = "indigo" }: CarRecommendationsProps) {
  const [currentMonth] = useState(getCurrentMonth())
  const [currentSeason] = useState(getCurrentSeason())
  const [activeTab, setActiveTab] = useState("seasonal")

  // Get monthly recommendations
  const monthlyRec = getMonthlyRecommendations(currentMonth)

  // Filter products based on current month's focus
  const seasonalRecommendations = products
    .filter(
      (product) =>
        monthlyRec.categories.some(
          (category) => product.subcategory.includes(category) || product.tags.some((tag) => tag.includes(category)),
        ) ||
        product.isTrending ||
        product.isMostPreferred,
    )
    .sort((a, b) => {
      // Prioritize trending and preferred products
      if (a.isTrending && !b.isTrending) return -1
      if (!a.isTrending && b.isTrending) return 1
      if (a.isMostPreferred && !b.isMostPreferred) return -1
      if (!a.isMostPreferred && b.isMostPreferred) return 1

      // Then sort by discount
      return (b.discount || 0) - (a.discount || 0)
    })
    .slice(0, 6)

  // Filter products for each user profile
  const profileRecommendations = Object.entries(userProfiles).reduce(
    (acc, [key, profile]) => {
      const filtered = products
        .filter(
          (product) =>
            profile.categories.some(
              (category) =>
                product.subcategory.includes(category) || product.tags.some((tag) => tag.includes(category)),
            ) &&
        //    (!profile.minSeats || (product.specifications.seats && product.specifications.seats >= profile.minSeats)) &&
          //  (!profile.priceMax || product.currentPrice <= profile.priceMax) &&
            (!profile.features ||
              profile.features.some((feature) =>
                product.tags.some((tag) => tag.toLowerCase().includes(feature.toLowerCase())),
              )),
        )
        .sort((a, b) => {
          // Sort by relevance to the profile
          if (a.isMostPreferred && !b.isMostPreferred) return -1
          if (!a.isMostPreferred && b.isMostPreferred) return 1
          return (b.discount || 0) - (a.discount || 0)
        })
        .slice(0, 3)

      return { ...acc, [key]: filtered }
    },
    {} as Record<string, CarProduct[]>,
  )

  // Get popular car parts for the current month
  const popularParts = getPopularCarParts(currentMonth)

  // Get month name
  const getMonthName = (month: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months[month]
  }

  // Get next month
  const getNextMonth = () => {
    return (currentMonth + 1) % 12
  }

  // Get next month's recommendations
  const nextMonthRec = getMonthlyRecommendations(getNextMonth())

  return (
    <div className="my-12">
      <div className={`mb-8 bg-gradient-to-r from-${colorScheme}-900 to-${colorScheme}-700 p-6 rounded-xl text-white`}>
        <div className="flex items-center mb-4">
          <Car className="h-6 w-6 mr-2" />
          <h2 className="text-2xl font-bold">Automotive Recommendations</h2>
        </div>
        <p className="text-lg">
          Discover the best vehicles and parts for {getMonthName(currentMonth)} - {currentSeason}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="seasonal" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Seasonal Picks</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>By Driver Profile</span>
          </TabsTrigger>
          <TabsTrigger value="parts" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Popular Parts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="seasonal">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              {monthlyRec.icon}
              <h3 className="text-xl font-semibold ml-2">
                Best for {getMonthName(currentMonth)} - {monthlyRec.focus}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seasonalRecommendations.map((product) => (
                <CarProductCard key={product.id} product={product} colorScheme={colorScheme} />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center mb-4">
              <Calendar className={`h-5 w-5 mr-2 text-${colorScheme}-600`} />
              <h3 className="text-xl font-semibold">
                Coming Next Month: {getMonthName(getNextMonth())} - {nextMonthRec.focus}
              </h3>
            </div>

            <Card className={`border-${colorScheme}-200 bg-${colorScheme}-50`}>
              <CardHeader>
                <CardTitle>Plan Ahead for {getMonthName(getNextMonth())}</CardTitle>
                <CardDescription>
                  Next month's automotive focus will shift to {nextMonthRec.focus}. Start researching your options now.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {nextMonthRec.categories.map((category) => (
                    <Badge key={category} className={`bg-${colorScheme}-100 text-${colorScheme}-800`}>
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className={`text-${colorScheme}-700 border-${colorScheme}-300`}>
                  Explore {getMonthName(getNextMonth())} Vehicles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <div className="space-y-12">
            {Object.entries(userProfiles).map(([key, profile]) => (
              <div key={key} className="mb-8">
                <div className="flex items-center mb-4">
                  <div className={`p-2 rounded-full bg-${colorScheme}-100 text-${colorScheme}-700 mr-3`}>
                    {profile.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{profile.title}</h3>
                    <p className="text-gray-600">{profile.description}</p>
                  </div>
                </div>

                {profileRecommendations[key]?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {profileRecommendations[key].map((product) => (
                      <CarProductCard key={product.id} product={product} colorScheme={colorScheme} />
                    ))}
                  </div>
                ) : (
                  <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="pt-6">
                      <p className="text-gray-500 text-center">
                        No specific recommendations available for this profile right now.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="parts">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Settings className={`h-5 w-5 mr-2 text-${colorScheme}-600`} />
              <h3 className="text-xl font-semibold">Most Searched Car Parts in {getMonthName(currentMonth)}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popularParts.map((part, index) => (
                <Card
                  key={index}
                  className={`border-${colorScheme}-200 hover:border-${colorScheme}-400 transition-all duration-300`}
                >
                  <CardContent className="pt-6 flex items-center">
                    <div className={`p-3 rounded-full bg-${colorScheme}-100 text-${colorScheme}-700 mr-4`}>
                      {getPartIcon(part)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{part}</h4>
                      <p className="text-sm text-gray-600">High demand in {getMonthName(currentMonth)}</p>
                    </div>
                    <Button variant="ghost" className={`ml-auto text-${colorScheme}-700`}>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Card className={`border-${colorScheme}-200 bg-${colorScheme}-50`}>
              <CardHeader>
                <CardTitle>Maintenance Tips for {currentSeason}</CardTitle>
                <CardDescription>
                  Keep your vehicle in top condition during {currentSeason} with these essential maintenance tips.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {getSeasonalMaintenanceTips(currentSeason).map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <Wrench className={`h-5 w-5 mr-2 text-${colorScheme}-600 flex-shrink-0 mt-0.5`} />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className={`text-${colorScheme}-700 border-${colorScheme}-300`}>
                  View Complete Maintenance Guide
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <Button className={`bg-${colorScheme}-600 hover:bg-${colorScheme}-700 text-white`}>
          View All Automotive Products
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Helper function to get part icon
function getPartIcon(part: string) {
  if (part.toLowerCase().includes("wiper")) return <Wrench className="h-5 w-5" />
  if (part.toLowerCase().includes("brake")) return <Gauge className="h-5 w-5" />
  if (part.toLowerCase().includes("tire")) return <Milestone className="h-5 w-5" />
  if (part.toLowerCase().includes("mat")) return <Car className="h-5 w-5" />
  if (part.toLowerCase().includes("filter")) return <Settings className="h-5 w-5" />
  if (part.toLowerCase().includes("audio")) return <Heart className="h-5 w-5" />
  if (part.toLowerCase().includes("performance")) return <Gauge className="h-5 w-5" />
  if (part.toLowerCase().includes("cover")) return <Car className="h-5 w-5" />
  if (part.toLowerCase().includes("light")) return <Sparkles className="h-5 w-5" />
  if (part.toLowerCase().includes("security")) return <Shield className="h-5 w-5" />
  if (part.toLowerCase().includes("detailing")) return <Sparkles className="h-5 w-5" />
  if (part.toLowerCase().includes("battery")) return <Zap className="h-5 w-5" />
  if (part.toLowerCase().includes("cam")) return <Camera className="h-5 w-5" />
  if (part.toLowerCase().includes("mount")) return <Smartphone className="h-5 w-5" />
  return <Cog className="h-5 w-5" />
}

// Helper function to get seasonal maintenance tips
function getSeasonalMaintenanceTips(season: string) {
  switch (season) {
    case "Long Rains":
      return [
        "Check and replace worn windshield wipers",
        "Ensure proper tire tread depth for wet conditions",
        "Test your brakes and replace worn brake pads",
        "Check that all lights are working properly",
        "Consider applying water repellent to windshield",
      ]
    case "Cool Dry":
      return [
        "Check and replace air filters",
        "Schedule a comprehensive engine tune-up",
        "Check tire pressure regularly in cooler weather",
        "Inspect battery connections and charge",
        "Consider a fuel system cleaning",
      ]
    case "Short Rains":
      return [
        "Inspect and clean undercarriage to prevent rust",
        "Check antifreeze/coolant levels",
        "Test your car's heating system",
        "Replace worn windshield wipers",
        "Check all exterior lights for visibility",
      ]
    default:
      return [
        "Schedule a comprehensive vehicle inspection",
        "Check all fluid levels and top up as needed",
        "Inspect tires for wear and proper inflation",
        "Test battery and charging system",
        "Replace any worn belts or hoses",
      ]
  }
}

// Car product card component
function CarProductCard({ product, colorScheme }: { product: CarProduct; colorScheme: string }) {
  return (
    <Card
      className={`border-${colorScheme}-200 hover:border-${colorScheme}-400 transition-all duration-300 h-full flex flex-col`}
    >
      <div className="relative h-48">
        <Image
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {product.isTrending && (
            <Badge className="bg-orange-500 text-white">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          )}
          {product.discount && product.discount > 0 && (
            <Badge className="bg-red-500 text-white">
              <BadgePercent className="h-3 w-3 mr-1" />
              {product.discount}% Off
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="pt-4 flex-grow">
        <Badge variant="outline" className={`mb-2 text-${colorScheme}-700 border-${colorScheme}-300`}>
          {product.condition}
        </Badge>

        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {product.make} {product.model} {product.year}
        </p>

        <div className="flex items-center mb-3">
          <div className="text-lg font-bold text-indigo-700">{formatCurrency(product.currentPrice)}</div>
          {product.originalPrice !== product.currentPrice && (
            <div className="text-sm text-gray-500 line-through ml-2">{formatCurrency(product.originalPrice)}</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-600">
          {product.specifications.engine && (
            <div className="flex items-center">
              <Settings className="h-3 w-3 mr-1 text-gray-400" />
              <span>{product.specifications.engine}</span>
            </div>
          )}
          {product.specifications.transmission && (
            <div className="flex items-center">
              <Cog className="h-3 w-3 mr-1 text-gray-400" />
              <span>{product.specifications.transmission}</span>
            </div>
          )}
          {product.specifications.mileage && (
            <div className="flex items-center">
              <Milestone className="h-3 w-3 mr-1 text-gray-400" />
              <span>{product.specifications.mileage}</span>
            </div>
          )}
          {product.specifications.fuelType && (
            <div className="flex items-center">
              <Fuel className="h-3 w-3 mr-1 text-gray-400" />
              <span>{product.specifications.fuelType}</span>
            </div>
          )}
        </div>

        <div className="flex items-center text-xs text-gray-500 mb-2">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{product.location}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {product.tags.slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className={`text-xs border-${colorScheme}-300 text-${colorScheme}-700`}
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button className={`w-full bg-${colorScheme}-600 hover:bg-${colorScheme}-700 text-white`}>View Details</Button>
      </CardFooter>
    </Card>
  )
}

// Missing imports for part icons
function Zap(props: any) {
  return <Sparkles {...props} />
}

function Camera(props: any) {
  return <Sparkles {...props} />
}

function Smartphone(props: any) {
  return <Sparkles {...props} />
}

function Shield(props: any) {
  return <Sparkles {...props} />
}
