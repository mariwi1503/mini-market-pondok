import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  quickLogin: (role: 'customer' | 'admin') => void;
  register: (name: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS = {
  customer: {
    id: 'u1',
    name: 'Ahmad Santri',
    phone: '081234567890',
    email: 'ahmad@pondok.com',
    address: 'Pondok Pesantren Faiz Al Baqarah, Jl. Pesantren No. 1',
  },
  admin: {
    id: 'u2',
    name: 'Admin Toko',
    phone: '081298765432',
    email: 'admin@minimarket.com',
    address: 'Mini Market Faiz Al Baqarah',
  },
};

const REGISTERED_USERS_KEY = 'fm_registered_users';
const CURRENT_USER_KEY = 'fm_current_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveUser = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  };

  const getRegisteredUsers = (): Array<{ name: string; phone: string; password: string }> => {
    try {
      return JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
    } catch {
      return [];
    }
  };

  const login = async (phone: string, password: string): Promise<boolean> => {
    // Check demo users
    if (phone === '081234567890' && password === 'password') {
      saveUser(DEMO_USERS.customer);
      return true;
    }
    if (phone === '081298765432' && password === 'admin123') {
      saveUser(DEMO_USERS.admin);
      return true;
    }
    // Check registered users
    const users = getRegisteredUsers();
    const found = users.find(u => u.phone === phone && u.password === password);
    if (found) {
      saveUser({
        id: 'u_' + Date.now(),
        name: found.name,
        phone: found.phone,
      });
      return true;
    }
    return false;
  };

  const quickLogin = (role: 'customer' | 'admin') => {
    saveUser(DEMO_USERS[role]);
  };

  const register = async (name: string, phone: string, password: string): Promise<boolean> => {
    const users = getRegisteredUsers();
    if (users.find(u => u.phone === phone)) {
      return false; // already exists
    }
    users.push({ name, phone, password });
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    saveUser({
      id: 'u_' + Date.now(),
      name,
      phone,
    });
    return true;
  };

  const logout = () => {
    saveUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      saveUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, quickLogin, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
