// Enhanced Newsletter Template System
// Provides professional, theme-based newsletter templates with customizable placeholders

const generateModernNewsletterHTML = (templateData) => {
  const {
    subject = 'Newsletter Update',
    companyName = 'NIFTI CLOTHING',
    logoUrl = '',
    headerImage = '',
    mainTitle = subject,
    description = 'Stay updated with our latest collection and exclusive offers.',
    buttonText = 'SHOP NOW',
    buttonUrl = '',
    footerMessage = 'Thank you for being part of our fashion community!',
    unsubscribeUrl = '',
    websiteUrl = process.env.CLIENT_URL || 'https://nifticlothing.com',
    primaryColor = '#1e293b',
    accentColor = '#0d9488'
  } = templateData;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${subject}</title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
      <style>
        /* Reset styles */
        body, table, td, p, a, li, blockquote {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        table, td {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
        img {
          -ms-interpolation-mode: bicubic;
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
        }
        
        /* Client-specific styles */
        .ReadMsgBody { width: 100%; }
        .ExternalClass { width: 100%; }
        .ExternalClass * { line-height: 100%; }
        
        /* Mobile styles */
        @media only screen and (max-width: 600px) {
          .mobile-hide { display: none !important; }
          .mobile-center { text-align: center !important; }
          .mobile-full-width { width: 100% !important; }
          .mobile-padding { padding: 20px !important; }
          .mobile-text-size { font-size: 16px !important; line-height: 24px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Arial', 'Helvetica', sans-serif;">
      
      <!-- Email Container -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            
            <!-- Main Email Table -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <!-- Header Section -->
              <tr>
                <td style="background: linear-gradient(135deg, ${primaryColor} 0%, #334155 100%); padding: 40px 30px; text-align: center;">
                  ${logoUrl ? `
                  <img src="${logoUrl}" alt="${companyName}" style="height: 50px; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
                  ` : ''}
                  <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 3px; text-transform: uppercase;">
                    ${companyName}
                  </h1>
                  <p style="color: #ffffff; margin: 15px 0 0 0; opacity: 0.9; font-size: 16px; letter-spacing: 1px;">
                    Premium Fashion • Exclusive Updates
                  </p>
                </td>
              </tr>
              
              ${headerImage ? `
              <!-- Hero Image Section -->
              <tr>
                <td style="padding: 0; text-align: center;">
                  <img src="${headerImage}" alt="Newsletter Header" style="width: 100%; max-width: 600px; height: auto; display: block;">
                </td>
              </tr>
              ` : ''}
              
              <!-- Main Content Section -->
              <tr>
                <td style="padding: 50px 40px;">
                  
                  <!-- Main Title -->
                  <h2 style="color: ${primaryColor}; margin: 0 0 25px 0; font-size: 28px; font-weight: 400; line-height: 1.3; text-align: center;">
                    ${mainTitle}
                  </h2>
                  
                  <!-- Description -->
                  <div style="color: #6b7280; font-size: 16px; line-height: 1.8; text-align: center; margin-bottom: 40px;">
                    ${description}
                  </div>
                  
                  <!-- CTA Button -->
                  ${buttonText && buttonUrl ? `
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="border-radius: 8px; background: linear-gradient(135deg, ${accentColor}, ${accentColor}dd);">
                              <a href="${buttonUrl}" style="display: inline-block; padding: 18px 40px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; letter-spacing: 1px; text-transform: uppercase;">
                                ${buttonText}
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  ` : ''}
                  
                  <!-- Features Section -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 50px;">
                    <tr>
                      <td style="background-color: #f8fafc; border-radius: 12px; padding: 30px;">
                        <h3 style="color: ${primaryColor}; margin: 0 0 20px 0; font-size: 20px; font-weight: 500; text-align: center;">
                          Why Choose ${companyName}?
                        </h3>
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="text-align: center; padding: 15px; vertical-align: top;" width="33.33%">
                              <div style="color: ${accentColor}; font-size: 24px; margin-bottom: 10px;">✨</div>
                              <div style="color: #374151; font-size: 14px; font-weight: 600;">Premium Quality</div>
                            </td>
                            <td style="text-align: center; padding: 15px; vertical-align: top;" width="33.33%">
                              <div style="color: ${accentColor}; font-size: 24px; margin-bottom: 10px;">🚚</div>
                              <div style="color: #374151; font-size: 14px; font-weight: 600;">Fast Delivery</div>
                            </td>
                            <td style="text-align: center; padding: 15px; vertical-align: top;" width="33.33%">
                              <div style="color: ${accentColor}; font-size: 24px; margin-bottom: 10px;">💎</div>
                              <div style="color: #374151; font-size: 14px; font-weight: 600;">Exclusive Designs</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Footer Message -->
                  ${footerMessage ? `
                  <div style="text-align: center; margin-top: 40px; padding: 25px; background: linear-gradient(135deg, #f1f5f9, #e2e8f0); border-radius: 8px; border-left: 4px solid ${accentColor};">
                    <p style="color: #6b7280; margin: 0; font-size: 15px; line-height: 1.6; font-style: italic;">
                      ${footerMessage}
                    </p>
                  </div>
                  ` : ''}
                </td>
              </tr>
              
              <!-- Social Links Section -->
              <tr>
                <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <h4 style="color: ${primaryColor}; margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">
                    Follow Us
                  </h4>
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                    <tr>
                      <td style="padding: 0 10px;">
                        <a href="${websiteUrl}" style="display: inline-block; width: 40px; height: 40px; background-color: ${accentColor}; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; font-weight: bold;">
                          W
                        </a>
                      </td>
                      <td style="padding: 0 10px;">
                        <a href="#" style="display: inline-block; width: 40px; height: 40px; background-color: #1da1f2; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; font-weight: bold;">
                          T
                        </a>
                      </td>
                      <td style="padding: 0 10px;">
                        <a href="#" style="display: inline-block; width: 40px; height: 40px; background-color: #E4405F; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; font-weight: bold;">
                          I
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer Section -->
              <tr>
                <td style="background-color: ${primaryColor}; color: #ffffff; padding: 30px; text-align: center;">
                  <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.9;">
                    Contact us: 
                    <a href="mailto:nifti07@gmail.com" style="color: #ffffff; text-decoration: underline;">nifti07@gmail.com</a>
                    | Phone: +91-8100371049
                  </p>
                  <p style="margin: 0 0 15px 0; font-size: 12px; opacity: 0.8;">
                    You received this email because you subscribed to our newsletter.
                  </p>
                  <p style="margin: 0; font-size: 12px; opacity: 0.8;">
                    <a href="${unsubscribeUrl}" style="color: #ffffff; text-decoration: underline;">Unsubscribe</a> |
                    © ${new Date().getFullYear()} ${companyName}. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
            
          </td>
        </tr>
      </table>
      
    </body>
    </html>
  `;
};

const generateWelcomeNewsletterHTML = (email, customization = {}) => {
  return generateModernNewsletterHTML({
    subject: 'Welcome to Our Style Community!',
    mainTitle: 'Welcome to NIFTI!',
    description: `
      <p style="margin-bottom: 20px;">Thank you for joining our exclusive fashion community! You're now part of a select group that gets first access to:</p>
      <ul style="text-align: left; max-width: 400px; margin: 0 auto; padding-left: 20px;">
        <li style="margin-bottom: 10px;"><strong>Early Access</strong> to new collections</li>
        <li style="margin-bottom: 10px;"><strong>Exclusive Discounts</strong> and special offers</li>
        <li style="margin-bottom: 10px;"><strong>Style Tips</strong> from fashion experts</li>
        <li style="margin-bottom: 10px;"><strong>Behind-the-scenes</strong> content</li>
      </ul>
      <p style="margin-top: 25px;">Get ready for an exciting fashion journey!</p>
    `,
    buttonText: 'EXPLORE COLLECTION',
    buttonUrl: `${process.env.CLIENT_URL || 'https://nifticlothing.com'}/products`,
    footerMessage: 'Welcome aboard! We\'re excited to have you in our fashion community.',
    unsubscribeUrl: `${process.env.CLIENT_URL || 'https://nifticlothing.com'}/unsubscribe?email=${encodeURIComponent(email)}`,
    ...customization
  });
};

const generateCustomNewsletterHTML = (templateData) => {
  return generateModernNewsletterHTML(templateData);
};

module.exports = {
  generateWelcomeNewsletterHTML,
  generateCustomNewsletterHTML,
  generateModernNewsletterHTML
};
