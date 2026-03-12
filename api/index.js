import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.js";
import hotelsRoute from "./routes/hotels.js";
import roomRoute from "./routes/room.js";
import bookingsRoute from "./routes/booking.js";
import paymentRoute from "./routes/payment.js";
import userRoute from "./routes/user.js";

import { stripeWebhook } from "./controllers/stripeWebhook.js";
import { startCleanUpJob } from "./utils/cleanupJob.js";

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB!");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => {
  res.send("Hello form Backend!");
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/room", roomRoute);
app.use("/api/bookings", bookingsRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/users", userRoute);
// app.use("/api/review", reviewRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  connect();
  console.log(`Connected to backend! Port ${PORT}`);
  startCleanUpJob();
});
