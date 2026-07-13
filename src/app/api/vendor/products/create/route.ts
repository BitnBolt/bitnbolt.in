import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Products';
import { verifyVendorToken, extractTokenFromHeader } from '@/lib/vendor-jwt';
import slugify from 'slugify';
import { filterKeyValuePairs, filterTextLines } from '@/lib/product-detail';
import { syncProductToAlgolia } from '@/lib/algolia-sync';
import { validatePricingOrThrow } from '@/lib/product-pricing';
import { sanitizeProductForVendor } from '@/lib/vendor-pricing-visibility';

export async function POST(request: NextRequest) {
  try {
    // Extract and verify token
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const tokenPayload = verifyVendorToken(token);
    if (!tokenPayload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const productData = await request.json();

    // Marketplace pricing is admin-only — ignore any attempted client values
    delete productData.profitMargin;
    delete productData.discount;
    delete productData.finalPrice;
    delete productData.isFeatured;
    delete productData.isSuspended;
    delete productData.suspensionReason;
    delete productData.vendorId;
    delete productData.stats;
    delete productData.rating;
    if (!productData.name?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Product name is required' },
        { status: 400 }
      );
    }

    if (!productData.description?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Product description is required' },
        { status: 400 }
      );
    }

    if (!productData.category?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Product category is required' },
        { status: 400 }
      );
    }

    if (!productData.brand?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Product brand is required' },
        { status: 400 }
      );
    }

    if (!productData.basePrice || productData.basePrice <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid base price is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(productData.images) || productData.images.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one product image is required' },
        { status: 400 }
      );
    }

    // Validate shipping info
    if (!productData.shippingInfo?.weight || productData.shippingInfo.weight <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid product weight is required' },
        { status: 400 }
      );
    }

    if (!productData.shippingInfo?.dimensions?.length || 
        !productData.shippingInfo?.dimensions?.width || 
        !productData.shippingInfo?.dimensions?.height) {
      return NextResponse.json(
        { success: false, message: 'Product dimensions are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate slug from name
    let slug = slugify(productData.name, { lower: true });
    let slugExists = await Product.exists({ slug });
    let counter = 1;
    
    // If slug exists, append counter until unique
    while (slugExists) {
      slug = `${slugify(productData.name, { lower: true })}-${counter}`;
      slugExists = await Product.exists({ slug });
      counter++;
    }

    // Vendor may only set base price; margin/discount are admin-controlled
    const profitMargin = 80;
    const discount = 0;
    let finalPrice: number;
    try {
      finalPrice = validatePricingOrThrow(Number(productData.basePrice), profitMargin, discount);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: err instanceof Error ? err.message : 'Invalid pricing' },
        { status: 400 }
      );
    }

    const product = new Product({
      ...productData,
      whatsInTheBox: filterTextLines(productData.whatsInTheBox),
      aboutItem: filterTextLines(productData.aboutItem),
      features: filterKeyValuePairs(productData.features),
      specifications: filterKeyValuePairs(productData.specifications),
      slug,
      vendorId: tokenPayload.vendorId,
      profitMargin,
      discount,
      finalPrice,
      isFeatured: false,
      isPublished: false,
      isSuspended: false,
      rating: {
        average: 0,
        count: 0
      },
      stats: {
        views: 0,
        sales: 0
      }
    });

    await product.save();

    // Draft products are not searchable until published
    void syncProductToAlgolia(product);

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: { product: sanitizeProductForVendor(product) }
    });

  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 