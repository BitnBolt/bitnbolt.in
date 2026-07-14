import { NextRequest, NextResponse } from 'next/server';
import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';
import { connectDB } from '@/lib/db';
import CareerApplication, { ICareerApplication } from '@/models/CareerApplication';
import CareerJob from '@/models/CareerJob';
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/admin-jwt';
import { canManageCareers } from '@/lib/career-admin';

async function getCapJobIds(): Promise<Types.ObjectId[]> {
  const capJobs = await CareerJob.find({ type: 'cap' }).select('_id').lean();
  return capJobs.map((j) => j._id as Types.ObjectId);
}

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
    const status = searchParams.get('status');
    const jobId = searchParams.get('jobId');
    const search = searchParams.get('search')?.trim();
    /** internship (default) | cap — keeps CAP out of internship applications */
    const scope = (searchParams.get('scope') || 'internship').toLowerCase();

    const capJobIds = await getCapJobIds();

    const filter: FilterQuery<ICareerApplication> = {};
    if (status) filter.status = status;
    if (jobId) {
      filter.jobId = jobId;
    } else if (scope === 'cap') {
      filter.jobId = { $in: capJobIds.length ? capJobIds : [new Types.ObjectId()] };
    } else {
      // internship / trainee / other — exclude CAP roles
      if (capJobIds.length) {
        filter.jobId = { $nin: capJobIds };
      }
    }

    if (search) {
      filter.$and = [
        ...(filter.$and || []),
        {
          $or: [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { jobTitle: { $regex: search, $options: 'i' } },
            { college: { $regex: search, $options: 'i' } },
          ],
        },
      ];
    }

    const skip = (page - 1) * limit;

    const scopeJobFilter =
      scope === 'cap'
        ? { jobId: { $in: capJobIds.length ? capJobIds : [new Types.ObjectId()] } }
        : capJobIds.length
          ? { jobId: { $nin: capJobIds } }
          : {};

    const [applications, total, statusCounts, scopeTotal] = await Promise.all([
      CareerApplication.find(filter)
        .populate('jobId', 'title slug type category isOpen isPublished')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CareerApplication.countDocuments(filter),
      CareerApplication.aggregate([
        { $match: scopeJobFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      CareerApplication.countDocuments(scopeJobFilter),
    ]);

    const stats: Record<string, number> = {
      total: scopeTotal,
      submitted: 0,
      under_review: 0,
      interview: 0,
      offered: 0,
      rejected: 0,
      withdrawn: 0,
    };
    for (const row of statusCounts) {
      if (row._id && row._id in stats) stats[row._id] = row.count;
    }

    return NextResponse.json({
      success: true,
      data: {
        applications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.max(1, Math.ceil(total / limit)),
        },
        stats,
        scope,
      },
    });
  } catch (error) {
    console.error('Admin career applications list error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
