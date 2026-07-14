import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import CareerJob from '@/models/CareerJob';
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/admin-jwt';
import { canManageCareers, slugifyJobTitle } from '@/lib/career-admin';

function normalizeLines(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v).trim()).filter(Boolean);
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    if (body.type === 'cap') {
      return NextResponse.json(
        {
          success: false,
          message: 'CAP is managed on the career site, not through job postings. Use CAP Applications to review applicants.',
        },
        { status: 400 }
      );
    }

    if (!body.title?.trim()) {
      return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 });
    }
    if (!body.description?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Description is required' },
        { status: 400 }
      );
    }
    if (!body.category?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Category is required' },
        { status: 400 }
      );
    }

    let slug = (body.slug?.trim() || slugifyJobTitle(body.title)) as string;
    let exists = await CareerJob.exists({ slug });
    let counter = 1;
    const baseSlug = slug;
    while (exists) {
      slug = `${baseSlug}-${counter}`;
      exists = await CareerJob.exists({ slug });
      counter++;
    }

    const job = await CareerJob.create({
      title: body.title.trim(),
      slug,
      type: body.type || 'internship',
      category: body.category.trim(),
      department: body.department?.trim() || '',
      location: body.location?.trim() || 'Bengaluru',
      description: body.description.trim(),
      responsibilities: normalizeLines(body.responsibilities),
      requirements: normalizeLines(body.requirements),
      duration: body.duration?.trim() || undefined,
      stipend: body.stipend?.trim() || undefined,
      openings: body.openings != null ? Number(body.openings) : undefined,
      applicationDeadline: body.applicationDeadline
        ? new Date(body.applicationDeadline)
        : undefined,
      isPublished: Boolean(body.isPublished),
      isOpen: body.isOpen !== false,
    });

    return NextResponse.json({
      success: true,
      message: 'Job posted successfully',
      data: { job },
    });
  } catch (error) {
    console.error('Admin career job create error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
