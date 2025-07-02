"use client"

import { useCart } from "../context/CartContext"
import { Link } from "react-router-dom"

const Cart = () => {
  const { cart, increaseQty, decreaseQty, removeFromCart, clearCart } = useCart()
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Enhanced Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-extralight mb-8 text-slate-900 tracking-tight">Shopping Cart</h1>
            <div className="w-20 h-1 bg-slate-900 mx-auto"></div>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white p-20 text-center shadow-xl rounded-2xl border border-slate-100">
              <div className="mb-10">
                <svg
                  className="w-32 h-32 text-slate-300 mx-auto mb-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-light text-slate-900 mb-6">Your cart is empty</h2>
              <p className="text-slate-600 font-light mb-10 text-lg">
                Discover our premium collection and find your perfect style
              </p>
              <Link
                to="/products"
                className="inline-block bg-slate-900 text-white px-10 py-4 font-medium tracking-wider uppercase hover:bg-slate-800 transition-all duration-500 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-16">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-8">
                {cart.map((item, idx) => (
                  <div key={idx} className="bg-white p-8 shadow-xl rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-8">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        className="w-32 h-32 object-cover rounded-xl"
                      />

                      <div className="flex-1">
                        <h3 className="text-2xl font-light text-slate-900 mb-3">{item.title}</h3>
                        <p className="text-slate-600 font-light mb-3 text-lg">Size: {item.size}</p>
                        <p className="text-xl font-medium text-slate-900">₹{item.price}</p>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Quantity Controls */}
                        <div className="flex items-center border-2 border-slate-200 rounded-xl">
                          <button
                            onClick={() => decreaseQty(item.productId, item.size)}
                            className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors rounded-l-xl"
                          >
                            −
                          </button>
                          <span className="w-16 h-12 flex items-center justify-center text-slate-900 font-medium bg-slate-50 border-x border-slate-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQty(item.productId, item.size)}
                            className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors rounded-r-xl"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-red-600 hover:text-red-800 font-light transition-colors p-2"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart */}
                <div className="text-center pt-8">
                  <button
                    onClick={clearCart}
                    className="text-slate-600 hover:text-slate-900 font-light transition-colors text-lg"
                  >
                    Clear entire cart
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white p-10 shadow-xl h-fit rounded-2xl border border-slate-100">
                <h2 className="text-3xl font-light mb-10 text-slate-900">Order Summary</h2>

                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-slate-600 text-lg">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-lg">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  {/* <div className="flex justify-between text-slate-600 text-lg">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div> */}
                  <div className="pt-6 border-t border-slate-200">
                    <div className="flex justify-between text-2xl font-medium text-slate-900">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full bg-slate-900 text-white py-5 text-center text-lg font-medium tracking-wider uppercase hover:bg-slate-800 transition-all duration-500 mb-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/products"
                  className="block w-full border-2 border-slate-900 text-slate-900 py-5 text-center font-medium tracking-wider uppercase hover:bg-slate-900 hover:text-white transition-all duration-500 rounded-xl"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Cart
