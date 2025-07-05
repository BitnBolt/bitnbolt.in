import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d'; // 7 days

export interface VendorTokenPayload {
  vendorId: string;
  email: string;
  seller_name: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  approved: boolean;
}

export function generateVendorToken(payload: VendorTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyVendorToken(token: string): VendorTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as VendorTokenPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
} 