import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      const cached = localStorage.getItem('lumen_user');
      if (cached) {
        try { setUser(JSON.parse(cached)); } catch (_) {}
      }
      if (token) {
        try {
          const data = await api.me();
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem('lumen_user', JSON.stringify(data.user));
          }
        } catch (_) {}
      }
      setLoading(false);
    };
    load();
  }, []);

  const signup = async (payload) => {
    const data = await api.signup(payload);
    localStorage.setItem('token', data.token);
    localStorage.setItem('lumen_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const login = async (payload) => {
    const data = await api.login(payload);
    localStorage.setItem('token', data.token);
    localStorage.setItem('lumen_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lumen_user');
    setUser(null);
  };

  const updateUser = (patch) => {
    setUser(prev => {
      const updated = { ...prev, ...patch };
      localStorage.setItem('lumen_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}