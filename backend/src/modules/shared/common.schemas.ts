import { Schema } from 'mongoose'

export const addressSchema = new Schema({
  label: { type: String, trim: true, maxlength: 40 },
  firstName: { type: String, trim: true, maxlength: 80, required: true },
  lastName: { type: String, trim: true, maxlength: 80, required: true },
  company: { type: String, trim: true, maxlength: 120 },
  phone: { type: String, trim: true, maxlength: 24 },
  addressLine1: { type: String, trim: true, maxlength: 160, required: true },
  addressLine2: { type: String, trim: true, maxlength: 160 },
  locality: { type: String, trim: true, maxlength: 100, required: true },
  region: { type: String, trim: true, maxlength: 100 },
  postalCode: { type: String, trim: true, maxlength: 24, required: true },
  countryCode: { type: String, uppercase: true, trim: true, minlength: 2, maxlength: 2, required: true },
  deliveryInstructions: { type: String, trim: true, maxlength: 500 },
})

export const imageSchema = new Schema({
  url: { type: String, trim: true, maxlength: 2048, required: true },
  storageKey: { type: String, trim: true, maxlength: 512 },
  altText: { type: String, trim: true, maxlength: 240, required: true },
  role: { type: String, enum: ['primary', 'gallery', 'swatch', 'detail'], default: 'gallery' },
  position: { type: Number, min: 0, default: 0 },
  width: { type: Number, min: 1 },
  height: { type: Number, min: 1 },
}, { _id: false })

export const seoSchema = new Schema({
  title: { type: String, trim: true, maxlength: 70 },
  description: { type: String, trim: true, maxlength: 320 },
  canonicalUrl: { type: String, trim: true, maxlength: 2048 },
  noIndex: { type: Boolean, default: false },
}, { _id: false })

export const moneySchema = new Schema({
  amount: { type: Number, min: 0, validate: Number.isSafeInteger, required: true },
  currency: { type: String, uppercase: true, minlength: 3, maxlength: 3, match: /^[A-Z]{3}$/, required: true },
}, { _id: false })