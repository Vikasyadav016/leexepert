import { model, Schema, Types } from 'mongoose'

const returnLineSchema = new Schema({
  orderLineId: { type: Types.ObjectId, required: true },
  productId: { type: Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: Types.ObjectId, ref: 'ProductVariant', required: true },
  quantity: { type: Number, min: 1, validate: Number.isSafeInteger, required: true },
  reason: { type: String, enum: ['changed_mind', 'fit', 'damaged', 'wrong_item', 'not_as_described', 'other'], required: true },
  condition: { type: String, enum: ['unopened', 'unused', 'worn', 'damaged'] },
  customerNote: { type: String, trim: true, maxlength: 1000 },
  imageUrls: { type: [String], default: [], validate: (urls: string[]) => urls.length <= 6 },
}, { _id: true })

const returnRequestSchema = new Schema({
  returnNumber: { type: String, uppercase: true, trim: true, maxlength: 48, unique: true, required: true },
  orderId: { type: Types.ObjectId, ref: 'Order', required: true, index: true },
  userId: { type: Types.ObjectId, ref: 'User', index: true },
  lines: { type: [returnLineSchema], required: true, validate: (lines: unknown[]) => lines.length > 0 },
  status: { type: String, enum: ['requested', 'approved', 'rejected', 'label_created', 'in_transit', 'received', 'inspected', 'completed', 'cancelled'], default: 'requested', required: true, index: true },
  resolution: { type: String, enum: ['refund', 'exchange', 'store_credit'] },
  returnTrackingNumber: { type: String, trim: true, maxlength: 160 },
  returnCarrier: { type: String, trim: true, maxlength: 100 },
  requestedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  receivedAt: { type: Date },
  completedAt: { type: Date },
  rejectionReason: { type: String, trim: true, maxlength: 500 },
  internalNote: { type: String, trim: true, maxlength: 3000, select: false },
}, { timestamps: true, strict: 'throw' })

returnRequestSchema.index({ orderId: 1, status: 1 })
returnRequestSchema.index({ userId: 1, createdAt: -1 })

export const ReturnRequest = model('ReturnRequest', returnRequestSchema)