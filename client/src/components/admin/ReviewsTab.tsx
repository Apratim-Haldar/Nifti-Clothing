import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useModal } from '../../context/ModalContext';

interface Review {
  _id: string;
  productId: string;
  userId?: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Product {
  _id: string;
  title: string;
  categories: string[];
}

interface Category {
  _id: string;
  name: string;
}

interface ReviewsTabProps {
  setMessage: (message: string) => void;
  setError: (error: string) => void;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ setMessage, setError }) => {
  const { showConfirm } = useModal();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editedReview, setEditedReview] = useState({ rating: 5, comment: '' });
  
  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<string>('');
  const [productFilter, setProductFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchReviews();
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Review[]>(`${import.meta.env.VITE_API_BASE_URL}/reviews/admin/reviews`, {
        withCredentials: true
      });
      setReviews(response.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>(`${import.meta.env.VITE_API_BASE_URL}/products`);
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>(`${import.meta.env.VITE_API_BASE_URL}/categories`);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleUpdateReview = async () => {
    if (!editingReview) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/reviews/${editingReview._id}`,
        editedReview,
        { withCredentials: true }
      );
      
      setReviews(reviews.map(r => 
        r._id === editingReview._id 
          ? { ...r, rating: editedReview.rating, comment: editedReview.comment }
          : r
      ));
      
      setEditingReview(null);
      setMessage('✅ Review updated successfully!');
    } catch (err) {
      console.error('Error updating review:', err);
      setError('Failed to update review');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const confirmed = await showConfirm(
      'Delete Review',
      'Are you sure you want to delete this review?',
      'Delete',
      'Cancel'
    );
    
    if (!confirmed) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/reviews/${reviewId}`, {
        withCredentials: true
      });
      setReviews(reviews.filter(r => r._id !== reviewId));
      setMessage('✅ Review deleted successfully!');
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review');
    }
  };

  const getProductTitle = (productId: string) => {
    const product = products.find(p => p._id === productId);
    return product ? product.title : 'Unknown Product';
  };

  const getProductCategories = (productId: string) => {
    const product = products.find(p => p._id === productId);
    if (!product) return [];
    return product.categories.map(catId => {
      const category = categories.find(c => c._id === catId);
      return category ? category.name : 'Unknown';
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
  };

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter(review => {
      const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           getProductTitle(review.productId).toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRating = !ratingFilter || review.rating.toString() === ratingFilter;
      const matchesProduct = !productFilter || review.productId === productFilter;
      
      const productCategories = getProductCategories(review.productId);
      const matchesCategory = !categoryFilter || productCategories.some(cat => 
        categories.find(c => c.name === cat)?._id === categoryFilter
      );
      
      return matchesSearch && matchesRating && matchesProduct && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest-rating':
          return b.rating - a.rating;
        case 'lowest-rating':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  // Group reviews by category
  const reviewsByCategory = filteredAndSortedReviews.reduce((acc, review) => {
    const productCategories = getProductCategories(review.productId);
    productCategories.forEach(category => {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(review);
    });
    
    if (productCategories.length === 0) {
      if (!acc['Uncategorized']) {
        acc['Uncategorized'] = [];
      }
      acc['Uncategorized'].push(review);
    }
    
    return acc;
  }, {} as Record<string, Review[]>);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Reviews</h2>
        <div className="text-sm text-gray-500">
          {reviews.length} total reviews
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-4">Search & Filter Reviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reviews, users, products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="">All Products</option>
            {products.map(product => (
              <option key={product._id} value={product._id}>{product.title}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest-rating">Highest Rating</option>
            <option value="lowest-rating">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews by Category */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading reviews...</p>
        </div>
      ) : Object.keys(reviewsByCategory).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(reviewsByCategory).map(([category, categoryReviews]) => (
            <div key={category} className="bg-white border border-gray-200 rounded-lg">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center">
                  <span className="mr-2">📁</span>
                  {category}
                  <span className="ml-2 text-sm text-gray-500">({categoryReviews.length} reviews)</span>
                </h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {categoryReviews.map((review) => (
                  <div key={review._id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{review.name}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-sm text-gray-500">
                              {getProductTitle(review.productId)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>ID: {review._id}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setEditingReview(review);
                            setEditedReview({ rating: review.rating, comment: review.comment });
                          }}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
                          title="Edit review"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors"
                          title="Delete review"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
          <p className="text-gray-500">
            {searchTerm || ratingFilter || productFilter || categoryFilter 
              ? 'Try adjusting your filters' 
              : 'No reviews have been submitted yet'
            }
          </p>
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Edit Review</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <select
                    value={editedReview.rating}
                    onChange={(e) => setEditedReview({ ...editedReview, rating: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    {[5, 4, 3, 2, 1].map(n => (
                      <option key={n} value={n}>{n} Star{n !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                  <textarea
                    value={editedReview.comment}
                    onChange={(e) => setEditedReview({ ...editedReview, comment: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Edit the review comment..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                <button 
                  onClick={() => setEditingReview(null)} 
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateReview}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Update Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;