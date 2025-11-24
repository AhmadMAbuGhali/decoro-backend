// src/services/payment.service.js
import Paymob from "./paymob.service.js";
import Paypal from "./paypal.service.js";
import PaymentTransaction from "../../models/paymentTransaction.model.js";

class PaymentService {
  // create payment - returns client details for frontend/mobile
  async createPayment({ userId, orderId, amount, currency = "EGP", method = "card", provider = "paymob", returnUrls = {} }) {
    // amount: in main unit (e.g., 100.50) -> convert to cents for paymob if needed
    // For Paymob: amount_cents = Math.round(amount * 100)
    if (provider === "paymob") {
      const amountCents = Math.round(amount * 100);
      const { token, order } = await Paymob.createPaymobOrder(amountCents, currency);
      const billingData = {}; // optionally add user billing
      const paymentKeyResponse = await Paymob.requestPaymobPaymentKey(amountCents, order.id, billingData, currency);
      const paymentToken = paymentKeyResponse.token;
      const iframe = Paymob.getPaymobIframeUrl(paymentToken);
      const tx = await PaymentTransaction.create({
        user: userId,
        order: orderId,
        provider: "paymob",
        method,
        amount: amountCents,
        currency,
        status: "pending",
        providerOrderId: order.id,
        providerSessionId: paymentToken,
        raw: { order, paymentKeyResponse }
      });
      return { provider: "paymob", iframe, paymentToken, txId: tx._id };
    } else if (provider === "paypal") {
      // PayPal expects amount as decimal string
      const ret = await Paypal.createPaypalOrder(String(amount), currency, returnUrls.returnUrl, returnUrls.cancelUrl);
      // ret contains id and links
      const tx = await PaymentTransaction.create({
        user: userId,
        order: orderId,
        provider: "paypal",
        method: "paypal",
        amount,
        currency,
        status: "pending",
        providerOrderId: ret.id,
        raw: ret
      });
      const approve = (ret.links || []).find(l => l.rel === "approve");
      return { provider: "paypal", approveUrl: approve?.href, orderId: ret.id, txId: tx._id };
    } else {
      throw new Error("Unsupported provider");
    }
  }

  async handlePaymobCallback(payload) {
    // payload from Paymob webhook / redirect. Update payment tx status accordingly.
    // Expected payload structure depends on Paymob docs.
    const { obj } = payload; // example if paymob sends { obj: { order, ... } }
    const providerOrderId = obj?.order?.id || obj?.id;
    const tx = await PaymentTransaction.findOne({ providerOrderId });
    if (!tx) return null;

    // inspect payload to decide captured or failed
    // This is simplified: mark captured if success
    if (payload?.success || payload?.is_payment) {
      tx.status = "captured";
    } else {
      tx.status = "failed";
    }
    tx.raw = { ...(tx.raw || {}), lastWebhook: payload };
    await tx.save();
    return tx;
  }

  async handlePaypalWebhook(payload) {
    // payload structure per PayPal docs
    const providerOrderId = payload.resource?.id || payload.resource?.billing_agreement_id;
    const tx = await PaymentTransaction.findOne({ providerOrderId });
    if (!tx) return null;

    if (payload.event_type === "CHECKOUT.ORDER.APPROVED" || payload.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      tx.status = "captured";
    } else if (payload.event_type === "PAYMENT.CAPTURE.DENIED" || payload.event_type === "PAYMENT.CAPTURE.REFUNDED") {
      tx.status = "failed";
    }
    tx.raw = { ...(tx.raw || {}), lastWebhook: payload };
    await tx.save();
    return tx;
  }

  /**
   * Refund a payment by tx id
   * @param {String} txId - PaymentTransaction _id
   * @param {Number} amount - amount in "display units" (e.g., 100.50)
   * @returns {Object} result from provider
   */
  async refundPayment(txId, amount) {
    const tx = await PaymentTransaction.findById(txId);
    if (!tx) throw new Error("Payment transaction not found");

    // Normalize amount
    const currency = tx.currency || "EGP";

    let providerRes = null;

    if (tx.provider === "paypal") {
      // For PayPal we need capture id stored in tx.raw.captureId or providerPaymentId
      const captureId = tx.raw?.captureId || tx.providerPaymentId || tx.providerSessionId || null;
      if (!captureId) throw new Error("PayPal capture id not found in transaction");

      // amount as decimal string
      providerRes = await Paypal.refundCapture(captureId, amount, currency);

    } else if (tx.provider === "paymob") {
      // For Paymob use order id or transaction id stored
      const orderId = tx.providerOrderId || tx.raw?.order?.id;
      if (!orderId) throw new Error("Paymob order id not found in transaction");

      // Paymob expects amount in cents
      const amountCents = Math.round(amount * 100);
      providerRes = await Paymob.refundPaymob(orderId, amountCents);

    } else {
      throw new Error("Unsupported provider for refund");
    }

    // update transaction
    tx.status = "refunded";
    tx.raw = { ...(tx.raw || {}), refundResponse: providerRes };
    await tx.save();

    // update order payment status
    if (tx.order) {
      const order = await Order.findById(tx.order);
      if (order) {
        order.paymentStatus = "refunded";
        order.orderStatus = "cancelled"; // or 'refunded' if you prefer
        await order.save();
      }
    }

    return providerRes;
  }
}



export default new PaymentService();