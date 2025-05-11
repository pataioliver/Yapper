import Group from '../models/group.model.js';

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