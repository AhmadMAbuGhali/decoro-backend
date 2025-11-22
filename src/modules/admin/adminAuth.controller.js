// src/modules/admin/adminAuth.controller.js

import asyncHandler from "express-async-handler";
import adminAuthService from "./adminAuth.service.js";

class AdminAuthController {
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await adminAuthService.login(
      email,
      password,
      req.ip,
      req.headers["user-agent"]
    );

    res.json(result);
  });

  refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    const result = await adminAuthService.refresh(
      refreshToken,
      req.ip,
      req.headers["user-agent"]
    );

    res.json(result);
  });

  logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    const result = await adminAuthService.logout(refreshToken);

    res.json(result);
  });

  me = asyncHandler(async (req, res) => {
    res.json(req.user);
  });
}

export default new AdminAuthController();