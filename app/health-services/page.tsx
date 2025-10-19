"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Search,
  Stethoscope,
  Building2,
  Brain,
  MapPin,
  Clock,
  ArrowRight,
  X,
  Phone,
  Globe,
  Percent,
  CalendarClock,
  Flame,
  Award,
  Loader2,
  Filter,
  ArrowUpDown,
  Sparkles,
  Leaf,
  User,
  Calendar,
  HeartPulse,
  UserPlus,
  FileStack as FirstAid,
  ShieldPlus,
  Bookmark,
  MessageCircle,
  Mail,
} from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader as DialogHeaderComponent,
  DialogTitle as DialogTitleComponent,
  DialogDescription as DialogDescriptionComponent,
} from "@/components/ui/dialog"
import CountdownTimer from "@/components/CountdownTimer"
import HotTimeDeals from "@/components/HotTimeDeals"
import NewProductsForYou from "@/components/NewProductsForYou"
import { useCookieTracking } from "@/hooks/useCookieTracking"
import { swapArrayElementsRandomly } from "@/utils/swap-utils"
import { isNewThisWeek } from "@/utils/date-utils"
import MostPreferredBadge from "@/components/most-preferred-badge"
import TrendingPopularSection from "@/components/TrendingPopularSection"
import { trendingProducts, popularProducts } from "./trending-data"
import Link from "next/link"
import VendorSection from "@/components/VendorSection"

// Types
interface Price {
  amount: number
  currency: string
}

interface HealthServiceData {
  id: number | string
  name: string
  imageUrl: string
  images?: string[]
  currentPrice: Price
  originalPrice: Price
  category: string
  subcategory: string
  description: string
  location: string
  isNew?: boolean
  isPopular?: boolean
  dateAdded: string
  rating?: number
  reviewCount?: number
  features?: string[]
  amenities?: string[]
  duration?: string
  availableSlots?: number
  totalSlots?: number
  tags?: string[]
  hotDealEnds?: string
  discount?: number
  vendorId: number | string
  isHotDeal?: boolean
  isTrending?: boolean
  isAlmostFullyBooked?: boolean
  contactNumber?: string
  website?: string
  address?: string
  provider?: string
  providerQualification?: string
  providerSpecialty?: string
  insuranceAccepted?: string[]
  appointmentRequired?: boolean
  availableDays?: string[]
  availableHours?: string
}

interface Vendor {
  id: number | string
  name: string
  location: string
  logo: string
  description: string
  offerings: HealthServiceData[]
  redirectUrl: string
  mapLink: string
  defaultCurrency: string
  rating?: number
  reviewCount?: number
  verified?: boolean
  establishedYear?: number
  contactNumber?: string
  email?: string
  website?: string
  accreditations?: string[]
  emergencyServices?: boolean
}

interface Category {
  id: string
  name: string
  icon: React.ReactNode
  subcategories?: string[]
}

// Helper function to format price
const formatPrice = (price: Price): string => {
  if (price.currency === "KSH" && price.amount >= 1000) {
    return `${price.currency} ${price.amount.toLocaleString()}`
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount)
}

// Get icon for category
const getCategoryIcon = (category: string, size = 20) => {
  switch (category.toLowerCase()) {
    case "medical specialists":
      return <UserPlus size={size} />
    case "hospitals & clinics":
      return <Building2 size={size} />
    case "wellness & prevention":
      return <HeartPulse size={size} />
    case "mental health":
      return <Brain size={size} />
    case "alternative medicine":
      return <Leaf size={size} />
    default:
      return <Stethoscope size={size} />
  }
}

// Define categories
const categories: Category[] = [
  {
    id: "medical-specialists",
    name: "Medical Specialists",
    icon: <UserPlus className="mr-2" />,
    subcategories: ["Doctors", "Surgeons", "Pediatricians", "Gynecologists", "Cardiologists"],
  },
  {
    id: "hospitals-clinics",
    name: "Hospitals & Clinics",
    icon: <Building2 className="mr-2" />,
    subcategories: ["General Hospitals", "Specialized Clinics", "Emergency Care", "Diagnostic Centers"],
  },
  {
    id: "wellness-prevention",
    name: "Wellness & Prevention",
    icon: <HeartPulse className="mr-2" />,
    subcategories: ["Checkups", "Vaccinations", "Screenings", "Nutrition", "Fitness"],
  },
  {
    id: "mental-health",
    name: "Mental Health",
    icon: <Brain className="mr-2" />,
    subcategories: ["Therapy", "Counseling", "Psychiatry", "Support Groups", "Stress Management"],
  },
  {
    id: "alternative-medicine",
    name: "Alternative Medicine",
    icon: <Leaf className="mr-2" />,
    subcategories: ["Acupuncture", "Homeopathy", "Naturopathy", "Chiropractic", "Ayurveda"],
  },
]

// Mock data for vendors and offerings
const mockVendors: Vendor[] = [
  // Medical Specialists
  {
    id: 1,
    name: "Elite Medical Specialists",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Premier medical specialists offering expert consultations and treatments across various specialties.",
    redirectUrl: "https://elitemedical.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 356,
    verified: true,
    establishedYear: 2010,
    contactNumber: "+254 712 345 678",
    email: "info@elitemedical.co.ke",
    website: "https://elitemedical.co.ke",
    accreditations: ["Kenya Medical Practitioners Board", "International Hospital Federation"],
    emergencyServices: false,
    offerings: [
      {
        id: 101,
        name: "Cardiology Consultation with ECG",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 5000, currency: "KSH" },
        originalPrice: { amount: 6500, currency: "KSH" },
        category: "Medical Specialists",
        subcategory: "Cardiologists",
        description:
          "Comprehensive cardiology consultation with an experienced cardiologist, including ECG test and detailed heart health assessment. Receive personalized advice and treatment plans for heart-related concerns.",
        location: "Westlands, Nairobi",
        isPopular: true,
        dateAdded: "2025-03-10T10:30:00Z",
        rating: 4.9,
        reviewCount: 128,
        features: ["ECG Included", "Expert Cardiologist", "Digital Reports", "Follow-up Call", "Prescription"],
        duration: "45 minutes",
        availableSlots: 8,
        totalSlots: 20,
        tags: ["Heart Health", "Cardiology", "ECG", "Consultation"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 1,
        contactNumber: "+254 712 345 678",
        website: "https://elitemedical.co.ke",
        address: "Westlands Medical Plaza, Nairobi",
        provider: "Dr. James Mwangi",
        providerQualification: "MD, FACC",
        providerSpecialty: "Interventional Cardiology",
        insuranceAccepted: ["AAR", "Jubilee", "NHIF Premium", "Britam"],
        appointmentRequired: true,
        availableDays: ["Monday", "Wednesday", "Friday"],
        availableHours: "9:00 AM - 4:00 PM",
      },
      {
        id: 102,
        name: "Pediatric Development Assessment",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 4000, currency: "KSH" },
        originalPrice: { amount: 4500, currency: "KSH" },
        category: "Medical Specialists",
        subcategory: "Pediatricians",
        description:
          "Comprehensive pediatric assessment for children aged 0-5 years, evaluating physical growth, cognitive development, and overall health. Includes growth charting, developmental milestone assessment, and nutritional guidance.",
        location: "Westlands, Nairobi",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.8,
        reviewCount: 76,
        features: [
          "Growth Assessment",
          "Developmental Screening",
          "Nutritional Guidance",
          "Vaccination Review",
          "Parental Counseling",
        ],
        duration: "60 minutes",
        availableSlots: 12,
        totalSlots: 15,
        tags: ["Pediatric", "Child Development", "Growth Assessment", "Children's Health"],
        vendorId: 1,
        isTrending: true,
        contactNumber: "+254 712 345 678",
        website: "https://elitemedical.co.ke",
        address: "Westlands Medical Plaza, Nairobi",
        provider: "Dr. Sarah Omondi",
        providerQualification: "MD, Pediatrics",
        providerSpecialty: "Developmental Pediatrics",
        insuranceAccepted: ["AAR", "Jubilee", "NHIF Premium", "Britam", "Madison"],
        appointmentRequired: true,
        availableDays: ["Monday", "Tuesday", "Thursday"],
        availableHours: "8:00 AM - 3:00 PM",
      },
    ],
  },
  {
    id: 2,
    name: "Women's Health Specialists",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Dedicated specialists in women's health providing comprehensive gynecological and obstetric care.",
    redirectUrl: "https://womenshealth.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 245,
    verified: true,
    establishedYear: 2012,
    contactNumber: "+254 723 456 789",
    email: "info@womenshealth.co.ke",
    website: "https://womenshealth.co.ke",
    accreditations: [
      "Kenya Obstetrical and Gynecological Society",
      "International Federation of Gynecology and Obstetrics",
    ],
    emergencyServices: true,
    offerings: [
      {
        id: 201,
        name: "Comprehensive Gynecological Checkup",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 4500, currency: "KSH" },
        originalPrice: { amount: 5500, currency: "KSH" },
        category: "Medical Specialists",
        subcategory: "Gynecologists",
        description:
          "Complete gynecological examination including pap smear, breast examination, and pelvic ultrasound. Consultation covers reproductive health, family planning, and preventive care.",
        location: "Kilimani, Nairobi",
        isPopular: true,
        dateAdded: "2025-02-20T10:30:00Z",
        rating: 4.7,
        reviewCount: 98,
        features: ["Pap Smear", "Breast Examination", "Pelvic Ultrasound", "Consultation", "Digital Reports"],
        duration: "75 minutes",
        availableSlots: 6,
        totalSlots: 10,
        tags: ["Women's Health", "Gynecology", "Preventive Care", "Reproductive Health"],
        isAlmostFullyBooked: true,
        vendorId: 2,
        contactNumber: "+254 723 456 789",
        website: "https://womenshealth.co.ke",
        address: "Kilimani Medical Center, Nairobi",
        provider: "Dr. Elizabeth Wanjiru",
        providerQualification: "MD, FRCOG",
        providerSpecialty: "Gynecology and Obstetrics",
        insuranceAccepted: ["AAR", "Jubilee", "NHIF Premium", "Britam", "Madison", "CIC"],
        appointmentRequired: true,
        availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
        availableHours: "9:00 AM - 5:00 PM",
      },
      {
        id: 202,
        name: "Prenatal Care Package - First Trimester",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 8000, currency: "KSH" },
        originalPrice: { amount: 10000, currency: "KSH" },
        category: "Medical Specialists",
        subcategory: "Gynecologists",
        description:
          "Comprehensive first trimester prenatal care package including initial consultation, blood tests, ultrasound, nutritional counseling, and prenatal vitamins. Designed for expectant mothers in their first 12 weeks.",
        location: "Kilimani, Nairobi",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.9,
        reviewCount: 65,
        features: ["Initial Consultation", "Blood Tests", "Ultrasound", "Nutritional Counseling", "Prenatal Vitamins"],
        duration: "90 minutes",
        availableSlots: 8,
        totalSlots: 12,
        tags: ["Prenatal Care", "Pregnancy", "First Trimester", "Obstetrics"],
        hotDealEnds: "2025-04-10T23:59:59Z",
        isHotDeal: true,
        vendorId: 2,
        contactNumber: "+254 723 456 789",
        website: "https://womenshealth.co.ke",
        address: "Kilimani Medical Center, Nairobi",
        provider: "Dr. Catherine Muthoni",
        providerQualification: "MD, Obstetrics",
        providerSpecialty: "Maternal-Fetal Medicine",
        insuranceAccepted: ["AAR", "Jubilee", "NHIF Premium", "Britam", "Madison"],
        appointmentRequired: true,
        availableDays: ["Tuesday", "Thursday", "Saturday"],
        availableHours: "8:00 AM - 4:00 PM",
      },
    ],
  },

  // Hospitals & Clinics
  {
    id: 3,
    name: "Nairobi Premier Hospital",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Leading multi-specialty hospital offering comprehensive healthcare services with state-of-the-art facilities.",
    redirectUrl: "https://nairobipremier.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.9,
    reviewCount: 412,
    verified: true,
    establishedYear: 2008,
    contactNumber: "+254 734 567 890",
    email: "info@nairobipremier.co.ke",
    website: "https://nairobipremier.co.ke",
    accreditations: ["Joint Commission International", "Kenya Hospital Association", "ISO 9001:2015"],
    emergencyServices: true,
    offerings: [
      {
        id: 301,
        name: "Executive Health Checkup Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 15000, currency: "KSH" },
        originalPrice: { amount: 18000, currency: "KSH" },
        category: "Hospitals & Clinics",
        subcategory: "General Hospitals",
        description:
          "Comprehensive health assessment designed for busy executives. Includes complete blood work, cardiac evaluation, imaging studies, specialist consultations, and personalized health report. All tests completed in one day with minimal waiting time.",
        location: "Upper Hill, Nairobi",
        isPopular: true,
        dateAdded: "2025-03-05T10:30:00Z",
        rating: 4.9,
        reviewCount: 156,
        features: [
          "Complete Blood Work",
          "ECG & Echo",
          "Imaging Studies",
          "Multiple Specialist Consultations",
          "Executive Lounge",
        ],
        duration: "4-5 hours",
        availableSlots: 5,
        totalSlots: 8,
        tags: ["Executive Health", "Comprehensive Checkup", "Preventive Care", "One-Day Service"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 3,
        isTrending: true,
        contactNumber: "+254 734 567 890",
        website: "https://nairobipremier.co.ke",
        address: "Upper Hill Medical District, Nairobi",
        provider: "Nairobi Premier Hospital",
        insuranceAccepted: ["AAR", "Jubilee", "NHIF Premium", "Britam", "Madison", "CIC", "GA Insurance"],
        appointmentRequired: true,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        availableHours: "7:00 AM - 2:00 PM",
      },
      {
        id: 302,
        name: "Advanced Diagnostic Imaging Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 22000, currency: "KSH" },
        originalPrice: { amount: 25000, currency: "KSH" },
        category: "Hospitals & Clinics",
        subcategory: "Diagnostic Centers",
        description:
          "Advanced diagnostic imaging package including MRI, CT scan, and ultrasound with radiologist consultation. Ideal for comprehensive evaluation of specific health concerns requiring detailed imaging.",
        location: "Upper Hill, Nairobi",
        isNew: true,
        dateAdded: "2025-03-12T10:30:00Z",
        rating: 4.8,
        reviewCount: 87,
        features: ["MRI Scan", "CT Scan", "Ultrasound", "Radiologist Consultation", "Digital Reports"],
        duration: "3 hours",
        availableSlots: 4,
        totalSlots: 6,
        tags: ["Diagnostic Imaging", "MRI", "CT Scan", "Radiology"],
        vendorId: 3,
        contactNumber: "+254 734 567 890",
        website: "https://nairobipremier.co.ke",
        address: "Upper Hill Medical District, Nairobi",
        provider: "Nairobi Premier Hospital - Imaging Center",
        insuranceAccepted: ["AAR", "Jubilee", "NHIF Premium", "Britam", "Madison"],
        appointmentRequired: true,
        availableDays: ["Monday", "Wednesday", "Friday"],
        availableHours: "8:00 AM - 4:00 PM",
      },
    ],
  },
  {
    id: 4,
    name: "Coastal Regional Hospital",
    location: "Mombasa, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Comprehensive healthcare facility serving the coastal region with a wide range of medical services.",
    redirectUrl: "https://coastalhospital.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 328,
    verified: true,
    establishedYear: 2005,
    contactNumber: "+254 745 678 901",
    email: "info@coastalhospital.co.ke",
    website: "https://coastalhospital.co.ke",
    accreditations: ["Kenya Hospital Association", "SafeCare Level 5", "ISO 9001:2015"],
    emergencyServices: true,
    offerings: [
      {
        id: 401,
        name: "Family Health Checkup Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 25000, currency: "KSH" },
        originalPrice: { amount: 30000, currency: "KSH" },
        category: "Hospitals & Clinics",
        subcategory: "General Hospitals",
        description:
          "Comprehensive health checkup package for a family of four (2 adults, 2 children). Includes basic health screenings, blood tests, consultations with family medicine specialists, and age-appropriate assessments for children.",
        location: "Nyali, Mombasa",
        isPopular: true,
        dateAdded: "2025-02-25T10:30:00Z",
        rating: 4.8,
        reviewCount: 142,
        features: [
          "Family of Four",
          "Basic Health Screenings",
          "Blood Tests",
          "Specialist Consultations",
          "Pediatric Assessment",
        ],
        duration: "3 hours",
        availableSlots: 3,
        totalSlots: 5,
        tags: ["Family Health", "Checkup", "Preventive Care", "Children's Health"],
        vendorId: 4,
        contactNumber: "+254 745 678 901",
        website: "https://coastalhospital.co.ke",
        address: "Nyali Road, Mombasa",
        provider: "Coastal Regional Hospital",
        insuranceAccepted: ["AAR", "Jubilee", "NHIF", "Britam", "Madison", "CIC"],
        appointmentRequired: true,
        availableDays: ["Tuesday", "Thursday", "Saturday"],
        availableHours: "9:00 AM - 3:00 PM",
      },
      {
        id: 402,
        name: "Emergency Department Fast Track Service",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 3500, currency: "KSH" },
        originalPrice: { amount: 4500, currency: "KSH" },
        category: "Hospitals & Clinics",
        subcategory: "Emergency Care",
        description:
          "Priority emergency care service for non-life-threatening conditions. Includes expedited triage, reduced waiting times, consultation with emergency physician, basic diagnostic tests, and treatment for minor emergencies.",
        location: "Nyali, Mombasa",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.7,
        reviewCount: 68,
        features: [
          "Expedited Triage",
          "Reduced Waiting",
          "Emergency Physician",
          "Basic Diagnostics",
          "Minor Emergency Treatment",
        ],
        duration: "1-2 hours",
        availableSlots: 10,
        totalSlots: 15,
        tags: ["Emergency Care", "Fast Track", "Minor Emergencies", "Quick Service"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        isAlmostFullyBooked: false,
        vendorId: 4,
        contactNumber: "+254 745 678 901",
        website: "https://coastalhospital.co.ke",
        address: "Nyali Road, Mombasa",
        provider: "Coastal Regional Hospital - Emergency Department",
        insuranceAccepted: ["AAR", "Jubilee", "NHIF", "Britam", "Madison", "CIC", "GA Insurance"],
        appointmentRequired: false,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        availableHours: "24 hours",
      },
    ],
  },

  // Wellness & Prevention
  {
    id: 5,
    name: "Vitality Wellness Center",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Holistic wellness center focusing on preventive care, health optimization, and lifestyle medicine.",
    redirectUrl: "https://vitalitywellness.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 376,
    verified: true,
    establishedYear: 2015,
    contactNumber: "+254 756 789 012",
    email: "info@vitalitywellness.co.ke",
    website: "https://vitalitywellness.co.ke",
    accreditations: ["Kenya Nutritionists and Dieticians Institute", "Wellness Council of East Africa"],
    emergencyServices: false,
    offerings: [
      {
        id: 501,
        name: "Comprehensive Nutritional Assessment & Plan",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 7500, currency: "KSH" },
        originalPrice: { amount: 9000, currency: "KSH" },
        category: "Wellness & Prevention",
        subcategory: "Nutrition",
        description:
          "In-depth nutritional assessment with a registered dietitian including body composition analysis, metabolic testing, dietary evaluation, and personalized nutrition plan. Includes follow-up session after 4 weeks.",
        location: "Lavington, Nairobi",
        isPopular: true,
        dateAdded: "2025-03-08T10:30:00Z",
        rating: 4.9,
        reviewCount: 112,
        features: [
          "Body Composition Analysis",
          "Metabolic Testing",
          "Dietary Evaluation",
          "Personalized Plan",
          "Follow-up Session",
        ],
        duration: "90 minutes initial, 45 minutes follow-up",
        availableSlots: 7,
        totalSlots: 10,
        tags: ["Nutrition", "Diet Plan", "Wellness", "Preventive Health"],
        hotDealEnds: "2025-04-08T23:59:59Z",
        isHotDeal: true,
        isTrending: true,
        vendorId: 5,
        contactNumber: "+254 756 789 012",
        website: "https://vitalitywellness.co.ke",
        address: "Lavington Green, Nairobi",
        provider: "Jane Kamau",
        providerQualification: "MSc, Registered Dietitian",
        providerSpecialty: "Clinical Nutrition",
        insuranceAccepted: ["AAR Wellness", "Jubilee Lifestyle", "Britam Wellness"],
        appointmentRequired: true,
        availableDays: ["Monday", "Wednesday", "Friday"],
        availableHours: "9:00 AM - 5:00 PM",
      },
      {
        id: 502,
        name: "Executive Stress Management Program",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 12000, currency: "KSH" },
        originalPrice: { amount: 15000, currency: "KSH" },
        category: "Wellness & Prevention",
        subcategory: "Stress Management",
        description:
          "Comprehensive stress management program designed for executives and professionals. Includes stress assessment, biofeedback sessions, mindfulness training, and personalized stress reduction strategies. Program runs for 4 weeks with weekly sessions.",
        location: "Lavington, Nairobi",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.7,
        reviewCount: 78,
        features: [
          "Stress Assessment",
          "Biofeedback Sessions",
          "Mindfulness Training",
          "Personalized Strategies",
          "Weekly Follow-ups",
        ],
        duration: "4 weeks program",
        availableSlots: 5,
        totalSlots: 8,
        tags: ["Stress Management", "Executive Health", "Mindfulness", "Mental Wellbeing"],
        vendorId: 5,
        contactNumber: "+254 756 789 012",
        website: "https://vitalitywellness.co.ke",
        address: "Lavington Green, Nairobi",
        provider: "Dr. Michael Omondi",
        providerQualification: "PhD, Psychology",
        providerSpecialty: "Stress Management & Biofeedback",
        insuranceAccepted: ["AAR Executive", "Jubilee Premium", "Britam Executive"],
        appointmentRequired: true,
        availableDays: ["Tuesday", "Thursday"],
        availableHours: "10:00 AM - 6:00 PM",
      },
    ],
  },
  {
    id: 6,
    name: "HealthTrack Preventive Care",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Specialized center focusing on preventive healthcare, screenings, and vaccinations for all age groups.",
    redirectUrl: "https://healthtrack.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.6,
    reviewCount: 289,
    verified: true,
    establishedYear: 2017,
    contactNumber: "+254 767 890 123",
    email: "info@healthtrack.co.ke",
    website: "https://healthtrack.co.ke",
    accreditations: ["Kenya Medical Association", "Vaccination Alliance of Kenya"],
    emergencyServices: false,
    offerings: [
      {
        id: 601,
        name: "Comprehensive Cancer Screening Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 18000, currency: "KSH" },
        originalPrice: { amount: 22000, currency: "KSH" },
        category: "Wellness & Prevention",
        subcategory: "Screenings",
        description:
          "Comprehensive cancer screening package tailored by gender. For women includes mammogram, pap smear, HPV testing, and thyroid scan. For men includes PSA test, colonoscopy, and thyroid scan. Both include consultation with oncologist.",
        location: "Parklands, Nairobi",
        isPopular: true,
        dateAdded: "2025-02-28T10:30:00Z",
        rating: 4.6,
        reviewCount: 95,
        features: [
          "Gender-Specific Screenings",
          "Oncologist Consultation",
          "Digital Reports",
          "Follow-up Plan",
          "Risk Assessment",
        ],
        duration: "3-4 hours",
        availableSlots: 4,
        totalSlots: 6,
        tags: ["Cancer Screening", "Preventive Care", "Early Detection", "Oncology"],
        vendorId: 6,
        contactNumber: "+254 767 890 123",
        website: "https://healthtrack.co.ke",
        address: "Parklands Medical Center, Nairobi",
        provider: "HealthTrack Preventive Care",
        insuranceAccepted: ["AAR", "Jubilee", "NHIF Premium", "Britam", "Madison", "CIC"],
        appointmentRequired: true,
        availableDays: ["Monday", "Wednesday", "Friday"],
        availableHours: "8:00 AM - 3:00 PM",
      },
      {
        id: 602,
        name: "Travel Vaccination Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 9500, currency: "KSH" },
        originalPrice: { amount: 12000, currency: "KSH" },
        category: "Wellness & Prevention",
        subcategory: "Vaccinations",
        description:
          "Comprehensive travel vaccination package including consultation with travel medicine specialist, destination-specific vaccine recommendations, and administration of up to 3 vaccines. Includes yellow fever, typhoid, and hepatitis A vaccines.",
        location: "Parklands, Nairobi",
        isNew: true,
        dateAdded: "2025-03-20T10:30:00Z",
        rating: 4.5,
        reviewCount: 42,
        features: ["Travel Consultation", "3 Vaccines", "Yellow Card", "Medical Letter", "Travel Health Kit"],
        duration: "60 minutes",
        availableSlots: 8,
        totalSlots: 12,
        tags: ["Travel Vaccines", "Yellow Fever", "Typhoid", "Hepatitis A", "Travel Medicine"],
        hotDealEnds: "2025-04-20T23:59:59Z",
        isHotDeal: true,
        vendorId: 6,
        contactNumber: "+254 767 890 123",
        website: "https://healthtrack.co.ke",
        address: "Parklands Medical Center, Nairobi",
        provider: "Dr. Samuel Mwangi",
        providerQualification: "MD, Travel Medicine",
        providerSpecialty: "Travel Health & Vaccinations",
        insuranceAccepted: ["AAR", "Jubilee", "Britam", "Madison"],
        appointmentRequired: true,
        availableDays: ["Tuesday", "Thursday", "Saturday"],
        availableHours: "9:00 AM - 4:00 PM",
      },
    ],
  },

  // Mental Health
  {
    id: 7,
    name: "Mind Wellness Institute",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Specialized mental health center offering comprehensive psychological services and therapy programs.",
    redirectUrl: "https://mindwellness.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.9,
    reviewCount: 215,
    verified: true,
    establishedYear: 2016,
    contactNumber: "+254 778 901 234",
    email: "info@mindwellness.co.ke",
    website: "https://mindwellness.co.ke",
    accreditations: ["Kenya Psychological Association", "International Association of Counselors"],
    emergencyServices: true,
    offerings: [
      {
        id: 701,
        name: "Comprehensive Psychological Assessment",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 12000, currency: "KSH" },
        originalPrice: { amount: 15000, currency: "KSH" },
        category: "Mental Health",
        subcategory: "Psychiatry",
        description:
          "In-depth psychological assessment conducted by a clinical psychologist. Includes cognitive testing, personality assessment, mental health screening, and detailed evaluation report with treatment recommendations.",
        location: "Westlands, Nairobi",
        isPopular: true,
        dateAdded: "2025-03-01T10:30:00Z",
        rating: 5.0,
        reviewCount: 48,
        features: [
          "Cognitive Testing",
          "Personality Assessment",
          "Mental Health Screening",
          "Detailed Report",
          "Treatment Recommendations",
        ],
        duration: "3 hours (2 sessions)",
        availableSlots: 4,
        totalSlots: 6,
        tags: ["Psychological Assessment", "Mental Health", "Cognitive Testing", "Personality Assessment"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        isTrending: true,
        vendorId: 7,
        contactNumber: "+254 778 901 234",
        website: "https://mindwellness.co.ke",
        address: "Westlands Office Park, Nairobi",
        provider: "Dr. Rebecca Njeri",
        providerQualification: "PhD, Clinical Psychology",
        providerSpecialty: "Psychological Assessment",
        insuranceAccepted: ["AAR Mental Health", "Jubilee Comprehensive", "Britam Premium", "Madison"],
        appointmentRequired: true,
        availableDays: ["Monday", "Wednesday", "Friday"],
        availableHours: "9:00 AM - 5:00 PM",
      },
      {
        id: 702,
        name: "Stress & Anxiety Management Therapy Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 18000, currency: "KSH" },
        originalPrice: { amount: 24000, currency: "KSH" },
        category: "Mental Health",
        subcategory: "Therapy",
        description:
          "Six-session therapy package focused on stress and anxiety management. Includes initial assessment, cognitive-behavioral therapy sessions, relaxation techniques training, and personalized coping strategies development.",
        location: "Westlands, Nairobi",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.8,
        reviewCount: 36,
        features: [
          "Initial Assessment",
          "5 CBT Sessions",
          "Relaxation Techniques",
          "Coping Strategies",
          "Progress Tracking",
        ],
        duration: "6 weeks (1 session per week)",
        availableSlots: 6,
        totalSlots: 10,
        tags: ["Anxiety", "Stress Management", "Therapy", "CBT", "Mental Wellbeing"],
        vendorId: 7,
        contactNumber: "+254 778 901 234",
        website: "https://mindwellness.co.ke",
        address: "Westlands Office Park, Nairobi",
        provider: "Dr. James Ochieng",
        providerQualification: "PhD, Counseling Psychology",
        providerSpecialty: "Anxiety Disorders & Stress Management",
        insuranceAccepted: ["AAR Mental Health", "Jubilee Comprehensive", "Britam Premium"],
        appointmentRequired: true,
        availableDays: ["Tuesday", "Thursday", "Saturday"],
        availableHours: "10:00 AM - 6:00 PM",
      },
    ],
  },
  {
    id: 8,
    name: "Family Counseling Center",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Dedicated center providing counseling services for families, couples, and individuals of all ages.",
    redirectUrl: "https://familycounseling.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 183,
    establishedYear: 2014,
    contactNumber: "+254 789 012 345",
    email: "info@familycounseling.co.ke",
    website: "https://familycounseling.co.ke",
    accreditations: ["Kenya Association of Professional Counsellors", "International Family Therapy Association"],
    emergencyServices: false,
    offerings: [
      {
        id: 801,
        name: "Couples Therapy Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 16000, currency: "KSH" },
        originalPrice: { amount: 20000, currency: "KSH" },
        category: "Mental Health",
        subcategory: "Counseling",
        description:
          "Eight-session couples therapy package designed to improve communication, resolve conflicts, and strengthen relationships. Includes relationship assessment, communication skills training, and conflict resolution strategies.",
        location: "Karen, Nairobi",
        isPopular: true,
        dateAdded: "2025-02-25T10:30:00Z",
        rating: 4.8,
        reviewCount: 42,
        features: [
          "Relationship Assessment",
          "Communication Skills",
          "Conflict Resolution",
          "Intimacy Building",
          "Future Planning",
        ],
        duration: "8 weeks (1 session per week)",
        availableSlots: 4,
        totalSlots: 8,
        tags: ["Couples Therapy", "Relationship Counseling", "Marriage", "Communication"],
        vendorId: 8,
        contactNumber: "+254 789 012 345",
        website: "https://familycounseling.co.ke",
        address: "Karen Shopping Center, Nairobi",
        provider: "Dr. Sarah Kimani",
        providerQualification: "PhD, Marriage & Family Therapy",
        providerSpecialty: "Couples Counseling",
        insuranceAccepted: ["AAR Family", "Jubilee Family", "Britam Family"],
        appointmentRequired: true,
        availableDays: ["Monday", "Wednesday", "Friday"],
        availableHours: "2:00 PM - 8:00 PM",
      },
      {
        id: 802,
        name: "Adolescent Counseling Program",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 12000, currency: "KSH" },
        originalPrice: { amount: 15000, currency: "KSH" },
        category: "Mental Health",
        subcategory: "Counseling",
        description:
          "Six-session counseling program specifically designed for adolescents (ages 13-19) dealing with common teenage challenges. Addresses identity development, peer pressure, academic stress, and family relationships.",
        location: "Karen, Nairobi",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.7,
        reviewCount: 28,
        features: [
          "Individual Sessions",
          "Parent Consultation",
          "Coping Skills",
          "Academic Support",
          "Peer Relationship Guidance",
        ],
        duration: "6 weeks (1 session per week)",
        availableSlots: 5,
        totalSlots: 10,
        tags: ["Adolescent", "Teen Counseling", "Youth", "Mental Health"],
        hotDealEnds: "2025-04-18T23:59:59Z",
        isHotDeal: true,
        isAlmostFullyBooked: true,
        vendorId: 8,
        contactNumber: "+254 789 012 345",
        website: "https://familycounseling.co.ke",
        address: "Karen Shopping Center, Nairobi",
        provider: "Mary Wanjiku",
        providerQualification: "MSc, Adolescent Psychology",
        providerSpecialty: "Adolescent Counseling",
        insuranceAccepted: ["AAR Family", "Jubilee Family", "Britam Family", "Madison"],
        appointmentRequired: true,
        availableDays: ["Tuesday", "Thursday", "Saturday"],
        availableHours: "10:00 AM - 6:00 PM",
      },
    ],
  },

  // Alternative Medicine
  {
    id: 9,
    name: "Holistic Healing Center",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Integrative health center combining traditional healing practices with modern holistic approaches.",
    redirectUrl: "https://holistichealing.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.6,
    reviewCount: 156,
    verified: true,
    establishedYear: 2018,
    contactNumber: "+254 790 123 456",
    email: "info@holistichealing.co.ke",
    website: "https://holistichealing.co.ke",
    accreditations: ["Alternative Medicine Association of Kenya", "International Holistic Health Federation"],
    emergencyServices: false,
    offerings: [
      {
        id: 901,
        name: "Acupuncture Treatment Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 8000, currency: "KSH" },
        originalPrice: { amount: 10000, currency: "KSH" },
        category: "Alternative Medicine",
        subcategory: "Acupuncture",
        description:
          "Five-session acupuncture treatment package with a certified acupuncturist. Includes initial assessment, customized treatment plan, and follow-up sessions. Effective for pain management, stress reduction, and various chronic conditions.",
        location: "Kilimani, Nairobi",
        isPopular: true,
        dateAdded: "2025-03-02T10:30:00Z",
        rating: 4.7,
        reviewCount: 38,
        features: [
          "Initial Assessment",
          "4 Treatment Sessions",
          "Certified Acupuncturist",
          "Customized Plan",
          "Herbal Recommendations",
        ],
        duration: "5 weeks (1 session per week)",
        availableSlots: 6,
        totalSlots: 10,
        tags: ["Acupuncture", "Pain Management", "Holistic", "Traditional Chinese Medicine"],
        vendorId: 9,
        contactNumber: "+254 790 123 456",
        website: "https://holistichealing.co.ke",
        address: "Kilimani Business Center, Nairobi",
        provider: "Dr. Li Chen",
        providerQualification: "MD (China), Licensed Acupuncturist",
        providerSpecialty: "Traditional Chinese Medicine & Acupuncture",
        insuranceAccepted: ["AAR Alternative", "Jubilee Comprehensive"],
        appointmentRequired: true,
        availableDays: ["Monday", "Wednesday", "Friday"],
        availableHours: "9:00 AM - 5:00 PM",
      },
      {
        id: 902,
        name: "Ayurvedic Consultation & Treatment",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 7500, currency: "KSH" },
        originalPrice: { amount: 9000, currency: "KSH" },
        category: "Alternative Medicine",
        subcategory: "Ayurveda",
        description:
          "Comprehensive Ayurvedic consultation and treatment session with an experienced Ayurvedic practitioner. Includes dosha assessment, personalized diet and lifestyle recommendations, and therapeutic treatment session.",
        location: "Kilimani, Nairobi",
        isNew: true,
        dateAdded: "2025-03-20T10:30:00Z",
        rating: 4.5,
        reviewCount: 22,
        features: [
          "Dosha Assessment",
          "Personalized Diet Plan",
          "Lifestyle Recommendations",
          "Therapeutic Treatment",
          "Herbal Formulations",
        ],
        duration: "2 hours",
        availableSlots: 8,
        totalSlots: 12,
        tags: ["Ayurveda", "Holistic Health", "Natural Medicine", "Dosha Balance"],
        hotDealEnds: "2025-04-20T23:59:59Z",
        isHotDeal: true,
        vendorId: 9,
        contactNumber: "+254 790 123 456",
        website: "https://holistichealing.co.ke",
        address: "Kilimani Business Center, Nairobi",
        provider: "Dr. Anita Sharma",
        providerQualification: "BAMS, Ayurvedic Medicine",
        providerSpecialty: "Ayurvedic Medicine & Panchakarma",
        insuranceAccepted: ["AAR Alternative", "Jubilee Comprehensive"],
        appointmentRequired: true,
        availableDays: ["Tuesday", "Thursday", "Saturday"],
        availableHours: "10:00 AM - 6:00 PM",
      },
    ],
  },
  {
    id: 10,
    name: "Natural Wellness Clinic",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Naturopathic clinic offering natural approaches to health and healing through various holistic modalities.",
    redirectUrl: "https://naturalwellness.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.5,
    reviewCount: 142,
    verified: true,
    establishedYear: 2016,
    contactNumber: "+254 701 234 567",
    email: "info@naturalwellness.co.ke",
    website: "https://naturalwellness.co.ke",
    accreditations: ["Naturopathic Association of Kenya", "International Society for Naturopathic Medicine"],
    emergencyServices: false,
    offerings: [
      {
        id: 1001,
        name: "Naturopathic Consultation & Treatment Plan",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 6500, currency: "KSH" },
        originalPrice: { amount: 8000, currency: "KSH" },
        category: "Alternative Medicine",
        subcategory: "Naturopathy",
        description:
          "Comprehensive naturopathic consultation with a licensed naturopathic doctor. Includes detailed health history review, physical examination, and development of personalized treatment plan using natural therapies.",
        location: "Lavington, Nairobi",
        isPopular: true,
        dateAdded: "2025-02-28T10:30:00Z",
        rating: 4.6,
        reviewCount: 34,
        features: [
          "Health History Review",
          "Physical Examination",
          "Personalized Treatment Plan",
          "Natural Therapies",
          "Follow-up Support",
        ],
        duration: "90 minutes",
        availableSlots: 5,
        totalSlots: 8,
        tags: ["Naturopathy", "Natural Medicine", "Holistic Health", "Alternative Medicine"],
        vendorId: 10,
        contactNumber: "+254 701 234 567",
        website: "https://naturalwellness.co.ke",
        address: "Lavington Mall, Nairobi",
        provider: "Dr. David Mutua",
        providerQualification: "ND, Naturopathic Medicine",
        providerSpecialty: "Clinical Naturopathy",
        insuranceAccepted: ["AAR Alternative", "Jubilee Wellness"],
        appointmentRequired: true,
        availableDays: ["Monday", "Wednesday", "Friday"],
        availableHours: "9:00 AM - 5:00 PM",
      },
      {
        id: 1002,
        name: "Homeopathic Treatment Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 9000, currency: "KSH" },
        originalPrice: { amount: 12000, currency: "KSH" },
        category: "Alternative Medicine",
        subcategory: "Homeopathy",
        description:
          "Three-session homeopathic treatment package with a certified homeopath. Includes initial consultation, remedy prescription, and two follow-up sessions to monitor progress and adjust treatment as needed.",
        location: "Lavington, Nairobi",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.4,
        reviewCount: 26,
        features: [
          "Initial Consultation",
          "Personalized Remedy",
          "Two Follow-ups",
          "Constitutional Treatment",
          "Lifestyle Guidance",
        ],
        duration: "3 sessions over 2 months",
        availableSlots: 4,
        totalSlots: 6,
        tags: ["Homeopathy", "Natural Healing", "Alternative Medicine", "Holistic Treatment"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        isAlmostFullyBooked: true,
        vendorId: 10,
        contactNumber: "+254 701 234 567",
        website: "https://naturalwellness.co.ke",
        address: "Lavington Mall, Nairobi",
        provider: "Dr. Emily Wambui",
        providerQualification: "DHom, Homeopathic Medicine",
        providerSpecialty: "Classical Homeopathy",
        insuranceAccepted: ["AAR Alternative"],
        appointmentRequired: true,
        availableDays: ["Tuesday", "Thursday", "Saturday"],
        availableHours: "10:00 AM - 4:00 PM",
      },
    ],
  },
]

// Helper function to transform data for hot deals
const transformForHotDeals = (vendors: Vendor[]) => {
  return vendors.flatMap((vendor) =>
    vendor.offerings
      .filter((offering) => offering.isHotDeal)
      .map((offering) => ({
        id: offering.id,
        name: offering.name,
        imageUrl: offering.imageUrl,
        currentPrice: offering.currentPrice,
        originalPrice: offering.originalPrice,
        category: offering.category,
        expiresAt: offering.hotDealEnds || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: offering.description,
        discount: Math.round(
          ((offering.originalPrice.amount - offering.currentPrice.amount) / offering.originalPrice.amount) * 100,
        ),
      })),
  )
}

// Helper function to transform data for new products
const transformForNewProducts = (vendors: Vendor[]) => {
  return vendors.flatMap((vendor) =>
    vendor.offerings
      .filter((offering) => offering.isNew || isNewThisWeek(offering.dateAdded))
      .map((offering) => ({
        id: offering.id,
        name: offering.name,
        imageUrl: offering.imageUrl,
        currentPrice: offering.currentPrice,
        originalPrice: offering.originalPrice,
        category: offering.category,
        dateAdded: offering.dateAdded,
        isNew: true,
        description: offering.description,
      })),
  )
}

// Mock contact data for health service providers
const providerContacts = {
  "HealthCare Plus": {
    whatsapp: "+254701234567",
    phone: "+254701234567",
    email: "appointments@healthcareplus.co.ke",
    website: "https://www.healthcareplus.co.ke",
  },
  "MediCare Center": {
    whatsapp: "+254702345678",
    phone: "+254702345678",
    email: "bookings@medicarecenter.co.ke",
    website: "https://www.medicarecenter.co.ke",
  },
  WellnessHub: {
    whatsapp: "+254703456789",
    phone: "+254703456789",
    email: "contact@wellnesshub.co.ke",
    website: "https://www.wellnesshub.co.ke",
  },
  "FamilyHealth Clinic": {
    whatsapp: "+254704567890",
    phone: "+254704567890",
    email: "appointments@familyhealth.co.ke",
    website: "https://www.familyhealth.co.ke",
  },
  SpecialistCare: {
    whatsapp: "+254705678901",
    phone: "+254705678901",
    email: "bookings@specialistcare.co.ke",
    website: "https://www.specialistcare.co.ke",
  },
}

export default function HealthServicesPage() {
  useCookieTracking("health-services")

  // State for vendors and offerings
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors)
  const [newOfferingAlert, setNewOfferingAlert] = useState<HealthServiceData | null>(null)
  const [swapTrigger, setSwapTrigger] = useState(0)

  // State for active category and subcategory
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [activeSubcategory, setActiveSubcategory] = useState<string>("")

  const [showContactModal, setShowContactModal] = useState(false)

  // Custom color scheme for health-services providers
  const healthColorScheme = {
    primary: "from-purple-500 to-blue-700",
    secondary: "bg-purple-100",
    accent: "bg-amber-600",
    text: "text-purple-900",
    background: "bg-blue-50",
  }

  // State for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000])
  const [sortOrder, setSortOrder] = useState("default")
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([])

  // State for offering detail modal
  const [selectedOffering, setSelectedOffering] = useState<HealthServiceData | null>(null)

  // States for infinite scroll
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)

  // Get hot deals
  const hotDeals = useMemo(() => {
    return transformForHotDeals(vendors)
  }, [vendors, swapTrigger])

  // Get new products
  const newProducts = useMemo(() => {
    return transformForNewProducts(vendors)
  }, [vendors, swapTrigger])

  // Launch confetti effect on page load
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#06b6d4", "#0ea5e9", "#3b82f6"], // Cyan, light blue, blue colors for health
    })
  }, [])

  // Filter vendors based on search, category, subcategory, and price range
  useEffect(() => {
    let results = vendors

    // Filter by search term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      results = results.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          vendor.location.toLowerCase().includes(lowerCaseSearchTerm) ||
          vendor.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          vendor.offerings.some((offering) => {
            return (
              offering.name.toLowerCase().includes(lowerCaseSearchTerm) ||
              offering.description.toLowerCase().includes(lowerCaseSearchTerm) ||
              offering.location.toLowerCase().includes(lowerCaseSearchTerm) ||
              (offering.tags && offering.tags.some((tag) => tag.toLowerCase().includes(lowerCaseSearchTerm)))
            )
          }),
      )
    }

    // Filter by category
    if (activeCategory) {
      results = results.filter((vendor) =>
        vendor.offerings.some((offering) => offering.category.toLowerCase() === activeCategory.toLowerCase()),
      )
    }

    // Filter by subcategory
    if (activeSubcategory) {
      results = results.filter((vendor) =>
        vendor.offerings.some((offering) => offering.subcategory.toLowerCase() === activeSubcategory.toLowerCase()),
      )
    }

    // Filter by price range
    results = results.filter((vendor) =>
      vendor.offerings.some(
        (offering) => offering.currentPrice.amount >= priceRange[0] && offering.currentPrice.amount <= priceRange[1],
      ),
    )

    // Sort results
    if (sortOrder === "price-asc") {
      results.sort((a, b) => {
        const aMinPrice = Math.min(...a.offerings.map((offering) => offering.currentPrice.amount))
        const bMinPrice = Math.min(...b.offerings.map((offering) => offering.currentPrice.amount))
        return aMinPrice - bMinPrice
      })
    } else if (sortOrder === "price-desc") {
      results.sort((a, b) => {
        const aMaxPrice = Math.max(...a.offerings.map((offering) => offering.currentPrice.amount))
        const bMaxPrice = Math.max(...b.offerings.map((offering) => offering.currentPrice.amount))
        return bMaxPrice - aMaxPrice
      })
    } else if (sortOrder === "rating") {
      results.sort((a, b) => {
        const aRating = a.rating || 0
        const bRating = b.rating || 0
        return bRating - aRating
      })
    } else if (sortOrder === "newest") {
      results.sort((a, b) => {
        const aNewest = Math.max(...a.offerings.map((offering) => new Date(offering.dateAdded).getTime()))
        const bNewest = Math.max(...b.offerings.map((offering) => new Date(offering.dateAdded).getTime()))
        return bNewest - aNewest
      })
    }

    setFilteredVendors(results)
  }, [searchTerm, activeCategory, activeSubcategory, priceRange, sortOrder, vendors])

  // Add effect to detect and show new offering alerts
  useEffect(() => {
    // Find the newest offering across all vendors
    const allOfferings = vendors.flatMap((vendor) => vendor.offerings)
    const newOfferings = allOfferings.filter((offering) => offering.isNew || isNewThisWeek(offering.dateAdded))

    if (newOfferings.length > 0) {
      // Sort by date to get the newest one
      const newestOffering = newOfferings.sort(
        (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
      )[0]

      // Set as new offering alert
      setNewOfferingAlert(newestOffering)

      // Auto-dismiss after 10 seconds
      const timer = setTimeout(() => {
        setNewOfferingAlert(null)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [vendors])

  // Infinite scrolling
  const loadMoreItems = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false)
      setHasMore(false) // In a real app, you would check if there are more items to load
    }, 800)
  }, [isLoading, hasMore])

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreItems()
        }
      },
      { threshold: 0.1 },
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [loadMoreItems, hasMore])

  // Handle accordion toggle
  const toggleAccordion = (value: string) => {
    setExpandedAccordions((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  // Add swapping effect every 10 minutes
  useEffect(() => {
    const swapInterval = setInterval(
      () => {
        // Swap vendors
        setVendors((prevVendors) => {
          const newVendors = [...prevVendors]
          return swapArrayElementsRandomly(newVendors)
        })
        // Increment swap trigger to force re-renders
        setSwapTrigger((prev) => prev + 1)
      },
      10 * 60 * 1000, // 10 minutes
    )

    return () => clearInterval(swapInterval)
  }, [])

  return (
    <div className="bg-gradient-to-br from-cyan-500 via-blue-400 to-teal-500 min-h-screen">
      {/* Decorative health-themed elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-800 to-teal-800 opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-teal-800 to-blue-800 opacity-20"></div>

      {/* IMPROVEMENT: Added max-width to container to prevent excessive stretching on ultra-wide screens */}
      <div className="container mx-auto px-4 py-12 max-w-[1920px] relative z-10">
        {/* Health services header with blue accents */}
        <div className="text-center mb-10 bg-gradient-to-r from-blue-900/80 via-cyan-800/80 to-teal-900/80 p-8 rounded-2xl shadow-2xl border border-blue-300/30 backdrop-blur-sm">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-blue-100">Health Services</h1>

          {/* Health icons */}
          <div className="flex justify-center mb-4 gap-4">
            <HeartPulse className="h-8 w-8 text-cyan-300" />
            <Stethoscope className="h-8 w-8 text-blue-300" />
            <FirstAid className="h-8 w-8 text-teal-300" />
            <Brain className="h-8 w-8 text-cyan-300" />
            <ShieldPlus className="h-8 w-8 text-blue-300" />
          </div>

          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Discover quality healthcare services and wellness solutions for you and your family
          </p>
        </div>

        {/* New Offering Alert */}
        <AnimatePresence>
          {newOfferingAlert && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed bottom-6 right-6 z-50 max-w-md"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-blue-200">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 text-white mr-2" />
                    <h3 className="text-white font-bold">New Health Service!</h3>
                  </div>
                  <button onClick={() => setNewOfferingAlert(null)} className="text-white hover:text-gray-200">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4 flex">
                  <div className="w-20 h-20 relative flex-shrink-0 mr-4">
                    <Image
                      src={newOfferingAlert.imageUrl || "/placeholder.svg?height=80&width=80"}
                      alt={newOfferingAlert.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700">{newOfferingAlert.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{newOfferingAlert.location}</p>
                    <div className="flex items-center">
                      <span className="text-blue-600 font-bold mr-2">{formatPrice(newOfferingAlert.currentPrice)}</span>
                      <Badge className="bg-blue-100 text-blue-800">New Service</Badge>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                    onClick={() => {
                      // Find the vendor that has this offering
                      const vendor = vendors.find((v) => v.offerings.some((p) => p.id === newOfferingAlert.id))
                      if (vendor) {
                        // Expand that vendor's accordion
                        if (!expandedAccordions.includes(vendor.id.toString())) {
                          toggleAccordion(vendor.id.toString())
                        }
                        // Set the offering for detail view
                        setSelectedOffering(newOfferingAlert)
                      }
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Countdown Timer */}
        <div className="mb-8">
          <CountdownTimer targetDate="2025-05-31T23:59:59" startDate="2025-03-01T00:00:00" />
        </div>

        {/* Hot Time Deals Section */}
        {hotDeals.length > 0 && (
          <HotTimeDeals
            deals={hotDeals}
            colorScheme="blue"
            title="Limited Time Health Offers"
            subtitle="Exclusive deals on premium health services - book before they're gone!"
          />
        )}

        {/* New Products For You Section */}
        <NewProductsForYou allProducts={newProducts} colorScheme="blue" maxProducts={4} />

        {/* Trending and Popular Section */}
        <TrendingPopularSection
          trendingProducts={trendingProducts}
          popularProducts={popularProducts}
          colorScheme={healthColorScheme}
          title="Check the best Health care services providers Today!"
          subtitle="Discover  most popular adventure options"
        />
        {/*health-services*/}
        <div className="flex flex-wrap gap-4 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
          <Link href="/health-services/shop">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 transition-transform hover:scale-105"
            >
              Shop for the best Health Service Providers
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        {/*health-services*/}
        <div className="flex flex-wrap gap-4 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
          <Link href="/health-services/media">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 transition-transform hover:scale-105"
            >
              Watch more from our health services media shop
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Enhanced search section */}
        <div className="mb-10 bg-gradient-to-r from-blue-900/70 via-cyan-800/70 to-blue-900/70 p-6 rounded-xl shadow-lg border border-blue-300/30 backdrop-blur-sm">
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Search for health services, specialists, treatments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-full border-blue-400 bg-blue-50/90 backdrop-blur-sm text-blue-900 placeholder:text-blue-500/70 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
          </div>

          {/* Category tabs */}
          <Tabs defaultValue={activeCategory} value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
            <TabsList className="bg-blue-800/50 p-1 rounded-xl mb-4 flex flex-nowrap overflow-x-auto hide-scrollbar">
              <TabsTrigger
                value=""
                onClick={() => setActiveCategory("")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === "" ? "bg-blue-500 text-white shadow-sm" : "text-blue-100 hover:bg-blue-700/50"
                }`}
              >
                <Stethoscope className="h-4 w-4" />
                <span>All Services</span>
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  onClick={() => {
                    setActiveCategory(category.id)
                    setActiveSubcategory("")
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-blue-100 hover:bg-blue-700/50"
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Subcategory tabs */}
            {activeCategory && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-white">Subcategories</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={activeSubcategory === "" ? "default" : "outline"}
                    className={`cursor-pointer ${
                      activeSubcategory === ""
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-transparent border-blue-300 text-blue-100 hover:bg-blue-700/50"
                    }`}
                    onClick={() => setActiveSubcategory("")}
                  >
                    All {categories.find((c) => c.id === activeCategory)?.name || ""}
                  </Badge>
                  {categories
                    .find((c) => c.id === activeCategory)
                    ?.subcategories?.map((subcategory) => (
                      <Badge
                        key={subcategory}
                        variant={activeSubcategory === subcategory ? "default" : "outline"}
                        className={`cursor-pointer ${
                          activeSubcategory === subcategory
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-transparent border-blue-300 text-blue-100 hover:bg-blue-700/50"
                        }`}
                        onClick={() => setActiveSubcategory(subcategory)}
                      >
                        {subcategory}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {/* Price range filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-white">
                Price Range: {formatPrice({ amount: priceRange[0], currency: "KSH" })} -{" "}
                {formatPrice({ amount: priceRange[1], currency: "KSH" })}
              </h3>
              <div className="px-2 py-4">
                <Slider
                  defaultValue={[0, 30000]}
                  max={30000}
                  step={500}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="w-full"
                />
              </div>
            </div>

            {/* Sort options and results count */}
            <div className="flex flex-wrap justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-300" />
                <span className="text-sm text-blue-200">
                  {filteredVendors.reduce(
                    (count, vendor) =>
                      count +
                      vendor.offerings.filter(
                        (offering) =>
                          (!activeCategory || offering.category.toLowerCase() === activeCategory.toLowerCase()) &&
                          (!activeSubcategory ||
                            offering.subcategory.toLowerCase() === activeSubcategory.toLowerCase()),
                      ).length,
                    0,
                  )}{" "}
                  services found
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-200">Sort by:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="p-2 border rounded-md text-sm bg-blue-800 border-blue-600 text-blue-100"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest First</option>
                </select>
                <ArrowUpDown className="h-4 w-4 text-blue-300" />
              </div>
            </div>
          </Tabs>
        </div>

        {/* Main content */}
        <div className="space-y-12">
          {filteredVendors.length > 0 ? (
            filteredVendors.map((vendor) => (
              <VendorSection
                key={vendor.id}
                vendor={vendor}
                activeCategory={activeCategory}
                activeSubcategory={activeSubcategory}
                onOfferingClick={setSelectedOffering}
                isExpanded={expandedAccordions.includes(vendor.id.toString())}
                onToggle={() => toggleAccordion(vendor.id.toString())}
              />
            ))
          ) : (
            <div className="bg-gradient-to-r from-blue-900/70 via-cyan-800/70 to-blue-900/70 p-8 text-center rounded-lg shadow-md border border-blue-300/30 backdrop-blur-sm">
              <p className="text-blue-100 text-lg">No health services found matching your criteria.</p>
              <p className="text-blue-200 mt-2">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center bg-blue-900/80 p-6 rounded-full backdrop-blur-sm">
              <Loader2 className="h-10 w-10 animate-spin text-blue-300" />
              <p className="mt-2 text-blue-200 font-medium">Loading more services...</p>
            </div>
          </div>
        )}

        {/* Loader reference element */}
        <div ref={loaderRef} className="h-20"></div>
      </div>

      {/* Offering Detail Modal */}
      <Dialog open={!!selectedOffering} onOpenChange={() => setSelectedOffering(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-r from-blue-900/90 via-cyan-800/90 to-blue-900/90 border border-blue-300/30 text-white backdrop-blur-sm">
          {selectedOffering && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Offering image */}
                <div className="relative h-64 md:h-full rounded-lg overflow-hidden bg-blue-800/50">
                  <Image
                    src={selectedOffering.imageUrl || "/placeholder.svg"}
                    alt={selectedOffering.name}
                    layout="fill"
                    objectFit="cover"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {selectedOffering.isTrending && (
                      <Badge className="bg-orange-500 text-white flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        <span>Trending</span>
                      </Badge>
                    )}
                    {selectedOffering.isPopular && <MostPreferredBadge colorScheme="blue" size="sm" />}
                  </div>
                </div>

                {/* Offering details */}
                <div className="flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-blue-100 mb-2">{selectedOffering.name}</h3>
                    <div className="flex items-center text-blue-200 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{selectedOffering.location}</span>
                    </div>
                    <p className="text-blue-100">{selectedOffering.description}</p>
                  </div>

                  {/* Service details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {selectedOffering.duration && (
                      <div className="flex items-center text-blue-200">
                        <Clock className="h-4 w-4 mr-2 text-blue-300" />
                        <span>Duration: {selectedOffering.duration}</span>
                      </div>
                    )}
                    {selectedOffering.provider && (
                      <div className="flex items-center text-blue-200">
                        <User className="h-4 w-4 mr-2 text-blue-300" />
                        <span>Provider: {selectedOffering.provider}</span>
                      </div>
                    )}
                    {selectedOffering.providerQualification && (
                      <div className="flex items-center text-blue-200">
                        <Bookmark className="h-4 w-4 mr-2 text-blue-300" />
                        <span>Qualification: {selectedOffering.providerQualification}</span>
                      </div>
                    )}
                    {selectedOffering.providerSpecialty && (
                      <div className="flex items-center text-blue-200">
                        <Award className="h-4 w-4 mr-2 text-blue-300" />
                        <span>Specialty: {selectedOffering.providerSpecialty}</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-blue-100 mb-2">What's Included</h3>
                    <ul className="list-disc list-inside text-blue-200 space-y-1">
                      {selectedOffering.features?.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Insurance */}
                  {selectedOffering.insuranceAccepted && selectedOffering.insuranceAccepted.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-blue-100 mb-2">Insurance Accepted</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedOffering.insuranceAccepted.map((insurance, index) => (
                          <Badge key={index} variant="outline" className="border-blue-500 text-blue-200">
                            {insurance}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Availability */}
                  {selectedOffering.availableSlots !== undefined && selectedOffering.totalSlots !== undefined && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-blue-100 mb-2">Availability</h3>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-blue-200">Available slots:</span>
                        <span
                          className={`font-medium ${
                            selectedOffering.availableSlots < selectedOffering.totalSlots * 0.2
                              ? "text-red-400"
                              : selectedOffering.availableSlots < selectedOffering.totalSlots * 0.5
                                ? "text-blue-300"
                                : "text-green-400"
                          }`}
                        >
                          {selectedOffering.availableSlots} of {selectedOffering.totalSlots}
                        </span>
                      </div>
                      <div className="w-full bg-blue-800 rounded-full h-2 mb-4">
                        <div
                          className={`h-2 rounded-full ${
                            selectedOffering.availableSlots < selectedOffering.totalSlots * 0.2
                              ? "bg-red-500"
                              : selectedOffering.availableSlots < selectedOffering.totalSlots * 0.5
                                ? "bg-blue-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${(selectedOffering.availableSlots / selectedOffering.totalSlots) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Available days and hours */}
                  {(selectedOffering.availableDays || selectedOffering.availableHours) && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-blue-100 mb-2">Schedule</h3>
                      {selectedOffering.availableDays && (
                        <div className="flex items-center text-blue-200 mb-1">
                          <Calendar className="h-4 w-4 mr-2 text-blue-300" />
                          <span>Days: {selectedOffering.availableDays.join(", ")}</span>
                        </div>
                      )}
                      {selectedOffering.availableHours && (
                        <div className="flex items-center text-blue-200">
                          <Clock className="h-4 w-4 mr-2 text-blue-300" />
                          <span>Hours: {selectedOffering.availableHours}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-auto">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-100">
                          {formatPrice(selectedOffering.currentPrice)}
                        </div>
                        {selectedOffering.originalPrice.amount !== selectedOffering.currentPrice.amount && (
                          <div className="text-base text-blue-300 line-through">
                            {formatPrice(selectedOffering.originalPrice)}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-sm text-blue-200 mb-1">Appointment Required:</div>
                        <div className="font-medium text-blue-100">
                          {selectedOffering.appointmentRequired ? "Yes" : "No"}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {selectedOffering.originalPrice.amount !== selectedOffering.currentPrice.amount && (
                        <Button
                          variant="outline"
                          className="border-blue-500 text-blue-200 hover:bg-blue-800/50 flex-1 flex items-center justify-center gap-2 bg-transparent"
                        >
                          <Percent className="h-4 w-4" />
                          <span>
                            Save{" "}
                            {Math.round(
                              ((selectedOffering.originalPrice.amount - selectedOffering.currentPrice.amount) /
                                selectedOffering.originalPrice.amount) *
                                100,
                            )}
                            %
                          </span>
                        </Button>
                      )}

                      <Button
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white flex-1 flex items-center justify-center gap-2"
                        onClick={() => setShowContactModal(true)}
                      >
                        <CalendarClock className="h-4 w-4" />
                        <span>Book Appointment</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact information */}
              <div className="mt-6 pt-4 border-t border-blue-700">
                <h3 className="text-lg font-medium text-blue-100 mb-2">Contact Information</h3>
                <div className="flex flex-col gap-2 text-sm text-blue-200">
                  {selectedOffering.contactNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-300" />
                      <span>{selectedOffering.contactNumber}</span>
                    </div>
                  )}
                  {selectedOffering.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-300" />
                      <a
                        href={selectedOffering.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:underline"
                      >
                        {selectedOffering.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                  {selectedOffering.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-300" />
                      <span>{selectedOffering.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="max-w-md bg-gradient-to-r from-blue-900/95 via-cyan-800/95 to-blue-900/95 border border-blue-300/30 text-white backdrop-blur-sm">
          <DialogHeaderComponent>
            <DialogTitleComponent className="text-xl font-bold text-blue-100 flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-300" />
              Contact {selectedOffering?.provider || "Provider"}
            </DialogTitleComponent>
            <DialogDescriptionComponent className="text-blue-200">
              Choose your preferred way to get in touch
            </DialogDescriptionComponent>
          </DialogHeaderComponent>

          {selectedOffering && providerContacts[selectedOffering.provider] && (
            <div className="space-y-3 mt-4">
              {/* WhatsApp */}
              <Button
                onClick={() => {
                  const contact = providerContacts[selectedOffering.provider]
                  const message = `Hi! I would like to book an appointment for ${selectedOffering.name}. Please let me know your available slots.`
                  window.open(
                    `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`,
                    "_blank",
                  )
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-3 py-3"
              >
                <MessageCircle className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">WhatsApp</div>
                  <div className="text-sm opacity-90">{providerContacts[selectedOffering.provider].whatsapp}</div>
                </div>
              </Button>

              {/* Phone */}
              <Button
                onClick={() => {
                  window.open(`tel:${providerContacts[selectedOffering.provider].phone}`, "_self")
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-3 py-3"
              >
                <Phone className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Call Now</div>
                  <div className="text-sm opacity-90">{providerContacts[selectedOffering.provider].phone}</div>
                </div>
              </Button>

              {/* Email */}
              <Button
                onClick={() => {
                  const contact = providerContacts[selectedOffering.provider]
                  const subject = `Appointment Request - ${selectedOffering.name}`
                  const body = `Dear ${selectedOffering.provider},\n\nI would like to book an appointment for ${selectedOffering.name}.\n\nService Details:\n- Service: ${selectedOffering.name}\n- Location: ${selectedOffering.location}\n- Price: ${formatPrice(selectedOffering.currentPrice)}\n\nPlease let me know your available time slots.\n\nThank you!`
                  window.open(
                    `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
                    "_self",
                  )
                }}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center gap-3 py-3"
              >
                <Mail className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Email</div>
                  <div className="text-sm opacity-90">{providerContacts[selectedOffering.provider].email}</div>
                </div>
              </Button>

              {/* Website */}
              <Button
                onClick={() => {
                  window.open(providerContacts[selectedOffering.provider].website, "_blank")
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-3 py-3"
              >
                <Globe className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Visit Website</div>
                  <div className="text-sm opacity-90">
                    {providerContacts[selectedOffering.provider].website.replace(/^https?:\/\//, "")}
                  </div>
                </div>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
