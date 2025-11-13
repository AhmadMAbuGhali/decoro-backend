import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// 🧭 نحدد المسار الحالي للملف
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sendVerificationEmail(to, code) {
  const APP_NAME = "Decoro";
  const EXPIRY = "10 minutes";
  const YEAR = new Date().getFullYear();

  // ✅ المسار الصحيح للقالب
  const templatePath = path.join(__dirname, "../verification-email.html");

  if (!fs.existsSync(templatePath)) {
    console.error("❌ Email template not found at:", templatePath);
    throw new Error("Email template not found");
  }

  let htmlTemplate = fs.readFileSync(templatePath, "utf8");

  htmlTemplate = htmlTemplate
    .replace(/{{APP_NAME}}/g, APP_NAME)
    .replace(/{{EXPIRY}}/g, EXPIRY)
    .replace(/{{CODE}}/g, code)
    .replace(/{{YEAR}}/g, YEAR);

  console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
  console.log("🔑 EMAIL_PASS:", process.env.EMAIL_PASS ? "****" : "❌ Missing");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${APP_NAME}" <${process.env.EMAIL_USER}>`,
    to,
    subject: `${APP_NAME} - Email Verification Code`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
  console.log("📨 Verification email sent to:", to);
}