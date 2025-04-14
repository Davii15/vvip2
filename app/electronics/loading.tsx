export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-600 to-sky-500 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-blue-400 border-t-transparent"></div>
        <p className="mt-4 text-xl font-medium text-blue-100"> Please wait as we Load Electronics Products or services...</p>
      </div>
    </div>
  )
}

