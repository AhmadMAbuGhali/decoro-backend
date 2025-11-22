// src/utils/tokenUtils.js

import crypto from "crypto";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshToken.model.js";

// =======================
// Helpers
// =======================
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// Refresh token expires in X days
const REFRESH_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 30);

// Access token expires in minutes (default 15m)
const ACCESS_EXPIRES = process.env.ACCESS_EXPIRES || "15m";

// =======================
// Generate Access Token
// =======================
export function generateAccessToken(payload, isAdmin = false) {
  return jwt.sign(payload, isAdmin ? process.env.ADMIN_JWT_SECRET : process.env.JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  });
}

// =======================
// Create Refresh Token (hashed)
// =======================
export async function createRefreshToken({ userId, ip, userAgent }) {
  const rawToken = crypto.randomBytes(40).toString("hex"); // token sent to user
  const hashed = hashToken(rawToken);                      // token stored (hashed)

  const expiresAt = new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    token: hashed,
    user: userId,
    ip,
    userAgent,
    expiresAt,
  });

  return {
    token: rawToken,
    expiresAt,
  };
}

// =======================
// Rotate Refresh Token
// =======================
export async function rotateRefreshToken(oldTokenRaw, { userId, ip, userAgent }) {
  const oldHashed = hashToken(oldTokenRaw);

  const stored = await RefreshToken.findOne({ token: oldHashed, user: userId });

  if (!stored || stored.revoked) return null;

  stored.revoked = true;

  const { token: newRaw, expiresAt } = await createRefreshToken({
    userId,
    ip,
    userAgent,
  });

  stored.replacedByToken = hashToken(newRaw);
  await stored.save();

  return {
    token: newRaw,
    expiresAt,
  };
}

// =======================
// Revoke Refresh Token
// =======================
export async function revokeRefreshToken(rawToken) {
  const hashed = hashToken(rawToken);

  const token = await RefreshToken.findOne({ token: hashed });
  if (!token) return false;

  token.revoked = true;
  await token.save();

  return true;
}