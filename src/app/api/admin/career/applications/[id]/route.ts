import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CareerApplication from '@/models/CareerApplication';
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/admin-jwt';
import { canManageCareers } from '@/lib/career-admin';

const ALLOWED_STATUSES = [
  'submitted',
  'under_review',
  'interview',
  'offered',
  'rejected',
  'withdrawn',
] as const;

async function requireCareerAdmin(request: NextRequest) {
  const token = extractTokenFromHeader(request.headers.get('authorization'));
  if (!token) return { error: NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 }) };
  const decoded = verifyAdminToken(token);
  if (!decoded) return { error: NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 }) };
  if (!canManageCareers(decoded)) {
    return {
      error: NextResponse.json(
        { success: false, message: 'Missing manage_careers permission' },
        { status: 403 }
      ),
    };
  }
  return { decoded };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const auth = await requireCareerAdmin(request);
    if (auth.error) return auth.error;

    const { id } = await params;
    const application = await CareerApplication.findById(id)
      .populate('jobId', 'title slug type category location isOpen isPublished')
      .lean();

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { application } });
  } catch (error) {
    console.error('Admin career application get error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const auth = await requireCareerAdmin(request);
    if (auth.error) return auth.error;

    const { id } = await params;
    const application = await CareerApplication.findById(id);
    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (body.status !== undefined) {
      if (!ALLOWED_STATUSES.includes(body.status)) {
        return NextResponse.json(
          { success: false, message: 'Invalid status' },
          { status: 400 }
        );
      }
      application.status = body.status;
    }

    if (body.adminNotes !== undefined) {
      application.adminNotes = String(body.adminNotes);
    }

    await application.save();

    return NextResponse.json({
      success: true,
      message: 'Application updated',
      data: { application },
    });
  } catch (error) {
    console.error('Admin career application update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
