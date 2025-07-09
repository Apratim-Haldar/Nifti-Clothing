import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { useModal } from '../../context/ModalContext';
import ModernNewsletterBuilder from './ModernNewsletterBuilder';

interface Subscriber {
  _id: string;
  email: string;
  status: 'subscribed' | 'unsubscribed';
  subscribedAt: string;
  unsubscribedAt?: string;
  source: string;
}

interface Stats {
  total: number;
  subscribed: number;
  unsubscribed: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface NewsletterSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  companyName: string;
  logoUrl: string;
  websiteUrl: string;
  headerImage: string;
  footerText: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
  };
  customCSS: string;
}

const NewsletterTab: React.FC = () => {
  const { showToast } = useToast();
  const { showConfirm } = useModal();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'compose' | 'settings'>('overview');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, subscribed: 0, unsubscribed: 0 });
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1
  });

  // Settings
  const [settings, setSettings] = useState<NewsletterSettings>({
    primaryColor: '#1e293b',
    secondaryColor: '#334155',
    accentColor: '#0d9488',
    companyName: 'NIFTI',
    logoUrl: '',
    websiteUrl: 'https://nifticlothing.com',
    headerImage: '',
    footerText: '',
    socialLinks: {
      instagram: '',
      facebook: '',
      twitter: '',
      linkedin: ''
    },
    customCSS: ''
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    if (activeSubTab === 'overview') {
      fetchSubscribers();
    } else if (activeSubTab === 'settings') {
      fetchSettings();
    }
  }, [filters, activeSubTab]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/newsletter/subscribers`, {
        params: filters,
        withCredentials: true
      });

      setSubscribers(response.data.subscribers);
      setStats(response.data.stats);
      setPagination(response.data.pagination);
    } catch (err: any) {
      console.error('Error fetching subscribers:', err);
      showToast(err.response?.data?.message || 'Failed to fetch subscribers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      setSettingsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/newsletter/settings`, {
        withCredentials: true
      });
      setSettings(response.data);
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      showToast(err.response?.data?.message || 'Failed to fetch settings', 'error');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSettingsLoading(true);
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/newsletter/settings`,
        settings,
        { withCredentials: true }
      );
      showToast('Settings saved successfully!', 'success');
    } catch (err: any) {
      console.error('Error saving settings:', err);
      showToast(err.response?.data?.message || 'Failed to save settings', 'error');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleDeleteSubscriber = async (id: string, email: string) => {
    const confirmed = await showConfirm(
      'Delete Subscriber',
      `Are you sure you want to delete ${email} from the newsletter?`,
      'Delete',
      'Cancel'
    );
    
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/newsletter/subscribers/${id}`, {
        withCredentials: true
      });

      showToast('Subscriber deleted successfully', 'success');
      fetchSubscribers();
    } catch (err: any) {
      console.error('Error deleting subscriber:', err);
      showToast(err.response?.data?.message || 'Failed to delete subscriber', 'error');
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/newsletter/export`, {
        params: { status: filters.status },
        responseType: 'blob',
        withCredentials: true
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `newsletter-subscribers-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast('Subscribers exported successfully', 'success');
    } catch (err: any) {
      console.error('Error exporting subscribers:', err);
      showToast('Failed to export subscribers', 'error');
    }
  };

  // Modern handlers for EmailTemplateBuilder integration
  const handleModernPreview = async (template: any) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/newsletter/preview-modern`,
        template,
        { withCredentials: true }
      );
      setPreviewHtml(response.data.html);
    } catch (err: any) {
      console.error('Error generating modern preview:', err);
      showToast('Failed to generate preview', 'error');
    }
  };

  const handleModernSend = async (template: any) => {
    const confirmed = await showConfirm(
      'Send Newsletter',
      `Are you sure you want to send this newsletter to ${stats.subscribed} subscribers?`,
      'Send Newsletter',
      'Cancel'
    );
    
    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/newsletter/send-modern`,
        template,
        { withCredentials: true }
      );

      showToast(`Newsletter sent successfully! ${response.data.results.successful} emails delivered.`, 'success');
      setActiveSubTab('overview');
    } catch (err: any) {
      console.error('Error sending modern newsletter:', err);
      showToast(err.response?.data?.message || 'Failed to send newsletter', 'error');
    }
  };

  if (loading && subscribers.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        <span className="ml-3 text-gray-600">Loading newsletter data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Newsletter Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeSubTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveSubTab('compose')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeSubTab === 'compose'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📧 Compose
          </button>
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeSubTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeSubTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
                  <p className="text-2xl font-bold text-green-600">{stats.subscribed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full">
                  <span className="text-2xl">❌</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unsubscribed</p>
                  <p className="text-2xl font-bold text-red-600">{stats.unsubscribed}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="subscribed">Subscribed</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>
              </div>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                📥 Export CSV
              </button>
            </div>
          </div>

          {/* Subscribers Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {subscribers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">📧</div>
                <p>No subscribers found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subscribed Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subscribers.map((subscriber) => (
                      <tr key={subscriber._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {subscriber.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              subscriber.status === 'subscribed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {subscriber.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {subscriber.source}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteSubscriber(subscriber._id, subscriber.email)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.currentPage - 1) * 50) + 1} to {Math.min(pagination.currentPage * 50, pagination.totalItems)} of {pagination.totalItems} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Compose Tab - Integrated with EmailTemplateBuilder */}
      {activeSubTab === 'compose' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="space-y-6">
            <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 p-3 rounded-md">
              <p className="flex items-center mb-1">
                <span className="mr-2">📧</span>
                This will be sent to <strong className="mx-1">{stats.subscribed}</strong> active subscribers
              </p>
              <p className="flex items-center">
                <span className="mr-2">💡</span>
                Use the template builder below to create professional newsletters
              </p>
            </div>

            {/* Modern Newsletter Builder */}
            <ModernNewsletterBuilder
              onPreview={handleModernPreview}
              onSend={handleModernSend}
            />

            {/* Preview will be handled by the modern builder */}
            {previewHtml && (
              <div className="border border-gray-300 rounded-md p-4 bg-gray-50 mt-6">
                <h3 className="text-lg font-medium mb-4">Email Preview</h3>
                <div className="bg-white border rounded max-h-96 overflow-y-auto">
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full h-96"
                    title="Newsletter Preview"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeSubTab === 'settings' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Newsletter Template Settings</h3>
            
            {/* Color Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-12 h-10 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="w-12 h-10 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                    className="w-12 h-10 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={settings.accentColor}
                    onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Basic Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <input
                  type="url"
                  value={settings.websiteUrl}
                  onChange={(e) => setSettings({ ...settings, websiteUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
              <input
                type="url"
                value={settings.logoUrl}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Header Image URL</label>
              <input
                type="url"
                value={settings.headerImage}
                onChange={(e) => setSettings({ ...settings, headerImage: e.target.value })}
                placeholder="https://example.com/header.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Footer Text</label>
              <textarea
                value={settings.footerText}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                rows={3}
                placeholder="Additional footer content..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Social Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks.instagram}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                    })}
                    placeholder="https://instagram.com/yourcompany"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks.facebook}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                    })}
                    placeholder="https://facebook.com/yourcompany"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks.twitter}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      socialLinks: { ...settings.socialLinks, twitter: e.target.value }
                    })}
                    placeholder="https://twitter.com/yourcompany"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks.linkedin}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      socialLinks: { ...settings.socialLinks, linkedin: e.target.value }
                    })}
                    placeholder="https://linkedin.com/company/yourcompany"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Custom CSS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom CSS</label>
              <textarea
                value={settings.customCSS}
                onChange={(e) => setSettings({ ...settings, customCSS: e.target.value })}
                rows={6}
                placeholder="/* Add custom CSS for email styling */&#10;.custom-header { font-weight: bold; }"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add custom CSS that will be included in email templates
              </p>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={settingsLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {settingsLoading ? 'Saving...' : '💾 Save Settings'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterTab;