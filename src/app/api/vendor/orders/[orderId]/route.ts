import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Products';
import Vendor from '@/models/Vendor';
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

    await connectDB();

    // Get vendor by email from token
    const vendor = await Vendor.findOne({ email: decoded.email });
    if (!vendor) {
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }

    // Get order with populated data
    const order = await Order.findOne({ orderId })
      .populate('items.productId', 'name images slug description')
      .populate('items.vendorId', 'businessName email phone')
      .populate('userId', 'name email phoneNumber');

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Filter items to only show this vendor's products
    const vendorItems = order.items.filter((item: any) => 
      String(item.vendorId._id) === String(vendor._id)
    );

    if (vendorItems.length === 0) {
      return NextResponse.json({ 
        message: 'No items found for this vendor in this order' 
      }, { status: 404 });
    }

    // Calculate vendor-specific totals
    const vendorSubtotal = vendorItems.reduce((sum: number, item: any) => 
      sum + (item.finalPrice * item.quantity), 0
    );

    return NextResponse.json({
      success: true,
      order: {
        ...order.toObject(),
        items: vendorItems,
        vendorSubtotal,
      },
    });

  } catch (error) {
    console.error('Get vendor order details error:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch order details' 
    }, { status: 500 });
  }
}

export async function PATCH(
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
      console.log('Decoded token in PATCH:', decoded);
    } catch (error) {
      console.error('Token verification error in PATCH:', error);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { orderId } = params;
    const body = await req.json();
    const { status, comment } = body;

    if (!status) {
      return NextResponse.json({ 
        message: 'Status is required' 
      }, { status: 400 });
    }

    await connectDB();

    // Get vendor by email from token
    const vendor = await Vendor.findOne({ email: decoded.email });
    if (!vendor) {
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }

    // Get order
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

    // Update order status
    order.status = status;
    order.statusHistory.push({
      status,
      comment: comment || `Status updated by vendor`,
      updatedBy: vendor.businessName,
      timestamp: new Date(),
    });

    // If order is being cancelled, restore stock
    if (status === 'cancelled') {
      try {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: item.quantity } },
            { new: true }
          );
        }
        console.log(`Stock restored for cancelled order: ${orderId}`);
      } catch (stockError) {
        console.error('Failed to restore stock for cancelled order:', stockError);
      }
    }

    await order.save();

        // If status is being changed to 'confirmed', automatically create Shiprocket shipment
        const existingVendorShipment = order.deliveryDetails.vendorShipments?.find(
          (shipment: any) => String(shipment.vendorId) === String(vendor._id)
        );
        
        if (status === 'confirmed' && !existingVendorShipment) {
      try {
        // Import the Shiprocket creation logic
        const { createShiprocketShipment, getShiprocketPickupLocation } = await import('@/lib/shiprocket');
        
        // Get order with populated data for Shiprocket
        const populatedOrder = await Order.findOne({ orderId })
          .populate('items.productId', 'name weight shippingInfo')
          .populate('userId', 'email')
          .populate('items.vendorId', 'businessName pickupAddress');

        if (populatedOrder) {
          // Filter items for this vendor
          const vendorItems = populatedOrder.items.filter((item: any) => 
            String(item.vendorId._id) === String(vendor._id)
          );

          if (vendorItems.length > 0) {
            // Use vendor ID as pickup location for unique identification
            const pickupLocation = String(vendor._id);

            // Prepare shipment data
            const shipmentData = {
              order_id: populatedOrder.orderId,
              order_date: populatedOrder.createdAt.toISOString().split('T')[0] + ' ' + 
                          populatedOrder.createdAt.toTimeString().split(' ')[0].substring(0, 5),
              pickup_location: pickupLocation,
              comment: `Vendor: ${vendor.businessName}`,
              billing_customer_name: populatedOrder.billingAddress.fullName.split(' ')[0] || populatedOrder.billingAddress.fullName,
              billing_last_name: populatedOrder.billingAddress.fullName.split(' ').slice(1).join(' ') || '',
              billing_address: populatedOrder.billingAddress.addressLine1,
              billing_address_2: populatedOrder.billingAddress.addressLine2 || '',
              billing_city: populatedOrder.billingAddress.city,
              billing_pincode: parseInt(populatedOrder.billingAddress.pincode),
              billing_state: populatedOrder.billingAddress.state,
              billing_country: 'India',
              billing_email: (populatedOrder.userId as any).email || '',
              billing_phone: parseInt(populatedOrder.billingAddress.phoneNumber.replace(/\D/g, '')),
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
                hsn: 441122,
              })),
              payment_method: populatedOrder.paymentDetails.method === 'cod' ? 'COD' : 'Prepaid',
              shipping_charges: 0,
              giftwrap_charges: 0,
              transaction_charges: 0,
              total_discount: 0,
              sub_total: vendorItems.reduce((sum: number, item: any) => sum + (item.finalPrice * item.quantity), 0),
              length: 10,
              breadth: 15,
              height: 20,
              weight: vendorItems.reduce((total: number, item: any) => {
                return total + ((item.productId.shippingInfo?.weight || 100) * item.quantity) / 1000;
              }, 0),
            };

            // Create shipment in Shiprocket
            const shipmentResult = await createShiprocketShipment(shipmentData);

            // Initialize vendorShipments array if it doesn't exist
            if (!populatedOrder.deliveryDetails.vendorShipments) {
              populatedOrder.deliveryDetails.vendorShipments = [];
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

            populatedOrder.deliveryDetails.vendorShipments.push(vendorShipment);

            // Update legacy fields for backward compatibility (use first vendor's data)
            if (!populatedOrder.deliveryDetails.shiprocketOrderId) {
              populatedOrder.deliveryDetails.shiprocketOrderId = shipmentResult.order_id.toString();
              populatedOrder.deliveryDetails.shiprocketShipmentId = shipmentResult.shipment_id.toString();
              populatedOrder.deliveryDetails.provider = 'Shiprocket';
              populatedOrder.deliveryDetails.shiprocketStatus = 'created';
            }
            
            // Update status to processing
            populatedOrder.status = 'processing';
            populatedOrder.statusHistory.push({
              status: 'processing',
              comment: `Shipment created in Shiprocket automatically after confirmation`,
              updatedBy: 'System',
              timestamp: new Date(),
            });

            await populatedOrder.save();
          }
        }
      } catch (shiprocketError) {
        console.error('Failed to create Shiprocket shipment automatically:', shiprocketError);
        // Don't fail the order update if Shiprocket fails
        // The vendor can manually create the shipment later
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      orderId: order.orderId,
      status: order.status,
    });

  } catch (error) {
    console.error('Update vendor order error:', error);
    return NextResponse.json({ 
      message: 'Failed to update order' 
    }, { status: 500 });
  }
}

