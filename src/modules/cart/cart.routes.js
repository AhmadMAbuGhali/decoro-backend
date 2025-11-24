import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from "./cart.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post("/add", addToCart); // body: { productId, quantity }
router.put("/item/:itemId", updateCartItem); // body: { quantity }
router.delete("/item/:itemId", removeCartItem);
router.delete("/", clearCart);

export default router;