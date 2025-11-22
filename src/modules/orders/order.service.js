// src/modules/orders/order.service.js

import Order from "../../models/order.model.js";
import ApiError from "../../core/errors/ApiError.js";

class OrderService {
  // ===========================
  // Create Order
  // ===========================
  async createOrder({ user, products, totalPrice, status }) {
    if (!products || products.length === 0)
      throw new ApiError(400, "Order must contain at least one product");

    const order = await Order.create({
      user,
      products,
      totalPrice,
      status: status || "pending",
    });

    return order;
  }

  // ===========================
  // Get All Orders (Admin)
  // ===========================
  async getAllOrders() {
    return await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price mainImage");
  }

  // ===========================
  // Get Order by ID
  // ===========================
  async getOrderById(id) {
    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("products.product", "name price mainImage");

    if (!order) throw new ApiError(404, "Order not found");

    return order;
  }

  // ===========================
  // Update Order Status
  // ===========================
  async updateOrderStatus(id, status) {
    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found");

    order.status = status;
    await order.save();

    return order;
  }

  // ===========================
  // Get User Orders
  // ===========================
  async getUserOrders(userId) {
    return await Order.find({ user: userId })
      .populate("products.product", "name price mainImage")
      .sort({ createdAt: -1 });
  }

  // ===========================
  // Delete Order
  // ===========================
  async deleteOrder(id) {
    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found");

    await order.deleteOne();

    return { message: "Order deleted" };
  }
}

export default new OrderService();