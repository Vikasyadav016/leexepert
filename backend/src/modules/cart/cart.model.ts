import { model, Schema, Types } from 'mongoose'

const cartLineSchema = new Schema({
  productId: { type: Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: Types.ObjectId, ref: 'ProductVariant', required: true },
  quantity: { type: Number, min: 1, max: 100, validate: Number.isSafeInteger, required: true },
  addedAt: { type: Date, default: Date.now },
}, { _id: false })

const cartSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User' },
  sessionId: { type: String, trim: true, maxlength: 160 },
  lines: { type: [cartLineSchema], default: [], validate: (lines: unknown[]) => lines.length <= 100 },
  currency: { type: String, uppercase: true, minlength: 3, maxlength: 3, default: 'USD' },
  appliedCouponCode: { type: String, uppercase: true, trim: true, maxlength: 80 },
  status: { type: String, enum: ['active', 'converted', 'abandoned'], default: 'active', required: true },
  expiresAt: { type: Date },
  convertedToOrderId: { type: Types.ObjectId, ref: 'Order' },
}, { timestamps: true, strict: 'throw' })

cartSchema.index({ userId: 1 }, { unique: true, partialFilterExpression: { userId: { $type: 'objectId' }, status: 'active' } })
cartSchema.index({ sessionId: 1 }, { unique: true, partialFilterExpression: { sessionId: { $type: 'string' }, status: 'active' } })
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true })

export const Cart = model('Cart', cartSchema)