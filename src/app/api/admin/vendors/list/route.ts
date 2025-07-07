import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor, { IVendor } from '@/models/Vendor';
import { verifyAdminToken } from '@/lib/admin-jwt';
import type { FilterQuery } from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyAdminToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status'); // approved, pending, suspended
    const search = searchParams.get('search');

    // Build filter
    const filter: FilterQuery<IVendor> = {};
    if (status === 'approved') {
      filter.approved = true;
      filter.suspended = false;
    } else if (status === 'pending') {
      filter.approved = false;
      filter.suspended = false;
    } else if (status === 'suspended') {
      filter.suspended = true;
    }

    if (search) {
      filter.$or = [
        { seller_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { shopName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get vendors with pagination
    const vendors = await Vendor.find(filter)
      .select('-password -emailVerificationToken -phoneVerificationOTP -resetPasswordOTP')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Vendor.countDocuments(filter);

    // Calculate stats
    const stats = {
      total: await Vendor.countDocuments(),
      approved: await Vendor.countDocuments({ approved: true, suspended: false }),
      pending: await Vendor.countDocuments({ approved: false, suspended: false }),
      suspended: await Vendor.countDocuments({ suspended: true }),
      emailVerified: await Vendor.countDocuments({ emailVerified: true }),
      phoneVerified: await Vendor.countDocuments({ phoneVerified: true })
    };

    return NextResponse.json({
      success: true,
      data: {
        vendors,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats
      }
    });

  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 