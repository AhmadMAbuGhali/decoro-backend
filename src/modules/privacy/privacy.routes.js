import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { isAdmin } from "../../middleware/admin.middleware.js";
import {
  getAllPrivacy,
  getPrivacyById,
  getPrivacyByLang,
  createPrivacy,
  updatePrivacy,
  deletePrivacy
} from "./privacy.controller.js";

const router = express.Router();

// Public
router.get("/lang/:lang", getPrivacyByLang);

// Admin
router.use(protect, isAdmin);

router.get("/", getAllPrivacy);
router.get("/:id", getPrivacyById);
router.post("/", createPrivacy);
router.put("/:id", updatePrivacy);
router.delete("/:id", deletePrivacy);

export default router;