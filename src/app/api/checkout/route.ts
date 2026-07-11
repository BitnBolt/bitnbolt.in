import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Products';
import Order from '@/models/Order';
import Vendor from '@/models/Vendor';
import { getShiprocketDeliveryCost } from '@/lib/shiprocket';
import { getAppBaseUrl, getCashfreeClient, getCashfreeMode } from '@/lib/cashfree';

interface CheckoutProduct {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  finalPrice: number;
  basePrice: number;
  profitMargin: number;
  discount: number;
  vendorId: string;
  stock: number;
}

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      shippingAddress, 
      billingAddress, 
      paymentMethod,
      useSameAddress = true 
    } = body;

    // Validate required fields
    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json({ 
        message: 'Shipping address and payment method are required' 
      }, { status: 400 });
    }

    await connectDB();

    // Get user and cart items
    const user = await User.findById(session.user.id)
      .populate({ 
        path: 'cart', 
        model: Product, 
        select: 'name slug images finalPrice basePrice profitMargin discount vendorId stock' 
      });

    if (!user || !user.cart || user.cart.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    // Consolidate cart items and validate stock
    type OrderItemEntry = {
      orderItem: {
        productId: string;
        vendorId: string;
        quantity: number;
        basePrice: number;
        profitMargin: number;
        discount: number;
        finalPrice: number;
      };
      productMeta: {
        name: string;
        stock: number;
      };
    };

    const orderItemMap = new Map<string, OrderItemEntry>();

    // Build quantity map from cart values (cart stores product IDs, duplicates represent quantity)
    const cartProductIds = (user.cartIds || user.cart || []) as Array<string | { _id: string }>;
    const quantityMap = new Map<string, number>();
    for (const entry of cartProductIds) {
      const key = typeof entry === 'string' ? entry : entry._id;
      if (!key) continue;
      quantityMap.set(key, (quantityMap.get(key) || 0) + 1);
    }

    for (const product of user.cart as CheckoutProduct[]) {
      const productId = String(product._id);
      const cartQuantity = quantityMap.get(productId) || 1;
      const existing = orderItemMap.get(productId);

      if (existing) {
        const nextQuantity = existing.orderItem.quantity + cartQuantity;
        if (product.stock < nextQuantity) {
          return NextResponse.json({
            message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
          }, { status: 400 });
        }
        existing.orderItem.quantity = nextQuantity;
      } else {
        if (product.stock < cartQuantity) {
          return NextResponse.json({
            message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
          }, { status: 400 });
        }

        orderItemMap.set(productId, {
          orderItem: {
            productId: product._id,
            vendorId: product.vendorId,
            quantity: cartQuantity,
            basePrice: product.basePrice,
            profitMargin: product.profitMargin,
            discount: product.discount,
            finalPrice: product.finalPrice,
          },
          productMeta: {
            name: product.name,
            stock: product.stock,
          },
        });
      }
    }

    const items = Array.from(orderItemMap.values()).map((entry) => entry.orderItem);

    // Calculate order summary
    const itemsTotal = items.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
    
    // Calculate delivery costs using Shiprocket
    let totalShippingCharge = 0;
    const deliveryDetails: Array<{
      vendorId: string;
      courierName: string;
      rate: number;
      estimatedDays: string | number;
      courierId: number;
      itemsCount: number;
      codAvailable?: boolean;
      rating?: number;
      deliveryPerformance?: number;
      realtimeTracking?: number;
      podAvailable?: number;
      etd?: string;
      etdHours?: number;
      isRecommended?: boolean;
      freightCharge?: number;
      codCharges?: number;
      coverageCharges?: number;
      otherCharges?: number;
    }> = [];
    
    try {
      // Get unique vendors and their pickup addresses
      const vendorIds = [...new Set(items.map(item => String(item.vendorId)))];
      const vendors = await Vendor.find({ 
        _id: { $in: vendorIds },
        'pickupAddress.postalCode': { $exists: true, $ne: null }
      }).select('_id pickupAddress.postalCode');

      // Calculate shipping for each vendor
      for (const vendor of vendors) {
        const vendorItems = items.filter(item => String(item.vendorId) === String(vendor._id));
        const vendorTotal = vendorItems.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
        const vendorWeight = vendorItems.reduce((sum, item) => sum + (item.quantity * 0.5), 0); // Assume 0.5kg per item
        
        try {
          const serviceabilityResponse = await getShiprocketDeliveryCost({
            pickupPostcode: vendor.pickupAddress.postalCode,
            deliveryPostcode: shippingAddress.pincode,
            weight: Math.max(vendorWeight, 0.1), // Minimum 0.1kg
            cod: paymentMethod === 'cod' ? 1 : 0,
            declaredValue: vendorTotal,
          });

          if (serviceabilityResponse.status === 200 && serviceabilityResponse.data.available_courier_companies.length > 0) {
            // Filter available couriers based on payment method
            const availableCouriers = serviceabilityResponse.data.available_courier_companies
              .filter(courier => paymentMethod === 'cod' ? courier.cod === 1 : true)
              .filter(courier => courier.blocked === 0); // Exclude blocked couriers

            if (availableCouriers.length > 0) {
              // Try to use Shiprocket's recommended courier first, then fallback to cheapest
              let selectedCourier = availableCouriers.find(courier => 
                courier.courier_company_id === serviceabilityResponse.data.recommended_courier_company_id
              );

              // If no recommended courier or it's not available, use the cheapest
              if (!selectedCourier) {
                selectedCourier = availableCouriers.sort((a, b) => a.rate - b.rate)[0];
              }
              
              if (selectedCourier) {
                totalShippingCharge += selectedCourier.rate;
                deliveryDetails.push({
                  vendorId: vendor._id,
                  courierName: selectedCourier.courier_name,
                  rate: selectedCourier.rate,
                  estimatedDays: selectedCourier.estimated_delivery_days,
                  courierId: selectedCourier.courier_company_id,
                  itemsCount: vendorItems.length,
                  codAvailable: selectedCourier.cod === 1,
                  rating: selectedCourier.rating,
                  deliveryPerformance: selectedCourier.delivery_performance,
                  realtimeTracking: Number(selectedCourier.realtime_tracking),
                  podAvailable: Number(selectedCourier.pod_available),
                  etd: selectedCourier.etd,
                  etdHours: selectedCourier.etd_hours,
                  isRecommended: selectedCourier.courier_company_id === serviceabilityResponse.data.recommended_courier_company_id,
                  freightCharge: selectedCourier.freight_charge,
                  codCharges: selectedCourier.cod_charges,
                  coverageCharges: selectedCourier.coverage_charges,
                  otherCharges: selectedCourier.other_charges,
                });
              }
            }
          }
        } catch (error) {
          console.error(`Failed to get shipping cost for vendor ${vendor._id}:`, error);
          // Fallback to default shipping cost
          totalShippingCharge += 20; // Fixed fallback cost
        }
      }
    } catch (error) {
      console.error('Error calculating delivery costs:', error);
      // Fallback to simple shipping calculation
      totalShippingCharge = 20; // Fixed fallback cost
    }

    const shippingCharge = totalShippingCharge;
    const tax = Math.round(itemsTotal * 0.18 * 100) / 100; // 18% GST
    const totalAmount = itemsTotal + shippingCharge + tax;

    // Generate order ID
    const orderId = `BB-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    // Create order
    const order = new Order({
      orderId,
      userId: user._id,
      items,
      shippingAddress,
      billingAddress: useSameAddress ? shippingAddress : billingAddress,
      paymentDetails: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'pending',
      },
      orderSummary: {
        itemsTotal,
        shippingCharge,
        tax,
        totalAmount,
      },
      deliveryDetails: {
        provider: 'Shiprocket',
        deliveryCosts: deliveryDetails,
        totalShippingCost: shippingCharge,
        shiprocketStatus: 'pending',
      },
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        comment: 'Order placed',
        timestamp: new Date(),
      }],
    });

    await order.save();

    // Decrease stock for all products in the order
    try {
      for (const item of items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } },
          { new: true }
        );
      }
    } catch (stockError) {
      console.error('Failed to update stock:', stockError);
      // If stock update fails, we should ideally rollback the order
      // For now, we'll log the error and continue
      // In production, you might want to implement a more robust rollback mechanism
    }

    // If online payment, create Cashfree order
    if (paymentMethod === 'online') {
      try {
        const cashfree = getCashfreeClient();
        const customerPhone = String(shippingAddress.phoneNumber || '')
          .replace(/\D/g, '')
          .slice(-10);

        if (customerPhone.length !== 10) {
          return NextResponse.json({
            message: 'A valid 10-digit phone number is required for online payment',
          }, { status: 400 });
        }

        const cfOrderResponse = await cashfree.PGCreateOrder({
          order_id: orderId,
          order_amount: Number(totalAmount.toFixed(2)),
          order_currency: 'INR',
          customer_details: {
            customer_id: String(user._id),
            customer_phone: customerPhone,
            customer_name: shippingAddress.fullName || user.name || undefined,
            customer_email: user.email || undefined,
          },
          order_meta: {
            return_url: `${getAppBaseUrl()}/orders/${orderId}?payment=return`,
            notify_url: `${getAppBaseUrl()}/api/payment/webhook/cashfree`,
          },
          order_note: `BitnBolt order ${orderId}`,
        });

        const cfOrder = cfOrderResponse.data;
        const paymentSessionId = cfOrder.payment_session_id;

        if (!paymentSessionId) {
          return NextResponse.json({
            message: 'Failed to create payment session',
          }, { status: 500 });
        }

        order.paymentDetails.cashfreeOrderId = cfOrder.order_id || orderId;
        order.paymentDetails.cashfreePaymentSessionId = paymentSessionId;
        order.paymentDetails.gatewayResponse = cfOrder as unknown as Record<string, unknown>;
        await order.save();

        return NextResponse.json({
          success: true,
          orderId: order.orderId,
          cashfreeOrder: {
            orderId: cfOrder.order_id || orderId,
            paymentSessionId,
            orderAmount: cfOrder.order_amount,
            orderCurrency: cfOrder.order_currency || 'INR',
            mode: getCashfreeMode(),
          },
          totalAmount,
        });
      } catch (paymentError: unknown) {
        console.error('Cashfree order creation failed:', paymentError);
        const message =
          (paymentError as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (paymentError as Error)?.message ||
          'Failed to initialise online payment';
        return NextResponse.json({ message }, { status: 500 });
      }
    }

    // For COD orders, clear cart and return success
    user.cart = [];
    await user.save();

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      totalAmount,
      message: 'Order placed successfully',
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ 
      message: 'Failed to process checkout' 
    }, { status: 500 });
  }
}

