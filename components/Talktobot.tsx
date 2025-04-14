"use client"

import { useState } from "react"
import { SmartphoneIcon } from "lucide-react"
import confetti from "canvas-confetti"
import { useRouter } from "next/navigation"

export default function GetShoppingButton() {
  const [isAnimating, setIsAnimating] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    setIsAnimating(true)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
    setTimeout(() => {
      setIsAnimating(false)
      router.push("https://cdn.botpress.cloud/webchat/v2.3/shareable.html?configUrl=https://files.bpcontent.cloud/2025/03/29/04/20250329045839-CS6I802Q.json")
    }, 1000)
  }

  return (
    <div className="flex justify-center">
      <button
        onClick={handleClick}
        className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-2 px-4 rounded-full text-xl transition duration-300 ease-in-out transform hover:scale-105 relative overflow-hidden"
      >
        Chat with OneshopTalkie
        <SmartphoneIcon className={`inline-block ml-2 ${isAnimating ? "animate-cart" : ""}`} />
      </button>
    </div>
  )
}

