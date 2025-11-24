import Cart from "../../models/cart.model.js";
import Product from "../../models/product.model.js";

class CartService {
  async getCartByUser(userId) {
    let cart = await Cart.findOne({ user: userId }).populate("items.product", "name price mainImage");
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
      cart = await Cart.findById(cart._id).populate("items.product", "name price mainImage");
    }
    return cart;
  }

  async addItem(userId, productId, quantity = 1) {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const existing = cart.items.find(i => String(i.product) === String(productId));
    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        mainImage: product.mainImage || null
      });
    }

    cart.updatedAt = new Date();
    await cart.save();
    return cart;
  }

  async updateItem(userId, itemId, quantity) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");
    const item = cart.items.id(itemId);
    if (!item) throw new Error("Cart item not found");
    if (quantity <= 0) {
      item.remove();
    } else {
      item.quantity = Number(quantity);
    }
    cart.updatedAt = new Date();
    await cart.save();
    return cart;
  }

  async removeItem(userId, itemId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");
    const item = cart.items.id(itemId);
    if (!item) throw new Error("Cart item not found");
    item.remove();
    cart.updatedAt = new Date();
    await cart.save();
    return cart;
  }

  async clearCart(userId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return null;
    cart.items = [];
    cart.updatedAt = new Date();
    await cart.save();
    return cart;
  }

  // compute totals
  computeTotals(cart) {
    const subtotal = cart.items.reduce((s, i) => s + (i.price * i.quantity), 0);
    // you can add taxes/shipping later
    return {
      subtotal,
      total: subtotal
    };
  }
}

export default new CartService();