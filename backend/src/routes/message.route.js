import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar, getMessages, sendMessage, addReaction } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

// No multer! Accept JSON with base64 image string
router.post("/:id", protectRoute, sendMessage);

router.post("/:messageId/reactions", protectRoute, addReaction);

export default router;