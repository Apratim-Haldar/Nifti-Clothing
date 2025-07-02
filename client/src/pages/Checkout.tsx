"use client"

import type React from "react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { useState } from "react"
import axios from "axios"

interface OrderConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
  orderDetails: {
    items: any[]
    total: number
    customerInfo: any
  }
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  orderDetails,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-3xl font-light text-gray-900">Confirm Your Order</h2>
          <p className="text-gray-600 mt-3 text-lg">Please review your order details before confirming</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Customer Information */}
          <div>
            <h3 className="text-xl font-medium text-gray-900 mb-4">Customer Information</h3>
            <div className="bg-gray-50 p-6 rounded-xl space-y-3">
              <p className="text-lg">
                <span className="font-medium">Name:</span> {orderDetails.customerInfo.name}
              </p>
              <p className="text-lg">
                <span className="font-medium">Email:</span> {orderDetails.customerInfo.email}
              </p>
              <p className="text-lg">
                <span className="font-medium">Phone:</span> {orderDetails.customerInfo.phone}
              </p>
              <p className="text-lg">
                <span className="font-medium">Address:</span> {orderDetails.customerInfo.address}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-xl font-medium text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {orderDetails.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-lg">{item.title}</h4>
                    <p className="text-gray-600">
                      Size: {item.size} | Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 text-lg">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between text-2xl font-semibold text-gray-900">
              <span>Total Amount:</span>
              <span>₹{orderDetails.total}</span>
            </div>
          </div>

          {/* Payment Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-blue-800">Payment Information</h3>
                <p className="mt-2 text-blue-700">
                  Your order will be confirmed via email. Our team will contact you for payment arrangements and
                  delivery details.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-gray-200 flex gap-4 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Confirming..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  )
}

const Checkout = () => {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim()) {
      showToast("Please fill in all required fields", "error")
      return
    }

    if (cart.length === 0) {
      showToast("Your cart is empty", "error")
      return
    }

    // Show confirmation modal
    setShowModal(true)
  }

  const handleConfirmOrder = async () => {
    setLoading(true)

    try {
      const orderData = {
        user: form,
        items: cart,
        totalAmount: total,
        status: "pending",
      }

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/orders`, orderData, {
        withCredentials: true,
      })

      setSuccess(true)
      setShowModal(false)
      clearCart()
      showToast("Order confirmed! Check your email for details.", "success")
    } catch (err: any) {
      console.error(err)
      showToast(err.response?.data?.message || "Failed to place order. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          {/* Enhanced Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-extralight mb-8 text-slate-900 tracking-tight">Checkout</h1>
            <div className="w-20 h-1 bg-slate-900 mx-auto"></div>
          </div>

          {success ? (
            <div className="bg-white p-16 text-center shadow-2xl rounded-2xl border border-slate-100">
              <div className="mb-10">
                <svg
                  className="w-24 h-24 text-green-500 mx-auto mb-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-light text-slate-900 mb-6">Order Confirmed!</h2>
              <p className="text-slate-600 font-light text-xl mb-10">
                Thank you for your order! You will receive a confirmation email shortly with all the details. Our team
                will contact you soon for payment and delivery arrangements.
              </p>
              <button
                onClick={() => (window.location.href = "/products")}
                className="bg-slate-900 text-white px-10 py-4 font-medium tracking-wider uppercase hover:bg-slate-800 transition-all duration-500 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Order Form */}
              <div className="bg-white p-10 shadow-2xl rounded-2xl border border-slate-100">
                <h2 className="text-3xl font-light mb-10 text-slate-900">Shipping Information</h2>
                <form onSubmit={handleFormSubmit} className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-3 tracking-wider uppercase">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      className="w-full border-2 border-slate-200 px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 rounded-xl text-lg"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-3 tracking-wider uppercase">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="w-full border-2 border-slate-200 px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 rounded-xl text-lg"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-3 tracking-wider uppercase">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      className="w-full border-2 border-slate-200 px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 rounded-xl text-lg"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-3 tracking-wider uppercase">
                      Shipping Address *
                    </label>
                    <textarea
                      name="address"
                      placeholder="Enter your complete address"
                      className="w-full border-2 border-slate-200 px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 rounded-xl text-lg"
                      rows={4}
                      value={form.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 text-white py-5 text-xl font-medium tracking-wider uppercase hover:bg-slate-800 transition-all duration-500 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Review Order
                  </button>
                </form>
              </div>

              {/* Order Summary */}
              <div className="bg-white p-10 shadow-2xl h-fit rounded-2xl border border-slate-100">
                <h2 className="text-3xl font-light mb-10 text-slate-900">Order Summary</h2>

                <div className="space-y-8 mb-10">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6 pb-8 border-b border-slate-200 last:border-b-0">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 mb-2 text-lg">{item.title}</h4>
                        <p className="text-slate-600">Size: {item.size}</p>
                        <p className="text-slate-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900 text-lg">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mb-10 pt-8 border-t border-slate-200">
                  <div className="flex justify-between text-slate-600 text-lg">
                    <span>Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-lg">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-2xl font-medium text-slate-900 pt-4 border-t border-slate-200">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-amber-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="ml-4">
                      <h3 className="font-medium text-amber-800">Payment Notice</h3>
                      <p className="mt-2 text-amber-700">
                        No payment required now. We'll contact you for payment arrangements after order confirmation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Modal */}
          <OrderConfirmationModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirmOrder}
            loading={loading}
            orderDetails={{
              items: cart,
              total: total,
              customerInfo: form,
            }}
          />
        </div>
      </section>
    </div>
  )
}

export default Checkout
