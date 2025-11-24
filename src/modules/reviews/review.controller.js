// src/modules/reviews/review.controller.js

import reviewService from "./review.service.js";

export const addReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { rating, comment } = req.body;

    const review = await reviewService.addReview(
      userId,
      req.params.productId,
      rating,
      comment
    );

    res.status(201).json({
      message: "Review submitted",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const data = await reviewService.getReviews(req.params.productId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};