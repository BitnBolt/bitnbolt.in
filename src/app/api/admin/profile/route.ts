import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Admin from '@/models/Admin';
import { verifyAdminToken, extractTokenFromHeader } from '@/lib/admin-jwt';
import bcrypt from 'bcryptjs';
import { uploadToCloudinary } from '@/lib/cloudinary';
import type { UploadApiResponse } from 'cloudinary';

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

    // Find admin
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
    console.error('Admin profile GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const { admin_name, currentPassword, newPassword, profileImage } = await request.json();

    // Check if this is a password change request
    if (currentPassword && newPassword) {
      // Password change logic
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { success: false, message: 'Current password and new password are required' },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: 'New password must be at least 6 characters long' },
          { status: 400 }
        );
      }

      await connectDB();

      // Find admin
      const admin = await Admin.findById(decoded.adminId);
      if (!admin || !admin.isActive) {
        return NextResponse.json(
          { success: false, message: 'Admin not found or inactive' },
          { status: 401 }
        );
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { success: false, message: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      admin.password = hashedNewPassword;
      await admin.save();

      return NextResponse.json({
        success: true,
        message: 'Password changed successfully',
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
    }

    // Profile update logic
    await connectDB();

    // Find admin
    const admin = await Admin.findById(decoded.adminId);
    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { success: false, message: 'Admin not found or inactive' },
        { status: 401 }
      );
    }

    // Update admin profile fields
    if (admin_name) {
      admin.admin_name = admin_name;
    }

    // Handle profile image upload if provided
    if (profileImage && profileImage.startsWith('data:image')) {
      try {
        const uploadResult = await uploadToCloudinary(profileImage, 'admin-profiles') as UploadApiResponse;
        admin.profileImage = uploadResult.secure_url;
      } catch (error) {
        console.error('Profile image upload error:', error);
        return NextResponse.json(
          { success: false, message: 'Failed to upload profile image' },
          { status: 500 }
        );
      }
    }

    await admin.save();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
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
    console.error('Admin profile PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 