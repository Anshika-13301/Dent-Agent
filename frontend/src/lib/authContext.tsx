'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'clinic_admin' | 'hygiene_coordinator' | 'staff';
  practice?: {
    id: string;
    name: string;
    slug: string;
    phone: string;
    chairs?: Array<{ chairId: string; name: string; hygienistName: string; color: string }>;
    subscription?: {
      status: string;
      baseFee: number;
      chairCommission: number;
    };
  } | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  quickSwitchRole: (role: 'clinic_admin' | 'staff' | 'superadmin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('dental_saas_token');
    const savedUser = localStorage.getItem('dental_saas_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
      // Revalidate in background
      api.auth.me()
        .then((res) => {
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('dental_saas_user', JSON.stringify(res.user));
          }
        })
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem('dental_saas_token');
          localStorage.removeItem('dental_saas_user');
          setUser(null);
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login({ email, password });
    if (res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('dental_saas_token', res.token);
      localStorage.setItem('dental_saas_user', JSON.stringify(res.user));
      return res.user;
    }
    throw new Error('Invalid login response');
  };

  const register = async (payload: any) => {
    const res = await api.auth.register(payload);
    if (res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('dental_saas_token', res.token);
      localStorage.setItem('dental_saas_user', JSON.stringify(res.user));
    }
  };

  const logout = () => {
    localStorage.removeItem('dental_saas_token');
    localStorage.removeItem('dental_saas_user');
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  const quickSwitchRole = async (role: 'clinic_admin' | 'staff' | 'superadmin') => {
    let email = 'dr.apex@dentalarts.com';
    if (role === 'staff') email = 'coordinator@dentalarts.com';
    if (role === 'superadmin') email = 'superadmin@antigravitysaas.com';

    const loggedInUser = await login(email, 'password123');

    // Route according to role
    if (loggedInUser.role === 'superadmin') {
      router.push('/dashboard/admin');
    } else if (loggedInUser.role === 'staff' || loggedInUser.role === 'hygiene_coordinator') {
      router.push('/dashboard/inbox');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, quickSwitchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
