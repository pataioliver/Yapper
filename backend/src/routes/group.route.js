import express from 'express';
import { 
    createGroup, 
    getUserGroups, 
    getGroupById,       // Changed from getGroupDetails to match controller
    updateGroup,
    deleteGroup,        // Changed from removeGroup to match controller
    addGroupMember,
    removeGroupMember,
    sendGroupMessage, 
    getGroupMessages,
    addMessageReaction  // Changed from addGroupMessageReaction to match controller
} from '../controllers/group.controller.js';
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Group CRUD operations
router.post('/', protectRoute, createGroup);
router.get('/', protectRoute, getUserGroups);
router.get('/:groupId', protectRoute, getGroupById);          // Changed function name
router.put('/:groupId', protectRoute, updateGroup);
router.delete('/:groupId', protectRoute, deleteGroup);        // Changed function name

// Group membership management
router.post('/:groupId/members', protectRoute, addGroupMember);
router.delete('/:groupId/members', protectRoute, removeGroupMember);

// Group messaging
router.post('/:groupId/messages', protectRoute, sendGroupMessage);
router.get('/:groupId/messages', protectRoute, getGroupMessages);

// Group message reactions
router.post('/messages/:messageId/reactions', protectRoute, addMessageReaction); // Changed function name

export default router;