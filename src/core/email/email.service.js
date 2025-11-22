// src/core/email/email.service.js

import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Reads HTML template and interpolates {{placeholders}}
  loadTemplate(templateName, data = {}) {
    const filePath = path.join(__dirname, `${templateName}.html`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Email template not found: ${filePath}`);
    }

    let html = fs.readFileSync(filePath, "utf8");

    for (const key in data) {
      html = html.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
    }

    return html;
  }

  async sendEmail(to, subject, templateName, data) {
    const html = this.loadTemplate(templateName, data);

    await this.transporter.sendMail({
      from: `"Decoro" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return true;
  }

  async sendVerificationEmail(to, code) {
    return await this.sendEmail(to, "Email Verification Code", "../verification-email", {
      APP_NAME: "Decoro",
      CODE: code,
      EXPIRY: "10 minutes",
      YEAR: new Date().getFullYear(),
    });
  }
}

export default new EmailService();