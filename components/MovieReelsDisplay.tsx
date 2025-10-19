"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, ExternalLink, X, Clock, Tag } from "lucide-react"
import Link from "next/link"

// Types for our video reels
interface VideoReel {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  ctaText: string
  ctaLink: string
  duration: number // in seconds
  category: "movie" | "business" | "product" | "event"
}

// Sample data
const sampleReels: VideoReel[] = [
  {
    id: "reel-001",
    title: "Summer Blockbuster",
    description: "The most anticipated action movie of the year",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4", // Sample video
    thumbnailUrl: "/placeholder.svg?height=720&width=405",
    ctaText: "Watch in theaters from June 15",
    ctaLink: "https://example.com/movie-tickets",
    duration: 15,
    category: "movie",
  },
  {
    id: "reel-002",
    title: "Luxury Resort",
    description: "Experience paradise on earth",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beach-with-rocks-1090-large.mp4", // Sample video
    thumbnailUrl: "/placeholder.svg?height=720&width=405",
    ctaText: "Book your stay now - 20% off",
    ctaLink: "https://example.com/resort-booking",
    duration: 12,
    category: "business",
  },
  {
    id: "reel-003",
    title: "Smart Home Devices",
    description: "Transform your home with cutting-edge technology",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-holding-neon-light-1238-large.mp4", // Sample video
    thumbnailUrl: "/placeholder.svg?height=720&width=405",
    ctaText: "Shop the collection - Free shipping",
    ctaLink: "https://example.com/smart-devices",
    duration: 18,
    category: "product",
  },
  {
    id: "reel-004",
    title: "Summer Music Festival",
    description: "Three days of non-stop music and fun",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-dj-playing-music-in-a-disco-1235-large.mp4", // Sample video
    thumbnailUrl: "/placeholder.svg?height=720&width=405",
    ctaText: "Get your tickets before they sell out",
    ctaLink: "https://example.com/festival-tickets",
    duration: 10,
    category: "event",
  },
  {
    id: "reel-005",
    title: "Organic Skincare",
    description: "Natural ingredients for radiant skin",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-washing-her-face-with-soap-1329-large.mp4", // Sample video
    thumbnailUrl: "/placeholder.svg?height=720&width=405",
    ctaText: "Try our bestsellers - 15% off first order",
    ctaLink: "https://example.com/skincare",
    duration: 14,
    category: "product",
  },
]

// Categories with their display names and colors
const categories = [
  { id: "all", name: "All Reels", color: "bg-gradient-to-r from-blue-500 to-green-500" },
  { id: "movie", name: "Movie Trailers", color: "bg-gradient-to-r from-red-500 to-orange-500" },
  { id: "business", name: "Business", color: "bg-gradient-to-r from-blue-500 to-indigo-500" },
  { id: "product", name: "Products", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
  { id: "event", name: "Events", color: "bg-gradient-to-r from-amber-500 to-yellow-500" },
]

export default function MovieReelsDisplay() {
  const [currentReelIndex, setCurrentReelIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredReels, setFilteredReels] = useState(sampleReels)
  const [isHovering, setIsHovering] = useState(false)
  const [selectedReel, setSelectedReel] = useState<VideoReel | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Filter reels based on category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredReels(sampleReels)
    } else {
      setFilteredReels(sampleReels.filter((reel) => reel.category === selectedCategory))
    }
    // Reset to first reel when changing categories
    setCurrentReelIndex(0)
    setProgress(0)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }, [selectedCategory])

  // Handle video progress tracking
  useEffect(() => {
    if (isPlaying && videoRef.current) {
      // Clear any existing interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }

      // Set up progress tracking
      progressIntervalRef.current = setInterval(() => {
        if (videoRef.current) {
          const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100
          setProgress(currentProgress)

          // Move to next video when current one ends
          if (currentProgress >= 99.5) {
            moveToNextReel()
          }
        }
      }, 100)
    } else if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPlaying, currentReelIndex, filteredReels])

  // Handle play/pause
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error)
          // If autoplay is blocked, mute and try again
          setIsMuted(true)
          videoRef.current?.play().catch((e) => console.error("Still can't play:", e))
        })
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying, currentReelIndex])

  // Handle mute/unmute
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted])

  // Move to next reel
  const moveToNextReel = () => {
    setCurrentReelIndex((prevIndex) => (prevIndex + 1) % filteredReels.length)
    setProgress(0)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  // Move to previous reel
  const moveToPrevReel = () => {
    setCurrentReelIndex((prevIndex) => (prevIndex - 1 + filteredReels.length) % filteredReels.length)
    setProgress(0)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev)
  }

  // Toggle mute/unmute
  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  // Get current reel
  const currentReel = filteredReels[currentReelIndex] || sampleReels[0]

  // Get category color for current reel
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.color : categories[0].color
  }

  const currentCategoryColor = getCategoryColor(currentReel.category)

  const openReelModal = (reel: VideoReel) => {
    setSelectedReel(reel)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <motion.div
      className="w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-white/20 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative z-10">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-100/50 rounded-full blur-3xl"></div>

        {/* Header with animated underline */}
        <div className="text-center mb-8 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 inline-block">
            Featured Reels
          </h2>
          <motion.div
            className="h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mt-2 mx-auto"
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ delay: 0.2, duration: 0.8 }}
          />
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Discover the latest movie trailers and promotional videos from our partners.
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              className={`px-4 py-1.5 rounded-full text-white text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? `${category.color} shadow-md scale-105`
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* Video Reel Player */}
        {filteredReels.length > 0 ? (
          <div className="max-w-md mx-auto">
            <div
              className="relative rounded-xl overflow-hidden aspect-[9/16] bg-black shadow-xl cursor-pointer"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => openReelModal(currentReel)}
            >
              {/* Video */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReel.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <video
                    ref={videoRef}
                    src={currentReel.videoUrl}
                    className="w-full h-full object-cover"
                    playsInline
                    loop={false}
                    muted={isMuted}
                    poster={currentReel.thumbnailUrl}
                    onEnded={moveToNextReel}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800/50">
                <motion.div
                  className={`h-full ${currentCategoryColor}`}
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              {/* Reel indicators */}
              <div className="absolute top-2 left-0 right-0 flex justify-center gap-1 px-2">
                {filteredReels.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === currentReelIndex ? "bg-white w-6" : "bg-white/50 w-3"
                    }`}
                  />
                ))}
              </div>

              {/* Controls overlay - shows on hover or when paused */}
              <motion.div
                className="absolute inset-0 bg-black/30 flex flex-col justify-between p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering || !isPlaying ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Top info */}
                <div className="text-white">
                  <h3 className="font-bold text-lg">{currentReel.title}</h3>
                  <p className="text-sm text-white/80">{currentReel.description}</p>
                </div>

                {/* Center play/pause button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    className="bg-white/20 backdrop-blur-sm rounded-full p-4 text-white"
                    onClick={togglePlayPause}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </motion.button>
                </div>

                {/* Bottom controls */}
                <div className="flex justify-between items-center">
                  <button className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-white" onClick={toggleMute}>
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>

                  <div className="flex gap-2">
                    <button
                      className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-white"
                      onClick={moveToPrevReel}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-white"
                      onClick={moveToNextReel}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* CTA Banner */}
              <motion.div
                className={`absolute bottom-0 left-0 right-0 p-4 ${currentCategoryColor} text-white`}
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium text-sm">{currentReel.ctaText}</p>
                  <Link
                    href={currentReel.ctaLink}
                    target="_blank"
                    className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 text-white hover:bg-white/30 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Reel title and navigation */}
            <div className="mt-4 flex justify-between items-center">
              <button
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 text-gray-700 transition-colors"
                onClick={moveToPrevReel}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="text-center">
                <h3 className="font-medium">{currentReel.title}</h3>
                <p className="text-xs text-gray-500">
                  {currentReelIndex + 1} of {filteredReels.length}
                </p>
              </div>

              <button
                className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 text-gray-700 transition-colors"
                onClick={moveToNextReel}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="text-5xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No reels found</h3>
            <p className="text-gray-500">Try selecting a different category.</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>
            The videos used here are Purely for Advertisement section Only, for more you can watch it or get in the
            Advertisers Website or their place of operation.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {selectedReel && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReel(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`${getCategoryColor(selectedReel.category)} p-6 text-white relative`}>
                <button
                  onClick={() => setSelectedReel(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex gap-4">
                  <div className="w-24 h-32 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                    <img
                      src={selectedReel.thumbnailUrl || "/placeholder.svg"}
                      alt={selectedReel.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{selectedReel.title}</h2>
                    <p className="text-white/90 mb-3">{selectedReel.description}</p>
                    <div className="flex items-center gap-4 text-sm text-white/80">
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        {formatDuration(selectedReel.duration)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag size={16} />
                        {categories.find((cat) => cat.id === selectedReel.category)?.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Video Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <p className="font-medium capitalize">{selectedReel.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <p className="font-medium">{formatDuration(selectedReel.duration)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Video ID:</span>
                        <p className="font-medium">{selectedReel.id}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <p className="font-medium">Promotional Video</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedReel.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Call to Action</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 mb-3">{selectedReel.ctaText}</p>
                      <Link
                        href={selectedReel.ctaLink}
                        target="_blank"
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium ${getCategoryColor(selectedReel.category)} hover:opacity-90 transition-opacity`}
                      >
                        <ExternalLink size={16} />
                        Visit Website
                      </Link>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Video Preview</h3>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="w-32 h-48 mx-auto rounded-lg overflow-hidden shadow-md mb-3">
                        <img
                          src={selectedReel.thumbnailUrl || "/placeholder.svg"}
                          alt={selectedReel.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-500">Return to main view to watch the full video</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-8">
                  <Link
                    href={selectedReel.ctaLink}
                    target="_blank"
                    className={`flex-1 py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 ${getCategoryColor(selectedReel.category)} hover:opacity-90 transition-opacity`}
                  >
                    <ExternalLink size={18} />
                    {selectedReel.ctaText}
                  </Link>
                  <button
                    onClick={() => setSelectedReel(null)}
                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
