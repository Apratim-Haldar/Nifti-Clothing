import React, { useState, useCallback } from 'react';
import RichTextEditor from './RichTextEditor';
import { useModal } from '../../context/ModalContext';

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  thumbnail: string;
}

interface EmailTemplateBuilderProps {
  value: string;
  onChange: (value: string) => void;
  subject: string;
  onSubjectChange: (subject: string) => void;
  settings: any;
}

const EmailTemplateBuilder: React.FC<EmailTemplateBuilderProps> = ({
  value,
  onChange,
  subject,
  onSubjectChange,
  settings
}) => {
  const [activeTab, setActiveTab] = useState<'compose' | 'templates' | 'preview'>('compose');
  const [savedTemplates, setSavedTemplates] = useState<Template[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const { showAlert, showConfirm } = useModal();

  const predefinedTemplates: Template[] = [
    {
      id: 'welcome',
      name: 'Welcome Email',
      subject: 'Welcome to {{companyName}}!',
      content: `
        <div style="text-align: center; padding: 20px;">
          <h1 style="color: {{primaryColor}};">Welcome to {{companyName}}!</h1>
          <p>Thank you for subscribing to our newsletter. We're excited to have you on board!</p>
          <img src="{{headerImage}}" alt="Welcome" style="max-width: 100%; height: auto; margin: 20px 0;" />
          <p>Stay tuned for exclusive offers, new arrivals, and fashion tips.</p>
          <a href="{{websiteUrl}}" style="background-color: {{accentColor}}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Shop Now</a>
        </div>
      `,
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPldlbGNvbWU8L3RleHQ+PC9zdmc+'
    },
    {
      id: 'promotion',
      name: 'Promotional Email',
      subject: 'Special Offer - {{discountPercent}}% Off!',
      content: `
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, {{primaryColor}}, {{secondaryColor}});">
          <h1 style="color: white; margin-bottom: 10px;">Special Offer!</h1>
          <h2 style="color: {{accentColor}}; font-size: 36px; margin: 20px 0;">{{discountPercent}}% OFF</h2>
          <p style="color: white; font-size: 18px;">On all items for a limited time</p>
          <a href="{{websiteUrl}}/sale" style="background-color: {{accentColor}}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 30px 0; font-weight: bold;">Shop Sale</a>
          <p style="color: white; font-size: 12px;">*Offer valid until {{expiryDate}}</p>
        </div>
      `,
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWY0NDQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj41MCUgT0ZGPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U2FsZTwvdGV4dD48L3N2Zz4='
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      subject: '{{companyName}} Newsletter - {{monthYear}}',
      content: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <header style="background-color: {{primaryColor}}; color: white; padding: 20px; text-align: center;">
            <h1>{{companyName}} Newsletter</h1>
            <p>{{monthYear}}</p>
          </header>
          
          <div style="padding: 20px;">
            <h2 style="color: {{primaryColor}};">What's New This Month</h2>
            <p>Add your newsletter content here. You can include:</p>
            <ul>
              <li>New product announcements</li>
              <li>Fashion tips and trends</li>
              <li>Customer spotlights</li>
              <li>Upcoming events</li>
            </ul>
            
            <div style="background-color: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <h3 style="color: {{accentColor}}; margin-top: 0;">Featured Products</h3>
              <p>Showcase your best products here...</p>
            </div>
          </div>
          
          <footer style="background-color: {{secondaryColor}}; color: white; padding: 20px; text-align: center;">
            <p>{{footerText}}</p>
          </footer>
        </div>
      `,
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIzMCUiIGZpbGw9IiMzNzQxNTEiLz48cmVjdCB5PSIzMCUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjUwJSIgZmlsbD0iI2Y5ZmFmYiIvPjxyZWN0IHk9IjgwJSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMjAlIiBmaWxsPSIjNjM2NjcwIi8+PHRleHQgeD0iNTAlIiB5PSIxNSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5OZXdzbGV0dGVyPC90ZXh0PjwvZz48L3N2Zz4='
    },
    {
      id: 'announcement',
      name: 'Product Announcement',
      subject: 'Introducing Our Latest Collection!',
      content: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="text-align: center; padding: 40px 20px; background: linear-gradient(45deg, {{primaryColor}}, {{accentColor}});">
            <h1 style="color: white; font-size: 28px; margin-bottom: 10px;">New Collection Alert!</h1>
            <p style="color: white; font-size: 16px;">Discover our latest styles</p>
          </div>
          
          <div style="padding: 30px 20px; text-align: center;">
            <img src="{{headerImage}}" alt="New Collection" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 20px;" />
            
            <h2 style="color: {{primaryColor}}; margin-bottom: 15px;">Premium Quality, Unbeatable Style</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
              Explore our carefully curated selection of premium clothing designed for the modern fashion enthusiast. 
              Each piece combines comfort, style, and quality craftsmanship.
            </p>
            
            <a href="{{websiteUrl}}/collection" style="background-color: {{accentColor}}; color: white; padding: 15px 35px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: bold; margin: 10px;">View Collection</a>
          </div>
        </div>
      `,
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMzNzQxNTEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwZDk0ODgiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI0MCUiIGZpbGw9InVybCgjZykiLz48cmVjdCB5PSI0MCUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjYwJSIgZmlsbD0iI2ZmZmZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iMjAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TmV3IENvbGxlY3Rpb248L3RleHQ+PC9zdmc+'
    }
  ];

  const applyTemplate = useCallback((template: Template) => {
    let processedSubject = template.subject;
    let processedContent = template.content;

    // Replace placeholders with actual settings
    const replacements = {
      '{{companyName}}': settings.companyName || 'Your Company',
      '{{primaryColor}}': settings.primaryColor || '#1e293b',
      '{{secondaryColor}}': settings.secondaryColor || '#334155',
      '{{accentColor}}': settings.accentColor || '#0d9488',
      '{{websiteUrl}}': settings.websiteUrl || '#',
      '{{headerImage}}': settings.headerImage || '',
      '{{footerText}}': settings.footerText || '',
      '{{monthYear}}': new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      '{{discountPercent}}': '30',
      '{{expiryDate}}': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };

    Object.entries(replacements).forEach(([placeholder, value]) => {
      processedSubject = processedSubject.replace(new RegExp(placeholder, 'g'), value);
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), value);
    });

    onSubjectChange(processedSubject);
    onChange(processedContent);
    setActiveTab('compose');
  }, [settings, onChange, onSubjectChange]);

  const saveTemplate = useCallback(async () => {
    if (!templateName.trim()) {
      await showAlert('Template Name Required', 'Please enter a template name');
      return;
    }

    const newTemplate: Template = {
      id: `custom_${Date.now()}`,
      name: templateName,
      subject: subject,
      content: value,
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkN1c3RvbTwvdGV4dD48L3N2Zz4='
    };

    setSavedTemplates(prev => [...prev, newTemplate]);
    setShowSaveDialog(false);
    setTemplateName('');
    await showAlert('Success', 'Template saved successfully!');
  }, [templateName, subject, value, showAlert]);

  const deleteTemplate = useCallback(async (templateId: string) => {
    const confirmed = await showConfirm(
      'Delete Template',
      'Are you sure you want to delete this template? This action cannot be undone.'
    );
    
    if (confirmed) {
      setSavedTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  }, [showConfirm]);

  const insertComponent = useCallback((componentType: string) => {
    let componentHtml = '';

    switch (componentType) {
      case 'header':
        componentHtml = `
          <header style="background-color: ${settings.primaryColor}; color: white; padding: 20px; text-align: center; margin: 20px 0;">
            <h1>${settings.companyName}</h1>
            <p>Your tagline here</p>
          </header>
        `;
        break;
      case 'footer':
        componentHtml = `
          <footer style="background-color: ${settings.secondaryColor}; color: white; padding: 20px; text-align: center; margin: 20px 0;">
            <p>${settings.footerText || 'Footer text here'}</p>
            <p style="font-size: 12px;">© ${new Date().getFullYear()} ${settings.companyName}. All rights reserved.</p>
          </footer>
        `;
        break;
      case 'button':
        componentHtml = `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${settings.websiteUrl}" style="background-color: ${settings.accentColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Click Here</a>
          </div>
        `;
        break;
      case 'divider':
        componentHtml = `
          <hr style="border: none; height: 1px; background-color: #e5e7eb; margin: 30px 0;" />
        `;
        break;
      case 'image':
        componentHtml = `
          <div style="text-align: center; margin: 20px 0;">
            <img src="${settings.headerImage || 'https://via.placeholder.com/600x300'}" alt="Image" style="max-width: 100%; height: auto; border-radius: 8px;" />
          </div>
        `;
        break;
      case 'social':
        componentHtml = `
          <div style="text-align: center; margin: 20px 0;">
            <p>Follow us on social media:</p>
            <div style="margin: 10px 0;">
              ${settings.socialLinks?.facebook ? `<a href="${settings.socialLinks.facebook}" style="margin: 0 10px; text-decoration: none;">📘 Facebook</a>` : ''}
              ${settings.socialLinks?.instagram ? `<a href="${settings.socialLinks.instagram}" style="margin: 0 10px; text-decoration: none;">📷 Instagram</a>` : ''}
              ${settings.socialLinks?.twitter ? `<a href="${settings.socialLinks.twitter}" style="margin: 0 10px; text-decoration: none;">🐦 Twitter</a>` : ''}
              ${settings.socialLinks?.linkedin ? `<a href="${settings.socialLinks.linkedin}" style="margin: 0 10px; text-decoration: none;">💼 LinkedIn</a>` : ''}
            </div>
          </div>
        `;
        break;
    }

    onChange(value + componentHtml);
  }, [value, onChange, settings]);

  const generatePreview = useCallback(() => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 20px; 
            background-color: #f4f4f4;
          }
          .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white; 
            border-radius: 8px; 
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          ${settings.customCSS || ''}
        </style>
      </head>
      <body>
        <div class="email-container">
          ${value}
        </div>
      </body>
      </html>
    `;
  }, [value, subject, settings]);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('compose')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'compose'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ✏️ Compose
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'templates'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📄 Templates
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'preview'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          👁️ Preview
        </button>
      </div>

      {/* Compose Tab */}
      {activeTab === 'compose' && (
        <div className="space-y-6">
          {/* Subject Line */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email subject..."
            />
          </div>

          {/* Quick Components */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Components</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => insertComponent('header')}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
              >
                + Header
              </button>
              <button
                onClick={() => insertComponent('footer')}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
              >
                + Footer
              </button>
              <button
                onClick={() => insertComponent('button')}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
              >
                + Button
              </button>
              <button
                onClick={() => insertComponent('divider')}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
              >
                + Divider
              </button>
              <button
                onClick={() => insertComponent('image')}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
              >
                + Image
              </button>
              <button
                onClick={() => insertComponent('social')}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
              >
                + Social Links
              </button>
            </div>
          </div>

          {/* Rich Text Editor */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Email Content</label>
              <button
                onClick={() => setShowSaveDialog(true)}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm"
              >
                💾 Save as Template
              </button>
            </div>
            <RichTextEditor
              value={value}
              onChange={onChange}
              placeholder="Start composing your email..."
              className="min-h-96"
            />
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Email Templates</h3>
          </div>

          {/* Predefined Templates */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Predefined Templates</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predefinedTemplates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <img src={template.thumbnail} alt={template.name} className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <h5 className="font-medium text-gray-900 mb-2">{template.name}</h5>
                    <button
                      onClick={() => applyTemplate(template)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Templates */}
          {savedTemplates.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Your Saved Templates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <img src={template.thumbnail} alt={template.name} className="w-full h-32 object-cover" />
                    <div className="p-4">
                      <h5 className="font-medium text-gray-900 mb-2">{template.name}</h5>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => applyTemplate(template)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          Use
                        </button>
                        <button
                          onClick={() => deleteTemplate(template.id)}
                          className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Email Preview</h3>
            <div className="text-sm text-gray-600">
              Subject: <span className="font-medium">{subject || 'No subject'}</span>
            </div>
          </div>
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <iframe
              srcDoc={generatePreview()}
              className="w-full h-96"
              title="Email Preview"
            />
          </div>
          <div className="text-xs text-gray-500 text-center">
            This is how your email will appear to recipients
          </div>
        </div>
      )}

      {/* Save Template Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Save Template</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter template name..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveTemplate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTemplateBuilder;