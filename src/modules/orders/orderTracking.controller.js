import trackingService from "./orderTracking.service.js";

export const addOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const orderId = req.params.id;

    const result = await trackingService.addStatus(orderId, status, note);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderTracking = async (req, res) => {
  try {
    const orderId = req.params.id;
    const history = await trackingService.getTracking(orderId);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};