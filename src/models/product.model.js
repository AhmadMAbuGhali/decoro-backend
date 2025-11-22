// src/models/product.model.js
import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    price: { type: Number, required: true, min: 0 },

    stock: { type: Number, default: 0 },

    category: { type: String, required: true }, // يمكن نعمله enum لاحقًا

    materials: [{ type: String }],

    mainImage: imageSchema,

    gallery: [imageSchema],
  },
  { timestamps: true }
);

// index for search
ProductSchema.index({ name: "text", description: "text" });

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);