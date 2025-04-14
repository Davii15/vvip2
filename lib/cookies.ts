// Create or update the cookie analytics file to include personalization capabilities

// Cookie interface with expanded fields for personalization
interface CookieData {
    // Basic tracking
    pageVisits: Record<string, number>
    totalVisits: number
    firstVisit: string
    lastVisit: string
  
    // Personalization data
    categoryPreferences: Record<string, number> // Track interest in categories
    viewedItems: string[] // IDs of items/offerings viewed
    clickedTags: Record<string, number> // Track interest in specific tags
    searchTerms: string[] // Search terms used
    interactionScore: Record<string, number> // Engagement score for different sections
    preferredSortOrder?: string // User's preferred sort order
    priceRangePreference?: [number, number] // User's preferred price range
    deviceInfo?: string // Device/browser info for responsive optimization
    sessionCount: number // Number of separate sessions
    averageSessionDuration?: number // Average time spent per session
    lastInteractionTimestamp?: string // Last interaction time
  }
  
  // Cookie name constant
  const COOKIE_NAME = "one_shop_analytics"
  
  // Default expiration in days
  const DEFAULT_EXPIRATION_DAYS = 30
  
  // Initialize cookie with default values
  function initCookie(): CookieData {
    return {
      pageVisits: {},
      totalVisits: 0,
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      categoryPreferences: {},
      viewedItems: [],
      clickedTags: {},
      searchTerms: [],
      interactionScore: {},
      sessionCount: 1,
    }
  }
  
  // Get cookie data
  function getCookieData(): CookieData {
    if (typeof document === "undefined") return initCookie()
  
    const cookieStr = document.cookie.split("; ").find((row) => row.startsWith(`${COOKIE_NAME}=`))
  
    if (!cookieStr) return initCookie()
  
    try {
      const cookieValue = cookieStr.split("=")[1]
      return JSON.parse(decodeURIComponent(cookieValue))
    } catch (error) {
      console.error("Error parsing cookie data:", error)
      return initCookie()
    }
  }
  
  // Save cookie data
  function saveCookieData(data: CookieData, expirationDays = DEFAULT_EXPIRATION_DAYS): void {
    if (typeof document === "undefined") return
  
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + expirationDays)
  
    const cookieValue = encodeURIComponent(JSON.stringify(data))
    document.cookie = `${COOKIE_NAME}=${cookieValue}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`
  }
  
  // Track page visit with enhanced data collection
  export function trackPageVisit(pageName: string): void {
    const data = getCookieData()
  
    // Update basic tracking
    data.pageVisits[pageName] = (data.pageVisits[pageName] || 0) + 1
    data.totalVisits += 1
    data.lastVisit = new Date().toISOString()
  
    // Extract category from page name if possible
    const possibleCategory = pageName.split("/")[0]
    if (possibleCategory) {
      data.categoryPreferences[possibleCategory] = (data.categoryPreferences[possibleCategory] || 0) + 1
    }
  
    // Update interaction score for browsing
    data.interactionScore["browsing"] = (data.interactionScore["browsing"] || 0) + 1
  
    // Update last interaction timestamp
    data.lastInteractionTimestamp = new Date().toISOString()
  
    saveCookieData(data)
  }
  
  // Track item view (product/offering detail view)
  export function trackItemView(itemId: string, category: string): void {
    const data = getCookieData()
  
    // Add to viewed items if not already there
    if (!data.viewedItems.includes(itemId)) {
      data.viewedItems.push(itemId)
      // Keep only the last 20 viewed items
      if (data.viewedItems.length > 20) {
        data.viewedItems = data.viewedItems.slice(-20)
      }
    }
  
    // Increase category preference
    data.categoryPreferences[category] = (data.categoryPreferences[category] || 0) + 2 // Higher weight than just page visit
  
    // Update interaction score for item viewing
    data.interactionScore["itemViewing"] = (data.interactionScore["itemViewing"] || 0) + 1
  
    // Update last interaction timestamp
    data.lastInteractionTimestamp = new Date().toISOString()
  
    saveCookieData(data)
  }
  
  // Track tag clicks
  export function trackTagClick(tag: string): void {
    const data = getCookieData()
  
    data.clickedTags[tag] = (data.clickedTags[tag] || 0) + 1
  
    // Update interaction score for tag interaction
    data.interactionScore["tagInteraction"] = (data.interactionScore["tagInteraction"] || 0) + 1
  
    // Update last interaction timestamp
    data.lastInteractionTimestamp = new Date().toISOString()
  
    saveCookieData(data)
  }
  
  // Track search terms
  export function trackSearch(term: string): void {
    const data = getCookieData()
  
    // Add search term to history
    data.searchTerms.push(term)
    // Keep only the last 10 search terms
    if (data.searchTerms.length > 10) {
      data.searchTerms = data.searchTerms.slice(-10)
    }
  
    // Update interaction score for searching
    data.interactionScore["searching"] = (data.interactionScore["searching"] || 0) + 1
  
    // Update last interaction timestamp
    data.lastInteractionTimestamp = new Date().toISOString()
  
    saveCookieData(data)
  }
  
  // Track sort order preference
  export function trackSortPreference(sortOrder: string): void {
    const data = getCookieData()
    data.preferredSortOrder = sortOrder
    saveCookieData(data)
  }
  
  // Track price range preference
  export function trackPriceRangePreference(priceRange: [number, number]): void {
    const data = getCookieData()
    data.priceRangePreference = priceRange
    saveCookieData(data)
  }
  
  // Track device info
  export function trackDeviceInfo(): void {
    if (typeof navigator === "undefined") return
  
    const data = getCookieData()
    const userAgent = navigator.userAgent
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const browserInfo = userAgent.match(/(chrome|safari|firefox|msie|trident|edge)\/?\s*(\d+)/i)
  
    data.deviceInfo = `${isMobile ? "Mobile" : "Desktop"}, ${browserInfo ? browserInfo[1] : "Unknown"}`
    saveCookieData(data)
  }
  
  // Start a new session
  export function startNewSession(): void {
    const data = getCookieData()
    data.sessionCount += 1
  
    // Calculate session duration if we have a last interaction timestamp
    if (data.lastInteractionTimestamp) {
      const lastInteraction = new Date(data.lastInteractionTimestamp).getTime()
      const now = new Date().getTime()
      const sessionDuration = (now - lastInteraction) / 1000 / 60 // in minutes
  
      // Only count if it's a reasonable duration (less than 12 hours)
      if (sessionDuration > 0 && sessionDuration < 720) {
        const currentAvg = data.averageSessionDuration || 0
        const totalDuration = currentAvg * (data.sessionCount - 1)
        data.averageSessionDuration = (totalDuration + sessionDuration) / (data.sessionCount - 1)
      }
    }
  
    data.lastInteractionTimestamp = new Date().toISOString()
    saveCookieData(data)
  }
  
  // Get personalization data for use in UI
  export function getPersonalizationData() {
    const data = getCookieData()
  
    // Get top 3 preferred categories
    const topCategories = Object.entries(data.categoryPreferences)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((entry) => entry[0])
  
    // Get top 5 tags
    const topTags = Object.entries(data.clickedTags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((entry) => entry[0])
  
    // Calculate engagement level
    const totalInteractions = Object.values(data.interactionScore).reduce((sum, score) => sum + score, 0)
    let engagementLevel = "low"
    if (totalInteractions > 50) engagementLevel = "high"
    else if (totalInteractions > 20) engagementLevel = "medium"
  
    // Return personalization object
    return {
      topCategories,
      recentlyViewed: data.viewedItems.slice(-5), // Last 5 viewed items
      topTags,
      recentSearches: data.searchTerms.slice(-3), // Last 3 searches
      preferredSortOrder: data.preferredSortOrder,
      priceRangePreference: data.priceRangePreference,
      engagementLevel,
      isReturningUser: data.sessionCount > 1,
      deviceInfo: data.deviceInfo,
    }
  }
  
  // Clear all cookie data (for privacy controls)
  export function clearCookieData(): void {
    if (typeof document === "undefined") return
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`
  }
  
  // Legacy function for backward compatibility
  export function useCookieTracking(pageName: string): void {
    // Call on component mount
    if (typeof window !== "undefined") {
      // Use setTimeout to ensure this runs after component mount
      setTimeout(() => {
        trackPageVisit(pageName)
        trackDeviceInfo()
  
        // Check if this is a new session (30+ minutes since last interaction)
        const data = getCookieData()
        if (data.lastInteractionTimestamp) {
          const lastInteraction = new Date(data.lastInteractionTimestamp).getTime()
          const now = new Date().getTime()
          const minutesSinceLastInteraction = (now - lastInteraction) / 1000 / 60
  
          if (minutesSinceLastInteraction > 30) {
            startNewSession()
          }
        }
      }, 0)
    }
  }
  
  