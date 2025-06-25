import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password?: string;
    image?: string;
    emailVerified: boolean;
    provider: string;
    role: string;
    createdAt: Date;
    phoneNumber: string | null;
    resetPasswordOTP?: string;
    resetPasswordOTPExpiry?: Date;
    verificationToken?: string;
    verificationTokenExpiry?: Date;
    deliveryAddress: {
        street: string | null;
        city: string | null;
        state: string | null;
        postalCode: string | null;
        country: string | null;
    };
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
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
    },
    image: {
        type: String,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    provider: {
        type: String,
        default: 'credentials'
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    phoneNumber: {
        type: String,
        default: null
    },
    resetPasswordOTP: {
        type: String,
        default: null
    },
    resetPasswordOTPExpiry: {
        type: Date,
        default: null
    },
    verificationToken: {
        type: String,
        default: null
    },
    verificationTokenExpiry: {
        type: Date,
        default: null
    },
    deliveryAddress: {
        street: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        },
        state: {
            type: String,
            default: null
        },
        postalCode: {
            type: String,
            default: null
        },
        country: {
            type: String,
            default: null
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User; 