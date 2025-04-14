"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import {
  Search,
  Star,
  Shield,
  Umbrella,
  Car,
  HeartPulse,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
  Phone,
  Globe,
  Percent,
  Flame,
  Award,
  Loader2,
  Filter,
  ArrowUpDown,
  Users,
  HomeIcon as House,
  BadgeCheck,
  Briefcase,
  Sparkles,
  Plus,
  Check,
  FileText,
  CalendarRange,
  CheckCircle,
  XCircle,
  CircleDollarSign,
  User,
  ChevronRight,
  Mail,
  Calendar,
  Landmark,
  Banknote,
  FileCheck,
} from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import CountdownTimer from "@/components/CountdownTimer"
import HotTimeDeals from "@/components/HotTimeDeals"
import NewProductsForYou from "@/components/NewProductsForYou"
import { useCookieTracking } from "@/hooks/useCookieTracking"
import { swapArrayElementsRandomly } from "@/utils/swap-utils"
import { isNewThisWeek } from "@/utils/date-utils"
import NewThisWeekBadge from "@/components/NewThisWeekBadge"
import MostPreferredBadge from "@/components/most-preferred-badge"
import Link from "next/link"
import TrendingPopularSection from "@/components/TrendingPopularSection"
import { trendingProducts, popularProducts } from "./trending-data"
import InsuranceRecommendations from "@/components/recommendations/insurance-recommendations"
// Add this import near the top of the file with the other imports
import CalendarBasedRecommendations from "@/components/recommendations/calendar-based-recommendations"

// Types
interface Price {
  amount: number
  currency: string
}

interface InsuranceData {
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
  coverage?: string[]
  coverageAmount?: Price
  deductible?: Price
  policyTerm?: string
  policyType?: string
  applicableAges?: {
    min: number
    max: number
  }
  waitingPeriod?: string
  exclusions?: string[]
  renewalTerms?: string
  claimsProcess?: string
  tags?: string[]
  hotDealEnds?: string
  discount?: number
  vendorId: number | string
  isHotDeal?: boolean
  isTrending?: boolean
  isLimitedOffer?: boolean
  contactNumber?: string
  website?: string
  address?: string
  agent?: string
  agentPhone?: string
  agentEmail?: string
  insurer: string
  insurerRating?: string
  freeAddOns?: string[]
  paymentFrequencies?: string[]
  specialEligibility?: string
}

interface Vendor {
  id: number | string
  name: string
  location: string
  logo: string
  description: string
  offerings: InsuranceData[]
  redirectUrl: string
  mapLink: string
  defaultCurrency: string
  rating?: number
  reviewCount?: number
  establishedYear?: number
  contactNumber?: string
  email?: string
  website?: string
  verified?:boolean
  licensedInRegions?: string[]
  companySize?: string
  claimsRating?: number
  awards?: string[]
  financialRating?: string
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
    case "life insurance":
      return <Shield size={size} />
    case "health insurance":
      return <HeartPulse size={size} />
    case "property insurance":
      return <House size={size} />
    case "auto insurance":
      return <Car size={size} />
    case "business insurance":
      return <Briefcase size={size} />
    default:
      return <Umbrella size={size} />
  }
}

// Define categories
const categories: Category[] = [
  {
    id: "life-insurance",
    name: "Life Insurance",
    icon: <Shield className="mr-2" />,
    subcategories: ["Term Life", "Whole Life", "Universal Life", "Endowment", "Group Life"],
  },
  {
    id: "health-insurance",
    name: "Health Insurance",
    icon: <HeartPulse className="mr-2" />,
    subcategories: ["Individual Medical", "Family Medical", "Critical Illness", "Disability", "Accident"],
  },
  {
    id: "property-insurance",
    name: "Property Insurance",
    icon: <House className="mr-2" />,
    subcategories: ["Homeowners", "Renters", "Commercial Property", "Fire", "Natural Disaster"],
  },
  {
    id: "auto-insurance",
    name: "Auto Insurance",
    icon: <Car className="mr-2" />,
    subcategories: ["Comprehensive", "Third Party", "Commercial Vehicle", "Motorcycle", "Fleet"],
  },
  {
    id: "business-insurance",
    name: "Business Insurance",
    icon: <Briefcase className="mr-2" />,
    subcategories: ["Liability", "Workers Compensation", "Professional Indemnity", "Cyber", "Directors & Officers"],
  },
]

// Mock data for vendors and offerings
const mockVendors: Vendor[] = [
  // Life Insurance
  {
    id: 1,
    name: "SafeGuard Life Insurance",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Leading provider of comprehensive life insurance solutions for individuals and families.",
    redirectUrl: "https://safeguardlife.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 356,
    verified:true,
    establishedYear: 2005,
    contactNumber: "+254 712 345 678",
    email: "info@safeguardlife.co.ke",
    website: "https://safeguardlife.co.ke",
    licensedInRegions: ["Nairobi", "Central", "Eastern", "Coast", "Western", "Rift Valley"],
    companySize: "Large (500+ employees)",
    claimsRating: 4.7,
    awards: ["Best Life Insurer 2024", "Customer Satisfaction Award 2023"],
    financialRating: "A+ (Superior)",
    offerings: [
      {
        id: 101,
        name: "Premier Term Life Insurance",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 2500, currency: "KSH" },
        originalPrice: { amount: 3000, currency: "KSH" },
        category: "Life Insurance",
        subcategory: "Term Life",
        description:
          "Comprehensive term life insurance providing financial protection for your loved ones. Flexible coverage terms with affordable premiums and optional riders for enhanced protection.",
        location: "Nationwide",
        isPopular: true,
        dateAdded: "2025-03-10T10:30:00Z",
        rating: 4.9,
        reviewCount: 128,
        features: [
          "Flexible Terms",
          "Level Premiums",
          "Convertible Option",
          "Terminal Illness Benefit",
          "Premium Waiver",
        ],
        coverage: ["Death Benefit", "Terminal Illness", "Optional Critical Illness", "Optional Disability"],
        coverageAmount: { amount: 5000000, currency: "KSH" },
        policyTerm: "10, 15, 20, or 30 years",
        policyType: "Term Life",
        applicableAges: { min: 18, max: 65 },
        waitingPeriod: "30 days",
        exclusions: ["Suicide within first 2 years", "Self-inflicted injuries", "Criminal activities"],
        renewalTerms: "Renewable up to age 75 with increased premiums",
        claimsProcess: "Simple online process with 48-hour initial response",
        tags: ["Term Life", "Financial Protection", "Family Security", "Death Benefit"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 1,
        contactNumber: "+254 712 345 678",
        website: "https://safeguardlife.co.ke",
        address: "Safeguard Tower, Nairobi CBD",
        agent: "John Kamau",
        agentPhone: "+254 712 345 679",
        agentEmail: "john.kamau@safeguardlife.co.ke",
        insurer: "SafeGuard Life Insurance",
        insurerRating: "A+ (Superior)",
        freeAddOns: ["Terminal Illness Benefit", "Repatriation Benefit"],
        paymentFrequencies: ["Monthly", "Quarterly", "Semi-Annually", "Annually"],
      },
      {
        id: 102,
        name: "Family Whole Life Plan",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 5000, currency: "KSH" },
        originalPrice: { amount: 5500, currency: "KSH" },
        category: "Life Insurance",
        subcategory: "Whole Life",
        description:
          "Lifetime coverage with guaranteed cash value accumulation. Provides permanent protection and a tax-advantaged investment component for long-term financial planning.",
        location: "Nationwide",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.8,
        reviewCount: 76,
        features: ["Lifetime Coverage", "Cash Value Growth", "Fixed Premiums", "Loan Option", "Dividend Eligible"],
        coverage: ["Death Benefit", "Cash Value Accumulation", "Loan Collateral", "Estate Planning"],
        coverageAmount: { amount: 10000000, currency: "KSH" },
        policyTerm: "Lifetime",
        policyType: "Whole Life",
        applicableAges: { min: 18, max: 70 },
        waitingPeriod: "90 days",
        exclusions: ["Suicide within first 2 years", "Fraudulent claims", "War and terrorism"],
        renewalTerms: "N/A (permanent coverage)",
        claimsProcess: "Dedicated claims agent with 7-day processing",
        tags: ["Whole Life", "Permanent Insurance", "Cash Value", "Lifetime Coverage"],
        vendorId: 1,
        isTrending: true,
        contactNumber: "+254 712 345 678",
        website: "https://safeguardlife.co.ke",
        address: "Safeguard Tower, Nairobi CBD",
        agent: "Mary Wanjiku",
        agentPhone: "+254 712 345 680",
        agentEmail: "mary.wanjiku@safeguardlife.co.ke",
        insurer: "SafeGuard Life Insurance",
        insurerRating: "A+ (Superior)",
        freeAddOns: ["Funeral Expenses Benefit", "Accidental Death Benefit"],
        paymentFrequencies: ["Monthly", "Quarterly", "Semi-Annually", "Annually"],
      },
    ],
  },
  {
    id: 2,
    name: "FutureSecure Life Insurance",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Innovative life insurance solutions with modern benefits and digital-first approach.",
    redirectUrl: "https://futuresecure.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 245,
    verified:true,
    establishedYear: 2012,
    contactNumber: "+254 723 456 789",
    email: "info@futuresecure.co.ke",
    website: "https://futuresecure.co.ke",
    licensedInRegions: ["Nairobi", "Central", "Eastern", "Coast", "Rift Valley"],
    companySize: "Medium (200-500 employees)",
    claimsRating: 4.6,
    awards: ["Digital Insurer of the Year 2024", "Innovation Award 2023"],
    financialRating: "A (Excellent)",
    offerings: [
      {
        id: 201,
        name: "Education Endowment Plan",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 3500, currency: "KSH" },
        originalPrice: { amount: 4000, currency: "KSH" },
        category: "Life Insurance",
        subcategory: "Endowment",
        description:
          "Education-focused endowment plan to secure your child's future education funds. Combines insurance protection with guaranteed maturity benefit payable when your child reaches college age.",
        location: "Nationwide",
        isPopular: true,
        dateAdded: "2025-02-20T10:30:00Z",
        rating: 4.7,
        reviewCount: 98,
        features: [
          "Guaranteed Maturity",
          "Flexible Premium Payment",
          "Scholarship Bonus",
          "Premium Waiver on Death",
          "Cash Withdrawals",
        ],
        coverage: ["Death Benefit", "Maturity Benefit", "Partial Withdrawals", "Education Bonus"],
        coverageAmount: { amount: 3000000, currency: "KSH" },
        policyTerm: "10-20 years (until child's education)",
        policyType: "Endowment",
        applicableAges: { min: 18, max: 60 },
        waitingPeriod: "60 days",
        exclusions: ["Suicide within first year", "Fraudulent claims"],
        renewalTerms: "N/A (fixed term)",
        claimsProcess: "Fast-track processing for education disbursements",
        tags: ["Education", "Child Plan", "Endowment", "College Fund"],
        isLimitedOffer: true,
        vendorId: 2,
        contactNumber: "+254 723 456 789",
        website: "https://futuresecure.co.ke",
        address: "FutureSecure House, Westlands, Nairobi",
        agent: "James Omondi",
        agentPhone: "+254 723 456 790",
        agentEmail: "james.omondi@futuresecure.co.ke",
        insurer: "FutureSecure Life Insurance",
        insurerRating: "A (Excellent)",
        freeAddOns: ["Academic Achievement Bonus", "Career Counseling Services"],
        paymentFrequencies: ["Monthly", "Quarterly", "Semi-Annually", "Annually"],
        specialEligibility: "Parents or guardians of children under 15",
      },
      {
        id: 202,
        name: "Universal Life Plus",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 6000, currency: "KSH" },
        originalPrice: { amount: 7500, currency: "KSH" },
        category: "Life Insurance",
        subcategory: "Universal Life",
        description:
          "Flexible premium universal life insurance with investment component linked to market performance. Adjustable coverage and premium payments to suit changing financial circumstances.",
        location: "Nationwide",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.6,
        reviewCount: 65,
        features: [
          "Flexible Premiums",
          "Adjustable Death Benefit",
          "Cash Value Investment",
          "Tax-Advantaged Growth",
          "Partial Withdrawals",
        ],
        coverage: ["Death Benefit", "Investment Component", "Cash Value Access", "Estate Planning"],
        coverageAmount: { amount: 15000000, currency: "KSH" },
        policyTerm: "Lifetime (with minimum premium requirements)",
        policyType: "Universal Life",
        applicableAges: { min: 18, max: 70 },
        waitingPeriod: "30 days",
        exclusions: ["Suicide within first 2 years", "Material misrepresentation"],
        renewalTerms: "Continues with minimum funding requirements",
        claimsProcess: "Digital claims submission with 5-day processing",
        tags: ["Universal Life", "Flexible Insurance", "Investment", "Cash Value"],
        hotDealEnds: "2025-04-10T23:59:59Z",
        isHotDeal: true,
        vendorId: 2,
        contactNumber: "+254 723 456 789",
        website: "https://futuresecure.co.ke",
        address: "FutureSecure House, Westlands, Nairobi",
        agent: "Daniel Kimani",
        agentPhone: "+254 723 456 791",
        agentEmail: "daniel.kimani@futuresecure.co.ke",
        insurer: "FutureSecure Life Insurance",
        insurerRating: "A (Excellent)",
        freeAddOns: ["Financial Advisory Services", "Policy Review Sessions"],
        paymentFrequencies: ["Monthly", "Quarterly", "Semi-Annually", "Annually"],
      },
    ],
  },

  // Health Insurance
  {
    id: 3,
    name: "Premier Health Insurance",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Comprehensive health insurance plans for individuals, families, and businesses with extensive network coverage.",
    redirectUrl: "https://premierhealth.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.9,
    reviewCount: 412,
    establishedYear: 2008,
    contactNumber: "+254 734 567 890",
    email: "info@premierhealth.co.ke",
    website: "https://premierhealth.co.ke",
    licensedInRegions: ["All Counties in Kenya"],
    companySize: "Large (1000+ employees)",
    claimsRating: 4.8,
    awards: ["Best Health Insurer 2024", "Customer Service Excellence 2023", "Digital Innovation Award 2022"],
    financialRating: "A++ (Superior)",
    offerings: [
      {
        id: 301,
        name: "Family Health Shield Plan",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 45000, currency: "KSH" },
        originalPrice: { amount: 55000, currency: "KSH" },
        category: "Health Insurance",
        subcategory: "Family Medical",
        description:
          "Comprehensive family health insurance covering inpatient, outpatient, maternity, dental, and optical benefits. Coverage for a family of up to 6 members with extensive hospital network.",
        location: "Nationwide",
        isPopular: true,
        dateAdded: "2025-03-05T10:30:00Z",
        rating: 4.9,
        reviewCount: 156,
        features: [
          "Extensive Hospital Network",
          "No-Wait Emergency Care",
          "Maternity Coverage",
          "Chronic Disease Management",
          "Preventive Care",
        ],
        coverage: ["Inpatient", "Outpatient", "Maternity", "Dental", "Optical", "Chronic Conditions"],
        coverageAmount: { amount: 3000000, currency: "KSH" },
        deductible: { amount: 5000, currency: "KSH" },
        policyTerm: "1 year (renewable)",
        policyType: "Family Health",
        applicableAges: { min: 0, max: 65 },
        waitingPeriod: "30 days general, 9 months for maternity",
        exclusions: ["Pre-existing conditions (1st year)", "Cosmetic surgery", "Self-inflicted injuries"],
        renewalTerms: "Guaranteed renewability with age-based premium adjustments",
        claimsProcess: "Cashless at network hospitals, 14-day reimbursement for out-of-network",
        tags: ["Family Health", "Medical Insurance", "Comprehensive Coverage", "Hospital Network"],
        hotDealEnds: "2025-04-05T23:59:59Z",
        isHotDeal: true,
        vendorId: 3,
        isTrending: true,
        contactNumber: "+254 734 567 890",
        website: "https://premierhealth.co.ke",
        address: "Premier Health Plaza, Upper Hill, Nairobi",
        agent: "Sarah Njoroge",
        agentPhone: "+254 734 567 891",
        agentEmail: "sarah.njoroge@premierhealth.co.ke",
        insurer: "Premier Health Insurance",
        insurerRating: "A++ (Superior)",
        freeAddOns: ["Wellness Program", "Telemedicine Services", "Fitness Club Discounts"],
        paymentFrequencies: ["Monthly", "Quarterly", "Semi-Annually", "Annually"],
      },
      {
        id: 302,
        name: "Critical Illness Protection",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 12000, currency: "KSH" },
        originalPrice: { amount: 15000, currency: "KSH" },
        category: "Health Insurance",
        subcategory: "Critical Illness",
        description:
          "Specialized coverage providing lump-sum payment upon diagnosis of covered critical illnesses. Helps cover treatment costs, loss of income, and other expenses during recovery.",
        location: "Nationwide",
        isNew: true,
        dateAdded: "2025-03-12T10:30:00Z",
        rating: 4.8,
        reviewCount: 87,
        features: [
          "Lump Sum Payout",
          "Wide Range of Covered Conditions",
          "No Restrictions on Fund Usage",
          "Survival Period Benefit",
          "Multiple Claims Allowed",
        ],
        coverage: [
          "Cancer",
          "Heart Attack",
          "Stroke",
          "Kidney Failure",
          "Major Organ Transplant",
          "Multiple Sclerosis",
        ],
        coverageAmount: { amount: 2000000, currency: "KSH" },
        policyTerm: "Fixed terms of 10, 15, or 20 years",
        policyType: "Critical Illness",
        applicableAges: { min: 18, max: 60 },
        waitingPeriod: "90 days",
        exclusions: ["Pre-existing conditions", "Self-inflicted injuries", "Drug abuse related illnesses"],
        renewalTerms: "Renewable up to age 65 with health reassessment",
        claimsProcess: "Simplified claims with medical documentation only",
        tags: ["Critical Illness", "Lump Sum Benefit", "Cancer Coverage", "Heart Disease"],
        vendorId: 3,
        contactNumber: "+254 734 567 890",
        website: "https://premierhealth.co.ke",
        address: "Premier Health Plaza, Upper Hill, Nairobi",
        agent: "George Mutua",
        agentPhone: "+254 734 567 892",
        agentEmail: "george.mutua@premierhealth.co.ke",
        insurer: "Premier Health Insurance",
        insurerRating: "A++ (Superior)",
        freeAddOns: ["Second Medical Opinion", "Health Screening Benefit"],
        paymentFrequencies: ["Annually", "Semi-Annually"],
      },
    ],
  },
  {
    id: 4,
    name: "AfyaPlus Health Insurance",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Affordable and accessible health insurance plans with focus on preventive care and wellness.",
    redirectUrl: "https://afyaplus.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 328,
    verified:true,
    establishedYear: 2010,
    contactNumber: "+254 745 678 901",
    email: "info@afyaplus.co.ke",
    website: "https://afyaplus.co.ke",
    licensedInRegions: ["All Counties in Kenya"],
    companySize: "Medium (200-500 employees)",
    claimsRating: 4.6,
    awards: ["Affordable Insurance Provider 2023", "Digital Health Insurance Award 2024"],
    financialRating: "A (Excellent)",
    offerings: [
      {
        id: 401,
        name: "Comprehensive Individual Health Plan",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 25000, currency: "KSH" },
        originalPrice: { amount: 30000, currency: "KSH" },
        category: "Health Insurance",
        subcategory: "Individual Medical",
        description:
          "Flexible individual health insurance with customizable coverage levels. Comprehensive benefits including inpatient, outpatient, specialist consultations, and preventive care.",
        location: "Nationwide",
        isPopular: true,
        dateAdded: "2025-02-25T10:30:00Z",
        rating: 4.8,
        reviewCount: 142,
        features: [
          "Customizable Coverage",
          "Preventive Care Focus",
          "Digital Claims Process",
          "Direct Provider Payments",
          "Annual Health Check-ups",
        ],
        coverage: ["Inpatient", "Outpatient", "Specialists", "Medications", "Diagnostic Tests", "Emergency Services"],
        coverageAmount: { amount: 2000000, currency: "KSH" },
        deductible: { amount: 3000, currency: "KSH" },
        policyTerm: "1 year (renewable)",
        policyType: "Individual Medical",
        applicableAges: { min: 18, max: 70 },
        waitingPeriod: "30 days",
        exclusions: ["Pre-existing conditions (1st year)", "Cosmetic procedures", "Experimental treatments"],
        renewalTerms: "Guaranteed renewable with age-based adjustments",
        claimsProcess: "Digital claims processing with 7-day turnaround",
        tags: ["Individual Health", "Medical Insurance", "Customizable", "Preventive Care"],
        vendorId: 4,
        contactNumber: "+254 745 678 901",
        website: "https://afyaplus.co.ke",
        address: "AfyaPlus Center, Kilimani, Nairobi",
        agent: "Joseph Mwangi",
        agentPhone: "+254 745 678 902",
        agentEmail: "joseph.mwangi@afyaplus.co.ke",
        insurer: "AfyaPlus Health Insurance",
        insurerRating: "A (Excellent)",
        freeAddOns: ["Annual Wellness Check", "Telemedicine Access", "Health Information Portal"],
        paymentFrequencies: ["Monthly", "Quarterly", "Semi-Annually", "Annually"],
      },
      {
        id: 402,
        name: "Accident & Emergency Cover",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 8000, currency: "KSH" },
        originalPrice: { amount: 10000, currency: "KSH" },
        category: "Health Insurance",
        subcategory: "Accident",
        description:
          "Specialized coverage for accidents and medical emergencies with 24/7 protection. Provides immediate financial support for emergency treatment, hospitalization, and recovery expenses.",
        location: "Nationwide",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.7,
        reviewCount: 68,
        features: [
          "24/7 Emergency Assistance",
          "Air Ambulance Coverage",
          "Global Emergency Coverage",
          "No Pre-authorization for Emergencies",
          "Rehabilitation Coverage",
        ],
        coverage: [
          "Emergency Treatment",
          "Accidental Injuries",
          "Ambulance Services",
          "Hospital Admission",
          "Rehabilitation",
        ],
        coverageAmount: { amount: 1000000, currency: "KSH" },
        deductible: { amount: 1000, currency: "KSH" },
        policyTerm: "1 year (renewable)",
        policyType: "Accident & Emergency",
        applicableAges: { min: 5, max: 75 },
        waitingPeriod: "None",
        exclusions: ["Self-inflicted injuries", "Injuries while committing crimes", "Professional sports injuries"],
        renewalTerms: "Guaranteed renewal without claims assessment",
        claimsProcess: "24-hour emergency hotline with immediate authorization",
        tags: ["Accident Coverage", "Emergency Medical", "Air Ambulance", "Travel Protection"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        isLimitedOffer: false,
        vendorId: 4,
        contactNumber: "+254 745 678 901",
        website: "https://afyaplus.co.ke",
        address: "AfyaPlus Center, Kilimani, Nairobi",
        agent: "Faith Kamau",
        agentPhone: "+254 745 678 903",
        agentEmail: "faith.kamau@afyaplus.co.ke",
        insurer: "AfyaPlus Health Insurance",
        insurerRating: "A (Excellent)",
        freeAddOns: ["Travel Emergency Support", "Emergency Dental Treatment"],
        paymentFrequencies: ["Monthly", "Quarterly", "Semi-Annually", "Annually"],
      },
    ],
  },

  // Property Insurance
  {
    id: 5,
    name: "SecureHome Property Insurance",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Specialized property insurance solutions for homeowners, renters, and commercial property owners.",
    redirectUrl: "https://securehome.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.8,
    reviewCount: 376,
    verified:true,
    establishedYear: 2007,
    contactNumber: "+254 756 789 012",
    email: "info@securehome.co.ke",
    website: "https://securehome.co.ke",
    licensedInRegions: ["All Counties in Kenya"],
    companySize: "Medium (200-500 employees)",
    claimsRating: 4.7,
    awards: ["Best Property Insurer 2023", "Claims Excellence Award 2024"],
    financialRating: "A+ (Superior)",
    offerings: [
      {
        id: 501,
        name: "Comprehensive Homeowners Insurance",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 15000, currency: "KSH" },
        originalPrice: { amount: 18000, currency: "KSH" },
        category: "Property Insurance",
        subcategory: "Homeowners",
        description:
          "All-inclusive homeowners insurance protecting your house, personal belongings, and liability. Coverage against fire, theft, natural disasters, and accidental damage with optional add-ons for enhanced protection.",
        location: "Nationwide",
        isPopular: true,
        dateAdded: "2025-03-08T10:30:00Z",
        rating: 4.9,
        reviewCount: 112,
        features: [
          "Building Coverage",
          "Contents Protection",
          "Liability Coverage",
          "Alternative Accommodation",
          "Emergency Home Assistance",
        ],
        coverage: [
          "Fire & Lightning",
          "Theft & Burglary",
          "Water Damage",
          "Natural Disasters",
          "Liability",
          "Additional Living Expenses",
        ],
        coverageAmount: { amount: 25000000, currency: "KSH" },
        deductible: { amount: 10000, currency: "KSH" },
        policyTerm: "1 year (renewable)",
        policyType: "Homeowners",
        waitingPeriod: "7 days",
        exclusions: ["Wear and tear", "Intentional damage", "Business activities"],
        renewalTerms: "Annual renewal with property value reassessment",
        claimsProcess: "24-hour claims reporting with dedicated claim adjuster",
        tags: ["Homeowners", "Property Protection", "Liability Coverage", "Contents Insurance"],
        hotDealEnds: "2025-04-08T23:59:59Z",
        isHotDeal: true,
        isTrending: true,
        vendorId: 5,
        contactNumber: "+254 756 789 012",
        website: "https://securehome.co.ke",
        address: "SecureHome House, Westlands, Nairobi",
        agent: "Susan Wambui",
        agentPhone: "+254 756 789 013",
        agentEmail: "susan.wambui@securehome.co.ke",
        insurer: "SecureHome Property Insurance",
        insurerRating: "A+ (Superior)",
        freeAddOns: ["Home Emergency Services", "Security System Discount"],
        paymentFrequencies: ["Monthly", "Quarterly", "Semi-Annually", "Annually"],
      },
      {
        id: 502,
        name: "Commercial Property Coverage",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 45000, currency: "KSH" },
        originalPrice: { amount: 55000, currency: "KSH" },
        category: "Property Insurance",
        subcategory: "Commercial Property",
        description:
          "Comprehensive protection for commercial buildings, inventory, equipment, and business interruption. Tailored for businesses of all sizes with specialized coverage options for different industries.",
        location: "Nationwide",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.7,
        reviewCount: 78,
        features: [
          "Building Protection",
          "Business Contents Coverage",
          "Business Interruption",
          "Liability Protection",
          "Employee Dishonesty Coverage",
        ],
        coverage: [
          "Property Damage",
          "Theft & Burglary",
          "Fire & Natural Disasters",
          "Business Interruption",
          "Liability Claims",
        ],
        coverageAmount: { amount: 50000000, currency: "KSH" },
        deductible: { amount: 25000, currency: "KSH" },
        policyTerm: "1 year (renewable)",
        policyType: "Commercial Property",
        waitingPeriod: "14 days",
        exclusions: ["Gradual deterioration", "Electronic data loss", "Intentional damage"],
        renewalTerms: "Annual renewal with business valuation updates",
        claimsProcess: "Dedicated commercial claims team with expedited processing",
        tags: ["Commercial Property", "Business Insurance", "Interruption Coverage", "Liability Protection"],
        vendorId: 5,
        contactNumber: "+254 756 789 012",
        website: "https://securehome.co.ke",
        address: "SecureHome House, Westlands, Nairobi",
        agent: "David Maina",
        agentPhone: "+254 756 789 014",
        agentEmail: "david.maina@securehome.co.ke",
        insurer: "SecureHome Property Insurance",
        insurerRating: "A+ (Superior)",
        freeAddOns: ["Risk Assessment Services", "Business Continuity Planning"],
        paymentFrequencies: ["Monthly", "Quarterly", "Semi-Annually", "Annually"],
      },
    ],
  },
  {
    id: 6,
    name: "RentGuard Insurance",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description: "Specialized insurance solutions for renters, landlords, and rental property management.",
    redirectUrl: "https://rentguard.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.6,
    reviewCount: 289,
    verified:true,
    establishedYear: 2013,
    contactNumber: "+254 767 890 123",
    email: "info@rentguard.co.ke",
    website: "https://rentguard.co.ke",
    licensedInRegions: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
    companySize: "Small (50-200 employees)",
    claimsRating: 4.5,
    awards: ["Best Renters Insurance Provider 2024", "Customer Value Award 2023"],
    financialRating: "A- (Excellent)",
    offerings: [
      {
        id: 601,
        name: "Premium Renters Insurance",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 5000, currency: "KSH" },
        originalPrice: { amount: 6500, currency: "KSH" },
        category: "Property Insurance",
        subcategory: "Renters",
        description:
          "Affordable insurance for renters covering personal belongings, liability, and additional living expenses. Protection against theft, fire, and water damage with optional add-ons for valuables.",
        location: "Major Urban Centers",
        isPopular: true,
        dateAdded: "2025-02-28T10:30:00Z",
        rating: 4.6,
        reviewCount: 95,
        features: [
          "Personal Property Coverage",
          "Liability Protection",
          "Additional Living Expenses",
          "Medical Payments",
          "Valuables Coverage",
        ],
        coverage: [
          "Personal Belongings",
          "Liability Claims",
          "Additional Living Expenses",
          "Medical Payments to Others",
        ],
        coverageAmount: { amount: 1500000, currency: "KSH" },
        deductible: { amount: 5000, currency: "KSH" },
        policyTerm: "1 year (renewable)",
        policyType: "Renters",
        waitingPeriod: "3 days",
        exclusions: ["Landlord's property", "Building structure", "Business equipment"],
        renewalTerms: "Simple renewal with inventory update",
        claimsProcess: "Mobile app claims submission with 48-hour response",
        tags: ["Renters", "Contents Insurance", "Tenant Protection", "Liability"],
        vendorId: 6,
        contactNumber: "+254 767 890 123",
        website: "https://rentguard.co.ke",
        address: "RentGuard Plaza, Kilimani, Nairobi",
        agent: "Alex Njoroge",
        agentPhone: "+254 767 890 124",
        agentEmail: "alex.njoroge@rentguard.co.ke",
        insurer: "RentGuard Insurance",
        insurerRating: "A- (Excellent)",
        freeAddOns: ["Identity Theft Protection", "Electronics Coverage"],
        paymentFrequencies: ["Monthly", "Quarterly", "Annually"],
      },
      {
        id: 602,
        name: "Natural Disaster Protection Plan",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 8000, currency: "KSH" },
        originalPrice: { amount: 10000, currency: "KSH" },
        category: "Property Insurance",
        subcategory: "Natural Disaster",
        description:
          "Specialized insurance covering damages caused by floods, earthquakes, landslides, and other natural disasters. Can be added to existing homeowners or renters policies for comprehensive protection.",
        location: "Nationwide (risk-based pricing)",
        isNew: true,
        dateAdded: "2025-03-20T10:30:00Z",
        rating: 4.5,
        reviewCount: 42,
        features: [
          "Flood Coverage",
          "Earthquake Protection",
          "Landslide Coverage",
          "Emergency Evacuation",
          "Reconstruction Assistance",
        ],
        coverage: ["Property Damage", "Contents Damage", "Alternative Accommodation", "Emergency Response"],
        coverageAmount: { amount: 10000000, currency: "KSH" },
        deductible: { amount: 20000, currency: "KSH" },
        policyTerm: "1 year (renewable)",
        policyType: "Natural Disaster",
        waitingPeriod: "30 days",
        exclusions: ["Gradually occurring events", "Man-made disasters", "Pre-existing damage"],
        renewalTerms: "Annual renewal with risk reassessment",
        claimsProcess: "Rapid response team with expedited processing for disasters",
        tags: ["Natural Disaster", "Flood Insurance", "Earthquake Coverage", "Property Protection"],
        hotDealEnds: "2025-04-20T23:59:59Z",
        isHotDeal: true,
        vendorId: 6,
        contactNumber: "+254 767 890 123",
        website: "https://rentguard.co.ke",
        address: "RentGuard Plaza, Kilimani, Nairobi",
        agent: "Nancy Wangari",
        agentPhone: "+254 767 890 125",
        agentEmail: "nancy.wangari@rentguard.co.ke",
        insurer: "RentGuard Insurance",
        insurerRating: "A- (Excellent)",
        freeAddOns: ["Disaster Preparedness Kit", "Emergency Alert System"],
        paymentFrequencies: ["Quarterly", "Semi-Annually", "Annually"],
      },
    ],
  },

  // Auto Insurance
  {
    id: 7,
    name: "DriveSecure Auto Insurance",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Innovative auto insurance solutions with digital-first approach and reward programs for safe drivers.",
    redirectUrl: "https://drivesecure.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.9,
    reviewCount: 215,
    verified:true,
    establishedYear: 2014,
    contactNumber: "+254 778 901 234",
    email: "info@drivesecure.co.ke",
    website: "https://drivesecure.co.ke",
    licensedInRegions: ["All Counties in Kenya"],
    companySize: "Medium (200-500 employees)",
    claimsRating: 4.8,
    awards: ["Best Auto Insurance 2024", "Digital Innovation Award 2023", "Customer Satisfaction Award 2023"],
    financialRating: "A+ (Superior)",
    offerings: [
      {
        id: 701,
        name: "Comprehensive Auto Insurance Plus",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 25000, currency: "KSH" },
        originalPrice: { amount: 30000, currency: "KSH" },
        category: "Auto Insurance",
        subcategory: "Comprehensive",
        description:
          "Full-coverage auto insurance with protection against accidents, theft, fire, and third-party liability. Includes roadside assistance, courtesy car, and personal accident benefits for comprehensive protection.",
        location: "Nationwide",
        isPopular: true,
        dateAdded: "2025-03-01T10:30:00Z",
        rating: 5.0,
        reviewCount: 48,
        features: [
          "Accident Coverage",
          "Theft Protection",
          "Third-Party Liability",
          "Roadside Assistance",
          "Courtesy Car",
          "No Claims Bonus",
        ],
        coverage: [
          "Own Damage",
          "Third-Party Liability",
          "Theft & Fire",
          "Windscreen",
          "Personal Accident",
          "Medical Expenses",
        ],
        coverageAmount: { amount: 3000000, currency: "KSH" },
        deductible: { amount: 10000, currency: "KSH" },
        policyTerm: "1 year (renewable)",
        policyType: "Comprehensive Auto",
        waitingPeriod: "None",
        exclusions: ["Driving under influence", "Unauthorized drivers", "Racing or speed testing"],
        renewalTerms: "Annual renewal with no-claims discount",
        claimsProcess: "Digital claims with 24-hour emergency assistance",
        tags: ["Auto Insurance", "Comprehensive Coverage", "Roadside Assistance", "Car Insurance"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        isTrending: true,
        vendorId: 7,
        contactNumber: "+254 778 901 234",
        website: "https://drivesecure.co.ke",
        address: "DriveSecure Tower, Upperhill, Nairobi",
        agent: "Michael Ochieng",
        agentPhone: "+254 778 901 235",
        agentEmail: "michael.ochieng@drivesecure.co.ke",
        insurer: "DriveSecure Auto Insurance",
        insurerRating: "A+ (Superior)",
        freeAddOns: ["Car Tracking System Discount", "Safe Driver Rewards"],
        paymentFrequencies: ["Monthly", "Quarterly", "Semi-Annually", "Annually"],
      },
      {
        id: 702,
        name: "Commercial Fleet Insurance",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 150000, currency: "KSH" },
        originalPrice: { amount: 180000, currency: "KSH" },
        category: "Auto Insurance",
        subcategory: "Fleet",
        description:
          "Specialized insurance for business vehicle fleets with flexible coverage options. Includes comprehensive vehicle protection, liability coverage, and risk management services tailored for fleet operators.",
        location: "Nationwide",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.8,
        reviewCount: 36,
        features: [
          "Multiple Vehicle Coverage",
          "Fleet Management Tools",
          "Driver Training Benefits",
          "Flexible Claims Processing",
          "Risk Management Services",
        ],
        coverage: [
          "Vehicle Damage",
          "Third-Party Liability",
          "Driver & Passenger Coverage",
          "Goods in Transit",
          "Business Interruption",
        ],
        coverageAmount: { amount: 10000000, currency: "KSH" },
        deductible: { amount: 25000, currency: "KSH" },
        policyTerm: "1 year (renewable)",
        policyType: "Commercial Fleet",
        waitingPeriod: "None",
        exclusions: ["Unauthorized drivers", "Vehicle used for illegal purposes", "Deliberate damage"],
        renewalTerms: "Annual renewal with fleet risk assessment",
        claimsProcess: "Dedicated fleet claims manager with priority processing",
        tags: ["Fleet Insurance", "Commercial Vehicles", "Business Auto", "Risk Management"],
        vendorId: 7,
        contactNumber: "+254 778 901 234",
        website: "https://drivesecure.co.ke",
        address: "DriveSecure Tower, Upperhill, Nairobi",
        agent: "Jane Muthoni",
        agentPhone: "+254 778 901 236",
        agentEmail: "jane.muthoni@drivesecure.co.ke",
        insurer: "DriveSecure Auto Insurance",
        insurerRating: "A+ (Superior)",
        freeAddOns: ["Fleet Risk Assessment", "Driver Safety Program", "Telematics Integration"],
        paymentFrequencies: ["Monthly", "Quarterly", "Semi-Annually", "Annually"],
      },
    ],
  },
  {
    id: 8,
    name: "MotorProtect Insurance",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Affordable and reliable auto insurance with focus on exceptional claims service and customer support.",
    redirectUrl: "https://motorprotect.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.7,
    reviewCount: 183,
    establishedYear: 2015,
    contactNumber: "+254 789 012 345",
    email: "info@motorprotect.co.ke",
    website: "https://motorprotect.co.ke",
    licensedInRegions: ["Nairobi", "Central", "Eastern", "Coast", "Rift Valley"],
    companySize: "Small (50-200 employees)",
    claimsRating: 4.9,
    awards: ["Claims Satisfaction Award 2024", "Value Insurance Provider 2023"],
    financialRating: "A (Excellent)",
    offerings: [
      {
        id: 801,
        name: "Third Party Plus Insurance",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 8000, currency: "KSH" },
        originalPrice: { amount: 10000, currency: "KSH" },
        category: "Auto Insurance",
        subcategory: "Third Party",
        description:
          "Enhanced third-party insurance that covers liability to others plus fire and theft protection for your own vehicle. Affordable option with essential coverage and add-on benefits.",
        location: "Nationwide",
        isPopular: true,
        dateAdded: "2025-02-25T10:30:00Z",
        rating: 4.8,
        reviewCount: 42,
        features: [
          "Third Party Liability",
          "Fire Protection",
          "Theft Coverage",
          "Windscreen Cover",
          "Basic Roadside Assistance",
        ],
        coverage: [
          "Third Party Bodily Injury",
          "Third Party Property Damage",
          "Fire & Theft of Own Vehicle",
          "Windscreen Damage",
        ],
        coverageAmount: { amount: 5000000, currency: "KSH" },
        deductible: { amount: 5000, currency: "KSH" },
        policyTerm: "1 year (renewable)",
        policyType: "Third Party Plus",
        waitingPeriod: "None",
        exclusions: ["Own vehicle accident damage", "Driving without valid license", "Mechanical breakdowns"],
        renewalTerms: "Simple renewal with minimal documentation",
        claimsProcess: "Streamlined claims for third-party incidents",
        tags: ["Third Party", "Affordable Insurance", "Fire & Theft", "Basic Coverage"],
        vendorId: 8,
        contactNumber: "+254 789 012 345",
        website: "https://motorprotect.co.ke",
        address: "MotorProtect House, Hurlingham, Nairobi",
        agent: "Patrick Wafula",
        agentPhone: "+254 789 012 346",
        agentEmail: "patrick.wafula@motorprotect.co.ke",
        insurer: "MotorProtect Insurance",
        insurerRating: "A (Excellent)",
        freeAddOns: ["Emergency Roadside Assistance", "Basic Towing Service"],
        paymentFrequencies: ["Monthly", "Quarterly", "Annually"],
      },
      {
        id: 802,
        name: "Motorcycle Insurance Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 5000, currency: "KSH" },
        originalPrice: { amount: 6500, currency: "KSH" },
        category: "Auto Insurance",
        subcategory: "Motorcycle",
        description:
          "Specialized insurance for motorcycles including comprehensive and third-party options. Coverage for accidents, theft, and rider personal accident benefits designed for both personal and commercial use.",
        location: "Nationwide",
        isNew: true,
        dateAdded: "2025-03-18T10:30:00Z",
        rating: 4.7,
        reviewCount: 28,
        features: [
          "Bike Damage Coverage",
          "Theft Protection",
          "Rider Personal Accident",
          "Third Party Liability",
          "Accessories Coverage",
        ],
        coverage: ["Motorcycle Damage", "Theft & Fire", "Rider Injury", "Third Party Liability", "Helmet & Gear"],
        coverageAmount: { amount: 500000, currency: "KSH" },
        deductible: { amount: 2500, currency: "KSH" },
        policyTerm: "1 year (renewable)",
        policyType: "Motorcycle",
        waitingPeriod: "None",
        exclusions: ["Racing or stunt riding", "Unlicensed riders", "Off-road use (unless specified)"],
        renewalTerms: "Annual renewal with bike condition assessment",
        claimsProcess: "Simplified process with motorcycle specialists",
        tags: ["Motorcycle Insurance", "Rider Protection", "Bike Coverage", "Personal Accident"],
        hotDealEnds: "2025-04-18T23:59:59Z",
        isHotDeal: true,
        isLimitedOffer: true,
        vendorId: 8,
        contactNumber: "+254 789 012 345",
        website: "https://motorprotect.co.ke",
        address: "MotorProtect House, Hurlingham, Nairobi",
        agent: "Esther Akinyi",
        agentPhone: "+254 789 012 347",
        agentEmail: "esther.akinyi@motorprotect.co.ke",
        insurer: "MotorProtect Insurance",
        insurerRating: "A (Excellent)",
        freeAddOns: ["Helmet Coverage", "Roadside Breakdown Assistance"],
        paymentFrequencies: ["Monthly", "Quarterly", "Annually"],
      },
    ],
  },

  // Business Insurance
  {
    id: 9,
    name: "BizShield Insurance Solutions",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Comprehensive business insurance solutions for enterprises of all sizes, from startups to corporations.",
    redirectUrl: "https://bizshield.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.6,
    reviewCount: 156,
    establishedYear: 2009,
    contactNumber: "+254 790 123 456",
    email: "info@bizshield.co.ke",
    website: "https://bizshield.co.ke",
    licensedInRegions: ["All Counties in Kenya"],
    companySize: "Medium (200-500 employees)",
    claimsRating: 4.5,
    awards: ["Business Insurance Provider 2023", "SME Insurance Award 2024"],
    financialRating: "A (Excellent)",
    offerings: [
      {
        id: 901,
        name: "Business Liability Insurance",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 35000, currency: "KSH" },
        originalPrice: { amount: 42000, currency: "KSH" },
        category: "Business Insurance",
        subcategory: "Liability",
        description:
          "Comprehensive liability protection for businesses against third-party claims for bodily injury, property damage, and legal expenses. Coverage tailored to your specific industry and business size.",
        location: "Nationwide",
        isPopular: true,
        dateAdded: "2025-03-02T10:30:00Z",
        rating: 4.7,
        reviewCount: 38,
        features: [
          "General Liability",
          "Product Liability",
          "Advertising Liability",
          "Legal Defense Costs",
          "Risk Management Support",
        ],
        coverage: ["Bodily Injury Claims", "Property Damage", "Personal Injury", "Advertising Injury", "Legal Defense"],
        coverageAmount: { amount: 20000000, currency: "KSH" },
        deductible: { amount: 25000, currency: "KSH" },
        policyTerm: "1 year (renewable)",
        policyType: "Business Liability",
        waitingPeriod: "None",
        exclusions: [
          "Intentional acts",
          "Professional services (covered under E&O)",
          "Employment practices (covered under EPLI)",
        ],
        renewalTerms: "Annual renewal with business risk reassessment",
        claimsProcess: "Dedicated business claims team with legal support",
        tags: ["Business Liability", "General Liability", "Legal Protection", "Risk Management"],
        vendorId: 9,
        contactNumber: "+254 790 123 456",
        website: "https://bizshield.co.ke",
        address: "BizShield House, Industrial Area, Nairobi",
        agent: "Robert Mutiso",
        agentPhone: "+254 790 123 457",
        agentEmail: "robert.mutiso@bizshield.co.ke",
        insurer: "BizShield Insurance Solutions",
        insurerRating: "A (Excellent)",
        freeAddOns: ["Risk Assessment", "Employee Training Resources"],
        paymentFrequencies: ["Monthly", "Quarterly", "Semi-Annually", "Annually"],
      },
      {
        id: 902,
        name: "Professional Indemnity Insurance",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 30000, currency: "KSH" },
        originalPrice: { amount: 35000, currency: "KSH" },
        category: "Business Insurance",
        subcategory: "Professional Indemnity",
        description:
          "Specialized coverage for professional service providers against claims of negligence, errors or omissions in professional services. Protects your business from legal costs and damages awards.",
        location: "Nationwide",
        isNew: true,
        dateAdded: "2025-03-20T10:30:00Z",
        rating: 4.5,
        reviewCount: 22,
        features: [
          "Professional Negligence Coverage",
          "Legal Defense Costs",
          "Damages & Settlements",
          "Breach of Confidentiality Protection",
          "Retroactive Coverage",
        ],
        coverage: [
          "Negligence Claims",
          "Errors & Omissions",
          "Breach of Professional Duty",
          "Unintentional Copyright Infringement",
          "Defamation",
        ],
        coverageAmount: { amount: 15000000, currency: "KSH" },
        deductible: { amount: 30000, currency: "KSH" },
        policyTerm: "1 year (renewable)",
        policyType: "Professional Indemnity",
        waitingPeriod: "None",
        exclusions: ["Intentional wrongdoing", "Fraudulent activities", "Criminal acts", "Prior known claims"],
        renewalTerms: "Annual renewal with practice assessment",
        claimsProcess: "Specialist claims handlers with legal expertise in professional liability",
        tags: ["Professional Indemnity", "Errors & Omissions", "Professional Liability", "Legal Protection"],
        hotDealEnds: "2025-04-20T23:59:59Z",
        isHotDeal: true,
        vendorId: 9,
        contactNumber: "+254 790 123 456",
        website: "https://bizshield.co.ke",
        address: "BizShield House, Industrial Area, Nairobi",
        agent: "Caroline Nduta",
        agentPhone: "+254 790 123 458",
        agentEmail: "caroline.nduta@bizshield.co.ke",
        insurer: "BizShield Insurance Solutions",
        insurerRating: "A (Excellent)",
        freeAddOns: ["Contract Review Service", "Professional Risk Assessment"],
        paymentFrequencies: ["Quarterly", "Semi-Annually", "Annually"],
      },
    ],
  },
  {
    id: 10,
    name: "SME Insurance Kenya",
    location: "Nairobi, Kenya",
    logo: "/placeholder.svg?height=60&width=60",
    description:
      "Dedicated insurance solutions for small and medium enterprises with flexible and tailored coverage options.",
    redirectUrl: "https://smeinsurance.co.ke",
    mapLink: "https://www.google.com/maps",
    defaultCurrency: "KSH",
    rating: 4.5,
    reviewCount: 142,
    verified:true,
    establishedYear: 2016,
    contactNumber: "+254 701 234 567",
    email: "info@smeinsurance.co.ke",
    website: "https://smeinsurance.co.ke",
    licensedInRegions: ["Nairobi", "Central", "Eastern", "Coast", "Western", "Rift Valley"],
    companySize: "Small (50-200 employees)",
    claimsRating: 4.4,
    awards: ["Best SME Insurer 2024", "Affordable Business Insurance Award 2023"],
    financialRating: "A- (Excellent)",
    offerings: [
      {
        id: 1001,
        name: "SME Complete Package",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 25000, currency: "KSH" },
        originalPrice: { amount: 30000, currency: "KSH" },
        category: "Business Insurance",
        subcategory: "Workers Compensation",
        description:
          "Comprehensive insurance bundle for small businesses covering property, liability, business interruption, and workers' compensation. Affordable protection with flexible coverage options tailored for SMEs.",
        location: "Nationwide",
        isPopular: true,
        dateAdded: "2025-02-28T10:30:00Z",
        rating: 4.6,
        reviewCount: 34,
        features: [
          "Property Coverage",
          "General Liability",
          "Business Interruption",
          "Workers' Compensation",
          "Cyber Liability",
        ],
        coverage: [
          "Business Property",
          "Liability Claims",
          "Income Protection",
          "Employee Injuries",
          "Cyber Incidents",
        ],
        coverageAmount: { amount: 10000000, currency: "KSH" },
        deductible: { amount: 15000, currency: "KSH" },
        policyTerm: "1 year (renewable)",
        policyType: "Business Package",
        waitingPeriod: "14 days for business interruption",
        exclusions: ["Intentional damages", "Pre-existing conditions", "Normal wear and tear"],
        renewalTerms: "Simplified renewal for small businesses",
        claimsProcess: "Single point of contact for all claims types",
        tags: ["SME Insurance", "Business Package", "Comprehensive Coverage", "Small Business"],
        vendorId: 10,
        contactNumber: "+254 701 234 567",
        website: "https://smeinsurance.co.ke",
        address: "SME House, Ngong Road, Nairobi",
        agent: "Samuel Nganga",
        agentPhone: "+254 701 234 568",
        agentEmail: "samuel.nganga@smeinsurance.co.ke",
        insurer: "SME Insurance Kenya",
        insurerRating: "A- (Excellent)",
        freeAddOns: ["Business Health Check", "Risk Management Guide", "Employee Safety Training"],
        paymentFrequencies: ["Monthly", "Quarterly", "Semi-Annually", "Annually"],
      },
      {
        id: 1002,
        name: "Cyber Liability Protection",
        imageUrl: "/placeholder.svg?height=300&width=400",
        images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        currentPrice: { amount: 15000, currency: "KSH" },
        originalPrice: { amount: 18000, currency: "KSH" },
        category: "Business Insurance",
        subcategory: "Cyber",
        description:
          "Protection against cyber threats, data breaches, and related business losses. Covers notification costs, legal expenses, ransomware payments, and business interruption due to cyber incidents.",
        location: "Nationwide",
        isNew: true,
        dateAdded: "2025-03-15T10:30:00Z",
        rating: 4.4,
        reviewCount: 26,
        features: [
          "Data Breach Coverage",
          "Ransomware Protection",
          "Cyber Business Interruption",
          "Third-Party Liability",
          "Incident Response Services",
        ],
        coverage: [
          "Data Breach Response",
          "Cyber Extortion",
          "Business Interruption",
          "Liability Claims",
          "Regulatory Defense",
        ],
        coverageAmount: { amount: 5000000, currency: "KSH" },
        deductible: { amount: 20000, currency: "KSH" },
        policyTerm: "1 year (renewable)",
        policyType: "Cyber Liability",
        waitingPeriod: "24 hours for business interruption",
        exclusions: ["Prior known incidents", "Intentional acts", "Infrastructure failure"],
        renewalTerms: "Annual renewal with cybersecurity assessment",
        claimsProcess: "24/7 incident response team with cybersecurity specialists",
        tags: ["Cyber Insurance", "Data Breach", "Ransomware", "Digital Protection"],
        hotDealEnds: "2025-04-15T23:59:59Z",
        isHotDeal: true,
        isLimitedOffer: false,
        vendorId: 10,
        contactNumber: "+254 701 234 567",
        website: "https://smeinsurance.co.ke",
        address: "SME House, Ngong Road, Nairobi",
        agent: "Michelle Auma",
        agentPhone: "+254 701 234 569",
        agentEmail: "michelle.auma@smeinsurance.co.ke",
        insurer: "SME Insurance Kenya",
        insurerRating: "A- (Excellent)",
        freeAddOns: ["Cybersecurity Training", "Risk Assessment", "Dark Web Monitoring"],
        paymentFrequencies: ["Quarterly", "Semi-Annually", "Annually"],
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

export default function InsurancePage() {
  useCookieTracking("insurance")

  // State for vendors and offerings
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors)
  const [newOfferingAlert, setNewOfferingAlert] = useState<InsuranceData | null>(null)
  const [swapTrigger, setSwapTrigger] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  // Custom color scheme for tourism
const insuranceColorScheme = {
  primary: "from-emerald-500 to-amber-700",
  secondary: "bg-orange-100",
  accent: "bg-amber-600",
  text: "text-purple-900",
  background: "bg-orange-50",
}

  // State for active category and subcategory
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [activeSubcategory, setActiveSubcategory] = useState<string>("")

  // State for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [sortOrder, setSortOrder] = useState("default")
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([])

  // State for offering detail modal
  const [selectedOffering, setSelectedOffering] = useState<InsuranceData | null>(null)

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
      colors: ["#0c4a6e", "#0284c7", "#0ea5e9"], // Deep blue, royal blue, sky blue
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
    <div className="bg-gradient-to-br from-blue-900 via-blue-600 to-sky-500 min-h-screen">
      {/* Decorative insurance-themed elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-950 to-sky-900 opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-sky-900 to-blue-950 opacity-20"></div>

      {/* Shield pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cGF0aCBkPSJNNDAgMjBMMjAgMzVWNTVMMzAgNjVMNDAgNzBMNTAgNjVMNjAgNTVWMzVMNDAgMjBaIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==')] opacity-10"></div>

      {/* IMPROVEMENT: Added max-width to container to prevent excessive stretching on ultra-wide screens */}
      <div className="container mx-auto px-4 py-12 max-w-[1920px] relative z-10">
        {/* Insurance header with professional accents */}
        <div className="text-center mb-10 bg-gradient-to-r from-blue-950/80 via-blue-800/80 to-sky-900/80 p-8 rounded-2xl shadow-2xl border border-blue-400/30 backdrop-blur-sm">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-blue-100">Insurance Services</h1>

          {/* Insurance icons */}
          <div className="flex justify-center mb-4 gap-4">
            <Shield className="h-8 w-8 text-sky-300" />
            <Umbrella className="h-8 w-8 text-blue-300" />
            <BadgeCheck className="h-8 w-8 text-sky-300" />
            <FileText className="h-8 w-8 text-blue-300" />
            <Users className="h-8 w-8 text-sky-300" />
          </div>

          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Discover premium insurance plans to protect what matters most to you
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
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-blue-300">
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 text-white mr-2" />
                    <h3 className="text-white font-bold">New Insurance Plan!</h3>
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
                    <p className="text-sm text-gray-600 mb-2">{newOfferingAlert.insurer}</p>
                    <div className="flex items-center">
                      <span className="text-blue-600 font-bold mr-2">{formatPrice(newOfferingAlert.currentPrice)}</span>
                      <Badge className="bg-blue-100 text-blue-800">New Policy</Badge>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white"
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
            title="Limited Time Insurance Offers"
            subtitle="Exclusive deals on premium insurance plans - secure your protection today!"
          />
        )}

{/* Calendar-based Recommendations */}
<CalendarBasedRecommendations 
  allProducts={vendors.flatMap(vendor => vendor.offerings)}
  title="Seasonal Insurance Recommendations"
  subtitle="Insurance products that match your current needs based on the calendar"
/>


        {/* New Products For You Section */}
        <NewProductsForYou allProducts={newProducts} colorScheme="blue" maxProducts={4} />


{/* Trending and Popular Section */}
<TrendingPopularSection
        trendingProducts={trendingProducts}
        popularProducts={popularProducts}
        colorScheme={insuranceColorScheme}
        title="Best Insurancerers today!"
        subtitle="Discover trending and most popular insurance options"
      />

        {/* Enhanced search section */}
        <div className="mb-10 bg-gradient-to-r from-blue-950/70 via-blue-800/70 to-blue-950/70 p-6 rounded-xl shadow-lg border border-blue-400/30 backdrop-blur-sm">
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Search for insurance plans, coverage types, insurers..."
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
                <Umbrella className="h-4 w-4" />
                <span>All Insurance</span>
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
        <div className="mt-6">
            <Link href="/insurance/shop">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Shield className="mr-2 h-4 w-4" />
                Browse Insurance Shop
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        
            {/* Premium range filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-white">
                Premium Range: {formatPrice({ amount: priceRange[0], currency: "KSH" })} -{" "}
                {formatPrice({ amount: priceRange[1], currency: "KSH" })}
              </h3>
              <div className="px-2 py-4">
                <Slider
                  defaultValue={[0, 100000]}
                  max={100000}
                  step={1000}
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
                  insurance plans found
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
                  <option value="price-asc">Premium: Low to High</option>
                  <option value="price-desc">Premium: High to Low</option>
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
            <div className="bg-gradient-to-r from-blue-950/70 via-blue-800/70 to-blue-950/70 p-8 text-center rounded-lg shadow-md border border-blue-400/30 backdrop-blur-sm">
              <p className="text-blue-100 text-lg">No insurance plans found matching your criteria.</p>
              <p className="text-blue-200 mt-2">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center bg-blue-900/80 p-6 rounded-full backdrop-blur-sm">
              <Loader2 className="h-10 w-10 animate-spin text-blue-300" />
              <p className="mt-2 text-blue-200 font-medium">Loading more insurance plans...</p>
            </div>
          </div>
        )}

        {/* Loader reference element */}
        <div ref={loaderRef} className="h-20"></div>
      </div>

      {/* Offering Detail Modal */}
      <Dialog open={!!selectedOffering} onOpenChange={() => setSelectedOffering(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-r from-blue-950/90 via-blue-800/90 to-blue-900/90 border border-blue-400/30 text-white backdrop-blur-sm">
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
                    {selectedOffering.insurerRating && (
                      <Badge className="bg-blue-600 text-white flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        <span>Rated {selectedOffering.insurerRating}</span>
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Offering details */}
                <div className="flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-blue-100 mb-2">{selectedOffering.name}</h3>
                    <div className="flex items-center text-blue-200 mb-2">
                      <Shield className="h-4 w-4 mr-2" />
                      <span>{selectedOffering.insurer}</span>
                    </div>
                    <p className="text-blue-100">{selectedOffering.description}</p>
                  </div>

                  {/* Policy details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {selectedOffering.policyType && (
                      <div className="flex items-center text-blue-200">
                        <FileText className="h-4 w-4 mr-2 text-blue-300" />
                        <span>Policy Type: {selectedOffering.policyType}</span>
                      </div>
                    )}
                    {selectedOffering.policyTerm && (
                      <div className="flex items-center text-blue-200">
                        <CalendarRange className="h-4 w-4 mr-2 text-blue-300" />
                        <span>Term: {selectedOffering.policyTerm}</span>
                      </div>
                    )}
                    {selectedOffering.coverageAmount && (
                      <div className="flex items-center text-blue-200">
                        <Shield className="h-4 w-4 mr-2 text-blue-300" />
                        <span>Coverage: {formatPrice(selectedOffering.coverageAmount)}</span>
                      </div>
                    )}
                    {selectedOffering.deductible && (
                      <div className="flex items-center text-blue-200">
                        <CircleDollarSign className="h-4 w-4 mr-2 text-blue-300" />
                        <span>Deductible: {formatPrice(selectedOffering.deductible)}</span>
                      </div>
                    )}
                    {selectedOffering.waitingPeriod && (
                      <div className="flex items-center text-blue-200">
                        <Clock className="h-4 w-4 mr-2 text-blue-300" />
                        <span>Waiting Period: {selectedOffering.waitingPeriod}</span>
                      </div>
                    )}
                    {selectedOffering.applicableAges && (
                      <div className="flex items-center text-blue-200">
                        <Users className="h-4 w-4 mr-2 text-blue-300" />
                        <span>
                          Age: {selectedOffering.applicableAges.min}-{selectedOffering.applicableAges.max} years
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Coverage */}
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-blue-100 mb-2">What's Covered</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedOffering.coverage?.map((item, index) => (
                        <li key={index} className="flex items-center text-blue-200">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exclusions */}
                  {selectedOffering.exclusions && selectedOffering.exclusions.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-blue-100 mb-2">Exclusions</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedOffering.exclusions.map((item, index) => (
                          <li key={index} className="flex items-center text-blue-200">
                            <XCircle className="h-4 w-4 mr-2 text-red-400 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Features */}
                  {selectedOffering.features && selectedOffering.features.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-blue-100 mb-2">Key Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedOffering.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-blue-500 text-blue-200">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Free add-ons */}
                  {selectedOffering.freeAddOns && selectedOffering.freeAddOns.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-blue-100 mb-2">Free Add-Ons</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedOffering.freeAddOns.map((addon, index) => (
                          <Badge key={index} className="bg-blue-700 text-blue-100">
                            <Plus className="h-3 w-3 mr-1" />
                            {addon}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment frequencies */}
                  {selectedOffering.paymentFrequencies && selectedOffering.paymentFrequencies.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-blue-100 mb-2">Payment Options</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedOffering.paymentFrequencies.map((frequency, index) => (
                          <Badge key={index} variant="outline" className="border-blue-500 text-blue-200">
                            <Banknote className="h-3 w-3 mr-1" />
                            {frequency}
                          </Badge>
                        ))}
                      </div>
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
                        <div className="text-sm text-blue-200 mt-1">
                          Premium per {selectedOffering.paymentFrequencies?.[0]?.toLowerCase() || "month"}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-blue-200 mb-1">Claims Process:</div>
                        <div className="font-medium text-blue-100">{selectedOffering.claimsProcess}</div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {selectedOffering.originalPrice.amount !== selectedOffering.currentPrice.amount && (
                        <Button
                          variant="outline"
                          className="border-blue-500 text-blue-200 hover:bg-blue-800/50 flex-1 flex items-center justify-center gap-2"
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

                      <Button className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white flex-1 flex items-center justify-center gap-2">
                        <FileCheck className="h-4 w-4" />
                        <span>Get a Quote</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agent information */}
              {(selectedOffering.agent || selectedOffering.agentPhone || selectedOffering.agentEmail) && (
                <div className="mt-6 pt-4 border-t border-blue-700">
                  <h3 className="text-lg font-medium text-blue-100 mb-2">Agent Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {selectedOffering.agent && (
                      <div className="flex items-center text-blue-200">
                        <User className="h-4 w-4 mr-2 text-blue-300" />
                        <span>{selectedOffering.agent}</span>
                      </div>
                    )}
                    {selectedOffering.agentPhone && (
                      <div className="flex items-center text-blue-200">
                        <Phone className="h-4 w-4 mr-2 text-blue-300" />
                        <span>{selectedOffering.agentPhone}</span>
                      </div>
                    )}
                    {selectedOffering.agentEmail && (
                      <div className="flex items-center text-blue-200">
                        <Mail className="h-4 w-4 mr-2 text-blue-300" />
                        <span>{selectedOffering.agentEmail}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact information */}
              <div className="mt-6 pt-4 border-t border-blue-700">
                <h3 className="text-lg font-medium text-blue-100 mb-2">Insurer Information</h3>
                <div className="flex flex-col gap-2 text-sm text-blue-200">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-blue-300" />
                    <span>{selectedOffering.insurer}</span>
                  </div>
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
    </div>
  )
}

// Vendor Section Component
function VendorSection({
  vendor,
  activeCategory,
  activeSubcategory,
  onOfferingClick,
  isExpanded,
  onToggle,
}: {
  vendor: Vendor
  activeCategory: string
  activeSubcategory: string
  onOfferingClick: (offering: InsuranceData) => void
  isExpanded: boolean
  onToggle: () => void
}) {
  const [imageError, setImageError] = useState(false)

  // Filter offerings based on active filters
  const filteredOfferings = vendor.offerings.filter(
    (offering) =>
      (!activeCategory || offering.category.toLowerCase() === activeCategory.toLowerCase()) &&
      (!activeSubcategory || offering.subcategory.toLowerCase() === activeSubcategory.toLowerCase()),
  )

  if (filteredOfferings.length === 0) return null

  return (
    <div className="bg-gradient-to-r from-blue-950/70 via-blue-800/70 to-blue-900/70 rounded-xl shadow-lg overflow-hidden border border-blue-400/30 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <Image
                src={imageError ? "/placeholder.svg?height=60&width=60" : vendor.logo}
                alt={vendor.name}
                width={60}
                height={60}
                className="rounded-full border-2 border-blue-300 shadow-md"
                onError={() => setImageError(true)}
              />
               {vendor.verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-blue-100">{vendor.name}</h3>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-blue-300 mr-1" />
                <p className="text-blue-200 text-sm mr-2">{vendor.location}</p>
                {vendor.rating && (
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(vendor.rating || 0) ? "text-blue-300 fill-blue-300" : "text-blue-800"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-blue-200">
                      {vendor.rating.toFixed(1)} ({vendor.reviewCount})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-blue-200 hidden md:block">
              {vendor.establishedYear && (
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="h-3 w-3" />
                  <span>Est. {vendor.establishedYear}</span>
                </div>
              )}
              {vendor.contactNumber && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{vendor.contactNumber}</span>
                </div>
              )}
            </div>
            <a
              href={vendor.redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap"
            >
              Visit Website
            </a>
          </div>
        </div>
        <p className="text-blue-100 mb-4 line-clamp-2">{vendor.description}</p>

        {/* Financial rating */}
        {vendor.financialRating && (
          <div className="mb-4">
            <Badge className="bg-blue-700 text-blue-100">
              <Award className="h-3 w-3 mr-1" />
              Financial Strength: {vendor.financialRating}
            </Badge>
          </div>
        )}

        {/* Awards */}
        {vendor.awards && vendor.awards.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {vendor.awards.map((award, index) => (
                <Badge key={index} variant="outline" className="text-xs border-blue-500 text-blue-200">
                  <Award className="h-3 w-3 mr-1" />
                  {award}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Accordion control */}
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full mt-2 text-sm font-medium text-blue-200 hover:text-blue-100"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              <span>Show Less</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              <span>Show More</span>
            </>
          )}
        </button>
      </div>

      {/* Offerings grid */}
      <div
        className={`p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-all duration-300 ${
          isExpanded ? "max-h-[2000px]" : "max-h-[400px] overflow-hidden"
        }`}
      >
        {filteredOfferings.map((offering) => (
          <OfferingCard key={offering.id} offering={offering} onClick={() => onOfferingClick(offering)} />
        ))}
      </div>
    </div>
  )
}

// Offering Card Component
function OfferingCard({ offering, onClick }: { offering: InsuranceData; onClick: () => void }) {
  const [imageError, setImageError] = useState(false)

  // Calculate discount percentage
  const discountPercentage = Math.round(
    ((offering.originalPrice.amount - offering.currentPrice.amount) / offering.originalPrice.amount) * 100,
  )

  return (
    <motion.div
      className="bg-gradient-to-r from-blue-900/80 to-blue-800/80 rounded-lg shadow-sm overflow-hidden flex flex-col h-full border border-blue-500/30 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 backdrop-blur-sm"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="relative">
        <div className="relative pt-[75%]">
          <Image
            src={imageError ? "/placeholder.svg?height=300&width=400" : offering.imageUrl}
            alt={offering.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 hover:scale-110"
            onError={() => setImageError(true)}
          />
        </div>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {discountPercentage >= 10 && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md">
              {discountPercentage}% OFF
            </div>
          )}

          {offering.isNew && (
            <div className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              <span>NEW</span>
            </div>
          )}

          {offering.isTrending && (
            <div className="bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md flex items-center">
              <Flame className="h-3 w-3 mr-1" />
              <span>TRENDING</span>
            </div>
          )}
        </div>

        {/* Most preferred badge */}
        {offering.isPopular && (
          <div className="absolute top-2 left-2">
            <MostPreferredBadge colorScheme="blue" size="sm" />
          </div>
        )}

        {/* Limited offer badge */}
        {offering.isLimitedOffer && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-red-500 text-white flex items-center gap-1 px-2 py-1 text-xs font-medium">
              <Clock className="h-3 w-3" />
              Limited Offer
            </Badge>
          </div>
        )}

        {/* New this week badge */}
        {isNewThisWeek(offering.dateAdded) && !offering.isNew && (
          <div className="absolute bottom-2 left-2">
            <NewThisWeekBadge />
          </div>
        )}
      </div>

      <div className="p-3 flex-grow flex flex-col">
        <div className="mb-1 flex items-center">
          <Badge variant="outline" className="text-xs border-blue-500 text-blue-200">
            {offering.subcategory}
          </Badge>
        </div>

        <h4 className="font-semibold text-blue-100 mb-1 line-clamp-1">{offering.name}</h4>

        <div className="flex items-center text-xs text-blue-200 mb-1">
          <Shield className="h-3 w-3 mr-1 text-blue-300" />
          {offering.insurer}
        </div>

        <p className="text-xs text-blue-200 mb-2 line-clamp-2 flex-grow">{offering.description}</p>

        {/* Coverage details */}
        <div className="flex flex-wrap gap-2 mb-2">
          {offering.coverageAmount && (
            <div className="flex items-center text-xs text-blue-200">
              <Shield className="h-3 w-3 mr-1 text-blue-300" />
              <span>Up to {formatPrice(offering.coverageAmount)}</span>
            </div>
          )}
          {offering.policyTerm && (
            <div className="flex items-center text-xs text-blue-200">
              <CalendarRange className="h-3 w-3 mr-1 text-blue-300" />
              <span>{offering.policyTerm}</span>
            </div>
          )}
        </div>

        {/* Rating */}
        {offering.rating && (
          <div className="flex items-center mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(offering.rating || 0) ? "text-blue-300 fill-blue-300" : "text-blue-800"
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-blue-200">
              {offering.rating.toFixed(1)} ({offering.reviewCount})
            </span>
          </div>
        )}

        {/* Features */}
        {offering.features && offering.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {offering.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-[10px] border-blue-700 text-blue-300">
                {feature}
              </Badge>
            ))}
            {offering.features.length > 3 && (
              <Badge variant="outline" className="text-[10px] border-blue-700 text-blue-300">
                +{offering.features.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <div className="text-base font-bold text-blue-100">{formatPrice(offering.currentPrice)}</div>
            <div className="text-xs text-blue-300 line-through">{formatPrice(offering.originalPrice)}</div>
          </div>

          <div className="flex gap-1">
            <motion.button
              className="bg-blue-800 text-blue-200 px-2 py-1.5 rounded-md text-xs font-medium flex items-center border border-blue-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                // Save functionality would go here
              }}
            >
              <Percent className="h-3 w-3 mr-1" />
              <span>Save {discountPercentage}%</span>
            </motion.button>

            <motion.button
              className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-2 py-1.5 rounded-md text-xs font-medium flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                // Get quote functionality would go here
              }}
            >
              <FileCheck className="h-3 w-3 mr-1" />
              <span>Quote</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

