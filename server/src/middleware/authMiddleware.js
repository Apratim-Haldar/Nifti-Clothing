const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    
    // Fetch user to get admin status
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    
    req.isAdmin = user.isAdmin;
    req.user = user; // Optionally set the full user object
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const verifyAdmin = async (req, res, next) => {
  if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
  
  // Check if isAdmin is already set from verifyToken
  if (req.isAdmin) {
    return next();
  }
  
  // Fallback: fetch user if not already set
  const user = await User.findById(req.userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  
  req.isAdmin = user.isAdmin;
  next();
};

module.exports = { verifyToken, verifyAdmin };