import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { adminProtect } from "../../middleware/adminAuthMiddleware.js";
import {
  createReturnRequest,
  adminUpdateReturn,
  getMyReturns,
  getAllReturns,
} from "./return.controller.js";

const router = express.Router();

// user creates request
router.post("/", protect, createReturnRequest);

// user view their returns
router.get("/my", protect, getMyReturns);

// admin sees all returns
router.get("/", adminProtect, getAllReturns);

// admin updates request
router.put("/:id", adminProtect, adminUpdateReturn);

export default router;