import { model, Schema, Types } from 'mongoose'

const promotionSchema = new Schema({
  name: { type: String, trim: true, maxlength: 160, required: true },
  internalCode: { type: String, uppercase: true, trim: true, maxlength: 80, unique: true, sparse: true },
  description: { type: String, trim: true, maxlength: 1000 },
  promotionType: { type: String, enum: ['percentage', 'fixed_amount', 'buy_x_get_y', 'free_shipping'], required: true },
  discountPercentBasisPoints: { type: Number, min: 1, max: 10000, validate: Number.isSafeInteger },
  discountAmount: { type: Number, min: 1, validate: Number.isSafeInteger },
  currency: { type: String, uppercase: true, minlength: 3, maxlength: 3 },
  buyQuantity: { type: Number, min: 1, validate: Number.isSafeInteger },
  getQuantity: { type: Number, min: 1, validate: Number.isSafeInteger },
  getPercentBasisPoints: { type: Number, min: 1, max: 10000, validate: Number.isSafeInteger },
  getProductIds: [{ type: Types.ObjectId, ref: 'Product' }],
  minimumSubtotalAmount: { type: Number, min: 0, validate: Number.isSafeInteger, default: 0 },
  maximumDiscountAmount: { type: Number, min: 0, validate: Number.isSafeInteger },
  usageLimit: { type: Number, min: 1, validate: Number.isSafeInteger },
  redemptionCount: { type: Number, min: 0, validate: Number.isSafeInteger, default: 0 },
  productIds: [{ type: Types.ObjectId, ref: 'Product' }],
  categoryIds: [{ type: Types.ObjectId, ref: 'Category' }],
  priority: { type: Number, min: 0, default: 0 },
  stackable: { type: Boolean, default: false },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  status: { type: String, enum: ['draft', 'scheduled', 'active', 'paused', 'expired', 'archived'], default: 'draft', required: true, index: true },
  createdBy: { type: Types.ObjectId, ref: 'User' },
}, { timestamps: true, strict: 'throw' })

promotionSchema.index({ status: 1, startsAt: 1, endsAt: 1, priority: -1 })
promotionSchema.index({ productIds: 1, status: 1 })
promotionSchema.index({ categoryIds: 1, status: 1 })

export const Promotion = model('Promotion', promotionSchema)