import Coupon from "../../models/coupon.model.js";

class CouponService {

  async createCoupon(data) {
    return Coupon.create(data);
  }

  async getAll() {
    return Coupon.find().sort({ createdAt: -1 });
  }

  async getById(id) {
    return Coupon.findById(id);
  }

  async updateCoupon(id, data) {
    return Coupon.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteCoupon(id) {
    return Coupon.findByIdAndDelete(id);
  }

  async validateCoupon(code, userId, orderAmount) {
    const coupon = await Coupon.findOne({ code });

    if (!coupon) throw new Error("Invalid coupon");
    if (!coupon.active) throw new Error("Coupon is disabled");

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      throw new Error("Coupon expired or not active yet");
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      throw new Error("Coupon usage limit reached");
    }

    if (orderAmount < coupon.minOrderAmount) {
      throw new Error(`Minimum order amount is ${coupon.minOrderAmount}`);
    }

    // حساب الخصم
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return {
      couponId: coupon._id,
      discount,
      finalPrice: orderAmount - discount
    };
  }

  async markUsed(couponId) {
    await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } });
  }
}

export default new CouponService();