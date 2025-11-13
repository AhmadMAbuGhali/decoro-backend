import productService from "../services/productService.js";


const createProduct = async (req, res) => {
    try {
        const { name, description, image, price, stock } = req.body;
        const product = await productService.createProduct(name, description, image, price, stock);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productService.getProductById(productId);
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, image, price, stock } = req.body;
        const updatedProduct = await productService.updateProduct(productId, name, description, image, price, stock);
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await productService.deleteProduct(productId);
        res.json(deletedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded", success: false });
    }

    // رفع الصورة على Cloudinary
    const { url } = await uploadToCloudinary(req.file.buffer); // استخدم buffer مع Multer memoryStorage

    const productId = req.params.id;
    const uploadedImage = await productService.uploadProductImage(productId, url);

    res.json(uploadedImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export default {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadProductImage,
};