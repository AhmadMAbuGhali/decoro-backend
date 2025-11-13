// import 
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
 dotenv.config();

 import errorHandler from "./middlewares/errorHandler.js";
 import authRouter from "./routes/authRoute.js";
 import productRouter from "./routes/productRoute.js";
 import verificationRoutes from "./routes/verifyRoute.js";

 import connectDB from "./config/db.js";
 connectDB();

// server
const app = express();

app.use(express.json());

// use auth router
app.use(cors({
  origin: "http://localhost:3001", // رابط الفرونت عندك
  credentials: true, // لو بترسل كوكيز
}));

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/verify", verificationRoutes);




const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(errorHandler);

