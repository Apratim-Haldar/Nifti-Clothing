const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { uploadCategory, deleteFromS3, handleS3Error } = require('../middleware/s3Upload');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// Get single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).json({ message: 'Failed to fetch category' });
  }
});

// Create category (Admin only) - With S3 upload
router.post('/', verifyToken, verifyAdmin, (req, res) => {
  uploadCategory.single('image')(req, res, async (err) => {
    if (err) {
      return handleS3Error(err, req, res);
    }

    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
      }

      // Check if category already exists
      const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists' });
      }

      const category = new Category({
        name,
        description,
        imageUrl: req.file ? req.file.location : undefined // S3 URL if image provided
      });

      await category.save();

      res.status(201).json({ 
        message: 'Category created successfully',
        category 
      });
    } catch (err) {
      console.error('Error creating category:', err);
      res.status(500).json({ message: 'Failed to create category' });
    }
  });
});

// Update category (Admin only) - With S3 upload
router.put('/:id', verifyToken, verifyAdmin, (req, res) => {
  uploadCategory.single('image')(req, res, async (err) => {
    if (err) {
      return handleS3Error(err, req, res);
    }

    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      const { name, description } = req.body;

      // Check if name is being changed and doesn't conflict
      if (name && name !== category.name) {
        const existingCategory = await Category.findOne({ 
          name: { $regex: new RegExp(`^${name}$`, 'i') },
          _id: { $ne: req.params.id }
        });
        if (existingCategory) {
          return res.status(400).json({ message: 'Category name already exists' });
        }
        category.name = name;
      }

      if (description !== undefined) category.description = description;

      // Handle image update
      if (req.file) {
        // Delete old image from S3 if it exists
        if (category.imageUrl) {
          await deleteFromS3(category.imageUrl);
        }
        category.imageUrl = req.file.location; // New S3 URL
      }

      await category.save();

      res.json({ 
        message: 'Category updated successfully',
        category 
      });
    } catch (err) {
      console.error('Error updating category:', err);
      res.status(500).json({ message: 'Failed to update category' });
    }
  });
});

// Delete category (Admin only) - With S3 cleanup
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete image from S3 if it exists
    if (category.imageUrl) {
      await deleteFromS3(category.imageUrl);
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: 'Failed to delete category' });
  }
});

module.exports = router;
