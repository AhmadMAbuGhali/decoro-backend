import cartService from "./cart.service.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await cartService.getCartByUser(userId);
    const totals = cartService.computeTotals(cart);
    res.json({ cart, totals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;
    const cart = await cartService.addItem(userId, productId, quantity);
    const totals = cartService.computeTotals(cart);
    res.status(201).json({ cart, totals });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateItem(userId, itemId, quantity);
    const totals = cartService.computeTotals(cart);
    res.json({ cart, totals });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;
    const cart = await cartService.removeItem(userId, itemId);
    const totals = cartService.computeTotals(cart);
    res.json({ cart, totals });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await cartService.clearCart(userId);
    res.json({ cart });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};