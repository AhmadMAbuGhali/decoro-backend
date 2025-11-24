// src/controllers/payment.controller.js
import paymentService from "./payment.service.js";

export const createPayment = async (req, res) => {
  try {
    const { amount, currency, provider = "paymob", method = "card", orderId } = req.body;
    const userId = req.user?._id; // optional

    const returnUrls = {
      returnUrl: req.body.returnUrl || `${process.env.FRONTEND_URL}/payment-success`,
      cancelUrl: req.body.cancelUrl || `${process.env.FRONTEND_URL}/payment-cancel`
    };

    const result = await paymentService.createPayment({
      userId,
      orderId,
      amount,
      currency,
      method,
      provider,
      returnUrls
    });

    res.json(result);
  } catch (err) {
    console.error("createPayment error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Generic webhook receiver
export const handleWebhook = async (req, res) => {
  try {
    const provider = req.params.provider; // 'paymob' or 'paypal'
    const payload = req.body;

    if (provider === "paymob") {
      await paymentService.handlePaymobCallback(payload);
    } else if (provider === "paypal") {
      await paymentService.handlePaypalWebhook(payload);
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("webhook error:", err);
    res.status(500).send("error");
  }
};