import type React from "react"
import { Link } from "react-router-dom"

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50">
      {/* Geometric Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-teal-500/5 to-teal-600/5 transform rotate-45 rounded-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-teal-400/5 to-teal-500/5 transform -rotate-12 rounded-3xl"></div>
        <div className="absolute bottom-40 left-1/4 w-32 h-32 bg-gradient-to-br from-teal-600/5 to-teal-700/5 transform rotate-12 rounded-3xl"></div>
      </div>

      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-px bg-teal-500"></div>
              <img src="logo.jpg" alt="Nifti" className="w-12 h-12 mx-6" />
              <div className="w-16 h-px bg-teal-500"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extralight mb-8 text-slate-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xl text-slate-600 font-light max-w-3xl mx-auto leading-relaxed">
              Your privacy is paramount to us. Learn how we protect and handle your personal information.
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/80 backdrop-blur-xl border border-teal-100 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-10 md:p-16">
              <div className="prose prose-slate max-w-none">
                <div className="mb-12">
                  <p className="text-lg text-slate-600 font-light leading-relaxed">
                    At Nifti Clothing, we are committed to protecting your privacy and ensuring the security of your personal information. 
                    This Privacy Policy explains how we collect, use, protect, and handle your data.
                  </p>
                  <p className="text-sm text-slate-500 mt-4">Last updated: January 2025</p>
                </div>

                {/* Information We Collect */}
                <div className="mb-12 p-8 bg-gradient-to-r from-teal-50 to-slate-50 rounded-2xl border border-teal-100">
                  <h2 className="text-2xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">1</span>
                    Information We Collect
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 mb-3">Personal Information</h3>
                      <ul className="text-slate-700 space-y-2 ml-4">
                        <li>• Name, email address, and phone number</li>
                        <li>• Billing and shipping addresses</li>
                        <li>• Payment information (processed securely through payment gateways)</li>
                        <li>• Account preferences and communication settings</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 mb-3">Usage Information</h3>
                      <ul className="text-slate-700 space-y-2 ml-4">
                        <li>• Browser type, device information, and IP address</li>
                        <li>• Pages visited and time spent on our website</li>
                        <li>• Shopping behavior and preferences</li>
                        <li>• Referral source and affiliate interactions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* How We Use Your Information */}
                <div className="mb-12 p-8 bg-gradient-to-r from-slate-50 to-teal-50 rounded-2xl border border-slate-100">
                  <h2 className="text-2xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-slate-700 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">2</span>
                    How We Use Your Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-slate-800">Essential Operations</h3>
                      <ul className="text-slate-700 space-y-2 text-sm">
                        <li>• Process and fulfill your orders</li>
                        <li>• Communicate about your purchases</li>
                        <li>• Provide customer support</li>
                        <li>• Manage your account and preferences</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-slate-800">Improvements & Marketing</h3>
                      <ul className="text-slate-700 space-y-2 text-sm">
                        <li>• Improve our website and services</li>
                        <li>• Send promotional offers (with consent)</li>
                        <li>• Personalize your shopping experience</li>
                        <li>• Analyze trends and user behavior</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Data Protection */}
                <div className="mb-12 p-8 bg-gradient-to-r from-teal-50 to-slate-50 rounded-2xl border border-teal-100">
                  <h2 className="text-2xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">3</span>
                    Data Protection & Security
                  </h2>
                  <div className="space-y-4 text-slate-700 leading-relaxed">
                    <p>We implement industry-standard security measures to protect your personal information:</p>
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <h4 className="font-medium text-slate-800 mb-2">Encryption</h4>
                        <p className="text-sm text-slate-600">All sensitive data is encrypted in transit and at rest using SSL/TLS protocols.</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <h4 className="font-medium text-slate-800 mb-2">Secure Payments</h4>
                        <p className="text-sm text-slate-600">Payment processing through trusted, PCI-compliant payment gateways.</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <h4 className="font-medium text-slate-800 mb-2">Access Controls</h4>
                        <p className="text-sm text-slate-600">Limited access to personal data on a need-to-know basis only.</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <h4 className="font-medium text-slate-800 mb-2">Regular Audits</h4>
                        <p className="text-sm text-slate-600">Regular security assessments and vulnerability testing.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Sharing */}
                <div className="mb-12 p-8 bg-gradient-to-r from-slate-50 to-teal-50 rounded-2xl border border-slate-100">
                  <h2 className="text-2xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-slate-700 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">4</span>
                    Data Sharing & Disclosure
                  </h2>
                  <div className="space-y-4 text-slate-700 leading-relaxed">
                    <p className="font-medium text-slate-800">We do not sell, trade, or rent your personal information to third parties.</p>
                    <p>We may share limited information with trusted partners only when necessary:</p>
                    <ul className="space-y-3 ml-4 mt-4">
                      <li>• <strong>Shipping Partners:</strong> Name and address for order delivery</li>
                      <li>• <strong>Payment Processors:</strong> Transaction data for payment processing</li>
                      <li>• <strong>Service Providers:</strong> Technical support and maintenance services</li>
                      <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                    </ul>
                  </div>
                </div>

                {/* Your Rights */}
                <div className="mb-12 p-8 bg-gradient-to-r from-teal-50 to-slate-50 rounded-2xl border border-teal-100">
                  <h2 className="text-2xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">5</span>
                    Your Rights & Choices
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <h4 className="font-medium text-slate-800 mb-2">Access & Update</h4>
                        <p className="text-sm text-slate-600">View and update your personal information through your account settings.</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <h4 className="font-medium text-slate-800 mb-2">Data Deletion</h4>
                        <p className="text-sm text-slate-600">Request deletion of your personal data (subject to legal requirements).</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <h4 className="font-medium text-slate-800 mb-2">Marketing Preferences</h4>
                        <p className="text-sm text-slate-600">Opt-out of promotional emails at any time using the unsubscribe link.</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <h4 className="font-medium text-slate-800 mb-2">Data Portability</h4>
                        <p className="text-sm text-slate-600">Request a copy of your data in a commonly used format.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cookies and Tracking */}
                <div className="mb-12 p-8 bg-gradient-to-r from-slate-50 to-teal-50 rounded-2xl border border-slate-100">
                  <h2 className="text-2xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-slate-700 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">6</span>
                    Cookies & Tracking
                  </h2>
                  <div className="space-y-4 text-slate-700 leading-relaxed">
                    <p>We use cookies and similar technologies to enhance your browsing experience:</p>
                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <h4 className="font-medium text-slate-800 mb-2">Essential Cookies</h4>
                        <p className="text-sm text-slate-600">Required for website functionality and security.</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <h4 className="font-medium text-slate-800 mb-2">Analytics Cookies</h4>
                        <p className="text-sm text-slate-600">Help us understand how visitors interact with our website.</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <h4 className="font-medium text-slate-800 mb-2">Marketing Cookies</h4>
                        <p className="text-sm text-slate-600">Used to personalize ads and track campaign effectiveness.</p>
                      </div>
                    </div>
                    <p className="text-sm mt-4">You can manage cookie preferences through your browser settings.</p>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="p-8 bg-gradient-to-r from-slate-900 to-teal-900 rounded-2xl text-white">
                  <div className="flex items-center mb-6">
                    <img src="logo.jpg" alt="Nifti" className="w-8 h-8 mr-4 filter" />
                    <h3 className="text-2xl font-light">Privacy Concerns?</h3>
                  </div>
                  <p className="mb-6 text-white/90">If you have questions about this Privacy Policy or how we handle your data, please contact us:</p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>nifti07@gmail.com</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>+91 8100371049</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-16 text-center">
            <Link
              to="/"
              className="inline-flex items-center bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-3 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 font-medium transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicy
