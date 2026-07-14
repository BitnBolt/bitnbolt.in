import mongoose from 'mongoose';
import { NOTIFICATION_DOMAIN_IDS } from '@/lib/notification-domains';

export interface ITelegramChat extends mongoose.Document {
  botId: mongoose.Types.ObjectId;
  chatId: string;
  label: string;
  scopes: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const telegramChatSchema = new mongoose.Schema<ITelegramChat>(
  {
    botId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TelegramBot',
      required: true,
      index: true,
    },
    chatId: {
      type: String,
      required: [true, 'Telegram chat ID is required'],
      trim: true,
    },
    label: {
      type: String,
      required: [true, 'Chat label is required'],
      trim: true,
    },
    scopes: {
      type: [String],
      default: [],
      validate: {
        validator(scopes: string[]) {
          return scopes.every((s) =>
            (NOTIFICATION_DOMAIN_IDS as readonly string[]).includes(s)
          );
        },
        message: 'Invalid notification scope',
      },
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
  },
  { collection: 'telegramchats' }
);

telegramChatSchema.index({ botId: 1, chatId: 1 }, { unique: true });
telegramChatSchema.index({ scopes: 1, isActive: 1 });

telegramChatSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const TelegramChat =
  mongoose.models.TelegramChat ||
  mongoose.model<ITelegramChat>('TelegramChat', telegramChatSchema);

export default TelegramChat;
