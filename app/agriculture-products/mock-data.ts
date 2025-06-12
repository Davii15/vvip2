import type React from "react"
import { Sun, Moon, Coffee, Utensils, Leaf, Heart, Droplets } from "lucide-react"

// Types
export interface Price {
  amount: number
  currency: string
}

export interface AgricultureProduct {
  id: number | string
  name: string
  imageUrl: string
  currentPrice: Price
  originalPrice: Price
  category: string
  subcategory: string
  subtype?: string
  description: string
  brand: string
  isNew?: boolean
  isPopular?: boolean
  dateAdded: string
  rating?: number
  reviewCount?: number
  colors?: string[]
  sizes?: string[]
  features?: string[]
  material?: string
  inStock: boolean
  stockCount?: number
  tags?: string[]
  hotDealEnds?: string
  discount?: number
  vendorId: number | string
  isHotDeal?: boolean
  images?: string[]
  nutritionalInfo?: {
    calories?: number | undefined
    protein?: number | undefined
    carbs?: number | undefined
    fiber?: number | undefined
    fat?: number | undefined
    vitamins?: string[]
    minerals?: string[]
  }
  harvestDate?: string
  servingSize?: string
  origin?: string
  organicCertified?: boolean
  uses?: string[]
}

export interface AgricultureVendor {
  id: number | string
  name: string
  location: string
  logo: string
  description: string
  products: AgricultureProduct[]
  redirectUrl: string
  mapLink: string
  defaultCurrency: string
  rating?: number
  reviewCount?: number
  deliveryTime?: string
  deliveryFee?: Price
  minimumOrder?: Price
  verified?: boolean
}

export interface AgricultureCategory {
  id: string
  name: string
  icon: string
  subcategories: AgricultureSubcategory[]
}

export interface AgricultureSubcategory {
  id: string
  name: string
  icon?: string
  subtypes?: AgricultureSubtype[]
}

export interface AgricultureSubtype {
  id: string
  name: string
}

export interface HealthInsight {
  title: string
  description: string
  benefits: string[]
  icon: React.ReactNode
}

export interface MealPlanningData {
  time: string
  icon: React.ReactNode
  foods: string[]
  nutrients: string[]
  benefits: string
}

// Helper function to format price
export const formatPrice = (price: Price): string => {
  if (price.currency === "KSH" && price.amount >= 1000) {
    return `${price.currency} ${price.amount.toLocaleString()}`
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount)
}

// Get color scheme based on category
export const getCategoryColors = (category: string) => {
  switch (category.toLowerCase()) {
    case "honey & bee products":
      return {
        gradient: "from-amber-500 to-yellow-600",
        lightGradient: "from-amber-100 to-yellow-100",
        text: "text-amber-700",
        border: "border-amber-200",
        button: "bg-amber-600 hover:bg-amber-700",
        badge: "bg-amber-100 text-amber-800",
        highlight: "text-amber-600",
        bgLight: "bg-amber-50",
      }
    case "organic vegetables":
      return {
        gradient: "from-green-500 to-emerald-600",
        lightGradient: "from-green-100 to-emerald-100",
        text: "text-green-700",
        border: "border-green-200",
        button: "bg-green-600 hover:bg-green-700",
        badge: "bg-green-100 text-green-800",
        highlight: "text-green-600",
        bgLight: "bg-green-50",
      }
    case "dairy products":
      return {
        gradient: "from-blue-500 to-cyan-500",
        lightGradient: "from-blue-100 to-cyan-100",
        text: "text-blue-700",
        border: "border-blue-200",
        button: "bg-blue-600 hover:bg-blue-700",
        badge: "bg-blue-100 text-blue-800",
        highlight: "text-blue-600",
        bgLight: "bg-blue-50",
      }
    case "herbs & spices":
      return {
        gradient: "from-purple-500 to-pink-500",
        lightGradient: "from-purple-100 to-pink-100",
        text: "text-purple-700",
        border: "border-purple-200",
        button: "bg-purple-600 hover:bg-purple-700",
        badge: "bg-purple-100 text-purple-800",
        highlight: "text-purple-600",
        bgLight: "bg-purple-50",
      }
    default:
      return {
        gradient: "from-green-500 to-emerald-600",
        lightGradient: "from-green-100 to-emerald-100",
        text: "text-green-700",
        border: "border-green-200",
        button: "bg-green-600 hover:bg-green-700",
        badge: "bg-green-100 text-green-800",
        highlight: "text-green-600",
        bgLight: "bg-green-50",
      }
  }
}

// Health Insights Data
export const healthInsights: HealthInsight[] = [
  {
    title: "The Power of Raw Honey",
    description:
      "Raw honey is packed with antioxidants, enzymes, and antimicrobial properties that support immune function and digestive health. Choose unprocessed honey from local Kenyan beekeepers for maximum benefits.",
    benefits: ["Boosts Immunity", "Natural Energy", "Antimicrobial", "Rich in Antioxidants"],
    icon: <Droplets className="h-6 w-6 text-white" />,
  },
  {
    title: "Organic Vegetables for Optimal Health",
    description:
      "Organic vegetables grown in Kenya's rich soil are free from harmful pesticides and contain higher levels of vitamins, minerals, and phytonutrients. They support detoxification and provide essential nutrients for cellular health.",
    benefits: ["Pesticide-Free", "Higher Nutrients", "Better Taste", "Environmental Friendly"],
    icon: <Leaf className="h-6 w-6 text-white" />,
  },
  {
    title: "Fresh Dairy for Strong Bones",
    description:
      "Fresh dairy products from grass-fed Kenyan cattle provide high-quality protein, calcium, and vitamin D. These nutrients are essential for bone health, muscle development, and overall growth.",
    benefits: ["High Protein", "Calcium Rich", "Vitamin D", "Muscle Building"],
    icon: <Heart className="h-6 w-6 text-white" />,
  },
]

// Meal Planning Data
export const mealPlanningData: MealPlanningData[] = [
  {
    time: "Morning (6-8 AM)",
    icon: <Sun className="h-5 w-5 text-yellow-500" />,
    foods: ["Raw Honey", "Fresh Milk", "Leafy Greens", "Seasonal Fruits"],
    nutrients: ["Vitamin C", "Calcium", "Natural Sugars", "Fiber"],
    benefits: "Kickstart metabolism, provide sustained energy, and support immune function for the day ahead.",
  },
  {
    time: "Tea Break (10-11 AM)",
    icon: <Coffee className="h-5 w-5 text-brown-500" />,
    foods: ["Herbal Tea", "Honey", "Nuts", "Dried Fruits"],
    nutrients: ["Antioxidants", "Healthy Fats", "Natural Sugars", "Minerals"],
    benefits: "Maintain energy levels, support brain function, and provide healthy snacking options.",
  },
  {
    time: "Lunch (12-2 PM)",
    icon: <Utensils className="h-5 w-5 text-green-500" />,
    foods: ["Mixed Vegetables", "Yogurt", "Herbs & Spices", "Root Vegetables"],
    nutrients: ["Protein", "Probiotics", "Vitamins A & K", "Complex Carbs"],
    benefits:
      "Support digestive health, provide sustained energy, and deliver essential nutrients for afternoon activities.",
  },
  {
    time: "Evening (6-8 PM)",
    icon: <Moon className="h-5 w-5 text-blue-500" />,
    foods: ["Light Vegetables", "Chamomile Tea", "Honey", "Fresh Cheese"],
    nutrients: ["Magnesium", "Tryptophan", "Calcium", "B-Vitamins"],
    benefits: "Promote relaxation, support better sleep quality, and aid in overnight recovery and repair.",
  },
]

// Define categories and subcategories
export const agricultureCategories: AgricultureCategory[] = [
  {
    id: "honey-bee-products",
    name: "Honey & Bee Products",
    icon: "🍯",
    subcategories: [
      {
        id: "raw-honey",
        name: "Raw Honey",
        icon: "🍯",
        subtypes: [
          { id: "wildflower-honey", name: "Wildflower Honey" },
          { id: "acacia-honey", name: "Acacia Honey" },
          { id: "eucalyptus-honey", name: "Eucalyptus Honey" },
          { id: "manuka-honey", name: "Manuka Honey" },
        ],
      },
      {
        id: "bee-pollen",
        name: "Bee Pollen",
        icon: "🌼",
        subtypes: [
          { id: "fresh-pollen", name: "Fresh Pollen" },
          { id: "dried-pollen", name: "Dried Pollen" },
          { id: "pollen-granules", name: "Pollen Granules" },
        ],
      },
      {
        id: "beeswax-products",
        name: "Beeswax Products",
        icon: "🕯️",
        subtypes: [
          { id: "pure-beeswax", name: "Pure Beeswax" },
          { id: "beeswax-candles", name: "Beeswax Candles" },
          { id: "beeswax-balms", name: "Beeswax Balms" },
        ],
      },
    ],
  },
  {
    id: "organic-vegetables",
    name: "Organic Vegetables",
    icon: "🥬",
    subcategories: [
      {
        id: "leafy-greens",
        name: "Leafy Greens",
        icon: "🥬",
        subtypes: [
          { id: "spinach", name: "Spinach" },
          { id: "kale", name: "Kale" },
          { id: "sukuma-wiki", name: "Sukuma Wiki" },
          { id: "lettuce", name: "Lettuce" },
        ],
      },
      {
        id: "root-vegetables",
        name: "Root Vegetables",
        icon: "🥕",
        subtypes: [
          { id: "carrots", name: "Carrots" },
          { id: "sweet-potatoes", name: "Sweet Potatoes" },
          { id: "beetroot", name: "Beetroot" },
          { id: "radishes", name: "Radishes" },
        ],
      },
      {
        id: "fruits",
        name: "Fruits",
        icon: "🍎",
        subtypes: [
          { id: "tomatoes", name: "Tomatoes" },
          { id: "avocados", name: "Avocados" },
          { id: "passion-fruits", name: "Passion Fruits" },
          { id: "mangoes", name: "Mangoes" },
        ],
      },
    ],
  },
  {
    id: "dairy-products",
    name: "Dairy Products",
    icon: "🥛",
    subcategories: [
      {
        id: "fresh-milk",
        name: "Fresh Milk",
        icon: "🥛",
        subtypes: [
          { id: "whole-milk", name: "Whole Milk" },
          { id: "low-fat-milk", name: "Low-Fat Milk" },
          { id: "goat-milk", name: "Goat Milk" },
          { id: "camel-milk", name: "Camel Milk" },
        ],
      },
      {
        id: "yogurt",
        name: "Yogurt",
        icon: "🥄",
        subtypes: [
          { id: "plain-yogurt", name: "Plain Yogurt" },
          { id: "greek-yogurt", name: "Greek Yogurt" },
          { id: "flavored-yogurt", name: "Flavored Yogurt" },
          { id: "probiotic-yogurt", name: "Probiotic Yogurt" },
        ],
      },
      {
        id: "cheese",
        name: "Cheese",
        icon: "🧀",
        subtypes: [
          { id: "fresh-cheese", name: "Fresh Cheese" },
          { id: "cottage-cheese", name: "Cottage Cheese" },
          { id: "goat-cheese", name: "Goat Cheese" },
          { id: "aged-cheese", name: "Aged Cheese" },
        ],
      },
    ],
  },
  {
    id: "herbs-spices",
    name: "Herbs & Spices",
    icon: "🌿",
    subcategories: [
      {
        id: "medicinal-herbs",
        name: "Medicinal Herbs",
        icon: "🌿",
        subtypes: [
          { id: "aloe-vera", name: "Aloe Vera" },
          { id: "moringa", name: "Moringa" },
          { id: "neem", name: "Neem" },
          { id: "turmeric", name: "Turmeric" },
        ],
      },
      {
        id: "cooking-spices",
        name: "Cooking Spices",
        icon: "🌶️",
        subtypes: [
          { id: "black-pepper", name: "Black Pepper" },
          { id: "cardamom", name: "Cardamom" },
          { id: "cinnamon", name: "Cinnamon" },
          { id: "ginger", name: "Ginger" },
        ],
      },
      {
        id: "tea-herbs",
        name: "Tea Herbs",
        icon: "🍵",
        subtypes: [
          { id: "chamomile", name: "Chamomile" },
          { id: "lemongrass", name: "Lemongrass" },
          { id: "mint", name: "Mint" },
          { id: "hibiscus", name: "Hibiscus" },
        ],
      },
    ],
  },
]

// Mock data for vendors and products
export const mockAgricultureVendors: AgricultureVendor[] = [
  // Honey & Bee Products Vendors
  {
    id: 1,
    name: "Mau Forest Honey Co.",
    location: "Nakuru, Kenya",
    logo: "/placeholder.svg?height=60&width=60&text=MFH",
    description:
      "Premium raw honey and bee products from the pristine Mau Forest. Our bees collect nectar from indigenous wildflowers, producing some of Kenya's finest honey.",
    redirectUrl: "https://mauforesthoney.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.9,
    reviewCount: 342,
    deliveryTime: "1-2 days",
    deliveryFee: { amount: 200, currency: "KSH" },
    minimumOrder: { amount: 800, currency: "KSH" },
    verified: true,
    products: [
      {
        id: 101,
        name: "Pure Wildflower Raw Honey - 500g",
        imageUrl: "/placeholder.svg?height=300&width=400&text=Wildflower+Honey",
        currentPrice: { amount: 650, currency: "KSH" },
        originalPrice: { amount: 750, currency: "KSH" },
        category: "Honey & Bee Products",
        subcategory: "Raw Honey",
        subtype: "Wildflower Honey",
        description:
          "Unprocessed wildflower honey from the Mau Forest. Rich in enzymes, antioxidants, and natural minerals. Perfect for daily consumption and natural healing.",
        brand: "Mau Forest Honey Co.",
        isPopular: true,
        dateAdded: "2025-03-10T10:30:00Z",
        rating: 4.9,
        reviewCount: 156,
        sizes: ["250g", "500g", "1kg", "2kg"],
        features: ["Raw & Unprocessed", "Rich in Enzymes", "Antimicrobial Properties", "Locally Sourced"],
        inStock: true,
        stockCount: 120,
        tags: ["Honey", "Raw", "Wildflower", "Natural"],
        nutritionalInfo: {
          calories: 304,
          carbs: 82,
          vitamins: ["Vitamin C", "B-Complex"],
          minerals: ["Potassium", "Calcium", "Iron"],
        },
        harvestDate: "March 2025",
        servingSize: "1 tablespoon (21g)",
        origin: "Mau Forest, Nakuru",
        organicCertified: true,
        uses: ["Natural Sweetener", "Immune Booster", "Wound Healing", "Cough Relief"],
        vendorId: 1,
      },
      {
        id: 102,
        name: "Premium Acacia Honey - 1kg",
        imageUrl: "/placeholder.svg?height=300&width=400&text=Acacia+Honey",
        currentPrice: { amount: 1200, currency: "KSH" },
        originalPrice: { amount: 1400, currency: "KSH" },
        category: "Honey & Bee Products",
        subcategory: "Raw Honey",
        subtype: "Acacia Honey",
        description:
          "Light-colored acacia honey with delicate floral taste. Slow to crystallize and perfect for those who prefer mild honey flavors.",
        brand: "Mau Forest Honey Co.",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.8,
        reviewCount: 89,
        sizes: ["500g", "1kg", "2kg"],
        features: ["Mild Flavor", "Slow Crystallization", "Light Color", "Premium Quality"],
        inStock: true,
        stockCount: 85,
        tags: ["Honey", "Acacia", "Mild", "Premium"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        nutritionalInfo: {
          calories: 304,
          carbs: 82,
          vitamins: ["Vitamin C"],
          minerals: ["Potassium", "Magnesium"],
        },
        harvestDate: "March 2025",
        servingSize: "1 tablespoon (21g)",
        origin: "Mau Forest, Nakuru",
        organicCertified: true,
        uses: ["Tea Sweetener", "Baking", "Skincare", "Natural Energy"],
        vendorId: 1,
      },
      {
        id: 103,
        name: "Fresh Bee Pollen Granules - 250g",
        imageUrl: "/placeholder.svg?height=300&width=400&text=Bee+Pollen",
        currentPrice: { amount: 850, currency: "KSH" },
        originalPrice: { amount: 950, currency: "KSH" },
        category: "Honey & Bee Products",
        subcategory: "Bee Pollen",
        subtype: "Fresh Pollen",
        description:
          "Fresh bee pollen granules collected from diverse wildflowers. A superfood rich in proteins, vitamins, and minerals.",
        brand: "Mau Forest Honey Co.",
        dateAdded: "2025-02-25T10:30:00Z",
        rating: 4.7,
        reviewCount: 67,
        sizes: ["100g", "250g", "500g"],
        features: ["Complete Protein", "Rich in Vitamins", "Natural Superfood", "Fresh Harvest"],
        inStock: true,
        stockCount: 45,
        tags: ["Pollen", "Superfood", "Protein", "Natural"],
        nutritionalInfo: {
          calories: 234,
          protein: 23,
          carbs: 27,
          fat: 5,
          vitamins: ["B-Complex", "Vitamin C", "Vitamin E"],
          minerals: ["Iron", "Zinc", "Magnesium"],
        },
        harvestDate: "February 2025",
        servingSize: "1 teaspoon (5g)",
        origin: "Mau Forest, Nakuru",
        organicCertified: true,
        uses: ["Smoothie Booster", "Energy Supplement", "Immune Support", "Natural Protein"],
        vendorId: 1,
      },
    ],
  },
  {
    id: 2,
    name: "Rift Valley Organic Farm",
    location: "Eldoret, Kenya",
    logo: "/placeholder.svg?height=60&width=60&text=RVO",
    description:
      "Certified organic vegetables grown using sustainable farming practices in the fertile Rift Valley. Fresh, nutritious, and pesticide-free produce delivered straight from our farm.",
    redirectUrl: "https://riftvalleyorganic.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 278,
    deliveryTime: "1-3 days",
    deliveryFee: { amount: 250, currency: "KSH" },
    minimumOrder: { amount: 600, currency: "KSH" },
    verified: true,
    products: [
      {
        id: 201,
        name: "Organic Baby Spinach - 500g",
        imageUrl: "/placeholder.svg?height=300&width=400&text=Baby+Spinach",
        currentPrice: { amount: 180, currency: "KSH" },
        originalPrice: { amount: 220, currency: "KSH" },
        category: "Organic Vegetables",
        subcategory: "Leafy Greens",
        subtype: "Spinach",
        description:
          "Tender baby spinach leaves grown organically in the Rift Valley. Rich in iron, vitamins, and antioxidants. Perfect for salads and smoothies.",
        brand: "Rift Valley Organic Farm",
        isPopular: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.8,
        reviewCount: 134,
        sizes: ["250g", "500g", "1kg"],
        features: ["Pesticide-Free", "Rich in Iron", "Tender Leaves", "Fresh Harvest"],
        inStock: true,
        stockCount: 200,
        tags: ["Spinach", "Organic", "Leafy", "Iron-Rich"],
        nutritionalInfo: {
          calories: 23,
          protein: 2.9,
          carbs: 3.6,
          fiber: 2.2,
          vitamins: ["Vitamin K", "Vitamin A", "Folate"],
          minerals: ["Iron", "Magnesium", "Potassium"],
        },
        harvestDate: "March 2025",
        servingSize: "100g",
        origin: "Rift Valley, Eldoret",
        organicCertified: true,
        uses: ["Salads", "Smoothies", "Cooking", "Juicing"],
        vendorId: 2,
      },
      {
        id: 202,
        name: "Organic Rainbow Carrots - 1kg",
        imageUrl: "/placeholder.svg?height=300&width=400&text=Rainbow+Carrots",
        currentPrice: { amount: 220, currency: "KSH" },
        originalPrice: { amount: 280, currency: "KSH" },
        category: "Organic Vegetables",
        subcategory: "Root Vegetables",
        subtype: "Carrots",
        description:
          "Colorful organic carrots in purple, orange, and yellow varieties. High in beta-carotene and natural sweetness.",
        brand: "Rift Valley Organic Farm",
        isNew: true,
        dateAdded: "2025-03-20T10:30:00Z",
        rating: 4.7,
        reviewCount: 98,
        sizes: ["500g", "1kg", "2kg"],
        features: ["Multiple Varieties", "High Beta-Carotene", "Natural Sweetness", "Colorful"],
        inStock: true,
        stockCount: 150,
        tags: ["Carrots", "Organic", "Rainbow", "Beta-Carotene"],
        hotDealEnds: "2025-04-20T23:59:59Z",
        isHotDeal: true,
        nutritionalInfo: {
          calories: 41,
          protein: 0.9,
          carbs: 10,
          fiber: 2.8,
          vitamins: ["Vitamin A", "Vitamin K", "Vitamin C"],
          minerals: ["Potassium", "Manganese"],
        },
        harvestDate: "March 2025",
        servingSize: "100g",
        origin: "Rift Valley, Eldoret",
        organicCertified: true,
        uses: ["Raw Snacking", "Cooking", "Juicing", "Baking"],
        vendorId: 2,
      },
      {
        id: 203,
        name: "Organic Hass Avocados - 6 pieces",
        imageUrl: "/placeholder.svg?height=300&width=400&text=Hass+Avocados",
        currentPrice: { amount: 420, currency: "KSH" },
        originalPrice: { amount: 480, currency: "KSH" },
        category: "Organic Vegetables",
        subcategory: "Fruits",
        subtype: "Avocados",
        description:
          "Premium Hass avocados grown organically. Creamy texture and rich flavor, perfect for healthy fats and nutrients.",
        brand: "Rift Valley Organic Farm",
        dateAdded: "2025-03-05T10:30:00Z",
        rating: 4.9,
        reviewCount: 187,
        sizes: ["3 pieces", "6 pieces", "12 pieces"],
        features: ["Creamy Texture", "Healthy Fats", "Premium Quality", "Ready to Eat"],
        inStock: true,
        stockCount: 80,
        tags: ["Avocado", "Organic", "Healthy Fats", "Premium"],
        nutritionalInfo: {
          calories: 160,
          protein: 2,
          carbs: 9,
          fiber: 7,
          fat: 15,
          vitamins: ["Vitamin K", "Vitamin E", "Folate"],
          minerals: ["Potassium", "Magnesium"],
        },
        harvestDate: "March 2025",
        servingSize: "1 medium avocado (150g)",
        origin: "Rift Valley, Eldoret",
        organicCertified: true,
        uses: ["Guacamole", "Salads", "Toast", "Smoothies"],
        vendorId: 2,
      },
    ],
  },
  {
    id: 3,
    name: "Highland Dairy Cooperative",
    location: "Meru, Kenya",
    logo: "/placeholder.svg?height=60&width=60&text=HDC",
    description:
      "Fresh dairy products from grass-fed cattle in the highlands of Meru. Our cooperative ensures quality, freshness, and fair prices for both farmers and consumers.",
    redirectUrl: "https://highlanddairy.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 234,
    deliveryTime: "Same day",
    deliveryFee: { amount: 150, currency: "KSH" },
    minimumOrder: { amount: 500, currency: "KSH" },
    verified: true,
    products: [
      {
        id: 301,
        name: "Fresh Whole Milk - 1 Liter",
        imageUrl: "/placeholder.svg?height=300&width=400&text=Fresh+Milk",
        currentPrice: { amount: 120, currency: "KSH" },
        originalPrice: { amount: 140, currency: "KSH" },
        category: "Dairy Products",
        subcategory: "Fresh Milk",
        subtype: "Whole Milk",
        description:
          "Fresh whole milk from grass-fed highland cattle. Rich, creamy, and packed with natural nutrients. Delivered fresh daily.",
        brand: "Highland Dairy Cooperative",
        isPopular: true,
        dateAdded: "2025-03-22T10:30:00Z",
        rating: 4.8,
        reviewCount: 198,
        sizes: ["500ml", "1L", "2L"],
        features: ["Grass-Fed Cattle", "Daily Fresh", "Rich & Creamy", "Natural Nutrients"],
        inStock: true,
        stockCount: 300,
        tags: ["Milk", "Fresh", "Whole", "Grass-Fed"],
        nutritionalInfo: {
          calories: 61,
          protein: 3.2,
          carbs: 4.8,
          fat: 3.3,
          vitamins: ["Vitamin D", "Vitamin B12", "Riboflavin"],
          minerals: ["Calcium", "Phosphorus", "Potassium"],
        },
        harvestDate: "Daily",
        servingSize: "100ml",
        origin: "Meru Highlands",
        uses: ["Drinking", "Cooking", "Baking", "Cereal"],
        vendorId: 3,
      },
      {
        id: 302,
        name: "Greek Style Yogurt - 500g",
        imageUrl: "/placeholder.svg?height=300&width=400&text=Greek+Yogurt",
        currentPrice: { amount: 280, currency: "KSH" },
        originalPrice: { amount: 320, currency: "KSH" },
        category: "Dairy Products",
        subcategory: "Yogurt",
        subtype: "Greek Yogurt",
        description:
          "Thick, creamy Greek-style yogurt made from highland milk. High in protein and probiotics for digestive health.",
        brand: "Highland Dairy Cooperative",
        isNew: true,
        dateAdded: "2025-03-25T10:30:00Z",
        rating: 4.7,
        reviewCount: 76,
        sizes: ["250g", "500g", "1kg"],
        features: ["High Protein", "Probiotic", "Thick & Creamy", "Natural"],
        inStock: true,
        stockCount: 120,
        tags: ["Yogurt", "Greek", "Probiotic", "High Protein"],
        hotDealEnds: "2025-04-25T23:59:59Z",
        isHotDeal: true,
        nutritionalInfo: {
          calories: 59,
          protein: 10,
          carbs: 3.6,
          fat: 0.4,
          vitamins: ["Vitamin B12", "Riboflavin"],
          minerals: ["Calcium", "Phosphorus", "Potassium"],
        },
        harvestDate: "Weekly",
        servingSize: "100g",
        origin: "Meru Highlands",
        uses: ["Breakfast", "Snacks", "Smoothies", "Cooking"],
        vendorId: 3,
      },
    ],
  },
  {
    id: 4,
    name: "Kenyan Spice Gardens",
    location: "Taita Taveta, Kenya",
    logo: "/placeholder.svg?height=60&width=60&text=KSG",
    description:
      "Premium herbs and spices grown in the diverse climate of Taita Taveta. We specialize in medicinal herbs and aromatic spices used in traditional Kenyan cuisine and natural healing.",
    redirectUrl: "https://kenyanspicegardens.com",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 189,
    deliveryTime: "2-4 days",
    deliveryFee: { amount: 300, currency: "KSH" },
    minimumOrder: { amount: 1000, currency: "KSH" },
    verified: true,
    products: [
      {
        id: 401,
        name: "Organic Moringa Powder - 200g",
        imageUrl: "/placeholder.svg?height=300&width=400&text=Moringa+Powder",
        currentPrice: { amount: 450, currency: "KSH" },
        originalPrice: { amount: 520, currency: "KSH" },
        category: "Herbs & Spices",
        subcategory: "Medicinal Herbs",
        subtype: "Moringa",
        description:
          "Pure moringa leaf powder from organically grown trees. Known as the 'miracle tree', moringa is packed with vitamins, minerals, and antioxidants.",
        brand: "Kenyan Spice Gardens",
        isPopular: true,
        dateAdded: "2025-03-12T10:30:00Z",
        rating: 4.9,
        reviewCount: 145,
        sizes: ["100g", "200g", "500g"],
        features: ["Superfood", "High in Vitamins", "Antioxidant Rich", "Pure Powder"],
        inStock: true,
        stockCount: 90,
        tags: ["Moringa", "Superfood", "Medicinal", "Organic"],
        nutritionalInfo: {
          calories: 205,
          protein: 27,
          carbs: 39,
          fiber: 19,
          vitamins: ["Vitamin A", "Vitamin C", "Vitamin E"],
          minerals: ["Iron", "Calcium", "Potassium"],
        },
        harvestDate: "February 2025",
        servingSize: "1 teaspoon (3g)",
        origin: "Taita Taveta",
        organicCertified: true,
        uses: ["Smoothies", "Tea", "Cooking", "Health Supplement"],
        vendorId: 4,
      },
      {
        id: 402,
        name: "Premium Cardamom Pods - 100g",
        imageUrl: "/placeholder.svg?height=300&width=400&text=Cardamom+Pods",
        currentPrice: { amount: 680, currency: "KSH" },
        originalPrice: { amount: 780, currency: "KSH" },
        category: "Herbs & Spices",
        subcategory: "Cooking Spices",
        subtype: "Cardamom",
        description:
          "Aromatic green cardamom pods grown in the highlands. Essential for Kenyan tea, Indian cuisine, and traditional spice blends.",
        brand: "Kenyan Spice Gardens",
        dateAdded: "2025-02-28T10:30:00Z",
        rating: 4.8,
        reviewCount: 112,
        sizes: ["50g", "100g", "250g"],
        features: ["Aromatic", "Premium Quality", "Whole Pods", "Fresh Harvest"],
        inStock: true,
        stockCount: 65,
        tags: ["Cardamom", "Spice", "Aromatic", "Premium"],
        hotDealEnds: "2025-04-28T23:59:59Z",
        isHotDeal: true,
        nutritionalInfo: {
          calories: 311,
          protein: 11,
          carbs: 68,
          fiber: 28,
          vitamins: ["Vitamin C", "Niacin"],
          minerals: ["Iron", "Manganese", "Magnesium"],
        },
        harvestDate: "February 2025",
        servingSize: "1 teaspoon (2g)",
        origin: "Taita Taveta Highlands",
        organicCertified: true,
        uses: ["Tea Spice", "Cooking", "Baking", "Traditional Medicine"],
        vendorId: 4,
      },
      {
        id: 403,
        name: "Dried Chamomile Flowers - 50g",
        imageUrl: "/placeholder.svg?height=300&width=400&text=Chamomile+Flowers",
        currentPrice: { amount: 320, currency: "KSH" },
        originalPrice: { amount: 380, currency: "KSH" },
        category: "Herbs & Spices",
        subcategory: "Tea Herbs",
        subtype: "Chamomile",
        description:
          "Dried chamomile flowers perfect for calming herbal tea. Known for its relaxing properties and gentle, apple-like flavor.",
        brand: "Kenyan Spice Gardens",
        isNew: true,
        dateAdded: "2025-03-28T10:30:00Z",
        rating: 4.6,
        reviewCount: 58,
        sizes: ["25g", "50g", "100g"],
        features: ["Calming", "Natural", "Dried Flowers", "Herbal Tea"],
        inStock: true,
        stockCount: 75,
        tags: ["Chamomile", "Herbal Tea", "Calming", "Natural"],
        nutritionalInfo: {
          calories: 1,
          carbs: 0.2,
          vitamins: ["Vitamin A"],
          minerals: ["Calcium", "Magnesium"],
        },
        harvestDate: "March 2025",
        servingSize: "1 teaspoon (1g)",
        origin: "Taita Taveta",
        organicCertified: true,
        uses: ["Herbal Tea", "Relaxation", "Sleep Aid", "Natural Remedy"],
        vendorId: 4,
      },
    ],
  },
]

// Helper function to transform vendors to products
export const transformAgricultureToProducts = (vendors: AgricultureVendor[]) => {
  return vendors.flatMap((vendor) =>
    vendor.products.map((product) => ({
      ...product,
      vendorName: vendor.name,
      vendorLocation: vendor.location,
    })),
  )
}

// Generate trending and popular products
export const trendingAgricultureProducts = mockAgricultureVendors
  .flatMap((vendor) => vendor.products)
  .filter((product) => product.isNew || product.isHotDeal)
  .slice(0, 6)
  .map((product) => ({
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl,
    currentPrice: product.currentPrice,
    originalPrice: product.originalPrice,
    category: product.category,
    description: product.description.substring(0, 80) + "...",
    brand: product.brand,
    rating: product.rating,
    reviewCount: product.reviewCount,
    vendorId: product.vendorId,
    vendorName: mockAgricultureVendors.find((v) => v.id === product.vendorId)?.name || "",
  }))

export const popularAgricultureProducts = mockAgricultureVendors
  .flatMap((vendor) => vendor.products)
  .filter((product) => product.isPopular)
  .slice(0, 6)
  .map((product) => ({
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl,
    currentPrice: product.currentPrice,
    originalPrice: product.originalPrice,
    category: product.category,
    description: product.description.substring(0, 80) + "...",
    brand: product.brand,
    rating: product.rating,
    reviewCount: product.reviewCount,
    vendorId: product.vendorId,
    vendorName: mockAgricultureVendors.find((v) => v.id === product.vendorId)?.name || "",
  }))
