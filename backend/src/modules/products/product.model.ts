import { model, Schema, Types } from 'mongoose'
import { imageSchema, seoSchema } from '../shared/common.schemas'

const productSchema = new Schema({
  name: { type: String, trim: true, maxlength: 180, required: true },
  slug: { type: String, lowercase: true, trim: true, maxlength: 200, unique: true, required: true },
  productCode: { type: String, uppercase: true, trim: true, maxlength: 64, unique: true, sparse: true },
  shortDescription: { type: String, trim: true, maxlength: 500 },
  description: { type: String, trim: true, maxlength: 20000, required: true },
  brand: { type: String, trim: true, maxlength: 120 },
  color: { type: String, trim: true, maxlength: 80, default: 'Natural' },
  categoryId: { type: Types.ObjectId, ref: 'Category', required: true, index: true },
  subcategoryId: { type: Types.ObjectId, ref: 'Category', default: null },
  productType: { type: String, enum: ['physical', 'digital', 'service'], default: 'physical', required: true },
  material: { type: [String], default: [] },
  fabric: { type: String, trim: true, maxlength: 120 },
  fit: { type: String, trim: true, maxlength: 80 },
  gender: { type: String, enum: ['women', 'men', 'unisex', 'kids', 'not_applicable'], default: 'unisex' },
  tags: { type: [String], default: [], validate: (tags: string[]) => tags.length <= 40 },
  images: { type: [imageSchema], default: [] },
  variantIds: [{ type: Types.ObjectId, ref: 'ProductVariant' }],
  basePriceAmount: { type: Number, min: 0, validate: Number.isSafeInteger, required: true },
  currency: { type: String, uppercase: true, minlength: 3, maxlength: 3, match: /^[A-Z]{3}$/, default: 'USD' },
  taxCode: { type: String, trim: true, maxlength: 64 },
  shippingRequired: { type: Boolean, default: true },
  careInstructions: { type: [String], default: [] },
  originCountryCode: { type: String, uppercase: true, minlength: 2, maxlength: 2 },
  status: { type: String, enum: ['draft', 'active', 'archived'], default: 'draft', index: true },
  featured: { type: Boolean, default: false, index: true },
  bestseller: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  seo: { type: seoSchema, default: () => ({}) },
  publishedAt: { type: Date },
  deletedAt: { type: Date, default: null },
  createdBy: { type: Types.ObjectId, ref: 'User' },
  updatedBy: { type: Types.ObjectId, ref: 'User' },
}, { timestamps: true, strict: 'throw' })

productSchema.index({ status: 1, categoryId: 1, createdAt: -1 })
productSchema.index({ status: 1, featured: -1, publishedAt: -1 })
productSchema.index({ tags: 1, status: 1 })
productSchema.index({ name: 'text', shortDescription: 'text', description: 'text', tags: 'text' })

export const Product = model('Product', productSchema)