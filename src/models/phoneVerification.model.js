import mongoose from "mongoose";

const phoneVerificationSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  code: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  lastSentAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false },
  dailyCount: { type: Number, default: 0 }, // reset logic optional via cron or TTL
}, { timestamps: true });

// TTL index optional if you want auto-delete after expire (not on field expiresAt directly)
phoneVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.PhoneVerification ||
  mongoose.model("PhoneVerification", phoneVerificationSchema);