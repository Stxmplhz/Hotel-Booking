import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    hotelDetails: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      image: { type: String },
    },
    guestDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      specialRequests: { type: String }, // "Double Bed", "Late night Check-in"
    },
    guestCount: {
      adults: {
        type: Number,
        default: 0,
      },
      children: {
        type: Number,
        default: 0,
      },
    },
    rooms: [
      {
        roomNumberId: {
          type: String,
          required: true,
        },
        roomType: {
          type: String,
          required: true,
        },
        unavailableDates: {
          type: [Date],
          required: true,
        },
      },
    ],
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    couponCode: {
      type: String,
      default: null,
    },
    priceDetails: {
      basePrice: { type: Number, required: true },
      taxes: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      totalPrice: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled", "completed", "refunded"],
      default: "pending",
    },
    cancellationPolicySnapshot: {
      type: Object,
    },
    paymentMethod: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    refundedAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Booking", BookingSchema);
