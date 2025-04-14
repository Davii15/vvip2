// Types
interface Price {
  amount: number
  currency: string
}

export interface Product {
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
  description?: string
  // Other product properties...
}

// Helper function to normalize price objects
function normalizePrice(price: any, defaultCurrency = "KSH"): Price {
  if (typeof price === "object" && price !== null) {
    return {
      amount: price.amount,
      currency: price.currency || defaultCurrency,
    }
  }
  return {
    amount: typeof price === "number" ? price : 0,
    currency: defaultCurrency,
  }
}

// Helper function to ensure a valid date string
function ensureValidDate(dateString?: string): string {
  if (!dateString) return new Date().toISOString()

  try {
    // Check if it's a valid date string
    new Date(dateString).toISOString()
    return dateString
  } catch (e) {
    // Return current date if invalid
    return new Date().toISOString()
  }
}

// Transform car deals data to product format
export function transformCarDealsToProducts(vendors: any[]): Product[] {
  return vendors.flatMap((vendor) =>
    (vendor.cars || []).map((car: any) => ({
      id: car.id,
      name: car.name,
      imageUrl: car.imageUrl,
      currentPrice: normalizePrice(car.currentPrice),
      originalPrice: normalizePrice(car.originalPrice),
      category: car.type,
      dateAdded: ensureValidDate(car.dateAdded),
      isNew: car.isNew,
      isHotDeal: car.isHotDeal,
      hotDealEnds: car.hotDealEnds,
      description: car.description,
    })),
  )
}

// Transform retail products data to product format
export function transformRetailToProducts(vendors: any[]): Product[] {
  return vendors.flatMap((vendor) =>
    (vendor.products || []).map((product: any) => ({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      currentPrice: normalizePrice(product.currentPrice),
      originalPrice: normalizePrice(product.originalPrice),
      category: product.category,
      dateAdded: ensureValidDate(product.dateAdded),
      isNew: product.isNew,
      isHotDeal: product.isHotDeal,
      hotDealEnds: product.hotDealEnds,
      description: product.description,
    })),
  )
}

// Transform beauty/massage services data to product format
export function transformBeautyServicesToProducts(vendors: any[]): Product[] {
  return vendors.flatMap((vendor) =>
    (vendor.services || []).map((service: any) => ({
      id: service.id,
      name: service.name,
      imageUrl: service.imageUrl,
      currentPrice: normalizePrice(service.currentPrice),
      originalPrice: normalizePrice(service.originalPrice),
      category: service.type,
      dateAdded: ensureValidDate(service.dateAdded),
      isNew: service.isNew,
      isHotDeal: service.isHotDeal,
      hotDealEnds: service.hotDealEnds,
      description: service.description,
    })),
  )
}

// Transform hospitality data to product format
export function transformHospitalityToProducts(vendors: any[]): Product[] {
  return vendors.flatMap((vendor) =>
    (vendor.accommodations || []).map((accommodation: any) => ({
      id: accommodation.id,
      name: accommodation.name,
      imageUrl: accommodation.imageUrl,
      currentPrice: normalizePrice(accommodation.currentPrice),
      originalPrice: normalizePrice(accommodation.originalPrice),
      category: accommodation.type,
      dateAdded: ensureValidDate(accommodation.dateAdded),
      isNew: accommodation.isNew,
      isHotDeal: accommodation.isHotDeal,
      hotDealEnds: accommodation.hotDealEnds,
      description: accommodation.description,
    })),
  )
}

// Transform agriculture deals data to product format
export function transformAgricultureToProducts(vendors: any[]): Product[] {
  return vendors.flatMap((vendor) =>
    (vendor.products || vendor.items || vendor.agriculturalProducts || []).map((product: any) => ({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      currentPrice: normalizePrice(product.currentPrice),
      originalPrice: normalizePrice(product.originalPrice),
      category: product.category || product.type,
      dateAdded: ensureValidDate(product.dateAdded),
      isNew: product.isNew,
      isHotDeal: product.isHotDeal,
      hotDealEnds: product.hotDealEnds,
      description: product.description,
    })),
  )
}

// Transform entertainment data to product format
export function transformEntertainmentToProducts(vendors: any[]): Product[] {
  return vendors.flatMap((vendor) =>
    (vendor.events || vendor.activities || vendor.entertainmentOptions || []).map((item: any) => ({
      id: item.id,
      name: item.name || item.title,
      imageUrl: item.imageUrl || item.image,
      currentPrice: normalizePrice(item.currentPrice || item.price),
      originalPrice: normalizePrice(item.originalPrice || item.regularPrice),
      category: item.category || item.type,
      dateAdded: ensureValidDate(item.dateAdded),
      isNew: item.isNew,
      isHotDeal: item.isHotDeal,
      hotDealEnds: item.hotDealEnds,
      description: item.description,
    })),
  )
}

// Transform health services data to product format
export function transformHealthServicesToProducts(vendors: any[]): Product[] {
  return vendors.flatMap((vendor) =>
    (vendor.services || vendor.treatments || vendor.healthServices || []).map((service: any) => ({
      id: service.id,
      name: service.name,
      imageUrl: service.imageUrl,
      currentPrice: normalizePrice(service.currentPrice),
      originalPrice: normalizePrice(service.originalPrice),
      category: service.category || service.type,
      dateAdded: ensureValidDate(service.dateAdded),
      isNew: service.isNew,
      isHotDeal: service.isHotDeal,
      hotDealEnds: service.hotDealEnds,
      description: service.description,
    })),
  )
}

// Transform insurance data to product format
export function transformInsuranceToProducts(vendors: any[]): Product[] {
  return vendors.flatMap((vendor) =>
    (vendor.policies || vendor.plans || vendor.insuranceProducts || []).map((policy: any) => ({
      id: policy.id,
      name: policy.name || policy.title,
      imageUrl: policy.imageUrl || policy.image,
      currentPrice: normalizePrice(policy.currentPrice || policy.premium),
      originalPrice: normalizePrice(policy.originalPrice || policy.standardPremium),
      category: policy.category || policy.type,
      dateAdded: ensureValidDate(policy.dateAdded),
      isNew: policy.isNew,
      isHotDeal: policy.isHotDeal,
      hotDealEnds: policy.hotDealEnds,
      description: policy.description,
    })),
  )
}

// Transform other business ventures data to product format
export function transformBusinessVenturesToProducts(vendors: any[]): Product[] {
  return vendors.flatMap((vendor) =>
    (vendor.opportunities || vendor.ventures || vendor.businessOptions || []).map((venture: any) => ({
      id: venture.id,
      name: venture.name || venture.title,
      imageUrl: venture.imageUrl || venture.image,
      currentPrice: normalizePrice(venture.currentPrice || venture.investmentAmount),
      originalPrice: normalizePrice(venture.originalPrice || venture.standardInvestment),
      category: venture.category || venture.type,
      dateAdded: ensureValidDate(venture.dateAdded),
      isNew: venture.isNew,
      isHotDeal: venture.isHotDeal,
      hotDealEnds: venture.hotDealEnds,
      description: venture.description,
    })),
  )
}

// Transform real estate data to product format
export function transformRealEstateToProducts(vendors: any[]): Product[] {
  return vendors.flatMap((vendor) =>
    (vendor.properties || vendor.listings || vendor.realEstateListings || []).map((property: any) => ({
      id: property.id,
      name: property.name || property.title,
      imageUrl: property.imageUrl || property.image,
      currentPrice: normalizePrice(property.currentPrice || property.price),
      originalPrice: normalizePrice(property.originalPrice || property.marketPrice),
      category: property.category || property.type,
      dateAdded: ensureValidDate(property.dateAdded),
      isNew: property.isNew,
      isHotDeal: property.isHotDeal,
      hotDealEnds: property.hotDealEnds,
      description: property.description,
    })),
  )
}

// Transform tourism and adventures data to product format
export function transformTourismToProducts(vendors: any[]): Product[] {
  return vendors.flatMap((vendor) =>
    (vendor.tours || vendor.adventures || vendor.packages || []).map((tour: any) => ({
      id: tour.id,
      name: tour.name || tour.title,
      imageUrl: tour.imageUrl || tour.image,
      currentPrice: normalizePrice(tour.currentPrice || tour.price),
      originalPrice: normalizePrice(tour.originalPrice || tour.regularPrice),
      category: tour.category || tour.type,
      dateAdded: ensureValidDate(tour.dateAdded),
      isNew: tour.isNew,
      isHotDeal: tour.isHotDeal,
      hotDealEnds: tour.hotDealEnds,
      description: tour.description,
    })),
  )
}

// Transform travelling data to product format
export function transformTravellingToProducts(vendors: any[]): Product[] {
  return vendors.flatMap((vendor) =>
    (vendor.trips || vendor.destinations || vendor.travelPackages || []).map((trip: any) => ({
      id: trip.id,
      name: trip.name || trip.title,
      imageUrl: trip.imageUrl || trip.image,
      currentPrice: normalizePrice(trip.currentPrice || trip.price),
      originalPrice: normalizePrice(trip.originalPrice || trip.regularPrice),
      category: trip.category || trip.type,
      dateAdded: ensureValidDate(trip.dateAdded),
      isNew: trip.isNew,
      isHotDeal: trip.isHotDeal,
      hotDealEnds: trip.hotDealEnds,
      description: trip.description,
    })),
  )
}

// Transform finance data to product format
export function transformFinanceToProducts(vendors: any[]): Product[] {
  return vendors.flatMap((vendor) =>
    (vendor.financialProducts || vendor.loans || vendor.investments || vendor.services || []).map((product: any) => ({
      id: product.id,
      name: product.name || product.title,
      imageUrl: product.imageUrl || product.image,
      currentPrice: normalizePrice(product.currentPrice || product.interestRate || product.fee || product.amount),
      originalPrice: normalizePrice(
        product.originalPrice || product.standardRate || product.standardFee || product.standardAmount,
      ),
      category: product.category || product.type,
      dateAdded: ensureValidDate(product.dateAdded),
      isNew: product.isNew,
      isHotDeal: product.isHotDeal,
      hotDealEnds: product.hotDealEnds,
      description: product.description,
    })),
  )
}

