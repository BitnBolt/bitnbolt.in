import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Admin from '@/models/Admin';
import { verifyAdminToken, extractTokenFromHeader } from '@/lib/admin-jwt';

export async function DELETE(request: NextRequest) {
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
        { success: false, message: 'Only super admins can delete admin accounts' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');

    if (!adminId) {
      return NextResponse.json(
        { success: false, message: 'Admin ID is required' },
        { status: 400 }
      );
    }

    // Prevent super admin from deleting themselves
    if (adminId === decoded.adminId) {
      return NextResponse.json(
        { success: false, message: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    // Find the admin to delete
    const adminToDelete = await Admin.findById(adminId);
    if (!adminToDelete) {
      return NextResponse.json(
        { success: false, message: 'Admin not found' },
        { status: 404 }
      );
    }

    // Delete the admin
    await Admin.findByIdAndDelete(adminId);

    return NextResponse.json({
      success: true,
      message: 'Admin deleted successfully'
    });

  } catch (error) {
    console.error('Admin delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 