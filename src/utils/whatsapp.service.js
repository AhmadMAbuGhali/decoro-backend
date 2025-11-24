import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const PHONE_ID = process.env.WA_PHONE_NUMBER_ID;
const TOKEN = process.env.WA_ACCESS_TOKEN;
const API_URL = (process.env.WA_API_URL || "https://graph.facebook.com") + "/" + (process.env.WA_API_VERSION || "v17.0");

if (!PHONE_ID || !TOKEN) {
  console.warn("⚠️ WhatsApp config missing. WA_PHONE_NUMBER_ID or WA_ACCESS_TOKEN not set.");
}

export async function sendWhatsAppText(phone, text) {
  // phone must be in international format without +, e.g. "2010xxxxxxx"
  const url = `${API_URL}/${PHONE_ID}/messages`;

  const body = {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: { body: text }
  };

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  };

  const resp = await axios.post(url, body, { headers });
  return resp.data;
}

export default { sendWhatsAppText };