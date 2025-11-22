// src/modules/users/user.route.js

import express from "express";
import UserController from "./user.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import { isAdmin } from "../../middleware/admin.middleware.js";

const router = express.Router();

// Admin only
router.post("/", protect, isAdmin, UserController.create);
router.get("/", protect, isAdmin, UserController.getAll);
router.get("/:id", protect, isAdmin, UserController.getById);
router.put("/:id", protect, isAdmin, UserController.update);
router.delete("/:id", protect, isAdmin, UserController.delete);

// User change own password
router.post("/change-password", protect, UserController.changePassword);

export default router;