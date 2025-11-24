import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { adminProtect } from "../../middleware/adminAuthMiddleware.js";

import {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon
} from "./coupon.controller.js";

const router = express.Router();

// Admin CRUD
router.post("/", adminProtect, createCoupon);
router.get("/", adminProtect, getAllCoupons);
router.get("/:id", adminProtect, getCoupon);
router.put("/:id", adminProtect, updateCoupon);
router.delete("/:id", adminProtect, deleteCoupon);

// User validate
router.post("/validate", protect, validateCoupon);

export default router;