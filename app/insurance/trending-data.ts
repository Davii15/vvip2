import type { ProductRanking } from "@/components/TrendingPopularSection"

// Mock data for trending products in entertainment
export const trendingProducts: ProductRanking[] = [
  {
    id: "tr1",
    name: "Comprehensive Home owners Insurance",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 15000,
      currency: "KSh",
    },
    rating: 4.9,
    category: "Property Insurance",
    vendor: "Secure Home Insurance Company",
    rank: 1,
    url: "/insurance",
    badges: ["trending", "hot"],
  },
  {
    id: "tr2",
    name: "Accidents and Emergency Cover",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 8000,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Health Insurance Cover",
    vendor: "Afya Health Insurance",
    rank: 2,
    url: "/insurance",
    badges: ["trending"],
  },
  {
    id: "tr3",
    name: "Critical Illness Protection",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 12000,
      currency: "KSh",
    },
    rating: 4.7,
    category: "Health Insurance",
    vendor: "Premium Health Insurance",
    rank: 3,
    url: "/insurance",
    badges: ["trending", "popular","hot"],
  },
 
]

// Mock data for most popular products in entertainment
export const popularProducts: ProductRanking[] = [
  {
    id: "pop1",
    name: "Family Health Insurance Plan",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 5000,
      currency: "KSh",
    },
    rating: 4.9,
    category: "Health Insurance Plan",
    vendor: "Premium Health Insurance Limited",
    rank: 1,
    url: "/insurance",
    badges: ["popular", "hot"],
  },
  {
    id: "pop2",
    name: "Education Endowment Plan",
    image: "/placeholder.svg?height=400&width=400",
    price: {
      amount: 3500,
      currency: "KSh",
    },
    rating: 4.8,
    category: "Education Insurance",
    vendor: "Safeguard Life Insurance",
    rank: 2,
    url: "/insurance",
    badges: ["popular","trending"],
  },
  
]

