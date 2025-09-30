import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Products';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id)
      .populate({ path: 'cart', model: Product, select: 'name slug images finalPrice basePrice rating category stock' });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const items = (user.cart as any[]) || [];

    // Build quantity map from duplicates in populated array by _id
    const quantityMap = new Map<string, number>();
    for (const p of items) {
      const key = String(p._id);
      quantityMap.set(key, (quantityMap.get(key) || 0) + 1);
    }

    const detailed = items.map((p: any) => ({
      productId: p._id,
      quantity: quantityMap.get(String(p._id)) || 1,
      product: p,
    }));

    return NextResponse.json({ items: detailed });
  } catch (error) {
    console.error('GET /api/cart error', error);
    return NextResponse.json({ message: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null) as { productId?: string; quantity?: number } | null;
    if (!body?.productId) {
      return NextResponse.json({ message: 'productId is required' }, { status: 400 });
    }

    const quantity = Math.max(0, Math.floor(body.quantity ?? 1));

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(body.productId)) {
      // also allow slug
      const pBySlug = await Product.findOne({ slug: body.productId }).select('_id');
      if (!pBySlug) {
        return NextResponse.json({ message: 'Invalid product reference' }, { status: 400 });
      }
      body.productId = String(pBySlug._id);
    }

    const product = await Product.findById(body.productId).select('_id stock');
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Remove all existing occurrences of this product from cart
    user.cart = (user.cart || []).filter((pid: any) => String(pid) !== String(product._id)) as any;

    // If quantity > 0, push N copies (duplicates represent quantity)
    for (let i = 0; i < quantity; i++) {
      (user.cart as any).push(product._id as any);
    }

    await user.save();

    return NextResponse.json({ message: 'Cart updated', productId: product._id, quantity });
  } catch (error) {
    console.error('POST /api/cart error', error);
    return NextResponse.json({ message: 'Failed to update cart' }, { status: 500 });
  }
}
