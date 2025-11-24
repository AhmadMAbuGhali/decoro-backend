import ReturnRequest from "../../models/returnRequest.model.js";

class ReturnService {
  async requestReturn({ order, user, reason }) {
    return ReturnRequest.create({ order, user, reason });
  }

  async updateStatus(id, status, adminNote) {
    return ReturnRequest.findByIdAndUpdate(
      id,
      { status, adminNote },
      { new: true }
    );
  }

  async getUserReturns(userId) {
    return ReturnRequest.find({ user: userId }).sort({ createdAt: -1 });
  }

  async getAll() {
    return ReturnRequest.find().populate("user order");
  }
async updateStatus(id, status, adminNote) {
    const rr = await ReturnRequest.findByIdAndUpdate(id, { status, adminNote }, { new: true });

    // إذا الحالة وصلت ل item_received أو مباشرة refunded -> نعمل refund
    if (status === "item_received" || status === "refunded") {
      try {
        // ابحث عن الطلب وTransaction
        const orderId = rr.order;
        // جلب الـ order و الـ transaction المرتبط
        const Order = (await import("../../../src/models/order.model.js")).default;
        const PaymentTransaction = (await import("../../../src/models/paymentTransaction.model.js")).default;

        const order = await Order.findById(orderId);
        if (order && order.transaction) {
          const tx = await PaymentTransaction.findById(order.transaction);
          if (tx && tx.status !== "refunded") {
            // amount to refund — يمكنك استخدام order.total أو قيمة معينة من rr
            const amountToRefund = (order.total) || (tx.amount / 100); // إذا خزنت amount بالـ cents
            // call paymentService.refundPayment
            await paymentService.refundPayment(tx._id, amountToRefund);
          }
        }
      } catch (err) {
        console.error("Refund process failed:", err.message);
        // لا نوقف العملية لكن نترك سجل الخطأ في لوج
      }
    }

    return rr;
  }
}

export default new ReturnService();