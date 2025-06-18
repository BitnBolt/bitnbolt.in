import Image from "next/image";

export default function Deals() {
  const deals = [
    {
      id: 1,
      name: "Smart Home Starter Kit",
      originalPrice: 599,
      salePrice: 399,
      discount: 33,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      endTime: "2 days left",
      sold: 85,
      total: 100
    },
    {
      id: 2,
      name: "Industrial IoT Bundle",
      originalPrice: 2499,
      salePrice: 1899,
      discount: 24,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      endTime: "1 day left",
      sold: 23,
      total: 50
    },
    {
      id: 3,
      name: "Healthcare Monitoring System",
      originalPrice: 1299,
      salePrice: 899,
      discount: 31,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      endTime: "3 days left",
      sold: 67,
      total: 100
    },
    {
      id: 4,
      name: "Agriculture IoT Package",
      originalPrice: 899,
      salePrice: 649,
      discount: 28,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
      endTime: "5 days left",
      sold: 42,
      total: 75
    }
  ];

  return (
    <section id="deals" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              🔥 Lightning Deals
            </h2>
            <p className="text-gray-600">
              Limited time offers • Act fast before they&apos;re gone
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Next deal starts in:</div>
            <div className="text-2xl font-bold text-red-600">02:45:30</div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white border-2 border-red-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Deal Badge */}
              <div className="bg-red-600 text-white text-center py-2 text-sm font-bold">
                {deal.discount}% OFF
              </div>

              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Timer */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  {deal.endTime}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {deal.name}
                </h3>

                {/* Pricing */}
                <div className="mb-3">
                  <span className="text-2xl font-bold text-red-600">${deal.salePrice}</span>
                  <span className="text-lg text-gray-500 line-through ml-2">${deal.originalPrice}</span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{deal.sold}% claimed</span>
                    <span>{deal.total - deal.sold} left</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${deal.sold}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium">
                  Claim Deal
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Deals */}
        <div className="text-center mt-8">
          <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            View All Deals
          </button>
        </div>
      </div>
    </section>
  );
} 