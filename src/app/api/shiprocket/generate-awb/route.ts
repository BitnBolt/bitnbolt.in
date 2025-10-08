import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { generateShiprocketAWB } from '@/lib/shiprocket';

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, courierId } = body;

    if (!orderId || !courierId) {
      return NextResponse.json({ 
        message: 'Order ID and Courier ID are required' 
      }, { status: 400 });
    }

    await connectDB();

    // Get order
    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    if (!order.deliveryDetails.shiprocketOrderId) {
      return NextResponse.json({ 
        message: 'Shipment not created yet' 
      }, { status: 400 });
    }

    // Generate AWB using the service
    const awbResult = await generateShiprocketAWB(
      order.deliveryDetails.shiprocketOrderId!,
      courierId
    );

    // Update order with AWB details
    order.deliveryDetails.awbCode = awbResult.response.data.awb_code;
    order.deliveryDetails.courierCompanyId = courierId;
    order.deliveryDetails.shiprocketShipmentId = awbResult.response.data.shipment_id;
    order.status = 'shipped';
    order.statusHistory.push({
      status: 'shipped',
      comment: `AWB generated: ${awbResult.response.data.awb_code}`,
      timestamp: new Date(),
    });

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'AWB generated successfully',
      awbCode: awbResult.response.data.awb_code,
      shipmentId: awbResult.response.data.shipment_id,
      orderId: order.orderId,
    });

  } catch (error) {
    console.error('Generate AWB error:', error);
    return NextResponse.json({ 
      message: 'Failed to generate AWB' 
    }, { status: 500 });
  }
}

