// server.js

import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import User from "./src/models/user.model.js";

import logger from "./src/middleware/logging.middleware.js";

import { createServer } from "http";
import { Server } from "socket.io";

// Connect DB
await connectDB();

// Create default admin
async function createDefaultAdmin() {
  try {
    const email = process.env.DEFAULT_ADMIN_EMAIL;
    const exists = await User.findOne({ email });

    if (!exists) {
      await User.create({
        name: "Super Admin",
        email,
        password: process.env.DEFAULT_ADMIN_PASSWORD,
        role: "admin",
        isVerified: true,
      });
      console.log("✅ Default admin created");
    } else {
      console.log("ℹ️ Default admin exists");
    }
  } catch (err) {
    console.error("❌ Error creating default admin:", err);
  }
}

await createDefaultAdmin();

// Start Server
const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id);

  // ينضم المستخدم لغرفة حسب الـ userId
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});