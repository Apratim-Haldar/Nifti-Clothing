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

export default API;
