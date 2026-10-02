import { model, Schema, Types, type InferSchemaType } from 'mongoose'

const executionLogSchema = new Schema({
  executionId: { type: String, required: true, unique: true },
  requestId: { type: String, index: true },
  layer: { type: String, enum: ['request', 'controller', 'service'], required: true },
  moduleName: { type: String, trim: true, maxlength: 80, required: true },
  operation: { type: String, trim: true, maxlength: 120, required: true },
  outcome: { type: String, enum: ['started', 'completed', 'failed'], required: true, index: true },
  actorId: { type: Types.ObjectId, ref: 'User' },
  method: { type: String, uppercase: true, trim: true, maxlength: 12 },
  path: { type: String, trim: true, maxlength: 500 },
  statusCode: { type: Number, min: 100, max: 599 },
  startedAt: { type: Date, required: true },
  finishedAt: { type: Date },
  durationMs: { type: Number, min: 0 },
  errorName: { type: String, trim: true, maxlength: 120 },
  errorMessage: { type: String, trim: true, maxlength: 500 },
}, { timestamps: true, strict: 'throw' })

executionLogSchema.index({ createdAt: -1 })
executionLogSchema.index({ moduleName: 1, createdAt: -1 })
executionLogSchema.index({ layer: 1, outcome: 1, createdAt: -1 })

export const ExecutionLog = model('ExecutionLog', executionLogSchema)
export type ExecutionLogRecord = InferSchemaType<typeof executionLogSchema>