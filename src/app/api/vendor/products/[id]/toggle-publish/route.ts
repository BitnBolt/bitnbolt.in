import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyVendorToken, extractTokenFromHeader } from "@/lib/vendor-jwt";
import Product from "@/models/Products";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const vendorData = verifyVendorToken(token);
    if (!vendorData) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    const product = await Product.findOne({
      _id: id,
      vendorId: vendorData.vendorId,
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.isSuspended) {
      return NextResponse.json(
        { error: "Cannot modify a suspended product" },
        { status: 403 }
      );
    }

    product.isPublished = !product.isPublished;
    await product.save();

    return NextResponse.json({
      success: true,
      message: `Product ${product.isPublished ? 'published' : 'unpublished'} successfully`,
      isPublished: product.isPublished,
    });
  } catch (error) {
    console.error("Error toggling product publish status:", error);
    return NextResponse.json(
      { error: "Failed to toggle product status" },
      { status: 500 }
    );
  }
} 