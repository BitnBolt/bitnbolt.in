"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { PAGE_TOP } from '@/lib/layout';
import { addToCart, getCartItems } from '@/lib/client-cart';
import ProductGridSkeleton from '@/components/skeletons/ProductGridSkeleton';
import { Skeleton } from '@/components/skeletons/Skeleton';

type ApiProduct = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  images: string[];
  finalPrice: number;
  discount?: number;
  profitMargin?: number;
  basePrice: number;
  rating?: { average?: number; count?: number };
  category: string;
  stock: number;
  isFeatured?: boolean;
};

type UiProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  inStock: boolean;
  isFeatured: boolean;
};

function roundMoney(value: number) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function formatINR(value: number) {
  return roundMoney(value).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export default function Page() {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
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
        const mapped: UiProduct[] = (data.items || []).map((p) => {
          const margin = Number(p.profitMargin) || 0;
          const disc = Number(p.discount) || 0;
          const finalPrice = roundMoney(p.finalPrice);
          const marginedPrice = roundMoney(p.basePrice * (1 + margin / 100));
          return {
            id: p._id,
            slug: p.slug,
            name: p.name,
            description: (p.description || '').trim(),
            category: p.category,
            price: finalPrice,
            originalPrice: disc > 0 ? marginedPrice : finalPrice,
            rating: p.rating?.average ?? 0,
            reviewCount: p.rating?.count ?? 0,
            image: p.images?.[0] || '/next.svg',
            inStock: (p.stock ?? 0) > 0,
            isFeatured: Boolean(p.isFeatured),
          };
        });
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
      if (status === 'loading') return;
      const data = await getCartItems(isAuthenticated);
      const ids = new Set<string>();
      const slugs = new Set<string>();
      for (const it of data) {
        if (it?.productId) ids.add(String(it.productId));
        if (it?.product?.slug) slugs.add(String(it.product.slug));
      }
      setCartIds(ids);
      setCartSlugs(slugs);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    if (status === 'loading') return;
    loadCart();
    const handler = () => loadCart();
    window.addEventListener('cart-updated' as keyof WindowEventMap, handler);
    return () => window.removeEventListener('cart-updated' as keyof WindowEventMap, handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleAddToCart = async (slug: string) => {
    try {
      setAdding(slug);
      await addToCart(slug, 1, isAuthenticated);
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

      <section className={`relative z-10 ${PAGE_TOP} pb-8 sm:pb-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header — same as home Products block */}
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-8 gap-2 sm:gap-4"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1C2D] mb-1 sm:mb-2 tracking-tight">
                Shop IoT Products
              </h1>
              <p className="text-sm sm:text-lg text-gray-500 font-light">
                Discover intelligent products engineered for the connected era
              </p>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              {loading ? (
                <Skeleton className="h-4 w-40" />
              ) : (
                `Showing ${items.length} of ${total} products`
              )}
            </p>
          </motion.div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Mobile categories */}
          <div className="lg:hidden mb-4 sm:mb-6 flex flex-wrap gap-1.5 sm:gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-[#0B1C2D] text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
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
                <ProductGridSkeleton count={pageSize} />
              ) : items.length === 0 ? (
                <div className="text-center py-10 sm:py-16 bg-white rounded-2xl border border-gray-100 shadow-sm px-4">
                  <p className="text-lg sm:text-xl font-semibold text-[#0B1C2D] mb-2">No products found</p>
                  <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Try adjusting your filters or browse all categories.</p>
                  <button
                    onClick={() => {
                      setActiveCategory('All');
                      setAppliedPriceRange(null);
                      setPriceRange([minRange, maxRange]);
                      setCurrentPage(1);
                    }}
                    className="bg-[#0B1C2D] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium text-sm hover:bg-[#163554] transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5"
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
                        className="bg-white rounded-xl sm:rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 transition-all duration-300 overflow-hidden group flex flex-col"
                      >
                        <Link href={`/product/${p.slug || p.id}`} className="block">
                          <div className="relative h-36 sm:h-48 overflow-hidden">
                            <Image
                              src={p.image}
                              alt={p.name}
                              width={400}
                              height={300}
                              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                            />
                            {!p.inStock && (
                              <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium shadow">
                                OUT OF STOCK
                              </span>
                            )}
                            {p.isFeatured && (
                              <span className="absolute top-2 right-2 bg-[#FFD166] text-amber-950 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow">
                                Featured
                              </span>
                            )}
                          </div>
                        </Link>

                        <div className="p-3 sm:p-4 flex flex-col flex-1">
                          <div className="hidden sm:flex flex-wrap items-center gap-1.5 mb-2">
                            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full w-fit">
                              {p.category}
                            </span>
                            {p.isFeatured && (
                              <span className="text-xs font-semibold text-amber-900 bg-[#FFD166]/70 px-2 py-0.5 rounded-full w-fit">
                                Featured
                              </span>
                            )}
                          </div>

                          <Link href={`/product/${p.slug || p.id}`}>
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] group-hover:text-blue-600 transition-colors">
                              {p.name}
                            </h3>
                          </Link>

                          <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed mb-2 sm:mb-3 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                            {p.description || ' '}
                          </p>

                          <div className="flex items-baseline mb-2 sm:mb-3 mt-auto flex-wrap gap-x-1">
                            <span className="text-base sm:text-xl font-bold text-gray-900">₹{formatINR(p.price)}</span>
                            {discount > 0 && (
                              <>
                                <span className="hidden sm:inline text-sm text-gray-500 line-through ml-2">₹{formatINR(p.originalPrice)}</span>
                                <span className="text-[10px] sm:text-xs text-green-600 font-medium sm:ml-1.5">{discount}% off</span>
                              </>
                            )}
                          </div>

                          <div className="space-y-1.5 sm:space-y-2">
                            {p.inStock ? (
                              inCart ? (
                                <Link
                                  href="/cart"
                                  className="w-full bg-[#0B1C2D] text-white py-2 sm:py-2.5 px-2 sm:px-4 rounded-md hover:bg-[#163554] transition-colors font-medium text-xs sm:text-sm flex items-center justify-center gap-2"
                                >
                                  View Cart
                                </Link>
                              ) : (
                                <button
                                  onClick={() => handleAddToCart(p.slug)}
                                  disabled={adding === p.slug}
                                  className={`w-full bg-[#0B1C2D] text-white py-2 sm:py-2.5 px-2 sm:px-4 rounded-md transition-colors font-medium text-xs sm:text-sm flex items-center justify-center gap-2 ${
                                    adding === p.slug ? 'opacity-70 cursor-wait' : 'hover:bg-[#163554]'
                                  }`}
                                >
                                  {adding === p.slug ? 'Adding…' : 'Add to Cart'}
                                </button>
                              )
                            ) : (
                              <button
                                disabled
                                className="w-full bg-gray-400 text-white py-2 sm:py-2.5 px-2 sm:px-4 rounded-md cursor-not-allowed font-medium text-xs sm:text-sm"
                              >
                                Out of Stock
                              </button>
                            )}
                            <Link
                              href={`/product/${p.slug || p.id}`}
                              className="w-full border border-gray-200 sm:border-2 text-[#0B1C2D] py-2 sm:py-2.5 px-2 sm:px-4 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium text-xs sm:text-sm flex items-center justify-center"
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
                <div className="mt-6 sm:mt-10 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-medium transition-colors ${
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
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs sm:text-sm font-medium transition-colors ${
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
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-xs sm:text-sm font-medium transition-colors ${
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
