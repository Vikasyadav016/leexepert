import { model, Schema, Types } from 'mongoose'

const refundSchema = new Schema({
  orderId: { type: Types.ObjectId, ref: 'Order', required: true, index: true },
  paymentId: { type: Types.ObjectId, ref: 'Payment', required: true },
  returnRequestId: { type: Types.ObjectId, ref: 'ReturnRequest' },
  userId: { type: Types.ObjectId, ref: 'User' },
  amount: { type: Number, min: 1, validate: Number.isSafeInteger, required: true },
  currency: { type: String, uppercase: true, minlength: 3, maxlength: 3, match: /^[A-Z]{3}$/, required: true },
  reason: { type: String, enum: ['return', 'cancellation', 'duplicate', 'goodwill', 'chargeback', 'other'], required: true },
  status: { type: String, enum: ['pending', 'processing', 'succeeded', 'failed', 'cancelled'], default: 'pending', required: true, index: true },
  providerRefundId: { type: String, trim: true, maxlength: 200 },
  idempotencyKey: { type: String, trim: true, maxlength: 160, unique: true, required: true },
  requestedBy: { type: Types.ObjectId, ref: 'User' },
  failureReason: { type: String, trim: true, maxlength: 1000 },
  processedAt: { type: Date },
}, { timestamps: true, strict: 'throw' })

refundSchema.index({ paymentId: 1, status: 1, createdAt: -1 })
refundSchema.index({ providerRefundId: 1 }, { unique: true, sparse: true })

export const Refund = model('Refund', refundSchema)