import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Products';
import Vendor from '@/models/Vendor';
import User from '@/models/User';
import { createShiprocketShipment, getShiprocketPickupLocation } from '@/lib/shiprocket';
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
    console.log('Creating Shiprocket shipment for order:', orderId);

    await connectDB();

    // Get vendor by email from token
    const vendor = await Vendor.findOne({ email: decoded.email });
    if (!vendor) {
      console.error('Vendor not found for email:', decoded.email);
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }
    console.log('Found vendor:', vendor.businessName);

    // Get order with populated data
    const order = await Order.findOne({ orderId })
      .populate('items.productId', 'name weight shippingInfo')
      .populate('userId', 'email')
      .populate('items.vendorId', 'businessName pickupAddress');

    if (!order) {
      console.error('Order not found:', orderId);
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    console.log('Found order with status:', order.status);

    // Check if order has items from this vendor
    const vendorItems = order.items.filter((item: any) => 
      String(item.vendorId._id) === String(vendor._id)
    );

    if (vendorItems.length === 0) {
      console.error('No items found for vendor in order. Vendor ID:', vendor._id, 'Order items:', order.items.map((item: any) => ({ vendorId: item.vendorId._id, productName: item.productId?.name })));
      return NextResponse.json({ 
        message: 'No items found for this vendor in this order' 
      }, { status: 404 });
    }
    console.log('Found vendor items:', vendorItems.length);

    // Check if order is ready for shipping
    if (order.status !== 'confirmed' && order.status !== 'processing') {
      return NextResponse.json({ 
        message: 'Order must be confirmed before creating shipment' 
      }, { status: 400 });
    }

    // Check if Shiprocket shipment already exists for this vendor
    const existingVendorShipment = order.deliveryDetails.vendorShipments?.find(
      (shipment: any) => String(shipment.vendorId) === String(vendor._id)
    );
    
    if (existingVendorShipment) {
      return NextResponse.json({ 
        message: 'Shiprocket shipment already created for this vendor' 
      }, { status: 400 });
    }

    // Use vendor ID as pickup location for unique identification
    const pickupLocation = String(vendor._id);

    // Prepare shipment data according to Shiprocket API format
    const shipmentData = {
      order_id: order.orderId,
      order_date: order.createdAt.toISOString().split('T')[0] + ' ' + 
                  order.createdAt.toTimeString().split(' ')[0].substring(0, 5),
      pickup_location: pickupLocation,
      comment: `Vendor: ${vendor.businessName}`,
      billing_customer_name: order.billingAddress.fullName.split(' ')[0] || order.billingAddress.fullName,
      billing_last_name: order.billingAddress.fullName.split(' ').slice(1).join(' ') || '',
      billing_address: order.billingAddress.addressLine1,
      billing_address_2: order.billingAddress.addressLine2 || '',
      billing_city: order.billingAddress.city,
      billing_pincode: parseInt(order.billingAddress.pincode) || 110001,
      billing_state: order.billingAddress.state,
      billing_country: 'India',
      billing_email: (order.userId as any).email || '',
      billing_phone: parseInt(order.billingAddress.phoneNumber.replace(/\D/g, '')) || 9999999999,
      shipping_is_billing: true,
      shipping_customer_name: '',
      shipping_last_name: '',
      shipping_address: '',
      shipping_address_2: '',
      shipping_city: '',
      shipping_pincode: '',
      shipping_country: '',
      shipping_state: '',
      shipping_email: '',
      shipping_phone: '',
      order_items: vendorItems.map((item: any) => ({
        name: item.productId.name,
        sku: String(item.productId._id),
        units: item.quantity,
        selling_price: item.finalPrice,
        discount: item.discount || '',
        tax: '',
        hsn: 441122, // Default HSN code, should be configurable
      })),
      payment_method: order.paymentDetails.method === 'cod' ? 'COD' : 'Prepaid',
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: vendorItems.reduce((sum: number, item: any) => sum + (item.finalPrice * item.quantity), 0),
      length: 10,
      breadth: 15,
      height: 20,
      weight: vendorItems.reduce((total: number, item: any) => {
        return total + ((item.productId.shippingInfo?.weight || 100) * item.quantity) / 1000; // Convert to kg
      }, 0),
    };

    // Validate shipment data before sending to Shiprocket
    if (!shipmentData.billing_phone || shipmentData.billing_phone <= 0) {
      console.error('Invalid billing phone:', shipmentData.billing_phone);
      return NextResponse.json({ 
        message: 'Invalid billing phone number' 
      }, { status: 400 });
    }

    if (!shipmentData.billing_pincode || shipmentData.billing_pincode <= 0) {
      console.error('Invalid billing pincode:', shipmentData.billing_pincode);
      return NextResponse.json({ 
        message: 'Invalid billing pincode' 
      }, { status: 400 });
    }

    if (!shipmentData.order_items || shipmentData.order_items.length === 0) {
      console.error('No order items found');
      return NextResponse.json({ 
        message: 'No order items found' 
      }, { status: 400 });
    }

    // Check Shiprocket environment variables
    if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
      console.error('Shiprocket credentials not configured');
      return NextResponse.json({ 
        message: 'Shiprocket service not configured' 
      }, { status: 500 });
    }

    // Create shipment in Shiprocket
    console.log('Creating Shiprocket shipment with data:', JSON.stringify(shipmentData, null, 2));
    const shipmentResult = await createShiprocketShipment(shipmentData);
    console.log('Shiprocket shipment result:', shipmentResult);

    // Initialize vendorShipments array if it doesn't exist
    if (!order.deliveryDetails.vendorShipments) {
      order.deliveryDetails.vendorShipments = [];
    }

    // Add vendor shipment to the array
    const vendorShipment = {
      vendorId: vendor._id,
      shiprocketOrderId: shipmentResult.order_id.toString(),
      shiprocketShipmentId: shipmentResult.shipment_id.toString(),
      shiprocketStatus: 'created' as const,
      shiprocketResponse: shipmentResult,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    order.deliveryDetails.vendorShipments.push(vendorShipment);

    // Update legacy fields for backward compatibility (use first vendor's data)
    if (!order.deliveryDetails.shiprocketOrderId) {
      order.deliveryDetails.shiprocketOrderId = shipmentResult.order_id.toString();
      order.deliveryDetails.shiprocketShipmentId = shipmentResult.shipment_id.toString();
      order.deliveryDetails.provider = 'Shiprocket';
      order.deliveryDetails.shiprocketStatus = 'created';
    }
    
    // Update order status to processing if not already
    if (order.status === 'confirmed') {
      order.status = 'processing';
      order.statusHistory.push({
        status: 'processing',
        comment: `Shipment created in Shiprocket by vendor ${vendor.businessName}`,
        updatedBy: vendor.businessName,
        timestamp: new Date(),
      });
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Shiprocket shipment created successfully',
      shipmentId: shipmentResult.shipment_id,
      orderId: shipmentResult.order_id,
      status: shipmentResult.status,
      awbCode: shipmentResult.awb_code,
    });

  } catch (error) {
    console.error('Create Shiprocket shipment error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      orderId: params?.orderId,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json({ 
      message: 'Failed to create Shiprocket shipment',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}
