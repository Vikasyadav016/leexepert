import { model, Schema, Types } from 'mongoose'

const ticketMessageSchema = new Schema({
  authorType: { type: String, enum: ['customer', 'agent', 'system'], required: true },
  authorId: { type: Types.ObjectId, ref: 'User' },
  body: { type: String, trim: true, maxlength: 10000, required: true },
  attachmentUrls: { type: [String], default: [], validate: (urls: string[]) => urls.length <= 8 },
  isInternal: { type: Boolean, default: false },
  sentAt: { type: Date, default: Date.now },
}, { _id: true })

const supportTicketSchema = new Schema({
  ticketNumber: { type: String, uppercase: true, trim: true, maxlength: 48, unique: true, required: true },
  userId: { type: Types.ObjectId, ref: 'User', index: true },
  guestEmail: { type: String, lowercase: true, trim: true, maxlength: 254 },
  orderId: { type: Types.ObjectId, ref: 'Order' },
  subject: { type: String, trim: true, maxlength: 200, required: true },
  category: { type: String, enum: ['order', 'product', 'shipping', 'return', 'payment', 'account', 'other'], default: 'other' },
  priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal', index: true },
  status: { type: String, enum: ['open', 'pending_customer', 'pending_internal', 'resolved', 'closed'], default: 'open', required: true, index: true },
  assignedTo: { type: Types.ObjectId, ref: 'User' },
  messages: { type: [ticketMessageSchema], default: [], validate: (messages: unknown[]) => messages.length <= 500 },
  lastMessageAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
}, { timestamps: true, strict: 'throw' })

supportTicketSchema.index({ status: 1, priority: -1, lastMessageAt: -1 })
supportTicketSchema.index({ assignedTo: 1, status: 1, updatedAt: -1 })

export const SupportTicket = model('SupportTicket', supportTicketSchema)