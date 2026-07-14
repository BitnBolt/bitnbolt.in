import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TelegramBot from '@/models/TelegramBot';
import TelegramChat from '@/models/TelegramChat';
import { requireNotificationsAdmin, maskBotToken } from '@/lib/telegram-admin';
import { verifyBotToken } from '@/lib/telegram-notify';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const auth = await requireNotificationsAdmin(request);
    if (auth.error) return auth.error;

    const { id } = await params;
    const bot = await TelegramBot.findById(id);
    if (!bot) {
      return NextResponse.json({ success: false, message: 'Bot not found' }, { status: 404 });
    }

    const body = await request.json();
    if (body.name !== undefined) bot.name = String(body.name).trim();
    if (body.notes !== undefined) bot.notes = String(body.notes).trim();
    if (typeof body.isActive === 'boolean') bot.isActive = body.isActive;

    if (body.botToken?.trim()) {
      const verified = await verifyBotToken(body.botToken.trim());
      if (!verified.ok) {
        return NextResponse.json(
          { success: false, message: `Telegram rejected token: ${verified.error}` },
          { status: 400 }
        );
      }
      bot.botToken = body.botToken.trim();
    }

    await bot.save();

    return NextResponse.json({
      success: true,
      message: 'Bot updated',
      data: {
        bot: {
          ...bot.toObject(),
          botTokenMasked: maskBotToken(bot.botToken),
          botToken: undefined,
        },
      },
    });
  } catch (error) {
    console.error('Telegram bot update error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const auth = await requireNotificationsAdmin(request);
    if (auth.error) return auth.error;

    const { id } = await params;
    const bot = await TelegramBot.findById(id);
    if (!bot) {
      return NextResponse.json({ success: false, message: 'Bot not found' }, { status: 404 });
    }

    await TelegramChat.deleteMany({ botId: bot._id });
    await bot.deleteOne();

    return NextResponse.json({ success: true, message: 'Bot and its chats deleted' });
  } catch (error) {
    console.error('Telegram bot delete error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
