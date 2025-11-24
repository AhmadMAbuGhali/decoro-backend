import notificationService from "./notification.service.js";

export const createNotification = async (req, res) => {
  try {
    const notif = await notificationService.createNotification(req.body);
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const list = await notificationService.getUserNotifications(userId);
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const id = req.params.id;
    const notif = await notificationService.markAsRead(id);
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    await notificationService.markAllAsRead(userId);
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const id = req.params.id;
    await notificationService.deleteNotification(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAllForUser = async (req, res) => {
  try {
    const userId = req.user._id;
    await notificationService.deleteAllForUser(userId);
    res.json({ message: "All notifications deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};