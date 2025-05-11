import express from "express";
import {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriends,
    getPendingRequests,
    unfriend,
} from "../controllers/friendship.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/request", protectRoute, sendFriendRequest);
router.post("/accept", protectRoute, acceptFriendRequest);
router.post("/reject", protectRoute, rejectFriendRequest);
router.get("/friends", protectRoute, getFriends);
router.get("/pending", protectRoute, getPendingRequests);
router.post("/unfriend", protectRoute, unfriend);

export default router;