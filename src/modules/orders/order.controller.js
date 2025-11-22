// src/modules/orders/order.controller.js

import asyncHandler from "express-async-handler";
import orderService from "./order.service.js";
import ApiError from "../../core/errors/ApiError.js";

class OrderController {
  // Convert to DTO
  toDto(order) {
    const o = order.toObject();
    return {
      id: o._id,
      user: o.user,
      products: o.products,
      totalPrice: o.totalPrice,
      status: o.status,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };
  }

  createOrder = asyncHandler(async (req, res) => {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(this.toDto(order));
  });

  getAllOrders = asyncHandler(async (req, res) => {
    const orders = await orderService.getAllOrders();
    res.json(orders.map((o) => this.toDto(o)));
  });

  getOrderById = asyncHandler(async (req, res) => {
    const order = await orderService.getOrderById(req.params.id);
    res.json(this.toDto(order));
  });

  updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );
    res.json(this.toDto(order));
  });

  getUserOrders = asyncHandler(async (req, res) => {
    const orders = await orderService.getUserOrders(req.params.userId);
    res.json(orders.map((o) => this.toDto(o)));
  });

  deleteOrder = asyncHandler(async (req, res) => {
    const result = await orderService.deleteOrder(req.params.id);
    res.json(result);
  });
}

export default new OrderController();