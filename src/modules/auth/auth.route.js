// src/modules/auth/auth.route.js

import express from "express";
import AuthController from "./auth.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

// Profile
router.get("/me", protect, AuthController.me);

export default router;