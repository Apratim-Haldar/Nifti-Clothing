const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      console.log('No token found in cookies');
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    console.log('Token found, verifying...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    
    // Fetch user to get admin status
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found for token');
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.isAdmin = user.isAdmin;
    req.user = user; // Optionally set the full user object
    console.log('Token verified successfully for user:', user.email);
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(401).json({ message: 'Token verification failed' });
  }
};

const verifyAdmin = async (req, res, next) => {
  if (!req.userId) {
    console.log('Admin verification failed - no userId');
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  // Check if isAdmin is already set from verifyToken
  if (req.isAdmin) {
    console.log('Admin verification successful');
    return next();
  }

  try {
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      console.log('Admin verification failed - user not admin');
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    req.isAdmin = true;
    console.log('Admin verification successful');
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({ message: 'Server error during admin verification' });
  }
};

module.exports = { verifyToken, verifyAdmin };