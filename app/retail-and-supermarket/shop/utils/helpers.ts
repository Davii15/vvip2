import type { Price, Product, HotDeal } from "../types"

// Helper function to format price
export const formatPrice = (price: Price): string => {
  return `${price.currency} ${price.amount.toLocaleString()}`
}

// Helper function to format date
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Helper function to calculate discount percentage
export const calculateDiscount = (original: Price, current: Price): number => {
  if (original.amount <= current.amount) return 0
  return Math.round(((original.amount - current.amount) / original.amount) * 100)
}

// Helper function to get hot deals from products
export const getHotDeals = (products: Product[], limit = 8): HotDeal[] => {
  return products
    .filter(
      (product) =>
        product.isHotDeal ||
        (product.originalPrice.amount - product.currentPrice.amount) / product.originalPrice.amount > 0.15,
    )
    .map((product) => ({
      id: product.id,
      name: product.name,
      imageUrl: product.image,
      currentPrice: product.currentPrice,
      originalPrice: product.originalPrice,
      category: product.category,
      expiresAt: product.hotDealEnds || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: product.description,
      discount: calculateDiscount(product.originalPrice, product.currentPrice),
    }))
    .sort((a, b) => b.discount - a.discount)
    .slice(0, limit)
}

// Helper function to get products by market
export const getProductsByMarket = (products: Product[], marketId: string, limit?: number): Product[] => {
  const marketProducts = products.filter((product) => product.market === marketId)
  return limit ? marketProducts.slice(0, limit) : marketProducts
}

// Helper function to get products by category
export const getProductsByCategory = (products: Product[], category: string): Product[] => {
  return products.filter((product) => product.category === category)
}

// Helper function to get products by subcategory
export const getProductsBySubCategory = (products: Product[], subCategory: string): Product[] => {
  return products.filter((product) => product.subCategory === subCategory)
}

// Helper function to get unique vendors from products
export const getUniqueVendors = (products: Product[]): string[] => {
  return [...new Set(products.map((product) => product.vendor).filter(Boolean))] as string[]
}

// Helper function to filter and sort products
export const filterAndSortProducts = (
  products: Product[],
  {
    searchQuery = "",
    category = "all",
    subCategory = null,
    vendor = null,
    priceRange = { min: 0, max: 1000 },
    sortOption = "featured",
  }: {
    searchQuery?: string
    category?: string
    subCategory?: string | null
    vendor?: string | null
    priceRange?: { min: number; max: number }
    sortOption?: string
  },
): Product[] => {
  let result = [...products]

  // Filter by search query
  if (searchQuery) {
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.vendor && product.vendor.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }

  // Filter by category
  if (category !== "all") {
    result = result.filter((product) => product.category === category)
  }

  // Filter by subcategory
  if (subCategory) {
    result = result.filter((product) => product.subCategory === subCategory)
  }

  // Filter by vendor
  if (vendor) {
    result = result.filter((product) => product.vendor === vendor)
  }

  // Filter by price range
  result = result.filter((product) => {
    return product.currentPrice.amount >= priceRange.min && product.currentPrice.amount <= priceRange.max
  })

  // Sort products
  switch (sortOption) {
    case "price-low":
      result.sort((a, b) => a.currentPrice.amount - b.currentPrice.amount)
      break
    case "price-high":
      result.sort((a, b) => b.currentPrice.amount - a.currentPrice.amount)
      break
    case "rating":
      result.sort((a, b) => b.rating - a.rating)
      break
    case "newest":
      result.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1))
      break
    case "discount":
      result.sort((a, b) => {
        const discountA = calculateDiscount(a.originalPrice, a.currentPrice)
        const discountB = calculateDiscount(b.originalPrice, b.currentPrice)
        return discountB - discountA
      })
      break
    default: // featured
      result.sort((a, b) => {
        if (a.isHotDeal && !b.isHotDeal) return -1
        if (!a.isHotDeal && b.isHotDeal) return 1
        if (a.isFeatured && !b.isFeatured) return -1
        if (!a.isFeatured && b.isFeatured) return 1
        return 0
      })
  }

  return result
}

