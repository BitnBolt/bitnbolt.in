import { NextRequest, NextResponse } from 'next/server';
import { NOTIFICATION_DOMAINS } from '@/lib/notification-domains';
import { requireNotificationsAdmin } from '@/lib/telegram-admin';

export async function GET(request: NextRequest) {
  const auth = await requireNotificationsAdmin(request);
  if (auth.error) return auth.error;
  return NextResponse.json({ success: true, data: { domains: NOTIFICATION_DOMAINS } });
}
