import type { ProductRanking } from "@/components/TrendingPopularSection"

// Mock data for trending products in retail and supermarket
export const trendingProducts: ProductRanking[] = [
  {
    id: "tr1",
    name: "Tropical Paradise Juice",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 120,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Juice",
    vendor: "Refreshment Haven",
    rank: 1,
    url: "/drinks",
    badges: ["trending", "hot"],
  },
  {
    id: "tr2",
    name: "Classic Cola Zero",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 80,
      currency: "KSh",
    },
    rating: 4.7,
    category: "Cola",
    vendor: "Refreshment Haven",
    rank: 2,
    url: "/drinks",
    badges: ["trending"],
  },
  {
    id: "tr3",
    name: "Dragon Fruit Lemonade",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 220,
      currency: "KSh",
    },
    rating: 4.9,
    category: "Soft Drinks",
    vendor: "Exotics Ellirs",
    rank: 3,
    url: "/agriculture",
    badges: ["trending", "popular"],
  },
  
]

// Mock data for most popular products in retail and supermarket
export const popularProducts: ProductRanking[] = [
  {
    id: "pop1",
    name: "Highland Single Mart Whisky",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 4500,
      currency: "KSh",
    },
    rating: 4.9,
    category: "Whisky",
    vendor: "Premium spirits",
    rank: 1,
    url: "/drinks",
    badges: ["popular", "hot"],
  },
  
]

