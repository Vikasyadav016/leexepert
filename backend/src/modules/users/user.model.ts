import { model, Schema } from 'mongoose'
import { addressSchema } from '../shared/common.schemas'

const userSchema = new Schema({
  firstName: { type: String, trim: true, maxlength: 80, required: true },
  lastName: { type: String, trim: true, maxlength: 80, required: true },
  email: { type: String, lowercase: true, trim: true, maxlength: 254, unique: true, required: true },
  phone: { type: String, trim: true, maxlength: 24 },
  passwordHash: { type: String, select: false, maxlength: 200 },
  role: { type: String, enum: ['customer', 'support', 'catalog_manager', 'inventory_manager', 'admin'], default: 'customer', required: true, index: true },
  status: { type: String, enum: ['pending_verification', 'active', 'suspended', 'deleted'], default: 'pending_verification', index: true },
  avatarUrl: { type: String, trim: true, maxlength: 2048 },
  emailVerifiedAt: { type: Date },
  phoneVerifiedAt: { type: Date },
  lastLoginAt: { type: Date },
  failedLoginCount: { type: Number, min: 0, default: 0, select: false },
  lockoutUntil: { type: Date, select: false },
  addresses: { type: [addressSchema], default: [] },
  defaultShippingAddressId: { type: Schema.Types.ObjectId },
  defaultBillingAddressId: { type: Schema.Types.ObjectId },
  preferences: {
    locale: { type: String, trim: true, maxlength: 16, default: 'en' },
    currency: { type: String, uppercase: true, minlength: 3, maxlength: 3, default: 'USD' },
    marketingEmail: { type: Boolean, default: false },
    marketingSms: { type: Boolean, default: false },
  },
  deletedAt: { type: Date, default: null },
}, { timestamps: true, strict: 'throw' })

userSchema.index({ phone: 1 }, { unique: true, partialFilterExpression: { phone: { $type: 'string' } } })
userSchema.index({ status: 1, createdAt: -1 })

export const User = model('User', userSchema)