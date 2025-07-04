const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const NewsletterSettings = require('../models/NewsletterSettings');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { sendNewsletterEmail, sendWelcomeNewsletterEmail } = require('../utils/emailService');
const { v4: uuidv4 } = require('uuid');

// Helper function to get newsletter settings
const getNewsletterSettings = async () => {
  let settings = await NewsletterSettings.findOne({ isActive: true });
  if (!settings) {
    // Create default settings if none exist
    settings = new NewsletterSettings({});
    await settings.save();
  }
  return settings;
};

// Public: Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if email already exists
    let subscriber = await Newsletter.findOne({ email });
    
    if (subscriber) {
      if (subscriber.status === 'subscribed') {
        return res.status(200).json({ message: 'You are already subscribed to our newsletter!' });
      } else {
        // Resubscribe
        subscriber.status = 'subscribed';
        subscriber.subscribedAt = new Date();
        subscriber.unsubscribedAt = undefined;
        await subscriber.save();
        
        const settings = await getNewsletterSettings();
        await sendWelcomeNewsletterEmail(email, settings);
        return res.status(200).json({ message: 'Welcome back! You have been resubscribed to our newsletter.' });
      }
    }

    // Create new subscription
    const unsubscribeToken = uuidv4();
    const newSubscriber = new Newsletter({
      email,
      unsubscribeToken
    });

    await newSubscriber.save();
    
    // Send welcome email with settings
    const settings = await getNewsletterSettings();
    await sendWelcomeNewsletterEmail(email, settings);

    res.status(201).json({ 
      message: 'Successfully subscribed! Check your email for a welcome message.' 
    });

  } catch (err) {
    console.error('Newsletter subscription error:', err);
    res.status(500).json({ message: 'Failed to subscribe to newsletter' });
  }
});

// Public: Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const subscriber = await Newsletter.findOne({ email });
    if (!subscriber) {
      return res.status(404).json({ message: 'Email not found in our newsletter list' });
    }

    if (subscriber.status === 'unsubscribed') {
      return res.status(200).json({ message: 'You are already unsubscribed from our newsletter' });
    }

    // Update subscription status
    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.status(200).json({ message: 'Successfully unsubscribed from newsletter. We\'re sorry to see you go!' });

  } catch (err) {
    console.error('Newsletter unsubscribe error:', err);
    res.status(500).json({ message: 'Failed to unsubscribe from newsletter' });
  }
});

// Admin: Get all subscribers
router.get('/subscribers', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, status = 'all', search = '' } = req.query;
    
    // Build query
    const query = {};
    if (status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }

    // Execute query with pagination
    const subscribers = await Newsletter.find(query)
      .sort({ subscribedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Newsletter.countDocuments(query);

    // Get statistics
    const stats = {
      total: await Newsletter.countDocuments(),
      subscribed: await Newsletter.countDocuments({ status: 'subscribed' }),
      unsubscribed: await Newsletter.countDocuments({ status: 'unsubscribed' })
    };

    res.json({
      subscribers,
      stats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (err) {
    console.error('Error fetching subscribers:', err);
    res.status(500).json({ message: 'Failed to fetch subscribers' });
  }
});

// Admin: Send newsletter to all subscribers
router.post('/send', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { subject, content, customization = {} } = req.body;

    if (!subject || !content) {
      return res.status(400).json({ message: 'Subject and content are required' });
    }

    // Get newsletter settings and merge with custom options
    const settings = await getNewsletterSettings();
    const finalCustomization = { ...settings.toObject(), ...customization };

    // Get all subscribed emails
    const subscribers = await Newsletter.find({ status: 'subscribed' });
    
    if (subscribers.length === 0) {
      return res.status(400).json({ message: 'No active subscribers found' });
    }

    // Send emails in batches to avoid overwhelming the email service
    const batchSize = 50;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const promises = batch.map(async (subscriber) => {
        try {
          const unsubscribeLink = `${settings.websiteUrl}/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.unsubscribeToken}`;
          await sendNewsletterEmail(subscriber.email, subject, content, unsubscribeLink, finalCustomization);
          successCount++;
        } catch (error) {
          console.error(`Failed to send to ${subscriber.email}:`, error);
          failCount++;
        }
      });

      await Promise.all(promises);
      
      // Add delay between batches
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    res.json({
      message: `Newsletter sent successfully`,
      results: {
        total: subscribers.length,
        successful: successCount,
        failed: failCount
      }
    });

  } catch (err) {
    console.error('Newsletter send error:', err);
    res.status(500).json({ message: 'Failed to send newsletter' });
  }
});

// Admin: Get newsletter settings
router.get('/settings', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const settings = await getNewsletterSettings();
    res.json(settings);
  } catch (err) {
    console.error('Error fetching newsletter settings:', err);
    res.status(500).json({ message: 'Failed to fetch newsletter settings' });
  }
});

// Admin: Update newsletter settings
router.put('/settings', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updates = req.body;
    
    let settings = await NewsletterSettings.findOne({ isActive: true });
    if (!settings) {
      settings = new NewsletterSettings(updates);
    } else {
      Object.assign(settings, updates);
    }
    
    await settings.save();
    res.json({ message: 'Newsletter settings updated successfully', settings });
  } catch (err) {
    console.error('Error updating newsletter settings:', err);
    res.status(500).json({ message: 'Failed to update newsletter settings' });
  }
});

// Admin: Preview newsletter template
router.post('/preview', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { subject, content, customization = {} } = req.body;
    
    // Get current settings and merge with preview customization
    const settings = await getNewsletterSettings();
    const finalCustomization = { ...settings.toObject(), ...customization };
    
    const { generateNewsletterHTML } = require('../utils/emailTemplates');
    const previewHTML = generateNewsletterHTML(
      subject || 'Newsletter Preview',
      content || '<p>This is a preview of your newsletter content.</p>',
      '#',
      finalCustomization
    );
    
    res.json({ 
      html: previewHTML,
      customization: finalCustomization
    });
  } catch (err) {
    console.error('Error generating newsletter preview:', err);
    res.status(500).json({ message: 'Failed to generate newsletter preview' });
  }
});

// Admin: Delete subscriber
router.delete('/subscribers/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);
    
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    res.json({ message: 'Subscriber deleted successfully' });

  } catch (err) {
    console.error('Error deleting subscriber:', err);
    res.status(500).json({ message: 'Failed to delete subscriber' });
  }
});

// Admin: Export subscribers
router.get('/export', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status = 'subscribed' } = req.query;
    
    const query = status === 'all' ? {} : { status };
    const subscribers = await Newsletter.find(query).select('email status subscribedAt unsubscribedAt').sort({ subscribedAt: -1 });

    // Convert to CSV format
    const csvHeader = 'Email,Status,Subscribed At,Unsubscribed At\n';
    const csvData = subscribers.map(sub => 
      `${sub.email},${sub.status},${sub.subscribedAt?.toISOString() || ''},${sub.unsubscribedAt?.toISOString() || ''}`
    ).join('\n');

    const csv = csvHeader + csvData;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=newsletter-subscribers-${Date.now()}.csv`);
    res.send(csv);

  } catch (err) {
    console.error('Error exporting subscribers:', err);
    res.status(500).json({ message: 'Failed to export subscribers' });
  }
});

module.exports = router;