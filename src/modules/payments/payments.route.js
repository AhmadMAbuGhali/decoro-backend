import express from "express";
import { createPayment, handleWebhook } from "./payment.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// create payment
router.post("/create", protect, createPayment);

// webhooks
router.post("/webhook/:provider", handleWebhook);

export default router;