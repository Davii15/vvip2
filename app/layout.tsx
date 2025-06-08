import React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import GoogleAnalytics from "../components/GoogleAnalytics"
import { PageViewTracker } from "../components/PageViewTracker"
import FloatingNotepad from "../components/FloatingNotepad"
import { useCookieTracking } from "../lib/cookies"
import SplashWrapper from "../components/SplashWrapper"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OneShopDiscount.com - Your Ultimate Discount Radar",
  description: "Discover the hottest deals from your favorite vendors, all in one place! Experience meets convenience.",
  keywords: "discounts, deals, shopping, Kenya, Africa, marketplace, vendors, savings",
  authors: [{ name: "OneShopDiscount Team" }],
  creator: "OneShopDiscount",
  publisher: "OneShopDiscount",
  robots: "index, follow",
  openGraph: {
    title: "OneShopDiscount.com - Your Ultimate Discount Radar",
    description: "It's where experience meets convenience. Discover amazing deals from your favorite vendors!",
    url: "https://oneshop-discount.com",
    siteName: "OneShopDiscount",
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OneShopDiscount.com - Your Ultimate Discount Radar",
    description: "It's where experience meets convenience. Discover amazing deals!",
  },
  icons: {
    icon: [
      { url: "/images/favicon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#FF8C00", // African orange theme
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external resources only */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* African theme colors for browser UI */}
        <meta name="theme-color" content="#FF8C00" />
        <meta name="msapplication-TileColor" content="#FF8C00" />

        {/* Splash screen meta tags */}
        <meta name="splash-duration" content="240" />
        <meta name="splash-theme" content="african-vibe" />
      </head>
      <body className={inter.className}>
        <SplashWrapper>
          <Suspense fallback={<div>Loading...</div>}>
            <MainApplicationLayout>{children}</MainApplicationLayout>
          </Suspense>
        </SplashWrapper>

        {/* Global Components - Always Available */}
        <GoogleAnalytics />
        <FloatingNotepad />
        {/*<BotpressChat />*/}
        <React.Suspense fallback={null}>
          <PageViewTracker />
        </React.Suspense>
      </body>
    </html>
  )
}

// Separate component for main application layout
function MainApplicationLayout({ children }: { children: React.ReactNode }) {
  // Track page visit - moved inside component to avoid hook issues
  useCookieTracking("home")

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
