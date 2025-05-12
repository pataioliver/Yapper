import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { subscribe, sendNotification } from '../controllers/push.controller.js';

router.get("/vapid-key", (req, res) => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  console.log("VAPID_PUBLIC_KEY:", publicKey); // Debug
  if (!publicKey) {
    return res.status(500).json({ message: "VAPID public key not configured on server" });
  }
  res.json({ publicKey });
});

const router = express.Router();

router.post('/subscribe', protectRoute, subscribe);
router.post('/send-notification', protectRoute, sendNotification);

export default router;