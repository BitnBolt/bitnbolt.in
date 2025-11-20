import { NextRequest, NextResponse } from 'next/server';
import mongoose, { Types } from 'mongoose';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { extractTokenFromHeader, verifyVendorToken } from '@/lib/vendor-jwt';
import Vendor from '@/models/Vendor';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyVendorToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }

    await connectDB();
    const vendor = await Vendor.findById(payload.vendorId);
    if (!vendor) {
      return NextResponse.json({ success: false, message: 'Vendor not found' }, { status: 404 });
    }

    const vendorId = new mongoose.Types.ObjectId(vendor._id);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const customersAggregation = await Order.aggregate([
      { $match: { 'items.vendorId': vendorId } },
      {
        $group: {
          _id: '$userId',
          orders: { $sum: 1 },
          lastOrderDate: { $max: '$createdAt' },
          totalSpent: {
            $sum: {
              $sum: {
                $map: {
                  input: '$items',
                  as: 'item',
                  in: {
                    $cond: [
                      { $eq: ['$$item.vendorId', vendorId] },
                      { $multiply: ['$$item.finalPrice', '$$item.quantity'] },
                      0,
                    ],
                  },
                },
              },
            },
          },
        },
      },
      { $sort: { lastOrderDate: -1 } },
      {
        $facet: {
          paginated: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);

    const paginated = customersAggregation[0]?.paginated || [];
    const totalCount = customersAggregation[0]?.totalCount?.[0]?.count || 0;

    const customerIds = paginated.map((entry: { _id: Types.ObjectId }) => entry._id);
    let customerProfiles: Record<string, { name?: string; email?: string; phoneNumber?: string }> = {};

    if (customerIds.length > 0) {
      const users = await mongoose.connection
        .collection('users')
        .find({ _id: { $in: customerIds } })
        .project({ name: 1, email: 1, phoneNumber: 1 })
        .toArray();

      customerProfiles = users.reduce((acc, user) => {
        acc[user._id.toString()] = {
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
        };
        return acc;
      }, {} as Record<string, { name?: string; email?: string; phoneNumber?: string }>);
    }

    const customers = paginated.map((entry: { _id: Types.ObjectId; orders: number; lastOrderDate: Date; totalSpent: number }) => {
      const profile = customerProfiles[entry._id?.toString()] || {};
      return {
        userId: entry._id,
        name: profile.name || 'Customer',
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        orderCount: entry.orders as number,
        lastOrderDate: entry.lastOrderDate as Date,
        totalSpent: entry.totalSpent,
      };
    });

    return NextResponse.json({
      success: true,
      customers,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Vendor customers fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load customer insights' },
      { status: 500 }
    );
  }
}


