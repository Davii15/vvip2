"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Book, X } from "lucide-react"
import Notepad from "@/components/Notepad"

// Enhanced CATEGORY_PAGES with all customization options
const CATEGORY_PAGES = [
  {
    path: "/car-deals",
    title: "Car Deals",
    logo: "/images/car-deals-logo.png",
    topLeftLogo: "/images/car-topleft-logo.png",
    topRightLogo: "/images/car-topright-logo.png",
    bottomLeftLogo: "/images/car-bottomleft-logo.png",
    bottomRightLogo: "/images/car-bottomright-logo.png",
    pdfTextColor: "#333333",
    pdfBackgroundColor: "#f9f9f9",
    pdfFontSize: 12,
    pdfFontFamily: "helvetica",
    pdfHeaderText: "OneShopDiscount Car Deals",
    pdfFooterText: "© OneShopDiscount.com - Car Deals Division",
  },
  {
    path: "/entertainment",
    title: "Entertainment",
    logo: "/images/entertainment-logo.png",
    topLeftLogo: "/images/entertainment-topleft-logo.png",
    topRightLogo: "/images/entertainment-topright-logo.png",
    bottomLeftLogo: "/images/entertainment-bottomleft-logo.png",
    bottomRightLogo: "/images/entertainment-bottomright-logo.png",
    pdfTextColor: "#333333",
    pdfBackgroundColor: "#f9f9f9",
    pdfFontSize: 12,
    pdfFontFamily: "helvetica",
    pdfHeaderText: "OneShopDiscount Entertainment",
    pdfFooterText: "© OneShopDiscount.com - Entertainment Division",
  },
  {
    path: "/finance",
    title: "Finance",
    logo: "/images/finance-logo.png",
    topLeftLogo: "/images/finance-topleft-logo.png",
    topRightLogo: "/images/finance-topright-logo.png",
    bottomLeftLogo: "/images/finance-bottomleft-logo.png",
    bottomRightLogo: "/images/finance-bottomright-logo.png",
    pdfTextColor: "#003366",
    pdfBackgroundColor: "#f0f5ff",
    pdfFontSize: 12,
    pdfFontFamily: "helvetica",
    pdfHeaderText: "OneShopDiscount Finance",
    pdfFooterText: "© OneShopDiscount.com - Finance Division",
  },
  {
    path: "/health-services",
    title: "Health Services",
    logo: "/images/health-logo.png",
    topLeftLogo: "/images/health-topleft-logo.png",
    topRightLogo: "/images/health-topright-logo.png",
    bottomLeftLogo: "/images/health-bottomleft-logo.png",
    bottomRightLogo: "/images/health-bottomright-logo.png",
    pdfTextColor: "#006633",
    pdfBackgroundColor: "#f0fff5",
    pdfFontSize: 12,
    pdfFontFamily: "helvetica",
    pdfHeaderText: "OneShopDiscount Health Services",
    pdfFooterText: "© OneShopDiscount.com - Health Division",
  },
  {
    path: "/hospitality",
    title: "Hospitality",
    logo: "/images/hospitality-logo.png",
    topLeftLogo: "/images/hospitality-topleft-logo.png",
    topRightLogo: "/images/hospitality-topright-logo.png",
    bottomLeftLogo: "/images/hospitality-bottomleft-logo.png",
    bottomRightLogo: "/images/hospitality-bottomright-logo.png",
    pdfTextColor: "#663300",
    pdfBackgroundColor: "#fff9f0",
    pdfFontSize: 12,
    pdfFontFamily: "helvetica",
    pdfHeaderText: "OneShopDiscount Hospitality",
    pdfFooterText: "© OneShopDiscount.com - Hospitality Division",
  },
  {
    path: "/insurance",
    title: "Insurance",
    logo: "/images/insurance-logo.png",
    topLeftLogo: "/images/insurance-topleft-logo.png",
    topRightLogo: "/images/insurance-topright-logo.png",
    bottomLeftLogo: "/images/insurance-bottomleft-logo.png",
    bottomRightLogo: "/images/insurance-bottomright-logo.png",
    pdfTextColor: "#330066",
    pdfBackgroundColor: "#f5f0ff",
    pdfFontSize: 12,
    pdfFontFamily: "helvetica",
    pdfHeaderText: "OneShopDiscount Insurance",
    pdfFooterText: "© OneShopDiscount.com - Insurance Division",
  },
  {
    path: "/other-business-ventures",
    title: "Other Business Ventures",
    logo: "/images/business-logo.png",
    topLeftLogo: "/images/business-topleft-logo.png",
    topRightLogo: "/images/business-topright-logo.png",
    bottomLeftLogo: "/images/business-bottomleft-logo.png",
    bottomRightLogo: "/images/business-bottomright-logo.png",
    pdfTextColor: "#333333",
    pdfBackgroundColor: "#f9f9f9",
    pdfFontSize: 12,
    pdfFontFamily: "helvetica",
    pdfHeaderText: "OneShopDiscount Business Ventures",
    pdfFooterText: "© OneShopDiscount.com - Business Division",
  },
  {
    path: "/real-estate",
    title: "Real Estate",
    logo: "/images/real-estate-logo.png",
    topLeftLogo: "/images/realestate-topleft-logo.png",
    topRightLogo: "/images/realestate-topright-logo.png",
    bottomLeftLogo: "/images/realestate-bottomleft-logo.png",
    bottomRightLogo: "/images/realestate-bottomright-logo.png",
    pdfTextColor: "#660033",
    pdfBackgroundColor: "#fff0f5",
    pdfFontSize: 12,
    pdfFontFamily: "helvetica",
    pdfHeaderText: "OneShopDiscount Real Estate",
    pdfFooterText: "© OneShopDiscount.com - Real Estate Division",
  },
  {
    path: "/retail-and-supermarket",
    title: "Retail & Supermarket",
    logo: "/images/retail-logo.png",
    topLeftLogo: "/images/retail-topleft-logo.png",
    topRightLogo: "/images/retail-topright-logo.png",
    bottomLeftLogo: "/images/retail-bottomleft-logo.png",
    bottomRightLogo: "/images/retail-bottomright-logo.png",
    pdfTextColor: "#333333",
    pdfBackgroundColor: "#f9f9f9",
    pdfFontSize: 12,
    pdfFontFamily: "helvetica",
    pdfHeaderText: "OneShopDiscount Retail & Supermarket",
    pdfFooterText: "© OneShopDiscount.com - Retail Division",
  },
  {
    path: "/tourism-and-adventures",
    title: "Tourism & Adventures",
    logo: "/images/tourism-logo.png",
    topLeftLogo: "/images/tourism-topleft-logo.png",
    topRightLogo: "/images/tourism-topright-logo.png",
    bottomLeftLogo: "/images/tourism-bottomleft-logo.png",
    bottomRightLogo: "/images/tourism-bottomright-logo.png",
    pdfTextColor: "#006666",
    pdfBackgroundColor: "#f0ffff",
    pdfFontSize: 12,
    pdfFontFamily: "helvetica",
    pdfHeaderText: "OneShopDiscount Tourism & Adventures",
    pdfFooterText: "© OneShopDiscount.com - Tourism Division",
  },
  {
    path: "/travelling",
    title: "Travelling",
    logo: "/images/travel-logo.png",
    topLeftLogo: "/images/travel-topleft-logo.png",
    topRightLogo: "/images/travel-topright-logo.png",
    bottomLeftLogo: "/images/travel-bottomleft-logo.png",
    bottomRightLogo: "/images/travel-bottomright-logo.png",
    pdfTextColor: "#336699",
    pdfBackgroundColor: "#f0f8ff",
    pdfFontSize: 12,
    pdfFontFamily: "helvetica",
    pdfHeaderText: "OneShopDiscount Travelling",
    pdfFooterText: "© OneShopDiscount.com - Travel Division",
  },

{
  path: "/beauty-and-massage",
  title: "beauty-and-massage",
  logo: "/images/beauty-and-massage.png",
  topLeftLogo: "/images/beauty-and-massage-topleft-logo.png",
  topRightLogo: "/images/beauty-and-massage-topRight-logo.png",
  bottomLeftLogo: "/images/beauty-and-massage-bottomLeft-logo.png",
  bottomRightLogo: "/images/beauty-and-massage-bottomRight-logo.png",
  pdfTextColor: "#336699",
  pdfBackgroundColor: "#f0f8ff",
  pdfFontSize: 12,
  pdfFontFamily: "helvetica",
  pdfHeaderText: "OneShopDiscount beauty-and-massage",
  pdfFooterText: "© OneShopDiscount.com - beauty-and-massage Division",

},

{
  path: "/agriculture-deals",
  title: "agriculture-deals",
  logo: "/images/agriculture-deals-logo.png",
  topLeftLogo: "/images/agriculture-deals-topleft-logo.png",
  topRightLogo: "/images/agriculture-deals-topRight-logo.png",
  bottomLeftLogo: "/images/agriculture-deals-bottomLeft-logo.png",
  bottomRightLogo: "/images/agriculture-deals-bottomRight-logo.png",
  pdfTextColor: "#336699",
  pdfBackgroundColor: "#f0f8ff",
  pdfFontSize: 12,
  pdfFontFamily: "helvetica",
  pdfHeaderText: "OneShopDiscount agriculture-deals",
  pdfFooterText: "© OneShopDiscount.com - agriculture-deals Division",

},
{
  path: "/drinks",
  title: "drinks",
  logo: "/images/drinks-logo.png",
  topLeftLogo: "/images/drinks-topleft-logo.png",
  topRightLogo: "/images/drinks-topRight-logo.png",
  bottomLeftLogo: "/images/drinks-bottomLeft-logo.png",
  bottomRightLogo: "/images/drinks-bottomRight-logo.png",
  pdfTextColor: "#336699",
  pdfBackgroundColor: "#f0f8ff",
  pdfFontSize: 12,
  pdfFontFamily: "helvetica",
  pdfHeaderText: "OneShopDiscount drinks Deals",
  pdfFooterText: "© OneShopDiscount.com - drinks Division",

},
{
  path: "/construction-materials",
  title: "construction-materials",
  logo: "/images/construction-materials-logo.png",
  topLeftLogo: "/images/construction-materials-topleft-logo.png",
  topRightLogo: "/images/construction-materials-topRight-logo.png",
  bottomLeftLogo: "/images/construction-materials-bottomLeft-logo.png",
  bottomRightLogo: "/images/construction-materials-bottomRight-logo.png",
  pdfTextColor: "#336699",
  pdfBackgroundColor: "#f0f8ff",
  pdfFontSize: 12,
  pdfFontFamily: "helvetica",
  pdfHeaderText: "OneShopDiscount construction-materials Deals ",
  pdfFooterText: "© OneShopDiscount.com - construction-materials Division",

},
{
  path: "/electronics",
  title: "electronics",
  logo: "/images/electronics-logo.png",
  topLeftLogo: "/images/electronics-topleft-logo.png",
  topRightLogo: "/images/electronics-topRight-logo.png",
  bottomLeftLogo: "/images/electronics-bottomLeft-logo.png",
  bottomRightLogo: "/images/electronics-bottomRight-logo.png",
  pdfTextColor: "#336699",
  pdfBackgroundColor: "#f0f8ff",
  pdfFontSize: 12,
  pdfFontFamily: "helvetica",
  pdfHeaderText: "OneShopDiscount electronics Deals ",
  pdfFooterText: "© OneShopDiscount.com - electronic Deals Division",

},

]

export default function FloatingNotepad() {
  const [isOpen, setIsOpen] = useState(false)
  const [shouldShow, setShouldShow] = useState(false)
  const [currentPage, setCurrentPage] = useState({
    path: "",
    title: "",
    logo: "/images/logo.png",
    topLeftLogo: "/images/logo.png",
    topRightLogo: "/images/logo.png",
    bottomLeftLogo: "/images/logo.png",
    bottomRightLogo: "/images/logo.png",
    pdfTextColor: "#333333",
    pdfBackgroundColor: "#ffffff",
    pdfFontSize: 12,
    pdfFontFamily: "helvetica",
    pdfHeaderText: "",
    pdfFooterText: "© OneShopDiscount.com",
  })
  const pathname = usePathname()
  // Add a new state to track the notepad ID based on the current page
  const [notepadId, setNotepadId] = useState("notepad-notes-default")

  // Check if the current page is a category page and set the current page info
  useEffect(() => {
    const categoryPage = CATEGORY_PAGES.find((page) => pathname?.startsWith(page.path))
    if (categoryPage) {
      setShouldShow(true)
      setCurrentPage(categoryPage)
      // Set a unique notepad ID for this page
      setNotepadId(`notepad-notes-${categoryPage.path.replace(/\//g, "-")}`)
    } else {
      setShouldShow(false)
      setCurrentPage({
        path: "",
        title: "",
        logo: "/images/logo.png",
        topLeftLogo: "/images/logo.png",
        topRightLogo: "/images/logo.png",
        bottomLeftLogo: "/images/logo.png",
        bottomRightLogo: "/images/logo.png",
        pdfTextColor: "#333333",
        pdfBackgroundColor: "#ffffff",
        pdfFontSize: 12,
        pdfFontFamily: "helvetica",
        pdfHeaderText: "",
        pdfFooterText: "© OneShopDiscount.com",
      })
      setNotepadId("notepad-notes-default")
    }
  }, [pathname])

  // Don't render anything if not on a category page
  if (!shouldShow) return null

  return (
    <div className="fixed right-6 bottom-24 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[450px] max-h-[80vh] overflow-auto rounded-2xl shadow-2xl">
          <div className="notepad-container">
            <Notepad
              notepadId={notepadId}
              pagePath={currentPage.path}
              pageTitle={currentPage.title}
              logoPath={currentPage.logo}
              topLeftLogo={currentPage.topLeftLogo}
              topRightLogo={currentPage.topRightLogo}
              bottomLeftLogo={currentPage.bottomLeftLogo}
              bottomRightLogo={currentPage.bottomRightLogo}
              pdfTextColor={currentPage.pdfTextColor}
              pdfBackgroundColor={currentPage.pdfBackgroundColor}
              pdfFontSize={currentPage.pdfFontSize}
              pdfFontFamily={currentPage.pdfFontFamily}
              pdfHeaderText={currentPage.pdfHeaderText}
              pdfFooterText={currentPage.pdfFooterText}
            />
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300"
        aria-label={isOpen ? "Close notepad" : "Open notepad"}
      >
        {isOpen ? <X size={24} /> : <Book size={24} />}
      </button>
    </div>
  )
}

