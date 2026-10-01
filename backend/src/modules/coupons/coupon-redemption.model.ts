import { model, Schema, Types } from 'mongoose'

const couponRedemptionSchema = new Schema({
  couponId: { type: Types.ObjectId, ref: 'Coupon', required: true },
  userId: { type: Types.ObjectId, ref: 'User' },
  orderId: { type: Types.ObjectId, ref: 'Order', required: true, unique: true },
  code: { type: String, uppercase: true, trim: true, maxlength: 80, required: true },
  discountAmount: { type: Number, min: 0, validate: Number.isSafeInteger, required: true },
  currency: { type: String, uppercase: true, minlength: 3, maxlength: 3, required: true },
  redeemedAt: { type: Date, default: Date.now },
  reversedAt: { type: Date },
}, { timestamps: true, strict: 'throw' })

couponRedemptionSchema.index({ couponId: 1, userId: 1, reversedAt: 1 })

export const CouponRedemption = model('CouponRedemption', couponRedemptionSchema)