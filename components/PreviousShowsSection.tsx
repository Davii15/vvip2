"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Eye, Calendar, Loader2 } from "lucide-react"
import { type PreviousShow, getMorePreviousShows } from "@/app/entertainment/live-streaming/mock-data"
import { formatDistanceToNow } from "date-fns"

interface PreviousShowsSectionProps {
  initialShows: PreviousShow[]
}

export default function PreviousShowsSection({ initialShows }: PreviousShowsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All Shows")
  const [shows, setShows] = useState<PreviousShow[]>(initialShows)
  const [filteredShows, setFilteredShows] = useState<PreviousShow[]>(initialShows)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)
  const lastShowElementRef = useRef<HTMLDivElement>(null)

  // Apply filtering when activeFilter or shows change
  useEffect(() => {
    if (activeFilter === "All Shows") {
      setFilteredShows(shows)
    } else {
      setFilteredShows(shows.filter((show) => show.category === activeFilter))
    }
  }, [activeFilter, shows])

  // Function to load more shows
  const loadMoreShows = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      // In a real app, this would be an API call
      const newShows = await getMorePreviousShows(page)

      if (newShows.length === 0) {
        setHasMore(false)
      } else {
        setShows((prevShows) => [...prevShows, ...newShows])
        setPage((prevPage) => prevPage + 1)
      }
    } catch (error) {
      console.error("Error loading more shows:", error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page])

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (loading) return

    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreShows()
      }
    })

    if (lastShowElementRef.current) {
      observer.current.observe(lastShowElementRef.current)
    }

    return () => {
      if (observer.current) observer.current.disconnect()
    }
  }, [loading, hasMore, loadMoreShows])

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)

    // Reset pagination when filter changes
    if (filter !== activeFilter) {
      setPage(1)
      setHasMore(true)

      // Reset shows to initial shows when changing filters to avoid mixing filtered content
      if (filter === "All Shows") {
        setShows(initialShows)
      } else {
        const filtered = initialShows.filter((show) => show.category === filter)
        setShows(filtered)

        // If we have very few shows after filtering, we might want to load more
        if (filtered.length < 8) {
          loadMoreShows()
        }
      }
    }
  }

  // Format view count
  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    } else {
      return views.toString()
    }
  }

  // Format upload date
  const formatUploadDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="mb-4 flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => handleFilterChange("All Shows")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            activeFilter === "All Shows" ? "bg-amber-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          All Shows
        </button>
        <button
          onClick={() => handleFilterChange("Music")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            activeFilter === "Music" ? "bg-amber-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Music
        </button>
        <button
          onClick={() => handleFilterChange("Comedy")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            activeFilter === "Comedy" ? "bg-amber-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Comedy
        </button>
        <button
          onClick={() => handleFilterChange("Theater")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            activeFilter === "Theater" ? "bg-amber-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Theater
        </button>
        <button
          onClick={() => handleFilterChange("Dance")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            activeFilter === "Dance" ? "bg-amber-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Dance
        </button>
        <button
          onClick={() => handleFilterChange("Magic")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            activeFilter === "Magic" ? "bg-amber-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          Magic
        </button>
      </div>

      {/* Shows grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredShows.length === 0 && !loading ? (
          <div className="col-span-full py-12 text-center text-gray-400">
            <p>No shows found for this category.</p>
            <button
              onClick={() => handleFilterChange("All Shows")}
              className="mt-4 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
            >
              View all shows
            </button>
          </div>
        ) : (
          filteredShows.map((show, index) => {
            // Check if this is the last element
            const isLastElement = index === filteredShows.length - 1

            return (
              <div
                key={show.id}
                ref={isLastElement ? lastShowElementRef : null}
                className="group overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-all hover:shadow-amber-900/20"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={show.thumbnailUrl || "/placeholder.svg"}
                    alt={show.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-40">
                    <button className="scale-0 rounded-full bg-amber-600 p-3 text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                      <Play className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 rounded bg-black bg-opacity-70 px-2 py-1 text-xs text-white">
                    {show.duration}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-1 text-lg font-bold text-white group-hover:text-amber-400">{show.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-300">{show.description}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>{formatViews(show.views)} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatUploadDate(show.uploadDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-300">
                        {show.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="flex items-center space-x-2 text-amber-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more shows...</span>
          </div>
        </div>
      )}

      {/* End of content message */}
      {!hasMore && filteredShows.length > 0 && (
        <div className="py-4 text-center text-gray-500">You've reached the end of the list</div>
      )}
    </div>
  )
}
