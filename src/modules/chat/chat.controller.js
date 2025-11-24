import chatService from "./chat.service.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    const result = await chatService.sendMessage({
      userId,
      sender: "user",
      message,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminSendMessage = async (req, res) => {
  try {
    const { message, userId } = req.body;

    const result = await chatService.sendMessage({
      userId,
      sender: "admin",
      message,
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const myConversation = async (req, res) => {
  const userId = req.user._id;
  const conv = await chatService.getConversation(userId);
  res.json(conv);
};

export const getMessages = async (req, res) => {
  const { id } = req.params;
  const msgs = await chatService.getMessages(id);
  res.json(msgs);
};

export const getAllConversations = async (req, res) => {
  const chats = await chatService.getAllConversations();
  res.json(chats);
};