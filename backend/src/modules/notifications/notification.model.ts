import { model, Schema, Types } from 'mongoose'

const notificationSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', index: true },
  recipientEmail: { type: String, lowercase: true, trim: true, maxlength: 254 },
  recipientPhone: { type: String, trim: true, maxlength: 24 },
  channel: { type: String, enum: ['email', 'sms', 'push', 'in_app'], required: true },
  eventType: { type: String, trim: true, maxlength: 100, required: true },
  templateKey: { type: String, trim: true, maxlength: 120 },
  subject: { type: String, trim: true, maxlength: 200 },
  payload: { type: Map, of: Schema.Types.Mixed, default: {} },
  status: { type: String, enum: ['queued', 'processing', 'sent', 'delivered', 'failed', 'cancelled'], default: 'queued', required: true, index: true },
  providerMessageId: { type: String, trim: true, maxlength: 200 },
  failureReason: { type: String, trim: true, maxlength: 1000 },
  attempts: { type: Number, min: 0, validate: Number.isSafeInteger, default: 0 },
  scheduledAt: { type: Date, default: Date.now },
  sentAt: { type: Date },
  readAt: { type: Date },
  deduplicationKey: { type: String, trim: true, maxlength: 200, unique: true, sparse: true },
}, { timestamps: true, strict: 'throw' })

notificationSchema.index({ status: 1, scheduledAt: 1 })
notificationSchema.index({ userId: 1, readAt: 1, createdAt: -1 })

export const Notification = model('Notification', notificationSchema)