"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Filter, Search, X, Calendar, FileText } from "lucide-react"
import Image from "next/image"

// Types for our magazines
type MagazineCategory = "all" | "beauty" | "hospitality" | "health" | "agriculture" | "business" | "technology"

interface Magazine {
  id: string
  title: string
  category: MagazineCategory
  thumbnailUrl: string
  fileUrl: string
  fileType: "pdf" | "jpeg" | "png"
  date: string
  description?: string
}

// Sample data - in a real app, this would come from an API or database
const sampleMagazines: Magazine[] = [
  {
    id: "mag-001",
    title: "Beauty Trends 2025",
    category: "beauty",
    thumbnailUrl: "/placeholder.svg?height=400&width=300",
    fileUrl: "/magazines/beauty-trends-2025.pdf",
    fileType: "pdf",
    date: "2025-01-15",
    description: "Discover the latest beauty trends for 2025",
  },
  {
    id: "mag-002",
    title: "Luxury Hotels Guide",
    category: "hospitality",
    thumbnailUrl: "/placeholder.svg?height=400&width=300",
    fileUrl: "/magazines/luxury-hotels-guide.pdf",
    fileType: "pdf",
    date: "2025-02-10",
    description: "Explore the most luxurious hotels around the world",
  },
  {
    id: "mag-003",
    title: "Wellness & Health",
    category: "health",
    thumbnailUrl: "/placeholder.svg?height=400&width=300",
    fileUrl: "/magazines/wellness-health.pdf",
    fileType: "pdf",
    date: "2025-03-05",
    description: "Your guide to better health and wellness",
  },
  {
    id: "mag-004",
    title: "Modern Farming",
    category: "agriculture",
    thumbnailUrl: "/placeholder.svg?height=400&width=300",
    fileUrl: "/magazines/modern-farming.pdf",
    fileType: "pdf",
    date: "2025-02-28",
    description: "The latest innovations in agricultural technology",
  },
  {
    id: "mag-005",
    title: "Business Quarterly",
    category: "business",
    thumbnailUrl: "/placeholder.svg?height=400&width=300",
    fileUrl: "/magazines/business-quarterly.pdf",
    fileType: "pdf",
    date: "2025-03-15",
    description: "Insights and analysis for business leaders",
  },
  {
    id: "mag-006",
    title: "Tech Innovations",
    category: "technology",
    thumbnailUrl: "/placeholder.svg?height=400&width=300",
    fileUrl: "/magazines/tech-innovations.pdf",
    fileType: "pdf",
    date: "2025-03-20",
    description: "Exploring the cutting edge of technology",
  },
]

// Categories with their display names and colors
const categories: { id: MagazineCategory; name: string; color: string }[] = [
  { id: "all", name: "All Magazines", color: "bg-gradient-to-r from-blue-500 to-green-500" },
  { id: "beauty", name: "Beauty", color: "bg-gradient-to-r from-pink-500 to-purple-500" },
  { id: "hospitality", name: "Hospitality", color: "bg-gradient-to-r from-amber-500 to-orange-500" },
  { id: "health", name: "Health & Wellness", color: "bg-gradient-to-r from-green-500 to-teal-500" },
  { id: "agriculture", name: "Agriculture", color: "bg-gradient-to-r from-lime-500 to-emerald-500" },
  { id: "business", name: "Business", color: "bg-gradient-to-r from-blue-500 to-indigo-500" },
  { id: "technology", name: "Technology", color: "bg-gradient-to-r from-violet-500 to-purple-500" },
]

export default function MagazineDisplay() {
  const [selectedCategory, setSelectedCategory] = useState<MagazineCategory>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredMagazines, setFilteredMagazines] = useState<Magazine[]>(sampleMagazines)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null)

  useEffect(() => {
    setIsLoading(true)

    setTimeout(() => {
      let filtered = sampleMagazines

      if (selectedCategory !== "all") {
        filtered = filtered.filter((mag) => mag.category === selectedCategory)
      }

      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (mag) =>
            mag.title.toLowerCase().includes(query) ||
            mag.description?.toLowerCase().includes(query) ||
            mag.category.toLowerCase().includes(query),
        )
      }

      setFilteredMagazines(filtered)
      setIsLoading(false)
    }, 300)
  }, [selectedCategory, searchQuery])

  const handleDownload = (magazine: Magazine) => {
    console.log(`Downloading ${magazine.title}`)

    const link = document.createElement("a")
    link.href = magazine.fileUrl
    link.download = `${magazine.title}.${magazine.fileType}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openMagazineModal = (magazine: Magazine) => {
    setSelectedMagazine(magazine)
  }

  return (
    <motion.div
      className="w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-white/20 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative z-10">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-100/50 rounded-full blur-3xl"></div>

        <div className="text-center mb-8 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 inline-block">
            Digital Publications
          </h2>
          <motion.div
            className="h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mt-2 mx-auto"
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ delay: 0.2, duration: 0.8 }}
          />
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Browse our collection of magazines, brochures, and publications. Download and enjoy at your convenience.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search publications..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as MagazineCategory)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

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

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="loader"></div>
          </div>
        ) : filteredMagazines.length === 0 ? (
          <motion.div className="text-center py-16 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No publications found</h3>
            <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredMagazines.map((magazine) => {
                const categoryObj = categories.find((cat) => cat.id === magazine.category) || categories[0]

                return (
                  <motion.div
                    key={magazine.id}
                    className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5 }}
                    layout
                    onClick={() => openMagazineModal(magazine)}
                  >
                    <div
                      className={`absolute top-3 right-3 z-10 px-2 py-1 rounded-full text-xs font-medium text-white ${categoryObj.color}`}
                    >
                      {categoryObj.name}
                    </div>

                    <div className="relative p-3">
                      <div className="relative rounded-lg overflow-hidden aspect-[3/4] mb-3">
                        <div
                          className={`absolute inset-0 ${categoryObj.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                          style={{ mixBlendMode: "overlay" }}
                        ></div>
                        <Image
                          src={magazine.thumbnailUrl || "/placeholder.svg"}
                          alt={magazine.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <motion.div
                          className={`absolute inset-0 border-2 rounded-lg pointer-events-none`}
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          style={{
                            borderColor: categoryObj.color.includes("from-")
                              ? "rgba(59, 130, 246, 0.5)"
                              : "rgba(59, 130, 246, 0.5)",
                          }}
                        />
                      </div>

                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{magazine.title}</h3>
                      <p className="text-gray-500 text-sm mb-2 line-clamp-2">{magazine.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{new Date(magazine.date).toLocaleDateString()}</span>
                        <span className="text-xs font-medium uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                          {magazine.fileType}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      className={`w-full py-3 text-white font-medium flex items-center justify-center gap-2 ${categoryObj.color}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(magazine)
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download size={16} />
                      Download {magazine.fileType.toUpperCase()}
                    </motion.button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedMagazine && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMagazine(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`${categories.find((cat) => cat.id === selectedMagazine.category)?.color || categories[0].color} p-6 text-white relative`}
              >
                <button
                  onClick={() => setSelectedMagazine(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex gap-4">
                  <div className="w-24 h-32 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                    <Image
                      src={selectedMagazine.thumbnailUrl || "/placeholder.svg"}
                      alt={selectedMagazine.title}
                      width={96}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{selectedMagazine.title}</h2>
                    <p className="text-white/90 mb-3">{selectedMagazine.description}</p>
                    <div className="flex items-center gap-4 text-sm text-white/80">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(selectedMagazine.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText size={16} />
                        {selectedMagazine.fileType.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Publication Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <p className="font-medium capitalize">{selectedMagazine.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">File Type:</span>
                        <p className="font-medium">{selectedMagazine.fileType.toUpperCase()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Published:</span>
                        <p className="font-medium">{new Date(selectedMagazine.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">ID:</span>
                        <p className="font-medium">{selectedMagazine.id}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedMagazine.description || "No detailed description available for this publication."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Preview</h3>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="w-32 h-40 mx-auto rounded-lg overflow-hidden shadow-md mb-3">
                        <Image
                          src={selectedMagazine.thumbnailUrl || "/placeholder.svg"}
                          alt={selectedMagazine.title}
                          width={128}
                          height={160}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-500">Click download to access the full publication</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => handleDownload(selectedMagazine)}
                    className={`flex-1 py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 ${categories.find((cat) => cat.id === selectedMagazine.category)?.color || categories[0].color} hover:opacity-90 transition-opacity`}
                  >
                    <Download size={18} />
                    Download {selectedMagazine.fileType.toUpperCase()}
                  </button>
                  <button
                    onClick={() => setSelectedMagazine(null)}
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

      <style jsx>{`
        .loader {
          border: 3px solid rgba(59, 130, 246, 0.1);
          border-radius: 50%;
          border-top: 3px solid rgba(59, 130, 246, 1);
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  )
}
