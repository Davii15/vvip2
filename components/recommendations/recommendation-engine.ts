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
  
    const relevantTerms = seasonalMappings[currentMonth] || []
  
    // Score products based on seasonal relevance
    const scoredProducts = products.map((product) => {
      let score = 0
      relevantTerms.forEach((term) => {
        const termLower = term.toLowerCase()
        if (product.name.toLowerCase().includes(termLower)) score += 5
        if (product.description.toLowerCase().includes(termLower)) score += 3
        if (product.category.toLowerCase().includes(termLower)) score += 4
        if (product.subcategory.toLowerCase().includes(termLower)) score += 4
        if (product.tags?.some((tag) => tag.toLowerCase().includes(termLower))) score += 3
      })
  
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
  
    // Combine and deduplicate recommendations
    const allRecommendations = [...searchRecommendations, ...seasonalRecommendations, ...behaviorRecommendations]
  
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
  
    // Get current month (1-12)
    const currentMonth = new Date().getMonth() + 1
  
    return {
      searchHistory: [],
      viewedProducts: [],
      clickedProducts: [],
      favoriteCategories: [],
      currentMonth,
    }
  }
  
  // Function to update user preferences based on their actions
  export function updateUserPreferences(
    action: "search" | "view" | "click",
    data: string,
    currentPreferences: UserPreference,
  ): UserPreference {
    const newPreferences = { ...currentPreferences }
  
    switch (action) {
      case "search":
        newPreferences.searchHistory = [data, ...newPreferences.searchHistory].slice(0, 10)
        break
      case "view":
        newPreferences.viewedProducts = [data, ...newPreferences.viewedProducts].slice(0, 20)
        break
      case "click":
        newPreferences.clickedProducts = [data, ...newPreferences.clickedProducts].slice(0, 20)
        break
    }
  
    return newPreferences
  }
  