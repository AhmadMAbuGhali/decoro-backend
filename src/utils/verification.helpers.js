import crypto from "crypto";

export function generateOTP(length = 6) {
  // آمن وسهل - رقم عشوائي
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(Math.floor(Math.random() * (max - min + 1) + min));
}

export function normalizePhone(phone) {
  // افتراضياً: نحذف أي مسافات و + و - و ( ) 
  return phone.replace(/[^\d]/g, "");
}