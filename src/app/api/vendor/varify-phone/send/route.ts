import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';
import { sendOTP, generateOTP } from '@/lib/fast2sms';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone format (basic validation for Indian numbers)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format' },
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

    // Generate new OTP
    const phoneVerificationOTP = generateOTP();
    const phoneVerificationOTPExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update vendor with new OTP
    vendor.phoneVerificationOTP = phoneVerificationOTP;
    vendor.phoneVerificationOTPExpiry = phoneVerificationOTPExpiry;
    await vendor.save();

    // Send OTP via Fast2SMS
    const otpResult = await sendOTP(phone, phoneVerificationOTP);

    if (!otpResult.success) {
      return NextResponse.json(
        { success: false, message: otpResult.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your phone number'
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send OTP' },
      { status: 500 }
    );
  }
} 