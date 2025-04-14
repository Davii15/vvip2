import type { ProductRanking } from "@/components/TrendingPopularSection"

// Mock data for trending products in entertainment
export const trendingProducts: ProductRanking[] = [
  {
    id: "tr1",
    name: "Beach Front Land Parcel",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 85000000,
      currency: "KSh",
    },
    rating: 4.9,
    category: "Land",
    vendor: "Coastal Land Holdings",
    rank: 1,
    url: "/real-estate",
    badges: ["trending", "hot"],
  },
  {
    id: "tr2",
    name: "Prime development Land In Karen",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 1500000000,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Land",
    vendor: "Prime Land Investments",
    rank: 2,
    url: "/real-estate",
    badges: ["trending","new","hot"],
  },
  
]

// Mock data for most popular products in entertainment
export const popularProducts: ProductRanking[] = [
  {
    id: "pop1",
    name: "Modern Warehouse with Office space",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 120000000,
      currency: "KSh",
    },
    rating: 4.9,
    category: "commercial",
    vendor: "Indurstrial Property Experts",
    rank: 1,
    url: "/real-estate",
    badges: ["popular", "hot"],
  },
  {
    id: "pop2",
    name: "Retailspace in shopping Mall",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount:350000000,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Commercial",
    vendor: "Business Place solutions",
    rank: 2,
    url: "/real-estate",
    badges: ["popular"],
  },
 
]

