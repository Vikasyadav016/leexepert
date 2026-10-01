import { model, Schema, Types } from 'mongoose'
import { seoSchema } from '../shared/common.schemas'

const contentPageSchema = new Schema({
  slug: { type: String, lowercase: true, trim: true, maxlength: 180, required: true },
  locale: { type: String, lowercase: true, trim: true, maxlength: 16, default: 'en', required: true },
  title: { type: String, trim: true, maxlength: 180, required: true },
  summary: { type: String, trim: true, maxlength: 500 },
  content: { type: Schema.Types.Mixed, required: true },
  pageType: { type: String, enum: ['page', 'landing', 'policy', 'campaign'], default: 'page' },
  status: { type: String, enum: ['draft', 'scheduled', 'published', 'archived'], default: 'draft', required: true, index: true },
  seo: { type: seoSchema, default: () => ({}) },
  publishedAt: { type: Date },
  scheduledAt: { type: Date },
  createdBy: { type: Types.ObjectId, ref: 'User' },
  updatedBy: { type: Types.ObjectId, ref: 'User' },
}, { timestamps: true, strict: 'throw' })

contentPageSchema.index({ slug: 1, locale: 1 }, { unique: true })
contentPageSchema.index({ status: 1, publishedAt: -1 })

export const ContentPage = model('ContentPage', contentPageSchema)