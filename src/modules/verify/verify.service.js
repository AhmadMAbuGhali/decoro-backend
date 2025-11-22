// src/modules/verify/verify.service.js

import User from "../../models/user.model.js";
import EmailService from "../../core/email/email.service.js";
import ApiError from "../../core/errors/ApiError.js";

class VerifyService {
  // ============================
  // Send Verification Code
  // ============================
  async sendCode(email, type) {
    if (!email || !type) throw new ApiError(400, "Email and type are required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    // Allowed types
    const allowed = ["email_verification", "password_reset"];
    if (!allowed.includes(type)) {
      throw new ApiError(400, "Invalid verification type");
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.verificationCode = otp;
    user.verificationType = type;
    user.verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

await EmailService.sendVerificationEmail(email, otp);
    return {
      message: "Verification code sent",
      code: process.env.NODE_ENV === "development" ? otp : undefined,
    };
  }

  // ============================
  // Verify Code
  // ============================
  async verifyCode(email, code, type) {
    if (!email || !code || !type) {
      throw new ApiError(400, "Missing required fields");
    }

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    if (
      user.verificationType !== type ||
      !user.verificationCode ||
      user.verificationCode !== code ||
      !user.verificationExpires ||
      user.verificationExpires < Date.now()
    ) {
      throw new ApiError(400, "Invalid or expired verification code");
    }

    // Activate account if verification email
    if (type === "email_verification") {
      user.isVerified = true;
    }

    // Cleanup
    user.verificationCode = undefined;
    user.verificationType = undefined;
    user.verificationExpires = undefined;

    await user.save();

    return {
      message:
        type === "email_verification"
          ? "Email verified successfully"
          : "Code verified successfully",
    };
  }
}

export default new VerifyService();
