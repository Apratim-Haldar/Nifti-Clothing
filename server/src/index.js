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

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Configure CORS for production and development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CLIENT_URL,
      process.env.CLIENT_URL_2,
      process.env.PRODUCTION_CLIENT_URL,
      // Add your production domain here
      'https://your-production-domain.com',
      'https://your-production-domain.vercel.app',
      'https://your-production-domain.netlify.app'
    ].filter(Boolean); // Remove undefined values

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Add security headers for production
if (isProduction) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    next();
  });
}

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Stripe webhook requires raw body
app.post('/api/payment/webhook', bodyParser.raw({ type: 'application/json' }), paymentRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS origins: ${JSON.stringify(corsOptions.origin)}`);
});
