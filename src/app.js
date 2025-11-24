// src/app.js

import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import productRouter from "./modules/products/product.route.js";
import authRouter from "./modules/auth/auth.route.js";
import userRouter from "./modules/users/user.route.js";
import verificationRoutes from "./modules/verify/verify.route.js";
import adminAuthRouter from "./modules/admin/adminAuth.routes.js";
import adminUsersRouter from "./modules/admin/adminUsers.routes.js";
import socialAuthRouter from "./modules/auth/social.route.js";
import paymentsRouter from "./modules/payments/payments.route.js";
import cartRouter from "./modules/cart/cart.routes.js";
import orderRouter from "./modules/orders/order.routes.js";
import privacyRouter from "./modules/privacy/privacy.routes.js";
import notificationRouter from "./modules/notifications/notification.route.js";
import chatRouter from "./modules/chat/chat.route.js";
import couponRouter from "./modules/coupons/coupon.route.js";
import orderTrackingRouter from "./modules/orders/orderTracking.route.js";
import returnRouter from "./modules/orders/return.route.js";






import reviewRouter from "./modules/reviews/review.route.js";
import waRouter from "./modules/wa/wa.route.js";



import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Security & Global Middlewares
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/verify", verificationRoutes);
app.use("/api/reviews", reviewRouter);
app.use("/api/wa", waRouter);
app.use("/api/admin/auth", adminAuthRouter);
app.use("/api/admin/users", adminUsersRouter);
app.use("/api/auth/social", socialAuthRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/privacy", privacyRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/chat", chatRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/orders", orderTrackingRouter);
app.use("/api/returns", returnRouter);

// Error Handler
app.use(errorHandler);

export default app;