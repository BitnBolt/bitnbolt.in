import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';
import Product from '@/models/Products';
import Order from '@/models/Order';
import { verifyAdminToken } from '@/lib/admin-jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyAdminToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid vendor id' }, { status: 400 });
    }

    const vendor = await Vendor.findById(id)
      .select('-password -emailVerificationToken -phoneVerificationOTP -resetPasswordOTP')
      .lean();

    if (!vendor) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      );
    }

    const vendorObjectId = new mongoose.Types.ObjectId(id);

    const [productCounts, products, orderAgg] = await Promise.all([
      Promise.all([
        Product.countDocuments({ vendorId: vendorObjectId }),
        Product.countDocuments({ vendorId: vendorObjectId, isPublished: true, isSuspended: false }),
        Product.countDocuments({ vendorId: vendorObjectId, isPublished: false, isSuspended: false }),
        Product.countDocuments({ vendorId: vendorObjectId, isSuspended: true }),
      ]),
      Product.find({ vendorId: vendorObjectId })
        .sort({ updatedAt: -1 })
        .limit(20)
        .select(
          'name slug images basePrice profitMargin discount finalPrice stock category brand isPublished isSuspended isFeatured createdAt updatedAt'
        )
        .lean(),
      Order.aggregate([
        { $match: { 'items.vendorId': vendorObjectId } },
        { $unwind: '$items' },
        { $match: { 'items.vendorId': vendorObjectId } },
        {
          $group: {
            _id: null,
            orders: { $addToSet: '$_id' },
            itemsSold: { $sum: '$items.quantity' },
            revenue: {
              $sum: { $multiply: ['$items.finalPrice', '$items.quantity'] },
            },
            baseRevenue: {
              $sum: { $multiply: ['$items.basePrice', '$items.quantity'] },
            },
          },
        },
      ]),
    ]);

    const orderStats = orderAgg[0] || {
      orders: [],
      itemsSold: 0,
      revenue: 0,
      baseRevenue: 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        vendor,
        productStats: {
          total: productCounts[0],
          published: productCounts[1],
          draft: productCounts[2],
          suspended: productCounts[3],
        },
        products,
        orderStats: {
          orderCount: Array.isArray(orderStats.orders) ? orderStats.orders.length : 0,
          itemsSold: orderStats.itemsSold || 0,
          customerRevenue: orderStats.revenue || 0,
          vendorBaseRevenue: orderStats.baseRevenue || 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching vendor:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
