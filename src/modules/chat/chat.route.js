import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { adminProtect } from "../../middleware/adminAuthMiddleware.js";
import {
  sendMessage,
  adminSendMessage,
  myConversation,
  getMessages,
  getAllConversations
} from "./chat.controller.js";

const router = express.Router();

// user
router.post("/", protect, sendMessage);
router.get("/my", protect, myConversation);

// admin
router.post("/admin", adminProtect, adminSendMessage);
router.get("/admin/conversations", adminProtect, getAllConversations);

// messages of conversation
router.get("/:id/messages", protect, getMessages);

export default router;