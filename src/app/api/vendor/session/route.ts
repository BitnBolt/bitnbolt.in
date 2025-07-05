import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';
import { verifyVendorToken, extractTokenFromHeader } from '@/lib/vendor-jwt';

export async function GET(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const tokenPayload = verifyVendorToken(token);

    if (!tokenPayload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get fresh vendor data from database
    const vendor = await Vendor.findById(tokenPayload.vendorId);

    if (!vendor) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Check if vendor is still approved (in case status changed)
    if (!vendor.approved) {
      return NextResponse.json(
        { success: false, message: 'Account is not approved' },
        { status: 403 }
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
    console.error('Vendor session error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 



// Login
// const loginResponse = await fetch('/api/vendor/auth/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email: 'vendor@example.com', password: 'password123' })
//   });
  
//   const { token } = await loginResponse.json();
  
//   // Use token for authenticated requests
//   const sessionResponse = await fetch('/api/vendor/session', {
//     headers: { 'Authorization': `Bearer ${token}` }
//   });