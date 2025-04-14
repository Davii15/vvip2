// Types
export interface Price {
    amount: number
    currency: string
  }
  
  export interface FlourProduct {
    id: number | string
    name: string
    imageUrl: string
    currentPrice: Price
    originalPrice: Price
    category: string
    subcategory: string
    subtype?: string
    description: string
    brand: string
    isNew?: boolean
    isPopular?: boolean
    dateAdded: string
    rating?: number
    reviewCount?: number
    colors?: string[]
    sizes?: string[]
    features?: string[]
    material?: string
    inStock: boolean
    stockCount?: number
    tags?: string[]
    hotDealEnds?: string
    discount?: number
    vendorId: number | string
    isHotDeal?: boolean
    images?: string[]
    nutritionalInfo?: {
      calories?: number | undefined
      protein?: number |undefined
      carbs?: number |undefined
      fiber?: number | undefined
      fat?: number | undefined
    }
    cookingTime?: string
    servingSize?: string
    origin?: string
    organicCertified?: boolean
    glutenFree?: boolean
    recipes?: string[]
  }
  
  export interface FlourVendor {
    id: number | string
    name: string
    location: string
    logo: string
    description: string
    products: FlourProduct[]
    redirectUrl: string
    mapLink: string
    defaultCurrency: string
    rating?: number
    reviewCount?: number
    deliveryTime?: string
    deliveryFee?: Price
    minimumOrder?: Price
    verified?: boolean
  }
  
  export interface FlourCategory {
    id: string
    name: string
    icon: string
    subcategories: FlourSubcategory[]
  }
  
  export interface FlourSubcategory {
    id: string
    name: string
    icon?: string
    subtypes?: FlourSubtype[]
  }
  
  export interface FlourSubtype {
    id: string
    name: string
  }
  
  // Helper function to format price
  export const formatPrice = (price: Price): string => {
    if (price.currency === "KSH" && price.amount >= 1000) {
      return `${price.currency} ${price.amount.toLocaleString()}`
    }
  
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currency,
      maximumFractionDigits: 0,
    }).format(price.amount)
  }
  
  // Get color scheme based on category
  export const getCategoryColors = (category: string) => {
    switch (category.toLowerCase()) {
      case "ugali flour":
        return {
          gradient: "from-amber-500 to-yellow-600",
          lightGradient: "from-amber-100 to-yellow-100",
          text: "text-amber-700",
          border: "border-amber-200",
          button: "bg-amber-600 hover:bg-amber-700",
          badge: "bg-amber-100 text-amber-800",
          highlight: "text-amber-600",
          bgLight: "bg-amber-50",
        }
      case "mandazi flour":
        return {
          gradient: "from-orange-500 to-red-500",
          lightGradient: "from-orange-100 to-red-100",
          text: "text-orange-700",
          border: "border-orange-200",
          button: "bg-orange-600 hover:bg-orange-700",
          badge: "bg-orange-100 text-orange-800",
          highlight: "text-orange-600",
          bgLight: "bg-orange-50",
        }
      case "chapati flour":
        return {
          gradient: "from-brown-500 to-amber-700",
          lightGradient: "from-amber-100 to-yellow-100",
          text: "text-amber-800",
          border: "border-amber-300",
          button: "bg-amber-700 hover:bg-amber-800",
          badge: "bg-amber-100 text-amber-800",
          highlight: "text-amber-700",
          bgLight: "bg-amber-50",
        }
      case "specialty flour":
        return {
          gradient: "from-emerald-500 to-teal-500",
          lightGradient: "from-emerald-100 to-teal-100",
          text: "text-teal-700",
          border: "border-teal-200",
          button: "bg-teal-600 hover:bg-teal-700",
          badge: "bg-teal-100 text-teal-800",
          highlight: "text-teal-600",
          bgLight: "bg-teal-50",
        }
      default:
        return {
          gradient: "from-amber-500 to-yellow-600",
          lightGradient: "from-amber-100 to-yellow-100",
          text: "text-amber-700",
          border: "border-amber-200",
          button: "bg-amber-600 hover:bg-amber-700",
          badge: "bg-amber-100 text-amber-800",
          highlight: "text-amber-600",
          bgLight: "bg-amber-50",
        }
    }
  }
  
  // Define categories and subcategories
  export const flourCategories: FlourCategory[] = [
    {
      id: "ugali-flour",
      name: "Ugali Flour",
      icon: "🌽",
      subcategories: [
        {
          id: "maize-flour",
          name: "Maize Flour",
          icon: "🌾",
          subtypes: [
            { id: "white-maize", name: "White Maize" },
            { id: "yellow-maize", name: "Yellow Maize" },
            { id: "fortified", name: "Fortified" },
            { id: "organic", name: "Organic" },
          ],
        },
        {
          id: "millet-flour",
          name: "Millet Flour",
          icon: "🌾",
          subtypes: [
            { id: "pearl-millet", name: "Pearl Millet" },
            { id: "finger-millet", name: "Finger Millet" },
            { id: "mixed-millet", name: "Mixed Millet" },
          ],
        },
        {
          id: "sorghum-flour",
          name: "Sorghum Flour",
          icon: "🌾",
          subtypes: [
            { id: "white-sorghum", name: "White Sorghum" },
            { id: "red-sorghum", name: "Red Sorghum" },
            { id: "mixed-sorghum", name: "Mixed Sorghum" },
          ],
        },
        {
          id: "cassava-flour",
          name: "Cassava Flour",
          icon: "🥔",
        },
      ],
    },
    {
      id: "mandazi-flour",
      name: "Mandazi Flour",
      icon: "🍩",
      subcategories: [
        {
          id: "wheat-flour",
          name: "Wheat Flour",
          icon: "🌾",
          subtypes: [
            { id: "all-purpose", name: "All-Purpose" },
            { id: "self-rising", name: "Self-Rising" },
            { id: "enriched", name: "Enriched" },
          ],
        },
        {
          id: "mixed-flour",
          name: "Mixed Flour",
          icon: "🌾",
          subtypes: [
            { id: "wheat-maize", name: "Wheat-Maize Mix" },
            { id: "wheat-cassava", name: "Wheat-Cassava Mix" },
            { id: "premium-mix", name: "Premium Mix" },
          ],
        },
        {
          id: "ready-mix",
          name: "Ready Mix",
          icon: "🥣",
          subtypes: [
            { id: "traditional", name: "Traditional" },
            { id: "spiced", name: "Spiced" },
            { id: "sweet", name: "Sweet" },
          ],
        },
      ],
    },
    {
      id: "chapati-flour",
      name: "Chapati Flour",
      icon: "🫓",
      subcategories: [
        {
          id: "atta-flour",
          name: "Atta Flour",
          icon: "🌾",
          subtypes: [
            { id: "fine-atta", name: "Fine Atta" },
            { id: "whole-wheat-atta", name: "Whole Wheat Atta" },
            { id: "premium-atta", name: "Premium Atta" },
          ],
        },
        {
          id: "whole-wheat",
          name: "Whole Wheat",
          icon: "🌾",
          subtypes: [
            { id: "stone-ground", name: "Stone Ground" },
            { id: "brown-wheat", name: "Brown Wheat" },
            { id: "organic-wheat", name: "Organic Wheat" },
          ],
        },
        {
          id: "ready-mix",
          name: "Ready Mix",
          icon: "🥣",
          subtypes: [
            { id: "traditional", name: "Traditional" },
            { id: "garlic-flavored", name: "Garlic Flavored" },
            { id: "herb-mix", name: "Herb Mix" },
          ],
        },
      ],
    },
    {
      id: "specialty-flour",
      name: "Specialty Flour",
      icon: "✨",
      subcategories: [
        {
          id: "gluten-free",
          name: "Gluten-Free",
          icon: "🌱",
          subtypes: [
            { id: "rice-flour", name: "Rice Flour" },
            { id: "coconut-flour", name: "Coconut Flour" },
            { id: "almond-flour", name: "Almond Flour" },
            { id: "cassava-flour", name: "Cassava Flour" },
          ],
        },
        {
          id: "multigrain",
          name: "Multigrain",
          icon: "🌾",
          subtypes: [
            { id: "three-grain", name: "Three Grain" },
            { id: "five-grain", name: "Five Grain" },
            { id: "seven-grain", name: "Seven Grain" },
          ],
        },
        {
          id: "fortified",
          name: "Fortified",
          icon: "💪",
          subtypes: [
            { id: "vitamin-enriched", name: "Vitamin Enriched" },
            { id: "protein-enriched", name: "Protein Enriched" },
            { id: "mineral-enriched", name: "Mineral Enriched" },
          ],
        },
      ],
    },
  ]
  
  // Mock data for vendors and products
  export const mockFlourVendors: FlourVendor[] = [
    // Ugali Flour Vendors
    {
      id: 1,
      name: "Unga Limited",
      location: "Nairobi, Kenya",
      logo: "/placeholder.svg?height=60&width=60&text=UL",
      description:
        "Kenya's premier maize flour producer with over 50 years of experience in providing quality flour for ugali.",
      redirectUrl: "https://ungalimited.com",
      mapLink: "https://www.google.com/maps",
      defaultCurrency: "KSH",
      rating: 4.8,
      reviewCount: 456,
      deliveryTime: "1-2 days",
      deliveryFee: { amount: 150, currency: "KSH" },
      minimumOrder: { amount: 500, currency: "KSH" },
      verified: true,
      products: [
        {
          id: 101,
          name: "Premium White Maize Flour - 2kg",
          imageUrl: "/placeholder.svg?height=300&width=400&text=White+Maize+Flour",
          currentPrice: { amount: 180, currency: "KSH" },
          originalPrice: { amount: 220, currency: "KSH" },
          category: "Ugali Flour",
          subcategory: "Maize Flour",
          subtype: "White Maize",
          description:
            "Premium quality white maize flour, finely milled for perfect ugali. Makes smooth, consistent ugali every time.",
          brand: "Unga Limited",
          isPopular: true,
          dateAdded: "2025-03-10T10:30:00Z",
          rating: 4.9,
          reviewCount: 234,
          sizes: ["1kg", "2kg", "5kg", "10kg"],
          features: ["Finely Milled", "No Preservatives", "Vitamin Enriched", "Smooth Texture"],
          inStock: true,
          stockCount: 450,
          tags: ["Ugali", "Maize", "White", "Premium"],
          nutritionalInfo: {
            calories: 120,
            protein: 3,
            carbs: 25,
            fiber: 1,
            fat: 0.5,
          },
          cookingTime: "15-20 minutes",
          servingSize: "100g",
          origin: "Kenya",
          vendorId: 1,
        },
        {
          id: 102,
          name: "Fortified Maize Flour - 5kg",
          imageUrl: "/placeholder.svg?height=300&width=400&text=Fortified+Maize+Flour",
          currentPrice: { amount: 420, currency: "KSH" },
          originalPrice: { amount: 500, currency: "KSH" },
          category: "Ugali Flour",
          subcategory: "Maize Flour",
          subtype: "Fortified",
          description:
            "Nutritionally enhanced maize flour fortified with essential vitamins and minerals. Perfect for families seeking healthier options.",
          brand: "Unga Limited",
          isNew: true,
          dateAdded: "2025-03-18T10:30:00Z",
          rating: 4.8,
          reviewCount: 156,
          sizes: ["2kg", "5kg", "10kg"],
          features: ["Vitamin A Fortified", "Iron Enriched", "Zinc Added", "Folic Acid"],
          inStock: true,
          stockCount: 320,
          tags: ["Ugali", "Maize", "Fortified", "Nutritious"],
          hotDealEnds: "2025-04-15T23:59:59Z",
          isHotDeal: true,
          nutritionalInfo: {
            calories: 120,
            protein: 3.5,
            carbs: 25,
            fiber: 1.2,
            fat: 0.5,
          },
          cookingTime: "15-20 minutes",
          servingSize: "100g",
          origin: "Kenya",
          vendorId: 1,
        },
        {
          id: 103,
          name: "Organic Yellow Maize Flour - 2kg",
          imageUrl: "/placeholder.svg?height=300&width=400&text=Yellow+Maize+Flour",
          currentPrice: { amount: 250, currency: "KSH" },
          originalPrice: { amount: 280, currency: "KSH" },
          category: "Ugali Flour",
          subcategory: "Maize Flour",
          subtype: "Yellow Maize",
          description:
            "Organic yellow maize flour with a rich, slightly sweet flavor. Makes golden ugali with a distinctive taste.",
          brand: "Unga Limited",
          dateAdded: "2025-02-25T10:30:00Z",
          rating: 4.7,
          reviewCount: 98,
          sizes: ["1kg", "2kg", "5kg"],
          features: ["Organic Certified", "Non-GMO", "Higher Beta-Carotene", "Rich Flavor"],
          inStock: true,
          stockCount: 180,
          tags: ["Ugali", "Maize", "Yellow", "Organic"],
          nutritionalInfo: {
            calories: 125,
            protein: 3.2,
            carbs: 26,
            fiber: 1.5,
            fat: 0.6,
          },
          cookingTime: "15-20 minutes",
          servingSize: "100g",
          origin: "Kenya",
          organicCertified: true,
          vendorId: 1,
        },
      ],
    },
    {
      id: 2,
      name: "Mama's Flour Mill",
      location: "Kisumu, Kenya",
      logo: "/placeholder.svg?height=60&width=60&text=MFM",
      description: "Family-owned flour mill specializing in traditional milling methods for authentic taste and texture.",
      redirectUrl: "https://mamasflourmill.com",
      mapLink: "https://www.google.com/maps",
      defaultCurrency: "KSH",
      rating: 4.9,
      reviewCount: 312,
      deliveryTime: "1-3 days",
      deliveryFee: { amount: 200, currency: "KSH" },
      minimumOrder: { amount: 800, currency: "KSH" },
      verified: true,
      products: [
        {
          id: 201,
          name: "Stone-Ground Millet Flour - 1kg",
          imageUrl: "/placeholder.svg?height=300&width=400&text=Millet+Flour",
          currentPrice: { amount: 220, currency: "KSH" },
          originalPrice: { amount: 250, currency: "KSH" },
          category: "Ugali Flour",
          subcategory: "Millet Flour",
          subtype: "Finger Millet",
          description:
            "Traditional stone-ground finger millet flour, perfect for nutritious brown ugali. Rich in minerals and fiber.",
          brand: "Mama's Flour Mill",
          isPopular: true,
          dateAdded: "2025-03-05T10:30:00Z",
          rating: 4.9,
          reviewCount: 178,
          sizes: ["500g", "1kg", "2kg"],
          features: ["Stone Ground", "High Fiber", "Rich in Iron", "Traditional Process"],
          inStock: true,
          stockCount: 120,
          tags: ["Ugali", "Millet", "Brown", "Traditional"],
          nutritionalInfo: {
            calories: 110,
            protein: 3.8,
            carbs: 22,
            fiber: 3.2,
            fat: 0.8,
          },
          cookingTime: "20-25 minutes",
          servingSize: "100g",
          origin: "Western Kenya",
          vendorId: 2,
        },
        {
          id: 202,
          name: "Mixed Millet & Sorghum Flour - 2kg",
          imageUrl: "/placeholder.svg?height=300&width=400&text=Mixed+Flour",
          currentPrice: { amount: 380, currency: "KSH" },
          originalPrice: { amount: 450, currency: "KSH" },
          category: "Ugali Flour",
          subcategory: "Millet Flour",
          subtype: "Mixed Millet",
          description:
            "Perfect blend of millet and sorghum flours for a nutritionally balanced ugali with rich, earthy flavor.",
          brand: "Mama's Flour Mill",
          isNew: true,
          dateAdded: "2025-03-15T10:30:00Z",
          rating: 4.8,
          reviewCount: 86,
          sizes: ["1kg", "2kg", "5kg"],
          features: ["Balanced Blend", "High Protein", "Rich Flavor", "Traditional Recipe"],
          inStock: true,
          stockCount: 85,
          tags: ["Ugali", "Millet", "Sorghum", "Mixed"],
          hotDealEnds: "2025-04-10T23:59:59Z",
          isHotDeal: true,
          nutritionalInfo: {
            calories: 115,
            protein: 4.2,
            carbs: 23,
            fiber: 3.5,
            fat: 0.9,
          },
          cookingTime: "20-25 minutes",
          servingSize: "100g",
          origin: "Western Kenya",
          vendorId: 2,
        },
        {
          id: 203,
          name: "Pure Cassava Flour - 1kg",
          imageUrl: "/placeholder.svg?height=300&width=400&text=Cassava+Flour",
          currentPrice: { amount: 180, currency: "KSH" },
          originalPrice: { amount: 200, currency: "KSH" },
          category: "Ugali Flour",
          subcategory: "Cassava Flour",
          description:
            "100% pure cassava flour for traditional coastal-style ugali. Smooth texture with a slightly sweet taste.",
          brand: "Mama's Flour Mill",
          dateAdded: "2025-02-28T10:30:00Z",
          rating: 4.7,
          reviewCount: 92,
          sizes: ["500g", "1kg", "2kg"],
          features: ["Gluten-Free", "Smooth Texture", "Coastal Recipe", "Pure Cassava"],
          inStock: true,
          stockCount: 75,
          tags: ["Ugali", "Cassava", "Coastal", "Gluten-Free"],
          nutritionalInfo: {
            calories: 130,
            protein: 1.2,
            carbs: 31,
            fiber: 1.8,
            fat: 0.3,
          },
          cookingTime: "15-20 minutes",
          servingSize: "100g",
          origin: "Coastal Kenya",
          glutenFree: true,
          vendorId: 2,
        },
      ],
    },
  
    // Mandazi Flour Vendors
    {
      id: 3,
      name: "Bakers' Choice",
      location: "Mombasa, Kenya",
      logo: "/placeholder.svg?height=60&width=60&text=BC",
      description:
        "Specialized flour products for East African pastries and snacks. Perfect for mandazi, mahamri, and other treats.",
      redirectUrl: "https://bakerschoice.com",
      mapLink: "https://www.google.com/maps",
      defaultCurrency: "KSH",
      rating: 4.7,
      reviewCount: 289,
      deliveryTime: "1-2 days",
      deliveryFee: { amount: 180, currency: "KSH" },
      minimumOrder: { amount: 600, currency: "KSH" },
      verified: true,
      products: [
        {
          id: 301,
          name: "Premium Mandazi Flour - 2kg",
          imageUrl: "/placeholder.svg?height=300&width=400&text=Mandazi+Flour",
          currentPrice: { amount: 240, currency: "KSH" },
          originalPrice: { amount: 280, currency: "KSH" },
          category: "Mandazi Flour",
          subcategory: "Wheat Flour",
          subtype: "All-Purpose",
          description:
            "Specially formulated all-purpose wheat flour for perfect mandazi. Makes light, fluffy mandazi with the ideal texture.",
          brand: "Bakers' Choice",
          isPopular: true,
          dateAdded: "2025-03-08T10:30:00Z",
          rating: 4.9,
          reviewCount: 167,
          sizes: ["1kg", "2kg", "5kg"],
          features: ["Fine Texture", "Consistent Results", "Perfect Rise", "Ideal for Frying"],
          inStock: true,
          stockCount: 230,
          tags: ["Mandazi", "Wheat", "Baking", "Pastry"],
          hotDealEnds: "2025-04-08T23:59:59Z",
          isHotDeal: true,
          nutritionalInfo: {
            calories: 140,
            protein: 4,
            carbs: 28,
            fiber: 0.8,
            fat: 0.5,
          },
          cookingTime: "Prep: 30 min, Fry: 5 min",
          servingSize: "100g",
          origin: "Kenya",
          recipes: ["Traditional Mandazi", "Coconut Mandazi", "Spiced Mandazi"],
          vendorId: 3,
        },
        {
          id: 302,
          name: "Self-Rising Mandazi Mix - 1kg",
          imageUrl: "/placeholder.svg?height=300&width=400&text=Self-Rising+Mix",
          currentPrice: { amount: 180, currency: "KSH" },
          originalPrice: { amount: 210, currency: "KSH" },
          category: "Mandazi Flour",
          subcategory: "Wheat Flour",
          subtype: "Self-Rising",
          description:
            "Convenient self-rising flour mix for quick and easy mandazi preparation. Just add water and sugar.",
          brand: "Bakers' Choice",
          isNew: true,
          dateAdded: "2025-03-18T10:30:00Z",
          rating: 4.7,
          reviewCount: 98,
          sizes: ["500g", "1kg", "2kg"],
          features: ["Self-Rising", "Quick Preparation", "Consistent Results", "No Yeast Needed"],
          inStock: true,
          stockCount: 180,
          tags: ["Mandazi", "Self-Rising", "Quick", "Easy"],
          nutritionalInfo: {
            calories: 145,
            protein: 4,
            carbs: 29,
            fiber: 0.8,
            fat: 0.5,
          },
          cookingTime: "Prep: 15 min, Fry: 5 min",
          servingSize: "100g",
          origin: "Kenya",
          recipes: ["Quick Mandazi", "Sweet Mandazi Bites"],
          vendorId: 3,
        },
      ],
    },
    {
      id: 4,
      name: "Coastal Flavors",
      location: "Malindi, Kenya",
      logo: "/placeholder.svg?height=60&width=60&text=CF",
      description:
        "Authentic coastal flour blends for traditional Swahili pastries and breads. Specializing in mandazi and mahamri.",
      redirectUrl: "https://coastalflavors.com",
      mapLink: "https://www.google.com/maps",
      defaultCurrency: "KSH",
      rating: 4.8,
      reviewCount: 245,
      deliveryTime: "2-4 days",
      deliveryFee: { amount: 250, currency: "KSH" },
      minimumOrder: { amount: 1000, currency: "KSH" },
      verified: true,
      products: [
        {
          id: 401,
          name: "Spiced Mandazi Ready Mix - 1kg",
          imageUrl: "/placeholder.svg?height=300&width=400&text=Spiced+Mandazi+Mix",
          currentPrice: { amount: 220, currency: "KSH" },
          originalPrice: { amount: 260, currency: "KSH" },
          category: "Mandazi Flour",
          subcategory: "Ready Mix",
          subtype: "Spiced",
          description:
            "Complete mandazi mix with traditional coastal spices. Just add water for authentic Swahili-style mandazi with cardamom and cinnamon notes.",
          brand: "Coastal Flavors",
          isPopular: true,
          dateAdded: "2025-03-05T10:30:00Z",
          rating: 4.9,
          reviewCount: 156,
          sizes: ["500g", "1kg", "2kg"],
          features: ["Pre-Spiced", "Authentic Flavor", "Complete Mix", "Traditional Recipe"],
          inStock: true,
          stockCount: 120,
          tags: ["Mandazi", "Spiced", "Coastal", "Ready Mix"],
          hotDealEnds: "2025-04-05T23:59:59Z",
          isHotDeal: true,
          nutritionalInfo: {
            calories: 150,
            protein: 3.8,
            carbs: 30,
            fiber: 1,
            fat: 0.6,
          },
          cookingTime: "Prep: 15 min, Fry: 5 min",
          servingSize: "100g",
          origin: "Coastal Kenya",
          recipes: ["Traditional Spiced Mandazi", "Coconut Cardamom Mandazi"],
          vendorId: 4,
        },
        {
          id: 402,
          name: "Wheat-Cassava Mandazi Flour - 2kg",
          imageUrl: "/placeholder.svg?height=300&width=400&text=Wheat-Cassava+Mix",
          currentPrice: { amount: 280, currency: "KSH" },
          originalPrice: { amount: 320, currency: "KSH" },
          category: "Mandazi Flour",
          subcategory: "Mixed Flour",
          subtype: "Wheat-Cassava Mix",
          description:
            "Special blend of wheat and cassava flours for authentic coastal mandazi with unique texture and flavor.",
          brand: "Coastal Flavors",
          dateAdded: "2025-02-20T10:30:00Z",
          rating: 4.8,
          reviewCount: 132,
          sizes: ["1kg", "2kg", "5kg"],
          features: ["Traditional Blend", "Authentic Texture", "Coastal Recipe", "Unique Flavor"],
          inStock: true,
          stockCount: 85,
          tags: ["Mandazi", "Mixed", "Cassava", "Coastal"],
          nutritionalInfo: {
            calories: 145,
            protein: 3.5,
            carbs: 30,
            fiber: 1.2,
            fat: 0.5,
          },
          cookingTime: "Prep: 30 min, Fry: 5 min",
          servingSize: "100g",
          origin: "Coastal Kenya",
          recipes: ["Coastal Mandazi", "Malindi-Style Mandazi"],
          vendorId: 4,
        },
        {
          id: 403,
          name: "Sweet Mandazi Premium Mix - 1kg",
          imageUrl: "/placeholder.svg?height=300&width=400&text=Sweet+Mandazi+Mix",
          currentPrice: { amount: 240, currency: "KSH" },
          originalPrice: { amount: 270, currency: "KSH" },
          category: "Mandazi Flour",
          subcategory: "Ready Mix",
          subtype: "Sweet",
          description:
            "Premium sweet mandazi mix with added sugar and vanilla. Perfect for dessert-style mandazi that kids love.",
          brand: "Coastal Flavors",
          isNew: true,
          dateAdded: "2025-03-12T10:30:00Z",
          rating: 4.7,
          reviewCount: 78,
          sizes: ["500g", "1kg", "2kg"],
          features: ["Pre-Sweetened", "Vanilla Flavor", "Kid-Friendly", "Easy Preparation"],
          inStock: true,
          stockCount: 95,
          tags: ["Mandazi", "Sweet", "Dessert", "Ready Mix"],
          nutritionalInfo: {
            calories: 160,
            protein: 3.5,
            carbs: 33,
            fiber: 0.8,
            fat: 0.6,
          },
          cookingTime: "Prep: 15 min, Fry: 5 min",
          servingSize: "100g",
          origin: "Coastal Kenya",
          recipes: ["Sweet Mandazi", "Vanilla Mandazi Bites", "Mandazi with Chocolate Dip"],
          vendorId: 4,
        },
      ],
    },
  
    // Chapati Flour Vendors
    {
      id: 5,
      name: "Chapati Masters",
      location: "Nairobi, Kenya",
      logo: "/placeholder.svg?height=60&width=60&text=CM",
      description:
        "Specialized flour products for perfect chapati every time. Our flours make soft, layered chapatis that stay fresh longer.",
      redirectUrl: "https://chapatimasters.com",
      mapLink: "https://www.google.com/maps",
      defaultCurrency: "KSH",
      rating: 4.9,
      reviewCount: 378,
      deliveryTime: "1-2 days",
      deliveryFee: { amount: 150, currency: "KSH" },
      minimumOrder: { amount: 500, currency: "KSH" },
      verified: true,
      products: [
        {
          id: 501,
          name: "Premium Atta Flour - 2kg",
          imageUrl: "/placeholder.svg?height=300&width=400&text=Atta+Flour",
          currentPrice: { amount: 220, currency: "KSH" },
          originalPrice: { amount: 250, currency: "KSH" },
          category: "Chapati Flour",
          subcategory: "Atta Flour",
          subtype: "Fine Atta",
          description:
            "Fine-milled atta flour perfect for soft, layered chapatis. Makes pliable dough that's easy to roll and cooks evenly.",
          brand: "Chapati Masters",
          isPopular: true,
          dateAdded: "2025-03-10T10:30:00Z",
          rating: 4.9,
          reviewCount: 215,
          sizes: ["1kg", "2kg", "5kg", "10kg"],
          features: ["Fine Texture", "Perfect Elasticity", "Even Cooking", "Soft Layers"],
          inStock: true,
          stockCount: 350,
          tags: ["Chapati", "Atta", "Soft", "Premium"],
          hotDealEnds: "2025-04-10T23:59:59Z",
          isHotDeal: true,
          nutritionalInfo: {
            calories: 135,
            protein: 4.5,
            carbs: 27,
            fiber: 2.2,
            fat: 0.5,
          },
          cookingTime: "Prep: 30 min, Cook: 2-3 min per chapati",
          servingSize: "100g",
          origin: "Kenya",
          recipes: ["Basic Soft Chapati", "Layered Chapati", "Chapati with Ghee"],
          vendorId: 5,
        },
        {
          id: 502,
          name: "Whole Wheat Chapati Flour - 2kg",
          imageUrl: "/placeholder.svg?height=300&width=400&text=Whole+Wheat+Chapati",
          currentPrice: { amount: 240, currency: "KSH" },
          originalPrice: { amount: 280, currency: "KSH" },
          category: "Chapati Flour",
          subcategory: "Whole Wheat",
          subtype: "Brown Wheat",
          description:
            "Nutritious whole wheat flour for healthier chapatis with nutty flavor and added fiber. Still makes soft chapatis with proper technique.",
          brand: "Chapati Masters",
          dateAdded: "2025-02-25T10:30:00Z",
          rating: 4.7,
          reviewCount: 168,
          sizes: ["1kg", "2kg", "5kg"],
          features: ["100% Whole Wheat", "High Fiber", "Nutty Flavor", "Nutritious"],
          inStock: true,
          stockCount: 180,
          tags: ["Chapati", "Whole Wheat", "Healthy", "Fiber"],
          nutritionalInfo: {
            calories: 130,
            protein: 5,
            carbs: 26,
            fiber: 3.5,
            fat: 0.7,
          },
          cookingTime: "Prep: 30 min, Cook: 2-3 min per chapati",
          servingSize: "100g",
          origin: "Kenya",
          recipes: ["Whole Wheat Chapati", "Multigrain Chapati"],
          vendorId: 5,
        },
      ],
    },
    {
      id: 6,
      name: "Traditional Tastes",
      location: "Eldoret, Kenya",
      logo: "/placeholder.svg?height=60&width=60&text=TT",
      description:
        "Authentic flour blends using traditional milling techniques for chapatis with homemade taste and texture.",
      redirectUrl: "https://traditionaltastes.com",
      mapLink: "https://www.google.com/maps",
      defaultCurrency: "KSH",
      rating: 4.8,
      reviewCount: 256,
      deliveryTime: "2-3 days",
      deliveryFee: { amount: 200, currency: "KSH" },
      minimumOrder: { amount: 800, currency: "KSH" },
      verified: true,
      products: [
        {
          id: 601,
          name: "Stone-Ground Chapati Flour - 2kg",
          imageUrl: "/placeholder.svg?height=300&width=400&text=Stone+Ground+Chapati",
          currentPrice: { amount: 260, currency: "KSH" },
          originalPrice: { amount: 300, currency: "KSH" },
          category: "Chapati Flour",
          subcategory: "Whole Wheat",
          subtype: "Stone Ground",
          description:
            "Traditional stone-ground wheat flour for authentic chapatis with rich flavor and perfect texture. Milled slowly to preserve nutrients.",
          brand: "Traditional Tastes",
          isPopular: true,
          dateAdded: "2025-03-08T10:30:00Z",
          rating: 4.9,
          reviewCount: 187,
          sizes: ["1kg", "2kg", "5kg"],
          features: ["Stone Ground", "Traditional Process", "Rich Flavor", "Nutrient Preserved"],
          inStock: true,
          stockCount: 150,
          tags: ["Chapati", "Stone Ground", "Traditional", "Authentic"],
          hotDealEnds: "2025-04-08T23:59:59Z",
          isHotDeal: true,
          nutritionalInfo: {
            calories: 130,
            protein: 4.8,
            carbs: 26,
            fiber: 3.2,
            fat: 0.6,
          },
          cookingTime: "Prep: 30 min, Cook: 2-3 min per chapati",
          servingSize: "100g",
          origin: "Rift Valley, Kenya",
          recipes: ["Traditional Chapati", "Layered Chapati", "Chapati with Ghee"],
          vendorId: 6,
        },
        {
          id: 602,
          name: "Garlic Chapati Ready Mix - 1kg",
          imageUrl: "/placeholder.svg?height=300&width=400&text=Garlic+Chapati+Mix",
          currentPrice: { amount: 220, currency: "KSH" },
          originalPrice: { amount: 250, currency: "KSH" },
          category: "Chapati Flour",
          subcategory: "Ready Mix",
          subtype: "Garlic Flavored",
          description:
            "Convenient chapati mix with garlic flavor for quick and delicious garlic chapatis. Just add water and oil.",
          brand: "Traditional Tastes",
          isNew: true,
          dateAdded: "2025-03-15T10:30:00Z",
          rating: 4.7,
          reviewCount: 92,
          sizes: ["500g", "1kg", "2kg"],
          features: ["Garlic Flavored", "Quick Preparation", "Consistent Results", "Ready Mix"],
          inStock: true,
          stockCount: 120,
          tags: ["Chapati", "Garlic", "Ready Mix", "Flavored"],
          nutritionalInfo: {
            calories: 140,
            protein: 4.5,
            carbs: 28,
            fiber: 2,
            fat: 0.8,
          },
          cookingTime: "Prep: 15 min, Cook: 2-3 min per chapati",
          servingSize: "100g",
          origin: "Kenya",
          recipes: ["Garlic Chapati", "Herb & Garlic Chapati"],
          vendorId: 6,
        },
      ],
    },
  
    // Specialty Flour Vendors
    {
      id: 7,
      name: "Health Harvest",
      location: "Nakuru, Kenya",
      logo: "/placeholder.svg?height=60&width=60&text=HH",
      description:
        "Specializing in nutritious, alternative flours for health-conscious consumers and those with dietary restrictions.",
      redirectUrl: "https://healthharvest.com",
      mapLink: "https://www.google.com/maps",
      defaultCurrency: "KSH",
      rating: 4.8,
      reviewCount: 198,
      deliveryTime: "2-4 days",
      deliveryFee: { amount: 250, currency: "KSH" },
      minimumOrder: { amount: 1000, currency: "KSH" },
      verified: true,
      products: [
        {
          id: 701,
          name: "Gluten-Free Flour Blend - 1kg",
          imageUrl: "/placeholder.svg?height=300&width=400&text=Gluten+Free+Blend",
          currentPrice: { amount: 380, currency: "KSH" },
          originalPrice: { amount: 450, currency: "KSH" },
          category: "Specialty Flour",
          subcategory: "Gluten-Free",
          description:
            "Special blend of rice, cassava, and potato flours for gluten-free baking and cooking. Works well for chapatis and mandazis.",
          brand: "Health Harvest",
          isPopular: true,
          dateAdded: "2025-03-10T10:30:00Z",
          rating: 4.8,
          reviewCount: 124,
          sizes: ["500g", "1kg", "2kg"],
          features: ["Gluten-Free", "Versatile", "Good Texture", "Allergen-Free"],
          inStock: true,
          stockCount: 85,
          tags: ["Gluten-Free", "Alternative", "Specialty", "Allergen-Free"],
          hotDealEnds: "2025-04-10T23:59:59Z",
          isHotDeal: true,
          nutritionalInfo: {
            calories: 150,
            protein: 2.5,
            carbs: 33,
            fiber: 1.5,
            fat: 0.5,
          },
          cookingTime: "Varies by recipe",
          servingSize: "100g",
          origin: "Kenya",
          glutenFree: true,
          recipes: ["Gluten-Free Chapati", "Gluten-Free Mandazi", "Gluten-Free Pancakes"],
          vendorId: 7,
        },
        {
          id: 702,
          name: "Coconut Flour - 500g",
          imageUrl: "/placeholder.svg?height=300&width=400&text=Coconut+Flour",
          currentPrice: { amount: 320, currency: "KSH" },
          originalPrice: { amount: 380, currency: "KSH" },
          category: "Specialty Flour",
          subcategory: "Gluten-Free",
          subtype: "Coconut Flour",
          description:
            "100% pure coconut flour, high in fiber and protein. Perfect for low-carb and gluten-free baking with tropical flavor.",
          brand: "Health Harvest",
          isNew: true,
          dateAdded: "2025-03-18T10:30:00Z",
          rating: 4.7,
          reviewCount: 86,
          sizes: ["250g", "500g", "1kg"],
          features: ["High Fiber", "Low Carb", "Gluten-Free", "Coconut Flavor"],
          inStock: true,
          stockCount: 60,
          tags: ["Coconut", "Gluten-Free", "Low-Carb", "Specialty"],
          nutritionalInfo: {
            calories: 120,
            protein: 6,
            carbs: 18,
            fiber: 10,
            fat: 4,
          },
          cookingTime: "Varies by recipe",
          servingSize: "100g",
          origin: "Coastal Kenya",
          glutenFree: true,
          organicCertified: true,
          recipes: ["Coconut Flatbread", "Coconut Pancakes", "Low-Carb Wraps"],
          vendorId: 7,
        },
      ],
    },
    {
      id: 8,
      name: "Nutrition Plus",
      location: "Thika, Kenya",
      logo: "/placeholder.svg?height=60&width=60&text=NP",
      description:
        "Fortified and enriched flour products designed to enhance nutrition while maintaining great taste and texture.",
      redirectUrl: "https://nutritionplus.com",
      mapLink: "https://www.google.com/maps",
      defaultCurrency: "KSH",
      rating: 4.7,
      reviewCount: 176,
      deliveryTime: "2-3 days",
      deliveryFee: { amount: 200, currency: "KSH" },
      minimumOrder: { amount: 800, currency: "KSH" },
      verified: true,
      products: [
        {
          id: 801,
          name: "7-Grain Flour Blend - 2kg",
          imageUrl: "/placeholder.svg?height=300&width=400&text=7-Grain+Blend",
          currentPrice: { amount: 350, currency: "KSH" },
          originalPrice: { amount: 420, currency: "KSH" },
          category: "Specialty Flour",
          subcategory: "Multigrain",
          subtype: "Seven Grain",
          description:
            "Nutritious blend of seven whole grains including wheat, millet, sorghum, barley, oats, maize, and rice. Perfect for hearty chapatis and breads.",
          brand: "Nutrition Plus",
          isPopular: true,
          dateAdded: "2025-03-05T10:30:00Z",
          rating: 4.8,
          reviewCount: 112,
          sizes: ["1kg", "2kg", "5kg"],
          features: ["7 Whole Grains", "High Fiber", "Nutrient Dense", "Rich Flavor"],
          inStock: true,
          stockCount: 95,
          tags: ["Multigrain", "Nutritious", "Whole Grain", "Specialty"],
          hotDealEnds: "2025-04-05T23:59:59Z",
          isHotDeal: true,
          nutritionalInfo: {
            calories: 125,
            protein: 5.5,
            carbs: 25,
            fiber: 4.2,
            fat: 0.8,
          },
          cookingTime: "Prep: 30 min, Cook: 2-3 min per chapati",
          servingSize: "100g",
          origin: "Kenya",
          recipes: ["Multigrain Chapati", "Hearty Flatbread", "Multigrain Pancakes"],
          vendorId: 8,
        },
        {
          id: 802,
          name: "Protein-Enriched Flour - 1kg",
          imageUrl: "/placeholder.svg?height=300&width=400&text=Protein+Flour",
          currentPrice: { amount: 280, currency: "KSH" },
          originalPrice: { amount: 320, currency: "KSH" },
          category: "Specialty Flour",
          subcategory: "Fortified",
          subtype: "Protein Enriched",
          description:
            "Wheat flour enriched with plant-based proteins for higher protein content. Ideal for active individuals and growing children.",
          brand: "Nutrition Plus",
          isNew: true,
          dateAdded: "2025-03-15T10:30:00Z",
          rating: 4.7,
          reviewCount: 78,
          sizes: ["500g", "1kg", "2kg"],
          features: ["High Protein", "Plant-Based", "Fortified", "Nutritious"],
          inStock: true,
          stockCount: 70,
          tags: ["Protein", "Fortified", "Nutritious", "Specialty"],
          nutritionalInfo: {
            calories: 140,
            protein: 8,
            carbs: 24,
            fiber: 2,
            fat: 0.6,
          },
          cookingTime: "Varies by recipe",
          servingSize: "100g",
          origin: "Kenya",
          recipes: ["High-Protein Chapati", "Protein Pancakes", "Protein Bread"],
          vendorId: 8,
        },
      ],
    },
  ]
  
  // Helper function to transform vendors to products
  export const transformFlourToProducts = (vendors: FlourVendor[]) => {
    return vendors.flatMap((vendor) =>
      vendor.products.map((product) => ({
        ...product,
        vendorName: vendor.name,
        vendorLocation: vendor.location,
      })),
    )
  }
  
  // Generate trending and popular products
  export const trendingFlourProducts = mockFlourVendors
    .flatMap((vendor) => vendor.products)
    .filter((product) => product.isNew || product.isHotDeal)
    .slice(0, 6)
    .map((product) => ({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      currentPrice: product.currentPrice,
      originalPrice: product.originalPrice,
      category: product.category,
      description: product.description.substring(0, 80) + "...",
      brand: product.brand,
      rating: product.rating,
      reviewCount: product.reviewCount,
      vendorId: product.vendorId,
      vendorName: mockFlourVendors.find((v) => v.id === product.vendorId)?.name || "",
    }))
  
  export const popularFlourProducts = mockFlourVendors
    .flatMap((vendor) => vendor.products)
    .filter((product) => product.isPopular)
    .slice(0, 6)
    .map((product) => ({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      currentPrice: product.currentPrice,
      originalPrice: product.originalPrice,
      category: product.category,
      description: product.description.substring(0, 80) + "...",
      brand: product.brand,
      rating: product.rating,
      reviewCount: product.reviewCount,
      vendorId: product.vendorId,
      vendorName: mockFlourVendors.find((v) => v.id === product.vendorId)?.name || "",
    }))
  