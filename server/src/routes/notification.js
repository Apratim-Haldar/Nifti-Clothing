const express = require('express');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');
const { sendSMS } = require('../utils/smsService');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin-only route to trigger new product alerts
router.post('/new-product', verifyToken, async (req, res) => {
  const { title, link } = req.body;

  try {
    const users = await User.find({});

    await Promise.all(
      users.map((user) => {
        const emailMsg = `
          <h3>New Product Alert!</h3>
          <p><strong>${title}</strong> is now available in our store.</p>
          <p><a href="${link}">Check it out now →</a></p>
        `;
        const smsMsg = `New drop: ${title} is live! Visit ${link}`;

        return Promise.all([
          sendEmail(user.email, `New Drop: ${title}`, emailMsg),
          sendSMS(user.phone, smsMsg),
        ]);
      })
    );

    res.json({ message: 'Notifications sent to all users.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send notifications.' });
  }
});

module.exports = router;