const express = require('express');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('affiliateCode');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const referredUsers = await User.find({ referredBy: user.affiliateCode }).select('name email');

    res.json({
      affiliateCode: user.affiliateCode,
      count: referredUsers.length,
      referred: referredUsers,
    });
  } catch {
    res.status(500).json({ message: 'Failed to fetch referral stats' });
  }
});

module.exports = router;