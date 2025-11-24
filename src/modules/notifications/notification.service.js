import Notification from "../../models/notification.model.js";
import { io } from "../../../server.js";
import User from "../../models/user.model.js";
import { sendPushNotification } from "../../core/fcm.js";

class NotificationService {
  async createNotification({ user, title, message, type, channel = "in_app", metadata = {} }) {
    
    // 1️⃣ حفظ الإشعار في قاعدة البيانات
    const notif = await Notification.create({
      user,
      title,
      message,
      type,
      channel,
      metadata
    });

    // 2️⃣ بث الإشعار لحظيًا عبر Socket.IO
    io.to(user.toString()).emit("new_notification", notif);

    // 3️⃣ إرسال Push Notification عبر FCM (إن وجد token)
    const userObj = await User.findById(user);

    if (userObj?.fcmToken) {
      try {
        await sendPushNotification(
          userObj.fcmToken,
          title,
          message,
          metadata
        );
      } catch (err) {
        console.error("FCM send error:", err.message);
      }
    }

    return notif;
  }

  async getUserNotifications(userId) {
    return Notification.find({ user: userId }).sort({ createdAt: -1 });
  }

  async markAsRead(id) {
    return Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
  }

  async markAllAsRead(userId) {
    await Notification.updateMany({ user: userId }, { isRead: true });
    return true;
  }

  async deleteNotification(id) {
    return Notification.findByIdAndDelete(id);
  }

  async deleteAllForUser(userId) {
    await Notification.deleteMany({ user: userId });
    return true;
  }
}

export default new NotificationService();