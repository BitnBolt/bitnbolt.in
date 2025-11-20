import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/admin-jwt';
import Admin from '@/models/Admin';

const PAGE_SIZE_DEFAULT = 20;

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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || PAGE_SIZE_DEFAULT.toString(), 10);
    const status = searchParams.get('status');
    const vendorId = searchParams.get('vendorId');
    const paymentStatus = searchParams.get('paymentStatus');
    const query = searchParams.get('query');

    const searchFilters: Record<string, unknown> = {};

    if (status) {
      searchFilters.status = status;
    }

    if (paymentStatus) {
      searchFilters['paymentDetails.status'] = paymentStatus;
    }

    if (vendorId && mongoose.Types.ObjectId.isValid(vendorId)) {
      searchFilters['items.vendorId'] = new mongoose.Types.ObjectId(vendorId);
    }

    if (query) {
      searchFilters.$or = [
        { orderId: { $regex: query, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: query, $options: 'i' } },
        { 'billingAddress.fullName': { $regex: query, $options: 'i' } },
      ];
    }

    const orders = await Order.find(searchFilters)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('items.productId', 'name images slug')
      .populate('items.vendorId', 'shopName email')
      .populate('userId', 'name email phoneNumber')
      .lean();

    const total = await Order.countDocuments(searchFilters);

    const mappedOrders = orders.map((order) => {
      type VendorIdType = { _id?: string; shopName?: string } | string;
      type ProductIdType = { _id?: string; name?: string } | string;
      type OrderItem = {
        productId?: ProductIdType;
        vendorId?: VendorIdType;
        quantity: number;
        finalPrice: number;
      };
      return {
        _id: order._id,
        orderId: order.orderId,
        status: order.status,
        createdAt: order.createdAt,
        paymentDetails: order.paymentDetails,
        orderSummary: order.orderSummary,
        shippingAddress: order.shippingAddress,
        vendorBreakdown: (() => {
          type VendorInfo = { vendorId: string; shopName?: string; revenue: number };
          return (order.items as OrderItem[]).reduce<Record<string, VendorInfo>>((acc, item) => {
            if (!item.vendorId) return acc;
            const asObj = typeof item.vendorId === 'object' ? item.vendorId as { _id?: string; shopName?: string } : undefined;
            const vendorKey = asObj && asObj._id ? asObj._id.toString() : item.vendorId.toString();
            if (!acc[vendorKey]) {
              acc[vendorKey] = {
                vendorId: vendorKey,
                shopName: asObj?.shopName,
                revenue: 0,
              };
            }
            acc[vendorKey].revenue += item.finalPrice * item.quantity;
            return acc;
          }, {});
        })(),
        items: (order.items as OrderItem[]).map((item) => {
          const prodObj = typeof item.productId === 'object' ? item.productId as { _id?: string; name?: string } : undefined;
          const vendorObj = typeof item.vendorId === 'object' ? item.vendorId as { _id?: string; shopName?: string } : undefined;
          return {
            productId: prodObj?._id || item.productId,
            name: prodObj?.name,
            vendorId: vendorObj?._id || item.vendorId,
            vendorName: vendorObj?.shopName,
            quantity: item.quantity,
            finalPrice: item.finalPrice,
          };
        }),
      };
    });

    return NextResponse.json({
      success: true,
      orders: mappedOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin orders list error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load orders' },
      { status: 500 }
    );
  }
}


