import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
// RazorpayConfig removed - using environment variables
import Razorpay from 'razorpay';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId 
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json({ 
        message: 'Missing required payment verification data' 
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

    // Get Razorpay credentials from environment
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json({ 
        message: 'Payment gateway not configured' 
      }, { status: 500 });
    }

    // Verify signature
    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    const body_signature = razorpay_order_id + "|" + razorpay_payment_id;
    const expected_signature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(body_signature.toString())
      .digest("hex");

    if (expected_signature !== razorpay_signature) {
      return NextResponse.json({ 
        message: 'Invalid payment signature' 
      }, { status: 400 });
    }

    // Update order payment details
    order.paymentDetails.status = 'paid';
    order.paymentDetails.razorpayPaymentId = razorpay_payment_id;
    order.paymentDetails.razorpaySignature = razorpay_signature;
    order.paymentDetails.paidAt = new Date();
    order.paymentDetails.gatewayResponse = {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature: razorpay_signature,
    };

    // Update order status
    order.status = 'confirmed';
    order.statusHistory.push({
      status: 'confirmed',
      comment: 'Payment verified and order confirmed',
      timestamp: new Date(),
    });

    await order.save();

    // Clear user's cart
    const user = await User.findById(session.user.id);
    if (user) {
      user.cart = [];
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      orderId: order.orderId,
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ 
      message: 'Failed to verify payment' 
    }, { status: 500 });
  }
}

