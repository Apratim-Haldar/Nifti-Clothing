// server/index.ts
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const categoryRoutes = require('./routes/categories');
const affiliateRoutes = require('./routes/affiliate');
const notificationRoutes = require('./routes/notification');
const paymentRoutes = require('./routes/payment');
const adminProductRoutes = require('./routes/adminProducts');
const reviewRoutes = require('./routes/reviews');
const advertisementRoutes = require('./routes/advertisements');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cartRoutes = require('./routes/cart');

// Configure dotenv to look for .env file in the server root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Log environment loading
console.log('Loading environment variables from:', path.join(__dirname, '..', '.env'));
console.log('Environment check:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- PORT:', process.env.PORT || 'using default 8080');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Set ✅' : 'Not set ❌');
console.log('- AWS_S3_BUCKET:', process.env.AWS_S3_BUCKET ? 'Set ✅' : 'Not set ❌');
console.log('- AWS_REGION:', process.env.AWS_REGION ? 'Set ✅' : 'Not set ❌');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/affiliate', affiliateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/advertisements', advertisementRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);

// Stripe webhook requires raw body
app.post('/api/payment/webhook', bodyParser.raw({ type: 'application/json' }), paymentRoutes);

mongoose
  .connect(process.env.MONGODB_URI, { dbName: 'clothing-store' })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 Client URL: ${process.env.CLIENT_URL}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
