import { useState, useEffect } from 'react';
import axios from 'axios';

interface OverviewTabProps {
  setMessage: (message: string) => void;
  setError: (error: string) => void;
}

interface Stats {
  totalProducts: number;
  totalCategories: number;
  totalReviews: number;
  heroProducts: number;
  averageRating: number;
  recentReviews: any[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ setMessage, setError }) => {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    totalReviews: 0,
    heroProducts: 0,
    averageRating: 0,
    recentReviews: []
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, reviewsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/categories`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/reviews/admin/reviews`, { withCredentials: true })
      ]);

      const products = productsRes.data;
      const categories = categoriesRes.data;
      const reviews = reviewsRes.data;

      const heroProducts = products.filter((p: any) => p.isHero).length;
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length 
        : 0;

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalReviews: reviews.length,
        heroProducts,
        averageRating: Math.round(averageRating * 10) / 10,
        recentReviews: reviews.slice(0, 5)
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p>Loading dashboard statistics...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 text-white rounded-full mr-4">
              👕
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Products</p>
              <p className="text-2xl font-bold text-blue-800">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 text-white rounded-full mr-4">
              📁
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Categories</p>
              <p className="text-2xl font-bold text-green-800">{stats.totalCategories}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500 text-white rounded-full mr-4">
              ⭐
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Total Reviews</p>
              <p className="text-2xl font-bold text-yellow-800">{stats.totalReviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500 text-white rounded-full mr-4">
              🌟
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Avg Rating</p>
              <p className="text-2xl font-bold text-purple-800">{stats.averageRating}/5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setMessage('Feature coming soon!')}
              className="w-full text-left p-3 bg-white rounded border hover:bg-gray-50 transition-colors"
            >
              📊 Generate Sales Report
            </button>
            <button 
              onClick={() => setMessage('Feature coming soon!')}
              className="w-full text-left p-3 bg-white rounded border hover:bg-gray-50 transition-colors"
            >
              📧 Send Newsletter
            </button>
            <button 
              onClick={fetchStats}
              className="w-full text-left p-3 bg-white rounded border hover:bg-gray-50 transition-colors"
            >
              🔄 Refresh Statistics
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {stats.recentReviews.length > 0 ? (
              stats.recentReviews.map((review: any) => (
                <div key={review._id} className="bg-white p-3 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{review.name}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;