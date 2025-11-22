// src/middleware/adminAuthMiddleware.js

import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import userService from "../modules/users/user.service.js";
import ApiError from "../core/errors/ApiError.js";

export const adminProtect = asyncHandler(async (req, res, next) => {
  let token = null;

  // Bearer token
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    token = auth.split(" ")[1];
  }

  if (!token)
    throw new ApiError(401, "Admin token missing");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
  } catch (e) {
    throw new ApiError(401, "Invalid or expired admin token");
  }

  const user = await userService.getUserById(decoded.id);
  if (!user || user.role !== "admin")
    throw new ApiError(403, "Admin access required");

  req.user = user;
  next();
});