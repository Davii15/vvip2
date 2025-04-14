// Types
export interface VideoData {
    id: string
    title: string
    description: string
    videoUrl: string
    thumbnailUrl: string
    duration: number // in seconds
    category: string
    tags: string[]
    views: number
    likes: number
    comments: number
    shares: number
    featured: boolean
    trending: boolean
    dateAdded: string
    vendor: {
      id: string
      name: string
      logo: string
      location: string
      verified: boolean
      rating: number
      reviewCount: number
      followers: number
    }
  }
  
  // Helper functions
  export const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    } else {
      return num.toString()
    }
  }
  
  export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }
  
  // Mock data for furniture videos
  export const mockVideos: VideoData[] = [
    {
      id: "furn-001",
      title: "Modern Living Room Furniture Collection",
      description:
        "Explore our latest collection of modern living room furniture. Sleek designs, premium materials, and exceptional comfort for your home.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Modern+Living+Room",
      duration: 245,
      category: "Living Room",
      tags: ["Modern", "Sofa", "Coffee Table", "Interior Design", "Minimalist"],
      views: 87500,
      likes: 6420,
      comments: 845,
      shares: 1230,
      featured: true,
      trending: true,
      dateAdded: "2025-03-15T10:30:00Z",
      vendor: {
        id: "v-001",
        name: "Elegant Interiors",
        logo: "/placeholder.svg?height=60&width=60&text=EI",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 428,
        followers: 75000,
      },
    },
    {
      id: "furn-002",
      title: "Bedroom Furniture: Creating Your Perfect Sanctuary",
      description:
        "Discover how to create a peaceful bedroom sanctuary with our premium bedroom furniture collection. From beds to wardrobes, we have everything you need.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Bedroom+Furniture",
      duration: 318,
      category: "Bedroom",
      tags: ["Bedroom", "Bed Frame", "Wardrobe", "Nightstand", "Comfort"],
      views: 65300,
      likes: 5240,
      comments: 720,
      shares: 980,
      featured: false,
      trending: true,
      dateAdded: "2025-03-10T14:45:00Z",
      vendor: {
        id: "v-002",
        name: "Sleep Haven",
        logo: "/placeholder.svg?height=60&width=60&text=SH",
        location: "Mombasa, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 315,
        followers: 58000,
      },
    },
    {
      id: "furn-003",
      title: "Dining Room Essentials: Tables, Chairs & More",
      description:
        "Create the perfect dining experience with our collection of dining tables, chairs, and sideboards. Elegant designs for every home style.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Dining+Room",
      duration: 276,
      category: "Dining Room",
      tags: ["Dining Table", "Chairs", "Sideboard", "Entertaining", "Family Meals"],
      views: 72400,
      likes: 5870,
      comments: 680,
      shares: 1120,
      featured: true,
      trending: false,
      dateAdded: "2025-03-05T09:15:00Z",
      vendor: {
        id: "v-003",
        name: "Dining Delights",
        logo: "/placeholder.svg?height=60&width=60&text=DD",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 287,
        followers: 45000,
      },
    },
    {
      id: "furn-004",
      title: "Office Furniture for Productivity and Comfort",
      description:
        "Boost your productivity with ergonomic office furniture. From desks to chairs, create a workspace that's both functional and stylish.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Office+Furniture",
      duration: 294,
      category: "Office",
      tags: ["Office Desk", "Ergonomic Chair", "Bookshelf", "Workspace", "Productivity"],
      views: 58900,
      likes: 4320,
      comments: 590,
      shares: 870,
      featured: false,
      trending: false,
      dateAdded: "2025-03-12T11:20:00Z",
      vendor: {
        id: "v-004",
        name: "WorkSpace Solutions",
        logo: "/placeholder.svg?height=60&width=60&text=WS",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.6,
        reviewCount: 256,
        followers: 42000,
      },
    },
    {
      id: "furn-005",
      title: "Outdoor Furniture: Extending Your Living Space",
      description:
        "Transform your garden, patio or balcony with our weather-resistant outdoor furniture. Create an outdoor oasis for relaxation and entertainment.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Outdoor+Furniture",
      duration: 325,
      category: "Outdoor",
      tags: ["Patio", "Garden", "Weather-Resistant", "Outdoor Living", "Relaxation"],
      views: 49700,
      likes: 3980,
      comments: 520,
      shares: 760,
      featured: true,
      trending: false,
      dateAdded: "2025-03-08T15:30:00Z",
      vendor: {
        id: "v-005",
        name: "Outdoor Living",
        logo: "/placeholder.svg?height=60&width=60&text=OL",
        location: "Mombasa, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 342,
        followers: 38000,
      },
    },
    {
      id: "furn-006",
      title: "Kids Furniture: Safe, Fun & Functional Designs",
      description:
        "Discover our range of children's furniture that combines safety, functionality, and playful designs. Perfect for bedrooms, playrooms, and study areas.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Kids+Furniture",
      duration: 312,
      category: "Kids Room",
      tags: ["Children", "Bunk Beds", "Study Desk", "Storage", "Playroom"],
      views: 63200,
      likes: 5120,
      comments: 680,
      shares: 940,
      featured: false,
      trending: true,
      dateAdded: "2025-03-14T13:45:00Z",
      vendor: {
        id: "v-006",
        name: "Kids Corner",
        logo: "/placeholder.svg?height=60&width=60&text=KC",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 298,
        followers: 52000,
      },
    },
    {
      id: "furn-007",
      title: "Storage Solutions: Keeping Your Home Organized",
      description:
        "Maximize your space with our innovative storage solutions. From wardrobes to shelving units, discover furniture that helps keep your home clutter-free.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Storage+Solutions",
      duration: 356,
      category: "Storage",
      tags: ["Organization", "Shelving", "Wardrobes", "Cabinets", "Space-Saving"],
      views: 54300,
      likes: 4350,
      comments: 590,
      shares: 820,
      featured: true,
      trending: true,
      dateAdded: "2025-03-18T09:30:00Z",
      vendor: {
        id: "v-007",
        name: "Organize & Store",
        logo: "/placeholder.svg?height=60&width=60&text=OS",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 356,
        followers: 61000,
      },
    },
    {
      id: "furn-008",
      title: "Handcrafted Furniture: Artisan Quality & Unique Designs",
      description:
        "Explore our collection of handcrafted furniture made by skilled artisans. Each piece is unique, showcasing exceptional craftsmanship and attention to detail.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Handcrafted+Furniture",
      duration: 287,
      category: "Artisan",
      tags: ["Handcrafted", "Artisan", "Unique", "Sustainable", "Craftsmanship"],
      views: 42700,
      likes: 3580,
      comments: 470,
      shares: 690,
      featured: false,
      trending: true,
      dateAdded: "2025-03-16T10:15:00Z",
      vendor: {
        id: "v-008",
        name: "Artisan Creations",
        logo: "/placeholder.svg?height=60&width=60&text=AC",
        location: "Nakuru, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 312,
        followers: 47000,
      },
    },
    {
      id: "furn-009",
      title: "Small Space Furniture: Maximizing Limited Areas",
      description:
        "Perfect for apartments and small homes, our space-saving furniture offers style and functionality without overwhelming your space.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Small+Space+Furniture",
      duration: 268,
      category: "Small Spaces",
      tags: ["Apartment", "Space-Saving", "Multifunctional", "Compact", "Efficient"],
      views: 38900,
      likes: 3120,
      comments: 420,
      shares: 580,
      featured: true,
      trending: false,
      dateAdded: "2025-03-07T14:30:00Z",
      vendor: {
        id: "v-009",
        name: "Compact Living",
        logo: "/placeholder.svg?height=60&width=60&text=CL",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.6,
        reviewCount: 278,
        followers: 35000,
      },
    },
    {
      id: "furn-010",
      title: "Luxury Furniture: Premium Materials & Exquisite Design",
      description:
        "Indulge in our luxury furniture collection featuring premium materials, exceptional craftsmanship, and timeless designs for the discerning homeowner.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Luxury+Furniture",
      duration: 305,
      category: "Luxury",
      tags: ["Premium", "Exclusive", "High-End", "Designer", "Elegant"],
      views: 67800,
      likes: 5430,
      comments: 720,
      shares: 1050,
      featured: false,
      trending: true,
      dateAdded: "2025-03-09T11:45:00Z",
      vendor: {
        id: "v-010",
        name: "Luxury Living",
        logo: "/placeholder.svg?height=60&width=60&text=LL",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 315,
        followers: 58000,
      },
    },
    {
      id: "furn-011",
      title: "Sustainable Furniture: Eco-Friendly Materials & Practices",
      description:
        "Make environmentally conscious choices with our sustainable furniture collection. Made from eco-friendly materials using responsible manufacturing practices.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Sustainable+Furniture",
      duration: 289,
      category: "Sustainable",
      tags: ["Eco-Friendly", "Sustainable", "Recycled", "Green", "Environmental"],
      views: 45600,
      likes: 3780,
      comments: 490,
      shares: 720,
      featured: true,
      trending: false,
      dateAdded: "2025-03-11T16:20:00Z",
      vendor: {
        id: "v-011",
        name: "Green Furniture",
        logo: "/placeholder.svg?height=60&width=60&text=GF",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 265,
        followers: 42000,
      },
    },
    {
      id: "furn-012",
      title: "Furniture Restoration: Giving New Life to Vintage Pieces",
      description:
        "Learn how to restore and refinish vintage furniture pieces. Our experts share techniques for bringing old furniture back to life while preserving its character.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Furniture+Restoration",
      duration: 332,
      category: "Restoration",
      tags: ["Vintage", "Restoration", "DIY", "Refinishing", "Upcycling"],
      views: 52300,
      likes: 4270,
      comments: 580,
      shares: 890,
      featured: true,
      trending: true,
      dateAdded: "2025-03-13T08:45:00Z",
      vendor: {
        id: "v-012",
        name: "Restore & Renew",
        logo: "/placeholder.svg?height=60&width=60&text=RR",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 187,
        followers: 49000,
      },
    },
  ]
  