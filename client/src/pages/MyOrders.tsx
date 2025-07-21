import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Calendar, CreditCard, Truck, CheckCircle, XCircle, Clock, Filter } from 'lucide-react'
import { fetchMyOrders, cancelOrder } from '../services/api'
import { useToast } from '../context/ToastContext'
import { useModal } from '../context/ModalContext'
import './MyOrders.css'

interface OrderItem {
  productId: string
  title: string
  imageUrl: string
  price: number
  size: string
  quantity: number
}

interface Order {
  _id: string
  orderNumber: string
  user: {
    name: string
    email: string
    phone: string
    address: string
  }
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: string
  notes?: string
  createdAt: string
  updatedAt: string
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const { showToast } = useToast()
  const { showConfirm } = useModal()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await fetchMyOrders()
      setOrders(data)
    } catch (error) {
      console.error('Error loading orders:', error)
      showToast('Failed to load orders', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    const confirmed = await showConfirm(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      'Cancel Order',
      'Keep Order'
    )
    
    if (!confirmed) return

    try {
      setCancelling(orderId)
      await cancelOrder(orderId)
      showToast('Order cancelled successfully', 'success')
      loadOrders()
    } catch (error: any) {
      console.error('Error cancelling order:', error)
      showToast(error.response?.data?.message || 'Failed to cancel order', 'error')
    } finally {
      setCancelling(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-blue-600" />
      case 'processing': return <Package className="h-5 w-5 text-purple-600" />
      case 'shipped': return <Truck className="h-5 w-5 text-indigo-600" />
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-600" />
      default: return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-indigo-100 text-indigo-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const canCancelOrder = (order: Order) => {
    return !['shipped', 'delivered', 'cancelled'].includes(order.status)
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-stone-300 border-t-stone-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600 font-cormorant text-lg">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-2 h-2 bg-stone-800 rounded-full"></div>
              <span className="text-sm font-cormorant font-medium text-stone-600 tracking-wider uppercase">
                Order History
              </span>
              <div className="w-2 h-2 bg-stone-800 rounded-full"></div>
            </div>
            <h1 className="text-4xl font-playfair font-bold text-stone-800">
              My <span className="text-stone-600">Orders</span>
            </h1>
            <p className="text-stone-600 font-cormorant text-lg mt-2">
              Track and manage your orders
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-stone-600" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500 font-cormorant bg-white"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-stone-50 rounded-2xl p-16 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-stone-400" />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-stone-800 mb-4">
                {filter === 'all' ? 'No orders yet' : `No ₹{filter} orders`}
              </h3>
              <p className="text-stone-600 font-cormorant text-lg mb-8">
                {filter === 'all' 
                  ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                  : `You don't have any ₹{filter} orders at the moment.`
                }
              </p>
              {filter === 'all' && (
                <Link
                  to="/products"
                  className="inline-block bg-stone-800 text-white px-8 py-3 rounded-lg hover:bg-stone-700 transition-colors font-cormorant"
                >
                  Start Shopping
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                {/* Order Header */}
                <div className="bg-stone-50 px-8 py-6 border-b border-stone-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center space-x-6 mb-4 md:mb-0">
                      <div>
                        <h3 className="text-xl font-playfair font-bold text-stone-800">
                          Order #{order.orderNumber}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-4 w-4 text-stone-500" />
                          <span className="text-stone-600 font-cormorant">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="font-cormorant font-semibold capitalize">
                            {order.status}
                          </span>
                        </div>
                        
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                          <CreditCard className="h-4 w-4" />
                          <span className="font-cormorant font-semibold capitalize">
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-stone-800">
                        ₹{order.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-stone-600 font-cormorant">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-8">
                  <div className="grid gap-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={item.imageUrl || '/placeholder.jpg'} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = '/placeholder.jpg'
                            }}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-playfair font-semibold text-stone-800 mb-1">
                            {item.title}
                          </h4>
                          <div className="flex items-center space-x-4 text-stone-600 font-cormorant">
                            <span>Size: {item.size}</span>
                            <span>Qty: {item.quantity}</span>
                            <span className="font-semibold">₹{item.price.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-stone-800">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mt-8 pt-6 border-t border-stone-200">
                    <div className="text-stone-600 font-cormorant mb-4 md:mb-0">
                      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                      <p><strong>Delivery Address:</strong> {order.user.address}</p>
                      {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                    </div>
                    
                    <div className="flex space-x-4">
                      
                      
                      {canCancelOrder(order) && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancelling === order._id}
                          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-cormorant"
                        >
                          {cancelling === order._id ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Summary */}
        {filteredOrders.length > 0 && (
          <div className="mt-12 bg-stone-50 rounded-2xl p-8">
            <h3 className="text-xl font-playfair font-bold text-stone-800 mb-6">Order Summary</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-stone-800">
                  {filteredOrders.length}
                </p>
                <p className="text-stone-600 font-cormorant">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  ₹{filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                </p>
                <p className="text-stone-600 font-cormorant">Total Spent</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {filteredOrders.filter(order => order.status === 'delivered').length}
                </p>
                <p className="text-stone-600 font-cormorant">Delivered</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders