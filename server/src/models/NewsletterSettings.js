const mongoose = require('mongoose');

const newsletterSettingsSchema = new mongoose.Schema({
  primaryColor: {
    type: String,
    default: '#1e293b'
  },
  secondaryColor: {
    type: String,
    default: '#334155'
  },
  accentColor: {
    type: String,
    default: '#0d9488'
  },
  companyName: {
    type: String,
    default: 'NIFTI'
  },
  logoUrl: {
    type: String,
    default: ''
  },
  websiteUrl: {
    type: String,
    default: process.env.CLIENT_URL || 'https://nifticlothing.com'
  },
  headerImage: {
    type: String,
    default: ''
  },
  footerText: {
    type: String,
    default: ''
  },
  socialLinks: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  customCSS: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NewsletterSettings', newsletterSettingsSchema);