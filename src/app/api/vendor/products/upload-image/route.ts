import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Products';
import { verifyVendorToken, extractTokenFromHeader } from '@/lib/vendor-jwt';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export async function POST(request: NextRequest) {
  try {
    // Extract and verify token
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }
    const tokenPayload = verifyVendorToken(token);
    if (!tokenPayload) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }

    // Parse multipart form
    const formData = await request.formData();
    const file = formData.get('image');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, message: 'No image file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get optional parameters
    const productId = formData.get('productId');
    const imageIndex = formData.get('imageIndex');

    // Upload new image to Cloudinary
    const result = await uploadToCloudinary(buffer, 'products') as CloudinaryUploadResult;
    
    // If productId is provided, update the product
    if (productId && typeof productId === 'string') {
      await connectDB();
      const product = await Product.findOne({ _id: productId, vendorId: tokenPayload.vendorId });
      if (!product) {
        return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
      }

      // If updating a specific image, delete the old one first
      if (imageIndex !== null && typeof imageIndex === 'string') {
        const idx = parseInt(imageIndex);
        if (!isNaN(idx) && product.images[idx]) {
          // Extract publicId from URL
          const match = product.images[idx].match(/\/products\/([^\.\/]+)\./);
          if (match && match[1]) {
            const publicId = `products/${match[1]}`;
            await deleteFromCloudinary(publicId);
          }
          
          // Update the image at the specified index
          product.images[idx] = result.secure_url;
        }
      } else {
        // Add new image to array
        if (!product.images) {
          product.images = [];
        }
        product.images.push(result.secure_url);
      }

      product.updatedAt = new Date();
      await product.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      data: { imageUrl: result.secure_url },
    });
  } catch (error) {
    console.error('Product image upload error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Extract and verify token
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }
    const tokenPayload = verifyVendorToken(token);
    if (!tokenPayload) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const imageIndex = searchParams.get('imageIndex');

    if (!productId || !imageIndex) {
      return NextResponse.json({ success: false, message: 'Product ID and image index are required' }, { status: 400 });
    }

    await connectDB();
    const product = await Product.findOne({ _id: productId, vendorId: tokenPayload.vendorId });
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    const idx = parseInt(imageIndex);
    if (isNaN(idx) || !product.images[idx]) {
      return NextResponse.json({ success: false, message: 'Invalid image index' }, { status: 400 });
    }

    // Delete from Cloudinary
    const match = product.images[idx].match(/\/products\/([^\.\/]+)\./);
    if (match && match[1]) {
      const publicId = `products/${match[1]}`;
      await deleteFromCloudinary(publicId);
    }

    // Remove from product images array
    product.images.splice(idx, 1);
    product.updatedAt = new Date();
    await product.save();

    return NextResponse.json({
      success: true,
      message: 'Product image deleted',
    });
  } catch (error) {
    console.error('Product image delete error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 