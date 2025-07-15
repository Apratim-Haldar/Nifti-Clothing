import React from "react"
import { Link } from "react-router-dom"

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-50">
      {/* Clean geometric background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-stone-500/5 to-stone-600/5 transform rotate-45 rounded-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-stone-400/5 to-stone-500/5 transform -rotate-12 rounded-3xl"></div>
        <div className="absolute bottom-40 left-1/4 w-32 h-32 bg-gradient-to-br from-stone-600/5 to-stone-700/5 transform rotate-12 rounded-3xl"></div>
      </div>

      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-px bg-stone-500"></div>
              <img src="logo.jpg" alt="Nifti" className="w-12 h-12 mx-6" />
              <div className="w-16 h-px bg-stone-500"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extralight mb-8 text-stone-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xl text-stone-600 font-light max-w-3xl mx-auto leading-relaxed">
              Your privacy is paramount to us. Learn how we protect and handle your personal information.
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/80 backdrop-blur-xl border border-stone-100 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-10 md:p-16">
              <div className="prose prose-slate max-w-none">
                <div className="mb-12">
                  <p className="text-lg text-stone-600 font-light leading-relaxed">
                    At Nifti Clothing, we are committed to protecting your privacy and ensuring the security of your personal information. 
                    This Privacy Policy explains how we collect, use, protect, and handle your data.
                  </p>
                  <p className="text-sm text-stone-500 mt-4">Last updated: January 2025</p>
                </div>

                {/* Information We Collect */}
                <div className="mb-12 p-8 bg-gradient-to-r from-stone-50 to-slate-50 rounded-2xl border border-stone-100">
                  <h2 className="text-2xl font-light text-stone-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Information We Collect
                  </h2>
                  <div className="space-y-4 text-stone-700">
                    <p>We collect information you provide directly to us, such as when you:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Create an account or make a purchase</li>
                      <li>Subscribe to our newsletter</li>
                      <li>Contact our customer service</li>
                      <li>Participate in surveys or promotions</li>
                    </ul>
                  </div>
                </div>

                {/* How We Use Information */}
                <div className="mb-12 p-8 bg-gradient-to-r from-slate-50 to-stone-50 rounded-2xl border border-slate-100">
                  <h2 className="text-2xl font-light text-stone-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    How We Use Your Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-stone-600">
                        <span className="w-2 h-2 bg-stone-400 rounded-full mr-3"></span>
                        Process and fulfill your orders
                      </div>
                      <div className="flex items-center text-stone-600">
                        <span className="w-2 h-2 bg-stone-400 rounded-full mr-3"></span>
                        Send you updates about your orders
                      </div>
                      <div className="flex items-center text-stone-600">
                        <span className="w-2 h-2 bg-stone-400 rounded-full mr-3"></span>
                        Improve our products and services
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center text-stone-600">
                        <span className="w-2 h-2 bg-stone-400 rounded-full mr-3"></span>
                        Provide customer support
                      </div>
                      <div className="flex items-center text-stone-600">
                        <span className="w-2 h-2 bg-stone-400 rounded-full mr-3"></span>
                        Send marketing communications
                      </div>
                      <div className="flex items-center text-stone-600">
                        <span className="w-2 h-2 bg-stone-400 rounded-full mr-3"></span>
                        Prevent fraud and abuse
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Security */}
                <div className="mb-12 p-8 bg-gradient-to-r from-stone-50 to-slate-50 rounded-2xl border border-stone-100">
                  <h2 className="text-2xl font-light text-stone-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Data Security
                  </h2>
                  <p className="text-stone-700 leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, 
                    alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments.
                  </p>
                </div>

                {/* Your Rights */}
                <div className="mb-12 p-8 bg-gradient-to-r from-slate-50 to-stone-50 rounded-2xl border border-slate-100">
                  <h2 className="text-2xl font-light text-stone-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Your Rights
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-white rounded-xl border border-stone-200">
                      <h3 className="font-medium text-stone-900 mb-2">Access & Portability</h3>
                      <p className="text-stone-600 text-sm">Request a copy of your personal data</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-stone-200">
                      <h3 className="font-medium text-stone-900 mb-2">Correction</h3>
                      <p className="text-stone-600 text-sm">Update or correct your information</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-stone-200">
                      <h3 className="font-medium text-stone-900 mb-2">Deletion</h3>
                      <p className="text-stone-600 text-sm">Request deletion of your data</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-stone-200">
                      <h3 className="font-medium text-stone-900 mb-2">Opt-out</h3>
                      <p className="text-stone-600 text-sm">Unsubscribe from marketing emails</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="p-8 bg-gradient-to-r from-stone-900 to-slate-900 rounded-2xl text-white">
                  <div className="flex items-center mb-6">
                    <img src="logo.jpg" alt="Nifti" className="w-8 h-8 mr-4" />
                    <h3 className="text-2xl font-light">Contact Us</h3>
                  </div>
                  <p className="mb-6 text-white/90">
                    If you have any questions about this Privacy Policy, please contact us:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>nifti07@gmail.com</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="inline-flex items-center bg-gradient-to-r from-stone-500 to-stone-600 text-white px-8 py-3 rounded-xl hover:from-stone-600 hover:to-stone-700 transition-all duration-300 font-medium transform hover:scale-105"
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
