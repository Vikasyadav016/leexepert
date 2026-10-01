import { model, Schema, Types } from 'mongoose'
import { addressSchema } from '../shared/common.schemas'

const orderLineSchema = new Schema({
  productId: { type: Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: Types.ObjectId, ref: 'ProductVariant', required: true },
  productName: { type: String, trim: true, maxlength: 180, required: true },
  productSlug: { type: String, trim: true, maxlength: 200 },
  sku: { type: String, uppercase: true, trim: true, maxlength: 80, required: true },
  imageUrl: { type: String, trim: true, maxlength: 2048 },
  selectedOptions: { type: Map, of: String, default: {} },
  quantity: { type: Number, min: 1, validate: Number.isSafeInteger, required: true },
  unitAmount: { type: Number, min: 0, validate: Number.isSafeInteger, required: true },
  discountAmount: { type: Number, min: 0, validate: Number.isSafeInteger, default: 0 },
  taxAmount: { type: Number, min: 0, validate: Number.isSafeInteger, default: 0 },
  lineTotalAmount: { type: Number, min: 0, validate: Number.isSafeInteger, required: true },
}, { timestamps: false })

const orderSchema = new Schema({
  orderNumber: { type: String, uppercase: true, trim: true, unique: true, required: true, maxlength: 40 },
  userId: { type: Types.ObjectId, ref: 'User', index: true },
  guestEmail: { type: String, lowercase: true, trim: true, maxlength: 254 },
  guestPhone: { type: String, trim: true, maxlength: 24 },
  lines: { type: [orderLineSchema], required: true, validate: (lines: unknown[]) => lines.length > 0 && lines.length <= 100 },
  currency: { type: String, uppercase: true, minlength: 3, maxlength: 3, match: /^[A-Z]{3}$/, required: true },
  subtotalAmount: { type: Number, min: 0, validate: Number.isSafeInteger, required: true },
  discountAmount: { type: Number, min: 0, validate: Number.isSafeInteger, default: 0 },
  shippingAmount: { type: Number, min: 0, validate: Number.isSafeInteger, default: 0 },
  taxAmount: { type: Number, min: 0, validate: Number.isSafeInteger, default: 0 },
  totalAmount: { type: Number, min: 0, validate: Number.isSafeInteger, required: true },
  shippingAddress: { type: addressSchema, required: true },
  billingAddress: { type: addressSchema, required: true },
  shippingMethod: { type: String, trim: true, maxlength: 100 },
  couponCode: { type: String, uppercase: true, trim: true, maxlength: 80 },
  status: { type: String, enum: ['pending', 'confirmed', 'processing', 'partially_shipped', 'shipped', 'delivered', 'cancelled', 'completed'], default: 'pending', required: true, index: true },
  paymentStatus: { type: String, enum: ['pending', 'authorized', 'paid', 'partially_refunded', 'refunded', 'failed'], default: 'pending', required: true },
  fulfillmentStatus: { type: String, enum: ['unfulfilled', 'processing', 'partially_fulfilled', 'fulfilled', 'returned'], default: 'unfulfilled', required: true },
  customerNote: { type: String, trim: true, maxlength: 1000 },
  internalNote: { type: String, trim: true, maxlength: 4000, select: false },
  idempotencyKey: { type: String, trim: true, maxlength: 160 },
  placedAt: { type: Date, default: Date.now },
  cancelledAt: { type: Date },
  cancellationReason: { type: String, trim: true, maxlength: 500 },
}, { timestamps: true, strict: 'throw' })

orderSchema.index({ userId: 1, createdAt: -1 })
orderSchema.index({ guestEmail: 1, orderNumber: 1 })
orderSchema.index({ status: 1, createdAt: -1 })
orderSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true })

export const Order = model('Order', orderSchema)