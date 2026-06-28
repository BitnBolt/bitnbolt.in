"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PAGE_TOP } from '@/lib/layout';

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
};

export default function Page() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const minRange = 10;
  const maxRange = 2000;
  const [priceRange, setPriceRange] = useState<[number, number]>([minRange, maxRange]);
  const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number] | null>(null);
  const [items, setItems] = useState<UiProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);
  const [cartIds, setCartIds] = useState<Set<string>>(new Set());
  const [cartSlugs, setCartSlugs] = useState<Set<string>>(new Set());

  const pageSize = 9;
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
        if (appliedPriceRange) {
          params.set('minPrice', String(appliedPriceRange[0]));
          params.set('maxPrice', String(appliedPriceRange[1]));
        }
        const res = await fetch(`/api/products?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json() as {
          items: ApiProduct[];
          page: number;
          pageSize: number;
          total: number;
          totalPages: number;
        };
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
          features: (p.features || []).slice(0, 3).map((f) => `${f.key}: ${f.value}`),
          inStock: (p.stock ?? 0) > 0,
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
  }, [activeCategory, currentPage, appliedPriceRange]);

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
    } catch { /* ignore */ }
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
        body: JSON.stringify({ productId: slug, quantity: 1 }),
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <>
      <Header forceWhite />
      <main className="relative min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <section className={`relative z-10 ${PAGE_TOP} pb-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header — same as home Products block */}
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B1C2D] mb-2 tracking-tight">
                Shop IoT Products
              </h1>
              <p className="text-lg text-gray-500 font-light">
                Discover intelligent products engineered for the connected era
              </p>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              {loading ? 'Loading…' : `Showing ${items.length} of ${total} products`}
            </p>
          </motion.div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Mobile categories */}
          <div className="lg:hidden mb-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-[#0B1C2D] text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24 sm:top-32">
                <div className="mb-6 relative">
                  <h3 className="text-lg font-bold text-[#0B1C2D] pb-3">Filters</h3>
                  <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#FFD166]" />
                  <div className="absolute bottom-0 left-12 right-0 h-px bg-gray-200" />
                </div>

                <style dangerouslySetInnerHTML={{ __html: `
                  .dual-range::-webkit-slider-thumb {
                    pointer-events: auto;
                    width: 16px;
                    height: 16px;
                    appearance: none;
                    border-radius: 50%;
                  }
                  .dual-range::-moz-range-thumb {
                    pointer-events: auto;
                    width: 16px;
                    height: 16px;
                    appearance: none;
                    border-radius: 50%;
                  }
                ` }} />

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-[#0B1C2D] mb-4">Price Range</h4>
                  <div className="relative w-full h-1.5 bg-gray-200 rounded-full mb-5">
                    <div
                      className="absolute top-0 bottom-0 bg-[#1E88E5] rounded-full"
                      style={{
                        left: `${((priceRange[0] - minRange) / (maxRange - minRange)) * 100}%`,
                        right: `${100 - ((priceRange[1] - minRange) / (maxRange - minRange)) * 100}%`,
                      }}
                    />
                    <div className="absolute -top-3 left-0 right-0 h-8">
                      <input
                        type="range"
                        min={minRange}
                        max={maxRange}
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([
                            Math.min(Number(e.target.value), priceRange[1] - (maxRange - minRange) * 0.05),
                            priceRange[1],
                          ])
                        }
                        className="absolute w-full h-full cursor-pointer pointer-events-none opacity-0 z-20 dual-range"
                      />
                      <input
                        type="range"
                        min={minRange}
                        max={maxRange}
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            Math.max(Number(e.target.value), priceRange[0] + (maxRange - minRange) * 0.05),
                          ])
                        }
                        className="absolute w-full h-full cursor-pointer pointer-events-none opacity-0 z-30 dual-range"
                      />
                    </div>
                    <div
                      className="absolute w-4 h-4 bg-[#1E88E5] rounded-full -top-[5px] -translate-x-1/2 pointer-events-none z-10"
                      style={{ left: `${((priceRange[0] - minRange) / (maxRange - minRange)) * 100}%` }}
                    />
                    <div
                      className="absolute w-4 h-4 bg-white border-4 border-[#1E88E5] rounded-full -top-[5px] -translate-x-1/2 pointer-events-none z-10"
                      style={{ left: `${((priceRange[1] - minRange) / (maxRange - minRange)) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    ₹{priceRange[0]} — ₹{priceRange[1]}
                  </p>
                  <button
                    onClick={() => {
                      setAppliedPriceRange(priceRange);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-[#FFD166] hover:bg-[#FFC033] text-amber-900 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
                  >
                    Apply Filter
                  </button>
                </div>

                <div className="pt-5 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-[#0B1C2D] mb-3">Categories</h4>
                  <div className="flex flex-col gap-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          activeCategory === cat
                            ? 'bg-blue-50 text-[#1E88E5] border border-blue-100'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-[#0B1C2D]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Product grid */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: pageSize }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg h-[380px] animate-pulse border border-gray-100 shadow-sm" />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-xl font-semibold text-[#0B1C2D] mb-2">No products found</p>
                  <p className="text-gray-500 mb-6">Try adjusting your filters or browse all categories.</p>
                  <button
                    onClick={() => {
                      setActiveCategory('All');
                      setAppliedPriceRange(null);
                      setPriceRange([minRange, maxRange]);
                      setCurrentPage(1);
                    }}
                    className="bg-[#0B1C2D] text-white px-6 py-3 rounded-full font-medium hover:bg-[#163554] transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {items.map((p) => {
                    const inCart = cartIds.has(p.id) || cartSlugs.has(p.slug);
                    const discount =
                      p.originalPrice > p.price
                        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                        : 0;

                    return (
                      <motion.div
                        key={p.id}
                        variants={itemVariants}
                        className="bg-white rounded-lg shadow-sm border border-transparent hover:border-blue-200 transition-all duration-300 overflow-hidden group flex flex-col"
                      >
                        <Link href={`/product/${p.slug || p.id}`} className="block">
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={p.image}
                              alt={p.name}
                              width={400}
                              height={300}
                              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                            />
                            {!p.inStock && (
                              <span className="absolute top-2 left-2 bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-medium shadow">
                                OUT OF STOCK
                              </span>
                            )}
                          </div>
                        </Link>

                        <div className="p-4 flex flex-col flex-1">
                          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full w-fit mb-2">
                            {p.category}
                          </span>

                          <Link href={`/product/${p.slug || p.id}`}>
                            <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {p.name}
                            </h3>
                          </Link>

                          {p.rating > 0 && (
                            <div className="flex items-center mb-2">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-3.5 h-3.5 ${i < Math.floor(p.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs text-gray-600 ml-1.5">
                                {p.rating} ({p.reviewCount})
                              </span>
                            </div>
                          )}

                          {p.features.length > 0 && (
                            <div className="mb-3">
                              <div className="flex flex-wrap gap-1">
                                {p.features.map((feature, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] rounded-full line-clamp-1"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-baseline mb-3 mt-auto">
                            <span className="text-xl font-bold text-gray-900">₹{p.price}</span>
                            {discount > 0 && (
                              <>
                                <span className="text-sm text-gray-500 line-through ml-2">₹{p.originalPrice}</span>
                                <span className="text-xs text-green-600 font-medium ml-1.5">{discount}% off</span>
                              </>
                            )}
                          </div>

                          <div className="space-y-2">
                            {p.inStock ? (
                              inCart ? (
                                <Link
                                  href="/cart"
                                  className="w-full bg-[#0B1C2D] text-white py-2.5 px-4 rounded-md hover:bg-[#163554] transition-colors font-medium text-sm flex items-center justify-center gap-2"
                                >
                                  View Cart
                                </Link>
                              ) : (
                                <button
                                  onClick={() => handleAddToCart(p.slug)}
                                  disabled={adding === p.slug}
                                  className={`w-full bg-[#0B1C2D] text-white py-2.5 px-4 rounded-md transition-colors font-medium text-sm flex items-center justify-center gap-2 ${
                                    adding === p.slug ? 'opacity-70 cursor-wait' : 'hover:bg-[#163554]'
                                  }`}
                                >
                                  {adding === p.slug ? 'Adding…' : 'Add to Cart'}
                                </button>
                              )
                            ) : (
                              <button
                                disabled
                                className="w-full bg-gray-400 text-white py-2.5 px-4 rounded-md cursor-not-allowed font-medium text-sm"
                              >
                                Out of Stock
                              </button>
                            )}
                            <Link
                              href={`/product/${p.slug || p.id}`}
                              className="w-full border-2 border-gray-200 text-[#0B1C2D] py-2.5 px-4 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium text-sm flex items-center justify-center"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? 'text-gray-400 border-gray-200 cursor-not-allowed bg-white'
                        : 'text-[#0B1C2D] border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setCurrentPage(n)}
                      className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                        currentPage === n
                          ? 'bg-[#0B1C2D] text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'text-gray-400 border-gray-200 cursor-not-allowed bg-white'
                        : 'text-[#0B1C2D] border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10">
        <Footer />
      </div>
    </main>
    </>
  );
}
