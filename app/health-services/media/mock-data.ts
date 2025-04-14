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
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }
  
  // Mock videos data
  export const mockVideos: VideoData[] = [
    {
      id: "health-vid-001",
      title: "Advanced Cardiac Surgery Techniques",
      description:
        "Dr. Sarah Johnson demonstrates the latest minimally invasive cardiac surgery techniques that reduce recovery time and improve patient outcomes.",
      videoUrl: "https://example.com/videos/cardiac-surgery.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Cardiac+Surgery",
      duration: 245, // 4:05
      category: "Hospitals",
      tags: ["Surgery", "Cardiac Care", "Medical Innovation", "Healthcare"],
      views: 45600,
      likes: 3200,
      comments: 420,
      shares: 890,
      featured: true,
      trending: true,
      dateAdded: "2025-03-15T10:30:00Z",
      vendor: {
        id: "hosp-001",
        name: "National Heart Institute",
        logo: "/placeholder.svg?height=200&width=200&text=NHI",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 428,
        followers: 25600,
      },
    },
    {
      id: "health-vid-002",
      title: "Pediatric Care: What Every Parent Should Know",
      description:
        "Dr. Michael Omondi shares essential information about pediatric care, common childhood illnesses, and when to seek medical attention for your child.",
      videoUrl: "https://example.com/videos/pediatric-care.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Pediatric+Care",
      duration: 318, // 5:18
      category: "Specialists",
      tags: ["Pediatrics", "Child Health", "Parenting", "Healthcare"],
      views: 38900,
      likes: 2800,
      comments: 356,
      shares: 1240,
      featured: false,
      trending: true,
      dateAdded: "2025-03-10T14:45:00Z",
      vendor: {
        id: "spec-001",
        name: "Children's Wellness Clinic",
        logo: "/placeholder.svg?height=200&width=200&text=CWC",
        location: "Mombasa, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 312,
        followers: 18900,
      },
    },
    {
      id: "health-vid-003",
      title: "Mental Health Awareness: Breaking the Stigma",
      description:
        "Clinical psychologist Dr. Jane Wambui discusses the importance of mental health awareness and strategies to overcome stigma in our communities.",
      videoUrl: "https://example.com/videos/mental-health.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Mental+Health",
      duration: 412, // 6:52
      category: "Mental Health",
      tags: ["Mental Health", "Psychology", "Wellness", "Healthcare"],
      views: 52300,
      likes: 4100,
      comments: 620,
      shares: 1850,
      featured: true,
      trending: false,
      dateAdded: "2025-03-05T09:15:00Z",
      vendor: {
        id: "mh-001",
        name: "Mind Wellness Institute",
        logo: "/placeholder.svg?height=200&width=200&text=MWI",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 215,
        followers: 31200,
      },
    },
    {
      id: "health-vid-004",
      title: "Nutritional Guidance for Chronic Disease Management",
      description:
        "Registered dietitian Mary Kamau explains how proper nutrition can help manage chronic diseases like diabetes, hypertension, and heart disease.",
      videoUrl: "https://example.com/videos/nutrition-chronic-disease.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Nutrition+Guidance",
      duration: 287, // 4:47
      category: "Wellness",
      tags: ["Nutrition", "Chronic Disease", "Diet", "Healthcare"],
      views: 29700,
      likes: 2100,
      comments: 310,
      shares: 780,
      featured: false,
      trending: false,
      dateAdded: "2025-03-12T16:20:00Z",
      vendor: {
        id: "well-001",
        name: "Vitality Wellness Center",
        logo: "/placeholder.svg?height=200&width=200&text=VWC",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 189,
        followers: 15800,
      },
    },
    {
      id: "health-vid-005",
      title: "Emergency Response: First Aid Techniques Everyone Should Know",
      description:
        "Emergency medicine specialist Dr. David Mutua demonstrates essential first aid techniques that can save lives in emergency situations.",
      videoUrl: "https://example.com/videos/emergency-first-aid.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Emergency+First+Aid",
      duration: 356, // 5:56
      category: "Emergency Care",
      tags: ["First Aid", "Emergency Medicine", "Safety", "Healthcare"],
      views: 63400,
      likes: 5200,
      comments: 720,
      shares: 2340,
      featured: true,
      trending: true,
      dateAdded: "2025-03-08T11:30:00Z",
      vendor: {
        id: "emerg-001",
        name: "Emergency Medical Services",
        logo: "/placeholder.svg?height=200&width=200&text=EMS",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 356,
        followers: 42100,
      },
    },
    {
      id: "health-vid-006",
      title: "Prenatal Care: Ensuring a Healthy Pregnancy",
      description:
        "Obstetrician Dr. Elizabeth Wanjiru shares important information about prenatal care, nutrition during pregnancy, and preparing for childbirth.",
      videoUrl: "https://example.com/videos/prenatal-care.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Prenatal+Care",
      duration: 328, // 5:28
      category: "Specialists",
      tags: ["Pregnancy", "Prenatal Care", "Women's Health", "Healthcare"],
      views: 41200,
      likes: 3600,
      comments: 480,
      shares: 1560,
      featured: false,
      trending: true,
      dateAdded: "2025-03-14T13:45:00Z",
      vendor: {
        id: "spec-002",
        name: "Women's Health Specialists",
        logo: "/placeholder.svg?height=200&width=200&text=WHS",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 245,
        followers: 22300,
      },
    },
    {
      id: "health-vid-007",
      title: "Holistic Approaches to Pain Management",
      description:
        "Dr. Anita Sharma discusses holistic and integrative approaches to managing chronic pain, including acupuncture, physical therapy, and mind-body techniques.",
      videoUrl: "https://example.com/videos/holistic-pain-management.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Holistic+Pain+Management",
      duration: 298, // 4:58
      category: "Alternative Medicine",
      tags: ["Pain Management", "Holistic Health", "Alternative Medicine", "Healthcare"],
      views: 27800,
      likes: 2300,
      comments: 340,
      shares: 920,
      featured: false,
      trending: false,
      dateAdded: "2025-03-09T15:20:00Z",
      vendor: {
        id: "alt-001",
        name: "Holistic Healing Center",
        logo: "/placeholder.svg?height=200&width=200&text=HHC",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.6,
        reviewCount: 156,
        followers: 14200,
      },
    },
    {
      id: "health-vid-008",
      title: "Diabetes Management: Latest Approaches and Technologies",
      description:
        "Endocrinologist Dr. James Mwangi explains the latest approaches and technologies for managing diabetes, including continuous glucose monitoring and insulin pump therapy.",
      videoUrl: "https://example.com/videos/diabetes-management.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Diabetes+Management",
      duration: 375, // 6:15
      category: "Specialists",
      tags: ["Diabetes", "Endocrinology", "Medical Technology", "Healthcare"],
      views: 34600,
      likes: 2700,
      comments: 390,
      shares: 1080,
      featured: true,
      trending: false,
      dateAdded: "2025-03-11T10:15:00Z",
      vendor: {
        id: "spec-003",
        name: "Diabetes Care Center",
        logo: "/placeholder.svg?height=200&width=200&text=DCC",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.8,
        reviewCount: 198,
        followers: 19700,
      },
    },
    {
      id: "health-vid-009",
      title: "Physical Therapy: Recovering from Sports Injuries",
      description:
        "Physical therapist John Kamau demonstrates effective rehabilitation techniques for common sports injuries and strategies to prevent future injuries.",
      videoUrl: "https://example.com/videos/sports-injury-rehab.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Sports+Injury+Rehab",
      duration: 312, // 5:12
      category: "Rehabilitation",
      tags: ["Physical Therapy", "Sports Medicine", "Injury Recovery", "Healthcare"],
      views: 31200,
      likes: 2400,
      comments: 350,
      shares: 870,
      featured: false,
      trending: true,
      dateAdded: "2025-03-13T14:30:00Z",
      vendor: {
        id: "rehab-001",
        name: "Sports Medicine & Rehabilitation",
        logo: "/placeholder.svg?height=200&width=200&text=SMR",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 176,
        followers: 16900,
      },
    },
    {
      id: "health-vid-010",
      title: "Dental Health: Beyond Just Brushing",
      description:
        "Dentist Dr. Sarah Njoroge discusses comprehensive dental care practices, common dental problems, and the connection between oral health and overall health.",
      videoUrl: "https://example.com/videos/dental-health.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Dental+Health",
      duration: 267, // 4:27
      category: "Specialists",
      tags: ["Dental Health", "Oral Care", "Preventive Health", "Healthcare"],
      views: 25800,
      likes: 1900,
      comments: 280,
      shares: 720,
      featured: false,
      trending: false,
      dateAdded: "2025-03-07T12:40:00Z",
      vendor: {
        id: "spec-004",
        name: "Smile Dental Clinic",
        logo: "/placeholder.svg?height=200&width=200&text=SDC",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.6,
        reviewCount: 142,
        followers: 12800,
      },
    },
    {
      id: "health-vid-011",
      title: "Understanding Vaccines: Science, Safety, and Public Health",
      description:
        "Public health specialist Dr. Samuel Mwangi explains the science behind vaccines, addresses common concerns about vaccine safety, and discusses their importance for public health.",
      videoUrl: "https://example.com/videos/vaccine-science.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Vaccine+Science",
      duration: 392, // 6:32
      category: "Public Health",
      tags: ["Vaccines", "Immunization", "Public Health", "Healthcare"],
      views: 47800,
      likes: 3800,
      comments: 620,
      shares: 1680,
      featured: true,
      trending: true,
      dateAdded: "2025-03-06T09:50:00Z",
      vendor: {
        id: "pub-001",
        name: "Public Health Institute",
        logo: "/placeholder.svg?height=200&width=200&text=PHI",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.9,
        reviewCount: 287,
        followers: 38200,
      },
    },
    {
      id: "health-vid-012",
      title: "Telemedicine: The Future of Healthcare Access",
      description:
        "Healthcare technology expert Dr. Catherine Muthoni discusses how telemedicine is transforming healthcare access, particularly in rural and underserved areas.",
      videoUrl: "https://example.com/videos/telemedicine.mp4",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&text=Telemedicine",
      duration: 342, // 5:42
      category: "Digital Health",
      tags: ["Telemedicine", "Healthcare Technology", "Digital Health", "Healthcare Access"],
      views: 36400,
      likes: 2900,
      comments: 410,
      shares: 1240,
      featured: true,
      trending: false,
      dateAdded: "2025-03-04T16:15:00Z",
      vendor: {
        id: "tech-001",
        name: "Health Technology Solutions",
        logo: "/placeholder.svg?height=200&width=200&text=HTS",
        location: "Nairobi, Kenya",
        verified: true,
        rating: 4.7,
        reviewCount: 168,
        followers: 21500,
      },
    },
  ]
  