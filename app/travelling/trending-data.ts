import type { ProductRanking } from "@/components/TrendingPopularSection"

// Mock data for trending products in entertainment
export const trendingProducts: ProductRanking[] = [
  {
    id: "tr1",
    name: "Airport Transfer Premium",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 2500,
      currency: "KSh",
    },
    rating: 4.9,
    category: "Digital Cabs",
    vendor: "SafariRide",
    rank: 1,
    url: "/travelling",
    badges: ["trending", "hot"],
  },
  {
    id: "tr2",
    name: "Western Kenya Exproler  Pass",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 4500,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Matatu Saccos",
    vendor: "Northrift Shuttle Sacco",
    rank: 2,
    url: "/travelling",
    badges: ["trending"],
  },
  
]

// Mock data for most popular products in entertainment
export const popularProducts: ProductRanking[] = [
  {
    id: "pop1",
    name: "Nairobi City Pass Route Pass",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 1500,
      currency: "KSh",
    },
    rating: 4.9,
    category: "Matatu Saccos",
    vendor: "Super Metra Sacco",
    rank: 1,
    url: "/travelling",
    badges: ["popular", "hot"],
  },
 
  {
    id: "pop2",
    name: "Diani Beach Gateway",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 35000,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Local Destination",
    vendor: "Kenya Exproler Tour",
    rank: 2,
    url: "/travelling",
    badges: ["popular", "hot"],
  },
]

