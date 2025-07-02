import React, { useState, useEffect } from 'react';
import { fetchMyOrders, cancelOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './MyOrders.css';

interface OrderItem {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  size: string;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancelling(orderId);
      await cancelOrder(orderId);
      showToast('Order cancelled successfully', 'success');
      loadOrders(); // Refresh orders
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      showToast(error.response?.data?.message || 'Failed to cancel order', 'error');
    } finally {
      setCancelling(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      processing: '#8b5cf6',
      shipped: '#06b6d4',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: '#f59e0b',
      paid: '#10b981',
      failed: '#ef4444',
      refunded: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const canCancelOrder = (order: Order) => {
    return !['shipped', 'delivered', 'cancelled'].includes(order.status);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="container">
          <div className="loading-spinner">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <div className="orders-filters">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
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
          <div className="no-orders">
            <h3>No orders found</h3>
            <p>You haven't placed any orders yet.</p>
            <a href="/products" className="shop-now-btn">Start Shopping</a>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.orderNumber}</h3>
                    <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span 
                      className="payment-badge"
                      style={{ backgroundColor: getPaymentStatusColor(order.paymentStatus) }}
                    >
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img 
                        src={item.imageUrl || '/shirt.jpg'} 
                        alt={item.title}
                        className="item-image"
                      />
                      <div className="item-details">
                        <h4>{item.title}</h4>
                        <p>Size: {item.size}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p className="item-price">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <div className="shipping-info">
                    <h4>Shipping Address</h4>
                    <p>{order.user.name}</p>
                    <p>{order.user.address}</p>
                    <p>{order.user.phone}</p>
                  </div>
                  <div className="order-total">
                    <h4>Total: ₹{order.totalAmount.toLocaleString()}</h4>
                    <p>Payment: {order.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                  </div>
                </div>

                {order.notes && (
                  <div className="order-notes">
                    <h4>Order Notes</h4>
                    <p>{order.notes}</p>
                  </div>
                )}

                <div className="order-actions">
                  {canCancelOrder(order) && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancelling === order._id}
                    >
                      {cancelling === order._id ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                  <button className="track-btn">Track Order</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;