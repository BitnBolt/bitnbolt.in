import mongoose from 'mongoose';

export interface IAdmin extends mongoose.Document {
    admin_name: string;
    email: string;
    password: string;
    role: 'super_admin' | 'admin';
    profileImage?: string;
    permissions: string[];
    isActive: boolean;
    lastLogin?: Date;
    resetPasswordToken?: string;
    resetPasswordTokenExpiry?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const adminSchema = new mongoose.Schema<IAdmin>({
    admin_name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        enum: ['super_admin', 'admin'],
        default: 'admin',
        required: [true, 'Role is required'],
    },
    profileImage: {
        type: String,
    },
    permissions: [{
        type: String,
        default: [],
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    resetPasswordToken: {
        type: String,
        default: null,
    },
    resetPasswordTokenExpiry: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', adminSchema);

export default Admin;
