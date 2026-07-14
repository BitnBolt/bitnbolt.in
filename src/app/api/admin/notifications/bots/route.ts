import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TelegramBot from '@/models/TelegramBot';
import { requireNotificationsAdmin, maskBotToken } from '@/lib/telegram-admin';
import { verifyBotToken } from '@/lib/telegram-notify';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const auth = await requireNotificationsAdmin(request);
    if (auth.error) return auth.error;

    const bots = await TelegramBot.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      data: {
        bots: bots.map((b) => ({
          ...b,
          botTokenMasked: maskBotToken(b.botToken),
          botToken: undefined,
        })),
      },
    });
  } catch (error) {
    console.error('Telegram bots list error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const auth = await requireNotificationsAdmin(request);
    if (auth.error) return auth.error;

    const body = await request.json();
    if (!body.name?.trim() || !body.botToken?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name and BotFather API token are required' },
        { status: 400 }
      );
    }

    const verified = await verifyBotToken(body.botToken.trim());
    if (!verified.ok) {
      return NextResponse.json(
        { success: false, message: `Telegram rejected token: ${verified.error}` },
        { status: 400 }
      );
    }

    const bot = await TelegramBot.create({
      name: body.name.trim(),
      botToken: body.botToken.trim(),
      notes: body.notes?.trim(),
      isActive: body.isActive !== false,
    });

    return NextResponse.json({
      success: true,
      message: `Bot saved (@${verified.username || 'unknown'})`,
      data: {
        bot: {
          ...bot.toObject(),
          botTokenMasked: maskBotToken(bot.botToken),
          botToken: undefined,
          telegramUsername: verified.username,
        },
      },
    });
  } catch (error) {
    console.error('Telegram bot create error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
