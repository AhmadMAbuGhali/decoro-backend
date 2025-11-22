// src/config/db.js
import mongoose from "mongoose";
import logger from "../middleware/logging.middleware.js";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    logger.error("❌ MONGO_URI is missing in .env");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);

    logger.info(`📦 MongoDB Connected: ${conn.connection.host}`);

    // --- Event listeners ---
    mongoose.connection.on("error", (err) => {
      logger.error("❌ MongoDB Error: " + err.message);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("⚠️ MongoDB Disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("🔄 MongoDB Reconnected.");
    });

    return conn;
  } catch (error) {
    logger.error("❌ MongoDB Connection Failed: " + error.message);
    process.exit(1);
  }
};

export default connectDB;