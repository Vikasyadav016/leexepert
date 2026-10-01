import { model, Schema, Types } from 'mongoose'
import { imageSchema, seoSchema } from '../shared/common.schemas'

const categorySchema = new Schema({
  name: { type: String, trim: true, maxlength: 120, required: true },
  slug: { type: String, lowercase: true, trim: true, maxlength: 160, unique: true, required: true },
  description: { type: String, trim: true, maxlength: 3000 },
  parentId: { type: Types.ObjectId, ref: 'Category', default: null },
  image: { type: imageSchema, default: undefined },
  sortOrder: { type: Number, min: 0, default: 0 },
  status: { type: String, enum: ['draft', 'active', 'archived'], default: 'draft', index: true },
  seo: { type: seoSchema, default: () => ({}) },
  createdBy: { type: Types.ObjectId, ref: 'User' },
  updatedBy: { type: Types.ObjectId, ref: 'User' },
}, { timestamps: true, strict: 'throw' })

categorySchema.index({ parentId: 1, sortOrder: 1, name: 1 })
categorySchema.index({ status: 1, updatedAt: -1 })

export const Category = model('Category', categorySchema)