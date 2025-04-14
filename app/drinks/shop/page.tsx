"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
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
  Flame,
  Wine,
  Beer,
  Coffee,
  CoffeeIcon as Cocktail,
  Martini,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Types
interface Price {
  amount: number
  currency: string
}

interface DrinkProvider {
  id: string
  name: string
  logo: string
  category: "wine" | "beer" | "coffee" | "cocktail"
  description: string
  rating: number
  reviewCount: number
  location: string
  contact: {
    phone: string
    email: string
    website: string
  }
  openingHours: string
  products: DrinkProduct[]
  amenities: string[]
  images: string[]
}

interface DrinkProduct {
  id: string
  name: string
  description: string
  price: Price
  image: string
  isPopular?: boolean
  isNew?: boolean
  category: string
  tags: string[]
}

// Helper function to format price
const formatPrice = (price: Price): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount)
}

// Mock data for drink providers
const drinkProviders: DrinkProvider[] = [
  // Wine Providers
  {
    id: "vineyard-estates",
    name: "Vineyard Estates",
    logo: "/placeholder.svg?height=80&width=80",
    category: "wine",
    description:
      "Premium wine selection from local and international vineyards, offering a diverse range of reds, whites, and sparkling options.",
    rating: 4.8,
    reviewCount: 324,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 712 345 678",
      email: "info@vineyardestates.co.ke",
      website: "www.vineyardestates.co.ke",
    },
    openingHours: "Mon-Fri: 10:00 AM - 8:00 PM, Sat-Sun: 11:00 AM - 9:00 PM",
    amenities: ["Wine Tasting", "Expert Sommeliers", "Gift Wrapping", "Cellar Storage", "Wine Club"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "cabernet-reserve",
        name: "Cabernet Sauvignon Reserve",
        description:
          "Full-bodied red wine with rich flavors of blackcurrant, cedar, and vanilla with a smooth, lingering finish.",
        price: { amount: 4500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Red Wines",
        tags: ["Cabernet", "Full-bodied", "Aged"],
      },
      {
        id: "chardonnay-classic",
        name: "Chardonnay Classic",
        description: "Elegant white wine with notes of apple, pear, and subtle oak influence. Crisp and refreshing.",
        price: { amount: 3200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "White Wines",
        tags: ["Chardonnay", "Crisp", "Fruity"],
      },
      {
        id: "prosecco-premium",
        name: "Premium Prosecco",
        description: "Sparkling Italian wine with delicate bubbles and flavors of green apple, honeysuckle, and peach.",
        price: { amount: 3800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Sparkling Wines",
        tags: ["Prosecco", "Sparkling", "Italian"],
      },
      {
        id: "rose-provence",
        name: "Provence Rosé",
        description: "Elegant rosé with delicate aromas of strawberry, rose petal, and citrus. Dry and refreshing.",
        price: { amount: 3500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Rosé Wines",
        tags: ["Rosé", "Dry", "French"],
      },
    ],
  },
  {
    id: "wine-world",
    name: "Wine World",
    logo: "/placeholder.svg?height=80&width=80",
    category: "wine",
    description: "Global wine emporium featuring rare and exclusive wines from renowned wine regions around the world.",
    rating: 4.7,
    reviewCount: 256,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 723 456 789",
      email: "care@wineworld.com",
      website: "www.wineworld.com",
    },
    openingHours: "Mon-Sat: 9:00 AM - 9:00 PM, Sun: 11:00 AM - 6:00 PM",
    amenities: [
      "Wine Masterclasses",
      "Collector's Vault",
      "Temperature-Controlled Storage",
      "Wine Pairing Advice",
      "Corporate Gifting",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "bordeaux-grand-cru",
        name: "Bordeaux Grand Cru",
        description: "Prestigious French red blend with complex flavors of dark fruits, tobacco, and fine tannins.",
        price: { amount: 12000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Premium Wines",
        tags: ["Bordeaux", "Grand Cru", "Collectible"],
      },
      {
        id: "sauvignon-blanc-marlborough",
        name: "Marlborough Sauvignon Blanc",
        description:
          "Vibrant New Zealand white with intense aromas of passionfruit, gooseberry, and zesty citrus notes.",
        price: { amount: 2800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "White Wines",
        tags: ["Sauvignon Blanc", "New Zealand", "Aromatic"],
      },
      {
        id: "champagne-brut",
        name: "Premium Champagne Brut",
        description: "Elegant French champagne with fine bubbles and notes of brioche, apple, and citrus zest.",
        price: { amount: 9500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Champagne",
        tags: ["Champagne", "Brut", "French"],
      },
      {
        id: "barolo-reserve",
        name: "Barolo Reserve",
        description: "Prestigious Italian red with powerful structure, complex flavors of cherry, tar, and roses.",
        price: { amount: 8500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Italian Wines",
        tags: ["Barolo", "Nebbiolo", "Aged"],
      },
    ],
  },

  // Beer Providers
  {
    id: "craft-brew-house",
    name: "Craft Brew House",
    logo: "/placeholder.svg?height=80&width=80",
    category: "beer",
    description:
      "Specialty craft beer shop featuring local microbreweries and international craft selections with expert recommendations.",
    rating: 4.9,
    reviewCount: 189,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 734 567 890",
      email: "info@craftbrewhouse.co.ke",
      website: "www.craftbrewhouse.co.ke",
    },
    openingHours: "Mon-Thu: 12:00 PM - 10:00 PM, Fri-Sat: 12:00 PM - 12:00 AM, Sun: 12:00 PM - 8:00 PM",
    amenities: ["Tasting Flights", "Growler Fills", "Beer Education", "Brewery Tours", "Beer Club"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "hazy-ipa",
        name: "Hazy IPA Collection",
        description:
          "Selection of juicy, hazy IPAs with tropical fruit flavors and soft mouthfeel from top craft breweries.",
        price: { amount: 2200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "IPA",
        tags: ["Hazy", "Hoppy", "Craft"],
      },
      {
        id: "belgian-tripel",
        name: "Belgian Tripel",
        description: "Traditional Belgian-style strong ale with complex flavors of fruit, spice, and subtle sweetness.",
        price: { amount: 2500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Belgian Beers",
        tags: ["Belgian", "Strong Ale", "Spiced"],
      },
      {
        id: "imperial-stout",
        name: "Barrel-Aged Imperial Stout",
        description: "Rich, dark stout aged in bourbon barrels with notes of chocolate, coffee, and vanilla.",
        price: { amount: 3200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Stouts",
        tags: ["Barrel-Aged", "Imperial", "Dark"],
      },
      {
        id: "sour-ale",
        name: "Wild Fermentation Sour Ale",
        description: "Complex sour beer with funky, tart flavors and oak-aged character from wild yeasts.",
        price: { amount: 2800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Sour Beers",
        tags: ["Sour", "Wild Fermentation", "Funky"],
      },
    ],
  },
  {
    id: "beer-emporium",
    name: "Beer Emporium",
    logo: "/placeholder.svg?height=80&width=80",
    category: "beer",
    description:
      "Comprehensive beer shop with everything from mainstream lagers to rare limited releases and brewing supplies.",
    rating: 4.6,
    reviewCount: 215,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 745 678 901",
      email: "support@beeremporium.co.ke",
      website: "www.beeremporium.co.ke",
    },
    openingHours: "Mon-Sun: 10:00 AM - 10:00 PM",
    amenities: ["Home Brewing Supplies", "Beer Tastings", "Gift Baskets", "Rare Releases", "Glassware"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "pilsner-collection",
        name: "Premium Pilsner Collection",
        description: "Crisp, clean lagers from Germany, Czech Republic and craft breweries with noble hop character.",
        price: { amount: 1800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Lagers",
        tags: ["Pilsner", "Crisp", "European"],
      },
      {
        id: "wheat-beer",
        name: "Bavarian Wheat Beer",
        description: "Traditional German hefeweizen with banana and clove notes, cloudy appearance and smooth finish.",
        price: { amount: 2000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Wheat Beers",
        tags: ["Hefeweizen", "German", "Wheat"],
      },
      {
        id: "local-craft-pack",
        name: "Local Craft Brewery Pack",
        description: "Curated selection of the best beers from local Kenyan craft breweries in various styles.",
        price: { amount: 2500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Local Craft",
        tags: ["Kenyan", "Craft", "Variety"],
      },
      {
        id: "trappist-ales",
        name: "Authentic Trappist Ales",
        description: "Genuine Trappist beers brewed by monks in monasteries with centuries of brewing tradition.",
        price: { amount: 3500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Trappist Beers",
        tags: ["Trappist", "Authentic", "Monastery"],
      },
    ],
  },

  // Coffee Providers
  {
    id: "artisan-roasters",
    name: "Artisan Roasters",
    logo: "/placeholder.svg?height=80&width=80",
    category: "coffee",
    description:
      "Specialty coffee roastery offering single-origin beans, custom blends, and premium brewing equipment.",
    rating: 4.8,
    reviewCount: 178,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 756 789 012",
      email: "info@artisanroasters.co.ke",
      website: "www.artisanroasters.co.ke",
    },
    openingHours: "Mon-Fri: 7:00 AM - 7:00 PM, Sat-Sun: 8:00 AM - 6:00 PM",
    amenities: ["Coffee Tastings", "Brewing Workshops", "Subscription Service", "Direct Trade", "Roasting Classes"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "ethiopian-yirgacheffe",
        name: "Ethiopian Yirgacheffe",
        description:
          "Bright, floral single-origin coffee with notes of bergamot, jasmine, and citrus. Light and complex.",
        price: { amount: 1500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Single Origin",
        tags: ["Ethiopian", "Light Roast", "Floral"],
      },
      {
        id: "colombian-supremo",
        name: "Colombian Supremo",
        description:
          "Well-balanced medium roast with notes of caramel, chocolate, and mild citrus acidity. Smooth finish.",
        price: { amount: 1200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Single Origin",
        tags: ["Colombian", "Medium Roast", "Balanced"],
      },
      {
        id: "espresso-blend",
        name: "Signature Espresso Blend",
        description:
          "Rich, dark roast blend designed for espresso with notes of dark chocolate, hazelnut, and caramel.",
        price: { amount: 1300, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Espresso Blends",
        tags: ["Espresso", "Dark Roast", "Blend"],
      },
      {
        id: "kenyan-aa",
        name: "Kenyan AA Reserve",
        description:
          "Premium Kenyan coffee with bright acidity, full body, and notes of blackcurrant and dark berries.",
        price: { amount: 1600, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Local Specialty",
        tags: ["Kenyan", "AA Grade", "Bright"],
      },
    ],
  },
  {
    id: "global-coffee-traders",
    name: "Global Coffee Traders",
    logo: "/placeholder.svg?height=80&width=80",
    category: "coffee",
    description:
      "International coffee importer offering rare and exotic coffees from around the world with sustainable practices.",
    rating: 4.7,
    reviewCount: 145,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 767 890 123",
      email: "support@globalcoffeetraders.co.ke",
      website: "www.globalcoffeetraders.co.ke",
    },
    openingHours: "Mon-Sat: 8:00 AM - 8:00 PM, Sun: 9:00 AM - 5:00 PM",
    amenities: ["Cupping Sessions", "Coffee Library", "Brewing Equipment", "Gift Boxes", "Coffee Passport Program"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "jamaican-blue",
        name: "Jamaican Blue Mountain",
        description: "Rare, luxurious coffee with mild flavor, clean taste, and subtle floral and nutty notes.",
        price: { amount: 4500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Premium Coffee",
        tags: ["Jamaican", "Rare", "Smooth"],
      },
      {
        id: "kona-reserve",
        name: "Hawaiian Kona Reserve",
        description: "Smooth, medium-bodied coffee with sweet, fruity notes and a hint of nuttiness from Hawaii.",
        price: { amount: 3800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Premium Coffee",
        tags: ["Hawaiian", "Sweet", "Medium"],
      },
      {
        id: "geisha-panama",
        name: "Panama Geisha",
        description:
          "Exceptional, award-winning coffee with tea-like body, jasmine, bergamot, and tropical fruit notes.",
        price: { amount: 5500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Exotic Coffee",
        tags: ["Geisha", "Panama", "Award-winning"],
      },
      {
        id: "cold-brew-kit",
        name: "Premium Cold Brew Kit",
        description:
          "Complete kit with specialty beans and equipment for making smooth, low-acidity cold brew at home.",
        price: { amount: 3200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Brewing Kits",
        tags: ["Cold Brew", "Kit", "Equipment"],
      },
    ],
  },

  // Cocktail Providers
  {
    id: "mixology-masters",
    name: "Mixology Masters",
    logo: "/placeholder.svg?height=80&width=80",
    category: "cocktail",
    description:
      "Premium cocktail supply shop with craft spirits, bitters, syrups, and professional bartending equipment.",
    rating: 4.9,
    reviewCount: 312,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 778 901 234",
      email: "info@mixologymasters.co.ke",
      website: "www.mixologymasters.co.ke",
    },
    openingHours: "Mon-Sat: 10:00 AM - 10:00 PM, Sun: 12:00 PM - 8:00 PM",
    amenities: ["Mixology Classes", "Tasting Events", "Custom Cocktail Creation", "Bar Consultation", "Gift Sets"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "craft-gin-collection",
        name: "Craft Gin Collection",
        description: "Curated selection of premium craft gins from around the world with unique botanical profiles.",
        price: { amount: 8500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Spirits",
        tags: ["Gin", "Craft", "Collection"],
      },
      {
        id: "premium-cocktail-kit",
        name: "Classic Cocktail Kit",
        description: "Complete kit for making classic cocktails including spirits, mixers, tools, and recipe book.",
        price: { amount: 12000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Cocktail Kits",
        tags: ["Kit", "Classic", "Complete"],
      },
      {
        id: "artisanal-bitters",
        name: "Artisanal Bitters Set",
        description:
          "Collection of handcrafted bitters in various flavors to elevate cocktails with complex aromatics.",
        price: { amount: 3500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Cocktail Ingredients",
        tags: ["Bitters", "Artisanal", "Flavors"],
      },
      {
        id: "bar-tools-pro",
        name: "Professional Bar Tools Set",
        description:
          "High-quality bartending tools including shaker, jigger, strainer, and bar spoon for home mixology.",
        price: { amount: 6500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Bar Equipment",
        tags: ["Tools", "Professional", "Bartending"],
      },
    ],
  },
  {
    id: "cocktail-emporium",
    name: "Cocktail Emporium",
    logo: "/placeholder.svg?height=80&width=80",
    category: "cocktail",
    description:
      "Comprehensive cocktail shop with premium spirits, mixers, garnishes, and everything needed for home bartending.",
    rating: 4.8,
    reviewCount: 267,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 789 012 345",
      email: "care@cocktailemporium.co.ke",
      website: "www.cocktailemporium.co.ke",
    },
    openingHours: "Mon-Sun: 11:00 AM - 11:00 PM",
    amenities: [
      "Virtual Mixology Classes",
      "Subscription Boxes",
      "Glassware Collection",
      "Garnish Bar",
      "Cocktail Books",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "premium-tequila",
        name: "Premium Tequila Collection",
        description: "Selection of aged tequilas including blanco, reposado, and añejo expressions from top producers.",
        price: { amount: 15000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Spirits",
        tags: ["Tequila", "Aged", "Premium"],
      },
      {
        id: "craft-mixers",
        name: "Craft Cocktail Mixers",
        description: "Artisanal mixers including tonics, ginger beer, and syrups made with natural ingredients.",
        price: { amount: 2800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Mixers",
        tags: ["Mixers", "Craft", "Natural"],
      },
      {
        id: "molecular-mixology",
        name: "Molecular Mixology Kit",
        description: "Advanced kit for creating innovative cocktails using molecular gastronomy techniques and tools.",
        price: { amount: 9500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Specialty Kits",
        tags: ["Molecular", "Innovative", "Advanced"],
      },
      {
        id: "vintage-glassware",
        name: "Vintage Cocktail Glassware",
        description:
          "Collection of elegant, vintage-inspired glassware for different cocktail styles and presentations.",
        price: { amount: 7500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Glassware",
        tags: ["Vintage", "Elegant", "Collection"],
      },
    ],
  },
]

export default function DrinksShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<DrinkProvider | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<DrinkProduct | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter providers based on active category and search query
  const filteredProviders = drinkProviders.filter((provider) => {
    // Filter by category
    if (activeCategory !== "all" && provider.category !== activeCategory) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        provider.name.toLowerCase().includes(query) ||
        provider.description.toLowerCase().includes(query) ||
        provider.products.some(
          (product) => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
        )
      )
    }

    return true
  })

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setIsLoading(true)
    setActiveCategory(category)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  // Handle provider click
  const handleProviderClick = (provider: DrinkProvider) => {
    setSelectedProvider(provider)
  }

  // Handle product click
  const handleProductClick = (product: DrinkProduct) => {
    setSelectedProduct(product)
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "wine":
        return <Wine className="h-6 w-6" />
      case "beer":
        return <Beer className="h-6 w-6" />
      case "coffee":
        return <Coffee className="h-6 w-6" />
      case "cocktail":
        return <Cocktail className="h-6 w-6" />
      default:
        return <Martini className="h-6 w-6" />
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "wine":
        return "from-purple-500 to-pink-500"
      case "beer":
        return "from-amber-500 to-yellow-500"
      case "coffee":
        return "from-brown-500 to-amber-700"
      case "cocktail":
        return "from-teal-500 to-emerald-500"
      default:
        return "from-purple-500 to-pink-500"
    }
  }

  // Get category background color
  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case "wine":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "beer":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "coffee":
        return "bg-amber-100 text-amber-900 border-amber-200"
      case "cocktail":
        return "bg-teal-100 text-teal-800 border-teal-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  // Render category tabs
  const renderCategoryTabs = () => {
    return (
      <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
        {[
          { id: "all", name: "All Drinks", icon: <Martini className="h-5 w-5" /> },
          { id: "wine", name: "Wine", icon: <Wine className="h-5 w-5" /> },
          { id: "beer", name: "Beer", icon: <Beer className="h-5 w-5" /> },
          { id: "coffee", name: "Coffee", icon: <Coffee className="h-5 w-5" /> },
          { id: "cocktail", name: "Cocktails", icon: <Cocktail className="h-5 w-5" /> },
        ].map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              activeCategory === category.id
                ? `bg-gradient-to-r ${
                    category.id === "all"
                      ? "from-purple-500 to-pink-500"
                      : category.id === "wine"
                        ? "from-purple-500 to-pink-500"
                        : category.id === "beer"
                          ? "from-amber-500 to-yellow-500"
                          : category.id === "coffee"
                            ? "from-brown-500 to-amber-700"
                            : "from-teal-500 to-emerald-500"
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-500 to-pink-600 py-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-300 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-pink-300 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/drinks" className="flex items-center text-white mb-4 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Drinks
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Drinks Shop</h1>
              <p className="text-purple-100 max-w-2xl">
                Discover premium beverages from around the world, from fine wines and craft beers to specialty coffees
                and artisanal cocktail ingredients.
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
                  <Martini className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Premium Selection</p>
                  <p className="text-sm">Taste Excellence</p>
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
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-200"></div>
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search for drinks, brands, or flavors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 rounded-full border-transparent bg-white dark:bg-slate-800 text-gray-800 dark:text-white placeholder:text-gray-400 focus:ring-purple-500 focus:border-transparent w-full shadow-lg"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500">
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

      {/* Category Content */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProviders.map((provider) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Card
                  className="overflow-hidden border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer"
                  onClick={() => handleProviderClick(provider)}
                >
                  <div className={`p-4 bg-gradient-to-r ${getCategoryColor(provider.category)} text-white`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-white/20 p-2 rounded-full">{getCategoryIcon(provider.category)}</div>
                      <h3 className="text-xl font-semibold">{provider.name}</h3>
                    </div>
                    <Badge className="bg-white/30 text-white border-0">
                      {provider.category.charAt(0).toUpperCase() + provider.category.slice(1)}
                    </Badge>
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <StarRating rating={provider.rating} />
                      <Badge variant="outline" className={getCategoryBgColor(provider.category)}>
                        {provider.reviewCount} reviews
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{provider.description}</p>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {provider.location}
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {provider.openingHours}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      className={`w-full bg-gradient-to-r ${getCategoryColor(provider.category)} hover:opacity-90 text-white`}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredProviders.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-8 rounded-lg inline-block mb-4">
              <Search className="h-12 w-12 text-purple-500 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any drink providers matching your criteria. Try adjusting your search or browse a
              different category.
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white"
              onClick={() => {
                setSearchQuery("")
                setActiveCategory("all")
              }}
            >
              View All Providers
            </Button>
          </div>
        )}
      </div>

      {/* Provider Detail Modal */}
      <Dialog open={!!selectedProvider} onOpenChange={(open) => !open && setSelectedProvider(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProvider && (
            <>
              <DialogHeader>
                <div
                  className={`p-4 -mt-6 -mx-6 mb-4 bg-gradient-to-r ${getCategoryColor(selectedProvider.category)} text-white`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/20 p-2 rounded-full">{getCategoryIcon(selectedProvider.category)}</div>
                    <DialogTitle className="text-2xl font-bold">{selectedProvider.name}</DialogTitle>
                  </div>
                  <DialogDescription className="text-white/90 mt-1">{selectedProvider.description}</DialogDescription>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Phone className="h-4 w-4 mr-2 text-purple-500" />
                        {selectedProvider.contact.phone}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Mail className="h-4 w-4 mr-2 text-purple-500" />
                        {selectedProvider.contact.email}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Globe className="h-4 w-4 mr-2 text-purple-500" />
                        <a
                          href={`https://${selectedProvider.contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-500 hover:underline"
                        >
                          {selectedProvider.contact.website}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Location & Hours</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                        {selectedProvider.location}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-purple-500" />
                        {selectedProvider.openingHours}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProvider.amenities.map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
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
                    {selectedProvider.products.map((product) => (
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
                            {product.isNew && <Badge className="bg-purple-500 text-white">New</Badge>}
                            {product.isPopular && (
                              <Badge className="bg-amber-500 text-white flex items-center gap-1">
                                <Flame className="h-3 w-3" />
                                <span>Popular</span>
                              </Badge>
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
                            <span className="font-bold text-purple-600 dark:text-purple-400">
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
        <DialogContent className="max-w-2xl">
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
                    {selectedProduct.isNew && <Badge className="bg-purple-500 text-white">New</Badge>}
                    {selectedProduct.isPopular && (
                      <Badge className="bg-amber-500 text-white flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        <span>Popular</span>
                      </Badge>
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
                    <span className="font-bold text-2xl text-purple-600 dark:text-purple-400">
                      {formatPrice(selectedProduct.price)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Characteristics</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 text-white">
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
    </div>
  )
}

