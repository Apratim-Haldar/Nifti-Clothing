const express = require('express');
const router = express.Router();
const Advertisement = require('../models/Advertisement');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { uploadHero, handleS3Error, deleteFromS3, uploadHeroTemp } = require('../middleware/s3Upload');
const { sessionTracker, assetCleanupMiddleware } = require('../middleware/connectionMonitor');
const s3AssetManager = require('../utils/s3AssetManager');

// Apply session tracking to all routes
router.use(sessionTracker);
router.use(assetCleanupMiddleware);

// Upload temporary advertisement image
router.post('/upload/temp', verifyToken, verifyAdmin, (req, res) => {
  uploadHeroTemp.single('image')(req, res, (err) => {
    if (err) {
      return handleS3Error(err, req, res);
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }

    // Register temporary asset
    s3AssetManager.registerTempAsset(req.sessionId, req.file.key, 'advertisements');

    res.json({
      success: true,
      message: 'Advertisement image uploaded temporarily',
      imageUrl: req.file.location,
      filename: req.file.key,
      sessionId: req.sessionId
    });
  });
});

// Upload advertisement image (legacy direct upload)
router.post('/upload', verifyToken, verifyAdmin, (req, res) => {
  uploadHero.single('image')(req, res, (err) => {
    if (err) {
      return handleS3Error(err, req, res);
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }

    res.json({
      success: true,
      message: 'Advertisement image uploaded successfully',
      imageUrl: req.file.location,
      filename: req.file.key
    });
  });
});

// GET all advertisements
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const advertisements = await Advertisement.find()
      .sort({ priority: -1, createdAt: -1 });
    res.json(advertisements);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch advertisements' });
  }
});

// GET active advertisements for public display
router.get('/active', async (req, res) => {
  try {
    const advertisements = await Advertisement.find({ isActive: true })
      .sort({ priority: -1, createdAt: -1 });
    res.json(advertisements);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch advertisements' });
  }
});

// CREATE advertisement with temporary asset handling
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { sessionId, imageUrl, ...advertisementData } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ 
        message: 'Image URL is required' 
      });
    }

    // Handle temporary asset - move to final location
    let finalImageUrl = imageUrl;
    const targetSessionId = sessionId || req.sessionId;

    try {
      // Move image if it's temporary
      if (s3AssetManager.isTempAsset(imageUrl)) {
        const tempKey = s3AssetManager.extractKeyFromUrl(imageUrl);
        if (tempKey) {
          finalImageUrl = await s3AssetManager.moveToFinal(tempKey, 'advertisements');
        }
      }
    } catch (assetError) {
      console.error('Error moving temporary asset:', assetError);
      // Clean up any temporary assets on error
      if (targetSessionId) {
        await s3AssetManager.cleanupSession(targetSessionId);
      }
      return res.status(500).json({ 
        message: 'Failed to process uploaded image', 
        error: assetError.message 
      });
    }

    const advertisement = new Advertisement({
      ...advertisementData,
      imageUrl: finalImageUrl
    });
    
    await advertisement.save();
    
    // Clean up any remaining temporary assets for this session
    if (targetSessionId) {
      await s3AssetManager.cleanupSession(targetSessionId);
    }
    
    res.status(201).json({ 
      message: 'Advertisement created successfully', 
      advertisement 
    });
  } catch (error) {
    console.error('Error creating advertisement:', error);
    
    // Clean up temporary assets on error
    const targetSessionId = req.body.sessionId || req.sessionId;
    if (targetSessionId) {
      await s3AssetManager.cleanupSession(targetSessionId);
    }
    
    res.status(500).json({ 
      message: 'Failed to create advertisement',
      error: error.message 
    });
  }
});

// UPDATE advertisement
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const advertisement = await Advertisement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!advertisement) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }
    res.json({ message: 'Advertisement updated successfully', advertisement });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update advertisement' });
  }
});

// TOGGLE active status
router.patch('/:id/toggle', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    const advertisement = await Advertisement.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );
    if (!advertisement) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }
    res.json({ message: 'Advertisement status updated', advertisement });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update advertisement status' });
  }
});

// DELETE advertisement
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id);
    if (!advertisement) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    // Delete image from S3
    if (advertisement.imageUrl) {
      await deleteFromS3(advertisement.imageUrl);
    }

    await Advertisement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Advertisement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete advertisement' });
  }
});

module.exports = router;