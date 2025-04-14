// Types for construction materials videos
export interface VideoData {
    id: string
    title: string
    description: string
    videoUrl: string
    thumbnailUrl: string
    duration: number
    category: string
    views: number
    likes: number
    shares: number
    comments: number
    dateAdded: string
    featured: boolean
    trending: boolean
    tags: string[]
    vendor: {
      name: string
      logo: string
      location: string
      verified: boolean
      rating: number
      reviewCount: number
      followers: number
    }
  }
  
  // Helper function to format numbers (e.g., 1.5K, 1.2M)
  export const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }
  
  // Helper function to format time (e.g., 2:30)
  export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  
  // Mock videos data for construction materials
  export const mockVideos: VideoData[] = [
    {
      id: "cm-001",
      title: "Premium Cement Application Techniques for Durability",
      description:
        "Learn professional techniques for applying cement to ensure maximum durability and strength in your construction projects. Our expert demonstrates the perfect water-to-cement ratio and proper curing methods.",
      videoUrl: "/videos/cement-application.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      duration: 245,
      category: "Building Materials",
      views: 45600,
      likes: 3200,
      shares: 1800,
      comments: 420,
      dateAdded: "2025-03-15T10:30:00Z",
      featured: true,
      trending: true,
      tags: ["Cement", "Construction", "Building", "DIY", "Professional"],
      vendor: {
        name: "BuildRight Materials",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 356,
        followers: 12500,
      },
    },
    {
      id: "cm-002",
      title: "Steel Reinforcement Installation Guide",
      description:
        "Comprehensive guide on installing steel reinforcement bars for concrete structures. This video covers proper spacing, tying techniques, and ensuring correct coverage for maximum structural integrity.",
      videoUrl: "/videos/steel-reinforcement.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      duration: 318,
      category: "Building Materials",
      views: 32400,
      likes: 2800,
      shares: 1500,
      comments: 380,
      dateAdded: "2025-03-10T14:45:00Z",
      featured: false,
      trending: true,
      tags: ["Steel", "Reinforcement", "Concrete", "Construction", "Structural"],
      vendor: {
        name: "SteelMasters Kenya",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Mombasa, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 289,
        followers: 9800,
      },
    },
    {
      id: "cm-003",
      title: "Modern Roofing Solutions for Residential Buildings",
      description:
        "Explore the latest roofing materials and installation methods for residential buildings. This video showcases different roofing options including metal sheets, tiles, and shingles with their pros and cons.",
      videoUrl: "/videos/roofing-solutions.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      duration: 275,
      category: "Roofing",
      views: 28900,
      likes: 2400,
      shares: 1300,
      comments: 310,
      dateAdded: "2025-03-05T09:15:00Z",
      featured: true,
      trending: false,
      tags: ["Roofing", "Residential", "Construction", "Metal Sheets", "Tiles"],
      vendor: {
        name: "Mabati Masters",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 412,
        followers: 15200,
      },
    },
    {
      id: "cm-004",
      title: "Power Tools Safety and Maintenance",
      description:
        "Essential safety practices and maintenance tips for construction power tools. Learn how to properly use, store, and maintain your power tools to ensure safety and extend their lifespan.",
      videoUrl: "/videos/power-tools.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      duration: 298,
      category: "Tools & Equipment",
      views: 35700,
      likes: 3100,
      shares: 1900,
      comments: 450,
      dateAdded: "2025-02-28T16:20:00Z",
      featured: false,
      trending: false,
      tags: ["Power Tools", "Safety", "Maintenance", "Construction", "DIY"],
      vendor: {
        name: "ToolMart Kenya",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.6,
        reviewCount: 328,
        followers: 11300,
      },
    },
    {
      id: "cm-005",
      title: "Electrical Wiring Best Practices for New Construction",
      description:
        "Professional electrician demonstrates best practices for electrical wiring in new construction projects. Learn about proper wire selection, installation techniques, and safety considerations.",
      videoUrl: "/videos/electrical-wiring.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      duration: 332,
      category: "Electrical & Plumbing",
      views: 41200,
      likes: 3500,
      shares: 2100,
      comments: 480,
      dateAdded: "2025-02-25T11:10:00Z",
      featured: true,
      trending: true,
      tags: ["Electrical", "Wiring", "Construction", "Safety", "Installation"],
      vendor: {
        name: "ElectroPlumb Solutions",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 376,
        followers: 13800,
      },
    },
    {
      id: "cm-006",
      title: "Interior Paint Selection and Application Techniques",
      description:
        "Guide to selecting the right interior paint and professional application techniques. Learn about different paint types, color selection, surface preparation, and application methods for perfect results.",
      videoUrl: "/videos/interior-paint.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      duration: 287,
      category: "Finishing Materials",
      views: 38600,
      likes: 3300,
      shares: 2000,
      comments: 420,
      dateAdded: "2025-02-20T13:40:00Z",
      featured: false,
      trending: true,
      tags: ["Paint", "Interior", "Finishing", "Decoration", "DIY"],
      vendor: {
        name: "Interior Finishes Ltd",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 215,
        followers: 9500,
      },
    },
    {
      id: "cm-007",
      title: "Modern Door and Window Installation Guide",
      description:
        "Step-by-step guide to installing modern doors and windows in residential and commercial buildings. Learn proper measurement, fitting, sealing, and finishing techniques for perfect installation.",
      videoUrl: "/videos/doors-windows.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      duration: 312,
      category: "Finishing Materials",
      views: 29800,
      likes: 2600,
      shares: 1400,
      comments: 350,
      dateAdded: "2025-02-15T15:30:00Z",
      featured: true,
      trending: false,
      tags: ["Doors", "Windows", "Installation", "Construction", "Finishing"],
      vendor: {
        name: "Modern Doors & Windows",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 183,
        followers: 8700,
      },
    },
    {
      id: "cm-008",
      title: "Hardware and Fasteners Selection Guide for Construction",
      description:
        "Comprehensive guide to selecting the right hardware and fasteners for different construction applications. Learn about different types of nails, screws, bolts, and their specific uses.",
      videoUrl: "/videos/hardware-fasteners.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      duration: 265,
      category: "Hardware & Fasteners",
      views: 25400,
      likes: 2200,
      shares: 1200,
      comments: 290,
      dateAdded: "2025-02-10T10:15:00Z",
      featured: false,
      trending: false,
      tags: ["Hardware", "Fasteners", "Nails", "Screws", "Construction"],
      vendor: {
        name: "Hardware Hub",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.6,
        reviewCount: 156,
        followers: 7200,
      },
    },
    {
      id: "cm-009",
      title: "Concrete Mixing and Pouring Techniques",
      description:
        "Expert demonstration of proper concrete mixing and pouring techniques for various construction applications. Learn about mix ratios, preparation, pouring methods, and curing for optimal strength.",
      videoUrl: "/videos/concrete-mixing.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      duration: 328,
      category: "Building Materials",
      views: 43200,
      likes: 3700,
      shares: 2200,
      comments: 510,
      dateAdded: "2025-02-05T09:45:00Z",
      featured: true,
      trending: true,
      tags: ["Concrete", "Mixing", "Pouring", "Construction", "Foundation"],
      vendor: {
        name: "Premier Construction Supplies",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 356,
        followers: 14300,
      },
    },
    {
      id: "cm-010",
      title: "Plumbing Installation for New Construction",
      description:
        "Complete guide to plumbing installation for new construction projects. Learn about pipe selection, layout planning, proper installation techniques, and testing procedures.",
      videoUrl: "/videos/plumbing-installation.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      duration: 345,
      category: "Electrical & Plumbing",
      views: 36800,
      likes: 3200,
      shares: 1800,
      comments: 430,
      dateAdded: "2025-01-30T14:20:00Z",
      featured: false,
      trending: true,
      tags: ["Plumbing", "Installation", "Construction", "Pipes", "Water Systems"],
      vendor: {
        name: "PowerFlow Systems",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Mombasa, Kenya",
        verified: true,
        rating: 4.6,
        reviewCount: 289,
        followers: 10500,
      },
    },
    {
      id: "cm-011",
      title: "Tile Installation Masterclass for Floors and Walls",
      description:
        "Professional tiler demonstrates expert techniques for installing tiles on floors and walls. Learn about surface preparation, tile layout, cutting, adhesive application, and grouting for perfect results.",
      videoUrl: "/videos/tile-installation.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      duration: 315,
      category: "Finishing Materials",
      views: 31500,
      likes: 2700,
      shares: 1600,
      comments: 380,
      dateAdded: "2025-01-25T11:30:00Z",
      featured: true,
      trending: false,
      tags: ["Tiles", "Installation", "Flooring", "Walls", "Finishing"],
      vendor: {
        name: "Interior Finishes Ltd",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 215,
        followers: 9500,
      },
    },
    {
      id: "cm-012",
      title: "Construction Safety Equipment and Practices",
      description:
        "Essential safety equipment and practices for construction sites. Learn about personal protective equipment, site safety protocols, and best practices to prevent accidents and injuries.",
      videoUrl: "/videos/safety-equipment.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405",
      duration: 298,
      category: "Tools & Equipment",
      views: 39200,
      likes: 3400,
      shares: 2100,
      comments: 460,
      dateAdded: "2025-01-20T16:15:00Z",
      featured: false,
      trending: true,
      tags: ["Safety", "Equipment", "Construction", "PPE", "Site Safety"],
      vendor: {
        name: "SafetyFirst Equipment",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 328,
        followers: 12100,
      },
    },
  ]
  