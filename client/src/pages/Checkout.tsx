import type React from "react"

import { useCart } from "../context/CartContext"
import { useState } from "react"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import axios from "axios"

const Checkout = () => {
  const { cart, clearCart } = useCart()
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const stripe = useStripe()
  const elements = useElements()

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async () => {
    if (!stripe || !elements) return
    setLoading(true)

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/payment/create-intent`, {
        amount: total * 100,
      })

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: form.name,
            email: form.email,
            phone: form.phone,
          },
        },
      })

      if (result.error) {
        alert(result.error.message)
        setLoading(false)
        return
      }

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
        user: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
        },
        items: cart,
        totalAmount: total,
        paymentIntentId: result.paymentIntent?.id,
      })

      setSuccess(true)
      clearCart()
    } catch (err) {
      console.error(err)
      alert("Something went wrong during payment.")
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
            <div className="bg-white p-12 text-center shadow-sm">
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
              <p className="text-slate-600 font-light text-lg">
                Thank you for your purchase. Your order has been successfully placed and will be processed shortly.
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Order Form */}
              <div className="bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-light mb-8 text-slate-900">Shipping Information</h2>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2 tracking-wide uppercase">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      className="w-full border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2 tracking-wide uppercase">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="w-full border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2 tracking-wide uppercase">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      className="w-full border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2 tracking-wide uppercase">
                      Shipping Address
                    </label>
                    <textarea
                      name="address"
                      placeholder="Enter your complete address"
                      className="w-full border-2 border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition-all duration-300"
                      rows={4}
                      value={form.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </form>

                {/* Payment Section */}
                <div className="mt-12 pt-8 border-t border-slate-200">
                  <h3 className="text-xl font-light mb-6 text-slate-900">Payment Information</h3>
                  <div className="border-2 border-slate-200 p-4 focus-within:border-slate-900 transition-all duration-300">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#1e293b",
                            "::placeholder": {
                              color: "#94a3b8",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white p-8 shadow-sm h-fit">
                <h2 className="text-2xl font-light mb-8 text-slate-900">Order Summary</h2>

                <div className="space-y-6 mb-8">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 pb-6 border-b border-slate-200 last:border-b-0">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        className="w-16 h-16 object-cover"
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

                <button
                  className="w-full bg-slate-900 text-white py-4 text-lg font-medium tracking-wide uppercase hover:bg-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Checkout
