"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Stethoscope,
  Pill,
  Microscope,
  Activity,
  Search,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  Phone,
  Mail,
  Globe,
  ArrowLeft,
  Heart,
  X,
  Flame,
  HeartPulse,
  Syringe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Types
interface Price {
  amount: number
  currency: string
}

interface HealthProvider {
  id: string
  name: string
  logo: string
  category: "clinics" | "specialists" | "diagnostics" | "pharmacy"
  description: string
  rating: number
  reviewCount: number
  location: string
  contact: {
    phone: string
    email: string
    website: string
  }
  openingHours: string
  services: HealthService[]
  amenities: string[]
  images: string[]
}

interface HealthService {
  id: string
  name: string
  description: string
  price: Price
  image: string
  isPopular?: boolean
  isNew?: boolean
  category: string
  tags: string[]
}

// Helper function to format price
const formatPrice = (price: Price): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount)
}

// Mock data for health providers
const healthProviders: HealthProvider[] = [
  // Clinics
  {
    id: "wellness-clinic",
    name: "Wellness Clinic",
    logo: "/placeholder.svg?height=80&width=80",
    category: "clinics",
    description:
      "Comprehensive primary care clinic offering a wide range of medical services for the entire family in a comfortable environment.",
    rating: 4.8,
    reviewCount: 324,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 712 345 678",
      email: "info@wellnessclinic.co.ke",
      website: "www.wellnessclinic.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 8:00 PM, Sat: 9:00 AM - 5:00 PM, Sun: 10:00 AM - 2:00 PM",
    amenities: ["Wheelchair Access", "Child-Friendly", "Online Booking", "Insurance Accepted", "Pharmacy On-site"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: [
      {
        id: "general-consultation",
        name: "General Medical Consultation",
        description:
          "Comprehensive medical consultation with experienced doctors for general health concerns and preventive care.",
        price: { amount: 2500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Primary Care",
        tags: ["Consultation", "General", "Preventive"],
      },
      {
        id: "vaccination",
        name: "Vaccination Services",
        description: "Full range of vaccinations for children and adults following recommended immunization schedules.",
        price: { amount: 1800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Preventive Care",
        tags: ["Vaccines", "Immunization", "Preventive"],
      },
      {
        id: "minor-procedures",
        name: "Minor Surgical Procedures",
        description: "Minor surgical procedures including wound care, suturing, abscess drainage, and mole removal.",
        price: { amount: 5000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Procedures",
        tags: ["Surgery", "Minor", "Wound Care"],
      },
      {
        id: "health-checkup",
        name: "Comprehensive Health Checkup",
        description: "Complete physical examination with essential lab tests to assess your overall health status.",
        price: { amount: 8500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Preventive Care",
        tags: ["Checkup", "Comprehensive", "Screening"],
      },
    ],
  },
  {
    id: "family-care",
    name: "Family Care Center",
    logo: "/placeholder.svg?height=80&width=80",
    category: "clinics",
    description:
      "Family-focused medical center providing personalized healthcare services for patients of all ages in a warm environment.",
    rating: 4.7,
    reviewCount: 256,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 723 456 789",
      email: "care@familycarecenter.co.ke",
      website: "www.familycarecenter.co.ke",
    },
    openingHours: "Mon-Fri: 7:30 AM - 7:00 PM, Sat: 8:00 AM - 4:00 PM, Sun: Emergency Only",
    amenities: ["Family Rooms", "Pediatric Area", "Maternity Services", "Elderly Care", "Home Visits"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: [
      {
        id: "family-consultation",
        name: "Family Doctor Consultation",
        description:
          "Consultation with family medicine specialists who provide continuous care for all family members.",
        price: { amount: 3000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Family Medicine",
        tags: ["Family", "Continuous Care", "All Ages"],
      },
      {
        id: "pediatric-care",
        name: "Pediatric Care Services",
        description: "Specialized healthcare for infants, children, and adolescents including well-child visits and sick care.",
        price: { amount: 2500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Pediatrics",
        tags: ["Children", "Well-Child", "Development"],
      },
      {
        id: "prenatal-care",
        name: "Prenatal Care Package",
        description: "Comprehensive prenatal care including regular check-ups, ultrasounds, and birth preparation.",
        price: { amount: 25000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Maternity",
        tags: ["Prenatal", "Pregnancy", "Maternity"],
      },
      {
        id: "geriatric-care",
        name: "Geriatric Care Services",
        description: "Specialized healthcare for elderly patients focusing on chronic disease management and quality of life.",
        price: { amount: 3500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Geriatrics",
        tags: ["Elderly", "Chronic Care", "Geriatric"],
      },
    ],
  },

  // Specialists
  {
    id: "heart-specialists",
    name: "Heart Specialists Center",
    logo: "/placeholder.svg?height=80&width=80",
    category: "specialists",
    description: "Specialized cardiac care center with experienced cardiologists and state-of-the-art diagnostic equipment.",
    rating: 4.9,
    reviewCount: 189,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 734 567 890",
      email: "care@heartspecialists.co.ke",
      website: "www.heartspecialists.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM",
    amenities: ["Cardiac Lab", "ECG", "Stress Testing", "Echocardiography", "Cardiac Rehabilitation"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: [
      {
        id: "cardiology-consultation",
        name: "Cardiology Consultation",
        description: "Comprehensive consultation with experienced cardiologists for heart-related concerns and conditions.",
        price: { amount: 5000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Cardiology",
        tags: ["Heart", "Consultation", "Specialist"],
      },
      {
        id: "ecg-test",
        name: "Electrocardiogram (ECG)",
        description: "Non-invasive test that records the electrical activity of the heart to detect abnormalities.",
        price: { amount: 2500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Diagnostic",
        tags: ["ECG", "Heart", "Diagnostic"],
      },
      {
        id: "stress-test",
        name: "Cardiac Stress Test",
        description: "Test that measures heart function during physical activity to diagnose coronary artery disease.",
        price: { amount: 8000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Diagnostic",
        tags: ["Stress Test", "Exercise", "Diagnostic"],
      },
      {
        id: "heart-checkup",
        name: "Comprehensive Heart Checkup",
        description: "Complete cardiac evaluation including consultation, ECG, echocardiogram, and blood tests.",
        price: { amount: 15000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Preventive",
        tags: ["Checkup", "Comprehensive", "Preventive"],
      },
    ],
  },
  {
    id: "ortho-care",
    name: "OrthoCarePlus",
    logo: "/placeholder.svg?height=80&width=80",
    category: "specialists",
    description:
      "Specialized orthopedic center providing comprehensive care for bone, joint, and muscle conditions with a focus on rehabilitation.",
    rating: 4.8,
    reviewCount: 156,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 745 678 901",
      email: "info@orthocareplus.co.ke",
      website: "www.orthocareplus.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM",
    amenities: ["Physical Therapy", "X-Ray", "Casting", "Sports Medicine", "Joint Replacement Counseling"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: [
      {
        id: "ortho-consultation",
        name: "Orthopedic Consultation",
        description: "Specialized consultation with orthopedic surgeons for bone, joint, and muscle conditions.",
        price: { amount: 4500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Orthopedics",
        tags: ["Bones", "Joints", "Specialist"],
      },
      {
        id: "physical-therapy",
        name: "Physical Therapy Session",
        description: "Therapeutic exercises and treatments to improve mobility, strength, and function after injury or surgery.",
        price: { amount: 3000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Rehabilitation",
        tags: ["Therapy", "Rehabilitation", "Recovery"],
      },
      {
        id: "sports-medicine",
        name: "Sports Injury Assessment",
        description: "Specialized evaluation and treatment plan for sports-related injuries and performance optimization.",
        price: { amount: 5500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Sports Medicine",
        tags: ["Sports", "Injury", "Athletes"],
      },
      {
        id: "joint-injection",
        name: "Joint Injection Therapy",
        description: "Therapeutic injections for joint pain relief, including corticosteroids and viscosupplementation.",
        price: { amount: 7000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Pain Management",
        tags: ["Injections", "Pain Relief", "Joints"],
      },
    ],
  },

  // Diagnostics
  {
    id: "advanced-diagnostics",
    name: "Advanced Diagnostics Center",
    logo: "/placeholder.svg?height=80&width=80",
    category: "diagnostics",
    description:
      "State-of-the-art diagnostic center offering comprehensive laboratory tests, imaging services, and quick results.",
    rating: 4.8,
    reviewCount: 278,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 756 789 012",
      email: "info@advanceddiagnostics.co.ke",
      website: "www.advanceddiagnostics.co.ke",
    },
    openingHours: "Mon-Sat: 7:00 AM - 8:00 PM, Sun: 8:00 AM - 2:00 PM",
    amenities: ["Online Results", "Home Sample Collection", "Quick Turnaround", "Multiple Locations", "Insurance Billing"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: [
      {
        id: "comprehensive-bloodwork",
        name: "Comprehensive Blood Panel",
        description: "Complete blood analysis including CBC, lipid profile, liver and kidney function, and more.",
        price: { amount: 7500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Laboratory",
        tags: ["Blood Test", "Comprehensive", "Screening"],
      },
      {
        id: "ultrasound",
        name: "Diagnostic Ultrasound",
        description: "Non-invasive imaging using sound waves to examine internal organs and structures.",
        price: { amount: 5000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Imaging",
        tags: ["Ultrasound", "Imaging", "Non-invasive"],
      },
      {
        id: "xray-services",
        name: "Digital X-Ray Services",
        description: "Advanced digital X-ray imaging with lower radiation and higher quality images.",
        price: { amount: 3500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Imaging",
        tags: ["X-Ray", "Digital", "Imaging"],
      },
      {
        id: "cardiac-tests",
        name: "Cardiac Diagnostic Package",
        description: "Comprehensive cardiac testing including ECG, echocardiogram, and relevant blood tests.",
        price: { amount: 12000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Specialized Testing",
        tags: ["Cardiac", "Heart", "Diagnostic"],
      },
    ],
  },
  {
    id: "imaging-experts",
    name: "Imaging Experts",
    logo: "/placeholder.svg?height=80&width=80",
    category: "diagnostics",
    description:
      "Specialized imaging center with advanced MRI, CT scan, and other imaging technologies operated by expert radiologists.",
    rating: 4.9,
    reviewCount: 195,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 767 890 123",
      email: "appointments@imagingexperts.co.ke",
      website: "www.imagingexperts.co.ke",
    },
    openingHours: "Mon-Fri: 7:30 AM - 7:00 PM, Sat: 8:00 AM - 4:00 PM",
    amenities: ["3T MRI", "CT Scan", "Digital X-Ray", "Mammography", "Bone Densitometry"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: [
      {
        id: "mri-scan",
        name: "MRI Scan",
        description: "High-resolution magnetic resonance imaging for detailed visualization of organs and tissues.",
        price: { amount: 18000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Advanced Imaging",
        tags: ["MRI", "Detailed", "Non-radiation"],
      },
      {
        id: "ct-scan",
        name: "CT Scan",
        description: "Computerized tomography scan providing detailed cross-sectional images of the body.",
        price: { amount: 12000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Advanced Imaging",
        tags: ["CT", "Cross-sectional", "Detailed"],
      },
      {
        id: "mammography",
        name: "Digital Mammography",
        description: "Advanced breast imaging for early detection of breast cancer and other abnormalities.",
        price: { amount: 6500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Women's Health",
        tags: ["Breast", "Screening", "Early Detection"],
      },
      {
        id: "dexa-scan",
        name: "DEXA Bone Density Scan",
        description: "Specialized X-ray that measures bone mineral density to diagnose osteoporosis.",
        price: { amount: 8000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Specialized Imaging",
        tags: ["Bone Density", "Osteoporosis", "Screening"],
      },
    ],
  },

  // Pharmacy
  {
    id: "health-pharmacy",
    name: "Health Pharmacy Plus",
    logo: "/placeholder.svg?height=80&width=80",
    category: "pharmacy",
    description:
      "Full-service pharmacy offering prescription medications, over-the-counter products, and personalized medication counseling.",
    rating: 4.7,
    reviewCount: 312,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 778 901 234",
      email: "info@healthpharmacyplus.co.ke",
      website: "www.healthpharmacyplus.co.ke",
    },
    openingHours: "Mon-Sat: 8:00 AM - 10:00 PM, Sun: 9:00 AM - 7:00 PM",
    amenities: ["Prescription Delivery", "Medication Counseling", "Compounding", "Vaccination", "Health Screenings"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: [
      {
        id: "prescription-filling",
        name: "Prescription Filling Service",
        description: "Quick and accurate filling of prescriptions with pharmacist consultation and medication guidance.",
        price: { amount: 0, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Prescription Services",
        tags: ["Prescription", "Medication", "Consultation"],
      },
      {
        id: "medication-review",
        name: "Medication Therapy Review",
        description: "Comprehensive review of all your medications by a pharmacist to ensure safety and effectiveness.",
        price: { amount: 2500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Medication Management",
        tags: ["Review", "Safety", "Effectiveness"],
      },
      {
        id: "compounding",
        name: "Custom Medication Compounding",
        description: "Preparation of customized medications tailored to individual patient needs and preferences.",
        price: { amount: 3500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Specialized Services",
        tags: ["Compounding", "Custom", "Personalized"],
      },
      {
        id: "health-screening",
        name: "Basic Health Screening",
        description: "Quick health checks including blood pressure, blood glucose, and cholesterol screening.",
        price: { amount: 1500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Preventive Services",
        tags: ["Screening", "Prevention", "Quick"],
      },
    ],
  },
  {
    id: "wellness-pharmacy",
    name: "Wellness Pharmacy",
    logo: "/placeholder.svg?height=80&width=80",
    category: "pharmacy",
    description:
      "Modern pharmacy focusing on holistic wellness with a wide range of natural products, supplements, and traditional medications.",
    rating: 4.6,
    reviewCount: 267,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 789 012 345",
      email: "care@wellnesspharmacy.co.ke",
      website: "www.wellnesspharmacy.co.ke",
    },
    openingHours: "Mon-Sat: 8:00 AM - 9:00 PM, Sun: 10:00 AM - 6:00 PM",
    amenities: ["Natural Products", "Nutritional Counseling", "Wellness Workshops", "Online Ordering", "Home Delivery"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    services: [
      {
        id: "wellness-consultation",
        name: "Wellness Consultation",
        description: "Personalized consultation with a pharmacist focusing on holistic health and natural approaches.",
        price: { amount: 2000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Wellness Services",
        tags: ["Holistic", "Natural", "Consultation"],
      },
      {
        id: "nutrition-counseling",
        name: "Nutritional Counseling",
        description: "Expert guidance on dietary supplements, vitamins, and nutrition for optimal health and wellness.",
        price: { amount: 2500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Nutrition Services",
        tags: ["Nutrition", "Supplements", "Diet"],
      },
      {
        id: "herbal-medicine",
        name: "Herbal Medicine Consultation",
        description: "Specialized consultation on traditional and herbal remedies with evidence-based approach.",
        price: { amount: 3000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Alternative Medicine",
        tags: ["Herbal", "Traditional", "Natural"],
      },
      {
        id: "chronic-management",
        name: "Chronic Disease Management",
        description: "Ongoing support and medication management for patients with chronic health conditions.",
        price: { amount: 2000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Disease Management",
        tags: ["Chronic", "Management", "Support"],
      },
    ],
  },
]

export default function HealthShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<HealthProvider | null>(null)
  const [selectedService, setSelectedService] = useState<HealthService | null>(null)
  const [isLoading, setIsLoading] = useState(false)
 

  // Filter providers based on active category and search query
  const filteredProviders = healthProviders.filter((provider) => {
    // Filter by category
    if (activeCategory !== "all" && provider.category !== activeCategory) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        provider.name.toLowerCase().includes(query) ||
        provider.description.toLowerCase().includes(query) ||
        provider.services.some(
          (service) => service.name.toLowerCase().includes(query) || service.description.toLowerCase().includes(query),
        )
      )
    }

    return true
  })

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setIsLoading(true)
    setActiveCategory(category)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  // Handle provider click
  const handleProviderClick = (provider: HealthProvider) => {
    setSelectedProvider(provider)
  }

  // Handle service click
  const handleServiceClick = (service: HealthService) => {
    setSelectedService(service)
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "clinics":
        return <Stethoscope className="h-6 w-6" />
      case "specialists":
        return <HeartPulse className="h-6 w-6" />
      case "diagnostics":
        return <Microscope className="h-6 w-6" />
      case "pharmacy":
        return <Pill className="h-6 w-6" />
      default:
        return <Activity className="h-6 w-6" />
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "clinics":
        return "from-teal-500 to-emerald-500"
      case "specialists":
        return "from-purple-500 to-indigo-500"
      case "diagnostics":
        return "from-blue-500 to-cyan-500"
      case "pharmacy":
        return "from-rose-500 to-pink-500"
      default:
        return "from-teal-500 to-emerald-500"
    }
  }

  // Get category background color
  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case "clinics":
        return "bg-teal-100 text-teal-800 border-teal-200"
      case "specialists":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "diagnostics":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pharmacy":
        return "bg-rose-100 text-rose-800 border-rose-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Star rating component
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
          />
        ))}
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{rating.toFixed(1)}</span>
      </div>
    )
  }

  // Render category tabs
  const renderCategoryTabs = () => {
    return (
      <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
        {[
          { id: "all", name: "All Services", icon: <Activity className="h-5 w-5" /> },
          { id: "clinics", name: "Clinics", icon: <Stethoscope className="h-5 w-5" /> },
          { id: "specialists", name: "Specialists", icon: <HeartPulse className="h-5 w-5" /> },
          { id: "diagnostics", name: "Diagnostics", icon: <Microscope className="h-5 w-5" /> },
          { id: "pharmacy", name: "Pharmacy", icon: <Pill className="h-5 w-5" /> },
        ].map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              activeCategory === category.id
                ? `bg-gradient-to-r ${
                    category.id === "all"
                      ? "from-teal-500 to-emerald-500"
                      : category.id === "clinics"
                        ? "from-teal-500 to-emerald-500"
                        : category.id === "specialists"
                          ? "from-purple-500 to-indigo-500"
                          : category.id === "diagnostics"
                            ? "from-blue-500 to-cyan-500"
                            : "from-rose-500 to-pink-500"
                  } text-white`
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-teal-500 to-emerald-600 py-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-300 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-300 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/health-services" className="flex items-center text-white mb-4 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Health Services
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Health Services Shop</h1>
              <p className="text-teal-100 max-w-2xl">
                Discover comprehensive healthcare solutions including clinics, specialists, diagnostics, and pharmacies
                for your health needs.
              </p>
            </div>
            <div className="hidden md:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/20 backdrop-blur-md p-4 rounded-lg shadow-lg"
              >
                <div className="text-white text-center">
                  <Syringe className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Quality Healthcare</p>
                  <p className="text-sm">Your Wellness Partner</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
 
      {/* Search Bar */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="relative max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-200"></div>
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search for health services, providers, or treatments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 rounded-full border-transparent bg-white dark:bg-slate-800 text-gray-800 dark:text-white placeholder:text-gray-400 focus:ring-teal-500 focus:border-transparent w-full shadow-lg"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500">
                <Search className="h-5 w-5" />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="container mx-auto px-4 py-6 relative z-10">{renderCategoryTabs()}</div>

      {/* Category Content */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProviders.map((provider) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Card
                  className="overflow-hidden border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer"
                  onClick={() => handleProviderClick(provider)}
                >
                  <div className={`p-4 bg-gradient-to-r ${getCategoryColor(provider.category)} text-white`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-white/20 p-2 rounded-full">{getCategoryIcon(provider.category)}</div>
                      <h3 className="text-xl font-semibold">{provider.name}</h3>
                    </div>
                    <Badge className="bg-white/30 text-white border-0">
                      {provider.category.charAt(0).toUpperCase() + provider.category.slice(1)}
                    </Badge>
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <StarRating rating={provider.rating} />
                      <Badge variant="outline" className={getCategoryBgColor(provider.category)}>
                        {provider.reviewCount} reviews
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{provider.description}</p>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {provider.location}
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {provider.openingHours}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      className={`w-full bg-gradient-to-r ${getCategoryColor(provider.category)} hover:opacity-90 text-white`}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredProviders.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-teal-100 dark:bg-teal-900/30 p-8 rounded-lg inline-block mb-4">
              <Search className="h-12 w-12 text-teal-500 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any health services matching your criteria. Try adjusting your search or browse a
              different category.
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white"
              onClick={() => {
                setSearchQuery("")
                setActiveCategory("all")
              }}
            >
              View All Services
            </Button>
          </div>
        )}
      </div>

      {/* Provider Detail Modal */}
      <Dialog open={!!selectedProvider} onOpenChange={(open) => !open && setSelectedProvider(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProvider && (
            <>
              <DialogHeader>
                <div
                  className={`p-4 -mt-6 -mx-6 mb-4 bg-gradient-to-r ${getCategoryColor(selectedProvider.category)} text-white`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/20 p-2 rounded-full">{getCategoryIcon(selectedProvider.category)}</div>
                    <DialogTitle className="text-2xl font-bold">{selectedProvider.name}</DialogTitle>
                  </div>
                  <DialogDescription className="text-white/90 mt-1">{selectedProvider.description}</DialogDescription>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Phone className="h-4 w-4 mr-2 text-teal-500" />
                        {selectedProvider.contact.phone}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Mail className="h-4 w-4 mr-2 text-teal-500" />
                        {selectedProvider.contact.email}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Globe className="h-4 w-4 mr-2 text-teal-500" />
                        <a
                          href={`https://${selectedProvider.contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-500 hover:underline"
                        >
                          {selectedProvider.contact.website}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Location & Hours</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4 mr-2 text-teal-500" />
                        {selectedProvider.location}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-teal-500" />
                        {selectedProvider.openingHours}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProvider.amenities.map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-xl">Services</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedProvider.services.map((service) => (
                      <Card
                        key={service.id}
                        className="overflow-hidden border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => handleServiceClick(service)}
                      >
                        <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={service.image || "/placeholder.svg"}
                            alt={service.name}
                            layout="fill"
                            objectFit="cover"
                          />
                          <div className="absolute top-2 right-2 flex flex-col gap-1">
                            {service.isNew && <Badge className="bg-blue-500 text-white">New</Badge>}
                            {service.isPopular && (
                              <Badge className="bg-amber-500 text-white flex items-center gap-1">
                                <Flame className="h-3 w-3" />
                                <span>Popular</span>
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{service.name}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                            >
                              {service.category}
                            </Badge>
                            <span className="font-bold text-teal-600 dark:text-teal-400">
                              {formatPrice(service.price)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Service Detail Modal */}
      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent className="max-w-2xl">
          {selectedService && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {selectedService.name}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative h-60 md:h-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <Image
                    src={selectedService.image || "/placeholder.svg"}
                    alt={selectedService.name}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {selectedService.isNew && <Badge className="bg-blue-500 text-white">New</Badge>}
                    {selectedService.isPopular && (
                      <Badge className="bg-amber-500 text-white flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        <span>Popular</span>
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">{selectedService.description}</p>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    >
                      {selectedService.category}
                    </Badge>
                    <span className="font-bold text-2xl text-teal-600 dark:text-teal-400">
                      {formatPrice(selectedService.price)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.tags.map((tag, index) => (
                        <Badge key={index} className="bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 hover:opacity-90 text-white">
                      Book Appointment
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span>Save</span>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

