import Group from "../models/group.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";
import { getReceiverSocketId, emitToRoomExceptSender } from "../lib/socket.js";

export const createGroup = async (req, res) => {
  try {
    const { name, members, avatar, description, isDirectGroup } = req.body;
    const admin = req.user._id;
    if (!name || !members || members.length < 1) {
      return res.status(400).json({ message: "Group name and at least one member are required" });
    }

    // Ensure admin is in members
    const uniqueMembers = Array.from(new Set([...members, admin.toString()]));
    
    // Upload group avatar if provided
    let avatarUrl = "";
    if (avatar && avatar.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(avatar, {
        folder: "yapper/groups",
      });
      avatarUrl = uploadResponse.secure_url;
    }

    // Create the group
    const group = await Group.create({
      name,
      admin,
      members: uniqueMembers,
      avatar: avatarUrl || avatar || "",
      description: description || "",
      isDirectGroup: isDirectGroup || false,
    });

    // Populate member details for response
    const populatedGroup = await Group.findById(group._id)
      .populate("members", "fullName email profilePicture")
      .populate("admin", "fullName email profilePicture");

    // Notify all members about new group through socket
    uniqueMembers.forEach(memberId => {
      io.to(`user:${memberId}`).emit("newGroup", populatedGroup);
    });

    res.status(201).json(populatedGroup);
  } catch (err) {
    console.error("Error creating group:", err);
    res.status(500).json({ message: "Failed to create group" });
  }
};

export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ 
      members: userId 
    })
    .populate("members", "fullName email profilePicture")
    .populate("admin", "fullName email profilePicture")
    .sort("-updatedAt");

    res.status(200).json(groups);
  } catch (err) {
    console.error("Error fetching user groups:", err);
    res.status(500).json({ message: "Failed to fetch groups" });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findOne({
      _id: groupId,
      members: userId,
    })
    .populate("members", "fullName email profilePicture")
    .populate("admin", "fullName email profilePicture");

    if (!group) {
      return res.status(404).json({ message: "Group not found or you're not a member" });
    }

    res.status(200).json(group);
  } catch (err) {
    console.error("Error fetching group:", err);
    res.status(500).json({ message: "Failed to fetch group" });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description, avatar } = req.body;
    const userId = req.user._id;

    // Find group and check if user is admin
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.admin.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only group admin can update group details" });
    }

    // Update avatar if provided
    let avatarUrl = group.avatar;
    if (avatar && avatar !== group.avatar && avatar.startsWith('data:image')) {
      const uploadResponse = await cloudinary.uploader.upload(avatar, {
        folder: "yapper/groups",
      });
      avatarUrl = uploadResponse.secure_url;
    }

    // Update group
    group.name = name || group.name;
    group.description = description !== undefined ? description : group.description;
    group.avatar = avatarUrl;
    group.updatedAt = Date.now();

    await group.save();

    // Get populated group for response
    const updatedGroup = await Group.findById(groupId)
      .populate("members", "fullName email profilePicture")
      .populate("admin", "fullName email profilePicture");

    // Notify group members
    group.members.forEach(member => {
      io.to(`user:${member.toString()}`).emit("groupUpdated", updatedGroup);
    });

    res.status(200).json(updatedGroup);
  } catch (err) {
    console.error("Error updating group:", err);
    res.status(500).json({ message: "Failed to update group" });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    // Find group and check if user is admin
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.admin.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only group admin can delete the group" });
    }

    // Delete all group messages
    await Message.deleteMany({ groupId });

    // Delete group
    await Group.deleteOne({ _id: groupId });

    // Notify group members
    group.members.forEach(member => {
      io.to(`user:${member.toString()}`).emit("groupDeleted", groupId);
    });

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (err) {
    console.error("Error deleting group:", err);
    res.status(500).json({ message: "Failed to delete group" });
  }
};

export const addGroupMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    const adminId = req.user._id;

    // Find group and check if user is admin
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.admin.toString() !== adminId.toString()) {
      return res.status(403).json({ message: "Only group admin can add members" });
    }

    // Check if user exists
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already a member
    if (group.members.includes(userId)) {
      return res.status(400).json({ message: "User is already a member of this group" });
    }

    // Add member
    group.members.push(userId);
    group.updatedAt = Date.now();
    await group.save();

    // Get populated group for response
    const updatedGroup = await Group.findById(groupId)
      .populate("members", "fullName email profilePicture")
      .populate("admin", "fullName email profilePicture");

    // Notify all group members
    group.members.forEach(member => {
      io.to(`user:${member.toString()}`).emit("groupUpdated", updatedGroup);
    });

    // Notify new member
    io.to(`user:${userId}`).emit("addedToGroup", updatedGroup);

    res.status(200).json(updatedGroup);
  } catch (err) {
    console.error("Error adding group member:", err);
    res.status(500).json({ message: "Failed to add member to group" });
  }
};

export const removeGroupMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const adminId = req.user._id;

    // Find group and check if user is admin
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Allow admin to remove any member, or members to remove themselves
    if (adminId.toString() !== group.admin.toString() && adminId.toString() !== userId) {
      return res.status(403).json({ message: "You don't have permission to remove this member" });
    }

    // Check if user is a member
    if (!group.members.some(member => member.toString() === userId)) {
      return res.status(400).json({ message: "User is not a member of this group" });
    }

    // Prevent removing the admin
    if (userId === group.admin.toString() && group.members.length > 1) {
      return res.status(400).json({ message: "Admin cannot be removed. Transfer admin rights first" });
    }

    // Remove member
    group.members = group.members.filter(member => member.toString() !== userId);
    group.updatedAt = Date.now();
    await group.save();

    // Get populated group for response
    const updatedGroup = await Group.findById(groupId)
      .populate("members", "fullName email profilePicture")
      .populate("admin", "fullName email profilePicture");

    // Notify remaining group members
    group.members.forEach(member => {
      io.to(`user:${member.toString()}`).emit("groupUpdated", updatedGroup);
    });

    // Notify removed member
    io.to(`user:${userId}`).emit("removedFromGroup", groupId);

    res.status(200).json(updatedGroup);
  } catch (err) {
    console.error("Error removing group member:", err);
    res.status(500).json({ message: "Failed to remove member from group" });
  }
};

export const transferAdmin = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { newAdminId } = req.body;
    const adminId = req.user._id;

    // Find group and check if user is admin
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.admin.toString() !== adminId.toString()) {
      return res.status(403).json({ message: "Only the current admin can transfer admin rights" });
    }

    // Check if new admin is a member
    if (!group.members.some(member => member.toString() === newAdminId)) {
      return res.status(400).json({ message: "New admin must be a group member" });
    }

    // Transfer admin rights
    group.admin = newAdminId;
    group.updatedAt = Date.now();
    await group.save();

    // Get populated group for response
    const updatedGroup = await Group.findById(groupId)
      .populate("members", "fullName email profilePicture")
      .populate("admin", "fullName email profilePicture");

    // Notify group members
    group.members.forEach(member => {
      io.to(`user:${member.toString()}`).emit("groupUpdated", updatedGroup);
    });

    res.status(200).json(updatedGroup);
  } catch (err) {
    console.error("Error transferring admin:", err);
    res.status(500).json({ message: "Failed to transfer admin rights" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    // Check if user is member of the group
    const group = await Group.findOne({
      _id: groupId,
      members: userId,
    }).populate("members", "fullName email profilePicture");

    if (!group) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    // Use populate with proper senderId field and include all the necessary user fields
    const messages = await Message.find({ groupId })
      .populate("senderId", "fullName email profilePicture")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching group messages:", err);
    res.status(500).json({ message: "Failed to fetch group messages" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const senderId = req.user._id;
    let { text, replyToId, image } = req.body;

    // Verify group exists and user is a member
    const group = await Group.findOne({
      _id: groupId,
      members: { $in: [senderId] },
    });
    
    if (!group) {
      return res.status(404).json({ message: "Group not found or you're not a member" });
    }

    let imageUrl = null;
    // If image is present as base64 string, upload to Cloudinary
    if (image && image.startsWith("data:image")) {
      // Your existing image upload code here
    }

    if (!text && !imageUrl) {
      return res.status(400).json({ message: "Message must contain text or an image" });
    }

    const newMessage = new Message({
      senderId,
      groupId,
      text,
      image: imageUrl,
      replyToId: replyToId || null
    });

    const savedMessage = await newMessage.save();
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate("senderId", "fullName profilePicture");

    // Emit to room BUT EXCLUDE the sender
    const senderSocketId = getReceiverSocketId(senderId.toString());
    
    // Use our helper function to emit to everyone but the sender
    emitToRoomExceptSender(groupId, 'newGroupMessage', populatedMessage, senderSocketId);

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendGroupMessage:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

export const addMessageReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // For group messages, check if user is a member of the group
    if (message.groupId) {
      const isMember = await Group.exists({
        _id: message.groupId,
        members: userId,
      });

      if (!isMember) {
        return res.status(403).json({ message: "You are not a member of this group" });
      }
    }

    // Check if reaction already exists
    const existingReaction = message.reactions.find(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingReaction) {
      // Update existing reaction
      existingReaction.emoji = emoji;
    } else {
      // Add new reaction
      message.reactions.push({ userId, emoji });
    }

    await message.save();

    // If it's a group message, broadcast to all group members
    if (message.groupId) {
      io.to(message.groupId.toString()).emit("groupMessageReaction", {
        messageId: message._id,
        userId,
        emoji,
      });
    }

    res.status(200).json(message);
  } catch (err) {
    console.error("Error adding reaction:", err);
    res.status(500).json({ message: "Failed to add reaction" });
  }
};

export const removeMessageReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Filter out the user's reaction
    message.reactions = message.reactions.filter(
      (r) => r.userId.toString() !== userId.toString()
    );

    await message.save();

    // If it's a group message, broadcast to all group members
    if (message.groupId) {
      io.to(message.groupId.toString()).emit("groupMessageReactionRemoved", {
        messageId: message._id,
        userId,
      });
    }

    res.status(200).json(message);
  } catch (err) {
    console.error("Error removing reaction:", err);
    res.status(500).json({ message: "Failed to remove reaction" });
  }
};