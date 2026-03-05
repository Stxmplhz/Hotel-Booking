import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Coupon from "../models/Coupon.js";
import { createError } from "../utils/error.js";
import { DAY, HOUR } from "../utils/time.js";
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
      return next(
        createError(400, "Transaction ID (Payment Intent) is required."),
      );
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
          "roomNumbers.unavailableDates": { $nin: item.unavailableDates },
        });

        if (!room) {
          throw createError(400, `Room ${item.roomNumberId} is not available.`);
        }

        totalRoomPricePerNight += room.price;

        return {
          roomNumberId: item.roomNumberId,
          roomType: room.title,
          unavailableDates: item.unavailableDates,
        };
      }),
    );

    const basePrice = totalRoomPricePerNight * nights;
    const taxRate = (hotel.taxRate || 0.07) + (hotel.serviceCharge || 0.1);
    const taxes = Math.round(basePrice * taxRate);

    let discountAmount = 0;
    if (req.body.couponCode) {
      const coupon = await Coupon.findOne({ code: req.body.couponCode });
      if (
        coupon &&
        coupon.isActive &&
        new Date() < new Date(coupon.expirationDate)
      ) {
        if (coupon.discountType === "fixed") {
          discountAmount = coupon.value;
        } else if (coupon.discountType === "percentage") {
          discountAmount = Math.floor(basePrice * (coupon.value / 100));
          if (coupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscount);
          }
        }
      }
    }

    const finalTotal = basePrice + taxes - discountAmount;

    const newBooking = new Booking({
      userId: req.body.userId,
      hotelId: req.body.hotelId,
      hotelDetails: {
        name: hotel.name,
        address: hotel.address,
        image: hotel.photos[0] || "",
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
        totalPrice: finalTotal > 0 ? finalTotal : 0,
      },
      paymentMethod: "Card", // Stripe
      transactionId: req.body.transactionId,
      status: "confirmed",
    });

    const savedBooking = await newBooking.save();

    await Promise.all(
      req.body.rooms.map((item) => {
        return Room.updateOne(
          { "roomNumbers._id": item.roomNumberId },
          {
            $push: {
              "roomNumbers.$.unavailableDates": {
                $each: item.unavailableDates,
              },
            },
          },
        );
      }),
    );

    try {
      await Promise.all([
        sendEmail({
          to: savedBooking.guestDetails.email,
          subject: `Confirmed: Your stay at ${hotel.name}`,
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #142976; color: white; padding: 24px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Booking Confirmed!</h1>
                <p style="margin: 8px 0 0; opacity: 0.8;">Reservation ID: #${savedBooking._id.toString().substring(18).toUpperCase()}</p>
              </div>
              <div style="padding: 32px; color: #333;">
                <p style="font-size: 18px; margin-top: 0;">Hi <b>${savedBooking.guestDetails.firstName}</b>,</p>
                <p>Your reservation at <b>${hotel.name}</b> is all set. We look forward to welcoming you!</p>
                
                <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 24px 0;">
                  <h3 style="margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Stay Details</h3>
                  <p style="margin: 10px 0;"><b>Check-in:</b> ${new Date(savedBooking.checkIn).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "long", day: "numeric" })}</p>
                  <p style="margin: 10px 0;"><b>Check-out:</b> ${new Date(savedBooking.checkOut).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "long", day: "numeric" })}</p>
                  <p style="margin: 10px 0;"><b>Room Type:</b> ${savedBooking.rooms[0].roomType}</p>
                  <p style="margin: 10px 0; font-size: 18px; color: #142976;"><b>Total Paid:</b> $${savedBooking.priceDetails.totalPrice.toLocaleString()}</p>
                </div>

                <p style="font-size: 14px; color: #666;">Address: ${hotel.address}</p>
              </div>
              <div style="background-color: #f1f1f1; padding: 16px; text-align: center; font-size: 12px; color: #999;">
                &copy; 2026 Stayly Booking. All rights reserved.
              </div>
            </div>
          `,
        }),

        sendEmail({
          to: hotel.email || process.env.ADMIN_EMAIL,
          subject: `Alert: New Booking Received - ${savedBooking.guestDetails.firstName}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>New Reservation Received</h2>
              <p>You have a new booking from <b>${savedBooking.guestDetails.firstName} ${savedBooking.guestDetails.lastName}</b>.</p>
              <ul>
                <li><b>Booking ID:</b> ${savedBooking._id}</li>
                <li><b>Dates:</b> ${new Date(savedBooking.checkIn).toDateString()} - ${new Date(savedBooking.checkOut).toDateString()}</li>
                <li><b>Revenue:</b> $${savedBooking.priceDetails.totalPrice}</li>
              </ul>
              <p>Please prepare the room accordingly.</p>
            </div>
          `,
        }),
      ]);
      console.log(">>> [Email] All notifications sent");
    } catch (emailErr) {
      console.error(">>> [Email Error]:", emailErr.message);
    }

    return res.status(200).json(savedBooking);
  } catch (err) {
    next(err);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    console.log(">>> [API] Starting Cancel Process for ID:", req.params.id);

    const booking = await Booking.findById(req.params.id).populate("hotelId");
    if (!booking) return next(createError(404, "Booking not found!"));

    if (["canceled", "refunded"].includes(booking.status.toLowerCase())) {
      return next(createError(400, "Booking is already canceled."));
    }

    const hotel = booking.hotelId;
    const now = new Date();
    const checkInDate = new Date(booking.checkIn);
    const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / HOUR;

    let refundAmount = 0;
    let newStatus = "canceled";

    if (booking.status === "confirmed") {
      const policy = hotel.cancellationPolicy;
      if (
        policy.type !== "non-refundable" &&
        hoursUntilCheckIn >= policy.deadlineHours
      ) {
        refundAmount =
          (booking.priceDetails.totalPrice * policy.refundPercentage) / 100;
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
        return next(
          createError(500, "Stripe Refund Error: " + stripeError.message),
        );
      }
    }

    await Booking.findByIdAndUpdate(req.params.id, {
      $set: { status: newStatus, refundedAmount: refundAmount },
    });
    console.log(">>> [DB] Status updated to:", newStatus);

    await Promise.all(
      booking.rooms.map((item) =>
        Room.updateOne(
          { "roomNumbers._id": item.roomNumberId },
          {
            $pull: {
              "roomNumbers.$.unavailableDates": { $in: item.unavailableDates },
            },
          },
        ),
      ),
    );
    console.log(">>> [DB] Room inventory updated");

    try {
      await Promise.all([
        sendEmail({
          to: booking.guestDetails.email,
          subject: `Cancellation Confirmation - ${hotel.name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #f8d7da; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #dc3545; color: white; padding: 24px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Booking Cancelled</h1>
              </div>
              <div style="padding: 32px; color: #333;">
                <p>Hi ${booking.guestDetails.firstName},</p>
                <p>Your reservation at <b>${hotel.name}</b> has been successfully cancelled.</p>
                
                <div style="border: 2px dashed #dc3545; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
                  <span style="font-size: 14px; color: #666; display: block; margin-bottom: 5px;">Refund Amount</span>
                  <span style="font-size: 32px; font-weight: bold; color: #dc3545;">$${refundAmount.toLocaleString()}</span>
                  <p style="font-size: 12px; color: #999; margin-top: 10px;">
                    ${refundAmount > 0 ? "*The refund will be processed to your original payment method within 5-10 business days." : "*This booking was non-refundable according to the policy."}
                  </p>
                </div>

                <p style="font-size: 14px; color: #666;">Booking Reference: ${booking._id}</p>
              </div>
            </div>
          `,
        }),
        sendEmail({
          to: hotel.email || process.env.ADMIN_EMAIL,
          subject: `Cancellation Alert: Booking #${booking._id.toString().substring(18)}`,
          html: `<p>Booking for ${booking.guestDetails.firstName} was cancelled. The room inventory has been returned to the system.</p>`,
        }),
      ]);
    } catch (emailErr) {
      console.error(">>> [Email Error]:", emailErr.message);
    }

    res.status(200).json({
      message: "Cancellation processed successfully",
      status: newStatus,
    });
  } catch (err) {
    console.error(">>> [Fatal Error]:", err);
    next(err);
  }
};

export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate("hotelId")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};
