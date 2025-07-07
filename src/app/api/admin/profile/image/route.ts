import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Admin from '@/models/Admin';
import { verifyAdminToken, extractTokenFromHeader } from '@/lib/admin-jwt';
import { uploadToCloudinary } from '@/lib/cloudinary';
import type { UploadApiResponse } from 'cloudinary';

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

    const { imageData } = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { success: false, message: 'Image data is required' },
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

    // Upload image to Cloudinary
    try {
      const uploadResult = await uploadToCloudinary(imageData, 'admin-profiles') as UploadApiResponse;
      
      // Update admin profile image
      admin.profileImage = uploadResult.secure_url;
      await admin.save();

      return NextResponse.json({
        success: true,
        message: 'Profile image updated successfully',
        data: {
          profileImage: uploadResult.secure_url
        }
      });
    } catch (error) {
      console.error('Profile image upload error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to upload profile image' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Admin profile image upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 