import Greeting from "@/components/Greeting"
import CountdownTimer from "@/components/CountdownTimer"
import GetShoppingButton from "@/components/GetShoppingButton"
import Talktobot from "@/components/Talktobot"
import TrustedPartners from "@/components/TrustedPartners"
import WelcomeBackAlert from "@/components/WelcomeBackAlert"
import MonthlyRecommendations from "@/components/MonthlyRecommendations"
import SeasonalRecommendationBanner from "@/components/SeasonalRecommendations"

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-400 to-green-400">
      <WelcomeBackAlert />
      <div className="container mx-auto px-4 py-8">
        <CountdownTimer targetDate="2025-12-31T23:59:59" startDate="2025-02-13T00:00:00" />
    
       {/* Seasonal Recommendation Banner - Top of page */}
       <SeasonalRecommendationBanner colorScheme="blue" maxItems={3} />

        <div className="bg-gray-100 rounded-lg shadow-lg p-8 mb-8">
          <Greeting />
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            Karibu to OneShopDiscount.com – Your Ultimate Discount Radar! 🎯💰
          </h1>
          <p className="text-xl text-gray-700 mb-8 text-center italic text-blue-600">
            Discover the hottest deals from your favorite vendors, all in one place! We showcase the best discounts and
            exclusive offers, so you never miss a chance to save. Browse, find your deal, and grab it before it's gone!
            🚀🔥
          </p>
          <GetShoppingButton />
          
          <Talktobot />


          {/* Two-column layout for content and recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 mb-8 shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">✨ Why Browse With Us?</h2>
                <ul className="list-none space-y-2">
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✅</span>{" "}
                    <span className="italic text-blue-600">Exclusive Discounts</span> – Be the first to know about the
                    latest offers.
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✅</span>{" "}
                    <span className="italic text-blue-600">Your Favorite Vendors</span> – All the top brands and
                    businesses in one place.
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✅</span>{" "}
                    <span className="italic text-blue-600">No Sign-ups, No Hassle</span> – Just browse, find, and go
                    grab your deal!
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✅</span>{" "}
                    <span className="italic text-blue-600">Updated Daily</span> – Fresh discounts, so you never miss a
                    chance to save.
                  </li>
                </ul>
              </div>
              <p className="text-xl text-gray-700 text-center italic text-blue-600">
                💡 Don't let the best deals pass you by! Keep checking in, because the biggest savings are always just a
                click away. 🛍️🔖
              </p>
            </div>

             {/* Monthly Recommendations - Sidebar */}
         <div className="lg:col-span-1">
              <MonthlyRecommendations colorScheme="blue" maxItems={3} showUpcomingEvents={true} />
            </div>
          </div>
        </div>
      </div>
      <TrustedPartners />
    </div>
  )
}
