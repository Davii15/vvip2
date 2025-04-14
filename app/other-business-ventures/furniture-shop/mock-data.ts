// Mock data for furniture products

export const categories = [
    { id: "all", name: "All Furniture" },
    { id: "office", name: "Office Furniture" },
    { id: "home", name: "Home Furniture" }
  ];
  
  export const subcategories = [
    // Office Furniture
    { id: "reception", name: "Reception Room", category: "office", icon: true },
    { id: "boardroom", name: "Boardroom", category: "office", icon: true },
    { id: "main-office", name: "Main Office", category: "office", icon: true },
    
    // Home Furniture
    { id: "beds", name: "Beds", category: "home", icon: true },
    { id: "sofaset", name: "Sofa Sets", category: "home", icon: true },
    { id: "dinner-tables", name: "Dinner Tables", category: "home", icon: true },
    { id: "chairs", name: "Chairs", category: "home", icon: true },
    { id: "cupboards", name: "Cupboards", category: "home", icon: true },
    { id: "wardrobes", name: "Wardrobes", category: "home", icon: true },
    { id: "sitting-room-tables", name: "Sitting Room Tables", category: "home", icon: true },
    { id: "other-home", name: "Other Home Furniture", category: "home", icon: true }
  ];
  
  export const vendors = [
    { id: "furniture-palace", name: "Furniture Palace", verified:true},
    { id: "victorian-furniture", name: "Victorian Furniture",verified:true},
    { id: "ashley-homestore", name: "Ashley HomeStore", verified:true},
    { id: "odds-and-ends", name: "Odds & Ends" , verified:true},
    { id: "woodwork-kenya", name: "Woodwork Kenya" },
    { id: "ideal-interiors", name: "Ideal Interiors" , verified:true}
  ];
  
  export const furnitureProducts = [
    // Office Furniture - Reception
    {
      id: "reception-desk-1",
      name: "Modern Reception Desk with LED Lighting",
      description: "Impress your clients with this sleek reception desk featuring built-in LED lighting and a spacious work area.",
      image: "/placeholder.svg?height=400&width=600",
      images: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600"
      ],
      currentPrice: { amount: 85000, currency: "KSh" },
      originalPrice: { amount: 95000, currency: "KSh" },
      category: "office",
      subcategory: "reception",
      vendor: "Furniture Palace",
      rating: 4.7,
      reviewCount: 23,
      isNew: true,
      isHotDeal: true,
      discountPercentage: 10,
      material: "MDF with Laminate Finish",
      color: "White and Gray",
      dimensions: "180cm x 80cm x 110cm",
      inStock: true,
      stockCount: 5,
      hotDealEnds: "2025-04-10T23:59:59Z",
      tags: ["modern", "reception", "LED", "office"]
    },
    {
      id: "reception-sofa-1",
      name: "Reception Area 3-Seater Sofa",
      description: "Comfortable and stylish 3-seater sofa perfect for reception waiting areas. Made with high-quality leather and sturdy frame.",
      image: "/placeholder.svg?height=400&width=600",
      currentPrice: { amount: 45000, currency: "KSh" },
      category: "office",
      subcategory: "reception",
      vendor: "Victorian Furniture",
      rating: 4.5,
      reviewCount: 18,
      material: "Genuine Leather",
      color: "Black",
      dimensions: "210cm x 85cm x 75cm",
      inStock: true,
      stockCount: 3,
      hotDealEnds: "2025-04-10T23:59:59Z",
      tags: ["sofa", "reception", "leather", "waiting area"]
    },
    {
      id: "reception-coffee-table-1",
      name: "Glass Reception Coffee Table",
      description: "Elegant glass coffee table with chrome legs, perfect for magazines and refreshments in your reception area.",
      image: "/placeholder.svg?height=400&width=600",
      currentPrice: { amount: 18500, currency: "KSh" },
      originalPrice: { amount: 22000, currency: "KSh" },
      category: "office",
      subcategory: "reception",
      vendor: "Furniture Palace",
      rating: 4.3,
      reviewCount: 12,
      isHotDeal: true,
      discountPercentage: 16,
      material: "Tempered Glass and Chrome",
      color: "Clear/Silver",
      dimensions: "100cm x 60cm x 45cm",
      inStock: true,
      stockCount: 8,
      tags: ["coffee table", "glass", "reception", "modern"]
    },
    
    // Office Furniture - Boardroom
    {
      id: "boardroom-table-1",
      name: "Executive Boardroom Table for 12",
      description: "Premium boardroom table with cable management system and power outlets, comfortably seats 12 executives.",
      image: "/placeholder.svg?height=400&width=600",
      images: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600"
      ],
      currentPrice: { amount: 120000, currency: "KSh" },
      category: "office",
      subcategory: "boardroom",
      vendor: "Ideal Interiors",
      rating: 4.9,
      reviewCount: 15,
      isNew: true,
      material: "Solid Mahogany",
      color: "Dark Walnut",
      dimensions: "360cm x 120cm x 75cm",
      inStock: true,
      stockCount: 2,
      hotDealEnds: "2025-04-10T23:59:59Z",
      tags: ["boardroom", "executive", "conference", "meeting"]
    },
    {
      id: "boardroom-chairs-1",
      name: "High-Back Executive Boardroom Chairs (Set of 6)",
      description: "Ergonomic high-back chairs with premium leather upholstery and adjustable features for maximum comfort during long meetings.",
      image: "/placeholder.svg?height=400&width=600",
      currentPrice: { amount: 78000, currency: "KSh" },
      originalPrice: { amount: 90000, currency: "KSh" },
      category: "office",
      subcategory: "boardroom",
      vendor: "Ashley HomeStore",
      rating: 4.6,
      reviewCount: 22,
      isHotDeal: true,
      discountPercentage: 13,
      material: "Genuine Leather and Chrome",
      color: "Black",
      dimensions: "65cm x 70cm x 120cm (each)",
      inStock: true,
      stockCount: 4,
      tags: ["chairs", "executive", "boardroom", "leather"]
    },
]
    // Office Furniture - Main Office
    