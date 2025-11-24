import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  createOrder,
  getOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} from "./order.controller.js";
import { isAdmin } from "../../middleware/admin.middleware.js";

const router = express.Router();

router.post("/create", protect, createOrder);
router.get("/me", protect, getUserOrders);
router.get("/:id", protect, getOrder);

// admin routes
router.get("/", protect, isAdmin, getAllOrders);
router.put("/:id/status", protect, isAdmin, updateOrderStatus);

export default router;