import { EventEmitter } from 'events';
import { connectDB } from '@/lib/db';
import TelegramBot from '@/models/TelegramBot';
import TelegramChat from '@/models/TelegramChat';
import NotificationLog from '@/models/NotificationLog';
import {
  domainLabel,
  isNotificationDomain,
  type NotificationDomainId,
} from '@/lib/notification-domains';

type NotifySeverity = 'info' | 'warning' | 'error' | 'critical';

export type NotifyPayload = {
  domain: NotificationDomainId | string;
  event: string;
  title: string;
  body: string;
  severity?: NotifySeverity;
  meta?: Record<string, unknown>;
};

const bus = new EventEmitter();
bus.setMaxListeners(50);

export function onNotificationLog(listener: (log: unknown) => void) {
  bus.on('log', listener);
  return () => bus.off('log', listener);
}

function emitLog(log: unknown) {
  bus.emit('log', log);
}

function formatTelegramHtml(payload: NotifyPayload): string {
  const domain = domainLabel(payload.domain);
  const severity = (payload.severity || 'info').toUpperCase();
  const safeTitle = escapeHtml(payload.title);
  const safeBody = escapeHtml(payload.body);
  const safeEvent = escapeHtml(payload.event);
  return (
    `<b>[${escapeHtml(severity)}] ${escapeHtml(domain)}</b>\n` +
    `<b>${safeTitle}</b>\n` +
    `${safeBody}\n` +
    `<i>event:</i> <code>${safeEvent}</code>`
  );
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function sendTelegramMessage(botToken: string, chatId: string, text: string) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  const data = (await res.json()) as {
    ok?: boolean;
    description?: string;
    result?: { message_id?: number };
  };
  if (!res.ok || !data.ok) {
    throw new Error(data.description || `Telegram API ${res.status}`);
  }
  return String(data.result?.message_id || '');
}

/**
 * Fan-out a notification to every active Telegram chat whose scopes include the domain.
 * Always writes NotificationLog rows for admin monitoring.
 */
export async function notify(payload: NotifyPayload): Promise<void> {
  try {
    if (!isNotificationDomain(payload.domain)) {
      console.warn('notify: unknown domain', payload.domain);
      return;
    }

    await connectDB();

    const chats = await TelegramChat.find({
      isActive: true,
      scopes: payload.domain,
    }).populate('botId');

    const activeChats = chats.filter((chat) => {
      const bot = chat.botId as unknown as { isActive?: boolean; botToken?: string; name?: string; _id?: unknown } | null;
      return bot && bot.isActive !== false && bot.botToken;
    });

    if (activeChats.length === 0) {
      const log = await NotificationLog.create({
        domain: payload.domain,
        event: payload.event,
        title: payload.title,
        body: payload.body,
        severity: payload.severity || 'info',
        status: 'skipped',
        error: 'No active Telegram chats configured for this domain',
        meta: payload.meta,
      });
      emitLog(log.toObject());
      return;
    }

    const text = formatTelegramHtml(payload);

    await Promise.all(
      activeChats.map(async (chat) => {
        const bot = chat.botId as unknown as {
          _id: { toString(): string };
          name: string;
          botToken: string;
        };

        try {
          const messageId = await sendTelegramMessage(bot.botToken, chat.chatId, text);
          const log = await NotificationLog.create({
            domain: payload.domain,
            event: payload.event,
            title: payload.title,
            body: payload.body,
            severity: payload.severity || 'info',
            status: 'sent',
            botId: bot._id,
            botName: bot.name,
            chatId: chat.chatId,
            chatLabel: chat.label,
            telegramMessageId: messageId,
            meta: payload.meta,
          });
          emitLog(log.toObject());
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Telegram send failed';
          const log = await NotificationLog.create({
            domain: payload.domain,
            event: payload.event,
            title: payload.title,
            body: payload.body,
            severity: payload.severity || 'info',
            status: 'failed',
            botId: bot._id,
            botName: bot.name,
            chatId: chat.chatId,
            chatLabel: chat.label,
            error: message,
            meta: payload.meta,
          });
          emitLog(log.toObject());
        }
      })
    );
  } catch (err) {
    console.error('notify() failed:', err);
  }
}

/** Fire-and-forget notify (never throws to callers). */
export function notifyAsync(payload: NotifyPayload): void {
  void notify(payload);
}

export async function reportSystemError(input: {
  event: string;
  title: string;
  body: string;
  meta?: Record<string, unknown>;
}): Promise<void> {
  await notify({
    domain: 'system',
    event: input.event,
    title: input.title,
    body: input.body.slice(0, 3500),
    severity: 'error',
    meta: input.meta,
  });
}

export function reportSystemErrorAsync(input: {
  event: string;
  title: string;
  body: string;
  meta?: Record<string, unknown>;
}): void {
  void reportSystemError(input);
}

/** Verify bot token with Telegram getMe */
export async function verifyBotToken(botToken: string): Promise<{ ok: boolean; username?: string; error?: string }> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const data = (await res.json()) as {
      ok?: boolean;
      description?: string;
      result?: { username?: string };
    };
    if (!data.ok) {
      return { ok: false, error: data.description || 'Invalid token' };
    }
    return { ok: true, username: data.result?.username };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Verification failed' };
  }
}

// keep import used for types in populate path
void TelegramBot;
