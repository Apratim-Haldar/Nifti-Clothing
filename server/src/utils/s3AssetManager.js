// S3 Asset Management System
// Handles temporary uploads and cleanup for product/advertisement creation

const { s3, deleteFromS3, getS3Url, fileExistsInS3 } = require('../middleware/s3Upload');
const { S3Client, CopyObjectCommand, DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');

class S3AssetManager {
  constructor() {
    this.tempPrefix = 'temp-uploads/';
    this.finalPrefix = {
      products: 'products/',
      advertisements: 'hero/',
      categories: 'categories/'
    };
    this.tempAssetRegistry = new Map(); // Track temporary assets
    this.activeOperations = new Set(); // Track active sessions
  }

  /**
   * Move uploaded file from temp to final location
   * @param {string} tempKey - Temporary S3 key
   * @param {string} type - Asset type: 'products', 'advertisements', 'categories'
   * @param {string} newFilename - New filename (optional)
   * @returns {Promise<string>} Final S3 URL
   */
  async moveToFinal(tempKey, type, newFilename = null) {
    try {
      const bucketName = process.env.AWS_S3_BUCKET;
      
      // First check if the temp file exists
      const headCommand = new HeadObjectCommand({
        Bucket: bucketName,
        Key: tempKey
      });

      try {
        await s3.send(headCommand);
      } catch (headError) {
        if (headError.name === 'NoSuchKey' || headError.name === 'NotFound') {
          console.warn(`⚠️ Temp asset not found (may have been cleaned up): ${tempKey}`);
          // Return a default URL or handle gracefully
          const originalFilename = tempKey.split('/').pop();
          const finalFilename = newFilename || originalFilename;
          const finalKey = `${this.finalPrefix[type]}${finalFilename}`;
          return getS3Url(finalKey);
        }
        throw headError;
      }
      
      // Extract filename from temp key
      const originalFilename = tempKey.split('/').pop();
      const finalFilename = newFilename || originalFilename;
      const finalKey = `${this.finalPrefix[type]}${finalFilename}`;

      // Copy object to final location
      const copyCommand = new CopyObjectCommand({
        Bucket: bucketName,
        CopySource: `${bucketName}/${tempKey}`,
        Key: finalKey,
        ACL: 'public-read'
      });

      await s3.send(copyCommand);

      // Delete temporary file
      await this.deleteTemp(tempKey);

      return getS3Url(finalKey);
    } catch (error) {
      console.error('Error moving asset to final location:', error);
      throw new Error('Failed to finalize asset upload');
    }
  }

  /**
   * Register temporary asset for tracking
   * @param {string} sessionId - Unique session identifier
   * @param {string} tempKey - Temporary S3 key
   * @param {string} type - Asset type
   */
  registerTempAsset(sessionId, tempKey, type) {
    if (!this.tempAssetRegistry.has(sessionId)) {
      this.tempAssetRegistry.set(sessionId, []);
    }
    
    this.tempAssetRegistry.get(sessionId).push({
      key: tempKey,
      type,
      uploadedAt: new Date(),
      url: getS3Url(tempKey)
    });

    console.log(`📝 Registered temp asset: ${tempKey} for session ${sessionId}`);
  }

  /**
   * Get temporary assets for a session
   * @param {string} sessionId - Session identifier
   * @returns {Array} Array of temporary assets
   */
  getTempAssets(sessionId) {
    return this.tempAssetRegistry.get(sessionId) || [];
  }

  /**
   * Cleanup all temporary assets for a session
   * @param {string} sessionId - Session identifier
   * @returns {Promise<void>}
   */
  async cleanupSession(sessionId) {
    const assets = this.tempAssetRegistry.get(sessionId);
    if (!assets || assets.length === 0) {
      return;
    }

    console.log(`🧹 Cleaning up ${assets.length} temp assets for session ${sessionId}`);

    const cleanupPromises = assets.map(asset => this.deleteTemp(asset.key));
    await Promise.allSettled(cleanupPromises);

    this.tempAssetRegistry.delete(sessionId);
    console.log(`✅ Session ${sessionId} cleanup completed`);
  }

  /**
   * Delete temporary asset
   * @param {string} tempKey - Temporary S3 key
   * @returns {Promise<boolean>}
   */
  async deleteTemp(tempKey) {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: tempKey
      });

      await s3.send(deleteCommand);
      console.log(`🗑️ Deleted temp asset: ${tempKey}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to delete temp asset ${tempKey}:`, error);
      return false;
    }
  }

  /**
   * Cleanup old temporary assets (older than 1 hour)
   * This should be called periodically
   * @returns {Promise<void>}
   */
  async cleanupExpiredAssets() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const sessionsToCleanup = [];

    for (const [sessionId, assets] of this.tempAssetRegistry.entries()) {
      const hasExpiredAssets = assets.some(asset => asset.uploadedAt < oneHourAgo);
      if (hasExpiredAssets) {
        sessionsToCleanup.push(sessionId);
      }
    }

    for (const sessionId of sessionsToCleanup) {
      await this.cleanupSession(sessionId);
    }

    if (sessionsToCleanup.length > 0) {
      console.log(`🧹 Cleaned up ${sessionsToCleanup.length} expired sessions`);
    }
  }

  /**
   * Validate if URL is a temporary asset
   * @param {string} url - S3 URL to check
   * @returns {boolean}
   */
  isTempAsset(url) {
    return url.includes(this.tempPrefix);
  }

  /**
   * Extract S3 key from URL
   * @param {string} url - S3 URL
   * @returns {string|null} S3 key or null if invalid
   */
  extractKeyFromUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(1); // Remove leading slash
    } catch (error) {
      console.error('Invalid S3 URL:', url);
      return null;
    }
  }

  /**
   * Generate unique session ID
   * @returns {string} Unique session identifier
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Mark a session as actively processing to prevent cleanup
   * @param {string} sessionId - Session ID to mark as active
   */
  markSessionActive(sessionId) {
    this.activeOperations.add(sessionId);
    console.log(`🔒 Marking session ${sessionId} as active`);
  }

  /**
   * Mark a session as no longer actively processing
   * @param {string} sessionId - Session ID to mark as inactive
   */
  markSessionInactive(sessionId) {
    this.activeOperations.delete(sessionId);
    console.log(`🔓 Marking session ${sessionId} as inactive`);
  }

  /**
   * Check if a session is currently active
   * @param {string} sessionId - Session ID to check
   * @returns {boolean} True if session is active
   */
  isSessionActive(sessionId) {
    return this.activeOperations.has(sessionId);
  }
}

// Create singleton instance
const s3AssetManager = new S3AssetManager();

// Cleanup expired assets every 30 minutes
setInterval(() => {
  s3AssetManager.cleanupExpiredAssets().catch(console.error);
}, 30 * 60 * 1000);

module.exports = s3AssetManager;
