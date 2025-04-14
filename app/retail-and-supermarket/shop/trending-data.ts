import type { ProductRanking } from "@/components/TrendingPopularSection"

// Mock data for trending products in retail and supermarket
export const trendingProducts: ProductRanking[] = [
  {
    id: "tr1",
    name: "Students backpack-blue",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 1800,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Stationery",
    vendor: "School Supplies Store",
    rank: 1,
    url: "/retail-and-supermarket",
    badges: ["trending", "hot"],
  },
  {
    id: "tr2",
    name: "Wedding cake-3tier",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 1800,
      currency: "KSh",
    },
    rating: 4.7,
    category: "Wedding cakes",
    vendor: "Sweet Delight Bakery",
    rank: 2,
    url: "/retail-and-supermarket",
    badges: ["trending"],
  },
  {
    id: "tr3",
    name: "Premium Kenyan Coffee Beans",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 12.99,
      currency: "KSh",
    },
    rating: 4.9,
    category: "Beverages",
    vendor: "Mount Kenya Coffee",
    rank: 3,
    url: "/retail-and-supermarket/shop/products/kenyan-coffee",
    badges: ["trending", "popular"],
  },
  {
    id: "tr4",
    name: "Fresh Tilapia Fish (1kg)",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 8.75,
      currency: "KSh",
    },
    rating: 4.6,
    category: "Seafood",
    vendor: "Lake Victoria Fisheries",
    rank: 4,
    url: "/retail-and-supermarket/shop/products/tilapia-fish",
    badges: ["trending"],
  },
 
]

// Mock data for most popular products in retail and supermarket
export const popularProducts: ProductRanking[] = [
  {
    id: "pop1",
    name: "Maasai Honey (500ml)",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 9.99,
      currency: "KSh",
    },
    rating: 4.9,
    category: "Condiments",
    vendor: "Maasai Beekeepers",
    rank: 1,
    url: "/retail-and-supermarket/shop/products/maasai-honey",
    badges: ["popular", "hot"],
  },
  {
    id: "pop2",
    name: "Grass-Fed Beef Steak (500g)",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 15.5,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Meat",
    vendor: "Narok Ranchers",
    rank: 2,
    url: "/retail-and-supermarket/shop/products/beef-steak",
    badges: ["popular","trending","hot"],
  },
  {
    id: "pop3",
    name: "Organic Bananas (Bunch)",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 2.99,
      currency: "KSh",
    },
    rating: 4.7,
    category: "Fruits",
    vendor: "Kagio Market",
    rank: 3,
    url: "/retail-and-supermarket/shop/products/organic-bananas",
    badges: ["popular", "trending"],
  },
  
]

