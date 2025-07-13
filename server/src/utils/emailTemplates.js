// Newsletter email templates with customization support

const generateWelcomeNewsletterHTML = (email, customization = {}) => {
  const {
    primaryColor = '#1e293b',
    secondaryColor = '#334155',
    accentColor = '#0d9488',
    companyName = 'NIFTI',
    logoUrl = '',
    websiteUrl = process.env.CLIENT_URL || 'https://nifticlothing.com'
  } = customization;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ${companyName} Newsletter</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); padding: 40px 30px; text-align: center;">
          ${logoUrl ? `<img src="${logoUrl}" alt="${companyName}" style="height: 40px; margin-bottom: 16px;">` : ''}
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 2px;">${companyName}</h1>
          <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Premium Fashion, Exclusive Updates</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 400;">Welcome to Our Style Community!</h2>
          
          <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
            Thank you for subscribing to the ${companyName} newsletter! You're now part of an exclusive community that gets first access to:
          </p>
          
          <!-- Benefits List -->
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 30px; margin: 30px 0;">
            <ul style="color: #374151; margin: 0; padding: 0; list-style: none;">
              <li style="margin-bottom: 15px; padding-left: 25px; position: relative;">
                <span style="position: absolute; left: 0; color: ${accentColor};">✦</span>
                <strong>Early Access</strong> to new collections
              </li>
              <li style="margin-bottom: 15px; padding-left: 25px; position: relative;">
                <span style="position: absolute; left: 0; color: ${accentColor};">✦</span>
                <strong>Exclusive Discounts</strong> and special offers
              </li>
              <li style="margin-bottom: 15px; padding-left: 25px; position: relative;">
                <span style="position: absolute; left: 0; color: ${accentColor};">✦</span>
                <strong>Style Tips</strong> from fashion experts
              </li>
              <li style="margin-bottom: 0; padding-left: 25px; position: relative;">
                <span style="position: absolute; left: 0; color: ${accentColor};">✦</span>
                <strong>Behind-the-scenes</strong> content
              </li>
            </ul>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${websiteUrl}/products" style="display: inline-block; background: linear-gradient(135deg, ${accentColor}, ${accentColor}dd); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 1px;">
              EXPLORE COLLECTION
            </a>
          </div>
          
          <p style="color: #6b7280; margin: 20px 0; font-size: 14px; line-height: 1.6;">
            Stay tuned for exciting updates and exclusive content coming your way!
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px;">
            Questions? Contact us at 
            <a href="mailto:nifti07@gmail.com" style="color: ${primaryColor}; text-decoration: none;">nifti07@gmail.com</a>
          </p>
          <p style="color: #9ca3af; margin: 0 0 15px 0; font-size: 12px;">
            You received this email because you subscribed to our newsletter.
          </p>
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            <a href="${websiteUrl}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a> |
            © ${new Date().getFullYear()} ${companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateNewsletterHTML = (subject, content, unsubscribeLink, customization = {}) => {
  const {
    primaryColor = '#1e293b',
    secondaryColor = '#334155',
    accentColor = '#0d9488',
    companyName = 'NIFTI',
    logoUrl = '',
    websiteUrl = process.env.CLIENT_URL || 'https://nifticlothing.com',
    headerImage = '',
    footerText = ''
  } = customization;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); padding: 40px 30px; text-align: center;">
          ${logoUrl ? `<img src="${logoUrl}" alt="${companyName}" style="height: 40px; margin-bottom: 16px;">` : ''}
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 2px;">${companyName}</h1>
          <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Premium Fashion Newsletter</p>
        </div>
        
        ${headerImage ? `
        <!-- Header Image -->
        <div style="text-align: center;">
          <img src="${headerImage}" alt="Newsletter Header" style="max-width: 100%; height: auto; display: block;">
        </div>
        ` : ''}
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 400;">${subject}</h2>
          
          <div style="color: #6b7280; font-size: 16px; line-height: 1.6;">
            ${content}
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${websiteUrl}/products" style="display: inline-block; background: linear-gradient(135deg, ${accentColor}, ${accentColor}dd); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 1px;">
              SHOP NOW
            </a>
          </div>
          
          ${footerText ? `
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 30px 0; border-left: 4px solid ${accentColor};">
            <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.6;">${footerText}</p>
          </div>
          ` : ''}
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px;">
            Questions? Contact us at 
            <a href="mailto:nifti07@gmail.com" style="color: ${primaryColor}; text-decoration: none;">nifti07@gmail.com</a>
          </p>
          <p style="color: #9ca3af; margin: 0 0 15px 0; font-size: 12px;">
            You received this email because you subscribed to our newsletter.
          </p>
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            <a href="${unsubscribeLink}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a> |
            © ${new Date().getFullYear()} ${companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  generateWelcomeNewsletterHTML,
  generateNewsletterHTML
};