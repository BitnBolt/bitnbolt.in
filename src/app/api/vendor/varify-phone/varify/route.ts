import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const vendor = await Vendor.findOne({ phone });

    if (!vendor) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      );
    }

    if (vendor.phoneVerified) {
      return NextResponse.json(
        { success: false, message: 'Phone is already verified' },
        { status: 400 }
      );
    }

    // Check if OTP matches and is not expired
    if (!vendor.phoneVerificationOTP || vendor.phoneVerificationOTP !== otp) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    if (!vendor.phoneVerificationOTPExpiry || vendor.phoneVerificationOTPExpiry < new Date()) {
      return NextResponse.json(
        { success: false, message: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Mark phone as verified and remove OTP
    vendor.phoneVerified = true;
    vendor.phoneVerificationOTP = undefined;
    vendor.phoneVerificationOTPExpiry = undefined;
    await vendor.save();

    return NextResponse.json({
      success: true,
      message: 'Phone number verified successfully'
    });

  } catch (error) {
    console.error('Error verifying phone:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify phone number' },
      { status: 500 }
    );
  }
} 