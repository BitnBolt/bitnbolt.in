import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Products';
import { createShiprocketShipment, getShiprocketPickupLocation } from '@/lib/shiprocket';

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    await connectDB();

    // Get order with populated items
    const order = await Order.findOne({ orderId })
      .populate('items.productId', 'name weight shippingInfo');

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Check if order is ready for shipping
    if (order.status !== 'confirmed' && order.status !== 'processing') {
      return NextResponse.json({ 
        message: 'Order is not ready for shipping' 
      }, { status: 400 });
    }

    // Get pickup location from environment
    const pickupLocation = getShiprocketPickupLocation();

    // Prepare shipment data
    const shipmentData = {
      order_id: order.orderId,
      order_date: order.createdAt.toISOString().split('T')[0],
      pickup_location: pickupLocation.name,
      billing_customer_name: order.billingAddress.fullName,
      billing_last_name: order.billingAddress.fullName.split(' ').slice(1).join(' ') || '',
      billing_address: order.billingAddress.addressLine1,
      billing_address_2: order.billingAddress.addressLine2 || '',
      billing_city: order.billingAddress.city,
      billing_pincode: order.billingAddress.pincode,
      billing_state: order.billingAddress.state,
      billing_country: 'India',
      billing_email: order.userId.email || '',
      billing_phone: order.billingAddress.phoneNumber,
      shipping_is_billing: true,
      order_items: order.items.map((item: { productId: { name: string; _id: string }; quantity: number; finalPrice: number }) => ({
        name: item.productId.name,
        sku: item.productId._id,
        units: item.quantity,
        selling_price: item.finalPrice,
        discount: '',
        tax: 0,
        hsn: 0,
      })),
      payment_method: order.paymentDetails.method === 'cod' ? 'COD' : 'Prepaid',
      sub_total: order.orderSummary.itemsTotal,
      length: 10,
      breadth: 10,
      height: 10,
      weight: order.items.reduce((total: number, item: { productId: { shippingInfo?: { weight: number } }; quantity: number }) => {
        return total + (item.productId.shippingInfo?.weight || 100) * item.quantity;
      }, 0),
    };

    // Create shipment in Shiprocket using the service
    const shipmentResult = await createShiprocketShipment(shipmentData);

    // Update order with Shiprocket details
    order.deliveryDetails.shiprocketOrderId = shipmentResult.order_id;
    order.deliveryDetails.provider = 'Shiprocket';
    order.status = 'processing';
    order.statusHistory.push({
      status: 'processing',
      comment: 'Shipment created in Shiprocket',
      timestamp: new Date(),
    });

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Shipment created successfully',
      shipmentId: shipmentResult.order_id,
      orderId: order.orderId,
    });

  } catch (error) {
    console.error('Create shipment error:', error);
    return NextResponse.json({ 
      message: 'Failed to create shipment' 
    }, { status: 500 });
  }
}

