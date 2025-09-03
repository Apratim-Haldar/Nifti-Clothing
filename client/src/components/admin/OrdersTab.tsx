import React, { useState, useEffect } from 'react';
import { fetchAllOrders, updateOrderStatus, addOrderNote } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import ShippingBill from '../ShippingBill';
import './OrdersTab.css';

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
  userId: string;
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

const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [showShippingBill, setShowShippingBill] = useState(false);
  const [selectedOrderForBill, setSelectedOrderForBill] = useState<Order | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: string, paymentStatus?: string) => {
    try {
      setUpdating(orderId);
      await updateOrderStatus(orderId, status, paymentStatus);
      showToast('Order updated successfully', 'success');
      loadOrders();
    } catch (error: any) {
      console.error('Error updating order:', error);
      showToast(error.response?.data?.message || 'Failed to update order', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const handleAddNote = async () => {
    if (!selectedOrder || !orderNotes.trim()) return;

    try {
      await addOrderNote(selectedOrder._id, orderNotes);
      showToast('Order notes updated successfully', 'success');
      setShowModal(false);
      setOrderNotes('');
      setSelectedOrder(null);
      loadOrders();
    } catch (error: any) {
      console.error('Error updating notes:', error);
      showToast(error.response?.data?.message || 'Failed to update notes', 'error');
    }
  };

  const openNotesModal = (order: Order) => {
    setSelectedOrder(order);
    setOrderNotes(order.notes || '');
    setShowModal(true);
  };

  const handleGenerateShippingBill = (order: Order) => {
    setSelectedOrderForBill(order);
    setShowShippingBill(true);
  };

  const closeShippingBill = () => {
    setShowShippingBill(false);
    setSelectedOrderForBill(null);
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
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

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      totalRevenue: orders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.totalAmount, 0)
    };
    return stats;
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="orders-tab">
        <div className="loading-spinner">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="orders-tab">
      <div className="orders-header">
        <h2>Order Management</h2>
        <button className="refresh-btn" onClick={loadOrders}>
          Refresh
        </button>
      </div>

      {/* Order Statistics */}
      <div className="order-stats">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{stats.processing}</h3>
          <p>Processing</p>
        </div>
        <div className="stat-card">
          <h3>{stats.shipped}</h3>
          <p>Shipped</p>
        </div>
        <div className="stat-card">
          <h3>{stats.delivered}</h3>
          <p>Delivered</p>
        </div>
        <div className="stat-card revenue">
          <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
          <p>Total Revenue</p>
        </div>
      </div>

      {/* Filters */}
      <div className="orders-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by order number, customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select 
          value={paymentFilter} 
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Payments</option>
          <option value="pending">Payment Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className="order-number">{order.orderNumber}</td>
                <td className="customer-info">
                  <div>
                    <strong>{order.user.name}</strong>
                    <br />
                    <small>{order.user.email}</small>
                    <br />
                    <small>{order.user.phone}</small>
                  </div>
                </td>
                <td className="items-info">
                  <div className="items-summary">
                    {order.items.length} item(s)
                    <div className="items-detail">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="item-row">
                          {item.title} ({item.size}) x{item.quantity}
                        </div>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="order-total">₹{order.totalAmount.toLocaleString()}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="status-select"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                    disabled={updating === order._id}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => handleStatusUpdate(order._id, order.status, e.target.value)}
                    className="payment-select"
                    style={{ backgroundColor: getPaymentStatusColor(order.paymentStatus) }}
                    disabled={updating === order._id}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>  
                    <option value="refunded">Refunded</option>
                  </select>
                </td>
                <td className="order-date">{formatDate(order.createdAt)}</td>
                <td className="order-actions">
                  <button
                    className="bill-btn"
                    onClick={() => handleGenerateShippingBill(order)}
                    title="Generate Shipping Bill"
                  >
                    📄
                  </button>
                  <button
                    className="notes-btn"
                    onClick={() => openNotesModal(order)}
                    title="Add/Edit Notes"
                  >
                    📝
                  </button>
                  <button
                    className="view-btn"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowModal(true);
                    }}
                    title="View Details"
                  >
                    👁️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="no-orders">
          <p>No orders found matching your criteria.</p>
        </div>
      )}

      {/* Order Details/Notes Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content enhanced-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details - {selectedOrder.orderNumber}</h3>
              <div className="modal-header-actions">
                <button 
                  className="bill-modal-btn"
                  onClick={() => handleGenerateShippingBill(selectedOrder)}
                  title="Generate Shipping Bill"
                >
                  📄 Shipping Bill
                </button>
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="order-detail-section">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {selectedOrder.user.name}</p>
                <p><strong>Email:</strong> {selectedOrder.user.email}</p>
                <p><strong>Phone:</strong> {selectedOrder.user.phone}</p>
                <p><strong>Address:</strong> {selectedOrder.user.address}</p>
              </div>

              <div className="order-detail-section">
                <h4>Order Items</h4>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="modal-item">
                    <img src={item.imageUrl || '/shirt.jpg'} alt={item.title} />
                    <div>
                      <strong>{item.title}</strong>
                      <p>Size: {item.size} | Qty: {item.quantity} | ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-detail-section">
                <h4>Order Notes</h4>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Add notes about this order..."
                  rows={4}
                  className="notes-textarea"
                />
                <button className="save-notes-btn" onClick={handleAddNote}>
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Bill Modal */}
      {showShippingBill && selectedOrderForBill && (
        <ShippingBill 
          order={selectedOrderForBill} 
          onClose={closeShippingBill}
        />
      )}
    </div>
  );
};

export default OrdersTab;