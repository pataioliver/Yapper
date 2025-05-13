import Friendship from "../models/friendship.model.js";
import User from "../models/user.model.js";

export const sendFriendRequest = async (req, res) => {
    try {
        const requester = req.user._id;
        const { recipientId } = req.body;

        // Prevent duplicate requests in either direction if pending or accepted
        const existing = await Friendship.findOne({
            $or: [
                { requester, recipient: recipientId, status: { $in: ["pending", "accepted"] } },
                { requester: recipientId, recipient: requester, status: { $in: ["pending", "accepted"] } }
            ]
        });

        if (existing) {
            return res.status(400).json({ error: "Friend request already exists or you are already friends" });
        }

        const friendship = new Friendship({ requester, recipient: recipientId });
        await friendship.save();
        res.status(201).json(friendship);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const userId = req.user._id;
        const friendship = await Friendship.findById(requestId);

        if (!friendship) {
            return res.status(404).json({ error: "Request not found" });
        }

        // Only the recipient can accept the request
        if (friendship.recipient.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You are not authorized to accept this request" });
        }

        // Accept only if pending
        if (friendship.status !== "pending") {
            return res.status(400).json({ error: "Request is not pending" });
        }

        friendship.status = "accepted";
        await friendship.save();
        res.json(friendship);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const rejectFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const userId = req.user._id;
        const friendship = await Friendship.findById(requestId);

        if (!friendship) return res.status(404).json({ error: "Request not found" });

        // Only the recipient can reject the request
        if (friendship.recipient.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You are not authorized to reject this request" });
        }

        // Accept only if pending
        if (friendship.status !== "pending") {
            return res.status(400).json({ error: "Request is not pending" });
        }

        friendship.status = "rejected";
        await friendship.save();
        res.json(friendship);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// List friends
export const getFriends = async (req, res) => {
    try {
        const userId = req.user._id;
        const friendships = await Friendship.find({
            $or: [
                { requester: userId, status: "accepted" },
                { recipient: userId, status: "accepted" },
            ],
        }).populate("requester recipient", "-password");
        res.json(friendships);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// List pending requests
export const getPendingRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const requests = await Friendship.find({
            recipient: userId,
            status: "pending",
        }).populate("requester", "-password");
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const unfriend = async (req, res) => {
  try {
    const { friendshipId } = req.body;
    if (!friendshipId) return res.status(400).json({ message: "Missing friendshipId" });

    const friendship = await Friendship.findById(friendshipId);
    if (!friendship) return res.status(404).json({ message: "Friendship not found" });

    await friendship.deleteOne();
    res.json({ message: "Unfriended successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove friend" });
  }
};

export const getAllFriendships = async (req, res) => {
    try {
        const userId = req.user._id;

        const friendships = await Friendship.find({
            $or: [
                { requester: userId },
                { recipient: userId },
            ],
        }).populate("requester recipient", "-password");
        res.json(friendships);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch friendships.' });
    }
}