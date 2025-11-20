import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/admin-jwt';
import Admin from '@/models/Admin';
import { Filter, Document } from 'mongodb';
import mongoose from 'mongoose';

const PAGE_SIZE_DEFAULT = 25;

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
    const query = searchParams.get('query');

    const usersCollection = mongoose.connection.collection('users');
    const filter: Filter<Document> = {};

    if (status === 'verified') {
      filter.emailVerified = true;
    } else if (status === 'unverified') {
      filter.emailVerified = false;
    }

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ];
    }

    const cursor = usersCollection.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    const [users, total] = await Promise.all([cursor.toArray(), usersCollection.countDocuments(filter)]);

    const statsAgg = await usersCollection
      .aggregate([
        {
          $group: {
            _id: '$emailVerified',
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const stats = statsAgg.reduce(
      (acc, item) => {
        if (item._id) acc.verified = item.count;
        else acc.unverified = item.count;
        return acc;
      },
      { verified: 0, unverified: 0 }
    );

    return NextResponse.json({
      success: true,
      users,
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin users list error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load users' },
      { status: 500 }
    );
  }
}


