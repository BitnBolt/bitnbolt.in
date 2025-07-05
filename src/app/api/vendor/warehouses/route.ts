import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Vendor from '@/models/Vendor';
import { verifyVendorToken, extractTokenFromHeader } from '@/lib/vendor-jwt';

interface WarehouseData {
  addressName?: string;
  buildingNumber?: string;
  streetName?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface WarehouseAddress {
  _id: string;
  addressType: 'primary' | 'secondary' | 'warehouse';
  addressName: string;
  buildingNumber: string;
  streetName: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
  isDefault: boolean;
}

// Helper function to validate warehouse data
function validateWarehouseData(data: WarehouseData) {
  const { addressName, buildingNumber, streetName, city, state, postalCode, country } = data;
  
  if (!addressName || !buildingNumber || !streetName || !city || !state || !postalCode || !country) {
    return { isValid: false, message: 'All address fields are required' };
  }
  
  return { isValid: true };
}

// Helper function to validate address type
function validateAddressType(addressType: string) {
  if (!['primary', 'secondary', 'warehouse'].includes(addressType)) {
    return { isValid: false, message: 'Invalid address type' };
  }
  return { isValid: true };
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

// GET - Fetch all warehouses for a vendor
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateVendor(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { vendor } = authResult;

    return NextResponse.json({
      success: true,
      data: {
        warehouses: vendor.pickupAddresses,
        total: vendor.pickupAddresses.length,
      },
    });

  } catch (error) {
    console.error('Fetch warehouses error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add new warehouse
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateVendor(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { vendor } = authResult;

    const {
      addressType = 'warehouse',
      addressName,
      buildingNumber,
      streetName,
      city,
      state,
      postalCode,
      country,
      landmark,
      isDefault = false,
    } = await request.json();

    // Validate required fields
    const validation = validateWarehouseData({ addressName, buildingNumber, streetName, city, state, postalCode, country });
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400 }
      );
    }

    // Validate address type
    const addressTypeValidation = validateAddressType(addressType);
    if (!addressTypeValidation.isValid) {
      return NextResponse.json(
        { success: false, message: addressTypeValidation.message },
        { status: 400 }
      );
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      vendor.pickupAddresses.forEach((address: WarehouseAddress) => {
        address.isDefault = false;
      });
    }

    // Create new warehouse
    const newWarehouse = {
      addressType,
      addressName: addressName.trim(),
      buildingNumber: buildingNumber.trim(),
      streetName: streetName.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      landmark: landmark ? landmark.trim() : undefined,
      isDefault,
    };

    vendor.pickupAddresses.push(newWarehouse);
    vendor.updatedAt = new Date();
    await vendor.save();

    return NextResponse.json({
      success: true,
      message: 'Warehouse added successfully',
      data: {
        warehouse: newWarehouse,
        total: vendor.pickupAddresses.length,
      },
    });

  } catch (error) {
    console.error('Add warehouse error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update warehouse
export async function PUT(request: NextRequest) {
  try {
    const authResult = await authenticateVendor(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { vendor } = authResult;

    const {
      warehouseId,
      addressType,
      addressName,
      buildingNumber,
      streetName,
      city,
      state,
      postalCode,
      country,
      landmark,
      isDefault,
    } = await request.json();

    if (!warehouseId) {
      return NextResponse.json(
        { success: false, message: 'Warehouse ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    const validation = validateWarehouseData({ addressName, buildingNumber, streetName, city, state, postalCode, country });
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400 }
      );
    }

    // Validate address type
    if (addressType) {
      const addressTypeValidation = validateAddressType(addressType);
      if (!addressTypeValidation.isValid) {
        return NextResponse.json(
          { success: false, message: addressTypeValidation.message },
          { status: 400 }
        );
      }
    }

    // Find the warehouse to update
    const warehouseIndex = vendor.pickupAddresses.findIndex(
      (warehouse: WarehouseAddress) => warehouse._id.toString() === warehouseId
    );

    if (warehouseIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Warehouse not found' },
        { status: 404 }
      );
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      vendor.pickupAddresses.forEach((address: WarehouseAddress, index: number) => {
        if (index !== warehouseIndex) {
          address.isDefault = false;
        }
      });
    }

    // Update warehouse
    vendor.pickupAddresses[warehouseIndex] = {
      ...vendor.pickupAddresses[warehouseIndex],
      addressType: addressType || vendor.pickupAddresses[warehouseIndex].addressType,
      addressName: addressName.trim(),
      buildingNumber: buildingNumber.trim(),
      streetName: streetName.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      landmark: landmark ? landmark.trim() : undefined,
      isDefault: isDefault !== undefined ? isDefault : vendor.pickupAddresses[warehouseIndex].isDefault,
    };

    vendor.updatedAt = new Date();
    await vendor.save();

    return NextResponse.json({
      success: true,
      message: 'Warehouse updated successfully',
      data: {
        warehouse: vendor.pickupAddresses[warehouseIndex],
      },
    });

  } catch (error) {
    console.error('Update warehouse error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove warehouse
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await authenticateVendor(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { vendor } = authResult;

    const { searchParams } = new URL(request.url);
    const warehouseId = searchParams.get('id');

    if (!warehouseId) {
      return NextResponse.json(
        { success: false, message: 'Warehouse ID is required' },
        { status: 400 }
      );
    }

    // Find the warehouse to delete
    const warehouseIndex = vendor.pickupAddresses.findIndex(
      (warehouse: WarehouseAddress) => warehouse._id.toString() === warehouseId
    );

    if (warehouseIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Warehouse not found' },
        { status: 404 }
      );
    }

    // Check if this is the only warehouse
    if (vendor.pickupAddresses.length === 1) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete the only warehouse. At least one warehouse is required.' },
        { status: 400 }
      );
    }

    // Remove the warehouse
    const deletedWarehouse = vendor.pickupAddresses.splice(warehouseIndex, 1)[0];

    // If the deleted warehouse was default, set the first remaining warehouse as default
    if (deletedWarehouse.isDefault && vendor.pickupAddresses.length > 0) {
      vendor.pickupAddresses[0].isDefault = true;
    }

    vendor.updatedAt = new Date();
    await vendor.save();

    return NextResponse.json({
      success: true,
      message: 'Warehouse deleted successfully',
      data: {
        total: vendor.pickupAddresses.length,
      },
    });

  } catch (error) {
    console.error('Delete warehouse error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}