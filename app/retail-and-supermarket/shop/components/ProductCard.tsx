"use client"

import React from "react"
import { Heart, ShoppingCart, Leaf, Star, Store, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "../types"
import { calculateDiscount } from "../utils/helpers"
import NewThisWeekBadge from "@/components/NewThisWeekBadge"
import HotDealBadge from "./HotDealBadge"

interface ProductCardProps {
  product: Product
  index: number
  isLastElement?: boolean
  onViewDetails: (product: Product) => void
  // Fix: Change the ref type to use React.Ref instead of React.RefObject
  ref?: React.Ref<HTMLDivElement>
}

// Fix: Use forwardRef to properly handle the ref
const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, index, isLastElement, onViewDetails }, ref) => {
    const { toast } = useToast()
    const discountPercentage = calculateDiscount(product.originalPrice, product.currentPrice)

    const addToCart = (e: React.MouseEvent) => {
      e.stopPropagation()
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
        duration: 3000,
      })
    }

    const addToWishlist = (e: React.MouseEvent) => {
      e.stopPropagation()
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
        duration: 3000,
      })
    }

    return (
      <div ref={ref} className="group animate-fadeIn" style={{ animationDelay: `${(index % 9) * 0.1}s` }}>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-slate-700 h-full flex flex-col">
          <div
            className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer"
            onClick={() => onViewDetails(product)}
          >
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />

            {product.isNew && (
              <div className="absolute top-2 left-2">
                <NewThisWeekBadge />
              </div>
            )}

            {product.isHotDeal && (
              <div className="absolute top-0 right-0">
                <HotDealBadge />
              </div>
            )}

            {discountPercentage > 0 && (
              <div className="absolute bottom-2 right-2">
                <Badge className="bg-red-500 text-white">{discountPercentage}% OFF</Badge>
              </div>
            )}

            {product.isOrganic && (
              <div className="absolute bottom-2 left-2">
                <Badge className="bg-green-500 text-white flex items-center gap-1">
                  <Leaf className="h-3 w-3" />
                  <span>Organic</span>
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-4 flex-grow">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Badge>
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs ml-1">{product.rating}</span>
                <span className="text-xs text-gray-400 ml-1">({product.reviewCount})</span>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-2">
              <Badge variant="secondary" className="text-xs">
                {product.subCategory
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </Badge>
              {product.vendor && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Store className="h-3 w-3" />
                  {product.vendor}
                </Badge>
              )}
            </div>

            <h3
              className="font-semibold text-lg mb-1 line-clamp-1 cursor-pointer hover:text-green-600 transition-colors"
              onClick={() => onViewDetails(product)}
            >
              {product.name}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{product.description}</p>

            {product.location && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                <MapPin className="h-3 w-3 mr-1" />
                {product.location}
              </div>
            )}

            <div className="flex items-center justify-between mt-auto">
              <div>
                {product.originalPrice.amount > product.currentPrice.amount ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {product.currentPrice.currency} {product.currentPrice.amount.toLocaleString()}
                    </span>
                    <span className="text-sm line-through text-gray-400">
                      {product.originalPrice.currency} {product.originalPrice.amount.toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold">
                    {product.currentPrice.currency} {product.currentPrice.amount.toLocaleString()}
                  </span>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400">{product.unit}</div>
              </div>

              <Badge
                variant="outline"
                className={`text-xs ${product.stock <= 10 ? "text-red-500 border-red-500" : ""}`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </Badge>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex gap-2">
            <Button
              onClick={addToCart}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-transform duration-300 hover:scale-105"
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              onClick={addToWishlist}
              variant="outline"
              size="icon"
              className="hover:text-red-500 hover:border-red-500 transition-colors duration-300"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  },
)

// Add display name for the component
ProductCard.displayName = "ProductCard"

export default ProductCard

