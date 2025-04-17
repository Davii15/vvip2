"use client"

import { useState, useEffect } from "react"
import CategorySection from "@/components/CategorySection"
import { Search } from "lucide-react"
import SparklingText from "@/components/SparklingText"

export default function CategoriesPage() {
  const initialCategories = [
    { name: "Retail & Supermarket Deals", icon: "ShoppingBag", imageSrc: "/images/retail.png" },
    { name: "Hospitality Deals", icon: "Utensils", imageSrc: "/images/hotels.png" },
    { name: "Real Estate Product Deals", icon: "Home", imageSrc: "/images/realestate.png" },
    { name: "Tourist Travel & Adventure Deals", icon: "Compass", imageSrc: "/images/tourism.png" },
    { name: "Travelling Companies Deals", icon: "Plane", imageSrc: "/images/Travel.png" },
    { name: "Health Facility Services Deals", icon: "Stethoscope", imageSrc: "/images/health.png" },
    {/* { name: "Car Deals", icon: "Car", imageSrc: "/images/cars.png" },*/}
    { name: "Insurance Covers Product Deals", icon: "Shield", imageSrc: "/images/insurance.png" },
    { name: "Beauty & Massage Product Deals", icon: "Sparkles", imageSrc: "/images/beauty.png" },
    { name: "Entertainment Deals", icon: "Music", imageSrc: "/images/enjoyment.png" },
    { name: "Financial Institutions Product Deals", icon: "Landmark", imageSrc: "/images/finance.png" },
    { name:"Agriculture Product Deals", icon: "Tractor", imageSrc: "/images/Agriculture.png"},
    { name:"Drinks(soft,liqour,beverages) Product Deals" ,icon:"Wine", imageSrc: "/images/drinks.png"},
    { name:"Construction Materials Deals", icon:"Hammer", imageSrc:"/images/construction-and-materials.png"},
    { name:"Electronics Product Deals", icon:"TvIcon", imageSrc:"/images/electronics.png"},
    { name: "Other Business Venture Deals", icon: "Package", imageSrc: "/images/otherbusiness.png" },
    
  ]

  const [categories, setCategories] = useState(initialCategories)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const filteredCategories = initialCategories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setCategories(filteredCategories)
  }, [searchTerm])

  useEffect(() => {
    const interval = setInterval(() => {
      setCategories((prevCategories) => {
        const newCategories = [...prevCategories]
        const first = newCategories.shift()
        const last = newCategories.pop()
        if (first && last) {
          newCategories.push(first)
          newCategories.unshift(last)
        }
        return newCategories
      })
    }, 5000) // Swap every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-br from-blue-400 to-green-400 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Categories</h1>
        <SparklingText className="text-2xl font-semibold text-center mb-6">
          Discover Deals Tailored to Your Taste – So select Your Interests and Save today!
        </SparklingText>
        <div className="mb-8">
          <div className="relative">
            <label htmlFor="category-search" className="sr-only">
              Search categories
            </label>
            <input
              id="category-search"
              type="text"
              placeholder="Search categories..."
              className="w-full p-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <CategorySection
              key={`${category.name}-${index}`}
              name={category.name}
              icon={category.icon}
              imageSrc={category.imageSrc}
            />
          ))}
        </div>
        {categories.length === 0 && (
          <p className="text-center text-white text-xl mt-8">No categories found. Try a different search term.</p>
        )}
      </div>
    </div>
  )
}

