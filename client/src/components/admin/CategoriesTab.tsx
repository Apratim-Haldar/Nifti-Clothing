import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import type { Category } from '../../types/admin';

const CategoriesTab: React.FC = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<Category[]>(`${import.meta.env.VITE_API_BASE_URL}/categories`);
      
      // Filter out null/undefined categories and ensure proper structure
      const validCategories = (response.data || []).filter(
        (category): category is Category => 
          category !== null && 
          category !== undefined && 
          typeof category === 'object' &&
          '_id' in category &&
          'name' in category &&
          typeof category.name === 'string'
      );
      
      setCategories(validCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      showToast('Failed to fetch categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (): Promise<void> => {
    if (!newCategory.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    try {
      const response = await axios.post<Category>(
        `${import.meta.env.VITE_API_BASE_URL}/categories`,
        { name: newCategory.trim() },
        { withCredentials: true }
      );
      
      // Validate the response
      if (response.data && response.data._id && response.data.name) {
        setCategories(prevCategories => [...prevCategories, response.data]);
        setNewCategory('');
        showToast('Category added successfully!', 'success');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Error adding category:', err);
      showToast(err.response?.data?.message || 'Failed to add category', 'error');
    }
  };

  const handleUpdateCategory = async (): Promise<void> => {
    if (!editingCategory || !editingCategory.name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    try {
      const response = await axios.put<Category>(
        `${import.meta.env.VITE_API_BASE_URL}/categories/${editingCategory._id}`,
        { name: editingCategory.name.trim() },
        { withCredentials: true }
      );
      
      // Validate the response
      if (response.data && response.data._id && response.data.name) {
        setCategories(prevCategories => 
          prevCategories.map(cat => 
            cat._id === editingCategory._id ? response.data : cat
          )
        );
        setEditingCategory(null);
        showToast('Category updated successfully!', 'success');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Error updating category:', err);
      showToast(err.response?.data?.message || 'Failed to update category', 'error');
    }
  };

  const handleDeleteCategory = async (id: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/categories/${id}`, {
        withCredentials: true
      });
      
      setCategories(prevCategories => prevCategories.filter(c => c._id !== id));
      showToast('Category deleted successfully!', 'success');
    } catch (err: any) {
      console.error('Error deleting category:', err);
      showToast(err.response?.data?.message || 'Failed to delete category', 'error');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void): void => {
    if (e.key === 'Enter') {
      action();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        <span className="ml-3 text-gray-600">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Categories</h2>
        
        {/* Add Category Form */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter new category name"
              value={newCategory}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              onKeyPress={(e) => handleKeyPress(e, handleAddCategory)}
            />
            <button
              onClick={handleAddCategory}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Category
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {categories.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">📂</div>
              <p>No categories found. Add your first category!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {categories
                .filter(category => category && category._id && category.name) // Additional safety filter
                .map((category) => (
                <div key={category._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  {editingCategory?._id === category._id ? (
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">📂</span>
                      <input
                        type="text"
                        value={editingCategory.name || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingCategory({
                          ...editingCategory,
                          name: e.target.value
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                        onKeyPress={(e) => handleKeyPress(e, handleUpdateCategory)}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateCategory}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">📂</span>
                        <span className="font-medium text-gray-900">{category.name || 'Unnamed Category'}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          className="px-3 py-1 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesTab;