import { model, Schema, Types } from 'mongoose'

const promotionRedemptionSchema = new Schema({
  promotionId: { type: Types.ObjectId, ref: 'Promotion', required: true },
  orderId: { type: Types.ObjectId, ref: 'Order', required: true },
  userId: { type: Types.ObjectId, ref: 'User' },
  discountAmount: { type: Number, min: 0, validate: Number.isSafeInteger, required: true },
  currency: { type: String, uppercase: true, minlength: 3, maxlength: 3, required: true },
  appliedAt: { type: Date, default: Date.now },
  reversedAt: { type: Date },
}, { timestamps: true, strict: 'throw' })

promotionRedemptionSchema.index({ promotionId: 1, orderId: 1 }, { unique: true })
promotionRedemptionSchema.index({ promotionId: 1, userId: 1, reversedAt: 1 })

export const PromotionRedemption = model('PromotionRedemption', promotionRedemptionSchema)