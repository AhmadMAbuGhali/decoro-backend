// src/modules/reviews/review.service.js

import Review from "../../models/review.model.js";
import Product from "../../models/product.model.js";

class ReviewService {
  async addReview(userId, productId, rating, comment) {
    const existing = await Review.findOne({ user: userId, product: productId });

    // إذا المستخدم قيّم قبل → نعدل تقييمه
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return existing;
    }

    // إضافة تقييم جديد
    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    return review;
  }

  async getReviews(productId) {
    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const total = reviews.length;

    const starCounts = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    const average =
      total === 0 ? 0 :
      (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1);

    return {
      averageRating: Number(average),
      totalReviews: total,
      stars: starCounts,
      reviews,
    };
  }
}

export default new ReviewService();