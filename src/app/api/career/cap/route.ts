import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { findCapJobDoc } from '@/lib/career-cap';

/**
 * Public CAP apply status — content stays on career site; this only drives the form.
 * Always returns isOpen + jobId when a CAP record exists (even if closed).
 */
export async function GET() {
  try {
    await connectDB();
    const job = await findCapJobDoc();

    if (!job) {
      return NextResponse.json({
        isOpen: false,
        jobId: null,
        title: 'Career Accelerator Program (CAP)',
        message: 'CAP applications are not configured yet.',
      });
    }

    return NextResponse.json({
      isOpen: Boolean(job.isOpen && job.isPublished),
      jobId: String(job._id),
      title: job.title || 'Career Accelerator Program (CAP)',
    });
  } catch (error) {
    console.error('GET /api/career/cap error:', error);
    return NextResponse.json({ message: 'Failed to load CAP status' }, { status: 500 });
  }
}
