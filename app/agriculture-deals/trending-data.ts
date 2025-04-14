import type { ProductRanking } from "@/components/TrendingPopularSection"

// Mock data for trending products in retail and supermarket
export const trendingProducts: ProductRanking[] = [
  {
    id: "tr1",
    name: "Compact Tractor Model X200",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 4500000,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Machinery",
    vendor: "Farm Tech solutions",
    rank: 1,
    url: "/agriculture",
    badges: ["trending", "hot"],
  },
  {
    id: "tr2",
    name: "Hybrid Maize",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 1800,
      currency: "KSh",
    },
    rating: 4.7,
    category: "Seedlings",
    vendor: "Green Harvest Solutions",
    rank: 2,
    url: "/agriculture",
    badges: ["trending"],
  },
  {
    id: "tr3",
    name: "Precision Sprayer Drone",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 180000,
      currency: "KSh",
    },
    rating: 4.9,
    category: "Machinery",
    vendor: "AgriGrow Experts",
    rank: 3,
    url: "/agriculture",
    badges: ["trending", "popular"],
  },

]

// Mock data for most popular products in retail and supermarket
export const popularProducts: ProductRanking[] = [
  {
    id: "pop1",
    name: "Precision Sprayer Drone",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 180000,
      currency: "KSh",
    },
    rating: 4.9,
    category: "Machinery",
    vendor: "AgriGrow Experts",
    rank: 1,
    url: "/agriculture",
    badges: ["popular", "hot"],
  },
  {
    id: "pop2",
    name: "Hybrid Maize",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 1800,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Seedlings",
    vendor: "Green Harvest Solutions",
    rank: 2,
    url: "/agriculture",
    badges: ["popular"],
  },
  {
    id: "pop3",
    name: "Compact Tractor Model X200",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 4500000,
      currency: "KSh",
    },
    rating: 4.7,
    category: "Machinery",
    vendor: "Farm Tech Solutions",
    rank: 3,
    url: "/agriculture",
    badges: ["popular", "trending"],
  },
  
]

