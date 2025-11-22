// src/modules/admin/adminUsers.routes.js

import express from "express";
import { adminProtect } from "../../middleware/adminAuthMiddleware.js";
import AdminUsersController from "./adminUsers.controller.js";

const router = express.Router();

router.use(adminProtect);

router.get("/", AdminUsersController.getAll);
router.get("/:id", AdminUsersController.getById);
router.post("/", AdminUsersController.create);
router.put("/:id", AdminUsersController.update);
router.delete("/:id", AdminUsersController.delete);

export default router;