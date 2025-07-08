const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Newsletter = require('../models/Newsletter'); // Add Newsletter model import
const { v4: uuidv4 } = require('uuid');
const { verifyToken } = require('../middleware/authMiddleware');
const { sendOTPEmail, sendWelcomeEmail } = require('../utils/emailService');
const router = express.Router();

const isProduction = process.env.NODE_ENV === 'production';

// In-memory store for OTPs (in production, use Redis)
const otpStore = new Map();

// Generate 6-digit numeric OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Cookie configuration for production
const getCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction, // HTTPS only in production
  sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-site in production
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  domain: isProduction ? undefined : undefined // Let browser handle domain
});

// ORIGINAL REGISTER (for backward compatibility - direct registration without OTP)
router.post('/register-direct', async (req, res) => {
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

// NEW: REGISTER WITH OTP - Step 1: Send OTP
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, referredBy } = req.body;

    // Validate required input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP temporarily (include phone if provided)
    otpStore.set(email, {
      otp,
      expiry: otpExpiry,
      userData: { name, email, phone: phone || null, password, referredBy }
    });

    // Send OTP email
    await sendOTPEmail(email, name, otp);

    res.status(200).json({
      message: 'OTP sent to your email. Please verify to complete registration.',
      email,
      step: 'verify-otp'
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// NEW: VERIFY OTP - Step 2: Complete Registration
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Check if OTP exists
    const storedData = otpStore.get(email);
    if (!storedData) {
      return res.status(400).json({ message: 'OTP not found. Please register again.' });
    }

    // Check expiry
    if (Date.now() > storedData.expiry) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP has expired. Please register again.' });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Create user (phone is optional)
    const { name, phone, password, referredBy } = storedData.userData;
    const hashedPassword = await bcrypt.hash(password, 12);
    const affiliateCode = uuidv4().slice(0, 8); // short and unique

    const userObject = {
      name,
      email,
      password: hashedPassword,
      affiliateCode,
      isAdmin: false,
      referredBy
    };

    // Only add phone if it was provided
    if (phone && phone.trim()) {
      userObject.phone = phone;
    }

    // Check if admin secret code was used
    if (referredBy === process.env.ADMIN_SECRET_CODE) {
      userObject.isAdmin = true; // Grant admin rights
    }

    const newUser = new User(userObject);
    await newUser.save();

    // Clean up OTP
    otpStore.delete(email);

    // Automatically add user to newsletter mailing list
    try {
      const existingSubscriber = await Newsletter.findOne({ email });
      if (!existingSubscriber) {
        const unsubscribeToken = uuidv4();
        const newSubscriber = new Newsletter({
          email,
          unsubscribeToken
        });
        await newSubscriber.save();
      } else if (existingSubscriber.status === 'unsubscribed') {
        // Resubscribe if they were previously unsubscribed
        existingSubscriber.status = 'subscribed';
        existingSubscriber.subscribedAt = new Date();
        existingSubscriber.unsubscribedAt = undefined;
        await existingSubscriber.save();
      }
    } catch (newsletterError) {
      console.error('Newsletter subscription failed during registration:', newsletterError);
      // Don't fail registration if newsletter subscription fails
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(newUser);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
    }

    // Generate JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Set cookie with production-safe options
    res.cookie('token', token, getCookieOptions());
    
    // Return user without password
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || null,
      affiliateCode: newUser.affiliateCode,
      isAdmin: newUser.isAdmin
    };

    res.status(201).json({
      message: 'Registration successful! Welcome to Nifti!',
      user: userResponse
    });

  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Server error during verification' });
  }
});

// NEW: RESEND OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if there's pending registration data
    const storedData = otpStore.get(email);
    if (!storedData) {
      return res.status(400).json({ message: 'No pending registration found. Please register again.' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Update stored data with new OTP
    otpStore.set(email, {
      ...storedData,
      otp,
      expiry: otpExpiry
    });

    // Send new OTP email
    await sendOTPEmail(email, storedData.userData.name, otp);

    res.status(200).json({
      message: 'New OTP sent to your email.',
      email
    });

  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ message: 'Server error during OTP resend' });
  }
});

// NEW: REQUEST EMAIL CHANGE OTP
router.post('/request-email-change', verifyToken, async (req, res) => {
  try {
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({ message: 'New email is required' });
    }

    // Check if email is already taken
    const existingUser = await User.findOne({ email: newEmail, _id: { $ne: req.userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already taken by another user' });
    }

    // Get current user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP for email change
    const changeKey = `email-change-${req.userId}`;
    otpStore.set(changeKey, {
      otp,
      expiry: otpExpiry,
      userId: req.userId,
      newEmail,
      currentEmail: user.email
    });

    // Send OTP to NEW email
    await sendOTPEmail(newEmail, user.name, otp);

    res.status(200).json({
      message: 'OTP sent to your new email address. Please verify to complete the change.',
      email: newEmail
    });

  } catch (err) {
    console.error('Email change request error:', err);
    res.status(500).json({ message: 'Server error during email change request' });
  }
});

// NEW: VERIFY EMAIL CHANGE OTP
router.post('/verify-email-change', verifyToken, async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }

    // Check if OTP exists for email change
    const changeKey = `email-change-${req.userId}`;
    const storedData = otpStore.get(changeKey);
    if (!storedData) {
      return res.status(400).json({ message: 'OTP not found. Please request email change again.' });
    }

    // Check expiry
    if (Date.now() > storedData.expiry) {
      otpStore.delete(changeKey);
      return res.status(400).json({ message: 'OTP has expired. Please request email change again.' });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Update user email
    const user = await User.findByIdAndUpdate(
      req.userId,
      { email: storedData.newEmail },
      { new: true, runValidators: true }
    ).select('name email phone affiliateCode isAdmin');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clean up OTP
    otpStore.delete(changeKey);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      affiliateCode: user.affiliateCode,
      isAdmin: user.isAdmin
    };

    res.json({ 
      message: 'Email updated successfully', 
      user: userResponse 
    });

  } catch (err) {
    console.error('Email change verification error:', err);
    res.status(500).json({ message: 'Server error during email verification' });
  }
});

// EXISTING: LOGIN (unchanged)
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

// EXISTING: GET ME (unchanged)
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

// UPDATED: UPDATE PROFILE (name and phone only)
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Update user (only name and phone, email is handled separately)
    const updateData = {
      name,
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

// EXISTING: UPDATE PASSWORD (unchanged)
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

// EXISTING: LOGOUT (unchanged)
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

// FORGOT PASSWORD - Request OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP for password reset
    const resetKey = `password-reset-${email}`;
    otpStore.set(resetKey, {
      otp,
      expiry: otpExpiry,
      email,
      userId: user._id
    });

    // Send OTP email
    await sendOTPEmail(email, user.name, otp);

    res.status(200).json({
      message: 'Password reset OTP sent to your email.',
      email
    });

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
});

// RESET PASSWORD - Verify OTP and set new password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if OTP exists for password reset
    const resetKey = `password-reset-${email}`;
    const storedData = otpStore.get(resetKey);
    if (!storedData) {
      return res.status(400).json({ message: 'OTP not found. Please request password reset again.' });
    }

    // Check expiry
    if (Date.now() > storedData.expiry) {
      otpStore.delete(resetKey);
      return res.status(400).json({ message: 'OTP has expired. Please request password reset again.' });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await User.findByIdAndUpdate(storedData.userId, { password: hashedPassword });

    // Clean up OTP
    otpStore.delete(resetKey);

    res.json({ message: 'Password reset successfully' });

  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

module.exports = router;