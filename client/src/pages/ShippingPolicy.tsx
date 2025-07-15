import React from "react"
import { Link } from "react-router-dom"

const ShippingPolicy: React.FC = () => {
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
              Shipping Policy
            </h1>
            <p className="text-xl text-stone-600 font-light max-w-3xl mx-auto leading-relaxed">
              Fast, secure, and reliable delivery of your premium fashion pieces across India
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/80 backdrop-blur-xl border border-stone-100 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-10 md:p-16">
              <div className="prose prose-slate max-w-none">
                <div className="mb-12">
                  <p className="text-lg text-stone-600 font-light leading-relaxed">
                    At Nifti Clothing, we understand that receiving your premium fashion pieces quickly and safely is important to you. 
                    Our shipping policy is designed to provide transparency and reliability in every delivery.
                  </p>
                  <p className="text-sm text-stone-500 mt-4">Last updated: January 2025</p>
                </div>

                {/* Processing Time */}
                <div className="mb-12 p-8 bg-gradient-to-r from-stone-50 to-slate-50 rounded-2xl border border-stone-100">
                  <h2 className="text-2xl font-light text-stone-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Order Processing
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-xl border border-stone-200">
                      <h3 className="text-lg font-medium text-stone-900 mb-3">Standard Orders</h3>
                      <p className="text-stone-600">1-2 business days processing time</p>
                    </div>
                    <div className="p-6 bg-white rounded-xl border border-stone-200">
                      <h3 className="text-lg font-medium text-stone-900 mb-3">Custom Orders</h3>
                      <p className="text-stone-600">3-5 business days processing time</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Options */}
                <div className="mb-12 p-8 bg-gradient-to-r from-slate-50 to-stone-50 rounded-2xl border border-slate-100">
                  <h2 className="text-2xl font-light text-stone-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Shipping Options
                  </h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="p-6 bg-white rounded-xl border border-stone-200 text-center">
                        <h3 className="text-lg font-medium text-stone-900 mb-2">Standard Delivery</h3>
                        <p className="text-2xl font-bold text-stone-700 mb-2">₹99</p>
                        <p className="text-stone-600 text-sm">5-7 business days</p>
                      </div>
                      <div className="p-6 bg-white rounded-xl border border-stone-200 text-center">
                        <h3 className="text-lg font-medium text-stone-900 mb-2">Express Delivery</h3>
                        <p className="text-2xl font-bold text-stone-700 mb-2">₹199</p>
                        <p className="text-stone-600 text-sm">2-3 business days</p>
                      </div>
                      <div className="p-6 bg-white rounded-xl border border-stone-200 text-center">
                        <h3 className="text-lg font-medium text-stone-900 mb-2">Same Day</h3>
                        <p className="text-2xl font-bold text-stone-700 mb-2">₹299</p>
                        <p className="text-stone-600 text-sm">Selected cities only</p>
                      </div>
                    </div>
                    <div className="p-4 bg-stone-100 rounded-xl">
                      <p className="text-stone-700 text-center">
                        <strong>Free shipping</strong> on orders upto ₹999
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Areas */}
                <div className="mb-12 p-8 bg-gradient-to-r from-stone-50 to-slate-50 rounded-2xl border border-stone-100">
                  <h2 className="text-2xl font-light text-stone-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Delivery Coverage
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-medium text-stone-900">Metro Cities</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-stone-600">
                          <span className="w-2 h-2 bg-stone-400 rounded-full mr-3"></span>
                          Delhi, Mumbai, Bangalore, Chennai
                        </div>
                        <div className="flex items-center text-stone-600">
                          <span className="w-2 h-2 bg-stone-400 rounded-full mr-3"></span>
                          Hyderabad, Pune, Kolkata, Ahmedabad
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-medium text-stone-900">Other Areas</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-stone-600">
                          <span className="w-2 h-2 bg-stone-400 rounded-full mr-3"></span>
                          500+ cities across India
                        </div>
                        <div className="flex items-center text-stone-600">
                          <span className="w-2 h-2 bg-stone-400 rounded-full mr-3"></span>
                          Rural areas (extended delivery time)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking */}
                <div className="mb-12 p-8 bg-gradient-to-r from-slate-50 to-stone-50 rounded-2xl border border-slate-100">
                  <h2 className="text-2xl font-light text-stone-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Order Tracking
                  </h2>
                  <div className="space-y-4">
                    <p className="text-stone-700">
                      Once your order is shipped, you'll receive a tracking number via email and SMS. 
                      You can track your package in real-time through our website or the courier's tracking system.
                    </p>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-white rounded-xl border border-stone-200">
                        <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-sm font-semibold text-stone-700">1</span>
                        </div>
                        <p className="text-sm text-stone-600">Order Confirmed</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl border border-stone-200">
                        <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-sm font-semibold text-stone-700">2</span>
                        </div>
                        <p className="text-sm text-stone-600">Processing</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl border border-stone-200">
                        <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-sm font-semibold text-stone-700">3</span>
                        </div>
                        <p className="text-sm text-stone-600">Shipped</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl border border-stone-200">
                        <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-sm font-semibold text-stone-700">4</span>
                        </div>
                        <p className="text-sm text-stone-600">Delivered</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="p-8 bg-gradient-to-r from-stone-900 to-slate-900 rounded-2xl text-white">
                  <div className="flex items-center mb-6">
                    <img src="logo.jpg" alt="Nifti" className="w-8 h-8 mr-4" />
                    <h3 className="text-2xl font-light">Shipping Questions?</h3>
                  </div>
                  <p className="mb-6 text-white/90">
                    Need help with your delivery? Our customer service team is ready to assist:
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

export default ShippingPolicy
