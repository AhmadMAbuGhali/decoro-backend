import mongoose from "mongoose";

const paymentTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: false },
  provider: { type: String, enum: ["paymob","paypal"], required: true },
  method: { type: String }, // card, apple, google, paypal
  amount: { type: Number, required: true }, // cents or smallest unit? we store in e.g. EGP piastres or cents? define consistently
  currency: { type: String, default: "EGP" },
  status: { type: String, enum: ["pending","authorized","captured","failed","refunded"], default: "pending" },
  providerOrderId: { type: String }, // id returned by provider
  providerSessionId: { type: String }, // payment token / client secret
  raw: { type: Object }, // raw payload for debugging
}, { timestamps: true });

export default mongoose.models.PaymentTransaction || mongoose.model("PaymentTransaction", paymentTransactionSchema);