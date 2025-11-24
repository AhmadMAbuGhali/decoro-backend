import mongoose from "mongoose";

const privacySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  language: { type: String, enum: ["ar", "en"], default: "en" },
}, { timestamps: true });

export default mongoose.models.Privacy || mongoose.model("Privacy", privacySchema);