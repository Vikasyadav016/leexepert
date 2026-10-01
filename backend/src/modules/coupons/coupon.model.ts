import { model, Schema, Types } from 'mongoose'

const couponSchema = new Schema({
  code: { type: String, uppercase: true, trim: true, maxlength: 80, unique: true, required: true },
  description: { type: String, trim: true, maxlength: 500 },
  discountType: { type: String, enum: ['percentage', 'fixed_amount'], required: true },
  discountPercentBasisPoints: { type: Number, min: 1, max: 10000, validate: Number.isSafeInteger },
  discountAmount: { type: Number, min: 1, validate: Number.isSafeInteger },
  currency: { type: String, uppercase: true, minlength: 3, maxlength: 3 },
  minimumSubtotalAmount: { type: Number, min: 0, validate: Number.isSafeInteger, default: 0 },
  maximumDiscountAmount: { type: Number, min: 0, validate: Number.isSafeInteger },
  usageLimit: { type: Number, min: 1, validate: Number.isSafeInteger },
  perUserLimit: { type: Number, min: 1, validate: Number.isSafeInteger, default: 1 },
  redemptionCount: { type: Number, min: 0, validate: Number.isSafeInteger, default: 0 },
  productIds: [{ type: Types.ObjectId, ref: 'Product' }],
  categoryIds: [{ type: Types.ObjectId, ref: 'Category' }],
  firstOrderOnly: { type: Boolean, default: false },
  stackable: { type: Boolean, default: false },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  status: { type: String, enum: ['draft', 'scheduled', 'active', 'paused', 'expired', 'archived'], default: 'draft', required: true, index: true },
  createdBy: { type: Types.ObjectId, ref: 'User' },
}, { timestamps: true, strict: 'throw' })

couponSchema.index({ status: 1, startsAt: 1, endsAt: 1 })

export const Coupon = model('Coupon', couponSchema)