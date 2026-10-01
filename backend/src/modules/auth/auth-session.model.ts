import { model, Schema, Types } from "mongoose";

const authSessionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    refreshTokenHash: {
      type: String,
      required: true,
      select: false,
      unique: true,
    },
    createdFromIp: { type: String, trim: true, maxlength: 64 },
    userAgent: { type: String, trim: true, maxlength: 512 },
    deviceLabel: { type: String, trim: true, maxlength: 120 },
    expiresAt: { type: Date, required: true },
    lastUsedAt: { type: Date, default: Date.now },
    revokedAt: { type: Date, default: null },
    revokeReason: {
      type: String,
      enum: ["logout", "password_changed", "security", "expired"],
    },
  },
  { timestamps: true, strict: "throw" },
);

authSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
authSessionSchema.index({ userId: 1, revokedAt: 1, expiresAt: 1 });

export const AuthSession = model("AuthSession", authSessionSchema);
