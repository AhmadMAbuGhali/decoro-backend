import orderService from "../services/orderService";

const createOrder = async (req, res) => {
    try {
        const { user, products, totalPrice, status } = req.body;
        const order = await orderService.createOrder(user, products, totalPrice, status);
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await orderService.getOrderById(orderId);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        const updatedOrder = await orderService.updateOrderStatus(orderId, status);
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.id;
        const orders = await orderService.getUserOrders(userId);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const deletedOrder = await orderService.deleteOrder(orderId);
        res.json(deletedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getUserOrders,
    deleteOrder,
};