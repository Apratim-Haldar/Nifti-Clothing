// client/src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  affiliateCode?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  setUser: (user: User) => void;
  register: (userData: any) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  setUser: () => {},
  register: async () => {},
  checkAuth: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, 
      { email, password }, 
      { withCredentials: true }
    );
    setUser(response.data.user);
    // Cart will be synced automatically via useEffect in CartContext
  };

  const register = async (userData: any) => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, 
      userData, 
      { withCredentials: true }
    );
    setUser(response.data.user);
    // Cart will be synced automatically via useEffect in CartContext
  };

  const checkAuth = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {}, {
      withCredentials: true,
    });
    setUser(null);
    // Cart will be cleared automatically via useEffect in CartContext
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, setUser, register, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
