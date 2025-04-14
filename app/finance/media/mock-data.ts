// Types
export interface VideoData {
    id: string
    title: string
    description: string
    videoUrl: string
    thumbnailUrl: string
    duration: number // in seconds
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
  
  // Helper function to format numbers (e.g., 1500 -> 1.5K)
  export const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }
  
  // Helper function to format time (e.g., 125 -> 2:05)
  export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  
  // Mock videos data
  export const mockVideos: VideoData[] = [
    {
      id: "fin-001",
      title: "How to Build a Diversified Investment Portfolio",
      description:
        "Learn the fundamentals of portfolio diversification and how to balance risk and reward across different asset classes. This comprehensive guide will help you create a resilient investment strategy for long-term wealth building.",
      videoUrl: "https://example.com/videos/portfolio-diversification.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400",
      duration: 485, // 8:05
      category: "Investment Strategies",
      views: 45800,
      likes: 3200,
      shares: 1250,
      comments: 342,
      dateAdded: "2025-03-15T10:30:00Z",
      featured: true,
      trending: true,
      tags: ["Investing", "Portfolio Management", "Diversification", "Risk Management"],
      vendor: {
        name: "WealthWise Financial",
        logo: "/placeholder.svg?height=100&width=100",
        location: "New York, USA",
        verified: true,
        rating: 4.8,
        reviewCount: 356,
        followers: 125000,
      },
    },
    {
      id: "fin-002",
      title: "Cryptocurrency Investing for Beginners",
      description:
        "A beginner-friendly introduction to cryptocurrency investing. Learn about blockchain technology, major cryptocurrencies, security best practices, and how to start building your digital asset portfolio safely.",
      videoUrl: "https://example.com/videos/crypto-beginners.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400",
      duration: 632, // 10:32
      category: "Cryptocurrency",
      views: 89200,
      likes: 6700,
      shares: 3400,
      comments: 785,
      dateAdded: "2025-03-10T14:45:00Z",
      featured: false,
      trending: true,
      tags: ["Cryptocurrency", "Bitcoin", "Blockchain", "Digital Assets"],
      vendor: {
        name: "Crypto Academy",
        logo: "/placeholder.svg?height=100&width=100",
        location: "San Francisco, USA",
        verified: true,
        rating: 4.7,
        reviewCount: 412,
        followers: 230000,
      },
    },
    {
      id: "fin-003",
      title: "Retirement Planning in Your 30s: Start Early, Retire Rich",
      description:
        "Why starting retirement planning in your 30s can make a massive difference to your financial future. This video covers tax-advantaged accounts, compound interest, and creating a sustainable retirement strategy.",
      videoUrl: "https://example.com/videos/retirement-30s.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400",
      duration: 542, // 9:02
      category: "Retirement Planning",
      views: 32500,
      likes: 2800,
      shares: 1100,
      comments: 295,
      dateAdded: "2025-03-05T09:15:00Z",
      featured: true,
      trending: false,
      tags: ["Retirement", "Financial Planning", "401k", "IRA", "Compound Interest"],
      vendor: {
        name: "Future Wealth Advisors",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Chicago, USA",
        verified: true,
        rating: 4.9,
        reviewCount: 289,
        followers: 98000,
      },
    },
    {
      id: "fin-004",
      title: "Real Estate Investing: Rental Property Strategies",
      description:
        "Discover how to build wealth through rental properties. This video covers property selection, financing options, tenant management, and tax strategies for real estate investors.",
      videoUrl: "https://example.com/videos/rental-property.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400",
      duration: 725, // 12:05
      category: "Real Estate",
      views: 56700,
      likes: 4100,
      shares: 1850,
      comments: 423,
      dateAdded: "2025-03-01T11:20:00Z",
      featured: false,
      trending: false,
      tags: ["Real Estate", "Rental Properties", "Passive Income", "Property Investment"],
      vendor: {
        name: "Property Wealth Builders",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Miami, USA",
        verified: true,
        rating: 4.6,
        reviewCount: 178,
        followers: 85000,
      },
    },
    {
      id: "fin-005",
      title: "Debt Payoff Strategies That Actually Work",
      description:
        "Practical strategies to eliminate debt faster and save thousands in interest. Learn about the debt snowball vs. avalanche methods, debt consolidation, and how to negotiate with creditors.",
      videoUrl: "https://example.com/videos/debt-payoff.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400",
      duration: 495, // 8:15
      category: "Debt Management",
      views: 78300,
      likes: 5900,
      shares: 2700,
      comments: 612,
      dateAdded: "2025-02-25T15:40:00Z",
      featured: false,
      trending: true,
      tags: ["Debt Payoff", "Financial Freedom", "Debt Snowball", "Debt Avalanche"],
      vendor: {
        name: "Financial Freedom Academy",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Atlanta, USA",
        verified: true,
        rating: 4.8,
        reviewCount: 342,
        followers: 165000,
      },
    },
    {
      id: "fin-006",
      title: "Stock Market Investing for Beginners",
      description:
        "A comprehensive guide to getting started in the stock market. Learn about stock selection, fundamental analysis, technical indicators, and building a long-term investment strategy.",
      videoUrl: "https://example.com/videos/stock-beginners.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400",
      duration: 675, // 11:15
      category: "Investment Strategies",
      views: 92100,
      likes: 7200,
      shares: 3800,
      comments: 845,
      dateAdded: "2025-02-20T13:10:00Z",
      featured: true,
      trending: true,
      tags: ["Stock Market", "Investing", "Beginners Guide", "Long-term Investing"],
      vendor: {
        name: "Market Masters",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Boston, USA",
        verified: true,
        rating: 4.9,
        reviewCount: 467,
        followers: 275000,
      },
    },
    {
      id: "fin-007",
      title: "Tax Optimization Strategies for Investors",
      description:
        "Learn how to legally minimize your tax burden as an investor. This video covers tax-loss harvesting, tax-advantaged accounts, capital gains strategies, and more to help you keep more of your investment returns.",
      videoUrl: "https://example.com/videos/tax-optimization.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400",
      duration: 585, // 9:45
      category: "Tax Planning",
      views: 41200,
      likes: 3500,
      shares: 1650,
      comments: 378,
      dateAdded: "2025-02-15T10:25:00Z",
      featured: false,
      trending: false,
      tags: ["Tax Planning", "Tax Optimization", "Capital Gains", "Tax-Loss Harvesting"],
      vendor: {
        name: "Tax Smart Advisors",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Washington DC, USA",
        verified: true,
        rating: 4.7,
        reviewCount: 215,
        followers: 72000,
      },
    },
    {
      id: "fin-008",
      title: "How to Create a Budget That Actually Works",
      description:
        "Practical budgeting techniques that you'll actually stick with. Learn about the 50/30/20 rule, zero-based budgeting, and how to use technology to automate your financial management.",
      videoUrl: "https://example.com/videos/practical-budgeting.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400",
      duration: 515, // 8:35
      category: "Personal Finance",
      views: 68500,
      likes: 5200,
      shares: 2400,
      comments: 532,
      dateAdded: "2025-02-10T16:50:00Z",
      featured: true,
      trending: false,
      tags: ["Budgeting", "Personal Finance", "Money Management", "Financial Planning"],
      vendor: {
        name: "Smart Money Solutions",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Denver, USA",
        verified: true,
        rating: 4.8,
        reviewCount: 298,
        followers: 142000,
      },
    },
    {
      id: "fin-009",
      title: "ETF Investing: Building a Low-Cost Portfolio",
      description:
        "How to build a diversified investment portfolio using low-cost ETFs. Learn about asset allocation, sector ETFs, international exposure, and rebalancing strategies.",
      videoUrl: "https://example.com/videos/etf-investing.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400",
      duration: 562, // 9:22
      category: "Investment Strategies",
      views: 51300,
      likes: 4300,
      shares: 1950,
      comments: 412,
      dateAdded: "2025-02-05T12:30:00Z",
      featured: false,
      trending: true,
      tags: ["ETFs", "Index Funds", "Passive Investing", "Asset Allocation"],
      vendor: {
        name: "Index Investing Pro",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Seattle, USA",
        verified: true,
        rating: 4.9,
        reviewCount: 321,
        followers: 118000,
      },
    },
    {
      id: "fin-010",
      title: "Financial Independence: The FIRE Movement Explained",
      description:
        "An in-depth look at the Financial Independence, Retire Early (FIRE) movement. Learn about aggressive saving strategies, investment approaches, and lifestyle considerations for achieving early retirement.",
      videoUrl: "https://example.com/videos/fire-movement.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400",
      duration: 645, // 10:45
      category: "Financial Independence",
      views: 83700,
      likes: 6800,
      shares: 3200,
      comments: 715,
      dateAdded: "2025-02-01T09:45:00Z",
      featured: true,
      trending: true,
      tags: ["FIRE Movement", "Early Retirement", "Financial Independence", "Frugal Living"],
      vendor: {
        name: "FIRE Academy",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Portland, USA",
        verified: true,
        rating: 4.8,
        reviewCount: 387,
        followers: 195000,
      },
    },
    {
      id: "fin-011",
      title: "Understanding Options Trading for Income",
      description:
        "Learn how to generate income through options trading strategies. This video covers covered calls, cash-secured puts, credit spreads, and risk management techniques for options traders.",
      videoUrl: "https://example.com/videos/options-income.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400",
      duration: 695, // 11:35
      category: "Options Trading",
      views: 47200,
      likes: 3900,
      shares: 1750,
      comments: 398,
      dateAdded: "2025-01-25T14:15:00Z",
      featured: false,
      trending: false,
      tags: ["Options Trading", "Income Strategies", "Covered Calls", "Cash-Secured Puts"],
      vendor: {
        name: "Options Income Pro",
        logo: "/placeholder.svg?height=100&width=100",
        location: "Chicago, USA",
        verified: true,
        rating: 4.7,
        reviewCount: 256,
        followers: 88000,
      },
    },
    {
      id: "fin-012",
      title: "Mastering Personal Finance: The Complete Guide",
      description:
        "A comprehensive overview of personal finance fundamentals. This video covers budgeting, saving, investing, insurance, tax planning, and estate planning to help you build a solid financial foundation.",
      videoUrl: "https://example.com/videos/personal-finance-mastery.mp4",
      thumbnailUrl: "/placeholder.svg?height=600&width=400",
      duration: 825, // 13:45
      category: "Personal Finance",
      views: 105600,
      likes: 8700,
      shares: 4200,
      comments: 925,
      dateAdded: "2025-01-20T11:30:00Z",
      featured: true,
      trending: true,
      tags: ["Personal Finance", "Financial Planning", "Money Management", "Wealth Building"],
      vendor: {
        name: "Financial Mastery Institute",
        logo: "/placeholder.svg?height=100&width=100",
        location: "New York, USA",
        verified: true,
        rating: 4.9,
        reviewCount: 512,
        followers: 320000,
      },
    },
  ]
  