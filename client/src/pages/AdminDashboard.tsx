import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CategoriesTab from '../components/admin/CategoriesTab';
import ProductsTab from '../components/admin/ProductsTab';
import ReviewsTab from '../components/admin/ReviewsTab';
import OverviewTab from '../components/admin/OverviewTab';
import AdvertisementTab from '../components/admin/AdvertisementTab';
import OrdersTab from '../components/admin/OrdersTab';

// Define interfaces
interface User {
  name: string;
  email: string;
  isAdmin?: boolean;
}

type TabType = 'overview' | 'orders' | 'categories' | 'products' | 'reviews' | 'advertisements';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (user && !(user as User).isAdmin) {
      window.location.href = '/';
      return;
    }
  }, [user]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'categories', label: 'Categories', icon: '📁' },
    { id: 'products', label: 'Products', icon: '👕' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'advertisements', label: 'Advertisements', icon: '📢' },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab setMessage={setMessage} setError={setError} />;
      case 'orders':
        return <OrdersTab />;
      case 'categories':
        return <CategoriesTab  />;
      case 'products':
        return <ProductsTab />;
      case 'reviews':
        return <ReviewsTab setMessage={setMessage} setError={setError} />;
      case 'advertisements':
        return <AdvertisementTab />;
      default:
        return <OverviewTab setMessage={setMessage} setError={setError} />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your store's content and monitor performance</p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <div className="flex items-center">
              <span className="mr-2">✅</span>
              {message}
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center">
              <span className="mr-2">❌</span>
              {error}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
