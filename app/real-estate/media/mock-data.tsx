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
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    } else {
      return num.toString()
    }
  }
  
  export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  
  // Mock data for real estate videos
  export const mockVideos: VideoData[] = [
    // Luxury Homes
    {
      id: "re-vid-001",
      title: "Stunning Luxury Villa with Ocean View",
      description:
        "Experience this breathtaking 5-bedroom villa with panoramic ocean views, infinity pool, and state-of-the-art smart home features. Virtual tour of the most exclusive property in Karen.",
      videoUrl: "https://example.com/videos/luxury-villa-tour.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Luxury+Villa+Tour",
      duration: 245, // 4:05
      category: "Luxury Homes",
      tags: ["Luxury", "Villa", "Ocean View", "Smart Home", "Karen"],
      views: 45280,
      likes: 3842,
      shares: 1256,
      comments: 342,
      dateAdded: "2025-03-15T10:30:00Z",
      featured: true,
      trending: true,
      vendor: {
        id: "v-001",
        name: "Elite Properties Kenya",
        logo: "/placeholder.svg?height=200&width=200&text=EP",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 256,
        followers: 15800,
      },
    },
    {
      id: "re-vid-002",
      title: "Modern Penthouse in Westlands Skyline",
      description:
        "Tour this exclusive penthouse with 360° city views, featuring 3 bedrooms, designer interiors, private elevator access, and a rooftop terrace perfect for entertaining.",
      videoUrl: "https://example.com/videos/penthouse-tour.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Penthouse+Tour",
      duration: 198, // 3:18
      category: "Luxury Homes",
      tags: ["Penthouse", "City View", "Modern", "Westlands", "Rooftop"],
      views: 38750,
      likes: 2956,
      shares: 1087,
      comments: 276,
      dateAdded: "2025-03-10T14:45:00Z",
      featured: false,
      trending: true,
      vendor: {
        id: "v-002",
        name: "Urban Spaces Realty",
        logo: "/placeholder.svg?height=200&width=200&text=US",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 189,
        followers: 12400,
      },
    },
  
    // Commercial Properties
    {
      id: "re-vid-003",
      title: "Prime Office Space in Upperhill Business District",
      description:
        "Explore this premium Grade A office space with modern amenities, flexible floor plans, and stunning views of Nairobi's skyline. Perfect for corporate headquarters.",
      videoUrl: "https://example.com/videos/office-space-tour.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Office+Space+Tour",
      duration: 215, // 3:35
      category: "Commercial Properties",
      tags: ["Office", "Business District", "Corporate", "Upperhill", "Grade A"],
      views: 29450,
      likes: 1875,
      shares: 942,
      comments: 187,
      dateAdded: "2025-03-08T09:15:00Z",
      featured: true,
      trending: false,
      vendor: {
        id: "v-003",
        name: "Commercial Property Experts",
        logo: "/placeholder.svg?height=200&width=200&text=CPE",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 142,
        followers: 9800,
      },
    },
    {
      id: "re-vid-004",
      title: "Retail Space in Busy Shopping Mall",
      description:
        "Virtual walkthrough of prime retail space in one of Nairobi's busiest shopping malls. High foot traffic, excellent visibility, and ready for immediate occupancy.",
      videoUrl: "https://example.com/videos/retail-space-tour.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Retail+Space+Tour",
      duration: 178, // 2:58
      category: "Commercial Properties",
      tags: ["Retail", "Shopping Mall", "High Traffic", "Business", "Westlands"],
      views: 24680,
      likes: 1542,
      shares: 876,
      comments: 154,
      dateAdded: "2025-03-05T11:20:00Z",
      featured: false,
      trending: false,
      vendor: {
        id: "v-003",
        name: "Commercial Property Experts",
        logo: "/placeholder.svg?height=200&width=200&text=CPE",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 142,
        followers: 9800,
      },
    },
  
    // Beachfront Properties
    {
      id: "re-vid-005",
      title: "Beachfront Villa in Diani Paradise",
      description:
        "Step into this stunning beachfront villa with direct access to Diani's white sands. Features include an infinity pool, tropical garden, and panoramic ocean views from all bedrooms.",
      videoUrl: "https://example.com/videos/beachfront-villa-tour.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Beachfront+Villa+Tour",
      duration: 267, // 4:27
      category: "Beachfront Properties",
      tags: ["Beachfront", "Villa", "Diani", "Ocean View", "Vacation Home"],
      views: 52340,
      likes: 4125,
      shares: 1876,
      comments: 398,
      dateAdded: "2025-03-12T15:30:00Z",
      featured: true,
      trending: true,
      vendor: {
        id: "v-004",
        name: "Coastal Homes Realty",
        logo: "/placeholder.svg?height=200&width=200&text=CH",
        location: "Mombasa, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 213,
        followers: 14200,
      },
    },
    {
      id: "re-vid-006",
      title: "Oceanfront Apartment with Private Beach Access",
      description:
        "Tour this modern 2-bedroom apartment with stunning sea views and private beach access. Perfect as a holiday home or investment property with excellent rental potential.",
      videoUrl: "https://example.com/videos/oceanfront-apartment-tour.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Oceanfront+Apartment+Tour",
      duration: 195, // 3:15
      category: "Beachfront Properties",
      tags: ["Oceanfront", "Apartment", "Beach Access", "Holiday Home", "Investment"],
      views: 36780,
      likes: 2845,
      shares: 1243,
      comments: 256,
      dateAdded: "2025-03-09T13:45:00Z",
      featured: false,
      trending: false,
      vendor: {
        id: "v-004",
        name: "Coastal Homes Realty",
        logo: "/placeholder.svg?height=200&width=200&text=CH",
        location: "Mombasa, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 213,
        followers: 14200,
      },
    },
  
    // Investment Properties
    {
      id: "re-vid-007",
      title: "High-ROI Apartment Complex in Kilimani",
      description:
        "Investment opportunity: 24-unit apartment complex in the rapidly developing Kilimani area. Detailed walkthrough of the property, current rental income, and projected ROI analysis.",
      videoUrl: "https://example.com/videos/investment-property-tour.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Investment+Property+Tour",
      duration: 285, // 4:45
      category: "Investment Properties",
      tags: ["Investment", "Apartment Complex", "ROI", "Rental Income", "Kilimani"],
      views: 42150,
      likes: 3256,
      shares: 1654,
      comments: 342,
      dateAdded: "2025-03-14T08:30:00Z",
      featured: true,
      trending: false,
      vendor: {
        id: "v-005",
        name: "Investment Property Partners",
        logo: "/placeholder.svg?height=200&width=200&text=IPP",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 176,
        followers: 11500,
      },
    },
    {
      id: "re-vid-008",
      title: "Commercial Building with Guaranteed Tenants",
      description:
        "Explore this fully-leased commercial building with long-term corporate tenants. Detailed breakdown of current rental income, lease terms, and potential for value appreciation.",
      videoUrl: "https://example.com/videos/commercial-investment-tour.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Commercial+Investment+Tour",
      duration: 254, // 4:14
      category: "Investment Properties",
      tags: ["Commercial", "Investment", "Leased", "Rental Income", "Corporate"],
      views: 31240,
      likes: 2435,
      shares: 1342,
      comments: 287,
      dateAdded: "2025-03-11T10:15:00Z",
      featured: false,
      trending: true,
      vendor: {
        id: "v-005",
        name: "Investment Property Partners",
        logo: "/placeholder.svg?height=200&width=200&text=IPP",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 176,
        followers: 11500,
      },
    },
  
    // Land & Development
    {
      id: "re-vid-009",
      title: "Prime Development Land in Karen",
      description:
        "Aerial tour and site walkthrough of 2-acre development land in Karen. All approvals in place for residential development with detailed information on zoning and utilities.",
      videoUrl: "https://example.com/videos/development-land-tour.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Development+Land+Tour",
      duration: 235, // 3:55
      category: "Land & Development",
      tags: ["Land", "Development", "Karen", "Investment", "Residential"],
      views: 38750,
      likes: 2956,
      shares: 1542,
      comments: 312,
      dateAdded: "2025-03-13T14:20:00Z",
      featured: true,
      trending: false,
      vendor: {
        id: "v-006",
        name: "Prime Land Investments",
        logo: "/placeholder.svg?height=200&width=200&text=PLI",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 158,
        followers: 10200,
      },
    },
    {
      id: "re-vid-010",
      title: "Beachfront Land Parcel in Diani",
      description:
        "Drone footage of rare beachfront land with development potential. Includes survey details, approved plans for resort development, and environmental impact assessment.",
      videoUrl: "https://example.com/videos/beachfront-land-tour.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Beachfront+Land+Tour",
      duration: 218, // 3:38
      category: "Land & Development",
      tags: ["Beachfront", "Land", "Development", "Diani", "Resort"],
      views: 45280,
      likes: 3542,
      shares: 1876,
      comments: 356,
      dateAdded: "2025-03-07T09:45:00Z",
      featured: false,
      trending: true,
      vendor: {
        id: "v-007",
        name: "Coastal Land Holdings",
        logo: "/placeholder.svg?height=200&width=200&text=CLH",
        location: "Mombasa, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 132,
        followers: 9800,
      },
    },
  
    // Rental Properties
    {
      id: "re-vid-011",
      title: "Luxury Furnished Apartment for Rent in Westlands",
      description:
        "Virtual tour of fully furnished 3-bedroom apartment available for long-term rental. Features include modern amenities, 24/7 security, and convenient location near business district.",
      videoUrl: "https://example.com/videos/rental-apartment-tour.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Rental+Apartment+Tour",
      duration: 187, // 3:07
      category: "Rental Properties",
      tags: ["Rental", "Furnished", "Apartment", "Westlands", "Long-term"],
      views: 29450,
      likes: 2156,
      shares: 987,
      comments: 243,
      dateAdded: "2025-03-16T11:30:00Z",
      featured: false,
      trending: false,
      vendor: {
        id: "v-008",
        name: "Executive Rentals Kenya",
        logo: "/placeholder.svg?height=200&width=200&text=ERK",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 198,
        followers: 12800,
      },
    },
    {
      id: "re-vid-012",
      title: "Vacation Villa in Malindi with Private Pool",
      description:
        "Tour this stunning vacation rental villa with 4 bedrooms, private pool, and beach access. Available for short-term stays with full staff including chef and housekeeping.",
      videoUrl: "https://example.com/videos/vacation-villa-tour.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Vacation+Villa+Tour",
      duration: 224, // 3:44
      category: "Rental Properties",
      tags: ["Vacation", "Villa", "Rental", "Malindi", "Private Pool"],
      views: 36780,
      likes: 2845,
      shares: 1342,
      comments: 287,
      dateAdded: "2025-03-04T15:45:00Z",
      featured: true,
      trending: true,
      vendor: {
        id: "v-009",
        name: "Holiday Homes Kenya",
        logo: "/placeholder.svg?height=200&width=200&text=HHK",
        location: "Malindi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 167,
        followers: 11200,
      },
    },
  
    // Interior Design
    {
      id: "re-vid-013",
      title: "Modern Interior Design Showcase: Lavington Residence",
      description:
        "Step inside this beautifully designed Lavington home featuring contemporary African interior design. Get inspiration for your own property with detailed room-by-room tour.",
      videoUrl: "https://example.com/videos/interior-design-showcase.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Interior+Design+Showcase",
      duration: 276, // 4:36
      category: "Interior Design",
      tags: ["Interior Design", "Modern", "African", "Lavington", "Inspiration"],
      views: 42150,
      likes: 3456,
      shares: 1765,
      comments: 354,
      dateAdded: "2025-03-17T13:20:00Z",
      featured: true,
      trending: false,
      vendor: {
        id: "v-010",
        name: "Spaces Interior Design",
        logo: "/placeholder.svg?height=200&width=200&text=SID",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 215,
        followers: 18500,
      },
    },
    {
      id: "re-vid-014",
      title: "Luxury Home Staging: Before and After Transformation",
      description:
        "Watch the incredible transformation of a property through professional home staging. Learn how staging can significantly increase property value and reduce time on market.",
      videoUrl: "https://example.com/videos/home-staging-showcase.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Home+Staging+Showcase",
      duration: 245, // 4:05
      category: "Interior Design",
      tags: ["Home Staging", "Transformation", "Property Value", "Selling", "Before and After"],
      views: 38750,
      likes: 3125,
      shares: 1654,
      comments: 312,
      dateAdded: "2025-03-06T10:45:00Z",
      featured: false,
      trending: true,
      vendor: {
        id: "v-011",
        name: "Stage Perfect Properties",
        logo: "/placeholder.svg?height=200&width=200&text=SPP",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 156,
        followers: 13200,
      },
    },
  
    // Property Tours
    {
      id: "re-vid-015",
      title: "Exclusive Golf Estate Home Tour",
      description:
        "Full walkthrough of this exclusive 5-bedroom home in Vipingo Ridge Golf Estate. Features include golf course views, private pool, and luxury finishes throughout.",
      videoUrl: "https://example.com/videos/golf-estate-tour.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Golf+Estate+Tour",
      duration: 298, // 4:58
      category: "Property Tours",
      tags: ["Golf Estate", "Luxury", "Vipingo", "Pool", "Exclusive"],
      views: 52340,
      likes: 4256,
      shares: 1987,
      comments: 412,
      dateAdded: "2025-03-18T09:30:00Z",
      featured: true,
      trending: true,
      vendor: {
        id: "v-012",
        name: "Luxury Coastal Properties",
        logo: "/placeholder.svg?height=200&width=200&text=LCP",
        location: "Kilifi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 187,
        followers: 15400,
      },
    },
    {
      id: "re-vid-016",
      title: "Historic Karen Bungalow with Modern Updates",
      description:
        "Tour this charming colonial-era bungalow in Karen that has been beautifully updated with modern amenities while preserving its historic character and charm.",
      videoUrl: "https://example.com/videos/historic-bungalow-tour.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Historic+Bungalow+Tour",
      duration: 234, // 3:54
      category: "Property Tours",
      tags: ["Historic", "Bungalow", "Karen", "Colonial", "Character"],
      views: 31240,
      likes: 2543,
      shares: 1243,
      comments: 276,
      dateAdded: "2025-03-03T14:15:00Z",
      featured: false,
      trending: false,
      vendor: {
        id: "v-001",
        name: "Elite Properties Kenya",
        logo: "/placeholder.svg?height=200&width=200&text=EP",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 256,
        followers: 15800,
      },
    },
  ]
  