import express from "express";
import { createPaymentIntent } from "../controllers/payment.js";
import { verifyToken } from "../utils/verifyToken.js"; 

const router = express.Router();

router.post("/create-payment-intent", verifyToken, createPaymentIntent);

export default router;