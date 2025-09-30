import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Products';
import mongoose from 'mongoose';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const idOrSlug = params.id;

    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

    const product = await Product.findOne(query).lean();
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('GET /api/products/[id] error', error);
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
  }
}
