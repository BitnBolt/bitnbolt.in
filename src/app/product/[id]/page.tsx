'use client'
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
// import Footer from '../../../components/Footer';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

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
  shippingInfo?: { weight: number; dimensions: { length: number; width: number; height: number } };
};

export default function ProductViewPage() {
  const params = useParams();
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
        // Check if product is already in cart
        try {
          const cartRes = await fetch('/api/cart');
          if (cartRes.ok) {
            const cart = await cartRes.json();
            const present = (cart.items || []).some((it: { productId: string; product?: { slug: string } }) => String(it.productId) === String(data._id) || it?.product?.slug === data.slug);
            setInCart(present);
          }
        } catch {}
      } catch (e: unknown) {
        if ((e as Error)?.name !== 'AbortError') setError((e as Error)?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [idOrSlug]);

  const discountPct = useMemo(() => {
    if (!product) return 0;
    if (product.basePrice && product.finalPrice && product.basePrice > product.finalPrice) {
      return Math.round(((product.basePrice - product.finalPrice) / product.basePrice) * 100);
    }
    return Math.round(product.discount || 0);
  }, [product]);

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-2xl mx-auto py-24 text-center text-gray-500">Loading product…</div>
        <Footer />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-2xl mx-auto py-24 text-center text-red-600">{error || 'Product not found.'}</div>
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
            {(product.images || []).map((img, idx) => (
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
            {mainImg ? (
              <Image src={mainImg} alt={product.name} width={500} height={400} className="rounded-xl object-contain w-full h-96 bg-gray-50" />
            ) : (
              <div className="rounded-xl w-full h-96 bg-gray-50 flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>
          {/* Product Details (Top) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-4 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium w-fit">{product.category}</span>
                {product.subCategory && (
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full w-fit">{product.subCategory}</span>
                )}
                <span className="ml-auto text-xs text-gray-500">Brand: <span className="font-medium">{product.brand}</span></span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating?.average || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">{product.rating?.average ?? 0} ({product.rating?.count ?? 0} ratings)</span>
              </div>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl font-bold text-blue-600">₹{product.finalPrice.toFixed(2)}</span>
                {product.basePrice > product.finalPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">₹{product.basePrice.toFixed(2)}</span>
                    <span className="text-sm text-green-600 font-medium">{discountPct}% off</span>
                  </>
                )}
                <span className={`ml-auto text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `In Stock • MOQ ${product.minimumOrderQuantity}` : 'Out of Stock'}
                </span>
              </div>
              <div className="mb-4 flex flex-col gap-2">
                {inCart ? (
                  <button
                    onClick={async () => {
                      try {
                        setAdding(true);
                        await fetch(`/api/cart/${product.slug || product._id}`, { method: 'DELETE' });
                        setInCart(false);
                        if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
                      } finally {
                        setAdding(false);
                      }
                    }}
                    className={`bg-red-600 text-white px-8 py-3 rounded-lg font-semibold text-lg w-full transition-colors ${adding ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-700'}`}
                    disabled={adding}
                  >
                    {adding ? 'Removing…' : 'Remove from Cart'}
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        setAdding(true);
                        const res = await fetch('/api/cart', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ productId: product.slug || product._id, quantity: 1 })
                        });
                        if (res.ok) {
                          setInCart(true);
                          if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
                        }
                      } finally {
                        setAdding(false);
                      }
                    }}
                    className={`bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold text-lg w-full transition-colors ${product.stock <= 0 || adding ? 'opacity-60 cursor-not-allowed' : 'hover:bg-teal-700'}`}
                    disabled={product.stock <= 0 || adding}
                  >
                    {adding ? 'Adding…' : 'Add to Cart'}
                  </button>
                )}
                <button
                  onClick={async () => {
                    try {
                      setAdding(true);
                      await fetch('/api/cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ productId: product.slug || product._id, quantity: 1 })
                      });
                      // navigate to cart page if exists later
                    } finally {
                      setAdding(false);
                    }
                  }}
                  className={`bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold text-lg w-full transition-colors ${product.stock <= 0 || adding ? 'opacity-60 cursor-not-allowed' : 'hover:bg-yellow-600'}`}
                  disabled={product.stock <= 0 || adding}
                >
                  Buy Now
                </button>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 mb-4 flex items-center justify-between gap-4">
                <span className="text-blue-700 font-medium">
                  {product.stock > 0 ? 'Fast dispatch available' : 'Dispatch when back in stock'}
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
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-base font-semibold mb-3">Key Features</h3>
            {product.features?.length ? (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((f, idx) => (
                  <div key={idx} className="bg-white rounded-md border px-3 py-2">
                    <dt className="text-xs uppercase tracking-wide text-gray-500">{f.key}</dt>
                    <dd className="text-sm text-gray-800">{f.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-gray-600 text-sm">No features listed.</p>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-semibold mb-3">What&apos;s in the box</h3>
            {product.whatsInTheBox?.length ? (
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {product.whatsInTheBox.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm">Not specified.</p>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-semibold mb-3">About this item</h3>
            {product.aboutItem?.length ? (
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {product.aboutItem.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm">Not provided.</p>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-base font-semibold mb-3">Specifications</h3>
            {product.specifications?.length ? (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.specifications.map((s, idx) => (
                  <div key={idx} className="bg-white rounded-md border px-3 py-2">
                    <dt className="text-xs uppercase tracking-wide text-gray-500">{s.key}</dt>
                    <dd className="text-sm text-gray-800">{s.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-gray-600 text-sm">No specifications listed.</p>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-base font-semibold mb-2">Shipping Info</h3>
              {product.shippingInfo ? (
                <div className="text-gray-700 text-sm">
                  <div>Weight: {product.shippingInfo.weight} g</div>
                  <div>Dimensions: {product.shippingInfo.dimensions.length} x {product.shippingInfo.dimensions.width} x {product.shippingInfo.dimensions.height} cm</div>
                </div>
              ) : (
                <div className="text-gray-600 text-sm">Not specified.</div>
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold mb-2">Return Policy</h3>
              {product.returnPolicy ? (
                <div className="text-gray-700 text-sm space-y-1">
                  <div>{product.returnPolicy.isReturnable ? 'Returnable' : 'Not returnable'}</div>
                  <div>Return window: {product.returnPolicy.returnWindow} days</div>
                  {product.returnPolicy.returnConditions?.length ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {product.returnPolicy.returnConditions.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : (
                <div className="text-gray-600 text-sm">Standard return policy applies.</div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
