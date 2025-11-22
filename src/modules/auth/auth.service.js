// src/modules/auth/auth.service.js

import User from "../../models/user.model.js";
import ApiError from "../../core/errors/ApiError.js";
import generateTokenForUser from "../../utils/generateToken.js";
import { rotateRefreshToken, revokeRefreshToken } from "../../utils/tokenUtils.js";
import jwt from "jsonwebtoken";

class AuthService {
  // =======================
  // Register
  // =======================
  async register({ name, email, password, role }, ip, userAgent) {
    const exists = await User.findOne({ email });
    if (exists) throw new ApiError(400, "Email already registered");

    const user = await User.create({
      name,
      email,
      password,
      role: role ?? "customer",
      isVerified: false,
    });

    const tokens = await generateTokenForUser(user, { ip, userAgent });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      ...tokens,
    };
  }

  // =======================
  // Login
  // =======================
  async login({ email, password }, ip, userAgent) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new ApiError(400, "Invalid email or password");

    const ok = await user.matchPassword(password);
    if (!ok) throw new ApiError(400, "Invalid email or password");

    const tokens = await generateTokenForUser(user, { ip, userAgent });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      ...tokens,
    };
  }

  // =======================
  // Refresh
  // =======================
  async refresh(refreshToken, ip, userAgent) {
    if (!refreshToken) throw new ApiError(400, "Refresh token required");

    const decoded = jwt.decode(refreshToken);
    if (!decoded?.id) throw new ApiError(401, "Invalid token");

    const newRT = await rotateRefreshToken(refreshToken, {
      userId: decoded.id,
      ip,
      userAgent,
    });

    if (!newRT) throw new ApiError(401, "Invalid or expired refresh token");

    const newAT = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_EXPIRES || "15m" }
    );

    return {
      accessToken: newAT,
      refreshToken: newRT.token,
      refreshExpiresAt: newRT.expiresAt,
    };
  }

  // =======================
  // Logout
  // =======================
  async logout(refreshToken) {
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }
    return { message: "Logged out" };
  }
}

export default new AuthService();