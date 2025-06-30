// client/src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  name: string;
  email: string;
  affiliateCode?: string;
  isAdmin?: boolean; // Add this missing property
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  checkAuth: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, 
      { email, password }, 
      { withCredentials: true }
    );
    setUser(response.data.user);
  };

  const register = async (userData: any) => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, 
      userData, 
      { withCredentials: true }
    );
    setUser(response.data.user);
  };

  const checkAuth = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(data.user);
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {}, {
      withCredentials: true,
    });
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
