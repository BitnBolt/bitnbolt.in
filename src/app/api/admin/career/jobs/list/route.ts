import { NextRequest, NextResponse } from 'next/server';
import type { FilterQuery } from 'mongoose';
import { connectDB } from '@/lib/db';
import CareerJob, { ICareerJob } from '@/models/CareerJob';
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/admin-jwt';
import { canManageCareers } from '@/lib/career-admin';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = extractTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyAdminToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    if (!canManageCareers(decoded)) {
      return NextResponse.json(
        { success: false, message: 'Missing manage_careers permission' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const status = searchParams.get('status'); // published | draft | closed
    const type = searchParams.get('type');
    const search = searchParams.get('search')?.trim();

    const filter: FilterQuery<ICareerJob> = {};
    if (status === 'published') {
      filter.isPublished = true;
      filter.isOpen = true;
    } else if (status === 'draft') {
      filter.isPublished = false;
    } else if (status === 'closed') {
      filter.isOpen = false;
    }

    if (type) filter.type = type;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [jobs, total, stats] = await Promise.all([
      CareerJob.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
      CareerJob.countDocuments(filter),
      Promise.all([
        CareerJob.countDocuments(),
        CareerJob.countDocuments({ isPublished: true, isOpen: true }),
        CareerJob.countDocuments({ isPublished: false }),
        CareerJob.countDocuments({ isOpen: false }),
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        jobs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.max(1, Math.ceil(total / limit)),
        },
        stats: {
          total: stats[0],
          published: stats[1],
          draft: stats[2],
          closed: stats[3],
        },
      },
    });
  } catch (error) {
    console.error('Admin career jobs list error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
