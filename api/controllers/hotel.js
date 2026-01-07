import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js"
import { createError } from "../utils/error.js";
import { hotelSchema } from "../utils/validation.js";

export const createHotel = async ( req, res, next ) => {
    const validation = hotelSchema.safeParse(req.body);

    if(!validation.success) {   
        const errorMessage = validation.error.errors[0].message;
        return next(createError(400, errorMessage));
    }

    const newHotel = new Hotel(req.body);
    
    try {
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel);
    } catch (err) {
        next(err);
    }
};

export const updateHotel = async ( req, res, next ) => {
    try {
        const updateHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updateHotel);
    } catch (err) {
        next(err);
    }
};

export const deleteHotel = async ( req, res, next ) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).send("Deleted hotel succesfully");
    } catch (err) {
        next(err);
    }
};

export const getHotel = async ( req, res, next ) => {
    try {
        const room = await Hotel.findById(req.params.id);
        res.status(200).json(room);
    } catch (err) {
        next(err);
    }
}

export const getAllHotels = async ( req, res, next ) => {
    const { page, min, max, city, limit, featured, minPeople, checkIn, checkOut } = req.query;

    const limitNum = parseInt(limit) || 10; 
    const pageNum = parseInt(page) || 1;
    const skip = (pageNum - 1) * limitNum;

    try {
        let hotelIdsFromRooms = [];

        if (minPeople || (checkIn && checkOut)) {
            const start = checkIn ? new Date(checkIn).getTime() : 0;
            const end = checkOut ? new Date(checkOut).getTime() : 0;
            
            const rooms = await Room.find({
                ...(minPeople && { maxPeople: { $gte: parseInt(minPeople) } }),
            });

            const availableRooms = rooms.filter((room) => {
                if(!checkIn || !checkOut) return true;

                const isAvailable = room.roomNumbers.some((rn) => {
                    const isFound = rn.unavailableDates.some((date) => {
                        const bookedDate = new Date(date).getTime();
                        return bookedDate >= start && bookedDate <= end;
                    });

                    return !isFound
                });

                return isAvailable;
            });

            hotelIdsFromRooms = availableRooms.map(room => room.hotelId);
        }

        const query = {
            ...(city && { city: { $regex: city , $options: "i" }}),
            cheapestPrice: { $gt: min || 1, $lt: max || 99999},
            ...(featured && { featured: featured == "true"})
        }

        if (hotelIdsFromRooms.length > 0 || ((minPeople ||  (checkIn && checkOut)))) {
            if (hotelIdsFromRooms.length == 0){
                return res.status(200).json([])
            };

            query._id = { $in: hotelIdsFromRooms };
        }
   
        const hotels = await Hotel.find(query)
            .limit(limitNum)
            .skip(skip);

        res.status(200).json(hotels);
    } 
    catch (err) {
        next(err);
    }
};

export const getHotelRooms = async ( req, res, next ) => {
    try {
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return next(createError(404, "Hotel not found!"));
        }

        const list = await Promise.all(
            hotel.rooms.map((room) => {
                return Room.findById(room);
            })
        );

        res.status(200).json(list);
    } catch(err) {
        next(err);
    }
};
