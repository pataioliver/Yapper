import webpush from 'web-push';
import PushSubscription from '../models/pushSubscription.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Configure web-push
webpush.setVapidDetails(
  `mailto:${process.env.EMAIL_USER}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Subscribe to push notifications
export const subscribe = async (req, res) => {
  try {
    const { subscription } = req.body;
    const userId = req.user._id;

    // Check if subscription already exists for this user
    const existingSubscription = await PushSubscription.findOne({ userId, 'subscription.endpoint': subscription.endpoint });
    if (existingSubscription) {
      return res.status(200).json({ message: 'Subscription already exists' });
    }

    // Save new subscription
    const pushSubscription = new PushSubscription({
      userId,
      subscription,
    });
    await pushSubscription.save();

    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Error in subscribe:', error);
    res.status(500).json({ message: 'Failed to subscribe' });
  }
};

// Send push notification (for testing or manual triggering)
export const sendNotification = async (req, res) => {
  try {
    const { userId, title, body, icon } = req.body;

    const subscriptions = await PushSubscription.find({ userId });
    if (!subscriptions.length) {
      return res.status(404).json({ message: 'No subscriptions found for this user' });
    }

    const payload = JSON.stringify({ title, body, icon });

    const results = await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(sub.subscription, payload);
          return { status: 'success', endpoint: sub.subscription.endpoint };
        } catch (error) {
          console.error('Error sending notification to', sub.subscription.endpoint, error);
          // Remove invalid subscription
          await PushSubscription.deleteOne({ _id: sub._id });
          return { status: 'failed', endpoint: sub.subscription.endpoint, error: error.message };
        }
      })
    );

    res.status(200).json({ message: 'Notifications sent', results });
  } catch (error) {
    console.error('Error in sendNotification:', error);
    res.status(500).json({ message: 'Failed to send notifications' });
  }
};