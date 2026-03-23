import mongoose from 'mongoose';

export interface IVendor extends mongoose.Document {
    seller_name: string;
    email: string;
    password?: string;
    phone: string;
    shopName: string;
    gstNumber?: string;
    profileImage?:string;
    pickupAddress?: {
        addressType: 'primary' | 'secondary' | 'warehouse';
        buildingNumber: string;
        streetName: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        landmark?: string;
    };
    shiprocketPickupId?: string;
    approved: boolean;
    suspended: boolean;
    suspensionReason?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationTokenExpiry?: Date;
    phoneVerificationOTP?: string;
    phoneVerificationOTPExpiry?: Date;
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
    profileImage:{
        type: String,
    },
    pickupAddress: {
        addressType: {
            type: String,
            enum: ['primary', 'secondary', 'warehouse'],
        },
        buildingNumber: {
            type: String,
        },
        streetName: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        postalCode: {
            type: String,
        },
        country: {
            type: String,
        },
        landmark: {
            type: String,
            default: null,
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
    suspended: {
        type: Boolean,
        default: false,
    },
    suspensionReason: {
        type: String,
        default: null,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    phoneVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: {
        type: String,
        default: null,
    },
    emailVerificationTokenExpiry: {
        type: Date,
        default: null,
    },
    phoneVerificationOTP: {
        type: String,
        default: null,
    },
    phoneVerificationOTPExpiry: {
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
