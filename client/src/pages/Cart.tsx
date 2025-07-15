"use client"

import { useCart } from "../context/CartContext"
import { Link } from "react-router-dom"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react"

const Cart = () => {
  const { cart, increaseQty, decreaseQty, removeFromCart, clearCart } = useCart()
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-2 h-2 bg-stone-800 rounded-full"></div>
            <span className="text-sm font-cormorant font-medium text-stone-600 tracking-wider uppercase">
              Shopping Cart
            </span>
            <div className="w-2 h-2 bg-stone-800 rounded-full"></div>
          </div>
          <h1 className="text-5xl font-playfair font-bold mb-4 text-stone-800">
            Your <span className="text-stone-600">Cart</span>
          </h1>
          <p className="text-stone-600 text-xl max-w-2xl mx-auto font-cormorant">
            {cart.length > 0
              ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`
              : "Your cart is waiting to be filled with amazing products"
            }
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-stone-50 rounded-2xl p-16 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-12 w-12 text-stone-400" />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-stone-800 mb-4">Your cart is empty</h3>
              <p className="text-stone-600 font-cormorant text-lg mb-8">
                Discover our premium collection and find your perfect style
              </p>
              <Link
                to="/products"
                className="inline-flex items-center space-x-2 bg-stone-800 text-white px-8 py-4 rounded-lg hover:bg-stone-700 transition-colors font-cormorant text-lg"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Start Shopping</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Header */}
              <div className="flex items-center justify-between bg-stone-50 rounded-xl p-4">
                <h2 className="text-xl font-playfair font-bold text-stone-800">
                  Cart Items ({itemCount})
                </h2>
                <button
                  onClick={clearCart}
                  className="text-stone-600 hover:text-red-600 transition-colors font-cormorant"
                >
                  Clear All
                </button>
              </div>

              {/* Items List */}
              {cart.map((item: any) => (
                <div key={`${item.productId}-${item.size}`} className="bg-white border border-stone-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl || "/placeholder.jpg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.jpg"
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-playfair font-bold text-stone-800 mb-2">{item.title}</h3>
                      <div className="flex items-center space-x-4 text-stone-600 font-cormorant mb-3">
                        <span>Size: <span className="font-semibold">{item.size}</span></span>
                        {item.color && <span>Color: <span className="font-semibold">{item.color}</span></span>}
                      </div>
                      <p className="text-xl font-bold text-stone-800">₹{item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="flex items-center border-2 border-stone-300 rounded-lg">
                        <button
                          onClick={() => decreaseQty(item.productId, item.size)}
                          className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors rounded-l-lg"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 h-10 flex items-center justify-center text-stone-800 font-semibold bg-stone-50 border-x border-stone-300 font-cormorant">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQty(item.productId, item.size)}
                          className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors rounded-r-lg"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-xl font-bold text-stone-800">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-stone-600 font-cormorant text-sm">
                        ₹{item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-stone-50 rounded-2xl p-8 sticky top-24">
                <h3 className="text-2xl font-playfair font-bold text-stone-800 mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between font-cormorant">
                    <span className="text-stone-600">Subtotal ({itemCount} items)</span>
                    <span className="text-stone-800 font-semibold">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-cormorant">
                    <span className="text-stone-600">Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between font-cormorant">
                    <span className="text-stone-600">Tax</span>
                    <span className="text-stone-800 font-semibold">₹{(total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-stone-300 pt-4">
                    <div className="flex justify-between text-lg font-playfair font-bold">
                      <span className="text-stone-800">Total</span>
                      <span className="text-stone-800">₹{(total * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link
                    to="/checkout"
                    className="w-full bg-stone-800 text-white py-4 rounded-lg hover:bg-stone-700 transition-colors font-cormorant text-lg flex items-center justify-center space-x-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>

                  <Link
                    to="/products"
                    className="w-full border-2 border-stone-300 text-stone-700 py-4 rounded-lg hover:border-stone-500 transition-colors font-cormorant text-lg flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Continue Shopping</span>
                  </Link>
                </div>

                

                {/* Security Info */}
                <div className="mt-6 pt-6 border-t border-stone-300">
                  <div className="flex items-center space-x-2 text-stone-600 font-cormorant text-sm">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {cart.length > 0 && (
          <div className="mt-16 pt-12 border-t border-stone-200">
            <h3 className="text-2xl font-playfair font-bold text-stone-800 mb-8 text-center">
              You might also like
            </h3>
            <div className="text-center">
              <Link
                to="/products"
                className="inline-flex items-center space-x-2 text-stone-600 hover:text-stone-800 transition-colors font-cormorant"
              >
                <span>Explore more products</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
