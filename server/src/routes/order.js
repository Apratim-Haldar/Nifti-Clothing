const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const puppeteer = require('puppeteer');
const { verifyToken } = require('../middleware/authMiddleware');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

// Create new order (without payment)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { user, items, totalAmount } = req.body;

    console.log('Creating order with data:', { user, items: items?.length, totalAmount });

    // Validate that items exist and have required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ 
        message: 'Order must contain at least one item' 
      });
    }

    // Validate user data
    if (!user || !user.name || !user.email || !user.phone || !user.address) {
      return res.status(400).json({ 
        message: 'All user information (name, email, phone, address) is required' 
      });
    }

    // Validate and clean items data
    const cleanedItems = items.map(item => ({
      productId: item.productId,
      title: item.title,
      imageUrl: item.imageUrl || '',
      price: Number(item.price),
      size: item.size,
      quantity: Number(item.quantity)
    }));

    // Create order with explicit field mapping
    const orderData = {
      userId: req.userId,
      user: {
        name: user.name.trim(),
        email: user.email.trim(),
        phone: user.phone.trim(),
        address: user.address.trim()
      },
      items: cleanedItems,
      totalAmount: Number(totalAmount),
      status: 'pending',
      paymentStatus: 'pending'
    };

    console.log('Cleaned order data:', orderData);

    const order = new Order(orderData);
    const savedOrder = await order.save();

    console.log('Order saved successfully:', savedOrder._id);

    // Send confirmation emails (but don't fail if email fails)
    try {
      await sendOrderConfirmationEmail(savedOrder);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the order if email fails
    }

    res.status(201).json({
      message: 'Order placed successfully! You will receive a confirmation email shortly.',
      order: {
        _id: savedOrder._id,
        orderNumber: savedOrder.orderNumber,
        status: savedOrder.status,
        totalAmount: savedOrder.totalAmount,
        createdAt: savedOrder.createdAt
      }
    });

  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ 
      message: 'Failed to create order',
      error: err.message 
    });
  }
});

// Get user's orders
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

router.get('/bill/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOne({ orderNumber }).populate('user');

    if (!order) {
      return res.status(404).send('Order not found');
    }

    // --- PDF Generation Logic ---
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] }); // Use --no-sandbox for server environments
    const page = await browser.newPage();

    // You would create an HTML template for your bill.
    // For consistency, you can reuse the same React component's structure/CSS.
    const htmlContent = `
      <html>
        <head>
          <title>Shipping Bill - ${order.orderNumber}</title>
          <style>
            /* IMPORTANT: Paste the CSS from your ShippingBill component here */
            /* For example: body { font-family: sans-serif; } .header { ... } */
          </style>
        </head>
        <body>
          <div class="bill-content">
             <h1>Shipping Bill for ${order.orderNumber}</h1>
             <p>Customer: ${order.user.name}</p>
             <p>Total: ₹${order.totalAmount}</p>
             </div>
        </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    // --- Send PDF as Response ---
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': `attachment; filename="Nifti-Bill-${order.orderNumber}.pdf"`,
    });
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Could not generate PDF.');
  }
});

// Cancel order (customer)
router.patch('/:orderId/cancel', verifyToken, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      userId: req.userId 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ 
        message: 'Cannot cancel order in current status' 
      });
    }

    order.status = 'cancelled';
    order.updatedAt = new Date();
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    console.error('Error cancelling order:', err);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
});

// Get all orders (admin only)
router.get('/admin/all', verifyToken, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const orders = await Order.find()
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// It finds an order by its 'orderNumber' field instead of its '_id'
router.get('/by-number/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Server error fetching order by number:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update order status (admin only)
router.patch('/:orderId/status', verifyToken, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status, paymentStatus } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { 
        status,
        paymentStatus,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order updated successfully', order });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ message: 'Failed to update order' });
  }
});

// Add/update order notes (admin only)
router.patch('/:orderId/notes', verifyToken, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { notes } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { 
        notes,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order notes updated successfully', order });
  } catch (err) {
    console.error('Error updating order notes:', err);
    res.status(500).json({ message: 'Failed to update order notes' });
  }
});

module.exports = router;