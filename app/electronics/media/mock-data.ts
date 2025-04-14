// Types for electronics media
export interface ElectronicsMediaItem {
    id: string
    title: string
    description: string
    videoUrl: string
    thumbnailUrl: string
    duration: number // in seconds
    category: string
    subcategory: string
    tags: string[]
    views: number
    likes: number
    shares: number
    comments: number
    dateAdded: string
    featured: boolean
    trending: boolean
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
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }
  
  export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  
  // Mock data for electronics media
  export const mockVideos: ElectronicsMediaItem[] = [
    {
      id: "elec-vid-001",
      title: "Samsung Galaxy S23 Ultra - Unboxing and First Impressions",
      description:
        "Check out our unboxing and first impressions of the new Samsung Galaxy S23 Ultra. We explore the camera capabilities, S Pen functionality, and overall performance of this flagship smartphone.",
      videoUrl: "https://example.com/videos/samsung-s23-ultra.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405&text=Samsung+S23+Ultra",
      duration: 485, // 8:05
      category: "Smartphones",
      subcategory: "Samsung",
      tags: ["Samsung", "Galaxy", "S23 Ultra", "Unboxing", "Review"],
      views: 245000,
      likes: 18700,
      shares: 3200,
      comments: 1450,
      dateAdded: "2025-03-15T10:30:00Z",
      featured: true,
      trending: true,
      vendor: {
        id: "tech-rev-01",
        name: "TechReviewers",
        logo: "/placeholder.svg?height=80&width=80&text=TR",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 1250,
        followers: 850000,
      },
    },
    {
      id: "elec-vid-002",
      title: "Sony WH-1000XM5 - The Best Noise Cancelling Headphones?",
      description:
        "We test the Sony WH-1000XM5 headphones in various environments to see if they truly deserve the title of best noise cancelling headphones on the market. Includes sound quality tests and comparison with previous models.",
      videoUrl: "https://example.com/videos/sony-wh1000xm5.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405&text=Sony+WH-1000XM5",
      duration: 612, // 10:12
      category: "Audio",
      subcategory: "Headphones",
      tags: ["Sony", "WH-1000XM5", "Noise Cancelling", "Headphones", "Review"],
      views: 189000,
      likes: 15400,
      shares: 2800,
      comments: 1280,
      dateAdded: "2025-03-10T14:45:00Z",
      featured: false,
      trending: true,
      vendor: {
        id: "audio-guru-01",
        name: "AudioGuru",
        logo: "/placeholder.svg?height=80&width=80&text=AG",
        location: "Mombasa, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 980,
        followers: 720000,
      },
    },
    {
      id: "elec-vid-003",
      title: "MacBook Pro M3 - One Month Later Review",
      description:
        "After using the MacBook Pro with M3 chip for a full month, here's our comprehensive review. We cover performance in real-world tasks, battery life, and whether it's worth upgrading from previous models.",
      videoUrl: "https://example.com/videos/macbook-m3-review.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405&text=MacBook+Pro+M3",
      duration: 845, // 14:05
      category: "Laptops",
      subcategory: "Apple",
      tags: ["Apple", "MacBook Pro", "M3", "Review", "Performance"],
      views: 320000,
      likes: 28500,
      shares: 5200,
      comments: 2340,
      dateAdded: "2025-03-05T09:15:00Z",
      featured: true,
      trending: false,
      vendor: {
        id: "apple-insider-01",
        name: "Apple Insider",
        logo: "/placeholder.svg?height=80&width=80&text=AI",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 1450,
        followers: 920000,
      },
    },
    {
      id: "elec-vid-004",
      title: "LG OLED G3 - The Ultimate Gaming TV?",
      description:
        "We test the LG OLED G3 with the latest gaming consoles and PC to see if it lives up to the hype as the ultimate gaming TV. Includes tests for input lag, HDR performance, and VRR compatibility.",
      videoUrl: "https://example.com/videos/lg-oled-g3-gaming.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405&text=LG+OLED+G3",
      duration: 723, // 12:03
      category: "TVs",
      subcategory: "OLED",
      tags: ["LG", "OLED", "G3", "Gaming", "4K", "HDR"],
      views: 175000,
      likes: 14200,
      shares: 2100,
      comments: 980,
      dateAdded: "2025-03-12T16:20:00Z",
      featured: false,
      trending: false,
      vendor: {
        id: "display-masters-01",
        name: "Display Masters",
        logo: "/placeholder.svg?height=80&width=80&text=DM",
        location: "Kisumu, Kenya",
        verified: true,
        rating: 4.6,
        reviewCount: 870,
        followers: 540000,
      },
    },
    {
      id: "elec-vid-005",
      title: "Samsung Bespoke Refrigerator - Smart Home Integration",
      description:
        "Explore how the Samsung Bespoke refrigerator integrates with your smart home ecosystem. We demonstrate voice control, app features, and how it connects with other smart appliances.",
      videoUrl: "https://example.com/videos/samsung-bespoke-fridge.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405&text=Samsung+Bespoke",
      duration: 542, // 9:02
      category: "Refrigerators",
      subcategory: "Smart Appliances",
      tags: ["Samsung", "Bespoke", "Smart Home", "Refrigerator", "IoT"],
      views: 98000,
      likes: 7600,
      shares: 1800,
      comments: 620,
      dateAdded: "2025-03-08T11:30:00Z",
      featured: false,
      trending: false,
      vendor: {
        id: "smart-home-guru-01",
        name: "Smart Home Guru",
        logo: "/placeholder.svg?height=80&width=80&text=SHG",
        location: "Nairobi, Kenya",
        verified: false,
        rating: 4.5,
        reviewCount: 560,
        followers: 320000,
      },
    },
    {
      id: "elec-vid-006",
      title: "Bosch Built-in Oven - Cooking Test and Review",
      description:
        "We put the Bosch built-in electric oven through a series of cooking tests to evaluate its performance, temperature accuracy, and special features like pyrolytic cleaning.",
      videoUrl: "https://example.com/videos/bosch-oven-review.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405&text=Bosch+Oven",
      duration: 675, // 11:15
      category: "Ovens",
      subcategory: "Built-in",
      tags: ["Bosch", "Oven", "Cooking", "Review", "Kitchen"],
      views: 87000,
      likes: 6900,
      shares: 1500,
      comments: 580,
      dateAdded: "2025-03-07T13:45:00Z",
      featured: false,
      trending: false,
      vendor: {
        id: "kitchen-tech-01",
        name: "Kitchen Tech",
        logo: "/placeholder.svg?height=80&width=80&text=KT",
        location: "Mombasa, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 690,
        followers: 410000,
      },
    },
    {
      id: "elec-vid-007",
      title: "Google Pixel 8 Pro vs iPhone 15 Pro - Camera Comparison",
      description:
        "A detailed camera comparison between the Google Pixel 8 Pro and iPhone 15 Pro. We test both phones in various lighting conditions and scenarios to determine which has the better camera system.",
      videoUrl: "https://example.com/videos/pixel-vs-iphone-camera.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405&text=Pixel+vs+iPhone",
      duration: 925, // 15:25
      category: "Smartphones",
      subcategory: "Camera Comparison",
      tags: ["Google", "Pixel", "iPhone", "Camera", "Comparison"],
      views: 410000,
      likes: 32500,
      shares: 8700,
      comments: 3200,
      dateAdded: "2025-03-14T08:30:00Z",
      featured: true,
      trending: true,
      vendor: {
        id: "mobile-photo-01",
        name: "Mobile Photography",
        logo: "/placeholder.svg?height=80&width=80&text=MP",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 1850,
        followers: 1200000,
      },
    },
    {
      id: "elec-vid-008",
      title: "Dell XPS 15 - The Perfect Windows Laptop?",
      description:
        "A comprehensive review of the Dell XPS 15 laptop, focusing on build quality, display, performance, and battery life. Is this the perfect Windows laptop for professionals?",
      videoUrl: "https://example.com/videos/dell-xps-15-review.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405&text=Dell+XPS+15",
      duration: 785, // 13:05
      category: "Laptops",
      subcategory: "Windows",
      tags: ["Dell", "XPS", "Windows", "Review", "Laptop"],
      views: 165000,
      likes: 13800,
      shares: 2900,
      comments: 1050,
      dateAdded: "2025-03-09T15:20:00Z",
      featured: false,
      trending: true,
      vendor: {
        id: "tech-rev-01",
        name: "TechReviewers",
        logo: "/placeholder.svg?height=80&width=80&text=TR",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 1250,
        followers: 850000,
      },
    },
    {
      id: "elec-vid-009",
      title: "Sonos Era 300 - Spatial Audio Experience",
      description:
        "Experience the Sonos Era 300 speaker with its spatial audio capabilities. We test various music genres and content types to evaluate the immersive sound experience it provides.",
      videoUrl: "https://example.com/videos/sonos-era-300.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405&text=Sonos+Era+300",
      duration: 632, // 10:32
      category: "Audio",
      subcategory: "Speakers",
      tags: ["Sonos", "Era 300", "Spatial Audio", "Speaker", "Review"],
      views: 142000,
      likes: 11500,
      shares: 2400,
      comments: 890,
      dateAdded: "2025-03-11T10:15:00Z",
      featured: true,
      trending: false,
      vendor: {
        id: "audio-guru-01",
        name: "AudioGuru",
        logo: "/placeholder.svg?height=80&width=80&text=AG",
        location: "Mombasa, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 980,
        followers: 720000,
      },
    },
    {
      id: "elec-vid-010",
      title: "Samsung Neo QLED 4K - Gaming and Movie Performance",
      description:
        "We test the Samsung Neo QLED 4K TV for both gaming and movie watching. Includes detailed analysis of picture quality, motion handling, and gaming features like VRR and ALLM.",
      videoUrl: "https://example.com/videos/samsung-neo-qled.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=405&text=Samsung+Neo+QLED",
      duration: 754, // 12:34
      category: "TVs",
      subcategory: "QLED",
      tags: ["Samsung", "Neo QLED", "4K", "Gaming", "Movies"],
      views: 187000,
      likes: 15200,
      shares: 3100,
      comments: 1120,
      dateAdded: "2025-03-13T14:10:00Z",
      featured: false,
      trending: true,
      vendor: {
        id: "display-masters-01",
        name: "Display Masters",
        logo: "/placeholder.svg?height=80&width=80&text=DM",
        location: "Kisumu, Kenya",
        verified: true,
        rating: 4.6,
        reviewCount: 870,
        followers: 540000,
      },
    },
  ]
  
  // Categories with icons
  export const mediaCategories = [
    { id: "smartphones", name: "Smartphones" },
    { id: "tvs", name: "TVs" },
    { id: "laptops", name: "Laptops" },
    { id: "audio", name: "Audio" },
    { id: "refrigerators", name: "Refrigerators" },
    { id: "ovens", name: "Ovens" },
    { id: "cameras", name: "Cameras" },
    { id: "gaming", name: "Gaming" },
    { id: "wearables", name: "Wearables" },
    { id: "smart-home", name: "Smart Home" },
  ]
  