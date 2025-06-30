const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { uploadProduct, deleteFromS3, handleS3Error } = require('../middleware/s3Upload');

// Get all products with enhanced filtering
router.get('/', async (req, res) => {
  try {
    const { search, category, size, color, gender, inStock } = req.query;
    let filter = {};

    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      filter.categories = category;
    }

    // Size filter
    if (size) {
      filter.sizes = size;
    }

    // Color filter
    if (color) {
      filter.colors = { $regex: new RegExp(color, 'i') };
    }

    // Gender filter
    if (gender) {
      filter.gender = gender;
    }

    // Stock filter
    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    } else if (inStock === 'false') {
      filter.stock = 0;
    }

    const products = await Product.find(filter)
      .populate('categories', 'name')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categories', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// Get low stock products (for admin alerts)
router.get('/admin/low-stock', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
      stock: { $gt: 0 }
    }).populate('categories', 'name');

    res.json(lowStockProducts);
  } catch (err) {
    console.error('Error fetching low stock products:', err);
    res.status(500).json({ message: 'Failed to fetch low stock products' });
  }
});

// Update product stock
router.patch('/:id/stock', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { stock, operation } = req.body; // operation: 'set', 'increase', 'decrease'
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let newStock = product.stock;
    
    switch (operation) {
      case 'set':
        newStock = Math.max(0, stock);
        break;
      case 'increase':
        newStock = product.stock + Math.abs(stock);
        break;
      case 'decrease':
        newStock = Math.max(0, product.stock - Math.abs(stock));
        break;
      default:
        return res.status(400).json({ message: 'Invalid operation' });
    }

    product.stock = newStock;
    product.inStock = newStock > 0;
    await product.save();

    res.json({ 
      message: 'Stock updated successfully', 
      product: product 
    });
  } catch (err) {
    console.error('Error updating stock:', err);
    res.status(500).json({ message: 'Failed to update stock' });
  }
});

// Upload color-specific image to S3
router.post('/:id/color-image', verifyToken, verifyAdmin, (req, res) => {
  uploadProduct.single('image')(req, res, async (err) => {
    if (err) {
      return handleS3Error(err, req, res);
    }

    try {
      const { color } = req.body;
      
      if (!color || !req.file) {
        return res.status(400).json({ message: 'Color and image are required' });
      }

      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const imageUrl = req.file.location; // S3 URL from multer-s3
      
      // Check if color image already exists and delete old one
      const existingColorImageIndex = product.colorImages.findIndex(
        img => img.color.toLowerCase() === color.toLowerCase()
      );

      if (existingColorImageIndex > -1) {
        // Delete old image from S3
        await deleteFromS3(product.colorImages[existingColorImageIndex].imageUrl);
        // Update existing color image
        product.colorImages[existingColorImageIndex].imageUrl = imageUrl;
      } else {
        // Add new color image
        product.colorImages.push({ color, imageUrl });
      }

      // Add color to colors array if not present
      if (!product.colors.includes(color)) {
        product.colors.push(color);
      }

      // Set default color if not set
      if (!product.defaultColor && product.colorImages.length === 1) {
        product.defaultColor = color;
      }

      await product.save();

      res.json({ 
        message: 'Color image uploaded successfully', 
        product: product 
      });
    } catch (err) {
      console.error('Error uploading color image:', err);
      res.status(500).json({ message: 'Failed to upload color image' });
    }
  });
});

// Delete color image
router.delete('/:id/color-image/:color', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const colorToDelete = req.params.color;
    const colorImageIndex = product.colorImages.findIndex(
      img => img.color.toLowerCase() === colorToDelete.toLowerCase()
    );

    if (colorImageIndex === -1) {
      return res.status(404).json({ message: 'Color image not found' });
    }

    // Delete from S3
    await deleteFromS3(product.colorImages[colorImageIndex].imageUrl);

    // Remove from arrays
    product.colorImages.splice(colorImageIndex, 1);
    product.colors = product.colors.filter(c => c.toLowerCase() !== colorToDelete.toLowerCase());

    // Update default color if needed
    if (product.defaultColor && product.defaultColor.toLowerCase() === colorToDelete.toLowerCase()) {
      product.defaultColor = product.colorImages.length > 0 ? product.colorImages[0].color : '';
    }

    await product.save();

    res.json({ 
      message: 'Color image deleted successfully', 
      product: product 
    });
  } catch (err) {
    console.error('Error deleting color image:', err);
    res.status(500).json({ message: 'Failed to delete color image' });
  }
});

// Set default color
router.patch('/:id/default-color', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { defaultColor } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify the color exists in the product
    const colorExists = product.colors.some(c => c.toLowerCase() === defaultColor.toLowerCase());
    if (!colorExists) {
      return res.status(400).json({ message: 'Color does not exist for this product' });
    }

    product.defaultColor = defaultColor;
    await product.save();

    res.json({ 
      message: 'Default color updated successfully', 
      product: product 
    });
  } catch (err) {
    console.error('Error updating default color:', err);
    res.status(500).json({ message: 'Failed to update default color' });
  }
});

// Create product (Admin only) - Enhanced with S3 upload
router.post('/', verifyToken, verifyAdmin, (req, res) => {
  uploadProduct.single('image')(req, res, async (err) => {
    if (err) {
      return handleS3Error(err, req, res);
    }

    try {
      const { title, description, price, sizes, colors, categories, stock, lowStockThreshold, gender, defaultColor } = req.body;

      // Validation
      if (!title || !description || !price || !req.file || !stock || !gender) {
        return res.status(400).json({ message: 'All required fields must be provided' });
      }

      // Parse arrays if they're strings
      const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
      const parsedColors = typeof colors === 'string' ? (colors ? JSON.parse(colors) : []) : (colors || []);
      const parsedCategories = typeof categories === 'string' ? JSON.parse(categories) : categories;

      // Validate required fields
      if (!parsedSizes || parsedSizes.length === 0) {
        return res.status(400).json({ message: 'At least one size is required' });
      }

      if (!['Men', 'Women', 'Unisex'].includes(gender)) {
        return res.status(400).json({ message: 'Gender must be Men, Women, or Unisex' });
      }

      const stockNum = parseInt(stock);
      if (isNaN(stockNum) || stockNum < 0) {
        return res.status(400).json({ message: 'Stock must be a non-negative number' });
      }

      const product = new Product({
        title,
        description,
        price: parseFloat(price),
        sizes: parsedSizes,
        colors: parsedColors,
        categories: parsedCategories,
        imageUrl: req.file.location, // S3 URL
        stock: stockNum,
        lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : 10,
        gender,
        defaultColor: defaultColor || (parsedColors.length > 0 ? parsedColors[0] : ''),
        inStock: stockNum > 0
      });

      await product.save();
      const populatedProduct = await Product.findById(product._id).populate('categories', 'name');

      res.status(201).json({ 
        message: 'Product created successfully',
        product: populatedProduct 
      });
    } catch (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ message: 'Failed to create product' });
    }
  });
});

// Update product (Admin only) - Enhanced with S3 upload
router.put('/:id', verifyToken, verifyAdmin, (req, res) => {
  uploadProduct.single('image')(req, res, async (err) => {
    if (err) {
      return handleS3Error(err, req, res);
    }

    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const { title, description, price, sizes, colors, categories, stock, lowStockThreshold, gender, defaultColor } = req.body;

      // Parse arrays if they're strings
      const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
      const parsedColors = typeof colors === 'string' ? (colors ? JSON.parse(colors) : []) : (colors || []);
      const parsedCategories = typeof categories === 'string' ? JSON.parse(categories) : categories;

      // Validate required fields
      if (parsedSizes && parsedSizes.length === 0) {
        return res.status(400).json({ message: 'At least one size is required' });
      }

      if (gender && !['Men', 'Women', 'Unisex'].includes(gender)) {
        return res.status(400).json({ message: 'Gender must be Men, Women, or Unisex' });
      }

      const stockNum = stock !== undefined ? parseInt(stock) : product.stock;
      if (isNaN(stockNum) || stockNum < 0) {
        return res.status(400).json({ message: 'Stock must be a non-negative number' });
      }

      // Update fields
      if (title) product.title = title;
      if (description) product.description = description;
      if (price) product.price = parseFloat(price);
      if (parsedSizes) product.sizes = parsedSizes;
      if (parsedColors) product.colors = parsedColors;
      if (parsedCategories) product.categories = parsedCategories;
      if (gender) product.gender = gender;
      if (defaultColor !== undefined) product.defaultColor = defaultColor;
      if (stock !== undefined) {
        product.stock = stockNum;
        product.inStock = stockNum > 0;
      }
      if (lowStockThreshold !== undefined) product.lowStockThreshold = parseInt(lowStockThreshold);

      // Handle image update
      if (req.file) {
        // Delete old image from S3
        await deleteFromS3(product.imageUrl);
        product.imageUrl = req.file.location; // New S3 URL
      }

      await product.save();
      const populatedProduct = await Product.findById(product._id).populate('categories', 'name');

      res.json({ 
        message: 'Product updated successfully',
        product: populatedProduct 
      });
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ message: 'Failed to update product' });
    }
  });
});

// Delete product (Admin only) - Enhanced with S3 cleanup
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete all images from S3
    await deleteFromS3(product.imageUrl);
    if (product.heroImage) {
      await deleteFromS3(product.heroImage);
    }
    
    // Delete color images
    for (const colorImage of product.colorImages) {
      await deleteFromS3(colorImage.imageUrl);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;