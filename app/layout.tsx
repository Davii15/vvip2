import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import GoogleAnalytics from "@/components/GoogleAnalytics"
import type React from "react"
import BotpressChat from "../components/BotpressChat"
import { MessageCircle } from "lucide-react"
import { PageViewTracker } from "@/components/PageViewTracker"
import FloatingNotepad from "@/components/FloatingNotepad"
import { useCookieTracking } from "@/lib/cookies"



const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OneShopDiscount.com",
  description: "Your Ultimate Discount Radar",
  icons: {
      icon: [{ url: "/images/favicon.png", type: "image/png" }],
    },
  }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
// Track page visit
useCookieTracking("home")
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}  </main>
          <Footer />
        </div>
        <GoogleAnalytics />
        <FloatingNotepad />
      {/*<BotpressChat />*/}
      <PageViewTracker />
      </body>
    </html>
  )
}

