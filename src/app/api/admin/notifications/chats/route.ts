import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TelegramBot from '@/models/TelegramBot';
import TelegramChat from '@/models/TelegramChat';
import { requireNotificationsAdmin } from '@/lib/telegram-admin';
import { isNotificationDomain } from '@/lib/notification-domains';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const auth = await requireNotificationsAdmin(request);
    if (auth.error) return auth.error;

    const botId = new URL(request.url).searchParams.get('botId');
    const filter = botId ? { botId } : {};
    const chats = await TelegramChat.find(filter)
      .populate('botId', 'name isActive')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: { chats } });
  } catch (error) {
    console.error('Telegram chats list error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const auth = await requireNotificationsAdmin(request);
    if (auth.error) return auth.error;

    const body = await request.json();
    if (!body.botId || !body.chatId?.trim() || !body.label?.trim()) {
      return NextResponse.json(
        { success: false, message: 'botId, chatId, and label are required' },
        { status: 400 }
      );
    }

    const bot = await TelegramBot.findById(body.botId);
    if (!bot) {
      return NextResponse.json({ success: false, message: 'Bot not found' }, { status: 404 });
    }

    const scopes: string[] = Array.isArray(body.scopes) ? body.scopes : [];
    if (!scopes.every((s) => isNotificationDomain(String(s)))) {
      return NextResponse.json({ success: false, message: 'Invalid scopes' }, { status: 400 });
    }

    const chat = await TelegramChat.create({
      botId: body.botId,
      chatId: String(body.chatId).trim(),
      label: String(body.label).trim(),
      scopes,
      isActive: body.isActive !== false,
    });

    return NextResponse.json({
      success: true,
      message: 'Chat target added',
      data: { chat },
    });
  } catch (error: unknown) {
    console.error('Telegram chat create error:', error);
    if (
      typeof error === 'object' &&
      error &&
      'code' in error &&
      (error as { code?: number }).code === 11000
    ) {
      return NextResponse.json(
        { success: false, message: 'This chat ID is already linked to this bot' },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
