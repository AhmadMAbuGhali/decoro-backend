// src/modules/admin/adminAuth.service.js

import User from "../../models/user.model.js";
import ApiError from "../../core/errors/ApiError.js";
import generateAdminTokens from "../../utils/generateAdminTokens.js";
import RefreshToken from "../../models/refreshToken.model.js";
import { rotateRefreshToken, revokeRefreshToken } from "../../utils/tokenUtils.js";
import jwt from "jsonwebtoken";

class AdminAuthService {
  async login(email, password, ip, userAgent) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new ApiError(400, "Invalid email or password");

    if (user.role !== "admin") {
      throw new ApiError(403, "Admins only");
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) throw new ApiError(400, "Invalid email or password");

    const tokens = await generateAdminTokens(user, { ip, userAgent });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "admin",
      },
      ...tokens,
    };
  }

  async refresh(refreshToken, ip, userAgent) {
    if (!refreshToken) throw new ApiError(400, "Refresh token required");

    const decoded = jwt.decode(refreshToken);
    // decoding is optional; we validate through DB

    const newRT = await rotateRefreshToken(refreshToken, {
      userId: decoded?.id,
      ip,
      userAgent,
    });

    if (!newRT) throw new ApiError(401, "Invalid or expired refresh token");

    const accessToken = jwt.sign(
      { id: decoded.id, role: "admin" },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: process.env.ACCESS_EXPIRES || "15m" }
    );

    return {
      accessToken,
      refreshToken: newRT.token,
      refreshExpiresAt: newRT.expiresAt,
    };
  }

  async logout(refreshToken) {
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }
    return { message: "Admin logged out" };
  }
}

export default new AdminAuthService();