// src/modules/admin/adminAuth.routes.js

import express from "express";
import AdminAuthController from "./adminAuth.controller.js";
import { adminProtect } from "../../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.post("/login", AdminAuthController.login);
router.post("/refresh", AdminAuthController.refresh);
router.post("/logout", AdminAuthController.logout);
router.get("/me", adminProtect, AdminAuthController.me);

export default router;