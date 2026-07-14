import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CareerJob from '@/models/CareerJob';
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/admin-jwt';
import { canManageCareers, slugifyJobTitle } from '@/lib/career-admin';

function normalizeLines(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v).trim()).filter(Boolean);
}

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
    const job = await CareerJob.findById(id).lean();
    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { job } });
  } catch (error) {
    console.error('Admin career job get error:', error);
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
    const job = await CareerJob.findById(id);
    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    const body = await request.json();

    if (body.title !== undefined) job.title = String(body.title).trim();
    if (body.description !== undefined) job.description = String(body.description).trim();
    if (body.category !== undefined) job.category = String(body.category).trim();
    if (body.department !== undefined) job.department = String(body.department).trim();
    if (body.location !== undefined) job.location = String(body.location).trim();
    if (body.type !== undefined) job.type = body.type;
    if (body.duration !== undefined) job.duration = String(body.duration).trim();
    if (body.stipend !== undefined) job.stipend = String(body.stipend).trim();
    if (body.openings !== undefined) {
      job.openings = body.openings === '' || body.openings == null ? undefined : Number(body.openings);
    }
    if (body.applicationDeadline !== undefined) {
      job.applicationDeadline = body.applicationDeadline
        ? new Date(body.applicationDeadline)
        : undefined;
    }
    if (body.responsibilities !== undefined) {
      job.responsibilities = normalizeLines(body.responsibilities);
    }
    if (body.requirements !== undefined) {
      job.requirements = normalizeLines(body.requirements);
    }
    if (typeof body.isPublished === 'boolean') job.isPublished = body.isPublished;
    if (typeof body.isOpen === 'boolean') job.isOpen = body.isOpen;

    if (body.slug !== undefined || body.title !== undefined) {
      let slug = (body.slug?.trim() || slugifyJobTitle(job.title)) as string;
      const clash = await CareerJob.exists({ slug, _id: { $ne: job._id } });
      if (clash) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
      job.slug = slug;
    }

    await job.save();

    return NextResponse.json({
      success: true,
      message: 'Job updated',
      data: { job },
    });
  } catch (error) {
    console.error('Admin career job update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const auth = await requireCareerAdmin(request);
    if (auth.error) return auth.error;

    const { id } = await params;
    const job = await CareerJob.findByIdAndDelete(id);
    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Job deleted',
    });
  } catch (error) {
    console.error('Admin career job delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
