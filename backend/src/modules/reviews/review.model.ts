import { model, Schema, Types } from 'mongoose'

const reviewSchema = new Schema({
  productId: { type: Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: Types.ObjectId, ref: 'ProductVariant' },
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  orderId: { type: Types.ObjectId, ref: 'Order', required: true },
  rating: { type: Number, min: 1, max: 5, validate: Number.isInteger, required: true },
  title: { type: String, trim: true, maxlength: 120 },
  body: { type: String, trim: true, maxlength: 5000, required: true },
  mediaUrls: { type: [String], default: [], validate: (urls: string[]) => urls.length <= 8 },
  verifiedPurchase: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'published', 'rejected', 'hidden'], default: 'pending', required: true, index: true },
  moderationNote: { type: String, trim: true, maxlength: 1000, select: false },
  helpfulCount: { type: Number, min: 0, validate: Number.isSafeInteger, default: 0 },
  publishedAt: { type: Date },
}, { timestamps: true, strict: 'throw' })

reviewSchema.index({ productId: 1, userId: 1 }, { unique: true })
reviewSchema.index({ productId: 1, status: 1, createdAt: -1 })
reviewSchema.index({ userId: 1, createdAt: -1 })

export const Review = model('Review', reviewSchema)