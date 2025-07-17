import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Products';
import { verifyVendorToken, extractTokenFromHeader } from '@/lib/vendor-jwt';
import slugify from 'slugify';

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

    // Basic validation
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

    if (!Array.isArray(productData.whatsInTheBox) || !productData.whatsInTheBox.some((item: string) => item.trim())) {
      return NextResponse.json(
        { success: false, message: 'What\'s in the box is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(productData.aboutItem) || !productData.aboutItem.some((item: string) => item.trim())) {
      return NextResponse.json(
        { success: false, message: 'About this item is required' },
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

    // Create product with default values
    const product = new Product({
      ...productData,
      slug,
      vendorId: tokenPayload.vendorId,
      profitMargin: 80, // Default 80% markup
      discount: 0,      // Default no discount
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

    // Calculate final price
    const priceWithMargin = product.basePrice * (1 + product.profitMargin / 100);
    product.finalPrice = priceWithMargin * (1 - product.discount / 100);

    await product.save();

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });

  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 