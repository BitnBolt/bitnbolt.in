import mongoose from 'mongoose';
import { NOTIFICATION_DOMAIN_IDS } from '@/lib/notification-domains';

export type NotificationDeliveryStatus = 'pending' | 'sent' | 'failed' | 'skipped';

export interface INotificationLog extends mongoose.Document {
  domain: string;
  event: string;
  title: string;
  body: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  status: NotificationDeliveryStatus;
  botId?: mongoose.Types.ObjectId;
  botName?: string;
  chatId?: string;
  chatLabel?: string;
  telegramMessageId?: string;
  error?: string;
  meta?: Record<string, unknown>;
  createdAt: Date;
}

const notificationLogSchema = new mongoose.Schema<INotificationLog>(
  {
    domain: {
      type: String,
      required: true,
      enum: NOTIFICATION_DOMAIN_IDS,
      index: true,
    },
    event: { type: String, required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    severity: {
      type: String,
      enum: ['info', 'warning', 'error', 'critical'],
      default: 'info',
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'skipped'],
      default: 'pending',
      index: true,
    },
    botId: { type: mongoose.Schema.Types.ObjectId, ref: 'TelegramBot' },
    botName: String,
    chatId: String,
    chatLabel: String,
    telegramMessageId: String,
    error: String,
    meta: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: () => new Date(), index: true },
  },
  { collection: 'notificationlogs' }
);

notificationLogSchema.index({ createdAt: -1 });
notificationLogSchema.index({ domain: 1, createdAt: -1 });

const NotificationLog =
  mongoose.models.NotificationLog ||
  mongoose.model<INotificationLog>('NotificationLog', notificationLogSchema);

export default NotificationLog;
