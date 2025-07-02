import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';

interface Advertisement {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  targetPage: string;
  shopFilters?: {
    category?: string;
    gender?: string;
    priceRange?: string;
    sortBy?: string;
  };
  isActive: boolean;
  priority: number;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
}

interface FormData {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  targetPage: string;
  shopFilters: {
    category: string;
    gender: string;
    priceRange: string;
    sortBy: string;
  };
  isActive: boolean;
  priority: number;
}

interface PageOption {
  value: string;
  label: string;
  route: string;
  description: string;
}

const AdvertisementTab: React.FC = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToast();

  // Predefined page options
  const pageOptions: PageOption[] = [
    {
      value: 'home',
      label: 'Home Page',
      route: '/',
      description: 'Landing page with hero section'
    },
    {
      value: 'shop',
      label: 'Shop (with filters)',
      route: '/products',
      description: 'Product listing with custom filters'
    },
    {
      value: 'shop-all',
      label: 'Shop (all products)',
      route: '/products',
      description: 'All products without filters'
    },
    {
      value: 'cart',
      label: 'Shopping Cart',
      route: '/cart',
      description: 'User\'s shopping cart'
    },
    {
      value: 'register',
      label: 'Sign Up',
      route: '/register',
      description: 'User registration page'
    },
    {
      value: 'login',
      label: 'Sign In',
      route: '/login',
      description: 'User login page'
    },
    {
      value: 'referrals',
      label: 'Referral Program',
      route: '/referrals',
      description: 'Affiliate/referral program'
    },
    {
      value: 'custom',
      label: 'Custom URL',
      route: '',
      description: 'Enter a custom URL manually'
    }
  ];

  const priceRangeOptions = [
    { value: '', label: 'Any Price' },
    { value: '0-500', label: 'Under ₹500' },
    { value: '500-1000', label: '₹500 - ₹1000' },
    { value: '1000-2000', label: '₹1000 - ₹2000' },
    { value: '2000-5000', label: '₹2000 - ₹5000' },
    { value: '5000+', label: 'Above ₹5000' }
  ];

  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    imageUrl: '',
    buttonText: 'Shop Now',
    buttonLink: '',
    targetPage: 'shop',
    shopFilters: {
      category: '',
      gender: '',
      priceRange: '',
      sortBy: ''
    },
    isActive: true,
    priority: 1
  });

  useEffect(() => {
    fetchAdvertisements();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Auto-generate button link based on target page and filters
    generateButtonLink();
  }, [formData.targetPage, formData.shopFilters]);

  const fetchAdvertisements = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/advertisements`, {
        withCredentials: true
      });
      setAdvertisements(response.data);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      addToast('Error fetching advertisements', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateButtonLink = () => {
    const selectedPage = pageOptions.find(page => page.value === formData.targetPage);
    if (!selectedPage) return;

    let link = selectedPage.route;

    // Generate query parameters for shop page with filters
    if (formData.targetPage === 'shop') {
      const params = new URLSearchParams();
      
      if (formData.shopFilters.category) {
        params.append('category', formData.shopFilters.category);
      }
      if (formData.shopFilters.gender) {
        params.append('gender', formData.shopFilters.gender);
      }
      if (formData.shopFilters.priceRange) {
        params.append('priceRange', formData.shopFilters.priceRange);
      }
      if (formData.shopFilters.sortBy) {
        params.append('sort', formData.shopFilters.sortBy);
      }

      if (params.toString()) {
        link += '?' + params.toString();
      }
    }

    setFormData(prev => ({ ...prev, buttonLink: link }));
  };

  const handleTargetPageChange = (targetPage: string) => {
    const selectedPage = pageOptions.find(page => page.value === targetPage);
    if (!selectedPage) return;

    setFormData(prev => ({
      ...prev,
      targetPage,
      buttonLink: targetPage === 'custom' ? '' : selectedPage.route,
      // Reset shop filters when changing away from shop page
      shopFilters: targetPage === 'shop' ? prev.shopFilters : {
        category: '',
        gender: '',
        priceRange: '',
        sortBy: ''
      }
    }));
  };

  const handleShopFilterChange = (filterKey: keyof FormData['shopFilters'], value: string) => {
    setFormData(prev => ({
      ...prev,
      shopFilters: {
        ...prev.shopFilters,
        [filterKey]: value
      }
    }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/admin/advertisements/upload`,
      formData,
      { 
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );

    if (response.data.success) {
      return response.data.imageUrl;
    } else {
      throw new Error(response.data.message || 'Upload failed');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl }));
      addToast('Image uploaded successfully!', 'success');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      addToast(error.response?.data?.message || 'Error uploading image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.imageUrl) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    if (formData.targetPage === 'custom' && !formData.buttonLink) {
      addToast('Please enter a custom URL', 'error');
      return;
    }

    setSaving(true);
    try {
      const submitData = {
        ...formData,
        // Only include shopFilters if targetPage is 'shop'
        shopFilters: formData.targetPage === 'shop' ? formData.shopFilters : undefined
      };

      if (editingAd) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/admin/advertisements/${editingAd._id}`,
          submitData,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/admin/advertisements`,
          submitData,
          { withCredentials: true }
        );
      }

      addToast(
        editingAd ? 'Advertisement updated successfully!' : 'Advertisement created successfully!',
        'success'
      );
      
      setShowModal(false);
      resetForm();
      fetchAdvertisements();
    } catch (error: any) {
      console.error('Error saving advertisement:', error);
      addToast(error.response?.data?.message || 'Error saving advertisement', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description,
      imageUrl: ad.imageUrl,
      buttonText: ad.buttonText,
      buttonLink: ad.buttonLink,
      targetPage: ad.targetPage || 'custom',
      shopFilters: {
        category: ad.shopFilters?.category ?? '',
        gender: ad.shopFilters?.gender ?? '',
        priceRange: ad.shopFilters?.priceRange ?? '',
        sortBy: ad.shopFilters?.sortBy ?? ''
      },
      isActive: ad.isActive,
      priority: ad.priority
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/admin/advertisements/${id}`, {
        withCredentials: true
      });
      addToast('Advertisement deleted successfully!', 'success');
      fetchAdvertisements();
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Error deleting advertisement', 'error');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/advertisements/${id}/toggle`,
        { isActive: !isActive },
        { withCredentials: true }
      );
      addToast('Advertisement status updated!', 'success');
      fetchAdvertisements();
    } catch (error: any) {
      addToast('Error updating advertisement status', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      buttonText: 'Shop Now',
      buttonLink: '',
      targetPage: 'shop',
      shopFilters: {
        category: '',
        gender: '',
        priceRange: '',
        sortBy: ''
      },
      isActive: true,
      priority: 1
    });
    setEditingAd(null);
  };

  const getTargetPageDisplay = (ad: Advertisement) => {
    const page = pageOptions.find(p => p.value === ad.targetPage);
    if (page) {
      if (ad.targetPage === 'shop' && ad.shopFilters) {
        const filters = [];
        if (ad.shopFilters.category) {
          const cat = categories.find(c => c._id === ad.shopFilters?.category);
          filters.push(`Category: ${cat?.name || ad.shopFilters.category}`);
        }
        if (ad.shopFilters.gender) filters.push(`Gender: ${ad.shopFilters.gender}`);
        if (ad.shopFilters.priceRange) filters.push(`Price: ${ad.shopFilters.priceRange}`);
        if (ad.shopFilters.sortBy) filters.push(`Sort: ${ad.shopFilters.sortBy}`);
        
        return `${page.label}${filters.length ? ` (${filters.join(', ')})` : ''}`;
      }
      return page.label;
    }
    return 'Custom URL';
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading advertisements...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advertisement Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Add Advertisement
        </button>
      </div>

      {/* Advertisements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advertisements.map((ad) => (
          <div key={ad._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="w-full h-48 object-cover"
              />
              <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                ad.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {ad.isActive ? 'Active' : 'Inactive'}
              </div>
              <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                Priority: {ad.priority}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{ad.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ad.description}</p>
              
              <div className="text-sm text-gray-500 mb-3">
                <div>Button: {ad.buttonText}</div>
                <div>Target: {getTargetPageDisplay(ad)}</div>
                <div className="text-xs text-blue-600 break-all">URL: {ad.buttonLink}</div>
              </div>

              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => handleEdit(ad)}
                  className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ad._id)}
                  className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>

              <button
                onClick={() => toggleActive(ad._id, ad.isActive)}
                className={`w-full px-3 py-1 rounded text-sm ${
                  ad.isActive 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
              >
                {ad.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {editingAd ? 'Edit Advertisement' : 'Add New Advertisement'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Button Text</label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                  />
                </div>

                {/* Banner Image */}
                <div>
                  <label className="block text-sm font-medium mb-1">Banner Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {uploading && (
                    <p className="text-sm text-blue-600 mt-1">Uploading image...</p>
                  )}
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                {/* Target Page Selection */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium mb-2">Target Page *</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pageOptions.map((page) => (
                      <label
                        key={page.value}
                        className={`relative flex items-start p-3 border rounded-lg cursor-pointer transition-all ${
                          formData.targetPage === page.value
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="targetPage"
                          value={page.value}
                          checked={formData.targetPage === page.value}
                          onChange={(e) => handleTargetPageChange(e.target.value)}
                          className="mt-1 mr-3"
                        />
                        <div>
                          <div className="font-medium text-sm">{page.label}</div>
                          <div className="text-xs text-gray-500">{page.description}</div>
                          {page.route && (
                            <div className="text-xs text-blue-600 mt-1">{page.route}</div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Shop Filters (only show when shop page is selected) */}
                {formData.targetPage === 'shop' && (
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <h4 className="font-medium text-sm mb-3 text-blue-800">Shop Page Filters (Optional)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                          value={formData.shopFilters.category}
                          onChange={(e) => handleShopFilterChange('category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Categories</option>
                          {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Gender</label>
                        <select
                          value={formData.shopFilters.gender}
                          onChange={(e) => handleShopFilterChange('gender', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">All Genders</option>
                          <option value="Men">Men</option>
                          <option value="Women">Women</option>
                          <option value="Unisex">Unisex</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Price Range</label>
                        <select
                          value={formData.shopFilters.priceRange}
                          onChange={(e) => handleShopFilterChange('priceRange', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {priceRangeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Sort By</label>
                        <select
                          value={formData.shopFilters.sortBy}
                          onChange={(e) => handleShopFilterChange('sortBy', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-3 p-2 bg-white rounded border">
                      <div className="text-xs text-gray-600">Generated URL:</div>
                      <div className="text-xs text-blue-600 break-all font-mono">
                        {formData.buttonLink || '/products'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom URL (only show when custom is selected) */}
                {formData.targetPage === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Custom URL *</label>
                    <input
                      type="text"
                      value={formData.buttonLink}
                      onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                      placeholder="e.g., /special-offers, https://external-site.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a relative path (e.g., /special-offers) or full URL (e.g., https://example.com)
                    </p>
                  </div>
                )}

                {/* Priority and Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm font-medium">
                      Active
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : (editingAd ? 'Update Advertisement' : 'Add Advertisement')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {advertisements.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No advertisements found. Create your first advertisement banner!
        </div>
      )}
    </div>
  );
};

export default AdvertisementTab;