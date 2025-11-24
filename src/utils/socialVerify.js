// src/utils/socialVerify.js
import axios from "axios";
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem"; // ستثبت الحزمة
import dotenv from "dotenv";
dotenv.config();

const GOOGLE_TOKENINFO = "https://oauth2.googleapis.com/tokeninfo";
const FB_ME = "https://graph.facebook.com/me";
const FB_APP_TOKEN = () => `${process.env.FB_APP_ID}|${process.env.FB_APP_SECRET}`;
const APPLE_KEYS_URL = "https://appleid.apple.com/auth/keys";

export async function verifyGoogleIdToken(idToken) {
  // استخدام tokeninfo endpoint (بسيط وآمن إذا تتحقق من aud)
  const res = await axios.get(`${GOOGLE_TOKENINFO}?id_token=${idToken}`);
  const data = res.data;
  // check audience
  if (data.aud !== process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Invalid Google token audience");
  }
  return {
    id: data.sub,
    email: data.email,
    email_verified: data.email_verified === "true" || data.email_verified === true,
    name: data.name,
    avatar: data.picture,
  };
}

export async function verifyFacebookToken(userAccessToken) {
  // first get user info
  // note: requester must send access token from FB SDK with "email" permission
  const res = await axios.get(`${FB_ME}?fields=id,name,email,picture&access_token=${userAccessToken}`);
  const data = res.data;
  return {
    id: data.id,
    email: data.email,
    email_verified: !!data.email,
    name: data.name,
    avatar: data.picture?.data?.url,
  };
}

async function getApplePublicKeys() {
  const r = await axios.get(APPLE_KEYS_URL);
  return r.data.keys;
}

export async function verifyAppleIdToken(idToken) {
  // idToken is a JWT, we must verify signature using Apple's JWKs
  const decodedHeader = jwt.decode(idToken, { complete: true }).header;
  const kid = decodedHeader.kid;
  const alg = decodedHeader.alg;

  const keys = await getApplePublicKeys();
  const key = keys.find(k => k.kid === kid && k.alg === alg);
  if (!key) throw new Error("Apple public key not found");

  const pem = jwkToPem(key); // requires jwk-to-pem package

  const payload = jwt.verify(idToken, pem, { algorithms: ["RS256"], audience: process.env.APPLE_CLIENT_ID });
  // payload may contain email, sub, email_verified
  return {
    id: payload.sub,
    email: payload.email,
    email_verified: payload.email_verified === "true" || payload.email_verified === true,
    name: payload.name || null,
    avatar: null,
  };
}