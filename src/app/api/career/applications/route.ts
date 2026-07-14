import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CareerJob from '@/models/CareerJob';
import CareerApplication from '@/models/CareerApplication';

/** Public: submit application from career.bitnbolt.in */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.jobId) {
      return NextResponse.json({ success: false, message: 'Job ID is required' }, { status: 400 });
    }
    if (!body.fullName?.trim() || !body.email?.trim() || !body.phone?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Full name, email, and phone are required' },
        { status: 400 }
      );
    }

    const job = await CareerJob.findById(body.jobId);
    if (!job || !job.isPublished || !job.isOpen) {
      return NextResponse.json(
        { success: false, message: 'This role is not open for applications' },
        { status: 400 }
      );
    }

    const email = String(body.email).trim().toLowerCase();
    const existing = await CareerApplication.findOne({
      jobId: job._id,
      email,
      status: { $nin: ['withdrawn', 'rejected'] },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'You have already applied to this role' },
        { status: 409 }
      );
    }

    const application = await CareerApplication.create({
      jobId: job._id,
      jobTitle: job.title,
      jobSlug: job.slug,
      fullName: String(body.fullName).trim(),
      email,
      phone: String(body.phone).trim(),
      college: body.college?.trim(),
      degree: body.degree?.trim(),
      graduationYear: body.graduationYear?.trim(),
      linkedin: body.linkedin?.trim(),
      github: body.github?.trim(),
      portfolio: body.portfolio?.trim(),
      preferredTrack: body.preferredTrack?.trim() || job.category,
      coverLetter: body.coverLetter?.trim(),
      resumeUrl: body.resumeUrl?.trim(),
      resumeFileName: body.resumeFileName?.trim(),
      source: body.source?.trim() || 'career.bitnbolt.in',
      status: 'submitted',
    });

    return NextResponse.json({
      success: true,
      message: 'Application submitted',
      data: { applicationId: application._id },
    });
  } catch (error) {
    console.error('POST /api/career/applications error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
