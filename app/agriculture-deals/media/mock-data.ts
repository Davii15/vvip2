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
  
  // Mock data for agriculture videos
  export const mockVideos: VideoData[] = [
    {
      id: "agri-001",
      title: "Modern Tractor Technology for Efficient Farming",
      description:
        "Explore the latest tractor technology that's revolutionizing farming efficiency. See how precision agriculture is transforming traditional farming methods.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Modern+Tractors",
      duration: 245,
      category: "Farm Machinery",
      tags: ["Tractors", "Precision Agriculture", "Farming Technology", "Efficiency"],
      views: 87500,
      likes: 6420,
      comments: 845,
      shares: 1230,
      featured: true,
      trending: true,
      dateAdded: "2025-03-15T10:30:00Z",
      vendor: {
        id: "v-001",
        name: "AgriTech Solutions",
        logo: "/placeholder.svg?height=60&width=60&text=ATS",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 428,
        followers: 75000,
      },
    },
    {
      id: "agri-002",
      title: "Organic Pest Control Methods for Sustainable Farming",
      description:
        "Learn effective organic pest control methods that protect your crops without harmful chemicals. Sustainable farming practices for healthier produce.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Organic+Pest+Control",
      duration: 318,
      category: "Crop Protection",
      tags: ["Organic Farming", "Pest Control", "Sustainable Agriculture", "Natural Methods"],
      views: 65300,
      likes: 5240,
      comments: 720,
      shares: 980,
      featured: false,
      trending: true,
      dateAdded: "2025-03-10T14:45:00Z",
      vendor: {
        id: "v-002",
        name: "EcoFarm Solutions",
        logo: "/placeholder.svg?height=60&width=60&text=EFS",
        location: "Nakuru, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 315,
        followers: 58000,
      },
    },
    {
      id: "agri-003",
      title: "Drip Irrigation Systems for Water Conservation",
      description:
        "Discover how drip irrigation systems can dramatically reduce water usage while improving crop yields. Perfect for arid regions and water conservation efforts.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Drip+Irrigation",
      duration: 276,
      category: "Irrigation",
      tags: ["Water Conservation", "Drip Irrigation", "Efficient Farming", "Sustainability"],
      views: 72400,
      likes: 5870,
      comments: 680,
      shares: 1120,
      featured: true,
      trending: false,
      dateAdded: "2025-03-05T09:15:00Z",
      vendor: {
        id: "v-003",
        name: "WaterWise Irrigation",
        logo: "/placeholder.svg?height=60&width=60&text=WWI",
        location: "Mombasa, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 287,
        followers: 45000,
      },
    },
    {
      id: "agri-004",
      title: "High-Yield Seed Varieties for African Climates",
      description:
        "Explore specially developed seed varieties that thrive in African climates and soil conditions. Learn about drought-resistant and high-yield options for better harvests.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=High-Yield+Seeds",
      duration: 294,
      category: "Seeds & Planting",
      tags: ["High-Yield Seeds", "Drought Resistant", "African Agriculture", "Crop Improvement"],
      views: 58900,
      likes: 4320,
      comments: 590,
      shares: 870,
      featured: false,
      trending: false,
      dateAdded: "2025-03-12T11:20:00Z",
      vendor: {
        id: "v-004",
        name: "African Seed Solutions",
        logo: "/placeholder.svg?height=60&width=60&text=ASS",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.6,
        reviewCount: 256,
        followers: 42000,
      },
    },
    {
      id: "agri-005",
      title: "Soil Testing and Nutrient Management Techniques",
      description:
        "Learn how proper soil testing can optimize your fertilizer application and improve crop yields. Discover the importance of balanced soil nutrients for healthy plants.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Soil+Testing",
      duration: 325,
      category: "Soil Management",
      tags: ["Soil Testing", "Nutrient Management", "Fertilizer Application", "Soil Health"],
      views: 49700,
      likes: 3980,
      comments: 520,
      shares: 760,
      featured: true,
      trending: false,
      dateAdded: "2025-03-08T15:30:00Z",
      vendor: {
        id: "v-005",
        name: "SoilTech Labs",
        logo: "/placeholder.svg?height=60&width=60&text=STL",
        location: "Eldoret, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 342,
        followers: 38000,
      },
    },
    {
      id: "agri-006",
      title: "Greenhouse Farming for Year-Round Production",
      description:
        "Discover how greenhouse farming can extend your growing season and protect crops from extreme weather. Learn about different greenhouse designs and management practices.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Greenhouse+Farming",
      duration: 312,
      category: "Protected Cultivation",
      tags: ["Greenhouse", "Year-Round Farming", "Controlled Environment", "Crop Protection"],
      views: 63200,
      likes: 5120,
      comments: 680,
      shares: 940,
      featured: false,
      trending: true,
      dateAdded: "2025-03-14T13:45:00Z",
      vendor: {
        id: "v-006",
        name: "GreenHouse Experts",
        logo: "/placeholder.svg?height=60&width=60&text=GHE",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 298,
        followers: 52000,
      },
    },
    {
      id: "agri-007",
      title: "Livestock Management: Modern Techniques for Healthy Animals",
      description:
        "Learn about modern livestock management practices that improve animal health, productivity, and farm profitability. Focus on cattle, goats, and poultry.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Livestock+Management",
      duration: 356,
      category: "Livestock",
      tags: ["Livestock Management", "Animal Health", "Cattle Farming", "Poultry"],
      views: 54300,
      likes: 4350,
      comments: 590,
      shares: 820,
      featured: true,
      trending: true,
      dateAdded: "2025-03-18T09:30:00Z",
      vendor: {
        id: "v-007",
        name: "LiveStock Pro",
        logo: "/placeholder.svg?height=60&width=60&text=LSP",
        location: "Nakuru, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 356,
        followers: 61000,
      },
    },
    {
      id: "agri-008",
      title: "Agroforestry: Combining Trees and Crops for Sustainable Farming",
      description:
        "Explore the benefits of agroforestry systems that integrate trees with crop production. Learn how this approach improves soil health, biodiversity, and farm resilience.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Agroforestry",
      duration: 287,
      category: "Sustainable Farming",
      tags: ["Agroforestry", "Sustainable Agriculture", "Biodiversity", "Soil Conservation"],
      views: 42700,
      likes: 3580,
      comments: 470,
      shares: 690,
      featured: false,
      trending: true,
      dateAdded: "2025-03-16T10:15:00Z",
      vendor: {
        id: "v-008",
        name: "EcoAgri Systems",
        logo: "/placeholder.svg?height=60&width=60&text=EAS",
        location: "Kisumu, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 312,
        followers: 47000,
      },
    },
    {
      id: "agri-009",
      title: "Post-Harvest Handling to Reduce Crop Losses",
      description:
        "Learn effective post-harvest handling techniques to minimize crop losses and maintain produce quality. Discover storage solutions for different crop types.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Post-Harvest+Handling",
      duration: 268,
      category: "Post-Harvest",
      tags: ["Post-Harvest", "Storage", "Crop Losses", "Food Security"],
      views: 38900,
      likes: 3120,
      comments: 420,
      shares: 580,
      featured: true,
      trending: false,
      dateAdded: "2025-03-07T14:30:00Z",
      vendor: {
        id: "v-009",
        name: "Harvest Solutions",
        logo: "/placeholder.svg?height=60&width=60&text=HS",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.6,
        reviewCount: 278,
        followers: 35000,
      },
    },
    {
      id: "agri-010",
      title: "Digital Farming: Using Apps and Technology for Better Decisions",
      description:
        "Discover how digital farming tools and mobile apps can help farmers make better decisions. From weather forecasting to market prices, technology is transforming agriculture.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Digital+Farming",
      duration: 305,
      category: "Digital Agriculture",
      tags: ["Digital Farming", "Mobile Apps", "AgTech", "Decision Support"],
      views: 67800,
      likes: 5430,
      comments: 720,
      shares: 1050,
      featured: false,
      trending: true,
      dateAdded: "2025-03-09T11:45:00Z",
      vendor: {
        id: "v-010",
        name: "AgriDigital",
        logo: "/placeholder.svg?height=60&width=60&text=AD",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 315,
        followers: 58000,
      },
    },
    {
      id: "agri-011",
      title: "Value Addition for Agricultural Products",
      description:
        "Learn how to increase farm income through value addition. From processing to packaging, discover ways to transform raw agricultural products into higher-value goods.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Value+Addition",
      duration: 289,
      category: "Agribusiness",
      tags: ["Value Addition", "Processing", "Agribusiness", "Farm Income"],
      views: 45600,
      likes: 3780,
      comments: 490,
      shares: 720,
      featured: true,
      trending: false,
      dateAdded: "2025-03-11T16:20:00Z",
      vendor: {
        id: "v-011",
        name: "AgriValue Enterprises",
        logo: "/placeholder.svg?height=60&width=60&text=AVE",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 265,
        followers: 42000,
      },
    },
    {
      id: "agri-012",
      title: "Climate-Smart Agriculture Practices for Changing Weather Patterns",
      description:
        "Discover climate-smart agriculture practices that help farmers adapt to changing weather patterns. Learn strategies for resilience in the face of climate change.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Climate-Smart+Agriculture",
      duration: 332,
      category: "Climate Adaptation",
      tags: ["Climate-Smart", "Resilience", "Weather Adaptation", "Sustainable Farming"],
      views: 52300,
      likes: 4270,
      comments: 580,
      shares: 890,
      featured: true,
      trending: true,
      dateAdded: "2025-03-13T08:45:00Z",
      vendor: {
        id: "v-012",
        name: "Climate Resilient Farming",
        logo: "/placeholder.svg?height=60&width=60&text=CRF",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 187,
        followers: 49000,
      },
    },
  ]
  