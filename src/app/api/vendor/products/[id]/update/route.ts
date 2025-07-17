import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Products';
import { verifyVendorToken, extractTokenFromHeader } from '@/lib/vendor-jwt';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await connectDB();

    // Find the product
    const product = await Product.findOne({
      _id: params.id,
      vendorId: tokenPayload.vendorId,
    });

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();

    // Check for removed images and delete them from Cloudinary
    if (product.images && product.images.length > 0 && body.images) {
      const currentImages = product.images;
      const updatedImages = body.images;
      
      // Find images that were removed
      const removedImages = currentImages.filter((img: string) => !updatedImages.includes(img));
      
      // Delete removed images from Cloudinary
      if (removedImages.length > 0) {
        const deletePromises = removedImages.map(async (imageUrl: string) => {
          const match = imageUrl.match(/\/products\/([^\.\/]+)\./);
          if (match && match[1]) {
            const publicId = `products/${match[1]}`;
            try {
              await deleteFromCloudinary(publicId);
              console.log(`Deleted image ${publicId} from Cloudinary`);
            } catch (error) {
              console.error(`Failed to delete image ${publicId} from Cloudinary:`, error);
              // Continue with update even if some images fail to delete
            }
          }
        });
        
        await Promise.all(deletePromises);
      }
    }

    // Update the product
    const { id } = await params;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { 
        ...body,
        updatedAt: new Date() 
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 