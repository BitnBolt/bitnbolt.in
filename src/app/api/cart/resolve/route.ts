import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Products';
import mongoose from 'mongoose';

type IncomingItem = {
  productId?: string;
  quantity?: number;
};

/**
 * Public endpoint: hydrate guest-cart product IDs with live product details.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { items?: IncomingItem[] } | null;
    const incoming = Array.isArray(body?.items) ? body!.items! : [];

    if (incoming.length === 0) {
      return NextResponse.json({ items: [] });
    }

    await connectDB();

    const resolved: Array<{ productId: string; quantity: number }> = [];

    for (const entry of incoming) {
      if (!entry?.productId) continue;
      const quantity = Math.max(1, Math.floor(Number(entry.quantity) || 1));
      let productId = String(entry.productId);

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        const bySlug = await Product.findOne({ slug: productId }).select('_id');
        if (!bySlug) continue;
        productId = String(bySlug._id);
      }

      const existing = resolved.find((r) => r.productId === productId);
      if (existing) existing.quantity += quantity;
      else resolved.push({ productId, quantity });
    }

    if (resolved.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const products = await Product.find({
      _id: { $in: resolved.map((r) => r.productId) },
    }).select('name slug images finalPrice basePrice rating category stock');

    const byId = new Map(products.map((p) => [String(p._id), p]));

    const items = resolved
      .map((r) => {
        const product = byId.get(r.productId);
        if (!product) return null;
        return {
          productId: r.productId,
          quantity: r.quantity,
          product,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ items });
  } catch (error) {
    console.error('POST /api/cart/resolve error', error);
    return NextResponse.json({ message: 'Failed to resolve cart' }, { status: 500 });
  }
}
