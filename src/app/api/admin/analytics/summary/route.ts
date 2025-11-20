import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Vendor from '@/models/Vendor';
import Product from '@/models/Products';
import Admin from '@/models/Admin';
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/admin-jwt';

type DateRange = {
  start: Date;
  end: Date;
};

function resolveDateRange(request: NextRequest): DateRange {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d';
  const end = new Date();
  const start = new Date(end);

  switch (range) {
    case '7d':
      start.setDate(end.getDate() - 6);
      break;
    case '90d':
      start.setDate(end.getDate() - 89);
      break;
    case '1y':
      start.setFullYear(end.getFullYear() - 1);
      break;
    case '30d':
    default:
      start.setDate(end.getDate() - 29);
      break;
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

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

    const { start, end } = resolveDateRange(request);

    const dateMatch = { createdAt: { $gte: start, $lte: end } };

    const ordersAggregation = await Order.aggregate([
      { $match: dateMatch },
      {
        $addFields: {
          orderRevenue: '$orderSummary.totalAmount',
        },
      },
      {
        $group: {
          _id: '$status',
          orders: { $sum: 1 },
          revenue: { $sum: '$orderSummary.totalAmount' },
        },
      },
    ]);

    const overall = ordersAggregation.reduce(
      (acc, entry) => {
        acc.totalOrders += entry.orders;
        acc.totalRevenue += entry.revenue;
        return acc;
      },
      { totalOrders: 0, totalRevenue: 0 }
    );

    const statusBreakdown = ordersAggregation.reduce<Record<string, { orders: number; revenue: number }>>((acc, entry) => {
      acc[entry._id || 'unknown'] = {
        orders: entry.orders,
        revenue: entry.revenue,
      };
      return acc;
    }, {});

    const revenueTrend = await Order.aggregate([
      { $match: dateMatch },
      {
        $group: {
          _id: {
            $dateToString: { date: '$createdAt', format: '%Y-%m-%d' },
          },
          revenue: { $sum: '$orderSummary.totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]).then((results) =>
      results.map((item) => ({
        date: item._id,
        revenue: item.revenue,
        orders: item.orders,
      }))
    );

    const topVendors = await Order.aggregate([
      { $match: dateMatch },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.vendorId',
          revenue: { $sum: { $multiply: ['$items.finalPrice', '$items.quantity'] } },
          orders: { $addToSet: '$_id' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'vendors',
          localField: '_id',
          foreignField: '_id',
          as: 'vendor',
        },
      },
      { $unwind: '$vendor' },
      {
        $project: {
          vendorId: '$vendor._id',
          shopName: '$vendor.shopName',
          email: '$vendor.email',
          revenue: 1,
          orders: { $size: '$orders' },
        },
      },
    ]);

    const topProducts = await Order.aggregate([
      { $match: dateMatch },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          unitsSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.finalPrice', '$items.quantity'] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          productId: '$product._id',
          name: '$product.name',
          vendorId: '$product.vendorId',
          revenue: 1,
          unitsSold: 1,
        },
      },
    ]);

    const [totalVendors, totalProducts, totalUsers] = await Promise.all([
      Vendor.countDocuments(),
      Product.countDocuments(),
      mongoose.connection.collection('users').countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      summary: {
        totalOrders: overall.totalOrders,
        totalRevenue: overall.totalRevenue,
        totalVendors,
        totalProducts,
        totalUsers,
      },
      statusBreakdown,
      revenueTrend,
      topVendors,
      topProducts,
      range: { start, end },
    });
  } catch (error) {
    console.error('Admin analytics summary error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load admin analytics summary' },
      { status: 500 }
    );
  }
}


