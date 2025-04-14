import type { ProductRanking } from "@/components/TrendingPopularSection"

// Mock data for trending products in retail and supermarket
export const trendingProducts: ProductRanking[] = [
  {
    id: "tr1",
    name: "2025 Luxury Sedan Edition",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 4500000,
      currency: "KSh",
    },
    rating: 4.8,
    category: "New Cars",
    vendor: "Auto sellers",
    rank: 1,
    url: "/car-deals",
    badges: ["trending", "hot"],
  },
  {
    id: "tr2",
    name: "2022 Executive Sedan -Low Edition",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 3800000,
      currency: "KSh",
    },
    rating: 4.7,
    category: "Used Cars",
    vendor: "Executive Sedan Auto sellers",
    rank: 2,
    url: "/car-deals",
    badges: ["trending"],
  },
 
]

// Mock data for most popular products in retail and supermarket
export const popularProducts: ProductRanking[] = [
  {
    id: "pop1",
    name: "2021 Family SUV 7 seater",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 3200000,
      currency: "KSh",
    },
    rating: 4.9,
    category: "New cars",
    vendor: "SUV sellers",
    rank: 1,
    url: "/agriculture",
    badges: ["popular", "hot"],
  },
  {
    id: "pop2",
    name: "Premium Alloy Wheels Set - 18 inch",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 120000,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Wheels and Spares",
    vendor: "Narok Ranchers",
    rank: 2,
    url: "/agriculture",
    badges: ["popular"],
  },
  
]

