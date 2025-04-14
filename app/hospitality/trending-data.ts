import type { ProductRanking } from "@/components/TrendingPopularSection"

// Mock data for trending products in entertainment
export const trendingProducts: ProductRanking[] = [
  {
    id: "tr1",
    name: "Deluxe Hotel with Mountain View",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 12000,
      currency: "KSh",
    },
    rating: 4.9,
    category: "Hotels",
    vendor: "Serene Sky Hotel",
    rank: 1,
    url: "/hospitality",
    badges: ["trending", "hot"],
  },
  {
    id: "tr2",
    name: "Executive Suite with Lounge Access",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 18000,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Hotels",
    vendor: "Serene Sky Hotel",
    rank: 2,
    url: "/hospitality",
    badges: ["trending"],
  },
  {
    id: "tr3",
    name: "Executive 5-course Dinner Experience",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 6500,
      currency: "KSh",
    },
    rating: 4.7,
    category: "Restaurant",
    vendor: "Savory Height Hotel",
    rank: 3,
    url: "/hospitality",
    badges: ["trending", "popular"],
  },
  {
    id: "tr4",
    name: "Weekend Brunch Buffet",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 3500,
      currency: "KSh",
    },
    rating: 4.6,
    category: "Restaurants",
    vendor: "Savory Heights Hotel",
    rank: 4,
    url: "/hospitality",
    badges: ["trending"],
  },
 
]

// Mock data for most popular products in entertainment
export const popularProducts: ProductRanking[] = [
  {
    id: "pop1",
    name: "Craft Cock tail Experience",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 2800,
      currency: "KSh",
    },
    rating: 4.9,
    category: "Bar and Lounges",
    vendor: "Skyline Lounge and Bars",
    rank: 1,
    url: "/entertainment/shop/products/maasai-mara-safari",
    badges: ["popular", "hot"],
  },
  {
    id: "pop2",
    name: "Beach BBQ and Drinks",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 2500,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Bar and Lounges",
    vendor: "Heaveneth Feelings bar",
    rank: 2,
    url: "/hospitality",
    badges: ["popular","hot","trending"],
  },
  
  
]

