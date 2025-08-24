import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongoDB.js";
import connectCloudinary from "./config/cloudinary.js";

import { clerkMiddleware, requireAuth, getAuth } from "@clerk/express";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import sellerRouter from "./routes/sellerRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect DBs
connectDB();
connectCloudinary();
// ✅ Must be before all API routes
app.use(clerkMiddleware());

// Middlewares
app.use(express.json());
app.use(cors());

// ✅ Example protected route (Clerk required)

app.use(clerkMiddleware());



// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/seller", sellerRouter);

// Default route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Start server
app.listen(port, () => console.log("✅ Server Started on: " + port));
