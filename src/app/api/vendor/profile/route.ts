import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';
import { verifyVendorToken, extractTokenFromHeader } from '@/lib/vendor-jwt';

export async function PUT(request: NextRequest) {
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

    const { seller_name, shopName, gstNumber } = await request.json();

    // Validate required fields
    if (!seller_name || !shopName) {
      return NextResponse.json(
        { success: false, message: 'Seller name and shop name are required' },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (seller_name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Seller name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    if (shopName.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Shop name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Validate GST number format (optional field)
    if (gstNumber && gstNumber.trim()) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(gstNumber.trim())) {
        return NextResponse.json(
          { success: false, message: 'Invalid GST number format' },
          { status: 400 }
        );
      }
    }

    await connectDB();

    // Find and update vendor
    const vendor = await Vendor.findById(tokenPayload.vendorId);
    if (!vendor) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Update vendor fields
    vendor.seller_name = seller_name.trim();
    vendor.shopName = shopName.trim();
    vendor.gstNumber = gstNumber ? gstNumber.trim() : undefined;
    vendor.updatedAt = new Date();

    await vendor.save();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        vendor: {
          id: vendor._id,
          email: vendor.email,
          seller_name: vendor.seller_name,
          phone: vendor.phone,
          shopName: vendor.shopName,
          gstNumber: vendor.gstNumber,
          profileImage: vendor.profileImage,
          pickupAddresses: vendor.pickupAddresses,
          emailVerified: vendor.emailVerified,
          phoneVerified: vendor.phoneVerified,
          approved: vendor.approved,
          createdAt: vendor.createdAt,
          updatedAt: vendor.updatedAt,
        },
      },
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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

    await connectDB();

    const vendor = await Vendor.findById(tokenPayload.vendorId);
    if (!vendor) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        vendor: {
          id: vendor._id,
          email: vendor.email,
          seller_name: vendor.seller_name,
          phone: vendor.phone,
          shopName: vendor.shopName,
          gstNumber: vendor.gstNumber,
          profileImage: vendor.profileImage,
          pickupAddresses: vendor.pickupAddresses,
          emailVerified: vendor.emailVerified,
          phoneVerified: vendor.phoneVerified,
          approved: vendor.approved,
          createdAt: vendor.createdAt,
          updatedAt: vendor.updatedAt,
        },
      },
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 