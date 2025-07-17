import mongoose from 'mongoose';

export interface IOrder extends mongoose.Document {
    orderId: string;  // Custom order ID (e.g., BB-2024-0001)
    userId: mongoose.Types.ObjectId;
    items: Array<{
        productId: mongoose.Types.ObjectId;
        vendorId: mongoose.Types.ObjectId;
        quantity: number;
        basePrice: number;
        profitMargin: number;
        discount: number;
        finalPrice: number;
    }>;
    shippingAddress: {
        fullName: string;
        phoneNumber: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        pincode: string;
        landmark?: string;
    };
    billingAddress: {
        fullName: string;
        phoneNumber: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        pincode: string;
        landmark?: string;
    };
    paymentDetails: {
        method: 'cod' | 'online';
        status: 'pending' | 'paid' | 'failed' | 'refunded';
        transactionId?: string;
        paidAt?: Date;
    };
    orderSummary: {
        itemsTotal: number;      // Sum of all items' finalPrice * quantity
        shippingCharge: number;
        tax: number;
        totalAmount: number;     // itemsTotal + shippingCharge + tax
    };
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
    statusHistory: Array<{
        status: string;
        comment?: string;
        updatedBy?: string;
        timestamp: Date;
    }>;
    deliveryDetails: {
        provider?: string;       // Shipping partner name
        trackingId?: string;
        expectedDeliveryDate?: Date;
        actualDeliveryDate?: Date;
    };
    cancellation?: {
        reason: string;
        requestedBy: 'user' | 'vendor' | 'admin';
        requestedAt: Date;
        status: 'pending' | 'approved' | 'rejected';
        processedAt?: Date;
        refundStatus?: 'pending' | 'processed' | 'completed';
    };
    return?: {
        reason: string;
        requestedAt: Date;
        status: 'pending' | 'approved' | 'rejected';
        processedAt?: Date;
        pickupDate?: Date;
        receivedDate?: Date;
        refundStatus?: 'pending' | 'processed' | 'completed';
    };
    invoice?: {
        number: string;
        url: string;
        generatedAt: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new mongoose.Schema<IOrder>({
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        basePrice: {
            type: Number,
            required: true,
        },
        profitMargin: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        finalPrice: {
            type: Number,
            required: true,
        },
    }],
    shippingAddress: {
        fullName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        addressLine1: {
            type: String,
            required: true,
        },
        addressLine2: String,
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
        landmark: String,
    },
    billingAddress: {
        fullName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        addressLine1: {
            type: String,
            required: true,
        },
        addressLine2: String,
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
        landmark: String,
    },
    paymentDetails: {
        method: {
            type: String,
            enum: ['cod', 'online'],
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },
        transactionId: String,
        paidAt: Date,
    },
    orderSummary: {
        itemsTotal: {
            type: Number,
            required: true,
        },
        shippingCharge: {
            type: Number,
            required: true,
        },
        tax: {
            type: Number,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'pending',
    },
    statusHistory: [{
        status: {
            type: String,
            required: true,
        },
        comment: String,
        updatedBy: String,
        timestamp: {
            type: Date,
            default: () => {
                const now = new Date();
                return new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5.5 hours for IST
            }
        },
    }],
    deliveryDetails: {
        provider: String,
        trackingId: String,
        expectedDeliveryDate: Date,
        actualDeliveryDate: Date,
    },
    cancellation: {
        reason: String,
        requestedBy: {
            type: String,
            enum: ['user', 'vendor', 'admin'],
        },
        requestedAt: Date,
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
        },
        processedAt: Date,
        refundStatus: {
            type: String,
            enum: ['pending', 'processed', 'completed'],
        },
    },
    return: {
        reason: String,
        requestedAt: Date,
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
        },
        processedAt: Date,
        pickupDate: Date,
        receivedDate: Date,
        refundStatus: {
            type: String,
            enum: ['pending', 'processed', 'completed'],
        },
    },
    invoice: {
        number: String,
        url: String,
        generatedAt: Date,
    },
    createdAt: {
        type: Date,
        default: () => {
            const now = new Date();
            return new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5.5 hours for IST
        }
    },
    updatedAt: {
        type: Date,
        default: () => {
            const now = new Date();
            return new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5.5 hours for IST
        }
    },
}, {
    timestamps: false
});

// Indexes for better query performance
orderSchema.index({ orderId: 1 }, { unique: true });
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ 'items.vendorId': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'paymentDetails.status': 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to update timestamps
orderSchema.pre('save', function(next) {
    const now = new Date();
    this.updatedAt = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5.5 hours for IST
    
    // Add status change to history if status changed
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            timestamp: this.updatedAt
        });
    }
    
    next();
});

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;