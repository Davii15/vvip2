import type { Market } from "../types"

// Market data
export const markets: Market[] = [
  {
    id: "kagio-market",
    name: "Kagio Market",
    description:
      "Fresh local produce from the heart of Central Region. Known for organic vegetables and sustainable farming practices.",
    logo: "/placeholder.svg?height=150&width=150",
    location: "Central Region",
    specialties: ["Organic Vegetables", "Leafy Greens", "Local Produce"],
    featured: true,
  },
  {
    id: "meru-greens",
    name: "Meru Greens",
    description:
      "Premium fruits from the highlands of Meru. Specializing in avocados, mangoes, and passion fruits grown in mineral-rich soil.",
    logo: "/placeholder.svg?height=150&width=150",
    location: "Meru County",
    specialties: ["Premium Fruits", "Avocados", "Tropical Fruits"],
    featured: true,
  },
  {
    id: "coastal-fruits",
    name: "Coastal Fruits",
    description:
      "Tropical fruits from the Coast region. Sweet pineapples, bananas, and coconuts grown in the warm coastal climate.",
    logo: "/placeholder.svg?height=150&width=150",
    location: "Coast Region",
    specialties: ["Tropical Fruits", "Pineapples", "Coconuts"],
    featured: false,
  },
  {
    id: "nyeri-fresh-farms",
    name: "Nyeri Fresh Farms",
    description:
      "Quality vegetables from the highlands of Nyeri. Specializing in root vegetables grown in the fertile soils of Mount Kenya region.",
    logo: "/placeholder.svg?height=150&width=150",
    location: "Central Highlands",
    specialties: ["Root Vegetables", "Potatoes", "Carrots"],
    featured: false,
  },
]

