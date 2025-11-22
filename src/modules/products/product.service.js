// src/modules/products/product.service.js

import Product from "../../models/product.model.js";
import ApiError from "../../core/errors/ApiError.js";

class ProductService {
  // ===========================
  // Create Product
  // ===========================
  async createProduct(data) {
    const product = await Product.create({
      ...data,
      mainImage: data.mainImage ?? null,
      gallery: Array.isArray(data.gallery) ? data.gallery : [],
    });

    return product;
  }

  // ===========================
  // Get All Products
  // ===========================
  async getAllProducts() {
    return await Product.find().sort({ createdAt: -1 });
  }

  // ===========================
  // Get Product by ID
  // ===========================
  async getProductById(id) {
    const p = await Product.findById(id);
    if (!p) throw new ApiError(404, "Product not found");
    return p;
  }

  // ===========================
  // Update Product
  // ===========================
  async updateProduct(id, data) {
    const product = await Product.findById(id);
    if (!product) throw new ApiError(404, "Product not found");

    Object.assign(product, data);
    await product.save();

    return product;
  }

  // ===========================
  // Delete Product
  // ===========================
  async deleteProduct(id) {
    const product = await Product.findById(id);
    if (!product) throw new ApiError(404, "Product not found");

    await product.deleteOne();
    return product;
  }

  // ===========================
  // Set Main Image
  // ===========================
  async setMainImage(id, image) {
    const product = await Product.findById(id);
    if (!product) throw new ApiError(404, "Product not found");

    product.mainImage = image;

    await product.save();
    return product;
  }

  // ===========================
  // Add Gallery Images
  // ===========================
  async addGalleryImages(id, imagesArr) {
    const product = await Product.findById(id);
    if (!product) throw new ApiError(404, "Product not found");

    if (!Array.isArray(product.gallery)) product.gallery = [];

    for (const img of imagesArr) {
      product.gallery.push(img);
    }

    await product.save();
    return product;
  }

  // ===========================
  // Remove a Gallery Image
  // ===========================
  async removeGalleryImage(id, publicId) {
    const product = await Product.findById(id);
    if (!product) throw new ApiError(404, "Product not found");

    product.gallery = product.gallery.filter(
      (img) => img.public_id !== publicId
    );

    if (product.mainImage?.public_id === publicId) {
      product.mainImage = null;
    }

    await product.save();
    return product;
  }
}

export default new ProductService();