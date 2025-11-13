import expressAsyncHandler from "express-async-handler";
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";


// Controller
import productController from "../controller/productController.js";

const productRouter = express.Router();

// Routes
productRouter.post("/", protect, expressAsyncHandler(productController.createProduct));
productRouter.get("/", expressAsyncHandler(productController.getAllProducts));
productRouter.get("/:id", expressAsyncHandler(productController.getProductById));
productRouter.put("/:id", protect, expressAsyncHandler(productController.updateProduct));
productRouter.delete("/:id", protect, expressAsyncHandler(productController.deleteProduct));
productRouter.post("/:id/image", protect, upload.single("image"),expressAsyncHandler(productController.uploadProductImage));

export default productRouter;