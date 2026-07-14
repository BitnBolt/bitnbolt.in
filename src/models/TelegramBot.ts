import mongoose from 'mongoose';

export interface ITelegramBot extends mongoose.Document {
  name: string;
  botToken: string;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const telegramBotSchema = new mongoose.Schema<ITelegramBot>(
  {
    name: {
      type: String,
      required: [true, 'Internal bot name is required'],
      trim: true,
    },
    botToken: {
      type: String,
      required: [true, 'BotFather API token is required'],
      trim: true,
    },
    isActive: { type: Boolean, default: true },
    notes: { type: String, trim: true },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
  },
  { collection: 'telegrambots' }
);

telegramBotSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const TelegramBot =
  mongoose.models.TelegramBot ||
  mongoose.model<ITelegramBot>('TelegramBot', telegramBotSchema);

export default TelegramBot;
