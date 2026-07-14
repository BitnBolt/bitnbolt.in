import mongoose from 'mongoose';

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'interview'
  | 'offered'
  | 'rejected'
  | 'withdrawn';

export interface ICareerApplication extends mongoose.Document {
  jobId: mongoose.Types.ObjectId;
  jobTitle: string;
  jobSlug?: string;
  fullName: string;
  email: string;
  phone: string;
  college?: string;
  degree?: string;
  graduationYear?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  preferredTrack?: string;
  coverLetter?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  status: ApplicationStatus;
  adminNotes?: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const careerApplicationSchema = new mongoose.Schema<ICareerApplication>({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CareerJob',
    required: true,
    index: true,
  },
  jobTitle: { type: String, required: true },
  jobSlug: { type: String },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  college: { type: String, trim: true },
  degree: { type: String, trim: true },
  graduationYear: { type: String, trim: true },
  linkedin: { type: String, trim: true },
  github: { type: String, trim: true },
  portfolio: { type: String, trim: true },
  preferredTrack: { type: String, trim: true },
  coverLetter: { type: String },
  resumeUrl: { type: String },
  resumeFileName: { type: String },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'interview', 'offered', 'rejected', 'withdrawn'],
    default: 'submitted',
    index: true,
  },
  adminNotes: { type: String },
  source: { type: String, default: 'career.bitnbolt.in' },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

careerApplicationSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

careerApplicationSchema.index({ email: 1, jobId: 1 });
careerApplicationSchema.index({ createdAt: -1 });

const CareerApplication =
  mongoose.models.CareerApplication ||
  mongoose.model<ICareerApplication>('CareerApplication', careerApplicationSchema);

export default CareerApplication;
