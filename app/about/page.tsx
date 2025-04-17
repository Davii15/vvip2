export default function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-blue-400 to-green-400 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8">About Us</h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <blockquote className="italic text-gray-700 border-l-4 border-blue-500 pl-4">
              "Our aim is to provide a platform for the equal sale and Access of products on discount to any vendor who
              is providing it in whatever place in the World they are"
            </blockquote>
            <p className="text-right mt-2">- Ctech Founder</p>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Focus</h2>
            <p className="text-gray-700">This platform is purely for goods and services being offered on Discount. For any enquiries or complains ,feedback email us via waikwa1@yahoo.com or blackdavidd24@gmail.com</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
            <p className="text-red-600 font-bold">
              Do not use it to Market your goods or services that are not on discount. Failure to comply will lead to
              automatic delisting of your products.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

