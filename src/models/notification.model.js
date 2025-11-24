import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, required: true },
    message: { type: String, required: true },

    type: {
      type: String,
      enum: [
        "order_status_changed",
        "payment_success",
        "payment_failed",
        "admin_message",
        "general",
      ],
      default: "general",
    },

    isRead: { type: Boolean, default: false },

    // channels (in-app, push, email)
    channel: {
      type: String,
      enum: ["in_app", "push", "email"],
      default: "in_app",
    },

    metadata: { type: Object, default: {} }, // مثال: orderId, paymentId...
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);