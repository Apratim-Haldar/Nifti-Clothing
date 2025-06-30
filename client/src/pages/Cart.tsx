import { useCart } from "../context/CartContext"
import { Link } from "react-router-dom"

const Cart = () => {
  const { cart, increaseQty, decreaseQty, removeFromCart, clearCart } = useCart()
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extralight mb-6 text-slate-900 tracking-tight">Shopping Cart</h1>
            <div className="w-16 h-px bg-slate-900 mx-auto"></div>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white p-16 text-center shadow-sm">
              <div className="mb-8">
                <svg
                  className="w-24 h-24 text-slate-300 mx-auto mb-6"
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
              <h2 className="text-2xl font-light text-slate-900 mb-4">Your cart is empty</h2>
              <p className="text-slate-600 font-light mb-8">
                Discover our premium collection and find your perfect style
              </p>
              <Link
                to="/products"
                className="inline-block bg-slate-900 text-white px-8 py-3 font-medium tracking-wide uppercase hover:bg-slate-800 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-6">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        className="w-24 h-24 object-cover"
                      />

                      <div className="flex-1">
                        <h3 className="text-xl font-light text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-slate-600 font-light mb-2">Size: {item.size}</p>
                        <p className="text-lg font-medium text-slate-900">₹{item.price}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border-2 border-slate-200">
                          <button
                            onClick={() => decreaseQty(item.productId, item.size)}
                            className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            −
                          </button>
                          <span className="w-12 h-10 flex items-center justify-center text-slate-900 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQty(item.productId, item.size)}
                            className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-red-600 hover:text-red-800 font-light transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="text-center pt-6">
                  <button
                    onClick={clearCart}
                    className="text-slate-600 hover:text-slate-900 font-light transition-colors"
                  >
                    Clear entire cart
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white p-8 shadow-sm h-fit">
                <h2 className="text-2xl font-light mb-8 text-slate-900">Order Summary</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex justify-between text-xl font-medium text-slate-900">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full bg-slate-900 text-white py-4 text-center text-lg font-medium tracking-wide uppercase hover:bg-slate-800 transition-colors mb-4"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/products"
                  className="block w-full border-2 border-slate-900 text-slate-900 py-4 text-center font-medium tracking-wide uppercase hover:bg-slate-900 hover:text-white transition-all duration-300"
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