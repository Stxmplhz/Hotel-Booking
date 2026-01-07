import Booking from "../models/Booking.js"
import Room from "../models/Room.js"
import { createError } from "../utils/error.js"
import twentyMinutes from "../utils/time.js"

export const createBooking = async (req, res, next) => {
    const newBooking = new  Booking(req.body);

    try {
        const savedBooking = await newBooking.save();

        await Promise.all(
            req.body.rooms.map((item) => {
                return Room.updateOne(
                    { "roomNumbers._id": item.roomNumberId },
                    {
                        $push: {
                            "roomNumbers.$.unavailableDates": item.unavailableDates
                        },  
                    }
                );
            })
        );

        res.status(200).json(savedBooking);
    } catch (err) {
        next(err);
    }
};

export const confirmPayment = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) return next(createError(404, "Booking not found!"));
        if (booking.status !== "pending") return next(createError(400, "Booking already processed or expired."))

        const timeDiff = new Date().getTime() - new Date(booking.createdAt).getTime();
        if (timeDiff > twentyMinutes) {
            return next(createError(400, "Time expired! Please create a new booking."));
        }
        
        booking.status = "confirmed";
        await booking.save();

        res.status(200).json({ message: "Payment successful! Booking confirmed.", booking });
    } catch (err) {
        next(err);
    }
};

export const getBooking = async ( req, res, next ) => {
    try {
        const booking = await Booking.findById(req.params.id);
        res.status(200).json(booking);
    } catch(err) {
        next(err);
    }
};

export const getAllBookings = async ( req, res, next ) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch(err) {
        next(err);
    }
};

export const getUserBookings = async ( req, res, next ) => {
    const userId = req.params.userId;
    try {
        const bookings = await Booking.find({ userId: userId });
        res.status(200).jon(bookings); 
    } catch(err) {
        next(err);
    }
};