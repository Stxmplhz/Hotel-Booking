import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js"
import Coupon from "../models/Coupon.js";   
import { createError } from "../utils/error.js"
import { DAY, HOUR } from "../utils/time.js"
import { sendEmail } from "../utils/email.js";
import dotenv from "dotenv";
import Stripe from "stripe";
        
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createBooking = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.body.hotelId);
        if (!hotel) return next(createError(404, "Hotel not found!"));

        if (req.body.paymentMethod === "Card" && !req.body.transactionId) {
             return next(createError(400, "Transaction ID (Payment Intent) is required."));
        }

        const checkInDate = new Date(req.body.checkIn);
        const checkOutDate = new Date(req.body.checkOut);
        const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
        const nights = Math.ceil(timeDiff / DAY);

        if (nights <= 0) {
            return next(createError(400, "Invalid check-in/check-out dates."));
        }
        
        let totalRoomPricePerNight = 0;

        const roomDetails = await Promise.all(
            req.body.rooms.map(async (item) => {
                const room = await Room.findOne({
                    "roomNumbers._id": item.roomNumberId,
                    "roomNumbers.unavailableDates": { $nin: item.unavailableDates }
                });

                if (!room) {
                    throw createError(400, `Room ${item.roomNumberId} is not available.`);
                }

                totalRoomPricePerNight += room.price;

                return {
                    roomNumberId: item.roomNumberId,
                    roomType: room.title, 
                    unavailableDates: item.unavailableDates
                };
            })
        );

        const basePrice = totalRoomPricePerNight * nights;
        const taxRate = (hotel.taxRate || 0.07) + (hotel.serviceCharge || 0.10);
        const taxes = Math.round(basePrice * taxRate);

        let discountAmount = 0;
        if (req.body.couponCode) {
            const coupon = await Coupon.findOne({ code: req.body.couponCode });
            if (coupon && coupon.isActive && new Date() < new Date(coupon.expirationDate)) {
                if (coupon.discountType === 'fixed') {
                    discountAmount = coupon.value;
                } else if (coupon.discountType === 'percentage') {
                    discountAmount = Math.floor(basePrice * (coupon.value / 100));
                    if (coupon.maxDiscount) {
                        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
                    }
                }
            }
        }        

        const finalTotal = basePrice + taxes - discountAmount;

        const newBooking =  new Booking({
            userId: req.body.userId,
            hotelId: req.body.hotelId,
            hotelDetails: {
                name: hotel.name,
                address: hotel.address,
                image: hotel.photos[0] || ""
            },
            cancellationPolicySnapshot: hotel.cancellationPolicy,
            guestDetails: req.body.guestDetails, 
            guestCount: req.body.guestCount || { adults: 1, children: 0 },
            rooms: roomDetails,
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut,
            priceDetails: {
                basePrice: basePrice,
                taxes: taxes,
                discount: discountAmount,
                totalPrice: finalTotal > 0 ? finalTotal : 0
            },
            paymentMethod: "Card", // Stripe
            transactionId: req.body.transactionId,
            status: "confirmed"
        });

        const savedBooking = await newBooking.save();

        await Promise.all(
            req.body.rooms.map((item) =>  {
                return Room.updateOne(
                    { "roomNumbers._id": item.roomNumberId },
                    {
                        $push: {
                            "roomNumbers.$.unavailableDates": { $each: item.unavailableDates },
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

export const cancelBooking = async (req, res, next) => {
    try {
        console.log(">>> [API] Starting Cancel Process for ID:", req.params.id);
        
        const booking = await Booking.findById(req.params.id).populate('hotelId');
        if (!booking) return next(createError(404, "Booking not found!"));

        if (["canceled", "refunded"].includes(booking.status.toLowerCase())) {
            return next(createError(400, "Booking is already canceled."));
        }

        const hotel = booking.hotelId;
        const now = new Date();
        const checkInDate = new Date(booking.checkIn);
        const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (HOUR);

        let refundAmount = 0;
        let newStatus = "canceled";

        if (booking.status === "confirmed") {
            const policy = hotel.cancellationPolicy;
            if (policy.type !== 'non-refundable' && hoursUntilCheckIn >= policy.deadlineHours) {
                refundAmount = (booking.priceDetails.totalPrice * policy.refundPercentage) / 100;
            }
        }

        if (refundAmount > 0) {
            try {
                console.log(">>> [Stripe] Attempting refund:", refundAmount);
                await stripe.refunds.create({
                    payment_intent: booking.transactionId,
                    amount: Math.round(refundAmount * 100), 
                });
                newStatus = "refunded";
                console.log(">>> [Stripe] Refund Success");
            } catch (stripeError) {
                console.error(">>> [Stripe] Error:", stripeError.message);
                return next(createError(500, "Stripe Refund Error: " + stripeError.message));
            }
        }

        await Booking.findByIdAndUpdate(req.params.id, { 
            $set: { status: newStatus, refundedAmount: refundAmount } 
        });
        console.log(">>> [DB] Status updated to:", newStatus);

        await Promise.all(
            booking.rooms.map((item) => 
                Room.updateOne(
                    { "roomNumbers._id": item.roomNumberId },
                    { $pull: { "roomNumbers.$.unavailableDates": { $in: item.unavailableDates } } }
                )
            )
        );
        console.log(">>> [DB] Room inventory updated");

        /*
        sendEmail({
            to: booking.guestDetails.email,
            subject: `Cancellation Successful - ${hotel.name}`,
            html: `<h3>Your booking has been ${newStatus}</h3><p>Refund amount: $${refundAmount}</p>`
        }).then(() => console.log(">>> [Email] Guest notified"))
          .catch(err => console.error(">>> [Email] Guest Error:", err.message));

        sendEmail({
            to: hotel.email,
            subject: `Hotel Alert: Booking Cancelled`,
            html: `<p>Booking ${booking._id} for ${booking.guestDetails.firstName} was cancelled.</p>`
        }).then(() => console.log(">>> [Email] Hotel notified"))
          .catch(err => console.error(">>> [Email] Hotel Error:", err.message));
        */

        res.status(200).json({
            message: "Cancellation processed successfully",
            status: newStatus
        });

    } catch (err) {
        console.error(">>> [Fatal Error]:", err);
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
    try {
        const bookings = await Booking.find({ userId: req.params.userId })
            .populate("hotelId")
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch(err) {
        next(err);
    }
};