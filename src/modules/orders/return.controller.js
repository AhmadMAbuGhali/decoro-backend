import returnService from "./return.service.js";

export const createReturnRequest = async (req, res) => {
  try {
    const { orderId, reason } = req.body;

    const result = await returnService.requestReturn({
      order: orderId,
      user: req.user._id,
      reason,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getMyReturns = async (req, res) => {
  res.json(await returnService.getUserReturns(req.user._id));
};

export const getAllReturns = async (req, res) => {
  res.json(await returnService.getAll());
};

export const adminUpdateReturn = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const result = await returnService.updateStatus(req.params.id, status, adminNote);

    // إرسال إشعار للمستخدم
    const notificationService = (await import("../notifications/notification.service.js")).default;
    const orderId = result.order;
    const order = (await import("../../../src/models/order.model.js")).default;
    const ord = await order.findById(orderId);
    const userId = result.user;

    await notificationService.createNotification({
      user: userId,
      title: "تحديث حالة الإرجاع",
      message: `حالة طلب الإرجاع: ${result.status}`,
      type: "general",
      metadata: { returnId: result._id, orderId }
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};