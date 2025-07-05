import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const vendor = await Vendor.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpiry: { $gt: new Date() }
    });

    if (!vendor) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Mark email as verified and remove token
    vendor.emailVerified = true;
    vendor.emailVerificationToken = undefined;
    vendor.emailVerificationTokenExpiry = undefined;
    await vendor.save();

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify email' },
      { status: 500 }
    );
  }
} 