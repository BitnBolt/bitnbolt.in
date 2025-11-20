import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Vendor from '@/models/Vendor';
import { extractTokenFromHeader, verifyVendorToken } from '@/lib/vendor-jwt';

type DateRange = {
  start: Date;
  end: Date;
};

function resolveDateRange(request: NextRequest): DateRange {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d';
  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');

  if (startParam && endParam) {
    const start = new Date(startParam);
    const end = new Date(endParam);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      return { start, end };
    }
  }

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

type AnalyticsOrderItem = {
  productId: string | { _id: string; name?: string };
  quantity: number;
  finalPrice: number;
  vendorId?: string | { _id: string };
};

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const tokenPayload = verifyVendorToken(token);
    if (!tokenPayload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    await connectDB();
    const vendor = await Vendor.findById(tokenPayload.vendorId);

    if (!vendor) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      );
    }

    const { start, end } = resolveDateRange(request);
    const vendorObjectId = new mongoose.Types.ObjectId(vendor._id);

    const matchStage = {
      $match: {
        createdAt: { $gte: start, $lte: end },
        'items.vendorId': vendorObjectId,
      },
    };

    const orderLevelAggregation = await Order.aggregate([
      matchStage,
      { $unwind: '$items' },
      { $match: { 'items.vendorId': vendorObjectId } },
      {
        $addFields: {
          itemRevenue: { $multiply: ['$items.finalPrice', '$items.quantity'] },
        },
      },
      {
        $group: {
          _id: '$_id',
          orderId: { $first: '$orderId' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' },
          revenue: { $sum: '$itemRevenue' },
          itemsSold: { $sum: '$items.quantity' },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    const summary = orderLevelAggregation.reduce(
      (acc, order) => {
        acc.totalOrders += 1;
        acc.totalRevenue += order.revenue;
        acc.totalItems += order.itemsSold;
        return acc;
      },
      { totalOrders: 0, totalRevenue: 0, totalItems: 0 }
    );

    const statusBreakdown = orderLevelAggregation.reduce<Record<string, number>>(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {}
    );

    const revenueTrend = await Order.aggregate([
      matchStage,
      { $unwind: '$items' },
      { $match: { 'items.vendorId': vendorObjectId } },
      {
        $addFields: {
          itemRevenue: { $multiply: ['$items.finalPrice', '$items.quantity'] },
          orderDate: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
        },
      },
      {
        $group: {
          _id: '$orderDate',
          revenue: { $sum: '$itemRevenue' },
          orders: { $addToSet: '$_id' },
        },
      },
      { $sort: { _id: 1 } },
    ]).then((results) =>
      results.map((entry) => ({
        date: entry._id,
        revenue: entry.revenue,
        orders: entry.orders.length,
      }))
    );

    const topProducts = await Order.aggregate([
      matchStage,
      { $unwind: '$items' },
      { $match: { 'items.vendorId': vendorObjectId } },
      {
        $group: {
          _id: '$items.productId',
          unitsSold: { $sum: '$items.quantity' },
          revenue: {
            $sum: { $multiply: ['$items.finalPrice', '$items.quantity'] },
          },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          productId: '$product._id',
          name: '$product.name',
          slug: '$product.slug',
          image: { $arrayElemAt: ['$product.images', 0] },
          revenue: 1,
          unitsSold: 1,
        },
      },
    ]);

    const recentOrdersRaw = await Order.find({
      createdAt: { $gte: start, $lte: end },
      'items.vendorId': vendor._id,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderId status createdAt paymentDetails orderSummary items')
      .lean();

    const recentOrders = (recentOrdersRaw as unknown as Array<{
      orderId: string;
      status: string;
      createdAt: Date;
      paymentDetails?: { status?: string };
      orderSummary?: { totalAmount?: number };
      items: AnalyticsOrderItem[];
    }>).map((order) => ({
      orderId: order.orderId,
      status: order.status,
      createdAt: order.createdAt,
      paymentStatus: order.paymentDetails?.status,
      totalAmount: order.orderSummary?.totalAmount,
      items: order.items
        .filter(
          (item: AnalyticsOrderItem) =>
            (typeof item.vendorId === 'object'
              ? item.vendorId._id
              : item.vendorId
            )?.toString() === vendor._id.toString()
        )
        .map((item: AnalyticsOrderItem) => ({
          productId: item.productId,
          quantity: item.quantity,
          finalPrice: item.finalPrice,
        })),
    }));

    return NextResponse.json({
      success: true,
      summary: {
        totalOrders: summary.totalOrders,
        totalRevenue: summary.totalRevenue,
        totalItems: summary.totalItems,
        averageOrderValue:
          summary.totalOrders > 0
            ? summary.totalRevenue / summary.totalOrders
            : 0,
      },
      statusBreakdown,
      revenueTrend,
      topProducts,
      recentOrders,
      range: { start, end },
    });
  } catch (error) {
    console.error('Vendor analytics summary error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load analytics summary' },
      { status: 500 }
    );
  }
}


