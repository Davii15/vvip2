"use client"

import { useState, useEffect } from "react"

export default function Greeting() {
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning")
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon")
    } else {
      setGreeting("Good evening")
    }
  }, [])

  return (
    <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">{greeting}, The world of Discounts and Offers is back!,with a Bang!</h2>
  )
}

