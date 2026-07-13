import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Products';
import { extractTokenFromHeader, verifyAdminToken } from '@/lib/admin-jwt';
import {
  calculateFinalPrice,
  maxDiscountForMargin,
  priceWithMargin,
  validatePricingOrThrow,
} from '@/lib/product-pricing';
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

    const body = await request.json();
    const { productId, profitMargin, discount, isFeatured } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
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

    if (profitMargin !== undefined) {
      const margin = Number(profitMargin);
      if (Number.isNaN(margin) || margin < 0 || margin > 500) {
        return NextResponse.json(
          { success: false, message: 'Profit margin must be between 0 and 500' },
          { status: 400 }
        );
      }
      product.profitMargin = margin;
    }

    if (discount !== undefined) {
      const disc = Number(discount);
      if (Number.isNaN(disc) || disc < 0 || disc > 100) {
        return NextResponse.json(
          { success: false, message: 'Discount must be between 0 and 100' },
          { status: 400 }
        );
      }
      product.discount = disc;
    }

    if (typeof isFeatured === 'boolean') {
      product.isFeatured = isFeatured;
    }

    try {
      product.finalPrice = validatePricingOrThrow(
        product.basePrice,
        product.profitMargin,
        product.discount
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid pricing';
      return NextResponse.json(
        {
          success: false,
          message,
          data: {
            maxDiscount: maxDiscountForMargin(product.profitMargin),
            preview: {
              marginedPrice: priceWithMargin(product.basePrice, product.profitMargin),
              finalPrice: calculateFinalPrice(
                product.basePrice,
                product.profitMargin,
                product.discount
              ),
            },
          },
        },
        { status: 400 }
      );
    }

    await product.save();
    void syncProductToAlgolia(product);

    return NextResponse.json({
      success: true,
      message: 'Product pricing updated',
      data: {
        product,
        pricing: {
          basePrice: product.basePrice,
          profitMargin: product.profitMargin,
          discount: product.discount,
          marginedPrice: priceWithMargin(product.basePrice, product.profitMargin),
          finalPrice: product.finalPrice,
        },
      },
    });
  } catch (error) {
    console.error('Admin product pricing error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
