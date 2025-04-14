export default function TrustedPartners() {
  const partners = [
    "MAVUNO SUPERMARKET",
    "JISACK ELECTRONICS",
    "DINGA BIZZ MOTORS",
    "U-TECH ACADEMY",
    "SERENE & AMBIANCE REAL ESTATE",
    "DIASPORA BANK",
    "WILLOW MEDICAL CENTRE",
    "WEFLIGHT AIRWAYS",
    "CLEAN HEALTH INSURANCE",
    "WILSACK INDIA INC",
    "TRAVELGLOBALLY COMPANIES",
    "MAKUMBO SUPERMARKET",
    "SERENE RELAX & SPA",
    "FEEL GREED BAR AND RESTAURANT",
    "KING VALLEY HOTELS",
  ]

  return (
    <div className="bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Our Trusted Partners</h2>
        <div className="overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            {partners.map((partner, index) => (
              <span key={index} className="text-2xl mx-4 text-blue-400 inline-block">
                {partner}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden mt-4">
          <div className="animate-marquee2 whitespace-nowrap">
            {partners.map((partner, index) => (
              <span key={index} className="text-2xl mx-4 text-blue-400 inline-block">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

