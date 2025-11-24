import Conversation from "../../models/conversation.model.js";
import Message from "../../models/message.model.js";
import { io } from "../../../server.js";
import notificationService from "../notifications/notification.service.js";

class ChatService {

  async sendMessage({ userId, sender, message }) {
    let conversation = await Conversation.findOne({ user: userId });

    if (!conversation) {
      conversation = await Conversation.create({
        user: userId,
        lastMessage: message,
        lastSender: sender,
      });
    }

    const msg = await Message.create({
      conversation: conversation._id,
      sender,
      senderId: userId,
      senderRef: "User",
      message,
    });

    conversation.lastMessage = message;
    conversation.lastSender = sender;
    await conversation.save();

    // 🔥 بث لحظي للمحادثة
    io.to(userId.toString()).emit("new_message", msg);

    // 🔥 لو الرسالة من الأدمن → نرسل إشعار للمستخدم
    if (sender === "admin") {
      await notificationService.createNotification({
        user: userId,
        title: "رسالة جديدة من الدعم",
        message,
        type: "admin_message",
        metadata: { conversationId: conversation._id }
      });
    }

    return msg;
  }

  async getConversation(userId) {
    return Conversation.findOne({ user: userId });
  }

  async getMessages(conversationId) {
    return Message.find({ conversation: conversationId }).sort({ createdAt: 1 });
  }

  async getAllConversations() {
    return Conversation.find().sort({ updatedAt: -1 }).populate("user");
  }
}

export default new ChatService();