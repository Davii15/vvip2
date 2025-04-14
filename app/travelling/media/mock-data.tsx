// Types
export interface VideoCategory {
    id: string
    name: string
    description: string
    icon: string
  }
  
  export interface VideoTag {
    id: string
    name: string
  }
  
  export interface VideoAuthor {
    id: string
    name: string
    avatar: string
    verified: boolean
    followers: number
    description?: string
    website?: string
    socialLinks?: {
      instagram?: string
      twitter?: string
      youtube?: string
      tiktok?: string
    }
  }
  
  export interface VideoComment {
    id: string
    author: {
      name: string
      avatar: string
    }
    content: string
    timestamp: string
    likes: number
  }
  
  export interface TravelVideo {
    id: string
    title: string
    description: string
    thumbnailUrl: string
    videoUrl: string
    duration: number // in seconds
    views: number
    likes: number
    shares: number
    comments: VideoComment[]
    publishedAt: string
    categoryId: string
    tags: string[]
    authorId: string
    featured: boolean
    trending: boolean
    location: {
      name: string
      country: string
      coordinates?: {
        lat: number
        lng: number
      }
    }
    travelInfo?: {
      bestTimeToVisit: string[]
      budget: {
        currency: string
        min: number
        max: number
      }
      difficulty: "Easy" | "Moderate" | "Challenging" | "Extreme"
      duration: string
      activities: string[]
    }
  }
  
  // Helper functions
  export const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }
  
  export const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
  
    if (minutes < 60) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }
  
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}:${remainingMinutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  
  export const formatTimeAgo = (dateString: string): string => {
    const now = new Date()
    const date = new Date(dateString)
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
    if (seconds < 60) return `${seconds} seconds ago`
  
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
  
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`
  
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`
  
    const months = Math.floor(days / 30)
    if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`
  
    const years = Math.floor(months / 12)
    return `${years} year${years !== 1 ? "s" : ""} ago`
  }
  
  // Mock data
  export const videoCategories: VideoCategory[] = [
    {
      id: "adventure",
      name: "Adventure Travel",
      description: "Thrilling experiences and adrenaline-pumping activities",
      icon: "mountain",
    },
    {
      id: "cultural",
      name: "Cultural Experiences",
      description: "Immersive cultural journeys and heritage sites",
      icon: "landmark",
    },
    {
      id: "luxury",
      name: "Luxury Travel",
      description: "High-end accommodations and exclusive experiences",
      icon: "star",
    },
    {
      id: "budget",
      name: "Budget Travel",
      description: "Affordable travel tips and backpacking adventures",
      icon: "wallet",
    },
    {
      id: "food",
      name: "Food Tourism",
      description: "Culinary journeys and gastronomic experiences",
      icon: "utensils",
    },
    {
      id: "nature",
      name: "Nature & Wildlife",
      description: "Exploring natural wonders and wildlife encounters",
      icon: "tree",
    },
    {
      id: "city",
      name: "City Breaks",
      description: "Urban explorations and metropolitan adventures",
      icon: "building",
    },
    {
      id: "beach",
      name: "Beach Getaways",
      description: "Coastal paradises and island escapes",
      icon: "umbrella-beach",
    },
  ]
  
  export const videoTags: VideoTag[] = [
    { id: "safari", name: "Safari" },
    { id: "hiking", name: "Hiking" },
    { id: "roadtrip", name: "Road Trip" },
    { id: "backpacking", name: "Backpacking" },
    { id: "solo-travel", name: "Solo Travel" },
    { id: "family-friendly", name: "Family Friendly" },
    { id: "honeymoon", name: "Honeymoon" },
    { id: "photography", name: "Travel Photography" },
    { id: "local-cuisine", name: "Local Cuisine" },
    { id: "historical", name: "Historical Sites" },
    { id: "adventure-sports", name: "Adventure Sports" },
    { id: "cruise", name: "Cruise" },
    { id: "camping", name: "Camping" },
    { id: "wellness", name: "Wellness Retreat" },
    { id: "festivals", name: "Festivals & Events" },
    { id: "hidden-gems", name: "Hidden Gems" },
    { id: "sustainable", name: "Sustainable Travel" },
    { id: "luxury-hotels", name: "Luxury Hotels" },
    { id: "budget-tips", name: "Budget Tips" },
    { id: "travel-hacks", name: "Travel Hacks" },
  ]
  
  export const videoAuthors: VideoAuthor[] = [
    {
      id: "globetrotter",
      name: "The Globetrotter",
      avatar: "/placeholder.svg?height=100&width=100&text=TG",
      verified: true,
      followers: 1250000,
      description: "Full-time traveler sharing adventures from around the world",
      website: "https://theglobetrotter.com",
      socialLinks: {
        instagram: "@theglobetrotter",
        youtube: "TheGlobetrotterTV",
        tiktok: "@theglobetrotter",
      },
    },
    {
      id: "adventure-family",
      name: "Adventure Family",
      avatar: "/placeholder.svg?height=100&width=100&text=AF",
      verified: true,
      followers: 875000,
      description: "Family of 5 traveling the world and homeschooling on the road",
      website: "https://adventurefamily.com",
      socialLinks: {
        instagram: "@adventurefamily",
        youtube: "AdventureFamily",
        twitter: "@adventurefamily",
      },
    },
    {
      id: "budget-nomad",
      name: "Budget Nomad",
      avatar: "/placeholder.svg?height=100&width=100&text=BN",
      verified: true,
      followers: 950000,
      description: "Showing you how to travel the world on a shoestring budget",
      website: "https://budgetnomad.com",
      socialLinks: {
        instagram: "@budgetnomad",
        youtube: "BudgetNomad",
        tiktok: "@budgetnomad",
      },
    },
    {
      id: "luxury-traveler",
      name: "Luxury Traveler",
      avatar: "/placeholder.svg?height=100&width=100&text=LT",
      verified: true,
      followers: 780000,
      description: "Exploring the world's most exclusive destinations and experiences",
      website: "https://luxurytraveler.com",
      socialLinks: {
        instagram: "@luxurytraveler",
        twitter: "@luxurytraveler",
        youtube: "LuxuryTravelerTV",
      },
    },
    {
      id: "food-voyager",
      name: "Food Voyager",
      avatar: "/placeholder.svg?height=100&width=100&text=FV",
      verified: true,
      followers: 1100000,
      description: "Traveling the world one dish at a time",
      website: "https://foodvoyager.com",
      socialLinks: {
        instagram: "@foodvoyager",
        youtube: "FoodVoyager",
        tiktok: "@foodvoyager",
      },
    },
    {
      id: "solo-wanderer",
      name: "Solo Wanderer",
      avatar: "/placeholder.svg?height=100&width=100&text=SW",
      verified: true,
      followers: 920000,
      description: "Solo female traveler sharing safety tips and solo adventures",
      website: "https://solowanderer.com",
      socialLinks: {
        instagram: "@solowanderer",
        youtube: "SoloWanderer",
        twitter: "@solowanderer",
      },
    },
    {
      id: "adventure-couple",
      name: "Adventure Couple",
      avatar: "/placeholder.svg?height=100&width=100&text=AC",
      verified: true,
      followers: 850000,
      description: "Couple traveling the world and seeking thrilling experiences",
      website: "https://adventurecouple.com",
      socialLinks: {
        instagram: "@adventurecouple",
        youtube: "AdventureCouple",
        tiktok: "@adventurecouple",
      },
    },
    {
      id: "eco-explorer",
      name: "Eco Explorer",
      avatar: "/placeholder.svg?height=100&width=100&text=EE",
      verified: true,
      followers: 720000,
      description: "Sustainable travel advocate exploring eco-friendly destinations",
      website: "https://ecoexplorer.com",
      socialLinks: {
        instagram: "@ecoexplorer",
        twitter: "@ecoexplorer",
        youtube: "EcoExplorer",
      },
    },
  ]
  
  // Generate sample comments
  const generateComments = (): VideoComment[] => {
    const commentTemplates = [
      "This place looks amazing! Adding it to my bucket list.",
      "I visited here last year and it was even better in person!",
      "Great video! The cinematography is stunning.",
      "Thanks for sharing all the practical tips. Very helpful!",
      "What camera do you use? The footage is so crisp!",
      "I love how you captured the local culture.",
      "The food looks delicious! Did you have a favorite dish?",
      "How crowded was it when you visited?",
      "What was the weather like during your stay?",
      "Did you need any special permits to visit this place?",
      "Your videos always inspire me to travel more!",
      "How expensive was this trip overall?",
      "Is this place suitable for families with young children?",
      "The views are absolutely breathtaking!",
      "How many days would you recommend staying here?",
      "Was it easy to get around without knowing the local language?",
      "Your travel tips are always so practical and useful.",
      "This looks like paradise on Earth!",
      "Did you feel safe traveling here?",
      "What was the highlight of this destination for you?",
    ]
  
    const commentAuthors = [
      { name: "TravelFan123", avatar: "/placeholder.svg?height=50&width=50&text=TF" },
      { name: "WanderlustSoul", avatar: "/placeholder.svg?height=50&width=50&text=WS" },
      { name: "GlobeTrekker", avatar: "/placeholder.svg?height=50&width=50&text=GT" },
      { name: "AdventureSeeker", avatar: "/placeholder.svg?height=50&width=50&text=AS" },
      { name: "JourneyJunkie", avatar: "/placeholder.svg?height=50&width=50&text=JJ" },
      { name: "ExplorerElite", avatar: "/placeholder.svg?height=50&width=50&text=EE" },
      { name: "VoyageVoyager", avatar: "/placeholder.svg?height=50&width=50&text=VV" },
      { name: "RoamingRover", avatar: "/placeholder.svg?height=50&width=50&text=RR" },
      { name: "BackpackBuddy", avatar: "/placeholder.svg?height=50&width=50&text=BB" },
      { name: "TripTrekker", avatar: "/placeholder.svg?height=50&width=50&text=TT" },
    ]
  
    // Generate 3-8 random comments
    const numComments = Math.floor(Math.random() * 6) + 3
    const comments: VideoComment[] = []
  
    for (let i = 0; i < numComments; i++) {
      const commentIndex = Math.floor(Math.random() * commentTemplates.length)
      const authorIndex = Math.floor(Math.random() * commentAuthors.length)
      const daysAgo = Math.floor(Math.random() * 30) + 1
      const date = new Date()
      date.setDate(date.getDate() - daysAgo)
  
      comments.push({
        id: `comment-${i}`,
        author: commentAuthors[authorIndex],
        content: commentTemplates[commentIndex],
        timestamp: date.toISOString(),
        likes: Math.floor(Math.random() * 100),
      })
    }
  
    return comments
  }
  
  // Generate travel videos
  export const travelVideos: TravelVideo[] = [
    {
      id: "safari-kenya",
      title: "Ultimate Kenya Safari Guide: Big Five Spotting in Maasai Mara",
      description:
        "Join me on an incredible safari adventure through Kenya's Maasai Mara National Reserve. In this video, I share tips for spotting the Big Five, the best time to visit for the Great Migration, and how to choose ethical safari operators. Experience the thrill of watching lions, elephants, and cheetahs in their natural habitat!",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Kenya+Safari",
      videoUrl: "/placeholder.svg?height=720&width=1280&text=Video+Placeholder",
      duration: 845, // 14:05
      views: 1250000,
      likes: 87500,
      shares: 12300,
      comments: generateComments(),
      publishedAt: "2025-02-15T14:30:00Z",
      categoryId: "adventure",
      tags: ["safari", "wildlife", "kenya", "maasai-mara", "big-five"],
      authorId: "globetrotter",
      featured: true,
      trending: true,
      location: {
        name: "Maasai Mara",
        country: "Kenya",
        coordinates: {
          lat: -1.4833,
          lng: 35.0833,
        },
      },
      travelInfo: {
        bestTimeToVisit: ["July", "August", "September", "October"],
        budget: {
          currency: "USD",
          min: 2500,
          max: 5000,
        },
        difficulty: "Moderate",
        duration: "7-10 days",
        activities: ["Game drives", "Hot air balloon safari", "Maasai village visit", "Photography", "Camping"],
      },
    },
    {
      id: "bali-budget",
      title: "Bali on a Budget: 2 Weeks for Under $1000",
      description:
        "Discover how to experience the best of Bali without breaking the bank! This comprehensive guide covers affordable accommodation, cheap local eats, transportation hacks, and free/low-cost activities. I'll show you how I spent 2 weeks in paradise for less than $1000 including flights!",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Bali+Budget",
      videoUrl: "/placeholder.svg?height=720&width=1280&text=Video+Placeholder",
      duration: 925, // 15:25
      views: 1875000,
      likes: 142000,
      shares: 28500,
      comments: generateComments(),
      publishedAt: "2025-03-02T09:15:00Z",
      categoryId: "budget",
      tags: ["budget-tips", "bali", "indonesia", "backpacking", "travel-hacks"],
      authorId: "budget-nomad",
      featured: true,
      trending: true,
      location: {
        name: "Bali",
        country: "Indonesia",
        coordinates: {
          lat: -8.4095,
          lng: 115.1889,
        },
      },
      travelInfo: {
        bestTimeToVisit: ["April", "May", "June", "September"],
        budget: {
          currency: "USD",
          min: 800,
          max: 1200,
        },
        difficulty: "Easy",
        duration: "10-14 days",
        activities: ["Beach hopping", "Temple visits", "Waterfall trekking", "Surfing", "Rice terrace exploration"],
      },
    },
    {
      id: "japan-cherry-blossoms",
      title: "Japan Cherry Blossom Season: Complete Itinerary & Viewing Guide",
      description:
        "Experience the magic of Japan's cherry blossom season with this comprehensive guide. I'll take you through Tokyo, Kyoto, and off-the-beaten-path locations for the best sakura viewing spots. Learn when to visit, how to avoid crowds, and the cultural significance behind this beautiful tradition.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Japan+Cherry+Blossoms",
      videoUrl: "/placeholder.svg?height=720&width=1280&text=Video+Placeholder",
      duration: 1105, // 18:25
      views: 2250000,
      likes: 198000,
      shares: 45600,
      comments: generateComments(),
      publishedAt: "2025-01-20T11:45:00Z",
      categoryId: "cultural",
      tags: ["japan", "cherry-blossoms", "sakura", "tokyo", "kyoto", "cultural"],
      authorId: "solo-wanderer",
      featured: true,
      trending: false,
      location: {
        name: "Multiple Cities",
        country: "Japan",
        coordinates: {
          lat: 35.6762,
          lng: 139.6503,
        },
      },
      travelInfo: {
        bestTimeToVisit: ["March", "April"],
        budget: {
          currency: "USD",
          min: 2000,
          max: 4000,
        },
        difficulty: "Easy",
        duration: "10-14 days",
        activities: [
          "Cherry blossom viewing",
          "Temple visits",
          "Traditional tea ceremonies",
          "Food tours",
          "Cultural experiences",
        ],
      },
    },
    {
      id: "santorini-luxury",
      title: "Santorini Luxury Experience: 5-Star Hotels & Private Yacht Tours",
      description:
        "Indulge in the ultimate luxury experience on the stunning island of Santorini. This video showcases the most exclusive 5-star hotels with private infinity pools, gourmet dining experiences, private yacht tours around the caldera, and VIP sunset viewpoints away from the crowds.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Santorini+Luxury",
      videoUrl: "/placeholder.svg?height=720&width=1280&text=Video+Placeholder",
      duration: 965, // 16:05
      views: 1450000,
      likes: 112000,
      shares: 18900,
      comments: generateComments(),
      publishedAt: "2025-02-28T16:20:00Z",
      categoryId: "luxury",
      tags: ["luxury-hotels", "santorini", "greece", "honeymoon", "yacht"],
      authorId: "luxury-traveler",
      featured: false,
      trending: true,
      location: {
        name: "Santorini",
        country: "Greece",
        coordinates: {
          lat: 36.3932,
          lng: 25.4615,
        },
      },
      travelInfo: {
        bestTimeToVisit: ["May", "June", "September", "October"],
        budget: {
          currency: "EUR",
          min: 5000,
          max: 10000,
        },
        difficulty: "Easy",
        duration: "5-7 days",
        activities: ["Luxury accommodations", "Private yacht tours", "Wine tasting", "Gourmet dining", "Spa treatments"],
      },
    },
    {
      id: "mexico-food-tour",
      title: "Ultimate Mexican Street Food Tour: From Tacos to Tamales",
      description:
        "Embark on a mouthwatering journey through Mexico's vibrant street food scene! From Mexico City to Oaxaca and beyond, I'll guide you through the best street food stalls, markets, and local eateries. Discover authentic tacos, tamales, tlayudas, and many more delicious treats that define Mexican cuisine.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Mexico+Food+Tour",
      videoUrl: "/placeholder.svg?height=720&width=1280&text=Video+Placeholder",
      duration: 1250, // 20:50
      views: 1680000,
      likes: 145000,
      shares: 32700,
      comments: generateComments(),
      publishedAt: "2025-03-10T13:00:00Z",
      categoryId: "food",
      tags: ["food", "mexico", "street-food", "culinary", "local-cuisine"],
      authorId: "food-voyager",
      featured: false,
      trending: true,
      location: {
        name: "Multiple Cities",
        country: "Mexico",
        coordinates: {
          lat: 19.4326,
          lng: -99.1332,
        },
      },
      travelInfo: {
        bestTimeToVisit: ["October", "November", "April", "May"],
        budget: {
          currency: "USD",
          min: 1500,
          max: 3000,
        },
        difficulty: "Easy",
        duration: "10-14 days",
        activities: ["Food tours", "Cooking classes", "Market visits", "Mezcal tasting", "Restaurant hopping"],
      },
    },
    {
      id: "amazon-rainforest",
      title: "Amazon Rainforest Expedition: Wildlife Encounters & Indigenous Communities",
      description:
        "Join our family on an unforgettable expedition into the heart of the Amazon Rainforest. We'll share our experiences spotting exotic wildlife, staying with indigenous communities, and navigating the mighty Amazon River. Learn about conservation efforts and how to visit this incredible ecosystem responsibly.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Amazon+Rainforest",
      videoUrl: "/placeholder.svg?height=720&width=1280&text=Video+Placeholder",
      duration: 1320, // 22:00
      views: 980000,
      likes: 87000,
      shares: 15600,
      comments: generateComments(),
      publishedAt: "2025-02-05T10:30:00Z",
      categoryId: "nature",
      tags: ["amazon", "rainforest", "wildlife", "indigenous", "eco-tourism"],
      authorId: "adventure-family",
      featured: true,
      trending: false,
      location: {
        name: "Amazon Rainforest",
        country: "Brazil",
        coordinates: {
          lat: -3.4653,
          lng: -62.2159,
        },
      },
      travelInfo: {
        bestTimeToVisit: ["June", "July", "August", "September"],
        budget: {
          currency: "USD",
          min: 2500,
          max: 5000,
        },
        difficulty: "Challenging",
        duration: "7-14 days",
        activities: ["Wildlife spotting", "Jungle trekking", "River cruises", "Indigenous village visits", "Camping"],
      },
    },
    {
      id: "new-york-city-guide",
      title: "New York City: Ultimate First-Timer's Guide & Hidden Gems",
      description:
        "Discover the best of New York City with this comprehensive guide for first-time visitors. Beyond the iconic attractions like Times Square and the Statue of Liberty, I'll show you hidden gems, local neighborhoods, affordable dining spots, and insider tips to experience NYC like a local.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=NYC+Guide",
      videoUrl: "/placeholder.svg?height=720&width=1280&text=Video+Placeholder",
      duration: 1185, // 19:45
      views: 2100000,
      likes: 178000,
      shares: 41200,
      comments: generateComments(),
      publishedAt: "2025-01-15T15:45:00Z",
      categoryId: "city",
      tags: ["new-york", "city-guide", "urban", "usa", "hidden-gems"],
      authorId: "solo-wanderer",
      featured: false,
      trending: false,
      location: {
        name: "New York City",
        country: "United States",
        coordinates: {
          lat: 40.7128,
          lng: -74.006,
        },
      },
      travelInfo: {
        bestTimeToVisit: ["April", "May", "September", "October"],
        budget: {
          currency: "USD",
          min: 1500,
          max: 4000,
        },
        difficulty: "Easy",
        duration: "5-7 days",
        activities: ["Sightseeing", "Museum visits", "Broadway shows", "Food tours", "Shopping"],
      },
    },
    {
      id: "maldives-overwater",
      title: "Maldives Overwater Bungalow Experience: Worth the Splurge?",
      description:
        "Is staying in an overwater bungalow in the Maldives worth the hefty price tag? In this video, we share our honest review of the experience, comparing different resorts, price points, and what you actually get for your money. Plus, tips for finding deals and maximizing your stay in paradise!",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Maldives+Bungalows",
      videoUrl: "/placeholder.svg?height=720&width=1280&text=Video+Placeholder",
      duration: 1050, // 17:30
      views: 1350000,
      likes: 118000,
      shares: 25800,
      comments: generateComments(),
      publishedAt: "2025-03-05T12:15:00Z",
      categoryId: "luxury",
      tags: ["maldives", "overwater-bungalow", "luxury", "beach", "honeymoon"],
      authorId: "adventure-couple",
      featured: false,
      trending: true,
      location: {
        name: "Maldives",
        country: "Maldives",
        coordinates: {
          lat: 3.2028,
          lng: 73.2207,
        },
      },
      travelInfo: {
        bestTimeToVisit: ["November", "December", "January", "February", "March", "April"],
        budget: {
          currency: "USD",
          min: 4000,
          max: 10000,
        },
        difficulty: "Easy",
        duration: "5-10 days",
        activities: ["Snorkeling", "Scuba diving", "Spa treatments", "Water sports", "Island hopping"],
      },
    },
    {
      id: "morocco-desert",
      title: "Morocco Desert Adventure: Sahara Camping & Camel Trekking",
      description:
        "Experience the magic of the Sahara Desert in Morocco! This video covers our 3-day desert expedition from Marrakech, including camel trekking across the dunes, camping under the stars with Berber guides, and visiting ancient kasbahs along the way. I'll share practical tips for planning your own desert adventure!",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Morocco+Desert",
      videoUrl: "/placeholder.svg?height=720&width=1280&text=Video+Placeholder",
      duration: 1140, // 19:00
      views: 1120000,
      likes: 95000,
      shares: 18700,
      comments: generateComments(),
      publishedAt: "2025-02-20T14:00:00Z",
      categoryId: "adventure",
      tags: ["morocco", "sahara", "desert", "camping", "camel-trek"],
      authorId: "globetrotter",
      featured: true,
      trending: false,
      location: {
        name: "Sahara Desert",
        country: "Morocco",
        coordinates: {
          lat: 31.7917,
          lng: -7.0926,
        },
      },
      travelInfo: {
        bestTimeToVisit: ["October", "November", "March", "April"],
        budget: {
          currency: "USD",
          min: 800,
          max: 2000,
        },
        difficulty: "Moderate",
        duration: "7-10 days",
        activities: ["Camel trekking", "Desert camping", "Stargazing", "Photography", "Cultural experiences"],
      },
    },
    {
      id: "thailand-islands",
      title: "Thailand Island Hopping Guide: Finding Paradise on a Budget",
      description:
        "Discover the best islands in Thailand without breaking the bank! From popular spots like Phuket and Koh Phi Phi to hidden gems like Koh Lipe and Koh Yao Noi, I'll show you how to island hop efficiently, find affordable accommodation, and experience the best beaches, snorkeling spots, and local culture.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Thailand+Islands",
      videoUrl: "/placeholder.svg?height=720&width=1280&text=Video+Placeholder",
      duration: 1275, // 21:15
      views: 1580000,
      likes: 132000,
      shares: 29800,
      comments: generateComments(),
      publishedAt: "2025-01-25T09:45:00Z",
      categoryId: "budget",
      tags: ["thailand", "islands", "beach", "budget-tips", "backpacking"],
      authorId: "budget-nomad",
      featured: false,
      trending: true,
      location: {
        name: "Thai Islands",
        country: "Thailand",
        coordinates: {
          lat: 7.9519,
          lng: 98.3381,
        },
      },
      travelInfo: {
        bestTimeToVisit: ["November", "December", "January", "February", "March"],
        budget: {
          currency: "USD",
          min: 1000,
          max: 2500,
        },
        difficulty: "Easy",
        duration: "10-14 days",
        activities: ["Island hopping", "Snorkeling", "Beach relaxation", "Boat tours", "Water sports"],
      },
    },
    {
      id: "peru-machu-picchu",
      title: "Hiking the Inca Trail to Machu Picchu: Complete Guide & Preparation Tips",
      description:
        "Planning to hike the legendary Inca Trail to Machu Picchu? This comprehensive guide covers everything you need to know: permits, physical preparation, packing essentials, altitude acclimatization, and what to expect each day on the trail. Experience the breathtaking journey to one of the world's most iconic archaeological sites!",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Inca+Trail",
      videoUrl: "/placeholder.svg?height=720&width=1280&text=Video+Placeholder",
      duration: 1380, // 23:00
      views: 1420000,
      likes: 124000,
      shares: 27500,
      comments: generateComments(),
      publishedAt: "2025-02-10T16:30:00Z",
      categoryId: "adventure",
      tags: ["peru", "machu-picchu", "inca-trail", "hiking", "historical"],
      authorId: "adventure-couple",
      featured: true,
      trending: false,
      location: {
        name: "Machu Picchu",
        country: "Peru",
        coordinates: {
          lat: -13.1631,
          lng: -72.545,
        },
      },
      travelInfo: {
        bestTimeToVisit: ["May", "June", "July", "August", "September"],
        budget: {
          currency: "USD",
          min: 1500,
          max: 3000,
        },
        difficulty: "Challenging",
        duration: "7-10 days",
        activities: ["Hiking", "Archaeological sites", "Photography", "Camping", "Cultural experiences"],
      },
    },
    {
      id: "paris-food-guide",
      title: "Paris Food Guide: From Michelin Stars to Hidden Bistros",
      description:
        "Discover the culinary delights of Paris with this comprehensive food guide! From iconic Michelin-starred restaurants to charming neighborhood bistros and hidden gems only locals know about. Learn about French cuisine, how to order like a local, and the best food markets, bakeries, and cheese shops in the City of Light.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Paris+Food",
      videoUrl: "/placeholder.svg?height=720&width=1280&text=Video+Placeholder",
      duration: 1155, // 19:15
      views: 1320000,
      likes: 112000,
      shares: 24600,
      comments: generateComments(),
      publishedAt: "2025-03-15T11:00:00Z",
      categoryId: "food",
      tags: ["paris", "france", "food", "culinary", "restaurants"],
      authorId: "food-voyager",
      featured: false,
      trending: false,
      location: {
        name: "Paris",
        country: "France",
        coordinates: {
          lat: 48.8566,
          lng: 2.3522,
        },
      },
      travelInfo: {
        bestTimeToVisit: ["April", "May", "June", "September", "October"],
        budget: {
          currency: "EUR",
          min: 1500,
          max: 4000,
        },
        difficulty: "Easy",
        duration: "4-7 days",
        activities: ["Food tours", "Cooking classes", "Market visits", "Wine tasting", "Restaurant dining"],
      },
    },
  ]
  
  // Function to get videos by category
  export const getVideosByCategory = (categoryId: string): TravelVideo[] => {
    return travelVideos.filter((video) => video.categoryId === categoryId)
  }
  
  // Function to get featured videos
  export const getFeaturedVideos = (): TravelVideo[] => {
    return travelVideos.filter((video) => video.featured)
  }
  
  // Function to get trending videos
  export const getTrendingVideos = (): TravelVideo[] => {
    return travelVideos.filter((video) => video.trending)
  }
  
  // Function to get video by ID
  export const getVideoById = (id: string): TravelVideo | undefined => {
    return travelVideos.find((video) => video.id === id)
  }
  
  // Function to get author by ID
  export const getAuthorById = (id: string): VideoAuthor | undefined => {
    return videoAuthors.find((author) => author.id === id)
  }
  
  // Function to get category by ID
  export const getCategoryById = (id: string): VideoCategory | undefined => {
    return videoCategories.find((category) => category.id === id)
  }
  
  // Function to search videos
  export const searchVideos = (query: string): TravelVideo[] => {
    const lowerCaseQuery = query.toLowerCase()
    return travelVideos.filter(
      (video) =>
        video.title.toLowerCase().includes(lowerCaseQuery) ||
        video.description.toLowerCase().includes(lowerCaseQuery) ||
        video.location.name.toLowerCase().includes(lowerCaseQuery) ||
        video.location.country.toLowerCase().includes(lowerCaseQuery) ||
        video.tags.some((tag) => tag.includes(lowerCaseQuery)),
    )
  }
  