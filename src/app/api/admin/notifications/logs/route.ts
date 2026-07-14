import { NextRequest, NextResponse } from 'next/server';
import type { FilterQuery } from 'mongoose';
import { connectDB } from '@/lib/db';
import NotificationLog, { INotificationLog } from '@/models/NotificationLog';
import { requireNotificationsAdmin } from '@/lib/telegram-admin';
import { NOTIFICATION_DOMAINS } from '@/lib/notification-domains';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const auth = await requireNotificationsAdmin(request);
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '30', 10)));
    const domain = searchParams.get('domain');
    const status = searchParams.get('status');
    const since = searchParams.get('since');

    const filter: FilterQuery<INotificationLog> = {};
    if (domain) filter.domain = domain;
    if (status) filter.status = status;
    if (since) {
      const sinceDate = new Date(since);
      if (!Number.isNaN(sinceDate.getTime())) {
        filter.createdAt = { $gt: sinceDate };
      }
    }

    const [logs, total] = await Promise.all([
      NotificationLog.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      NotificationLog.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.max(1, Math.ceil(total / limit)),
        },
        domains: NOTIFICATION_DOMAINS,
      },
    });
  } catch (error) {
    console.error('Notification logs list error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
