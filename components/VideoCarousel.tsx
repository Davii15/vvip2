"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from "lucide-react"
import type { VideoPreview } from "@/app/entertainment/live-streaming/mock-data"
import { cn } from "@/lib/utils"

interface VideoCarouselProps {
  videos: VideoPreview[]
}

export default function VideoCarousel({ videos }: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [showBanner, setShowBanner] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Auto-advance carousel
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length)
    }, 8000) // Change video every 8 seconds

    return () => clearInterval(interval)
  }, [videos.length, isPlaying])

  // Show banner after video plays for a while
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(true)
    }, 5000)

    return () => {
      clearTimeout(timer)
      setShowBanner(false)
    }
  }, [currentIndex])

  // Handle video element
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((e) => console.log("Autoplay prevented:", e))
      } else {
        videoRef.current.pause()
      }
      videoRef.current.muted = isMuted
    }
  }, [isPlaying, isMuted, currentIndex])

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length)
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length)
  }

  const handleVideoEnd = () => {
    handleNext()
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="relative overflow-hidden rounded-lg bg-black shadow-2xl" ref={carouselRef}>
      {/* Video player */}
      <div className="relative aspect-video w-full overflow-hidden">
        {/* Video placeholder - in a real app, this would be a real video */}
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <img
            src={videos[currentIndex].thumbnailUrl || "/placeholder.svg"}
            alt={videos[currentIndex].title}
            className="h-full w-full object-cover opacity-80"
          />

          {/* Video overlay with play icon - simulating video */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <Play className="h-16 w-16 text-white opacity-50" />
          </div>

          {/* Banner that appears after video plays for a while */}
          {showBanner && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-center transition-all duration-500 ease-in-out">
              <p className="text-lg font-bold text-white">
                Want to see more? Watch the full show on our premium channel!
              </p>
              <button className="mt-2 rounded-full bg-amber-500 px-4 py-2 font-bold text-black transition-all hover:bg-amber-400">
                Watch Full Show
              </button>
            </div>
          )}
        </div>

        {/* Video title and info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-4">
          <h3 className="text-xl font-bold text-white md:text-2xl">{videos[currentIndex].title}</h3>
          <p className="text-sm text-gray-300">{videos[currentIndex].description}</p>
          <div className="mt-2 flex items-center space-x-4">
            <span className="rounded-full bg-black bg-opacity-50 px-2 py-1 text-xs text-white">
              {videos[currentIndex].duration}
            </span>
            <span className="rounded-full bg-black bg-opacity-50 px-2 py-1 text-xs text-white">
              {videos[currentIndex].category}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-16 right-4 flex space-x-2">
        <button
          onClick={handleMuteToggle}
          className="rounded-full bg-black bg-opacity-50 p-2 text-white transition-all hover:bg-opacity-70"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-2 text-white transition-all hover:bg-opacity-70"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-2 text-white transition-all hover:bg-opacity-70"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              index === currentIndex ? "w-8 bg-amber-500" : "w-2 bg-gray-500 hover:bg-gray-400",
            )}
          />
        ))}
      </div>
    </div>
  )
}

