"use client"

import type React from "react"

const TermsConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50">
      {/* Geometric Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-teal-500/5 to-teal-600/5 transform rotate-45 rounded-3xl"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-gradient-to-br from-teal-400/5 to-teal-500/5 transform -rotate-12 rounded-3xl"></div>
      </div>

      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-px bg-teal-500"></div>
              <img src="/logo.jpg" alt="Nifti" className="w-12 h-12 mx-6" />
              <div className="w-16 h-px bg-teal-500"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extralight mb-8 text-slate-900 tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-xl text-slate-600 font-light max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our services. Your use of Nifti constitutes acceptance of
              these terms.
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/80 backdrop-blur-xl border border-teal-100 rounded-3xl p-12 shadow-2xl">
            <div className="prose prose-lg max-w-none">
              <div className="space-y-12">
                {/* Section 1 */}
                <div>
                  <h2 className="text-3xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-sm mr-4">
                      1
                    </span>
                    General Terms
                  </h2>
                  <div className="text-slate-700 leading-relaxed space-y-4">
                    <p>
                      These Terms and Conditions govern your use of the Nifti website and services, applying to all
                      users including browsers, customers, merchants, and content contributors.
                    </p>
                    <p>
                      We reserve the right to update, modify, or replace any part of these Terms by posting updates to
                      our website. Your continued use of the website following any changes constitutes acceptance of
                      those changes. We recommend reviewing these terms periodically.
                    </p>
                  </div>
                </div>

                {/* Section 2 */}
                <div>
                  <h2 className="text-3xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-sm mr-4">
                      2
                    </span>
                    Products & Services
                  </h2>
                  <div className="text-slate-700 leading-relaxed space-y-4">
                    <p>
                      All products offered by Nifti are subject to availability. We reserve the right to discontinue
                      any product at any time without prior notice.
                    </p>
                    <p>
                      While we strive to display accurate product images and descriptions, we cannot guarantee that
                      product colors, textures, or details will appear exactly as shown on your screen due to monitor
                      variations and lighting conditions.
                    </p>
                    <p>
                      Product specifications, including materials, sizing, and care instructions, are provided for
                      guidance and may vary slightly from the actual product.
                    </p>
                  </div>
                </div>

                {/* Section 3 */}
                <div>
                  <h2 className="text-3xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-sm mr-4">
                      3
                    </span>
                    Pricing & Payments
                  </h2>
                  <div className="text-slate-700 leading-relaxed space-y-4">
                    <p>
                      All prices are listed in Indian Rupees (₹) and include applicable taxes unless otherwise
                      specified. Prices are subject to change without notice.
                    </p>
                    <p>
                      We accept secure payments through Google Pay, PhonePe, Paytm, UPI, and other supported digital
                      payment methods. All transactions are processed through secure, encrypted channels.
                    </p>
                    <p>
                      Orders will not be processed or shipped until payment is successfully completed and verified.
                      Failed or incomplete payments may result in order cancellation.
                    </p>
                  </div>
                </div>

                {/* Section 4 */}
                <div>
                  <h2 className="text-3xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-sm mr-4">
                      4
                    </span>
                    Shipping & Delivery
                  </h2>
                  <div className="text-slate-700 leading-relaxed space-y-4">
                    <p>
                      Orders are typically processed within 2-3 business days from the date of payment confirmation.
                      Processing times may be extended during peak seasons or promotional periods.
                    </p>
                    <p>
                      Shipping times vary depending on your location and chosen delivery method. Standard delivery
                      usually takes 5-7 business days, while express delivery takes 2-3 business days.
                    </p>
                    <p>
                      We are not responsible for delays caused by courier services, weather conditions, natural
                      disasters, or other unforeseen circumstances beyond our control.
                    </p>
                  </div>
                </div>

                {/* Section 5 */}
                <div>
                  <h2 className="text-3xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-sm mr-4">
                      5
                    </span>
                    Returns & Refunds
                  </h2>
                  <div className="text-slate-700 leading-relaxed space-y-4">
                    <p>
                      Returns are accepted within 7 days of delivery for unused, unwashed items in their original
                      packaging with all tags attached. Items must be in the same condition as received.
                    </p>
                    <p>
                      Refunds, if applicable, will be processed after inspection of returned items and may take 5-7
                      business days to reflect in your account. Refunds will be issued to the original payment method.
                    </p>
                    <p>
                      Shipping charges are non-refundable unless the return is due to our error (wrong item shipped or
                      defective product). Customers are responsible for return shipping costs in other cases.
                    </p>
                  </div>
                </div>

                {/* Section 6 */}
                <div>
                  <h2 className="text-3xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-sm mr-4">
                      6
                    </span>
                    Intellectual Property
                  </h2>
                  <div className="text-slate-700 leading-relaxed space-y-4">
                    <p>
                      All content on the Nifti website, including but not limited to logos, images, graphics, text,
                      designs, and software, is the exclusive property of Nifti and is protected under applicable
                      copyright and trademark laws.
                    </p>
                    <p>
                      Unauthorized use, reproduction, distribution, or modification of any content is strictly
                      prohibited and may result in legal action.
                    </p>
                  </div>
                </div>

                {/* Section 7 */}
                <div>
                  <h2 className="text-3xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-sm mr-4">
                      7
                    </span>
                    User Accounts
                  </h2>
                  <div className="text-slate-700 leading-relaxed space-y-4">
                    <p>
                      Users must provide accurate, complete, and current information when creating an account. You are
                      responsible for maintaining the confidentiality of your account credentials.
                    </p>
                    <p>
                      We reserve the right to suspend or terminate accounts found to be involved in suspicious,
                      fraudulent, or illegal activities, or accounts that violate these terms.
                    </p>
                  </div>
                </div>

                {/* Section 8 */}
                <div>
                  <h2 className="text-3xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-sm mr-4">
                      8
                    </span>
                    Limitation of Liability
                  </h2>
                  <div className="text-slate-700 leading-relaxed space-y-4">
                    <p>
                      Nifti shall not be liable for any indirect, incidental, special, consequential, or punitive
                      damages resulting from your use of our products or services.
                    </p>
                    <p>
                      Our total liability shall be limited to the amount paid by you for the specific product or service
                      in question.
                    </p>
                  </div>
                </div>

                {/* Section 9 */}
                <div>
                  <h2 className="text-3xl font-light text-slate-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-sm mr-4">
                      9
                    </span>
                    Governing Law
                  </h2>
                  <div className="text-slate-700 leading-relaxed space-y-4">
                    <p>
                      These Terms and Conditions are governed by and construed in accordance with the laws of India. Any
                      disputes arising from these terms shall be subject to the exclusive jurisdiction of Indian courts.
                    </p>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="bg-gradient-to-r from-teal-50 to-slate-50 p-8 rounded-2xl border border-teal-200">
                  <h2 className="text-3xl font-light text-slate-900 mb-6 flex items-center">
                    <img src="/logo.jpg" alt="Nifti" className="w-8 h-8 mr-4" />
                    Contact Information
                  </h2>
                  <div className="text-slate-700 leading-relaxed space-y-4">
                    <p>
                      If you have any questions, concerns, or require clarification regarding these Terms and
                      Conditions, please don't hesitate to contact us:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-teal-600">nifti.user.in@gmail.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-teal-600">+91 8100371049</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsConditions
