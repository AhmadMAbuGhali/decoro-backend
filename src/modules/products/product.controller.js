// src/modules/products/product.controller.js

import asyncHandler from "express-async-handler";
import productService from "./product.service.js";
import uploadToCloudinary from "../../utils/cloudinaryUpload.js";
import ApiError from "../../core/errors/ApiError.js";

class ProductController {
  // Convert product to DTO
  toDto(product) {
    const p = product.toObject();
    return {
      id: p._id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category: p.category,
      materials: p.materials ?? [],
      mainImage: p.mainImage ?? null,
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }

  // ===========================
  // Create
  // ===========================
  create = asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body);
    res.status(201).json(this.toDto(product));
  });

  // ===========================
  // Get All
  // ===========================
  getAll = asyncHandler(async (req, res) => {
    const products = await productService.getAllProducts();
    res.json(products.map((p) => this.toDto(p)));
  });

  // ===========================
  // Get By ID
  // ===========================
  getById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    res.json(this.toDto(product));
  });

  // ===========================
  // Update
  // ===========================
  update = asyncHandler(async (req, res) => {
    const updated = await productService.updateProduct(
      req.params.id,
      req.body
    );
    res.json(this.toDto(updated));
  });

  // ===========================
  // Delete
  // ===========================
  delete = asyncHandler(async (req, res) => {
    const deleted = await productService.deleteProduct(req.params.id);
    res.json({
      success: true,
      deleted: this.toDto(deleted),
    });
  });

  // ===========================
  // Upload Main Image
  // ===========================
  uploadMainImage = asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, "No image uploaded");

    const uploaded = await uploadToCloudinary(req.file.buffer);

    const updated = await productService.setMainImage(req.params.id, {
      url: uploaded.url,
      public_id: uploaded.public_id,
    });

    res.json(this.toDto(updated));
  });

  // ===========================
  // Upload Gallery Images
  // ===========================
  uploadGallery = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0)
      throw new ApiError(400, "No images uploaded");

    const uploaded = [];
    for (const file of req.files) {
      const img = await uploadToCloudinary(file.buffer);
      uploaded.push({ url: img.url, public_id: img.public_id });
    }

    const updated = await productService.addGalleryImages(
      req.params.id,
      uploaded
    );

    res.json(this.toDto(updated));
  });

  // ===========================
  // Delete gallery image
  // ===========================
  deleteGalleryImage = asyncHandler(async (req, res) => {
    const { publicId } = req.body;
    if (!publicId) throw new ApiError(400, "publicId required");

    const updated = await productService.removeGalleryImage(
      req.params.id,
      publicId
    );

    res.json(this.toDto(updated));
  });
}

export default new ProductController();