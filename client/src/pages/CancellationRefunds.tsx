import type React from "react"
import { Link } from "react-router-dom"

const CancellationRefunds: React.FC = () => {
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
              Cancellation & Refunds
            </h1>
            <p className="text-xl text-slate-600 font-light max-w-3xl mx-auto leading-relaxed">
              Your satisfaction is our priority. Learn about our flexible cancellation and refund policies.
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/80 backdrop-blur-xl border border-teal-100 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-10 md:p-16">
              <div className="prose prose-slate max-w-none">
                <div className="mb-12">
                  <p className="text-lg text-slate-600 font-light leading-relaxed">
                    At Nifti Clothing, we want you to be completely satisfied with your purchase. Our cancellation and
                    refund policy is designed to provide you with flexibility while maintaining fairness for all our
                    customers.
                  </p>
                  <p className="text-sm text-slate-500 mt-4">Last updated: January 2025</p>
                </div>

                {/* Order Cancellation */}
                <div className="mb-12 p-8 bg-gradient-to-r from-teal-50 to-slate-50 rounded-2xl border border-teal-100">
                  <h2 className="text-2xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                      1
                    </span>
                    Order Cancellation
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 mb-4">Before Dispatch</h3>
                      <div className="bg-white p-6 rounded-xl border border-slate-200">
                        <ul className="space-y-3 text-slate-700">
                          <li className="flex items-start">
                            <svg
                              className="w-5 h-5 text-green-500 mr-3 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>Orders can be cancelled free of charge before dispatch</span>
                          </li>
                          <li className="flex items-start">
                            <svg
                              className="w-5 h-5 text-green-500 mr-3 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>Full refund will be processed to your original payment method</span>
                          </li>
                          <li className="flex items-start">
                            <svg
                              className="w-5 h-5 text-green-500 mr-3 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>Refund timeline: 5-7 business days</span>
                          </li>
                        </ul>
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>How to cancel:</strong> Contact us at nifti.user.in@gmail.com or +91 8100371049 with
                            your order number.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-slate-800 mb-4">After Dispatch</h3>
                      <div className="bg-white p-6 rounded-xl border border-slate-200">
                        <ul className="space-y-3 text-slate-700">
                          <li className="flex items-start">
                            <svg
                              className="w-5 h-5 text-amber-500 mr-3 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L12.732 4.5c-.77-.833-2.186-.833-2.964 0L2.83 16.5c-.77.833.192 2.5 1.732 2.5z"
                              />
                            </svg>
                            <span>Orders cannot be cancelled once dispatched</span>
                          </li>
                          <li className="flex items-start">
                            <svg
                              className="w-5 h-5 text-blue-500 mr-3 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>You can refuse delivery and initiate a return instead</span>
                          </li>
                          <li className="flex items-start">
                            <svg
                              className="w-5 h-5 text-blue-500 mr-3 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>Return shipping charges may apply (see return policy below)</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Returns Policy */}
                <div className="mb-12 p-8 bg-gradient-to-r from-slate-50 to-teal-50 rounded-2xl border border-slate-100">
                  <h2 className="text-2xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-slate-700 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                      2
                    </span>
                    Returns Policy
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                      <h3 className="text-lg font-medium text-slate-800 mb-4">Return Window</h3>
                      <p className="text-slate-700 mb-4">
                        Returns are accepted within <strong>7 days of delivery</strong> for the following reasons:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 text-green-500 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm">Wrong size received</span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 text-green-500 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm">Wrong item sent</span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 text-green-500 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm">Defective product</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 text-green-500 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm">Damaged during shipping</span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 text-green-500 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm">Color significantly different</span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 text-green-500 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm">Quality not as expected</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                      <h3 className="text-lg font-medium text-slate-800 mb-4">Return Conditions</h3>
                      <div className="space-y-3 text-slate-700">
                        <div className="flex items-start">
                          <svg
                            className="w-5 h-5 text-blue-500 mr-3 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>Items must be unused, unwashed, and in original condition</span>
                        </div>
                        <div className="flex items-start">
                          <svg
                            className="w-5 h-5 text-blue-500 mr-3 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>All original tags and packaging must be intact</span>
                        </div>
                        <div className="flex items-start">
                          <svg
                            className="w-5 h-5 text-blue-500 mr-3 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>No signs of wear, stains, or damage</span>
                        </div>
                        <div className="flex items-start">
                          <svg
                            className="w-5 h-5 text-blue-500 mr-3 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>Items should not have any odor (perfume, smoke, etc.)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Refund Process */}
                <div className="mb-12 p-8 bg-gradient-to-r from-teal-50 to-slate-50 rounded-2xl border border-teal-100">
                  <h2 className="text-2xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                      3
                    </span>
                    Refund Process
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                      <h3 className="text-lg font-medium text-slate-800 mb-4">How Refunds Work</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-medium">
                            1
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800">Initiate Return</h4>
                            <p className="text-sm text-slate-600">
                              Contact us within 7 days of delivery with your order number and reason for return
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-medium">
                            2
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800">Return Authorization</h4>
                            <p className="text-sm text-slate-600">
                              We'll provide return instructions and shipping labels (if applicable)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-medium">
                            3
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800">Ship Return</h4>
                            <p className="text-sm text-slate-600">
                              Package and send the item back to us using the provided instructions
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-medium">
                            4
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800">Quality Check</h4>
                            <p className="text-sm text-slate-600">
                              We inspect the returned item within 2-3 business days of receiving it
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-medium">
                            5
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800">Refund Processed</h4>
                            <p className="text-sm text-slate-600">
                              If approved, refund is processed to your original payment method within 5-7 business days
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-xl border border-slate-200">
                        <h3 className="text-lg font-medium text-slate-800 mb-4">Refund Timeline</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">UPI/Digital Wallets</span>
                            <span className="font-medium">1-3 days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Debit/Credit Cards</span>
                            <span className="font-medium">5-7 days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Net Banking</span>
                            <span className="font-medium">5-7 days</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-xl border border-slate-200">
                        <h3 className="text-lg font-medium text-slate-800 mb-4">Shipping Charges</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 text-green-500 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Free if return is due to our error</span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 text-amber-500 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L12.732 4.5c-.77-.833-2.186-.833-2.964 0L2.83 16.5c-.77.833.192 2.5 1.732 2.5z"
                              />
                            </svg>
                            <span>Customer bears cost for other returns</span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 text-blue-500 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>Original shipping charges non-refundable</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Non-Returnable Items */}
                <div className="mb-12 p-8 bg-gradient-to-r from-slate-50 to-teal-50 rounded-2xl border border-slate-100">
                  <h2 className="text-2xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-slate-700 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                      4
                    </span>
                    Non-Returnable Items
                  </h2>
                  <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                    <h3 className="text-lg font-medium text-red-800 mb-4">The following items cannot be returned:</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-red-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span className="text-sm text-red-700">Items purchased during final sale/clearance</span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-red-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span className="text-sm text-red-700">Customized or personalized items</span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-red-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span className="text-sm text-red-700">Items with missing tags or packaging</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-red-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span className="text-sm text-red-700">Items worn, washed, or altered</span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-red-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span className="text-sm text-red-700">Items returned after 7 days</span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-red-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span className="text-sm text-red-700">Items with stains, odors, or damage</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="p-8 bg-gradient-to-r from-slate-900 to-teal-900 rounded-2xl text-white">
                  <div className="flex items-center mb-6">
                    <img src="logo.jpg" alt="Nifti" className="w-8 h-8 mr-4 " />
                    <h3 className="text-2xl font-light">Need Help with Returns?</h3>
                  </div>
                  <p className="mb-6 text-white/90">
                    Have questions about cancellations or returns? Our support team is here to help:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>nifti.user.in@gmail.com</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default CancellationRefunds
