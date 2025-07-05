import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';
import { generateVendorToken } from '@/lib/vendor-jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, seller_name, password, phone } = await request.json();

    // Validate required fields
    if (!email || !seller_name || !password || !phone) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
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

    // Validate phone format (basic validation for Indian numbers)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingVendor) {
      if (existingVendor.email === email) {
        return NextResponse.json(
          { success: false, message: 'Email already registered' },
          { status: 400 }
        );
      }
      if (existingVendor.phone === phone) {
        return NextResponse.json(
          { success: false, message: 'Phone number already registered' },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create vendor (no phone OTP fields)
    const vendor = new Vendor({
      email,
      seller_name,
      password: hashedPassword,
      phone,
      shopName: `${seller_name}'s Shop`, // Default shop name
      emailVerificationToken,
      emailVerificationTokenExpiry,
      pickupAddresses: [], // Empty array initially
      approved: false,
      emailVerified: false,
      phoneVerified: false,
    });

    await vendor.save();

    // Send email verification
    const verificationLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/vendor/verify-email?token=${emailVerificationToken}`;
    await sendVerificationEmail(email, verificationLink, seller_name);

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
      message: 'Vendor registered successfully',
      data: {
        vendor: {
          id: vendor._id,
          email: vendor.email,
          seller_name: vendor.seller_name,
          phone: vendor.phone,
          emailVerified: vendor.emailVerified,
          phoneVerified: vendor.phoneVerified,
          approved: vendor.approved,
        },
        token,
      },
    });

  } catch (error) {
    console.error('Vendor signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 