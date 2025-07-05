import mongoose from 'mongoose';

export interface IVendor extends mongoose.Document {
    seller_name: string;
    email: string;
    password?: string;
    phone: string;
    shopName: string;
    gstNumber?: string;
    pickupAddress: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    shiprocketPickupId?: string;
    approved: boolean;
    emailVerified: boolean;
    verificationToken?: string;
    verificationTokenExpiry?: Date;
    resetPasswordOTP?: string;
    resetPasswordOTPExpiry?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const vendorSchema = new mongoose.Schema<IVendor>({
    seller_name: {
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
    phone: {
        type: String,
        required: [true, 'Phone is required'],
    },
    shopName: {
        type: String,
        required: [true, 'Shop name is required'],
    },
    gstNumber: {
        type: String,
    },
    pickupAddress: {
        street: {
            type: String,
            required: [true, 'Street is required'],
        },
        city: {
            type: String,
            required: [true, 'City is required'],
        },
        state: {
            type: String,
            required: [true, 'State is required'],
        },
        pincode: {
            type: String,
            required: [true, 'Pincode is required'],
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
        },
    },
    shiprocketPickupId: {
        type: String,
        default: null,
    },
    approved: {
        type: Boolean,
        default: false,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        default: null,
    },
    verificationTokenExpiry: {
        type: Date,
        default: null,
    },
    resetPasswordOTP: {
        type: String,
        default: null,
    },
    resetPasswordOTPExpiry: {
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

const Vendor = mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', vendorSchema);

export default Vendor;
