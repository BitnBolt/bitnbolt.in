import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Products';
import { verifyVendorToken, extractTokenFromHeader } from '@/lib/vendor-jwt';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { filterKeyValuePairs, filterTextLines } from '@/lib/product-detail';
import { syncProductToAlgolia } from '@/lib/algolia-sync';
import { validatePricingOrThrow } from '@/lib/product-pricing';

const VENDOR_LOCKED_FIELDS = [
  'profitMargin',
  'discount',
  'finalPrice',
  'isSuspended',
  'suspensionReason',
  'isFeatured',
  'vendorId',
  'stats',
  'rating',
] as const;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const { id } = await params;
    const product = await Product.findOne({
      _id: id,
      vendorId: tokenPayload.vendorId,
    });

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    if (product.isSuspended) {
      return NextResponse.json(
        { success: false, message: 'Suspended products cannot be edited' },
        { status: 403 }
      );
    }

    const body = await request.json();

    for (const field of VENDOR_LOCKED_FIELDS) {
      delete body[field];
    }

    if (body.whatsInTheBox !== undefined) {
      body.whatsInTheBox = filterTextLines(body.whatsInTheBox);
    }
    if (body.aboutItem !== undefined) {
      body.aboutItem = filterTextLines(body.aboutItem);
    }
    if (body.features !== undefined) {
      body.features = filterKeyValuePairs(body.features);
    }
    if (body.specifications !== undefined) {
      body.specifications = filterKeyValuePairs(body.specifications);
    }

    if (product.images && product.images.length > 0 && body.images) {
      const currentImages = product.images;
      const updatedImages = body.images as string[];
      const removedImages = currentImages.filter((img: string) => !updatedImages.includes(img));

      if (removedImages.length > 0) {
        await Promise.all(
          removedImages.map(async (imageUrl: string) => {
            const match = imageUrl.match(/\/products\/([^\.\/]+)\./);
            if (match && match[1]) {
              const publicId = `products/${match[1]}`;
              try {
                await deleteFromCloudinary(publicId);
              } catch (error) {
                console.error(`Failed to delete image ${publicId} from Cloudinary:`, error);
              }
            }
          })
        );
      }
    }

    Object.assign(product, body);

    try {
      product.finalPrice = validatePricingOrThrow(
        product.basePrice,
        product.profitMargin,
        product.discount
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid pricing after base price change';
      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    await product.save();
    void syncProductToAlgolia(product);

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Product update error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
