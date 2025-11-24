import express from "express";
import { sendCode, verifyCode } from "./wa.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// Public send (or require auth if you want only logged users to request)
router.post("/send", sendCode);

// Verify (could be public)
router.post("/verify", verifyCode);

// Optional: if you want only logged-in user to "link" phone to their profile
// router.post("/link/send", protect, sendLinkCode);
// router.post("/link/verify", protect, verifyLinkCode);

export default router;