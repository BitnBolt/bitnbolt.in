import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Vendor from '@/models/Vendor';
import { generateShiprocketAWB } from '@/lib/shiprocket';
import jwt from 'jsonwebtoken';

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { orderId } = params;
    const body = await req.json();
    const { courierId } = body;

    if (!courierId) {
      return NextResponse.json({ 
        message: 'Courier ID is required' 
      }, { status: 400 });
    }

    await connectDB();

    // Get vendor by email from token
    const vendor = await Vendor.findOne({ email: decoded.email });
    if (!vendor) {
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }

    // Get order with populated data
    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Check if order has items from this vendor
    const hasVendorItems = order.items.some((item: any) => 
      String(item.vendorId) === String(vendor._id)
    );

    if (!hasVendorItems) {
      return NextResponse.json({ 
        message: 'No items found for this vendor in this order' 
      }, { status: 404 });
    }

    // Find vendor shipment
    const vendorShipment = order.deliveryDetails.vendorShipments?.find(
      (shipment: any) => String(shipment.vendorId) === String(vendor._id)
    );

    if (!vendorShipment) {
      return NextResponse.json({ 
        message: 'Shiprocket shipment not created yet for this vendor' 
      }, { status: 400 });
    }

    // Check if AWB already exists for this vendor
    if (vendorShipment.awbCode) {
      return NextResponse.json({ 
        message: 'AWB already generated for this vendor' 
      }, { status: 400 });
    }

    // Generate AWB
    const awbResult = await generateShiprocketAWB(
      vendorShipment.shiprocketShipmentId!,
      courierId.toString()
    );

    // Update vendor shipment with AWB details
    vendorShipment.awbCode = awbResult.response.data.awb_code;
    vendorShipment.courierName = awbResult.response.data.courier_name;
    vendorShipment.courierCompanyId = awbResult.response.data.courier_company_id.toString();
    vendorShipment.shiprocketStatus = 'shipped';
    vendorShipment.updatedAt = new Date();

    // Update legacy fields for backward compatibility (use first vendor's AWB)
    if (!order.deliveryDetails.awbCode) {
      order.deliveryDetails.awbCode = awbResult.response.data.awb_code;
      order.deliveryDetails.courierName = awbResult.response.data.courier_name;
      order.deliveryDetails.courierCompanyId = awbResult.response.data.courier_company_id.toString();
      order.deliveryDetails.shiprocketStatus = 'shipped';
    }
    
    // Update order status to shipped
    order.status = 'shipped';
    order.statusHistory.push({
      status: 'shipped',
      comment: `AWB generated and order shipped via ${awbResult.response.data.courier_name}`,
      updatedBy: vendor.businessName,
      timestamp: new Date(),
    });

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'AWB generated successfully',
      awbCode: awbResult.response.data.awb_code,
      courierName: awbResult.response.data.courier_name,
      courierCompanyId: awbResult.response.data.courier_company_id,
      pickupScheduledDate: awbResult.response.data.pickup_scheduled_date,
      trackUrl: `https://shiprocket.co/tracking/${awbResult.response.data.awb_code}`,
    });

  } catch (error) {
    console.error('Generate AWB error:', error);
    return NextResponse.json({ 
      message: 'Failed to generate AWB',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
