"use client"

import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="relative">
        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-amber-400 to-red-600 opacity-75 blur"></div>
        <div className="relative rounded-lg bg-black p-8">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-center font-serif text-3xl font-bold text-amber-400">Loading Entertainment</h2>
            <div className="flex items-center justify-center space-x-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-red-500"></div>
              <div className="h-3 w-3 animate-pulse rounded-full bg-amber-500 delay-75"></div>
              <div className="h-3 w-3 animate-pulse rounded-full bg-red-500 delay-150"></div>
              <div className="h-3 w-3 animate-pulse rounded-full bg-amber-500 delay-300"></div>
              <div className="h-3 w-3 animate-pulse rounded-full bg-red-500 delay-500"></div>
            </div>
            <Loader2 className="h-10 w-10 animate-spin text-amber-400" />
            <p className="text-center text-gray-400">Preparing your streaming experience...</p>
          </div>
        </div>
      </div>

      {/* Theater curtain animation */}
      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-80"></div>
        <div className="absolute left-0 top-0 h-full w-1/2 animate-curtainLeft bg-gradient-to-r from-red-900 to-red-700 opacity-90"></div>
        <div className="absolute right-0 top-0 h-full w-1/2 animate-curtainRight bg-gradient-to-l from-red-900 to-red-700 opacity-90"></div>
      </div>

      <style jsx global>{`
        @keyframes curtainLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes curtainRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        .animate-curtainLeft {
          animation: curtainLeft 1.5s ease-in-out forwards;
          animation-delay: 0.5s;
        }
        .animate-curtainRight {
          animation: curtainRight 1.5s ease-in-out forwards;
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  )
}

