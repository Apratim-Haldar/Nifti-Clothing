// Connection monitoring middleware for S3 asset cleanup
// Handles user disconnections, page reloads, and session management

const s3AssetManager = require('../utils/s3AssetManager');

// Map to track active sessions and their associated socket connections
const activeSessions = new Map();

/**
 * Middleware to track user sessions for asset management
 */
const sessionTracker = (req, res, next) => {
  // Generate or retrieve session ID
  let sessionId = req.headers['x-session-id'] || req.session?.id;
  
  if (!sessionId) {
    sessionId = s3AssetManager.generateSessionId();
  }

  req.sessionId = sessionId;
  
  // Track this session and update activity
  activeSessions.set(sessionId, {
    lastActivity: new Date(),
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Add session ID to response headers
  res.setHeader('X-Session-ID', sessionId);

  next();
};

/**
 * Middleware to handle asset cleanup on request completion/error
 */
const assetCleanupMiddleware = (req, res, next) => {
  const originalSend = res.send;
  const originalJson = res.json;
  
  // Track if response was successful
  let isSuccess = false;
  
  // Override res.send to track success
  res.send = function(body) {
    isSuccess = res.statusCode >= 200 && res.statusCode < 300;
    return originalSend.call(this, body);
  };

  // Override res.json to track success
  res.json = function(body) {
    isSuccess = res.statusCode >= 200 && res.statusCode < 300;
    return originalJson.call(this, body);
  };

  // Cleanup handler
  const cleanup = async (shouldCleanup = false) => {
    if (shouldCleanup && req.sessionId) {
      console.log(`🧹 Cleaning up assets for failed request - Session: ${req.sessionId}`);
      await s3AssetManager.cleanupSession(req.sessionId);
    }
  };

  // Handle request completion
  res.on('finish', () => {
    if (!isSuccess && req.sessionId) {
      // If request failed, cleanup temp assets
      cleanup(true).catch(console.error);
    }
  });

  // Handle connection errors - with delay to avoid cleaning up during normal operations
  req.on('close', () => {
    if (!res.finished && req.sessionId) {
      console.log(`🔌 Client disconnected - Session: ${req.sessionId} (delaying cleanup)`);
      
      // Add a delay before cleanup to allow for reconnections during uploads
      setTimeout(async () => {
        // Check if the session is still being used or is actively processing
        const sessionData = activeSessions.get(req.sessionId);
        const isActive = s3AssetManager.isSessionActive(req.sessionId);
        
        if (sessionData && !isActive && Date.now() - sessionData.lastActivity.getTime() > 30000) { // 30 seconds
          console.log(`🧹 Cleaning up assets for abandoned session: ${req.sessionId}`);
          await cleanup(true).catch(console.error);
        } else if (isActive) {
          console.log(`⏳ Session ${req.sessionId} is active, skipping cleanup`);
        }
      }, 15000); // Wait 15 seconds before cleanup
    }
  });

  req.on('error', (error) => {
    console.error(`❌ Request error - Session: ${req.sessionId}`, error);
    cleanup(true).catch(console.error);
  });

  next();
};

/**
 * Express middleware to handle manual session cleanup
 */
const manualCleanup = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    await s3AssetManager.cleanupSession(sessionId);
    
    res.json({
      success: true,
      message: 'Session assets cleaned up successfully'
    });
  } catch (error) {
    console.error('Manual cleanup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup session assets'
    });
  }
};

/**
 * Periodic cleanup of inactive sessions
 */
const cleanupInactiveSessions = () => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const inactiveSessionIds = [];

  for (const [sessionId, sessionData] of activeSessions.entries()) {
    if (sessionData.lastActivity < tenMinutesAgo) {
      inactiveSessionIds.push(sessionId);
    }
  }

  // Cleanup inactive sessions
  inactiveSessionIds.forEach(async (sessionId) => {
    console.log(`🧹 Cleaning up inactive session: ${sessionId}`);
    await s3AssetManager.cleanupSession(sessionId);
    activeSessions.delete(sessionId);
  });

  if (inactiveSessionIds.length > 0) {
    console.log(`🧹 Cleaned up ${inactiveSessionIds.length} inactive sessions`);
  }
};

// Run cleanup every 5 minutes
setInterval(cleanupInactiveSessions, 5 * 60 * 1000);

/**
 * Graceful shutdown handler
 */
const gracefulShutdown = async () => {
  console.log('🔄 Graceful shutdown initiated - cleaning up all sessions');
  
  const cleanupPromises = Array.from(activeSessions.keys()).map(sessionId =>
    s3AssetManager.cleanupSession(sessionId)
  );

  await Promise.allSettled(cleanupPromises);
  console.log('✅ All sessions cleaned up');
};

// Handle process termination
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // nodemon restart

module.exports = {
  sessionTracker,
  assetCleanupMiddleware,
  manualCleanup,
  activeSessions
};
