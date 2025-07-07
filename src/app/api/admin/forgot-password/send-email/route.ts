import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Admin from '@/models/Admin';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate required fields
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

    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'No admin found with this email' },
        { status: 404 }
      );
    }

    // Check if admin is active
    if (!admin.isActive) {
      return NextResponse.json(
        { success: false, message: 'Your account has been deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to admin
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordTokenExpiry = resetTokenExpiry;
    await admin.save();

    // Send password reset email
    const resetLink = `${process.env.NEXT_ADMIN_URL || 'http://localhost:3002'}/auth/forgot-password?token=${resetToken}`;
    await sendPasswordResetEmail(email, resetLink, admin.admin_name);

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent successfully',
      data: {
        email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mask email
      }
    });

  } catch (error) {
    console.error('Admin send password reset email error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 