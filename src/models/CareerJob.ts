import mongoose from 'mongoose';

export type JobType =
  | 'internship'
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'trainee'
  | 'cap';

export interface ICareerJob extends mongoose.Document {
  title: string;
  slug: string;
  type: JobType;
  category: string;
  department: string;
  location: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  duration?: string;
  stipend?: string;
  openings?: number;
  applicationDeadline?: Date;
  isPublished: boolean;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const careerJobSchema = new mongoose.Schema<ICareerJob>({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['internship', 'full_time', 'part_time', 'contract', 'trainee', 'cap'],
    default: 'internship',
    required: true,
  },
  category: {
    type: String,
    required: [true, 'Category / track is required'],
    trim: true,
  },
  department: {
    type: String,
    default: '',
    trim: true,
  },
  location: {
    type: String,
    default: 'Bengaluru',
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  responsibilities: [{ type: String, trim: true }],
  requirements: [{ type: String, trim: true }],
  duration: { type: String, trim: true },
  stipend: { type: String, trim: true },
  openings: { type: Number, min: 0 },
  applicationDeadline: { type: Date },
  isPublished: { type: Boolean, default: false },
  isOpen: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

careerJobSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

careerJobSchema.index({ isPublished: 1, isOpen: 1 });
careerJobSchema.index({ type: 1, category: 1 });
careerJobSchema.index({ title: 'text', description: 'text', category: 'text' });

const CareerJob =
  mongoose.models.CareerJob || mongoose.model<ICareerJob>('CareerJob', careerJobSchema);

export default CareerJob;
