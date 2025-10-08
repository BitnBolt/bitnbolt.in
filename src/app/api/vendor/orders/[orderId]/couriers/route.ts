import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Vendor from '@/models/Vendor';
import { getShiprocketDeliveryCost } from '@/lib/shiprocket';
import jwt from 'jsonwebtoken';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    let decoded: { email: string; vendorId?: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { email: string; vendorId?: string };
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { orderId } = await params;
    console.log('Getting available couriers for order:', orderId);

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
    console.log('Found order with status:', order.status);

    // Check if order has items from this vendor
    const vendorItems = order.items.filter((item: { vendorId: string }) => 
      String(item.vendorId) === String(vendor._id)
    );

    if (vendorItems.length === 0) {
      console.error('No items found for vendor in order. Vendor ID:', vendor._id, 'Order items:', order.items.map((item: { vendorId: string; productId?: { name: string } }) => ({ vendorId: item.vendorId, productName: item.productId?.name })));
      return NextResponse.json({ 
        message: 'No items found for this vendor in this order' 
      }, { status: 404 });
    }
    console.log('Found vendor items:', vendorItems.length);

    // Find vendor shipment
    const vendorShipment = order.deliveryDetails.vendorShipments?.find(
      (shipment: { vendorId: string }) => String(shipment.vendorId) === String(vendor._id)
    );

    if (!vendorShipment) {
      console.error('No vendor shipment found. Vendor ID:', vendor._id, 'Available shipments:', order.deliveryDetails.vendorShipments?.map((s: { vendorId: string; shiprocketStatus: string }) => ({ vendorId: s.vendorId, status: s.shiprocketStatus })));
      return NextResponse.json({ 
        message: 'Shiprocket shipment not created yet for this vendor' 
      }, { status: 400 });
    }
    console.log('Found vendor shipment:', vendorShipment.shiprocketOrderId);

    // Get available couriers using the same logic as checkout
    try {
      const vendorTotal = vendorItems.reduce((sum: number, item: { finalPrice: number; quantity: number }) => sum + (item.finalPrice * item.quantity), 0);
      const vendorWeight = vendorItems.reduce((sum: number, item: { quantity: number }) => sum + (item.quantity * 0.5), 0); // Assume 0.5kg per item
      
      console.log('Courier request data:', {
        pickupPostcode: vendor.pickupAddress?.postalCode || '110001',
        deliveryPostcode: order.shippingAddress.pincode,
        weight: Math.max(vendorWeight, 0.1),
        cod: order.paymentDetails.method === 'cod' ? vendorTotal : 0,
        declaredValue: vendorTotal,
        paymentMethod: order.paymentDetails.method
      });
      
      const serviceabilityResponse = await getShiprocketDeliveryCost({
        pickupPostcode: vendor.pickupAddress?.postalCode || '110001',
        deliveryPostcode: order.shippingAddress.pincode,
        weight: Math.max(vendorWeight, 0.1),
        cod: order.paymentDetails.method === 'cod' ? vendorTotal : 0, // Use actual COD amount, not just 1
        declaredValue: vendorTotal,
      });

      console.log('Serviceability response:', {
        status: serviceabilityResponse.status,
        availableCouriers: serviceabilityResponse.data?.available_courier_companies?.length || 0,
        recommendedCourier: serviceabilityResponse.data?.recommended_courier_company_id
      });

      if (serviceabilityResponse.status === 200 && serviceabilityResponse.data.available_courier_companies.length > 0) {
        // Filter available couriers
        const availableCouriers = serviceabilityResponse.data.available_courier_companies
          .filter(courier => order.paymentDetails.method === 'cod' ? courier.cod === 1 : true)
          .filter(courier => courier.blocked === 0)
          .map(courier => ({
            courierId: courier.courier_company_id,
            courierName: courier.courier_name,
            rate: courier.rate,
            estimatedDays: courier.estimated_delivery_days,
            rating: courier.rating,
            deliveryPerformance: courier.delivery_performance,
            isRecommended: courier.courier_company_id === serviceabilityResponse.data.recommended_courier_company_id,
          }))
          .sort((a, b) => {
            // Sort by recommended first, then by rating
            if (a.isRecommended && !b.isRecommended) return -1;
            if (!a.isRecommended && b.isRecommended) return 1;
            return b.rating - a.rating;
          });

        console.log('Filtered available couriers:', availableCouriers.length);

        return NextResponse.json({
          success: true,
          couriers: availableCouriers,
          recommendedCourierId: serviceabilityResponse.data.recommended_courier_company_id,
        });
      } else {
        console.error('No couriers available. Response:', serviceabilityResponse);
        return NextResponse.json({ 
          message: 'No couriers available for this location',
          details: serviceabilityResponse.data || 'No data received'
        }, { status: 400 });
      }
    } catch (error) {
      console.error('Failed to get available couriers:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        orderId: orderId,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json({ 
        message: 'Failed to get available couriers',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Get couriers error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json({ 
      message: 'Failed to get available couriers',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}
