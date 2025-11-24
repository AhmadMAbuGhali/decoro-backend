// src/modules/auth/social.controller.js
import asyncHandler from "express-async-handler";
import socialAuthService from "./social.service.js";

export const socialLogin = asyncHandler(async (req, res) => {
  const { provider, token } = req.body;
  if (!provider || !token) return res.status(400).json({ message: "provider and token required" });

  const result = await socialAuthService.handleSocialLogin(provider, token, {
    ip: req.ip,
    userAgent: req.headers["user-agent"] || ""
  });

  res.json(result);
});