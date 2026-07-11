import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import { getCashfreeClient } from '@/lib/cashfree';

type CashfreePayment = {
  cf_payment_id?: string | number;
  payment_status?: string;
  payment_amount?: number;
  payment_currency?: string;
  payment_time?: string;
  payment_method?: unknown;
};

async function markOrderPaid(
  order: InstanceType<typeof Order>,
  gatewayPayload: Record<string, unknown>,
  paymentId?: string,
) {
  order.paymentDetails.status = 'paid';
  order.paymentDetails.paidAt = new Date();
  if (paymentId) {
    order.paymentDetails.cashfreePaymentId = paymentId;
    order.paymentDetails.transactionId = paymentId;
  }
  order.paymentDetails.gatewayResponse = gatewayPayload;

  if (order.status === 'pending') {
    order.status = 'confirmed';
    order.statusHistory.push({
      status: 'confirmed',
      comment: 'Payment verified via Cashfree and order confirmed',
      timestamp: new Date(),
    });
  }

  await order.save();
}

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { orderId } = body as { orderId?: string };

    if (!orderId) {
      return NextResponse.json({
        message: 'Missing required payment verification data',
      }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    if (String(order.userId) !== session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    if (order.paymentDetails.status === 'paid') {
      return NextResponse.json({
        success: true,
        message: 'Payment already verified',
        orderId: order.orderId,
      });
    }

    const cashfreeOrderId = order.paymentDetails.cashfreeOrderId || order.orderId;
    const cashfree = getCashfreeClient();

    const orderResponse = await cashfree.PGFetchOrder(cashfreeOrderId);
    const cfOrder = orderResponse.data;

    if (cfOrder.order_status !== 'PAID') {
      return NextResponse.json({
        success: false,
        message: `Payment not completed yet (status: ${cfOrder.order_status || 'UNKNOWN'})`,
        orderStatus: cfOrder.order_status,
      }, { status: 400 });
    }

    let paymentId: string | undefined;
    try {
      const paymentsResponse = await cashfree.PGOrderFetchPayments(cashfreeOrderId);
      const payments = (paymentsResponse.data || []) as CashfreePayment[];
      const successful = payments.find((p) => p.payment_status === 'SUCCESS') || payments[0];
      if (successful?.cf_payment_id != null) {
        paymentId = String(successful.cf_payment_id);
      }
    } catch (paymentsError) {
      console.error('Failed to fetch Cashfree payments:', paymentsError);
    }

    await markOrderPaid(
      order,
      {
        order_id: cfOrder.order_id,
        order_status: cfOrder.order_status,
        order_amount: cfOrder.order_amount,
        cf_order_id: cfOrder.cf_order_id,
        payment_session_id: cfOrder.payment_session_id,
      },
      paymentId,
    );

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
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Failed to verify payment';
    return NextResponse.json({ message }, { status: 500 });
  }
}
