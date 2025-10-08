import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Vendor from '@/models/Vendor';
import { getShiprocketDocuments, generateShiprocketLabel, generateShiprocketInvoice, generateShiprocketManifest } from '@/lib/shiprocket';
import jwt from 'jsonwebtoken';

export async function GET(
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
    console.log('Getting documents for order:', orderId);

    await connectDB();

    // Get vendor by email from token
    const vendor = await Vendor.findOne({ email: decoded.email });
    if (!vendor) {
      console.error('Vendor not found for email:', decoded.email);
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }
    console.log('Found vendor:', vendor.businessName);

    // Get order
    const order = await Order.findOne({ orderId })
      .populate('items.productId', 'name weight shippingInfo');

    if (!order) {
      console.error('Order not found:', orderId);
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Check if order has items from this vendor
    const vendorItems = order.items.filter((item: any) => 
      String(item.vendorId) === String(vendor._id)
    );

    if (vendorItems.length === 0) {
      console.error('No items found for vendor in order. Vendor ID:', vendor._id);
      return NextResponse.json({ 
        message: 'No items found for this vendor in this order' 
      }, { status: 404 });
    }

    // Find vendor shipment
    const vendorShipment = order.deliveryDetails.vendorShipments?.find(
      (shipment: any) => String(shipment.vendorId) === String(vendor._id)
    );

    if (!vendorShipment) {
      console.error('No vendor shipment found. Vendor ID:', vendor._id);
      return NextResponse.json({ 
        message: 'Shiprocket shipment not created yet for this vendor' 
      }, { status: 400 });
    }

    if (!vendorShipment.shiprocketShipmentId) {
      console.error('No Shiprocket shipment ID found');
      return NextResponse.json({ 
        message: 'Shiprocket shipment ID not found' 
      }, { status: 400 });
    }

    console.log('Getting documents for shipment:', vendorShipment.shiprocketShipmentId);

    try {
      // Get all documents for this shipment
      const documents = await getShiprocketDocuments(vendorShipment.shiprocketShipmentId, vendorShipment.shiprocketOrderId);

      // Prepare response with all available documents
      const response = {
        success: true,
        orderId: order.orderId,
        shipmentId: vendorShipment.shiprocketShipmentId,
        awbCode: vendorShipment.awbCode,
        courierName: vendorShipment.courierName,
        documents: {
          // Shipping Label (to paste on package)
          label: documents.label ? {
            url: documents.label,
            type: 'shipping_label',
            description: 'Shipping label to paste on package',
            required: true
          } : null,
          
          // Invoice (for customer)
          invoice: documents.invoice ? {
            url: documents.invoice,
            type: 'invoice',
            description: 'Invoice for customer',
            required: true
          } : null,
          
          // AWB Code (for tracking)
          awb: documents.awb ? {
            code: documents.awb,
            type: 'awb_code',
            description: 'AWB code for tracking',
            trackUrl: `https://shiprocket.co/tracking/${documents.awb}`,
            required: true
          } : null,

          // Manifest (for courier pickup)
          manifest: documents.manifest ? {
            url: documents.manifest,
            type: 'manifest',
            description: 'Manifest for courier pickup',
            required: false
          } : null,
        },
        
        // Instructions for vendor
        instructions: {
          label: 'Print and paste the shipping label on the package',
          invoice: 'Include the invoice inside the package for the customer',
          awb: 'Use the AWB code for tracking the shipment',
          packaging: 'Ensure proper packaging and secure the label properly'
        }
      };

      // Filter out null documents
      Object.keys(response.documents).forEach(key => {
        if (response.documents[key as keyof typeof response.documents] === null) {
          delete response.documents[key as keyof typeof response.documents];
        }
      });

      console.log('Documents generated successfully:', Object.keys(response.documents));

      return NextResponse.json(response);

    } catch (error) {
      console.error('Failed to get documents:', error);
      return NextResponse.json({ 
        message: 'Failed to generate documents',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Get documents error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      orderId: params?.orderId,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json({ 
      message: 'Failed to get documents',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}

// Generate specific document type
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
    const { documentType } = await req.json();

    await connectDB();

    // Get vendor by email from token
    const vendor = await Vendor.findOne({ email: decoded.email });
    if (!vendor) {
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }

    // Get order and find vendor shipment
    const order = await Order.findOne({ orderId });
    const vendorShipment = order?.deliveryDetails.vendorShipments?.find(
      (shipment: any) => String(shipment.vendorId) === String(vendor._id)
    );

    if (!vendorShipment?.shiprocketShipmentId) {
      return NextResponse.json({ 
        message: 'Shiprocket shipment not found' 
      }, { status: 400 });
    }

    let result;
    switch (documentType) {
      case 'label':
        result = await generateShiprocketLabel(vendorShipment.shiprocketShipmentId);
        break;
      case 'invoice':
        result = await generateShiprocketInvoice(vendorShipment.shiprocketShipmentId);
        break;
      default:
        return NextResponse.json({ 
          message: 'Invalid document type' 
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      documentType,
      result
    });

  } catch (error) {
    console.error('Generate document error:', error);
    return NextResponse.json({ 
      message: 'Failed to generate document',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
