import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Vendor from '@/models/Vendor';
import { extractTokenFromHeader, verifyVendorToken } from '@/lib/vendor-jwt';

const PAID_STATUSES = ['delivered'];
const IN_PROGRESS_STATUSES = ['confirmed', 'processing', 'shipped'];

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const tokenPayload = verifyVendorToken(token);
    if (!tokenPayload) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }

    await connectDB();

    const vendor = await Vendor.findById(tokenPayload.vendorId);
    if (!vendor) {
      return NextResponse.json({ success: false, message: 'Vendor not found' }, { status: 404 });
    }

    const vendorId = new mongoose.Types.ObjectId(vendor._id);

    const pipeline = [
      { $match: { 'items.vendorId': vendorId } },
      { $unwind: '$items' },
      { $match: { 'items.vendorId': vendorId } },
      {
        $addFields: {
          itemAmount: { $multiply: ['$items.finalPrice', '$items.quantity'] },
          paymentMethod: '$paymentDetails.method',
        },
      },
    ];

    const rows = await Order.aggregate(pipeline);

    const summary = rows.reduce(
      (acc, row) => {
        const amount = row.itemAmount || 0;
        acc.totalGross += amount;

        if (row.status && PAID_STATUSES.includes(row.status)) {
          acc.released += amount;
        } else if (row.status && IN_PROGRESS_STATUSES.includes(row.status)) {
          acc.pending += amount;
        } else if (row.status === 'cancelled' || row.status === 'returned') {
          acc.refunds += amount;
        }

        if (row.paymentMethod === 'cod') {
          acc.codAmount += amount;
        } else {
          acc.prepaidAmount += amount;
        }

        return acc;
      },
      { totalGross: 0, released: 0, pending: 0, refunds: 0, codAmount: 0, prepaidAmount: 0 }
    );

    const receivables = await Order.aggregate([
      { $match: { status: { $in: IN_PROGRESS_STATUSES }, 'items.vendorId': vendorId } },
      { $unwind: '$items' },
      { $match: { 'items.vendorId': vendorId } },
      {
        $group: {
          _id: '$orderId',
          orderId: { $first: '$orderId' },
          status: { $first: '$status' },
          paymentMethod: { $first: '$paymentDetails.method' },
          amount: { $sum: { $multiply: ['$items.finalPrice', '$items.quantity'] } },
          updatedAt: { $first: '$updatedAt' },
        },
      },
      { $sort: { updatedAt: -1 } },
      { $limit: 10 },
    ]);

    const settlements = await Order.aggregate([
      { $match: { status: { $in: PAID_STATUSES }, 'items.vendorId': vendorId } },
      { $unwind: '$items' },
      { $match: { 'items.vendorId': vendorId } },
      {
        $group: {
          _id: '$orderId',
          orderId: { $first: '$orderId' },
          status: { $first: '$status' },
          paymentMethod: { $first: '$paymentDetails.method' },
          amount: { $sum: { $multiply: ['$items.finalPrice', '$items.quantity'] } },
          deliveredAt: { $first: '$updatedAt' },
        },
      },
      { $sort: { deliveredAt: -1 } },
      { $limit: 10 },
    ]);

    return NextResponse.json({
      success: true,
      summary,
      receivables,
      settlements,
    });
  } catch (error) {
    console.error('Vendor payments summary error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load payment summary' },
      { status: 500 }
    );
  }
}


