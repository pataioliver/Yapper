import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Friendship from "../models/friendship.model.js";
import PushSubscription from "../models/pushSubscription.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import webpush from "web-push";
import dotenv from "dotenv";

dotenv.config();
webpush.setVapidDetails(
  `mailto:${process.env.EMAIL_USER}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export const areUsersFriends = async (userId1, userId2) => {
  const friendship = await Friendship.findOne({
    $or: [
      { requester: userId1, recipient: userId2, status: "accepted" },
      { requester: userId2, recipient: userId1, status: "accepted" },
    ],
  });
  return !!friendship;
};

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Check if users are friends before allowing message
    const areFriends = await areUsersFriends(senderId, receiverId);
    if (!areFriends) {
      return res.status(403).json({
        error: "You can only send messages to your friends"
      });
    }

    let { text, replyToId, image } = req.body;

    let imageUrl = null;
    // If image is present as base64 string, upload to Cloudinary
    if (image && image.startsWith("data:image")) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        folder: "yapper/messages"
      });
      imageUrl = uploadRes.secure_url;
    }

    if (!text && !imageUrl) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      replyToId: replyToId || null
    });

    const savedMessage = await newMessage.save();
    await newMessage.save();

    // Send push notification to receiver
    const receiver = await User.findById(receiverId).select('fullName');
    const subscriptions = await PushSubscription.find({ userId: receiverId });
    if (subscriptions.length) {
      const payload = JSON.stringify({
        title: `New Message from ${receiver.fullName}`,
        body: text || 'You received a new image message',
        icon: '/icon.png'
      });

      subscriptions.forEach(async (sub) => {
        try {
          await webpush.sendNotification(sub.subscription, payload);
        } catch (error) {
          console.error('Error sending notification:', error);
          await PushSubscription.deleteOne({ _id: sub._id });
        }
      });
    }

    // Emit the new message via Socket.io
    const receiverSocketId = getReceiverSocketId(receiverId.toString());
    const senderSocketId = getReceiverSocketId(senderId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", savedMessage);
    }
    if (senderSocketId && senderSocketId !== receiverSocketId) {
      io.to(senderSocketId).emit("newMessage", savedMessage);
    }

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Add reaction to a message
export const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Remove previous reaction by this user (if any)
    message.reactions = message.reactions.filter(
      (r) => r.userId.toString() !== userId.toString()
    );

    // Add new reaction
    message.reactions.push({ emoji, userId });

    await message.save();

    // Notify both sender and receiver if online
    const receiverSocketId = getReceiverSocketId(message.receiverId?.toString());
    const senderSocketId = getReceiverSocketId(message.senderId?.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageReaction", { messageId, emoji, userId });
    }
    if (senderSocketId && senderSocketId !== receiverSocketId) {
      io.to(senderSocketId).emit("messageReaction", { messageId, emoji, userId });
    }

    res.status(200).json({ message: "Reaction added", reactions: message.reactions });
  } catch (error) {
    console.log("Error in addReaction controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};