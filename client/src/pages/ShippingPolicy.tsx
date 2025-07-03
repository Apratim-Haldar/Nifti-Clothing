import type React from "react"
import { Link } from "react-router-dom"

const ShippingPolicy: React.FC = () => {
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
              Shipping Policy
            </h1>
            <p className="text-xl text-slate-600 font-light max-w-3xl mx-auto leading-relaxed">
              Fast, secure, and reliable delivery of your premium fashion pieces across India
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/80 backdrop-blur-xl border border-teal-100 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-10 md:p-16">
              <div className="prose prose-slate max-w-none">
                <div className="mb-12">
                  <p className="text-lg text-slate-600 font-light leading-relaxed">
                    At Nifti Clothing, we understand that receiving your premium fashion pieces quickly and safely is important to you. 
                    Our shipping policy is designed to provide transparency and reliability in every delivery.
                  </p>
                  <p className="text-sm text-slate-500 mt-4">Last updated: January 2025</p>
                </div>

                {/* Processing Time */}
                <div className="mb-12 p-8 bg-gradient-to-r from-teal-50 to-slate-50 rounded-2xl border border-teal-100">
                  <h2 className="text-2xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">1</span>
                    Order Processing
                  </h2>
                  <div className="space-y-4 text-slate-700 leading-relaxed">
                    <p>Orders are typically processed within <strong>2–3 business days</strong> from the time of payment confirmation.</p>
                    <p>During peak seasons (festivals, sales events), processing may take up to 4-5 business days.</p>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 mt-6">
                      <h3 className="text-lg font-medium text-slate-800 mb-4">What happens during processing:</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <span className="text-sm">Payment verification</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <span className="text-sm">Inventory confirmation</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <span className="text-sm">Quality check</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          <span className="text-sm">Premium packaging</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="mb-12 p-8 bg-gradient-to-r from-slate-50 to-teal-50 rounded-2xl border border-slate-100">
                  <h2 className="text-2xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-slate-700 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">2</span>
                    Delivery Options
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center mb-4">
                        <svg className="w-6 h-6 text-teal-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-slate-800">Standard Delivery</h3>
                      </div>
                      <div className="space-y-3 text-sm text-slate-700">
                        <p><strong>Timeline:</strong> 5-7 business days</p>
                        <p><strong>Cost:</strong> Free on orders above ₹2000</p>
                        <p><strong>Coverage:</strong> All major cities and towns in India</p>
                        <p><strong>Tracking:</strong> SMS and email updates included</p>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center mb-4">
                        <svg className="w-6 h-6 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-slate-800">Express Delivery</h3>
                      </div>
                      <div className="space-y-3 text-sm text-slate-700">
                        <p><strong>Timeline:</strong> 2-3 business days</p>
                        <p><strong>Cost:</strong> ₹150 (subject to location)</p>
                        <p><strong>Coverage:</strong> Metro cities and select locations</p>
                        <p><strong>Tracking:</strong> Real-time tracking available</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Zones */}
                <div className="mb-12 p-8 bg-gradient-to-r from-teal-50 to-slate-50 rounded-2xl border border-teal-100">
                  <h2 className="text-2xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">3</span>
                    Shipping Zones & Timeline
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-slate-800">Zone</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-slate-800">Locations</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-slate-800">Standard Delivery</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-slate-800">Express Delivery</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">Zone 1</td>
                          <td className="px-6 py-4 text-sm text-slate-700">Mumbai, Delhi, Bangalore, Chennai, Kolkata</td>
                          <td className="px-6 py-4 text-sm text-slate-700">3-5 days</td>
                          <td className="px-6 py-4 text-sm text-slate-700">1-2 days</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">Zone 2</td>
                          <td className="px-6 py-4 text-sm text-slate-700">State capitals & major cities</td>
                          <td className="px-6 py-4 text-sm text-slate-700">4-6 days</td>
                          <td className="px-6 py-4 text-sm text-slate-700">2-3 days</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">Zone 3</td>
                          <td className="px-6 py-4 text-sm text-slate-700">Towns & rural areas</td>
                          <td className="px-6 py-4 text-sm text-slate-700">5-7 days</td>
                          <td className="px-6 py-4 text-sm text-slate-700">3-4 days*</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-xs text-slate-500 mt-3">*Express delivery may not be available in all Zone 3 locations</p>
                  </div>
                </div>

                {/* Order Tracking */}
                <div className="mb-12 p-8 bg-gradient-to-r from-slate-50 to-teal-50 rounded-2xl border border-slate-100">
                  <h2 className="text-2xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-slate-700 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">4</span>
                    Order Tracking
                  </h2>
                  <div className="space-y-6">
                    <p className="text-slate-700 leading-relaxed">You will receive tracking information via email and SMS once your order has been dispatched.</p>
                    
                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                      <h3 className="text-lg font-medium text-slate-800 mb-4">Tracking Process:</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                          <div>
                            <h4 className="font-medium text-slate-800">Order Confirmed</h4>
                            <p className="text-sm text-slate-600">Payment processed and order placed in queue</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                          <div>
                            <h4 className="font-medium text-slate-800">Processing</h4>
                            <p className="text-sm text-slate-600">Item picked, packed, and ready for dispatch</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                          <div>
                            <h4 className="font-medium text-slate-800">Shipped</h4>
                            <p className="text-sm text-slate-600">Tracking number shared via SMS and email</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-medium">4</div>
                          <div>
                            <h4 className="font-medium text-slate-800">Delivered</h4>
                            <p className="text-sm text-slate-600">Package handed over to you or authorized person</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="mb-12 p-8 bg-gradient-to-r from-teal-50 to-slate-50 rounded-2xl border border-teal-100">
                  <h2 className="text-2xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">5</span>
                    Important Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                        <h3 className="font-medium text-amber-800 mb-2">Delivery Delays</h3>
                        <p className="text-sm text-amber-700">We are not responsible for delays caused by courier services, weather conditions, or other circumstances beyond our control.</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                        <h3 className="font-medium text-blue-800 mb-2">Address Accuracy</h3>
                        <p className="text-sm text-blue-700">Please ensure your shipping address is complete and accurate. Delays due to incorrect addresses may incur additional charges.</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                        <h3 className="font-medium text-green-800 mb-2">Safe Delivery</h3>
                        <p className="text-sm text-green-700">All packages are insured during transit. Report any damage or missing items within 24 hours of delivery.</p>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl">
                        <h3 className="font-medium text-purple-800 mb-2">Holiday Shipping</h3>
                        <p className="text-sm text-purple-700">During festivals and holidays, delivery times may extend by 1-2 additional days.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="p-8 bg-gradient-to-r from-slate-900 to-teal-900 rounded-2xl text-white">
                  <div className="flex items-center mb-6">
                    <img src="logo.jpg" alt="Nifti" className="w-8 h-8 mr-4" />
                    <h3 className="text-2xl font-light">Shipping Questions?</h3>
                  </div>
                  <p className="mb-6 text-white/90">Need help with your order or have shipping-related queries? Contact our support team:</p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>nifti.user.in@gmail.com</span>
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

export default ShippingPolicy
