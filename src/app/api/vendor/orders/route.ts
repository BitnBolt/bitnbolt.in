import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Vendor from '@/models/Vendor';
import jwt from 'jsonwebtoken';
import { sanitizeOrderItemForVendor, vendorIdOfItem } from '@/lib/vendor-pricing-visibility';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);

    let decoded: { email: string; vendorId?: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
        email: string;
        vendorId?: string;
      };
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status');

    await connectDB();

    const vendor = await Vendor.findOne({ email: decoded.email });
    if (!vendor) {
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }

    const query: { 'items.vendorId': typeof vendor._id; status?: string } = {
      'items.vendorId': vendor._id,
    };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.productId', 'name images slug')
      .populate('userId', 'name email phoneNumber')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const vendorKey = String(vendor._id);

    const filteredOrders = orders.map((order) => {
      const items = order.items
        .filter((item) => vendorIdOfItem(item) === vendorKey)
        .map((item) => sanitizeOrderItemForVendor(item));

      const vendorSubtotal = items.reduce(
        (sum, item) => sum + item.basePrice * item.quantity,
        0
      );

      const plain = order.toObject();
      return {
        ...plain,
        items,
        vendorSubtotal,
        orderSummary: {
          itemsTotal: vendorSubtotal,
          shippingCharge: 0,
          tax: 0,
          totalAmount: vendorSubtotal,
        },
      };
    });

    const totalOrders = await Order.countDocuments(query);

    return NextResponse.json({
      success: true,
      orders: filteredOrders,
      pagination: {
        page,
        limit,
        total: totalOrders,
        pages: Math.ceil(totalOrders / limit) || 1,
      },
    });
  } catch (error) {
    console.error('Get vendor orders error:', error);
    return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
  }
}
