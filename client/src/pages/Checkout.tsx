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
  orderDetails
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Confirm Your Order</h2>
          <p className="text-gray-600 mt-2">Please review your order details before confirming</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><span className="font-medium">Name:</span> {orderDetails.customerInfo.name}</p>
              <p><span className="font-medium">Email:</span> {orderDetails.customerInfo.email}</p>
              <p><span className="font-medium">Phone:</span> {orderDetails.customerInfo.phone}</p>
              <p><span className="font-medium">Address:</span> {orderDetails.customerInfo.address}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-3">
              {orderDetails.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-xl font-semibold text-gray-900">
              <span>Total Amount:</span>
              <span>₹{orderDetails.total}</span>
            </div>
          </div>

          {/* Payment Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Payment Information</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Your order will be confirmed via email. Our team will contact you for payment arrangements and delivery details.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
    address: "" 
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
        status: 'pending'
      }

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/orders`, orderData, {
        withCredentials: true
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
    <div className="min-h-screen bg-slate-50">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extralight mb-6 text-slate-900 tracking-tight">Checkout</h1>
            <div className="w-16 h-px bg-slate-900 mx-auto"></div>
          </div>

          {success ? (
            <div className="bg-white p-12 text-center shadow-sm rounded-lg">
              <div className="mb-8">
                <svg
                  className="w-20 h-20 text-green-500 mx-auto mb-6"
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
              <h2 className="text-3xl font-light text-slate-900 mb-4">Order Confirmed!</h2>
              <p className="text-slate-600 font-light text-lg mb-8">
                Thank you for your order! You will receive a confirmation email shortly with all the details. 
                Our team will contact you soon for payment and delivery arrangements.
              </p>
              <button
                onClick={() => window.location.href = '/products'}
                className="bg-slate-900 text-white px-8 py-3 font-medium tracking-wide uppercase hover:bg-slate-800 transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Order Form */}
              <div className="bg-white p-8 shadow-sm rounded-lg">
                <h2 className="text-2xl font-light mb-8 text-slate-900">Shipping Information</h2>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2 tracking-wide uppercase">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      className="w-full border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 rounded"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2 tracking-wide uppercase">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="w-full border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 rounded"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2 tracking-wide uppercase">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      className="w-full border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 rounded"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2 tracking-wide uppercase">
                      Shipping Address *
                    </label>
                    <textarea
                      name="address"
                      placeholder="Enter your complete address"
                      className="w-full border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300 rounded"
                      rows={4}
                      value={form.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 text-white py-4 text-lg font-medium tracking-wide uppercase hover:bg-slate-800 transition-all duration-300 rounded"
                  >
                    Review Order
                  </button>
                </form>
              </div>

              {/* Order Summary */}
              <div className="bg-white p-8 shadow-sm h-fit rounded-lg">
                <h2 className="text-2xl font-light mb-8 text-slate-900">Order Summary</h2>

                <div className="space-y-6 mb-8">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 pb-6 border-b border-slate-200 last:border-b-0">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-600">Size: {item.size}</p>
                        <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-8 pt-6 border-t border-slate-200">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-xl font-medium text-slate-900 pt-3 border-t border-slate-200">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-amber-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">Payment Notice</h3>
                      <p className="mt-1 text-sm text-amber-700">
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
              customerInfo: form
            }}
          />
        </div>
      </section>
    </div>
  )
}

export default Checkout
