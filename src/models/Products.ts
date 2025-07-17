import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
    name: string;
    slug: string;
    description: string;
    category: string;
    subCategory?: string;
    brand: string;
    whatsInTheBox: string[];
    aboutItem: string[];
    features: Array<{
        key: string;
        value: string;
    }>;
    images: string[];
    basePrice: number;          // Price set by vendor
    profitMargin: number;       // Percentage markup (default 80%)
    discount: number;           // Percentage discount (default 0%)
    finalPrice: number;         // Calculated price after margin and discount
    stock: number;
    minimumOrderQuantity: number;
    tags: string[];
    vendorId: mongoose.Types.ObjectId;  // References Vendor
    variants?: mongoose.Types.ObjectId[];
    rating: {
        average: number;
        count: number;
    };
    specifications: Array<{
        key: string;
        value: string;
    }>;
    isFeatured: boolean;
    isPublished: boolean;       // Vendor can save as draft
    isSuspended: boolean;       // Admin can suspend product
    suspensionReason?: string;
    returnPolicy: {
        isReturnable: boolean;
        returnWindow: number;   // Number of days
        returnConditions: string[];
    };
    shippingInfo: {
        weight: number;         // in grams
        dimensions: {
            length: number;     // in cm
            width: number;      // in cm
            height: number;     // in cm
        };
    };
    seo: {
        metaTitle?: string;
        metaDescription?: string;
        keywords: string[];
    };
    stats: {
        views: number;
        sales: number;
        lastSold?: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
    },
    whatsInTheBox: [{
        type: String,
        required: [true, 'What\'s in the box is required'],
    }],
    aboutItem: [{
        type: String,
        required: [true, 'About this item is required'],
    }],
    features: [{
        key: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        }
    }],
    images: [{
        type: String,
        required: [true, 'At least one product image is required'],
    }],
    basePrice: {
        type: Number,
        required: [true, 'Base price is required'],
        min: [0, 'Base price cannot be negative'],
    },
    profitMargin: {
        type: Number,
        default: 80,  // 80% markup by default
        min: [0, 'Profit margin cannot be negative'],
        max: [500, 'Profit margin cannot exceed 500%'],
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%'],
    },
    finalPrice: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    subCategory: {
        type: String,
    },
    brand: {
        type: String,
        required: [true, 'Brand is required'],
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
    },
    minimumOrderQuantity: {
        type: Number,
        default: 1,
        min: [1, 'Minimum order quantity must be at least 1'],
    },
    tags: [{
        type: String,
    }],
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: [true, 'Vendor ID is required'],
    },
    variants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        count: {
            type: Number,
            default: 0,
        }
    },
    specifications: [{
        key: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
    }],
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    isSuspended: {
        type: Boolean,
        default: false,
    },
    suspensionReason: {
        type: String,
    },
    returnPolicy: {
        isReturnable: {
            type: Boolean,
            default: true,
        },
        returnWindow: {
            type: Number,
            default: 7,  // 7 days by default
        },
        returnConditions: [{
            type: String,
        }],
    },
    shippingInfo: {
        weight: {
            type: Number,
            required: [true, 'Product weight is required'],
        },
        dimensions: {
            length: {
                type: Number,
                required: [true, 'Product length is required'],
            },
            width: {
                type: Number,
                required: [true, 'Product width is required'],
            },
            height: {
                type: Number,
                required: [true, 'Product height is required'],
            },
        },
    },
    seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [{
            type: String,
        }],
    },
    stats: {
        views: {
            type: Number,
            default: 0,
        },
        sales: {
            type: Number,
            default: 0,
        },
        lastSold: Date,
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
    timestamps: false  // Disable automatic timestamps
});

// Middleware to calculate final price before saving
productSchema.pre('save', function(next) {
    // Calculate price with profit margin
    const priceWithMargin = this.basePrice * (1 + this.profitMargin / 100);
    
    // Apply discount if any
    this.finalPrice = priceWithMargin * (1 - this.discount / 100);
    
    const now = new Date();
    this.updatedAt = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5.5 hours for IST
    next();
});

// Indexes for better search performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ vendorId: 1 });
productSchema.index({ parentProductId: 1 });  // Index for variant lookups
productSchema.index({ isFeatured: 1 });
productSchema.index({ isPublished: 1, isSuspended: 1 });

const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
