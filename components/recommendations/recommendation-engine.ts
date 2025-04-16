"use client"

// Types for the recommendation engine
export interface RecommendableProduct {
  id: string | number
  name: string
  category: string
  subcategory: string
  description: string
  imageUrl: string
  institution?: string
  insurer?: string
  isNew?: boolean
  isTrending?: boolean
  isMostPreferred?: boolean
  isLimitedTime?: boolean
  dateAdded: string
  expiresAt?: string
  // For insurance products
  currentPrice?: {
    amount: number
    currency: string
  }
  originalPrice?: {
    amount: number
    currency: string
  }
  // For financial products
  currentRate?: number
  originalRate?: number
  minAmount?: number
  maxAmount?: number
  features?: string[]
  tags?: string[]
  discount?: number
}

export interface UserPreference {
  searchHistory: string[]
  viewedProducts: string[]
  clickedProducts: string[]
  favoriteCategories: string[]
  location?: string
  monthlyIncome?: number
  currentMonth: number // 1-12 for January-December
}

// Recommendation strategies
type RecommendationStrategy = (
  products: RecommendableProduct[],
  userPreferences: UserPreference,
  count: number,
) => RecommendableProduct[]

// Strategy: Recommend based on search history
const searchBasedRecommendation: RecommendationStrategy = (products, userPreferences, count) => {
  const { searchHistory } = userPreferences
  if (!searchHistory.length) return []

  // Create a score for each product based on how well it matches search terms
  const scoredProducts = products.map((product) => {
    let score = 0
    searchHistory.forEach((term) => {
      const termLower = term.toLowerCase()
      // Check if search term appears in product fields
      if (product.name.toLowerCase().includes(termLower)) score += 10
      if (product.description.toLowerCase().includes(termLower)) score += 5
      if (product.category.toLowerCase().includes(termLower)) score += 3
      if (product.subcategory.toLowerCase().includes(termLower)) score += 2
      if (product.tags?.some((tag) => tag.toLowerCase().includes(termLower))) score += 4
      if (product.features?.some((feature) => feature.toLowerCase().includes(termLower))) score += 3
    })
    return { product, score }
  })

  // Sort by score and return top results
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 0)
    .slice(0, count)
    .map((item) => item.product)
}

// Strategy: Recommend seasonal products based on current month
const seasonalRecommendation: RecommendationStrategy = (products, userPreferences, count) => {
  const { currentMonth } = userPreferences

  // Define seasonal mappings (month number to relevant categories/keywords)
  const seasonalMappings: Record<number, string[]> = {
    1: ["new year", "financial planning", "tax", "savings", "health insurance"], // January
    2: ["education", "school fees", "education insurance", "student loans"], // February
    3: ["tax", "investment", "financial year end", "retirement"], // March
    4: ["rainy season", "flood insurance", "home insurance", "umbrella policy"], // April
    5: ["health", "medical insurance", "wellness", "family health"], // May
    6: ["mid-year review", "investment check", "budget review"], // June
    7: ["travel", "holiday insurance", "vacation loans", "travel insurance"], // July
    8: ["education", "school fees", "student loans", "education insurance"], // August
    9: ["business", "commercial insurance", "business loans", "liability"], // September
    10: ["harvest", "agricultural insurance", "farm loans", "crop insurance"], // October
    11: ["black friday", "holiday shopping", "personal loans", "credit"], // November
    12: ["holiday", "year end", "christmas loans", "new year planning"], // December
  }

  // Enhanced financial seasonal mappings
  const financialSeasonalMappings: Record<number, Record<string, number>> = {
    1: { "Personal Loans": 15, "Savings Accounts": 20, "Investment Opportunities": 10 }, // January - New Year planning
    2: { "Personal Loans": 20, "Education Loans": 25 }, // February - School fees
    3: { "Investment Opportunities": 25, "Tax Planning": 30 }, // March - Tax season
    4: { "Home Loans": 20, Insurance: 15 }, // April - Rainy season
    5: { "Health Insurance": 25, "Personal Loans": 10 }, // May - Health focus
    6: { "Investment Opportunities": 30, "Tax Planning": 25 }, // June - Mid-year review & tax
    7: { "Personal Loans": 20, "Travel Insurance": 25 }, // July - Travel season
    8: { "Education Loans": 30, "Personal Loans": 20 }, // August - Back to school
    9: { "Business Loans": 25, "Investment Opportunities": 15 }, // September - Business focus
    10: { "Agricultural Loans": 30, "Savings Accounts": 20 }, // October - Harvest season
    11: { "Personal Loans": 25, "Credit Cards": 20 }, // November - Black Friday
    12: { "Personal Loans": 30, "Savings Accounts": 15, "Investment Opportunities": 20 }, // December - Holiday season
  }

  const relevantTerms = seasonalMappings[currentMonth] || []

  // Score products based on seasonal relevance
  const scoredProducts = products.map((product) => {
    let score = 0

    // Score based on general seasonal terms
    relevantTerms.forEach((term) => {
      const termLower = term.toLowerCase()
      if (product.name.toLowerCase().includes(termLower)) score += 5
      if (product.description.toLowerCase().includes(termLower)) score += 3
      if (product.category.toLowerCase().includes(termLower)) score += 4
      if (product.subcategory.toLowerCase().includes(termLower)) score += 4
      if (product.tags?.some((tag) => tag.toLowerCase().includes(termLower))) score += 3
    })

    // Enhanced scoring for financial products
    if (product.currentRate !== undefined) {
      // It's a financial product
      const financialScores = financialSeasonalMappings[currentMonth] || {}

      // Check if the product category has a seasonal score
      Object.entries(financialScores).forEach(([category, categoryScore]) => {
        if (product.category.includes(category) || product.subcategory.includes(category)) {
          score += categoryScore
        }
      })

      // Special case for tax season (March-April in Kenya)
      if (
        (currentMonth === 3 || currentMonth === 4) &&
        (product.category === "Investment Opportunities" || product.tags?.includes("tax-advantaged"))
      ) {
        score += 25
      }

      // Special case for end of financial year (June)
      if (currentMonth === 6 && product.category === "Investment Opportunities") {
        score += 20
      }

      // Special case for holiday spending (December-January)
      if (
        (currentMonth === 12 || currentMonth === 1) &&
        product.category === "Personal Loans" &&
        product.subcategory === "Short Term"
      ) {
        score += 30
      }
    }

    // Boost score for limited time offers
    if (product.isLimitedTime) score *= 1.5

    return { product, score }
  })

  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 0)
    .slice(0, count)
    .map((item) => item.product)
}

// Strategy: Recommend based on user behavior (viewed/clicked products)
const behaviorBasedRecommendation: RecommendationStrategy = (products, userPreferences, count) => {
  const { viewedProducts, clickedProducts } = userPreferences

  if (!viewedProducts.length && !clickedProducts.length) return []

  // Get categories and subcategories of viewed/clicked products
  const interactedProductIds = [...new Set([...viewedProducts, ...clickedProducts])]

  // Find the actual products that were interacted with
  const interactedProducts = products.filter((p) => interactedProductIds.includes(p.id.toString()))

  // Extract categories and subcategories
  const categories = new Set(interactedProducts.map((p) => p.category))
  const subcategories = new Set(interactedProducts.map((p) => p.subcategory))

  // Score products based on similarity to interacted products
  const scoredProducts = products
    .filter((p) => !interactedProductIds.includes(p.id.toString())) // Don't recommend already interacted products
    .map((product) => {
      let score = 0

      // Category and subcategory matching
      if (categories.has(product.category)) score += 5
      if (subcategories.has(product.subcategory)) score += 8

      // Boost score for trending and popular products
      if (product.isTrending) score += 3
      if (product.isMostPreferred) score += 2
      if (product.isNew) score += 1

      // Enhanced scoring for financial products
      if (product.currentRate !== undefined) {
        // For financial products, consider price range similarity
        interactedProducts.forEach((interactedProduct) => {
          if (
            interactedProduct.minAmount &&
            product.minAmount &&
            Math.abs(interactedProduct.minAmount - product.minAmount) < 100000
          ) {
            score += 5 // Similar price range
          }

          // Similar interest rates for financial products
          if (
            interactedProduct.currentRate &&
            product.currentRate &&
            Math.abs(interactedProduct.currentRate - product.currentRate) < 2
          ) {
            score += 4 // Similar interest rate
          }
        })
      }

      return { product, score }
    })

  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 0)
    .slice(0, count)
    .map((item) => item.product)
}

// New strategy: Financial health based recommendations
const financialHealthRecommendation: RecommendationStrategy = (products, userPreferences, count) => {
  // Only apply to financial products
  const financialProducts = products.filter((p) => p.currentRate !== undefined)
  if (financialProducts.length === 0) return []

  // Get user's monthly income if available
  const { monthlyIncome } = userPreferences

  const scoredProducts = financialProducts.map((product) => {
    let score = 0

    // If we know user's income, recommend appropriate products
    if (monthlyIncome) {
      // For loans, recommend amounts that are appropriate for income
      if (product.category === "Personal Loans") {
        // Affordable loan (monthly payment would be less than 30% of income)
        const estimatedMonthlyPayment = product.minAmount
          ? (product.minAmount * (product.currentRate || 0)) / 100 / 12
          : 0
        if (estimatedMonthlyPayment < monthlyIncome * 0.3) {
          score += 20
        }
      }

      // For savings, recommend based on capacity
      if (product.category === "Savings Accounts") {
        // If minimum deposit is less than 20% of monthly income
        if (product.minAmount && product.minAmount < monthlyIncome * 0.2) {
          score += 15
        }
      }
    }

    // Prioritize high-yield savings and low-interest loans
    if (product.category === "Savings Accounts" && product.currentRate && product.currentRate > 7) {
      score += 10 // High interest savings
    }

    if (product.category === "Personal Loans" && product.currentRate && product.currentRate < 12) {
      score += 15 // Low interest loans
    }

    return { product, score }
  })

  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 0)
    .slice(0, count)
    .map((item) => item.product)
}

// Main recommendation function that combines multiple strategies
export function getRecommendations(
  allProducts: RecommendableProduct[],
  userPreferences: UserPreference,
  count = 6,
): RecommendableProduct[] {
  // Apply different recommendation strategies
  const searchRecommendations = searchBasedRecommendation(allProducts, userPreferences, count)
  const seasonalRecommendations = seasonalRecommendation(allProducts, userPreferences, count)
  const behaviorRecommendations = behaviorBasedRecommendation(allProducts, userPreferences, count)

  // Add financial health recommendations if we have financial products
  const financialHealthRecommendations = financialHealthRecommendation(allProducts, userPreferences, count)

  // Combine and deduplicate recommendations
  const allRecommendations = [
    ...searchRecommendations,
    ...seasonalRecommendations,
    ...behaviorRecommendations,
    ...financialHealthRecommendations,
  ]

  // Deduplicate by ID
  const uniqueRecommendations = Array.from(new Map(allRecommendations.map((item) => [item.id, item])).values())

  // Prioritize recommendations:
  // 1. Limited time offers that are ending soon
  // 2. New products
  // 3. Trending products
  // 4. Most preferred products
  return uniqueRecommendations
    .sort((a, b) => {
      // First sort by limited time offers
      if (a.isLimitedTime && !b.isLimitedTime) return -1
      if (!a.isLimitedTime && b.isLimitedTime) return 1

      // Then by newness
      if (a.isNew && !b.isNew) return -1
      if (!a.isNew && b.isNew) return 1

      // Then by trending status
      if (a.isTrending && !b.isTrending) return -1
      if (!a.isTrending && b.isTrending) return 1

      // Then by popularity
      if (a.isMostPreferred && !b.isMostPreferred) return -1
      if (!a.isMostPreferred && b.isMostPreferred) return 1

      return 0
    })
    .slice(0, count)
}

// Helper function to extract user preferences from cookies, search history, etc.
export function extractUserPreferences(): UserPreference {
  // In a real implementation, this would extract data from cookies, local storage, etc.
  // For now, we'll return a mock user preference

  // Try to get data from localStorage if available
  let searchHistory: string[] = []
  let viewedProducts: string[] = []
  let clickedProducts: string[] = []
  let favoriteCategories: string[] = []
  let monthlyIncome: number | undefined = undefined

  if (typeof window !== "undefined") {
    try {
      searchHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]")
      viewedProducts = JSON.parse(localStorage.getItem("viewedProducts") || "[]")
      clickedProducts = JSON.parse(localStorage.getItem("clickedProducts") || "[]")
      favoriteCategories = JSON.parse(localStorage.getItem("favoriteCategories") || "[]")
      monthlyIncome = Number(localStorage.getItem("monthlyIncome")) || undefined
    } catch (e) {
      console.error("Error parsing user preferences from localStorage", e)
    }
  }

  // Get current month (1-12)
  const currentMonth = new Date().getMonth() + 1

  return {
    searchHistory,
    viewedProducts,
    clickedProducts,
    favoriteCategories,
    monthlyIncome,
    currentMonth,
  }
}

// Function to update user preferences based on their actions
export function updateUserPreferences(
  action: "search" | "view" | "click" | "favorite" | "income",
  data: string | number,
  currentPreferences: UserPreference,
): UserPreference {
  const newPreferences = { ...currentPreferences }

  switch (action) {
    case "search":
      newPreferences.searchHistory = [data.toString(), ...newPreferences.searchHistory].slice(0, 10)
      break
    case "view":
      newPreferences.viewedProducts = [data.toString(), ...newPreferences.viewedProducts].slice(0, 20)
      break
    case "click":
      newPreferences.clickedProducts = [data.toString(), ...newPreferences.clickedProducts].slice(0, 20)
      break
    case "favorite":
      newPreferences.favoriteCategories = [data.toString(), ...newPreferences.favoriteCategories].slice(0, 10)
      break
    case "income":
      newPreferences.monthlyIncome = typeof data === "number" ? data : undefined
      break
  }

  // Save to localStorage if available
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("searchHistory", JSON.stringify(newPreferences.searchHistory))
      localStorage.setItem("viewedProducts", JSON.stringify(newPreferences.viewedProducts))
      localStorage.setItem("clickedProducts", JSON.stringify(newPreferences.clickedProducts))
      localStorage.setItem("favoriteCategories", JSON.stringify(newPreferences.favoriteCategories))
      if (newPreferences.monthlyIncome) {
        localStorage.setItem("monthlyIncome", newPreferences.monthlyIncome.toString())
      }
    } catch (e) {
      console.error("Error saving user preferences to localStorage", e)
    }
  }

  return newPreferences
}
