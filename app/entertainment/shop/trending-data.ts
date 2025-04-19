// Types
interface Price {
  amount: number
  currency: string
}

interface TrendingProduct {
  id: string
  name: string
  imageUrl: string
  currentPrice: Price
  originalPrice: Price
  category: string
  brand: string
  rating: number
  reviewCount: number
  discount?: number
}

// Trending products data
export const trendingProducts: TrendingProduct[] = [
  {
    id: "tp1",
    name: "Nike Air Zoom Pegasus 39 Running Shoes",
    imageUrl: "/placeholder.svg?height=300&width=400",
    currentPrice: { amount: 9500, currency: "KSH" },
    originalPrice: { amount: 12000, currency: "KSH" },
    category: "Footwear",
    brand: "Nike",
    rating: 4.8,
    reviewCount: 245,
    discount: 21,
  },
  {
    id: "tp2",
    name: "Adidas Ultraboost 22 Women's Running Shoes",
    imageUrl: "/placeholder.svg?height=300&width=400",
    currentPrice: { amount: 12000, currency: "KSH" },
    originalPrice: { amount: 18000, currency: "KSH" },
    category: "Footwear",
    brand: "Adidas",
    rating: 4.9,
    reviewCount: 76,
    discount: 33,
  },
  {
    id: "tp3",
    name: "Fender Player Stratocaster Electric Guitar",
    imageUrl: "/placeholder.svg?height=300&width=400",
    currentPrice: { amount: 75000, currency: "KSH" },
    originalPrice: { amount: 95000, currency: "KSH" },
    category: "Guitars",
    brand: "Fender",
    rating: 4.8,
    reviewCount: 36,
    discount: 21,
  },
  {
    id: "tp4",
    name: "Under Armour Men's Tech 2.0 Short Sleeve T-Shirt",
    imageUrl: "/placeholder.svg?height=300&width=400",
    currentPrice: { amount: 2200, currency: "KSH" },
    originalPrice: { amount: 3000, currency: "KSH" },
    category: "Men's Apparel",
    brand: "Under Armour",
    rating: 4.7,
    reviewCount: 312,
    discount: 27,
  },
  {
    id: "tp5",
    name: "Yamaha P-125 Digital Piano",
    imageUrl: "/placeholder.svg?height=300&width=400",
    currentPrice: { amount: 75000, currency: "KSH" },
    originalPrice: { amount: 95000, currency: "KSH" },
    category: "Keyboards & Pianos",
    brand: "Yamaha",
    rating: 4.8,
    reviewCount: 89,
    discount: 21,
  },
  {
    id: "tp6",
    name: "Lululemon Align High-Rise Yoga Pants",
    imageUrl: "/placeholder.svg?height=300&width=400",
    currentPrice: { amount: 8500, currency: "KSH" },
    originalPrice: { amount: 12000, currency: "KSH" },
    category: "Women's Apparel",
    brand: "Lululemon",
    rating: 4.9,
    reviewCount: 178,
    discount: 29,
  },
]

// Popular products data
export const popularProducts: TrendingProduct[] = [
  {
    id: "pp1",
    name: "Nike Dri-FIT Men's Running T-Shirt",
    imageUrl: "/placeholder.svg?height=300&width=400",
    currentPrice: { amount: 2500, currency: "KSH" },
    originalPrice: { amount: 3500, currency: "KSH" },
    category: "Men's Apparel",
    brand: "Nike",
    rating: 4.7,
    reviewCount: 128,
    discount: 29,
  },
  {
    id: "pp2",
    name: "Adjustable Dumbbell Set (5-25kg)",
    imageUrl: "/placeholder.svg?height=300&width=400",
    currentPrice: { amount: 18500, currency: "KSH" },
    originalPrice: { amount: 25000, currency: "KSH" },
    category: "Fitness Equipment",
    brand: "Bowflex",
    rating: 4.8,
    reviewCount: 86,
    discount: 26,
  },
  {
    id: "pp3",
    name: "Yamaha F310 Acoustic Guitar",
    imageUrl: "/placeholder.svg?height=300&width=400",
    currentPrice: { amount: 15000, currency: "KSH" },
    originalPrice: { amount: 22000, currency: "KSH" },
    category: "Guitars",
    brand: "Yamaha",
    rating: 4.7,
    reviewCount: 112,
    discount: 32,
  },
  {
    id: "pp4",
    name: "Adidas Predator Edge Football Boots",
    imageUrl: "/placeholder.svg?height=300&width=400",
    currentPrice: { amount: 12000, currency: "KSH" },
    originalPrice: { amount: 18000, currency: "KSH" },
    category: "Footwear",
    brand: "Adidas",
    rating: 4.8,
    reviewCount: 72,
    discount: 33,
  },
  {
    id: "pp5",
    name: "Nike Pro Women's Dri-FIT Sports Bra",
    imageUrl: "/placeholder.svg?height=300&width=400",
    currentPrice: { amount: 2200, currency: "KSH" },
    originalPrice: { amount: 3500, currency: "KSH" },
    category: "Women's Apparel",
    brand: "Nike",
    rating: 4.7,
    reviewCount: 95,
    discount: 37,
  },
  {
    id: "pp6",
    name: "Pearl Export EXX 5-Piece Drum Kit with Hardware",
    imageUrl: "/placeholder.svg?height=300&width=400",
    currentPrice: { amount: 85000, currency: "KSH" },
    originalPrice: { amount: 120000, currency: "KSH" },
    category: "Drums & Percussion",
    brand: "Pearl",
    rating: 4.7,
    reviewCount: 28,
    discount: 29,
  },
]
