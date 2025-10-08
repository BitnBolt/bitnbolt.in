import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Products';
import { verifyVendorToken, extractTokenFromHeader } from '@/lib/vendor-jwt';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    // Find the product to get its images before deletion
    const { id } = await params;
    const product = await Product.findOne({
      _id: id,
      vendorId: tokenPayload.vendorId,
    });

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // Delete all product images from Cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map(async (imageUrl: string) => {
        const match = imageUrl.match(/\/products\/([^\.\/]+)\./);
        if (match && match[1]) {
          const publicId = `products/${match[1]}`;
          try {
            await deleteFromCloudinary(publicId);
          } catch (error) {
            console.error(`Failed to delete image ${publicId} from Cloudinary:`, error);
            // Continue with deletion even if some images fail to delete
          }
        }
      });
      
      await Promise.all(deletePromises);
    }

    // Delete the product from the database
    const { id: id2 } = await params;
    await Product.deleteOne({
      _id: id2,
      vendorId: tokenPayload.vendorId,
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Product delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 