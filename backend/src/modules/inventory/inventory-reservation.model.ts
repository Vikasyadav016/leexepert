import { model, Schema, Types } from 'mongoose'

const reservationLineSchema = new Schema({
  variantId: { type: Types.ObjectId, ref: 'ProductVariant', required: true },
  warehouseCode: { type: String, uppercase: true, trim: true, maxlength: 40, required: true },
  quantity: { type: Number, min: 1, validate: Number.isSafeInteger, required: true },
}, { _id: false })

const inventoryReservationSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User' },
  cartId: { type: Types.ObjectId, ref: 'Cart' },
  orderId: { type: Types.ObjectId, ref: 'Order' },
  lines: { type: [reservationLineSchema], required: true, validate: (lines: unknown[]) => lines.length > 0 },
  status: { type: String, enum: ['active', 'committed', 'released', 'expired'], default: 'active', required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true, strict: 'throw' })

inventoryReservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
inventoryReservationSchema.index({ status: 1, expiresAt: 1 })
inventoryReservationSchema.index({ orderId: 1 }, { sparse: true })

export const InventoryReservation = model('InventoryReservation', inventoryReservationSchema)