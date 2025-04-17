"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  ArrowLeft,
  Play,
  Pause,
  Heart,
  Share2,
  MessageCircle,
  Clock,
  Star,
  Users,
  Award,
  Sparkles,
  ChevronRight,
  BookOpen,
  ShoppingBag,
  Filter,
  Eye,
  Calendar,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { beautyTutorials, celebrityRoutines, liveBeautyStreams, previousTutorials } from "./mock-data.ts"

export default function BestBeautyUsagePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("featured")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTutorial, setSelectedTutorial] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({})
  const [activeCategory, setActiveCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCelebrity, setSelectedCelebrity] = useState<any>(null)
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false)
  const [selectedLiveStream, setSelectedLiveStream] = useState<any>(null)
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})

  // Filter tutorials based on search query and category
  const filteredTutorials = beautyTutorials.filter((tutorial) => {
    const matchesSearch =
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.products.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === "all" || tutorial.category === activeCategory

    return matchesSearch && matchesCategory
  })

  // Handle video play/pause
  const togglePlay = (id: string) => {
    const videoElement = videoRefs.current[id]
    if (!videoElement) return

    if (videoElement.paused) {
      videoElement.play()
      setIsPlaying((prev) => ({ ...prev, [id]: true }))
    } else {
      videoElement.pause()
      setIsPlaying((prev) => ({ ...prev, [id]: false }))
    }
  }

  // Handle tutorial click
  const handleTutorialClick = (tutorial: any) => {
    setSelectedTutorial(tutorial)
  }

  // Handle celebrity click
  const handleCelebrityClick = (celebrity: any) => {
    setSelectedCelebrity(celebrity)
  }

  // Handle live stream click
  const handleLiveStreamClick = (stream: any) => {
    setSelectedLiveStream(stream)
    setIsLiveModalOpen(true)
  }

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Tutorials" },
    { id: "skincare", name: "Skincare" },
    { id: "makeup", name: "Makeup" },
    { id: "haircare", name: "Hair Care" },
    { id: "nailcare", name: "Nail Care" },
    { id: "bodycare", name: "Body Care" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-300 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-300 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/beauty-and-massage/shop" className="flex items-center text-white mb-4 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Beauty Shop
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Beauty Tutorials & Demonstrations</h1>
          <p className="text-pink-100 max-w-2xl text-lg">
            Watch expert tutorials, celebrity beauty routines, and live demonstrations to get the most out of your
            beauty products.
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search tutorials, creators, or products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full border-pink-200 focus:border-pink-500 focus:ring-pink-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-400" />
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center gap-2 border-pink-200 hover:bg-pink-50"
          >
            <Filter className="h-4 w-4 text-pink-500" />
            <span>Categories</span>
          </Button>
        </div>

        {/* Category filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4"
            >
              <div className="flex flex-wrap gap-2 py-4">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "rounded-full border-pink-200 hover:bg-pink-50",
                      activeCategory === category.id && "bg-pink-100 border-pink-300 text-pink-700",
                    )}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="featured" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white p-1 rounded-xl mb-6 flex flex-nowrap overflow-x-auto hide-scrollbar border border-pink-100 shadow-sm">
            <TabsTrigger
              value="featured"
              className={`flex items-center gap-1.5 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "featured" ? "bg-pink-500 text-white shadow-sm" : "text-gray-700 hover:bg-pink-50"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Featured Tutorials</span>
            </TabsTrigger>
            <TabsTrigger
              value="live"
              className={`flex items-center gap-1.5 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "live" ? "bg-pink-500 text-white shadow-sm" : "text-gray-700 hover:bg-pink-50"
              }`}
            >
              <Play className="h-4 w-4" />
              <span>Live Demonstrations</span>
            </TabsTrigger>
            <TabsTrigger
              value="celebrity"
              className={`flex items-center gap-1.5 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "celebrity" ? "bg-pink-500 text-white shadow-sm" : "text-gray-700 hover:bg-pink-50"
              }`}
            >
              <Star className="h-4 w-4" />
              <span>Celebrity Routines</span>
            </TabsTrigger>
            <TabsTrigger
              value="previous"
              className={`flex items-center gap-1.5 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "previous" ? "bg-pink-500 text-white shadow-sm" : "text-gray-700 hover:bg-pink-50"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Previous Tutorials</span>
            </TabsTrigger>
          </TabsList>

          {/* Featured Tutorials Tab */}
          <TabsContent value="featured" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutorials.map((tutorial) => (
                <motion.div
                  key={tutorial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <Card className="h-full overflow-hidden border-pink-100 hover:border-pink-300 hover:shadow-md transition-all duration-300">
                    <div
                      className="relative h-64 bg-pink-50 cursor-pointer"
                      onClick={() => handleTutorialClick(tutorial)}
                    >
                      <div className="absolute inset-0 overflow-hidden">
                        <video
                          ref={(el) => (videoRefs.current[tutorial.id] = el)}
                          src={tutorial.videoUrl}
                          poster={tutorial.thumbnailUrl}
                          className="w-full h-full object-cover"
                          loop
                          muted
                          playsInline
                          onEnded={() => setIsPlaying((prev) => ({ ...prev, [tutorial.id]: false }))}
                        />
                      </div>

                      {/* Play/Pause button */}
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePlay(tutorial.id)
                        }}
                      >
                        <div className="w-14 h-14 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                          {isPlaying[tutorial.id] ? (
                            <Pause className="h-6 w-6 text-pink-600" />
                          ) : (
                            <Play className="h-6 w-6 text-pink-600 ml-1" />
                          )}
                        </div>
                      </div>

                      {/* Duration badge */}
                      <div className="absolute bottom-2 right-2">
                        <Badge className="bg-black bg-opacity-70 text-white border-0">{tutorial.duration}</Badge>
                      </div>

                      {/* Category badge */}
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-pink-500 hover:bg-pink-600 text-white">
                          {tutorial.category.charAt(0).toUpperCase() + tutorial.category.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={tutorial.creator.avatarUrl} alt={tutorial.creator.name} />
                          <AvatarFallback>{tutorial.creator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{tutorial.creator.name}</p>
                          <p className="text-xs text-gray-500">{tutorial.creator.followers} followers</p>
                        </div>
                      </div>

                      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{tutorial.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tutorial.description}</p>

                      {/* Featured products */}
                      {tutorial.products.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-700 mb-1">Featured Products:</p>
                          <div className="flex flex-wrap gap-1">
                            {tutorial.products.slice(0, 3).map((product) => (
                              <Badge
                                key={product.id}
                                variant="outline"
                                className="text-xs border-pink-200 text-pink-700"
                              >
                                {product.name}
                              </Badge>
                            ))}
                            {tutorial.products.length > 3 && (
                              <Badge variant="outline" className="text-xs border-pink-200 text-pink-700">
                                +{tutorial.products.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          <span>{tutorial.views} views</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{tutorial.publishedAt}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Button variant="outline" size="sm" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                        <Heart className="h-4 w-4 mr-1" />
                        <span>Save</span>
                      </Button>

                      <Button
                        size="sm"
                        className="bg-pink-500 hover:bg-pink-600 text-white"
                        onClick={() => handleTutorialClick(tutorial)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        <span>Watch Now</span>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredTutorials.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">No tutorials found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We couldn't find any tutorials matching your criteria. Try adjusting your filters or search term.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Live Demonstrations Tab */}
          <TabsContent value="live" className="mt-0">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                Live Now
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveBeautyStreams
                  .filter((stream) => stream.isLive)
                  .map((stream) => (
                    <motion.div
                      key={stream.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="h-full"
                    >
                      <Card className="h-full overflow-hidden border-pink-100 hover:border-pink-300 hover:shadow-md transition-all duration-300">
                        <div
                          className="relative h-64 bg-pink-50 cursor-pointer"
                          onClick={() => handleLiveStreamClick(stream)}
                        >
                          <Image
                            src={stream.thumbnailUrl || "/placeholder.svg"}
                            alt={stream.title}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 hover:scale-105"
                          />

                          {/* Live badge */}
                          <div className="absolute top-2 left-2 flex items-center">
                            <Badge className="bg-red-500 hover:bg-red-600 text-white flex items-center">
                              <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                              <span>LIVE</span>
                            </Badge>
                          </div>

                          {/* Viewers count */}
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-black bg-opacity-70 text-white border-0 flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              <span>{stream.viewerCount} watching</span>
                            </Badge>
                          </div>

                          {/* Play button */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all duration-300">
                            <div className="w-14 h-14 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                              <Play className="h-6 w-6 text-pink-600 ml-1" />
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={stream.host.avatarUrl} alt={stream.host.name} />
                              <AvatarFallback>{stream.host.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{stream.host.name}</p>
                              <p className="text-xs text-gray-500">{stream.host.role}</p>
                            </div>
                          </div>

                          <h3 className="font-semibold text-gray-800 mb-1">{stream.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{stream.description}</p>

                          {/* Featured products */}
                          {stream.products.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-medium text-gray-700 mb-1">Products Being Demonstrated:</p>
                              <div className="flex flex-wrap gap-1">
                                {stream.products.slice(0, 2).map((product) => (
                                  <Badge
                                    key={product.id}
                                    variant="outline"
                                    className="text-xs border-pink-200 text-pink-700"
                                  >
                                    {product.name}
                                  </Badge>
                                ))}
                                {stream.products.length > 2 && (
                                  <Badge variant="outline" className="text-xs border-pink-200 text-pink-700">
                                    +{stream.products.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>

                        <CardFooter className="p-4 pt-0">
                          <Button
                            className="w-full bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => handleLiveStreamClick(stream)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            <span>Join Live Stream</span>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Live Demonstrations</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveBeautyStreams
                  .filter((stream) => !stream.isLive)
                  .map((stream) => (
                    <motion.div
                      key={stream.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="h-full"
                    >
                      <Card className="h-full overflow-hidden border-pink-100 hover:border-pink-300 hover:shadow-md transition-all duration-300">
                        <div className="relative h-64 bg-pink-50">
                          <Image
                            src={stream.thumbnailUrl || "/placeholder.svg"}
                            alt={stream.title}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 hover:scale-105 filter brightness-90"
                          />

                          {/* Upcoming badge */}
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-purple-500 hover:bg-purple-600 text-white">Upcoming</Badge>
                          </div>

                          {/* Scheduled time */}
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-black bg-opacity-70 text-white border-0 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{stream.scheduledFor}</span>
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={stream.host.avatarUrl} alt={stream.host.name} />
                              <AvatarFallback>{stream.host.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{stream.host.name}</p>
                              <p className="text-xs text-gray-500">{stream.host.role}</p>
                            </div>
                          </div>

                          <h3 className="font-semibold text-gray-800 mb-1">{stream.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{stream.description}</p>

                          {/* Featured products */}
                          {stream.products.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-medium text-gray-700 mb-1">Products To Be Demonstrated:</p>
                              <div className="flex flex-wrap gap-1">
                                {stream.products.slice(0, 2).map((product) => (
                                  <Badge
                                    key={product.id}
                                    variant="outline"
                                    className="text-xs border-pink-200 text-pink-700"
                                  >
                                    {product.name}
                                  </Badge>
                                ))}
                                {stream.products.length > 2 && (
                                  <Badge variant="outline" className="text-xs border-pink-200 text-pink-700">
                                    +{stream.products.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>

                        <CardFooter className="p-4 pt-0">
                          <Button
                            variant="outline"
                            className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                          >
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Set Reminder</span>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* Celebrity Routines Tab */}
          <TabsContent value="celebrity" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {celebrityRoutines.map((celebrity) => (
                <motion.div
                  key={celebrity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <Card className="h-full overflow-hidden border-pink-100 hover:border-pink-300 hover:shadow-md transition-all duration-300">
                    <div
                      className="relative h-80 bg-pink-50 cursor-pointer"
                      onClick={() => handleCelebrityClick(celebrity)}
                    >
                      <Image
                        src={celebrity.coverImageUrl || "/placeholder.svg"}
                        alt={celebrity.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>

                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <div className="flex items-center mb-2">
                          <Avatar className="h-12 w-12 border-2 border-white">
                            <AvatarImage src={celebrity.avatarUrl} alt={celebrity.name} />
                            <AvatarFallback>{celebrity.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="ml-3">
                            <h3 className="text-xl font-bold">{celebrity.name}</h3>
                            <p className="text-sm text-gray-200">{celebrity.profession}</p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-200 line-clamp-2">{celebrity.bio}</p>
                      </div>

                      {/* Verified badge */}
                      {celebrity.isVerified && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-blue-500 hover:bg-blue-600 text-white flex items-center">
                            <Award className="h-3 w-3 mr-1" />
                            <span>Verified</span>
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Beauty Routine Highlights:</h4>
                      <ul className="space-y-2 mb-4">
                        {celebrity.routineHighlights.slice(0, 3).map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <ChevronRight className="h-4 w-4 text-pink-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Featured products */}
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-2">Favorite Products:</p>
                        <div className="flex flex-wrap gap-2">
                          {celebrity.favoriteProducts.slice(0, 3).map((product) => (
                            <div key={product.id} className="flex items-center bg-pink-50 rounded-full px-3 py-1">
                              <div className="w-6 h-6 rounded-full bg-white overflow-hidden mr-2">
                                <Image
                                  src={product.imageUrl || "/placeholder.svg"}
                                  alt={product.name}
                                  width={24}
                                  height={24}
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-xs text-pink-700">{product.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                        onClick={() => handleCelebrityClick(celebrity)}
                      >
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>View Full Routine</span>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Previous Tutorials Tab */}
          <TabsContent value="previous" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previousTutorials.map((tutorial) => (
                <motion.div
                  key={tutorial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <Card className="h-full overflow-hidden border-pink-100 hover:border-pink-300 hover:shadow-md transition-all duration-300">
                    <div
                      className="relative h-48 bg-pink-50 cursor-pointer"
                      onClick={() => handleTutorialClick(tutorial)}
                    >
                      <Image
                        src={tutorial.thumbnailUrl || "/placeholder.svg"}
                        alt={tutorial.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 hover:scale-105"
                      />

                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                          <Play className="h-5 w-5 text-pink-600 ml-0.5" />
                        </div>
                      </div>

                      {/* Duration badge */}
                      <div className="absolute bottom-2 right-2">
                        <Badge className="bg-black bg-opacity-70 text-white border-0">{tutorial.duration}</Badge>
                      </div>

                      {/* Category badge */}
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-pink-500 hover:bg-pink-600 text-white">
                          {tutorial.category.charAt(0).toUpperCase() + tutorial.category.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={tutorial.creator.avatarUrl} alt={tutorial.creator.name} />
                          <AvatarFallback>{tutorial.creator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="text-xs font-medium text-gray-800">{tutorial.creator.name}</p>
                      </div>

                      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{tutorial.title}</h3>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{tutorial.description}</p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          <span>{tutorial.views} views</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{tutorial.publishedAt}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                        onClick={() => handleTutorialClick(tutorial)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        <span>Watch Tutorial</span>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Tutorial Detail Modal */}
      <Dialog open={!!selectedTutorial} onOpenChange={(open) => !open && setSelectedTutorial(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTutorial && (
            <div>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <video
                  src={selectedTutorial.videoUrl}
                  poster={selectedTutorial.thumbnailUrl}
                  controls
                  className="w-full h-full"
                  autoPlay
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-pink-500 text-white">
                    {selectedTutorial.category.charAt(0).toUpperCase() + selectedTutorial.category.slice(1)}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{selectedTutorial.views} views</span>
                    <span className="mx-2">•</span>
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{selectedTutorial.publishedAt}</span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedTutorial.title}</h2>
                <p className="text-gray-600 mb-4">{selectedTutorial.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={selectedTutorial.creator.avatarUrl} alt={selectedTutorial.creator.name} />
                      <AvatarFallback>{selectedTutorial.creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">{selectedTutorial.creator.name}</p>
                      <p className="text-sm text-gray-500">{selectedTutorial.creator.followers} followers</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>Save</span>
                    </Button>
                    <Button variant="outline" size="sm" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                      <Share2 className="h-4 w-4 mr-1" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Products Used in This Tutorial</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {selectedTutorial.products.map((product) => (
                    <div key={product.id} className="bg-pink-50 rounded-lg p-3 flex items-center">
                      <div className="w-12 h-12 bg-white rounded-md overflow-hidden mr-3 flex-shrink-0">
                        <Image
                          src={product.imageUrl || "/placeholder.svg"}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">{product.name}</p>
                        <p className="text-pink-600 text-xs">{product.price}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="ml-auto flex-shrink-0">
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {selectedTutorial.steps && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Tutorial Steps</h3>
                    <ol className="space-y-4">
                      {selectedTutorial.steps.map((step, index) => (
                        <li key={index} className="flex">
                          <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-medium mr-3">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 mb-1">{step.title}</p>
                            <p className="text-sm text-gray-600">{step.description}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Comments</h3>

                  <div className="flex mb-4">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Your avatar" />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Input
                        placeholder="Add a comment..."
                        className="border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedTutorial.comments &&
                      selectedTutorial.comments.map((comment, index) => (
                        <div key={index} className="flex">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={comment.user.avatarUrl} alt={comment.user.name} />
                            <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center mb-1">
                              <p className="font-medium text-gray-800 text-sm">{comment.user.name}</p>
                              <span className="mx-2 text-gray-400 text-xs">•</span>
                              <p className="text-gray-500 text-xs">{comment.timeAgo}</p>
                            </div>
                            <p className="text-sm text-gray-600">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Celebrity Routine Modal */}
      <Dialog open={!!selectedCelebrity} onOpenChange={(open) => !open && setSelectedCelebrity(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCelebrity && (
            <div>
              <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                <Image
                  src={selectedCelebrity.coverImageUrl || "/placeholder.svg"}
                  alt={selectedCelebrity.name}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center">
                    <Avatar className="h-16 w-16 border-2 border-white">
                      <AvatarImage src={selectedCelebrity.avatarUrl} alt={selectedCelebrity.name} />
                      <AvatarFallback>{selectedCelebrity.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h2 className="text-2xl font-bold">{selectedCelebrity.name}</h2>
                        {selectedCelebrity.isVerified && (
                          <Badge className="ml-2 bg-blue-500 text-white flex items-center">
                            <Award className="h-3 w-3 mr-1" />
                            <span>Verified</span>
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-200">{selectedCelebrity.profession}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">About {selectedCelebrity.name}</h3>
                  <p className="text-gray-600 mb-6">{selectedCelebrity.bio}</p>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Beauty Philosophy</h3>
                  <div className="bg-pink-50 rounded-lg p-4 mb-6">
                    <p className="text-gray-700 italic">"{selectedCelebrity.beautyPhilosophy}"</p>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Beauty Routine</h3>
                  <div className="space-y-6">
                    {selectedCelebrity.routineSections.map((section, index) => (
                      <div key={index}>
                        <h4 className="text-lg font-medium text-gray-800 mb-3">{section.title}</h4>
                        <ul className="space-y-3">
                          {section.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start">
                              <div className="flex-shrink-0 w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-medium mr-3 mt-0.5">
                                {stepIndex + 1}
                              </div>
                              <div>
                                <p className="text-gray-700">{step}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Favorite Products</h3>
                  <div className="space-y-4">
                    {selectedCelebrity.favoriteProducts.map((product) => (
                      <div key={product.id} className="bg-white rounded-lg shadow-sm border border-pink-100 p-3">
                        <div className="flex items-center mb-3">
                          <div className="w-12 h-12 bg-pink-50 rounded-md overflow-hidden mr-3">
                            <Image
                              src={product.imageUrl || "/placeholder.svg"}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                            <p className="text-pink-600 text-xs">{product.price}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{product.description}</p>
                        <Button size="sm" className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                          <ShoppingBag className="h-3 w-3 mr-1" />
                          <span>Shop Now</span>
                        </Button>
                      </div>
                    ))}
                  </div>

                  {selectedCelebrity.tutorials && selectedCelebrity.tutorials.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Related Tutorials</h3>
                      <div className="space-y-3">
                        {selectedCelebrity.tutorials.map((tutorial, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-white rounded-lg shadow-sm border border-pink-100 p-2"
                          >
                            <div className="w-16 h-12 bg-pink-50 rounded-md overflow-hidden mr-3 flex-shrink-0 relative">
                              <Image
                                src={tutorial.thumbnailUrl || "/placeholder.svg"}
                                alt={tutorial.title}
                                layout="fill"
                                objectFit="cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Play className="h-4 w-4 text-white" />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-800 text-sm truncate">{tutorial.title}</p>
                              <p className="text-xs text-gray-500">{tutorial.duration}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Live Stream Modal */}
      <Dialog open={isLiveModalOpen} onOpenChange={setIsLiveModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
          {selectedLiveStream && (
            <div>
              <div className="relative aspect-video bg-black">
                <Image
                  src={selectedLiveStream.streamUrl || selectedLiveStream.thumbnailUrl}
                  alt={selectedLiveStream.title}
                  layout="fill"
                  objectFit="cover"
                />

                {/* Live badge */}
                <div className="absolute top-4 left-4 flex items-center">
                  <Badge className="bg-red-500 text-white flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                    <span>LIVE</span>
                  </Badge>
                </div>

                {/* Viewers count */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-black bg-opacity-70 text-white border-0 flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    <span>{selectedLiveStream.viewerCount} watching</span>
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-3">
                      <AvatarImage src={selectedLiveStream.host.avatarUrl} alt={selectedLiveStream.host.name} />
                      <AvatarFallback>{selectedLiveStream.host.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{selectedLiveStream.title}</h2>
                      <p className="text-gray-600">
                        Hosted by <span className="font-medium">{selectedLiveStream.host.name}</span> •{" "}
                        {selectedLiveStream.host.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>Follow</span>
                    </Button>
                    <Button variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                      <Share2 className="h-4 w-4 mr-1" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{selectedLiveStream.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Chat</h3>
                    <div className="bg-gray-50 rounded-lg h-80 p-4 mb-4 overflow-y-auto">
                      <div className="space-y-4">
                        {selectedLiveStream.chat &&
                          selectedLiveStream.chat.map((message, index) => (
                            <div key={index} className="flex items-start">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={message.user.avatarUrl} alt={message.user.name} />
                                <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center">
                                  <p className="font-medium text-gray-800 text-sm">{message.user.name}</p>
                                  {message.user.isHost && (
                                    <Badge className="ml-1 bg-pink-500 text-white text-xs py-0 px-1">Host</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{message.text}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="flex">
                      <Input
                        placeholder="Type a message..."
                        className="border-pink-200 focus:border-pink-500 focus:ring-pink-500 mr-2"
                      />
                      <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>Send</span>
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Products Being Demonstrated</h3>
                    <div className="space-y-3">
                      {selectedLiveStream.products.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-sm border border-pink-100 p-3">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 bg-pink-50 rounded-md overflow-hidden mr-3">
                              <Image
                                src={product.imageUrl || "/placeholder.svg"}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                              <p className="text-pink-600 text-xs">{product.price}</p>
                            </div>
                          </div>
                          <Button size="sm" className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                            <ShoppingBag className="h-3 w-3 mr-1" />
                            <span>Shop Now</span>
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming in This Stream</h3>
                      <ul className="space-y-2">
                        {selectedLiveStream.agenda &&
                          selectedLiveStream.agenda.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <div className="flex-shrink-0 w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-medium mr-2 mt-0.5">
                                {index + 1}
                              </div>
                              <div>
                                <p className="text-sm text-gray-700">{item}</p>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

