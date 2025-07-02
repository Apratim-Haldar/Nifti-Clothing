const express = require('express');
const router = express.Router();
const Advertisement = require('../models/Advertisement');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { uploadHero, handleS3Error, deleteFromS3 } = require('../middleware/s3Upload');

// Upload advertisement image
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

// CREATE advertisement
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const advertisement = new Advertisement(req.body);
    await advertisement.save();
    res.status(201).json({ message: 'Advertisement created successfully', advertisement });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create advertisement' });
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