import { model, Schema, Types } from 'mongoose'

const paymentSchema = new Schema({
  orderId: { type: Types.ObjectId, ref: 'Order', required: true, index: true },
  userId: { type: Types.ObjectId, ref: 'User' },
  provider: { type: String, enum: ['stripe', 'adyen', 'paypal', 'manual'], required: true },
  providerPaymentId: { type: String, trim: true, maxlength: 200 },
  providerCustomerId: { type: String, trim: true, maxlength: 200, select: false },
  amount: { type: Number, min: 0, validate: Number.isSafeInteger, required: true },
  currency: { type: String, uppercase: true, minlength: 3, maxlength: 3, match: /^[A-Z]{3}$/, required: true },
  status: { type: String, enum: ['requires_action', 'processing', 'authorized', 'captured', 'failed', 'cancelled', 'partially_refunded', 'refunded'], default: 'processing', required: true },
  paymentMethodType: { type: String, trim: true, maxlength: 40 },
  idempotencyKey: { type: String, trim: true, maxlength: 160, unique: true, required: true },
  failureCode: { type: String, trim: true, maxlength: 100 },
  failureMessage: { type: String, trim: true, maxlength: 500 },
  authorizedAt: { type: Date },
  capturedAt: { type: Date },
  failedAt: { type: Date },
  providerMetadata: { type: Map, of: Schema.Types.Mixed, select: false },
}, { timestamps: true, strict: 'throw' })

paymentSchema.index({ provider: 1, providerPaymentId: 1 }, { unique: true, partialFilterExpression: { providerPaymentId: { $type: 'string' } } })
paymentSchema.index({ orderId: 1, createdAt: -1 })

export const Payment = model('Payment', paymentSchema)