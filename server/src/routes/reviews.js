const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Admin: Get ALL reviews with product details
router.get('/admin/reviews', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { search, category, rating } = req.query;
    let pipeline = [
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.categories',
          foreignField: '_id',
          as: 'product.categoryDetails'
        }
      }
    ];

    // Add filters
    let matchConditions = {};

    if (search) {
      matchConditions.$or = [
        { 'product.title': { $regex: search, $options: 'i' } },
        { 'comment': { $regex: search, $options: 'i' } },
        { 'name': { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      matchConditions['product.categories'] = { $in: [category] };
    }

    if (rating) {
      matchConditions.rating = parseInt(rating);
    }

    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    pipeline.push({ $sort: { createdAt: -1 } });

    const reviews = await Review.aggregate(pipeline);
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching admin reviews:', err);
    res.status(500).json({ message: 'Failed to fetch all reviews' });
  }
});

// Get product details for review
router.get('/product/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .populate('categories', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product details:', err);
    res.status(500).json({ message: 'Failed to fetch product details' });
  }
});

// Submit a review
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Get the user's name from the database
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ 
      productId: productId, 
      userId: req.userId 
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const newReview = new Review({
      productId,
      userId: req.userId,
      name: user.name,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error('Error submitting review:', err);
    res.status(500).json({ message: 'Failed to submit review' });
  }
});

// Get reviews for product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// Update review
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check permissions: author can edit their own review, admin can edit any review
    const isAuthor = review.userId?.toString() === req.userId;
    const isAdmin = req.isAdmin === true;

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ 
        message: 'Forbidden: You can only edit your own reviews' 
      });
    }

    // Update the review
    review.rating = rating;
    review.comment = comment;
    review.updatedAt = new Date();

    await review.save();
    
    res.json({ 
      message: 'Review updated successfully',
      review: review 
    });
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).json({ message: 'Failed to update review' });
  }
});

// Delete a review
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check permissions: author can delete their own review, admin can delete any review
    const isAuthor = review.userId?.toString() === req.userId;
    const isAdmin = req.isAdmin === true;

    console.log('Delete Review Debug:', {
      reviewUserId: review.userId?.toString(),
      currentUserId: req.userId,
      isAdmin: req.isAdmin,
      isAuthor,
      canDelete: isAuthor || isAdmin
    });

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ 
        message: 'Forbidden: You can only delete your own reviews' 
      });
    }

    await review.deleteOne();
    
    res.json({ 
      message: 'Review deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ message: 'Failed to delete review' });
  }
});

module.exports = router;
