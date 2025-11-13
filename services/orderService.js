import { get } from "mongoose";
import order from "../models/orders.js";

export const createOrder = async (user, products, totalPrice, status) => {
    const order = await order.create({
        user,
        products,
        totalPrice,
        status,
    });
    return order;
};

export const getAllOrders = async () => {
    const orders = await order.find();
    return orders;
};


export const  getOrderById = async (id) => {
    const order = await order.findById(id);
    return order;
};

// update order status

export const updateOrderStatus = async (id, status) => {
    const order = await order.findById(id);
    if (order) {
        order.status = status;
        await order.save();
        return order;
    } else {
        throw new Error("Order not found");
    }
};

// get user order 

export const getUserOrders = async (userId) => {
    const orders = await order.find({ user: userId });
    return orders;
};

// delete order 
export const deleteOrder = async (id) => {
    const order = await order.findById(id);
    if (order) {
        await order.remove();
        return order;
    } else {
        throw new Error("Order not found");
    }
};


export default {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getUserOrders,
    deleteOrder,
};

