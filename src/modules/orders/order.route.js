// src/modules/orders/order.route.js

import express from "express";
import OrderController from "./order.controller.js";
import { adminProtect } from "../../middleware/adminAuthMiddleware.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// ============ USER ROUTES ============

// create order
router.post("/", protect, OrderController.createOrder);

// user orders
router.get("/user/:userId", protect, OrderController.getUserOrders);

// ============ ADMIN ROUTES ============

router.get("/", adminProtect, OrderController.getAllOrders);
router.get("/:id", adminProtect, OrderController.getOrderById);
router.put("/:id/status", adminProtect, OrderController.updateOrderStatus);
router.delete("/:id", adminProtect, OrderController.deleteOrder);

export default router;