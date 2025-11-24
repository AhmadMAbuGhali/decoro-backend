import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const PAYPAL_API = process.env.PAYPAL_API;
const CLIENT = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_CLIENT_SECRET;

async function getAccessToken() {
  const tokenUrl = `${PAYPAL_API}/v1/oauth2/token`;
  const resp = await axios({
    url: tokenUrl,
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    auth: { username: CLIENT, password: SECRET },
    data: "grant_type=client_credentials"
  });
  return resp.data.access_token;
}

async function createPaypalOrder(amount, currency = "USD", returnUrl, cancelUrl) {
  const access = await getAccessToken();
  const url = `${PAYPAL_API}/v2/checkout/orders`;
  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: String(amount)
        }
      }
    ],
    application_context: {
      brand_name: "Decoro",
      return_url: returnUrl,
      cancel_url: cancelUrl
    }
  };
  const r = await axios.post(url, body, {
    headers: { Authorization: `Bearer ${access}` }
  });
  return r.data;
}

async function captureOrder(orderId) {
  const access = await getAccessToken();
  const url = `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`;
  const r = await axios.post(url, {}, {
    headers: { Authorization: `Bearer ${access}` }
  });
  return r.data;
}
// إضافة في نهاية الملف الحالي (paypal.service.js)
async function refundCapture(captureId, amount, currency = "USD") {
  // captureId: id of capture to refund (PayPal capture id)
  const access = await getAccessToken();
  const url = `${PAYPAL_API}/v2/payments/captures/${captureId}/refund`;
  const body = {
    amount: {
      value: String(amount),
      currency_code: currency
    }
  };
  const r = await axios.post(url, body, {
    headers: { Authorization: `Bearer ${access}` }
  });
  return r.data;
}

export default {
  getAccessToken,
  createPaypalOrder,
  captureOrder,
  refundCapture, // new export
};