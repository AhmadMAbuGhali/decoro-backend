// src/modules/auth/auth.controller.js

import asyncHandler from "express-async-handler";
import authService from "./auth.service.js";

class AuthController {
  register = asyncHandler(async (req, res) => {
    const result = await authService.register(
      req.body,
      req.ip,
      req.headers["user-agent"]
    );
    res.status(201).json(result);
  });

  login = asyncHandler(async (req, res) => {
    const result = await authService.login(
      req.body,
      req.ip,
      req.headers["user-agent"]
    );
    res.json(result);
  });

  refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    const result = await authService.refresh(
      refreshToken,
      req.ip,
      req.headers["user-agent"]
    );

    res.json(result);
  });

  logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    const response = await authService.logout(refreshToken);

    res.json(response);
  });

  me = asyncHandler(async (req, res) => {
    res.json(req.user);
  });
}

export default new AuthController();