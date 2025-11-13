import asyncHandler from "express-async-handler";
import { sendVerificationCode, verifyCode } from "../services/verifyService.js";

// إرسال الكود
export const sendCodeController = asyncHandler(async (req, res) => {
  const { email, type } = req.body;
  const result = await sendVerificationCode(email, type);
  res.json(result);
});

// التحقق من الكود
export const verifyCodeController = asyncHandler(async (req, res) => {
  const { email, code, type } = req.body;
  const result = await verifyCode(email, code, type);
  res.json(result);
});