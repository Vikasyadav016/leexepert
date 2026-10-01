import { model, Schema, Types } from 'mongoose'

const stockMovementSchema = new Schema({
  variantId: { type: Types.ObjectId, ref: 'ProductVariant', required: true, index: true },
  warehouseCode: { type: String, uppercase: true, trim: true, maxlength: 40, required: true },
  movementType: { type: String, enum: ['receipt', 'sale', 'return', 'adjustment', 'reservation', 'release', 'transfer_in', 'transfer_out'], required: true },
  quantityDelta: { type: Number, validate: Number.isSafeInteger, required: true },
  referenceType: { type: String, enum: ['order', 'return', 'purchase_order', 'manual', 'reservation'], required: true },
  referenceId: { type: Types.ObjectId, required: true },
  reason: { type: String, trim: true, maxlength: 500 },
  idempotencyKey: { type: String, trim: true, maxlength: 160, unique: true, sparse: true },
  createdBy: { type: Types.ObjectId, ref: 'User', required: true },
}, { timestamps: { createdAt: true, updatedAt: false }, strict: 'throw' })

stockMovementSchema.index({ variantId: 1, warehouseCode: 1, createdAt: -1 })
stockMovementSchema.index({ referenceType: 1, referenceId: 1 })

export const StockMovement = model('StockMovement', stockMovementSchema)