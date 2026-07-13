import { NextRequest, NextResponse } from 'next/server';
import type { FilterQuery } from 'mongoose';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Product, { IProduct } from '@/models/Products';
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/admin-jwt';

function canManageProducts(decoded: { role: string; permissions: string[] }) {
  return decoded.role === 'super_admin' || decoded.permissions?.includes('manage_products');
}

export async function GET(request: NextRequest) {
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

    if (!canManageProducts(decoded)) {
      return NextResponse.json(
        { success: false, message: 'Missing manage_products permission' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const status = searchParams.get('status'); // published | draft | suspended
    const search = searchParams.get('search')?.trim();
    const vendorId = searchParams.get('vendorId')?.trim();

    const filter: FilterQuery<IProduct> = {};
    if (vendorId) {
      if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        return NextResponse.json({ success: false, message: 'Invalid vendorId' }, { status: 400 });
      }
      filter.vendorId = new mongoose.Types.ObjectId(vendorId);
    }
    if (status === 'published') {
      filter.isPublished = true;
      filter.isSuspended = false;
    } else if (status === 'draft') {
      filter.isPublished = false;
      filter.isSuspended = false;
    } else if (status === 'suspended') {
      filter.isSuspended = true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [products, total, stats] = await Promise.all([
      Product.find(filter)
        .populate('vendorId', 'seller_name shopName email')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          'name slug images basePrice profitMargin discount finalPrice stock category brand isPublished isSuspended suspensionReason isFeatured vendorId createdAt updatedAt'
        )
        .lean(),
      Product.countDocuments(filter),
      Promise.all([
        Product.countDocuments(vendorId ? { vendorId: filter.vendorId } : {}),
        Product.countDocuments({
          ...(vendorId ? { vendorId: filter.vendorId } : {}),
          isPublished: true,
          isSuspended: false,
        }),
        Product.countDocuments({
          ...(vendorId ? { vendorId: filter.vendorId } : {}),
          isPublished: false,
          isSuspended: false,
        }),
        Product.countDocuments({
          ...(vendorId ? { vendorId: filter.vendorId } : {}),
          isSuspended: true,
        }),
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.max(1, Math.ceil(total / limit)),
        },
        stats: {
          total: stats[0],
          published: stats[1],
          draft: stats[2],
          suspended: stats[3],
        },
      },
    });
  } catch (error) {
    console.error('Admin products list error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
