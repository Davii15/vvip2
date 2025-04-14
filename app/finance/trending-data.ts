import type { ProductRanking } from "@/components/TrendingPopularSection"

// Mock data for trending products in entertainment
export const trendingProducts: ProductRanking[] = [
  {
    id: "tr1",
    name: "Quick Cash Advance",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 12.5,
      currency: "KSh",
    },
    rating: 4.9,
    category: "Personal Loans",
    vendor: "GreenBank",
    rank: 1,
    url: "/finance",
    badges: ["trending", "hot"],
  },
  {
    id: "tr2",
    name: "Home Improvement Loan",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 8.75,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Personal Loans",
    vendor: "WealthWise Finance",
    rank: 2,
    url: "/finance",
    badges: ["trending"],
  },
 
]

// Mock data for most popular products in entertainment
export const popularProducts: ProductRanking[] = [
  {
    id: "pop1",
    name: "Green Energy Fund",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 14.25,
      currency: "KSh",
    },
    rating: 4.9,
    category: "Investment Opportunities",
    vendor: "EcoInvest Capital",
    rank: 1,
    url: "/finance",
    badges: ["popular", "hot"],
  },
  {
    id: "pop2",
    name: "High-Yield Savings Account",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 7.5,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Savings Account",
    vendor: "ProsperityBank",
    rank: 2,
    url: "/entertainment/shop/products/music-streaming",
    badges: ["popular"],
  },
 


]

