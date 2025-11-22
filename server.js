// server.js

import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import User from "./src/models/user.model.js";

import logger from "./src/middleware/logging.middleware.js";

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
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});