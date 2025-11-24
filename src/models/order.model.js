import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String },
  price: { type: Number },
  quantity: { type: Number, default: 1 },
  mainImage: { url: String, public_id: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  currency: { type: String, default: "EGP" },
  address: {
    fullName: String,
    phone: String,
    city: String,
    street: String,
    postalCode: String,
    notes: String
  },
  paymentMethod: { type: String, enum: ["paymob","paypal","card","cod"], default: "card" },
  paymentStatus: { type: String, enum: ["pending_payment","paid","failed","refunded"], default: "pending_payment" },
  orderStatus: { type: String, enum: ["pending","processing","shipped","completed","cancelled"], default: "pending" },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentTransaction" }, // link to payment
  metadata: { type: Object } ,// any additional info
  shippingPrice: Number,
address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
paymentStatus: {
  type: String,
  enum: ["pending", "paid", "refunded", "failed"],
  default: "pending"
},
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);