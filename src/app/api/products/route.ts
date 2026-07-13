import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Products';

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const dealsOnly = searchParams.get('deals') === '1' || searchParams.get('deals') === 'true';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get('pageSize') || (dealsOnly ? '4' : '6'), 10))
    );
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const filter: Record<string, unknown> = { isPublished: true, isSuspended: false };
    if (dealsOnly) {
      filter.discount = { $gt: 0 };
    }
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (q) {
      filter.$text = { $search: q };
    }
    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (minPrice && !isNaN(parseFloat(minPrice))) priceFilter.$gte = parseFloat(minPrice);
      if (maxPrice && !isNaN(parseFloat(maxPrice))) priceFilter.$lte = parseFloat(maxPrice);
      filter.finalPrice = priceFilter;
    }

    const sort = dealsOnly
      ? ({ discount: -1 as const, isFeatured: -1 as const, updatedAt: -1 as const })
      : ({ isFeatured: -1 as const, createdAt: -1 as const });

    const total = await Product.countDocuments(filter);
    const items = await Product.find(filter)
      .sort(sort)
      .skip(dealsOnly ? 0 : (page - 1) * pageSize)
      .limit(pageSize)
      .select({
        name: 1,
        slug: 1,
        description: 1,
        images: 1,
        finalPrice: 1,
        discount: 1,
        basePrice: 1,
        profitMargin: 1,
        rating: 1,
        category: 1,
        stock: 1,
        isPublished: 1,
        isFeatured: 1,
      })
      .lean();

    return NextResponse.json({
      items,
      page: dealsOnly ? 1 : page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (error: unknown) {
    console.error('GET /api/products error', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}
