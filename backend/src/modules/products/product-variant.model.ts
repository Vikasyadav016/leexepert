import { model, Schema, Types } from 'mongoose'
import { imageSchema } from '../shared/common.schemas'

const variantOptionSchema = new Schema({
  name: { type: String, trim: true, maxlength: 60, required: true },
  value: { type: String, trim: true, maxlength: 100, required: true },
}, { _id: false })

const productVariantSchema = new Schema({
  productId: { type: Types.ObjectId, ref: 'Product', required: true, index: true },
  sku: { type: String, uppercase: true, trim: true, maxlength: 80, unique: true, required: true },
  barcode: { type: String, trim: true, maxlength: 80, sparse: true },
  options: { type: [variantOptionSchema], default: [], validate: (options: unknown[]) => options.length <= 8 },
  priceAmount: { type: Number, min: 0, validate: Number.isSafeInteger, required: true },
  compareAtAmount: { type: Number, min: 0, validate: Number.isSafeInteger },
  costAmount: { type: Number, min: 0, validate: Number.isSafeInteger, select: false },
  currency: { type: String, uppercase: true, minlength: 3, maxlength: 3, match: /^[A-Z]{3}$/, default: 'USD' },
  weightGrams: { type: Number, min: 0, validate: Number.isSafeInteger },
  dimensionsMm: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
  },
  images: { type: [imageSchema], default: [] },
  isDefault: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive', 'discontinued'], default: 'active', index: true },
  position: { type: Number, min: 0, default: 0 },
}, { timestamps: true, strict: 'throw' })

productVariantSchema.index({ productId: 1, status: 1, position: 1 })
productVariantSchema.index({ productId: 1, isDefault: 1 })

export const ProductVariant = model('ProductVariant', productVariantSchema)