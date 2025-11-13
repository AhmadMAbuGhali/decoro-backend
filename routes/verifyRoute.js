import express from "express";
import User from "../models/user.js";
import { sendVerificationEmail } from "../services/emailService.js";

const router = express.Router();

/**
 * @route   POST /api/verify/send
 * @desc    Send verification code (for signup or password reset)
 * @access  Public
 */
router.post("/send", async (req, res) => {
  try {
    const { email, type } = req.body;

    if (!email || !type)
      return res.status(400).json({ message: "Email and type are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.verificationCode = otp;
    user.verificationType = type; // 'email_verification' or 'password_reset'
    user.verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // إرسال الإيميل
    const subject =
      type === "password_reset"
        ? "Password Reset Code"
        : "Email Verification Code";

   await sendVerificationEmail(email, otp);

    res.json({
      message: "Verification code sent successfully",
      // يمكنك إرجاع الكود في بيئة التطوير لتسهيل الاختبار
      code: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/verify/confirm
 * @desc    Verify code for either email or password reset
 * @access  Public
 */
router.post("/confirm", async (req, res) => {
  try {
    const { email, code, type } = req.body;

    if (!email || !code || !type)
      return res.status(400).json({ message: "Missing required fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      user.verificationType !== type ||
      !user.verificationCode ||
      user.verificationCode.toString() !== code ||
      user.verificationExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    // ✅ لو نوع التحقق email_verification، فعل الحساب
    if (type === "email_verification") user.isVerified = true;

    // ✅ تنظيف البيانات بعد التحقق
    user.verificationCode = undefined;
    user.verificationType = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.json({
      message:
        type === "email_verification"
          ? "Email verified successfully"
          : "Code verified successfully. You can now reset your password.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;