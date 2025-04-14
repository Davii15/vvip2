export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-blue-400 border-t-transparent"></div>
        <p className="mt-4 text-xl font-medium text-blue-600">Loading amazing travel options...</p>
      </div>
    </div>
  )
}

