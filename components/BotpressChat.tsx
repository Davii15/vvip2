"use client"

import { useState, useEffect } from "react"

// Import the configuration from webchatconfig.js
import botpressConfig from "./webchatconfig"

export default function BotpressChat() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    // Load Botpress script
    const script = document.createElement("script")
    script.src = "https://cdn.botpress.cloud/webchat/v1/inject.js"
    script.async = true
    document.body.appendChild(script)

    // Initialize Botpress
    script.onload = () => {
      // @ts-ignore
      window.botpressWebChat.init(botpressConfig)
    }

    return () => {
      // Clean up the script when the component unmounts
      document.body.removeChild(script)
    }
  }, [])

  // Function to toggle chat visibility
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
    if (!isChatOpen) {
      // @ts-ignore
      window.botpressWebChat.sendEvent({ type: "show" })
    } else {
      // @ts-ignore
      window.botpressWebChat.sendEvent({ type: "hide" })
    }
  }

  // Function to close chat
  const closeChat = () => {
    setIsChatOpen(false)
    // @ts-ignore
    window.botpressWebChat.sendEvent({ type: "hide" })
  }

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-50 transition-all duration-300 flex items-center justify-center"
        aria-label={isChatOpen ? "Close chat" : "Open chat"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      {/* Close button - only visible when chat is open */}
      {isChatOpen && (
        <button
          onClick={closeChat}
          className="fixed bottom-[460px] right-[360px] bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-lg z-[9999] transition-all duration-300"
          aria-label="Close chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </>
  )
}

