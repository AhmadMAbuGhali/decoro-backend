// src/modules/reviews/review.route.js

import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { addReview, getProductReviews } from "./review.controller.js";

const router = express.Router();

router.get("/:productId", getProductReviews);        // Anyone can view reviews
router.post("/:productId", protect, addReview);      // Only logged-in users can add

export default router;