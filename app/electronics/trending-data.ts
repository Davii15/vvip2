import type { ProductRanking } from "@/components/TrendingPopularSection"

// Mock data for trending products in entertainment
export const trendingProducts: ProductRanking[] = [
  {
    id: "tr1",
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 4500,
      currency: "KSh",
    },
    rating: 4.9,
    category: "HeadPhones",
    vendor: "SoundWave Audio",
    rank: 1,
    url: "/electronics",
    badges: ["trending", "hot"],
  },
  {
    id: "tr2",
    name: "Samsung Microwave Oven with Grill - 28L",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 25000,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Microwave",
    vendor: "Kitchen Appliances",
    rank: 2,
    url: "/electronics",
    badges: ["trending"],
  },
  {
    id: "tr3",
    name: "MacBook Pro 16 M3 Pro - 32GB RAM, 1TB SSD",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 380000,
      currency: "KSh",
    },
    rating: 4.7,
    category: "Laptops",
    vendor: "ComputerWorld Kenya",
    rank: 3,
    url: "/electronics",
    badges: ["trending", "popular"],
  },
  
]

// Mock data for most popular products in entertainment
export const popularProducts: ProductRanking[] = [
  {
    id: "pop1",
    name: 'LG 55" OLED evo G3 4K Smart Tv ',
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 65000,
      currency: "KSh",
    },
    rating: 4.9,
    category: "TVS",
    vendor: " ScreenMasters",
    rank: 1,
    url: "/electronics",
    badges: ["popular", "hot"],
  },
  {
    id: "pop2",
    name: "Samsung Galaxy S23 Ultra - 256GB",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 9.5,
      currency: "KSh",
    },
    rating: 4.8,
    category: "SmartPhones",
    vendor: "MobileTech solutions",
    rank: 2,
    url: "/electronics",
    badges: ["popular"],
  },
  
]

