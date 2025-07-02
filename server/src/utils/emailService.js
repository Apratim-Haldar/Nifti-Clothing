const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const dotenv = require('dotenv');
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

const sendEmail = async (to, subject, html) => {
  const transporter = await createTransporter();
  await transporter.sendMail({ 
    from: `"NIFTI CLOTHING" <${process.env.EMAIL_USER}>`, 
    to, 
    subject, 
    html 
  });
};

module.exports = { sendEmail, sendOrderConfirmationEmail };