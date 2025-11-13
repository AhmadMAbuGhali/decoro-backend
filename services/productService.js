import Product from "../models/products.js";

export const createProduct = async (name, description, image, price, stock) => {
    const product = await Product.create({
        name,
        description,
        image,
        price,
        stock,
    });
    return product;
};

export const getAllProducts = async () => {
    const products = await Product.find();
    return products;
};

export const getProductById = async (id) => {
    const product = await Product.findById(id);
    return product;
};

export const updateProduct = async (id, name, description, image, price, stock) => {
    const product = await Product.findById(id);
    if (product) {
        product.name = name;
        product.description = description;
        product.image = image;
        product.price = price;
        product.stock = stock;
        await product.save();
        return product;
    } else {
        throw new Error("Product not found");
    }
};

export const deleteProduct = async (id) => {
    const product = await Product.findById(id);
    if (product) {
        await product.remove();
        return product;
    } else {
        throw new Error("Product not found");
    }
};

// upload image
export const uploadProductImage = async (id, url, publicId) => {
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");

    product.image = { url, public_id: publicId };
    await product.save();
    return product;
};

export default {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadProductImage,
};