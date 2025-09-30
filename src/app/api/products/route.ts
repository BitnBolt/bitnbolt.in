import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Products';

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '6', 10)));
    const category = searchParams.get('category');
    const q = searchParams.get('q');

    const filter: any = { isPublished: true, isSuspended: false };
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (q) {
      filter.$text = { $search: q };
    }

    const total = await Product.countDocuments(filter);
    const items = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select({
        name: 1,
        slug: 1,
        images: 1,
        finalPrice: 1,
        discount: 1,
        basePrice: 1,
        rating: 1,
        category: 1,
        features: 1,
        stock: 1,
        isPublished: 1,
      })
      .lean();

    return NextResponse.json({
      items,
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (error: any) {
    console.error('GET /api/products error', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}
