'use client'
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
// import Footer from '../../../components/Footer';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { filterKeyValuePairs, filterTextLines, hasKeyValuePairs, hasTextLines } from '@/lib/product-detail';
import { PAGE_TOP } from '@/lib/layout';
import { addToCart, getCartItems, removeFromCart } from '@/lib/client-cart';

type ProductDoc = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subCategory?: string;
  brand: string;
  whatsInTheBox: string[];
  aboutItem: string[];
  features: Array<{ key: string; value: string }>;
  images: string[];
  basePrice: number;
  profitMargin: number;
  discount: number;
  finalPrice: number;
  stock: number;
  minimumOrderQuantity: number;
  tags: string[];
  rating?: { average?: number; count?: number };
  specifications: Array<{ key: string; value: string }>;
  isFeatured: boolean;
  isPublished: boolean;
  isSuspended: boolean;
  suspensionReason?: string;
  returnPolicy?: { isReturnable: boolean; returnWindow: number; returnConditions: string[] };
  replacePolicy?: { isReplaceable: boolean; replaceWindow: number; replaceConditions: string[] };
  shippingInfo?: { weight: number; dimensions: { length: number; width: number; height: number } };
};

const IMPORTANT_FEATURES = [
  {
    title: "Free Delivery",
    subtitle: "Above ₹990 INR",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-yellow-400">
        <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/>
        <path d="M14 9h4l4 4v5c0 .6-.4 1-1 1h-2"/>
        <circle cx="7" cy="18" r="2"/>
        <circle cx="17" cy="18" r="2"/>
        <path d="M14 13h8"/>
      </svg>
    ),
  },
  {
    title: "99% Positive",
    subtitle: "Feedbacks",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-yellow-400">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
    ),
  },
  {
    title: "*2 days",
    subtitle: "return policy",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-yellow-400">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    ),
  },
  {
    title: "Payment",
    subtitle: "Secure System",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-yellow-400">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    ),
  },
  {
    title: "Only Best",
    subtitle: "Brands",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-yellow-400">
        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
      </svg>
    ),
  },
];

export default function ProductViewPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const idOrSlug = String(params.id);

  const [product, setProduct] = useState<ProductDoc | null>(null);
  const [mainImg, setMainImg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<boolean>(false);
  const [inCart, setInCart] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/products/${idOrSlug}`, { signal: controller.signal });
        if (!res.ok) throw new Error(res.status === 404 ? 'Product not found' : 'Failed to load product');
        const data = (await res.json()) as ProductDoc;
        setProduct(data);
        setMainImg(data.images?.[0] || '');
        if (status === 'loading') return;
        try {
          const cart = await getCartItems(isAuthenticated);
          const present = cart.some(
            (it) => String(it.productId) === String(data._id) || it?.product?.slug === data.slug
          );
          setInCart(present);
        } catch {}
      } catch (e: unknown) {
        if ((e as Error)?.name !== 'AbortError') setError((e as Error)?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [idOrSlug, status, isAuthenticated]);

  const discountPct = useMemo(() => {
    if (!product) return 0;
    if (product.basePrice && product.finalPrice && product.basePrice > product.finalPrice) {
      return Math.round(((product.basePrice - product.finalPrice) / product.basePrice) * 100);
    }
    return Math.round(product.discount || 0);
  }, [product]);

  const detailSections = useMemo(() => {
    if (!product) {
      return {
        features: [] as Array<{ key: string; value: string }>,
        whatsInTheBox: [] as string[],
        aboutItem: [] as string[],
        specifications: [] as Array<{ key: string; value: string }>,
        showFeatures: false,
        showWhatsInTheBox: false,
        showAboutItem: false,
        showSpecifications: false,
      };
    }

    const features = filterKeyValuePairs(product.features);
    const whatsInTheBox = filterTextLines(product.whatsInTheBox);
    const aboutItem = filterTextLines(product.aboutItem);
    const specifications = filterKeyValuePairs(product.specifications);

    return {
      features,
      whatsInTheBox,
      aboutItem,
      specifications,
      showFeatures: hasKeyValuePairs(features),
      showWhatsInTheBox: hasTextLines(whatsInTheBox),
      showAboutItem: hasTextLines(aboutItem),
      showSpecifications: hasKeyValuePairs(specifications),
    };
  }, [product]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header forceWhite />
        <div className={`max-w-2xl mx-auto ${PAGE_TOP} pb-24 text-center text-gray-500`}>Loading product…</div>
        <Footer />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-100">
        <Header forceWhite />
        <div className={`max-w-2xl mx-auto ${PAGE_TOP} pb-24 text-center text-red-600`}>{error || 'Product not found.'}</div>
        <Footer />
      </main>
    );
  }

  return (
    <main className={`min-h-screen bg-gray-100 ${PAGE_TOP}`}>
      <Header forceWhite />
      <section className="py-4 sm:py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto bg-white rounded-md border-gray-100 px-4 sm:px-6 py-5 sm:py-8 grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4 sm:gap-8">
          {/* Image Gallery */}
          <div className="col-span-12 md:col-span-2 lg:col-span-1 flex md:flex-col gap-2 items-center md:items-start overflow-x-auto pb-2 md:pb-0">
            {(product.images || []).map((img, idx) => (
              <button
                key={idx}
                className={`border-2 rounded-lg overflow-hidden shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-16 lg:h-16 ${mainImg === img ? 'border-blue-600' : 'border-gray-200'}`}
                onClick={() => setMainImg(img)}
              >
                <Image src={img} alt={product.name + ' thumbnail'} width={80} height={80} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
          {/* Main Image */}
          <div className="col-span-12 md:col-span-5 lg:col-span-4 flex items-center justify-center">
            {mainImg ? (
              <Image src={mainImg} alt={product.name} width={500} height={400} className="rounded-xl object-contain w-full h-64 sm:h-96 md:h-120 lg:h-96 bg-gray-50" />
            ) : (
              <div className="rounded-xl w-full h-64 sm:h-96 bg-gray-50 flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>
          {/* Product Details (Top) */}
          <div className="col-span-12 md:col-span-5 lg:col-span-4 flex flex-col gap-4 sm:gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-block px-3 sm:px-4 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium w-fit">{product.category}</span>
                {product.subCategory && (
                  <span className="hidden sm:inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full w-fit">{product.subCategory}</span>
                )}
                <span className="hidden sm:inline ml-auto text-xs text-gray-500">Brand: <span className="font-medium">{product.brand}</span></span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 line-clamp-3 sm:line-clamp-none">{product.name}</h1>
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(product.rating?.average || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-600">{product.rating?.average ?? 0} ({product.rating?.count ?? 0} ratings)</span>
              </div>
              <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-blue-600">₹{product.finalPrice.toFixed(2)}</span>
                {product.basePrice > product.finalPrice && (
                  <>
                    <span className="text-base sm:text-lg text-gray-500 line-through">₹{product.basePrice.toFixed(2)}</span>
                    <span className="text-xs sm:text-sm text-green-600 font-medium">{discountPct}% off</span>
                  </>
                )}
                <span className={`sm:ml-auto text-xs sm:text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `In Stock • MOQ ${product.minimumOrderQuantity}` : 'Out of Stock'}
                </span>
              </div>
              <div className="mb-3 sm:mb-4 flex flex-col gap-2">
                {inCart ? (
                  <button
                    onClick={async () => {
                      try {
                        setAdding(true);
                        await removeFromCart(product.slug || product._id, isAuthenticated);
                        setInCart(false);
                      } finally {
                        setAdding(false);
                      }
                    }}
                    className={`bg-red-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-lg w-full transition-colors ${adding ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-700'}`}
                    disabled={adding}
                  >
                    {adding ? 'Removing…' : 'Remove from Cart'}
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        setAdding(true);
                        await addToCart(product.slug || product._id, 1, isAuthenticated);
                        setInCart(true);
                      } finally {
                        setAdding(false);
                      }
                    }}
                    className={`bg-teal-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-lg w-full transition-colors ${product.stock <= 0 || adding ? 'opacity-60 cursor-not-allowed' : 'hover:bg-teal-700'}`}
                    disabled={product.stock <= 0 || adding}
                  >
                    {adding ? 'Adding…' : 'Add to Cart'}
                  </button>
                )}
                <button
                  onClick={async () => {
                    try {
                      setAdding(true);
                      await addToCart(product.slug || product._id, 1, isAuthenticated);
                      setInCart(true);
                      router.push('/cart');
                    } finally {
                      setAdding(false);
                    }
                  }}
                  className={`bg-yellow-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-lg w-full transition-colors ${product.stock <= 0 || adding ? 'opacity-60 cursor-not-allowed' : 'hover:bg-yellow-600'}`}
                  disabled={product.stock <= 0 || adding}
                >
                  Buy Now
                </button>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-2 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                <span className="text-sm sm:text-base text-blue-700 font-medium">
                  {product.stock > 0 ? 'Fast dispatch available' : 'Dispatch when back in stock'}
                </span>
                <span className="hidden sm:inline text-gray-500 text-xs">30-day returns • 1-year warranty • 24/7 support</span>
              </div>
            </div>
          </div>

          {/* Right Side (Features Box) */}
          <div className="col-span-12 lg:col-span-3 lg:pl-3">
            <div className="border border-gray-200 rounded-xl p-3 sm:p-6 grid grid-cols-2 lg:flex lg:flex-col bg-white shadow-sm h-fit gap-0">
              {IMPORTANT_FEATURES.map((feature, idx) => (
                <div key={idx} className={`flex items-center gap-2 sm:gap-4 p-2.5 sm:p-0 ${idx !== 0 ? 'lg:border-t lg:border-gray-200 lg:pt-5' : ''} ${idx !== IMPORTANT_FEATURES.length - 1 ? 'lg:pb-5' : ''} ${idx % 2 === 1 ? 'border-l border-gray-100 lg:border-l-0' : ''} ${idx >= 2 ? 'border-t border-gray-100 lg:border-t-0' : ''}`}>
                  <div className="shrink-0 flex items-center justify-center scale-75 sm:scale-100 origin-left">
                    {feature.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-gray-800 font-bold text-xs sm:text-[15px] leading-tight mb-0.5 sm:mb-1 truncate">{feature.title}</span>
                    <span className="text-gray-500 text-[11px] sm:text-[14px] leading-tight truncate">{feature.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description (required) and optional detail sections */}
        <div
          className={`max-w-7xl mx-auto mt-6 sm:mt-10 grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 ${
            detailSections.showFeatures ? 'md:grid-cols-2' : ''
          }`}
        >
          <div
            className={`bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow transition-shadow ${
              !detailSections.showFeatures ? 'md:col-span-2' : ''
            }`}
          >
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-5 flex items-center gap-2 sm:gap-3 text-[#0B1C2D]">
              <div className="p-2 sm:p-2.5 bg-blue-50 rounded-xl text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              Description
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          {detailSections.showFeatures && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow transition-shadow">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-5 flex items-center gap-2 sm:gap-3 text-[#0B1C2D]">
              <div className="p-2 sm:p-2.5 bg-yellow-50 rounded-xl text-yellow-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              Key Features
            </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {detailSections.features.map((f, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-100 hover:border-yellow-200 transition-colors">
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">{f.key}</dt>
                    <dd className="text-sm font-medium text-gray-900">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {(detailSections.showWhatsInTheBox || detailSections.showAboutItem) && (
        <div className="max-w-7xl mx-auto mt-4 sm:mt-6 lg:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {detailSections.showWhatsInTheBox && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 hover:shadow transition-shadow">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-5 flex items-center gap-2 sm:gap-3 text-[#0B1C2D]">
              <div className="p-2 sm:p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              What&apos;s in the box
            </h3>
              <ul className="text-sm sm:text-base text-gray-600 space-y-2 sm:space-y-3">
                {detailSections.whatsInTheBox.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-3">
                    <svg className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
          </div>
          )}
          {detailSections.showAboutItem && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 hover:shadow transition-shadow">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-5 flex items-center gap-2 sm:gap-3 text-[#0B1C2D]">
              <div className="p-2 sm:p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              About this item
            </h3>
              <ul className="text-sm sm:text-base text-gray-600 space-y-2 sm:space-y-3">
                {detailSections.aboutItem.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
          </div>
          )}
        </div>
        )}

        <div
          className={`max-w-7xl mx-auto mt-4 sm:mt-6 lg:mt-8 grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 ${detailSections.showSpecifications ? 'md:grid-cols-2' : ''}`}
        >
          {detailSections.showSpecifications && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 hover:shadow transition-shadow">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 text-[#0B1C2D]">
              <div className="p-2 sm:p-2.5 bg-slate-100 rounded-xl text-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
              </div>
              Specifications
            </h3>
              <div className="grid grid-cols-1 gap-0 border border-gray-100 rounded-xl overflow-hidden">
                {detailSections.specifications.map((s, idx) => (
                  <div key={idx} className={`flex max-sm:flex-col sm:grid sm:grid-cols-3 px-3 sm:px-5 py-2.5 sm:py-3 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <dt className="text-sm font-semibold text-gray-700">{s.key}</dt>
                    <dd className="text-sm text-gray-600 sm:col-span-2">{s.value}</dd>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 hover:shadow transition-shadow flex flex-col gap-6 sm:gap-8 ${!detailSections.showSpecifications ? 'md:col-span-2' : ''}`}
          >
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-5 flex items-center gap-2 sm:gap-3 text-[#0B1C2D]">
                <div className="p-2 sm:p-2.5 bg-cyan-50 rounded-xl text-cyan-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"></path><path d="M14 9h4l4 4v5c0 .6-.4 1-1 1h-2"></path><circle cx="7" cy="18" r="2"></circle><circle cx="17" cy="18" r="2"></circle><path d="M14 13h8"></path></svg>
                </div>
                Shipping Info
              </h3>
              {product.shippingInfo ? (
                <div className="bg-cyan-50/50 rounded-xl p-3 sm:p-5 border border-cyan-100 text-sm text-gray-700 grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-cyan-700 font-bold mb-1.5">Weight</span>
                    <span className="font-semibold text-gray-900 border-b border-cyan-200 pb-0.5">{product.shippingInfo.weight} g</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-widest text-cyan-700 font-bold mb-1.5">Dimensions</span>
                    <span className="font-semibold text-gray-900 border-b border-cyan-200 pb-0.5">{product.shippingInfo.dimensions.length} <span className="text-gray-400 font-normal mx-0.5">×</span> {product.shippingInfo.dimensions.width} <span className="text-gray-400 font-normal mx-0.5">×</span> {product.shippingInfo.dimensions.height} cm</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">Not specified.</p>
              )}
            </div>

            <div className="pt-6 sm:pt-8 border-t border-gray-100 mt-2">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-5 flex items-center gap-2 sm:gap-3 text-[#0B1C2D]">
                <div className="p-2 sm:p-2.5 bg-purple-50 rounded-xl text-purple-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                </div>
                Return Policy
              </h3>
              {product.returnPolicy ? (
                <div className="space-y-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2 font-medium">
                    {product.returnPolicy.isReturnable ? (
                      <span className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Returnable within {product.returnPolicy.returnWindow} days
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        Not Returnable
                      </span>
                    )}
                  </div>
                  {product.returnPolicy.returnConditions?.length > 0 && (
                    <div className="pl-1 bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Conditions</p>
                      <ul className="space-y-2 text-gray-600 font-medium">
                        {product.returnPolicy.returnConditions.map((c, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5"></span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">Standard return policy applies.</p>
              )}
            </div>

            <div className="pt-6 sm:pt-8 border-t border-gray-100 mt-2">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-5 flex items-center gap-2 sm:gap-3 text-[#0B1C2D]">
                <div className="p-2 sm:p-2.5 bg-orange-50 rounded-xl text-orange-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9m-9 9a9 9 0 0 1 9-9"></path></svg>
                </div>
                Replace Policy
              </h3>
              {product.replacePolicy ? (
                <div className="space-y-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2 font-medium">
                    {product.replacePolicy.isReplaceable ? (
                      <span className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Replaceable within {product.replacePolicy.replaceWindow} days
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        Not Replaceable
                      </span>
                    )}
                  </div>
                  {product.replacePolicy.replaceConditions?.length > 0 && (
                    <div className="pl-1 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Conditions</p>
                      <ul className="space-y-2 text-gray-600 font-medium">
                        {product.replacePolicy.replaceConditions.map((c, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-1.5"></span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">Standard replace policy applies.</p>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
