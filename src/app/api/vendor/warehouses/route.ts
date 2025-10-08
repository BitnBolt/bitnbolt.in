import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';
import { verifyVendorToken, extractTokenFromHeader } from '@/lib/vendor-jwt';
import { addShiprocketPickupLocation } from '@/lib/shiprocket';

interface PickupAddressData {
  buildingNumber?: string;
  streetName?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  landmark?: string;
}

// Helper function to validate pickup address data
function validatePickupAddressData(data: PickupAddressData) {
  const { buildingNumber, streetName, city, state, postalCode, country } = data;
  
  if (!buildingNumber || !streetName || !city || !state || !postalCode || !country) {
    return { isValid: false, message: 'All address fields are required' };
  }
  
  return { isValid: true };
}

// Helper function to check if pickup address has all required fields
function hasValidPickupAddress(pickupAddress: any) {
  return pickupAddress && 
    pickupAddress.buildingNumber && 
    pickupAddress.streetName && 
    pickupAddress.city && 
    pickupAddress.state && 
    pickupAddress.postalCode && 
    pickupAddress.country;
}

// Helper function to authenticate vendor
async function authenticateVendor(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return { success: false, response: NextResponse.json(
      { success: false, message: 'No token provided' },
      { status: 401 }
    ) };
  }

  const tokenPayload = verifyVendorToken(token);
  if (!tokenPayload) {
    return { success: false, response: NextResponse.json(
      { success: false, message: 'Invalid or expired token' },
      { status: 401 }
    ) };
  }

  await connectDB();
  const vendor = await Vendor.findById(tokenPayload.vendorId);
  
  if (!vendor) {
    return { success: false, response: NextResponse.json(
      { success: false, message: 'Vendor not found' },
      { status: 404 }
    ) };
  }

  return { success: true, vendor };
}

// GET - Fetch pickup address for a vendor
export async function GET(request: NextRequest) {
  try {

    // console.log('request', request);
    const authResult = await authenticateVendor(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { vendor } = authResult;

    // console.log(vendor);

    // Check if pickup address has all required fields
    const isValidPickupAddress = hasValidPickupAddress(vendor.pickupAddress);

    return NextResponse.json({
      success: true,
      data: {
        pickupAddress: isValidPickupAddress ? vendor.pickupAddress : null,
        hasPickupAddress: isValidPickupAddress,
      },
    });

  } catch (error) {
    console.error('Fetch pickup address error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Set pickup address for a vendor
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateVendor(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { vendor } = authResult;

    // Check if vendor already has a valid pickup address
    if (hasValidPickupAddress(vendor.pickupAddress)) {
      return NextResponse.json(
        { success: false, message: 'Pickup address already exists. Cannot modify once set.' },
        { status: 400 }
      );
    }

    const {
      addressType = 'warehouse',
      buildingNumber,
      streetName,
      city,
      state,
      postalCode,
      country,
      landmark,
    } = await request.json();

    // Validate required fields
    const validation = validatePickupAddressData({ buildingNumber, streetName, city, state, postalCode, country });
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400 }
      );
    }

    // Create pickup address
    const pickupAddress = {
      addressType,
      buildingNumber: buildingNumber.trim(),
      streetName: streetName.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      landmark: landmark ? landmark.trim() : undefined,
    };
    console.log('pickupAddress', pickupAddress);

    // Add pickup location to Shiprocket - MANDATORY
    // Format address for Shiprocket - ensure it includes house/flat/road number
    const formattedAddress = `${buildingNumber.trim()}, ${streetName.trim()}`.trim();
    
    const shiprocketPickupData = {
      pickup_location: vendor._id.toString(), // Use vendor's unique object ID as pickup_location
      name: vendor.seller_name,
      email: vendor.email,
      phone: vendor.phone,
      address: formattedAddress,
      address_2: landmark ? landmark.trim() : '',
      city: city.trim(),
      state: state.trim(),
      country: country.trim(),
      pin_code: postalCode.trim(),
    };

    console.log('Sending to Shiprocket:', shiprocketPickupData);

    const shiprocketResponse = await addShiprocketPickupLocation(shiprocketPickupData);
    
    // Check if the response was successful
    if (!shiprocketResponse.success || !shiprocketResponse.pickup_id) {
      console.error('Shiprocket response was not successful:', shiprocketResponse);
      return NextResponse.json(
        { success: false, message: 'Failed to create pickup location in Shiprocket. Please check your address details and try again.' },
        { status: 400 }
      );
    }

    // Store the Shiprocket pickup location ID
    vendor.shiprocketPickupId = shiprocketResponse.pickup_id.toString();
    console.log('Shiprocket pickup location created successfully:', {
      pickup_id: shiprocketResponse.pickup_id,
      pickup_code: shiprocketResponse.address.pickup_code,
      company_name: shiprocketResponse.company_name
    });

    // Only save to database if Shiprocket was successful
    vendor.pickupAddress = pickupAddress;
    vendor.updatedAt = new Date();
    await vendor.save();

    return NextResponse.json({
      success: true,
      message: 'Pickup address set successfully',
      data: {
        pickupAddress: vendor.pickupAddress,
        shiprocketPickupId: vendor.shiprocketPickupId,
      },
    });

  } catch (error) {
    console.error('Set pickup address error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
