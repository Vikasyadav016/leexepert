import { model, Schema, Types } from 'mongoose'
import { addressSchema } from '../shared/common.schemas'

const shipmentLineSchema = new Schema({
  orderLineId: { type: Types.ObjectId, required: true },
  quantity: { type: Number, min: 1, validate: Number.isSafeInteger, required: true },
}, { _id: false })

const trackingEventSchema = new Schema({
  status: { type: String, trim: true, maxlength: 80, required: true },
  description: { type: String, trim: true, maxlength: 500 },
  location: { type: String, trim: true, maxlength: 160 },
  occurredAt: { type: Date, required: true },
}, { _id: false })

const shipmentSchema = new Schema({
  orderId: { type: Types.ObjectId, ref: 'Order', required: true, index: true },
  shipmentNumber: { type: String, uppercase: true, trim: true, unique: true, required: true, maxlength: 48 },
  lines: { type: [shipmentLineSchema], required: true, validate: (lines: unknown[]) => lines.length > 0 },
  shipTo: { type: addressSchema, required: true },
  carrier: { type: String, trim: true, maxlength: 100 },
  serviceLevel: { type: String, trim: true, maxlength: 100 },
  trackingNumber: { type: String, trim: true, maxlength: 160 },
  trackingUrl: { type: String, trim: true, maxlength: 2048 },
  status: { type: String, enum: ['label_created', 'ready_for_pickup', 'in_transit', 'out_for_delivery', 'delivered', 'exception', 'returned_to_sender', 'cancelled'], default: 'label_created', required: true, index: true },
  trackingEvents: { type: [trackingEventSchema], default: [] },
  shippedAt: { type: Date },
  estimatedDeliveryAt: { type: Date },
  deliveredAt: { type: Date },
  shippingCostAmount: { type: Number, min: 0, validate: Number.isSafeInteger },
  currency: { type: String, uppercase: true, minlength: 3, maxlength: 3 },
}, { timestamps: true, strict: 'throw' })

shipmentSchema.index({ carrier: 1, trackingNumber: 1 }, { unique: true, partialFilterExpression: { trackingNumber: { $type: 'string' } } })
shipmentSchema.index({ status: 1, estimatedDeliveryAt: 1 })

export const Shipment = model('Shipment', shipmentSchema)