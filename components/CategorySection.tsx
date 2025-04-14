"use client"

import type { Icon } from "lucide-react"
import * as Icons from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface CategorySectionProps {
  name: string
  icon: string
  imageSrc: string
}

export default function CategorySection({ name, icon, imageSrc }: CategorySectionProps) {
  const LucideIcon = Icons[icon as keyof typeof Icons] as Icon
  const [imageError, setImageError] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    if (name === "Retail & Supermarket Deals") {
      router.push("/retail-and-supermarket")
    } else if (name === "Hospitality Deals") {
      router.push("/hospitality")
    } else if (name === "Real Estate Product Deals") {
      router.push("/real-estate")
    } else if (name === "Tourist Travel & Adventure Deals") {
      router.push("/tourism-and-adventures")
    } else if (name === "Travelling Companies Deals") {
      router.push("/travelling")
    } else if (name === "Health Facility Services Deals") {
      router.push("/health-services")
    } else if (name === "Car Deals") {
      router.push("/car-deals")
    } else if (name === "Insurance Covers Product Deals") {
      router.push("/insurance")
    } else if (name === "Entertainment Deals") {
      router.push("/entertainment")
    } else if (name === "Financial Institutions Product Deals") {
      router.push("/finance")
    } else if (name === "Beauty & Massage Product Deals") {
      router.push("/beauty-and-massage")
    } else if (name === "Agriculture Product Deals") {
      router.push("/agriculture-deals")
    } else if (name === "Drinks(soft,liqour,beverages) Product Deals") {
      router.push("/drinks")
    } else if (name === "Other Business Venture Deals") {
      router.push("/other-business-ventures")
  } else if (name === "Construction Materials Deals"){
      router.push("/construction-materials")
  } else if(name === "Electronics Product Deals"){
      router.push("/electronics")
}
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col items-center space-y-3 sm:space-y-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      {!imageError && (
        <div className="relative w-full h-40 rounded-lg overflow-hidden">
          <Image
            src={imageSrc || "/images/category-placeholder.png"}
            alt={name}
            layout="fill"
            objectFit="cover"
            onError={() => setImageError(true)}
          />
        </div>
      )}
      <motion.div
        className="bg-blue-100 p-2 sm:p-3 rounded-full flex-shrink-0"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <LucideIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
      </motion.div>
      <h2 className="text-lg sm:text-xl font-semibold text-center">{name}</h2>
      {name === "Other Business Venture" && (
        <p className="text-sm text-gray-600 text-center">(Home Decor, Electronics, etc.)</p>
      )}
    </motion.div>
  )
}

