import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { checkout } from "./checkout.controller.js";

const router = express.Router();

router.post("/", protect, checkout);

export default router;