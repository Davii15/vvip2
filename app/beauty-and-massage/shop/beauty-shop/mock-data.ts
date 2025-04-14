// Types
interface Price {
  amount: number
  currency: string
}

interface BeautyProduct {
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

interface BeautyVendor {
  id: string
  name: string
  logo: string
  category: "skincare" | "makeup" | "haircare" | "fragrance"
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
  products: BeautyProduct[]
  amenities: string[]
  images: string[]
}

// Helper function to format price
export const formatPrice = (price: Price): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount)
}

// Mock data for beauty vendors
export const beautyVendors: BeautyVendor[] = [
  // Skincare Vendors
  {
    id: "glow-essentials",
    name: "Glow Essentials",
    logo: "/placeholder.svg?height=80&width=80",
    category: "skincare",
    description:
      "Premium skincare products formulated with natural ingredients to nourish and rejuvenate your skin for a radiant glow.",
    rating: 4.8,
    reviewCount: 324,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 712 345 678",
      email: "info@glowessentials.co.ke",
      website: "www.glowessentials.co.ke",
    },
    openingHours: "Mon-Sun: 9:00 AM - 8:00 PM",
    amenities: ["Free Skin Consultation", "Product Testing", "Loyalty Program", "Gift Wrapping", "Online Orders"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "vitamin-c-serum",
        name: "Vitamin C Brightening Serum",
        description:
          "Powerful antioxidant serum that brightens skin tone, reduces dark spots, and boosts collagen production.",
        price: { amount: 3500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Serums",
        tags: ["Brightening", "Anti-aging", "Vitamin C"],
      },
      {
        id: "hyaluronic-moisturizer",
        name: "Hyaluronic Acid Moisturizer",
        description: "Deeply hydrating moisturizer that locks in moisture for plump, supple skin all day long.",
        price: { amount: 2800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Moisturizers",
        tags: ["Hydrating", "Plumping", "All Skin Types"],
      },
      {
        id: "clay-mask",
        name: "Purifying Clay Mask",
        description: "Deep-cleansing mask that draws out impurities, unclogs pores, and refines skin texture.",
        price: { amount: 1800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Masks",
        tags: ["Purifying", "Pore-refining", "Detoxifying"],
      },
      {
        id: "retinol-night-cream",
        name: "Retinol Night Repair Cream",
        description: "Advanced night cream with retinol that reduces fine lines and wrinkles while you sleep.",
        price: { amount: 4200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Night Care",
        tags: ["Anti-aging", "Retinol", "Overnight Repair"],
      },
    ],
  },
  {
    id: "natural-beauty",
    name: "Natural Beauty",
    logo: "/placeholder.svg?height=80&width=80",
    category: "skincare",
    description:
      "Organic skincare brand using ethically sourced ingredients to create effective, eco-friendly beauty products.",
    rating: 4.7,
    reviewCount: 256,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 723 456 789",
      email: "hello@naturalbeauty.com",
      website: "www.naturalbeauty.com",
    },
    openingHours: "Tue-Sun: 10:00 AM - 7:00 PM, Closed on Mondays",
    amenities: [
      "Organic Certification",
      "Eco-friendly Packaging",
      "Vegan Options",
      "Cruelty-free",
      "Recycling Program",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "aloe-cleanser",
        name: "Aloe Vera Gentle Cleanser",
        description:
          "Gentle, sulfate-free cleanser with aloe vera that removes impurities without stripping natural oils.",
        price: { amount: 1500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Cleansers",
        tags: ["Gentle", "Hydrating", "Sensitive Skin"],
      },
      {
        id: "rosehip-oil",
        name: "Organic Rosehip Facial Oil",
        description:
          "Nutrient-rich facial oil that hydrates, brightens, and repairs skin with essential fatty acids and antioxidants.",
        price: { amount: 2500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Facial Oils",
        tags: ["Organic", "Nourishing", "Anti-aging"],
      },
      {
        id: "honey-mask",
        name: "Honey & Oat Soothing Mask",
        description: "Calming mask with honey and colloidal oatmeal that soothes irritation and reduces redness.",
        price: { amount: 1600, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Masks",
        tags: ["Soothing", "Anti-inflammatory", "Sensitive Skin"],
      },
      {
        id: "shea-body-butter",
        name: "Whipped Shea Body Butter",
        description:
          "Rich, luxurious body butter that deeply moisturizes dry skin with organic shea butter and coconut oil.",
        price: { amount: 1800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Body Care",
        tags: ["Moisturizing", "Dry Skin", "Natural"],
      },
    ],
  },

  // Makeup Vendors
  {
    id: "glam-cosmetics",
    name: "Glam Cosmetics",
    logo: "/placeholder.svg?height=80&width=80",
    category: "makeup",
    description: "High-performance makeup products with vibrant colors and long-lasting formulas for every skin tone.",
    rating: 4.9,
    reviewCount: 189,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 734 567 890",
      email: "info@glamcosmetics.co.ke",
      website: "www.glamcosmetics.co.ke",
    },
    openingHours: "Mon-Sat: 9:00 AM - 8:00 PM, Sun: 11:00 AM - 6:00 PM",
    amenities: ["Makeup Testing", "Color Matching", "Makeup Tutorials", "Loyalty Program", "Gift Sets"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "foundation-pro",
        name: "Pro Coverage Foundation",
        description: "Buildable, medium-to-full coverage foundation with a natural finish that lasts all day.",
        price: { amount: 2800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Face",
        tags: ["Foundation", "Long-lasting", "Natural Finish"],
      },
      {
        id: "eyeshadow-palette",
        name: "Sunset Glow Eyeshadow Palette",
        description: "Versatile palette with 12 highly-pigmented matte and shimmer shades inspired by sunset hues.",
        price: { amount: 3200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Eyes",
        tags: ["Eyeshadow", "Pigmented", "Versatile"],
      },
      {
        id: "liquid-lipstick",
        name: "Matte Liquid Lipstick",
        description: "Long-wearing, transfer-proof liquid lipstick with a comfortable matte finish.",
        price: { amount: 1500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Lips",
        tags: ["Matte", "Long-lasting", "Transfer-proof"],
      },
      {
        id: "highlighter-glow",
        name: "Dewy Glow Highlighter",
        description: "Creamy highlighter that creates a natural, dewy glow without emphasizing texture.",
        price: { amount: 1800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Face",
        tags: ["Highlighter", "Dewy", "Natural Glow"],
      },
    ],
  },
  {
    id: "beauty-essentials",
    name: "Beauty Essentials",
    logo: "/placeholder.svg?height=80&width=80",
    category: "makeup",
    description: "Affordable, high-quality makeup essentials for everyday beauty routines with inclusive shade ranges.",
    rating: 4.6,
    reviewCount: 215,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 745 678 901",
      email: "hello@beautyessentials.co.ke",
      website: "www.beautyessentials.co.ke",
    },
    openingHours: "Mon-Sun: 8:00 AM - 9:00 PM",
    amenities: ["Budget-friendly", "Starter Kits", "Student Discount", "Makeup Classes", "Online Tutorials"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "bb-cream",
        name: "Everyday BB Cream",
        description: "Lightweight BB cream that evens skin tone, hydrates, and provides SPF 30 protection.",
        price: { amount: 1200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Face",
        tags: ["BB Cream", "SPF", "Lightweight"],
      },
      {
        id: "mascara-volume",
        name: "Volume Boost Mascara",
        description: "Volumizing mascara that adds dramatic thickness and length without clumping.",
        price: { amount: 950, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Eyes",
        tags: ["Mascara", "Volumizing", "Lengthening"],
      },
      {
        id: "blush-duo",
        name: "Blush & Bronzer Duo",
        description: "Two-in-one compact with complementary blush and bronzer shades for a perfect flush and warmth.",
        price: { amount: 1400, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Face",
        tags: ["Blush", "Bronzer", "Duo"],
      },
      {
        id: "lip-tint",
        name: "Hydrating Lip Tint",
        description: "Moisturizing lip tint that provides sheer, buildable color and all-day hydration.",
        price: { amount: 850, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Lips",
        tags: ["Lip Tint", "Hydrating", "Sheer"],
      },
    ],
  },

  // Haircare Vendors
  {
    id: "hair-luxe",
    name: "Hair Luxe",
    logo: "/placeholder.svg?height=80&width=80",
    category: "haircare",
    description:
      "Luxury haircare products that repair, strengthen, and enhance all hair types with premium ingredients.",
    rating: 4.8,
    reviewCount: 178,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 756 789 012",
      email: "care@hairluxe.co.ke",
      website: "www.hairluxe.co.ke",
    },
    openingHours: "Mon-Sat: 9:00 AM - 7:00 PM, Sun: Closed",
    amenities: ["Hair Consultation", "Product Testing", "Hair Analysis", "Custom Recommendations", "Loyalty Program"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "repair-shampoo",
        name: "Bond Repair Shampoo",
        description: "Strengthening shampoo that repairs damaged bonds and prevents breakage for healthier hair.",
        price: { amount: 2500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Shampoo",
        tags: ["Repair", "Strengthening", "Damaged Hair"],
      },
      {
        id: "hydrating-mask",
        name: "Intense Hydration Hair Mask",
        description: "Deep conditioning mask that restores moisture to dry, damaged hair for silky softness.",
        price: { amount: 3000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Treatments",
        tags: ["Hydrating", "Deep Conditioning", "Dry Hair"],
      },
      {
        id: "hair-oil",
        name: "Nourishing Hair Oil",
        description: "Lightweight, multi-purpose oil that adds shine, tames frizz, and protects from heat damage.",
        price: { amount: 2200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Styling",
        tags: ["Oil", "Anti-frizz", "Heat Protection"],
      },
      {
        id: "scalp-treatment",
        name: "Purifying Scalp Treatment",
        description: "Exfoliating treatment that removes buildup, soothes irritation, and promotes a healthy scalp.",
        price: { amount: 2800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Treatments",
        tags: ["Scalp Care", "Exfoliating", "Purifying"],
      },
    ],
  },
  {
    id: "curl-specialists",
    name: "Curl Specialists",
    logo: "/placeholder.svg?height=80&width=80",
    category: "haircare",
    description: "Specialized haircare products designed specifically for curly, coily, and textured hair types.",
    rating: 4.7,
    reviewCount: 145,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 767 890 123",
      email: "hello@curlspecialists.co.ke",
      website: "www.curlspecialists.co.ke",
    },
    openingHours: "Tue-Sun: 10:00 AM - 6:00 PM, Closed on Mondays",
    amenities: ["Curl Pattern Analysis", "Product Recommendations", "Styling Tutorials", "Curl Community Events"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "curl-cleanser",
        name: "Moisturizing Co-Wash Cleanser",
        description: "Gentle, sulfate-free cleansing conditioner that cleans without stripping natural oils.",
        price: { amount: 1800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Cleansers",
        tags: ["Co-Wash", "Moisturizing", "Sulfate-free"],
      },
      {
        id: "curl-cream",
        name: "Curl Definition Cream",
        description: "Moisturizing cream that defines and enhances natural curl pattern while reducing frizz.",
        price: { amount: 2200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Styling",
        tags: ["Curl Definition", "Anti-frizz", "Moisturizing"],
      },
      {
        id: "protein-treatment",
        name: "Protein Strengthening Treatment",
        description: "Protein-rich treatment that strengthens and repairs damaged, weak curls.",
        price: { amount: 2500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Treatments",
        tags: ["Protein", "Strengthening", "Repair"],
      },
      {
        id: "curl-refresher",
        name: "Curl Reviving Spray",
        description: "Refreshing spray that reactivates and rejuvenates second-day curls with moisture and bounce.",
        price: { amount: 1500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Styling",
        tags: ["Refresher", "Moisture", "Second-day Curls"],
      },
    ],
  },

  // Fragrance Vendors
  {
    id: "scent-haven",
    name: "Scent Haven",
    logo: "/placeholder.svg?height=80&width=80",
    category: "fragrance",
    description:
      "Curated collection of luxury fragrances from around the world, including exclusive and niche perfumes.",
    rating: 4.9,
    reviewCount: 312,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 778 901 234",
      email: "info@scenthaven.co.ke",
      website: "www.scenthaven.co.ke",
    },
    openingHours: "Mon-Sat: 10:00 AM - 8:00 PM, Sun: 12:00 PM - 6:00 PM",
    amenities: ["Fragrance Consultation", "Scent Profiling", "Sample Program", "Gift Wrapping", "Engraving"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "floral-perfume",
        name: "Blooming Elegance Eau de Parfum",
        description:
          "Sophisticated floral fragrance with notes of rose, jasmine, and amber for a timeless feminine scent.",
        price: { amount: 6500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Women's Fragrances",
        tags: ["Floral", "Elegant", "Long-lasting"],
      },
      {
        id: "woody-cologne",
        name: "Timber Essence Cologne",
        description: "Masculine cologne with woody notes of cedar, sandalwood, and vetiver for a confident presence.",
        price: { amount: 5800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Men's Fragrances",
        tags: ["Woody", "Masculine", "Sophisticated"],
      },
      {
        id: "unisex-fragrance",
        name: "Citrus Horizon Unisex Fragrance",
        description: "Refreshing unisex fragrance with bright citrus notes and a subtle spicy undertone.",
        price: { amount: 4800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Unisex Fragrances",
        tags: ["Citrus", "Fresh", "Unisex"],
      },
      {
        id: "luxury-gift-set",
        name: "Signature Scent Gift Collection",
        description:
          "Luxury gift set featuring a full-size fragrance, body lotion, and travel spray in a signature scent.",
        price: { amount: 8500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Gift Sets",
        tags: ["Gift Set", "Luxury", "Complete Collection"],
      },
    ],
  },
  {
    id: "natural-scents",
    name: "Natural Scents",
    logo: "/placeholder.svg?height=80&width=80",
    category: "fragrance",
    description:
      "Artisanal fragrances crafted with natural, sustainable ingredients and essential oils for a clean scent experience.",
    rating: 4.8,
    reviewCount: 267,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 789 012 345",
      email: "hello@naturalscents.co.ke",
      website: "www.naturalscents.co.ke",
    },
    openingHours: "Tue-Sun: 11:00 AM - 7:00 PM, Closed on Mondays",
    amenities: ["Natural Ingredients", "Sustainable Packaging", "Custom Blending", "Refill Program", "Workshops"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "lavender-mist",
        name: "Lavender & Vanilla Mist",
        description: "Calming body and linen mist with pure lavender and vanilla essential oils for relaxation.",
        price: { amount: 1800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Body Mists",
        tags: ["Lavender", "Calming", "Natural"],
      },
      {
        id: "citrus-oil",
        name: "Citrus Grove Roll-On Oil",
        description: "Uplifting blend of citrus essential oils in a convenient roll-on format for on-the-go freshness.",
        price: { amount: 1200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Essential Oils",
        tags: ["Citrus", "Roll-On", "Energizing"],
      },
      {
        id: "botanical-perfume",
        name: "Botanical Essence Perfume",
        description:
          "All-natural perfume crafted with botanical extracts and essential oils for a subtle, elegant scent.",
        price: { amount: 3500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Natural Perfumes",
        tags: ["Botanical", "Natural", "Alcohol-free"],
      },
      {
        id: "home-diffuser",
        name: "Aromatherapy Home Diffuser Set",
        description:
          "Ceramic diffuser with a collection of essential oil blends for creating a scented atmosphere at home.",
        price: { amount: 4200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Home Fragrance",
        tags: ["Diffuser", "Aromatherapy", "Home"],
      },
    ],
  },
]
