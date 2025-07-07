import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Admin from '@/models/Admin';
import { verifyAdminToken, extractTokenFromHeader } from '@/lib/admin-jwt';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyAdminToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if the current admin is a super_admin
    await connectDB();
    const currentAdmin = await Admin.findById(decoded.adminId);
    
    if (!currentAdmin || !currentAdmin.isActive || currentAdmin.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'Only super admins can create new admin accounts' },
        { status: 403 }
      );
    }

    const { admin_name, email, role, permissions } = await request.json();

    // Validate required fields
    if (!admin_name || !email || !role) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['super_admin', 'admin'].includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role. Must be super_admin or admin' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin with this email already exists' },
        { status: 400 }
      );
    }

    // Generate a random password
    const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    // Create new admin
    const newAdmin = new Admin({
      admin_name,
      email,
      password: hashedPassword,
      role,
      permissions: permissions || [],
      isActive: true,
    });

    await newAdmin.save();

    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      data: {
        admin: {
          id: newAdmin._id,
          admin_name: newAdmin.admin_name,
          email: newAdmin.email,
          role: newAdmin.role,
          permissions: newAdmin.permissions,
          isActive: newAdmin.isActive,
        },
        temporaryPassword: randomPassword, // This should be sent via email in production
      }
    });

  } catch (error) {
    console.error('Admin creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 