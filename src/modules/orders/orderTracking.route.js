import express from "express";
import { adminProtect } from "../../middleware/adminAuthMiddleware.js";
import { protect } from "../../middleware/authMiddleware.js";
import { addOrderStatus, getOrderTracking } from "./orderTracking.controller.js";

const router = express.Router();

// admin updates status
router.post("/:id/status", adminProtect, addOrderStatus);

// user view tracking
router.get("/:id/tracking", protect, getOrderTracking);

export default router;