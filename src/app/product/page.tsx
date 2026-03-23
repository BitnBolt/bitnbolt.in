"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Props = Record<string, never>

type ApiProduct = {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  finalPrice: number;
  discount?: number;
  basePrice: number;
  rating?: { average?: number; count?: number };
  category: string;
  features?: Array<{ key: string; value: string }>;
  stock: number;
};

type UiProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  features: string[];
  inStock: boolean;
  fastDelivery?: boolean;
  prime?: boolean;
};

export default function Page({ }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<UiProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);
  const [cartIds, setCartIds] = useState<Set<string>>(new Set());
  const [cartSlugs, setCartSlugs] = useState<Set<string>>(new Set());

  const pageSize = 6;
  const categories = ['All', 'IoT', 'Custom Made', 'Industrial', 'Healthcare'];

  useEffect(() => {
    const controller = new AbortController();
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({
          page: String(currentPage),
          pageSize: String(pageSize),
        });
        if (activeCategory && activeCategory !== 'All') {
          params.set('category', activeCategory);
        }
        const res = await fetch(`/api/products?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json() as { items: ApiProduct[]; page: number; pageSize: number; total: number; totalPages: number };
        const mapped: UiProduct[] = (data.items || []).map((p) => ({
          id: p._id,
          slug: p.slug,
          name: p.name,
          category: p.category,
          price: p.finalPrice,
          originalPrice: p.basePrice,
          rating: p.rating?.average ?? 0,
          reviewCount: p.rating?.count ?? 0,
          image: p.images?.[0] || '/next.svg',
          features: (p.features || []).slice(0, 3).map(f => `${f.key}: ${f.value}`),
          inStock: (p.stock ?? 0) > 0,
          fastDelivery: false,
          prime: false,
        }));
        setItems(mapped);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          setError((err as Error)?.message || 'Something went wrong');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
    return () => controller.abort();
  }, [activeCategory, currentPage]);

  // Load cart to know which products are in cart
  const loadCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (!res.ok) return;
      const data = await res.json();
      const ids = new Set<string>();
      const slugs = new Set<string>();
      for (const it of data.items || []) {
        if (it?.productId) ids.add(String(it.productId));
        if (it?.product?.slug) slugs.add(String(it.product.slug));
      }
      setCartIds(ids);
      setCartSlugs(slugs);
    } catch { }
  };

  useEffect(() => {
    loadCart();
    const handler = () => loadCart();
    window.addEventListener('cart-updated' as keyof WindowEventMap, handler);
    return () => window.removeEventListener('cart-updated' as keyof WindowEventMap, handler);
  }, []);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleAddToCart = async (slug: string) => {
    try {
      setAdding(slug);
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: slug, quantity: 1 })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || 'Failed to add to cart');
      }
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
      await loadCart();
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(null);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 overflow-hidden">
      <Header forceWhite={true} />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-32">
        <div className="relative z-10">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-4 font-medium text-sm">
                Our Products
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Shop IoT Solutions
              </h2>
            </div>
            <p className="text-gray-600 mt-2 md:mt-0 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              {loading ? 'Loading…' : `Showing ${items.length} of ${total} products`}
            </p>
          </motion.div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-1/4 shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  All Categories
                </h3>
                <div className="flex flex-col gap-1.5">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${activeCategory === cat
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-100'
                        }`}
                    >
                      {cat}
                      <svg className={`w-4 h-4 transition-transform ${activeCategory === cat ? 'text-blue-600 translate-x-1' : 'text-gray-400 group-hover:translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Other Filters</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" className="peer w-5 h-5 appearance-none border-2 border-gray-300 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-colors" />
                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">In Stock Only</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" className="peer w-5 h-5 appearance-none border-2 border-gray-300 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-colors" />
                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">Fast Delivery</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map(p => {
                  const inCart = cartIds.has(p.id) || cartSlugs.has(p.slug);
                  return (
                    <motion.div key={p.id} whileHover={{ y: -6 }} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden group border border-gray-50">
                      <div className="relative h-44 overflow-hidden">
                        <Image src={p.image} alt={p.name} width={400} height={300} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                          {p.prime && (
                            <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">PRIME</span>
                          )}
                          {p.fastDelivery && (
                            <span className="bg-green-600 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">FAST</span>
                          )}
                          {!p.inStock && (
                            <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">OUT OF STOCK</span>
                          )}
                        </div>

                        <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-xs rounded-full shadow-sm flex items-center justify-center hover:bg-white group">
                          <svg className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>

                      <div className="p-3.5 flex flex-col h-[calc(100%-11rem)]">
                        <div className="mb-1.5">
                          <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{p.category}</span>
                        </div>

                        <h3 className="text-[15px] leading-tight font-bold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors flex-1">{p.name}</h3>

                        <div className="flex items-center mb-2.5">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(p.rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1.5">({p.reviewCount})</span>
                        </div>

                        <div className="flex items-baseline mb-3">
                          <span className="text-lg font-bold text-gray-900">₹{p.price}</span>
                          {p.originalPrice > p.price && (
                            <>
                              <span className="text-xs text-gray-400 line-through ml-1.5">₹{p.originalPrice}</span>
                              <span className="text-[10px] text-green-600 font-bold ml-1.5 bg-green-50 px-1.5 py-0.5 rounded">{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% off</span>
                            </>
                          )}
                        </div>

                        <div className="space-y-1.5 mt-auto">
                          {p.inStock ? (
                            inCart ? (
                              <Link href="/cart" className="w-full bg-amber-500 text-white py-2 px-3 rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium flex items-center justify-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Buy Now
                              </Link>
                            ) : (
                              <button onClick={() => handleAddToCart(p.slug)} disabled={adding === p.slug} className={`w-full bg-blue-600 text-white py-2 px-3 rounded-lg ${adding === p.slug ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'} transition-colors text-sm font-medium flex items-center justify-center gap-1.5`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {adding === p.slug ? 'Adding…' : 'Add to Cart'}
                              </button>
                            )
                          ) : (
                            <button className="w-full bg-gray-300 text-gray-500 py-2 px-3 rounded-lg cursor-not-allowed text-sm font-medium flex items-center justify-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Out of Stock
                            </button>
                          )}
                          <Link href={`/product/${p.slug || p.id}`} className="w-full border shadow-xs border-gray-200 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-full border text-sm font-medium ${currentPage === 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n)}
                    className={`w-9 h-9 rounded-full text-sm font-medium ${currentPage === n ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-full border text-sm font-medium ${currentPage === totalPages ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}