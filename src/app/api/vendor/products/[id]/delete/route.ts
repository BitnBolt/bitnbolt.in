import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyVendorToken, extractTokenFromHeader } from "@/lib/vendor-jwt";
import Product from "@/models/Products";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const product = await Product.findOne({
      _id: params.id,
      vendorId: vendorData.vendorId,
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    await Product.deleteOne({ _id: params.id });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 