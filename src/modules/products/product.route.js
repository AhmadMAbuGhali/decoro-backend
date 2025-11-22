// src/modules/products/product.route.js

import express from "express";
import ProductController from "./product.controller.js";
import upload from "../../middleware/upload.middleware.js";
import { adminProtect } from "../../middleware/adminAuthMiddleware.js";

const router = express.Router();

// CRUD
router.post("/", adminProtect, ProductController.create);
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);
router.put("/:id", adminProtect, ProductController.update);
router.delete("/:id", adminProtect, ProductController.delete);

// Upload main image
router.post(
  "/:id/image",
  adminProtect,
  upload.single("image"),
  ProductController.uploadMainImage
);

// Upload gallery images
router.post(
  "/:id/gallery",
  adminProtect,
  upload.array("image", 20),
  ProductController.uploadGallery
);

// Delete specific gallery image
router.post(
  "/:id/gallery/delete",
  adminProtect,
  ProductController.deleteGalleryImage
);

export default router;