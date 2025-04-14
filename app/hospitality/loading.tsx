export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-amber-400 to-green-500 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-amber-400 border-t-transparent"></div>
        <p className="mt-4 text-xl font-medium text-amber-100">Loading exceptional hospitality experiences...</p>
      </div>
    </div>
  )
}


  