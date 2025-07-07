import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';
import { generateAdminToken } from '@/lib/admin-jwt';

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

    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if admin is active
    if (!admin.isActive) {
      return NextResponse.json(
        { success: false, message: 'Your account has been deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const tokenPayload = {
      adminId: admin._id.toString(),
      email: admin.email,
      admin_name: admin.admin_name,
      role: admin.role,
      permissions: admin.permissions,
      isActive: admin.isActive,
    };

    const token = generateAdminToken(tokenPayload);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          admin_name: admin.admin_name,
          role: admin.role,
          permissions: admin.permissions,
          profileImage: admin.profileImage,
          isActive: admin.isActive,
          lastLogin: admin.lastLogin,
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt
        },
        token,
      },
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 