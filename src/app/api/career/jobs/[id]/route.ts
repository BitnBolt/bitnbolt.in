import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import CareerJob from '@/models/CareerJob';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id: idOrSlug } = await params;

    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    const query = isObjectId
      ? { _id: idOrSlug, isPublished: true, isOpen: true }
      : { slug: idOrSlug, isPublished: true, isOpen: true };

    const job = await CareerJob.findOne(query).lean();
    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('GET /api/career/jobs/[id] error:', error);
    return NextResponse.json({ message: 'Failed to fetch job' }, { status: 500 });
  }
}
