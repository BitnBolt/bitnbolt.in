import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Products';
import User from '@/models/User';
import { verifyCashfreeWebhookSignature } from '@/lib/cashfree';
import { notifyAsync, reportSystemErrorAsync } from '@/lib/telegram-notify';

type CashfreeWebhookPayload = {
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

const PAYMENT_SUCCESS_TYPES = new Set([
  'PAYMENT_SUCCESS_WEBHOOK',
  'PAYMENT_SUCCESS_TDR_WEBHOOK',
]);

const PAYMENT_FAILED_TYPES = new Set([
  'PAYMENT_FAILED_WEBHOOK',
  'PAYMENT_USER_DROPPED_WEBHOOK',
]);

/**
 * Cashfree webhook endpoint (dashboard: https://bitnbolt.in/api/payment/webhook/cashfree)
 * Version: 2025-01-01
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature') || '';
    const timestamp = req.headers.get('x-webhook-timestamp') || '';

    try {
      const valid = verifyCashfreeWebhookSignature(signature, rawBody, timestamp);
      if (!valid) {
        console.error('Cashfree webhook signature mismatch');
        return NextResponse.json({ message: 'Invalid webhook signature' }, { status: 400 });
      }
    } catch (verifyError) {
      console.error('Cashfree webhook signature verification failed:', verifyError);
      return NextResponse.json({ message: 'Invalid webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody) as CashfreeWebhookPayload;
    const eventType = payload.type || '';

    // Ack unrelated events (settlements, disputes, instruments, etc.) so Cashfree does not retry
    const isPaymentEvent =
      PAYMENT_SUCCESS_TYPES.has(eventType) ||
      PAYMENT_FAILED_TYPES.has(eventType) ||
      payload.data?.payment?.payment_status === 'SUCCESS' ||
      payload.data?.payment?.payment_status === 'FAILED' ||
      payload.data?.payment?.payment_status === 'USER_DROPPED';

    if (!isPaymentEvent) {
      return NextResponse.json({ success: true, ignored: true, type: eventType });
    }

    const orderId = payload.data?.order?.order_id;
    if (!orderId) {
      // Payment events should include order_id; ack to avoid useless retries
      return NextResponse.json({ success: true, ignored: true, reason: 'missing_order_id' });
    }

    await connectDB();

    const order = await Order.findOne({ orderId });
    if (!order) {
      // Unknown/old order — ack so Cashfree stops retrying
      console.warn(`Cashfree webhook: order not found (${orderId})`);
      return NextResponse.json({ success: true, ignored: true, reason: 'order_not_found' });
    }

    const paymentStatus = payload.data?.payment?.payment_status;
    const isPaid =
      PAYMENT_SUCCESS_TYPES.has(eventType) ||
      paymentStatus === 'SUCCESS' ||
      payload.data?.order?.order_status === 'PAID';

    const isFailed =
      PAYMENT_FAILED_TYPES.has(eventType) ||
      paymentStatus === 'FAILED' ||
      paymentStatus === 'USER_DROPPED';

    if (isPaid) {
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

        notifyAsync({
          domain: 'payments',
          event: 'payment.success',
          title: 'Payment received',
          body: `Order ${orderId} · ₹${order.totalAmount ?? payload.data?.order?.order_amount ?? '?'} paid`,
          severity: 'info',
          meta: {
            orderId,
            paymentId: paymentId || null,
            amount: order.totalAmount,
          },
        });
        notifyAsync({
          domain: 'orders',
          event: 'order.confirmed',
          title: 'Order confirmed',
          body: `Order ${orderId} confirmed after online payment`,
          severity: 'info',
          meta: { orderId },
        });
      }

      return NextResponse.json({ success: true });
    }

    if (isFailed && order.paymentDetails.status === 'pending') {
      // Restore stock once on failed / user-dropped payment
      try {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: item.quantity } },
            { new: true },
          );
        }
      } catch (stockError) {
        console.error('Cashfree webhook: failed to restore stock:', stockError);
        reportSystemErrorAsync({
          event: 'webhook.cashfree.stock_restore',
          title: 'Stock restore failed after payment failure',
          body: stockError instanceof Error ? stockError.message : 'Unknown error',
          meta: { orderId },
        });
      }

      order.paymentDetails.status = 'failed';
      order.paymentDetails.gatewayResponse = payload as unknown as Record<string, unknown>;
      order.status = 'cancelled';
      order.statusHistory.push({
        status: 'cancelled',
        comment:
          paymentStatus === 'USER_DROPPED'
            ? 'Payment abandoned (user dropped) — stock restored'
            : 'Payment failed via Cashfree webhook — stock restored',
        timestamp: new Date(),
      });
      await order.save();

      notifyAsync({
        domain: 'payments',
        event: paymentStatus === 'USER_DROPPED' ? 'payment.dropped' : 'payment.failed',
        title: paymentStatus === 'USER_DROPPED' ? 'Payment abandoned' : 'Payment failed',
        body: `Order ${orderId} · ${paymentStatus || 'FAILED'}`,
        severity: 'warning',
        meta: { orderId, paymentStatus },
      });
    }

    return NextResponse.json({ success: true, handled: true });
  } catch (error) {
    console.error('Cashfree webhook error:', error);
    reportSystemErrorAsync({
      event: 'webhook.cashfree',
      title: 'Cashfree webhook processing failed',
      body: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json({ message: 'Webhook processing failed' }, { status: 500 });
  }
}
