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

// Helper function to fix FCM endpoint format if needed
const fixFcmEndpoint = (endpoint) => {
  // Check if it's an FCM endpoint with the old format
  if (endpoint && endpoint.includes('fcm.googleapis.com/fcm/send/')) {
    // Transform from /fcm/send/ to /wp/ format
    return endpoint.replace('fcm.googleapis.com/fcm/send/', 'fcm.googleapis.com/wp/');
  }
  return endpoint;
};

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
          // Create a copy of the subscription with potentially fixed endpoint
          const fixedSubscription = {
            ...sub.subscription,
            endpoint: fixFcmEndpoint(sub.subscription.endpoint)
          };
          
          console.log('Sending notification to:', fixedSubscription.endpoint);
          await webpush.sendNotification(fixedSubscription, payload);
          return { status: 'success', endpoint: fixedSubscription.endpoint };
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

// Add this function to your existing controller
export const getVapidKey = (req, res) => {
  try {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    console.log("VAPID_PUBLIC_KEY:", publicKey);
    
    if (!publicKey) {
      return res.status(500).json({ 
        message: "VAPID public key not configured on server",
        success: false 
      });
    }
    
    return res.status(200).json({ 
      publicKey,
      success: true 
    });
  } catch (error) {
    console.error("Error in getVapidKey:", error);
    return res.status(500).json({ 
      message: "Server error retrieving VAPID key",
      success: false 
    });
  }
};