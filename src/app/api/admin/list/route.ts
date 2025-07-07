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

    // Check if the current admin exists and is active
    const currentAdmin = await Admin.findById(decoded.adminId);
    if (!currentAdmin || !currentAdmin.isActive) {
      return NextResponse.json(
        { success: false, message: 'Admin not found or inactive' },
        { status: 401 }
      );
    }

    // Fetch all admins (excluding password field)
    const admins = await Admin.find({}, {
      password: 0, // Exclude password field
      resetPasswordToken: 0,
      resetPasswordTokenExpiry: 0
    }).sort({ createdAt: -1 });

    // Calculate stats
    const totalAdmins = admins.length;
    const activeAdmins = admins.filter(admin => admin.isActive).length;
    const superAdmins = admins.filter(admin => admin.role === 'super_admin').length;

    return NextResponse.json({
      success: true,
      data: {
        admins: admins.map(admin => ({
          id: admin._id,
          admin_name: admin.admin_name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
          isActive: admin.isActive,
          profileImage: admin.profileImage,
          lastLogin: admin.lastLogin,
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt,
        })),
        stats: {
          total: totalAdmins,
          active: activeAdmins,
          superAdmins: superAdmins,
        }
      }
    });

  } catch (error) {
    console.error('Admin list error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 