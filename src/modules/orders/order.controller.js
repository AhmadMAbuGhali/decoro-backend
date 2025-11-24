import orderService from "./order.service.js";
import PaymentTransaction from "../../models/paymentTransaction.model.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address, paymentMethod = "card", currency = "EGP", metadata = {} } = req.body;

    if (!address || !address.fullName || !address.phone || !address.city || !address.street) {
      return res.status(400).json({ message: "Address fields missing" });
    }

    const order = await orderService.createOrderFromCart(userId, address, paymentMethod, currency, metadata);

    res.status(201).json({ order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await orderService.getUserOrders(userId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await orderService.updateOrderStatus(req.params.id, status);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};