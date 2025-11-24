import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  label: { type: String, default: "Home" },  // اسم العنوان (بيت – شغل – ...)
  name: { type: String, required: true },    // الاسم المستلم
  phone: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  street: { type: String, required: true },
  building: { type: String },
  apartment: { type: String },

  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Address", addressSchema);