import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/admin-jwt';
import Admin from '@/models/Admin';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyAdminToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }

    await connectDB();
    const admin = await Admin.findById(payload.adminId);
    if (!admin || !admin.isActive) {
      return NextResponse.json({ success: false, message: 'Admin not found' }, { status: 404 });
    }

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .select('orderId status paymentDetails orderSummary userId createdAt updatedAt')
      .lean();

    const summary = orders.reduce(
      (acc, order) => {
        const amount = order.orderSummary?.totalAmount || 0;
        acc.totalRevenue += amount;

        switch (order.paymentDetails?.status) {
          case 'paid':
            acc.successful += amount;
            break;
          case 'pending':
            acc.pending += amount;
            break;
          case 'failed':
            acc.failed += amount;
            break;
          case 'refunded':
            acc.refunded += amount;
            break;
          default:
            break;
        }

        if (order.paymentDetails?.method === 'cod') {
          acc.cod += amount;
        } else {
          acc.prepaid += amount;
        }

        return acc;
      },
      { totalRevenue: 0, successful: 0, pending: 0, failed: 0, refunded: 0, cod: 0, prepaid: 0 }
    );

    return NextResponse.json({
      success: true,
      summary,
      latestPayments: orders,
    });
  } catch (error) {
    console.error('Admin payments summary error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load payment summary' },
      { status: 500 }
    );
  }
}


