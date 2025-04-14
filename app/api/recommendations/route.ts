import { NextResponse } from "next/server"
import {
  getRecommendations,
  type RecommendableProduct,
  type UserPreference,
} from "@/components/recommendations/recommendation-engine"

// This is a simplified example - in a real app, you would fetch products from a database
// and user preferences from a user session or database
export async function POST(request: Request) {
  try {
    const { products, userPreferences } = await request.json()

    if (!Array.isArray(products) || !userPreferences) {
      return NextResponse.json(
        { error: "Invalid request. Expected products array and userPreferences object." },
        { status: 400 },
      )
    }

    // Get recommendations
    const recommendations = getRecommendations(
      products as RecommendableProduct[],
      userPreferences as UserPreference,
      8, // Return up to 8 recommendations
    )

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
