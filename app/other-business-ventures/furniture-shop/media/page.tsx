"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  MessageCircle,
  Bookmark,
  Sofa,
  Bed,
  Armchair,
  UtensilsCrossed,
  Briefcase,
  TreePine,
  Baby,
  Package,
  Hammer,
  Crown,
  Leaf,
  MapPin,
  Star,
  Info,
  MoreHorizontal,
  Sparkles,
  Flame,
  ArrowUpCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { swapArrayElementsRandomly } from "@/utils/swap-utils"
import { cn } from "@/lib/utils"
import { useCookieTracking } from "@/hooks/useCookieTracking"
import { useIsMobile } from "@/hooks/use-mobile"
import { mockVideos, formatNumber, formatTime, type VideoData } from "./mock-data"

// Helper function to get category icon component
const getCategoryIconComponent = (category: string) => {
  switch (category) {
    case "Living Room":
      return <Sofa className="h-4 w-4" />
    case "Bedroom":
      return <Bed className="h-4 w-4" />
    case "Dining Room":
      return <UtensilsCrossed className="h-4 w-4" />
    case "Office":
      return <Briefcase className="h-4 w-4" />
    case "Outdoor":
      return <TreePine className="h-4 w-4" />
    case "Kids Room":
      return <Baby className="h-4 w-4" />
    case "Storage":
      return <Package className="h-4 w-4" />
    case "Artisan":
      return <Hammer className="h-4 w-4" />
    case "Small Spaces":
      return <Armchair className="h-4 w-4" />
    case "Luxury":
      return <Crown className="h-4 w-4" />
    case "Sustainable":
      return <Leaf className="h-4 w-4" />
    case "Restoration":
      return <Hammer className="h-4 w-4" />
    default:
      return <Sofa className="h-4 w-4" />
  }
}

export default function FurnitureMediaShowcase() {
  useCookieTracking("furniture-media")
  const IsMobile = useIsMobile()

  // State for videos
  const [videos, setVideos] = useState<VideoData[]>(mockVideos)
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({})
  const [isBookmarked, setIsBookmarked] = useState<Record<string, boolean>>({})
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showInfo, setShowInfo] = useState<Record<string, boolean>>({})

  // Refs
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const videoContainerRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Filter videos by category
  const filteredVideos = activeCategory ? videos.filter((video) => video.category === activeCategory) : videos

  // Handle video play/pause
  const togglePlay = (videoId: string) => {
    const video = videoRefs.current[videoId]
    if (!video) return

    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  // Handle video mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted)

    // Apply to all video elements
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.muted = !isMuted
      }
    })
  }

  // Handle like toggle
  const toggleLike = (videoId: string) => {
    setIsLiked((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }))
  }

  // Handle bookmark toggle
  const toggleBookmark = (videoId: string) => {
    setIsBookmarked((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }))
  }

  // Handle info toggle
  const toggleInfo = (videoId: string) => {
    setShowInfo((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }))
  }

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Load more videos
  const loadMoreVideos = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      // In a real app, you would fetch more videos from an API
      // For now, we'll just duplicate existing videos with new IDs
      const newVideos = [...videos.slice(0, 5)].map((video) => ({
        ...video,
        id: `${video.id}-${Date.now()}`,
        views: Math.floor(video.views * 0.8),
        likes: Math.floor(video.likes * 0.8),
        shares: Math.floor(video.shares * 0.8),
        comments: Math.floor(video.comments * 0.8),
        dateAdded: new Date().toISOString(),
      }))

      setVideos((prev) => [...prev, ...newVideos])
      setIsLoading(false)

      // In a real app, you would check if there are more videos to load
      // For demo purposes, we'll just keep loading
    }, 1500)
  }, [isLoading, hasMore, videos])

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries
      if (entry.isIntersecting && !isLoading) {
        loadMoreVideos()
      }
    }, options)

    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMoreVideos, isLoading])

  // Observe the last video container for infinite scroll
  useEffect(() => {
    if (isLoading) return

    const lastVideoId = filteredVideos[filteredVideos.length - 1]?.id
    if (!lastVideoId) return

    const lastVideoContainer = videoContainerRefs.current[lastVideoId]
    if (!lastVideoContainer || !observerRef.current) return

    observerRef.current.disconnect()
    observerRef.current.observe(lastVideoContainer)
  }, [filteredVideos, isLoading])

  // Set up intersection observer for video playback
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.7, // Video needs to be 70% visible to start playing
    }

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const videoId = entry.target.getAttribute("data-video-id")
        if (!videoId) return

        const video = videoRefs.current[videoId]
        if (!video) return

        if (entry.isIntersecting) {
          // Pause all other videos
          Object.entries(videoRefs.current).forEach(([id, v]) => {
            if (id !== videoId && v) {
              v.pause()
            }
          })

          // Play this video
          video.play().catch((e) => console.log("Autoplay prevented:", e))
          setActiveVideoIndex(filteredVideos.findIndex((v) => v.id === videoId))
          setIsPlaying(true)
        } else {
          // Pause this video when not in view
          video.pause()
          if (activeVideoIndex === filteredVideos.findIndex((v) => v.id === videoId)) {
            setIsPlaying(false)
          }
        }
      })
    }, options)

    // Observe all video containers
    Object.entries(videoContainerRefs.current).forEach(([id, container]) => {
      if (container) {
        videoObserver.observe(container)
      }
    })

    return () => {
      videoObserver.disconnect()
    }
  }, [filteredVideos, activeVideoIndex])

  // Add scroll event listener to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Set up video swapping effect every 5 minutes
  useEffect(() => {
    const swapInterval = setInterval(
      () => {
        setVideos((prevVideos) => swapArrayElementsRandomly([...prevVideos]))
      },
      5 * 60 * 1000,
    ) // 5 minutes

    return () => clearInterval(swapInterval)
  }, [])

  // Initialize video elements with muted state
  useEffect(() => {
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.muted = isMuted
      }
    })
  }, [isMuted, videos])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-900 to-indigo-900 border-b border-purple-700 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-purple-100">Furniture Media Showcase</h1>
              <p className="text-purple-200 text-sm md:text-base">
                Discover beautiful furniture designs and interior inspiration
              </p>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap justify-center md:justify-end gap-2">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(null)}
                className={cn(
                  "rounded-full",
                  activeCategory === null
                    ? "bg-purple-500 hover:bg-purple-600 text-white"
                    : "border-purple-500 text-purple-200 hover:bg-purple-900/50",
                )}
              >
                All
              </Button>

              {Array.from(new Set(videos.map((video) => video.category))).map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "rounded-full flex items-center gap-1",
                    activeCategory === category
                      ? "bg-purple-500 hover:bg-purple-600 text-white"
                      : "border-purple-500 text-purple-200 hover:bg-purple-900/50",
                  )}
                >
                  {getCategoryIconComponent(category)}
                  <span>{category}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8" ref={containerRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, index) => (
            <div
              key={video.id}
              className="relative bg-gradient-to-b from-purple-900/90 to-indigo-900/90 rounded-xl overflow-hidden shadow-xl border border-purple-600/30 backdrop-blur-sm"
              ref={(el) => {
                videoContainerRefs.current[video.id] = el
              }}
              data-video-id={video.id}
            >
              {/* Video container */}
              <div className="relative aspect-[9/16] bg-black">
                <video
                  ref={(el) => {
                    videoRefs.current[video.id] = el
                  }}
                  src={video.videoUrl}
                  poster={video.thumbnailUrl}
                  loop
                  playsInline
                  muted={isMuted}
                  className="w-full h-full object-cover"
                  onClick={() => togglePlay(video.id)}
                />

                {/* Video overlay - play/pause button */}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                  onClick={() => togglePlay(video.id)}
                >
                  <div className="bg-black/40 rounded-full p-3">
                    {isPlaying && activeVideoIndex === index ? (
                      <Pause className="h-8 w-8 text-white" />
                    ) : (
                      <Play className="h-8 w-8 text-white" />
                    )}
                  </div>
                </div>

                {/* Video duration */}
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {formatTime(video.duration)}
                </div>

                {/* Featured/Trending badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {video.featured && (
                    <Badge className="bg-purple-500 text-white flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Featured</span>
                    </Badge>
                  )}
                  {video.trending && (
                    <Badge className="bg-indigo-500 text-white flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      <span>Trending</span>
                    </Badge>
                  )}
                </div>

                {/* Category badge */}
                <div className="absolute top-3 right-3">
                  <Badge
                    variant="outline"
                    className="border-purple-500 text-purple-100 bg-black/50 flex items-center gap-1"
                  >
                    {getCategoryIconComponent(video.category)}
                    <span>{video.category}</span>
                  </Badge>
                </div>
              </div>

              {/* Video info */}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="h-10 w-10 border-2 border-purple-500">
                    <AvatarImage src={video.vendor.logo} alt={video.vendor.name} />
                    <AvatarFallback className="bg-purple-800 text-purple-100">
                      {video.vendor.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-semibold text-purple-100 truncate">{video.vendor.name}</h3>
                      {video.vendor.verified && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-blue-400">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Verified Vendor</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-purple-200">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{video.vendor.location}</span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-purple-200 hover:text-purple-100 hover:bg-purple-800/50"
                    onClick={() => toggleInfo(video.id)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>

                <h2 className="font-bold text-purple-100 mb-2 line-clamp-2">{video.title}</h2>

                {/* Video description - expandable */}
                <AnimatePresence>
                  {showInfo[video.id] ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-purple-200 mb-3">{video.description}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {video.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-purple-700 text-purple-300">
                            #{tag.toLowerCase().replace(/\s+/g, "")}
                          </Badge>
                        ))}
                      </div>

                      {/* Vendor details */}
                      <div className="bg-purple-900/50 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-purple-200">Rating:</span>
                          <div className="flex items-center">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(video.vendor.rating)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-purple-800"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-1 text-xs text-purple-200">
                              {video.vendor.rating.toFixed(1)} ({video.vendor.reviewCount})
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-purple-200">Followers:</span>
                          <span className="text-xs text-purple-100 font-medium">
                            {formatNumber(video.vendor.followers)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-sm text-purple-200 mb-3 line-clamp-2">{video.description}</p>
                  )}
                </AnimatePresence>

                {/* Video stats and actions */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-800">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 px-2 flex items-center gap-1",
                        isLiked[video.id] ? "text-red-500 hover:text-red-600" : "text-purple-200 hover:text-purple-100",
                      )}
                      onClick={() => toggleLike(video.id)}
                    >
                      <Heart className={cn("h-4 w-4", isLiked[video.id] && "fill-current")} />
                      <span>{formatNumber(isLiked[video.id] ? video.likes + 1 : video.likes)}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-purple-200 hover:text-purple-100 flex items-center gap-1"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{formatNumber(video.comments)}</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-purple-200 hover:text-purple-100 flex items-center gap-1"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>{formatNumber(video.shares)}</span>
                    </Button>
                  </div>

                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        isBookmarked[video.id]
                          ? "text-purple-500 hover:text-purple-600"
                          : "text-purple-200 hover:text-purple-100",
                      )}
                      onClick={() => toggleBookmark(video.id)}
                    >
                      <Bookmark className={cn("h-4 w-4", isBookmarked[video.id] && "fill-current")} />
                    </Button>

                    <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-200 hover:text-purple-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="bg-purple-900/80 p-4 rounded-full backdrop-blur-sm flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-purple-300" />
              <span className="text-purple-200 font-medium">Loading more videos...</span>
            </div>
          </div>
        )}
      </div>

      {/* Floating controls */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        {/* Scroll to top button */}
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg"
            onClick={scrollToTop}
          >
            <ArrowUpCircle className="h-6 w-6" />
          </motion.button>
        )}

        {/* Mute/unmute button */}
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </button>
      </div>
    </div>
  )
}
