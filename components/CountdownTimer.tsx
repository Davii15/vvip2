"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  targetDate: string
  startDate: string
}

export default function CountdownTimer({ targetDate, startDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const start = new Date(startDate).getTime()
      const target = new Date(targetDate).getTime()

      if (now < start) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }) // Not started yet
        return
      }

      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate, startDate])

  return (
    <div className="bg-blue-900 rounded-xl p-6 mb-8 text-center shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Discount Ends In:</h2>
      <div className="flex justify-center space-x-4">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="flex flex-col items-center">
            <div className="text-4xl font-bold text-yellow-300 bg-blue-800 rounded-lg p-3 mb-2">
              {value.toString().padStart(2, "0")}
            </div>
            <div className="text-sm text-white uppercase">{unit}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

