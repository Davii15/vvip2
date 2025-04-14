export type AgricultureVendor = {
    id: string
    name: string
    logo: string
    rating: number
    reviewCount: number
    categories: string[]
    products: AgricultureProduct[]
    featured: boolean
    established: string
    location: string
    certifications: string[]
    sustainabilityScore: number // 1-10 rating
  }
  
  export type AgricultureProduct = {
    id: string
    name: string
    description: string
    price: number
    discountedPrice?: number
    image: string
    category: string
    inStock: boolean
    stockQuantity: number
    rating: number
    reviewCount: number
    isNew: boolean
    isBestSeller: boolean
    isOrganic: boolean
    plantingZones?: string[]
    growingSeason?: string[]
    harvestTime?: string
    daysToMaturity?: number
    waterRequirements?: "Low" | "Medium" | "High"
    sunRequirements?: "Full Sun" | "Partial Shade" | "Full Shade"
    soilType?: string[]
    companionPlants?: string[]
    pestResistance?: "Low" | "Medium" | "High"
    warranty?: string
    shippingInfo?: string
  }
  
  export type AgricultureCategory = {
    id: string
    name: string
    icon: string
    description: string
    color: string
  }
  
  // Helper function to format price
  export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price)
  }
  
  // Helper function to calculate discount percentage
  export const calculateDiscountPercentage = (originalPrice: number, discountedPrice: number): number => {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
  }
  
  // Helper function to get current growing season
  export const getCurrentSeason = (): string => {
    const month = new Date().getMonth()
    if (month >= 2 && month <= 4) return "Spring"
    if (month >= 5 && month <= 7) return "Summer"
    if (month >= 8 && month <= 10) return "Fall"
    return "Winter"
  }
  
  // Categories
  export const agricultureCategories: AgricultureCategory[] = [
    {
      id: "seeds",
      name: "Seeds & Plants",
      icon: "seedling",
      description: "High-quality seeds and plants for your garden or farm",
      color: "#2E7D32", // Dark green
    },
    {
      id: "equipment",
      name: "Farm Equipment",
      icon: "tractor",
      description: "Tools and machinery for efficient farming",
      color: "#D84315", // Rust/orange
    },
    {
      id: "fertilizers",
      name: "Fertilizers & Soil",
      icon: "flask",
      description: "Nutrients and soil amendments for optimal growth",
      color: "#795548", // Brown
    },
    {
      id: "irrigation",
      name: "Irrigation Systems",
      icon: "droplet",
      description: "Water management solutions for all farm sizes",
      color: "#0288D1", // Blue
    },
    {
      id: "livestock",
      name: "Livestock Supplies",
      icon: "cow",
      description: "Products for animal care and management",
      color: "#FFA000", // Amber
    },
    {
      id: "organic",
      name: "Organic Products",
      icon: "leaf",
      description: "Certified organic farming supplies",
      color: "#558B2F", // Light green
    },
    {
      id: "harvest",
      name: "Harvesting Tools",
      icon: "scissors",
      description: "Equipment for efficient crop collection",
      color: "#BF360C", // Deep orange
    },
  ]
  
  // Mock vendors data
  export const agricultureVendors: AgricultureVendor[] = [
    {
      id: "green-thumb-farms",
      name: "Green Thumb Farms",
      logo: "/placeholder.svg?height=80&width=80",
      rating: 4.8,
      reviewCount: 1243,
      categories: ["seeds", "organic"],
      featured: true,
      established: "1985",
      location: "Oregon, USA",
      certifications: ["USDA Organic", "Non-GMO Project Verified"],
      sustainabilityScore: 9,
      products: [
        {
          id: "heirloom-tomato-seeds",
          name: "Heirloom Tomato Seeds Collection",
          description:
            "A diverse collection of 12 rare heirloom tomato varieties, perfect for home gardeners looking to grow unique, flavorful tomatoes with rich histories. Each packet contains 25 seeds with high germination rates.",
          price: 24.99,
          discountedPrice: 19.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "seeds",
          inStock: true,
          stockQuantity: 150,
          rating: 4.9,
          reviewCount: 328,
          isNew: false,
          isBestSeller: true,
          isOrganic: true,
          plantingZones: ["3-9"],
          growingSeason: ["Spring", "Summer"],
          harvestTime: "Mid to Late Summer",
          daysToMaturity: 75,
          waterRequirements: "Medium",
          sunRequirements: "Full Sun",
          soilType: ["Well-drained", "Loamy"],
          companionPlants: ["Basil", "Marigold", "Carrots"],
          pestResistance: "Medium",
          shippingInfo: "Ships within 2 business days",
        },
        {
          id: "organic-herb-garden-kit",
          name: "Organic Herb Garden Starter Kit",
          description:
            "Complete kit with everything needed to start an organic herb garden. Includes 6 varieties of certified organic herb seeds, biodegradable pots, organic soil discs, and bamboo plant markers.",
          price: 34.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "seeds",
          inStock: true,
          stockQuantity: 75,
          rating: 4.7,
          reviewCount: 192,
          isNew: true,
          isBestSeller: false,
          isOrganic: true,
          plantingZones: ["All Zones (Indoor)"],
          growingSeason: ["Year-round"],
          daysToMaturity: 21,
          waterRequirements: "Medium",
          sunRequirements: "Partial Shade",
          soilType: ["Well-drained"],
          companionPlants: ["All herbs compatible"],
          pestResistance: "Medium",
          warranty: "100% germination guarantee",
          shippingInfo: "Ships within 2 business days",
        },
        {
          id: "butterfly-garden-seeds",
          name: "Butterfly & Pollinator Garden Mix",
          description:
            "Attract beneficial pollinators to your garden with this specially formulated seed mix. Contains 16 wildflower varieties known to attract butterflies, bees, and other pollinators.",
          price: 18.99,
          discountedPrice: 15.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "seeds",
          inStock: true,
          stockQuantity: 200,
          rating: 4.8,
          reviewCount: 156,
          isNew: false,
          isBestSeller: false,
          isOrganic: true,
          plantingZones: ["3-10"],
          growingSeason: ["Spring", "Summer"],
          harvestTime: "Summer to Fall",
          daysToMaturity: 45,
          waterRequirements: "Low",
          sunRequirements: "Full Sun",
          soilType: ["Well-drained", "Sandy"],
          pestResistance: "High",
          shippingInfo: "Ships within 2 business days",
        },
      ],
    },
    {
      id: "harvest-tech",
      name: "Harvest Technologies",
      logo: "/placeholder.svg?height=80&width=80",
      rating: 4.6,
      reviewCount: 876,
      categories: ["equipment", "irrigation"],
      featured: true,
      established: "2005",
      location: "California, USA",
      certifications: ["ISO 9001", "Energy Star Partner"],
      sustainabilityScore: 8,
      products: [
        {
          id: "smart-irrigation-controller",
          name: "Smart Irrigation Controller System",
          description:
            "Advanced irrigation controller that uses weather data, soil moisture sensors, and AI to optimize watering schedules. Reduces water usage by up to 50% while improving plant health.",
          price: 249.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "irrigation",
          inStock: true,
          stockQuantity: 45,
          rating: 4.7,
          reviewCount: 128,
          isNew: true,
          isBestSeller: true,
          isOrganic: false,
          warranty: "3-year manufacturer warranty",
          shippingInfo: "Free shipping on orders over $200",
        },
        {
          id: "drip-irrigation-kit",
          name: "Complete Drip Irrigation Kit - 1/4 Acre",
          description:
            "Water-efficient drip irrigation system designed for small farms and large gardens. Kit includes tubing, emitters, filters, pressure regulators, and all fittings needed for installation.",
          price: 189.99,
          discountedPrice: 159.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "irrigation",
          inStock: true,
          stockQuantity: 30,
          rating: 4.5,
          reviewCount: 94,
          isNew: false,
          isBestSeller: false,
          isOrganic: false,
          warranty: "2-year manufacturer warranty",
          shippingInfo: "Ships within 3-5 business days",
        },
        {
          id: "soil-moisture-sensors",
          name: "Wireless Soil Moisture Sensor Set",
          description:
            "Set of 5 wireless soil moisture sensors that connect to your smartphone. Monitor soil conditions in real-time and receive alerts when plants need watering.",
          price: 129.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "irrigation",
          inStock: true,
          stockQuantity: 60,
          rating: 4.4,
          reviewCount: 76,
          isNew: true,
          isBestSeller: false,
          isOrganic: false,
          warranty: "1-year manufacturer warranty",
          shippingInfo: "Ships within 2 business days",
        },
      ],
    },
    {
      id: "terra-organics",
      name: "Terra Organics",
      logo: "/placeholder.svg?height=80&width=80",
      rating: 4.9,
      reviewCount: 1567,
      categories: ["fertilizers", "organic"],
      featured: true,
      established: "1998",
      location: "Vermont, USA",
      certifications: ["USDA Organic", "OMRI Listed", "B Corp Certified"],
      sustainabilityScore: 10,
      products: [
        {
          id: "premium-compost",
          name: "Premium Organic Compost - 40lb Bag",
          description:
            "Nutrient-rich organic compost made from plant materials, aged manure, and beneficial microorganisms. Perfect for enriching garden soil and promoting healthy plant growth.",
          price: 29.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "fertilizers",
          inStock: true,
          stockQuantity: 200,
          rating: 4.9,
          reviewCount: 312,
          isNew: false,
          isBestSeller: true,
          isOrganic: true,
          soilType: ["All soil types"],
          shippingInfo: "Local delivery available in select areas",
        },
        {
          id: "worm-castings",
          name: "Pure Worm Castings - 25lb Bag",
          description:
            "Premium worm castings produced by red wigglers fed on organic matter. Rich in micronutrients and beneficial microbes that enhance soil health and plant growth.",
          price: 34.99,
          discountedPrice: 29.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "fertilizers",
          inStock: true,
          stockQuantity: 150,
          rating: 4.8,
          reviewCount: 187,
          isNew: false,
          isBestSeller: false,
          isOrganic: true,
          soilType: ["All soil types"],
          shippingInfo: "Ships within 3 business days",
        },
        {
          id: "liquid-seaweed",
          name: "Organic Liquid Seaweed Fertilizer - 1 Gallon",
          description:
            "Concentrated liquid seaweed extract that provides essential trace elements and growth hormones. Improves plant resilience to stress and enhances fruit and flower production.",
          price: 39.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "fertilizers",
          inStock: true,
          stockQuantity: 85,
          rating: 4.7,
          reviewCount: 143,
          isNew: true,
          isBestSeller: false,
          isOrganic: true,
          waterRequirements: "Medium",
          shippingInfo: "Ships within 2 business days",
        },
      ],
    },
    {
      id: "farm-machinery-depot",
      name: "Farm Machinery Depot",
      logo: "/placeholder.svg?height=80&width=80",
      rating: 4.5,
      reviewCount: 932,
      categories: ["equipment", "harvest"],
      featured: false,
      established: "1972",
      location: "Iowa, USA",
      certifications: ["ISO 9001", "Certified Dealer Network"],
      sustainabilityScore: 6,
      products: [
        {
          id: "electric-garden-tiller",
          name: "Electric Garden Tiller & Cultivator",
          description:
            "Powerful electric tiller with 8.5-amp motor and 4 steel tines. Perfect for small to medium gardens, flower beds, and raised planters. Adjustable tilling width and depth.",
          price: 179.99,
          discountedPrice: 149.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "equipment",
          inStock: true,
          stockQuantity: 25,
          rating: 4.6,
          reviewCount: 87,
          isNew: false,
          isBestSeller: true,
          isOrganic: false,
          warranty: "2-year manufacturer warranty",
          shippingInfo: "Free shipping",
        },
        {
          id: "pruning-shears-set",
          name: "Professional Pruning Shears Set",
          description:
            "Set of 3 high-quality pruning tools including bypass pruners, hedge shears, and long-reach fruit picker. Made with hardened steel blades and ergonomic handles.",
          price: 89.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "harvest",
          inStock: true,
          stockQuantity: 50,
          rating: 4.7,
          reviewCount: 124,
          isNew: false,
          isBestSeller: false,
          isOrganic: false,
          warranty: "5-year manufacturer warranty",
          shippingInfo: "Ships within 2 business days",
        },
        {
          id: "garden-cart",
          name: "Heavy-Duty Garden Cart - 600lb Capacity",
          description:
            "Durable garden cart with steel frame and pneumatic tires. Features a 600lb weight capacity, removable sides, and easy-dump mechanism. Perfect for hauling soil, plants, and harvests.",
          price: 219.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "equipment",
          inStock: true,
          stockQuantity: 15,
          rating: 4.8,
          reviewCount: 76,
          isNew: true,
          isBestSeller: false,
          isOrganic: false,
          warranty: "3-year manufacturer warranty",
          shippingInfo: "Ships within 5-7 business days",
        },
      ],
    },
    {
      id: "livestock-essentials",
      name: "Livestock Essentials",
      logo: "/placeholder.svg?height=80&width=80",
      rating: 4.7,
      reviewCount: 845,
      categories: ["livestock"],
      featured: false,
      established: "2001",
      location: "Texas, USA",
      certifications: ["Animal Welfare Approved", "Certified Humane"],
      sustainabilityScore: 8,
      products: [
        {
          id: "poultry-feed-organic",
          name: "Organic Poultry Feed - 40lb Bag",
          description:
            "Premium organic feed formulated for laying hens. Contains a balanced blend of grains, seeds, and minerals to support egg production and bird health. No antibiotics or hormones.",
          price: 42.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "livestock",
          inStock: true,
          stockQuantity: 100,
          rating: 4.8,
          reviewCount: 156,
          isNew: false,
          isBestSeller: true,
          isOrganic: true,
          shippingInfo: "Ships within 3 business days",
        },
        {
          id: "chicken-coop-automatic",
          name: "Automatic Chicken Coop Door Kit",
          description:
            "Solar-powered automatic door opener and closer for chicken coops. Features light sensor technology to open at dawn and close at dusk. Includes timer override and manual control.",
          price: 159.99,
          discountedPrice: 139.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "livestock",
          inStock: true,
          stockQuantity: 30,
          rating: 4.6,
          reviewCount: 92,
          isNew: true,
          isBestSeller: false,
          isOrganic: false,
          warranty: "1-year manufacturer warranty",
          shippingInfo: "Ships within 2 business days",
        },
        {
          id: "beekeeping-starter",
          name: "Complete Beekeeping Starter Kit",
          description:
            "Everything needed to start beekeeping. Includes assembled hive, protective gear, tools, and comprehensive guide. Bees sold separately.",
          price: 299.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "livestock",
          inStock: true,
          stockQuantity: 10,
          rating: 4.9,
          reviewCount: 78,
          isNew: false,
          isBestSeller: false,
          isOrganic: false,
          warranty: "2-year manufacturer warranty on hive components",
          shippingInfo: "Ships within 5-7 business days",
        },
      ],
    },
    {
      id: "sustainable-solutions",
      name: "Sustainable Farming Solutions",
      logo: "/placeholder.svg?height=80&width=80",
      rating: 4.8,
      reviewCount: 723,
      categories: ["equipment", "irrigation", "organic"],
      featured: true,
      established: "2010",
      location: "Washington, USA",
      certifications: ["B Corp Certified", "Carbon Neutral Certified"],
      sustainabilityScore: 9,
      products: [
        {
          id: "rainwater-harvesting",
          name: "Complete Rainwater Harvesting System - 500 Gallon",
          description:
            "Integrated system for collecting, filtering, and storing rainwater for garden use. Includes 500-gallon food-grade tank, first-flush diverter, filtration system, and pump.",
          price: 1299.99,
          discountedPrice: 1099.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "irrigation",
          inStock: true,
          stockQuantity: 5,
          rating: 4.9,
          reviewCount: 42,
          isNew: false,
          isBestSeller: true,
          isOrganic: false,
          warranty: "10-year manufacturer warranty on tank, 2-year on components",
          shippingInfo: "Free white glove delivery and installation available",
        },
        {
          id: "solar-electric-fence",
          name: "Solar-Powered Electric Fence Energizer",
          description:
            "Maintenance-free solar electric fence system. Includes 10W solar panel, battery, energizer, and monitoring system. Effective for livestock containment and predator exclusion.",
          price: 249.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "livestock",
          inStock: true,
          stockQuantity: 20,
          rating: 4.7,
          reviewCount: 68,
          isNew: true,
          isBestSeller: false,
          isOrganic: false,
          warranty: "3-year manufacturer warranty",
          shippingInfo: "Ships within 2 business days",
        },
        {
          id: "compost-tumbler",
          name: "Dual-Chamber Compost Tumbler",
          description:
            "Efficient composting system with two 27-gallon chambers. Fill one side while the other side cures. Aerated internal bar, sturdy steel frame, and rodent-resistant design.",
          price: 189.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "fertilizers",
          inStock: true,
          stockQuantity: 25,
          rating: 4.8,
          reviewCount: 114,
          isNew: false,
          isBestSeller: false,
          isOrganic: true,
          warranty: "5-year manufacturer warranty",
          shippingInfo: "Ships within 3-5 business days",
        },
      ],
    },
    {
      id: "heritage-seeds",
      name: "Heritage Seed Company",
      logo: "/placeholder.svg?height=80&width=80",
      rating: 4.9,
      reviewCount: 1876,
      categories: ["seeds", "organic"],
      featured: true,
      established: "1989",
      location: "New Mexico, USA",
      certifications: ["USDA Organic", "Non-GMO Project Verified", "Seed Savers Exchange Partner"],
      sustainabilityScore: 10,
      products: [
        {
          id: "rare-vegetable-collection",
          name: "Rare Heirloom Vegetable Collection - 15 Varieties",
          description:
            "Curated collection of 15 rare and endangered vegetable varieties with cultural significance. Each variety comes with detailed growing instructions and history.",
          price: 49.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "seeds",
          inStock: true,
          stockQuantity: 50,
          rating: 4.9,
          reviewCount: 237,
          isNew: false,
          isBestSeller: true,
          isOrganic: true,
          plantingZones: ["3-9"],
          growingSeason: ["Spring", "Summer"],
          harvestTime: "Varies by variety",
          waterRequirements: "Low",
          sunRequirements: "Full Sun",
          soilType: ["Well-drained"],
          warranty: "100% germination guarantee",
          shippingInfo: "Ships within 2 business days",
        },
        {
          id: "native-wildflower-mix",
          name: "Regional Native Wildflower Mix",
          description:
            "Region-specific wildflower seed mixes containing only species native to your area. Supports local pollinators and ecosystems. Available for 6 different US regions.",
          price: 24.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "seeds",
          inStock: true,
          stockQuantity: 100,
          rating: 4.8,
          reviewCount: 183,
          isNew: false,
          isBestSeller: false,
          isOrganic: true,
          plantingZones: ["All US Zones (region-specific)"],
          growingSeason: ["Spring", "Fall"],
          harvestTime: "Perennial",
          waterRequirements: "Low",
          sunRequirements: "Full Sun",
          soilType: ["Native soil"],
          pestResistance: "High",
          warranty: "100% germination guarantee",
          shippingInfo: "Ships within 2 business days",
        },
        {
          id: "medicinal-herb-collection",
          name: "Medicinal Herb Seed Collection",
          description:
            "Collection of 12 traditional medicinal herb seeds with detailed growing instructions and historical medicinal uses. For educational purposes only.",
          price: 34.99,
          discountedPrice: 29.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "seeds",
          inStock: true,
          stockQuantity: 75,
          rating: 4.7,
          reviewCount: 126,
          isNew: true,
          isBestSeller: false,
          isOrganic: true,
          plantingZones: ["4-9"],
          growingSeason: ["Spring", "Summer"],
          harvestTime: "Summer to Fall",
          waterRequirements: "Medium",
          sunRequirements: "Partial Shade",
          soilType: ["Well-drained", "Rich"],
          warranty: "100% germination guarantee",
          shippingInfo: "Ships within 2 business days",
        },
      ],
    },
    {
      id: "precision-ag",
      name: "Precision Agriculture Technologies",
      logo: "/placeholder.svg?height=80&width=80",
      rating: 4.6,
      reviewCount: 542,
      categories: ["equipment", "irrigation"],
      featured: false,
      established: "2015",
      location: "Nebraska, USA",
      certifications: ["ISO 9001", "IoT Certified Devices"],
      sustainabilityScore: 8,
      products: [
        {
          id: "soil-test-kit-pro",
          name: "Professional Soil Testing Kit with Digital Reader",
          description:
            "Comprehensive soil testing kit that analyzes NPK levels, pH, and micronutrients. Includes digital reader, 50 test capsules, and smartphone app integration for record keeping.",
          price: 149.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "equipment",
          inStock: true,
          stockQuantity: 35,
          rating: 4.7,
          reviewCount: 98,
          isNew: true,
          isBestSeller: true,
          isOrganic: false,
          warranty: "2-year manufacturer warranty",
          shippingInfo: "Ships within 2 business days",
        },
        {
          id: "weather-station",
          name: "Wireless Weather Station for Agriculture",
          description:
            "Professional-grade weather monitoring system with sensors for temperature, humidity, rainfall, wind, and solar radiation. Includes data logging and smartphone alerts.",
          price: 299.99,
          discountedPrice: 249.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "equipment",
          inStock: true,
          stockQuantity: 20,
          rating: 4.8,
          reviewCount: 76,
          isNew: false,
          isBestSeller: false,
          isOrganic: false,
          warranty: "3-year manufacturer warranty",
          shippingInfo: "Ships within 3 business days",
        },
        {
          id: "drone-crop-monitor",
          name: "Agricultural Drone with Multispectral Camera",
          description:
            "Specialized drone for crop monitoring with automated flight paths and multispectral imaging. Identifies plant stress, pest issues, and irrigation problems before visible to the naked eye.",
          price: 1999.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "equipment",
          inStock: true,
          stockQuantity: 5,
          rating: 4.9,
          reviewCount: 32,
          isNew: true,
          isBestSeller: false,
          isOrganic: false,
          warranty: "1-year manufacturer warranty",
          shippingInfo: "Free shipping with insurance",
        },
      ],
    },
  ]
  
  // Current season products
  export const getCurrentSeasonProducts = (): AgricultureProduct[] => {
    const currentSeason = getCurrentSeason()
    const seasonalProducts: AgricultureProduct[] = []
  
    agricultureVendors.forEach((vendor) => {
      vendor.products.forEach((product) => {
        if (product.growingSeason && product.growingSeason.includes(currentSeason)) {
          seasonalProducts.push(product)
        }
      })
    })
  
    return seasonalProducts
  }
  
  // Get products by category
  export const getProductsByCategory = (categoryId: string): AgricultureProduct[] => {
    const categoryProducts: AgricultureProduct[] = []
  
    agricultureVendors.forEach((vendor) => {
      vendor.products.forEach((product) => {
        if (product.category === categoryId) {
          categoryProducts.push(product)
        }
      })
    })
  
    return categoryProducts
  }
  
  // Get organic products
  export const getOrganicProducts = (): AgricultureProduct[] => {
    const organicProducts: AgricultureProduct[] = []
  
    agricultureVendors.forEach((vendor) => {
      vendor.products.forEach((product) => {
        if (product.isOrganic) {
          organicProducts.push(product)
        }
      })
    })
  
    return organicProducts
  }
  
  // Get vendors by certification
  export const getVendorsByCertification = (certification: string): AgricultureVendor[] => {
    return agricultureVendors.filter((vendor) => vendor.certifications.includes(certification))
  }
  
  // Get products suitable for a specific planting zone
  export const getProductsByPlantingZone = (zone: string): AgricultureProduct[] => {
    const zoneProducts: AgricultureProduct[] = []
  
    agricultureVendors.forEach((vendor) => {
      vendor.products.forEach((product) => {
        if (
          product.plantingZones &&
          product.plantingZones.some((z) => {
            // Handle ranges like "3-9"
            if (z.includes("-")) {
              const [min, max] = z.split("-").map(Number)
              const zoneNum = Number.parseInt(zone)
              return zoneNum >= min && zoneNum <= max
            }
            return z === zone
          })
        ) {
          zoneProducts.push(product)
        }
      })
    })
  
    return zoneProducts
  }
  
  