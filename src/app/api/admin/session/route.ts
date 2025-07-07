import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Admin from '@/models/Admin';
import { verifyAdminToken, extractTokenFromHeader } from '@/lib/admin-jwt';

export async function GET(request: NextRequest) {
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

    await connectDB();

    // Find admin and check if still active
    const admin = await Admin.findById(decoded.adminId);
    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { success: false, message: 'Admin not found or inactive' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
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
        }
      }
    });

  } catch (error) {
    console.error('Admin session error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 