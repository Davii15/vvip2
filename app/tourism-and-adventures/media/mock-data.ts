// Types
export interface VideoData {
    id: string
    title: string
    description: string
    videoUrl: string
    thumbnailUrl: string
    duration: number // in seconds
    views: number
    likes: number
    shares: number
    comments: number
    category: string
    tags: string[]
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
  
  // Mock data for tourism videos
  export const mockVideos: VideoData[] = [
    {
      id: "tourism-vid-001",
      title: "Maasai Mara Safari Experience",
      description:
        "Experience the breathtaking wildlife of Kenya's Maasai Mara National Reserve. Watch lions, elephants, and the great wildebeest migration in their natural habitat.",
      videoUrl: "https://your-video-cdn.com/tourism/maasai-mara-safari.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Maasai+Mara",
      duration: 187, // 3:07
      views: 1245000,
      likes: 87500,
      shares: 32400,
      comments: 5600,
      category: "Wildlife Safaris",
      tags: ["Safari", "Wildlife", "Kenya", "Maasai Mara", "Big Five"],
      featured: true,
      trending: true,
      dateAdded: "2025-03-15T10:30:00Z",
      vendor: {
        id: "v001",
        name: "Safari Explorers",
        logo: "/placeholder.svg?height=100&width=100&text=SE",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 342,
        followers: 25600,
      },
    },
    {
      id: "tourism-vid-002",
      title: "Mount Kilimanjaro Climbing Guide",
      description:
        "A comprehensive guide to climbing Africa's highest peak. Learn about the different routes, preparation tips, and what to expect on your journey to the summit.",
      videoUrl: "https://your-video-cdn.com/tourism/kilimanjaro-climbing.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Kilimanjaro",
      duration: 245, // 4:05
      views: 876000,
      likes: 65400,
      shares: 18900,
      comments: 4200,
      category: "Mountain Adventures",
      tags: ["Kilimanjaro", "Hiking", "Tanzania", "Mountain Climbing", "Adventure"],
      featured: false,
      trending: true,
      dateAdded: "2025-03-10T14:45:00Z",
      vendor: {
        id: "v002",
        name: "Peak Adventures",
        logo: "/placeholder.svg?height=100&width=100&text=PA",
        location: "Moshi, Tanzania",
        verified: true,
        rating: 4.9,
        reviewCount: 287,
        followers: 19800,
      },
    },
    {
      id: "tourism-vid-003",
      title: "Zanzibar Beach Paradise",
      description:
        "Discover the pristine white sand beaches and crystal-clear turquoise waters of Zanzibar. Explore the best beach spots, water activities, and luxury resorts.",
      videoUrl: "https://your-video-cdn.com/tourism/zanzibar-beaches.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Zanzibar",
      duration: 163, // 2:43
      views: 1560000,
      likes: 112000,
      shares: 45600,
      comments: 7800,
      category: "Beach Getaways",
      tags: ["Zanzibar", "Beaches", "Tanzania", "Island", "Relaxation"],
      featured: true,
      trending: false,
      dateAdded: "2025-03-05T09:15:00Z",
      vendor: {
        id: "v003",
        name: "Island Escapes",
        logo: "/placeholder.svg?height=100&width=100&text=IE",
        location: "Zanzibar, Tanzania",
        verified: true,
        rating: 4.7,
        reviewCount: 412,
        followers: 31200,
      },
    },
    {
      id: "tourism-vid-004",
      title: "Gorilla Trekking in Uganda",
      description:
        "Join us on an unforgettable journey to see mountain gorillas in their natural habitat. Experience the thrill of encountering these magnificent creatures up close.",
      videoUrl: "https://your-video-cdn.com/tourism/gorilla-trekking.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Gorilla+Trekking",
      duration: 214, // 3:34
      views: 945000,
      likes: 78300,
      shares: 29500,
      comments: 5100,
      category: "Wildlife Safaris",
      tags: ["Gorillas", "Uganda", "Bwindi", "Wildlife", "Conservation"],
      featured: false,
      trending: false,
      dateAdded: "2025-02-28T16:20:00Z",
      vendor: {
        id: "v004",
        name: "Primate Expeditions",
        logo: "/placeholder.svg?height=100&width=100&text=PE",
        location: "Kampala, Uganda",
        verified: true,
        rating: 4.9,
        reviewCount: 198,
        followers: 17400,
      },
    },
    {
      id: "tourism-vid-005",
      title: "Victoria Falls Adventure Guide",
      description:
        "Experience the 'Smoke that Thunders' with our comprehensive guide to Victoria Falls. Discover the best viewpoints, activities, and nearby accommodations.",
      videoUrl: "https://your-video-cdn.com/tourism/victoria-falls.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Victoria+Falls",
      duration: 198, // 3:18
      views: 1120000,
      likes: 89600,
      shares: 34200,
      comments: 6300,
      category: "Natural Wonders",
      tags: ["Victoria Falls", "Zambia", "Zimbabwe", "Waterfall", "Adventure"],
      featured: true,
      trending: true,
      dateAdded: "2025-02-25T11:40:00Z",
      vendor: {
        id: "v005",
        name: "Wonder Tours",
        logo: "/placeholder.svg?height=100&width=100&text=WT",
        location: "Livingstone, Zambia",
        verified: true,
        rating: 4.8,
        reviewCount: 356,
        followers: 28900,
      },
    },
    {
      id: "tourism-vid-006",
      title: "Cape Town Cultural Experience",
      description:
        "Explore the vibrant culture, history, and attractions of Cape Town. From Table Mountain to Robben Island, discover the best this beautiful city has to offer.",
      videoUrl: "https://your-video-cdn.com/tourism/cape-town.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Cape+Town",
      duration: 227, // 3:47
      views: 987000,
      likes: 76500,
      shares: 28700,
      comments: 5400,
      category: "City Explorations",
      tags: ["Cape Town", "South Africa", "Culture", "History", "Urban"],
      featured: false,
      trending: false,
      dateAdded: "2025-02-20T13:25:00Z",
      vendor: {
        id: "v006",
        name: "Urban Discoveries",
        logo: "/placeholder.svg?height=100&width=100&text=UD",
        location: "Cape Town, South Africa",
        verified: true,
        rating: 4.7,
        reviewCount: 289,
        followers: 22100,
      },
    },
    {
      id: "tourism-vid-007",
      title: "Serengeti Migration Safari",
      description:
        "Witness the greatest wildlife spectacle on Earth - the Great Migration in the Serengeti. See millions of wildebeest and zebras crossing rivers and plains.",
      videoUrl: "https://your-video-cdn.com/tourism/serengeti-migration.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Serengeti",
      duration: 256, // 4:16
      views: 1680000,
      likes: 132000,
      shares: 54300,
      comments: 8900,
      category: "Wildlife Safaris",
      tags: ["Serengeti", "Migration", "Tanzania", "Wildlife", "Safari"],
      featured: true,
      trending: true,
      dateAdded: "2025-02-15T08:50:00Z",
      vendor: {
        id: "v001",
        name: "Safari Explorers",
        logo: "/placeholder.svg?height=100&width=100&text=SE",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 342,
        followers: 25600,
      },
    },
    {
      id: "tourism-vid-008",
      title: "Moroccan Desert Adventure",
      description:
        "Journey through the Sahara Desert on camelback and experience the magic of sleeping under the stars in a traditional Berber camp.",
      videoUrl: "https://your-video-cdn.com/tourism/morocco-desert.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Morocco+Desert",
      duration: 183, // 3:03
      views: 1230000,
      likes: 94500,
      shares: 37800,
      comments: 6700,
      category: "Desert Expeditions",
      tags: ["Morocco", "Sahara", "Desert", "Berber", "Camping"],
      featured: false,
      trending: true,
      dateAdded: "2025-02-10T15:35:00Z",
      vendor: {
        id: "v007",
        name: "Desert Nomads",
        logo: "/placeholder.svg?height=100&width=100&text=DN",
        location: "Marrakech, Morocco",
        verified: true,
        rating: 4.9,
        reviewCount: 276,
        followers: 21300,
      },
    },
    {
      id: "tourism-vid-009",
      title: "Egyptian Pyramids Tour",
      description:
        "Explore the ancient wonders of Egypt. Visit the Great Pyramids of Giza, the Sphinx, and learn about the fascinating history of the pharaohs.",
      videoUrl: "https://your-video-cdn.com/tourism/egypt-pyramids.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Egyptian+Pyramids",
      duration: 235, // 3:55
      views: 1890000,
      likes: 156000,
      shares: 67200,
      comments: 12400,
      category: "Historical Sites",
      tags: ["Egypt", "Pyramids", "Ancient", "History", "Archaeology"],
      featured: true,
      trending: false,
      dateAdded: "2025-02-05T12:15:00Z",
      vendor: {
        id: "v008",
        name: "Ancient Wonders",
        logo: "/placeholder.svg?height=100&width=100&text=AW",
        location: "Cairo, Egypt",
        verified: true,
        rating: 4.8,
        reviewCount: 412,
        followers: 34500,
      },
    },
    {
      id: "tourism-vid-010",
      title: "Okavango Delta Boat Safari",
      description:
        "Glide through the waterways of the Okavango Delta in a traditional mokoro canoe. Spot hippos, crocodiles, and exotic birds in this unique ecosystem.",
      videoUrl: "https://your-video-cdn.com/tourism/okavango-delta.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Okavango+Delta",
      duration: 204, // 3:24
      views: 765000,
      likes: 62300,
      shares: 24100,
      comments: 4300,
      category: "Wildlife Safaris",
      tags: ["Okavango", "Botswana", "Delta", "Mokoro", "Wildlife"],
      featured: false,
      trending: false,
      dateAdded: "2025-01-30T09:45:00Z",
      vendor: {
        id: "v009",
        name: "Delta Explorers",
        logo: "/placeholder.svg?height=100&width=100&text=DE",
        location: "Maun, Botswana",
        verified: true,
        rating: 4.9,
        reviewCount: 187,
        followers: 16800,
      },
    },
    {
      id: "tourism-vid-011",
      title: "Rwanda Cultural Experience",
      description:
        "Immerse yourself in the rich culture and traditions of Rwanda. Visit local villages, participate in traditional dances, and learn about the country's history.",
      videoUrl: "https://your-video-cdn.com/tourism/rwanda-culture.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Rwanda+Culture",
      duration: 193, // 3:13
      views: 645000,
      likes: 52800,
      shares: 19700,
      comments: 3800,
      category: "Cultural Tours",
      tags: ["Rwanda", "Culture", "Tradition", "Village", "History"],
      featured: false,
      trending: false,
      dateAdded: "2025-01-25T14:20:00Z",
      vendor: {
        id: "v010",
        name: "Cultural Journeys",
        logo: "/placeholder.svg?height=100&width=100&text=CJ",
        location: "Kigali, Rwanda",
        verified: true,
        rating: 4.7,
        reviewCount: 156,
        followers: 14200,
      },
    },
    {
      id: "tourism-vid-012",
      title: "Seychelles Island Hopping",
      description:
        "Discover the paradise islands of Seychelles. Explore multiple islands, each with its unique charm, pristine beaches, and incredible marine life.",
      videoUrl: "https://your-video-cdn.com/tourism/seychelles-islands.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Seychelles",
      duration: 217, // 3:37
      views: 1340000,
      likes: 108000,
      shares: 42300,
      comments: 7100,
      category: "Beach Getaways",
      tags: ["Seychelles", "Islands", "Beaches", "Marine", "Luxury"],
      featured: true,
      trending: true,
      dateAdded: "2025-01-20T10:55:00Z",
      vendor: {
        id: "v003",
        name: "Island Escapes",
        logo: "/placeholder.svg?height=100&width=100&text=IE",
        location: "Zanzibar, Tanzania",
        verified: true,
        rating: 4.7,
        reviewCount: 412,
        followers: 31200,
      },
    },
    {
      id: "tourism-vid-013",
      title: "Namibian Desert Expedition",
      description:
        "Explore the otherworldly landscapes of Namibia's deserts. Visit Sossusvlei's red dunes, the eerie Deadvlei, and spot desert-adapted wildlife.",
      videoUrl: "https://your-video-cdn.com/tourism/namibia-desert.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Namibia+Desert",
      duration: 228, // 3:48
      views: 895000,
      likes: 73600,
      shares: 28900,
      comments: 5200,
      category: "Desert Expeditions",
      tags: ["Namibia", "Desert", "Sossusvlei", "Dunes", "Landscape"],
      featured: false,
      trending: true,
      dateAdded: "2025-01-15T13:10:00Z",
      vendor: {
        id: "v007",
        name: "Desert Nomads",
        logo: "/placeholder.svg?height=100&width=100&text=DN",
        location: "Marrakech, Morocco",
        verified: true,
        rating: 4.9,
        reviewCount: 276,
        followers: 21300,
      },
    },
    {
      id: "tourism-vid-014",
      title: "Madagascar Lemur Tracking",
      description:
        "Join a specialized expedition to track and observe Madagascar's unique lemurs in their natural habitat. Learn about conservation efforts to protect these endangered primates.",
      videoUrl: "https://your-video-cdn.com/tourism/madagascar-lemurs.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Madagascar+Lemurs",
      duration: 196, // 3:16
      views: 720000,
      likes: 59400,
      shares: 23100,
      comments: 4100,
      category: "Wildlife Safaris",
      tags: ["Madagascar", "Lemurs", "Wildlife", "Conservation", "Rainforest"],
      featured: false,
      trending: false,
      dateAdded: "2025-01-10T09:30:00Z",
      vendor: {
        id: "v004",
        name: "Primate Expeditions",
        logo: "/placeholder.svg?height=100&width=100&text=PE",
        location: "Kampala, Uganda",
        verified: true,
        rating: 4.9,
        reviewCount: 198,
        followers: 17400,
      },
    },
    {
      id: "tourism-vid-015",
      title: "Atlas Mountains Trekking",
      description:
        "Trek through Morocco's stunning Atlas Mountains. Experience breathtaking landscapes, visit Berber villages, and summit North Africa's highest peak.",
      videoUrl: "https://your-video-cdn.com/tourism/atlas-mountains.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Atlas+Mountains",
      duration: 243, // 4:03
      views: 680000,
      likes: 56200,
      shares: 21800,
      comments: 3900,
      category: "Mountain Adventures",
      tags: ["Morocco", "Atlas", "Mountains", "Trekking", "Berber"],
      featured: false,
      trending: false,
      dateAdded: "2025-01-05T15:40:00Z",
      vendor: {
        id: "v002",
        name: "Peak Adventures",
        logo: "/placeholder.svg?height=100&width=100&text=PA",
        location: "Moshi, Tanzania",
        verified: true,
        rating: 4.9,
        reviewCount: 287,
        followers: 19800,
      },
    },
    {
      id: "tourism-vid-016",
      title: "Nile River Cruise Experience",
      description:
        "Sail down the legendary Nile River on a luxury cruise. Visit ancient temples, tombs, and experience life along the world's longest river.",
      videoUrl: "https://your-video-cdn.com/tourism/nile-cruise.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400&text=Nile+Cruise",
      duration: 225, // 3:45
      views: 1120000,
      likes: 91500,
      shares: 36200,
      comments: 6500,
      category: "River Cruises",
      tags: ["Egypt", "Nile", "Cruise", "Temples", "Luxury"],
      featured: true,
      trending: false,
      dateAdded: "2025-01-01T11:25:00Z",
      vendor: {
        id: "v008",
        name: "Ancient Wonders",
        logo: "/placeholder.svg?height=100&width=100&text=AW",
        location: "Cairo, Egypt",
        verified: true,
        rating: 4.8,
        reviewCount: 412,
        followers: 34500,
      },
    },
  ]
  