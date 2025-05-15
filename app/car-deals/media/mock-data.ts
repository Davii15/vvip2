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
  
  // Mock data for car videos
  export const mockVideos: VideoData[] = [
    {
      id: "car-001",
      title: "2025 Luxury Sedan Test Drive Experience",
      description:
        "Experience the ultimate luxury with the all-new 2025 Lexus ES 350 Premium Edition. Watch as our expert takes you through every feature and the exhilarating driving experience.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Luxury+Sedan",
      duration: 187,
      category: "Luxury Cars",
      tags: ["Luxury", "Sedan", "Test Drive", "2025 Models"],
      views: 245789,
      likes: 18432,
      comments: 2156,
      shares: 4321,
      featured: true,
      trending: true,
      dateAdded: "2025-03-15T10:30:00Z",
      vendor: {
        id: "v-001",
        name: "Premium Auto Gallery",
        logo: "/placeholder.svg?height=60&width=60&text=PAG",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 428,
        followers: 125000,
      },
    },
    {
      id: "car-002",
      title: "Electric SUV Range Test in Real Conditions",
      description:
        "How far can the 2025 Tesla Model Y really go on a single charge? We put it to the test in real-world driving conditions across Kenya's diverse landscapes.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Electric+SUV",
      duration: 245,
      category: "Electric Vehicles",
      tags: ["Electric", "SUV", "Range Test", "Tesla"],
      views: 189543,
      likes: 15678,
      comments: 1876,
      shares: 3254,
      featured: false,
      trending: true,
      dateAdded: "2025-03-10T14:45:00Z",
      vendor: {
        id: "v-002",
        name: "EV Motors Kenya",
        logo: "/placeholder.svg?height=60&width=60&text=EVM",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 315,
        followers: 98000,
      },
    },
    {
      id: "car-003",
      title: "BMW 5 Series Off-Road Capabilities Showcase",
      description:
        "Can a luxury sedan handle rough terrain? Watch as we take the 2022 BMW 5 Series through challenging off-road conditions to test its limits and capabilities.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=BMW+Off-Road",
      duration: 312,
      category: "Luxury Cars",
      tags: ["BMW", "Off-Road", "Luxury", "Performance"],
      views: 132567,
      likes: 12543,
      comments: 1432,
      shares: 2876,
      featured: false,
      trending: false,
      dateAdded: "2025-02-28T09:15:00Z",
      vendor: {
        id: "v-003",
        name: "Executive Auto Imports",
        logo: "/placeholder.svg?height=60&width=60&text=EAI",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 287,
        followers: 85000,
      },
    },
    {
      id: "car-004",
      title: "Family SUV Interior Space Comparison",
      description:
        "Looking for the perfect family SUV? We compare the interior space and comfort features of the top 7-seater SUVs available in Kenya to help you make the right choice.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Family+SUV",
      duration: 278,
      category: "Family Vehicles",
      tags: ["Family", "SUV", "7-Seater", "Comparison"],
      views: 156789,
      likes: 13245,
      comments: 1654,
      shares: 3012,
      featured: true,
      trending: false,
      dateAdded: "2025-03-05T11:20:00Z",
      vendor: {
        id: "v-004",
        name: "Family Auto Center",
        logo: "/placeholder.svg?height=60&width=60&text=FAC",
        location: "Mombasa, Kenya",
        verified: true,
        rating: 4.6,
        reviewCount: 256,
        followers: 72000,
      },
    },
    {
      id: "car-005",
      title: "Premium Alloy Wheels Installation Guide",
      description:
        "Step-by-step guide on how to upgrade your vehicle with our premium 18-inch alloy wheels. Learn professional installation techniques and maintenance tips.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Alloy+Wheels",
      duration: 198,
      category: "Car Parts & Accessories",
      tags: ["Wheels", "DIY", "Installation", "Accessories"],
      views: 98765,
      likes: 8765,
      comments: 987,
      shares: 1543,
      featured: false,
      trending: false,
      dateAdded: "2025-03-08T15:30:00Z",
      vendor: {
        id: "v-005",
        name: "AutoStyle Kenya",
        logo: "/placeholder.svg?height=60&width=60&text=ASK",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 342,
        followers: 65000,
      },
    },
    {
      id: "car-006",
      title: "Advanced Car Audio System Installation & Sound Test",
      description:
        "Watch our experts install and test the Pioneer AVH-X8800BT car audio system. Experience the incredible sound quality and see all the features in action.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Car+Audio",
      duration: 234,
      category: "Car Parts & Accessories",
      tags: ["Audio", "Installation", "Sound Test", "Entertainment"],
      views: 87654,
      likes: 7654,
      comments: 876,
      shares: 1234,
      featured: false,
      trending: true,
      dateAdded: "2025-03-12T13:45:00Z",
      vendor: {
        id: "v-006",
        name: "Car Audio Experts",
        logo: "/placeholder.svg?height=60&width=60&text=CAE",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 298,
        followers: 58000,
      },
    },
    {
      id: "car-007",
      title: "Sports Car Track Day Performance",
      description:
        "Experience the thrill of high-performance sports cars on the track. Watch as professional drivers push these machines to their limits on Kenya's premier racing circuit.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Sports+Car",
      duration: 267,
      category: "Sports Cars",
      tags: ["Sports Car", "Track Day", "Performance", "Racing"],
      views: 176543,
      likes: 14567,
      comments: 1765,
      shares: 3456,
      featured: true,
      trending: true,
      dateAdded: "2025-03-18T09:30:00Z",
      vendor: {
        id: "v-007",
        name: "Performance Motors",
        logo: "/placeholder.svg?height=60&width=60&text=PM",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 356,
        followers: 110000,
      },
    },
    {
      id: "car-008",
      title: "Off-Road 4x4 Adventure in Kenyan Wilderness",
      description:
        "Join us for an epic off-road adventure as we test the capabilities of the latest 4x4 vehicles in Kenya's most challenging terrain. See which ones conquer the wilderness.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Off-Road+4x4",
      duration: 345,
      category: "Off-Road Vehicles",
      tags: ["4x4", "Off-Road", "Adventure", "Safari"],
      views: 165432,
      likes: 13654,
      comments: 1543,
      shares: 2987,
      featured: false,
      trending: true,
      dateAdded: "2025-03-14T10:15:00Z",
      vendor: {
        id: "v-008",
        name: "Safari Motors",
        logo: "/placeholder.svg?height=60&width=60&text=SM",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 312,
        followers: 95000,
      },
    },
    {
      id: "car-009",
      title: "Budget Car Buying Guide for First-Time Owners",
      description:
        "Essential tips and advice for first-time car buyers on a budget. Learn what to look for, common pitfalls to avoid, and how to get the best value for your money.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Budget+Car+Guide",
      duration: 256,
      category: "Car Buying Guides",
      tags: ["Budget", "First-Time Buyer", "Tips", "Guide"],
      views: 143567,
      likes: 12345,
      comments: 1876,
      shares: 2765,
      featured: true,
      trending: false,
      dateAdded: "2025-03-07T14:30:00Z",
      vendor: {
        id: "v-009",
        name: "Value Auto Kenya",
        logo: "/placeholder.svg?height=60&width=60&text=VAK",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.6,
        reviewCount: 278,
        followers: 68000,
      },
    },
    {
      id: "car-010",
      title: "Hybrid vs Electric: Which is Right for You?",
      description:
        "Comprehensive comparison between hybrid and fully electric vehicles available in Kenya. We break down the pros and cons to help you make an informed decision.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Hybrid+vs+Electric",
      duration: 289,
      category: "Electric Vehicles",
      tags: ["Hybrid", "Electric", "Comparison", "Eco-Friendly"],
      views: 132456,
      likes: 11234,
      comments: 1432,
      shares: 2543,
      featured: false,
      trending: false,
      dateAdded: "2025-03-16T11:45:00Z",
      vendor: {
        id: "v-002",
        name: "EV Motors Kenya",
        logo: "/placeholder.svg?height=60&width=60&text=EVM",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 315,
        followers: 98000,
      },
    },
    {
      id: "car-011",
      title: "Car Detailing Secrets from the Professionals",
      description:
        "Learn the professional techniques and products used by top detailers to keep your vehicle looking showroom-new. Step-by-step guide for both interior and exterior.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Car+Detailing",
      duration: 223,
      category: "Car Maintenance",
      tags: ["Detailing", "Maintenance", "Cleaning", "Professional"],
      views: 109876,
      likes: 9876,
      comments: 1098,
      shares: 1876,
      featured: false,
      trending: false,
      dateAdded: "2025-03-09T16:20:00Z",
      vendor: {
        id: "v-010",
        name: "Auto Spa Kenya",
        logo: "/placeholder.svg?height=60&width=60&text=ASK",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 265,
        followers: 52000,
      },
    },
    {
      id: "car-012",
      title: "Classic Car Restoration Project: From Rust to Glory",
      description:
        "Follow the complete restoration journey of a classic 1967 Mustang. See the transformation from a rusted shell to a stunning showpiece through expert craftsmanship.",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Classic+Car+Restoration",
      duration: 378,
      category: "Classic Cars",
      tags: ["Classic", "Restoration", "Mustang", "Vintage"],
      views: 187654,
      likes: 15432,
      comments: 1987,
      shares: 3654,
      featured: true,
      trending: true,
      dateAdded: "2025-03-11T08:45:00Z",
      vendor: {
        id: "v-011",
        name: "Classic Auto Restoration",
        logo: "/placeholder.svg?height=60&width=60&text=CAR",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 187,
        followers: 78000,
      },
    },
  ]
  