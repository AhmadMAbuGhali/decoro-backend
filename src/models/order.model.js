// src/models/order.model.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      required: true,
    },
    priceAtOrder: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      validate: (v) => v.length > 0,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },

    notes: { type: String },

    // optional fields for future custom designs (Decoro Project)
    designImage: {
      url: String,
      public_id: String,
    },
    material: { type: String },
  },
  { timestamps: true }
);

// Optional: Pre-save calculation (only if needed)
orderSchema.pre("save", function (next) {
  if (this.items && this.items.length > 0) {
    this.totalPrice = this.items.reduce(
      (acc, i) => acc + i.priceAtOrder * i.quantity,
      0
    );
  }
  next();
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);