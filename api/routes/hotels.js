import express from "express";
import { 
    createHotel, 
    updateHotel, 
    deleteHotel, 
    getHotel, 
    getAllHotels,
    getHotelRooms
} from "../controllers/hotel.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyAdmin, createHotel);
router.put("/:id", verifyAdmin, updateHotel);
router.delete("/:id", verifyAdmin, deleteHotel);
router.get("/room/:id", getHotelRooms);
router.get("/:id", getHotel);
router.get("/", getAllHotels);

export default router;