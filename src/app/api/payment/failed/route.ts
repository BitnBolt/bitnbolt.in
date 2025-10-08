import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Products';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ 
        message: 'Order ID is required' 
      }, { status: 400 });
    }

    await connectDB();

    // Get order
    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Verify user owns this order
    if (String(order.userId) !== session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Check if order is still pending (payment not completed)
    if (order.paymentDetails.status !== 'pending') {
      return NextResponse.json({ 
        message: 'Order payment status is not pending' 
      }, { status: 400 });
    }

    // Restore stock for all products in the order
    try {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } },
          { new: true }
        );
      }
    } catch (stockError) {
      console.error('Failed to restore stock:', stockError);
      return NextResponse.json({ 
        message: 'Failed to restore stock' 
      }, { status: 500 });
    }

    // Update order status to cancelled
    order.status = 'cancelled';
    order.paymentDetails.status = 'failed';
    order.statusHistory.push({
      status: 'cancelled',
      comment: 'Payment failed - stock restored',
      timestamp: new Date(),
    });

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Payment failure handled and stock restored',
      orderId: order.orderId,
    });

  } catch (error) {
    console.error('Payment failure handling error:', error);
    return NextResponse.json({ 
      message: 'Failed to handle payment failure' 
    }, { status: 500 });
  }
}
