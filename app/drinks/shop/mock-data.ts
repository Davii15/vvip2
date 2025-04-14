// Types
export interface Price {
    amount: number
    currency: string
  }
  
  export interface Drink {
    id: number
    name: string
    imageUrl: string
    currentPrice: Price
    originalPrice: Price
    type: string
    category: "Soft Drink" | "Alcoholic"
    description: string
    volume: string
    alcoholContent?: string
    isNew?: boolean
    isMostPreferred?: boolean
    dateAdded: string
    origin?: string
    brand: string
    tags?: string[]
    rating?: number
    reviewCount?: number
    ingredients?: string[]
    nutritionalInfo?: {
      calories?: number
      sugar?: number
      caffeine?: number
    }
    servingSuggestion?: string
    hotDealEnds?: string
    isHotDeal?: boolean
  }
  
  export interface Vendor {
    id: number
    name: string
    location: string
    logo: string
    description: string
    drinks: Drink[]
    redirectUrl: string
    mapLink: string
    defaultCurrency: string
  }
  
  // Mock data for vendors
  export const mockVendors: Vendor[] = [
    {
      id: 1,
      name: "Refreshment Haven",
      location: "Nairobi, Kenya",
      logo: "/placeholder.svg?height=60&width=60",
      description: "Your one-stop shop for premium soft drinks and refreshing beverages.",
      mapLink: "https://www.google.com/maps",
      defaultCurrency: "KSH",
      drinks: [
        {
          id: 101,
          name: "Tropical Paradise Juice",
          imageUrl: "/placeholder.svg?height=300&width=400",
          currentPrice: { amount: 120, currency: "KSH" },
          originalPrice: { amount: 180, currency: "KSH" },
          type: "Juice",
          category: "Soft Drink",
          description: "A refreshing blend of tropical fruits including mango, pineapple, and passion fruit.",
          volume: "500ml",
          isNew: true,
          isMostPreferred: true,
          dateAdded: "2025-03-10T10:30:00Z",
          brand: "Nature's Best",
          tags: ["Tropical", "No Preservatives", "Vitamin C"],
          rating: 4.8,
          reviewCount: 124,
          ingredients: ["Mango", "Pineapple", "Passion Fruit", "Water", "Natural Sweetener"],
          nutritionalInfo: {
            calories: 120,
            sugar: 24,
          },
          servingSuggestion: "Best served chilled with ice cubes",
          hotDealEnds: "2025-04-01T23:59:59Z",
          isHotDeal: true,
        },
        {
          id: 102,
          name: "Sparkling Berry Fusion",
          imageUrl: "/placeholder.svg?height=300&width=400",
          currentPrice: { amount: 150, currency: "KSH" },
          originalPrice: { amount: 200, currency: "KSH" },
          type: "Carbonated",
          category: "Soft Drink",
          description: "A fizzy blend of mixed berries with a hint of citrus. Zero sugar and all-natural flavors.",
          volume: "330ml",
          dateAdded: "2025-02-15T10:30:00Z",
          brand: "Fizz Pop",
          tags: ["Sugar-Free", "Natural Flavors", "Sparkling"],
          rating: 4.5,
          reviewCount: 89,
          ingredients: ["Carbonated Water", "Natural Berry Flavors", "Citric Acid", "Stevia Extract"],
          nutritionalInfo: {
            calories: 5,
            sugar: 0,
          },
        },
        {
          id: 103,
          name: "Classic Cola Zero",
          imageUrl: "/placeholder.svg?height=300&width=400",
          currentPrice: { amount: 80, currency: "KSH" },
          originalPrice: { amount: 100, currency: "KSH" },
          type: "Cola",
          category: "Soft Drink",
          description: "The classic cola taste without the sugar. Perfect for those watching their calorie intake.",
          volume: "500ml",
          dateAdded: "2025-01-20T10:30:00Z",
          brand: "Fizz Pop",
          isMostPreferred: true,
          tags: ["Sugar-Free", "Zero Calories", "Classic"],
          rating: 4.7,
          reviewCount: 215,
          ingredients: ["Carbonated Water", "Caramel Color", "Phosphoric Acid", "Aspartame", "Natural Flavors"],
          nutritionalInfo: {
            calories: 0,
            sugar: 0,
            caffeine: 35,
          },
        },
      ],
      redirectUrl: "https://refreshmenthaven.com",
    },
    {
      id: 2,
      name: "Exotic Elixirs",
      location: "Mombasa, Kenya",
      logo: "/placeholder.svg?height=60&width=60",
      description: "Specializing in unique and exotic non-alcoholic beverages from around the world.",
      mapLink: "https://www.google.com/maps",
      defaultCurrency: "KSH",
      drinks: [
        {
          id: 201,
          name: "Dragon Fruit Lemonade",
          imageUrl: "/placeholder.svg?height=300&width=400",
          currentPrice: { amount: 220, currency: "KSH" },
          originalPrice: { amount: 280, currency: "KSH" },
          type: "Specialty",
          category: "Soft Drink",
          description: "A vibrant pink lemonade infused with dragon fruit and a hint of mint. Refreshingly different!",
          volume: "400ml",
          isNew: true,
          dateAdded: "2025-03-18T10:30:00Z",
          origin: "Thailand",
          brand: "Exotic Elixirs",
          tags: ["Exotic", "Limited Edition", "Handcrafted"],
          rating: 4.9,
          reviewCount: 67,
          ingredients: ["Filtered Water", "Dragon Fruit", "Lemon Juice", "Mint Leaves", "Organic Cane Sugar"],
          nutritionalInfo: {
            calories: 110,
            sugar: 22,
          },
          servingSuggestion: "Pour over crushed ice and garnish with a mint leaf",
          hotDealEnds: "2025-03-30T23:59:59Z",
          isHotDeal: true,
        },
        {
          id: 202,
          name: "Hibiscus & Rose Iced Tea",
          imageUrl: "/placeholder.svg?height=300&width=400",
          currentPrice: { amount: 180, currency: "KSH" },
          originalPrice: { amount: 240, currency: "KSH" },
          type: "Tea",
          category: "Soft Drink",
          description: "A floral and aromatic iced tea blend with notes of hibiscus, rose, and a touch of honey.",
          volume: "500ml",
          dateAdded: "2025-02-28T10:30:00Z",
          origin: "Morocco",
          brand: "Exotic Elixirs",
          isMostPreferred: true,
          tags: ["Floral", "Antioxidant-Rich", "Caffeine-Free"],
          rating: 4.6,
          reviewCount: 93,
          ingredients: ["Filtered Water", "Hibiscus Flowers", "Rose Petals", "Honey", "Lemon Zest"],
          nutritionalInfo: {
            calories: 90,
            sugar: 18,
          },
        },
      ],
      redirectUrl: "https://exoticelixirs.com",
    },
    {
      id: 3,
      name: "Premium Spirits",
      location: "Nairobi, Kenya",
      logo: "/placeholder.svg?height=60&width=60",
      description: "Curating the finest collection of premium spirits and craft alcoholic beverages.",
      mapLink: "https://www.google.com/maps",
      defaultCurrency: "KSH",
      drinks: [
        {
          id: 301,
          name: "Highland Single Malt Whisky",
          imageUrl: "/placeholder.svg?height=300&width=400",
          currentPrice: { amount: 4500, currency: "KSH" },
          originalPrice: { amount: 5800, currency: "KSH" },
          type: "Whisky",
          category: "Alcoholic",
          description: "A 12-year aged single malt with notes of honey, vanilla, and a subtle smoky finish.",
          volume: "700ml",
          alcoholContent: "43%",
          dateAdded: "2025-03-05T10:30:00Z",
          origin: "Scotland",
          brand: "Highland Reserve",
          isMostPreferred: true,
          tags: ["Single Malt", "Aged 12 Years", "Premium"],
          rating: 4.9,
          reviewCount: 156,
          servingSuggestion: "Best enjoyed neat or with a drop of water to release the aromas",
          hotDealEnds: "2025-04-05T23:59:59Z",
          isHotDeal: true,
        },
        {
          id: 302,
          name: "Artisanal Craft Gin",
          imageUrl: "/placeholder.svg?height=300&width=400",
          currentPrice: { amount: 3200, currency: "KSH" },
          originalPrice: { amount: 3800, currency: "KSH" },
          type: "Gin",
          category: "Alcoholic",
          description:
            "A small-batch craft gin infused with 14 botanicals including juniper, coriander, and citrus peels.",
          volume: "500ml",
          alcoholContent: "45%",
          isNew: true,
          dateAdded: "2025-03-15T10:30:00Z",
          origin: "Kenya",
          brand: "Savanna Spirits",
          tags: ["Craft", "Small Batch", "Local"],
          rating: 4.7,
          reviewCount: 89,
          ingredients: [
            "Grain Neutral Spirit",
            "Juniper Berries",
            "Coriander Seeds",
            "Angelica Root",
            "Citrus Peels",
            "Local Botanicals",
          ],
          servingSuggestion: "Perfect for a G&T with premium tonic water and a slice of grapefruit",
        },
      ],
      redirectUrl: "https://premiumspirits.com",
    },
    {
      id: 4,
      name: "Craft Brewery Co.",
      location: "Nakuru, Kenya",
      logo: "/placeholder.svg?height=60&width=60",
      description: "Local craft brewery specializing in unique and flavorful beer varieties.",
      mapLink: "https://www.google.com/maps",
      defaultCurrency: "KSH",
      drinks: [
        {
          id: 401,
          name: "Citrus Haze IPA",
          imageUrl: "/placeholder.svg?height=300&width=400",
          currentPrice: { amount: 320, currency: "KSH" },
          originalPrice: { amount: 380, currency: "KSH" },
          type: "Beer",
          category: "Alcoholic",
          description:
            "A hazy IPA bursting with citrus flavors and tropical hop aromas. Balanced bitterness with a smooth finish.",
          volume: "330ml",
          alcoholContent: "6.2%",
          isNew: true,
          dateAdded: "2025-03-20T10:30:00Z",
          origin: "Kenya",
          brand: "Craft Brewery Co.",
          tags: ["IPA", "Craft Beer", "Hazy"],
          rating: 4.8,
          reviewCount: 78,
          ingredients: ["Water", "Malted Barley", "Wheat", "Hops", "Yeast"],
          servingSuggestion: "Serve cold in a tulip glass to enhance the aromatic experience",
          hotDealEnds: "2025-04-10T23:59:59Z",
          isHotDeal: true,
        },
        {
          id: 402,
          name: "Coffee Stout",
          imageUrl: "/placeholder.svg?height=300&width=400",
          currentPrice: { amount: 350, currency: "KSH" },
          originalPrice: { amount: 420, currency: "KSH" },
          type: "Beer",
          category: "Alcoholic",
          description:
            "A rich, dark stout infused with locally roasted coffee beans. Notes of chocolate, coffee, and a hint of caramel.",
          volume: "330ml",
          alcoholContent: "5.8%",
          dateAdded: "2025-02-25T10:30:00Z",
          origin: "Kenya",
          brand: "Craft Brewery Co.",
          isMostPreferred: true,
          tags: ["Stout", "Coffee", "Dark Beer"],
          rating: 4.7,
          reviewCount: 92,
          ingredients: ["Water", "Malted Barley", "Roasted Barley", "Coffee Beans", "Hops", "Yeast"],
          servingSuggestion: "Best enjoyed slightly below room temperature in a snifter glass",
        },
      ],
      redirectUrl: "https://craftbreweryco.com",
    },
  ]
  
  // Helper function to check if a date is within the current week
  export const isNewThisWeek = (dateString: string): boolean => {
    const date = new Date(dateString)
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return date >= oneWeekAgo && date <= now
  }
  
  // Format a date string to a readable format
  export const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }
  
  // Helper function to get icon for drink type
  export const getDrinkTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "juice":
        return "Droplets"
      case "carbonated":
      case "cola":
        return "Droplets"
      case "tea":
        return "Coffee"
      case "specialty":
        return "Droplets"
      case "whisky":
        return "Wine"
      case "gin":
        return "Martini"
      case "rum":
        return "Wine"
      case "beer":
        return "Beer"
      default:
        return "Droplets"
    }
  }
  
  // Helper function to get category colors
  export const getCategoryColors = (category: string) => {
    if (category === "Soft Drink") {
      return {
        lightGradient: "from-blue-100 to-cyan-100",
        darkGradient: "from-blue-500 to-cyan-500",
        text: "text-blue-800",
        highlight: "text-blue-600",
        badge: "border-blue-300 text-blue-600",
        button: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
      }
    } else {
      return {
        lightGradient: "from-purple-100 to-indigo-100",
        darkGradient: "from-purple-500 to-indigo-500",
        text: "text-purple-800",
        highlight: "text-purple-600",
        badge: "border-purple-300 text-purple-600",
        button: "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600",
      }
    }
  }
  
  // Format price
  export const formatPrice = (price: Price): string => {
    return `${price.currency} ${price.amount.toLocaleString()}`
  }
  
  // Trending and popular products for the TrendingPopularSection
  export const trendingProducts = [
    {
      id: 1,
      name: "Tropical Paradise Juice",
      imageUrl: "/placeholder.svg?height=300&width=400",
      currentPrice: { amount: 120, currency: "KSH" },
      originalPrice: { amount: 180, currency: "KSH" },
      category: "Soft Drink",
      description: "A refreshing blend of tropical fruits including mango, pineapple, and passion fruit.",
      rating: 4.8,
      reviewCount: 124,
    },
    {
      id: 2,
      name: "Dragon Fruit Lemonade",
      imageUrl: "/placeholder.svg?height=300&width=400",
      currentPrice: { amount: 220, currency: "KSH" },
      originalPrice: { amount: 280, currency: "KSH" },
      category: "Soft Drink",
      description: "A vibrant pink lemonade infused with dragon fruit and a hint of mint.",
      rating: 4.9,
      reviewCount: 67,
    },
    {
      id: 3,
      name: "Highland Single Malt Whisky",
      imageUrl: "/placeholder.svg?height=300&width=400",
      currentPrice: { amount: 4500, currency: "KSH" },
      originalPrice: { amount: 5800, currency: "KSH" },
      category: "Alcoholic",
      description: "A 12-year aged single malt with notes of honey, vanilla, and a subtle smoky finish.",
      rating: 4.9,
      reviewCount: 156,
    },
    {
      id: 4,
      name: "Citrus Haze IPA",
      imageUrl: "/placeholder.svg?height=300&width=400",
      currentPrice: { amount: 320, currency: "KSH" },
      originalPrice: { amount: 380, currency: "KSH" },
      category: "Alcoholic",
      description: "A hazy IPA bursting with citrus flavors and tropical hop aromas.",
      rating: 4.8,
      reviewCount: 78,
    },
  ]
  
  export const popularProducts = [
    {
      id: 5,
      name: "Classic Cola Zero",
      imageUrl: "/placeholder.svg?height=300&width=400",
      currentPrice: { amount: 80, currency: "KSH" },
      originalPrice: { amount: 100, currency: "KSH" },
      category: "Soft Drink",
      description: "The classic cola taste without the sugar. Perfect for those watching their calorie intake.",
      rating: 4.7,
      reviewCount: 215,
    },
    {
      id: 6,
      name: "Hibiscus & Rose Iced Tea",
      imageUrl: "/placeholder.svg?height=300&width=400",
      currentPrice: { amount: 180, currency: "KSH" },
      originalPrice: { amount: 240, currency: "KSH" },
      category: "Soft Drink",
      description: "A floral and aromatic iced tea blend with notes of hibiscus, rose, and a touch of honey.",
      rating: 4.6,
      reviewCount: 93,
    },
    {
      id: 7,
      name: "Artisanal Craft Gin",
      imageUrl: "/placeholder.svg?height=300&width=400",
      currentPrice: { amount: 3200, currency: "KSH" },
      originalPrice: { amount: 3800, currency: "KSH" },
      category: "Alcoholic",
      description: "A small-batch craft gin infused with 14 botanicals including juniper, coriander, and citrus peels.",
      rating: 4.7,
      reviewCount: 89,
    },
    {
      id: 8,
      name: "Coffee Stout",
      imageUrl: "/placeholder.svg?height=300&width=400",
      currentPrice: { amount: 350, currency: "KSH" },
      originalPrice: { amount: 420, currency: "KSH" },
      category: "Alcoholic",
      description: "A rich, dark stout infused with locally roasted coffee beans.",
      rating: 4.7,
      reviewCount: 92,
    },
  ]
  
  