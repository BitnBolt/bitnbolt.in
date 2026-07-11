import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import { getCashfreeClient } from '@/lib/cashfree';

/**
 * Cashfree webhook — confirms payments even if the browser never hits /api/payment/verify.
 * Configure this URL in Cashfree dashboard as well (also sent via order_meta.notify_url).
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature') || '';
    const timestamp = req.headers.get('x-webhook-timestamp') || '';

    const cashfree = getCashfreeClient();

    try {
      cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);
    } catch (verifyError) {
      console.error('Cashfree webhook signature verification failed:', verifyError);
      return NextResponse.json({ message: 'Invalid webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody) as {
      type?: string;
      data?: {
        order?: {
          order_id?: string;
          order_status?: string;
          order_amount?: number;
        };
        payment?: {
          cf_payment_id?: string | number;
          payment_status?: string;
          payment_amount?: number;
        };
      };
    };

    const orderId = payload.data?.order?.order_id;
    if (!orderId) {
      return NextResponse.json({ message: 'Missing order_id' }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const paymentStatus = payload.data?.payment?.payment_status;
    const orderStatus = payload.data?.order?.order_status;
    const isPaid =
      orderStatus === 'PAID' ||
      paymentStatus === 'SUCCESS' ||
      payload.type === 'PAYMENT_SUCCESS_WEBHOOK';

    if (!isPaid) {
      if (paymentStatus === 'FAILED' || payload.type === 'PAYMENT_FAILED_WEBHOOK') {
        if (order.paymentDetails.status === 'pending') {
          order.paymentDetails.status = 'failed';
          order.paymentDetails.gatewayResponse = payload as unknown as Record<string, unknown>;
          await order.save();
        }
      }
      return NextResponse.json({ success: true, handled: true });
    }

    if (order.paymentDetails.status !== 'paid') {
      const paymentId =
        payload.data?.payment?.cf_payment_id != null
          ? String(payload.data.payment.cf_payment_id)
          : undefined;

      order.paymentDetails.status = 'paid';
      order.paymentDetails.paidAt = new Date();
      if (paymentId) {
        order.paymentDetails.cashfreePaymentId = paymentId;
        order.paymentDetails.transactionId = paymentId;
      }
      order.paymentDetails.gatewayResponse = payload as unknown as Record<string, unknown>;

      if (order.status === 'pending') {
        order.status = 'confirmed';
        order.statusHistory.push({
          status: 'confirmed',
          comment: 'Payment confirmed via Cashfree webhook',
          timestamp: new Date(),
        });
      }

      await order.save();

      const user = await User.findById(order.userId);
      if (user && Array.isArray(user.cart) && user.cart.length > 0) {
        user.cart = [];
        await user.save();
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cashfree webhook error:', error);
    return NextResponse.json({ message: 'Webhook processing failed' }, { status: 500 });
  }
}
