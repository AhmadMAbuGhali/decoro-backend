import mongoose from "mongoose";

const returnRequestSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    reason: { type: String, required: true },

    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "item_received", "refunded", "replaced"],
      default: "requested"
    },

    adminNote: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("ReturnRequest", returnRequestSchema);