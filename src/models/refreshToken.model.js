// src/models/refreshToken.model.js
import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, index: true }, // to be hashed later
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ip: String,
  userAgent: String,
  revoked: { type: Boolean, default: false },
  replacedByToken: String,

  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL — will auto-delete expired tokens
  },
});

refreshTokenSchema.virtual("isExpired").get(function () {
  return Date.now() >= this.expiresAt;
});

export default mongoose.models.RefreshToken ||
  mongoose.model("RefreshToken", refreshTokenSchema);