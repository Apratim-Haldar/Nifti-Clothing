const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { verifyToken } = require('../middleware/authMiddleware');

// Create new order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;

    // Validate stock availability for all items
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ 
          message: `Product ${item.title} not found` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.title}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }
    }

    // Create order
    const order = new Order({
      userId: req.userId,
      items,
      totalAmount,
      shippingAddress
    });

    await order.save();

    // Reduce stock for each item
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { 
          $inc: { stock: -item.quantity },
          $set: { inStock: true } // Will be updated by post-save hook if needed
        }
      );

      // Update inStock status
      const updatedProduct = await Product.findById(item.productId);
      updatedProduct.inStock = updatedProduct.stock > 0;
      await updatedProduct.save();
    }

    await order.populate('items.productId', 'title imageUrl');
    
    res.status(201).json({
      message: 'Order created successfully',
      order: order
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Get user orders
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('items.productId', 'title imageUrl')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If order is being cancelled, restore stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { 
            $inc: { stock: item.quantity },
            $set: { inStock: true }
          }
        );
      }
    }

    order.status = status;
    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order: order
    });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

module.exports = router;