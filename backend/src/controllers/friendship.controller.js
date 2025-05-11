import Friendship from "../models/friendship.model.js";
import User from "../models/user.model.js";

export const sendFriendRequest = async (req, res) => {
    try {
        const requester = req.user._id;
        const { recipientId } = req.body;

        // Prevent duplicate requests
        const existing = await Friendship.findOne({
            requester,
            recipient: recipientId,
        });

        if (existing) {
            return res.status(400).json({ error: "Request already sent" });
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
        const userId = req.user._id;
        const { friendId } = req.body;

        // Find the accepted friendship (in either direction)
        const friendship = await Friendship.findOneAndDelete({
            $or: [
                { requester: userId, recipient: friendId, status: "accepted" },
                { requester: friendId, recipient: userId, status: "accepted" },
            ],
        });

        if (!friendship) {
            return res.status(404).json({ error: "Friendship not found" });
        }

        res.json({ message: "Unfriended successfully" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};