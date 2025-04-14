// Types for the retail and supermarket shop

export interface Price {
    amount: number
    currency: string
  }
  
  export interface Product {
    id: string
    name: string
    category: string
    subCategory: string
    currentPrice: Price
    originalPrice: Price
    unit: string
    image: string
    rating: number
    reviewCount: number
    isNew?: boolean
    isHotDeal?: boolean
    isFeatured?: boolean
    stock: number
    description: string
    origin: string
    isOrganic: boolean
    vendor?: string
    market?: string // Added market field to identify which market the product belongs to
    location?: string
    nutritionalInfo?: string
    harvestDate?: string
    expiryDate?: string
    storageInfo?: string
    badges?: string[]
    imageUrl?: string
    hotDealEnds?: string
  }
  
  export interface Market {
    id: string
    name: string
    description: string
    logo: string
    location: string
    specialties: string[]
    featured: boolean
  }
  
  export interface HotDeal {
    id: string
    name: string
    imageUrl: string
    currentPrice: Price
    originalPrice: Price
    category: string
    expiresAt: string
    description: string
    discount: number
  }
  
  export interface SubCategory {
    id: string
    name: string
    icon: string
  }
  
  export interface CategoryData {
    id: string
    name: string
    icon: string
    subCategories: SubCategory[]
  }
  
  