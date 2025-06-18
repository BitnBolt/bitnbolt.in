import Image from "next/image";

export default function Products() {
  const products = [
    {
      id: 1,
      name: "Smart Home Hub Pro - WiFi Enabled",
      category: "IoT",
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviewCount: 1247,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      description: "Centralized control for all your smart home devices with AI-powered automation.",
      features: ["Voice Control", "Mobile App", "Energy Monitoring", "Security Integration"],
      inStock: true,
      fastDelivery: true,
      prime: true
    },
    {
      id: 2,
      name: "Industrial IoT Gateway - Enterprise Grade",
      category: "Custom Made",
      price: 1299,
      originalPrice: 1599,
      rating: 4.9,
      reviewCount: 856,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      description: "Custom industrial IoT solution for manufacturing and process automation.",
      features: ["Real-time Monitoring", "Predictive Maintenance", "Cloud Integration", "Scalable"],
      inStock: true,
      fastDelivery: false,
      prime: true
    },
    {
      id: 3,
      name: "Smart Agriculture System - Complete Kit",
      category: "IoT",
      price: 599,
      originalPrice: 799,
      rating: 4.7,
      reviewCount: 2341,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
      description: "Complete IoT solution for precision agriculture and crop management.",
      features: ["Soil Monitoring", "Weather Integration", "Automated Irrigation", "Crop Analytics"],
      inStock: true,
      fastDelivery: true,
      prime: true
    },
    {
      id: 4,
      name: "Custom Retail Analytics Platform",
      category: "Custom Made",
      price: 899,
      originalPrice: 1199,
      rating: 4.6,
      reviewCount: 567,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      description: "Tailored retail analytics system with customer behavior tracking.",
      features: ["Foot Traffic Analysis", "Inventory Management", "Customer Insights", "POS Integration"],
      inStock: false,
      fastDelivery: false,
      prime: false
    },
    {
      id: 5,
      name: "Healthcare IoT Monitor - HIPAA Compliant",
      category: "IoT",
      price: 799,
      originalPrice: 999,
      rating: 4.9,
      reviewCount: 1892,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      description: "Advanced health monitoring system for hospitals and clinics.",
      features: ["Patient Monitoring", "Alert System", "Data Analytics", "HIPAA Compliant"],
      inStock: true,
      fastDelivery: true,
      prime: true
    },
    {
      id: 6,
      name: "Smart Energy Management System",
      category: "Custom Made",
      price: 1499,
      originalPrice: 1899,
      rating: 4.8,
      reviewCount: 743,
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop",
      description: "Custom energy management solution for commercial buildings.",
      features: ["Load Balancing", "Cost Optimization", "Renewable Integration", "Reporting"],
      inStock: true,
      fastDelivery: false,
      prime: true
    }
  ];

  const categories = ["All", "IoT", "Custom Made", "Smart Home", "Industrial", "Healthcare"];

  return (
    <section id="products" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Shop IoT Products
            </h2>
            <p className="text-gray-600">
              {products.length} products available • Free shipping on orders over $500
            </p>
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Customer Rating</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
            >
              {/* Product Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.prime && (
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                      PRIME
                    </span>
                  )}
                  {product.fastDelivery && (
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                      Fast Delivery
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Rating */}
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>

                {/* Product Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="mb-3">
                  <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg text-gray-500 line-through ml-2">${product.originalPrice}</span>
                  )}
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-green-600 font-medium ml-2">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                    </span>
                  )}
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {product.inStock ? (
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Add to Cart
                    </button>
                  ) : (
                    <button className="w-full bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed font-medium">
                      Out of Stock
                    </button>
                  )}
                  <button className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                    Buy Now
                  </button>
                </div>

                {/* Delivery Info */}
                <div className="mt-3 text-sm text-gray-600">
                  {product.fastDelivery ? (
                    <span className="text-green-600">✓ Free delivery by tomorrow</span>
                  ) : (
                    <span>✓ Free delivery in 3-5 days</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Load More Products
          </button>
        </div>

        {/* Custom Solutions CTA */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Need Something Custom?
            </h3>
            <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
              Don&apos;t see exactly what you need? We specialize in creating custom IoT solutions 
              tailored to your specific requirements and industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Request Custom Solution
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 