import { model, Schema, Types } from 'mongoose'

const inventoryItemSchema = new Schema({
  variantId: { type: Types.ObjectId, ref: 'ProductVariant', required: true },
  warehouseCode: { type: String, uppercase: true, trim: true, maxlength: 40, required: true },
  onHand: { type: Number, min: 0, validate: Number.isSafeInteger, default: 0 },
  reserved: { type: Number, min: 0, validate: Number.isSafeInteger, default: 0 },
  incoming: { type: Number, min: 0, validate: Number.isSafeInteger, default: 0 },
  reorderPoint: { type: Number, min: 0, validate: Number.isSafeInteger, default: 0 },
  allowBackorder: { type: Boolean, default: false },
  lastCountedAt: { type: Date },
  updatedBy: { type: Types.ObjectId, ref: 'User' },
}, { timestamps: true, strict: 'throw' })

inventoryItemSchema.index({ variantId: 1, warehouseCode: 1 }, { unique: true })
inventoryItemSchema.virtual('available').get(function () { return Math.max(0, this.onHand - this.reserved) })

export const InventoryItem = model('InventoryItem', inventoryItemSchema)