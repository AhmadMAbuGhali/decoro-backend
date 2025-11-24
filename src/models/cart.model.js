import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String }, // snapshot
  price: { type: Number }, // snapshot (store price at add time)
  quantity: { type: Number, default: 1 },
  mainImage: { url: String, public_id: String } // snapshot
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [CartItemSchema],
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);