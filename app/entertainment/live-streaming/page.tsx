import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import VideoCarousel from "@/components/VideoCarousel"
import LiveStreamSection from "@/components/LiveStreamSection"
import PreviousShowsSection from "@/components/PreviousShowsSection"
import { featuredVideos, liveStreams, previousShows } from "./mock-data"

export default function LiveStreamingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Theater-like header */}
      <div className="relative w-full bg-black py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-center font-serif text-4xl font-bold tracking-tight text-amber-400 md:text-5xl lg:text-6xl">
            <span className="inline-block transform -skew-x-6">LIVE</span> <span className="text-white">STREAMING</span>
          </h1>
          <p className="mt-2 text-center text-gray-400">Experience entertainment like never before</p>   
      </div>
      </div>

      {/* Featured video previews carousel */}
      <section className="relative w-full bg-black py-6">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 font-serif text-2xl font-bold text-amber-400 md:text-3xl">Featured Previews</h2>
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
              </div>
            }
          >
            <VideoCarousel videos={featuredVideos} />
          </Suspense>
        </div>
      </section>

      {/* Live streaming section */}
      <section className="relative w-full bg-gradient-to-b from-black to-gray-900 py-10">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 font-serif text-2xl font-bold text-amber-400 md:text-3xl">Live Now</h2>
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
              </div>
            }
          >
            <LiveStreamSection streams={liveStreams} />
          </Suspense>
        </div>
      </section>

      {/* Previous shows section with infinity scrolling */}
      <section className="relative w-full bg-gradient-to-b from-gray-900 to-black py-10">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 font-serif text-2xl font-bold text-amber-400 md:text-3xl">Previous Shows</h2>
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
              </div>
            }
          >
            <PreviousShowsSection initialShows={previousShows} />
          </Suspense>
        </div>
      </section>

      {/* Footer with theater curtain effect */}
      <footer className="relative w-full bg-black py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 h-4 bg-gradient-to-r from-red-900 via-red-700 to-red-900 opacity-80"></div>
          <p className="text-gray-400">© {new Date().getFullYear()} Entertainment Streaming. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

