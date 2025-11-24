import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },

    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true },

    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: null },

    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },

    usageLimit: { type: Number, default: null },       // null = unlimited
    usedCount: { type: Number, default: 0 },

    perUserLimit: { type: Number, default: 1 },

    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);