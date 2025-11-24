import axios from "axios";

export async function sendPushNotification(fcmToken, title, body, data = {}) {
  const payload = {
    to: fcmToken,
    notification: {
      title,
      body
    },
    data
  };

  await axios.post("https://fcm.googleapis.com/fcm/send", payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `key=${process.env.FCM_SERVER_KEY}`
    }
  });
}