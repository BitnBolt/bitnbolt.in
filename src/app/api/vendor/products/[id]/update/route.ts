import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Products';
import { verifyVendorToken, extractTokenFromHeader } from '@/lib/vendor-jwt';
import slugify from 'slugify';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Check if product exists and belongs to the vendor
    const existingProduct = await Product.findOne({
      _id: params.id,
      vendorId: tokenPayload.vendorId,
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Generate new slug if name changed
    if (productData.name !== existingProduct.name) {
      let slug = slugify(productData.name, { lower: true });
      let slugExists = await Product.exists({ slug, _id: { $ne: params.id } });
      let counter = 1;
      
      // If slug exists, append counter until unique
      while (slugExists) {
        slug = `${slugify(productData.name, { lower: true })}-${counter}`;
        slugExists = await Product.exists({ slug, _id: { $ne: params.id } });
        counter++;
      }
      productData.slug = slug;
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      {
        ...productData,
        vendorId: tokenPayload.vendorId,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });

  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 