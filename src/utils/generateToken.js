// src/utils/generateToken.js

import { generateAccessToken, createRefreshToken } from "./tokenUtils.js";

export default async function generateTokenForUser(user, { ip = "", userAgent = "" } = {}) {
  const payload = { id: user._id, role: user.role };

  const accessToken = generateAccessToken(payload, false);

  const refresh = await createRefreshToken({
    userId: user._id,
    ip,
    userAgent,
  });

  return {
    accessToken,
    refreshToken: refresh.token,
    refreshExpiresAt: refresh.expiresAt,
  };
}