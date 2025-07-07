import mongoose from 'mongoose';

export interface IVendor extends mongoose.Document {
    seller_name: string;
    email: string;
    password?: string;
    phone: string;
    shopName: string;
    gstNumber?: string;
    profileImage?:string;
    pickupAddresses: Array<{
        addressType: 'primary' | 'secondary' | 'warehouse';
        addressName: string;
        buildingNumber: string;
        streetName: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        landmark?: string;
        isDefault: boolean;
    }>;
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
    pickupAddresses: [{
        addressType: {
            type: String,
            enum: ['primary', 'secondary', 'warehouse'],
            default: 'primary',
            required: [true, 'Address type is required'],
        },
        addressName: {
            type: String,
            required: [true, 'Address name is required'],
        },
        buildingNumber: {
            type: String,
            required: [true, 'Building/House number is required'],
        },
        streetName: {
            type: String,
            required: [true, 'Street name is required'],
        },
        city: {
            type: String,
            required: [true, 'City is required'],
        },
        state: {
            type: String,
            required: [true, 'State is required'],
        },
        postalCode: {
            type: String,
            required: [true, 'Postal code is required'],
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
        },
        landmark: {
            type: String,
            default: null,
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
    }],
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
