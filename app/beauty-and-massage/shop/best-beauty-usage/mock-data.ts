import { formatDistanceToNow } from "date-fns"

// Types
export interface BeautyVideo {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  videoUrl: string
  duration: number // in seconds
  views: number
  likes: number
  publishedAt: string
  authorId: string
  categoryId: string
  tags: string[]
  featured: boolean
  trending: boolean
  comments: Comment[]
  products?: Product[]
}

export interface Author {
  id: string
  name: string
  avatar: string
  followers: number
  verified: boolean
}

export interface Category {
  id: string
  name: string
}

export interface Comment {
  id: string
  author: {
    name: string
    avatar: string
    verified: boolean
  }
  content: string
  timestamp: string
  likes: number
}

export interface Product {
  name: string
  brand: string
  price: number
  rating: number
  image: string
}

// Mock data
export const authors: Author[] = [
  {
    id: "author1",
    name: "Bella Beauty",
    avatar: "/placeholder.svg?height=100&width=100&text=BB",
    followers: 1200000,
    verified: true,
  },
  {
    id: "author2",
    name: "Makeup Mastery",
    avatar: "/placeholder.svg?height=100&width=100&text=MM",
    followers: 850000,
    verified: true,
  },
  {
    id: "author3",
    name: "Glow Guide",
    avatar: "/placeholder.svg?height=100&width=100&text=GG",
    followers: 500000,
    verified: false,
  },
  {
    id: "author4",
    name: "Celebrity Stylist",
    avatar: "/placeholder.svg?height=100&width=100&text=CS",
    followers: 2500000,
    verified: true,
  },
  {
    id: "author5",
    name: "Beauty Basics",
    avatar: "/placeholder.svg?height=100&width=100&text=BB",
    followers: 350000,
    verified: false,
  },
]

export const videoCategories: Category[] = [
  {
    id: "tutorials",
    name: "Tutorials",
  },
  {
    id: "celebrity",
    name: "Celebrity Routines",
  },
  {
    id: "demonstrations",
    name: "Live Demonstrations",
  },
  {
    id: "skincare",
    name: "Skincare",
  },
  {
    id: "makeup",
    name: "Makeup",
  },
  {
    id: "haircare",
    name: "Haircare",
  },
  {
    id: "trending",
    name: "Trending",
  },
]

// Helper functions
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

export const formatTimeAgo = (dateString: string): string => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  } catch (error) {
    return "some time ago"
  }
}

// Beauty videos data
export const beautyVideos: BeautyVideo[] = [
  {
    id: "video1",
    title: "10-Minute Everyday Makeup Tutorial for Beginners",
    description:
      "Learn how to create a quick and easy everyday makeup look that's perfect for beginners. This tutorial covers all the basics you need to know to get started with makeup.",
    thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Everyday+Makeup",
    videoUrl: "/placeholder.svg?height=720&width=1280&text=Video",
    duration: 612, // 10:12
    views: 1250000,
    likes: 87000,
    publishedAt: "2023-10-15T14:30:00Z",
    authorId: "author1",
    categoryId: "tutorials",
    tags: ["makeup", "beginner", "everyday", "tutorial", "quick"],
    featured: true,
    trending: true,
    comments: [
      {
        id: "comment1",
        author: {
          name: "Makeup Lover",
          avatar: "/placeholder.svg?height=50&width=50&text=ML",
          verified: false,
        },
        content:
          "This tutorial was so helpful! I've always struggled with applying foundation but your tips made it so much easier.",
        timestamp: "2023-10-16T09:45:00Z",
        likes: 342,
      },
      {
        id: "comment2",
        author: {
          name: "Beauty Enthusiast",
          avatar: "/placeholder.svg?height=50&width=50&text=BE",
          verified: true,
        },
        content: "I love how you explained each step so clearly. Perfect for beginners like me!",
        timestamp: "2023-10-16T11:20:00Z",
        likes: 156,
      },
    ],
    products: [
      {
        name: "Luminous Foundation",
        brand: "Glow Cosmetics",
        price: 32.99,
        rating: 4.7,
        image: "/placeholder.svg?height=100&width=100&text=Foundation",
      },
      {
        name: "Natural Blush Palette",
        brand: "Beauty Basics",
        price: 24.5,
        rating: 4.5,
        image: "/placeholder.svg?height=100&width=100&text=Blush",
      },
      {
        name: "Everyday Mascara",
        brand: "Lash Love",
        price: 18.99,
        rating: 4.8,
        image: "/placeholder.svg?height=100&width=100&text=Mascara",
      },
    ],
  },
  {
    id: "video2",
    title: "Celebrity Morning Skincare Routine Revealed",
    description:
      "Get an exclusive look at the morning skincare routine of your favorite celebrity. Learn all the products and techniques they use to maintain their flawless skin.",
    thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Celebrity+Skincare",
    videoUrl: "/placeholder.svg?height=720&width=1280&text=Video",
    duration: 845, // 14:05
    views: 3200000,
    likes: 245000,
    publishedAt: "2023-11-02T10:15:00Z",
    authorId: "author4",
    categoryId: "celebrity",
    tags: ["celebrity", "skincare", "routine", "morning", "exclusive"],
    featured: true,
    trending: true,
    comments: [
      {
        id: "comment3",
        author: {
          name: "Skincare Addict",
          avatar: "/placeholder.svg?height=50&width=50&text=SA",
          verified: false,
        },
        content: "I've been waiting for this! Finally I can try the exact routine my favorite celebrity uses.",
        timestamp: "2023-11-02T12:30:00Z",
        likes: 876,
      },
      {
        id: "comment4",
        author: {
          name: "Glow Getter",
          avatar: "/placeholder.svg?height=50&width=50&text=GG",
          verified: true,
        },
        content: "That vitamin C serum looks amazing! Just ordered it online.",
        timestamp: "2023-11-02T14:45:00Z",
        likes: 543,
      },
    ],
    products: [
      {
        name: "Hydrating Cleanser",
        brand: "Celeb Skin",
        price: 45.0,
        rating: 4.9,
        image: "/placeholder.svg?height=100&width=100&text=Cleanser",
      },
      {
        name: "Vitamin C Brightening Serum",
        brand: "Glow Labs",
        price: 68.5,
        rating: 4.8,
        image: "/placeholder.svg?height=100&width=100&text=Serum",
      },
      {
        name: "SPF 50 Daily Moisturizer",
        brand: "Sun Shield",
        price: 52.99,
        rating: 4.7,
        image: "/placeholder.svg?height=100&width=100&text=SPF",
      },
      {
        name: "Eye Renewal Cream",
        brand: "Celeb Skin",
        price: 75.0,
        rating: 4.6,
        image: "/placeholder.svg?height=100&width=100&text=Eye+Cream",
      },
    ],
  },
  {
    id: "video3",
    title: "Live Demonstration: How to Apply Liquid Eyeliner Perfectly",
    description:
      "Watch this live demonstration on how to apply liquid eyeliner like a pro. Learn techniques for different eye shapes and common mistakes to avoid.",
    thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Eyeliner+Demo",
    videoUrl: "/placeholder.svg?height=720&width=1280&text=Video",
    duration: 723, // 12:03
    views: 980000,
    likes: 76000,
    publishedAt: "2023-12-05T16:45:00Z",
    authorId: "author2",
    categoryId: "demonstrations",
    tags: ["eyeliner", "demonstration", "technique", "makeup", "live"],
    featured: false,
    trending: true,
    comments: [
      {
        id: "comment5",
        author: {
          name: "Cat Eye Queen",
          avatar: "/placeholder.svg?height=50&width=50&text=CEQ",
          verified: false,
        },
        content: "I've been struggling with eyeliner for years! Your tip about the angle changed everything for me.",
        timestamp: "2023-12-05T18:20:00Z",
        likes: 421,
      },
      {
        id: "comment6",
        author: {
          name: "Makeup Artist",
          avatar: "/placeholder.svg?height=50&width=50&text=MA",
          verified: true,
        },
        content: "Great demonstration! I also recommend using a small piece of tape as a guide for beginners.",
        timestamp: "2023-12-05T19:15:00Z",
        likes: 387,
      },
    ],
    products: [
      {
        name: "Precision Liquid Eyeliner",
        brand: "Eye Define",
        price: 22.99,
        rating: 4.8,
        image: "/placeholder.svg?height=100&width=100&text=Eyeliner",
      },
      {
        name: "Makeup Remover Pen",
        brand: "Clean Slate",
        price: 12.5,
        rating: 4.6,
        image: "/placeholder.svg?height=100&width=100&text=Remover",
      },
    ],
  },
  {
    id: "video4",
    title: "5 Minute Hairstyles for Busy Mornings",
    description:
      "Learn how to create 5 quick and easy hairstyles that are perfect for busy mornings when you're short on time but still want to look put together.",
    thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Quick+Hairstyles",
    videoUrl: "/placeholder.svg?height=720&width=1280&text=Video",
    duration: 487, // 8:07
    views: 750000,
    likes: 62000,
    publishedAt: "2024-01-10T08:30:00Z",
    authorId: "author3",
    categoryId: "haircare",
    tags: ["hairstyle", "quick", "easy", "morning", "tutorial"],
    featured: false,
    trending: false,
    comments: [
      {
        id: "comment7",
        author: {
          name: "Hair Enthusiast",
          avatar: "/placeholder.svg?height=50&width=50&text=HE",
          verified: false,
        },
        content: "These hairstyles are lifesavers! I've been using the twisted ponytail every day this week.",
        timestamp: "2024-01-10T10:45:00Z",
        likes: 215,
      },
      {
        id: "comment8",
        author: {
          name: "Busy Mom",
          avatar: "/placeholder.svg?height=50&width=50&text=BM",
          verified: false,
        },
        content: "Thank you for these ideas! As a mom of three, I never have time to style my hair in the morning.",
        timestamp: "2024-01-11T07:30:00Z",
        likes: 189,
      },
    ],
    products: [
      {
        name: "Texturizing Spray",
        brand: "Hair Fix",
        price: 18.99,
        rating: 4.5,
        image: "/placeholder.svg?height=100&width=100&text=Spray",
      },
      {
        name: "No-Crease Hair Ties",
        brand: "Tress Accessories",
        price: 8.5,
        rating: 4.7,
        image: "/placeholder.svg?height=100&width=100&text=Hair+Ties",
      },
    ],
  },
  {
    id: "video5",
    title: "Skincare Routine for Sensitive Skin",
    description:
      "A gentle skincare routine specifically designed for those with sensitive skin. Learn which ingredients to avoid and which products will help soothe and protect your skin.",
    thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Sensitive+Skincare",
    videoUrl: "/placeholder.svg?height=720&width=1280&text=Video",
    duration: 925, // 15:25
    views: 620000,
    likes: 54000,
    publishedAt: "2024-01-25T12:00:00Z",
    authorId: "author5",
    categoryId: "skincare",
    tags: ["skincare", "sensitive", "routine", "gentle", "soothing"],
    featured: false,
    trending: false,
    comments: [
      {
        id: "comment9",
        author: {
          name: "Sensitive Sally",
          avatar: "/placeholder.svg?height=50&width=50&text=SS",
          verified: false,
        },
        content: "I've been looking for a routine like this! My skin reacts to everything, so this is perfect.",
        timestamp: "2024-01-25T14:20:00Z",
        likes: 167,
      },
      {
        id: "comment10",
        author: {
          name: "Dermatologist",
          avatar: "/placeholder.svg?height=50&width=50&text=Dr",
          verified: true,
        },
        content:
          "Great recommendations! I would also suggest patch testing any new product before applying to your entire face.",
        timestamp: "2024-01-26T09:15:00Z",
        likes: 312,
      },
    ],
    products: [
      {
        name: "Gentle Cleansing Milk",
        brand: "Sensitive Care",
        price: 24.99,
        rating: 4.8,
        image: "/placeholder.svg?height=100&width=100&text=Cleanser",
      },
      {
        name: "Calming Facial Toner",
        brand: "Pure Skin",
        price: 19.5,
        rating: 4.6,
        image: "/placeholder.svg?height=100&width=100&text=Toner",
      },
      {
        name: "Fragrance-Free Moisturizer",
        brand: "Sensitive Care",
        price: 28.99,
        rating: 4.9,
        image: "/placeholder.svg?height=100&width=100&text=Moisturizer",
      },
    ],
  },
  {
    id: "video6",
    title: "Celebrity Evening Makeup Transformation",
    description:
      "Watch as I recreate a stunning red carpet makeup look from a recent award show. Learn all the techniques and products used to achieve this glamorous celebrity-inspired look.",
    thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Celebrity+Makeup",
    videoUrl: "/placeholder.svg?height=720&width=1280&text=Video",
    duration: 1245, // 20:45
    views: 1850000,
    likes: 156000,
    publishedAt: "2024-02-05T18:30:00Z",
    authorId: "author4",
    categoryId: "celebrity",
    tags: ["celebrity", "makeup", "transformation", "glamour", "red carpet"],
    featured: true,
    trending: true,
    comments: [
      {
        id: "comment11",
        author: {
          name: "Glam Girl",
          avatar: "/placeholder.svg?height=50&width=50&text=GG",
          verified: false,
        },
        content: "I'm obsessed with this look! Trying it for my friend's wedding this weekend.",
        timestamp: "2024-02-05T20:15:00Z",
        likes: 423,
      },
      {
        id: "comment12",
        author: {
          name: "Pro MUA",
          avatar: "/placeholder.svg?height=50&width=50&text=MUA",
          verified: true,
        },
        content: "The way you applied the eyeshadow is genius! I'll be using that technique with my clients.",
        timestamp: "2024-02-06T10:30:00Z",
        likes: 378,
      },
    ],
    products: [
      {
        name: "Red Carpet Foundation",
        brand: "Celeb Cosmetics",
        price: 48.0,
        rating: 4.9,
        image: "/placeholder.svg?height=100&width=100&text=Foundation",
      },
      {
        name: "Smoky Eye Palette",
        brand: "Glam Squad",
        price: 56.5,
        rating: 4.8,
        image: "/placeholder.svg?height=100&width=100&text=Palette",
      },
      {
        name: "Long-Lasting Lipstick",
        brand: "Celeb Cosmetics",
        price: 32.99,
        rating: 4.7,
        image: "/placeholder.svg?height=100&width=100&text=Lipstick",
      },
      {
        name: "Setting Spray",
        brand: "Stay All Day",
        price: 28.0,
        rating: 4.9,
        image: "/placeholder.svg?height=100&width=100&text=Spray",
      },
    ],
  },
  {
    id: "video7",
    title: "Live Demonstration: How to Contour for Your Face Shape",
    description:
      "In this live demonstration, learn how to contour specifically for your face shape. I'll cover techniques for oval, round, square, heart, and diamond face shapes.",
    thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Contour+Demo",
    videoUrl: "/placeholder.svg?height=720&width=1280&text=Video",
    duration: 1032, // 17:12
    views: 890000,
    likes: 72000,
    publishedAt: "2024-02-15T15:00:00Z",
    authorId: "author2",
    categoryId: "demonstrations",
    tags: ["contour", "face shape", "demonstration", "technique", "makeup"],
    featured: false,
    trending: true,
    comments: [
      {
        id: "comment13",
        author: {
          name: "Contour Queen",
          avatar: "/placeholder.svg?height=50&width=50&text=CQ",
          verified: false,
        },
        content: "I've been contouring wrong for my face shape all this time! This was so helpful.",
        timestamp: "2024-02-15T17:45:00Z",
        likes: 289,
      },
      {
        id: "comment14",
        author: {
          name: "Beauty School Student",
          avatar: "/placeholder.svg?height=50&width=50&text=BSS",
          verified: false,
        },
        content: "Taking notes for my upcoming exam! Your explanations are so clear and easy to follow.",
        timestamp: "2024-02-16T09:20:00Z",
        likes: 176,
      },
    ],
    products: [
      {
        name: "Contour Palette",
        brand: "Shape Master",
        price: 42.99,
        rating: 4.7,
        image: "/placeholder.svg?height=100&width=100&text=Contour",
      },
      {
        name: "Angled Contour Brush",
        brand: "Pro Tools",
        price: 24.5,
        rating: 4.8,
        image: "/placeholder.svg?height=100&width=100&text=Brush",
      },
      {
        name: "Highlighting Stick",
        brand: "Glow Up",
        price: 18.99,
        rating: 4.6,
        image: "/placeholder.svg?height=100&width=100&text=Highlighter",
      },
    ],
  },
  {
    id: "video8",
    title: "Advanced Skincare Tutorial: Understanding Acids and Retinols",
    description:
      "Take your skincare knowledge to the next level with this advanced tutorial on acids and retinols. Learn how to incorporate these powerful ingredients into your routine safely.",
    thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Advanced+Skincare",
    videoUrl: "/placeholder.svg?height=720&width=1280&text=Video",
    duration: 1356, // 22:36
    views: 540000,
    likes: 48000,
    publishedAt: "2024-03-01T11:30:00Z",
    authorId: "author1",
    categoryId: "tutorials",
    tags: ["skincare", "advanced", "acids", "retinol", "tutorial"],
    featured: false,
    trending: false,
    comments: [
      {
        id: "comment15",
        author: {
          name: "Skincare Junkie",
          avatar: "/placeholder.svg?height=50&width=50&text=SJ",
          verified: false,
        },
        content: "Finally someone explained the difference between AHAs and BHAs in a way I can understand!",
        timestamp: "2024-03-01T14:15:00Z",
        likes: 231,
      },
      {
        id: "comment16",
        author: {
          name: "Esthetician",
          avatar: "/placeholder.svg?height=50&width=50&text=Est",
          verified: true,
        },
        content:
          "Great information! I would add that it's important to always use sunscreen when using acids and retinols.",
        timestamp: "2024-03-02T09:45:00Z",
        likes: 345,
      },
    ],
    products: [
      {
        name: "Glycolic Acid Toner",
        brand: "Acid Lab",
        price: 32.0,
        rating: 4.7,
        image: "/placeholder.svg?height=100&width=100&text=Toner",
      },
      {
        name: "Retinol Serum",
        brand: "Night Repair",
        price: 58.5,
        rating: 4.9,
        image: "/placeholder.svg?height=100&width=100&text=Retinol",
      },
      {
        name: "Hyaluronic Acid Moisturizer",
        brand: "Hydra Plus",
        price: 45.99,
        rating: 4.8,
        image: "/placeholder.svg?height=100&width=100&text=Moisturizer",
      },
    ],
  },
]

// Helper functions to get data
export const getVideoById = (id: string): BeautyVideo | undefined => {
  return beautyVideos.find((video) => video.id === id)
}

export const getAuthorById = (id: string): Author | undefined => {
  return authors.find((author) => author.id === id)
}

export const getCategoryById = (id: string): Category | undefined => {
  return videoCategories.find((category) => category.id === id)
}

export const searchVideos = (query: string): BeautyVideo[] => {
  const lowercaseQuery = query.toLowerCase()
  return beautyVideos.filter(
    (video) =>
      video.title.toLowerCase().includes(lowercaseQuery) ||
      video.description.toLowerCase().includes(lowercaseQuery) ||
      video.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}
