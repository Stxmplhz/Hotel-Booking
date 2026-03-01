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
    photos: {
        type: [String]
    },
    description: {
        type: String,
    },
    bedType: {
        type: String, // e.g., "1 King Bed", "2 Twin Beds"
        required: false
    },
    size: {
        type: Number, // e.g., 32 m2
    },
    roomFacilities: {
        type: [String], // e.g., ["Air Conditioning", "Bathtub", "Balcony", "Free WiFi"]
    },
    view: {
        type: String, // e.g., "Sea View", "City View", "Garden View"
    },
    roomNumbers: [{
        number: Number,
        unavailableDates: { type: [Date] }
    }],
}, { timestamps: true }); 

export default mongoose.model("Room", RoomSchema);