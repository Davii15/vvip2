import type { ProductRanking } from "@/components/TrendingPopularSection"

// Mock data for trending products in entertainment
export const trendingProducts: ProductRanking[] = [
  {
    id: "tr1",
    name: "Cardiology Consultation with ECG",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 5000,
      currency: "KSh",
    },
    rating: 4.9,
    category: "Cardiologist",
    vendor: "Elite Medical Specialist",
    rank: 1,
    url: "/health-services",
    badges: ["trending", "hot"],
  },
  
]

// Mock data for most popular products in entertainment
export const popularProducts: ProductRanking[] = [
  {
    id: "pop1",
    name: "Comprehensive Gynecologist Checkup",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 4500,
      currency: "KSh",
    },
    rating: 4.9,
    category: "Gynecologist",
    vendor: "Women's Health Specialist",
    rank: 1,
    url: "/health-services",
    badges: ["popular", "hot"],
  },
  
]

