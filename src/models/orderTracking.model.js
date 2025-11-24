import mongoose from "mongoose";

const orderTrackingSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered"
      ],
      required: true,
    },
    note: { type: String },
    updatedBy: { type: String, enum: ["admin", "system"], default: "admin" }
  },
  { timestamps: true }
);

export default mongoose.model("OrderTracking", orderTrackingSchema);