import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('beta_token');
    const username = localStorage.getItem('beta_username');
    const role = localStorage.getItem('beta_role');

    if (token && username && role) {
      setUser({ username, role });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', { username, password });
      const { token, role } = response.data;
      
      localStorage.setItem('beta_token', token);
      localStorage.setItem('beta_username', username);
      localStorage.setItem('beta_role', role);
      
      setUser({ username, role });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid username or password' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('beta_token');
    localStorage.removeItem('beta_username');
    localStorage.removeItem('beta_role');
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const response = await api.post('/api/auth/refresh-token');
      const { token, role, username } = response.data;
      localStorage.setItem('beta_token', token);
      setUser({ username, role });
    } catch (error) {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};
