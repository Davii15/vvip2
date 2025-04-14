import type { ProductRanking } from "@/components/TrendingPopularSection"

// Mock data for trending products in retail and supermarket
export const trendingProducts: ProductRanking[] = [
  {
    id: "tr1",
    name: "Buildings and constructio Materials",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 750,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Cement",
    vendor: "Premier Construction Supplies",
    rank: 1,
    url: "/construction-materials",
    badges: ["trending", "hot"],
  },
  
  
]

// Mock data for most popular products in retail and supermarket
export const popularProducts: ProductRanking[] = [
  {
    id: "pop1",
    name: "Reinforced Steel Bars (12mm x 12m)",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 1200,
      currency: "KSh",
    },
    rating: 4.9,
    category: "Steel Bars",
    vendor: "Javaar Stell Hardware",
    rank: 1,
    url: "/construction-materials",
    badges: ["popular", "hot"],
  },
  {
    id: "pop2",
    name: "Mabati Masters",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 850,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Roofing",
    vendor: "Mabati Masters",
    rank: 2,
    url: "/construction-materials",
    badges: ["popular"],
  },
  {
    id: "pop3",
    name: "Stone Coated Roofing Tiles (Classic Profile)",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 3500,
      currency: "KSh",
    },
    rating: 4.7,
    category: "Tiles",
    vendor: "Stone Coated Roofers",
    rank: 3,
    url: "/construction-materials",
    badges: ["popular", "trending"],
  },
  {
    id: "pop4",
    name: "ToolMart Steelers",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 12500,
      currency: "KSh",
    },
    rating: 4.6,
    category: "Power Tools",
    vendor: "Tool Mart Steelers",
    rank: 4,
    url: "/retail-and-supermarket/shop/products/fresh-milk",
    badges: ["popular"],
  },
  
]

