import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';
import bcrypt from 'bcryptjs';
import { generateVendorToken } from '@/lib/vendor-jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find vendor by email
    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if vendor has a password (in case they signed up with OAuth)
    if (!vendor.password) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, vendor.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if vendor is approved (optional - you can remove this if not needed)
    if (!vendor.approved) {
      return NextResponse.json(
        { success: false, message: 'Your account is pending approval. Please contact support.' },
        { status: 403 }
      );
    }

    // Generate JWT token
    const tokenPayload = {
      vendorId: vendor._id.toString(),
      email: vendor.email,
      seller_name: vendor.seller_name,
      phone: vendor.phone,
      emailVerified: vendor.emailVerified,
      phoneVerified: vendor.phoneVerified,
      approved: vendor.approved,
    };

    const token = generateVendorToken(tokenPayload);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        vendor: {
          id: vendor._id,
          email: vendor.email,
          seller_name: vendor.seller_name,
          phone: vendor.phone,
          shopName: vendor.shopName,
          gstNumber: vendor.gstNumber,
          pickupAddresses: vendor.pickupAddresses,
          emailVerified: vendor.emailVerified,
          phoneVerified: vendor.phoneVerified,
          approved: vendor.approved,
          createdAt: vendor.createdAt,
          updatedAt: vendor.updatedAt
        },
        token,
      },
    });

  } catch (error) {
    console.error('Vendor login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 