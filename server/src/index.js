// server/index.ts
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const pingRoutes = require('./routes/ping');
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
const newsletterRoutes = require('./routes/newsletter');
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

// Define allowed origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_2,
  process.env.PRODUCTION_CLIENT_URL,
  process.env.TEST_URL,
  'https://www.nifti.in',
  // Add your actual production domains here
  'https://your-production-domain.com',
  'https://your-production-domain.vercel.app',
  'https://your-production-domain.netlify.app',
  // For testing purposes, you might want to temporarily allow all origins in production
  // Remove this in actual production!
].filter(Boolean); // Remove undefined values

console.log('Allowed CORS origins:', allowedOrigins);

// Configure CORS for production and development
const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS check for origin:', origin);
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) {
      console.log('Allowing request with no origin');
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      // For development/testing, you might want to allow all origins temporarily
      // Remove this in production!
      if (isProduction) {
        callback(new Error('Not allowed by CORS'));
      } else {
        // In development, allow all origins
        callback(null, true);
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// For troubleshooting CORS issues, temporarily allow all origins
// REMOVE THIS IN PRODUCTION!
if (isProduction && process.env.ALLOW_ALL_ORIGINS === 'true') {
  console.log('⚠️  WARNING: Allowing all origins for debugging. Remove this in production!');
  corsOptions.origin = true;
}

app.use(cors(corsOptions));

// Add preflight handling
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Add additional CORS headers for production debugging
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`Request from origin: ${origin}`);
  
  if (isProduction) {
    // Allow credentials
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Set CORS headers for preflight requests
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With');
      res.header('Access-Control-Max-Age', '3600');
      return res.status(200).end();
    }
  }
  
  next();
});

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
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/ping', pingRoutes)
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    corsOrigins: allowedOrigins
  });
});

// Debug endpoint to check CORS configuration
app.get('/api/debug/cors', (req, res) => {
  res.json({
    origin: req.headers.origin,
    allowedOrigins: allowedOrigins,
    userAgent: req.headers['user-agent'],
    headers: req.headers
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
  console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
  console.log(`Production mode: ${isProduction}`);
});
