import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true,
    },
    title: {
        type: String, // e.g., Deluxe King, Standard
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    maxPeople: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    },
    roomNumbers: [{
        number: Number,
        unavailableDates: {
            type: [Date]
        }
    }],
    quantity: {
        type: Number,
        required:true
    },
}, { timestamps: true }); 

export default mongoose.model("Room", RoomSchema);