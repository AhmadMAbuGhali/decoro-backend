import Order from "../../models/order.model.js";
import Address from "../../models/address.model.js";
import paymentService from "../payments/payment.service.js";

export const checkout = async (req, res) => {
  const userId = req.user._id;
  const { cartItems, addressId, shippingMethod, paymentProvider } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) return res.status(400).json({ message: "Invalid address" });

  // حساب السعر
  let total = 0;
  cartItems.forEach(item => {
    total += item.price * item.quantity;
  });

  // + شحن
  const shippingPrice = shippingMethod === "express" ? 60 : 30;
  total += shippingPrice;

  // إنشاء Order
  const order = await Order.create({
    user: userId,
    products: cartItems.map(i => ({
      product: i.productId,
      quantity: i.quantity
    })),
    totalPrice: total,
    shippingPrice,
    address: address._id,
    status: "pending_payment",
    paymentStatus: "pending",
  });

  // إنشاء الدفع
  const payment = await paymentService.createPayment({
    userId,
    orderId: order._id,
    amount: total,
    currency: "EGP",
    provider: paymentProvider,
    method: "card"
  });

  res.json({
    orderId: order._id,
    total,
    payment,
  });
};