"use client"

import { useState, useEffect } from "react"

export default function greet() {
  const [greet, setgreet] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setgreet("Good morning ☀ ☕🍪🍞🥞")
    } else if (hour >= 12 && hour < 18) {
      setgreet("Good afternoon ⛅ 🧃🍦🍨")
     
    } else {
      setgreet("Good evening 🌙⭐ 🍽 🍚🥣 🥂🍻")
    }
  }, [])

  return (
    <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">{greet}, Have a Good One 🥰 and Happy Shopping✨🎊!</h2>
  )
}

