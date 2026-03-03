import express from "express";
import { updateUser, getUser } from "../controllers/user.js";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.put("/:id", verifyUser, updateUser);
router.get("/:id", verifyUser, getUser);

export default router;
