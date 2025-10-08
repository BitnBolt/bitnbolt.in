import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { trackShiprocketShipment } from '@/lib/shiprocket';

export async function GET(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    const awbCode = searchParams.get('awbCode');

    if (!orderId && !awbCode) {
      return NextResponse.json({ 
        message: 'Order ID or AWB code is required' 
      }, { status: 400 });
    }

    await connectDB();

    // Get order
    let order;
    if (orderId) {
      order = await Order.findOne({ orderId });
    } else if (awbCode) {
      order = await Order.findOne({ 'deliveryDetails.awbCode': awbCode });
    }

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Verify user owns this order (for orderId lookup)
    if (orderId && String(order.userId) !== session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    if (!order.deliveryDetails.awbCode) {
      return NextResponse.json({ 
        message: 'AWB not generated yet' 
      }, { status: 400 });
    }

    // Get tracking details using the service
    const trackingData = await trackShiprocketShipment(order.deliveryDetails.awbCode);

    return NextResponse.json({
      success: true,
      tracking: trackingData,
      orderId: order.orderId,
      awbCode: order.deliveryDetails.awbCode,
      courierName: order.deliveryDetails.courierName,
      currentStatus: trackingData.tracking_data.shipment_track[0]?.current_status || 'Unknown',
      trackUrl: trackingData.tracking_data.track_url,
      etd: trackingData.tracking_data.etd,
    });

  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ 
      message: 'Failed to get tracking details' 
    }, { status: 500 });
  }
}

