import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';
import { verifyVendorToken, extractTokenFromHeader } from '@/lib/vendor-jwt';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export async function PUT(request: NextRequest) {
  try {
    // Extract and verify token
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }
    const tokenPayload = verifyVendorToken(token);
    if (!tokenPayload) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }

    // Parse multipart form
    const formData = await request.formData();
    const file = formData.get('image');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, message: 'No image file provided' }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await connectDB();
    const vendor = await Vendor.findById(tokenPayload.vendorId);
    if (!vendor) {
      return NextResponse.json({ success: false, message: 'Vendor not found' }, { status: 404 });
    }

    // Remove previous image from Cloudinary if exists
    if (vendor.profileImage) {
      // Extract publicId from URL
      const match = vendor.profileImage.match(/\/vendor-profiles\/([^\.\/]+)\./);
      if (match && match[1]) {
        const publicId = `vendor-profiles/${match[1]}`;
        await deleteFromCloudinary(publicId);
      }
    }

    // Upload new image
    const result = await uploadToCloudinary(buffer, 'vendor-profiles') as CloudinaryUploadResult;
    vendor.profileImage = result.secure_url;
    vendor.updatedAt = new Date();
    await vendor.save();

    return NextResponse.json({
      success: true,
      message: 'Profile image updated',
      data: { profileImage: vendor.profileImage },
    });
  } catch (error) {
    console.error('Profile image upload error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Extract and verify token
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }
    const tokenPayload = verifyVendorToken(token);
    if (!tokenPayload) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }
    await connectDB();
    const vendor = await Vendor.findById(tokenPayload.vendorId);
    if (!vendor) {
      return NextResponse.json({ success: false, message: 'Vendor not found' }, { status: 404 });
    }
    if (vendor.profileImage) {
      // Extract publicId from URL
      const match = vendor.profileImage.match(/\/vendor-profiles\/([^\.\/]+)\./);
      if (match && match[1]) {
        const publicId = `vendor-profiles/${match[1]}`;
        await deleteFromCloudinary(publicId);
      }
      vendor.profileImage = undefined;
      vendor.updatedAt = new Date();
      await vendor.save();
    }
    return NextResponse.json({ success: true, message: 'Profile image removed' });
  } catch (error) {
    console.error('Profile image delete error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}