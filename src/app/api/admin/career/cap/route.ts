import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/admin-jwt';
import { canManageCareers } from '@/lib/career-admin';
import { ensureCapJobDoc, findCapJobDoc } from '@/lib/career-cap';
import { notifyAsync } from '@/lib/telegram-notify';

async function requireCareerAdmin(request: NextRequest) {
  const token = extractTokenFromHeader(request.headers.get('authorization'));
  if (!token) {
    return { error: NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 }) };
  }
  const decoded = verifyAdminToken(token);
  if (!decoded) {
    return { error: NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 }) };
  }
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

/** Admin: CAP applications open/closed toggle state */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const auth = await requireCareerAdmin(request);
    if (auth.error) return auth.error;

    const job = await findCapJobDoc();
    return NextResponse.json({
      success: true,
      data: {
        isOpen: job ? Boolean(job.isOpen && job.isPublished) : false,
        jobId: job ? String(job._id) : null,
        title: job?.title || 'Career Accelerator Program (CAP)',
        exists: Boolean(job),
      },
    });
  } catch (error) {
    console.error('Admin CAP GET error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

/** Admin: turn CAP applications on/off (does not edit CAP page content) */
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const auth = await requireCareerAdmin(request);
    if (auth.error) return auth.error;

    const body = await request.json();
    if (typeof body.isOpen !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'isOpen boolean is required' },
        { status: 400 }
      );
    }

    const job = await ensureCapJobDoc();
    job.isOpen = body.isOpen;
    // Keep published so the apply endpoint can resolve the job + toggle cleanly
    job.isPublished = true;
    await job.save();

    notifyAsync({
      domain: 'cap',
      event: body.isOpen ? 'cap.opened' : 'cap.closed',
      title: body.isOpen ? 'CAP applications opened' : 'CAP applications closed',
      body: `${job.title} is now ${body.isOpen ? 'open' : 'closed'} for applications`,
      severity: 'info',
      meta: { jobId: String(job._id), isOpen: body.isOpen },
    });

    return NextResponse.json({
      success: true,
      message: body.isOpen
        ? 'CAP applications are now open'
        : 'CAP applications are now closed',
      data: {
        isOpen: job.isOpen,
        jobId: String(job._id),
        title: job.title,
      },
    });
  } catch (error) {
    console.error('Admin CAP PUT error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
