"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Users,
  ChefHat,
  Utensils,
  Thermometer,
  Scale,
  Timer,
  BookOpen,
  Star,
  UtensilsCrossed,
  Sparkles,
  Info,
  Play,
  CheckCircle,
} from "lucide-react"
import Image from "next/image"

interface Recipe {
  id: string
  name: string
  difficulty: "Easy" | "Medium" | "Hard"
  cookingTime: string
  servings: number
  ingredients: string[]
  instructions: string[]
  tips: string[]
  flourType: string
  image: string
}

interface CookingTip {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: string
}

interface HowToUseModalProps {
  isOpen: boolean
  onClose: () => void
  selectedFlourType?: string
}

const recipes: Recipe[] = [
  {
    id: "ugali-basic",
    name: "Perfect Ugali",
    difficulty: "Easy",
    cookingTime: "20 mins",
    servings: 4,
    flourType: "Ugali Flour",
    image: "/placeholder.svg?height=200&width=300&text=Perfect+Ugali",
    ingredients: ["2 cups white maize flour", "3 cups water", "1/2 tsp salt (optional)"],
    instructions: [
      "Boil water in a heavy-bottomed pot",
      "Add salt if desired",
      "Gradually add flour while stirring continuously",
      "Reduce heat and stir vigorously to avoid lumps",
      "Cook for 10-15 minutes, stirring occasionally",
      "Shape into a mound and serve hot",
    ],
    tips: [
      "Use a wooden spoon for best results",
      "Add flour gradually to prevent lumps",
      "Let it rest for 2-3 minutes before serving",
    ],
  },
  {
    id: "mandazi-classic",
    name: "Classic Mandazi",
    difficulty: "Medium",
    cookingTime: "45 mins",
    servings: 12,
    flourType: "Mandazi Flour",
    image: "/placeholder.svg?height=200&width=300&text=Classic+Mandazi",
    ingredients: [
      "3 cups all-purpose flour",
      "1/2 cup sugar",
      "1 tsp baking powder",
      "1/2 tsp cardamom powder",
      "1/4 cup coconut milk",
      "2 eggs",
      "Oil for deep frying",
    ],
    instructions: [
      "Mix dry ingredients in a large bowl",
      "Beat eggs and add coconut milk",
      "Combine wet and dry ingredients to form dough",
      "Knead until smooth, rest for 30 minutes",
      "Roll out and cut into triangles",
      "Deep fry until golden brown",
    ],
    tips: ["Don't overwork the dough", "Oil temperature should be 350°F", "Fry in small batches for even cooking"],
  },
  {
    id: "chapati-soft",
    name: "Soft Chapati",
    difficulty: "Medium",
    cookingTime: "30 mins",
    servings: 8,
    flourType: "Chapati Flour",
    image: "/placeholder.svg?height=200&width=300&text=Soft+Chapati",
    ingredients: ["2 cups atta flour", "1 cup warm water", "2 tbsp oil", "1 tsp salt", "Extra oil for cooking"],
    instructions: [
      "Mix flour and salt in a bowl",
      "Add oil and gradually add water",
      "Knead into soft, smooth dough",
      "Rest for 20 minutes covered",
      "Roll into thin circles",
      "Cook on hot griddle until puffed",
    ],
    tips: [
      "Dough should be soft and pliable",
      "Roll evenly for uniform cooking",
      "Keep cooked chapatis covered to stay soft",
    ],
  },
]

const cookingTips: CookingTip[] = [
  {
    id: "storage",
    title: "Proper Storage",
    description: "Store flour in airtight containers in a cool, dry place. Use within 6-8 months for best quality.",
    icon: <Scale className="h-5 w-5" />,
    category: "Storage",
  },
  {
    id: "measurement",
    title: "Accurate Measurement",
    description: "Use a kitchen scale for precise measurements. 1 cup of flour typically weighs 120-125g.",
    icon: <Scale className="h-5 w-5" />,
    category: "Measurement",
  },
  {
    id: "temperature",
    title: "Water Temperature",
    description: "Use room temperature water for most recipes. Hot water can make dough tough.",
    icon: <Thermometer className="h-5 w-5" />,
    category: "Temperature",
  },
  {
    id: "mixing",
    title: "Mixing Technique",
    description: "Add flour gradually while stirring to prevent lumps. Use a whisk for smooth batters.",
    icon: <Utensils className="h-5 w-5" />,
    category: "Technique",
  },
  {
    id: "resting",
    title: "Dough Resting",
    description: "Let dough rest covered for better texture. This allows gluten to relax and flour to hydrate.",
    icon: <Timer className="h-5 w-5" />,
    category: "Technique",
  },
  {
    id: "freshness",
    title: "Freshness Check",
    description: "Fresh flour should smell sweet and nutty. Rancid flour has a sour or musty odor.",
    icon: <CheckCircle className="h-5 w-5" />,
    category: "Quality",
  },
]

const flourGuides = {
  "Ugali Flour": {
    description:
      "Perfect for making Kenya's staple food - ugali. Choose white or yellow maize flour based on preference.",
    bestUses: ["Ugali", "Porridge", "Traditional dishes"],
    cookingTips: ["Use 1:1.5 flour to water ratio", "Stir continuously to avoid lumps", "Cook on medium heat"],
    nutritionalBenefits: ["High in carbohydrates", "Good source of energy", "Fortified varieties contain vitamins"],
  },
  "Mandazi Flour": {
    description: "Ideal for making mandazi and other fried pastries. All-purpose wheat flour works best.",
    bestUses: ["Mandazi", "Doughnuts", "Fried pastries", "Cakes"],
    cookingTips: ["Don't overmix the dough", "Oil temperature is crucial", "Let dough rest before frying"],
    nutritionalBenefits: ["Contains gluten for structure", "Good source of B vitamins", "Provides energy"],
  },
  "Chapati Flour": {
    description: "Specially milled atta flour for soft, pliable chapatis. Whole wheat varieties are more nutritious.",
    bestUses: ["Chapati", "Roti", "Naan", "Flatbreads"],
    cookingTips: ["Knead until smooth and elastic", "Rest dough for better texture", "Roll evenly"],
    nutritionalBenefits: ["High in fiber", "Contains protein", "Rich in minerals"],
  },
  "Specialty Flour": {
    description: "Includes gluten-free, multigrain, and fortified options for special dietary needs.",
    bestUses: ["Gluten-free baking", "Nutritious alternatives", "Special diets"],
    cookingTips: ["Follow specific recipes", "May need binding agents", "Adjust liquid ratios"],
    nutritionalBenefits: ["Varied based on type", "Often nutrient-dense", "Suitable for allergies"],
  },
}

export default function HowToUseModal({ isOpen, onClose, selectedFlourType }: HowToUseModalProps) {
  const [activeTab, setActiveTab] = useState("recipes")
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  const filteredRecipes = selectedFlourType
    ? recipes.filter((recipe) => recipe.flourType === selectedFlourType)
    : recipes

  const currentGuide = selectedFlourType ? flourGuides[selectedFlourType as keyof typeof flourGuides] : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-amber-700">
            <ChefHat className="h-6 w-6" />
            How to Use {selectedFlourType || "Flour"} - Cooking Guide
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recipes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Recipes
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Tips
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Guide
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Nutrition
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipes" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe) => (
                <motion.div
                  key={recipe.id}
                  className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200 cursor-pointer hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                    <Image src={recipe.image || "/placeholder.svg"} alt={recipe.name} fill className="object-cover" />
                    <Badge className="absolute top-2 right-2 bg-amber-600 text-white">{recipe.difficulty}</Badge>
                  </div>
                  <h3 className="font-semibold text-amber-800 mb-2">{recipe.name}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {recipe.cookingTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {recipe.servings} servings
                    </div>
                  </div>
                  <Button className="w-full mt-3 bg-amber-600 hover:bg-amber-700 text-white">
                    <Play className="h-4 w-4 mr-2" />
                    View Recipe
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Recipe Detail Modal */}
            <AnimatePresence>
              {selectedRecipe && (
                <motion.div
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedRecipe(null)}
                >
                  <motion.div
                    className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-amber-800">{selectedRecipe.name}</h2>
                        <Button variant="outline" onClick={() => setSelectedRecipe(null)}>
                          Close
                        </Button>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 bg-amber-50 rounded-lg">
                          <Clock className="h-5 w-5 mx-auto mb-1 text-amber-600" />
                          <div className="text-sm font-medium">{selectedRecipe.cookingTime}</div>
                        </div>
                        <div className="text-center p-3 bg-amber-50 rounded-lg">
                          <Users className="h-5 w-5 mx-auto mb-1 text-amber-600" />
                          <div className="text-sm font-medium">{selectedRecipe.servings} servings</div>
                        </div>
                        <div className="text-center p-3 bg-amber-50 rounded-lg">
                          <Star className="h-5 w-5 mx-auto mb-1 text-amber-600" />
                          <div className="text-sm font-medium">{selectedRecipe.difficulty}</div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
                            <UtensilsCrossed className="h-5 w-5" />
                            Ingredients
                          </h3>
                          <ul className="space-y-2">
                            {selectedRecipe.ingredients.map((ingredient, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {ingredient}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Instructions
                          </h3>
                          <ol className="space-y-3">
                            {selectedRecipe.instructions.map((instruction, index) => (
                              <li key={index} className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </span>
                                <span>{instruction}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            Pro Tips
                          </h3>
                          <ul className="space-y-2">
                            {selectedRecipe.tips.map((tip, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cookingTips.map((tip) => (
                <motion.div
                  key={tip.id}
                  className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-600 text-white rounded-lg">{tip.icon}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-amber-800">{tip.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {tip.category}
                        </Badge>
                      </div>
                      <p className="text-gray-700 text-sm">{tip.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            {currentGuide ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 border border-amber-200">
                  <h3 className="text-xl font-semibold text-amber-800 mb-3">About {selectedFlourType}</h3>
                  <p className="text-gray-700 mb-4">{currentGuide.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                        <Utensils className="h-4 w-4" />
                        Best Uses
                      </h4>
                      <ul className="space-y-1">
                        {currentGuide.bestUses.map((use, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {use}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                        <ChefHat className="h-4 w-4" />
                        Cooking Tips
                      </h4>
                      <ul className="space-y-1">
                        {currentGuide.cookingTips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <Star className="h-3 w-3 text-yellow-500" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Benefits
                      </h4>
                      <ul className="space-y-1">
                        {currentGuide.nutritionalBenefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(flourGuides).map(([type, guide]) => (
                  <motion.div
                    key={type}
                    className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">{type}</h3>
                    <p className="text-gray-700 text-sm mb-3">{guide.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {guide.bestUses.slice(0, 3).map((use, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 border border-amber-200">
              <h3 className="text-xl font-semibold text-amber-800 mb-4 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Nutritional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border border-amber-200">
                  <div className="text-2xl font-bold text-amber-600">120</div>
                  <div className="text-sm text-gray-600">Calories per 100g</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-amber-200">
                  <div className="text-2xl font-bold text-amber-600">3-4g</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-amber-200">
                  <div className="text-2xl font-bold text-amber-600">25g</div>
                  <div className="text-sm text-gray-600">Carbohydrates</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-amber-200">
                  <div className="text-2xl font-bold text-amber-600">1-2g</div>
                  <div className="text-sm text-gray-600">Fiber</div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h4 className="font-semibold text-amber-700">Health Benefits:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Good source of energy from complex carbohydrates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Contains essential B vitamins for metabolism</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Fortified varieties provide additional vitamins and minerals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Gluten-free options available for dietary restrictions</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
