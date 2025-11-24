import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lastMessage: { type: String },
    lastSender: { type: String, enum: ["user", "admin"] },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);