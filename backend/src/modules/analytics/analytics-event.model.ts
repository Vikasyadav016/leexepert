import { model, Schema, Types } from 'mongoose'

const analyticsEventSchema = new Schema({
  eventName: { type: String, trim: true, maxlength: 120, required: true, index: true },
  occurredAt: { type: Date, default: Date.now, required: true },
  userId: { type: Types.ObjectId, ref: 'User' },
  anonymousId: { type: String, trim: true, maxlength: 160 },
  sessionId: { type: String, trim: true, maxlength: 160 },
  productId: { type: Types.ObjectId, ref: 'Product' },
  orderId: { type: Types.ObjectId, ref: 'Order' },
  source: { type: String, trim: true, maxlength: 80 },
  properties: { type: Map, of: Schema.Types.Mixed, default: {} },
  expiresAt: { type: Date },
}, { timestamps: { createdAt: true, updatedAt: false }, strict: 'throw' })

analyticsEventSchema.index({ eventName: 1, occurredAt: -1 })
analyticsEventSchema.index({ userId: 1, occurredAt: -1 })
analyticsEventSchema.index({ sessionId: 1, occurredAt: -1 })
analyticsEventSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true })

export const AnalyticsEvent = model('AnalyticsEvent', analyticsEventSchema)