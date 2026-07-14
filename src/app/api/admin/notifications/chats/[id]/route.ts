import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import TelegramChat from '@/models/TelegramChat';
import { requireNotificationsAdmin } from '@/lib/telegram-admin';
import { isNotificationDomain } from '@/lib/notification-domains';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const auth = await requireNotificationsAdmin(request);
    if (auth.error) return auth.error;

    const { id } = await params;
    const chat = await TelegramChat.findById(id);
    if (!chat) {
      return NextResponse.json({ success: false, message: 'Chat not found' }, { status: 404 });
    }

    const body = await request.json();
    if (body.label !== undefined) chat.label = String(body.label).trim();
    if (body.chatId !== undefined) chat.chatId = String(body.chatId).trim();
    if (typeof body.isActive === 'boolean') chat.isActive = body.isActive;
    if (body.scopes !== undefined) {
      const scopes: string[] = Array.isArray(body.scopes) ? body.scopes : [];
      if (!scopes.every((s) => isNotificationDomain(String(s)))) {
        return NextResponse.json({ success: false, message: 'Invalid scopes' }, { status: 400 });
      }
      chat.scopes = scopes;
    }

    await chat.save();
    return NextResponse.json({ success: true, message: 'Chat updated', data: { chat } });
  } catch (error) {
    console.error('Telegram chat update error:', error);
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
    const chat = await TelegramChat.findByIdAndDelete(id);
    if (!chat) {
      return NextResponse.json({ success: false, message: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Chat deleted' });
  } catch (error) {
    console.error('Telegram chat delete error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
