import OrderTracking from "../../models/orderTracking.model.js";

class OrderTrackingService {
  async addStatus(orderId, status, note = "", updatedBy = "admin") {
    return OrderTracking.create({
      order: orderId,
      status,
      note,
      updatedBy
    });
  }

  async getTracking(orderId) {
    return OrderTracking.find({ order: orderId }).sort({ createdAt: 1 });
  }
}

export default new OrderTrackingService();