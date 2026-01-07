import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { createError } from "../utils/error.js";
import { roomSchema } from "../utils/validation.js";
import { getDatesInRange } from "../utils/date.js";

export const createRoom = async ( req, res, next ) => {
    const validation = roomSchema.safeParse(req.body);

    if(!validation.success) {
        const errorMessage = validation.error.errors[0].message;
        return next(createError(400, errorMessage));
    }

    const hotelId = req.params.hotelId;
    const newRoom = new Room({ 
        ...req.body, 
        hotelId: hotelId 
    });

    try {
        const savedRoom = await newRoom.save();

        try {
            await Hotel.findByIdAndUpdate(hotelId, {
                $push: { rooms: savedRoom._id }
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json(savedRoom);
    } catch (err) {
        next(err);
    }
};

export const updateRoom = async ( req, res, next ) => {
    try {
        const updateRoom = await Room.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updateRoom);
    } catch (err) {
        next(err);
    }
};

export const updateRoomAvailability = async (req, res, next ) => {
    try {
        await Room.updateOne(
            { "roomNumbers._id": req.params.id },
            {
                $push: {
                    "roomNumbers.$.unavailableDates": req.body.dates
                },
            }
        );
        res.status(200).send("Room status has been updated.");
    } catch (err) {
        next(err);
    }
}; 

export const deleteRoom = async ( req, res, next ) => {
    const hotelId = req.params.hotelId;

    try {
        await Room.findByIdAndDelete(req.params.id);
        
        try {
            await Hotel.findByIdAndUpdate(hotelId, {
                $pull: { rooms: req.params.id}
            }); 
        } catch (err) {
            next(err);
        }

        res.status(200).send("Deleted room succesfully");
    } catch (err) {
        next(err);
    }
};

export const getRoom = async ( req, res, next ) => {
    try {
        const room = await Room.findById(req.params.id);
        res.status(200).json(room);
    } catch (err) {
        next(err);
    }
}

export const getAllRooms = async ( req, res, next) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (err) {
        next(err);
    }
};

export const checkRoomAvailability = async ( req, res, next) => {
    const { roomId } = req.params;
    const { dates } = req.body;

    try {
        const room = await Room.findOne({ "roomNumbers._id": roomId });
        const targetRoom = room.roomNumbers.find(r => r._id.toString() == roomId);
        
        const bookedDates = targetRoom.unavailableDates.map(d => new Date(d).getTime());
        const requestedDates = dates.map(d => new Date(d).getTime());

        const isFound = requestedDates.some(date => bookedDates.includes(date));

        if (isFound) {
            return res.status(400).json({ status: "Unavailable", message: "This room is unavailable on the selected dates."})
        } 

        res.status(200).json({ status: "Available", message: "Rooms available" });
    } catch(err) {
        next(err);
    }
};