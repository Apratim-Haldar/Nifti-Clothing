import React from "react"
import { Link } from "react-router-dom"

const CancellationRefunds: React.FC = () => {
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
              Cancellation & Refunds
            </h1>
            <p className="text-xl text-stone-600 font-light max-w-3xl mx-auto leading-relaxed">
              Your satisfaction is our priority. Learn about our flexible cancellation and refund policies.
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/80 backdrop-blur-xl border border-stone-100 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-10 md:p-16">
              <div className="prose prose-slate max-w-none">
                <div className="mb-12">
                  <p className="text-lg text-stone-600 font-light leading-relaxed">
                    At Nifti Clothing, we want you to be completely satisfied with your purchase. Our cancellation and
                    refund policy is designed to provide you with flexibility while maintaining fairness for all our
                    customers.
                  </p>
                  <p className="text-sm text-stone-500 mt-4">Last updated: January 2025</p>
                </div>

                {/* Order Cancellation */}
                <div className="mb-12 p-8 bg-gradient-to-r from-stone-50 to-slate-50 rounded-2xl border border-stone-100">
                  <h2 className="text-2xl font-light text-stone-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Order Cancellation
                  </h2>
                  <div className="space-y-6">
                    <div className="p-6 bg-white rounded-xl border border-stone-200">
                      <h3 className="text-lg font-medium text-stone-900 mb-3">Before Order Processing</h3>
                      <p className="text-stone-600 leading-relaxed">
                        You can cancel your order free of charge within 2 hours of placing it, as long as it hasn't
                        entered the processing stage. Simply contact our support team or use your account dashboard.
                      </p>
                    </div>

                    <div className="p-6 bg-white rounded-xl border border-stone-200">
                      <h3 className="text-lg font-medium text-stone-900 mb-3">After Order Processing</h3>
                      <p className="text-stone-600 leading-relaxed">
                        Once your order is being processed or has shipped, cancellation may not be possible. However,
                        you can still return the item once received following our return policy.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Returns Policy */}
                <div className="mb-12 p-8 bg-gradient-to-r from-slate-50 to-stone-50 rounded-2xl border border-slate-100">
                  <h2 className="text-2xl font-light text-stone-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Returns Policy
                  </h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6 bg-white rounded-xl border border-stone-200">
                        <h3 className="text-lg font-medium text-stone-900 mb-3">Return Window</h3>
                        <p className="text-stone-600">7 days from delivery date</p>
                      </div>
                      <div className="p-6 bg-white rounded-xl border border-stone-200">
                        <h3 className="text-lg font-medium text-stone-900 mb-3">Condition</h3>
                        <p className="text-stone-600">Items must be unworn with original tags</p>
                      </div>
                    </div>
                    <div className="p-6 bg-white rounded-xl border border-stone-200">
                      <h3 className="text-lg font-medium text-stone-900 mb-3">Return Process</h3>
                      <ol className="list-decimal list-inside space-y-2 text-stone-600">
                        <li>Contact our support team to initiate a return</li>
                        <li>Receive return authorization and shipping label</li>
                        <li>Pack items securely in original packaging</li>
                        <li>Drop off at designated courier service</li>
                        <li>Track your return using the provided tracking number</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Refund Process */}
                <div className="mb-12 p-8 bg-gradient-to-r from-stone-50 to-slate-50 rounded-2xl border border-stone-100">
                  <h2 className="text-2xl font-light text-stone-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Refund Process
                  </h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="p-6 bg-white rounded-xl border border-stone-200 text-center">
                        <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-xl font-semibold text-stone-700">1</span>
                        </div>
                        <h3 className="text-lg font-medium text-stone-900 mb-2">Inspection</h3>
                        <p className="text-stone-600">2-3 business days</p>
                      </div>
                      <div className="p-6 bg-white rounded-xl border border-stone-200 text-center">
                        <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-xl font-semibold text-stone-700">2</span>
                        </div>
                        <h3 className="text-lg font-medium text-stone-900 mb-2">Processing</h3>
                        <p className="text-stone-600">1-2 business days</p>
                      </div>
                      <div className="p-6 bg-white rounded-xl border border-stone-200 text-center">
                        <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-xl font-semibold text-stone-700">3</span>
                        </div>
                        <h3 className="text-lg font-medium text-stone-900 mb-2">Refund</h3>
                        <p className="text-stone-600">3-7 business days</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Non-Returnable Items */}
                <div className="mb-12 p-8 bg-gradient-to-r from-slate-50 to-stone-50 rounded-2xl border border-slate-100">
                  <h2 className="text-2xl font-light text-stone-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                    Non-Returnable Items
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-stone-600">
                        <span className="w-2 h-2 bg-stone-400 rounded-full mr-3"></span>
                        Undergarments and intimate apparel
                      </div>
                      <div className="flex items-center text-stone-600">
                        <span className="w-2 h-2 bg-stone-400 rounded-full mr-3"></span>
                        Items with hygiene seals that have been opened
                      </div>
                      <div className="flex items-center text-stone-600">
                        <span className="w-2 h-2 bg-stone-400 rounded-full mr-3"></span>
                        Customized or personalized items
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center text-stone-600">
                        <span className="w-2 h-2 bg-stone-400 rounded-full mr-3"></span>
                        Items damaged by misuse
                      </div>
                      <div className="flex items-center text-stone-600">
                        <span className="w-2 h-2 bg-stone-400 rounded-full mr-3"></span>
                        Sale items marked as final sale
                      </div>
                      <div className="flex items-center text-stone-600">
                        <span className="w-2 h-2 bg-stone-400 rounded-full mr-3"></span>
                        Items returned after 30 days
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="p-8 bg-gradient-to-r from-stone-900 to-slate-900 rounded-2xl text-white">
                  <div className="flex items-center mb-6">
                    <img src="logo.jpg" alt="Nifti" className="w-8 h-8 mr-4" />
                    <h3 className="text-2xl font-light">Need Help with Returns?</h3>
                  </div>
                  <p className="mb-6 text-white/90">
                    Have questions about cancellations or returns? Our support team is here to help:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>nifti07@gmail.com</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>+91 8100371049</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                    <p className="text-sm text-white/90">
                      <strong>Pro Tip:</strong> Keep your order confirmation email and tracking details handy when
                      contacting us for faster assistance.
                    </p>
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

export default CancellationRefunds
