const express = require('express');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Get user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('cart');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ cart: user.cart || [] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart', error });
  }
});

// Add item to cart
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { productId, title, imageUrl, price, size, quantity } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if item already exists in cart
    const existingItemIndex = user.cart.findIndex(
      item => item.productId === productId && item.size === size
    );

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      user.cart.push({ productId, title, imageUrl, price, size, quantity });
    }

    await user.save();
    res.json({ message: 'Item added to cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item to cart', error });
  }
});

// Update item quantity in cart
router.put('/update', verifyToken, async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const itemIndex = user.cart.findIndex(
      item => item.productId === productId && item.size === size
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        user.cart.splice(itemIndex, 1);
      } else {
        // Update quantity
        user.cart[itemIndex].quantity = quantity;
      }
      
      await user.save();
      res.json({ message: 'Cart updated', cart: user.cart });
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart', error });
  }
});

// Remove item from cart
router.delete('/remove', verifyToken, async (req, res) => {
  try {
    const { productId, size } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = user.cart.filter(
      item => !(item.productId === productId && item.size === size)
    );

    await user.save();
    res.json({ message: 'Item removed from cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item from cart', error });
  }
});

// Clear entire cart
router.delete('/clear', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = [];
    await user.save();
    
    res.json({ message: 'Cart cleared', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear cart', error });
  }
});

module.exports = router;