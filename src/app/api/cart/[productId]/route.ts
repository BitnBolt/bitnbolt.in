import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Products';
import mongoose from 'mongoose';

export async function DELETE(_req: Request, { params }: { params: { productId: string } }) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let productId = params.productId;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      const pBySlug = await Product.findOne({ slug: productId }).select('_id');
      if (!pBySlug) return NextResponse.json({ message: 'Invalid product' }, { status: 400 });
      productId = String(pBySlug._id);
    }

    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    user.cart = (user.cart || []).filter((pid: any) => String(pid) !== String(productId)) as any;
    await user.save();

    return NextResponse.json({ message: 'Removed from cart' });
  } catch (error) {
    console.error('DELETE /api/cart/[productId] error', error);
    return NextResponse.json({ message: 'Failed to remove item' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { productId: string } }) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let productId = params.productId;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      const pBySlug = await Product.findOne({ slug: productId }).select('_id');
      if (!pBySlug) return NextResponse.json({ message: 'Invalid product' }, { status: 400 });
      productId = String(pBySlug._id);
    }

    const { op } = await req.json().catch(() => ({ op: '' })) as { op?: 'inc' | 'dec' };
    if (!op) return NextResponse.json({ message: 'op is required (inc|dec)' }, { status: 400 });

    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    if (op === 'inc') {
      (user.cart as any).push(new mongoose.Types.ObjectId(productId));
    } else if (op === 'dec') {
      const idx = (user.cart || []).findIndex((pid: any) => String(pid) === String(productId));
      if (idx >= 0) (user.cart as any).splice(idx, 1);
    }

    await user.save();
    return NextResponse.json({ message: 'Cart updated' });
  } catch (error) {
    console.error('PATCH /api/cart/[productId] error', error);
    return NextResponse.json({ message: 'Failed to update item' }, { status: 500 });
  }
}
