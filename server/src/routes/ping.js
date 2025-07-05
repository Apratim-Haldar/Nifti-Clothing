const express = require('express');
const router = express.Router();

// Import the http module for making internal requests (avoiding external dependency)
const http = require('http');
const https = require('https');
const url = require('url');

// Make HTTP request without external dependencies
const makeRequest = (requestUrl, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(requestUrl);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      method: 'GET',
      headers: {
        'User-Agent': 'Server-Ping-Agent',
        'Connection': 'close'
      },
      timeout: timeout
    };

    const requestModule = parsedUrl.protocol === 'https:' ? https : http;
    
    const req = requestModule.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          data: data.slice(0, 200) // Limit data for logging
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
};

// Get the base URL for the server
const getBaseUrl = (req) => {
  const protocol = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
};

// Define all the routes that should be pinged to keep the server awake
const getRoutesToPing = () => [
  // Health and debug routes
  '/health',
  '/api/debug/cors',
  
  // Product routes (public endpoints)
  '/api/products',
  '/api/products/filters/options',
  
  // Category routes (public endpoints)
  '/api/categories',
  
  // Advertisement routes (public endpoints)
  '/api/admin/advertisements/active',
  
  // Newsletter routes (public endpoints)
  '/api/newsletter/settings',
  
  // Ping routes (self-referential to ensure ping system is working)
  '/api/ping/ping',
  '/api/ping/routes',
];

// Ping all routes endpoint
router.get('/ping-all', async (req, res) => {
  const baseUrl = getBaseUrl(req);
  const routesToPing = getRoutesToPing();
  const results = [];
  const startTime = Date.now();

  console.log(`🔄 Starting ping-all operation at ${new Date().toISOString()}`);
  console.log(`📍 Base URL: ${baseUrl}`);
  console.log(`🎯 Pinging ${routesToPing.length} routes`);

  // Ping each route
  for (const route of routesToPing) {
    const requestUrl = `${baseUrl}${route}`;
    const routeStartTime = Date.now();
    
    try {
      const response = await makeRequest(requestUrl, 10000);
      
      const responseTime = Date.now() - routeStartTime;
      const result = {
        route,
        url: requestUrl,
        status: response.status,
        statusText: response.statusText,
        responseTime: `${responseTime}ms`,
        success: response.status >= 200 && response.status < 400,
        timestamp: new Date().toISOString()
      };
      
      results.push(result);
      console.log(`✅ ${route} - ${response.status} (${responseTime}ms)`);
      
    } catch (error) {
      const responseTime = Date.now() - routeStartTime;
      const result = {
        route,
        url: requestUrl,
        status: 'ERROR',
        statusText: error.message,
        responseTime: `${responseTime}ms`,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      
      results.push(result);
      console.log(`❌ ${route} - ${error.message} (${responseTime}ms)`);
    }
    
    // Small delay between requests to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  const totalTime = Date.now() - startTime;
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.length - successCount;

  const summary = {
    totalRoutes: routesToPing.length,
    successCount,
    failureCount,
    successRate: `${((successCount / routesToPing.length) * 100).toFixed(1)}%`,
    totalTime: `${totalTime}ms`,
    averageResponseTime: `${Math.round(totalTime / routesToPing.length)}ms`,
    timestamp: new Date().toISOString(),
    baseUrl,
    serverUptime: `${Math.round(process.uptime())}s`,
    memoryUsage: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
    }
  };

  console.log(`🏁 Ping-all completed: ${successCount}/${routesToPing.length} successful (${totalTime}ms)`);

  res.json({
    message: 'Ping all routes completed - server is awake!',
    summary,
    results: process.env.NODE_ENV === 'development' ? results : results.map(r => ({
      route: r.route,
      status: r.status,
      responseTime: r.responseTime,
      success: r.success
    })) // Hide detailed info in production
  });
});

// Ping specific route endpoint
router.get('/ping-route', async (req, res) => {
  const { route } = req.query;
  
  if (!route) {
    return res.status(400).json({ 
      error: 'Route parameter is required',
      example: '/api/ping/ping-route?route=/api/products',
      availableRoutes: getRoutesToPing()
    });
  }

  const baseUrl = getBaseUrl(req);
  const requestUrl = `${baseUrl}${route}`;
  const startTime = Date.now();

  try {
    const response = await makeRequest(requestUrl, 10000);
    const responseTime = Date.now() - startTime;
    
    res.json({
      message: 'Route ping completed',
      route,
      url: requestUrl,
      status: response.status,
      statusText: response.statusText,
      success: response.status >= 200 && response.status < 400,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    res.status(500).json({
      message: 'Route ping failed',
      route,
      url: requestUrl,
      error: error.message,
      success: false,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    });
  }
});

// Get list of routes that will be pinged
router.get('/routes', (req, res) => {
  const baseUrl = getBaseUrl(req);
  const routesToPing = getRoutesToPing();
  
  res.json({
    message: 'Available routes for ping-all operation',
    description: 'These routes will be pinged to keep the server awake',
    baseUrl,
    totalRoutes: routesToPing.length,
    routes: routesToPing.map(route => ({
      route,
      url: `${baseUrl}${route}`,
      description: getRouteDescription(route)
    })),
    usage: {
      pingAll: `${baseUrl}/api/ping/ping-all`,
      pingSpecific: `${baseUrl}/api/ping/ping-route?route=/api/products`,
      basicPing: `${baseUrl}/api/ping/ping`
    },
    timestamp: new Date().toISOString()
  });
});

// Helper function to describe routes
const getRouteDescription = (route) => {
  const descriptions = {
    '/health': 'Server health check',
    '/api/debug/cors': 'CORS configuration debug',
    '/api/products': 'Product listing',
    '/api/products/filters/options': 'Product filter options',
    '/api/categories': 'Category listing',
    '/api/admin/advertisements/active': 'Active advertisements',
    '/api/newsletter/settings': 'Newsletter settings',
    '/api/ping/ping': 'Basic ping endpoint',
    '/api/ping/routes': 'Available ping routes'
  };
  return descriptions[route] || 'API endpoint';
};

// Simple ping endpoint for basic health check
router.get('/ping', (req, res) => {
  res.json({
    message: 'Pong! Server is awake and responding',
    timestamp: new Date().toISOString(),
    uptime: `${Math.round(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    memoryUsage: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
    },
    platform: process.platform,
    architecture: process.arch
  });
});

// Wake up endpoint - alias for ping-all with simpler response
router.get('/wake-up', async (req, res) => {
  const baseUrl = getBaseUrl(req);
  const routesToPing = getRoutesToPing();
  let successCount = 0;
  const startTime = Date.now();

  console.log(`🌅 Wake-up call initiated at ${new Date().toISOString()}`);

  // Ping routes quickly without detailed logging
  for (const route of routesToPing) {
    try {
      const requestUrl = `${baseUrl}${route}`;
      const response = await makeRequest(requestUrl, 5000);
      if (response.status >= 200 && response.status < 400) {
        successCount++;
      }
    } catch (error) {
      // Silently handle errors for wake-up call
    }
    
    // Minimal delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const totalTime = Date.now() - startTime;
  
  console.log(`☀️ Wake-up completed: ${successCount}/${routesToPing.length} routes responding (${totalTime}ms)`);

  res.json({
    message: '☀️ Server is awake and warmed up!',
    routesWarmed: successCount,
    totalRoutes: routesToPing.length,
    timeElapsed: `${totalTime}ms`,
    timestamp: new Date().toISOString(),
    status: successCount > 0 ? 'success' : 'warning'
  });
});

module.exports = router;