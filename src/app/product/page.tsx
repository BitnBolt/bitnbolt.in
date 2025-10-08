"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Props = {}

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

export default function Page({}: Props) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      <Header />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {(() => {
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
              } catch (err: any) {
                if (err?.name !== 'AbortError') {
                  setError(err?.message || 'Something went wrong');
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
            } catch {}
          };

          useEffect(() => {
            loadCart();
            const handler = () => loadCart();
            window.addEventListener('cart-updated' as any, handler);
            return () => window.removeEventListener('cart-updated' as any, handler);
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
            <div className="relative z-10">
              <motion.div 
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div>
                  <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-4 font-medium text-sm">
                    Our Products
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Shop IoT Solutions
                  </h2>
                  <p className="text-gray-600 mt-1">{loading ? 'Loading…' : `Showing ${items.length} of ${total} products`}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>

              {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>
              )}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map(p => {
                  const inCart = cartIds.has(p.id) || cartSlugs.has(p.slug);
                  return (
                    <motion.div key={p.id} whileHover={{ y: -8 }} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group">
                      <div className="relative h-64 overflow-hidden">
                        <Image src={p.image} alt={p.name} width={400} height={300} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {p.prime && (
                            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">PRIME</span>
                          )}
                          {p.fastDelivery && (
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">FAST DELIVERY</span>
                          )}
                          {!p.inStock && (
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">OUT OF STOCK</span>
                          )}
                        </div>

                        <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 group">
                          <svg className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>

                      <div className="p-5">
                        <div className="mb-2">
                          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full">{p.category}</span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{p.name}</h3>

                        <div className="flex items-center mb-3">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < Math.floor(p.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">{p.rating} ({p.reviewCount})</span>
                        </div>

                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1.5">
                            {p.features.slice(0, 3).map((feature, index) => (
                              <span key={index} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{feature}</span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-baseline mb-4">
                          <span className="text-2xl font-bold text-gray-900">₹{p.price}</span>
                          {p.originalPrice > p.price && (
                            <>
                              <span className="text-lg text-gray-500 line-through ml-2">₹{p.originalPrice}</span>
                              <span className="text-sm text-green-600 font-medium ml-2">{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% off</span>
                            </>
                          )}
                        </div>

                        <div className="space-y-2">
                          {p.inStock ? (
                            inCart ? (
                              <Link href="/cart" className="w-full bg-amber-500 text-white py-3 px-4 rounded-xl hover:bg-amber-600 transition-colors font-medium flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Buy Now
                              </Link>
                            ) : (
                              <button onClick={() => handleAddToCart(p.slug)} disabled={adding === p.slug} className={`w-full bg-blue-600 text-white py-3 px-4 rounded-xl ${adding === p.slug ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'} transition-colors font-medium flex items-center justify-center gap-2`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {adding === p.slug ? 'Adding…' : 'Add to Cart'}
                              </button>
                            )
                          ) : (
                            <button className="w-full bg-gray-400 text-white py-3 px-4 rounded-xl cursor-not-allowed font-medium flex items-center justify-center gap-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Out of Stock
                            </button>
                          )}
                          <Link href={`/product/${p.slug || p.id}`} className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          );
        })()}
      </section>
      <Footer />
    </main>
  )
}