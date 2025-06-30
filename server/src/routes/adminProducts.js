// routes/adminProducts.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { uploadProduct, uploadHero, handleS3Error, deleteFromS3 } = require('../middleware/s3Upload');

// S3 IMAGE UPLOAD ROUTES

// Upload product image
router.post('/upload/product-image', verifyToken, verifyAdmin, (req, res) => {
  uploadProduct.single('image')(req, res, (err) => {
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
      message: 'Product image uploaded successfully',
      imageUrl: req.file.location,
      filename: req.file.key
    });
  });
});

// Upload single color image
router.post('/upload/color-image', verifyToken, verifyAdmin, (req, res) => {
  uploadProduct.single('image')(req, res, (err) => {
    if (err) {
      return handleS3Error(err, req, res);
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }

    const { color } = req.body;
    if (!color) {
      return res.status(400).json({ 
        success: false,
        message: 'Color is required' 
      });
    }

    res.json({
      success: true,
      message: 'Color image uploaded successfully',
      imageUrl: req.file.location,
      filename: req.file.key,
      color: color
    });
  });
});

// Delete image from S3
router.delete('/upload/delete-image', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ 
        success: false,
        message: 'Image URL is required' 
      });
    }

    const deleted = await deleteFromS3(imageUrl);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete image'
      });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

// ADD product
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      price, 
      sizes, 
      colors, 
      colorImages,
      imageUrl, 
      categories, 
      isHero, 
      heroImage, 
      heroTagline,
      stock,
      gender,
      lowStockThreshold,
      defaultColor
    } = req.body;

    // Validate required fields
    if (!title || !description || !price || !imageUrl || !gender) {
      return res.status(400).json({ 
        message: 'Missing required fields: title, description, price, imageUrl, and gender are required' 
      });
    }

    // Validate gender enum
    if (!['Men', 'Women', 'Unisex'].includes(gender)) {
      return res.status(400).json({ 
        message: 'Gender must be one of: Men, Women, Unisex' 
      });
    }

    // Validate sizes - at least one required
    if (!sizes || sizes.length === 0) {
      return res.status(400).json({ 
        message: 'At least one size is required' 
      });
    }

    // Validate categories if provided
    if (categories && categories.length > 0) {
      const validCategories = await Category.find({ _id: { $in: categories } });
      if (validCategories.length !== categories.length) {
        return res.status(400).json({ message: 'Invalid categories provided' });
      }
    }

    // Validate stock
    const stockValue = stock !== undefined ? stock : 0;
    if (stockValue < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    // Set default color if colors exist
    let finalDefaultColor = defaultColor;
    if (colors && colors.length > 0 && !finalDefaultColor) {
      finalDefaultColor = colors[0];
    }

    const product = new Product({
      title,
      description,
      price,
      sizes,
      colors: colors || [],
      colorImages: colorImages || [],
      defaultColor: finalDefaultColor,
      imageUrl,
      categories: categories || [],
      isHero: isHero || false,
      heroImage: heroImage || null,
      heroTagline: heroTagline || null,
      stock: stockValue,
      gender,
      lowStockThreshold: lowStockThreshold || 10,
      inStock: stockValue > 0
    });

    await product.save();
    
    // Populate categories for response
    await product.populate('categories');
    
    res.status(201).json({ 
      message: 'Product created successfully', 
      product 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      message: 'Failed to create product', 
      error: error.message 
    });
  }
});

// UPDATE product
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      price, 
      sizes, 
      colors, 
      colorImages,
      imageUrl, 
      categories, 
      isHero, 
      heroImage, 
      heroTagline,
      stock,
      gender,
      lowStockThreshold,
      defaultColor,
      oldImageUrl,
      oldColorImages
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete old main image if a new one is provided
    if (imageUrl && oldImageUrl && imageUrl !== oldImageUrl) {
      await deleteFromS3(oldImageUrl);
    }

    // Delete old color images that are no longer used
    if (oldColorImages && Array.isArray(oldColorImages)) {
      const newColorImageUrls = (colorImages || []).map(img => img.imageUrl);
      for (const oldImg of oldColorImages) {
        if (!newColorImageUrls.includes(oldImg.imageUrl)) {
          await deleteFromS3(oldImg.imageUrl);
        }
      }
    }

    // Validate required fields
    if (title !== undefined && !title) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }

    if (gender && !['Men', 'Women', 'Unisex'].includes(gender)) {
      return res.status(400).json({ 
        message: 'Gender must be one of: Men, Women, Unisex' 
      });
    }

    // Validate sizes
    if (sizes && sizes.length === 0) {
      return res.status(400).json({ 
        message: 'At least one size is required' 
      });
    }

    // Validate stock
    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    // Set default color if colors exist
    let finalDefaultColor = defaultColor;
    if (colors && colors.length > 0 && !finalDefaultColor) {
      finalDefaultColor = colors[0];
    }

    // Update fields
    const updateData = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(sizes !== undefined && { sizes }),
      ...(colors !== undefined && { colors }),
      ...(colorImages !== undefined && { colorImages }),
      ...(finalDefaultColor !== undefined && { defaultColor: finalDefaultColor }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(categories !== undefined && { categories }),
      ...(isHero !== undefined && { isHero }),
      ...(heroImage !== undefined && { heroImage }),
      ...(heroTagline !== undefined && { heroTagline }),
      ...(stock !== undefined && { 
        stock, 
        inStock: stock > 0 
      }),
      ...(gender !== undefined && { gender }),
      ...(lowStockThreshold !== undefined && { lowStockThreshold })
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('categories');

    res.json({ 
      message: 'Product updated successfully', 
      product: updatedProduct 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ 
      message: 'Failed to update product', 
      error: error.message 
    });
  }
});

// DELETE product
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete main image from S3
    if (product.imageUrl) {
      await deleteFromS3(product.imageUrl);
    }

    // Delete hero image from S3
    if (product.heroImage) {
      await deleteFromS3(product.heroImage);
    }

    // Delete all color images from S3
    if (product.colorImages && product.colorImages.length > 0) {
      for (const colorImg of product.colorImages) {
        await deleteFromS3(colorImg.imageUrl);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      message: 'Failed to delete product', 
      error: error.message 
    });
  }
});

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('categories', 'name')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      message: 'Failed to fetch products', 
      error: error.message 
    });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categories', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      message: 'Failed to fetch product', 
      error: error.message 
    });
  }
});

// UPDATE stock for single product
router.patch('/:id/stock', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { stock, operation } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let newStock;
    switch (operation) {
      case 'add':
        newStock = product.stock + stock;
        break;
      case 'subtract':
        newStock = Math.max(0, product.stock - stock);
        break;
      case 'set':
        newStock = stock;
        break;
      default:
        return res.status(400).json({ message: 'Invalid operation' });
    }

    if (newStock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    product.stock = newStock;
    product.inStock = newStock > 0;
    await product.save();

    res.json({ 
      message: 'Stock updated successfully', 
      product: await product.populate('categories', 'name')
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ 
      message: 'Failed to update stock', 
      error: error.message 
    });
  }
});

// BULK UPDATE stock for multiple products
router.put('/bulk/stock', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { updates } = req.body;
    
    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ message: 'Updates array is required' });
    }

    const updatePromises = updates.map(async ({ productId, stock }) => {
      if (stock < 0) {
        throw new Error(`Stock cannot be negative for product ${productId}`);
      }
      
      return Product.findByIdAndUpdate(
        productId,
        { 
          stock,
          inStock: stock > 0
        },
        { new: true, runValidators: true }
      );
    });

    await Promise.all(updatePromises);
    res.json({ message: 'Stock updated successfully for all products' });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ 
      message: 'Failed to update stock', 
      error: error.message 
    });
  }
});

// GET low stock products
router.get('/alerts/low-stock', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const products = await Product.find({
      $expr: {
        $and: [
          { $gt: ['$stock', 0] },
          { $lte: ['$stock', '$lowStockThreshold'] }
        ]
      }
    }).populate('categories', 'name').sort({ stock: 1 });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ 
      message: 'Failed to fetch low stock products', 
      error: error.message 
    });
  }
});

module.exports = router;
