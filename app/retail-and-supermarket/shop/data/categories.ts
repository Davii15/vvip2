import type { CategoryData } from "../types"

// Category data
export const categories: CategoryData[] = [
  {
    id: "vegetables",
    name: "Vegetables",
    icon: "leaf",
    subCategories: [
      { id: "leafy", name: "Leafy Greens", icon: "leaf" },
      { id: "root", name: "Root Vegetables", icon: "sparkles" },
      { id: "fruit-vegetables", name: "Fruit Vegetables", icon: "apple" },
      { id: "bulb", name: "Bulb Vegetables", icon: "sparkles" },
      { id: "cruciferous", name: "Cruciferous", icon: "leaf" },
    ],
  },
  {
    id: "fruits",
    name: "Fruits",
    icon: "apple",
    subCategories: [
      { id: "tropical", name: "Tropical Fruits", icon: "sparkles" },
      { id: "berries", name: "Berries", icon: "apple" },
      { id: "citrus", name: "Citrus Fruits", icon: "sparkles" },
      { id: "core", name: "Core Fruits", icon: "apple" },
      { id: "melons", name: "Melons", icon: "sparkles" },
    ],
  },
]

