"use client"

import { useState, useEffect } from "react"
import { Play, Users, Clock, Award } from "lucide-react"
import type { LiveStream } from "@/app/entertainment/live-streaming/mock-data"
import { cn } from "@/lib/utils"

interface LiveStreamSectionProps {
  streams: LiveStream[]
}

export default function LiveStreamSection({ streams }: LiveStreamSectionProps) {
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(
    streams.find((stream) => stream.featured) || streams[0],
  )
  const [viewerCount, setViewerCount] = useState<number>(selectedStream ? selectedStream.viewers : 0)
  const [hasJoined, setHasJoined] = useState(false)

  // Update viewer count periodically to simulate live viewers
  useEffect(() => {
    if (!selectedStream) return

    // Set initial viewer count
    setViewerCount(selectedStream.viewers)

    // Simulate fluctuating viewer count
    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.floor(Math.random() * 10) - 4 // Random change between -4 and +5
        return Math.max(1, prev + change) // Ensure count doesn't go below 1
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [selectedStream])

  // Handle joining a stream
  const handleJoinStream = () => {
    if (!selectedStream) return

    // Set cookie to track viewership
    document.cookie = `watched_stream_${selectedStream.id}=true; path=/; max-age=86400`

    // Increment viewer count when user joins
    setViewerCount((prev) => prev + 1)
    setHasJoined(true)

    // Simulate other users joining/leaving
    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.floor(Math.random() * 6) - 2 // Random change between -2 and +3
        return Math.max(1, prev + change)
      })
    }, 5000)

    return () => clearInterval(interval)
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Featured stream player */}
      <div className="col-span-full md:col-span-2">
        {selectedStream ? (
          <div className="relative overflow-hidden rounded-lg bg-gray-900 shadow-xl">
            {/* Stream placeholder - in a real app, this would be a live video stream */}
            <div className="relative aspect-video w-full overflow-hidden">
              <img
                src={selectedStream.thumbnailUrl || "/placeholder.svg"}
                alt={selectedStream.title}
                className="h-full w-full object-cover"
              />

              {/* Live indicator */}
              <div className="absolute left-4 top-4 flex items-center space-x-2 rounded-full bg-black bg-opacity-70 px-3 py-1">
                <div className="h-2 w-2 animate-pulse rounded-full bg-red-600"></div>
                <span className="text-xs font-bold text-white">LIVE</span>
              </div>

              {/* Play button overlay */}
              {!hasJoined && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                  <button
                    onClick={handleJoinStream}
                    className="group flex items-center space-x-2 rounded-full bg-red-600 px-6 py-3 font-bold text-white transition-all hover:bg-red-700"
                  >
                    <Play className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span>Join Stream</span>
                  </button>
                  <p className="mt-2 text-sm text-gray-300">Join {viewerCount.toLocaleString()} other viewers</p>
                </div>
              )}

              {/* Stream info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-4">
                <h3 className="text-xl font-bold text-white md:text-2xl">{selectedStream.title}</h3>
                <p className="text-sm text-gray-300">{selectedStream.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{viewerCount.toLocaleString()} watching</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">Started at {selectedStream.startTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="rounded-full bg-amber-900 px-2 py-0.5 text-xs font-medium text-amber-300">
                      {selectedStream.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-900">
            <p className="text-gray-500">No stream selected</p>
          </div>
        )}
      </div>

      {/* Stream list */}
      <div className="col-span-full md:col-span-1">
        <div className="rounded-lg bg-gray-900 p-4">
          <h3 className="mb-4 text-lg font-bold text-white">Live Now</h3>
          <div className="flex max-h-[400px] flex-col space-y-3 overflow-y-auto pr-2">
            {streams.map((stream) => (
              <button
                key={stream.id}
                onClick={() => {
                  setSelectedStream(stream)
                  setHasJoined(false)
                }}
                className={cn(
                  "flex flex-col rounded-lg p-3 text-left transition-all hover:bg-gray-800",
                  selectedStream?.id === stream.id ? "bg-gray-800" : "bg-gray-850",
                )}
              >
                <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-md">
                  <img
                    src={stream.thumbnailUrl || "/placeholder.svg"}
                    alt={stream.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-2 top-2 flex items-center space-x-1 rounded-full bg-black bg-opacity-70 px-2 py-0.5">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600"></div>
                    <span className="text-xs text-white">LIVE</span>
                  </div>
                  {stream.featured && (
                    <div className="absolute right-2 top-2">
                      <Award className="h-4 w-4 text-amber-400" />
                    </div>
                  )}
                </div>
                <h4 className="line-clamp-1 font-medium text-white">{stream.title}</h4>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{stream.category}</span>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{stream.viewers.toLocaleString()}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

