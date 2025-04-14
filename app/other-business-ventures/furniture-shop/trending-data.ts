import type { ProductRanking } from "@/components/TrendingPopularSection"

// Mock data for trending products in retail and supermarket
export const trendingProducts: ProductRanking[] = [
  {
    id: "tr1",
    name: "Boardroom table -1 ",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 120000,
      currency: "KSh",
    },
    rating: 4.8,
    category: "office",
    vendor: "victorian Furnitures",
    rank: 1,
    url: "/other-business-ventures/furniture-shop",
    badges: ["trending", "hot"],
  },
  {
    id: "tr2",
    name: "reception desk-table2",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 85000,
      currency: "KSh",
    },
    rating: 4.7,
    category: "office",
    vendor: "ashley-victoria Furniture",
    rank: 2,
    url: "/other-business-ventures/furniture-shop",
    badges: ["trending"],
  },
  
]

// Mock data for most popular products in retail and supermarket
export const popularProducts: ProductRanking[] = [
  {
    id: "pop1",
    name: "boardroom-chairs",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 78000,
      currency: "KSh",
    },
    rating: 4.9,
    category: "office",
    vendor: "woodworks-kenya",
    rank: 1,
    url: "/other-business-ventures/furniture-shop",
    badges: ["popular", "hot"],
  },
  
]

