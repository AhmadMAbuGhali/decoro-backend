// src/utils/generateAdminTokens.js

import { generateAccessToken, createRefreshToken } from "./tokenUtils.js";

export default async function generateAdminTokens(user, { ip, userAgent }) {
  const payload = { id: user._id, role: "admin" };

  const accessToken = generateAccessToken(payload, true);

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