import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  sizes: string[];
  colors: string[];
  colorImages: { color: string; imageUrl: string }[];
  defaultColor?: string;
  imageUrl: string;
  stock: number;
  lowStockThreshold: number;
  gender: 'Men' | 'Women' | 'Unisex';
  categories: string[];
  inStock: boolean;
  stockStatus: string;
  isLowStock: boolean;
  isHero: boolean;
  heroImage?: string;
  heroTagline?: string;
}

interface Category {
  _id: string;
  name: string;
}

interface FormData {
  title: string;
  description: string;
  price: string;
  sizes: string[];
  colors: string[];
  stock: string;
  lowStockThreshold: string;
  gender: 'Men' | 'Women' | 'Unisex';
  categories: string[];
  imageUrl: string;
  defaultColor: string;
  isHero: boolean;
  heroImage: string;
  heroTagline: string;
}

interface ColorImageState {
  [color: string]: {
    file?: File;
    url?: string;
    isUploaded: boolean;
  };
}

const ProductsTab: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [uploading, setUploading] = useState(false);
  const [colorImages, setColorImages] = useState<ColorImageState>({});
  const { addToast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    sizes: [],
    colors: [],
    stock: '0',
    lowStockThreshold: '10',
    gender: 'Unisex',
    categories: [],
    imageUrl: '',
    defaultColor: '',
    isHero: false,
    heroImage: '',
    heroTagline: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/products`, {
        withCredentials: true
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      addToast('Error fetching products', 'error');
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

  // Upload main product image to S3
  const uploadProductImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/admin/products/upload/product-image`,
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

  // Upload hero image to S3
  const uploadHeroImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/admin/products/upload/hero-image`,
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

  // Upload single color image to S3
  const uploadColorImage = async (file: File, color: string): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('color', color);

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/admin/products/upload/color-image`,
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

  // Delete image from S3
  const deleteImage = async (imageUrl: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/admin/products/upload/delete-image`, {
        data: { imageUrl },
        withCredentials: true
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      // Don't throw error here as it's not critical
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Delete old image if updating
      if (formData.imageUrl && editingProduct) {
        await deleteImage(formData.imageUrl);
      }

      const imageUrl = await uploadProductImage(file);
      setFormData(prev => ({ ...prev, imageUrl }));
      addToast('Image uploaded successfully!', 'success');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      addToast(error.response?.data?.message || 'Error uploading image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Delete old hero image if updating
      if (formData.heroImage && editingProduct) {
        await deleteImage(formData.heroImage);
      }

      const imageUrl = await uploadHeroImage(file);
      setFormData(prev => ({ ...prev, heroImage: imageUrl }));
      addToast('Hero image uploaded successfully!', 'success');
    } catch (error: any) {
      console.error('Error uploading hero image:', error);
      addToast(error.response?.data?.message || 'Error uploading hero image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleColorImageUpload = async (color: string, file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      // Delete old color image if it exists
      const existingColorImage = colorImages[color];
      if (existingColorImage?.url && existingColorImage.isUploaded) {
        await deleteImage(existingColorImage.url);
      }

      const imageUrl = await uploadColorImage(file, color);
      
      setColorImages(prev => ({
        ...prev,
        [color]: {
          file,
          url: imageUrl,
          isUploaded: true
        }
      }));
      
      addToast(`${color} image uploaded successfully!`, 'success');
    } catch (error: any) {
      console.error('Error uploading color image:', error);
      addToast(error.response?.data?.message || `Error uploading ${color} image`, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.stock || !formData.gender) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    if (!formData.imageUrl) {
      addToast('Please upload a product image', 'error');
      return;
    }

    if (formData.sizes.length === 0) {
      addToast('Please add at least one size', 'error');
      return;
    }

    // Validate hero section requirements
    if (formData.isHero && !formData.heroTagline.trim()) {
      addToast('Hero tagline is required for hero products', 'error');
      return;
    }

    setSaving(true);
    try {
      // Prepare color images data
      const colorImagesData = Object.entries(colorImages)
        .filter(([_, data]) => data.url && data.isUploaded)
        .map(([color, data]) => ({
          color,
          imageUrl: data.url!
        }));

      // Set default color if not set
      let defaultColor = formData.defaultColor;
      if (!defaultColor && formData.colors.length > 0) {
        defaultColor = formData.colors[0];
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
        colorImages: colorImagesData,
        defaultColor,
        // Send old data for cleanup
        ...(editingProduct && {
          oldImageUrl: editingProduct.imageUrl,
          oldHeroImage: editingProduct.heroImage,
          oldColorImages: editingProduct.colorImages
        })
      };

      let response;
      if (editingProduct) {
        response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/admin/products/${editingProduct._id}`,
          productData,
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/admin/products`,
          productData,
          { withCredentials: true }
        );
      }

      // Use the response to show more specific success message
      addToast(
        response.data.message || (editingProduct ? 'Product updated successfully!' : 'Product created successfully!'),
        'success'
      );
      
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      console.error('Error saving product:', error);
      addToast(error.response?.data?.message || 'Error saving product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      sizes: product.sizes,
      colors: product.colors,
      stock: product.stock.toString(),
      lowStockThreshold: product.lowStockThreshold.toString(),
      gender: product.gender,
      categories: product.categories,
      imageUrl: product.imageUrl,
      defaultColor: product.defaultColor || '',
      isHero: product.isHero || false,
      heroImage: product.heroImage || '',
      heroTagline: product.heroTagline || ''
    });

    // Set existing color images
    const existingColorImages: ColorImageState = {};
    product.colorImages.forEach(({ color, imageUrl }) => {
      existingColorImages[color] = {
        url: imageUrl,
        isUploaded: true
      };
    });
    setColorImages(existingColorImages);
    
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This will also delete all associated images.')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/admin/products/${id}`, {
        withCredentials: true
      });
      addToast('Product deleted successfully!', 'success');
      fetchProducts();
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Error deleting product', 'error');
    }
  };

  const updateStock = async (productId: string, operation: string, amount: number) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/products/${productId}/stock`,
        { stock: amount, operation },
        { withCredentials: true }
      );
      addToast('Stock updated successfully!', 'success');
      fetchProducts();
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Error updating stock', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      sizes: [],
      colors: [],
      stock: '0',
      lowStockThreshold: '10',
      gender: 'Unisex',
      categories: [],
      imageUrl: '',
      defaultColor: '',
      isHero: false,
      heroImage: '',
      heroTagline: ''
    });
    setEditingProduct(null);
    setColorImages({});
  };

  const addSize = () => {
    const size = prompt('Enter size (e.g., S, M, L, XL, 32, 34):');
    if (size && !formData.sizes.includes(size.trim())) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, size.trim()]
      }));
    }
  };

  const removeSize = (sizeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(size => size !== sizeToRemove)
    }));
  };

  const addColor = () => {
    const color = prompt('Enter color (e.g., Red, Blue, Black):');
    if (color && !formData.colors.includes(color.trim())) {
      const colorName = color.trim();
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, colorName],
        // Set as default if it's the first color
        defaultColor: prev.colors.length === 0 ? colorName : prev.defaultColor
      }));
      
      // Initialize color image state
      setColorImages(prev => ({
        ...prev,
        [colorName]: { isUploaded: false }
      }));
    }
  };

  const removeColor = (colorToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color !== colorToRemove),
      // Update default color if removed
      defaultColor: prev.defaultColor === colorToRemove ? 
        (prev.colors.filter(c => c !== colorToRemove)[0] || '') : 
        prev.defaultColor
    }));
    
    // Delete color image if it exists
    const colorImageData = colorImages[colorToRemove];
    if (colorImageData?.url && colorImageData.isUploaded) {
      deleteImage(colorImageData.url);
    }
    
    // Remove from color images state
    setColorImages(prev => {
      const updated = { ...prev };
      delete updated[colorToRemove];
      return updated;
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = !filterGender || product.gender === filterGender;
    const matchesStock = !filterStock || 
                        (filterStock === 'in-stock' && product.inStock) ||
                        (filterStock === 'out-of-stock' && !product.inStock) ||
                        (filterStock === 'low-stock' && product.isLowStock);
    
    return matchesSearch && matchesGender && matchesStock;
  });

  if (loading) {
    return <div className="flex justify-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Genders</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Unisex">Unisex</option>
        </select>

        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Stock</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              {product.isHero && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                  HERO
                </div>
              )}
              {product.colors.length > 0 && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  {product.colors.length} color{product.colors.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
              
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">₹{product.price}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  product.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' :
                  product.stockStatus === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {product.stockStatus}
                </span>
              </div>

              <div className="text-sm text-gray-500 mb-3">
                <div>Stock: {product.stock}</div>
                <div>Gender: {product.gender}</div>
                <div>Sizes: {product.sizes.join(', ')}</div>
                {product.colors.length > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <span>Colors:</span>
                    <div className="flex gap-1">
                      {product.colors.map((color, index) => {
                        const hasImage = product.colorImages.some(img => img.color === color);
                        return (
                          <span 
                            key={index}
                            className={`text-xs px-1 py-0.5 rounded ${
                              hasImage ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}
                            title={hasImage ? 'Image available' : 'No image'}
                          >
                            {color}
                            {hasImage && ' ✓'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                {product.defaultColor && (
                  <div className="text-xs text-blue-600 mt-1">
                    Default: {product.defaultColor}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>

              {/* Stock Management */}
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStock(product._id, 'subtract', 1)}
                    className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-200"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => updateStock(product._id, 'add', 1)}
                    className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs hover:bg-green-200"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => {
                      const amount = prompt('Enter stock amount:');
                      if (amount && !isNaN(Number(amount))) {
                        updateStock(product._id, 'set', Number(amount));
                      }
                    }}
                    className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-200"
                  >
                    Set
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'Men' | 'Women' | 'Unisex' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Unisex">Unisex</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Stock *</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Low Stock Threshold</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.lowStockThreshold}
                      onChange={(e) => setFormData(prev => ({ ...prev, lowStockThreshold: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Main Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-1">Product Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {uploading && (
                    <p className="text-sm text-blue-600 mt-1">Uploading image...</p>
                  )}
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                {/* Hero Section */}
                <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="isHero"
                      checked={formData.isHero}
                      onChange={(e) => setFormData(prev => ({ ...prev, isHero: e.target.checked }))}
                      className="mr-2"
                    />
                    <label htmlFor="isHero" className="text-sm font-medium text-yellow-800">
                      ⭐ Feature as Hero Product
                    </label>
                  </div>
                  
                  {formData.isHero && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-yellow-800">Hero Tagline *</label>
                        <input
                          type="text"
                          value={formData.heroTagline}
                          onChange={(e) => setFormData(prev => ({ ...prev, heroTagline: e.target.value }))}
                          className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          placeholder="Enter catchy tagline for hero section"
                          required={formData.isHero}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-yellow-800">Hero Banner Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHeroImageUpload}
                          className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <p className="text-xs text-yellow-700 mt-1">Optional: Upload a different image for hero banner (will use main product image if not provided)</p>
                        {formData.heroImage && (
                          <div className="mt-2">
                            <img
                              src={formData.heroImage}
                              alt="Hero Preview"
                              className="w-32 h-20 object-cover rounded-lg border border-yellow-300"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium mb-1">Sizes * (at least one required)</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.sizes.map((size) => (
                      <span
                        key={size}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {size}
                        <button
                          type="button"
                          onClick={() => removeSize(size)}
                          className="text-blue-600 hover:text-blue-800 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addSize}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                  >
                    Add Size
                  </button>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium mb-1">Colors</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.colors.map((color) => (
                      <span
                        key={color}
                        className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                          color === formData.defaultColor 
                            ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {color}
                        {color === formData.defaultColor && <span className="text-xs">(Default)</span>}
                        <button
                          type="button"
                          onClick={() => removeColor(color)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addColor}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600"
                  >
                    Add Color
                  </button>
                </div>

                {/* Default Color Selection */}
                {formData.colors.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Default Color</label>
                    <select
                      value={formData.defaultColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, defaultColor: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select default color</option>
                      {formData.colors.map((color) => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Color Images */}
                {formData.colors.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Color Images</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.colors.map((color) => {
                        const colorImageData = colorImages[color];
                        return (
                          <div key={color} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-800">{color}</h4>
                              {colorImageData?.isUploaded && (
                                <span className="text-green-600 text-sm">✓ Uploaded</span>
                              )}
                            </div>
                            
                            {colorImageData?.url && (
                              <div className="mb-2">
                                <img
                                  src={colorImageData.url}
                                  alt={`${color} variant`}
                                  className="w-20 h-20 object-cover rounded border"
                                />
                              </div>
                            )}
                            
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleColorImageUpload(color, file);
                                }
                              }}
                              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {colorImageData?.isUploaded ? 'Replace image' : 'Upload image for this color'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium mb-1">Categories</label>
                  <select
                    multiple
                    value={formData.categories}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      setFormData(prev => ({ ...prev, categories: values }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    size={4}
                  >
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                  >
                    {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default ProductsTab;