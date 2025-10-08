import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Products';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await params;

    await connectDB();

    // Get order with populated data
    const order = await Order.findOne({ orderId })
      .populate('items.productId', 'name images slug description')
      .populate('items.vendorId', 'businessName seller_name email phone')
      .populate('userId', 'name email phoneNumber');

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Verify user owns this order
    if (String(order.userId._id) !== session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Debug: Log vendor data to help identify issues
    console.log('Order items with vendor data:', order.items.map((item: { productId?: { name: string }; vendorId: { businessName: string; seller_name: string } }) => ({
      productName: item.productId?.name,
      vendorId: item.vendorId,
      vendorBusinessName: item.vendorId?.businessName,
      vendorSellerName: item.vendorId?.seller_name
    })));

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (error) {
    console.error('Get order details error:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch order details' 
    }, { status: 500 });
  }
}

