"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Bookmark, Share2, MessageCircle, Volume2, VolumeX, ChevronUp, Filter, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { mockClothingVideos, clothingCategories, type ClothingVideoData } from "@/lib/mock-data"

const VIDEOS_PER_BATCH = 3
const LOAD_MORE_THRESHOLD = 2

export default function ClothingShowcase() {
  const [allVideos] = useState(mockClothingVideos)
  const [displayedVideos, setDisplayedVideos] = useState<ClothingVideoData[]>([])
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isMuted, setIsMuted] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMoreVideos, setHasMoreVideos] = useState(true)
  const [currentBatch, setCurrentBatch] = useState(1)

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const getFilteredVideos = useCallback(() => {
    let filtered = allVideos

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((video) => video.category === selectedCategory)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query) ||
          video.vendor.name.toLowerCase().includes(query) ||
          video.materials.toLowerCase().includes(query) ||
          video.category.toLowerCase().includes(query) ||
          video.colors.some((color) => color.toLowerCase().includes(query)) ||
          video.sizes.some((size) => size.toLowerCase().includes(query)),
      )
    }

    return filtered
  }, [allVideos, selectedCategory, searchQuery])

  const loadMoreVideos = useCallback(() => {
    if (isLoading || !hasMoreVideos) return

    setIsLoading(true)

    // Simulate loading delay for better UX
    setTimeout(() => {
      const filteredVideos = getFilteredVideos()
      const startIndex = (currentBatch - 1) * VIDEOS_PER_BATCH
      const endIndex = startIndex + VIDEOS_PER_BATCH
      const newVideos = filteredVideos.slice(startIndex, endIndex)

      if (newVideos.length === 0) {
        setHasMoreVideos(false)
      } else {
        setDisplayedVideos((prev) => {
          // Avoid duplicates when filters change
          const existingIds = new Set(prev.map((v) => v.id))
          const uniqueNewVideos = newVideos.filter((v) => !existingIds.has(v.id))
          return [...prev, ...uniqueNewVideos]
        })
        setCurrentBatch((prev) => prev + 1)

        // Check if there are more videos to load
        if (endIndex >= filteredVideos.length) {
          setHasMoreVideos(false)
        }
      }

      setIsLoading(false)
    }, 500)
  }, [currentBatch, getFilteredVideos, isLoading, hasMoreVideos])

  useEffect(() => {
    setDisplayedVideos([])
    setCurrentBatch(1)
    setHasMoreVideos(true)
    setCurrentVideoIndex(0)
  }, [selectedCategory, searchQuery])

  useEffect(() => {
    if (displayedVideos.length === 0 && hasMoreVideos) {
      loadMoreVideos()
    }
  }, [displayedVideos.length, hasMoreVideos, loadMoreVideos])

  useEffect(() => {
    if (!loadMoreRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasMoreVideos && !isLoading) {
          loadMoreVideos()
        }
      },
      { threshold: 0.1 },
    )

    observerRef.current.observe(loadMoreRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMoreVideos, isLoading, loadMoreVideos])

  const handleLike = (videoId: number) => {
    setDisplayedVideos((prev) =>
      prev.map((video) =>
        video.id === videoId
          ? { ...video, isLiked: !video.isLiked, likes: video.isLiked ? video.likes - 1 : video.likes + 1 }
          : video,
      ),
    )
  }

  const handleBookmark = (videoId: number) => {
    setDisplayedVideos((prev) =>
      prev.map((video) => (video.id === videoId ? { ...video, isBookmarked: !video.isBookmarked } : video)),
    )
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setCurrentVideoIndex(0)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setShowSearch(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const videoElements = videoRefs.current
      let closestIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      videoElements.forEach((video, index) => {
        if (video) {
          const rect = video.getBoundingClientRect()
          const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2)

          if (distance < closestDistance) {
            closestDistance = distance
            closestIndex = index
          }
        }
      })

      setCurrentVideoIndex(closestIndex)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [displayedVideos])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-200">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Fashion Feed
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="border-pink-200 hover:bg-pink-50"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="border-pink-200 hover:bg-pink-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-pink-200"
            >
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search by title, vendor, material, color, size..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-pink-100"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {searchQuery && (
                  <p className="text-sm text-gray-600 mt-2">
                    Found {getFilteredVideos().length} results for "{searchQuery}"
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-pink-200"
            >
              <div className="flex gap-2 p-4 overflow-x-auto">
                {clothingCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                        : "border-pink-200 hover:bg-pink-50"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Video Feed */}
      <div className="relative">
        {displayedVideos.map((video, index) => (
          <div key={video.id} className="relative h-screen flex items-center justify-center">
            <div className="relative w-full max-w-md mx-auto h-full bg-black rounded-lg overflow-hidden">
              {/* Video */}
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                autoPlay={index === currentVideoIndex}
                poster={video.thumbnailUrl}
              >
                <source src={video.videoUrl} type="video/mp4" />
              </video>

              {/* Video Controls */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-black/50 hover:bg-black/70 text-white border-0"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                <div className="flex justify-between items-end">
                  <div className="flex-1 mr-4">
                    {/* Vendor Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={video.vendor.avatar || "/placeholder.svg"}
                        alt={video.vendor.name}
                        className="w-10 h-10 rounded-full border-2 border-white"
                      />
                      <div>
                        <p className="text-white font-semibold text-sm">{video.vendor.name}</p>
                        <p className="text-white/80 text-xs">{video.vendor.followers} followers</p>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-500 text-black text-xs">
                        ⭐ {video.vendor.rating}
                      </Badge>
                    </div>

                    {/* Product Info */}
                    <h3 className="text-white font-bold text-lg mb-2">{video.title}</h3>
                    <p className="text-white/90 text-sm mb-2">{video.description}</p>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white font-bold text-xl">KSH {video.price.current}</span>
                      <span className="text-white/60 line-through text-sm">KSH {video.price.original}</span>
                      <Badge variant="destructive" className="text-xs">
                        {Math.round((1 - video.price.current / video.price.original) * 100)}% OFF
                      </Badge>
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline" className="text-white border-white/30 text-xs">
                        {video.materials}
                      </Badge>
                      <Badge variant="outline" className="text-white border-white/30 text-xs">
                        {video.colors.length} colors
                      </Badge>
                      <Badge variant="outline" className="text-white border-white/30 text-xs">
                        {video.sizes.join(", ")}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(video.id)}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className={`p-3 rounded-full ${video.isLiked ? "bg-red-500" : "bg-white/20"} backdrop-blur-sm`}
                      >
                        <Heart className={`w-6 h-6 ${video.isLiked ? "text-white fill-current" : "text-white"}`} />
                      </div>
                      <span className="text-white text-xs font-medium">{video.likes}</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleBookmark(video.id)}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className={`p-3 rounded-full ${video.isBookmarked ? "bg-yellow-500" : "bg-white/20"} backdrop-blur-sm`}
                      >
                        <Bookmark
                          className={`w-6 h-6 ${video.isBookmarked ? "text-white fill-current" : "text-white"}`}
                        />
                      </div>
                    </motion.button>

                    <motion.button whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
                      <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-white text-xs font-medium">{video.comments}</span>
                    </motion.button>

                    <motion.button whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
                      <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                        <Share2 className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-white text-xs font-medium">{video.shares}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {hasMoreVideos && (
          <div ref={loadMoreRef} className="h-screen flex items-center justify-center">
            <div className="text-center">
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full mx-auto mb-4"
                />
              ) : null}
              <p className="text-gray-600">{isLoading ? "Loading more videos..." : "Scroll to load more"}</p>
            </div>
          </div>
        )}

        {!hasMoreVideos && displayedVideos.length > 0 && (
          <div className="h-32 flex items-center justify-center">
            <p className="text-gray-500 text-center">
              🎉 You've seen all the fashion videos!
              <br />
              <span className="text-sm">Try changing your filters to discover more</span>
            </p>
          </div>
        )}

        {displayedVideos.length === 0 && !isLoading && (searchQuery || selectedCategory !== "All") && (
          <div className="h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No videos found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                }}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
              >
                Clear all filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: currentVideoIndex > 0 ? 1 : 0, scale: currentVideoIndex > 0 ? 1 : 0 }}
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg z-50"
      >
        <ChevronUp className="w-6 h-6" />
      </motion.button>
    </div>
  )
}
