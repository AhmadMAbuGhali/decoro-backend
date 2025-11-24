import Order from "../../models/order.model.js";
import Cart from "../../models/cart.model.js";
import PaymentTransaction from "../../models/paymentTransaction.model.js";
import cartService from "../cart/cart.service.js";

class OrderService {
  // create an order from user's cart
  async createOrderFromCart(userId, address, paymentMethod = "card", currency = "EGP", metadata = {}) {
    const cart = await cartService.getCartByUser(userId);
    if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

    // copy items snapshot
    const items = cart.items.map(i => ({
      product: i.product,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      mainImage: i.mainImage
    }));

    const subtotal = items.reduce((s, it) => s + (it.price * it.quantity), 0);
    const total = subtotal; // add shipping/tax if needed

    const order = await Order.create({
      user: userId,
      items,
      subtotal,
      total,
      currency,
      address,
      paymentMethod,
      paymentStatus: "pending_payment",
      orderStatus: "pending",
      metadata
    });

    return order;
  }

  async getOrderById(id) {
    return await Order.findById(id).populate("items.product").populate("transaction");
  }

  async getUserOrders(userId) {
    return await Order.find({ user: userId }).sort({ createdAt: -1 });
  }

  async getAllOrders() {
    return await Order.find().sort({ createdAt: -1 });
  }

  async updateOrderStatus(orderId, status) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");
    order.orderStatus = status;
    await order.save();
    return order;
  }

  async attachTransactionToOrder(orderId, txId) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");
    order.transaction = txId;
    await order.save();
    return order;
  }

  // finalize order on successful payment
  async finalizeOrderOnPayment(tx) {
    if (!tx || !tx.order) return null;
    const order = await Order.findById(tx.order);
    if (!order) return null;

    order.paymentStatus = tx.status === "captured" ? "paid" : "failed";
    order.orderStatus = tx.status === "captured" ? "processing" : "pending";
    await order.save();

    // clear cart
    await Cart.findOneAndUpdate({ user: order.user }, { items: [] });

    return order;
  }
}

export default new OrderService();