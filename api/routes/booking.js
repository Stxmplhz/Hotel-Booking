import express from "express";
import { 
    createBooking, 
    cancelBooking,      
    getBooking,
    getAllBookings,
    getUserBookings
} from "../controllers/booking.js";
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// --- Payment Flow --- 
//router.post("/create-payment-intent", verifyUser, createPaymentIntent); // Create a Payment Intent (for Stripe) to prepare for card processing.

// --- Booking Flow ---
router.post("/", verifyUser, createBooking); // Create a booking (The booking status is pending).
router.put("/cancel/:id", verifyUser, cancelBooking);

// --- Fetch Data ---
router.get("/find/:id", verifyUser, getBooking);
router.get("/user/:userId", verifyUser, getUserBookings);

// --- Admin ---
router.get("/", verifyAdmin, getAllBookings);

export default router;