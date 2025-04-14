"use client"

import { Loader2, Droplets, Wine, Beer, Martini, Coffee } from "lucide-react"

export default function DrinksShopLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex flex-col items-center justify-center p-4">
      {/* Liquid filling animation container */}
      <div className="w-full max-w-md h-64 relative mb-8">
        <div className="absolute bottom-0 left-0 right-0 h-64 rounded-lg overflow-hidden border-2 border-blue-300 bg-white/50 backdrop-blur-sm">
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-400 to-indigo-500 animate-liquid-fill">
            {/* Bubbles */}
            <div className="bubble bubble-1"></div>
            <div className="bubble bubble-2"></div>
            <div className="bubble bubble-3"></div>
            <div className="bubble bubble-4"></div>
            <div className="bubble bubble-5"></div>
            <div className="bubble bubble-6"></div>
          </div>
        </div>

        {/* Glass rim */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-white/30 backdrop-blur-sm rounded-t-lg border-2 border-blue-300"></div>

        {/* Straw */}
        <div className="absolute top-0 right-1/4 w-3 h-72 bg-gradient-to-b from-red-400 to-red-500 rounded-full transform -rotate-12"></div>
      </div>

      <div className="bg-white/80 p-8 rounded-xl shadow-2xl border border-blue-200 backdrop-blur-sm max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Droplets className="h-16 w-16 text-blue-500 animate-pulse" />
            <div className="absolute -top-2 -right-2 h-5 w-5 bg-indigo-500 rounded-full animate-ping"></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          Pouring Your Refreshments...
        </h2>

        {/* Rotating drink icons */}
        <div className="flex justify-center mb-8">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
              <Beer
                className="h-8 w-8 text-amber-500 absolute"
                style={{ top: "0", left: "50%", transform: "translateX(-50%)" }}
              />
              <Wine
                className="h-8 w-8 text-purple-500 absolute"
                style={{ bottom: "0", left: "50%", transform: "translateX(-50%)" }}
              />
              <Coffee
                className="h-8 w-8 text-brown-500 absolute"
                style={{ left: "0", top: "50%", transform: "translateY(-50%)" }}
              />
              <Martini
                className="h-8 w-8 text-blue-400 absolute"
                style={{ right: "0", top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-blue-100 rounded-full h-4 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full animate-progress"></div>
        </div>

        <div className="text-gray-600 text-center">
          <p className="mb-2">Please wait while we prepare your refreshing drinks...</p>
          <p className="text-sm">Your thirst will be quenched momentarily</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes progress {
          0% { width: 5%; }
          50% { width: 70%; }
          100% { width: 90%; }
        }
        @keyframes liquid-fill {
          0% { height: 0%; }
          50% { height: 70%; }
          75% { height: 85%; }
          90% { height: 80%; }
          100% { height: 85%; }
        }
        @keyframes bubble-rise {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-100px) scale(1); opacity: 0; }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-progress {
          animation: progress 2.5s ease-in-out infinite;
        }
        .animate-liquid-fill {
          animation: liquid-fill 3s ease-out forwards;
          height: 0%;
        }
        .bubble {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          animation: bubble-rise 3s ease-in infinite;
        }
        .bubble-1 {
          width: 15px;
          height: 15px;
          left: 10%;
          bottom: 10%;
          animation-delay: 0.2s;
        }
        .bubble-2 {
          width: 10px;
          height: 10px;
          left: 20%;
          bottom: 30%;
          animation-delay: 0.8s;
        }
        .bubble-3 {
          width: 8px;
          height: 8px;
          left: 40%;
          bottom: 5%;
          animation-delay: 0.5s;
        }
        .bubble-4 {
          width: 12px;
          height: 12px;
          left: 60%;
          bottom: 20%;
          animation-delay: 1.2s;
        }
        .bubble-5 {
          width: 6px;
          height: 6px;
          left: 80%;
          bottom: 10%;
          animation-delay: 0.3s;
        }
        .bubble-6 {
          width: 9px;
          height: 9px;
          left: 90%;
          bottom: 40%;
          animation-delay: 0.9s;
        }
      `}</style>
    </div>
  )
}

