import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TelegramBot from '@/models/TelegramBot';
import TelegramChat from '@/models/TelegramChat';
import { requireNotificationsAdmin } from '@/lib/telegram-admin';
import { notify } from '@/lib/telegram-notify';
import { NOTIFICATION_DOMAINS } from '@/lib/notification-domains';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: { domains: NOTIFICATION_DOMAINS },
  });
}

/** Send a test notification to all chats scoped for a domain (or system). */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const auth = await requireNotificationsAdmin(request);
    if (auth.error) return auth.error;

    const body = await request.json();
    const domain = body.domain || 'system';
    const chatId = body.chatId as string | undefined;

    if (chatId && body.botId) {
      const bot = await TelegramBot.findById(body.botId);
      const chat = await TelegramChat.findOne({ botId: body.botId, chatId });
      if (!bot || !chat) {
        return NextResponse.json(
          { success: false, message: 'Bot or chat not found' },
          { status: 404 }
        );
      }
    }

    await notify({
      domain,
      event: 'admin.test',
      title: 'Test notification',
      body:
        body.message ||
        `Hello from BitnBolt admin — test for domain "${domain}" at ${new Date().toISOString()}`,
      severity: 'info',
      meta: { triggeredBy: auth.decoded?.email },
    });

    return NextResponse.json({ success: true, message: 'Test notification dispatched' });
  } catch (error) {
    console.error('Notification test error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
