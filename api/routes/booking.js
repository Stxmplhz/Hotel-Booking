import express from "express";
import { 
    createBooking, 
    confirmPayment,
    getBooking,
    getAllBookings,
    getUserBookings
} from "../controllers/booking.js";
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyUser, createBooking);
router.post("/payment/:id", verifyUser, confirmPayment);
router.get("/find/:id", verifyUser, getBooking);
router.get("/user/:userId", verifyUser, getUserBookings);
router.get("/", verifyAdmin, getAllBookings);

export default router;