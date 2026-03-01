import express from "express";
import { 
    createRoom, 
    updateRoom, 
    updateRoomAvailability, 
    deleteRoom, 
    getRoom, 
    getAllRooms,
} from "../controllers/room.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// --- CRUD for Admin ---
router.post("/:hotelId", verifyAdmin, createRoom);
router.put("/:id", verifyAdmin, updateRoom);
router.delete("/:id/:hotelId", verifyAdmin, deleteRoom);

router.put("/availability/:id", updateRoomAvailability);

// --- Fetch Data ---
router.get("/:id", getRoom);
router.get("/", getAllRooms);

export default router;  