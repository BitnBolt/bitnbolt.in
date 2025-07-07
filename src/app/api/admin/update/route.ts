import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Admin from '@/models/Admin';
import { verifyAdminToken, extractTokenFromHeader } from '@/lib/admin-jwt';

export async function PUT(request: NextRequest) {
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

    // Check if the current admin is a super_admin
    const currentAdmin = await Admin.findById(decoded.adminId);
    if (!currentAdmin || !currentAdmin.isActive || currentAdmin.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'Only super admins can update admin accounts' },
        { status: 403 }
      );
    }

    const { adminId, admin_name, email, role, permissions, isActive } = await request.json();

    if (!adminId) {
      return NextResponse.json(
        { success: false, message: 'Admin ID is required' },
        { status: 400 }
      );
    }

    // Find the admin to update
    const adminToUpdate = await Admin.findById(adminId);
    if (!adminToUpdate) {
      return NextResponse.json(
        { success: false, message: 'Admin not found' },
        { status: 404 }
      );
    }

    // Prevent super admin from deactivating themselves
    if (adminId === decoded.adminId && isActive === false) {
      return NextResponse.json(
        { success: false, message: 'You cannot deactivate your own account' },
        { status: 400 }
      );
    }

    // Validate role
    if (role && !['super_admin', 'admin'].includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role. Must be super_admin or admin' },
        { status: 400 }
      );
    }

    // Check if email already exists (if changing email)
    if (email && email !== adminToUpdate.email) {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return NextResponse.json(
          { success: false, message: 'Admin with this email already exists' },
          { status: 400 }
        );
      }
    }

    // Update admin fields
    if (admin_name !== undefined) adminToUpdate.admin_name = admin_name;
    if (email !== undefined) adminToUpdate.email = email;
    if (role !== undefined) adminToUpdate.role = role;
    if (permissions !== undefined) adminToUpdate.permissions = permissions;
    if (isActive !== undefined) adminToUpdate.isActive = isActive;

    await adminToUpdate.save();

    return NextResponse.json({
      success: true,
      message: 'Admin updated successfully',
      data: {
        admin: {
          id: adminToUpdate._id,
          admin_name: adminToUpdate.admin_name,
          email: adminToUpdate.email,
          role: adminToUpdate.role,
          permissions: adminToUpdate.permissions,
          isActive: adminToUpdate.isActive,
          profileImage: adminToUpdate.profileImage,
          lastLogin: adminToUpdate.lastLogin,
          createdAt: adminToUpdate.createdAt,
          updatedAt: adminToUpdate.updatedAt,
        }
      }
    });

  } catch (error) {
    console.error('Admin update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 