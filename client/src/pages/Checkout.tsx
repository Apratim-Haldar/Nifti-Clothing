import type React from "react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { useState } from "react"
import { Link } from "react-router-dom"
import { User, Mail, Phone, MapPin, ShoppingBag, CheckCircle, X, Package, CreditCard, Truck, Shield, Home, Building, Globe } from "lucide-react"
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

  // Format address for display
  const formatAddress = (addressInfo: any) => {
    const parts = []
    if (addressInfo.streetAddress) parts.push(addressInfo.streetAddress)
    if (addressInfo.apartment) parts.push(addressInfo.apartment)
    if (addressInfo.city) parts.push(addressInfo.city)
    if (addressInfo.state) parts.push(addressInfo.state)
    if (addressInfo.pincode) parts.push(addressInfo.pincode)
    if (addressInfo.country) parts.push(addressInfo.country)
    return parts.join(', ')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-stone-200">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-playfair font-bold text-stone-800">Confirm Your Order</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-stone-600" />
            </button>
          </div>
          <p className="text-stone-600 mt-2 font-cormorant text-lg">Please review your order details before confirming</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Customer Information */}
          <div>
            <h3 className="text-xl font-playfair font-bold text-stone-800 mb-4">Customer Information</h3>
            <div className="bg-stone-50 p-6 rounded-xl space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-stone-500" />
                <span className="font-cormorant"><strong>Name:</strong> {orderDetails.customerInfo.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-stone-500" />
                <span className="font-cormorant"><strong>Email:</strong> {orderDetails.customerInfo.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-stone-500" />
                <span className="font-cormorant"><strong>Phone:</strong> {orderDetails.customerInfo.phone}</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-stone-500 mt-1" />
                <span className="font-cormorant"><strong>Address:</strong> {formatAddress(orderDetails.customerInfo)}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-xl font-playfair font-bold text-stone-800 mb-4">Order Items</h3>
            <div className="space-y-4">
              {orderDetails.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-6 p-4 bg-stone-50 rounded-xl">
                  <div className="w-16 h-16 bg-stone-200 rounded-lg overflow-hidden flex-shrink-0">
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
                  <div className="flex-1">
                    <h4 className="font-playfair font-semibold text-stone-800">{item.title}</h4>
                    <p className="text-stone-600 font-cormorant">
                      Size: {item.size} | Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-playfair font-bold text-stone-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-stone-600 font-cormorant text-sm">₹{item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t border-stone-200 pt-6">
            <div className="flex justify-between text-2xl font-playfair font-bold text-stone-800">
              <span>Total Amount:</span>
              <span>₹{orderDetails.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <CreditCard className="h-6 w-6 text-blue-500 mt-1" />
              <div>
                <h3 className="font-playfair font-bold text-blue-800">Payment Information</h3>
                <p className="mt-2 text-blue-700 font-cormorant">
                  Your order will be confirmed via email. Our team will contact you for payment arrangements and
                  delivery details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-stone-200 flex gap-4 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-8 py-3 border-2 border-stone-300 text-stone-700 rounded-xl hover:border-stone-500 disabled:opacity-50 font-cormorant transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-8 py-3 bg-stone-800 text-white rounded-xl hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed font-cormorant transition-colors"
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
  const { addToast } = useToast()
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    addressType: "home", // home, office, other
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  // Indian states for dropdown
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", 
    "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Andaman and Nicobar Islands"
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'phone', 'streetAddress', 'city', 'state', 'pincode', 'country']
    const missingFields = requiredFields.filter(field => !form[field as keyof typeof form]?.toString().trim())
    
    if (missingFields.length > 0) {
      addToast("Please fill in all required fields", "error")
      return false
    }

    // Validate pincode format (Indian pincode)
    const pincodeRegex = /^[1-9][0-9]{5}$/
    if (!pincodeRegex.test(form.pincode)) {
      addToast("Please enter a valid 6-digit pincode", "error")
      return false
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(form.phone.replace(/\s+/g, ''))) {
      addToast("Please enter a valid 10-digit Indian mobile number", "error")
      return false
    }

    return true
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (cart.length === 0) {
      addToast("Your cart is empty", "error")
      return
    }

    // Show confirmation modal
    setShowModal(true)
  }

  const handleConfirmOrder = async () => {
    setLoading(true)

    try {
      const orderData = {
        user: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: `${form.streetAddress}, ${form.apartment}, ${form.city}, ${form.state}, ${form.pincode}, ${form.country}`.trim()
        },
        items: cart.map(item => ({
          productId: item.productId,
          title: item.title,
          imageUrl: item.imageUrl,
          price: item.price,
          size: item.size,
          quantity: item.quantity
        })),
        totalAmount: total,
        status: "pending"
      }

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/orders`, orderData, {
        withCredentials: true,
      })

      setSuccess(true)
      setShowModal(false)
      clearCart()
      addToast("Order confirmed! Check your email for details.", "success")
    } catch (err: any) {
      console.error(err)
      addToast(err.response?.data?.message || "Failed to place order. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="bg-stone-50 rounded-2xl p-16 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-12 w-12 text-stone-400" />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-stone-800 mb-4">Your cart is empty</h3>
              <p className="text-stone-600 font-cormorant text-lg mb-8">
                Add some items to your cart before proceeding to checkout.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center space-x-2 bg-stone-800 text-white px-8 py-4 rounded-lg hover:bg-stone-700 transition-colors font-cormorant text-lg"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-2 h-2 bg-stone-800 rounded-full"></div>
            <span className="text-sm font-cormorant font-medium text-stone-600 tracking-wider uppercase">
              Secure Checkout
            </span>
            <div className="w-2 h-2 bg-stone-800 rounded-full"></div>
          </div>
          <h1 className="text-5xl font-playfair font-bold mb-4 text-stone-800">
            {success ? "Order Confirmed" : "Checkout"}
          </h1>
          <p className="text-stone-600 text-xl max-w-2xl mx-auto font-cormorant">
            {success 
              ? "Thank you for your order! We'll be in touch soon."
              : "Complete your order with secure checkout"
            }
          </p>
        </div>

        {success ? (
          <div className="text-center py-20">
            <div className="bg-stone-50 rounded-2xl p-16 max-w-3xl mx-auto">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-playfair font-bold text-stone-800 mb-6">Order Confirmed!</h2>
              <p className="text-stone-600 font-cormorant text-lg mb-8 max-w-2xl mx-auto">
                Thank you for your order! You will receive a confirmation email shortly with all the details. 
                Our team will contact you soon for payment and delivery arrangements.
              </p>
              
              {/* Order Features */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-playfair font-semibold text-stone-800 mb-2">Email Confirmation</h3>
                  <p className="text-stone-600 font-cormorant text-sm">Order details sent to your email</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-playfair font-semibold text-stone-800 mb-2">Personal Contact</h3>
                  <p className="text-stone-600 font-cormorant text-sm">We'll call you for arrangements</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-playfair font-semibold text-stone-800 mb-2">Fast Delivery</h3>
                  <p className="text-stone-600 font-cormorant text-sm">Quick and secure delivery</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="inline-flex items-center space-x-2 bg-stone-800 text-white px-8 py-4 rounded-lg hover:bg-stone-700 transition-colors font-cormorant"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Continue Shopping</span>
                </Link>
                <Link
                  to="/orders"
                  className="inline-flex items-center space-x-2 border-2 border-stone-300 text-stone-700 px-8 py-4 rounded-lg hover:border-stone-500 transition-colors font-cormorant"
                >
                  <Package className="h-5 w-5" />
                  <span>View Orders</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Progress Steps */}
              <div className="bg-stone-50 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-stone-800 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span className="font-cormorant font-semibold">Shipping Information</span>
                  </div>
                  <div className="flex items-center space-x-3 opacity-50">
                    <div className="w-8 h-8 bg-stone-300 text-stone-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span className="font-cormorant">Review & Confirm</span>
                  </div>
                </div>
              </div>

              {/* Shipping Form */}
              <div className="bg-white border border-stone-200 rounded-2xl p-8">
                <h2 className="text-2xl font-playfair font-bold text-stone-800 mb-8">Shipping Information</h2>
                
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-playfair font-semibold text-stone-800 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 transition-colors font-cormorant"
                          value={form.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="10-digit mobile number"
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 transition-colors font-cormorant"
                          value={form.phone}
                          onChange={handleChange}
                          maxLength={10}
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 transition-colors font-cormorant"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <h3 className="text-lg font-playfair font-semibold text-stone-800 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Delivery Address
                    </h3>
                    
                    {/* Address Type */}
                    <div className="mb-6">
                      <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-3">
                        Address Type
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="addressType"
                            value="home"
                            checked={form.addressType === "home"}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                            form.addressType === "home" 
                              ? "border-stone-800 bg-stone-50" 
                              : "border-stone-300 hover:border-stone-400"
                          }`}>
                            <Home className="h-4 w-4" />
                            <span className="font-cormorant">Home</span>
                          </div>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="addressType"
                            value="office"
                            checked={form.addressType === "office"}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                            form.addressType === "office" 
                              ? "border-stone-800 bg-stone-50" 
                              : "border-stone-300 hover:border-stone-400"
                          }`}>
                            <Building className="h-4 w-4" />
                            <span className="font-cormorant">Office</span>
                          </div>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="addressType"
                            value="other"
                            checked={form.addressType === "other"}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                            form.addressType === "other" 
                              ? "border-stone-800 bg-stone-50" 
                              : "border-stone-300 hover:border-stone-400"
                          }`}>
                            <MapPin className="h-4 w-4" />
                            <span className="font-cormorant">Other</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Street Address */}
                    <div className="grid gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="streetAddress"
                          placeholder="House no., Building name, Street name"
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 transition-colors font-cormorant"
                          value={form.streetAddress}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-2">
                          Apartment, suite, etc. (Optional)
                        </label>
                        <input
                          type="text"
                          name="apartment"
                          placeholder="Apartment, suite, unit, building, floor, etc."
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 transition-colors font-cormorant"
                          value={form.apartment}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* City, State, Pincode */}
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          placeholder="Enter city"
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 transition-colors font-cormorant"
                          value={form.city}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-2">
                          State *
                        </label>
                        <select
                          name="state"
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 transition-colors font-cormorant"
                          value={form.state}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select State</option>
                          {indianStates.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          placeholder="6-digit pincode"
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 transition-colors font-cormorant"
                          value={form.pincode}
                          onChange={handleChange}
                          maxLength={6}
                          pattern="[1-9][0-9]{5}"
                          required
                        />
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-cormorant font-semibold text-stone-700 mb-2">
                        Country *
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                        <select
                          name="country"
                          className="w-full pl-12 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 transition-colors font-cormorant"
                          value={form.country}
                          onChange={handleChange}
                          required
                        >
                          <option value="India">India</option>
                          {/* Add more countries if needed */}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-stone-800 text-white py-4 rounded-lg hover:bg-stone-700 transition-colors font-cormorant text-lg"
                  >
                    Review Order
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-stone-50 rounded-2xl p-8 sticky top-24">
                <h3 className="text-2xl font-playfair font-bold text-stone-800 mb-6">Order Summary</h3>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-stone-200 rounded-lg overflow-hidden flex-shrink-0">
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
                      <div className="flex-1">
                        <h4 className="font-playfair font-semibold text-stone-800 text-sm">{item.title}</h4>
                        <p className="text-stone-600 font-cormorant text-sm">
                          Size: {item.size} | Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-playfair font-bold text-stone-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6 pt-6 border-t border-stone-300">
                  <div className="flex justify-between font-cormorant">
                    <span className="text-stone-600">Subtotal</span>
                    <span className="text-stone-800 font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-cormorant">
                    <span className="text-stone-600">Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between font-cormorant">
                    <span className="text-stone-600">Tax</span>
                    <span className="text-stone-800 font-semibold">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-stone-300 pt-3">
                    <div className="flex justify-between text-lg font-playfair font-bold">
                      <span className="text-stone-800">Total</span>
                      <span className="text-stone-800">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Security Info */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-playfair font-semibold text-green-800 text-sm">Secure Checkout</h4>
                      <p className="mt-1 text-green-700 font-cormorant text-sm">
                        Your order is secure and encrypted
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <CreditCard className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-playfair font-semibold text-blue-800 text-sm">Payment Info</h4>
                      <p className="mt-1 text-blue-700 font-cormorant text-sm">
                        We'll contact you for payment arrangements
                      </p>
                    </div>
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
    </div>
  )
}

export default Checkout
