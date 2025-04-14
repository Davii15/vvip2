// Types
export interface VideoData {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  videoUrl: string
  duration: number
  views: number
  likes: number
  shares: number
  comments: number
  category: "Hotels" | "Restaurants" | "Bars & Lounges" | "Open Caterings" | "Cafes"
  tags: string[]
  vendor: {
    id: string
    name: string
    logo: string
    verified: boolean
    followers: number
    location: string
    rating: number
    reviewCount: number
  }
  featured: boolean
  trending: boolean
  dateAdded: string
}

// Mock data for videos
export const mockVideos: VideoData[] = [
  // Hotels
  {
    id: "hotel-1",
    title: "Luxury Suite Tour at Serene Skyline Hotel",
    description:
      "Take a tour of our Executive Suite with panoramic city views, king-sized bed, and premium amenities. Perfect for business travelers or couples seeking luxury.",
    thumbnailUrl: "/placeholder.svg?height=1080&width=608",
    videoUrl: "/placeholder.svg?height=1080&width=608",
    duration: 45,
    views: 24500,
    likes: 1820,
    shares: 342,
    comments: 156,
    category: "Hotels",
    tags: ["Luxury", "Suite", "City View", "Business Travel"],
    vendor: {
      id: "vendor-1",
      name: "Serene Skyline Hotel",
      logo: "/placeholder.svg?height=150&width=150",
      verified: true,
      followers: 12500,
      location: "Nairobi, Kenya",
      rating: 4.8,
      reviewCount: 356,
    },
    featured: true,
    trending: true,
    dateAdded: "2025-03-15T10:30:00Z",
  },
  {
    id: "hotel-2",
    title: "Beachfront Villa Experience",
    description:
      "Wake up to the sound of waves in our exclusive beachfront villa. Private pool, direct beach access, and personalized butler service included.",
    thumbnailUrl: "/placeholder.svg?height=1080&width=608",
    videoUrl: "/placeholder.svg?height=1080&width=608",
    duration: 62,
    views: 18700,
    likes: 1540,
    shares: 287,
    comments: 124,
    category: "Hotels",
    tags: ["Beach", "Villa", "Luxury", "Private Pool"],
    vendor: {
      id: "vendor-2",
      name: "Cozy Haven Boutique Hotel",
      logo: "/placeholder.svg?height=150&width=150",
      verified: true,
      followers: 9800,
      location: "Mombasa, Kenya",
      rating: 4.7,
      reviewCount: 245,
    },
    featured: false,
    trending: true,
    dateAdded: "2025-03-18T14:45:00Z",
  },
  {
    id: "hotel-3",
    title: "Infinity Pool Sunset Views",
    description:
      "Experience breathtaking sunset views from our rooftop infinity pool. The perfect Instagram moment for your vacation memories.",
    thumbnailUrl: "/placeholder.svg?height=1080&width=608",
    videoUrl: "/placeholder.svg?height=1080&width=608",
    duration: 38,
    views: 31200,
    likes: 2760,
    shares: 895,
    comments: 210,
    category: "Hotels",
    tags: ["Infinity Pool", "Sunset", "Rooftop", "Views"],
    vendor: {
      id: "vendor-1",
      name: "Serene Skyline Hotel",
      logo: "/placeholder.svg?height=150&width=150",
      verified: true,
      followers: 12500,
      location: "Nairobi, Kenya",
      rating: 4.8,
      reviewCount: 356,
    },
    featured: true,
    trending: false,
    dateAdded: "2025-03-10T16:20:00Z",
  },

  // Restaurants
  {
    id: "restaurant-1",
    title: "Chef's Table Experience",
    description:
      "Get a front-row seat to culinary artistry with our exclusive Chef's Table experience. Watch as our executive chef prepares a custom 7-course tasting menu just for you.",
    thumbnailUrl: "/placeholder.svg?height=1080&width=608",
    videoUrl: "/placeholder.svg?height=1080&width=608",
    duration: 58,
    views: 19800,
    likes: 1680,
    shares: 412,
    comments: 187,
    category: "Restaurants",
    tags: ["Chef's Table", "Fine Dining", "Tasting Menu", "Culinary"],
    vendor: {
      id: "vendor-3",
      name: "Savory Heights Restaurant",
      logo: "/placeholder.svg?height=150&width=150",
      verified: true,
      followers: 15600,
      location: "Nairobi, Kenya",
      rating: 4.9,
      reviewCount: 412,
    },
    featured: true,
    trending: true,
    dateAdded: "2025-03-20T19:15:00Z",
  },
  {
    id: "restaurant-2",
    title: "Seafood Platter Preparation",
    description:
      "Watch our chefs prepare our famous seafood platter with the freshest catch from the Indian Ocean. Grilled lobster, prawns, calamari, and local fish with signature sauces.",
    thumbnailUrl: "/placeholder.svg?height=1080&width=608",
    videoUrl: "/placeholder.svg?height=1080&width=608",
    duration: 67,
    views: 14500,
    likes: 1240,
    shares: 276,
    comments: 98,
    category: "Restaurants",
    tags: ["Seafood", "Fresh Catch", "Coastal Cuisine", "Grilled"],
    vendor: {
      id: "vendor-4",
      name: "Coastal Flavors Restaurant",
      logo: "/placeholder.svg?height=150&width=150",
      verified: true,
      followers: 8900,
      location: "Mombasa, Kenya",
      rating: 4.7,
      reviewCount: 328,
    },
    featured: false,
    trending: false,
    dateAdded: "2025-03-12T13:40:00Z",
  },
  {
    id: "restaurant-3",
    title: "Molecular Gastronomy Dessert",
    description:
      "The art of molecular gastronomy in our signature dessert creation. Liquid nitrogen, edible spheres, and flavor transformations that will surprise your taste buds.",
    thumbnailUrl: "/placeholder.svg?height=1080&width=608",
    videoUrl: "/placeholder.svg?height=1080&width=608",
    duration: 42,
    views: 27800,
    likes: 2340,
    shares: 678,
    comments: 145,
    category: "Restaurants",
    tags: ["Molecular Gastronomy", "Dessert", "Innovative", "Culinary Art"],
    vendor: {
      id: "vendor-3",
      name: "Savory Heights Restaurant",
      logo: "/placeholder.svg?height=150&width=150",
      verified: true,
      followers: 15600,
      location: "Nairobi, Kenya",
      rating: 4.9,
      reviewCount: 412,
    },
    featured: true,
    trending: true,
    dateAdded: "2025-03-17T20:30:00Z",
  },

  // Bars & Lounges
  {
    id: "bar-1",
    title: "Mixologist Crafting Signature Cocktail",
    description:
      "Our award-winning mixologist demonstrates the art of crafting our signature 'Skyline Sunset' cocktail with premium spirits, fresh ingredients, and theatrical presentation.",
    thumbnailUrl: "/placeholder.svg?height=1080&width=608",
    videoUrl: "/placeholder.svg?height=1080&width=608",
    duration: 54,
    views: 22400,
    likes: 1980,
    shares: 543,
    comments: 176,
    category: "Bars & Lounges",
    tags: ["Mixology", "Cocktails", "Craft Drinks", "Premium"],
    vendor: {
      id: "vendor-5",
      name: "Skyline Lounge & Bar",
      logo: "/placeholder.svg?height=150&width=150",
      verified: true,
      followers: 18700,
      location: "Nairobi, Kenya",
      rating: 4.8,
      reviewCount: 376,
    },
    featured: true,
    trending: true,
    dateAdded: "2025-03-19T21:10:00Z",
  },
  {
    id: "bar-2",
    title: "Beach Bonfire Night Experience",
    description:
      "Join our weekly beach bonfire nights with live music, craft beers, and a relaxed atmosphere under the stars. Perfect way to end your day at the coast.",
    thumbnailUrl: "/placeholder.svg?height=1080&width=608",
    videoUrl: "/placeholder.svg?height=1080&width=608",
    duration: 48,
    views: 16800,
    likes: 1420,
    shares: 312,
    comments: 87,
    category: "Bars & Lounges",
    tags: ["Beach", "Bonfire", "Live Music", "Craft Beer"],
    vendor: {
      id: "vendor-6",
      name: "Beachside Sports Bar",
      logo: "/placeholder.svg?height=150&width=150",
      verified: true,
      followers: 7600,
      location: "Mombasa, Kenya",
      rating: 4.6,
      reviewCount: 289,
    },
    featured: false,
    trending: false,
    dateAdded: "2025-03-14T19:30:00Z",
  },
  {
    id: "bar-3",
    title: "VIP Lounge Experience",
    description:
      "A glimpse into our exclusive VIP lounge experience with bottle service, private seating, and the best views of the city skyline. Reserve for your special occasion.",
    thumbnailUrl: "/placeholder.svg?height=1080&width=608",
    videoUrl: "/placeholder.svg?height=1080&width=608",
    duration: 51,
    views: 29600,
    likes: 2580,
    shares: 734,
    comments: 198,
    category: "Bars & Lounges",
    tags: ["VIP", "Exclusive", "Bottle Service", "Skyline View"],
    vendor: {
      id: "vendor-5",
      name: "Skyline Lounge & Bar",
      logo: "/placeholder.svg?height=150&width=150",
      verified: true,
      followers: 18700,
      location: "Nairobi, Kenya",
      rating: 4.8,
      reviewCount: 376,
    },
    featured: true,
    trending: true,
    dateAdded: "2025-03-16T22:45:00Z",
  },

  // Open Caterings
  {
    id: "catering-1",
    title: "Wedding Reception Setup Timelapse",
    description:
      "Watch our team transform a blank canvas into a magical wedding reception venue. From table settings to floral arrangements, lighting, and decor elements.",
    thumbnailUrl: "/placeholder.svg?height=1080&width=608",
    videoUrl: "/placeholder.svg?height=1080&width=608",
    duration: 72,
    views: 18200,
    likes: 1560,
    shares: 487,
    comments: 134,
    category: "Open Caterings",
    tags: ["Wedding", "Event Setup", "Decor", "Timelapse"],
    vendor: {
      id: "vendor-7",
      name: "Elegant Events Catering",
      logo: "/placeholder.svg?height=150&width=150",
      verified: true,
      followers: 14300,
      location: "Nairobi, Kenya",
      rating: 4.9,
      reviewCount: 215,
    },
    featured: true,
    trending: false,
    dateAdded: "2025-03-11T15:20:00Z",
  },
  {
    id: "catering-2",
    title: "Beach Party BBQ Setup",
    description:
      "See how we set up our famous beach BBQ parties with grilling stations, seating areas, tiki torches, and entertainment zones for the ultimate beach celebration.",
    thumbnailUrl: "/placeholder.svg?height=1080&width=608",
    videoUrl: "/placeholder.svg?height=1080&width=608",
    duration: 56,
    views: 12700,
    likes: 980,
    shares: 245,
    comments: 68,
    category: "Open Caterings",
    tags: ["Beach Party", "BBQ", "Event Setup", "Outdoor"],
    vendor: {
      id: "vendor-8",
      name: "Celebration Catering Services",
      logo: "/placeholder.svg?height=150&width=150",
      verified: true,
      followers: 9200,
      location: "Mombasa, Kenya",
      rating: 4.7,
      reviewCount: 183,
    },
    featured: false,
    trending: true,
    dateAdded: "2025-03-13T16:50:00Z",
  },
  {
    id: "catering-3",
    title: "Corporate Event Food Presentation",
    description:
      "Elegant food presentation for corporate events. Our attention to detail in menu planning, food styling, and service that impresses clients and executives.",
    thumbnailUrl: "/placeholder.svg?height=1080&width=608",
    videoUrl: "/placeholder.svg?height=1080&width=608",
    duration: 49,
    views: 15400,
    likes: 1280,
    shares: 356,
    comments: 92,
    category: "Open Caterings",
    tags: ["Corporate", "Food Presentation", "Catering", "Professional"],
    vendor: {
      id: "vendor-7",
      name: "Elegant Events Catering",
      logo: "/placeholder.svg?height=150&width=150",
      verified: true,
      followers: 14300,
      location: "Nairobi, Kenya",
      rating: 4.9,
      reviewCount: 215,
    },
    featured: true,
    trending: false,
    dateAdded: "2025-03-09T14:15:00Z",
  },

  // Cafes
  {
    id: "cafe-1",
    title: "Latte Art Masterclass",
    description:
      "Our barista demonstrates the art of creating beautiful latte art designs. From hearts and rosettas to more complex patterns that make your coffee experience special.",
    thumbnailUrl: "/placeholder.svg?height=1080&width=608",
    videoUrl: "/placeholder.svg?height=1080&width=608",
    duration: 63,
    views: 21300,
    likes: 1870,
    shares: 523,
    comments: 167,
    category: "Cafes",
    tags: ["Latte Art", "Coffee", "Barista", "Skills"],
    vendor: {
      id: "vendor-9",
      name: "Aroma Artisan Cafe",
      logo: "/placeholder.svg?height=150&width=150",
      verified: true,
      followers: 16800,
      location: "Nairobi, Kenya",
      rating: 4.8,
      reviewCount: 342,
    },
    featured: true,
    trending: true,
    dateAdded: "2025-03-21T09:30:00Z",
  },
  {
    id: "cafe-2",
    title: "Pastry Chef Morning Routine",
    description:
      "Behind the scenes with our pastry chef as they prepare the day's fresh pastries, cakes, and bread. Early morning baking process that starts at 4 AM.",
    thumbnailUrl: "/placeholder.svg?height=1080&width=608",
    videoUrl: "/placeholder.svg?height=1080&width=608",
    duration: 58,
    views: 17600,
    likes: 1490,
    shares: 378,
    comments: 104,
    category: "Cafes",
    tags: ["Pastry", "Baking", "Behind the Scenes", "Morning Routine"],
    vendor: {
      id: "vendor-9",
      name: "Aroma Artisan Cafe",
      logo: "/placeholder.svg?height=150&width=150",
      verified: true,
      followers: 16800,
      location: "Nairobi, Kenya",
      rating: 4.8,
      reviewCount: 342,
    },
    featured: false,
    trending: false,
    dateAdded: "2025-03-08T11:45:00Z",
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

// Helper function to format time
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
}

// Helper function to get category icon
export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Hotels":
      return "hotel"
    case "Restaurants":
      return "utensils"
    case "Bars & Lounges":
      return "wine"
    case "Open Caterings":
      return "utensils-crossed"
    case "Cafes":
      return "coffee"
    default:
      return "coffee"
  }
}

