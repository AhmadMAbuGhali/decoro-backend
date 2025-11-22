// src/core/utils/crypto.js

import crypto from "crypto";

export const hashString = (str) => {
  return crypto.createHash("sha256").update(str).digest("hex");
};

export const generateRandomCode = (length = 6) => {
  return Math.floor(Math.random() * 10 ** length)
    .toString()
    .padStart(length, "0");
};

export default {
  hashString,
  generateRandomCode,
};