import { model, Schema, Types } from 'mongoose'

const wishlistEntrySchema = new Schema({
  productId: { type: Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: Types.ObjectId, ref: 'ProductVariant' },
  addedAt: { type: Date, default: Date.now },
}, { _id: true })

const wishlistSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', unique: true, required: true },
  name: { type: String, trim: true, maxlength: 80, default: 'My wishlist' },
  entries: { type: [wishlistEntrySchema], default: [], validate: (entries: unknown[]) => entries.length <= 500 },
  isPublic: { type: Boolean, default: false },
  shareTokenHash: { type: String, select: false, maxlength: 128 },
}, { timestamps: true, strict: 'throw' })

wishlistSchema.index({ shareTokenHash: 1 }, { unique: true, sparse: true })

export const Wishlist = model('Wishlist', wishlistSchema)