'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type DealProduct = {
  id: string;
  slug: string;
  name: string;
  image: string;
  discount: number;
  salePrice: number;
  originalPrice: number;
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

export default function Deals() {
  const [deals, setDeals] = useState<DealProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function loadDeals() {
      try {
        setLoading(true);
        const res = await fetch('/api/products?deals=1&pageSize=4', {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to load deals');
        const data = (await res.json()) as {
          items: Array<{
            _id: string;
            slug: string;
            name: string;
            images?: string[];
            finalPrice: number;
            discount?: number;
            basePrice: number;
            profitMargin?: number;
            stock?: number;
            isFeatured?: boolean;
          }>;
        };

        const mapped = (data.items || [])
          .map((p) => {
            const discount = roundMoney(Number(p.discount) || 0);
            if (discount <= 0) return null;
            const margin = Number(p.profitMargin) || 0;
            const originalPrice = roundMoney(p.basePrice * (1 + margin / 100));
            const salePrice = roundMoney(p.finalPrice);
            return {
              id: p._id,
              slug: p.slug,
              name: p.name,
              image: p.images?.[0] || '/next.svg',
              discount: Math.round(discount),
              salePrice,
              originalPrice: originalPrice > salePrice ? originalPrice : salePrice,
              inStock: (p.stock ?? 0) > 0,
              isFeatured: Boolean(p.isFeatured),
            } satisfies DealProduct;
          })
          .filter((p): p is DealProduct => p !== null)
          .slice(0, 4);

        setDeals(mapped);
      } catch (err) {
        if ((err as Error)?.name !== 'AbortError') {
          console.error(err);
          setDeals([]);
        }
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
    return () => controller.abort();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100 },
    },
  };

  if (!loading && deals.length === 0) {
    return null;
  }

  return (
    <section id="deals" className="py-8 sm:py-12 bg-[#f8fafd] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="mb-6 sm:mb-12"
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1C2D] mb-1 sm:mb-2 tracking-tight">
            Flash Deals
          </h2>
          <p className="text-sm sm:text-lg text-gray-500 font-light">
            Exclusive discounts on popular IoT products
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl sm:rounded-lg border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="h-32 sm:h-48 bg-gray-100" />
                <div className="p-3.5 sm:p-6 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-6 bg-gray-100 rounded w-1/2" />
                  <div className="h-10 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className={`flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible sm:grid sm:gap-6 ${
              deals.length === 1
                ? 'sm:grid-cols-1 sm:max-w-sm'
                : deals.length === 2
                  ? 'sm:grid-cols-2'
                  : deals.length === 3
                    ? 'sm:grid-cols-3'
                    : 'sm:grid-cols-2 lg:grid-cols-4'
            }`}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ scrollbarWidth: 'none' }}
          >
            {deals.map((deal) => (
              <motion.div
                key={deal.id}
                variants={itemVariants}
                className="bg-white rounded-xl sm:rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:border-red-200 transition-all duration-300 relative group shrink-0 w-[68vw] max-w-[260px] sm:w-auto sm:max-w-none snap-start flex flex-col"
              >
                <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 bg-red-600 text-white text-[11px] sm:text-sm font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full z-10">
                  {deal.discount}% OFF
                </div>
                {deal.isFeatured && (
                  <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 bg-[#FFD166] text-amber-950 text-[10px] sm:text-xs font-semibold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full z-10">
                    Featured
                  </div>
                )}

                <Link href={`/product/${deal.slug || deal.id}`} className="block">
                  <div className="relative h-32 sm:h-48 overflow-hidden bg-gray-50">
                    <Image
                      src={deal.image}
                      alt={deal.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                <div className="p-3.5 sm:p-6 flex flex-col flex-1">
                  <Link href={`/product/${deal.slug || deal.id}`}>
                    <h3 className="font-bold text-sm sm:text-lg text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {deal.name}
                    </h3>
                  </Link>

                  <div className="mb-3 sm:mb-4 flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-lg sm:text-2xl font-bold text-red-600">
                      ₹{formatINR(deal.salePrice)}
                    </span>
                    {deal.originalPrice > deal.salePrice && (
                      <span className="text-sm sm:text-lg text-gray-500 line-through">
                        ₹{formatINR(deal.originalPrice)}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/product/${deal.slug || deal.id}`}
                    className={`mt-auto w-full py-2.5 sm:py-3 px-3 rounded-md text-sm sm:text-base font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      deal.inStock
                        ? 'bg-[#0B1C2D] hover:bg-[#163554] text-white'
                        : 'bg-gray-300 text-gray-600 pointer-events-none'
                    }`}
                  >
                    <span>{deal.inStock ? 'View Deal' : 'Out of Stock'}</span>
                    {deal.inStock && (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    )}
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && deals.length > 0 && (
          <motion.div
            className="text-center mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Link
              href="/product"
              className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-5 py-2.5 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base font-semibold hover:bg-gray-50 transition-all"
            >
              <span>Browse all products</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
