import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    rooms: [{
        roomNumberId: {
            type: String,
            required: true
        },
        unavailableDates: {
            type: [Date],
            required: true
        }
    }],
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'canceled', 'expired'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
    },
    transactionId: {
        type: String,
    }
}, { timestamps: true });   

export default mongoose.model("Booking", BookingSchema);