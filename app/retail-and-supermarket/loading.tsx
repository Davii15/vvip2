export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-purple-400 border-t-transparent"></div>
        <p className="mt-4 text-xl font-medium text-purple-600">Loading amazing retail deals for You!...</p>
      </div>
    </div>
  )
}

