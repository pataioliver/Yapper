import Group from '../models/group.model.js';
import Message from '../models/message.model.js';
import PushSubscription from '../models/pushSubscription.model.js';
import User from '../models/user.model.js';
import webpush from 'web-push';
import dotenv from 'dotenv';
import { io } from '../lib/socket.js';

dotenv.config();
webpush.setVapidDetails(
    `mailto:${process.env.EMAIL_USER}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

export const createGroup = async (req, res) => {
    try {
        const { name, members, avatar } = req.body;
        const createdBy = req.user._id; // assuming you use auth middleware

        // Ensure creator is in members and admins
        const uniqueMembers = Array.from(new Set([...members, createdBy.toString()]));
        const group = await Group.create({
            name,
            avatar,
            members: uniqueMembers,
            admins: [createdBy],
            createdBy,
        });

        res.status(201).json(group);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getUserGroups = async (req, res) => {
    try {
        const userId = req.user._id;
        const groups = await Group.find({ members: userId });
        res.json(groups);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const removeGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const userId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Only allow creator or admin to delete
        if (
            group.createdBy.toString() !== userId.toString() &&
            !group.admins.map(a => a.toString()).includes(userId.toString())
        ) {
            return res.status(403).json({ message: "Not authorized to delete this group" });
        }

        await group.deleteOne();
        res.json({ message: "Group deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const sendGroupMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const groupId = req.params.groupId;
        const senderId = req.user._id;

        // Check if sender is a group member
        const group = await Group.findById(groupId);
        if (!group || !group.members.map(id => id.toString()).includes(senderId.toString())) {
            return res.status(403).json({ message: "Not a group member" });
        }

        const message = await Message.create({
            senderId,
            groupId,
            text,
            image,
        });

        // Send push notifications to group members (except sender)
        const sender = await User.findById(senderId).select('fullName');
        const memberIds = group.members.map(member => member._id.toString()).filter(id => id !== senderId.toString());
        const subscriptions = await PushSubscription.find({ userId: { $in: memberIds } });
        if (subscriptions.length) {
            const payload = JSON.stringify({
                title: `New Message in ${group.name}`,
                body: `${sender.fullName}: ${text || 'Sent an image'}`,
                icon: '/icon.png', // Add an icon in your frontend public folder
        });

        subscriptions.forEach(async (sub) => {
        try {
          await webpush.sendNotification(sub.subscription, payload);
        } catch (error) {
          console.error('Error sending notification:', error);
          // Remove invalid subscription
          await PushSubscription.deleteOne({ _id: sub._id });
        }
      });
    }
        // Emit Socket.IO event to group
        io.to(groupId).emit('newGroupMessage', message);
        
        res.status(201).json(message);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getGroupMessages = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        
        const group = await Group.findById(groupId);
        if (!group || !group.members.map(id => id.toString()).includes(req.user._id.toString())) {
            return res.status(403).json({ message: "Not a group member" });
        }
        
        const messages = await Message.find({ groupId }).populate('senderId', 'fullName profilePicture').sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
