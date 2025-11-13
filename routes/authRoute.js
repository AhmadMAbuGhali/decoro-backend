import expressAsyncHandler from "express-async-handler";
import express from "express";
import User from "../models/user.js";
import {protect} from "../middlewares/authMiddleware.js";


// controller
import {loginUser,registerUser,changePassword,getUserById,forgotPassword,
  verifyResetCode,
  resetPassword,} from "../controller/authController.js"


// router
const authRouter = express.Router();

// routes
authRouter.post("/login", expressAsyncHandler(loginUser));
authRouter.post("/register", expressAsyncHandler(registerUser));
authRouter.post("/change-password", protect,expressAsyncHandler(changePassword));
authRouter.get("/user/:id", expressAsyncHandler(getUserById));


// 🆕 Forgot Password routes
authRouter.post("/forgot-password", expressAsyncHandler(forgotPassword));
authRouter.post("/verify-reset-code", expressAsyncHandler(verifyResetCode));
authRouter.post("/reset-password", expressAsyncHandler(resetPassword));
export default authRouter;
