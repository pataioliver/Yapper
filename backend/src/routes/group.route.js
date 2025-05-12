import express from 'express';
import { createGroup, getUserGroups, removeGroup, sendGroupMessage, getGroupMessages } from '../controllers/group.controller.js';
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/', protectRoute, createGroup);
router.get('/', protectRoute, getUserGroups);
router.delete('/:id', protectRoute, removeGroup);

router.post('/:groupId/messages', protectRoute, sendGroupMessage);
router.get('/:groupId/messages', protectRoute, getGroupMessages);

export default router;