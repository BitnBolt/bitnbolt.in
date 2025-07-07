import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';
import { verifyAdminToken } from '@/lib/admin-jwt';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyAdminToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const { vendorId, suspended, reason } = await request.json();

    if (!vendorId || typeof suspended !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Vendor ID and suspension status are required' },
        { status: 400 }
      );
    }

    // Find and update vendor
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      );
    }

    vendor.suspended = suspended;
    if (suspended && reason) {
      vendor.suspensionReason = reason;
    } else if (!suspended) {
      vendor.suspensionReason = null;
    }
    vendor.updatedAt = new Date();
    await vendor.save();

    // TODO: Send email notification to vendor about suspension/activation
    // You can implement email notification here

    return NextResponse.json({
      success: true,
      message: `Vendor ${suspended ? 'suspended' : 'activated'} successfully`,
      data: { vendor }
    });

  } catch (error) {
    console.error('Error updating vendor suspension:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 