import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';
import { generateOTP } from '@/lib/fast2sms';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
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

    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found with this email' },
        { status: 404 }
      );
    }

    // Generate reset password OTP
    const resetPasswordOTP = generateOTP();
    const resetPasswordOTPExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update vendor with reset OTP
    vendor.resetPasswordOTP = resetPasswordOTP;
    vendor.resetPasswordOTPExpiry = resetPasswordOTPExpiry;
    await vendor.save();

    // Send OTP via email
    const otpResult = await sendOTPEmail(email, resetPasswordOTP, vendor.seller_name);

    if (!otpResult.success) {
      return NextResponse.json(
        { success: false, message: 'Failed to send OTP email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset OTP sent successfully to your email'
    });

  } catch (error) {
    console.error('Error sending password reset OTP:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send password reset OTP' },
      { status: 500 }
    );
  }
} 