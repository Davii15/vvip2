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

// Trending beauty products data
export const beautyTrendingProducts: TrendingProduct[] = [
  {
    id: "tp1",
    name: "Vitamin C Brightening Serum 20%",
    imageUrl: "/placeholder.svg?height=300&width=300",
    currentPrice: { amount: 3200, currency: "KSH" },
    originalPrice: { amount: 4500, currency: "KSH" },
    category: "Serums & Treatments",
    brand: "Glow & Radiance",
    rating: 4.9,
    reviewCount: 215,
    discount: 29,
  },
  {
    id: "tp2",
    name: "24-Hour Waterproof Liquid Eyeliner",
    imageUrl: "/placeholder.svg?height=300&width=300",
    currentPrice: { amount: 1200, currency: "KSH" },
    originalPrice: { amount: 1800, currency: "KSH" },
    category: "Eyes",
    brand: "Luxe Cosmetics",
    rating: 4.9,
    reviewCount: 245,
    discount: 33,
  },
  {
    id: "tp3",
    name: "Hydra-Boost Gel Cream with Ceramides",
    imageUrl: "/placeholder.svg?height=300&width=300",
    currentPrice: { amount: 2500, currency: "KSH" },
    originalPrice: { amount: 3200, currency: "KSH" },
    category: "Moisturizers",
    brand: "Glow & Radiance",
    rating: 4.8,
    reviewCount: 187,
    discount: 22,
  },
  {
    id: "tp4",
    name: "Long-Wear Matte Liquid Lipstick",
    imageUrl: "/placeholder.svg?height=300&width=300",
    currentPrice: { amount: 1600, currency: "KSH" },
    originalPrice: { amount: 2200, currency: "KSH" },
    category: "Lips",
    brand: "Luxe Cosmetics",
    rating: 4.8,
    reviewCount: 198,
    discount: 27,
  },
  {
    id: "tp5",
    name: "Floral Elegance Eau de Parfum",
    imageUrl: "/placeholder.svg?height=300&width=300",
    currentPrice: { amount: 4500, currency: "KSH" },
    originalPrice: { amount: 6000, currency: "KSH" },
    category: "Women's Perfume",
    brand: "Pure Essence",
    rating: 4.9,
    reviewCount: 178,
    discount: 25,
  },
  {
    id: "tp6",
    name: "Organic Rose Cleansing Balm",
    imageUrl: "/placeholder.svg?height=300&width=300",
    currentPrice: { amount: 2800, currency: "KSH" },
    originalPrice: { amount: 3500, currency: "KSH" },
    category: "Cleansers",
    brand: "Organic Beauty",
    rating: 4.9,
    reviewCount: 156,
    discount: 20,
  },
]

// Popular beauty products data
export const beautyPopularProducts: TrendingProduct[] = [
  {
    id: "pp1",
    name: "Gentle Foaming Cleanser with Hyaluronic Acid",
    imageUrl: "/placeholder.svg?height=300&width=300",
    currentPrice: { amount: 1800, currency: "KSH" },
    originalPrice: { amount: 2500, currency: "KSH" },
    category: "Cleansers",
    brand: "Glow & Radiance",
    rating: 4.8,
    reviewCount: 124,
    discount: 28,
  },
  {
    id: "pp2",
    name: "Rich Repair Night Cream with Peptides",
    imageUrl: "/placeholder.svg?height=300&width=300",
    currentPrice: { amount: 3500, currency: "KSH" },
    originalPrice: { amount: 4800, currency: "KSH" },
    category: "Moisturizers",
    brand: "Luxe Cosmetics",
    rating: 4.9,
    reviewCount: 142,
    discount: 27,
  },
  {
    id: "pp3",
    name: "Skin Perfecting Foundation SPF 25",
    imageUrl: "/placeholder.svg?height=300&width=300",
    currentPrice: { amount: 2800, currency: "KSH" },
    originalPrice: { amount: 3500, currency: "KSH" },
    category: "Face",
    brand: "Luxe Cosmetics",
    rating: 4.8,
    reviewCount: 215,
    discount: 20,
  },
  {
    id: "pp4",
    name: "Lavender & Chamomile Relaxing Body Wash",
    imageUrl: "/placeholder.svg?height=300&width=300",
    currentPrice: { amount: 1200, currency: "KSH" },
    originalPrice: { amount: 1800, currency: "KSH" },
    category: "Body Wash",
    brand: "Pure Essence",
    rating: 4.8,
    reviewCount: 156,
    discount: 33,
  },
  {
    id: "pp5",
    name: "Moisturizing Shampoo for Dry Hair",
    imageUrl: "/placeholder.svg?height=300&width=300",
    currentPrice: { amount: 1800, currency: "KSH" },
    originalPrice: { amount: 2500, currency: "KSH" },
    category: "Shampoo",
    brand: "Hair Haven",
    rating: 4.7,
    reviewCount: 165,
    discount: 28,
  },
  {
    id: "pp6",
    name: "Volumizing Mascara with Keratin",
    imageUrl: "/placeholder.svg?height=300&width=300",
    currentPrice: { amount: 1500, currency: "KSH" },
    originalPrice: { amount: 2200, currency: "KSH" },
    category: "Eyes",
    brand: "Glow & Radiance",
    rating: 4.7,
    reviewCount: 178,
    discount: 32,
  },
]
