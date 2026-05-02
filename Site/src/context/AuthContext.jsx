import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (userId) => {
    try {
      const data = await api.getUser(userId);
      setUser(data);
    } catch {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setToken(null);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUserId = localStorage.getItem('userId');
      if (savedToken && savedUserId) {
        setToken(savedToken);
        await fetchUser(savedUserId);
      }
      setLoading(false);
    };
    init();
  }, [fetchUser]);

  const login = async (username, password) => {
    const data = await api.login(username, password);
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      try {
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        const userId = payload.userId || payload.sub || payload.id;
        if (userId) {
          localStorage.setItem('userId', String(userId));
          await fetchUser(userId);
        }
      } catch {
        // ошибок нет соре
      }
      return data;
    }
    throw new Error('Не удалось получить токен');
  };

  const register = async (username, password, roleId) => {
    return api.register(username, password, roleId);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
