const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

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
    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ msg: 'User registered', user: newUser });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err });
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
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ msg: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('name email affiliateCode isAdmin');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

router.post('/logout', (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token');
    res.status(200).json({ msg: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err });
  }
});

module.exports = router;