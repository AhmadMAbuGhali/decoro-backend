import PhoneVerification from "../../models/phoneVerification.model.js";
import User from "../../models/user.model.js";
import { generateOTP, normalizePhone } from "../../utils/verification.helpers.js";
import { sendWhatsAppText } from "../../utils/whatsapp.service.js";
import dotenv from "dotenv";
dotenv.config();

const EXPIRE_MIN = Number(process.env.WA_CODE_EXPIRES_MINUTES || 10);
const COOLDOWN_SEC = Number(process.env.WA_RESEND_COOLDOWN_SECONDS || 60);
const DAILY_LIMIT = Number(process.env.WA_DAILY_LIMIT || 10);

class WaService {
  async sendCode(phoneRaw) {
    const phone = normalizePhone(phoneRaw);
    if (!phone) throw new Error("Invalid phone");

    // check last record
    let rec = await PhoneVerification.findOne({ phone }).sort({ createdAt: -1 });

    const now = new Date();

    // daily count enforcement (simple): if rec exists and same day, use dailyCount; else reset
    if (!rec || (rec && !this.isSameDay(rec.lastSentAt, now))) {
      // create new rec
      rec = null;
    }

    if (rec) {
      // cooldown check
      const diffSec = (now - new Date(rec.lastSentAt)) / 1000;
      if (diffSec < COOLDOWN_SEC) {
        throw new Error(`Please wait ${Math.ceil(COOLDOWN_SEC - diffSec)} seconds before resending`);
      }
      // daily limit
      if (rec.dailyCount >= DAILY_LIMIT) {
        throw new Error("Daily send limit reached for this phone");
      }
    }

    const code = generateOTP(6);
    const expiresAt = new Date(Date.now() + EXPIRE_MIN * 60 * 1000);

    // create new verification record
    const newRec = await PhoneVerification.create({
      phone,
      code,
      attempts: 0,
      lastSentAt: now,
      expiresAt,
      verified: false,
      dailyCount: rec ? rec.dailyCount + 1 : 1
    });

    // Send via WhatsApp
    const text = `رمز التحقق لتطبيق Decoro هو: ${code}. صالح لمدّة ${EXPIRE_MIN} دقيقة.`;
    await sendWhatsAppText(phone, text);

    return { message: "Code sent", expiresAt };
  }

  async verifyCode(phoneRaw, codeInput) {
    const phone = normalizePhone(phoneRaw);
    if (!phone) throw new Error("Invalid phone");

    // Find latest record for phone
    const rec = await PhoneVerification.findOne({ phone }).sort({ createdAt: -1 });
    if (!rec) throw new Error("No code sent to this phone");

    if (rec.verified) throw new Error("Phone already verified");

    // expired?
    if (new Date() > new Date(rec.expiresAt)) {
      throw new Error("Code expired");
    }

    // attempt increment
    rec.attempts = (rec.attempts || 0) + 1;
    await rec.save();

    if (rec.code !== String(codeInput)) {
      throw new Error("Invalid code");
    }

    // mark verified
    rec.verified = true;
    await rec.save();

    // optional: update user (if exists) — set phone and phoneVerified true
    const user = await User.findOne({ phone });
    if (user) {
      user.phone = phone;
      user.phoneVerified = true;
      await user.save();
    }

    return { message: "Phone verified" };
  }

  isSameDay(d1, d2) {
    if (!d1) return false;
    const a = new Date(d1);
    return a.getUTCFullYear() === d2.getUTCFullYear() &&
           a.getUTCMonth() === d2.getUTCMonth() &&
           a.getUTCDate() === d2.getUTCDate();
  }
}

export default new WaService();