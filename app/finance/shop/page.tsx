"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Wallet,
  CreditCard,
  LineChart,
  Building,
  Search,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  ArrowLeft,
  Heart,
  X,
  Flame,
  DollarSign,
  Landmark,
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

interface FinanceProvider {
  id: string
  name: string
  logo: string
  category: "banking" | "investment" | "loans" | "cards"
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
  products: FinancialProduct[]
  amenities: string[]
  images: string[]
}

interface FinancialProduct {
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

// Mock data for finance providers
const financeProviders: FinanceProvider[] = [
  // Banking Providers
  {
    id: "digital-bank",
    name: "Digital Bank",
    logo: "/placeholder.svg?height=80&width=80",
    category: "banking",
    description:
      "Modern digital banking with innovative features, competitive rates, and a seamless mobile experience.",
    rating: 4.8,
    reviewCount: 324,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 712 345 678",
      email: "support@digitalbank.co.ke",
      website: "www.digitalbank.co.ke",
    },
    openingHours: "24/7 Digital Services, Physical Branches: Mon-Fri: 8:00 AM - 4:00 PM",
    amenities: ["Mobile Banking", "Free Transfers", "Cardless ATM", "Financial Tools", "Budgeting Features"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "digital-checking",
        name: "Digital Checking Account",
        description:
          "Fee-free checking account with no minimum balance, free transfers, and advanced digital features.",
        price: { amount: 0, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Accounts",
        tags: ["No Fees", "Digital", "Checking"],
      },
      {
        id: "high-yield-savings",
        name: "High-Yield Savings Account",
        description: "Savings account with competitive interest rates, no fees, and flexible access to your money.",
        price: { amount: 0, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Accounts",
        tags: ["Savings", "High Interest", "No Fees"],
      },
      {
        id: "joint-account",
        name: "Joint Digital Account",
        description: "Shared account for couples or business partners with individual permissions and tracking.",
        price: { amount: 0, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Accounts",
        tags: ["Joint", "Shared", "Tracking"],
      },
      {
        id: "business-account",
        name: "Business Banking Suite",
        description: "Comprehensive business banking solution with invoicing, payroll, and financial management tools.",
        price: { amount: 1000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Business",
        tags: ["Business", "Invoicing", "Payroll"],
      },
    ],
  },
  {
    id: "traditional-bank",
    name: "Traditional Bank",
    logo: "/placeholder.svg?height=80&width=80",
    category: "banking",
    description:
      "Established bank with a wide branch network, personalized service, and comprehensive financial solutions.",
    rating: 4.6,
    reviewCount: 412,
    location: "Multiple locations, Kenya",
    contact: {
      phone: "+254 723 456 789",
      email: "customercare@traditionalbank.co.ke",
      website: "www.traditionalbank.co.ke",
    },
    openingHours: "Mon-Fri: 8:30 AM - 4:00 PM, Sat: 9:00 AM - 12:00 PM",
    amenities: ["Branch Network", "Safe Deposit Boxes", "Wealth Management", "Personal Bankers", "ATM Network"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "premium-checking",
        name: "Premium Checking Account",
        description:
          "Full-service checking account with personalized service, preferential rates, and exclusive benefits.",
        price: { amount: 500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Accounts",
        tags: ["Premium", "Personalized", "Benefits"],
      },
      {
        id: "fixed-deposit",
        name: "Fixed Deposit Account",
        description: "Term deposit with guaranteed returns, flexible tenures, and competitive interest rates.",
        price: { amount: 10000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Savings",
        tags: ["Fixed", "Guaranteed", "Interest"],
      },
      {
        id: "junior-saver",
        name: "Junior Saver Account",
        description: "Savings account for children with educational benefits, no fees, and parental controls.",
        price: { amount: 0, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Youth",
        tags: ["Children", "Education", "Savings"],
      },
      {
        id: "retirement-account",
        name: "Retirement Planning Account",
        description: "Long-term savings account with tax benefits designed specifically for retirement planning.",
        price: { amount: 0, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Retirement",
        tags: ["Retirement", "Long-term", "Tax Benefits"],
      },
    ],
  },

  // Investment Providers
  {
    id: "wealth-capital",
    name: "Wealth Capital",
    logo: "/placeholder.svg?height=80&width=80",
    category: "investment",
    description:
      "Investment firm offering diverse portfolio options, expert advisory, and innovative investment tools.",
    rating: 4.9,
    reviewCount: 189,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 734 567 890",
      email: "invest@wealthcapital.co.ke",
      website: "www.wealthcapital.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 5:00 PM",
    amenities: [
      "Investment Advisory",
      "Portfolio Management",
      "Research Tools",
      "Retirement Planning",
      "Tax Optimization",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "managed-portfolio",
        name: "Managed Investment Portfolio",
        description: "Professionally managed investment portfolio tailored to your risk tolerance and financial goals.",
        price: { amount: 100000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Managed Investments",
        tags: ["Managed", "Tailored", "Professional"],
      },
      {
        id: "index-fund",
        name: "Index Fund Investment",
        description: "Low-cost investment in market indices with broad diversification and minimal fees.",
        price: { amount: 25000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Funds",
        tags: ["Index", "Low-cost", "Diversified"],
      },
      {
        id: "esg-portfolio",
        name: "ESG Responsible Investment",
        description: "Investment portfolio focused on environmental, social, and governance responsible companies.",
        price: { amount: 50000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Specialized Investments",
        tags: ["ESG", "Responsible", "Sustainable"],
      },
      {
        id: "real-estate-fund",
        name: "Real Estate Investment Fund",
        description: "Diversified investment in commercial and residential real estate properties and developments.",
        price: { amount: 250000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Real Estate",
        tags: ["Real Estate", "Property", "Development"],
      },
    ],
  },
  {
    id: "robo-invest",
    name: "Robo Invest",
    logo: "/placeholder.svg?height=80&width=80",
    category: "investment",
    description:
      "Automated investment platform using algorithms to create and manage diversified portfolios at low cost.",
    rating: 4.7,
    reviewCount: 156,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 745 678 901",
      email: "help@roboinvest.co.ke",
      website: "www.roboinvest.co.ke",
    },
    openingHours: "24/7 Digital Platform, Support: Mon-Fri: 8:00 AM - 6:00 PM",
    amenities: ["Automated Investing", "Low Fees", "Portfolio Rebalancing", "Goal Setting", "Financial Education"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "robo-basic",
        name: "Robo Basic Portfolio",
        description: "Entry-level automated investment portfolio with diversified ETFs and automatic rebalancing.",
        price: { amount: 5000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Automated Investing",
        tags: ["Automated", "Low Cost", "Diversified"],
      },
      {
        id: "robo-growth",
        name: "Robo Growth Portfolio",
        description: "Growth-focused automated portfolio with higher equity allocation for long-term investors.",
        price: { amount: 10000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Automated Investing",
        tags: ["Growth", "Long-term", "Equity"],
      },
      {
        id: "robo-income",
        name: "Robo Income Portfolio",
        description: "Income-generating automated portfolio focusing on dividend stocks and bonds.",
        price: { amount: 15000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Automated Investing",
        tags: ["Income", "Dividends", "Bonds"],
      },
      {
        id: "robo-retirement",
        name: "Robo Retirement Portfolio",
        description: "Retirement-focused automated portfolio with age-based asset allocation and tax optimization.",
        price: { amount: 20000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Retirement",
        tags: ["Retirement", "Age-based", "Tax Optimized"],
      },
    ],
  },

  // Loan Providers
  {
    id: "quick-loans",
    name: "Quick Loans",
    logo: "/placeholder.svg?height=80&width=80",
    category: "loans",
    description:
      "Fast and convenient loan solutions with digital application process, quick approvals, and flexible terms.",
    rating: 4.7,
    reviewCount: 278,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 756 789 012",
      email: "apply@quickloans.co.ke",
      website: "www.quickloans.co.ke",
    },
    openingHours: "24/7 Digital Platform, Support: Mon-Fri: 8:00 AM - 8:00 PM, Sat: 9:00 AM - 2:00 PM",
    amenities: [
      "Fast Approval",
      "Digital Application",
      "No Collateral Options",
      "Flexible Repayment",
      "Early Repayment",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "personal-loan",
        name: "Personal Loan",
        description: "Unsecured personal loan for various needs with competitive rates and flexible repayment terms.",
        price: { amount: 50000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Personal Loans",
        tags: ["Unsecured", "Flexible", "Quick"],
      },
      {
        id: "emergency-loan",
        name: "Emergency Loan",
        description: "Rapid approval loan for urgent needs with same-day disbursement and simplified application.",
        price: { amount: 20000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Emergency Financing",
        tags: ["Emergency", "Same-day", "Rapid"],
      },
      {
        id: "education-loan",
        name: "Education Loan",
        description: "Specialized loan for educational expenses with favorable terms and deferred repayment options.",
        price: { amount: 100000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Education Financing",
        tags: ["Education", "Deferred", "Student"],
      },
      {
        id: "business-loan",
        name: "Small Business Loan",
        description: "Financing solution for small businesses with flexible terms and business-friendly features.",
        price: { amount: 500000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Business Financing",
        tags: ["Business", "SME", "Growth"],
      },
    ],
  },
  {
    id: "home-finance",
    name: "Home Finance",
    logo: "/placeholder.svg?height=80&width=80",
    category: "loans",
    description:
      "Specialized mortgage and home financing solutions with competitive rates, expert guidance, and flexible options.",
    rating: 4.8,
    reviewCount: 195,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 767 890 123",
      email: "mortgages@homefinance.co.ke",
      website: "www.homefinance.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM",
    amenities: [
      "Mortgage Specialists",
      "Property Valuation",
      "Legal Assistance",
      "Construction Financing",
      "Refinancing",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "home-mortgage",
        name: "Home Purchase Mortgage",
        description: "Comprehensive mortgage solution for home buyers with competitive rates and flexible terms.",
        price: { amount: 5000000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Mortgages",
        tags: ["Home Purchase", "Long-term", "Competitive"],
      },
      {
        id: "construction-loan",
        name: "Home Construction Loan",
        description: "Specialized loan for building your own home with phased disbursement and flexible structure.",
        price: { amount: 7000000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Construction Financing",
        tags: ["Construction", "Phased", "Building"],
      },
      {
        id: "refinance-mortgage",
        name: "Mortgage Refinancing",
        description: "Refinance your existing mortgage to secure better rates or access equity in your home.",
        price: { amount: 4000000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Refinancing",
        tags: ["Refinance", "Better Rates", "Equity"],
      },
      {
        id: "land-purchase",
        name: "Land Purchase Loan",
        description: "Financing solution for purchasing land with favorable terms and future construction options.",
        price: { amount: 2000000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Land Financing",
        tags: ["Land", "Purchase", "Development"],
      },
    ],
  },

  // Card Providers
  {
    id: "premium-cards",
    name: "Premium Cards",
    logo: "/placeholder.svg?height=80&width=80",
    category: "cards",
    description:
      "Premium credit and debit card provider offering exclusive benefits, rewards programs, and global acceptance.",
    rating: 4.9,
    reviewCount: 312,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 778 901 234",
      email: "cards@premiumcards.co.ke",
      website: "www.premiumcards.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 1:00 PM",
    amenities: ["Rewards Program", "Travel Benefits", "Concierge Service", "Purchase Protection", "Airport Lounges"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "platinum-card",
        name: "Platinum Credit Card",
        description: "Premium credit card with extensive benefits, high limits, and exclusive rewards program.",
        price: { amount: 15000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Credit Cards",
        tags: ["Premium", "Rewards", "Benefits"],
      },
      {
        id: "travel-card",
        name: "Travel Rewards Card",
        description: "Credit card optimized for travelers with no foreign transaction fees and travel benefits.",
        price: { amount: 10000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Travel Cards",
        tags: ["Travel", "No Fees", "Rewards"],
      },
      {
        id: "business-card",
        name: "Business Credit Card",
        description: "Specialized credit card for businesses with expense management tools and business rewards.",
        price: { amount: 12000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Business Cards",
        tags: ["Business", "Expenses", "Management"],
      },
      {
        id: "secured-card",
        name: "Secured Credit Card",
        description: "Credit-building card secured by a deposit, ideal for establishing or rebuilding credit history.",
        price: { amount: 5000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Secured Cards",
        tags: ["Secured", "Credit Building", "Accessible"],
      },
    ],
  },
  {
    id: "digital-wallet",
    name: "Digital Wallet",
    logo: "/placeholder.svg?height=80&width=80",
    category: "cards",
    description:
      "Modern digital payment solutions with virtual cards, mobile wallet, and innovative payment technologies.",
    rating: 4.7,
    reviewCount: 267,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 789 012 345",
      email: "support@digitalwallet.co.ke",
      website: "www.digitalwallet.co.ke",
    },
    openingHours: "24/7 Digital Services, Support: Mon-Fri: 8:00 AM - 8:00 PM",
    amenities: ["Mobile Payments", "Virtual Cards", "Contactless", "Money Transfer", "Bill Payments"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "virtual-debit",
        name: "Virtual Debit Card",
        description: "Digital-only debit card for secure online purchases and subscription management.",
        price: { amount: 0, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Virtual Cards",
        tags: ["Virtual", "Secure", "Online"],
      },
      {
        id: "multi-currency",
        name: "Multi-Currency Card",
        description: "Digital card supporting multiple currencies with competitive exchange rates and no foreign fees.",
        price: { amount: 2000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Currency Cards",
        tags: ["Multi-currency", "Exchange", "Travel"],
      },
      {
        id: "teen-card",
        name: "Teen Debit Card",
        description: "Controlled payment card for teenagers with parental oversight and financial education tools.",
        price: { amount: 500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Youth Cards",
        tags: ["Teen", "Parental", "Education"],
      },
      {
        id: "rewards-debit",
        name: "Rewards Debit Card",
        description: "Debit card with cashback and rewards on everyday purchases without credit requirements.",
        price: { amount: 1000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Rewards Cards",
        tags: ["Rewards", "Cashback", "Debit"],
      },
    ],
  },
]

export default function FinanceShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<FinanceProvider | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<FinancialProduct | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter providers based on active category and search query
  const filteredProviders = financeProviders.filter((provider) => {
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
        provider.products.some(
          (product) => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
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
  const handleProviderClick = (provider: FinanceProvider) => {
    setSelectedProvider(provider)
  }

  // Handle product click
  const handleProductClick = (product: FinancialProduct) => {
    setSelectedProduct(product)
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "banking":
        return <Building className="h-6 w-6" />
      case "investment":
        return <LineChart className="h-6 w-6" />
      case "loans":
        return <Wallet className="h-6 w-6" />
      case "cards":
        return <CreditCard className="h-6 w-6" />
      default:
        return <DollarSign className="h-6 w-6" />
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "banking":
        return "from-green-500 to-emerald-500"
      case "investment":
        return "from-blue-500 to-indigo-500"
      case "loans":
        return "from-amber-500 to-orange-500"
      case "cards":
        return "from-purple-500 to-pink-500"
      default:
        return "from-green-500 to-emerald-500"
    }
  }

  // Get category background color
  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case "banking":
        return "bg-green-100 text-green-800 border-green-200"
      case "investment":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "loans":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "cards":
        return "bg-purple-100 text-purple-800 border-purple-200"
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
          { id: "all", name: "All Finance", icon: <DollarSign className="h-5 w-5" /> },
          { id: "banking", name: "Banking", icon: <Building className="h-5 w-5" /> },
          { id: "investment", name: "Investment", icon: <LineChart className="h-5 w-5" /> },
          { id: "loans", name: "Loans", icon: <Wallet className="h-5 w-5" /> },
          { id: "cards", name: "Cards", icon: <CreditCard className="h-5 w-5" /> },
        ].map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              activeCategory === category.id
                ? `bg-gradient-to-r ${
                    category.id === "all"
                      ? "from-green-500 to-emerald-500"
                      : category.id === "banking"
                        ? "from-green-500 to-emerald-500"
                        : category.id === "investment"
                          ? "from-blue-500 to-indigo-500"
                          : category.id === "loans"
                            ? "from-amber-500 to-orange-500"
                            : "from-purple-500 to-pink-500"
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 py-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-300 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-300 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/finance" className="flex items-center text-white mb-4 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Finance
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Finance Shop</h1>
              <p className="text-green-100 max-w-2xl">
                Discover comprehensive financial solutions including banking, investments, loans, and payment cards from
                trusted providers.
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
                  <Landmark className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Financial Solutions</p>
                  <p className="text-sm">Secure Your Future</p>
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
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-200"></div>
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search for financial services, providers, or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 rounded-full border-transparent bg-white dark:bg-slate-800 text-gray-800 dark:text-white placeholder:text-gray-400 focus:ring-green-500 focus:border-transparent w-full shadow-lg"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500">
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
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
            <div className="bg-green-100 dark:bg-green-900/30 p-8 rounded-lg inline-block mb-4">
              <Search className="h-12 w-12 text-green-500 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any financial services matching your criteria. Try adjusting your search or browse a
              different category.
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white"
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
                        <Phone className="h-4 w-4 mr-2 text-green-500" />
                        {selectedProvider.contact.phone}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Mail className="h-4 w-4 mr-2 text-green-500" />
                        {selectedProvider.contact.email}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Globe className="h-4 w-4 mr-2 text-green-500" />
                        <a
                          href={`https://${selectedProvider.contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 hover:underline"
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
                        <MapPin className="h-4 w-4 mr-2 text-green-500" />
                        {selectedProvider.location}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-green-500" />
                        {selectedProvider.openingHours}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProvider.amenities.map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-xl">Financial Products</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedProvider.products.map((product) => (
                      <Card
                        key={product.id}
                        className="overflow-hidden border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => handleProductClick(product)}
                      >
                        <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            layout="fill"
                            objectFit="cover"
                          />
                          <div className="absolute top-2 right-2 flex flex-col gap-1">
                            {product.isNew && <Badge className="bg-blue-500 text-white">New</Badge>}
                            {product.isPopular && (
                              <Badge className="bg-amber-500 text-white flex items-center gap-1">
                                <Flame className="h-3 w-3" />
                                <span>Popular</span>
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{product.name}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                            >
                              {product.category}
                            </Badge>
                            <span className="font-bold text-green-600 dark:text-green-400">
                              {formatPrice(product.price)}
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

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {selectedProduct.name}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative h-60 md:h-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <Image
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {selectedProduct.isNew && <Badge className="bg-blue-500 text-white">New</Badge>}
                    {selectedProduct.isPopular && (
                      <Badge className="bg-amber-500 text-white flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        <span>Popular</span>
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">{selectedProduct.description}</p>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    >
                      {selectedProduct.category}
                    </Badge>
                    <span className="font-bold text-2xl text-green-600 dark:text-green-400">
                      {formatPrice(selectedProduct.price)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white">
                      Apply Now
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

