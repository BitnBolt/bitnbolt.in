import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
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

    if (vendor.emailVerified) {
      return NextResponse.json(
        { success: false, message: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update vendor with new token
    vendor.emailVerificationToken = emailVerificationToken;
    vendor.emailVerificationTokenExpiry = emailVerificationTokenExpiry;
    await vendor.save();

    // Send verification email
    const verificationLink = `${process.env.NEXT_VENDOR_URL || 'http://localhost:3000'}/vendor/verify-email?token=${emailVerificationToken}`;
    await sendVerificationEmail(email, verificationLink, vendor.seller_name);

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send verification email' },
      { status: 500 }
    );
  }
} 