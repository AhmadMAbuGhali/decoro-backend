import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllForUser,
  createNotification
} from "./notification.controller.js";

const router = express.Router();

// admin creates notification
router.post("/", createNotification);

router.post("/save-token", protect, async (req, res) => {
  try {
    const user = req.user;
    user.fcmToken = req.body.fcmToken;
    await user.save();
    res.json({ message: "Token saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// user endpoints
router.get("/", protect, getMyNotifications);
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);
router.delete("/:id", protect, deleteNotification);
router.delete("/", protect, deleteAllForUser);

export default router;