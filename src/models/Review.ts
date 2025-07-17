import mongoose from 'mongoose';

export interface IReview extends mongoose.Document {
    productId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema = new mongoose.Schema<IReview>({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required'],
        index: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true,
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
        type: String,
        required: [true, 'Review comment is required'],
        trim: true,
        maxlength: [500, 'Comment cannot exceed 500 characters'],
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
    }
});

// Indexes for better query performance
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });

// Update the updatedAt timestamp before saving
reviewSchema.pre('save', function(next) {
    const now = new Date();
    this.updatedAt = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5.5 hours for IST
    next();
});

// Middleware to update product rating after review changes
reviewSchema.post('save', async function(doc) {
    const Review = this.model('Review');
    const Product = mongoose.model('Product');

    const stats = await Review.aggregate([
        { $match: { productId: doc.productId }},
        { $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            count: { $sum: 1 }
        }}
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(doc.productId, {
            'rating.average': Math.round(stats[0].averageRating * 10) / 10,  // Round to 1 decimal
            'rating.count': stats[0].count
        });
    }
});

// Ensure one review per product per user
reviewSchema.index(
    { productId: 1, userId: 1 },
    { unique: true, name: 'one_review_per_product_per_user' }
);

const Review = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);

export default Review;