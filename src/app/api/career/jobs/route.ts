import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CareerJob from '@/models/CareerJob';

/** Public: open, published roles for career.bitnbolt.in */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));

    const filter: Record<string, unknown> = {
      isPublished: true,
      isOpen: true,
    };
    if (type) filter.type = type;
    if (category) filter.category = category;

    const [items, total] = await Promise.all([
      CareerJob.find(filter)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .select(
          'title slug type category department location description duration stipend openings applicationDeadline updatedAt'
        )
        .lean(),
      CareerJob.countDocuments(filter),
    ]);

    return NextResponse.json({
      items,
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (error) {
    console.error('GET /api/career/jobs error:', error);
    return NextResponse.json({ message: 'Failed to fetch jobs' }, { status: 500 });
  }
}
