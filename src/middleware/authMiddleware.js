// src/middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import userService from "../modules/users/user.service.js";
import ApiError from "../core/errors/ApiError.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token = null;

  // Bearer token
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    token = auth.split(" ")[1];
  }

  // fallback to cookie token
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) throw new ApiError(401, "Not authorized");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    throw new ApiError(401, "Token invalid or expired");
  }

  const user = await userService.getUserById(decoded.id);
  req.user = user;

  next();
});