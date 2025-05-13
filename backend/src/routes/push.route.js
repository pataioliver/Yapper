import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { subscribe, sendNotification, getVapidKey } from '../controllers/push.controller.js';

const router = express.Router();

router.get("/vapid-key", getVapidKey);
router.post('/subscribe', protectRoute, subscribe);
router.post('/send-notification', protectRoute, sendNotification);

export default router;