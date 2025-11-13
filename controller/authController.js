import asyncHandler from "express-async-handler";
import userService from "../services/userService.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/user.js";
import { sendVerificationEmail } from "../services/emailService.js";
import crypto from "crypto";

// تسجيل مستخدم جديد
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await userService.registerUser(name, email, password, role);
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// تسجيل دخول مستخدم
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.loginUser(email, password);
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// تغيير كلمة المرور
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const updatedUser = await userService.changePassword(req.user._id, oldPassword, newPassword);
  res.json({ message: "Password updated successfully" });
});

// جلب مستخدم حسب ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json(user);
});

// 🧩 Forgot Password - Step 1: Send Reset Code
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // إنشاء كود عشوائي من 6 أرقام
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetPasswordCode = code;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // صالح لـ 10 دقائق
  await user.save();

  await sendVerificationEmail(email, code);

  res.json({
    message: "Reset code sent to email",
    code: process.env.NODE_ENV === "development" ? code : undefined,
  });
});

// 🧩 Step 2: Verify Code
const verifyResetCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.resetPasswordCode !== code) {
    res.status(400);
    throw new Error("Invalid or expired code");
  }

  if (user.resetPasswordExpires < Date.now()) {
    res.status(400);
    throw new Error("Reset code expired");
  }

  res.json({ message: "Code verified successfully" });
});

// 🧩 Step 3: Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.password = newPassword;
  user.resetPasswordCode = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password reset successfully" });
});

export {
  registerUser,
  loginUser,
  changePassword,
  getUserById,
  forgotPassword,
  verifyResetCode,
  resetPassword,
};