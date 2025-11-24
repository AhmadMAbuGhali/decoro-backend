import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE = process.env.PAYMOB_BASE_URL || "https://accept.paymobsolutions.com/api";
const API_KEY = process.env.PAYMOB_API_KEY;
const INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID; // used for card payments

// Helper to get auth token from Paymob (auth with API key)
async function getPaymobAuthToken() {
  // Paymob expects /auth/tokens with api_key
  const url = `${BASE}/auth/tokens`;
  const resp = await axios.post(url, { api_key: API_KEY });
  return resp.data.token;
}

// Create order on Paymob and return order id (Paymob order)
async function createPaymobOrder(amountCents, currency = "EGP") {
  const token = await getPaymobAuthToken();
  const url = `${BASE}/ecommerce/orders`;
  const payload = {
    auth_token: token,
    delivery_needed: "false",
    amount_cents: amountCents, // integer
    currency,
    items: []
  };
  const r = await axios.post(url, payload);
  return { token, order: r.data };
}

// Request payment key (to get iframe or payment token) for card/Apple/Google etc.
async function requestPaymobPaymentKey(amountCents, orderId, billingData = {}, currency = "EGP") {
  const token = await getPaymobAuthToken();
  const url = `${BASE}/acceptance/payment_keys`;
  const payload = {
    auth_token: token,
    amount_cents: amountCents,
    expiration: 3600,
    order_id: orderId,
    billing_data: billingData,
    currency,
    integration_id: Number(INTEGRATION_ID)
  };
  const r = await axios.post(url, payload);
  return r.data; // contains payment_token
}

// build redirect url for iframe payments (optional)
function getPaymobIframeUrl(payment_token) {
  // depending on paymob flow
  return `https://accept.paymobsolutions.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${payment_token}`;
}
// إضافة في نهاية ملف paymob.service.js
async function refundPaymob(orderId, amountCents) {
  // Paymob refund mechanism (قد تختلف endpoints حسب docs)
  // هنا مثال عام لمسار refund — راجع الوثائق الحقيقية وقم بتعديل endpoint/params
  const token = await getPaymobAuthToken();
  const url = `${BASE}/acceptance/void_refund`; // مثال افتراضي — غيره حسب docs
  const payload = {
    auth_token: token,
    order_id: orderId,
    amount_cents: amountCents
  };
  const r = await axios.post(url, payload);
  return r.data;
}

export default {
  getPaymobAuthToken,
  createPaymobOrder,
  requestPaymobPaymentKey,
  getPaymobIframeUrl,
  refundPaymob // new export
};