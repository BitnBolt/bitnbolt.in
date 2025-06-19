export default function Hero() {
  const categories = [
    { name: "Smart Home", icon: "🏠", count: "50+ Products" },
    { name: "Industrial IoT", icon: "🏭", count: "30+ Solutions" },
    { name: "Custom Made", icon: "⚙️", count: "100+ Projects" },
    { name: "Healthcare IoT", icon: "🏥", count: "25+ Systems" }
  ];

  return (
    <section id="home" className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Hero Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            IoT Products & 
            <span className="text-blue-600 block">Custom Solutions</span>
            <span className="text-2xl md:text-3xl text-gray-600 font-normal">Shop Now • Fast Delivery • 24/7 Support</span>
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center bg-white rounded-full shadow-lg border-2 border-gray-300 px-2">
              <input
                type="text"
                placeholder="Search for IoT products, custom solutions..."
                className="flex-1 px-6 py-4 text-lg bg-transparent border-none focus:ring-0 rounded-full outline-none"
              />
              <button className="ml-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors text-lg font-medium">
                Search
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <span>✓ 500+ Products</span>
            <span>✓ Free Shipping</span>
            <span>✓ 30-Day Returns</span>
            <span>✓ 24/7 Support</span>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.count}</p>
            </div>
          ))}
        </div>

        {/* Featured Products Preview */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🔥 Trending Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-3 h-32 flex items-center justify-center">
                <span className="text-4xl">🏠</span>
              </div>
              <h3 className="font-semibold text-gray-900">Smart Home Hub Pro</h3>
              <p className="text-blue-600 font-bold text-lg">$299</p>
              <p className="text-sm text-gray-600">Free Shipping</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-3 h-32 flex items-center justify-center">
                <span className="text-4xl">🌱</span>
              </div>
              <h3 className="font-semibold text-gray-900">Smart Agriculture Kit</h3>
              <p className="text-blue-600 font-bold text-lg">$599</p>
              <p className="text-sm text-gray-600">Free Shipping</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-4 mb-3 h-32 flex items-center justify-center">
                <span className="text-4xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900">Energy Management System</h3>
              <p className="text-blue-600 font-bold text-lg">$1,499</p>
              <p className="text-sm text-gray-600">Free Shipping</p>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
    </section>
  );
} 