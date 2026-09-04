import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('chatflow_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await authService.getMe();
        setUser(data.user);
      } catch (err) {
        localStorage.removeItem('chatflow_token');
        localStorage.removeItem('chatflow_user');
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (identifier, password) => {
    const data = await authService.login({ identifier, password });
    localStorage.setItem('chatflow_token', data.token);
    localStorage.setItem('chatflow_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    localStorage.setItem('chatflow_token', data.token);
    localStorage.setItem('chatflow_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      // ignore network errors on logout
    }
    localStorage.removeItem('chatflow_token');
    localStorage.removeItem('chatflow_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem('chatflow_user', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
