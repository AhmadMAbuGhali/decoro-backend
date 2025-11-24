// src/modules/auth/social.route.js
import express from "express";
import { socialLogin } from "./social.controller.js";

const router = express.Router();

router.post("/", socialLogin);

export default router;