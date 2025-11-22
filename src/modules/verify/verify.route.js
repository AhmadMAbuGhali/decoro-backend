// src/modules/verify/verify.route.js

import express from "express";
import VerifyController from "./verify.controller.js";

const router = express.Router();

// Send verification code
router.post("/send", VerifyController.sendCode);

// Confirm verification code
router.post("/confirm", VerifyController.verify);

export default router;