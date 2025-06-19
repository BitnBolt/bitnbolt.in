'use client'
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const dummyProducts = [
  {
    id: 1,
    name: 'IoT Smart Sensor',
    price: 199,
    rating: 4.5,
    reviewCount: 120,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop',
    ],
    category: 'Sensors',
    description: 'The IoT Smart Sensor is a wireless, battery-powered device designed for real-time monitoring in smart environments. It seamlessly integrates with your home or industrial IoT network, providing accurate data and easy setup. Built for reliability and efficiency, it helps automate and secure your space.',
    features: [
      'Wireless connectivity for easy installation',
      'Battery powered with long life',
      'Real-time environmental monitoring',
      'Seamless integration with IoT platforms',
      'Compact and durable design',
      'Supports custom alerts and automation',
      'Secure data transmission',
      'Low maintenance requirements',
    ],
    inStock: true,
    fastDelivery: true,
    prime: true,
    reviews: [
      { user: 'Alice', rating: 5, comment: 'Excellent sensor, works flawlessly!' },
      { user: 'Bob', rating: 4, comment: 'Good value for money.' },
      { user: 'Priya', rating: 5, comment: 'Setup was super easy and fast.' },
    ],
    related: [2, 3],
  },
  {
    id: 2,
    name: 'Industrial Gateway',
    price: 499,
    rating: 4.8,
    reviewCount: 87,
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1465101178521-c3a6088ed0c4?w=400&h=300&fit=crop',
    ],
    category: 'Gateway',
    description: 'A robust gateway for industrial IoT networks, supporting multiple protocols and cloud connectivity. Built for harsh environments and remote management.',
    features: [
      'Rugged industrial design',
      'Multi-protocol support',
      'Cloud ready',
      'Remote management',
      'High security standards',
      'Easy integration with legacy systems',
    ],
    inStock: false,
    fastDelivery: false,
    prime: true,
    reviews: [
      { user: 'Carlos', rating: 5, comment: 'Perfect for our factory setup.' },
      { user: 'Jin', rating: 4, comment: 'Very reliable, but a bit pricey.' },
    ],
    related: [1, 3],
  },
  {
    id: 3,
    name: 'Smart Home Hub',
    price: 299,
    rating: 4.2,
    reviewCount: 210,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=300&fit=crop',
    ],
    category: 'Home Automation',
    description: 'Central hub for all your smart home devices. Supports voice control, app integration, and energy monitoring.',
    features: [
      'Voice control compatibility',
      'App integration for remote access',
      'Energy monitoring and reporting',
      'Security alerts and automation',
      'User-friendly interface',
    ],
    inStock: true,
    fastDelivery: true,
    prime: false,
    reviews: [
      { user: 'Sara', rating: 4, comment: 'Great for my smart home.' },
      { user: 'Mike', rating: 5, comment: 'Love the energy monitoring feature.' },
    ],
    related: [1, 2],
  },
  {
    id: 4,
    name: 'Healthcare Monitor',
    price: 799,
    rating: 4.9,
    reviewCount: 45,
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop',
    ],
    category: 'Healthcare',
    description: 'Advanced health monitoring for clinics and hospitals. HIPAA compliant, with patient alerts and data analytics.',
    features: [
      'HIPAA compliant',
      'Patient alerts',
      'Data analytics dashboard',
      'Remote access for doctors',
      'Easy installation',
    ],
    inStock: true,
    fastDelivery: false,
    prime: true,
    reviews: [
      { user: 'Dr. Lee', rating: 5, comment: 'Essential for our clinic.' },
      { user: 'Nina', rating: 5, comment: 'Very accurate and reliable.' },
    ],
    related: [1],
  },
];

export default function ProductViewPage() {
  const params = useParams();
  const id = Number(params.id);
  const product = dummyProducts.find(p => p.id === id);
  const [mainImg, setMainImg] = useState(product?.images[0] || '');

  if (!product) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-2xl mx-auto py-24 text-center text-gray-500">
          Product not found.
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <section className="py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Image Gallery */}
          <div className="md:col-span-2 flex md:flex-col gap-2 items-center md:items-start">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                className={`border-2 rounded-lg overflow-hidden w-16 h-16 md:w-20 md:h-20 ${mainImg === img ? 'border-blue-600' : 'border-gray-200'}`}
                onClick={() => setMainImg(img)}
              >
                <Image src={img} alt={product.name + ' thumbnail'} width={80} height={80} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
          {/* Main Image */}
          <div className="md:col-span-5 flex items-center justify-center">
            <Image src={mainImg} alt={product.name} width={500} height={400} className="rounded-xl object-contain w-full h-96 bg-gray-50" />
          </div>
          {/* Product Details (Top) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div>
              <span className="inline-block mb-2 px-4 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium w-fit">{product.category}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                {product.name}
                {product.prime && <span className="bg-yellow-400 text-white text-xs px-2 py-1 rounded font-bold">PRIME</span>}
              </h1>
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">{product.rating} ({product.reviewCount} ratings)</span>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-blue-600 mr-4">${product.price}</span>
                {product.inStock ? (
                  <span className="text-green-600 font-medium">In Stock</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>
              <div className="mb-4 flex flex-col gap-2">
                <button
                  className={`bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold text-lg w-full transition-colors ${!product.inStock ? 'opacity-60 cursor-not-allowed' : 'hover:bg-teal-700'}`}
                  disabled={!product.inStock}
                >
                  Add to Cart
                </button>
                <button
                  className={`bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold text-lg w-full transition-colors ${!product.inStock ? 'opacity-60 cursor-not-allowed' : 'hover:bg-yellow-600'}`}
                  disabled={!product.inStock}
                >
                  Buy Now
                </button>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 mb-4 flex items-center gap-4">
                <span className="text-blue-700 font-medium">
                  {product.fastDelivery ? 'Free delivery by tomorrow' : 'Delivery in 3-5 days'}
                </span>
                <span className="text-gray-500 text-xs">30-day returns • 1-year warranty • 24/7 support</span>
              </div>
            </div>
          </div>
        </div>
        {/* Description and Product Details Sections */}
        <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-2">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-base font-semibold mb-1">Product Details</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {product.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
        {/* Reviews Section */}
        <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.rating} average • {product.reviewCount} ratings</span>
            </div>
            {product.reviews.length === 0 ? (
              <div className="text-gray-500">No reviews yet.</div>
            ) : (
              <ul className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {product.reviews.map((review, idx) => (
                  <li key={idx} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">{review.user}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="text-gray-700 text-sm">{review.comment}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Related Products Placeholder */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4">Frequently Bought Together</h3>
            <div className="flex flex-col gap-4 w-full">
              {product.related.map(relId => {
                const rel = dummyProducts.find(p => p.id === relId);
                if (!rel) return null;
                return (
                  <div key={rel.id} className="flex items-center gap-4 w-full">
                    <Image src={rel.images[0]} alt={rel.name} width={60} height={60} className="rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{rel.name}</div>
                      <div className="text-blue-600 font-bold text-base">${rel.price}</div>
                    </div>
                    <button className="bg-teal-600 text-white px-3 py-1 rounded-lg hover:bg-teal-700 transition-colors font-medium text-xs">Add</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
