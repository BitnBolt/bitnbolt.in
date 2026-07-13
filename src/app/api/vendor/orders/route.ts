import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Products';
import Vendor from '@/models/Vendor';
import jwt from 'jsonwebtoken';
import { sanitizeOrderItemForVendor } from '@/lib/vendor-pricing-visibility';

export async function GET(req: Request) {
  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    let decoded: { email: string; vendorId?: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { email: string; vendorId?: string };
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    await connectDB();

    // Get vendor by email from token
    const vendor = await Vendor.findOne({ email: decoded.email });
    if (!vendor) {
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }

    // Build query for orders containing this vendor's products
    const query: { 'items.vendorId': string; status?: string } = { 'items.vendorId': vendor._id };
    if (status) {
      query.status = status;
    }

    // Get orders with pagination
    const orders = await Order.find(query)
      .populate('items.productId', 'name images slug')
      .populate('userId', 'name email phoneNumber')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Filter items to only show this vendor's products; hide marketplace markup fields
    const filteredOrders = orders.map((order) => {
      const items = order.items
        .filter((item: { vendorId: string }) => String(item.vendorId) === String(vendor._id))
        .map((item: unknown) => sanitizeOrderItemForVendor(item));
      const vendorSubtotal = items.reduce(
        (sum: number, item: { basePrice: number; quantity: number }) =>
          sum + item.basePrice * item.quantity,
        0
      );
      const plain = order.toObject();
      return {
        ...plain,
        items,
        vendorSubtotal,
        orderSummary: {
          ...plain.orderSummary,
          itemsTotal: vendorSubtotal,
          totalAmount: vendorSubtotal,
        },
      };
    });

    // Get total count
    const totalOrders = await Order.countDocuments(query);

    return NextResponse.json({
      success: true,
      orders: filteredOrders,
      pagination: {
        page,
        limit,
        total: totalOrders,
        pages: Math.ceil(totalOrders / limit),
      },
    });

  } catch (error) {
    console.error('Get vendor orders error:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch orders' 
    }, { status: 500 });
  }
}

