import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';
import { verifyAdminToken } from '@/lib/admin-jwt';
import { notifyAsync, reportSystemErrorAsync } from '@/lib/telegram-notify';

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

    const { vendorId, approved, reason } = await request.json();

    if (!vendorId || typeof approved !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Vendor ID and approval status are required' },
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

    vendor.approved = approved;
    vendor.updatedAt = new Date();
    await vendor.save();

    notifyAsync({
      domain: 'vendors',
      event: approved ? 'vendor.approved' : 'vendor.rejected',
      title: approved ? 'Vendor approved' : 'Vendor rejected',
      body: `${vendor.shopName || vendor.email || vendorId} was ${approved ? 'approved' : 'rejected'}${reason ? `: ${reason}` : ''}`,
      severity: approved ? 'info' : 'warning',
      meta: { vendorId, approved, reason: reason || null },
    });

    return NextResponse.json({
      success: true,
      message: `Vendor ${approved ? 'approved' : 'rejected'} successfully`,
      data: { vendor }
    });

  } catch (error) {
    console.error('Error updating vendor approval:', error);
    reportSystemErrorAsync({
      event: 'api.admin.vendors.approve',
      title: 'Vendor approval failed',
      body: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 