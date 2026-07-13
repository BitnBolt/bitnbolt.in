import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Products';
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/admin-jwt';
import { syncProductToAlgolia } from '@/lib/algolia-sync';

function canManageProducts(decoded: { role: string; permissions: string[] }) {
  return decoded.role === 'super_admin' || decoded.permissions?.includes('manage_products');
}

export async function PUT(request: NextRequest) {
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

    const { productId, suspended, reason } = await request.json();

    if (!productId || typeof suspended !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Product ID and suspension status are required' },
        { status: 400 }
      );
    }

    if (suspended && !String(reason || '').trim()) {
      return NextResponse.json(
        { success: false, message: 'Suspension reason is required' },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    product.isSuspended = suspended;
    product.suspensionReason = suspended ? String(reason).trim() : undefined;

    await product.save();
    void syncProductToAlgolia(product);

    return NextResponse.json({
      success: true,
      message: `Product ${suspended ? 'suspended' : 'unsuspended'} successfully`,
      data: { product },
    });
  } catch (error) {
    console.error('Admin product suspend error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
