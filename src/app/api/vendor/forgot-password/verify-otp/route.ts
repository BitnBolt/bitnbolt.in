import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Check if OTP matches and is not expired
    if (!vendor.resetPasswordOTP || vendor.resetPasswordOTP !== otp) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    if (!vendor.resetPasswordOTPExpiry || vendor.resetPasswordOTPExpiry < new Date()) {
      return NextResponse.json(
        { success: false, message: 'OTP has expired' },
        { status: 400 }
      );
    }

    // OTP is valid, return success (don't clear OTP yet, it will be cleared when password is reset)
    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully. You can now reset your password.'
    });

  } catch (error) {
    console.error('Error verifying password reset OTP:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
} 