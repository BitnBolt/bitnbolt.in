'use client'
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AuthPageShell from '@/components/skeletons/AuthPageShell';
import OrdersListSkeleton from '@/components/skeletons/OrdersListSkeleton';
import { PAGE_TOP } from '@/lib/layout';

type OrderItem = {
  productId: {
    _id: string;
    name: string;
    images: string[];
    slug: string;
  } | null;
  vendorId: {
    _id: string;
    businessName: string;
    seller_name?: string;
  } | null;
  quantity: number;
  basePrice: number;
  profitMargin: number;
  discount: number;
  finalPrice: number;
};

type Order = {
  _id: string;
  orderId: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  paymentDetails: {
    method: 'cod' | 'online';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
    paidAt?: Date;
  };
  orderSummary: {
    itemsTotal: number;
    shippingCharge: number;
    tax: number;
    totalAmount: number;
  };
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  statusHistory: Array<{
    status: string;
    comment?: string;
    updatedBy?: string;
    timestamp: Date;
  }>;
  deliveryDetails: {
    provider?: string;
    trackingId?: string;
    awbCode?: string;
    courierName?: string;
    shiprocketOrderId?: string;
    shiprocketShipmentId?: string;
    shiprocketStatus?: string;
    totalShippingCost?: number;
  };
  createdAt: Date;
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });

      if (filterStatus) {
        params.append('status', filterStatus);
      }

      const res = await fetch(`/api/orders?${params}`);
      if (!res.ok) throw new Error('Failed to load orders');

      const data = await res.json();
      setOrders(data.orders || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (e: unknown) {
      setError((e as Error)?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterStatus]);
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch orders
  useEffect(() => {
    if (session?.user?.id) {
      fetchOrders();
    }
  }, [session, currentPage, filterStatus, fetchOrders]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Order Placed';
      case 'confirmed': return 'Order Confirmed';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      case 'returned': return 'Returned';
      default: return status;
    }
  };

  if (status === 'loading') {
    return (
      <AuthPageShell>
        <OrdersListSkeleton />
      </AuthPageShell>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Header forceWhite />
      <section className={`${PAGE_TOP} pb-8 sm:pb-10`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>

            <div className="flex gap-2 sm:gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 sm:px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <OrdersListSkeleton contentOnly />
          ) : orders.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-500 text-base sm:text-lg mb-3 sm:mb-4">No orders found</div>
              <Link
                href="/product"
                className="inline-block bg-blue-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-6">
                  <div className="flex justify-between items-start gap-2 mb-3 sm:mb-4">
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold truncate">
                        Order #{order.orderId}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`shrink-0 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <h4 className="font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">Order Items</h4>
                    <div className="space-y-1.5 sm:space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded">
                          <Image
                            src={item.productId?.images?.[0] || '/next.svg'}
                            alt={item.productId?.name || 'Product'}
                            width={50}
                            height={50}
                            className="rounded object-cover w-10 h-10 sm:w-[50px] sm:h-[50px] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm sm:text-base truncate">{item.productId?.name || 'Product Unavailable'}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            <p className="text-sm text-gray-500 truncate">Sold by: {item.vendorId?.businessName || item.vendorId?.seller_name || 'Vendor Unavailable'}</p>
                          </div>
                          <p className="font-semibold text-sm sm:text-base shrink-0">₹{(item.finalPrice * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        Payment: {order.paymentDetails.method.toUpperCase()} •
                        Status: {order.paymentDetails.status.charAt(0).toUpperCase() + order.paymentDetails.status.slice(1)}
                      </p>
                      <p className="text-base sm:text-lg font-semibold">Total: ₹{order.orderSummary.totalAmount.toFixed(2)}</p>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/orders/${order.orderId}`}
                        className="flex-1 sm:flex-none text-center px-3 py-2 sm:px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Details
                      </Link>

                      {(order.deliveryDetails.awbCode || order.deliveryDetails.shiprocketOrderId) && (
                        <button
                          onClick={() => {
                            // Open tracking in new tab
                            if (order.deliveryDetails.awbCode) {
                              window.open(`/track/${order.deliveryDetails.awbCode}`, '_blank');
                            } else if (order.deliveryDetails.shiprocketOrderId) {
                              // For now, just show the Shiprocket order ID
                              alert(`Shiprocket Order ID: ${order.deliveryDetails.shiprocketOrderId}\nTracking will be available once AWB is generated.`);
                            }
                          }}
                          className="flex-1 sm:flex-none px-3 py-2 sm:px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Track Package
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6 sm:mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 sm:px-4 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  <span className="px-3 py-2 sm:px-4 flex items-center text-sm">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 sm:px-4 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}