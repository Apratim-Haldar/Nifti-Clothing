const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const { generateWelcomeNewsletterHTML, generateNewsletterHTML } = require('./emailTemplates');
dotenv.config();

// OAuth2 setup
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
  });

  try {
    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject("Failed to create access token");
        }
        resolve(token);
      });
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        accessToken,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN
      }
    });

    return transporter;
  } catch (error) {
    console.error("Error creating transporter:", error);
    throw error;
  }
};

const generateOrderEmailHTML = (orderData, isAdmin = false) => {
  const { user, items, totalAmount, orderNumber, createdAt } = orderData;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: #f9f9f9;
        }
        .container { background-color: white; margin: 20px auto; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1e293b, #334155); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px; }
        .header h2 { margin: 10px 0 0 0; font-size: 18px; font-weight: 300; opacity: 0.9; }
        .content { padding: 30px; }
        .order-details { 
          background: #f8fafc; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0; 
          border-left: 4px solid #1e293b;
        }
        .order-details h3 { margin-top: 0; color: #1e293b; font-size: 18px; }
        .item { 
          border-bottom: 1px solid #e2e8f0; 
          padding: 15px 0; 
          display: flex; 
          justify-content: space-between; 
          align-items: center;
        }
        .item:last-child { border-bottom: none; }
        .item-details { flex: 1; }
        .item-price { font-weight: 600; color: #1e293b; font-size: 16px; }
        .total { 
          background: #1e293b; 
          color: white; 
          padding: 20px; 
          font-weight: bold; 
          text-align: center; 
          font-size: 20px;
          border-radius: 8px;
        }
        .footer { 
          background: #f1f5f9; 
          padding: 30px; 
          text-align: center; 
          font-size: 14px; 
          color: #64748b;
        }
        .highlight { color: #1e293b; font-weight: 600; }
        .steps { background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .steps ul { margin: 0; padding-left: 20px; }
        .steps li { margin: 8px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>NIFTI CLOTHING</h1>
          <h2>${isAdmin ? 'New Order Alert 🔔' : 'Order Confirmation ✅'}</h2>
        </div>
        
        <div class="content">
          <p>Dear ${isAdmin ? 'Admin' : user.name},</p>
          <p>${isAdmin ? 
            'A new order has been placed on your website. Please review the details below:' : 
            'Thank you for your order! We\'re excited to get your items to you. Here are your order details:'
          }</p>
          
          <div class="order-details">
            <h3>📋 Order Information</h3>
            <p><span class="highlight">Order Number:</span> ${orderNumber}</p>
            <p><span class="highlight">Order Date:</span> ${new Date(createdAt).toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p><span class="highlight">Status:</span> Pending Payment</p>
          </div>

          <div class="order-details">
            <h3>👤 Customer Information</h3>
            <p><span class="highlight">Name:</span> ${user.name}</p>
            <p><span class="highlight">Email:</span> ${user.email}</p>
            <p><span class="highlight">Phone:</span> ${user.phone}</p>
            <p><span class="highlight">Delivery Address:</span><br>${user.address}</p>
          </div>

          <div class="order-details">
            <h3>🛍️ Order Items</h3>
            ${items.map(item => `
              <div class="item">
                <div class="item-details">
                  <strong>${item.title}</strong><br>
                  <small>Size: ${item.size} | Quantity: ${item.quantity}</small>
                </div>
                <div class="item-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
              </div>
            `).join('')}
            
            <div class="total">
              Total Amount: ₹${totalAmount.toLocaleString('en-IN')}
            </div>
          </div>

          ${!isAdmin ? `
            <div class="steps">
              <h3>📋 What happens next?</h3>
              <ul>
                <li>Our team will review your order within <strong>2-4 hours</strong></li>
                <li>We'll contact you via <strong>phone/WhatsApp</strong> for payment confirmation</li>
                <li>Once payment is received, we'll process and pack your order</li>
                <li>You'll receive <strong>tracking information</strong> via email once shipped</li>
                <li>Estimated delivery: <strong>3-7 business days</strong></li>
              </ul>
            </div>
          ` : `
            <div class="steps">
              <h3>⚡ Action Required</h3>
              <ul>
                <li><strong>Contact customer</strong> within 2-4 hours</li>
                <li><strong>Arrange payment</strong> via preferred method</li>
                <li><strong>Update order status</strong> in admin panel</li>
                <li><strong>Process shipment</strong> once payment confirmed</li>
              </ul>
            </div>
          `}
        </div>

        <div class="footer">
          <p><strong>NIFTI CLOTHING</strong> - Premium Fashion Collection</p>
          <p>📧 ${process.env.EMAIL_USER} | 📱 Support: +91-XXXXXXXXXX</p>
          <p>Questions? Reply to this email and we'll help you out!</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const transporter = await createTransporter();

    // Send email to customer
    console.log('Sending email to customer:', orderData.user.email);
    await transporter.sendMail({
      from: `"NIFTI CLOTHING" <${process.env.EMAIL_USER}>`,
      to: orderData.user.email,
      subject: `✅ Order Confirmed - ${orderData.orderNumber} - NIFTI CLOTHING`,
      html: generateOrderEmailHTML(orderData, false)
    });
    console.log('Customer email sent successfully');

    // Send email to all admins
    const User = require('../models/User');
    const admins = await User.find({ isAdmin: true }).select('email');
    console.log('Found admins:', admins.length);
    
    for (const admin of admins) {
      console.log('Sending email to admin:', admin.email);
      await transporter.sendMail({
        from: `"NIFTI CLOTHING ADMIN" <${process.env.EMAIL_USER}>`,
        to: admin.email,
        subject: `🔔 New Order Alert - ${orderData.orderNumber} - NIFTI CLOTHING`,
        html: generateOrderEmailHTML(orderData, true)
      });
    }
    console.log('All admin emails sent successfully');

  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// OTP Email Function
const sendOTPEmail = async (email, name, otp) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `"NIFTI CLOTHING" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - Nifti Clothing',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification - Nifti</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 2px;">NIFTI</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Premium Fashion, Verified Experience</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 400;">Welcome to Nifti, ${name}!</h2>
              
              <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
                Thank you for choosing Nifti Clothing. To complete your registration and start exploring our premium collection, please verify your email address.
              </p>
              
              <!-- OTP Box -->
              <div style="background-color: #f8fafc; border: 2px solid #1e293b; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                <p style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 500;">Your Verification Code</p>
                <div style="background-color: #ffffff; border: 2px solid #1e293b; border-radius: 8px; padding: 20px; display: inline-block;">
                  <span style="color: #1e293b; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</span>
                </div>
                <p style="color: #374151; margin: 15px 0 0 0; font-size: 14px;">This code expires in 10 minutes</p>
              </div>
              
              <p style="color: #6b7280; margin: 20px 0; font-size: 14px; line-height: 1.6;">
                If you didn't create an account with Nifti, please ignore this email or contact our support team.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px;">
                Need help? Contact us at 
                <a href="mailto:nifti.user.in@gmail.com" style="color: #1e293b; text-decoration: none;">${process.env.EMAIL_USER}</a>
              </p>
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                © ${new Date().getFullYear()} Nifti Clothing. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', result.messageId);
    return result;

  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

// Welcome Email Function
const sendWelcomeEmail = async (user) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `"NIFTI CLOTHING" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome to Nifti - Your Style Journey Begins!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Nifti</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 2px;">NIFTI</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Welcome to Premium Fashion</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 400;">Welcome to Nifti, ${user.name}! 🎉</h2>
              
              <p style="color: #6b7280; margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">
                Congratulations! Your email has been verified and your Nifti account is now active. You're now part of an exclusive community that values premium fashion and sophisticated style.
              </p>
              
              <!-- What's Next -->
              <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; padding: 25px; margin: 25px 0;">
                <h3 style="color: #1e293b; margin: 0 0 20px 0; font-size: 18px;">What's Next?</h3>
                <div style="color: #374151; font-size: 14px; line-height: 1.6;">
                  <p style="margin: 0 0 12px 0;">✨ Explore our premium collection of carefully curated fashion pieces</p>
                  <p style="margin: 0 0 12px 0;">🛒 Add your favorite items to your personalized cart</p>
                  <p style="margin: 0 0 12px 0;">🎯 Join our referral program and earn rewards</p>
                  <p style="margin: 0;">📱 Follow us on social media for style inspiration</p>
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/products" 
                   style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; display: inline-block; letter-spacing: 1px;">
                  START SHOPPING
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px;">
                Questions? We're here to help! 
                <a href="mailto:${process.env.EMAIL_USER}" style="color: #1e293b; text-decoration: none;">${process.env.EMAIL_USER}</a>
              </p>
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                © ${new Date().getFullYear()} Nifti Clothing. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return result;

  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

// Newsletter Functions (Updated)
const sendWelcomeNewsletterEmail = async (email, customization = {}) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `"${customization.companyName || 'NIFTI'} CLOTHING" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎉 Welcome to ${customization.companyName || 'Nifti'} Newsletter - Exclusive Access Awaits!`,
      html: generateWelcomeNewsletterHTML(email, customization)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome newsletter email sent successfully:', result.messageId);
    return result;

  } catch (error) {
    console.error('Error sending welcome newsletter email:', error);
    throw error;
  }
};

const sendNewsletterEmail = async (email, subject, content, unsubscribeLink, customization = {}) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `"${customization.companyName || 'NIFTI'} CLOTHING" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: generateNewsletterHTML(subject, content, unsubscribeLink, customization)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Newsletter email sent successfully to:', email);
    return result;

  } catch (error) {
    console.error('Error sending newsletter email to', email, ':', error);
    throw error;
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendOTPEmail,
  sendWelcomeEmail,
  sendWelcomeNewsletterEmail,
  sendNewsletterEmail
};