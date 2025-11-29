"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useInView } from "react-intersection-observer"
import {
  Search,
  Filter,
  X,
  Star,
  ChevronDown,
  DollarSign,
  TrendingUp,
  Percent,
  Shield,
  Clock,
  ChevronRight,
  Bell,
  CreditCard,
  Wallet,
  Building,
  Briefcase,
  PiggyBank,
  BarChart4,
  BadgePercent,
  Quote,
  Lightbulb,
  RefreshCw,
  ArrowRight,
  LineChart,
  ShieldIcon,
  PiggyBankIcon,
  TrendingUpIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription ,CardFooter , CardHeader , CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs,TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import CountdownTimer from "@/components/CountdownTimer"
import { useCookieTracking } from "@/hooks/useCookieTracking"
import { swapArrayElementsRandomly, swapVendorsWithinCategory } from "@/utils/swap-utils"
import { isNewThisWeek } from "@/utils/date-utils"
import NewThisWeekBadge from "@/components/NewThisWeekBadge"
import confetti from "canvas-confetti"
import FinancialHotDeals from "@/components/FinancialHotDeals"
import Link from "next/link"
import TrendingPopularSection from "@/components/TrendingPopularSection"
import { trendingProducts, popularProducts } from "./trending-data"
import FinanceRecommendations from "@/components/recommendations/finance-recommendations"
import CalendarBasedRecommendations from "@/components/recommendations/calendar-based-recommendations"





// Types
interface FinancialProduct {
  id: string
  name: string
  institution: string
  imageUrl: string
  category: string
  subcategory: string
  currentRate: number
  originalRate: number
  description: string
  features: string[]
  requirements: string[]
  minAmount: number
  maxAmount: number
  term: string
  isNew: boolean
  isTrending: boolean
  isMostPreferred: boolean
  isLimitedTime: boolean
  expiresAt?: string
  discount?: number
}

// Mock data for financial products
const mockFinancialProducts: FinancialProduct[] = [
  // Personal Loans
  {
    id: "pl-001",
    name: "Quick Cash Advance",
    institution: "GreenBank",
    imageUrl: "/placeholder.svg?height=300&width=400",
    category: "Personal Loans",
    subcategory: "Short Term",
    currentRate: 12.5,
    originalRate: 15,
    description:
      "Get instant cash for emergencies with our low-interest quick cash advance. Approval within 24 hours and flexible repayment options.",
    features: [
      "Instant approval",
      "No collateral required",
      "Flexible repayment terms",
      "Early repayment option with no penalty",
      "Access to funds within 24 hours",
    ],
    requirements: ["Valid ID", "Proof of income", "Bank statements for the last 3 months", "Credit score check"],
    minAmount: 10000,
    maxAmount: 100000,
    term: "3-12 months",
    isNew: true,
    isTrending: true,
    isMostPreferred: false,
    isLimitedTime: true,
    expiresAt: "2025-04-15T23:59:59",
    discount: 16,
  },
  {
    id: "pl-002",
    name: "Home Improvement Loan",
    institution: "WealthWise Finance",
    imageUrl: "/placeholder.svg?height=300&width=400",
    category: "Personal Loans",
    subcategory: "Long Term",
    currentRate: 8.75,
    originalRate: 10.5,
    description:
      "Transform your home with our affordable home improvement loan. Low interest rates and extended repayment periods.",
    features: [
      "Competitive interest rates",
      "Loan amounts up to KSH 5,000,000",
      "Repayment period up to 7 years",
      "No processing fee",
      "Dedicated relationship manager",
    ],
    requirements: [
      "Property ownership documents",
      "Proof of income",
      "Credit history",
      "Home improvement plan/quotation",
    ],
    minAmount: 500000,
    maxAmount: 5000000,
    term: "1-7 years",
    isNew: false,
    isTrending: false,
    isMostPreferred: true,
    isLimitedTime: false,
    discount: 17,
  },

  // Investment Opportunities
  {
    id: "inv-001",
    name: "Green Energy Fund",
    institution: "EcoInvest Capital",
    imageUrl: "/placeholder.svg?height=300&width=400",
    category: "Investment Opportunities",
    subcategory: "ESG Investments",
    currentRate: 14.25,
    originalRate: 14.25,
    description:
      "Invest in sustainable energy projects with potential for high returns while contributing to environmental conservation.",
    features: [
      "Projected annual returns of 12-16%",
      "Quarterly dividend payments",
      "Tax benefits for green investments",
      "Portfolio diversification",
      "Impact investment reporting",
    ],
    requirements: [
      "Minimum investment of KSH 250,000",
      "Investment horizon of at least 3 years",
      "KYC documentation",
      "Risk assessment",
    ],
    minAmount: 250000,
    maxAmount: 10000000,
    term: "3-10 years",
    isNew: true,
    isTrending: true,
    isMostPreferred: false,
    isLimitedTime: false,
  },
  {
    id: "inv-002",
    name: "Real Estate Trust",
    institution: "Property Capital",
    imageUrl: "/placeholder.svg?height=300&width=400",
    category: "Investment Opportunities",
    subcategory: "Real Estate",
    currentRate: 11.5,
    originalRate: 13,
    description:
      "Invest in prime commercial and residential properties across major cities with our diversified real estate trust.",
    features: [
      "Stable rental income",
      "Capital appreciation potential",
      "Professional property management",
      "Diversified property portfolio",
      "Liquidity options after lock-in period",
    ],
    requirements: [
      "Minimum investment of KSH 500,000",
      "Lock-in period of 2 years",
      "KYC documentation",
      "Investment agreement",
    ],
    minAmount: 500000,
    maxAmount: 20000000,
    term: "2-15 years",
    isNew: false,
    isTrending: false,
    isMostPreferred: true,
    isLimitedTime: true,
    expiresAt: "2025-05-30T23:59:59",
    discount: 12,
  },

  // Savings Accounts
  {
    id: "sav-001",
    name: "High-Yield Savings Account",
    institution: "ProsperityBank",
    imageUrl: "/placeholder.svg?height=300&width=400",
    category: "Savings Accounts",
    subcategory: "High Interest",
    currentRate: 7.5,
    originalRate: 6,
    description:
      "Earn more on your savings with our high-yield savings account featuring competitive interest rates and no hidden fees.",
    features: [
      "7.5% annual interest rate",
      "Interest calculated daily and paid monthly",
      "No minimum balance requirement after opening",
      "Free online and mobile banking",
      "Unlimited deposits",
    ],
    requirements: ["Initial deposit of KSH 10,000", "Valid ID", "Proof of address", "Tax ID number"],
    minAmount: 10000,
    maxAmount: 10000000,
    term: "Flexible",
    isNew: true,
    isTrending: false,
    isMostPreferred: true,
    isLimitedTime: false,
    discount: 0,
  },
  {
    id: "sav-002",
    name: "Goal-Based Savings Plan",
    institution: "FutureFirst Finance",
    imageUrl: "/placeholder.svg?height=300&width=400",
    category: "Savings Accounts",
    subcategory: "Goal-Based",
    currentRate: 8.25,
    originalRate: 7,
    description:
      "Set and achieve your financial goals with our specialized savings plan featuring boosted interest rates and goal tracking tools.",
    features: [
      "Boosted interest rates for committed savings",
      "Digital goal tracking and progress visualization",
      "Automated savings options",
      "Goal achievement rewards",
      "Financial planning tools and resources",
    ],
    requirements: [
      "Initial deposit of KSH 5,000",
      "Monthly contribution commitment",
      "Goal setting consultation",
      "Valid ID and proof of address",
    ],
    minAmount: 5000,
    maxAmount: 5000000,
    term: "6 months - 5 years",
    isNew: false,
    isTrending: true,
    isMostPreferred: false,
    isLimitedTime: true,
    expiresAt: "2025-04-30T23:59:59",
    discount: 18,
  },
]

// Financial tips data
const financialTips = [
  {
    id: 1,
    title: "Emergency Fund Basics",
    description: "Aim to save 3-6 months of expenses in an easily accessible account for emergencies.",
    icon: <ShieldIcon className="h-6 w-6 text-green-600" />,
    category: "Savings",
  },
  {
    id: 2,
    title: "Debt Snowball Method",
    description: "Pay off your smallest debts first to build momentum, then tackle larger ones.",
    icon: <TrendingUpIcon className="h-6 w-6 text-green-600" />,
    category: "Debt Management",
  },
  {
    id: 3,
    title: "50/30/20 Budget Rule",
    description: "Allocate 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.",
    icon: <PiggyBankIcon className="h-6 w-6 text-green-600" />,
    category: "Budgeting",
  },
  {
    id: 4,
    title: "Compound Interest Power",
    description:
      "Start investing early to maximize compound interest. Even small amounts grow significantly over time.",
    icon: <LineChart className="h-6 w-6 text-green-600" />,
    category: "Investing",
  },
]

// Expert quotes data
const expertQuotes = [
  {
    id: 1,
    quote: "The best investment you can make is in yourself. Continuous learning pays the highest dividends.",
    author: "Dr. Sarah Johnson",
    title: "Financial Advisor, Harvard Business School",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    quote:
      "Financial freedom isn't about being rich, it's about having options. Start small, be consistent, and watch your wealth grow.",
    author: "Michael Chen",
    title: "Investment Strategist, Global Finance Institute",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    quote:
      "In today's economy, diversification is more important than ever. Don't put all your financial eggs in one basket.",
    author: "Amina Patel",
    title: "Chief Economist, African Development Bank",
    avatar: "/placeholder.svg?height=80&width=80",
  },
]

// Exchange rates data
const exchangeRates = [
  { currency: "USD", code: "USD", rate: 1.0, change: 0.0, flag: "🇺🇸" },
  { currency: "Euro", code: "EUR", rate: 0.92, change: -0.01, flag: "🇪🇺" },
  { currency: "British Pound", code: "GBP", rate: 0.79, change: 0.02, flag: "🇬🇧" },
  { currency: "Japanese Yen", code: "JPY", rate: 149.82, change: 0.35, flag: "🇯🇵" },
  { currency: "Canadian Dollar", code: "CAD", rate: 1.36, change: -0.02, flag: "🇨🇦" },
  { currency: "Australian Dollar", code: "AUD", rate: 1.52, change: 0.01, flag: "🇦🇺" },
  { currency: "Swiss Franc", code: "CHF", rate: 0.9, change: -0.005, flag: "🇨🇭" },
  { currency: "Chinese Yuan", code: "CNY", rate: 7.24, change: 0.03, flag: "🇨🇳" },
]

// Hot deals data
const hotDeals = mockFinancialProducts
  .filter((product) => product.isLimitedTime && product.expiresAt)
  .map((product) => ({
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl,
    currentRate: {  // Changed from currentPrice to currentRate
      amount: product.currentRate,
      currency: "KES",  // Changed from "% p.a." to "KES"
    },
    originalRate: {  // Changed from originalPrice to originalRate
      amount: product.originalRate,
      currency: "KES",  // Changed from "% p.a." to "KES"
    },
    category: product.category,
    expiresAt: product.expiresAt || "2025-04-30T23:59:59",
    description: product.description,
    discount: product.discount,
    institution: product.institution,  // Added institution
  }))
  
export default function FinancePage() {
  useCookieTracking("finance")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSubcategory, setSelectedSubcategory] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [filteredProducts, setFilteredProducts] = useState<FinancialProduct[]>(mockFinancialProducts)
  const [visibleProducts, setVisibleProducts] = useState<FinancialProduct[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<FinancialProduct | null>(null)
  const [showNewProductAlert, setShowNewProductAlert] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [currentExpertQuote, setCurrentExpertQuote] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")


  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  })
  // confetti effect
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#d97706", "#b45309"], // Amber colors
    })
  }, [])
  
  const productsPerPage = 6

  // Categories and subcategories
  const categories = [
    {
      name: "All",
      icon: <DollarSign className="h-4 w-4" />,
      subcategories: ["All"],
    },
    {
      name: "Personal Loans",
      icon: <CreditCard className="h-4 w-4" />,
      subcategories: ["All", "Short Term", "Long Term", "Secured", "Unsecured"],
    },
    {
      name: "Investment Opportunities",
      icon: <BarChart4 className="h-4 w-4" />,
      subcategories: ["All", "Stocks", "Bonds", "Real Estate", "ESG Investments", "Mutual Funds"],
    },
    {
      name: "Savings Accounts",
      icon: <PiggyBank className="h-4 w-4" />,
      subcategories: ["All", "High Interest", "Fixed Deposit", "Goal-Based", "Youth Savings"],
    },
  ]

  // Get subcategories for selected category
  const getSubcategories = () => {
    const category = categories.find((cat) => cat.name === selectedCategory)
    return category ? category.subcategories : ["All"]
  }

  // Filter products based on search, category, subcategory, and price range
  useEffect(() => {
    let results = mockFinancialProducts

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.institution.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term) ||
          product.subcategory.toLowerCase().includes(term),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      results = results.filter((product) => product.category === selectedCategory)
    }

    // Filter by subcategory
    if (selectedSubcategory !== "All") {
      results = results.filter((product) => product.subcategory === selectedSubcategory)
    }

    // Filter by price range (min amount)
    results = results.filter((product) => product.minAmount >= priceRange[0] && product.minAmount <= priceRange[1])

    setFilteredProducts(results)
    setPage(1)
    setVisibleProducts([])
    setHasMore(results.length > 0)
  }, [searchTerm, selectedCategory, selectedSubcategory, priceRange])

  // Load more products when scrolling
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreProducts()
    }
  }, [inView, filteredProducts])

  // Auto-hide new product alert after 10 seconds
  useEffect(() => {
    if (showNewProductAlert) {
      const timer = setTimeout(() => {
        setShowNewProductAlert(false)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [showNewProductAlert])

  // Load initial products
  useEffect(() => {
    loadMoreProducts()
  }, [])

  useEffect(() => {
    // Rotate expert quotes every 8 seconds
    const interval = setInterval(() => {
      setCurrentExpertQuote((prev) => (prev + 1) % expertQuotes.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const loadMoreProducts = () => {
    setLoading(true)

    // Simulate API call with setTimeout
    setTimeout(() => {
      const startIndex = (page - 1) * productsPerPage
      const endIndex = startIndex + productsPerPage
      const newProducts = filteredProducts.slice(startIndex, endIndex)

      setVisibleProducts((prev) => [...prev, ...newProducts])
      setPage((prev) => prev + 1)
      setHasMore(endIndex < filteredProducts.length)
      setLoading(false)
    }, 800)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory("All")
  }

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory)
  }

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value)
  }

  const handleProductClick = (product: FinancialProduct) => {
    setSelectedProduct(product)
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const calculateSavings = (current: number, original: number, isRate = true) => {
    if (isRate) {
      // For interest rates, lower is better for loans, higher is better for savings/investments
      const product = selectedProduct
      if (!product) return 0

      if (product.category === "Personal Loans") {
        // For loans, calculate how much less interest you'll pay
        return ((original - current) / original) * 100
      } else {
        // For savings/investments, calculate how much more you'll earn
        return ((current - original) / original) * 100
      }
    } else {
      // For direct amounts
      return ((original - current) / original) * 100
    }
  }

  const closeNewProductAlert = () => {
    setShowNewProductAlert(false)
  }
  //logic to show the AlertBox message
 // Custom color scheme for finance trending
const financeColorScheme = {
  primary: "from-purple-500 to-indigo-700",
  secondary: "bg-purple-100",
  accent: "bg-indigo-600",
  text: "text-purple-900",
  background: "bg-purple-50",
}

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Page header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-8 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 text-white italic animate-pulse">
          FINANCE DEALS - Discover the best financial products to grow your wealth
        </h1>
          <div className="flex justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <DollarSign key={star} className="h-5 w-5 text-yellow-300 mx-1" />
            ))}
          </div>
          <div className="mb-8">
            <CountdownTimer targetDate="2025-12-31T23:59:59" startDate="2025-02-13T00:00:00" />
            {/* Hot deals section */}
      <div className="container mx-auto max-w-7xl px-4 md:px-8 mt-8">
        <FinancialHotDeals
          deals={hotDeals}
          colorScheme="green"
          title="Limited Time Financial Offers"
          subtitle="Lock in these special rates before they expire!"
        />
      </div>
           </div>


{/* Finance Recommendations */}
<FinanceRecommendations 
  allProducts={mockFinancialProducts}
  title="Recommended for You"
  subtitle="Financial products tailored to your needs and goals"
/>

{/* Calendar-based Recommendations */}
<CalendarBasedRecommendations 
  allProducts={mockFinancialProducts}
  title="Seasonal Financial Recommendations"
  subtitle="Financial products that match your current needs based on the calendar"
/>

  {/* Trending and Popular Section */}
 <TrendingPopularSection
        trendingProducts={trendingProducts}
        popularProducts={popularProducts}
        colorScheme={financeColorScheme}
        title="Best and Trending Finance Deals Today"
        subtitle="Discover  most popular Finance Deals"
      />
          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto mt-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for financial products, institutions, or services..."
                className="pl-10 pr-4 py-3 rounded-full border-green-300 bg-white/90 backdrop-blur-sm text-green-900 placeholder:text-green-500/70 focus:ring-green-500 focus:border-green-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
            <Link href="/finance/shop">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <DollarSign className="mr-2 h-4 w-4" />
                Browse Finance Shop
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
       <div className="mt-6">
            <Link href="/finance/media">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <DollarSign className="mr-2 h-4 w-4" />
                Browse our Finance Media Shop
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

      {/* New product alert */}
      <AnimatePresence>
        {showNewProductAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-gradient-to-r from-green-100 to-emerald-100 border-l-4 border-green-500 text-green-800 p-4 mx-4 md:mx-auto max-w-7xl mt-4 rounded-md shadow-md relative"
          >
            <button
              onClick={() => setShowNewProductAlert(false)}
              className="absolute right-2 top-2 text-green-600 hover:text-green-800"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center">
              <BadgePercent className="h-6 w-6 mr-2 text-green-600" />
              <div>
                <p className="font-medium">New financial products available!</p>
                <p className="text-sm">
                  Check out our new high-yield savings accounts and quick cash advances with special introductory rates.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expert Quote Section */}
      <div className="bg-green-900 text-white py-8 px-4 sm:px-6 lg:px-8 mt-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-start">
            <Quote className="h-10 w-10 text-green-300 mr-4 flex-shrink-0 mt-1" />
            <div>
              <p className="text-xl italic mb-4">{expertQuotes[currentExpertQuote].quote}</p>
              <div className="flex items-center">
                <Image
                  src={expertQuotes[currentExpertQuote].avatar || "/placeholder.svg"}
                  alt={expertQuotes[currentExpertQuote].author}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold">{expertQuotes[currentExpertQuote].author}</p>
                  <p className="text-sm text-green-300">{expertQuotes[currentExpertQuote].title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Tips Section */}
      <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12">
        <div className="mb-6 flex items-center">
          <Lightbulb className="h-6 w-6 text-amber-500 mr-2" />
          <h2 className="text-2xl font-bold text-green-800">Financial Tips & Insights</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {financialTips.map((tip) => (
            <Card key={tip.id} className="border-green-100 hover:shadow-md transition-shadow h-full">
              <div className="p-4 pb-2">
                <div className="flex items-center mb-2">
                  {tip.icon}
                  <Badge className="ml-2 bg-green-100 text-green-800">{tip.category}</Badge>
                </div>
                <h3 className="text-lg font-semibold">{tip.title}</h3>
              </div>
              <div className="p-4 pt-2">
                <p className="text-gray-600">{tip.description}</p>
              </div>
              <div className="p-4 pt-0">
                <Button variant="link" className="p-0 text-green-600">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Exchange Rates Section */}
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-t border-b border-green-100">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center mb-6">
            <RefreshCw className="h-6 w-6 text-green-600 mr-2" />
            <div>
              <h2 className="text-2xl font-bold text-green-800">Current Exchange Rates</h2>
              <p className="text-gray-500 mt-1">Updated today at 09:30 AM</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {exchangeRates.map((rate) => (
              <Card key={rate.code} className="overflow-hidden border-green-100 hover:shadow-md transition-shadow">
                <div className="p-4 pb-2 bg-green-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{rate.flag}</span>
                      <h3 className="text-lg font-semibold">{rate.code}</h3>
                    </div>
                    <Badge
                      className={cn(
                        "px-2 py-1",
                        rate.change > 0
                          ? "bg-green-100 text-green-800"
                          : rate.change < 0
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800",
                      )}
                    >
                      {rate.change > 0 ? "+" : ""}
                      {rate.change.toFixed(3)}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{rate.currency}</span>
                    <span className="text-xl font-bold">{rate.rate.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline" className="text-green-700 border-green-300">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Rates
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-7xl px-4 md:px-8 pb-16">
        {/* Category tabs and filters */}
        <div className="mb-8" id="financial-products">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-green-800">Financial Products</h2>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {/* Category tabs */}
          <Tabs defaultValue="All" className="w-full">
            <TabsList className="bg-green-100/80 p-1 rounded-xl mb-4 flex flex-nowrap overflow-x-auto hide-scrollbar">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.name}
                  value={category.name}
                  onClick={() => handleCategoryChange(category.name)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    selectedCategory === category.name
                      ? "bg-green-600 text-white shadow-sm"
                      : "text-green-700 hover:bg-green-200/50",
                  )}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Subcategory tabs */}
            {selectedCategory !== "All" && (
              <div className="flex flex-wrap gap-2 mb-6">
                {getSubcategories().map((subcategory) => (
                  <Badge
                    key={subcategory}
                    variant={selectedSubcategory === subcategory ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer px-3 py-1 text-sm",
                      selectedSubcategory === subcategory
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-transparent border-green-300 text-green-700 hover:bg-green-100",
                    )}
                    onClick={() => handleSubcategoryChange(subcategory)}
                  >
                    {subcategory}
                  </Badge>
                ))}
              </div>
            )}

            {/* Advanced filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-green-800 mb-4">Amount Range</h3>
                    <div className="px-4">
                      <Slider
                        defaultValue={[0, 5000000]}
                        max={5000000}
                        step={50000}
                        value={priceRange}
                        onValueChange={handlePriceRangeChange}
                        className="mb-6"
                      />
                      <div className="flex justify-between text-sm text-green-700">
                        <span>{formatCurrency(priceRange[0])}</span>
                        <span>{formatCurrency(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProducts.length > 0 ? (
                visibleProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="h-full"
                  >
                    <Card
                      className="overflow-hidden h-full flex flex-col border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 bg-white"
                      onClick={() => handleProductClick(product)}
                    >
                      {/* Product image */}
                      <div className="relative h-48 bg-green-100">
                        <Image
                          src={product.imageUrl || "/placeholder.svg"}
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 hover:scale-105"
                        />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-2">
                          {product.isNew && (
                            <Badge className="bg-blue-500 hover:bg-blue-600 text-white">New This Week</Badge>
                          )}
                          {product.isTrending && (
                            <Badge className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              <span>Trending</span>
                            </Badge>
                          )}
                          {product.isMostPreferred && (
                            <Badge className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-1">
                              <Star className="h-3 w-3 fill-white" />
                              <span>Most Preferred</span>
                            </Badge>
                          )}
                        </div>

                        {/* Limited time offer */}
                        {product.isLimitedTime && product.expiresAt && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Limited Time</span>
                            </Badge>
                          </div>
                        )}

                        {/* Institution logo */}
                        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-md">
                          <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xs">
                            {product.institution.substring(0, 2).toUpperCase()}
                          </div>
                        </div>
                      </div>

                      {/* Product details */}
                      <div className="p-4 flex-grow flex flex-col">
                        <div className="mb-2">
                          <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                            {product.subcategory}
                          </Badge>
                        </div>

                        <h3 className="font-semibold text-green-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">{product.description}</p>

                        {/* Institution */}
                        <div className="text-xs text-gray-500 mb-3">
                          Offered by <span className="font-medium text-green-700">{product.institution}</span>
                        </div>

                        {/* Rate and buttons */}
                        <div className="mt-auto">
                          <div className="flex items-end justify-between mb-3">
                            <div>
                              <div className="text-lg font-bold text-green-700">{product.currentRate}% p.a.</div>
                              {product.originalRate !== product.currentRate && (
                                <div className="text-sm text-gray-500 line-through">{product.originalRate}% p.a.</div>
                              )}
                            </div>

                            <div className="text-xs text-gray-600">
                              {formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="grid grid-cols-2 gap-2">
                            {product.discount && product.discount > 0 ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-green-300 text-green-700 hover:bg-green-50 flex items-center justify-center gap-1"
                              >
                                <Percent className="h-3 w-3" />
                                <span>Save {product.discount}%</span>
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-green-300 text-green-700 hover:bg-green-50 flex items-center justify-center gap-1"
                              >
                                <Shield className="h-3 w-3" />
                                <span>Best Value</span>
                              </Button>
                            )}

                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                              Grow Your Wealth
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <div className="mx-auto w-24 h-24 mb-4 bg-green-50 rounded-full flex items-center justify-center">
                    <DollarSign className="h-12 w-12 text-green-300" />
                  </div>
                  <h3 className="text-xl font-medium text-green-800 mb-2">No products found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    We couldn't find any financial products matching your criteria. Try adjusting your filters or search
                    term.
                  </p>
                </div>
              )}
            </div>

            {/* Loading indicator */}
            {hasMore && (
              <div ref={ref} className="flex justify-center mt-8">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-2"></div>
                    <p className="text-green-600 text-sm">Loading more financial products...</p>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                    onClick={loadMoreProducts}
                  >
                    Load More
                  </Button>
                )}
              </div>
            )}
          </Tabs>
        </div>
      </div>

      {/* Product detail modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && closeProductModal()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-green-800 flex items-center gap-2">
                  {selectedProduct.name}
                  {selectedProduct.isNew && <Badge className="bg-blue-500 ml-2">New</Badge>}
                </DialogTitle>
                <DialogDescription className="text-base text-gray-600">
                  Offered by <span className="font-medium text-green-700">{selectedProduct.institution}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Product image */}
                <div className="relative h-64 md:h-full rounded-lg overflow-hidden bg-green-100">
                  <Image
                    src={selectedProduct.imageUrl || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    layout="fill"
                    objectFit="cover"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {selectedProduct.isTrending && (
                      <Badge className="bg-orange-500 text-white flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>Trending</span>
                      </Badge>
                    )}
                    {selectedProduct.isMostPreferred && (
                      <Badge className="bg-purple-500 text-white flex items-center gap-1">
                        <Star className="h-3 w-3 fill-white" />
                        <span>Most Preferred</span>
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Product details */}
                <div className="flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-green-800 mb-2">Description</h3>
                    <p className="text-gray-600">{selectedProduct.description}</p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-green-800 mb-2">Key Features</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {selectedProduct.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-green-800 mb-2">Requirements</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {selectedProduct.requirements.map((requirement, index) => (
                        <li key={index}>{requirement}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-green-700">{selectedProduct.currentRate}% p.a.</div>
                        {selectedProduct.originalRate !== selectedProduct.currentRate && (
                          <div className="text-base text-gray-500 line-through">
                            {selectedProduct.originalRate}% p.a.
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-sm text-gray-600 mb-1">Amount Range:</div>
                        <div className="font-medium text-green-800">
                          {formatCurrency(selectedProduct.minAmount)} - {formatCurrency(selectedProduct.maxAmount)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {selectedProduct.discount && selectedProduct.discount > 0 ? (
                        <Button
                          variant="outline"
                          className="border-green-300 text-green-700 hover:bg-green-50 flex-1 flex items-center justify-center gap-2"
                        >
                          <Percent className="h-4 w-4" />
                          <span>
                            Save {selectedProduct.discount}% on{" "}
                            {selectedProduct.category === "Personal Loans" ? "Interest" : "Fees"}
                          </span>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="border-green-300 text-green-700 hover:bg-green-50 flex-1 flex items-center justify-center gap-2"
                        >
                          <Shield className="h-4 w-4" />
                          <span>Best Value Guarantee</span>
                        </Button>
                      )}

                      <Button className="bg-green-600 hover:bg-green-700 text-white flex-1 flex items-center justify-center gap-2">
                        <Wallet className="h-4 w-4" />
                        <span>Grow Your Wealth</span>
                      </Button>
                    </div>
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

