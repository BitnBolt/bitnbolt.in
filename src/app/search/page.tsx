'use client'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const dummyProducts = [
  {
    id: 1,
    name: 'IoT Smart Sensor',
    price: 199,
    rating: 4.5,
    reviewCount: 120,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    category: 'Sensors',
    description: 'Wireless sensor for smart environments.'
  },
  {
    id: 2,
    name: 'Industrial Gateway',
    price: 499,
    rating: 4.8,
    reviewCount: 87,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
    category: 'Gateway',
    description: 'Robust gateway for industrial IoT networks.'
  },
  {
    id: 3,
    name: 'Smart Home Hub',
    price: 299,
    rating: 4.2,
    reviewCount: 210,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop',
    category: 'Home Automation',
    description: 'Central hub for all your smart home devices.'
  },
  {
    id: 4,
    name: 'Healthcare Monitor',
    price: 799,
    rating: 4.9,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
    category: 'Healthcare',
    description: 'Advanced health monitoring for clinics and hospitals.'
  },
];

export default function ProductSearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('query') || '';

  return (
    <main className="min-h-screen">
      <Header />
      <section className="py-10 bg-gray-50 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Results for <span className="text-blue-600">"{keyword}"</span>
          </h2>
          {/* Optionally, add a filter/sort bar here later */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {dummyProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image src={product.image} alt={product.name} width={400} height={300} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <span className="inline-block mb-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium w-fit">{product.category}</span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 mr-2">
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
                    <span className="text-sm text-gray-600">{product.rating} ({product.reviewCount})</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto gap-2">
                    <span className="text-xl font-bold text-blue-600">${product.price}</span>
                    <div className="flex gap-2">
                      <Link href={`/product/${product.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm text-center">View</Link>
                      <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm">Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
} 