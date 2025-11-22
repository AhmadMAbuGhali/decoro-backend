// src/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
const CLOUD_API_KEY = process.env.CLOUDINARY_API_KEY || process.env.CLOUD_API_KEY;
const CLOUD_API_SECRET = process.env.CLOUDINARY_API_SECRET || process.env.CLOUD_API_SECRET;

if (!CLOUD_NAME || !CLOUD_API_KEY || !CLOUD_API_SECRET) {
  // don't throw in runtime — log and allow dev to continue
  console.warn("Cloudinary not fully configured. Some image uploads may fail.");
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
  secure: true,
});

export default cloudinary;