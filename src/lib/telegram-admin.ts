import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromHeader, verifyAdminToken, type AdminTokenPayload } from '@/lib/admin-jwt';

export function canManageNotifications(decoded: Pick<AdminTokenPayload, 'role' | 'permissions'>) {
  return (
    decoded.role === 'super_admin' ||
    decoded.permissions?.includes('manage_notifications') ||
    decoded.permissions?.includes('manage_settings')
  );
}

export async function requireNotificationsAdmin(request: NextRequest) {
  const token = extractTokenFromHeader(request.headers.get('authorization'));
  if (!token) {
    return {
      error: NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 }),
    };
  }
  const decoded = verifyAdminToken(token);
  if (!decoded) {
    return {
      error: NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 }),
    };
  }
  if (!canManageNotifications(decoded)) {
    return {
      error: NextResponse.json(
        { success: false, message: 'Missing manage_notifications permission' },
        { status: 403 }
      ),
    };
  }
  return { decoded };
}

export function maskBotToken(token: string): string {
  if (!token || token.length < 12) return '••••••••';
  return `${token.slice(0, 6)}…${token.slice(-4)}`;
}
