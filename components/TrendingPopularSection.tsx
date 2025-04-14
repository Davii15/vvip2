"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp, TrendingUp, Award, Star, FlameIcon as Fire } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export type ProductRanking = {
  id: string
  name: string
  image: string
  price: {
    amount: number
    currency: string
  }
  rating: number
  category: string
  vendor: string
  rank: number
  url: string
  badges: Array<"trending" | "popular" | "new" | "hot">
}

type TrendingPopularSectionProps = {
  trendingProducts: ProductRanking[]
  popularProducts: ProductRanking[]
  colorScheme?: {
    primary: string
    secondary: string
    accent: string
    text: string
    background: string
  }
  title?: string
  subtitle?: string
}

const defaultColorScheme = {
  primary: "from-amber-500 to-yellow-700",
  secondary: "bg-amber-100",
  accent: "bg-yellow-600",
  text: "text-amber-900",
  background: "bg-amber-50",
}

export default function TrendingPopularSection({
  trendingProducts,
  popularProducts,
  colorScheme = defaultColorScheme,
  title = "Discover What's Hot",
  subtitle = "See what's trending and most popular among our customers",
}: TrendingPopularSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isOpen, trendingProducts, popularProducts])

  const toggleSection = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="w-full my-8 rounded-lg overflow-hidden shadow-lg">
      {/* Header - Always visible */}
      <div
        className={`w-full cursor-pointer ${isOpen ? "rounded-t-lg" : "rounded-lg"} bg-gradient-to-r ${colorScheme.primary} p-4 transition-all duration-300`}
        onClick={toggleSection}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
              {isOpen ? <Fire className="h-6 w-6 text-white" /> : <TrendingUp className="h-6 w-6 text-white" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white md:text-2xl">{title}</h2>
              <p className="text-white/80 text-sm hidden md:block">{subtitle}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation()
              toggleSection()
            }}
          >
            {isOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Collapsible content */}
      <div
        style={{ height: `${contentHeight}px` }}
        className={`overflow-hidden transition-all duration-500 ease-in-out ${colorScheme.background}`}
      >
        <div ref={contentRef} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trending Products Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className={`h-5 w-5 ${colorScheme.text}`} />
                <h3 className={`text-lg font-semibold ${colorScheme.text}`}>Trending Now</h3>
              </div>
              <div className="space-y-3">
                {trendingProducts.map((product, index) => (
                  <RankedProductCard
                    key={product.id}
                    product={product}
                    rank={index + 1}
                    colorScheme={colorScheme}
                    badgeType="trending"
                  />
                ))}
              </div>
            </div>

            {/* Most Popular Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Award className={`h-5 w-5 ${colorScheme.text}`} />
                <h3 className={`text-lg font-semibold ${colorScheme.text}`}>Most Popular</h3>
              </div>
              <div className="space-y-3">
                {popularProducts.map((product, index) => (
                  <RankedProductCard
                    key={product.id}
                    product={product}
                    rank={index + 1}
                    colorScheme={colorScheme}
                    badgeType="popular"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type RankedProductCardProps = {
  product: ProductRanking
  rank: number
  colorScheme: {
    primary: string
    secondary: string
    accent: string
    text: string
    background: string
  }
  badgeType: "trending" | "popular"
}

function RankedProductCard({ product, rank, colorScheme, badgeType }: RankedProductCardProps) {
  return (
    <Link href={product.url}>
      <Card
        className={`overflow-hidden transition-all duration-300 hover:shadow-md group ${colorScheme.secondary}/10 border border-${colorScheme.accent}/20`}
      >
        <div className="flex items-center p-3 gap-3">
          {/* Rank indicator */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r ${colorScheme.primary} text-white font-bold text-lg`}
          >
            {rank}
          </div>

          {/* Product image */}
          <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {product.badges.includes(badgeType) && (
              <div className="absolute top-0 right-0">
                <ProductBadge type={badgeType} colorScheme={colorScheme} />
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="flex-grow min-w-0">
            <h4 className={`font-medium text-sm truncate ${colorScheme.text}`}>{product.name}</h4>
            <p className="text-xs text-gray-500 truncate">{product.vendor}</p>
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span className="text-xs ml-1 text-gray-600">{product.rating.toFixed(1)}</span>
              </div>
              <span className="mx-2 text-gray-300">•</span>
              <span className={`text-xs font-semibold ${colorScheme.text}`}>
                {product.price.currency}
                {product.price.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

function ProductBadge({
  type,
  colorScheme,
}: {
  type: "trending" | "popular" | "new" | "hot"
  colorScheme: {
    primary: string
    secondary: string
    accent: string
    text: string
    background: string
  }
}) {
  const badgeContent = () => {
    switch (type) {
      case "trending":
        return (
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span className="text-[10px]">Trending</span>
          </div>
        )
      case "popular":
        return (
          <div className="flex items-center space-x-1">
            <Award className="h-3 w-3" />
            <span className="text-[10px]">Popular</span>
          </div>
        )
      case "new":
        return (
          <div className="flex items-center space-x-1">
            <span className="text-[10px]">New</span>
          </div>
        )
      case "hot":
        return (
          <div className="flex items-center space-x-1">
            <Fire className="h-3 w-3" />
            <span className="text-[10px]">Hot</span>
          </div>
        )
    }
  }

  return (
    <Badge className={`bg-gradient-to-r ${colorScheme.primary} text-white px-2 py-0.5 text-[10px] font-medium`}>
      {badgeContent()}
    </Badge>
  )
}

