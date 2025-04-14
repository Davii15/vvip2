"use client"

import { useState, useEffect } from "react"
import Cookies from "js-cookie"

// Types
interface Price {
  amount: number
  currency: string
}

interface Product {
  id: number | string
  name: string
  imageUrl: string
  currentPrice: Price
  originalPrice: Price
  category?: string
  dateAdded: string
  isNew?: boolean
  isHotDeal?: boolean
  hotDealEnds?: string
  // Other product properties...
}

interface RecommendationData {
  lastVisit: string
  viewedProducts: (number | string)[]
  viewedCategories: Record<string, number>
}

const COOKIE_NAME = "product_recommendation_data"
const COOKIE_EXPIRY = 30 // days

export function useProductRecommendations(allProducts: Product[], currentProductId?: number | string) {
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [lastVisitDate, setLastVisitDate] = useState<Date | null>(null)

  useEffect(() => {
    // Initialize or update cookie data
    const initCookieData = () => {
      const now = new Date()
      let data: RecommendationData

      // Try to get existing cookie data
      const cookieData = Cookies.get(COOKIE_NAME)

      if (cookieData) {
        try {
          data = JSON.parse(cookieData)

          // Store last visit date for display purposes
          setLastVisitDate(new Date(data.lastVisit))

          // Update last visit to current time
          data.lastVisit = now.toISOString()

          // Add current product to viewed products if provided
          if (currentProductId !== undefined && !data.viewedProducts.includes(currentProductId)) {
            data.viewedProducts.push(currentProductId)
          }

          // Update viewed categories if current product is provided
          if (currentProductId !== undefined) {
            const currentProduct = allProducts.find((p) => p.id === currentProductId)
            if (currentProduct?.category) {
              data.viewedCategories[currentProduct.category] = (data.viewedCategories[currentProduct.category] || 0) + 1
            }
          }
        } catch (e) {
          // If cookie data is corrupted, create new data
          data = createNewCookieData(now, currentProductId, allProducts)
        }
      } else {
        // No existing cookie, create new data
        data = createNewCookieData(now, currentProductId, allProducts)
      }

      // Save updated cookie data
      Cookies.set(COOKIE_NAME, JSON.stringify(data), {
        expires: COOKIE_EXPIRY,
        sameSite: "lax",
      })

      // Generate recommendations based on cookie data
      generateRecommendations(data, allProducts, currentProductId)
    }

    initCookieData()
  }, [allProducts, currentProductId])

  // Helper function to create new cookie data
  const createNewCookieData = (
    now: Date,
    currentProductId?: number | string,
    products?: Product[],
  ): RecommendationData => {
    const data: RecommendationData = {
      lastVisit: now.toISOString(),
      viewedProducts: [],
      viewedCategories: {},
    }

    if (currentProductId !== undefined) {
      data.viewedProducts.push(currentProductId)

      const currentProduct = products?.find((p) => p.id === currentProductId)
      if (currentProduct?.category) {
        data.viewedCategories[currentProduct.category] = 1
      }
    }

    return data
  }

  // Generate recommendations based on cookie data
  const generateRecommendations = (
    data: RecommendationData,
    products: Product[],
    currentProductId?: number | string,
  ) => {
    // Find products added since last visit
    if (data.lastVisit) {
      const lastVisitDate = new Date(data.lastVisit)
      const newProductsList = products.filter((product) => {
        // Skip current product
        if (product.id === currentProductId) return false

        // Skip already viewed products
        if (data.viewedProducts.some((id) => id === product.id)) return false

        // Check if product was added after last visit
        const productAddedDate = new Date(product.dateAdded)
        return productAddedDate > lastVisitDate
      })

      setNewProducts(newProductsList.slice(0, 8)) // Limit to 8 products
    }

    // Find related products based on categories the user has viewed
    if (Object.keys(data.viewedCategories).length > 0) {
      // Sort categories by view count to prioritize most viewed
      const sortedCategories = Object.entries(data.viewedCategories)
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0])

      const relatedProductsList = products.filter((product) => {
        // Skip current product
        if (product.id === currentProductId) return false

        // Skip already viewed products
        if (data.viewedProducts.some((id) => id === product.id)) return false

        // Include products from categories the user has viewed
        return product.category && sortedCategories.includes(product.category)
      })

      setRelatedProducts(relatedProductsList.slice(0, 8)) // Limit to 8 products
    }
  }

  return {
    newProducts,
    relatedProducts,
    lastVisitDate,
    hasViewedBefore: lastVisitDate !== null,
  }
}

