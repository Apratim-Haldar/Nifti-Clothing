import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';

interface NewsletterTemplate {
  subject: string;
  mainTitle: string;
  description: string;
  headerImage: string;
  buttonText: string;
  buttonUrl: string;
  footerMessage: string;
  primaryColor: string;
  accentColor: string;
  companyName: string;
  logoUrl: string;
}

interface ModernNewsletterBuilderProps {
  onPreview: (template: NewsletterTemplate) => void;
  onSend: (template: NewsletterTemplate) => void;
  initialTemplate?: Partial<NewsletterTemplate>;
}

const ModernNewsletterBuilder: React.FC<ModernNewsletterBuilderProps> = ({
  onPreview,
  onSend,
  initialTemplate = {}
}) => {
  const { addToast } = useToast();
  const [uploading, setUploading] = useState(false);
  
  const [template, setTemplate] = useState<NewsletterTemplate>({
    subject: '',
    mainTitle: '',
    description: '',
    headerImage: '',
    buttonText: 'SHOP NOW',
    buttonUrl: '/products',
    footerMessage: 'Thank you for being part of our fashion community!',
    primaryColor: '#1e293b',
    accentColor: '#0d9488',
    companyName: 'NIFTI CLOTHING',
    logoUrl: '',
    ...initialTemplate
  });

  const [presets] = useState([
    {
      name: 'New Collection Launch',
      template: {
        subject: 'Introducing Our Latest Collection',
        mainTitle: 'New Arrivals Are Here!',
        description: 'Discover our latest fashion pieces designed to elevate your style. From casual wear to statement pieces, find your perfect look.',
        buttonText: 'SHOP NEW ARRIVALS',
        buttonUrl: '/products?sort=newest',
        footerMessage: 'Be the first to get your hands on these exclusive pieces!'
      }
    },
    {
      name: 'Seasonal Sale',
      template: {
        subject: 'Exclusive Sale - Up to 50% Off',
        mainTitle: 'Limited Time Offer',
        description: 'Don\'t miss out on incredible savings! Get up to 50% off on selected items. Limited time only - shop now before it\'s gone!',
        buttonText: 'SHOP SALE',
        buttonUrl: '/products?sale=true',
        footerMessage: 'Hurry! Sale ends soon. Don\'t miss these amazing deals!'
      }
    },
    {
      name: 'Style Guide',
      template: {
        subject: 'Your Style Guide for This Season',
        mainTitle: 'Master This Season\'s Trends',
        description: 'Get inspired with our curated style guide. Learn how to mix and match pieces to create stunning outfits for any occasion.',
        buttonText: 'GET INSPIRED',
        buttonUrl: '/style-guide',
        footerMessage: 'Style is a way to say who you are without having to speak.'
      }
    }
  ]);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/admin/advertisements/upload/temp`,
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'header' | 'logo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setTemplate(prev => ({
        ...prev,
        [type === 'header' ? 'headerImage' : 'logoUrl']: imageUrl
      }));
      addToast(`${type === 'header' ? 'Header' : 'Logo'} image uploaded successfully!`, 'success');
    } catch (error: any) {
      console.error(`Error uploading ${type} image:`, error);
      addToast(error.response?.data?.message || `Error uploading ${type} image`, 'error');
    } finally {
      setUploading(false);
    }
  };

  const applyPreset = (preset: any) => {
    setTemplate(prev => ({
      ...prev,
      ...preset.template
    }));
    addToast(`Applied "${preset.name}" template`, 'success');
  };

  const handlePreview = () => {
    if (!template.subject || !template.mainTitle) {
      addToast('Subject and main title are required for preview', 'error');
      return;
    }
    onPreview(template);
  };

  const handleSend = () => {
    if (!template.subject || !template.mainTitle || !template.description) {
      addToast('Subject, main title, and description are required', 'error');
      return;
    }
    onSend(template);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Newsletter Template Builder</h3>
        
        {/* Quick Templates */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Quick Templates</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {presets.map((preset, index) => (
              <button
                key={index}
                onClick={() => applyPreset(preset)}
                className="p-3 text-left border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-sm">{preset.name}</div>
                <div className="text-xs text-gray-600 mt-1">{preset.template.subject}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject Line *</label>
              <input
                type="text"
                value={template.subject}
                onChange={(e) => setTemplate(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Main Title *</label>
              <input
                type="text"
                value={template.mainTitle}
                onChange={(e) => setTemplate(prev => ({ ...prev, mainTitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Newsletter main headline"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                value={template.description}
                onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Newsletter content and message"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Button Text</label>
              <input
                type="text"
                value={template.buttonText}
                onChange={(e) => setTemplate(prev => ({ ...prev, buttonText: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Call-to-action button text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Button URL</label>
              <input
                type="text"
                value={template.buttonUrl}
                onChange={(e) => setTemplate(prev => ({ ...prev, buttonUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/products or full URL"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Header Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'header')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
              {template.headerImage && (
                <div className="mt-2">
                  <img
                    src={template.headerImage}
                    alt="Header preview"
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Company Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'logo')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={uploading}
              />
              {template.logoUrl && (
                <div className="mt-2">
                  <img
                    src={template.logoUrl}
                    alt="Logo preview"
                    className="h-16 object-contain rounded border bg-gray-50 p-2"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Primary Color</label>
                <input
                  type="color"
                  value={template.primaryColor}
                  onChange={(e) => setTemplate(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Accent Color</label>
                <input
                  type="color"
                  value={template.accentColor}
                  onChange={(e) => setTemplate(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input
                type="text"
                value={template.companyName}
                onChange={(e) => setTemplate(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Footer Message</label>
              <textarea
                value={template.footerMessage}
                onChange={(e) => setTemplate(prev => ({ ...prev, footerMessage: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Closing message for newsletter"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handlePreview}
            disabled={uploading}
            className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 font-medium"
          >
            Preview Newsletter
          </button>
          <button
            onClick={handleSend}
            disabled={uploading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            Send Newsletter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernNewsletterBuilder;
