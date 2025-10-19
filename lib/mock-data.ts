// Types for clothing video data
export interface ClothingVideoData {
  id: number
  videoUrl: string
  title: string
  brand: string
  price: {
    current: number
    original: number
  }
  category: "Men" | "Women" | "Children" | "Shoes"
  subcategory: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isBookmarked: boolean
  vendor: {
    name: string
    avatar: string
    followers: string
    rating: number
  }
  description: string
  materials: string
  colors: string[]
  sizes: string[]
  featured?: boolean
  trending?: boolean
  dateAdded?: string
}

// Mock data for clothing videos
export const mockClothingVideos: ClothingVideoData[] = [
  // Men's Clothing
  {
    id: 1,
    videoUrl: "/api/placeholder/400/600",
    title: "Men's White Formal Shirt - Professional Look",
    brand: "StyleCraft",
    price: { current: 45.99, original: 65.99 },
    category: "Men",
    subcategory: "Formal Wear",
    likes: 1250,
    comments: 89,
    shares: 45,
    isLiked: false,
    isBookmarked: false,
    vendor: {
      name: "StyleCraft Fashion",
      avatar: "/abstract-fashion-logo.png",
      followers: "125K",
      rating: 4.8,
    },
    description: "Premium cotton formal shirt perfect for business meetings and professional occasions",
    materials: "100% Cotton",
    colors: ["White", "Blue", "Black", "Light Gray"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    featured: true,
    trending: true,
    dateAdded: "2025-03-15T10:30:00Z",
  },
  {
    id: 2,
    videoUrl: "/api/placeholder/400/600",
    title: "Men's Casual Graphic T-Shirt",
    brand: "UrbanStyle",
    price: { current: 19.99, original: 29.99 },
    category: "Men",
    subcategory: "Casual Wear",
    likes: 890,
    comments: 67,
    shares: 23,
    isLiked: false,
    isBookmarked: false,
    vendor: {
      name: "UrbanStyle Collective",
      avatar: "/urban-fashion-logo.png",
      followers: "89K",
      rating: 4.6,
    },
    description: "Trendy graphic tee with modern design, perfect for casual outings",
    materials: "100% Cotton",
    colors: ["Black", "White", "Navy", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    featured: false,
    trending: true,
    dateAdded: "2025-03-18T14:45:00Z",
  },
  {
    id: 3,
    videoUrl: "/api/placeholder/400/600",
    title: "Men's Slim Fit Jeans",
    brand: "DenimCraft",
    price: { current: 79.99, original: 99.99 },
    category: "Men",
    subcategory: "Denim",
    likes: 1560,
    comments: 124,
    shares: 67,
    isLiked: true,
    isBookmarked: false,
    vendor: {
      name: "DenimCraft Co.",
      avatar: "/denim-brand-logo.png",
      followers: "156K",
      rating: 4.7,
    },
    description: "Premium slim fit jeans with stretch comfort and modern styling",
    materials: "98% Cotton, 2% Elastane",
    colors: ["Dark Blue", "Light Blue", "Black", "Gray"],
    sizes: ["28", "30", "32", "34", "36", "38"],
    featured: true,
    trending: false,
    dateAdded: "2025-03-10T16:20:00Z",
  },

  // Women's Clothing
  {
    id: 4,
    videoUrl: "/api/placeholder/400/600",
    title: "Women's Navy Blue Business Suit",
    brand: "EliteWear",
    price: { current: 189.99, original: 249.99 },
    category: "Women",
    subcategory: "Business Wear",
    likes: 2100,
    comments: 156,
    shares: 78,
    isLiked: true,
    isBookmarked: false,
    vendor: {
      name: "EliteWear Collection",
      avatar: "/elite-fashion-logo.png",
      followers: "89K",
      rating: 4.9,
    },
    description: "Sophisticated business suit for the modern professional woman",
    materials: "Wool Blend",
    colors: ["Navy", "Charcoal", "Black", "Burgundy"],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: true,
    trending: true,
    dateAdded: "2025-03-20T19:15:00Z",
  },
  {
    id: 5,
    videoUrl: "/api/placeholder/400/600",
    title: "Women's Floral Summer Dress",
    brand: "BloomFashion",
    price: { current: 59.99, original: 89.99 },
    category: "Women",
    subcategory: "Dresses",
    likes: 1780,
    comments: 134,
    shares: 89,
    isLiked: false,
    isBookmarked: true,
    vendor: {
      name: "BloomFashion Studio",
      avatar: "/bloom-fashion-logo.png",
      followers: "67K",
      rating: 4.8,
    },
    description: "Beautiful floral print dress perfect for summer occasions",
    materials: "100% Viscose",
    colors: ["Floral Blue", "Floral Pink", "Floral Yellow"],
    sizes: ["XS", "S", "M", "L", "XL"],
    featured: false,
    trending: true,
    dateAdded: "2025-03-12T13:40:00Z",
  },
  {
    id: 6,
    videoUrl: "/api/placeholder/400/600",
    title: "Women's Silk Blouse",
    brand: "LuxeSilk",
    price: { current: 89.99, original: 129.99 },
    category: "Women",
    subcategory: "Blouses",
    likes: 1340,
    comments: 98,
    shares: 45,
    isLiked: false,
    isBookmarked: false,
    vendor: {
      name: "LuxeSilk Boutique",
      avatar: "/placeholder-jcngx.png",
      followers: "45K",
      rating: 4.9,
    },
    description: "Elegant silk blouse with timeless design and premium quality",
    materials: "100% Silk",
    colors: ["Ivory", "Black", "Navy", "Burgundy"],
    sizes: ["XS", "S", "M", "L"],
    featured: true,
    trending: false,
    dateAdded: "2025-03-17T20:30:00Z",
  },

  // Children's Clothing
  {
    id: 7,
    videoUrl: "/api/placeholder/400/600",
    title: "Kids Dinosaur Print Pajamas",
    brand: "ComfyKids",
    price: { current: 24.99, original: 34.99 },
    category: "Children",
    subcategory: "Sleepwear",
    likes: 890,
    comments: 67,
    shares: 23,
    isLiked: false,
    isBookmarked: true,
    vendor: {
      name: "ComfyKids Store",
      avatar: "/playful-kids-clothing-logo.png",
      followers: "45K",
      rating: 4.7,
    },
    description: "Soft and cozy pajamas with fun dinosaur prints that kids love",
    materials: "100% Cotton",
    colors: ["Blue Dino", "Green Dino", "Purple Dino"],
    sizes: ["2T", "3T", "4T", "5T", "6T"],
    featured: false,
    trending: true,
    dateAdded: "2025-03-19T21:10:00Z",
  },
  {
    id: 8,
    videoUrl: "/api/placeholder/400/600",
    title: "Children's Rainbow Hoodie",
    brand: "KidsJoy",
    price: { current: 34.99, original: 49.99 },
    category: "Children",
    subcategory: "Hoodies",
    likes: 1120,
    comments: 89,
    shares: 34,
    isLiked: true,
    isBookmarked: false,
    vendor: {
      name: "KidsJoy Fashion",
      avatar: "/placeholder-j3nmg.png",
      followers: "67K",
      rating: 4.8,
    },
    description: "Colorful rainbow hoodie that brings joy and comfort to playtime",
    materials: "80% Cotton, 20% Polyester",
    colors: ["Rainbow", "Pastel Rainbow", "Neon Rainbow"],
    sizes: ["2T", "3T", "4T", "5T", "6T", "7T"],
    featured: true,
    trending: false,
    dateAdded: "2025-03-14T19:30:00Z",
  },

  // Shoes
  {
    id: 9,
    videoUrl: "/api/placeholder/400/600",
    title: "Men's Leather Oxford Shoes",
    brand: "ClassicStep",
    price: { current: 129.99, original: 179.99 },
    category: "Shoes",
    subcategory: "Formal Shoes",
    likes: 1890,
    comments: 145,
    shares: 67,
    isLiked: false,
    isBookmarked: true,
    vendor: {
      name: "ClassicStep Footwear",
      avatar: "/placeholder-mxm3f.png",
      followers: "78K",
      rating: 4.8,
    },
    description: "Handcrafted leather Oxford shoes for the distinguished gentleman",
    materials: "Genuine Leather",
    colors: ["Black", "Brown", "Tan"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    featured: true,
    trending: true,
    dateAdded: "2025-03-16T22:45:00Z",
  },
  {
    id: 10,
    videoUrl: "/api/placeholder/400/600",
    title: "Women's Athletic Running Shoes",
    brand: "SportFlex",
    price: { current: 89.99, original: 119.99 },
    category: "Shoes",
    subcategory: "Athletic",
    likes: 2340,
    comments: 189,
    shares: 123,
    isLiked: true,
    isBookmarked: false,
    vendor: {
      name: "SportFlex Athletics",
      avatar: "/sport-shoes-logo.png",
      followers: "134K",
      rating: 4.7,
    },
    description: "High-performance running shoes with advanced cushioning technology",
    materials: "Mesh Upper, EVA Sole",
    colors: ["White/Pink", "Black/Purple", "Gray/Teal"],
    sizes: ["5", "6", "7", "8", "9", "10", "11"],
    featured: false,
    trending: true,
    dateAdded: "2025-03-11T15:20:00Z",
  },
]

// Helper function to format numbers
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  } else {
    return num.toString()
  }
}

// Helper function to calculate discount percentage
export const calculateDiscount = (current: number, original: number): number => {
  return Math.round((1 - current / original) * 100)
}

// Helper function to get category icon
export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Men":
      return "user"
    case "Women":
      return "user"
    case "Children":
      return "baby"
    case "Shoes":
      return "footprints"
    default:
      return "shirt"
  }
}

// Categories for filtering
export const clothingCategories = ["All", "Men", "Women", "Children", "Shoes"]
