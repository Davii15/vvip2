import type React from "react"
export default function LiveStreamingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">{children}</div>
}

