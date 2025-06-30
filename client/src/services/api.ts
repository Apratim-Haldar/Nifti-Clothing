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

export default API;
