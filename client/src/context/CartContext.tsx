// client/src/context/CartContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { fetchCart, addToCartAPI, updateCartItemAPI, removeFromCartAPI, clearCartAPI } from '../services/api';
import { useToast } from './ToastContext';

interface CartItem {
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  size: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (productId: string, size: string) => Promise<void>;
  increaseQty: (productId: string, size: string) => Promise<void>;
  decreaseQty: (productId: string, size: string) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  // Sync cart with database when user logs in/out
  useEffect(() => {
    if (user) {
      syncCart();
    } else {
      setCart([]); // Clear cart when user logs out
    }
  }, [user]);

  const syncCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetchCart();
      setCart(response.cart || []);
    } catch (error) {
      console.error('Failed to sync cart:', error);
      showToast('Failed to load cart', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: CartItem) => {
    if (!user) {
      showToast('Please login to add items to cart', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await addToCartAPI(item);
      setCart(response.cart);
      showToast('Item added to cart', 'success');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      showToast('Failed to add item to cart', 'error');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string, size: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await removeFromCartAPI(productId, size);
      setCart(response.cart);
      showToast('Item removed from cart', 'success');
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      showToast('Failed to remove item from cart', 'error');
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = async (productId: string, size: string) => {
    if (!user) return;

    const item = cart.find(p => p.productId === productId && p.size === size);
    if (!item) return;

    try {
      setLoading(true);
      const response = await updateCartItemAPI(productId, size, item.quantity + 1);
      setCart(response.cart);
    } catch (error) {
      console.error('Failed to update cart:', error);
      showToast('Failed to update cart', 'error');
    } finally {
      setLoading(false);
    }
  };

  const decreaseQty = async (productId: string, size: string) => {
    if (!user) return;

    const item = cart.find(p => p.productId === productId && p.size === size);
    if (!item) return;

    try {
      setLoading(true);
      const newQuantity = item.quantity - 1;
      const response = await updateCartItemAPI(productId, size, newQuantity);
      setCart(response.cart);
    } catch (error) {
      console.error('Failed to update cart:', error);
      showToast('Failed to update cart', 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await clearCartAPI();
      setCart(response.cart);
      showToast('Cart cleared', 'success');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      showToast('Failed to clear cart', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading, 
      addToCart, 
      removeFromCart, 
      increaseQty, 
      decreaseQty, 
      clearCart, 
      syncCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
