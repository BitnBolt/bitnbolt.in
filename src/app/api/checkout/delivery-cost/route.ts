import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Products';
import Vendor from '@/models/Vendor';
import { getShiprocketDeliveryCost } from '@/lib/shiprocket';

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { deliveryPincode, paymentMethod = 'cod' } = body;

    if (!deliveryPincode) {
      return NextResponse.json({ 
        message: 'Delivery pincode is required' 
      }, { status: 400 });
    }

    await connectDB();

    // Get user's cart items
    const user = await User.findById(session.user.id)
      .populate({ 
        path: 'cart', 
        model: Product, 
        select: 'name finalPrice vendorId weight' 
      });

    if (!user || !user.cart || user.cart.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    // Group items by vendor
    const vendorItems = new Map<string, Array<{ _id: string; name: string; finalPrice: number; vendorId: string; weight?: number }>>();
    for (const product of user.cart as Array<{ _id: string; name: string; finalPrice: number; vendorId: string; weight?: number }>) {
      const vendorId = String(product.vendorId);
      if (!vendorItems.has(vendorId)) {
        vendorItems.set(vendorId, []);
      }
      vendorItems.get(vendorId)!.push(product);
    }

    // Get vendors with pickup addresses
    const vendorIds = [...vendorItems.keys()];
    const vendors = await Vendor.find({ 
      _id: { $in: vendorIds },
      'pickupAddress.postalCode': { $exists: true, $ne: null }
    }).select('_id pickupAddress.postalCode');

    let totalShippingCost = 0;
    const deliveryBreakdown: Array<{
      vendorId: string;
      courierName: string;
      rate: number;
      estimatedDays: string | number;
      codAvailable: boolean;
      itemsCount: number;
      courierId?: number;
      rating?: number;
      deliveryPerformance?: number;
      realtimeTracking?: number;
      podAvailable?: number;
      etd?: string;
      etdHours?: number;
      isRecommended?: boolean;
      freightCharge?: number;
      codCharges?: number;
      coverageCharges?: number;
      otherCharges?: number;
      isFallback?: boolean;
    }> = [];

    // Calculate shipping for each vendor
    for (const vendor of vendors) {
      const items = vendorItems.get(String(vendor._id)) || [];
      const vendorTotal = items.reduce((sum, item) => sum + item.finalPrice, 0);
      const vendorWeight = items.reduce((sum, item) => sum + (item.weight || 0.5), 0); // Default 0.5kg if no weight

      try {
        const serviceabilityResponse = await getShiprocketDeliveryCost({
          pickupPostcode: vendor.pickupAddress.postalCode,
          deliveryPostcode: deliveryPincode,
          weight: Math.max(vendorWeight, 0.1), // Minimum 0.1kg
          cod: paymentMethod === 'cod' ? 1 : 0,
          declaredValue: vendorTotal,
        });

        if (serviceabilityResponse.status === 200 && serviceabilityResponse.data.available_courier_companies.length > 0) {
          // Filter available couriers based on payment method
          const availableCouriers = serviceabilityResponse.data.available_courier_companies
            .filter(courier => paymentMethod === 'cod' ? courier.cod === 1 : true)
            .filter(courier => courier.blocked === 0); // Exclude blocked couriers

          if (availableCouriers.length > 0) {
            // Try to use Shiprocket's recommended courier first, then fallback to cheapest
            let selectedCourier = availableCouriers.find(courier => 
              courier.courier_company_id === serviceabilityResponse.data.recommended_courier_company_id
            );

            // If no recommended courier or it's not available, use the cheapest
            if (!selectedCourier) {
              selectedCourier = availableCouriers.sort((a, b) => a.rate - b.rate)[0];
            }
            
            if (selectedCourier) {
              totalShippingCost += selectedCourier.rate;
              deliveryBreakdown.push({
                vendorId: vendor._id,
                courierName: selectedCourier.courier_name,
                rate: selectedCourier.rate,
                estimatedDays: selectedCourier.estimated_delivery_days,
                codAvailable: selectedCourier.cod === 1,
                itemsCount: items.length,
                courierId: selectedCourier.courier_company_id,
                rating: selectedCourier.rating,
                deliveryPerformance: selectedCourier.delivery_performance,
                realtimeTracking: Number(selectedCourier.realtime_tracking),
                podAvailable: Number(selectedCourier.pod_available),
                etd: selectedCourier.etd,
                etdHours: selectedCourier.etd_hours,
                isRecommended: selectedCourier.courier_company_id === serviceabilityResponse.data.recommended_courier_company_id,
                freightCharge: selectedCourier.freight_charge,
                codCharges: selectedCourier.cod_charges,
                coverageCharges: selectedCourier.coverage_charges,
                otherCharges: selectedCourier.other_charges,
              });
            }
          }
        }
      } catch (error) {
        console.error(`Failed to get shipping cost for vendor ${vendor._id}:`, error);
        // Fallback to default shipping cost
        const fallbackCost = 20; // Fixed fallback cost
        totalShippingCost += fallbackCost;
        deliveryBreakdown.push({
          vendorId: vendor._id,
          courierName: 'Standard Shipping',
          rate: fallbackCost,
          estimatedDays: '3-5 days',
          codAvailable: true,
          itemsCount: items.length,
          isFallback: true,
        });
      }
    }

    return NextResponse.json({
      success: true,
      totalShippingCost,
      deliveryBreakdown,
      deliveryPincode,
      paymentMethod,
    });

  } catch (error) {
    console.error('Delivery cost calculation error:', error);
    return NextResponse.json({ 
      message: 'Failed to calculate delivery cost' 
    }, { status: 500 });
  }
}
