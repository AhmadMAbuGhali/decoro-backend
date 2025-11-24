import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { createAddress, getAddresses, setDefaultAddress, deleteAddress } from "./address.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", createAddress);
router.get("/", getAddresses);
router.put("/:id/default", setDefaultAddress);
router.delete("/:id", deleteAddress);

export default router;