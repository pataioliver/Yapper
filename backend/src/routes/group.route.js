import express from 'express';
import { createGroup, getUserGroups, removeGroup } from '../controllers/group.controller.js';
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/', protectRoute, createGroup);
router.get('/', protectRoute, getUserGroups);
router.delete('/:id', protectRoute, removeGroup);

export default router;