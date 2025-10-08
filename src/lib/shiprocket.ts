interface ShiprocketAuthResponse {
  company_id: number;
  created_at: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  token: string;
}

interface ShiprocketOrderResponse {
  order_id: number;
  shipment_id: number;
  status: string;
  status_code: number;
  onboarding_completed_now: number;
  awb_code?: string;
  courier_company_id?: number;
  courier_name?: string;
}

interface ShiprocketAWBResponse {
  awb_assign_status: number;
  response: {
    data: {
      courier_company_id: number;
      awb_code: string;
      cod: number;
      order_id: number;
      shipment_id: number;
      awb_code_status: number;
      assigned_date_time: {
        date: string;
        timezone_type: number;
        timezone: string;
      };
      applied_weight: number;
      company_id: number;
      courier_name: string;
      child_courier_name?: string;
      pickup_scheduled_date: string;
      routing_code: string;
      rto_routing_code: string;
      invoice_no: string;
      transporter_id: string;
      transporter_name: string;
      shipped_by: {
        shipper_company_name: string;
        shipper_address_1: string;
        shipper_address_2: string;
        shipper_city: string;
        shipper_state: string;
        shipper_country: string;
        shipper_postcode: string;
        shipper_first_mile_activated: number;
        shipper_phone: string;
        lat: string;
        long: string;
        shipper_email: string;
        rto_company_name: string;
        rto_address_1: string;
        rto_address_2: string;
        rto_city: string;
        rto_state: string;
        rto_country: string;
        rto_postcode: string;
        rto_phone: string;
        rto_email: string;
      };
    };
  };
}

interface ShiprocketTrackingResponse {
  tracking_data: {
    track_status: number;
    shipment_status: number;
    shipment_track: Array<{
      id: number;
      awb_code: string;
      courier_company_id: number;
      shipment_id: number;
      order_id: number;
      pickup_date: string;
      delivered_date?: string;
      weight: string;
      packages: number;
      current_status: string;
      delivered_to?: string;
      destination: string;
      consignee_name: string;
      origin: string;
      courier_agent_details?: { name?: string; phone?: string; email?: string };
      courier_name: string;
      edd?: string;
      pod?: string;
      pod_status?: string;
    }>;
    shipment_track_activities: Array<{
      date: string;
      status: string;
      activity: string;
      location: string;
      "sr-status": string;
      "sr-status-label": string;
    }>;
    track_url: string;
    etd: string;
    qc_response: {
      qc_image: string;
      qc_failed_reason: string;
    };
  };
}

interface ShiprocketLabelResponse {
  label_created: number;
  label_url: string;
  response: string;
  not_created: unknown[];
}

interface ShiprocketInvoiceResponse {
  is_invoice_created: boolean;
  invoice_url: string;
  not_created: unknown[];
}

interface ShiprocketManifestResponse {
  status: number;
  manifest_url: string;
}

interface ShiprocketPrintManifestResponse {
  manifest_url: string;
}

interface ShiprocketPickupLocationResponse {
  success: boolean;
  address: {
    company_id: number;
    pickup_code: string;
    address: string;
    address_2: string;
    address_type: string | null;
    city: string;
    state: string;
    country: string;
    gstin: string | null;
    pin_code: string;
    phone: string;
    email: string;
    name: string;
    alternate_phone: string | null;
    lat: number | null;
    long: number | null;
    status: number;
    phone_verified: number;
    rto_address_id: number;
    extra_info: string;
    updated_at: string;
    created_at: string;
    id: number;
  };
  pickup_id: number;
  company_name: string;
  full_name: string;
}

interface ShiprocketServiceabilityResponse {
  status: number;
  message?: string;
  data: {
    available_courier_companies: Array<{
      courier_company_id: number;
      courier_name: string;
      rate: number;
      estimated_delivery_days: string;
      cod: number;
      cod_available?: boolean;
      freight_charge: number;
      delivery_performance: number;
      pickup_performance: number;
      rating: number;
      realtime_tracking: string;
      pod_available: string;
      is_surface: boolean;
      surface_max_weight: string;
      min_weight: number;
      charge_weight: number;
      cutoff_time: string;
      etd: string;
      etd_hours: number;
      state: string;
      city: string;
      postcode: string;
      zone: string;
      region: number;
      cod_charges: number;
      cod_multiplier: number;
      coverage_charges: number;
      other_charges: number;
      rto_charges: number;
      entry_tax: number;
      assured_amount: number;
      is_custom_rate: number;
      is_hyperlocal: boolean;
      is_international: number;
      is_rto_address_available: boolean;
      local_region: number;
      metro: number;
      mode: number;
      ship_type: number;
      secure_shipment_disabled: boolean;
      call_before_delivery: string;
      delivery_boy_contact: string;
      pickup_availability: string;
      pickup_priority: string;
      pickup_supress_hours: number;
      seconds_left_for_pickup: number;
      qc_courier: number;
      blocked: number;
      odablock: boolean;
      rank: string;
      cost: string;
      description: string;
      edd: string;
      new_edd: number;
      suppress_date: string;
      suppress_text: string;
      suppression_dates: unknown;
      others: string;
      base_courier_id: unknown;
      base_weight: string;
      air_max_weight: string;
      volumetric_max_weight: unknown;
      weight_cases: number;
      tracking_performance: number;
      rto_performance: number;
      id: number;
      courier_type: string;
    }>;
    blocked_courier_companies?: Array<{
      courier_company_id: number;
      courier_name: string;
      postcode: string;
      block_reason: string;
    }>;
    recommended_courier_company_id?: number;
    shiprocket_recommended_courier_id?: number;
    is_recommendation_enabled?: number;
    recommendation_advance_rule?: number;
    recommended_by?: {
      id: number;
      title: string;
    };
    child_courier_id?: unknown;
  };
  company_auto_shipment_insurance_setting?: boolean;
  covid_zones?: {
    delivery_zone: unknown;
    pickup_zone: unknown;
  };
  currency?: string;
  dg_courier?: number;
  eligible_for_insurance?: boolean;
  insurace_opted_at_order_creation?: boolean;
  is_allow_templatized_pricing?: boolean;
  is_latlong?: number;
  is_old_zone_opted?: boolean;
  is_zone_from_mongo?: boolean;
  label_generate_type?: number;
  on_new_zone?: number;
  seller_address?: unknown[];
  user_insurance_manadatory?: boolean;
}

// Simple token cache
let cachedToken: string | null = null;
let tokenExpiry: Date | null = null;

// Get authentication token
export async function getShiprocketToken(): Promise<string> {
  // Check if we have a valid cached token
  // if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
  //   return cachedToken;
  // }

  // Get credentials from environment variables
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error('Shiprocket credentials not configured in environment variables');
  }

  try {
    const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with Shiprocket');
    }

    const data: ShiprocketAuthResponse = await response.json();
    
    // Cache token and expiry (subtract 5 minutes for safety)
    cachedToken = data.token;
    tokenExpiry = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)); // 7 days
    console.log('Shiprocket token cached:', cachedToken);
    return cachedToken;
  } catch (error) {
    console.error('Shiprocket authentication error:', error);
    throw new Error('Failed to authenticate with Shiprocket');
  }
}

// Create shipment
export async function createShiprocketShipment(shipmentData: Record<string, unknown>): Promise<ShiprocketOrderResponse> {
  try {
    const token = await getShiprocketToken();

    const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(shipmentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Shiprocket API error: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create shipment error:', error);
    throw error;
  }
}

// Generate AWB
export async function generateShiprocketAWB(shipmentId: string, courierId: string): Promise<ShiprocketAWBResponse> {
  try {
    const token = await getShiprocketToken();

    const response = await fetch('https://apiv2.shiprocket.in/v1/external/courier/assign/awb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        shipment_id: shipmentId,
        courier_id: courierId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Shiprocket AWB generation error: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Generate AWB error:', error);
    throw error;
  }
}

// Track shipment
export async function trackShiprocketShipment(awbCode: string): Promise<ShiprocketTrackingResponse> {
  try {
    const token = await getShiprocketToken();

    const response = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awbCode}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Shiprocket tracking error: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Track shipment error:', error);
    throw error;
  }
}

// Add pickup location
export async function addShiprocketPickupLocation(pickupData: {
  pickup_location: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  address_2?: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;
}): Promise<ShiprocketPickupLocationResponse> {
  try {
    const token = await getShiprocketToken();

    const response = await fetch('https://apiv2.shiprocket.in/v1/external/settings/company/addpickup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(pickupData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Shiprocket pickup location creation error: ${JSON.stringify(errorData)}`);
    }
    console.log("Shiprocket pickup location creation response:", await response.json());

    return await response.json();
  } catch (error) {
    console.error('Add pickup location error:', error);
    throw error;
  }
}

// Check delivery serviceability and get shipping cost
export async function getShiprocketDeliveryCost(params: {
  pickupPostcode: string;
  deliveryPostcode: string;
  weight: number;
  cod: number;
  mode?: string;
  length?: number;
  breadth?: number;
  height?: number;
  declaredValue: number;
}): Promise<ShiprocketServiceabilityResponse> {
  try {
    const token = await getShiprocketToken();

    const queryParams = new URLSearchParams({
      pickup_postcode: params.pickupPostcode,
      delivery_postcode: params.deliveryPostcode,
      weight: params.weight.toString(),
      cod: params.cod.toString(),
      mode: params.mode || 'Surface',
      length: (params.length || 10).toString(),
      breadth: (params.breadth || 10).toString(),
      height: (params.height || 10).toString(),
      declared_value: params.declaredValue.toString(),
    });
    console.log(`https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${queryParams}`)
    const response = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Shiprocket serviceability error: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get delivery cost error:', error);
    throw error;
  }
}

// Get pickup location from environment
export function getShiprocketPickupLocation() {
  return {
    name: process.env.SHIPROCKET_PICKUP_NAME || 'BitnBolt',
    phone: process.env.SHIPROCKET_PICKUP_PHONE || '',
    address: process.env.SHIPROCKET_PICKUP_ADDRESS || '',
    city: process.env.SHIPROCKET_PICKUP_CITY || '',
    state: process.env.SHIPROCKET_PICKUP_STATE || '',
    pincode: process.env.SHIPROCKET_PICKUP_PINCODE || '',
    country: process.env.SHIPROCKET_PICKUP_COUNTRY || 'India',
  };
}

// Generate shipping label
export async function generateShiprocketLabel(shipmentId: string): Promise<ShiprocketLabelResponse> {
  try {
    const token = await getShiprocketToken();

    const response = await fetch('https://apiv2.shiprocket.in/v1/external/courier/generate/label', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        shipment_id: [shipmentId], // Array format as per API
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Shiprocket label generation error: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Generate label error:', error);
    throw error;
  }
}

// Generate invoice
export async function generateShiprocketInvoice(orderId: string): Promise<ShiprocketInvoiceResponse> {
  try {
    const token = await getShiprocketToken();

    const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/print/invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ids: [orderId], // Array format as per API
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Shiprocket invoice generation error: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Generate invoice error:', error);
    throw error;
  }
}

// Generate manifest
export async function generateShiprocketManifest(shipmentIds: string[]): Promise<ShiprocketManifestResponse> {
  try {
    const token = await getShiprocketToken();

    const response = await fetch('https://apiv2.shiprocket.in/v1/external/manifests/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        shipment_id: shipmentIds, // Array format as per API
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Shiprocket manifest generation error: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Generate manifest error:', error);
    throw error;
  }
}

// Print manifest
export async function printShiprocketManifest(orderIds: string[]): Promise<ShiprocketPrintManifestResponse> {
  try {
    const token = await getShiprocketToken();

    const response = await fetch('https://apiv2.shiprocket.in/v1/external/manifests/print', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_ids: orderIds, // Array format as per API
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Shiprocket print manifest error: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Print manifest error:', error);
    throw error;
  }
}

// Get all documents for a shipment (label, invoice, manifest)
export async function getShiprocketDocuments(shipmentId: string, orderId: string): Promise<{
  label?: string;
  invoice?: string;
  manifest?: string;
  awb?: string;
}> {
  try {
    const documents: Record<string, string> = {};

    // Generate label
    try {
      const labelData = await generateShiprocketLabel(shipmentId);
      if (labelData.label_created === 1) {
        documents.label = labelData.label_url;
      }
    } catch (error) {
      console.error('Failed to generate label:', error);
    }

    // Generate invoice
    try {
      const invoiceData = await generateShiprocketInvoice(orderId);
      if (invoiceData.is_invoice_created) {
        documents.invoice = invoiceData.invoice_url;
      }
    } catch (error) {
      console.error('Failed to generate invoice:', error);
    }

    // Generate manifest
    try {
      const manifestData = await generateShiprocketManifest([shipmentId]);
      if (manifestData.status === 1) {
        documents.manifest = manifestData.manifest_url;
      }
    } catch (error) {
      console.error('Failed to generate manifest:', error);
    }

    return documents;
  } catch (error) {
    console.error('Get documents error:', error);
    throw error;
  }
}
