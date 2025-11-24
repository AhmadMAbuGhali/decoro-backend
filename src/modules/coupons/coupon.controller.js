import couponService from "./coupon.service.js";

export const createCoupon = async (req, res) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    res.json(coupon);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getAllCoupons = async (req, res) => {
  res.json(await couponService.getAll());
};

export const getCoupon = async (req, res) => {
  res.json(await couponService.getById(req.params.id));
};

export const updateCoupon = async (req, res) => {
  res.json(await couponService.updateCoupon(req.params.id, req.body));
};

export const deleteCoupon = async (req, res) => {
  await couponService.deleteCoupon(req.params.id);
  res.json({ message: "Deleted" });
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const userId = req.user._id;

    const result = await couponService.validateCoupon(code, userId, orderAmount);
    res.json(result);

  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};