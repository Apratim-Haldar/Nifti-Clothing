const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

const isProduction = process.env.NODE_ENV === 'production';

// Cookie configuration for production
const getCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction, // HTTPS only in production
  sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-site in production
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  domain: isProduction ? undefined : undefined // Let browser handle domain
});

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, referredBy } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const affiliateCode = uuidv4().slice(0, 8); // short and unique

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      affiliateCode,
      isAdmin: false,
      referredBy,
    });
    if (referredBy === process.env.ADMIN_SECRET_CODE) {
      newUser.isAdmin = true; // Grant admin rights
    }
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Set cookie with production-safe options
    res.cookie('token', token, getCookieOptions());
    
    // Return user without password
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      affiliateCode: newUser.affiliateCode,
      isAdmin: newUser.isAdmin
    };
    
    res.status(201).json({ msg: 'User registered', user: userResponse });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Set cookie with production-safe options
    res.cookie('token', token, getCookieOptions());
    
    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      affiliateCode: user.affiliateCode,
      isAdmin: user.isAdmin
    };
    
    res.status(200).json({ msg: 'Login successful', user: userResponse });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// GET ME
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('name email phone affiliateCode isAdmin');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      affiliateCode: user.affiliateCode,
      isAdmin: user.isAdmin
    };

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// NEW: UPDATE PROFILE
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken by another user' });
      }
    }

    // Update user
    const updateData = {
      name,
      email,
      ...(phone && { phone }) // Only include phone if provided
    };

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('name email phone affiliateCode isAdmin');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      affiliateCode: user.affiliateCode,
      isAdmin: user.isAdmin
    };

    res.json({ message: 'Profile updated successfully', user: userResponse });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// NEW: UPDATE PASSWORD
router.put('/password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Get user with password
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await User.findByIdAndUpdate(req.userId, { password: hashedPassword });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Failed to update password' });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  try {
    // Clear the token cookie with same options used to set it
    res.clearCookie('token', getCookieOptions());
    res.status(200).json({ msg: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;