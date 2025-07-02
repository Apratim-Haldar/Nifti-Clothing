// client/src/services/api.ts
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const fetchProducts = async () => {
  const res = await API.get('/products');
  return res.data;
};

export const fetchProductById = async (id: string) => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

// Cart API functions
export const fetchCart = async () => {
  const res = await API.get('/cart');
  return res.data;
};

export const addToCartAPI = async (item: any) => {
  const res = await API.post('/cart/add', item);
  return res.data;
};

export const updateCartItemAPI = async (productId: string, size: string, quantity: number) => {
  const res = await API.put('/cart/update', { productId, size, quantity });
  return res.data;
};

export const removeFromCartAPI = async (productId: string, size: string) => {
  const res = await API.delete('/cart/remove', { data: { productId, size } });
  return res.data;
};

export const clearCartAPI = async () => {
  const res = await API.delete('/cart/clear');
  return res.data;
};

// Order API functions
export const createOrder = async (orderData: any) => {
  const res = await API.post('/orders', orderData);
  return res.data;
};

export const fetchMyOrders = async () => {
  const res = await API.get('/orders/my-orders');
  return res.data;
};

export const cancelOrder = async (orderId: string) => {
  const res = await API.patch(`/orders/${orderId}/cancel`);
  return res.data;
};

// Admin Order API functions
export const fetchAllOrders = async () => {
  const res = await API.get('/orders/admin/all');
  return res.data;
};

export const updateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
  const res = await API.patch(`/orders/${orderId}/status`, { status, paymentStatus });
  return res.data;
};

export const addOrderNote = async (orderId: string, notes: string) => {
  const res = await API.patch(`/orders/${orderId}/notes`, { notes });
  return res.data;
};

export default API;
