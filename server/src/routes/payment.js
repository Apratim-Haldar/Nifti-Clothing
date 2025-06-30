const express = require('express');
const Razorpay = require('razorpay');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // convert to paisa
      currency: 'INR',
      receipt: `rcpt_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, currency: order.currency, amount: order.amount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Razorpay order creation failed' });
  }
});

module.exports = router;